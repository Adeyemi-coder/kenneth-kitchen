import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';
import { styles } from './CheckoutModal.styles';
import BankTransferPolling from './BankTransferPolling';
import AddressLandmarkModal from './AddressLandmarkModal';
import OrderSummary from './OrderSummary';
import CardPayment from './CardPayment';

const DEV = Boolean(import.meta.env.DEV);
const nairaFormatter = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });
const PAY_ON_DELIVERY_LIMIT = 15000;
const SERVICE_FEE = 300;
const DEFAULT_DELIVERY_FEE = 700;
const TRANSFER_WINDOW_MS = 29 * 60 * 1000 + 40 * 1000;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const PAYMENT_METHODS = [
  { id: 'transfer', title: 'Bank transfer', desc: 'Pay from your bank app. We create an account number for this order.' },
  { id: 'card', title: 'Card', desc: 'Debit or credit card (Mastercard, Visa, Verve).' },
  { id: 'ussd', title: 'USSD', desc: 'Pay with a code. No internet data required.' },
  { id: 'pod', title: 'Pay on delivery', desc: `Cash or transfer to the rider. Up to ₦${nairaFormatter.format(PAY_ON_DELIVERY_LIMIT)}.` },
];

const MOBILE_FIT_CSS = `@media (max-width: 639px) {
  [data-checkout-overlay] { height: 100dvh !important; max-height: 100dvh !important; }
  [data-checkout-panel] { max-height: 85dvh !important; display: flex !important; flex-direction: column !important; }
}`;

const makeKey = () => `order-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export default function CheckoutModal({
  isOpen,
  onClose,
  deliveryArea = '',
  etaRange,
  onOrderSuccess,
  address: addressProp,
  onAddressChange,
  transferAccount,
  verifyPayment,
  requestTransferAccount,
  processCard,
  submitOrder,
  enableUssd = false,
}) {
  const { cartItems, subtotal, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = useState('pod');

  const [isPollingTransfer, setIsPollingTransfer] = useState(false);
  const [isProcessingCard, setIsProcessingCard] = useState(false);
  const [cardBusy, setCardBusy] = useState(false);
  const [busy, setBusy] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [localAddress, setLocalAddress] = useState(null);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [transferSession, setTransferSession] = useState(null);
  const [leaveOpen, setLeaveOpen] = useState(false);

  const panelRef = useRef(null);
  const titleRef = useRef(null);
  const leaveRef = useRef(null);
  const restoreFocusRef = useRef(null);
  const uiRef = useRef({});
  const downOnOverlayRef = useRef(false);
  const sessionRef = useRef(0);
  const completingRef = useRef(false);
  const renewingRef = useRef(false);
  const retryRef = useRef(null);
  const keyRef = useRef({ sig: '', key: '' });

  const address = addressProp ?? localAddress;
  const saveAddress = (a) => {
    setLocalAddress(a);
    onAddressChange?.(a);
  };

  const resetCheckoutState = useCallback(() => {
    sessionRef.current += 1;
    completingRef.current = false;
    renewingRef.current = false;
    retryRef.current = null;
    setIsPollingTransfer(false);
    setIsProcessingCard(false);
    setCardBusy(false);
    setBusy(null);
    setSubmitError('');
    setTransferSession(null);
    setLeaveOpen(false);
    setIsAddressOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) resetCheckoutState();
  }, [isOpen, resetCheckoutState]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      htmlOverflow: html.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    html.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    restoreFocusRef.current = document.activeElement;
    return () => {
      restoreFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) titleRef.current?.focus({ preventScroll: true });
  }, [isOpen, isPollingTransfer, isProcessingCard]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (e) => {
      const ui = uiRef.current;
      if (ui.isAddressOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (ui.leaveOpen) ui.dismissLeave();
        else ui.requestClose();
        return;
      }

      if (e.key !== 'Tab') return;
      const root = ui.leaveOpen ? leaveRef.current : panelRef.current;
      if (!root) return;
      const nodes = [...root.querySelectorAll(FOCUSABLE)];
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const index = nodes.indexOf(document.activeElement);
      if (index === -1) {
        e.preventDefault();
        (e.shiftKey ? nodes[nodes.length - 1] : nodes[0]).focus();
      } else if (e.shiftKey && index === 0) {
        e.preventDefault();
        nodes[nodes.length - 1].focus();
      } else if (!e.shiftKey && index === nodes.length - 1) {
        e.preventDefault();
        nodes[0].focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const orderEta = etaRange ?? cartItems[0]?.etaRange ?? null;
  const kitchenCount = new Set(cartItems.map((i) => i.vendorId ?? i.vendorName ?? '__unknown__')).size;
  const mixedKitchens = kitchenCount > 1;

  const vendorDeliveryFee = cartItems[0]?.deliveryFee;
  const deliveryFee = subtotal > 0 ? (Number.isFinite(vendorDeliveryFee) ? vendorDeliveryFee : DEFAULT_DELIVERY_FEE) : 0;
  const serviceFee = subtotal > 0 ? SERVICE_FEE : 0;
  const grandTotal = subtotal + deliveryFee + serviceFee;
  const isPodDisabled = grandTotal > PAY_ON_DELIVERY_LIMIT;

  const unavailableReason = (m) => {
    if (m.id === 'pod') {
      return isPodDisabled ? `Not available for orders above ₦${nairaFormatter.format(PAY_ON_DELIVERY_LIMIT)}` : null;
    }
    // Allow the demo to run on production
    return null;
  };

  const availableMethods = PAYMENT_METHODS.filter((m) => !unavailableReason(m));
  const effectiveMethod = availableMethods.some((m) => m.id === selectedMethod)
    ? selectedMethod
    : availableMethods[0]?.id ?? null;

  if (!isOpen) return null;

  const cartSignature = `${cartItems.map((i) => `${i.id ?? i.dishId ?? i.name}:${i.quantity}`).join('|')}|${grandTotal}`;
  const getIdempotencyKey = () => {
    if (keyRef.current.sig !== cartSignature) keyRef.current = { sig: cartSignature, key: makeKey() };
    return keyRef.current.key;
  };

  const showError = (message, retry = null) => {
    retryRef.current = retry;
    setSubmitError(message);
  };

  const getButtonText = () => {
    if (busy) return busy;
    if (mixedKitchens) return 'One kitchen per order';
    if (!effectiveMethod) return 'No payment method available';
    if (!address) return 'Add address to continue';
    switch (effectiveMethod) {
      case 'transfer': return `Pay ₦${nairaFormatter.format(grandTotal)} by transfer`;
      case 'card': return `Pay ₦${nairaFormatter.format(grandTotal)} by card`;
      case 'ussd': return `Pay ₦${nairaFormatter.format(grandTotal)} with USSD`;
      case 'pod': return 'Place order, pay on delivery';
      default: return `Pay ₦${nairaFormatter.format(grandTotal)}`;
    }
  };

  const buildOrder = (status) => {
    const vendorNames = [...new Set(cartItems.map((i) => i.vendorName).filter(Boolean))];
    const vendorName = vendorNames.length === 0 ? '' : vendorNames.length === 1 ? vendorNames[0] : `${vendorNames[0]} + ${vendorNames.length - 1} more`;
    const dishesSummary = cartItems.map((i) => `${i.quantity}× ${i.name}`).join(', ');
    const now = Date.now();
    const key = getIdempotencyKey();

    return {
      orderId: `#${key.slice(-6).toUpperCase()}`,
      idempotencyKey: key,
      items: cartItems,
      total: grandTotal,
      totalNaira: grandTotal,
      deliveryArea,
      address,
      customerPhone: address?.phone ?? null,
      etaRange: orderEta,
      paymentMethod: effectiveMethod,
      timestamp: now,
      placedAt: now,
      vendorId: cartItems[0]?.vendorId,
      vendorName,
      dishesSummary,
      thumbnail: cartItems[0]?.imageUrl ?? '',
      status,
    };
  };

  const handleCompleteOrder = async (status = 'Preparing', { paid = false } = {}) => {
    if (completingRef.current) return;
    completingRef.current = true;
    setSubmitError('');

    const orderData = buildOrder(status);
    try {
      let finalOrder = orderData;
      if (submitOrder) {
        setBusy('Placing your order...');
        const saved = await submitOrder(orderData);
        finalOrder = { ...orderData, ...(saved && typeof saved === 'object' ? saved : {}) };
      }

      keyRef.current = { sig: '', key: '' };
      clearCart();
      resetCheckoutState();
      onClose?.();
      onOrderSuccess?.(finalOrder);
    } catch {
      completingRef.current = false;
      setBusy(null);
      showError(
        paid
          ? 'We received your payment but could not save your order. Do not pay again. Tap Try again.'
          : 'We could not place your order. Please try again.',
        () => handleCompleteOrder(status, { paid }),
      );
    }
  };

  const closeNow = () => {
    resetCheckoutState();
    onClose?.();
  };

  const requestClose = () => {
    if (cardBusy || busy || completingRef.current) return;
    if (isPollingTransfer || isProcessingCard) {
      setLeaveOpen(true);
      return;
    }
    closeNow();
  };

  const dismissLeave = () => setLeaveOpen(false);

  const keepAsAwaiting = () => {
    setLeaveOpen(false);
    handleCompleteOrder('Awaiting payment');
  };

  const startTransferSession = async (renew) => {
    const sid = sessionRef.current;
    const s = await requestTransferAccount({ amount: grandTotal, idempotencyKey: getIdempotencyKey(), ...(renew ? { renew: true } : {}) });
    if (sid !== sessionRef.current) return false;
    setTransferSession({
      account: s?.account,
      expiresAt: s?.expiresAt ?? Date.now() + TRANSFER_WINDOW_MS,
      serverNow: s?.serverNow,
    });
    return true;
  };

  const proceedToPayment = async () => {
    const sid = sessionRef.current;
    setSubmitError('');
    retryRef.current = null;

    if (effectiveMethod === 'transfer') {
      if (transferSession && transferSession.expiresAt > Date.now()) {
        setIsPollingTransfer(true);
        return;
      }

      if (requestTransferAccount) {
        setBusy('Creating your account number...');
        try {
          if (await startTransferSession(false)) setIsPollingTransfer(true);
        } catch {
          if (sid === sessionRef.current) {
            showError('We could not create a transfer account. Please try again or pay another way.');
          }
        } finally {
          if (sid === sessionRef.current) setBusy(null);
        }
        return;
      }

      setTransferSession({ account: transferAccount, expiresAt: Date.now() + TRANSFER_WINDOW_MS });
      setIsPollingTransfer(true);
      return;
    }

    if (effectiveMethod === 'card') {
      setIsProcessingCard(true);
      return;
    }

    if (effectiveMethod === 'pod') {
      await handleCompleteOrder('Preparing');
      return;
    }

    if (effectiveMethod === 'ussd') {
      await handleCompleteOrder('Awaiting payment');
    }
  };

  const handlePrimaryAction = () => {
    if (busy || mixedKitchens || !effectiveMethod) return;

    if (!address) {
      setIsAddressOpen(true);
      return;
    }

    proceedToPayment();
  };

  const canRefreshAccount = Boolean(requestTransferAccount) || DEV;
  const handleNewAccount = async () => {
    if (renewingRef.current) return;
    renewingRef.current = true;
    const sid = sessionRef.current;
    try {
      if (requestTransferAccount) {
        await startTransferSession(true);
      } else if (DEV) {
        setTransferSession((cur) => ({ account: cur?.account ?? transferAccount, expiresAt: Date.now() + TRANSFER_WINDOW_MS }));
      }
    } catch {
      if (sid === sessionRef.current) showError('We could not create a new account number. Please try again.');
    } finally {
      renewingRef.current = false;
    }
  };

  uiRef.current = { isAddressOpen, leaveOpen, requestClose, dismissLeave };

  const onScreenWithEntry = isPollingTransfer || isProcessingCard;
  const closeLocked = Boolean(cardBusy || busy);
  const riderPhone = address?.phoneDisplay ?? address?.phone;

  return createPortal(
    <>
      <style>{MOBILE_FIT_CSS}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        data-checkout-overlay=""
        className={styles.overlay}
        onPointerDown={(e) => {
          downOnOverlayRef.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (downOnOverlayRef.current && e.target === e.currentTarget && !onScreenWithEntry) requestClose();
          downOnOverlayRef.current = false;
        }}
      >
        <div ref={panelRef} data-checkout-panel="" className={styles.panel} style={{ boxSizing: 'border-box' }}>
          <header className={styles.header}>
            <h2 id="checkout-title" ref={titleRef} tabIndex={-1} className={styles.headerTitle} style={{ outline: 'none' }}>
              {isPollingTransfer ? 'Transfer payment' : isProcessingCard ? 'Card payment' : 'Review and pay'}
            </h2>
            <button
              type="button"
              onClick={requestClose}
              disabled={closeLocked}
              aria-label="Close checkout"
              className={`${styles.closeButton} disabled:opacity-50`}
            >
              ✕
            </button>
          </header>

          {submitError && (
            <div role="alert" className="flex items-start justify-between gap-3 bg-status-error/10 px-4 py-3 text-[14px] font-medium text-status-error">
              <span>{submitError}</span>
              {retryRef.current && (
                <button type="button" onClick={() => retryRef.current?.()} className="shrink-0 font-bold underline underline-offset-2">
                  Try again
                </button>
              )}
            </div>
          )}

          <div className={styles.body} style={{ flex: '1 1 0%', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
            {isProcessingCard ? (
              <CardPayment
                orderAmount={grandTotal}
                processCard={processCard ? (card) => processCard(card, { amount: grandTotal, idempotencyKey: getIdempotencyKey() }) : undefined}
                onBusyChange={setCardBusy}
                onPaymentSuccess={() => handleCompleteOrder('Preparing', { paid: true })}
                onPayAnotherWay={() => setIsProcessingCard(false)}
              />
            ) : isPollingTransfer ? (
              <BankTransferPolling
                key={transferSession?.expiresAt}
                orderAmount={grandTotal}
                expiresAt={transferSession?.expiresAt}
                serverNow={transferSession?.serverNow}
                account={transferSession?.account ?? transferAccount}
                verifyPayment={verifyPayment ? () => verifyPayment(transferSession) : undefined}
                onPaymentSuccess={() => handleCompleteOrder('Preparing', { paid: true })}
                onPayAnotherWay={() => setIsPollingTransfer(false)}
                onGoToOrders={() => handleCompleteOrder('Awaiting payment')}
                onNewAccount={canRefreshAccount ? handleNewAccount : undefined}
              />
            ) : (
              <>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Order summary</h3>
                  </div>
                  <OrderSummary
                    cartItems={cartItems}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    serviceFee={serviceFee}
                  />
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Delivery location</h3>
                  </div>
                  <div className={styles.deliveryCard}>
                    <div className="flex flex-col gap-1">
                      {address ? (
                        <>
                          <span className="font-heading font-bold text-text-primary">{address.street}</span>
                          <span className="text-[15px] text-text-primary">{address.landmark}</span>
                          {address.gateInstructions && (
                            <span className="text-[13px] text-text-secondary">{address.gateInstructions}</span>
                          )}
                          {riderPhone && (
                            <span className="text-[13px] tabular-nums text-text-secondary">Rider calls {riderPhone}</span>
                          )}

                          <button
                            type="button"
                            onClick={() => setIsAddressOpen(true)}
                            className="mt-2 flex h-12 w-full sm:w-auto sm:self-start items-center justify-center gap-2 rounded-lg border border-border-visible bg-white px-4 text-[15px] font-semibold text-text-primary active:scale-[0.98] transition-transform"
                          >
                            Change address
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-heading font-bold text-text-primary">{deliveryArea || 'No delivery address yet'}</span>
                          <span className="text-[13px] text-text-secondary">Add a landmark and phone number so the rider can find you.</span>

                          <button
                            type="button"
                            onClick={() => setIsAddressOpen(true)}
                            className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-secondary-olive/10 text-[15px] font-bold text-secondary-olive active:scale-[0.98] transition-transform"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add landmark and phone
                          </button>
                        </>
                      )}
                      {orderEta && <span className="mt-1 text-[13px] text-text-secondary">Estimated delivery: {orderEta}</span>}
                    </div>
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Payment method</h3>
                  </div>

                  <div className="flex flex-col gap-2.5" role="radiogroup" aria-label="Payment method">
                    {PAYMENT_METHODS.map((method) => {
                      const reason = unavailableReason(method);
                      const isDisabled = Boolean(reason);
                      const isSelected = effectiveMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`${styles.methodRow} ${isSelected ? styles.methodRowSelected : ''} ${
                            isDisabled ? styles.methodRowDisabled : ''
                          } focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-base`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => setSelectedMethod(method.id)}
                            className="sr-only"
                          />
                          <div className={styles.methodLeft}>
                            <div className={`${styles.radioOuter} ${isSelected ? 'border-secondary-olive bg-secondary-olive' : 'border-ui-control'}`}>
                              {isSelected && <div className={styles.radioInner} />}
                            </div>
                            <div>
                              <span className={styles.methodTitle}>{method.title}</span>
                              <p className={styles.methodDesc}>{reason ?? method.desc}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </div>

          {!onScreenWithEntry && (
            <footer
              className={styles.footer}
              style={{ flexShrink: 0, paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              <div className="flex w-full flex-col gap-2">
                {mixedKitchens && (
                  <p role="alert" className="m-0 text-[14px] font-medium text-status-error">
                    Your cart has food from {kitchenCount} kitchens. Checkout works with one kitchen at a time. Remove items from the others to continue.
                  </p>
                )}
                <button
                  type="button"
                  disabled={Boolean(busy) || grandTotal <= 0 || mixedKitchens || !effectiveMethod}
                  onClick={handlePrimaryAction}
                  className={`${styles.submitButton} bg-primary-base enabled:hover:bg-primary-pressed disabled:opacity-50`}
                >
                  {getButtonText()}
                </button>
              </div>
            </footer>
          )}
        </div>
      </div>

      {leaveOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <div
            ref={leaveRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="leave-title"
            aria-describedby="leave-desc"
            className="flex w-full max-w-sm flex-col gap-3 rounded-2xl bg-white p-5 shadow-xl"
          >
            <h3 id="leave-title" className="m-0 font-heading text-lg font-extrabold text-text-primary">Leave this payment?</h3>
            <p id="leave-desc" className="m-0 text-[15px] text-text-secondary">
              {isPollingTransfer
                ? 'If you already sent the money, keep your order so we can match your payment. Otherwise cancel and leave.'
                : 'Your card has not been charged. You can come back and pay at any time.'}
            </p>
            {isPollingTransfer && (
              <button
                type="button"
                onClick={keepAsAwaiting}
                className="h-12 w-full rounded-lg bg-secondary-olive font-heading text-[15px] font-bold text-white active:scale-[0.98]"
              >
                Keep my order, awaiting payment
              </button>
            )}
            <button
              type="button"
              onClick={closeNow}
              className="h-12 w-full rounded-lg border border-border-visible bg-white font-heading text-[15px] font-bold text-text-primary active:scale-[0.98]"
            >
              {isPollingTransfer ? 'Cancel and leave' : 'Leave'}
            </button>
            <button
              type="button"
              autoFocus
              onClick={dismissLeave}
              className="h-12 w-full text-center text-[15px] font-medium text-text-secondary underline underline-offset-2"
            >
              Stay here
            </button>
          </div>
        </div>
      )}

      <AddressLandmarkModal
        isOpen={isAddressOpen}
        onClose={() => setIsAddressOpen(false)}
        onSaveAddress={(newAddress) => {
          saveAddress(newAddress);
          setIsAddressOpen(false);
        }}
        initialAddress={address}
        defaultStreet={deliveryArea}
      />
    </>,
    document.body,
  );
}
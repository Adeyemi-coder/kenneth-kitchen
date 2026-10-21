import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '../../context/CartContext';

const nairaFormatter = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });
const MINIMUM_ORDER_VAL = 3000;

export default function CartDrawer({ isOpen, onClose, onProceedToCheckout }) {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [riderNote, setRiderNote] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [isOpen]);

  const subtotal = useMemo(() => {
    return (cartItems || []).reduce((acc, item) => {
      const price = Number(item?.unitPrice ?? item?.price ?? 0);
      const qty = Number(item?.quantity ?? 1);
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  // Match CheckoutModal: read the vendor's fee, fall back to 700 only if unknown.
  const vendorDeliveryFee = cartItems[0]?.deliveryFee;
  const deliveryFee =
    subtotal > 0
      ? Number.isFinite(vendorDeliveryFee)
        ? vendorDeliveryFee
        : 700
      : 0;
  const serviceFee = subtotal > 0 ? 300 : 0;
  const grandTotal = subtotal + deliveryFee + serviceFee;
  const isUnderMinimum = subtotal > 0 && subtotal < MINIMUM_ORDER_VAL;
  const missingAmount = Math.max(0, MINIMUM_ORDER_VAL - subtotal);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9995] flex items-end justify-center bg-[#111618]/60 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="fixed inset-x-0 bottom-0 top-[6%] md:top-auto md:static flex w-full max-w-full flex-col overflow-hidden rounded-t-2xl border-t border-border-visible bg-white md:max-h-[90vh] md:max-w-[540px] md:rounded-2xl md:border box-border m-0"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex-none h-14 bg-white border-b border-border-visible px-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base text-text-primary m-0">
              Your Cart
            </h2>
            {cartItems?.length > 0 && (
              <span className="font-body text-xs text-text-secondary">
                ({cartItems.length} items)
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="w-10 h-10 flex items-center justify-center text-text-primary border border-border-visible rounded-full bg-white cursor-pointer shrink-0"
          >
            ✕
          </button>
        </header>

        {(!cartItems || cartItems.length === 0) ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-2">
            <div className="w-16 h-16 rounded-full bg-bg-canvas flex items-center justify-center text-2xl mb-2">
              🛒
            </div>
            <p className="font-heading font-bold text-base text-text-primary m-0">
              Your cart is empty
            </p>
            <p className="font-body text-xs text-text-secondary m-0 max-w-xs">
              Explore your favorite Ilorin kitchens and customize your choices.
            </p>
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 overscroll-contain pb-6">
            <div className="divide-y divide-border-visible">
              {cartItems.map((item, idx) => {
                const itemKey = item.cartItemId || item.id || idx;
                const price = Number(item.unitPrice || item.price || 0);

                const choiceSummary = Object.values(item.selectedModifiers || {})
                  .flat()
                  .map((opt) => opt?.name || opt)
                  .filter(Boolean)
                  .join(' · ');

                return (
                  <article key={itemKey} className="py-3.5 flex flex-col gap-2">
                    <div className="flex justify-between items-start gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt=""
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                          className="h-14 w-14 shrink-0 rounded-lg bg-[#ECEAE6] object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-heading font-bold text-sm text-text-primary m-0">
                          {item.name}
                        </h4>
                        {choiceSummary && (
                          <p className="font-body text-xs text-[#243628] font-medium mt-0.5 m-0 line-clamp-2">
                            {choiceSummary}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="font-body text-[11px] text-text-secondary italic mt-0.5 m-0">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>
                      <span className="font-heading font-bold text-sm text-text-primary tabular-nums shrink-0">
                        ₦{nairaFormatter.format(price * (item.quantity || 1))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => removeItem(itemKey)}
                        className="text-xs font-body text-status-error hover:underline bg-transparent border-none p-0 cursor-pointer"
                      >
                        Remove
                      </button>

                      <div className="flex items-center border border-border-visible rounded-lg h-8 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, Math.max(1, (item.quantity || 1) - 1))}
                          className="w-8 h-full flex items-center justify-center font-bold text-sm bg-transparent border-none cursor-pointer"
                        >
                          –
                        </button>
                        <span className="w-6 text-center font-heading font-bold text-xs tabular-nums">
                          {item.quantity || 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, (item.quantity || 1) + 1)}
                          className="w-8 h-full flex items-center justify-center font-bold text-sm bg-transparent border-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {isUnderMinimum && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-body text-[#B54708]">
                Add ₦{nairaFormatter.format(missingAmount)} more food to reach the ₦3,000 order minimum.
              </div>
            )}

            <div className="flex flex-col gap-1 pt-2 border-t border-border-visible">
              <label className="font-heading font-bold text-xs text-text-primary">
                Rider note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Call my number when you reach the gate..."
                value={riderNote}
                onChange={(e) => setRiderNote(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border-visible font-body text-xs bg-bg-canvas outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5 pt-3 border-t border-border-visible text-xs font-body">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="tabular-nums">₦{nairaFormatter.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery fee</span>
                <span className="tabular-nums">₦{nairaFormatter.format(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Service fee</span>
                <span className="tabular-nums">₦{nairaFormatter.format(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-text-primary font-bold text-sm pt-2 border-t border-border-visible">
                <span>Total</span>
                <span className="tabular-nums">₦{nairaFormatter.format(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {cartItems?.length > 0 && (
          <footer className="shrink-0 bg-white border-t border-border-visible p-4 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-4 z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              disabled={isUnderMinimum}
              onClick={() => {
                onClose();
                onProceedToCheckout?.({ riderNote, grandTotal });
              }}
              className="w-full h-14 rounded-lg bg-[#CF3A0E] hover:bg-[#A82E0B] disabled:bg-gray-400 disabled:cursor-not-allowed text-white border-none font-heading font-bold text-base flex items-center justify-center cursor-pointer transition-colors"
            >
              Continue to checkout · ₦{nairaFormatter.format(grandTotal)}
            </button>
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}
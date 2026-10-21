import React, { useCallback, useEffect, useRef, useState } from 'react';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });
const DEFAULT_WINDOW_MS = 29 * 60 * 1000 + 40 * 1000;
const LATE_PAYMENT_GRACE_MS = 15 * 60 * 1000;

const DEMO_ACCOUNT = {
  bankName: 'Simulation Bank',
  accountNumber: '0000000000',
  accountName: 'Test account. No money moves.',
};

export default function BankTransferPolling({
  orderAmount,
  expiresAt: expiresAtProp,
  serverNow,
  account: accountProp,
  verifyPayment,
  onPaymentSuccess,
  onPayAnotherWay,
  onGoToOrders,
  onNewAccount,
}) {
  const canVerify = Boolean(verifyPayment);
  const demo = !canVerify;
  const account = accountProp ?? DEMO_ACCOUNT;
  const unavailable = !account;

  const [fallbackExpiry] = useState(() => Date.now() + DEFAULT_WINDOW_MS);
  const [clockOffset] = useState(() => (Number.isFinite(serverNow) ? serverNow - Date.now() : 0));
  const expiresAt = expiresAtProp ?? fallbackExpiry;
  const offset = expiresAtProp != null ? clockOffset : 0;

  const [now, setNow] = useState(() => Date.now());
  const [isChecking, setIsChecking] = useState(false);
  const [showTimeoutBanner, setShowTimeoutBanner] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [partial, setPartial] = useState(null);
  const [checkFailed, setCheckFailed] = useState(false);
  const [pendingNote, setPendingNote] = useState(false);
  const [serverExpired, setServerExpired] = useState(false);

  const demoTimer = useRef(null);
  const copyTimer = useRef(null);
  const mountedRef = useRef(true);
  const settledRef = useRef(false);
  const inFlightRef = useRef(null);
  const expiredRef = useRef(false);

  const verifyRef = useRef(verifyPayment);
  const successRef = useRef(onPaymentSuccess);
  useEffect(() => {
    verifyRef.current = verifyPayment;
    successRef.current = onPaymentSuccess;
  });

  const msLeft = expiresAt - (now + offset);
  const secondsRemaining = Math.max(0, Math.ceil(msLeft / 1000));
  const isExpired = secondsRemaining <= 0 || serverExpired;
  const polling = canVerify && !unavailable && msLeft > -LATE_PAYMENT_GRACE_MS;

  useEffect(() => {
    expiredRef.current = isExpired;
  }, [isExpired]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(demoTimer.current);
      clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowTimeoutBanner(true), 180000);
    return () => clearTimeout(t);
  }, []);

  const settle = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    successRef.current?.();
  }, []);

  const runCheck = useCallback(() => {
    if (!verifyRef.current || settledRef.current) return Promise.resolve(null);
    if (inFlightRef.current) return inFlightRef.current;

    const p = (async () => {
      try {
        const result = await verifyRef.current();
        if (!mountedRef.current) return null;
        setCheckFailed(false);

        if (result?.status === 'paid') {
          settle();
        } else if (result?.status === 'partial') {
          const paid = Number(result.paid);
          setPartial({ paid: Number.isFinite(paid) && paid > 0 ? paid : null });
        } else if (result?.status === 'expired') {
          setServerExpired(true);
        }
        return result ?? null;
      } catch {
        if (mountedRef.current) setCheckFailed(true);
        return null;
      }
    })();

    inFlightRef.current = p;
    p.finally(() => {
      if (inFlightRef.current === p) inFlightRef.current = null;
    });
    return p;
  }, [settle]);

  useEffect(() => {
    if (!polling) return undefined;

    let cancelled = false;
    let timer;
    let n = 0;

    const loop = () => {
      const delay = expiredRef.current ? 30000 : n < 12 ? 5000 : n < 36 ? 10000 : 20000;
      timer = setTimeout(async () => {
        if (cancelled) return;
        n += 1;
        await runCheck();
        if (!cancelled && !settledRef.current) loop();
      }, delay);
    };

    loop();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [polling, runCheck]);

  useEffect(() => {
    if (!polling) return undefined;
    const onVisible = () => {
      if (document.visibilityState === 'visible') runCheck();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [polling, runCheck]);

  const handleCopy = async (text, what) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(`${what} copied`);
    } catch {
      setCopyFeedback('Could not copy. Select it and copy by hand.');
    }

    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyFeedback(''), 2500);
  };

  const handleManualCheck = async () => {
    if (isChecking) return;
    setPendingNote(false);

    if (canVerify) {
      setIsChecking(true);
      const result = await runCheck();
      if (mountedRef.current) {
        setIsChecking(false);
        if (result?.status === 'pending') setPendingNote(true);
      }
      return;
    }

    setIsChecking(true);
    demoTimer.current = setTimeout(() => {
      setIsChecking(false);
      settle();
    }, 1200);
  };

  const formatTimer = (total) => `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;

  if (unavailable) {
    return (
      <div className="flex flex-col gap-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
        <h3 className="m-0 font-heading text-xl font-extrabold text-text-primary">Bank transfer is not available yet</h3>
        <p className="m-0 text-[15px] text-text-secondary">
          We cannot create a payment account right now. Pay on delivery works for orders up to ₦15,000.
        </p>
        <button
          type="button"
          onClick={onPayAnotherWay}
          className="h-14 w-full rounded-lg bg-secondary-olive font-heading text-base font-bold text-white active:scale-[0.98]"
        >
          Choose another way to pay
        </button>
      </div>
    );
  }

  const remaining = partial?.paid != null ? Math.max(0, orderAmount - partial.paid) : null;

  const row = 'flex items-center justify-between gap-3 border-b border-border-visible pb-3';
  const copyBtn = 'h-12 shrink-0 rounded-lg border border-border-visible bg-white px-4 font-heading text-[14px] font-bold text-text-primary active:scale-95 transition-transform disabled:opacity-50';

  return (
    <div className="flex flex-col gap-4">
      {demo && (
        <div className="flex flex-col gap-2 rounded-lg border border-dashed border-border-visible bg-bg-canvas p-3">
          <span className="font-heading text-[13px] font-bold text-text-secondary">Development test controls</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsChecking(true);
                demoTimer.current = setTimeout(() => {
                  setIsChecking(false);
                  settle();
                }, 400);
              }}
              className="h-12 rounded bg-status-success font-heading text-[13px] font-bold text-white active:scale-95"
            >
              Simulate paid
            </button>
            <button type="button" onClick={() => setPartial({ paid: Math.max(1000, orderAmount - 1000) })} className="h-12 rounded bg-status-pending font-heading text-[13px] font-bold text-white active:scale-95">Simulate partial</button>
            <button type="button" onClick={() => setShowTimeoutBanner(true)} className="h-12 rounded bg-secondary-olive font-heading text-[13px] font-bold text-white active:scale-95">Simulate 3 min wait</button>
            <button type="button" onClick={() => setServerExpired(true)} className="h-12 rounded bg-status-error font-heading text-[13px] font-bold text-white active:scale-95">Simulate expiry</button>
          </div>
        </div>
      )}

      <div className="border-b border-border-visible pb-3">
        <h3 className="m-0 font-heading text-xl font-extrabold text-text-primary">Pay ₦{naira.format(orderAmount)} by transfer</h3>
        <p className="mt-1 text-[14px] text-text-secondary">
          {isExpired
            ? 'This account has expired. Do not send money to it.'
            : 'Open your bank app and send the exact amount to this one-time account.'}
        </p>
      </div>

      <div className={`flex flex-col gap-3 rounded-xl border border-border-visible bg-bg-canvas p-4 ${isExpired ? 'opacity-60' : ''}`}>
        <div className={row}>
          <span className="text-[14px] text-text-secondary">Bank name</span>
          <span className="font-heading text-[15px] font-bold text-text-primary">{account.bankName}</span>
        </div>
        <div className={row}>
          <div>
            <span className="block text-[14px] text-text-secondary">Account number</span>
            <span className={`font-heading text-xl font-extrabold tabular-nums tracking-wider text-text-primary ${isExpired ? 'line-through' : ''}`}>{account.accountNumber}</span>
          </div>
          <button type="button" disabled={isExpired} onClick={() => handleCopy(account.accountNumber, 'Account number')} className={copyBtn}>Copy</button>
        </div>
        <div className={row}>
          <span className="text-[14px] text-text-secondary">Account name</span>
          <span className="text-right text-[14px] font-medium text-text-primary">{account.accountName}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="block text-[14px] text-text-secondary">Amount to send</span>
            <span className="font-heading text-lg font-extrabold tabular-nums text-text-primary">₦{naira.format(orderAmount)}</span>
          </div>
          <button type="button" disabled={isExpired} onClick={() => handleCopy(String(orderAmount), 'Amount')} className={copyBtn}>Copy</button>
        </div>
        <p aria-live="polite" className="m-0 min-h-5 text-center text-[13px] font-medium text-status-success">{copyFeedback}</p>
      </div>

      {partial && (
        <div role="status" className="flex items-start gap-2 rounded-lg border border-status-pending/30 bg-status-pending/10 p-3 text-[14px] text-status-pending">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 14" />
          </svg>
          <span>
            <span className="font-bold">Partial payment received.</span>{' '}
            {partial.paid == null
              ? 'We received part of your payment. Send the remaining amount to the same account.'
              : remaining > 0
                ? `We received ₦${naira.format(partial.paid)}. Send the remaining ₦${naira.format(remaining)} to the same account.`
                : `We received ₦${naira.format(partial.paid)}. We are confirming the full amount.`}
          </span>
        </div>
      )}

      {!isExpired && (
        <div className="flex items-start gap-2 rounded-lg border border-status-pending/20 bg-status-pending/10 p-3 text-[14px] text-status-pending">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Send exactly ₦{naira.format(orderAmount)}. A different amount can delay your order.</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 py-1 text-[14px]">
        {isExpired ? (
          <span role="status" className="flex items-center gap-1.5 font-medium text-status-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Account expired
          </span>
        ) : (
          <span role="status" className="flex items-center gap-1.5 font-medium text-status-pending">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            Waiting for your transfer
          </span>
        )}
        {!isExpired && (
          <span role="timer" className="font-medium tabular-nums text-text-secondary">Valid for {formatTimer(secondsRemaining)}</span>
        )}
      </div>

      {checkFailed && (
        <p role="status" className="m-0 text-[14px] text-status-pending">Cannot check right now. We will keep trying.</p>
      )}

      {pendingNote && !checkFailed && (
        <p role="status" className="m-0 text-[14px] text-text-secondary">We have not received your transfer yet. Banks can take a few minutes, so check again shortly.</p>
      )}

      {isExpired && (
        <div className="flex flex-col gap-3 rounded-lg border border-border-visible bg-bg-canvas p-3">
          <p className="m-0 text-[14px] text-text-secondary">
            Already sent money? Do not send again. Tap “I already sent the money” and we will check.
          </p>
          {onNewAccount && (
            <button
              type="button"
              onClick={onNewAccount}
              className="h-14 w-full rounded-lg bg-secondary-olive font-heading text-base font-bold text-white active:scale-[0.98]"
            >
              Get a new account number
            </button>
          )}
        </div>
      )}

      {showTimeoutBanner && !isExpired && (
        <div className="animate-fade-in flex flex-col gap-1 rounded-lg border border-border-visible bg-bg-canvas p-3">
          <p className="m-0 text-[14px] text-text-secondary">Still waiting. Transfers can take a few minutes. You can leave this screen and we will tell you when it arrives.</p>
          <div className="flex gap-4">
            <button type="button" onClick={onGoToOrders} className="h-12 font-heading text-[14px] font-bold text-text-primary underline underline-offset-2">Go to my orders</button>
            <button type="button" onClick={() => setShowTimeoutBanner(false)} className="h-12 font-heading text-[14px] font-bold text-text-secondary underline underline-offset-2">Keep waiting</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1 pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
        <button
          type="button"
          disabled={isChecking}
          onClick={handleManualCheck}
          className={
            isExpired
              ? 'h-14 w-full rounded-lg border border-border-visible bg-white font-heading text-base font-bold text-text-primary transition-colors disabled:opacity-50 active:scale-[0.98]'
              : 'h-14 w-full rounded-lg bg-secondary-olive font-heading text-base font-bold text-white transition-colors disabled:opacity-50 active:scale-[0.98]'
          }
        >
          {isChecking ? 'Checking with your bank...' : isExpired ? 'I already sent the money' : 'I have sent the money'}
        </button>
        <button type="button" onClick={onPayAnotherWay} className="h-12 w-full text-center text-[15px] font-medium text-text-secondary underline underline-offset-2 active:scale-[0.98]">
          Pay another way
        </button>
      </div>
    </div>
  );
}
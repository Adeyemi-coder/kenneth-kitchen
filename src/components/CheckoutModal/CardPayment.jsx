import React, { useEffect, useRef, useState } from 'react';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });
const DEV = Boolean(import.meta.env.DEV);

// The footer "Pay by card" button and this form's submit button sit in the same spot. A double-tap or an
// Enter key right after the screen swaps must not land on the form, so early submits are ignored.
const SUBMIT_ARM_DELAY_MS = 600;
const SIMULATED_CHARGE_MS = 1200;

const digitsOnly = (s) => String(s).replace(/\D/g, '');

// "4242424242424242" -> "4242 4242 4242 4242". No trailing space, so backspace never gets stuck on one.
const formatCardNumber = (raw) => digitsOnly(raw).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (raw) => {
  const d = digitsOnly(raw).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

function luhnValid(num) {
  let sum = 0;
  let double = false;
  for (let i = num.length - 1; i >= 0; i -= 1) {
    let n = Number(num[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

function validate({ number, expiry, cvv }) {
  const errors = {};

  const digits = digitsOnly(number);
  if (!digits) errors.number = 'Enter your card number.';
  else if (digits.length < 16 || digits.length > 19 || !luhnValid(digits)) errors.number = 'This card number is not valid.';

  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!expiry) errors.expiry = 'Enter the expiry date.';
  else if (!match) errors.expiry = 'Use the format MM/YY.';
  else {
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) errors.expiry = 'Enter a valid month.';
    // A card is good through the last day of its expiry month; `month` is 1-based, so this is the 1st of next month.
    else if (new Date(year, month, 1) <= new Date()) errors.expiry = 'This card has expired.';
  }

  const cvvLength = /^3[47]/.test(digits) ? 4 : 3;
  if (!cvv) errors.cvv = 'Enter the security code.';
  else if (digitsOnly(cvv).length !== cvvLength) errors.cvv = `Enter the ${cvvLength}-digit code.`;

  return errors;
}

/**
 * Real use: pass `processCard({ number, expiry, cvv })`, which talks to your payment gateway and resolves
 * { status: 'success' } or { status: 'failed', message }. If your gateway offers hosted fields or a popup
 * (Paystack, Flutterwave), prefer that and drop this form, so raw card numbers never pass through your code.
 * Without `processCard` this screen simulates a charge, and only in development builds.
 */
export default function CardPayment({ orderAmount, processCard, onPaymentSuccess, onPayAnotherWay, onBusyChange }) {
  const available = Boolean(processCard) || DEV;

  const [isProcessing, setIsProcessing] = useState(false);
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const mountedRef = useRef(true);
  const settledRef = useRef(false);
  const submittingRef = useRef(false);
  const simTimer = useRef(null);
  const armedAtRef = useRef(Date.now() + SUBMIT_ARM_DELAY_MS);

  // Callbacks live in refs so a parent re-render never changes what an in-flight charge will call.
  const successRef = useRef(onPaymentSuccess);
  const busyRef = useRef(onBusyChange);
  const processRef = useRef(processCard);
  useEffect(() => {
    successRef.current = onPaymentSuccess;
    busyRef.current = onBusyChange;
    processRef.current = processCard;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(simTimer.current);
      busyRef.current?.(false);
    };
  }, []);

  const setBusy = (busy) => {
    submittingRef.current = busy;
    if (mountedRef.current) setIsProcessing(busy);
    busyRef.current?.(busy);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (submittingRef.current || settledRef.current) return;
    if (Date.now() < armedAtRef.current) return;

    setFormError('');
    const found = validate({ number, expiry, cvv });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalid = ['number', 'expiry', 'cvv'].find((k) => found[k]);
      document.getElementById(`card-${firstInvalid}`)?.focus();
      return;
    }

    setBusy(true);
    try {
      let result;
      if (processRef.current) {
        result = await processRef.current({ number: digitsOnly(number), expiry, cvv: digitsOnly(cvv) });
      } else {
        // Development simulation only; `available` is false in production without processCard.
        result = await new Promise((resolve) => {
          simTimer.current = setTimeout(() => resolve({ status: 'success' }), SIMULATED_CHARGE_MS);
        });
      }

      if (result?.status === 'success') {
        // Report success even if this screen was closed meanwhile: the money has already moved.
        settledRef.current = true;
        successRef.current?.();
      } else if (mountedRef.current) {
        setFormError(result?.message || 'Your card was not charged. Check the details or try another card.');
      }
    } catch {
      if (mountedRef.current) {
        setFormError('We could not confirm your payment. Check your bank alerts before trying again.');
      }
    } finally {
      setBusy(false);
    }
  };

  if (!available) {
    return (
      <div className="flex flex-col gap-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
        <h3 className="m-0 font-heading text-xl font-extrabold text-text-primary">Card payment is not available yet</h3>
        <p className="m-0 text-[15px] text-text-secondary">We cannot take card payments right now. Please choose another way to pay.</p>
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

  const inputClass = (hasError) =>
    `h-12 rounded-lg border bg-white px-3 font-mono text-[16px] outline-none focus:border-primary-base ${
      hasError ? 'border-status-error' : 'border-border-visible'
    }`;
  const labelClass = 'text-[14px] font-medium text-text-secondary';
  const errorClass = 'm-0 text-[13px] font-medium text-status-error';

  return (
    <div className="flex flex-col gap-4 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
      {DEV && !processCard && (
        <p className="m-0 rounded-lg border border-dashed border-border-visible bg-bg-canvas p-3 text-[13px] font-medium text-text-secondary">
          Development simulation: no card is charged. Use a number that passes the Luhn check, for example 4242 4242 4242 4242.
        </p>
      )}

      <div className="border-b border-border-visible pb-3">
        <h3 className="m-0 font-heading text-xl font-extrabold text-text-primary">Pay ₦{naira.format(orderAmount)} by card</h3>
        <p className="mt-1 text-[14px] text-text-secondary">Enter your card details to complete your order.</p>
      </div>

      <form
        onSubmit={handlePay}
        noValidate
        aria-busy={isProcessing}
        className="flex flex-col gap-4 rounded-xl border border-border-visible bg-bg-canvas p-4"
      >
        {formError && (
          <div role="alert" className="rounded bg-status-error/10 p-2 text-[13px] font-medium text-status-error">
            {formError}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="card-number" className={labelClass}>Card number</label>
          <input
            id="card-number"
            name="cardnumber"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={number}
            onChange={(e) => {
              setNumber(formatCardNumber(e.target.value));
              if (errors.number) setErrors((cur) => ({ ...cur, number: undefined }));
            }}
            maxLength={23}
            aria-invalid={Boolean(errors.number)}
            aria-describedby={errors.number ? 'card-number-error' : undefined}
            className={inputClass(errors.number)}
            disabled={isProcessing}
          />
          {errors.number && <p id="card-number-error" className={errorClass}>{errors.number}</p>}
        </div>

        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="card-expiry" className={labelClass}>Expiry</label>
            <input
              id="card-expiry"
              name="cc-exp"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => {
                setExpiry(formatExpiry(e.target.value));
                if (errors.expiry) setErrors((cur) => ({ ...cur, expiry: undefined }));
              }}
              maxLength={5}
              aria-invalid={Boolean(errors.expiry)}
              aria-describedby={errors.expiry ? 'card-expiry-error' : undefined}
              className={inputClass(errors.expiry)}
              disabled={isProcessing}
            />
            {errors.expiry && <p id="card-expiry-error" className={errorClass}>{errors.expiry}</p>}
          </div>

          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor="card-cvv" className={labelClass}>CVV</label>
            <input
              id="card-cvv"
              name="cvc"
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={cvv}
              onChange={(e) => {
                setCvv(digitsOnly(e.target.value).slice(0, 4));
                if (errors.cvv) setErrors((cur) => ({ ...cur, cvv: undefined }));
              }}
              maxLength={4}
              aria-invalid={Boolean(errors.cvv)}
              aria-describedby={errors.cvv ? 'card-cvv-error' : undefined}
              className={inputClass(errors.cvv)}
              disabled={isProcessing}
            />
            {errors.cvv && <p id="card-cvv-error" className={errorClass}>{errors.cvv}</p>}
          </div>
        </div>

        {/* Worded differently from the footer's "Pay ... by card" button so the two can never be mistaken. */}
        <button
          type="submit"
          disabled={isProcessing}
          className="mt-2 h-14 w-full rounded-lg bg-primary-base font-heading text-base font-bold text-white transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {isProcessing ? 'Processing payment...' : `Confirm card payment of ₦${naira.format(orderAmount)}`}
        </button>
      </form>

      <button
        type="button"
        onClick={onPayAnotherWay}
        disabled={isProcessing}
        className="h-12 w-full text-center text-[15px] font-medium text-text-secondary underline underline-offset-2 active:scale-[0.98] disabled:opacity-50"
      >
        Pay another way
      </button>
    </div>
  );
}
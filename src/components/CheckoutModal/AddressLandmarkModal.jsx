import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const FILLER = new Set([
  'near', 'me', 'my', 'house', 'place', 'here', 'there', 'home', 'close', 'closeby', 'to', 'the', 'by', 'at',
  'around', 'beside', 'next', 'opposite', 'behind', 'front', 'off', 'along', 'in', 'on', 'of', 'a', 'an', 'and', 'or', 'area',
]);

export function checkLandmark(text) {
  const clean = text.trim();
  const words = clean.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  const meaningful = words.filter((w) => !FILLER.has(w));
  const enoughWords = meaningful.length >= 2 || (meaningful[0]?.length ?? 0) >= 8;
  return clean.length >= 8 && enoughWords;
}

export function normalizePhone(raw) {
  let d = String(raw ?? '').replace(/\D/g, '');
  if (d.startsWith('234')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return d;
}
export const isValidPhone = (d) => /^(70|80|81|90|91)\d{8}$/.test(d);
const prettyPhone = (d) => `0${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;

const inputClass =
  'h-12 w-full rounded-lg border-2 border-ui-control bg-white px-3 text-[16px] text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-secondary-olive aria-[invalid=true]:border-status-error';
const labelClass = 'mb-1 text-[15px] font-medium text-text-primary';
const hintClass = 'mt-1 text-[13px] text-text-secondary';
const errorClass = 'mt-1 text-[13px] font-medium text-status-error';

function Required() {
  return (
    <>
      <span aria-hidden="true" className="text-status-error"> *</span>
      <span className="sr-only"> (required)</span>
    </>
  );
}

export default function AddressLandmarkModal({ isOpen, onClose, onSaveAddress, initialAddress = null, defaultStreet = '' }) {
  const uid = useId();
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [gate, setGate] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const refs = useRef({});
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    setStreet(initialAddress?.street ?? defaultStreet);
    setLandmark(initialAddress?.landmark ?? '');
    setGate(initialAddress?.gateInstructions ?? '');
    setPhone(initialAddress?.phoneDisplay ?? '');
    setErrors({});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const opener = document.activeElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.();
    document.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const id = (k) => `${uid}-${k}`;

  const handleSave = (e) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    const next = {};
    if (!street.trim()) next.street = 'Enter your street or area.';
    if (!checkLandmark(landmark)) next.landmark = 'Add something the rider can see, like a gate colour, a shop or a junction.';
    if (!isValidPhone(digits)) next.phone = 'Enter a valid Nigerian mobile number, like 0803 123 4567.';
    setErrors(next);

    const first = ['street', 'landmark', 'phone'].find((k) => next[k]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }

    onSaveAddress?.({
      street: street.trim(),
      landmark: landmark.trim(),
      gateInstructions: gate.trim() || undefined,
      phone: `+234${digits}`,
      phoneDisplay: prettyPhone(digits),
    });
    closeRef.current?.();
  };

  const invalid = (k) => ({
    'aria-invalid': Boolean(errors[k]),
    'aria-describedby': errors[k] ? id(`${k}-err`) : k === 'landmark' ? id('landmark-hint') : undefined,
  });

  return createPortal(
    <div
      className="animate-overlay-in fixed inset-0 z-[10000] flex items-end justify-center bg-[#111618]/50 md:items-center md:p-6"
      onClick={() => closeRef.current?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id('title')}
        onClick={(e) => e.stopPropagation()}
        /* Using h-[100dvh] to fill the screen exactly */
        className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white md:h-auto md:max-h-[85dvh] md:max-w-[500px] md:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-visible py-2 pl-5 pr-2">
          <div>
            <h2 id={id('title')} className="m-0 font-heading text-lg font-bold text-text-primary">Delivery details</h2>
            <p className="m-0 mt-0.5 text-[13px] text-text-secondary">Help the rider find you quickly.</p>
          </div>
          <button
            type="button"
            onClick={() => closeRef.current?.()}
            aria-label="Close"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-text-secondary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} noValidate className="flex flex-col h-full min-h-0 relative">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 py-4 pb-32">
            <div className="flex flex-col">
              <label htmlFor={id('street')} className={labelClass}>Street address<Required /></label>
              <input
                id={id('street')}
                ref={(el) => (refs.current.street = el)}
                type="text"
                autoComplete="street-address"
                placeholder="12 Ahmadu Bello Way"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className={inputClass}
                {...invalid('street')}
              />
              {errors.street && <p id={id('street-err')} role="alert" className={errorClass}>{errors.street}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor={id('landmark')} className={labelClass}>Nearest landmark<Required /></label>
              <input
                id={id('landmark')}
                ref={(el) => (refs.current.landmark = el)}
                type="text"
                placeholder="Beside First Bank, Tanke Junction"
                value={landmark}
                onChange={(e) => {
                  setLandmark(e.target.value);
                  if (errors.landmark) setErrors((p) => ({ ...p, landmark: '' }));
                }}
                className={inputClass}
                {...invalid('landmark')}
              />
              {errors.landmark
                ? <p id={id('landmark-err')} role="alert" className={errorClass}>{errors.landmark}</p>
                : <p id={id('landmark-hint')} className={hintClass}>Riders find houses by landmarks. Be specific.</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor={id('gate')} className={labelClass}>Gate or building instructions (optional)</label>
              <input
                id={id('gate')}
                type="text"
                placeholder="White gate, 2nd floor, use the back entrance"
                value={gate}
                onChange={(e) => setGate(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor={id('phone')} className={labelClass}>Phone number for the rider<Required /></label>
              <input
                id={id('phone')}
                ref={(el) => (refs.current.phone = el)}
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="0803 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`${inputClass} tabular-nums`}
                {...invalid('phone')}
              />
              {errors.phone && <p id={id('phone-err')} role="alert" className={errorClass}>{errors.phone}</p>}
            </div>
          </div>

          {/* THE FIX: Use absolute inset-x-0 bottom-0 to stick it exactly to the bottom of the screen, and pb-[4.5rem] to float it above the Safari bar */}
          <div className="absolute inset-x-0 bottom-0 flex shrink-0 gap-3 border-t border-border-visible bg-white px-5 pt-4 pb-[4.5rem] md:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => closeRef.current?.()}
              className="h-14 flex-1 rounded-lg border border-border-visible bg-white text-[15px] font-semibold text-text-primary active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-14 flex-1 rounded-lg bg-primary-base text-[15px] font-semibold text-white active:scale-[0.98] active:bg-primary-pressed"
            >
              Save address
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
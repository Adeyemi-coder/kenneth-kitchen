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

const input = 'h-12 w-full rounded-lg border border-border-visible bg-white px-3 text-[16px] text-text-primary outline-none placeholder:text-text-secondary focus:border-primary-base aria-[invalid=true]:border-status-error transition-colors';
const label = 'text-[14px] font-medium text-text-primary mb-1';
const hint = 'text-[12px] text-text-secondary mt-1';
const err = 'text-[12px] font-medium text-status-error mt-1';

export default function AddressLandmarkModal({
  isOpen,
  onClose,
  onSaveAddress,
  initialAddress = null,
  defaultStreet = '',
}) {
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
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleSave = (e) => {
    e.preventDefault();
    const digits = normalizePhone(phone);
    const next = {};
    
    if (!street.trim()) next.street = 'Enter your street or area.';
    if (!checkLandmark(landmark)) next.landmark = 'Add something the rider can see.';
    if (!isValidPhone(digits)) next.phone = 'Enter a valid Nigerian mobile number.';
    
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
  };

  const id = (k) => `${uid}-${k}`;

  return createPortal(
    <div 
      className="animate-overlay-in fixed inset-0 z-[10000] flex items-end justify-center bg-black/50 md:items-center md:p-6" 
      onClick={() => closeRef.current?.()}
    >
      <div 
        role="dialog" 
        aria-modal="true" 
        onClick={(e) => e.stopPropagation()} 
        className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl md:max-w-[500px] md:rounded-2xl"
      >
        {/* Fixed Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border-visible px-5 py-4">
          <div>
            <h2 id={id('title')} className="m-0 font-heading text-lg font-bold text-text-primary">
              Delivery details
            </h2>
            <p className="m-0 mt-0.5 text-[13px] text-text-secondary">
              Help the rider find you quickly.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => closeRef.current?.()} 
            aria-label="Close" 
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-canvas"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form id="address-form" onSubmit={handleSave} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor={id('street')} className={label}>Street address <span className="text-status-error">*</span></label>
              <input 
                id={id('street')} 
                ref={(el) => (refs.current.street = el)} 
                type="text" 
                placeholder="e.g. 12 Ahmadu Bello Way" 
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
                className={input} 
              />
              {errors.street && <p role="alert" className={err}>{errors.street}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor={id('landmark')} className={label}>Nearest landmark <span className="text-status-error">*</span></label>
              <input 
                id={id('landmark')} 
                ref={(el) => (refs.current.landmark = el)} 
                type="text" 
                placeholder="e.g. Beside First Bank, Tanke Junction" 
                value={landmark} 
                onChange={(e) => { setLandmark(e.target.value); if (errors.landmark) setErrors((p) => ({ ...p, landmark: '' })); }} 
                className={input} 
              />
              {errors.landmark ? <p role="alert" className={err}>{errors.landmark}</p> : <p className={hint}>Riders find houses by landmarks. Be specific.</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor={id('gate')} className={label}>Gate / building instructions</label>
              <input 
                id={id('gate')} 
                type="text" 
                placeholder="Optional" 
                value={gate} 
                onChange={(e) => setGate(e.target.value)} 
                className={input} 
              />
              <p className={hint}>Optional — e.g. 'White gate, 2nd floor, use back entrance'</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor={id('phone')} className={label}>Phone number <span className="text-status-error">*</span></label>
              <input 
                id={id('phone')} 
                ref={(el) => (refs.current.phone = el)} 
                type="tel" 
                placeholder="0803 000 0000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className={`${input} tabular-nums`} 
              />
              {errors.phone && <p role="alert" className={err}>{errors.phone}</p>}
            </div>
          </form>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="shrink-0 border-t border-border-visible bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => closeRef.current?.()} 
              className="h-12 flex-1 rounded-lg border border-border-visible bg-white text-[15px] font-medium text-text-primary active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              form="address-form"
              className="h-12 flex-1 rounded-lg bg-primary-base text-[15px] font-semibold text-white active:scale-[0.98]"
            >
              Save address
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
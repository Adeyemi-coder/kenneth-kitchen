import React from 'react';
import { createPortal } from 'react-dom';

export default function HandoverModal({ isOpen, onClose, onConfirmReceived, deliveryPin = '4827' }) {
  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Order Handover"
      className="fixed inset-0 z-[9996] flex items-end md:items-center justify-center bg-black/60 p-0 md:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-[480px] bg-white rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col shadow-2xl p-6 gap-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="w-12 h-12 rounded-full bg-[#0B6A37]/10 text-[#0B6A37] flex items-center justify-center font-bold text-xl">
            🛵
          </span>
          <h2 className="font-heading font-extrabold text-xl text-[#111618] m-0">Your rider has arrived!</h2>
          <p className="text-sm text-[#4B555D] m-0">Check your package and provide the PIN below to confirm delivery.</p>
        </div>

        <div className="p-4 bg-[#FAFAFA] border border-[#CBD1D6] rounded-xl flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-[#4B555D] uppercase">Delivery PIN</span>
          <span className="font-heading font-extrabold text-4xl tracking-widest text-[#CF3A0E] tabular-nums">
            {deliveryPin}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onConfirmReceived}
            className="h-14 rounded-xl bg-[#0B6A37] hover:bg-[#09522b] text-white font-heading font-bold text-base cursor-pointer border-none"
          >
            Order received & verified
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 text-xs font-medium text-[#BA1A1A] underline bg-transparent border-none cursor-pointer"
          >
            There is a problem with my order
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
import React from 'react';

/**
 * Pure presentational row used in the account settings list.
 */
export default function AccountRow({ icon, label, hint, onClick, last = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 px-4 py-3.5 text-left active:bg-bg-canvas ${
        last ? '' : 'border-b border-border-visible'
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-canvas text-text-primary">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icon}
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium text-text-primary">{label}</span>
        <span className="mt-0.5 block text-[13px] text-text-secondary">{hint}</span>
      </span>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        className="shrink-0 text-text-secondary"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

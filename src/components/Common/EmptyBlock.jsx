import React from 'react';

/**
 * Pure presentational empty-state block.
 */
export default function EmptyBlock({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-border-visible bg-white px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-canvas text-text-secondary">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icon}
        </svg>
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg font-bold text-text-primary">{title}</h2>
        {description && (
          <p className="max-w-sm text-[14px] text-text-secondary">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 h-11 rounded-lg bg-primary-base px-5 text-[14px] font-semibold text-white active:scale-[0.97]"
        >
          {actionLabel}
        </button>
      )}
    </section>
  );
}

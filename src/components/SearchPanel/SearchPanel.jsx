import React, { useEffect, useRef, useState } from 'react';
import { matchesSearch } from '../../core/utils/diacriticNormalizer';

const TRY = ['Amala', 'Jollof rice', 'Suya', 'Pepper soup', 'Shawarma', 'Akara'];
const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

export default function SearchPanel({ isOpen, onClose, dishes = [], vendors = [], onPick }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    setQuery('');
    const opener = document.activeElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.();
    document.addEventListener('keydown', onKey);
    setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim();
  const vendorById = new Map(vendors.map((v) => [v.id, v]));
  const dishHits = q
    ? dishes
        .filter((d) => matchesSearch(d.name || '', q) || matchesSearch(d.description || '', q))
        .slice(0, 6)
    : [];
  const vendorHits = q
    ? vendors
        .filter(
          (v) =>
            matchesSearch(v.name || '', q) ||
            matchesSearch(v.dishesLine || '', q) ||
            matchesSearch(v.area || '', q)
        )
        .slice(0, 4)
    : [];

  const row =
    'flex min-h-14 w-full items-center justify-between gap-3 border-b border-border-visible px-4 py-2 text-left active:bg-bg-canvas';

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-[9990] flex bg-white md:items-start md:justify-center md:bg-[#111618]/50 md:p-6"
      onClick={() => closeRef.current?.()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col bg-white md:mt-12 md:h-auto md:max-h-[70dvh] md:max-w-xl md:rounded-2xl md:border md:border-border-visible"
      >
        <div className="flex h-14 shrink-0 items-center gap-1 border-b border-border-visible pr-2">
          <label htmlFor="global-search" className="sr-only">
            Search dishes and kitchens
          </label>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4B555D"
            strokeWidth="2.2"
            className="ml-4 shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="global-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes and kitchens"
            className="h-full min-w-0 flex-1 bg-transparent px-3 text-[17px] text-text-primary outline-none placeholder:text-text-secondary"
          />
          <button
            type="button"
            onClick={() => closeRef.current?.()}
            className="h-12 px-3 text-[15px] font-medium text-secondary-olive"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {!q && (
            <>
              <p className="px-4 pb-1 pt-4 text-[13px] text-text-secondary">Try</p>
              {TRY.map((t) => (
                <button key={t} type="button" onClick={() => setQuery(t)} className={row}>
                  <span className="text-[15px] text-text-primary">{t}</span>
                </button>
              ))}
            </>
          )}

          {q && dishHits.length === 0 && vendorHits.length === 0 && (
            <p className="px-4 py-8 text-[15px] text-text-secondary">
              No match for "{q}". Try a shorter word.
            </p>
          )}

          {dishHits.length > 0 && (
            <>
              <h2 className="px-4 pb-1 pt-4 font-heading text-base font-bold text-text-primary">
                Dishes
              </h2>
              {dishHits.map((d) => {
                const v = vendorById.get(d.vendorId);
                return (
                  <button
                    key={d.id}
                    type="button"
                    disabled={!v}
                    onClick={() => v && onPick?.(v)}
                    className={`${row} ${!v ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-text-primary">
                        {d.name}
                      </span>
                      <span className="block text-[13px] text-text-secondary">
                        {v?.name ?? 'Unavailable'}
                      </span>
                    </span>
                    <span className="shrink-0 text-[15px] font-bold tabular-nums text-text-primary">
                      ₦{naira.format(d.price)}
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {vendorHits.length > 0 && (
            <>
              <h2 className="px-4 pb-1 pt-4 font-heading text-base font-bold text-text-primary">
                Kitchens
              </h2>
              {vendorHits.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onPick?.(v)}
                  className={row}
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium text-text-primary">
                      {v.name}
                    </span>
                    <span className="block text-[13px] text-text-secondary">{v.area}</span>
                  </span>
                  <span className="shrink-0 text-[13px] text-text-secondary">
                    {v.isOpen ? 'Open' : 'Closed'}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
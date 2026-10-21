import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

function toNumber(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.round(value) : null;
  if (typeof value === 'string') {
    const n = parseFloat(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? Math.round(n) : null;
  }
  return null;
}

function sentenceCase(text = '') {
  const clean = text.replace(/\s*\(optional\)\s*/i, '').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

function normalizeGroups(dish) {
  return (dish?.modifierGroups ?? []).map((g) => {
    const single = g.maxSelect != null ? g.maxSelect === 1 : Boolean(g.required);
    
    return {
      id: g.id,
      title: sentenceCase(g.title ?? g.name),
      required: Boolean(g.required),
      single,
      max: single ? 1 : g.maxSelect ?? 3,
      defaultOptionId: g.defaultOptionId ?? null,
      options: (g.options ?? []).map((o, i) => {
        const delta = toNumber(o.extraPrice ?? o.price);
        if (delta === null && import.meta.env?.DEV) {
          console.warn(`[menu] Option "${o.name}" in "${g.id}" has no valid price. Treated as included.`);
        }
        return { id: o.id ?? `${g.id}-${i}`, name: o.name, delta: delta ?? 0 };
      }),
    };
  });
}

function formatDelta(delta) {
  if (delta === 0) return 'Included';
  return delta > 0 ? `+₦${naira.format(delta)}` : `₦${naira.format(Math.abs(delta))} less`;
}

function promptFor(title) {
  return /^(choose|select|pick)/i.test(title) ? title : `Choose ${title.toLowerCase()}`;
}

const Icon = {
  Tick: (p) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true" {...p}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  Alert: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

function GroupStatus({ group, count, hasError }) {
  if (!group.required) {
    return (
      <span className="text-[13px] text-text-secondary">
        {group.single ? 'Optional' : `Optional, up to ${group.max}`}
      </span>
    );
  }
  if (hasError) {
    return (
      <span className="flex items-center gap-1 text-[13px] font-medium text-status-error">
        <Icon.Alert /> Choose one
      </span>
    );
  }
  if (count > 0) {
    return (
      <span className="flex items-center gap-1 text-[13px] font-medium text-status-success">
        <Icon.Tick width="14" height="14" /> Chosen
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[13px] font-medium text-status-pending">
      <Icon.Clock /> Required
    </span>
  );
}

function useVisibleViewport() {
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') return { height: 800, offsetTop: 0 };
    const vv = window.visualViewport;
    return {
      height: vv?.height ?? window.innerHeight,
      offsetTop: vv?.offsetTop ?? 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const vv = window.visualViewport;
    const update = () => {
      setSize({
        height: vv?.height ?? window.innerHeight,
        offsetTop: vv?.offsetTop ?? 0,
      });
    };
    update();
    if (vv) {
      vv.addEventListener('resize', update);
      vv.addEventListener('scroll', update);
    }
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      if (vv) {
        vv.removeEventListener('resize', update);
        vv.removeEventListener('scroll', update);
      }
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return size;
}

export default function DishModal({
  dish,
  isOpen,
  onClose,
  onAddToCart,
  orderingDisabled = false,
  disabledLabel = 'Kitchen is closed',
}) {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState({});
  const [note, setNote] = useState('');
  const [errorGroup, setErrorGroup] = useState(null);
  const [added, setAdded] = useState(false);
  const [heroFailed, setHeroFailed] = useState(false);

  const panelRef = useRef(null);
  const groupRefs = useRef({});
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const viewport = useVisibleViewport();
  const footerSpace = 130;

  const groups = useMemo(() => normalizeGroups(dish), [dish]);

  useEffect(() => {
    if (!isOpen) return;
    const initial = {};
    groups.forEach((g) => {
      const hasDefault = g.defaultOptionId && g.options.some((o) => o.id === g.defaultOptionId);
      initial[g.id] = hasDefault ? [g.defaultOptionId] : [];
    });
    setSelected(initial);
    setQuantity(1);
    setNote('');
    setErrorGroup(null);
    setAdded(false);
    setHeroFailed(false);
  }, [isOpen, dish?.id, groups]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const opener = document.activeElement;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && closeRef.current?.();
    document.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      document.removeEventListener('keydown', onKey);
      opener?.focus?.();
    };
  }, [isOpen]);

  const unitPrice = useMemo(() => {
    const base = toNumber(dish?.price) ?? 0;
    const extra = groups.reduce(
      (sum, g) =>
        sum +
        (selected[g.id] ?? []).reduce((s, id) => s + (g.options.find((o) => o.id === id)?.delta ?? 0), 0),
      0
    );
    return Math.max(0, base + extra);
  }, [dish, groups, selected]);

  const total = unitPrice * quantity;
  const firstMissing = groups.find((g) => g.required && (selected[g.id] ?? []).length === 0);

  if (!isOpen || !dish) return null;

  const choose = (group, optionId) => {
    if (errorGroup === group.id) setErrorGroup(null);
    setSelected((prev) => {
      const current = prev[group.id] ?? [];
      if (group.single) return { ...prev, [group.id]: [optionId] };
      if (current.includes(optionId)) return { ...prev, [group.id]: current.filter((id) => id !== optionId) };
      if (current.length >= group.max) return prev;
      return { ...prev, [group.id]: [...current, optionId] };
    });
  };

  const handleAdd = () => {
    if (orderingDisabled || added) return;
    if (firstMissing) {
      setErrorGroup(firstMissing.id);
      groupRefs.current[firstMissing.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const selectedModifiers = {};
    groups.forEach((g) => {
      selectedModifiers[g.id] = g.options
        .filter((o) => (selected[g.id] ?? []).includes(o.id))
        .map((o) => ({ id: o.id, name: o.name, price: o.delta }));
    });

    onAddToCart?.({
      dishId: dish.id,
      name: dish.name,
      unitPrice,
      price: unitPrice,
      quantity,
      selectedModifiers,
      specialInstructions: note.trim(),
    });
    setAdded(true);
    setTimeout(() => closeRef.current?.(), 600);
  };

  let buttonLabel = `Add to cart · ₦${naira.format(total)}`;
  if (orderingDisabled) buttonLabel = disabledLabel;
  else if (added) buttonLabel = 'Added';
  else if (firstMissing) buttonLabel = promptFor(firstMissing.title);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={() => closeRef.current?.()}
        className="animate-overlay-in fixed inset-0 z-[9995] bg-[#111618]/50"
        style={{ height: `${viewport.height}px`, top: `${viewport.offsetTop}px` }}
      />

      {/* Scrollable panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-title"
        className="fixed z-[9996] mx-auto flex flex-col overflow-hidden rounded-t-2xl border-t border-border-visible bg-white outline-none left-0 right-0 md:left-1/2 md:right-auto md:-translate-x-1/2 md:rounded-2xl md:border md:max-w-[640px] md:w-[640px]"
        style={{
          top: `${viewport.offsetTop + 20}px`,
          height: `${viewport.height - 20}px`,
          paddingBottom: `${footerSpace}px`,
        }}
      >
        <button
          type="button"
          onClick={() => closeRef.current?.()}
          aria-label="Close"
          className="absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-full"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border-visible bg-white text-text-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          {dish.imageUrl && !heroFailed && (
            <div className="dish-hero-media aspect-[16/10] w-full bg-[#ECEAE6] md:aspect-[2/1]">
              <img
                src={dish.imageUrl}
                alt=""
                onError={() => setHeroFailed(true)}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-5 p-4 md:p-6">
            <div className="flex flex-col gap-1.5 pr-10">
              <h2 id="dish-title" className="font-heading text-[22px] font-extrabold leading-7 text-text-primary">
                {dish.name}
              </h2>
              {dish.description && (
                <p className="text-sm leading-5 text-text-secondary">{dish.description}</p>
              )}
              <p className="font-body text-base font-bold tabular-nums text-text-primary">
                ₦{naira.format(toNumber(dish.price) ?? 0)}
              </p>
            </div>

            {groups.map((group) => {
              const current = selected[group.id] ?? [];
              return (
                <section
                  key={group.id}
                  ref={(el) => (groupRefs.current[group.id] = el)}
                  aria-labelledby={`g-${group.id}`}
                  className="border-t border-border-visible pt-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 id={`g-${group.id}`} className="font-heading text-base font-bold text-text-primary">
                      {group.title}
                    </h3>
                    <GroupStatus group={group} count={current.length} hasError={errorGroup === group.id} />
                  </div>

                  <div className="mt-1">
                    {group.options.map((opt) => {
                      const isSelected = current.includes(opt.id);
                      const atMax = !group.single && !isSelected && current.length >= group.max;
                      return (
                        <label
                          key={opt.id}
                          className={`flex min-h-14 items-center gap-3 border-b border-border-visible py-2 ${
                            atMax ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                          }`}
                        >
                          <input
                            type={group.single ? 'radio' : 'checkbox'}
                            name={group.id}
                            checked={isSelected}
                            disabled={atMax}
                            onChange={() => choose(group, opt.id)}
                            className="peer sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-base ${
                              group.single ? 'rounded-full' : 'rounded'
                            } ${isSelected ? 'border-secondary-olive bg-secondary-olive' : 'border-ui-control'}`}
                          >
                            {isSelected &&
                              (group.single ? (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              ) : (
                                <Icon.Tick />
                              ))}
                          </span>
                          <span
                            className={`min-w-0 flex-1 text-[15px] text-text-primary ${
                              isSelected ? 'font-semibold' : ''
                            }`}
                          >
                            {opt.name}
                          </span>
                          <span className="shrink-0 font-body text-sm tabular-nums text-text-secondary">
                            {formatDelta(opt.delta)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <section className="border-t border-border-visible pt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="dish-note" className="font-heading text-base font-bold text-text-primary">
                  Note for the kitchen
                </label>
                <span className="text-[13px] tabular-nums text-text-secondary">{note.length}/140</span>
              </div>
              <textarea
                id="dish-note"
                rows={2}
                maxLength={140}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="For example: less pepper, pack stew separately"
                className="mt-2 w-full resize-none rounded-lg border border-border-visible bg-bg-canvas p-3 text-sm text-text-primary placeholder:text-text-secondary"
              />
            </section>
          </div>
        </div>
      </div>

      {/* ── FIXED FOOTER — Safely elevated above mobile gesture bars & bottom edge ── */}
      <div
        className="fixed left-0 right-0 z-[9997] flex items-center gap-3 border-t border-border-visible bg-white px-4 pt-3 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[640px] md:px-6 md:rounded-b-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{
          bottom: '24px',
          paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))',
        }}
      >
        <div className="flex h-14 items-center rounded-lg border border-border-visible bg-bg-canvas shrink-0">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-14 w-12 text-lg font-bold text-text-primary"
          >
            –
          </button>
          <span className="w-6 text-center text-[15px] font-bold tabular-nums text-text-primary" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-14 w-12 text-lg font-bold text-text-primary"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={orderingDisabled}
          className={`flex h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-4 font-body text-base font-bold tabular-nums text-white active:scale-[0.98] ${
            orderingDisabled ? 'bg-text-secondary' : added ? 'bg-status-success' : 'bg-primary-base hover:bg-primary-pressed'
          }`}
        >
          {added && <Icon.Tick width="18" height="18" />}
          {buttonLabel}
        </button>
      </div>
    </>,
    document.body
  );
}
import React, { useLayoutEffect, useRef, useState } from 'react';

// One tab component for categories and sorting. A single underline slides with transform only.
// tabs: [{ id, label, count? }]. Weight changes never shift neighbours (hidden bold copy reserves width).

export default function UnderlineTabs({ tabs, activeId, onSelect, ariaLabel, bordered = true, className = '' }) {
  const scrollerRef = useRef(null);
  const refs = useRef({});
  const first = useRef(true);
  const [bar, setBar] = useState({ x: 0, w: 0, animate: false });
  const [canScroll, setCanScroll] = useState(false);
  const key = tabs.map((t) => `${t.id}:${t.count ?? ''}`).join('|');

  useLayoutEffect(() => {
    const measure = () => {
      const el = refs.current[activeId];
      const scroller = scrollerRef.current;
      if (!el || !scroller) return;
      setBar({ x: el.offsetLeft, w: el.offsetWidth, animate: !first.current });
      first.current = false;
      const overflowing = scroller.scrollWidth > scroller.clientWidth + 1;
      setCanScroll(overflowing);
      if (overflowing) {
        scroller.scrollTo({ left: el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeId, key]);

  const fade = canScroll ? 'linear-gradient(to right, #000 calc(100% - 32px), transparent)' : undefined;

  return (
    <nav aria-label={ariaLabel} className={`${bordered ? 'border-b border-border-visible' : ''} ${className}`}>
      <div
        ref={scrollerRef}
        className="no-scrollbar relative flex overflow-x-auto"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        {tabs.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              ref={(el) => (refs.current[t.id] = el)}
              type="button"
              onClick={() => onSelect(t.id)}
              aria-current={active ? 'true' : undefined}
              className={`flex h-12 shrink-0 items-center gap-2 whitespace-nowrap px-4 text-[15px] active:scale-[0.97] ${
                active ? 'text-text-primary' : 'text-text-secondary'
              }`}
            >
              <span
                data-text={t.label}
                className={`inline-flex flex-col items-center after:invisible after:h-0 after:overflow-hidden after:font-semibold after:content-[attr(data-text)] ${
                  active ? 'font-semibold' : 'font-medium'
                }`}
              >
                {t.label}
              </span>
              {t.count != null && <span className="text-[13px] font-normal tabular-nums text-text-secondary">{t.count}</span>}
            </button>
          );
        })}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-[100px] origin-left bg-primary-base"
          style={{
            transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})`,
            transition: bar.animate ? 'transform var(--duration-standard) var(--ease-standard)' : 'none',
          }}
        />
      </div>
    </nav>
  );
}
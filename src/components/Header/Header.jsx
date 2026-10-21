import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useCart } from '../../context/CartContext';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'orders', label: 'Orders' },
  { id: 'account', label: 'Account' },
];

export default function Header({
  activeTab = 'home',
  onTabChange,
  currentArea = '',
  currentCity = '',
  onOpenLocationModal,
  onOpenCart,
  onOpenSearch,
}) {
  const { totalCount } = useCart();
  const [bump, setBump] = useState(false);
  const prevCount = useRef(totalCount);
  const navRefs = useRef({});
  const firstBar = useRef(true);
  const [bar, setBar] = useState({ x: 0, w: 0, show: false, animate: false });

  useEffect(() => {
    const increased = totalCount > prevCount.current;
    prevCount.current = totalCount;
    if (!increased) return undefined;
    setBump(true);
    const t = setTimeout(() => setBump(false), 200);
    return () => clearTimeout(t);
  }, [totalCount]);

  useLayoutEffect(() => {
    const el = navRefs.current[activeTab];
    if (!el) return setBar((b) => ({ ...b, show: false }));
    setBar({ x: el.offsetLeft, w: el.offsetWidth, show: true, animate: !firstBar.current });
    firstBar.current = false;
    return undefined;
  }, [activeTab]);

  const place = [currentArea, currentCity].filter(Boolean).join(', ');

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 bg-secondary-olive px-4 sm:px-6">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-3">
        <button type="button" onClick={() => onTabChange?.('home')} className="flex shrink-0 items-center gap-2.5" aria-label="Kenneth Kitchen home">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#CF3A0E" />
            <path d="M9 19c0-3.866 3.134-7 7-7s7 3.134 7 7H9z" fill="#FFFFFF" />
            <circle cx="16" cy="10" r="2" fill="#FFFFFF" />
          </svg>
          <span className="hidden items-baseline gap-1 sm:flex">
            <span className="font-heading text-[17px] font-extrabold leading-none text-white">Kenneth</span>
            <span className="font-heading text-[13px] font-normal leading-none text-[#FF8A5C]">Kitchen</span>
          </span>
        </button>

        <nav className="relative hidden h-full flex-1 items-center justify-center gap-2 md:flex" aria-label="Main">
          <div className="relative flex h-full items-center">
            {NAV.map((link) => {
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  ref={(el) => (navRefs.current[link.id] = el)}
                  type="button"
                  onClick={() => onTabChange?.(link.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`h-full px-4 text-[15px] active:scale-[0.97] ${active ? 'font-semibold text-white' : 'font-medium text-[#C9D3CB] hover:text-white'}`}
                >
                  {link.label}
                </button>
              );
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-[100px] origin-left bg-[#FF7A4D]"
              style={{
                opacity: bar.show ? 1 : 0,
                transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})`,
                transition: bar.animate ? 'transform var(--duration-standard) var(--ease-standard)' : 'none',
              }}
            />
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search dishes and kitchens"
            className="hidden h-12 w-12 items-center justify-center rounded-lg text-[#C9D3CB] hover:text-white md:flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            type="button"
            onClick={onOpenLocationModal}
            aria-label={`Delivery area: ${place}. Change.`}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/20 px-3 text-white md:max-w-[240px] md:flex-none"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate text-[14px]">{place || 'Choose area'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="shrink-0 text-[#C9D3CB]" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            data-cart-target
            onClick={onOpenCart}
            aria-label={`Cart, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white active:scale-[0.97] sm:w-auto sm:gap-2 sm:px-4"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="hidden text-[15px] font-medium sm:inline">Cart</span>
            {totalCount > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF7A4D] px-1 text-[13px] font-bold leading-none tabular-nums text-text-primary"
                style={{ transform: bump ? 'scale(1.15)' : 'scale(1)', transition: 'transform var(--duration-standard) var(--ease-standard)' }}
              >
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
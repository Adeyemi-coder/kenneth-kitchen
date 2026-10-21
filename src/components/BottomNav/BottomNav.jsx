import React from 'react';

// Four tabs, as in the spec: Home, Search, Orders, Account. The cart lives in the sticky CartBar,
// so the nav no longer spends a tab on it and Account is reachable on phones again.
// One 3px olive bar slides between tabs with transform. No shadow, 13px labels, 56px+ targets.

const TABS = [
  { id: 'home', label: 'Home', icon: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></> },
  { id: 'search', label: 'Search', icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></> },
  { id: 'orders', label: 'Orders', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></> },
  { id: 'account', label: 'Account', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></> },
];

export default function BottomNav({ activeTab = 'home', onTabChange }) {
  const index = Math.max(0, TABS.findIndex((t) => t.id === activeTab));

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border-visible bg-white pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      <div className="relative grid h-16 grid-cols-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 h-[3px] w-1/4 bg-secondary-olive"
          style={{ transform: `translateX(${index * 100}%)`, transition: 'transform var(--duration-standard) var(--ease-standard)' }}
        />
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange?.(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 active:scale-[0.97] ${
                active ? 'text-secondary-olive' : 'text-text-secondary'
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {tab.icon}
              </svg>
              <span className="text-[13px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
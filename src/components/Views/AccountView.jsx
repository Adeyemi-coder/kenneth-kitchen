import React from 'react';
import AccountRow from '../Common/AccountRow';
import VendorCard from '../VendorCard/VendorCard';
import { vendorKey } from '../../utils/normalizeUtils';

const naira = new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 });

const SUPPORT_EMAIL = 'hello@kennethkitchen.ng';
const SUPPORT_WHATSAPP = '+2348030000000';

/**
 * Account tab view. Profile, stats, delivery area, favourites, settings.
 */
export default function AccountView({
  user,
  orderHistory,
  totalSpent,
  favorites,
  favoriteVendors,
  cityVendors,
  selectedCity,
  selectedArea,
  notificationsOn,
  onToggleNotifications,
  onOpenLocation,
  onOpenOrders,
  onSignOut,
  onBrowse,
  onOpenVendor,
  onToggleFavorite,
}) {
  const initial = (user?.name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-4">
      {/* Profile header */}
      <section className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-base font-heading text-2xl font-extrabold text-white">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-[24px] font-extrabold leading-8 text-text-primary">
            {user?.name || user?.email || 'Your account'}
          </h1>
          {user?.name && user?.email && (
            <p className="truncate text-[14px] text-text-secondary">{user.email}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="hidden h-10 shrink-0 rounded-lg border border-border-visible bg-white px-4 text-[14px] font-medium text-text-primary active:scale-[0.97] sm:inline-flex sm:items-center"
        >
          Sign out
        </button>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 divide-x divide-border-visible overflow-hidden rounded-xl border border-border-visible bg-white">
        <div className="flex flex-col items-center gap-1 py-4">
          <span className="font-heading text-lg font-extrabold tabular-nums">
            {orderHistory.length}
          </span>
          <span className="text-[12px] uppercase tracking-wide text-text-secondary">
            Orders
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 py-4">
          <span className="font-heading text-lg font-extrabold tabular-nums">
            {favorites.length}
          </span>
          <span className="text-[12px] uppercase tracking-wide text-text-secondary">
            Favourites
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 py-4">
          <span className="font-heading text-lg font-extrabold tabular-nums">
            ₦{naira.format(totalSpent)}
          </span>
          <span className="text-[12px] uppercase tracking-wide text-text-secondary">
            Spent
          </span>
        </div>
      </section>

      {/* Delivery area */}
      <section className="rounded-xl border border-border-visible bg-white p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-olive/10 text-secondary-olive">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <div>
              <p className="text-[13px] font-medium uppercase tracking-wide text-text-secondary">
                Delivery area
              </p>
              <p className="mt-0.5 text-[16px] font-medium text-text-primary">
                {selectedArea}, {selectedCity}
              </p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {cityVendors.length > 0
                  ? `${cityVendors.length} ${
                      cityVendors.length === 1 ? 'kitchen' : 'kitchens'
                    } deliver here`
                  : 'No kitchens deliver here yet'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenLocation}
            className="h-10 shrink-0 rounded-lg border border-border-visible px-3 text-[14px] font-medium text-secondary-olive active:scale-[0.97]"
          >
            Change
          </button>
        </div>
      </section>

      {/* Favourites */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-lg font-bold text-text-primary">Favourites</h2>
          {favoriteVendors.length > 0 && (
            <button
              type="button"
              onClick={onBrowse}
              className="text-[13px] font-medium text-secondary-olive underline underline-offset-2"
            >
              Add more
            </button>
          )}
        </div>

        {favoriteVendors.length === 0 ? (
          <div className="rounded-xl border border-border-visible bg-white px-6 py-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-bg-canvas text-text-secondary">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </span>
            <p className="mt-3 font-heading text-[15px] font-bold text-text-primary">
              No favourites yet
            </p>
            <p className="mt-1 text-[13px] text-text-secondary">
              Tap the heart on a kitchen to save it here.
            </p>
            <button
              type="button"
              onClick={onBrowse}
              className="mt-4 h-11 rounded-lg bg-primary-base px-5 text-[14px] font-semibold text-white active:scale-[0.97]"
            >
              Browse kitchens
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {favoriteVendors.map((v, i) => (
              <li key={vendorKey(v, i)}>
                <VendorCard
                  vendor={v}
                  variant="row"
                  onClick={onOpenVendor}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Settings */}
      <section className="overflow-hidden rounded-xl border border-border-visible bg-white">
        <div className="flex items-center gap-4 border-b border-border-visible px-4 py-3.5">
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
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-text-primary">
              Notifications
            </span>
            <span className="mt-0.5 block text-[13px] text-text-secondary">
              {notificationsOn ? 'Order updates are on' : 'Order updates are off'}
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsOn}
            aria-label="Toggle notifications"
            onClick={onToggleNotifications}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              notificationsOn ? 'bg-primary-base' : 'bg-border-visible'
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                notificationsOn ? 'left-0.5 translate-x-5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        <AccountRow
          icon={
            <>
              <path d="M12 8v5l3 2" />
              <circle cx="12" cy="12" r="9" />
            </>
          }
          label="Order history"
          hint={
            orderHistory.length > 0
              ? `${orderHistory.length} ${
                  orderHistory.length === 1 ? 'order' : 'orders'
                }`
              : 'Nothing here yet'
          }
          onClick={onOpenOrders}
        />

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
            `Support request from ${user?.email ?? user?.name ?? ''}`
          )}`}
          className="flex w-full items-center gap-4 border-b border-border-visible px-4 py-3.5 text-left active:bg-bg-canvas"
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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-text-primary">
              Email support
            </span>
            <span className="mt-0.5 block text-[13px] text-text-secondary">
              {SUPPORT_EMAIL}
            </span>
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
        </a>

        <a
          href={`https://wa.me/${SUPPORT_WHATSAPP.replace(
            /[^0-9]/g,
            ''
          )}?text=${encodeURIComponent(
            'Hi Kenneth Kitchen, I need help with my account.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-4 px-4 py-3.5 text-left active:bg-bg-canvas"
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
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium text-text-primary">
              Chat on WhatsApp
            </span>
            <span className="mt-0.5 block text-[13px] text-text-secondary">
              {SUPPORT_WHATSAPP}
            </span>
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
        </a>
      </section>

      {/* Sign out — mobile only */}
      <button
        type="button"
        onClick={onSignOut}
        className="h-12 w-full rounded-xl border border-border-visible bg-white text-[15px] font-semibold text-status-error active:scale-[0.99] sm:hidden"
      >
        Sign out
      </button>
    </div>
  );
}

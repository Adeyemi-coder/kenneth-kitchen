import React, { useState } from 'react';
import { formatNaira } from '../../core/utils/currencyFormatter';

// Two variants, one component.
//   variant="feature": 280px card for the meal-time row. Photo, then a solid olive caption bar.
//   variant="row":     compact list row with an 88px thumbnail (light on data, per the spec).
// Whole card is clickable through the title button's ::after (stretched link). Closed kitchens stay openable.
// Reads both data shapes: etaRange text or etaMin/etaMax; reviewsCount or reviewCount.

function Heart({ name, active, onToggle, className }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={Boolean(active)}
      aria-label={active ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      className={`z-10 flex h-12 w-12 items-center justify-center ${className}`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-visible bg-white">
        <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? '#CF3A0E' : 'none'} stroke={active ? '#CF3A0E' : '#111618'} strokeWidth="2.2" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </span>
    </button>
  );
}

const linkClass =
  "text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2";

export default function VendorCard({ vendor, variant = 'row', index = 0, onClick, onToggleFavorite, isFavorite }) {
  const [failed, setFailed] = useState(false);
  if (!vendor) return null;

  const { id, name, area, landmark, rating, isOpen, closedLabel, distanceKm, deliveryFee, dishesLine, imageUrl, isSponsored, category } = vendor;
  const reviews = vendor.reviewsCount ?? vendor.reviewCount ?? 0;
  const eta = vendor.etaRange ?? `${vendor.etaMin}–${vendor.etaMax} min`;
  const fav = isFavorite ?? vendor.isFavorite;
  const showImage = Boolean(imageUrl) && !failed;
  const hasRating = typeof rating === 'number' && reviews > 0;
  const stagger = index < 6 ? `animate-entrance motion-stagger-${index}` : '';
  const fee = deliveryFee === 0 ? 'Free delivery' : `${formatNaira(deliveryFee)} delivery`;
  const img = showImage && (
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`vendor-card-media absolute inset-0 h-full w-full object-cover ${isOpen ? '' : 'grayscale'}`}
    />
  );

  if (variant === 'feature') {
    return (
      <article className={`relative flex w-full flex-col overflow-hidden rounded-xl border border-border-visible bg-white ${stagger}`}>
        <div className="relative aspect-[16/10] bg-secondary-olive">
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-[15px] text-[#C9D3CB]">{category}</div>
          {img}
          <Heart name={name} active={fav} onToggle={() => onToggleFavorite?.(id)} className="absolute right-1 top-1" />
        </div>
        <div className="flex flex-1 flex-col gap-1 bg-secondary-olive p-3 text-white">
          <h3 className="font-heading text-base font-bold leading-snug">
            <button type="button" onClick={() => onClick?.(vendor)} className={`${linkClass} focus-visible:after:outline-[#FF8A5C]`}>
              {name}
            </button>
          </h3>
          <p className="flex items-baseline justify-between gap-3 text-sm tabular-nums text-[#C9D3CB]">
            <span>{eta}</span>
            <span className={deliveryFee === 0 ? 'font-medium text-white' : ''}>{fee}</span>
          </p>
          {isSponsored && <p className="text-[13px] text-[#C9D3CB]">Sponsored</p>}
        </div>
      </article>
    );
  }

  return (
    <article className={`relative flex gap-4 border-b border-border-visible py-4 ${stagger}`}>
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-lg bg-[#ECEAE6]">{img}</div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 pr-10">
        <h3 className="font-heading text-[17px] font-bold leading-snug text-text-primary">
          <button type="button" onClick={() => onClick?.(vendor)} className={`${linkClass} focus-visible:after:outline-primary-base`}>
            {name}
          </button>
        </h3>
        <p className="text-sm tabular-nums text-text-primary">
          {hasRating ? (
            <span aria-label={`Rated ${rating.toFixed(1)} from ${reviews} reviews`}>
              <span aria-hidden="true">★ </span>
              {rating.toFixed(1)} <span className="text-text-secondary">({reviews})</span>
            </span>
          ) : (
            <span className="text-text-secondary">New, no ratings yet</span>
          )}
        </p>
        <p className="line-clamp-2 text-sm text-text-secondary">{dishesLine}</p>
        <p className="text-[13px] text-text-secondary">
          <span className="font-medium text-text-primary">{area}</span>
          {landmark && <span className="ml-2">{landmark}</span>}
        </p>
        {isOpen ? (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-4 text-sm tabular-nums text-text-primary">
            <span className="font-medium">{eta}</span>
            <span className="text-text-secondary">{distanceKm} km</span>
            <span className={deliveryFee === 0 ? 'font-medium text-status-success' : 'text-text-secondary'}>{fee}</span>
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-status-pending">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            {closedLabel ?? 'Closed'}
          </p>
        )}
        {isSponsored && <p className="text-[13px] text-text-secondary">Sponsored</p>}
      </div>

      <Heart name={name} active={fav} onToggle={() => onToggleFavorite?.(id)} className="absolute right-0 top-2" />
    </article>
  );
}
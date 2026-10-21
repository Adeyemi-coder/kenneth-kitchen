import React from 'react';
import { styles } from './RestaurantCard.styles';
import { formatNaira } from '../../core/utils/currencyFormatter';
import { formatEtaRange } from '../../core/utils/etaFormatter';

export default function RestaurantCard({ vendor, onClick }) {
  if (!vendor) return null;

  const {
    name,
    rating,
    etaMin,
    etaMax,
    distanceKm,
    deliveryFee,
    tags = [],
    imageUrl,
    isPromoted
  } = vendor;

  return (
    <article 
      onClick={() => onClick?.(vendor)}
      className={styles.card}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.(vendor);
        }
      }}
    >
      {/* Food Banner */}
      <div className={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt={name} 
          className={styles.image}
          loading="lazy"
        />
        {isPromoted && (
          <span className={styles.promotedBadge}>Sponsored</span>
        )}
      </div>

      {/* Vendor Details */}
      <div className={styles.content}>
        <div>
          <div className={styles.headerRow}>
            <h3 className={styles.title}>{name}</h3>
            
            {/* Safe Rating Display: Renders "New" if rating is null */}
            {rating != null ? (
              <div className={styles.ratingBadge} aria-label={`Rating ${rating} stars`}>
                <span className={styles.ratingStar}>★</span>
                <span>{Number(rating).toFixed(1)}</span>
              </div>
            ) : (
              <span className="text-[10px] font-heading font-extrabold uppercase text-[#243628] bg-[#243628]/10 px-2 py-0.5 rounded">
                New
              </span>
            )}
          </div>

          <div className={styles.metaRow}>
            <span>{formatEtaRange(etaMin, etaMax)}</span>
            <span className={styles.metaDot} />
            <span>{distanceKm} km</span>
            <span className={styles.metaDot} />
            <span className={styles.feeText}>
              {deliveryFee === 0 ? 'Free delivery' : `${formatNaira(deliveryFee)} delivery`}
            </span>
          </div>
        </div>

        {/* Cuisine Tags */}
        {tags && tags.length > 0 && (
          <div className={styles.tagList} aria-label="Cuisine Tags">
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
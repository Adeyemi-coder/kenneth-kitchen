import React from 'react';
import { MOCK_REVIEWS } from '../../features/discovery/vendorData';

export default function ReviewMarquee() {
  const duplicatedReviews = [...MOCK_REVIEWS, ...MOCK_REVIEWS];

  return (
    <section className="w-full flex flex-col gap-3 overflow-hidden py-1">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-heading font-bold text-base text-text-primary m-0">
          What our customers say
        </h2>
        <span className="font-body text-xs text-text-secondary">
          ★ 4.9 from 1,400+ verified orders in Ilorin
        </span>
      </div>

      {/* Marquee Track with Edge Fades */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-bg-canvas to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-bg-canvas to-transparent" />

        <div className="animate-marquee gap-4 py-2">
          {duplicatedReviews.map((rev, index) => (
            <article
              key={`${rev.id}-${index}`}
              className="w-[300px] sm:w-[350px] shrink-0 rounded-2xl border border-border-visible bg-white p-5 flex flex-col justify-between gap-4 select-none hover:border-text-primary transition-colors shadow-xs"
            >
              {/* Star Rating & Quote */}
              <div className="flex flex-col gap-2.5">
                <div className="flex gap-1 text-[#111618] text-base" aria-label={`${rev.stars} out of 5 stars`}>
                  {'★'.repeat(rev.stars)}
                </div>
                <blockquote className="m-0 font-body text-sm leading-relaxed text-text-primary line-clamp-3">
                  “{rev.quote}”
                </blockquote>
              </div>

              {/* Hairline Divider & Author Meta */}
              <div className="pt-3 border-t border-border-visible flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#243628]/10 border border-[#243628]/20 flex items-center justify-center font-heading font-bold text-xs text-[#243628] shrink-0">
                  {rev.initials}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-sm text-text-primary m-0 truncate">
                    {rev.name}
                  </h3>
                  <p className="font-body text-xs text-text-secondary m-0 truncate">
                    {rev.area}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
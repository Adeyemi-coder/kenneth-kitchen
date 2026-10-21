import React, { useRef } from 'react';

// Dedicated horizontal review scroller for the vendor page with 48px prev/next controls and scroll-snap
export default function ReviewsList({ reviews = [] }) {
  const scrollRef = useRef(null);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto py-6 border-t border-border-visible flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-[20px] text-text-primary m-0">
            Kitchen reviews
          </h2>
          <p className="font-body text-[14px] text-text-secondary m-0">
            Verified orders from nearby customers
          </p>
        </div>

        {/* 48px previous and next navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous reviews"
            className="w-12 h-12 rounded-lg border border-border-visible bg-white hover:bg-bg-canvas flex items-center justify-center cursor-pointer text-text-primary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next reviews"
            className="w-12 h-12 rounded-lg border border-border-visible bg-white hover:bg-bg-canvas flex items-center justify-center cursor-pointer text-text-primary transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Snap container with horizontal scrolling */}
      <div className="relative w-full max-w-full min-w-0">
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label="Customer review cards"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 pt-1 no-scrollbar outline-none"
        >
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="snap-start shrink-0 w-[290px] sm:w-[340px] rounded-xl border border-border-visible bg-white p-4 flex flex-col justify-between gap-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  {/* Text star representation with accessible aria-label */}
                  <span
                    className="font-body text-[14px] text-text-primary tracking-tight"
                    aria-label={`${rev.stars} out of 5 stars`}
                  >
                    {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}
                  </span>
                  <span className="font-body text-[13px] text-text-secondary">
                    {rev.date}
                  </span>
                </div>

                <p className="font-body font-medium text-[13px] text-[#243628] m-0 truncate">
                  Ordered: {rev.dish}
                </p>

                <p className="font-body text-[14px] leading-5 text-text-primary m-0 line-clamp-3">
                  “{rev.text}”
                </p>
              </div>

              {/* Author and neighborhood rendered cleanly as text without avatars */}
              <div className="pt-2 border-t border-border-visible flex items-center justify-between text-[13px] font-body text-text-secondary">
                <span className="font-bold text-text-primary">{rev.author}</span>
                <span>{rev.area}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
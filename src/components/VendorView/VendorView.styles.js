export const styles = {
  container: `
    flex flex-col gap-6 animate-fadeIn
  `,
  backButton: `
    inline-flex items-center gap-2 text-xs font-heading font-bold text-text-secondary 
    hover:text-text-primary transition-colors cursor-pointer w-fit
  `,
  heroBanner: `
    relative h-56 sm:h-72 w-full rounded-2xl overflow-hidden border border-border-visible
  `,
  heroImage: `
    w-full h-full object-cover
  `,
  metaCard: `
    bg-surface-card border border-border-visible rounded-2xl p-5 -mt-10 sm:-mt-14 relative z-10 mx-3 shadow-md
  `,
  vendorTitle: `
    font-heading font-extrabold text-xl sm:text-2xl text-text-primary
  `,
  metaPillRow: `
    flex flex-wrap items-center gap-3 mt-3 text-xs font-body font-semibold text-text-secondary
  `,
  ratingBadge: `
    flex items-center gap-1 bg-bg-canvas px-2.5 py-1 rounded-md border border-border-visible text-text-primary
  `,
  dishGrid: `
    grid grid-cols-1 md:grid-cols-2 gap-4
  `,
  dishCard: `
    bg-surface-card border border-border-visible rounded-2xl p-4 flex gap-4 
    hover:border-[#FF7A4D] transition-all cursor-pointer select-none
  `,
  dishThumb: `
    w-24 h-24 rounded-xl object-cover border border-border-visible flex-shrink-0 bg-bg-canvas
  `,
  dishInfo: `
    flex-1 flex flex-col justify-between min-w-0
  `,
  dishName: `
    font-heading font-bold text-sm text-text-primary truncate
  `,
  dishSnippet: `
    font-body text-xs text-text-secondary line-clamp-2 mt-1
  `,
  dishPrice: `
    font-body font-bold text-xs text-primary-base mt-2 tabular-nums
  `
};
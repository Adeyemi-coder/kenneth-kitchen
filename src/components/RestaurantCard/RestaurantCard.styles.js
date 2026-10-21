export const styles = {
  card: `
    group relative bg-surface-card border border-border-visible 
    rounded-2xl overflow-hidden flex flex-col 
    transition-all duration-200 ease-out 
    hover:border-ui-control-strong hover:shadow-md
    active:scale-[0.99] cursor-pointer
  `,
  imageWrapper: `
    relative w-full h-44 sm:h-48 overflow-hidden bg-[#1C2621]/10 flex-shrink-0
  `,
  image: `
    w-full h-full object-cover object-center 
    transition-transform duration-300 ease-out group-hover:scale-105
  `,
  promotedBadge: `
    absolute top-3 left-3 px-2 py-0.5 
    bg-[#1C2621]/90 backdrop-blur-xs text-white 
    text-[10px] font-heading font-bold uppercase tracking-wider rounded-md
  `,
  content: `
    p-4 flex flex-col justify-between flex-1 gap-2.5
  `,
  headerRow: `
    flex items-center justify-between gap-2
  `,
  title: `
    font-heading font-bold text-base sm:text-lg text-text-primary truncate 
    group-hover:text-primary-base transition-colors
  `,
  ratingBadge: `
    flex items-center gap-1 text-xs font-heading font-bold text-text-primary 
    bg-bg-canvas px-2 py-1 rounded-md border border-border-visible flex-shrink-0
  `,
  ratingStar: `
    text-[#FF7A4D] text-xs
  `,
  metaRow: `
    font-body text-xs sm:text-sm text-text-secondary flex items-center gap-2
  `,
  metaDot: `
    w-1 h-1 rounded-full bg-ui-control
  `,
  feeText: `
    font-body text-xs sm:text-sm font-bold text-primary-base tabular-nums
  `,
  tagList: `
    flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar scrollbar-none pt-1
  `,
  tag: `
    text-[11px] font-body font-medium text-text-secondary bg-bg-canvas 
    border border-border-visible px-2.5 py-1 rounded-md whitespace-nowrap flex-shrink-0
  `
};
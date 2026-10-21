// FIX: Decoupled style tokens with generous mobile clearance for the bottom bar
export const styles = {
  overlay: `
    animate-overlay-in fixed inset-0 z-[9999] 
    flex items-end justify-center bg-[#111618]/50 
    md:items-center md:p-6
  `,
  // FIX: Anchor on mobile with top-[14%] to bottom-0 so the panel is strictly constrained within the visible window
  panel: `
    dish-panel fixed inset-x-0 bottom-0 top-[14%] md:top-auto md:static 
    flex w-full max-w-full flex-col overflow-hidden rounded-t-2xl border-t border-border-visible 
    bg-white md:h-auto md:max-h-[calc(100dvh-3rem)] md:max-w-[640px] md:rounded-2xl md:border
  `,
  closeButton: `
    absolute right-3 top-3 z-10 flex h-11 w-11 
    items-center justify-center rounded-full bg-white 
    text-text-primary border border-border-visible cursor-pointer
  `,
  // FIX: min-h-0 with pb-8 so internal content scrolls without colliding with the footer
  scrollArea: `
    min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-6
  `,
  heroWrapper: `
    dish-hero-media aspect-video w-full bg-[#ECEAE6] md:aspect-[2/1] shrink-0
  `,
  heroImage: `
    h-full w-full object-cover
  `,
  contentPadding: `
    flex flex-col gap-5 p-4 md:p-6
  `,
  titleSection: `
    flex flex-col gap-1 min-w-0
  `,
  dishTitle: `
    font-heading font-extrabold text-[22px] leading-7 text-text-primary m-0 break-words
  `,
  dishDescription: `
    font-body text-sm leading-5 text-text-secondary m-0
  `,
  basePrice: `
    font-body font-bold text-lg tabular-nums text-text-primary mt-1
  `,
  groupSection: `
    border-t border-border-visible pt-4 flex flex-col gap-1 min-w-0
  `,
  groupHeader: `
    flex items-center justify-between mb-0.5
  `,
  groupHeading: `
    font-heading font-bold text-base text-text-primary m-0
  `,
  statusBadge: `
    font-body text-[13px] font-medium flex items-center gap-1
  `,
  optionsContainer: `
    flex flex-col
  `,
  optionRow: `
    h-14 flex items-center justify-between border-b border-border-visible 
    cursor-pointer min-w-0 select-none
  `,
  optionLeft: `
    flex items-center gap-3 min-w-0 flex-1 pr-2
  `,
  controlOuter: `
    w-6 h-6 flex items-center justify-center shrink-0 border-2 transition-transform duration-120
  `,
  controlInnerRadio: `
    w-2 h-2 rounded-full bg-white
  `,
  optionLabel: `
    font-body text-[15px] text-text-primary overflow-hidden text-ellipsis whitespace-nowrap
  `,
  optionPriceDelta: `
    font-body tabular-nums text-sm text-text-secondary shrink-0
  `,
  kitchenNoteSection: `
    border-t border-border-visible pt-4 flex flex-col gap-1.5
  `,
  kitchenNoteHeader: `
    flex justify-between items-center
  `,
  kitchenNoteLabel: `
    font-heading font-bold text-base text-text-primary
  `,
  kitchenNoteCounter: `
    font-body text-[13px] text-text-secondary
  `,
  kitchenNoteInput: `
    w-full p-3 rounded-lg border border-border-visible 
    font-body text-sm text-text-primary bg-bg-canvas 
    resize-none focus:outline-none
  `,
  // FIX: Extra bottom padding (pb-20 on mobile, pb-4 on desktop) lifting the button clean above mobile browser search bars
  footer: `
    shrink-0 bg-white border-t border-border-visible p-4 
    pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:pb-4 
    flex items-center gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]
  `,
  quantityWrapper: `
    flex items-center border border-border-visible rounded-lg h-14 bg-bg-canvas shrink-0
  `,
  quantityButton: `
    w-12 h-14 border-none bg-transparent font-body text-lg font-bold text-text-primary cursor-pointer
  `,
  quantityDisplay: `
    font-body tabular-nums text-[15px] font-bold w-6 text-center text-text-primary
  `,
  primaryActionButton: `
    flex-1 h-14 rounded-lg text-white border-none flex items-center 
    justify-center px-4 cursor-pointer font-heading font-bold 
    text-base transition-colors duration-120
  `
};
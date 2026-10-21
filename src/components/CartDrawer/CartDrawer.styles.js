export const styles = {
  overlay: `
    animate-overlay-in fixed inset-0 z-[9990] 
    flex items-end justify-end bg-[#111618]/50
  `,
  // FIX: Explicitly pins panel to top-[10%] on mobile so it cannot extend below the viewport
  panel: `
    dish-panel fixed inset-x-0 bottom-0 top-[10%] md:top-0 md:bottom-0 md:left-auto md:right-0 
    flex w-full max-w-full md:max-w-[460px] 
    flex-col overflow-hidden bg-white rounded-t-2xl md:rounded-none border-t md:border-t-0 md:border-l border-border-visible 
    shadow-none
  `,
  header: `
    flex-none h-14 bg-white border-b border-border-visible px-4 
    flex items-center justify-between z-10
  `,
  headerTitle: `
    font-heading font-bold text-base text-text-primary m-0
  `,
  closeButton: `
    w-10 h-10 flex items-center justify-center text-text-primary 
    border border-border-visible rounded-full bg-white cursor-pointer
  `,
  body: `
    min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-5 
    overscroll-contain pb-6
  `,
  emptyState: `
    flex-1 flex flex-col items-center justify-center text-center p-6 gap-2
  `,
  itemRow: `
    py-3 border-b border-border-visible flex flex-col gap-2 min-w-0
  `,
  itemTopRow: `
    flex items-start justify-between gap-3 min-w-0
  `,
  itemName: `
    font-heading font-bold text-base text-text-primary m-0 truncate
  `,
  itemOptions: `
    font-body text-[13px] leading-5 text-text-secondary m-0
  `,
  itemPrice: `
    font-body font-bold text-base tabular-nums text-text-primary shrink-0
  `,
  itemBottomRow: `
    flex items-center justify-between pt-1
  `,
  removeButton: `
    font-body text-[13px] font-medium text-status-error bg-transparent 
    border-none p-0 cursor-pointer hover:underline
  `,
  stepper: `
    flex items-center border border-border-visible rounded-lg h-9 bg-bg-canvas
  `,
  stepperButton: `
    w-9 h-9 border-none bg-transparent font-body text-base font-bold 
    text-text-primary cursor-pointer flex items-center justify-center
  `,
  stepperCount: `
    font-body tabular-nums text-sm font-bold w-6 text-center text-text-primary
  `,
  minimumOrderBanner: `
    border-t border-border-visible pt-3 flex items-center gap-2 
    text-status-pending text-[13px] font-body font-medium
  `,
  riderNoteSection: `
    border-t border-border-visible pt-4 flex flex-col gap-1.5
  `,
  riderNoteLabel: `
    font-heading font-bold text-sm text-text-primary
  `,
  riderNoteInput: `
    w-full p-2.5 rounded-lg border border-border-visible font-body 
    text-sm text-text-primary bg-bg-canvas resize-none focus:outline-none
  `,
  feeBlock: `
    border-t border-border-visible pt-4 flex flex-col gap-2 text-sm font-body
  `,
  feeRow: `
    flex items-center justify-between text-text-secondary
  `,
  feeRowTotal: `
    flex items-center justify-between text-text-primary font-bold text-base pt-2 
    border-t border-border-visible
  `,
  // FIX: Added pb-[calc(5rem+env(safe-area-inset-bottom,0px))] so the button clears the Safari address bar
  footer: `
    shrink-0 bg-white border-t border-border-visible p-4 
    pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-4 z-20 
    shadow-[0_-4px_16px_rgba(0,0,0,0.06)]
  `,
  checkoutButton: `
    w-full h-14 rounded-lg text-white border-none flex items-center 
    justify-center px-4 cursor-pointer font-heading font-bold text-base 
    transition-colors duration-120 disabled:opacity-50 disabled:cursor-not-allowed
  `
};
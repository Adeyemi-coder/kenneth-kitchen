export const styles = {
  overlay: `
    animate-overlay-in fixed inset-0 z-[9995] 
    flex items-end justify-center bg-[#111618]/50 
    md:items-center md:p-6
  `,
  // FIX: Hard-pinned top-[8%] to bottom-0 on mobile, strictly inset-x-0 with w-full to stop horizontal pan and left-clipping
  panel: `
    dish-panel fixed inset-x-0 bottom-0 top-[8%] md:top-auto md:static 
    flex w-full max-w-full flex-col overflow-hidden rounded-t-2xl border-t border-border-visible 
    bg-white md:h-auto md:max-h-[calc(100dvh-3rem)] md:max-w-[560px] md:rounded-2xl md:border
    box-border m-0
  `,
  header: `
    flex-none h-14 bg-white border-b border-border-visible px-4 
    flex items-center justify-between z-10
  `,
  headerTitle: `
    font-heading font-bold text-base text-text-primary m-0 truncate
  `,
  closeButton: `
    w-10 h-10 flex items-center justify-center text-text-primary 
    border border-border-visible rounded-full bg-white cursor-pointer shrink-0
  `,
  // FIX: min-h-0 with overflow-x-hidden and px-4 guarantees content never pushes beyond viewport
  body: `
    min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-5 
    overscroll-contain pb-6 box-border
  `,
  section: `
    flex flex-col gap-2 min-w-0
  `,
  sectionHeader: `
    flex items-center justify-between
  `,
  sectionTitle: `
    font-heading font-bold text-sm text-text-primary m-0
  `,
  editLink: `
    font-body text-[13px] font-medium text-[#CF3A0E] bg-transparent border-none p-0 cursor-pointer hover:underline
  `,
  deliveryCard: `
    p-3 rounded-lg border border-border-visible bg-bg-canvas flex flex-col gap-1 text-sm font-body
  `,
  methodRow: `
    min-h-[64px] p-3 rounded-lg border border-border-visible 
    flex items-center justify-between cursor-pointer select-none
    transition-colors duration-120
  `,
  methodRowSelected: `
    border-[#243628] bg-[#243628]/5
  `,
  methodRowDisabled: `
    opacity-50 cursor-not-allowed bg-gray-50
  `,
  methodLeft: `
    flex items-center gap-3 min-w-0 flex-1 pr-2
  `,
  radioOuter: `
    w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-transform duration-120
  `,
  radioInner: `
    w-2 h-2 rounded-full bg-white
  `,
  methodTitle: `
    font-heading font-bold text-sm text-text-primary
  `,
  methodDesc: `
    font-body text-[13px] text-text-secondary leading-snug
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
  // FIX: shrink-0 with 5.5rem bottom clearance ensures CTA is completely above the floating browser address pill
  footer: `
    shrink-0 bg-white border-t border-border-visible p-4 
    pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-4 z-20 
    shadow-[0_-4px_16px_rgba(0,0,0,0.06)]
  `,
  submitButton: `
    w-full h-14 rounded-lg text-white border-none font-heading 
    font-bold text-base flex items-center justify-center cursor-pointer 
    transition-colors duration-120 disabled:opacity-50 disabled:cursor-not-allowed
  `
};
export const styles = {
  container: `
    bg-surface-card border border-border-visible rounded-2xl p-5 sm:p-6 
    flex flex-col gap-6 shadow-sm animate-fadeIn
  `,
  headerRow: `
    flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border-visible
  `,
  orderIdText: `
    font-heading font-extrabold text-lg sm:text-xl text-text-primary
  `,
  timeBadge: `
    font-body text-xs text-text-secondary bg-bg-canvas px-3 py-1 rounded-full border border-border-visible w-fit
  `,
  stepper: `
    flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 relative
  `,
  stepItem: `
    flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10
  `,
  stepCircle: `
    w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs transition-colors
  `,
  stepActive: `
    bg-[#243628] text-white border-2 border-[#FF7A4D]
  `,
  stepComplete: `
    bg-[#243628] text-white
  `,
  stepPending: `
    bg-bg-canvas text-text-secondary border border-border-visible
  `,
  stepLabel: `
    font-body text-xs font-medium text-text-primary
  `,
  summaryCard: `
    bg-bg-canvas border border-border-visible rounded-xl p-4 flex flex-col gap-2.5
  `,
  itemSummaryRow: `
    flex items-center justify-between text-xs font-body text-text-secondary
  `,
  backAction: `
    w-full sm:w-auto h-11 px-5 rounded-xl bg-secondary-olive hover:bg-[#1C2621] 
    text-white font-heading font-bold text-xs flex items-center justify-center transition-colors cursor-pointer
  `
};
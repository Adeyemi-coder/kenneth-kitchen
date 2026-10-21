export const styles = {
  overlay: `
    animate-overlay-in fixed inset-0 z-[9995] 
    flex items-end justify-center bg-[#111618]/50 
    md:items-center md:p-6
  `,
  // FIX: Hard-pin between top-[6%] and bottom-0 on mobile, strictly inset-x-0 to stop horizontal shift & left clipping
  panel: `
    dish-panel fixed inset-x-0 bottom-0 top-[6%] md:top-auto md:static 
    flex w-full max-w-full flex-col overflow-hidden rounded-t-2xl border-t border-border-visible 
    bg-white md:h-auto md:max-h-[85vh] md:max-w-[540px] md:rounded-2xl md:border
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
  // FIX: min-h-0 with overflow-x-hidden and overscroll-contain keeps scrolling strictly internal
  scrollArea: `
    min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col gap-4 
    overscroll-contain pb-6 box-border
  `,
  mapMock: `
    w-full h-40 bg-[#ECEAE6] rounded-xl border border-border-visible 
    relative flex items-center justify-center overflow-hidden shrink-0
  `,
  locateButton: `
    h-11 px-4 border border-border-visible rounded-lg font-heading font-bold 
    text-xs text-text-primary bg-white flex items-center justify-center 
    gap-2 cursor-pointer hover:bg-bg-canvas shrink-0
  `,
  fieldGroup: `
    flex flex-col gap-1 min-w-0
  `,
  label: `
    font-heading font-bold text-xs text-text-primary
  `,
  input: `
    w-full h-12 px-3 rounded-lg border border-border-visible font-body text-sm 
    text-text-primary bg-bg-canvas focus:outline-none box-border
  `,
  errorText: `
    font-body text-[13px] text-status-error flex items-center gap-1 mt-1
  `,
  chipGroup: `
    flex flex-wrap gap-2 pt-1
  `,
  chip: `
    h-8 px-3 rounded-md border border-border-visible font-body text-[13px] 
    bg-bg-canvas text-text-secondary cursor-pointer hover:border-text-primary
  `,
  chipSelected: `
    border-[#243628] bg-[#243628] text-white
  `,
  // FIX: shrink-0 with 5.5rem bottom clearance lifts the button completely above the mobile browser bar
  footer: `
    shrink-0 bg-white border-t border-border-visible p-4 
    pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-4 z-20 
    shadow-[0_-4px_16px_rgba(0,0,0,0.06)]
  `,
  submitButton: `
    w-full h-14 rounded-lg bg-[#CF3A0E] text-white border-none 
    font-heading font-bold text-base cursor-pointer hover:bg-[#A82E0B] 
    transition-colors duration-120
  `
};
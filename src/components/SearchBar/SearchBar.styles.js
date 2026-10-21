export const styles = {
  container: `
    relative w-full flex items-center
  `,
  input: `
    w-full h-11 pl-11 pr-10 
    bg-surface-card border border-border-visible rounded-xl 
    font-body text-sm text-text-primary placeholder:text-ui-control
    outline-none transition-all duration-150
    focus:border-secondary-olive focus:ring-1 focus:ring-secondary-olive
  `,
  searchIcon: `
    absolute left-3.5 top-1/2 -translate-y-1/2 
    w-4 h-4 text-ui-control pointer-events-none
  `,
  clearButton: `
    absolute right-3 top-1/2 -translate-y-1/2 
    w-6 h-6 rounded-full flex items-center justify-center 
    text-ui-control hover:text-text-primary transition-colors
  `
};
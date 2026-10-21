export const styles = {
  container: `
    w-full overflow-x-auto no-scrollbar 
    py-2 flex items-center gap-2 
    scrollbar-none
  `,
  chipBase: `
    h-10 px-4 rounded-full 
    text-sm font-body font-medium 
    whitespace-nowrap flex-shrink-0 
    transition-colors duration-150 cursor-pointer 
    flex items-center justify-center
  `,
  chipActive: `
    bg-secondary-olive text-white 
    border border-secondary-olive
  `,
  chipInactive: `
    bg-surface-card text-text-primary 
    border border-border-visible 
    hover:border-ui-control
  `
};
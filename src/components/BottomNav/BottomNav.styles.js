export const styles = {
  navContainer: `
    md:hidden 
    fixed bottom-0 left-0 right-0 
    bg-surface-card border-t border-border-visible 
    h-16 pb-[env(safe-area-inset-bottom)]
    flex items-center justify-around px-2 z-30
    shadow-none select-none
  `,
  tabButton: `
    flex flex-col items-center justify-center 
    w-16 h-12 rounded-lg 
    transition-colors duration-150 cursor-pointer
    touch-manipulation active:scale-95
  `,
  tabLabelActive: `
    text-[11px] font-body font-bold text-primary-base capitalize tracking-wide mt-1
  `,
  tabLabelInactive: `
    text-[11px] font-body font-medium text-text-secondary capitalize tracking-wide mt-1
  `,
  iconActive: `
    text-primary-base transition-transform duration-120
  `,
  iconInactive: `
    text-ui-control transition-colors duration-120
  `
};
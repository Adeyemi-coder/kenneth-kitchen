export const styles = {
  headerBase: `
    fixed top-0 left-0 right-0 z-40 
    bg-[#243628] text-white 
    transition-all duration-250 ease-out 
    motion-reduce:transition-none
  `,
  borderScrolled: `border-b border-white/10`,
  borderFlat: `border-b border-transparent`,
  innerWrapper: `
    max-w-6xl mx-auto px-4 lg:px-8 
    flex items-center justify-between gap-4 h-full
  `,
  desktopNav: `hidden md:flex relative items-center gap-2 h-full`,
  navLink: `
    relative h-12 px-4 inline-flex items-center 
    font-heading text-sm font-medium transition-colors duration-150 
    rounded-lg cursor-pointer active:scale-97 motion-reduce:active:scale-100
    focus-visible:outline-2 focus-visible:outline-[#FF8A5C]
  `,
  navLinkActive: `text-white font-bold`,
  navLinkInactive: `text-[#C9D3CB] hover:text-white`,
  navSlider: `
    absolute bottom-1 h-[3px] bg-[#FF7A4D] rounded-full 
    transition-all duration-250 ease-out 
    motion-reduce:transition-none pointer-events-none
  `,
  controls: `flex items-center gap-2 sm:gap-3`,
  cartBtn: `
    relative inline-flex items-center gap-2 h-11 px-3 sm:px-3.5 
    border border-white/10 rounded-lg text-white font-body text-[13px] font-bold 
    hover:bg-white/5 active:scale-97 motion-reduce:active:scale-100 
    transition-all duration-150 cursor-pointer
    focus-visible:outline-2 focus-visible:outline-[#FF8A5C]
  `,
  cartBadge: `
    w-[18px] h-[18px] rounded-full bg-[#FF7A4D] text-[#111618] 
    font-body text-[11px] font-bold leading-[18px] text-center tabular-nums
  `
};
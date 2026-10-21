export const styles = {
  wrap: `relative flex items-center`,
  searchBtn: `
    w-11 h-11 flex items-center justify-center 
    text-[#C9D3CB] hover:text-white hover:bg-white/5 
    rounded-lg transition-colors cursor-pointer 
    active:scale-97 motion-reduce:active:scale-100
    focus-visible:outline-2 focus-visible:outline-[#FF8A5C]
  `,
  inputField: `
    h-10 bg-[#1A251D] border border-white/10 rounded-lg 
    font-body text-[13px] text-white placeholder:text-[#C9D3CB]/60 
    outline-none transition-all duration-200 ease-out 
    focus-visible:outline-2 focus-visible:outline-[#FF8A5C]
  `
};
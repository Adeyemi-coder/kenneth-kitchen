import React from 'react';

export default function Logo({ size = 40, className = '' }) {
  return (
    <div className={`flex items-center gap-3 select-none flex-shrink-0 ${className}`}>
      {/* Custom Pot & Ladle Brand Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
        aria-label="Kenneth Kitchen Mark"
      >
        <rect width="40" height="40" rx="10" fill="#1C2621" />
        
        {/* Pot Lid Base Arc */}
        <path
          d="M10 24C10 18.4772 14.4772 14 20 14C25.5228 14 30 18.4772 30 24H10Z"
          fill="#FF7A4D"
        />
        
        {/* Pot Lid Handle Ring */}
        <path
          d="M17.5 14C17.5 12.6193 18.6193 11.5 20 11.5C21.3807 11.5 22.5 12.6193 22.5 14"
          stroke="#FAFAFA"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Angled Tasting Spoon / Ladle Stem */}
        <path
          d="M13 27L27 27"
          stroke="#FAFAFA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="font-heading font-extrabold text-[17px] text-[#FAFAFA] tracking-tight">
          Kenneth
        </span>
        <span className="font-heading font-bold text-[11px] tracking-[0.18em] uppercase text-[#FF8A5C] mt-0.5">
          KITCHEN
        </span>
      </div>
    </div>
  );
}
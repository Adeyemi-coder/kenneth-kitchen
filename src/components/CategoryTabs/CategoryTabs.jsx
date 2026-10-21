import React from 'react';

const CATEGORIES = [
  'All Kitchens',
  'Swallow and Soup',
  'Rice',
  'Grills and Suya',
  'Breakfast',
  'Snacks'
];

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <nav 
      aria-label="Cuisine categories" 
      className="flex items-center gap-6 overflow-x-auto border-b border-border-visible scrollbar-none no-scrollbar pt-1"
    >
      {CATEGORIES.map((cat) => {
        const isActive = (selected === 'All' && cat === 'All Kitchens') || selected === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat === 'All Kitchens' ? 'All' : cat)}
            className={`
              pb-3 font-heading text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors relative cursor-pointer
              ${isActive ? 'text-[#243628]' : 'text-gray-500 hover:text-text-primary'}
            `}
          >
            {cat}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#243628] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
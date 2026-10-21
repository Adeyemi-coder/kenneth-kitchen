import React from 'react';
import { styles } from './CategoryChips.styles';

const DEFAULT_CATEGORIES = [
  'All',
  'Swallow and Soup',
  'Rice',
  'Grills and Suya',
  'Snacks',
  'Breakfast',
  'Drinks'
];

export default function CategoryChips({ 
  categories = DEFAULT_CATEGORIES, 
  selected = 'All', 
  onSelect 
}) {
  return (
    <div className={styles.container} role="tablist" aria-label="Food Categories">
      {categories.map((category) => {
        const isActive = selected === category;
        return (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect?.(category)}
            className={`${styles.chipBase} ${
              isActive ? styles.chipActive : styles.chipInactive
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
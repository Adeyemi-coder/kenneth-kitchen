import React from 'react';
import { styles } from './SearchBar.styles';

export default function SearchBar({ 
  value = '', 
  onChange, 
  onClear, 
  placeholder = "Search 'egusi', 'jollof', 'suya'..." 
}) {
  return (
    <div className={styles.container}>
      {/* Search Lens SVG */}
      <svg 
        className={styles.searchIcon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        aria-label="Search food or restaurants"
      />

      {/* Clear Button */}
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          className={styles.clearButton}
          aria-label="Clear search query"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
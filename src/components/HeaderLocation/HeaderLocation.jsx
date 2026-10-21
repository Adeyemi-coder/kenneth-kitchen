import React from 'react';
import { styles } from './HeaderLocation.styles';

export default function HeaderLocation({ location = "Yaba, Lagos", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.button}
      aria-label={`Change delivery location. Current: ${location}`}
    >
      {/* Pin icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span className={styles.label}>{location}</span>
      {/* Chevron down */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
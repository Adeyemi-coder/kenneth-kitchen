import React, { useState, useRef, useEffect } from 'react';
import { styles } from './HeaderSearch.styles';

export default function HeaderSearch({ value = '', onSearch, isOpenExternal, onCloseExternal }) {
  const [isOpen, setIsOpen] = useState(false);
  const inputDesktopRef = useRef(null);
  const inputMobileRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      const target = isMobile ? inputMobileRef.current : inputDesktopRef.current;
      setTimeout(() => target?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target) && !value) {
        setIsOpen(false);
        onCloseExternal?.();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [value, onCloseExternal]);

  const toggleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) {
        onCloseExternal?.();
        onSearch?.('');
      }
      return next;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      onCloseExternal?.();
      onSearch?.('');
    }
  };

  const handleClear = () => {
    onSearch?.('');
    const isMobile = window.innerWidth < 768;
    (isMobile ? inputMobileRef.current : inputDesktopRef.current)?.focus();
  };

  return (
    <div ref={wrapRef} className="relative flex items-center">
      {/* Mobile Full-Screen Header Overlay */}
      <div 
        className={`
          md:hidden fixed inset-x-0 top-0 h-14 bg-[#243628] z-50 px-3 flex items-center gap-2 border-b border-white/10
          transition-transform duration-200 ease-out
          ${isOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'}
        `}
      >
        <div className="relative flex-1 flex items-center">
          <svg className="absolute left-3 w-4 h-4 text-[#C9D3CB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputMobileRef}
            type="search"
            value={value}
            onChange={(e) => onSearch?.(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search kitchens, dishes, or swallows..."
            className="w-full h-10 pl-9 pr-8 bg-[#1A251D] border border-white/10 rounded-lg text-sm text-white placeholder:text-[#C9D3CB]/60 outline-none focus:border-[#FF7A4D]"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2.5 text-xs text-[#C9D3CB] hover:text-white p-1 cursor-pointer"
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            onCloseExternal?.();
            onSearch?.('');
          }}
          className="text-xs font-heading font-semibold text-[#FF8A5C] px-2 py-2 cursor-pointer flex-shrink-0"
        >
          Cancel
        </button>
      </div>

      {/* Desktop Expandable Field */}
      <input
        ref={inputDesktopRef}
        type="search"
        value={value}
        onChange={(e) => onSearch?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search kitchens or dishes..."
        aria-label="Search food or restaurants"
        className={`
          hidden md:block h-10 bg-[#1A251D] border border-white/10 rounded-lg 
          font-body text-[13px] text-white placeholder:text-[#C9D3CB]/60 
          outline-none transition-all duration-200 ease-out 
          focus-visible:outline-2 focus-visible:outline-[#FF8A5C]
          ${isOpen ? 'w-60 px-3 pr-10 opacity-100 pointer-events-auto' : 'w-0 px-0 opacity-0 pointer-events-none'}
        `}
      />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleSearch}
        className={`${styles.searchBtn} ${isOpen ? 'text-white' : ''}`}
        aria-label={isOpen ? 'Close search' : 'Open search input'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}
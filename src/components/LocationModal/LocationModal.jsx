import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { styles } from './LocationModal.styles';

const QUICK_LANDMARK_CHIPS = [
  'Opposite a filling station',
  'Behind the church',
  'Estate gate',
  'Beside a bank'
];

const REJECTED_LANDMARK_REGEX = /^(near me|my house|here|home)$/i;

export default function LocationModal({ isOpen, onClose, currentLocation, onSelectLocation }) {
  const [street, setStreet] = useState(currentLocation || '12 Adeola Odeku Street, Victoria Island');
  const [landmark, setLandmark] = useState('');
  const [gateInstructions, setGateInstructions] = useState('');
  const [buildingDetails, setBuildingDetails] = useState('');
  const [riderPhone, setRiderPhone] = useState('0803 123 4567');
  const [saveAs, setSaveAs] = useState('Home');
  const [landmarkError, setLandmarkError] = useState('');

  // Scroll lock document on open
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedLandmark = landmark.trim();
    if (trimmedLandmark.length < 8) {
      setLandmarkError('Landmark must be at least 8 characters.');
      return;
    }

    if (REJECTED_LANDMARK_REGEX.test(trimmedLandmark)) {
      setLandmarkError('Add something visible, like a gate colour, shop or junction.');
      return;
    }

    setLandmarkError('');
    const fullAddress = `${street} · ${trimmedLandmark}`;
    onSelectLocation?.(fullAddress);
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Delivery Address"
      className={styles.overlay}
      onClick={onClose}
    >
      <div 
        className={styles.panel} 
        onClick={(e) => e.stopPropagation()}
        style={{ boxSizing: 'border-box' }}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>Delivery Address</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close address modal"
            className={styles.closeButton}
          >
            ✕
          </button>
        </header>

        {/* Scrollable Form Body */}
        <form 
          onSubmit={handleSubmit} 
          className={styles.scrollArea}
          style={{
            flex: '1 1 0%',
            minHeight: 0,
            overflowY: 'auto'
          }}
        >
          {/* Map Preview Mock */}
          <div className={styles.mapMock}>
            <div className="w-4 h-4 rounded-full bg-[#243628] border-2 border-white shadow-xs" />
            <span className="absolute bottom-2 left-2 text-[11px] font-body text-text-secondary bg-white/80 px-2 py-0.5 rounded">
              Drag pin to refine location
            </span>
          </div>

          <button
            type="button"
            onClick={() => setStreet('Bodija Market Road, Ibadan')}
            className={styles.locateButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11" />
            </svg>
            Use my current location
          </button>

          {/* Street Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Street or area</label>
            <input
              type="text"
              required
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Landmark Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Landmark the rider can see <span className="text-status-pending">(Required)</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Yellow gate opposite the transformer"
              value={landmark}
              onChange={(e) => {
                setLandmark(e.target.value);
                if (landmarkError) setLandmarkError('');
              }}
              className={`${styles.input} ${landmarkError ? 'border-status-error' : ''}`}
            />
            {landmarkError && (
              <span className={styles.errorText}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {landmarkError}
              </span>
            )}

            {/* Quick-fill chips */}
            <div className={styles.chipGroup}>
              {QUICK_LANDMARK_CHIPS.map((chipText) => (
                <button
                  key={chipText}
                  type="button"
                  onClick={() => {
                    setLandmark(chipText);
                    setLandmarkError('');
                  }}
                  className={styles.chip}
                >
                  {chipText}
                </button>
              ))}
            </div>
          </div>

          {/* Gate Instructions */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Gate and security instructions (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Tell security 'Tunde sent you'. Gate code 4521"
              value={gateInstructions}
              onChange={(e) => setGateInstructions(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Building Details */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Building, flat or floor (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Flat 3B, 2nd floor"
              value={buildingDetails}
              onChange={(e) => setBuildingDetails(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Rider Phone */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Phone number for the rider</label>
            <input
              type="tel"
              required
              value={riderPhone}
              onChange={(e) => setRiderPhone(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Save As Chips */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Save as</label>
            <div className={styles.chipGroup}>
              {['Home', 'Work', 'Other'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSaveAs(tag)}
                  className={`${styles.chip} ${saveAs === tag ? styles.chipSelected : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4" />
        </form>

        {/* Pinned Confirm Button */}
        <footer 
          className={styles.footer}
          style={{ flexShrink: 0 }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            className={styles.submitButton}
          >
            Confirm address
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}
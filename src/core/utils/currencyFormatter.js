/**
 * Formats values into whole-Naira currency representation.
 * Avoids decimal kobo per design system specs (e.g., ₦700 instead of ₦700.00).
 */
export function formatNaira(amount = 0) {
  const rounded = Math.round(Number(amount) || 0);
  return `₦${rounded.toLocaleString('en-NG')}`;
}
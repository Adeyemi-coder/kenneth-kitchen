/**
 * Formats minimum and maximum delivery estimates into a standard range.
 */
export function formatEtaRange(minMinutes = 25, maxMinutes = 40) {
  return `${minMinutes}–${maxMinutes} mins`;
}
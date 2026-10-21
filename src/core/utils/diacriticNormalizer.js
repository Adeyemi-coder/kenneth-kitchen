export function normalizeDiacritics(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

export function matchesSearch(text = '', query = '') {
  const cleanText = normalizeDiacritics(text);
  const cleanQuery = normalizeDiacritics(query);
  return cleanText.includes(cleanQuery);
}
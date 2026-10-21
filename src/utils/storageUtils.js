// Safe localStorage wrappers. Never throw — return safe fallbacks.

const ORDERS_PREFIX = 'kk_orders_';
const PREFS_PREFIX = 'kk_prefs_';

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeParse(raw, fallback) {
  if (typeof raw !== 'string' || raw.length === 0) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeEmail(email) {
  return (email ?? 'guest').toLowerCase();
}

// ---- Orders ---------------------------------------------------------------

export function ordersKey(email) {
  return `${ORDERS_PREFIX}${normalizeEmail(email)}`;
}

export function readOrders(email, { fallback = [], seedFallback = null } = {}) {
  if (!email) return fallback;

  const raw = safeGetItem(ordersKey(email));
  const parsed = safeParse(raw, null);

  if (Array.isArray(parsed)) return parsed;

  if (Array.isArray(seedFallback) && seedFallback.length > 0) {
    safeSetItem(ordersKey(email), JSON.stringify(seedFallback));
    return seedFallback;
  }

  return fallback;
}

export function writeOrders(email, orders) {
  if (!email || !Array.isArray(orders)) return false;
  return safeSetItem(ordersKey(email), JSON.stringify(orders));
}

// ---- Preferences ----------------------------------------------------------

export function prefsKey(email) {
  return `${PREFS_PREFIX}${normalizeEmail(email)}`;
}

export function readPrefs(email, fallback = {}) {
  if (!email) return fallback;
  const raw = safeGetItem(prefsKey(email));
  const parsed = safeParse(raw, null);
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    return parsed;
  }
  return fallback;
}

export function writePrefs(email, prefs) {
  if (!email || !prefs || typeof prefs !== 'object') return false;
  return safeSetItem(prefsKey(email), JSON.stringify(prefs));
}

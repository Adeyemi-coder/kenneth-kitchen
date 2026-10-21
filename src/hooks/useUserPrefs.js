import { useCallback, useEffect, useMemo, useState } from 'react';
import { readPrefs, writePrefs } from '../utils/storageUtils';

const DEFAULT_PREFS = {
  city: 'Ilorin',
  area: 'Tanke',
  notifications: true,
  favorites: [],
};

function sanitizePrefs(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PREFS };
  return {
    city: typeof raw.city === 'string' && raw.city ? raw.city : DEFAULT_PREFS.city,
    area: typeof raw.area === 'string' && raw.area ? raw.area : DEFAULT_PREFS.area,
    notifications:
      typeof raw.notifications === 'boolean'
        ? raw.notifications
        : DEFAULT_PREFS.notifications,
    favorites: Array.isArray(raw.favorites) ? raw.favorites : [],
  };
}

/**
 * Per-user preferences hook. Handles read on user change, write on change.
 * Owns: city, area, notifications, favorites.
 */
export function useUserPrefs(userEmail) {
  const initial = useMemo(
    () => sanitizePrefs(userEmail ? readPrefs(userEmail, DEFAULT_PREFS) : DEFAULT_PREFS),
    // Only re-init when user identity changes.
    [userEmail]
  );

  const [city, setCity] = useState(initial.city);
  const [area, setArea] = useState(initial.area);
  const [notificationsOn, setNotificationsOn] = useState(initial.notifications);
  const [favorites, setFavorites] = useState(initial.favorites);

  // Re-sync when the signed-in user changes.
  useEffect(() => {
    const next = sanitizePrefs(userEmail ? readPrefs(userEmail, DEFAULT_PREFS) : DEFAULT_PREFS);
    setCity(next.city);
    setArea(next.area);
    setNotificationsOn(next.notifications);
    setFavorites(next.favorites);
  }, [userEmail]);

  // Persist on change (guarded — no write for guests).
  useEffect(() => {
    if (!userEmail) return;
    writePrefs(userEmail, {
      city,
      area,
      notifications: notificationsOn,
      favorites,
    });
  }, [userEmail, city, area, notificationsOn, favorites]);

  const toggleFavorite = useCallback((id) => {
    if (id === undefined || id === null) return;
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const reset = useCallback(() => {
    setCity(DEFAULT_PREFS.city);
    setArea(DEFAULT_PREFS.area);
    setNotificationsOn(DEFAULT_PREFS.notifications);
    setFavorites([]);
  }, []);

  return {
    city,
    setCity,
    area,
    setArea,
    notificationsOn,
    setNotificationsOn,
    favorites,
    setFavorites,
    toggleFavorite,
    reset,
  };
}

const STORAGE_KEY = 'kenneth_kitchen_user_location';

/**
 * Reverse-geocodes latitude and longitude into a readable Nigerian address string
 * using OpenStreetMap Nominatim.
 */
async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=16`
    );
    if (!res.ok) throw new Error('Geocoding request failed');
    const data = await res.json();

    const address = data.address || {};
    // Extract local district / suburb / neighborhood
    const neighborhood =
      address.suburb ||
      address.neighbourhood ||
      address.residential ||
      address.quarter ||
      address.road ||
      '';

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.state ||
      'Ilorin';

    if (neighborhood) {
      return `${neighborhood}, ${city}`;
    }
    return city;
  } catch (error) {
    console.warn('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Requests the client's current location via browser Geolocation.
 */
export function getCurrentClientLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const resolvedName = await reverseGeocode(latitude, longitude);
        if (resolvedName) {
          localStorage.setItem(STORAGE_KEY, resolvedName);
          resolve(resolvedName);
        } else {
          resolve('Ilorin, Nigeria');
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}

export function getCachedLocation() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setCachedLocation(locationStr) {
  if (locationStr) {
    localStorage.setItem(STORAGE_KEY, locationStr);
  }
}
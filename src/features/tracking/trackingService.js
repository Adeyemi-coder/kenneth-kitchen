/**
 * Tracking and Delivery Service
 * Manages order tracking states, delivery PIN validation, and rider communication links.
 */

// Generate a secure 4-digit delivery PIN per order
export function generateDeliveryPin() {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return String(1000 + (arr[0] % 9000));
    }
  } catch {}
  return String(Math.floor(1000 + Math.random() * 9000));
}

// Format WhatsApp link with prefilled message
export function getWhatsAppRiderLink(riderPhone, orderId, customerArea) {
  const cleanPhone = riderPhone.replace(/[^0-9+]/g, '');
  const msg = encodeURIComponent(`Hello, I'm checking on order ${orderId} heading to ${customerArea}.`);
  return `https://wa.me/${cleanPhone}?text=${msg}`;
}

// Format Phone Call link
export function getCallRiderLink(riderPhone) {
  return `tel:${riderPhone.replace(/[^0-9+]/g, '')}`;
}
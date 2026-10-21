// Pure normalization & presentation helpers. Defensive against bad data.

import { MOCK_VENDORS } from '../features/discovery/vendorData';

export function normalizeVendor(v) {
  if (!v || typeof v !== 'object') {
    return {
      id: undefined,
      name: 'Unknown kitchen',
      category: '',
      city: '',
      isOpen: false,
      etaMin: 0,
      etaMax: 0,
      etaRange: '',
      reviewsCount: 0,
      closedLabel: 'Closed',
    };
  }

  const etaMatch =
    typeof v.etaRange === 'string' ? v.etaRange.match(/(\d+)\D+(\d+)/) : null;

  const etaMin = etaMatch ? Number(etaMatch[1]) : Number(v.etaMin) || 0;
  const etaMax = etaMatch
    ? Number(etaMatch[2])
    : Number(v.etaMax) || Number(v.etaMin) || etaMin;

  const isOpen = Boolean(v.isOpen);
  const opensAt = v.opensAt ? String(v.opensAt) : null;

  return {
    ...v,
    category: v.category ?? '',
    isOpen,
    etaMin,
    etaMax,
    reviewsCount: Number(v.reviewsCount ?? v.reviewCount ?? 0) || 0,
    closedLabel: isOpen ? null : opensAt ? `Closed, opens ${opensAt}` : 'Closed',
  };
}

export function getNormalizedVendors() {
  const list = Array.isArray(MOCK_VENDORS) ? MOCK_VENDORS : [];
  return list.map(normalizeVendor);
}

export function resolveOrderStatus(order) {
  if (!order || typeof order !== 'object') return 'Delivered';
  return order.status ? String(order.status) : 'Delivered';
}

export function statusClasses(status) {
  const key = String(status ?? '').toLowerCase();
  if (key.includes('cancel')) return 'bg-status-error/10 text-status-error';
  if (key.includes('way') || key.includes('prepar') || key.includes('progress')) {
    return 'bg-primary-base/10 text-primary-base';
  }
  return 'bg-secondary-olive/10 text-secondary-olive';
}

// Deterministic, safe key for an order entry.
export function orderKey(order, index = 0) {
  if (!order || typeof order !== 'object') return `order-missing-${index}`;
  if (order.orderId) return `order-${String(order.orderId)}`;
  return `order-${order.vendorId ?? 'x'}-${order.placedAt ?? order.createdAt ?? index}`;
}

// Deterministic, safe key for a vendor entry.
export function vendorKey(vendor, index = 0) {
  if (!vendor || typeof vendor !== 'object') return `vendor-missing-${index}`;
  return `vendor-${vendor.id ?? index}`;
}

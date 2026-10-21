

const LAGOS = 'Africa/Lagos';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Current minutes since midnight in Lagos, regardless of the device's timezone.
function lagosMinutes(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: LAGOS,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const h = Number(parts.find((p) => p.type === 'hour').value);
  const m = Number(parts.find((p) => p.type === 'minute').value);
  return h * 60 + m;
}

// '16:00' -> '4 PM', '23:30' -> '11:30 PM'
export function formatClock(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''} ${suffix}`;
}

export function isOpenNow(vendor, now = new Date()) {
  if (vendor.paused) return false;
  if (!vendor.opensAt || !vendor.closesAt) return Boolean(vendor.isOpen);

  const current = lagosMinutes(now);
  const open = toMinutes(vendor.opensAt);
  const close = toMinutes(vendor.closesAt);

  // Normal day (09:00 to 21:00) or overnight (18:00 to 02:00).
  return open <= close
    ? current >= open && current < close
    : current >= open || current < close;
}

function closedLabel(vendor, now) {
  if (vendor.paused) return 'Not taking orders right now';
  if (!vendor.opensAt) return 'Closed';
  const current = lagosMinutes(now);
  const open = toMinutes(vendor.opensAt);
  return current < open
    ? `Closed, opens ${formatClock(vendor.opensAt)}`
    : `Closed, opens tomorrow ${formatClock(vendor.opensAt)}`;
}

// Adds isOpen and closedLabel to every vendor. Call it in App with a `now`
// value that refreshes every minute so "open now" counts stay honest.
export function withOpenStatus(vendors, now = new Date()) {
  return vendors.map((v) => {
    const open = isOpenNow(v, now);
    return { ...v, isOpen: open, closedLabel: open ? null : closedLabel(v, now) };
  });
}

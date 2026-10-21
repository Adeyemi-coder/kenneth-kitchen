// Pure time/date helpers. No side effects, no browser APIs assumed.

export const LAGOS_TIMEZONE = 'Africa/Lagos';

const MEALS = {
  breakfast: {
    title: 'Breakfast near you',
    categories: [
      'Breakfast & Street Bites',
      'Native Pots & Porridge',
      'Bakery & Pastries',
      'Chilled Drinks & Juices',
    ],
  },
  lunch: {
    title: 'Lunch near you',
    categories: [
      'Swallow & Soups',
      'Rice & Combos',
      'Native Pots & Porridge',
      'Shawarma & Wraps',
    ],
  },
  dinner: {
    title: 'Dinner near you',
    categories: [
      'Grills & Suya',
      'Pepper Soup & Pot',
      'Shawarma & Wraps',
      'Pizza & Pies',
      'Swallow & Soups',
    ],
  },
};

export function lagosHour(date = new Date()) {
  const formatted = new Intl.DateTimeFormat('en-GB', {
    timeZone: LAGOS_TIMEZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(date);
  const parsed = Number(formatted);
  return Number.isFinite(parsed) ? parsed : 12;
}

export function mealFor(hour) {
  if (hour < 11) return MEALS.breakfast;
  if (hour < 17) return MEALS.lunch;
  return MEALS.dinner;
}

export function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function orderDateLabel(ts) {
  if (!ts) return '';
  const d = typeof ts === 'number' ? new Date(ts) : new Date(ts);
  if (Number.isNaN(d.getTime())) return '';

  const diff = Date.now() - d.getTime();
  const day = 24 * 60 * 60 * 1000;

  if (diff < day) return 'Today';
  if (diff < 2 * day) return 'Yesterday';
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`;

  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

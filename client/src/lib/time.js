// Every 30-minute slot from 8:00 AM through 6:00 PM inclusive (21 entries).
export const TIME_SLOTS = (() => {
  const out = [];
  for (let h = 8; h <= 18; h += 1) {
    for (const m of [0, 30]) {
      if (h === 18 && m === 30) break;
      const hour12 = h > 12 ? h - 12 : h;
      const period = h >= 12 ? 'PM' : 'AM';
      out.push(`${hour12}:${m === 0 ? '00' : '30'} ${period}`);
    }
  }
  return out;
})();

export function formatIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date, n) {
  const next = new Date(date);
  next.setDate(next.getDate() + n);
  return next;
}

export function formatHumanDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

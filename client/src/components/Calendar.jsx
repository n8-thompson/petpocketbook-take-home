import { useEffect, useState } from 'react';

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Always return 6 weeks (42 cells) starting from the Sunday on or before the
// 1st of the month, so the grid layout is stable regardless of month length.
function buildMonthCells(viewMonth) {
  const first = startOfMonth(viewMonth);
  const start = new Date(first);
  start.setDate(start.getDate() - first.getDay());
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    cells.push(d);
  }
  return cells;
}

export function Calendar({ selected, onSelect }) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(selected));

  // Keep the calendar in sync if the parent changes `selected` (e.g. via the
  // header arrows) to a date in another month.
  useEffect(() => {
    if (
      selected.getFullYear() !== viewMonth.getFullYear() ||
      selected.getMonth() !== viewMonth.getMonth()
    ) {
      setViewMonth(startOfMonth(selected));
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const cells = buildMonthCells(viewMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthLabel = viewMonth.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  function shiftMonth(delta) {
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1)
    );
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="calendar-nav"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="calendar-month" aria-live="polite">
          {monthLabel}
        </div>
        <button
          type="button"
          className="calendar-nav"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="calendar-grid" role="grid">
        {DOW_LABELS.map((label) => (
          <div key={label} className="calendar-dow" role="columnheader">
            {label}
          </div>
        ))}
        {cells.map((d) => {
          const inMonth = d.getMonth() === viewMonth.getMonth();
          const isSelected = sameDay(d, selected);
          const isToday = sameDay(d, today);
          const cls = [
            'calendar-day',
            inMonth ? '' : 'is-outside',
            isSelected ? 'is-selected' : '',
            isToday && !isSelected ? 'is-today' : '',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={d.toISOString()}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              className={cls}
              onClick={() => onSelect(d)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

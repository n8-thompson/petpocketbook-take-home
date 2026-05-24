import { addDays, formatHumanDate } from '../lib/time.js';

export function Header({ date, onChange, isMobile, onOpenCalendar }) {
  return (
    <header className="header">
      <button
        type="button"
        className="header-arrow"
        onClick={() => onChange(addDays(date, -1))}
        aria-label="Previous day"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {isMobile ? (
        <button
          type="button"
          className="header-date header-date-button"
          onClick={onOpenCalendar}
          aria-label={`${formatHumanDate(date)}. Tap to open calendar.`}
        >
          {formatHumanDate(date)}
        </button>
      ) : (
        <h1 className="header-date">{formatHumanDate(date)}</h1>
      )}

      <button
        type="button"
        className="header-arrow"
        onClick={() => onChange(addDays(date, 1))}
        aria-label="Next day"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {isMobile && (
        <button
          type="button"
          className="header-calendar"
          onClick={onOpenCalendar}
          aria-label="Open calendar"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      )}
    </header>
  );
}

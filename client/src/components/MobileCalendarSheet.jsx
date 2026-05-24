import { useEffect } from 'react';
import { Calendar } from './Calendar.jsx';
import { formatHumanDate } from '../lib/time.js';

export function MobileCalendarSheet({ date, onSelect, onClose }) {
  // Lock the body scroll while the sheet is open so swipes/scrolls stay inside
  // the calendar; restore on unmount.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Esc for keyboard users.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="mobile-cal-sheet" role="dialog" aria-modal="true" aria-label="Choose date">
      <header className="mobile-cal-header">
        <button
          type="button"
          className="mobile-cal-back"
          onClick={onClose}
          aria-label="Back to schedule"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>
        <h2 className="mobile-cal-title">{formatHumanDate(date)}</h2>
        <span className="mobile-cal-spacer" aria-hidden="true" />
      </header>
      <div className="mobile-cal-body">
        <Calendar
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            onClose();
          }}
        />
      </div>
    </div>
  );
}

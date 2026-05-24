import { Calendar } from './Calendar.jsx';
import { TrashZone } from './TrashZone.jsx';

export function Sidebar({ date, onDateChange }) {
  return (
    <aside className="sidebar">
      <section className="sidebar-section">
        <h2 className="sidebar-title">Date</h2>
        <Calendar selected={date} onSelect={onDateChange} />
      </section>
      <section className="sidebar-section">
        <h2 className="sidebar-title">Delete</h2>
        <TrashZone />
      </section>
    </aside>
  );
}

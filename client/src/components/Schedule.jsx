import { TIME_SLOTS } from '../lib/time.js';
import { TimeSlot } from './TimeSlot.jsx';

export function Schedule({ appointments }) {
  const byTime = TIME_SLOTS.reduce((acc, t) => {
    acc[t] = [];
    return acc;
  }, {});
  for (const a of appointments) {
    if (byTime[a.time]) byTime[a.time].push(a);
  }
  return (
    <div className="schedule">
      {TIME_SLOTS.map((time) => (
        <TimeSlot key={time} time={time} appointments={byTime[time]} />
      ))}
    </div>
  );
}

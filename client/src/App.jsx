import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useQuery } from '@tanstack/react-query';

import { Header } from './components/Header.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Schedule } from './components/Schedule.jsx';
import { AppointmentCard } from './components/AppointmentCard.jsx';
import { MobileCalendarSheet } from './components/MobileCalendarSheet.jsx';
import { getSchedule, saveSchedule, deleteAppointment } from './api.js';
import { formatIsoDate } from './lib/time.js';
import { useIsMobile } from './hooks/useIsMobile.js';
import {
  useScheduleMutation,
  scheduleKey,
} from './hooks/useScheduleMutation.js';

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function App() {
  const [date, setDate] = useState(todayStart);
  const [activeId, setActiveId] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const isMobile = useIsMobile();
  const isoDate = useMemo(() => formatIsoDate(date), [date]);

  // Auto-dismiss the mobile date sheet if the viewport grows past the breakpoint.
  useEffect(() => {
    if (!isMobile) setIsCalendarOpen(false);
  }, [isMobile]);

  const scheduleQuery = useQuery({
    queryKey: scheduleKey(isoDate),
    queryFn: () => getSchedule(isoDate),
  });

  const appointments = scheduleQuery.data?.appointments ?? [];

  const moveMutation = useScheduleMutation({
    isoDate,
    mutationFn: (date, { next }) => saveSchedule(date, next),
    applyOptimistic: (_current, { next }) => next,
    successMessage: ({ moved }) => `${moved.pet.name} moved to ${moved.time}`,
    errorMessage: (err, { moved }) =>
      `Couldn't move ${moved?.pet?.name ?? 'appointment'}: ${err.message}`,
  });

  const deleteMutation = useScheduleMutation({
    isoDate,
    mutationFn: (date, { id }) => deleteAppointment(date, id),
    applyOptimistic: (current, { id }) => current.filter((a) => a.id !== id),
    successMessage: ({ removed }) => `${removed.pet.name} deleted`,
    errorMessage: (err, { removed }) =>
      `Couldn't delete ${removed?.pet?.name ?? 'appointment'}: ${err.message}`,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const activeAppointment = activeId
    ? appointments.find((a) => a.id === activeId)
    : null;

  function handleDragEnd(event) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const id = active.id;

    if (over.id === 'trash') {
      const removed = appointments.find((a) => a.id === id);
      if (!removed) return;
      deleteMutation.mutate({ id, removed });
      return;
    }

    const targetTime = String(over.id);
    const current = appointments.find((a) => a.id === id);
    if (!current || current.time === targetTime) return;
    const moved = { ...current, time: targetTime };
    const next = appointments.map((a) => (a.id === id ? moved : a));
    moveMutation.mutate({ next, moved });
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <div className={`app ${isMobile ? 'is-mobile' : ''}`}>
        <Header
          date={date}
          onChange={setDate}
          isMobile={isMobile}
          onOpenCalendar={() => setIsCalendarOpen(true)}
        />
        <div className="app-body">
          <main className="app-main">
            {scheduleQuery.isPending && <p className="status">Loading schedule…</p>}
            {scheduleQuery.isError && (
              <p className="status status-error">
                Couldn't load schedule: {scheduleQuery.error.message}
              </p>
            )}
            {scheduleQuery.isSuccess && <Schedule appointments={appointments} />}
          </main>
          {!isMobile && <Sidebar date={date} onDateChange={setDate} />}
        </div>
      </div>
      <DragOverlay>
        {activeAppointment ? (
          <AppointmentCard appointment={activeAppointment} overlay />
        ) : null}
      </DragOverlay>
      {isMobile && isCalendarOpen && (
        <MobileCalendarSheet
          date={date}
          onSelect={setDate}
          onClose={() => setIsCalendarOpen(false)}
        />
      )}
    </DndContext>
  );
}

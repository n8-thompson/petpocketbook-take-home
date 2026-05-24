async function handle(res) {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.error) detail = body.error;
    } catch {
      // ignore JSON parse failures and fall back to the status code
    }
    throw new Error(detail);
  }
  return res.json();
}

export async function getSchedule(date) {
  const res = await fetch(`/api/schedule?date=${encodeURIComponent(date)}`);
  return handle(res);
}

export async function saveSchedule(date, appointments) {
  const res = await fetch(`/api/schedule?date=${encodeURIComponent(date)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appointments }),
  });
  return handle(res);
}

export async function deleteAppointment(date, appointmentId) {
  const url = `/api/schedule/${encodeURIComponent(appointmentId)}?date=${encodeURIComponent(date)}`;
  const res = await fetch(url, { method: 'DELETE' });
  return handle(res);
}

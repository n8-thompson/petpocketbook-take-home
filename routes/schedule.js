'use strict';

const express = require('express');
const crypto = require('crypto');

const { getSchedule, upsertSchedule } = require('../lib/db');
const {
  fetchUpstreamSchedule,
  isValidTime,
  isValidPetType,
} = require('../lib/petPocketbook');

const router = express.Router();

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDateParam(req, res) {
  const date = req.query.date;
  if (!date || !DATE_RE.test(date)) {
    res.status(400).json({ error: 'Missing or invalid `date` query param (expected YYYY-MM-DD).' });
    return null;
  }
  return date;
}

function validateAppointments(appointments) {
  if (!Array.isArray(appointments)) {
    return 'Body must include an `appointments` array.';
  }
  const seenIds = new Set();
  for (let i = 0; i < appointments.length; i += 1) {
    const appt = appointments[i];
    if (!appt || typeof appt !== 'object') {
      return `Appointment at index ${i} is not an object.`;
    }
    if (typeof appt.id !== 'string' || appt.id.length === 0) {
      return `Appointment at index ${i} is missing a string \`id\`.`;
    }
    if (seenIds.has(appt.id)) {
      return `Duplicate appointment id "${appt.id}".`;
    }
    seenIds.add(appt.id);
    const pet = appt.pet;
    if (!pet || typeof pet !== 'object') {
      return `Appointment ${appt.id} is missing a \`pet\` object.`;
    }
    if (typeof pet.name !== 'string' || pet.name.length === 0) {
      return `Appointment ${appt.id} pet.name must be a non-empty string.`;
    }
    if (!isValidPetType(pet.type)) {
      return `Appointment ${appt.id} pet.type "${pet.type}" is not allowed.`;
    }
    if (!isValidTime(appt.time)) {
      return `Appointment ${appt.id} time "${appt.time}" is not a 30-min slot between 8:00 AM and 6:00 PM.`;
    }
  }
  return null;
}

// Seed a day from the upstream API if we don't have one yet.
async function seedFromUpstream(date) {
  const upstream = await fetchUpstreamSchedule();
  // Guarantee fresh ids so two different dates never collide.
  const appointments = upstream.map((appt) => ({
    ...appt,
    id: crypto.randomUUID(),
  }));
  return upsertSchedule(date, appointments);
}

router.get('/', async (req, res, next) => {
  const date = parseDateParam(req, res);
  if (!date) return;
  try {
    const existing = await getSchedule(date);
    if (existing) {
      return res.json({ date: existing.date, appointments: existing.appointments });
    }
    const seeded = await seedFromUpstream(date);
    return res.json({ date: seeded.date, appointments: seeded.appointments });
  } catch (err) {
    if (err.status === 502) {
      return res.status(502).json({ error: err.message });
    }
    return next(err);
  }
});

router.put('/', async (req, res, next) => {
  const date = parseDateParam(req, res);
  if (!date) return;
  const { appointments } = req.body || {};
  const error = validateAppointments(appointments);
  if (error) {
    return res.status(400).json({ error });
  }
  try {
    const saved = await upsertSchedule(date, appointments);
    return res.json({ date: saved.date, appointments: saved.appointments });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:appointmentId', async (req, res, next) => {
  const date = parseDateParam(req, res);
  if (!date) return;
  const { appointmentId } = req.params;
  if (!appointmentId) {
    return res.status(400).json({ error: 'Missing appointmentId in path.' });
  }
  try {
    const existing = await getSchedule(date);
    if (!existing) {
      return res.status(404).json({ error: `No schedule found for ${date}.` });
    }
    const next$ = existing.appointments.filter((a) => a.id !== appointmentId);
    if (next$.length === existing.appointments.length) {
      return res.status(404).json({ error: `Appointment ${appointmentId} not found for ${date}.` });
    }
    const saved = await upsertSchedule(date, next$);
    return res.json({ date: saved.date, appointments: saved.appointments });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

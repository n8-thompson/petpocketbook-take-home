'use strict';

const crypto = require('crypto');

const UPSTREAM_URL = 'https://candidate.petpocketbook.com/schedule';
const DEFAULT_API_KEY = 'jQkI63suJhqd3DtL';

const ALLOWED_PET_TYPES = new Set([
  'Dog',
  'Cat',
  'Bird',
  'Rabbit',
  'Hedgehog',
  'Turtle',
  'Rodent',
]);

const TIME_SLOT_RE = /^(1[0-2]|[1-9]):(00|30)\s(AM|PM)$/;

function isValidTime(time) {
  return typeof time === 'string' && TIME_SLOT_RE.test(time);
}

function isValidPetType(type) {
  return typeof type === 'string' && ALLOWED_PET_TYPES.has(type);
}

// Upstream returns appointments without ids. We assign stable client ids so the
// frontend can reference them across drag/drop and DELETE calls.
function normalizeAppointment(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const pet = raw.pet || {};
  if (!pet.name || !isValidPetType(pet.type)) {
    return null;
  }
  if (!isValidTime(raw.time)) {
    return null;
  }
  return {
    id: crypto.randomUUID(),
    pet: { name: String(pet.name), type: pet.type },
    time: raw.time,
  };
}

async function fetchUpstreamSchedule() {
  const apiKey = process.env.PETPOCKETBOOK_API_KEY || DEFAULT_API_KEY;
  const url = `${UPSTREAM_URL}?api_key=${encodeURIComponent(apiKey)}`;

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    const wrapped = new Error(`PetPocketbook upstream fetch failed: ${err.message}`);
    wrapped.cause = err;
    wrapped.status = 502;
    throw wrapped;
  }

  if (!response.ok) {
    const err = new Error(`PetPocketbook upstream returned ${response.status}`);
    err.status = 502;
    throw err;
  }

  const body = await response.json();
  const rawAppointments = Array.isArray(body && body.appointments) ? body.appointments : [];
  return rawAppointments
    .map(normalizeAppointment)
    .filter((appt) => appt !== null);
}

module.exports = {
  fetchUpstreamSchedule,
  isValidTime,
  isValidPetType,
  ALLOWED_PET_TYPES,
  TIME_SLOT_RE,
};

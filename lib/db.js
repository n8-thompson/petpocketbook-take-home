'use strict';

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const DB_DIR = path.join(__dirname, '..', 'db');
const DB_PATH = path.join(DB_DIR, 'schedules.sqlite');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

const READY = new Promise((resolve, reject) => {
  db.run(
    `CREATE TABLE IF NOT EXISTS schedules (
       date TEXT PRIMARY KEY,
       appointments TEXT NOT NULL,
       updated_at TEXT NOT NULL
     )`,
    (err) => (err ? reject(err) : resolve())
  );
});

function getSchedule(date) {
  return READY.then(
    () =>
      new Promise((resolve, reject) => {
        db.get(
          'SELECT date, appointments, updated_at FROM schedules WHERE date = ?',
          [date],
          (err, row) => {
            if (err) return reject(err);
            if (!row) return resolve(null);
            try {
              resolve({
                date: row.date,
                appointments: JSON.parse(row.appointments),
                updatedAt: row.updated_at,
              });
            } catch (parseErr) {
              reject(parseErr);
            }
          }
        );
      })
  );
}

function upsertSchedule(date, appointments) {
  const updatedAt = new Date().toISOString();
  const payload = JSON.stringify(appointments);
  return READY.then(
    () =>
      new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO schedules (date, appointments, updated_at)
           VALUES (?, ?, ?)
           ON CONFLICT(date) DO UPDATE SET
             appointments = excluded.appointments,
             updated_at = excluded.updated_at`,
          [date, payload, updatedAt],
          (err) => {
            if (err) return reject(err);
            resolve({ date, appointments, updatedAt });
          }
        );
      })
  );
}

module.exports = {
  getSchedule,
  upsertSchedule,
  DB_PATH,
};

'use strict';

const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const scheduleRouter = require('./routes/schedule');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Public assets (pet avatar SVGs and wireframes).
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/schedule', scheduleRouter);

// Serve the built React SPA when present. In dev, Vite runs on its own port
// with /api proxied here, so this block is a no-op until you `npm run build`.
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');
const CLIENT_INDEX = path.join(CLIENT_DIST, 'index.html');
if (fs.existsSync(CLIENT_INDEX)) {
  app.use(express.static(CLIENT_DIST));
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(CLIENT_INDEX);
  });
}

app.use((req, res, next) => {
  next(createError(404));
});

// JSON error handler (no view layer).
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;

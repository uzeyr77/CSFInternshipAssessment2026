const express = require('express');
const path = require('path');
const { initDb } = require('./db');
const animalsRouter = require('./routes/animals');
const paddocksRouter = require('./routes/paddocks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/animals', animalsRouter);
app.use('/api/paddocks', paddocksRouter);

initDb();

app.listen(PORT, () => {
  console.log(`FarmTracker running at http://localhost:${PORT}`);
});

module.exports = app;

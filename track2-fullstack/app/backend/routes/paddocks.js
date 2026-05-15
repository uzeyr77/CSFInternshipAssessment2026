const express = require('express');
const router = express.Router();
const { db } = require('../db');
const PADDOCK_SELECT = `SELECT id, name, capacity, (SELECT COUNT(*) FROM animals WHERE paddock_id = paddocks.id) AS animal_count FROM paddocks`;

router.get('/', (req, res) => {
  const paddocks = db.prepare(PADDOCK_SELECT).all();
  res.json(paddocks);
});

router.post('/', (req, res) => {
  const { name, capacity } = req.body;
  if (!name || !capacity) {
    return res.status(400).json({ error: 'name and capacity are required' });
  }
  const result = db.prepare(
    'INSERT INTO paddocks (name, capacity) VALUES (?, ?)'
  ).run(name, capacity);
  const paddock = db.prepare(`${PADDOCK_SELECT} WHERE id = ?`).get(result.lastInsertRowid);
  res.status(201).json(paddock);
});

router.get('/:id', (req, res) => {
  const paddock = db.prepare(`${PADDOCK_SELECT} WHERE id = ?`).get(req.params.id);
  if (!paddock) return res.status(404).json({ error: 'Paddock not found' });
  res.json(paddock);
});

module.exports = router;

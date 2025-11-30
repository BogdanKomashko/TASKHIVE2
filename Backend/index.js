const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./tasks.db');

// Створення таблиці, якщо немає
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  status TEXT
)`);

// CRUD API
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, status } = req.body;
  db.run(
    'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
    [title, description, status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));

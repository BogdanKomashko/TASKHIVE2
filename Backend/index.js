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
  status TEXT,
  assignee TEXT,
  department TEXT
)`);

// Міграція: додавання нових полів до існуючої таблиці
db.run(`ALTER TABLE tasks ADD COLUMN assignee TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('Migration error (assignee):', err.message);
  }
});

db.run(`ALTER TABLE tasks ADD COLUMN department TEXT`, (err) => {
  if (err && !err.message.includes('duplicate column')) {
    console.error('Migration error (department):', err.message);
  }
});

// Додавання прикладів задач (seed data) при першому запуску
db.get('SELECT COUNT(*) as count FROM tasks', (err, row) => {
  if (err) return console.error('Error checking tasks:', err);
  if (row.count === 0) {
    const sampleTasks = [
      {
        title: 'Створити дизайн головної сторінки',
        description: 'Розробити сучасний дизайн головної сторінки з використанням Figma. Включити адаптивну верстку для мобільних пристроїв та планшетів. Додати анімації та переходи між секціями.',
        status: 'Done',
        assignee: 'Олена Петренко',
        department: 'Дизайн'
      },
      {
        title: 'Налаштувати базу даних',
        description: 'Створити схему бази даних для зберігання користувачів та їх задач. Налаштувати індекси для оптимізації запитів. Додати міграції для версіонування БД.',
        status: 'Done',
        assignee: 'Іван Коваленко',
        department: 'Backend'
      },
      {
        title: 'Реалізувати API для аутентифікації',
        description: 'Створити endpoints для реєстрації, входу та оновлення профілю користувача. Додати JWT токени для безпеки. Реалізувати middleware для перевірки авторизації.',
        status: 'InProgress',
        assignee: 'Іван Коваленко',
        department: 'Backend'
      },
      {
        title: 'Додати тести для Backend',
        description: 'Написати unit тести для всіх API endpoints. Додати integration тести для перевірки взаємодії компонентів. Налаштувати CI/CD для автоматичного запуску тестів.',
        status: 'Todo',
        assignee: 'Марія Сидоренко',
        department: 'QA'
      },
      {
        title: 'Оптимізувати продуктивність',
        description: 'Проаналізувати швидкодію додатку за допомогою профілювальників. Оптимізувати запити до бази даних. Додати кешування для часто використовуваних даних.',
        status: 'Todo',
        assignee: 'Олексій Мельник',
        department: 'Backend'
      },
      {
        title: 'Створити документацію API',
        description: 'Написати повну документацію для всіх API endpoints з прикладами запитів та відповідей. Додати Swagger/OpenAPI специфікацію. Створити інтерактивну документацію.',
        status: 'InProgress',
        assignee: 'Андрій Шевченко',
        department: 'Документація'
      },
      {
        title: 'Додати темну тему',
        description: 'Реалізувати перемикач між світлою та темною темою. Створити набір кольорів для темної теми. Зберігати вибір користувача в localStorage.',
        status: 'Done',
        assignee: 'Олена Петренко',
        department: 'Frontend'
      },
      {
        title: 'Налаштувати деплой на сервер',
        description: 'Налаштувати автоматичний деплой на production сервер. Додати environment змінні. Налаштувати моніторинг та логування помилок.',
        status: 'Todo',
        assignee: 'Олексій Мельник',
        department: 'DevOps'
      },
      {
        title: 'Реалізувати компонент статистики',
        description: 'Створити компонент для відображення статистики з графіками. Додати візуалізацію розподілу задач по відділах та відповідальним.',
        status: 'InProgress',
        assignee: 'Олена Петренко',
        department: 'Frontend'
      },
      {
        title: 'Додати фільтрацію задач',
        description: 'Реалізувати фільтри для пошуку задач по відділу, відповідальному та статусу. Додати можливість сортування.',
        status: 'Todo',
        assignee: 'Андрій Шевченко',
        department: 'Frontend'
      }
    ];

    const stmt = db.prepare('INSERT INTO tasks (title, description, status, assignee, department) VALUES (?, ?, ?, ?, ?)');
    sampleTasks.forEach(task => {
      stmt.run(task.title, task.description, task.status, task.assignee, task.department);
    });
    stmt.finalize();
    console.log('✅ Додано приклади задач з відділами та відповідальними');
  }
});

// Кореневий маршрут
app.get('/', (req, res) => {
  res.json({
    message: 'TaskHive Backend API',
    version: '1.0.0',
    endpoints: {
      tasks: '/tasks',
      stats: '/stats',
      departments: '/departments',
      assignees: '/assignees',
      departmentStats: '/stats/departments',
      assigneeStats: '/stats/assignees'
    },
    note: 'Це Backend API. Відкрийте Frontend на http://localhost:5173'
  });
});

// CRUD API
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const { title, description, status, assignee, department } = req.body;
  db.run(
    'INSERT INTO tasks (title, description, status, assignee, department) VALUES (?, ?, ?, ?, ?)',
    [title, description, status || 'Todo', assignee || null, department || null],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ 
        id: this.lastID, 
        title, 
        description, 
        status: status || 'Todo',
        assignee: assignee || null,
        department: department || null
      });
    }
  );
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignee, department } = req.body;
  db.run(
    'UPDATE tasks SET title = ?, description = ?, status = ?, assignee = ?, department = ? WHERE id = ?',
    [title, description, status, assignee || null, department || null, id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
      res.json({ 
        id: parseInt(id), 
        title, 
        description, 
        status,
        assignee: assignee || null,
        department: department || null
      });
    }
  );
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted', id: parseInt(id) });
  });
});

// Статистика
app.get('/stats', (req, res) => {
  db.all(`
    SELECT 
      status,
      COUNT(*) as count
    FROM tasks
    GROUP BY status
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const stats = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0
    };
    
    rows.forEach(row => {
      stats.total += row.count;
      if (row.status === 'Todo') stats.todo = row.count;
      if (row.status === 'InProgress') stats.inProgress = row.count;
      if (row.status === 'Done') stats.done = row.count;
    });
    
    res.json(stats);
  });
});

// Статистика по відділах
app.get('/stats/departments', (req, res) => {
  db.all(`
    SELECT 
      COALESCE(department, 'Не вказано') as department,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Todo' THEN 1 ELSE 0 END) as todo,
      SUM(CASE WHEN status = 'InProgress' THEN 1 ELSE 0 END) as inProgress,
      SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as done
    FROM tasks
    GROUP BY department
    ORDER BY total DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Статистика по відповідальних
app.get('/stats/assignees', (req, res) => {
  db.all(`
    SELECT 
      COALESCE(assignee, 'Не призначено') as assignee,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'Todo' THEN 1 ELSE 0 END) as todo,
      SUM(CASE WHEN status = 'InProgress' THEN 1 ELSE 0 END) as inProgress,
      SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as done
    FROM tasks
    GROUP BY assignee
    ORDER BY total DESC
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Отримати список відділів
app.get('/departments', (req, res) => {
  db.all(`
    SELECT DISTINCT department
    FROM tasks
    WHERE department IS NOT NULL AND department != ''
    ORDER BY department
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.department));
  });
});

// Отримати список відповідальних
app.get('/assignees', (req, res) => {
  db.all(`
    SELECT DISTINCT assignee
    FROM tasks
    WHERE assignee IS NOT NULL AND assignee != ''
    ORDER BY assignee
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.assignee));
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

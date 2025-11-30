import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskDetailView from './TaskDetailView';
import StatisticsPanel from './StatisticsPanel';
import { FiPlus, FiCheckCircle, FiClock, FiCircle, FiBarChart2 } from 'react-icons/fi';

const API_URL = 'http://localhost:3001/tasks';
const STATS_URL = 'http://localhost:3001/stats';

const columns = [
  { id: 'Todo', title: 'To Do', color: '#4C9AFF' },
  { id: 'InProgress', title: 'In Progress', color: '#FFAB00' },
  { id: 'Done', title: 'Done', color: '#36B37E' }
];

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [showStatistics, setShowStatistics] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [assignees, setAssignees] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(STATS_URL);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
    fetchDepartments();
    fetchAssignees();
  }, []);

  useEffect(() => {
    fetchStats();
    fetchDepartments();
    fetchAssignees();
  }, [tasks]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch('http://localhost:3001/departments');
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchAssignees = async () => {
    try {
      const res = await fetch('http://localhost:3001/assignees');
      const data = await res.json();
      setAssignees(data);
    } catch (err) {
      console.error('Error fetching assignees:', err);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setShowForm(false);
      fetchStats();
    } catch (err) {
      console.error('Error adding task:', err);
      alert('Помилка при додаванні задачі');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updatedTask = await res.json();
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      setEditingTask(null);
      fetchStats();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Помилка при оновленні задачі');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю задачу?')) return;
    
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
      fetchStats();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Помилка при видаленні задачі');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      await handleUpdateTask(taskId, { ...task, status: newStatus });
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }

  return (
    <div className="kanban-container">
      <header className="kanban-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="logo-icon">📋</span>
            TaskHive
          </h1>
          <div className="header-right">
            <div className="stats-preview">
              <div className="stat-item" title="Всього задач">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Всього</span>
              </div>
              <div className="stat-item stat-todo" title="Задач в роботі">
                <FiCircle />
                <span className="stat-number">{stats.todo}</span>
              </div>
              <div className="stat-item stat-progress" title="В процесі">
                <FiClock />
                <span className="stat-number">{stats.inProgress}</span>
              </div>
              <div className="stat-item stat-done" title="Виконано">
                <FiCheckCircle />
                <span className="stat-number">{stats.done}</span>
              </div>
            </div>
            <button 
              className="btn-secondary"
              onClick={() => setShowStatistics(true)}
              title="Відкрити статистику"
            >
              <FiBarChart2 /> Статистика
            </button>
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              <FiPlus /> Створити задачу
            </button>
          </div>
        </div>
      </header>

      <div className="kanban-board">
        {columns.map(column => (
          <div key={column.id} className="kanban-column">
            <div className="column-header" style={{ borderTopColor: column.color }}>
              <h2 className="column-title">{column.title}</h2>
              <span className="task-count">{getTasksByStatus(column.id).length}</span>
            </div>
            <div className="column-content">
              {getTasksByStatus(column.id).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => setEditingTask(task)}
                  onDelete={() => handleDeleteTask(task.id)}
                  onView={(task) => setViewingTask(task)}
                  onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                  columns={columns}
                />
              ))}
              {getTasksByStatus(column.id).length === 0 && (
                <div className="empty-column">Немає задач</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {(showForm || editingTask) && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
          onSave={editingTask 
            ? (data) => handleUpdateTask(editingTask.id, data)
            : handleAddTask
          }
          columns={columns}
          departments={departments}
          assignees={assignees}
        />
      )}

      {viewingTask && (
        <TaskDetailView
          task={viewingTask}
          columns={columns}
          onClose={() => setViewingTask(null)}
          onEdit={() => {
            setViewingTask(null);
            setEditingTask(viewingTask);
          }}
          onDelete={() => handleDeleteTask(viewingTask.id)}
          onStatusChange={(newStatus) => handleStatusChange(viewingTask.id, newStatus)}
        />
      )}

      <StatisticsPanel
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
      />
    </div>
  );
}

function TaskModal({ task, onClose, onSave, columns, departments = [], assignees = [] }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'Todo');
  const [assignee, setAssignee] = useState(task?.assignee || '');
  const [department, setDepartment] = useState(task?.department || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ 
      title: title.trim(), 
      description: description.trim(), 
      status,
      assignee: assignee.trim() || null,
      department: department.trim() || null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Редагувати задачу' : 'Створити задачу'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Назва задачі *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введіть назву задачі"
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label>Опис</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введіть опис задачі"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Статус</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {columns.map(col => (
                <option key={col.id} value={col.id}>{col.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Відповідальний</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Введіть ім'я відповідального"
              list="assignees-list"
            />
            <datalist id="assignees-list">
              {assignees.map((name, idx) => (
                <option key={idx} value={name} />
              ))}
            </datalist>
          </div>
          <div className="form-group">
            <label>Відділ</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Введіть назву відділу"
              list="departments-list"
            />
            <datalist id="departments-list">
              {departments.map((dept, idx) => (
                <option key={idx} value={dept} />
              ))}
            </datalist>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className="btn-primary">
              {task ? 'Зберегти' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default KanbanBoard;


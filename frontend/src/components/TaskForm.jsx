import React, { useState } from 'react';

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, status }),
    })
      .then(res => res.json())
      .then(data => {
        alert('Задача додана!');
        setTitle('');
        setDescription('');
        setStatus('Todo');
        if (onAdd) onAdd(); // оновлення списку
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h2>Додати задачу</h2>
      <input
        type="text"
        placeholder="Назва"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        style={{ marginRight: '10px' }}
      />
      <input
        type="text"
        placeholder="Опис"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        style={{ marginRight: '10px' }}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="Todo">Todo</option>
        <option value="InProgress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button type="submit" style={{ marginLeft: '10px' }}>Додати</button>
    </form>
  );
}

export default TaskForm;

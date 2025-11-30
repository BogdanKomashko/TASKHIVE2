import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = () => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const statusColor = (status) => {
    if (status === 'Todo') return '#f5a623';
    if (status === 'InProgress') return '#4a90e2';
    if (status === 'Done') return '#7ed321';
    return '#ccc';
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Список задач</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {tasks.length === 0 ? (
          <p>Задач немає</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px',
              width: '200px',
              background: '#f9f9f9',
            }}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <span style={{
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: statusColor(task.status),
                color: 'white',
                fontSize: '12px'
              }}>{task.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;

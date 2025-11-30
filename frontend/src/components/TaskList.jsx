import React, { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Список задач</h2>
      {tasks.length === 0 ? (
        <p>Задач немає</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <strong>{task.title}</strong> - {task.description} [{task.status}]
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;

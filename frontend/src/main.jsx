import React from 'react';
import ReactDOM from 'react-dom/client';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>TASKHIVE</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

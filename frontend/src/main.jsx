import React from 'react';
import ReactDOM from 'react-dom/client';
import KanbanBoard from './components/KanbanBoard';
import './styles.css';

function App() {
  return <KanbanBoard />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

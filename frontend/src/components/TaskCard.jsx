import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiMoreVertical, FiEye } from 'react-icons/fi';

function TaskCard({ task, onEdit, onDelete, onStatusChange, onView, columns }) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status) => {
    const column = columns.find(col => col.id === status);
    return column?.color || '#4C9AFF';
  };

  return (
    <div className="task-card" style={{ borderLeftColor: getStatusColor(task.status) }}>
      <div className="task-card-header">
        <h3 
          className="task-title clickable-title"
          onClick={() => onView && onView(task)}
          title="Натисніть для детального перегляду"
        >
          {task.title}
        </h3>
        <div className="task-menu">
          <button 
            className="menu-trigger"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FiMoreVertical />
          </button>
          {showMenu && (
            <>
              <div className="menu-overlay" onClick={() => setShowMenu(false)} />
              <div className="task-menu-dropdown">
                <button onClick={() => { onView && onView(task); setShowMenu(false); }}>
                  <FiEye /> Детальний перегляд
                </button>
                <div className="menu-divider" />
                <button onClick={() => { onEdit(); setShowMenu(false); }}>
                  <FiEdit2 /> Редагувати
                </button>
                <button onClick={() => { onDelete(); setShowMenu(false); }}>
                  <FiTrash2 /> Видалити
                </button>
                <div className="menu-divider" />
                <div className="menu-section">Перемістити в:</div>
                {columns
                  .filter(col => col.id !== task.status)
                  .map(col => (
                    <button
                      key={col.id}
                      onClick={() => {
                        onStatusChange(col.id);
                        setShowMenu(false);
                      }}
                    >
                      {col.title}
                    </button>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-footer">
        <div className="task-meta">
          {task.assignee && (
            <span className="task-meta-item" title="Відповідальний">
              👤 {task.assignee}
            </span>
          )}
          {task.department && (
            <span className="task-meta-item" title="Відділ">
              🏢 {task.department}
            </span>
          )}
        </div>
        <span 
          className="task-status-badge"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {columns.find(col => col.id === task.status)?.title || task.status}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;


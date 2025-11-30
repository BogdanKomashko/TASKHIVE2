import React from 'react';
import { FiX, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';

function TaskDetailView({ task, columns, onClose, onEdit, onDelete, onStatusChange }) {
  if (!task) return null;

  const getStatusColor = (status) => {
    const column = columns.find(col => col.id === status);
    return column?.color || '#4C9AFF';
  };

  const currentStatus = columns.find(col => col.id === task.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="task-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-detail-header">
          <div className="task-detail-title-section">
            <button className="back-btn" onClick={onClose} title="Закрити">
              <FiArrowLeft />
            </button>
            <h1 className="task-detail-title">{task.title}</h1>
          </div>
          <div className="task-detail-actions">
            <button 
              className="btn-icon" 
              onClick={() => { onEdit(); onClose(); }}
              title="Редагувати"
            >
              <FiEdit2 />
            </button>
            <button 
              className="btn-icon btn-icon-danger" 
              onClick={() => { 
                if (window.confirm('Ви впевнені, що хочете видалити цю задачу?')) {
                  onDelete();
                  onClose();
                }
              }}
              title="Видалити"
            >
              <FiTrash2 />
            </button>
            <button className="close-btn" onClick={onClose} title="Закрити">
              <FiX />
            </button>
          </div>
        </div>

        <div className="task-detail-content">
          <div className="task-detail-section">
            <div className="task-detail-label">Статус</div>
            <div className="task-detail-status-group">
              <span 
                className="task-detail-status-badge"
                style={{ backgroundColor: getStatusColor(task.status) }}
              >
                {currentStatus?.title || task.status}
              </span>
              <div className="status-change-buttons">
                {columns
                  .filter(col => col.id !== task.status)
                  .map(col => (
                    <button
                      key={col.id}
                      className="btn-status-change"
                      onClick={() => {
                        onStatusChange(col.id);
                        onClose();
                      }}
                      style={{ borderColor: col.color, color: col.color }}
                    >
                      Перемістити в {col.title}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="task-detail-section">
            <div className="task-detail-label">Відповідальний</div>
            <div className="task-detail-info">
              {task.assignee || <span className="no-info">Не призначено</span>}
            </div>
          </div>

          <div className="task-detail-section">
            <div className="task-detail-label">Відділ</div>
            <div className="task-detail-info">
              {task.department || <span className="no-info">Не вказано</span>}
            </div>
          </div>

          <div className="task-detail-section">
            <div className="task-detail-label">Опис задачі</div>
            <div className="task-detail-description">
              {task.description || (
                <span className="no-description">Опис відсутній</span>
              )}
            </div>
          </div>

          <div className="task-detail-section">
            <div className="task-detail-label">ID задачі</div>
            <div className="task-detail-id">#{task.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailView;


import React, { useState, useEffect } from 'react';
import { FiX, FiBarChart2, FiUsers, FiBriefcase } from 'react-icons/fi';

const API_URL = 'http://localhost:3001';

function StatisticsPanel({ isOpen, onClose }) {
  const [departmentStats, setDepartmentStats] = useState([]);
  const [assigneeStats, setAssigneeStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('departments');

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [deptRes, assigneeRes] = await Promise.all([
        fetch(`${API_URL}/stats/departments`),
        fetch(`${API_URL}/stats/assignees`)
      ]);
      
      const deptData = await deptRes.json();
      const assigneeData = await assigneeRes.json();
      
      setDepartmentStats(deptData);
      setAssigneeStats(assigneeData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const maxValue = Math.max(
    ...departmentStats.map(d => d.total),
    ...assigneeStats.map(a => a.total),
    1
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="statistics-panel" onClick={(e) => e.stopPropagation()}>
        <div className="statistics-header">
          <h2>
            <FiBarChart2 /> Статистика та аналітика
          </h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="statistics-tabs">
          <button
            className={`tab-button ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <FiBriefcase /> По відділах
          </button>
          <button
            className={`tab-button ${activeTab === 'assignees' ? 'active' : ''}`}
            onClick={() => setActiveTab('assignees')}
          >
            <FiUsers /> По відповідальних
          </button>
        </div>

        <div className="statistics-content">
          {loading ? (
            <div className="loading-stats">Завантаження...</div>
          ) : (
            <>
              {activeTab === 'departments' && (
                <div className="stats-section">
                  <h3>Розподіл задач по відділах</h3>
                  <div className="stats-list">
                    {departmentStats.length === 0 ? (
                      <p className="no-data">Немає даних</p>
                    ) : (
                      departmentStats.map((dept, index) => (
                        <DepartmentCard
                          key={index}
                          department={dept}
                          maxValue={maxValue}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'assignees' && (
                <div className="stats-section">
                  <h3>Розподіл задач по відповідальних</h3>
                  <div className="stats-list">
                    {assigneeStats.length === 0 ? (
                      <p className="no-data">Немає даних</p>
                    ) : (
                      assigneeStats.map((assignee, index) => (
                        <AssigneeCard
                          key={index}
                          assignee={assignee}
                          maxValue={maxValue}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DepartmentCard({ department, maxValue }) {
  const percentage = (department.total / maxValue) * 100;
  
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h4>{department.department}</h4>
        <span className="stat-total">{department.total} задач</span>
      </div>
      
      <div className="stat-bars">
        <div className="stat-bar-group">
          <div className="stat-bar-label">
            <span>To Do</span>
            <span className="stat-bar-value">{department.todo}</span>
          </div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar stat-bar-todo"
              style={{ width: `${(department.todo / department.total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="stat-bar-group">
          <div className="stat-bar-label">
            <span>In Progress</span>
            <span className="stat-bar-value">{department.inProgress}</span>
          </div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar stat-bar-progress"
              style={{ width: `${(department.inProgress / department.total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="stat-bar-group">
          <div className="stat-bar-label">
            <span>Done</span>
            <span className="stat-bar-value">{department.done}</span>
          </div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar stat-bar-done"
              style={{ width: `${(department.done / department.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="stat-summary">
        <div className="summary-item">
          <span className="summary-label">Всього:</span>
          <span className="summary-value">{department.total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Виконано:</span>
          <span className="summary-value success">{department.done}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">В роботі:</span>
          <span className="summary-value warning">{department.inProgress}</span>
        </div>
      </div>
    </div>
  );
}

function AssigneeCard({ assignee, maxValue }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h4>{assignee.assignee}</h4>
        <span className="stat-total">{assignee.total} задач</span>
      </div>
      
      <div className="stat-bars">
        <div className="stat-bar-group">
          <div className="stat-bar-label">
            <span>To Do</span>
            <span className="stat-bar-value">{assignee.todo}</span>
          </div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar stat-bar-todo"
              style={{ width: `${(assignee.todo / assignee.total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="stat-bar-group">
          <div className="stat-bar-label">
            <span>In Progress</span>
            <span className="stat-bar-value">{assignee.inProgress}</span>
          </div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar stat-bar-progress"
              style={{ width: `${(assignee.inProgress / assignee.total) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="stat-bar-group">
          <div className="stat-bar-label">
            <span>Done</span>
            <span className="stat-bar-value">{assignee.done}</span>
          </div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar stat-bar-done"
              style={{ width: `${(assignee.done / assignee.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="stat-summary">
        <div className="summary-item">
          <span className="summary-label">Всього:</span>
          <span className="summary-value">{assignee.total}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Виконано:</span>
          <span className="summary-value success">{assignee.done}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">В роботі:</span>
          <span className="summary-value warning">{assignee.inProgress}</span>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;


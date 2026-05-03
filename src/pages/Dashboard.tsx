import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasksByAssignee, getAllTasks } from '../lib/db';
import type { Task } from '../types';
import { CheckCircle, Clock, AlertCircle, Activity, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { userData } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (userData?.role === 'admin') {
          const allTasks = await getAllTasks();
          setTasks(allTasks);
        } else if (userData?.id) {
          const myTasks = await getTasksByAssignee(userData.id);
          setTasks(myTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userData]);

  if (loading) {
    return <div className="flex-center" style={{ height: '100%' }}><div className="spinner"></div></div>;
  }

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const overdueCount = tasks.filter(t => t.status !== 'completed' && t.dueDate && t.dueDate < Date.now()).length;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'todo': return 'badge-todo';
      case 'in-progress': return 'badge-in-progress';
      case 'completed': return 'badge-completed';
      default: return 'badge-todo';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Welcome back, {userData?.displayName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-label">To Do</span>
            <Clock size={16} color="var(--text-muted)" />
          </div>
          <span className="stat-value">{todoCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-label">In Progress</span>
            <Activity size={16} color="var(--primary)" />
          </div>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>{inProgressCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-label">Completed</span>
            <CheckCircle size={16} color="var(--success)" />
          </div>
          <span className="stat-value" style={{ color: 'var(--success)' }}>{completedCount}</span>
        </div>
        <div className="stat-card">
          <div className="flex-between">
            <span className="stat-label">Overdue</span>
            <AlertCircle size={16} color={overdueCount > 0 ? 'var(--danger)' : 'var(--text-muted)'} />
          </div>
          <span className="stat-value" style={{ color: overdueCount > 0 ? 'var(--danger)' : 'inherit' }}>{overdueCount}</span>
        </div>
      </div>

      {/* Recent Tasks Table */}
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h2>{userData?.role === 'admin' ? 'Recent Tasks' : 'My Tasks'}</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{tasks.length} total</span>
      </div>
      <div className="table-wrapper" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No tasks found.</td>
              </tr>
            ) : (
              tasks.slice(0, 8).map(task => (
                <tr key={task.id}>
                  <td style={{ fontWeight: 500, fontSize: '0.875rem' }}>{task.title}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem' }}>
                    {task.dueDate ? (
                      <span style={{ color: task.dueDate < Date.now() && task.status !== 'completed' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {format(task.dueDate, 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

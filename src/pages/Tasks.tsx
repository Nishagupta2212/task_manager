import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllTasks, getTasksByAssignee, createTask, updateTask, getProjects, getUsers } from '../lib/db';
import type { Task, Project, User, TaskStatus } from '../types';
import { CheckSquare, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

export const Tasks: React.FC = () => {
  const { userData } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isAdmin = userData?.role === 'admin';

  useEffect(() => { fetchData(); }, [userData]);

  const fetchData = async () => {
    if (!userData) return;
    try {
      setLoading(true);
      let tasksData;
      if (isAdmin) {
        tasksData = await getAllTasks();
        const [p, u] = await Promise.all([getProjects(), getUsers()]);
        setProjects(p);
        setUsers(u);
      } else {
        tasksData = await getTasksByAssignee(userData.id);
        setProjects(await getProjects());
      }
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    try {
      setSubmitting(true);
      await createTask({
        title, description, projectId,
        assigneeId: assigneeId || null,
        status: 'todo',
        dueDate: dueDate ? new Date(dueDate).getTime() : null,
        createdBy: userData.id
      });
      setIsModalOpen(false);
      setTitle(''); setDescription(''); setProjectId(''); setAssigneeId(''); setDueDate('');
      fetchData();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const getProjectName = (pId: string) => projects.find(p => p.id === pId)?.name || '—';
  const getAssigneeName = (uId: string | null) => users.find(u => u.id === uId)?.displayName || 'Unassigned';

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
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage and track tasks</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner"></div></div>
      ) : tasks.length === 0 ? (
        <div className="flex-center" style={{ 
          padding: '4rem', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)'
        }}>
          <CheckSquare size={32} />
          <p style={{ fontSize: '0.875rem' }}>No tasks found.</p>
        </div>
      ) : (
        <div className="table-wrapper" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                {isAdmin && <th>Assignee</th>}
                <th>Due</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{task.title}</div>
                    {task.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{task.description}</div>}
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{getProjectName(task.projectId)}</td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <div className="avatar" style={{ width: '20px', height: '20px', fontSize: '0.625rem' }}>
                          {getAssigneeName(task.assigneeId).charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{getAssigneeName(task.assigneeId)}</span>
                      </div>
                    </td>
                  )}
                  <td style={{ fontSize: '0.8125rem' }}>
                    {task.dueDate ? (
                      <span style={{ color: task.dueDate < Date.now() && task.status !== 'completed' ? 'var(--danger)' : 'var(--text-secondary)' }}>
                        {format(task.dueDate, 'MMM d, yyyy')}
                      </span>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td>
                    <select className="status-select" value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && isAdmin && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Task</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required autoFocus placeholder="e.g. Fix login bug" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} required rows={2} placeholder="Brief description" />
              </div>
              <div className="form-group">
                <label className="form-label">Project</label>
                <select className="form-input" value={projectId} onChange={e => setProjectId(e.target.value)} required>
                  <option value="" disabled>Select project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-input" value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.displayName} ({u.role})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

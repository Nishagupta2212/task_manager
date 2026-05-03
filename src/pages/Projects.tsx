import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProjects, createProject } from '../lib/db';
import type { Project } from '../types';
import { FolderKanban, Plus, X } from 'lucide-react';
import { format } from 'date-fns';

export const Projects: React.FC = () => {
  const { userData } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    try {
      setSubmitting(true);
      await createProject({ name, description, createdBy: userData.id });
      setIsModalOpen(false);
      setName('');
      setDescription('');
      fetchProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Projects</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage your team's projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner"></div></div>
      ) : projects.length === 0 ? (
        <div className="flex-center" style={{ 
          padding: '4rem', 
          flexDirection: 'column', 
          gap: '0.75rem', 
          color: 'var(--text-muted)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <FolderKanban size={32} />
          <p style={{ fontSize: '0.875rem' }}>No projects yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {projects.map(project => (
            <div key={project.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{project.name}</h3>
                <FolderKanban size={16} color="var(--text-muted)" />
              </div>
              <p className="card-desc" style={{ flex: 1 }}>{project.description}</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Created {format(project.createdAt, 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>New Project</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required autoFocus placeholder="e.g. Website Redesign" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} required rows={3} style={{ resize: 'vertical' }} placeholder="What is this project about?" />
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

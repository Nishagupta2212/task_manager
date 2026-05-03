import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, approveUser } from '../lib/db';
import type { User } from '../types';
import { Users, Mail, Clock, CheckCircle, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export const Team: React.FC = () => {
  const { userData } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await approveUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, isApproved: true } : u));
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  if (userData?.role !== 'admin') {
    return (
      <div className="flex-center" style={{ height: '100%', flexDirection: 'column', gap: '0.75rem' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You don't have permission to view this page.</p>
      </div>
    );
  }

  const pendingUsers = users.filter(u => !u.isApproved);
  const activeUsers = users.filter(u => u.isApproved);

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Team Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Manage your organization members</p>
        </div>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{users.length} total</span>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner"></div></div>
      ) : (
        <>
          {/* ── Pending Approvals ─────────── */}
          {pendingUsers.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Pending Approvals
                  <span className="badge badge-danger">{pendingUsers.length}</span>
                </h2>
              </div>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div className="avatar">{user.displayName.charAt(0).toUpperCase()}</div>
                            <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.displayName}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                        <td><span className="badge badge-todo">{user.role}</span></td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} onClick={() => handleApprove(user.id)}>
                            <CheckCircle size={14} /> Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Active Members ────────────── */}
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h2>Active Members</h2>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{activeUsers.length} members</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No active members yet.</td>
                  </tr>
                ) : (
                  activeUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="avatar" style={{ backgroundColor: user.role === 'admin' ? 'var(--warning-dim)' : 'var(--primary-dim)', color: user.role === 'admin' ? 'var(--warning)' : 'var(--primary)' }}>
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{user.displayName}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-in-progress' : 'badge-todo'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        {format(user.createdAt, 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

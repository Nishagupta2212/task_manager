import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Activity } from 'lucide-react';
import { auth } from '../lib/firebase';
import { createUserProfile } from '../lib/db';
import type { Role } from '../types';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);

      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      await createUserProfile(user.uid, {
        email: user.email!,
        displayName,
        role,
        isApproved: role === 'admin',
      });

      if (role === 'member') {
        await auth.signOut();
        setSuccess('Account created successfully! An admin will review and approve your account. You will be able to log in once approved.');
        setEmail('');
        setPassword('');
        setDisplayName('');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="flex-center" style={{ marginBottom: '1.5rem' }}>
            <Activity size={32} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>Create account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Get started with TeamTask</p>
        </div>

        {error && (
          <div style={{ 
            marginBottom: '1.25rem', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--danger-dim)', 
            color: 'var(--danger)', 
            fontSize: '0.8125rem' 
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            marginBottom: '1.25rem', 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--success-dim)', 
            color: 'var(--success)', 
            fontSize: '0.8125rem',
            lineHeight: 1.5
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.375rem' }}>
              {role === 'admin' ? 'Admins can create projects and manage the team.' : 'Members require admin approval before logging in.'}
            </p>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

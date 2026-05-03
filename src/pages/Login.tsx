import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Activity } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);

      const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        // Only members require approval — admins always pass through
        if (userData.role === 'member' && !userData.isApproved) {
          await auth.signOut();
          setError('Your account is pending admin approval. Please wait.');
          setLoading(false);
          return;
        }
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.375rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Sign in to your account</p>
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 500 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

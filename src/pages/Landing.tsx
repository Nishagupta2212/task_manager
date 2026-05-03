import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Activity, 
  CheckSquare, 
  Users, 
  FolderKanban, 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart3,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Landing: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="loader-container"><div className="spinner"></div></div>;
  }

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Navbar ─────────────────────────── */}
      <nav style={{ 
        padding: '0.75rem 1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={22} color="var(--primary)" />
          <span style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.025em' }}>TeamTask</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
            Log In
          </Link>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────── */}
      <section style={{ 
        padding: '4rem 1.5rem 3rem', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '720px',
        margin: '0 auto',
      }}>
        <div className="badge badge-in-progress" style={{ marginBottom: '1.5rem', padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
          Built for modern teams
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', marginBottom: '1.25rem', lineHeight: 1.15, letterSpacing: '-0.03em' }}>
          The simplest way to<br />manage team tasks.
        </h1>
        <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1.0625rem)', color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.7 }}>
          Create projects, assign tasks, track progress, and keep your team aligned — all in one clean workspace.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <a href="#features" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
            Learn more
          </a>
        </div>
      </section>

      {/* ── Features Grid ──────────────────── */}
      <section id="features" style={{ padding: '3rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', textAlign: 'center' }}>Features</p>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', textAlign: 'center', marginBottom: '2.5rem', letterSpacing: '-0.02em' }}>Everything you need</h2>

          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <FeatureCard icon={<FolderKanban size={20} />} title="Projects" desc="Organize work into dedicated project spaces with clear ownership." />
            <FeatureCard icon={<CheckSquare size={20} />} title="Task Tracking" desc="Create tasks, set due dates, and move them through statuses." />
            <FeatureCard icon={<Users size={20} />} title="Team Directory" desc="See your entire team at a glance and assign work to the right people." />
            <FeatureCard icon={<Shield size={20} />} title="Role-based Access" desc="Admin and Member roles keep your workspace secure and organized." />
            <FeatureCard icon={<BarChart3 size={20} />} title="Dashboard" desc="Get a real-time overview of what's done, in progress, and overdue." />
            <FeatureCard icon={<Zap size={20} />} title="Instant Setup" desc="Sign up and start managing in under a minute. No setup friction." />
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────── */}
      <section style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', textAlign: 'center' }}>How it works</p>
          <h2 style={{ fontSize: '1.75rem', textAlign: 'center', marginBottom: '3rem', letterSpacing: '-0.02em' }}>Three steps to get started</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <StepItem number="01" title="Create your account" desc="Sign up as an Admin to start your workspace, or as a Member to join an existing team." />
            <StepItem number="02" title="Set up projects" desc="Admins create projects and invite team members. Organize work by initiative, client, or sprint." />
            <StepItem number="03" title="Assign & track tasks" desc="Create tasks, assign them to team members, set due dates, and watch progress on your dashboard." />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Ready to get started?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Create your free account and start managing tasks today.</p>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
          Create free account <ChevronRight size={16} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
          <Activity size={14} />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>TeamTask</span>
        </div>
        <p>© {new Date().getFullYear()} TeamTask. Built for high-performing teams.</p>
      </footer>
    </div>
  );
};

/* ── Sub-components ──────────────────────── */

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div style={{
    padding: '1.25rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    transition: 'border-color 0.15s ease',
  }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}
  >
    <div style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>{icon}</div>
    <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.375rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const StepItem: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div style={{
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'flex-start',
    padding: '1.25rem',
    backgroundColor: 'var(--bg-surface)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
  }}>
    <span style={{ 
      fontWeight: 700, 
      fontSize: '0.875rem', 
      color: 'var(--primary)', 
      backgroundColor: 'var(--primary-dim)',
      padding: '0.375rem 0.625rem',
      borderRadius: 'var(--radius-sm)',
      flexShrink: 0,
    }}>{number}</span>
    <div>
      <h3 style={{ fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  </div>
);

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Users, 
  LogOut, 
  Activity,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { to: '/tasks', icon: <CheckSquare size={18} />, label: 'My Tasks' },
    ...(userData?.role === 'admin' ? [
      { to: '/projects', icon: <FolderKanban size={18} />, label: 'Projects' },
      { to: '/team', icon: <Users size={18} />, label: 'Team' },
    ] : []),
  ];

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header" style={{ display: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>TeamTask</span>
        </div>
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar Overlay (mobile) */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Activity size={20} color="var(--primary)" />
          <h2>TeamTask</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={item.to === '/dashboard'}
              onClick={closeSidebar}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              {userData?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{userData?.displayName || 'User'}</div>
              <div className="user-role">{userData?.role || 'member'}</div>
            </div>
            <button onClick={handleLogout} title="Sign out" style={{ color: 'var(--text-muted)', padding: '0.25rem', flexShrink: 0 }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

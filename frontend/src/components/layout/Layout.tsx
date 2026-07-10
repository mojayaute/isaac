import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api';
import SyncStatus from './SyncStatus';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <h1>Sistema IPH-DELITOS</h1>
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            <SyncStatus />
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
            <Link to="/admin" className={isActive('/admin')}>
              Admin
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </nav>
        </div>
        {menuOpen && (
          <button
            type="button"
            className="nav-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />
        )}
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

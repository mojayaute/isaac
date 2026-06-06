import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
          <h1>Sistema IPH-DELITOS</h1>
          <nav className="nav">
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
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

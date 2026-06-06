import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../services/api';
import './AdminPage.css';

const AdminPage = () => {
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getAllUsers(),
  });

  if (isLoading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Panel de Administración</h1>

      <div className="users-mobile-list">
        {users?.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-card-header">
              <strong>{user.username}</strong>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>
            <div className="user-card-row">
              <span className="user-card-label">Nombre</span>
              <span>{user.full_name || '-'}</span>
            </div>
            <div className="user-card-row">
              <span className="user-card-label">Email</span>
              <span>{user.email || '-'}</span>
            </div>
            <div className="user-card-row">
              <span className="user-card-label">Estado</span>
              <span className={user.is_active ? 'status-active' : 'status-inactive'}>
                {user.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <button type="button" className="view-btn view-btn-full">
              Ver Respuestas
            </button>
          </div>
        ))}
        {users?.length === 0 && (
          <div className="empty-state">No hay usuarios registrados</div>
        )}
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.full_name || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={user.is_active ? 'status-active' : 'status-inactive'}>
                    {user.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button type="button" className="view-btn">Ver Respuestas</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && (
          <div className="empty-state">No hay usuarios registrados</div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

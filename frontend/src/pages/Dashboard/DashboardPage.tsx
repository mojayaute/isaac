import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formsApi, progressApi, authApi } from '../../services/api';
import { useState, useEffect } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Obtener usuario actual
    authApi.getCurrentUser().then((user) => {
      setUserId(user.id);
    });
  }, []);

  // Obtener formularios
  const { data: forms, isLoading: formsLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () => formsApi.getAll(),
  });

  // Obtener progreso
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress', userId],
    queryFn: () => progressApi.getByUser(userId),
    enabled: !!userId,
  });

  if (formsLoading || progressLoading) {
    return <div className="loading">Cargando...</div>;
  }

  const completedCount = progress?.completed_forms || 0;
  const totalForms = progress?.total_forms || 15;
  const progressPercentage = totalForms > 0 ? (completedCount / totalForms) * 100 : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="progress-summary">
          <div className="progress-info">
            <span className="progress-text">
              Progreso: {completedCount} de {totalForms} formularios
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="forms-grid">
        {forms?.map((form) => (
          <Link
            key={form.id}
            to={`/form/${form.formNumber}`}
            className="form-card"
          >
            <div className="form-number">Formulario {form.formNumber}</div>
            <h3>{form.title}</h3>
            {form.description && (
              <p className="form-description">{form.description}</p>
            )}
            <div className="form-status">
              {progress?.completed_forms && progress.completed_forms >= form.formNumber ? (
                <span className="status completed">✓ Completado</span>
              ) : (
                <span className="status pending">Pendiente</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;

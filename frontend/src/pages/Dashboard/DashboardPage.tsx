import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { loadForms, loadLocalProgress } from '../../offline/dataService';
import { getUserResponses } from '../../offline/responsesStore';
import { useState, useEffect } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    authApi.getCurrentUser().then((user) => {
      setUserId(user.id);
    });
  }, []);

  const { data: forms, isLoading: formsLoading } = useQuery({
    queryKey: ['forms'],
    queryFn: () => loadForms(),
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress', userId],
    queryFn: () => loadLocalProgress(userId),
    enabled: !!userId,
  });

  // Estado por formulario, calculado desde lo guardado localmente.
  const { data: statuses } = useQuery({
    queryKey: ['form-statuses', userId],
    queryFn: async () => {
      const responses = await getUserResponses(userId);
      const map: Record<number, string> = {};
      responses.forEach((r) => {
        map[r.formNumber] = r.status;
      });
      return map;
    },
    enabled: !!userId,
  });

  if (formsLoading || progressLoading) {
    return <div className="loading">Cargando...</div>;
  }

  const completedCount = progress?.completed || 0;
  const totalForms = progress?.total || 15;
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
        {forms?.map((form) => {
          const status = statuses?.[form.formNumber];
          return (
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
                {status === 'completed' ? (
                  <span className="status completed">✓ Completado</span>
                ) : status === 'draft' ? (
                  <span className="status pending">Borrador</span>
                ) : (
                  <span className="status pending">Pendiente</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;

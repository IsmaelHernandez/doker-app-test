import { useEffect, useState } from 'react';
import JobSearchPanel from '@components/JobSearchPanel';

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState({ state: 'loading', message: 'Conectando con el backend...' });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/status')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setApiStatus({ state: 'online', message: data.message });
      })
      .catch(() => {
        if (!cancelled) setApiStatus({ state: 'offline', message: 'No se pudo conectar con el backend.' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Bienvenido de nuevo, asdsads</h1>
        <p className="page-subtitle">Aquí está el resumen del rendimiento de tu negocio para el día de hoy.</p>
      </div>
      <div className={`api-status-banner ${apiStatus.state}`}>
        <span className="status-dot" />
        <span>{apiStatus.message}</span>
      </div>
      <JobSearchPanel />
      <div className="dashboard-grid">
      </div>
    </div>
  );
}

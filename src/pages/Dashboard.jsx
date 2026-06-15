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
        if (!cancelled) setApiStatus({ state: 'offline', message: 'No se pudo conectar con el backend (api/server.js).' });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      title: 'Ingresos Totales',
      value: '$24,580.00',
      trend: '+12.5%',
      isPositive: true,
      color: 'purple',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
    {
      title: 'Visitas Únicas',
      value: '14,290',
      trend: '+8.2%',
      isPositive: true,
      color: 'blue',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A2.25 2.25 0 0 1 12.75 21.5h-1.5a2.25 2.25 0 0 1-2.25-2.263V19.13m0 0A9.37 9.37 0 0 1 6.375 19.5a9.337 9.337 0 0 1-4.121-.952 4.125 4.125 0 0 1 7.533-2.493M9 19.128v-.003c0-1.113.285-2.16.786-3.07M9 19.128v.109A2.25 2.25 0 0 0 11.25 21.5h1.5a2.25 2.25 0 0 0 2.25-2.263V19.13M8.997 14.902c.03-.357.05-.718.05-1.082 0-3.866-3.134-7-7-7m7.003 7.003V14a3 3 0 1 1-6 0v-.182m0-.003a3 3 0 1 1 6 0ZM21 12a9 9 0 0 0-9-9m9 9a9 9 0 0 0-9-9m0 0a9 9 0 0 1-9 9" />
        </svg>
      )
    },
    {
      title: 'Tasa de Conversión',
      value: '4.83%',
      trend: '-1.4%',
      isPositive: false,
      color: 'green',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
        </svg>
      )
    },
    {
      title: 'Nuevos Clientes',
      value: '842',
      trend: '+18.7%',
      isPositive: true,
      color: 'orange',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6 6 0 0 1 6-6h.75a6 6 0 0 1 6 6v.11" />
        </svg>
      )
    }
  ];

  const chartData = [
    { label: 'Ene', value: 45, displayValue: '45k' },
    { label: 'Feb', value: 65, displayValue: '65k' },
    { label: 'Mar', value: 50, displayValue: '50k' },
    { label: 'Abr', value: 85, displayValue: '85k' },
    { label: 'May', value: 70, displayValue: '70k' },
    { label: 'Jun', value: 95, displayValue: '95k' }
  ];

  const performanceItems = [
    { label: 'Optimización SEO', value: 92, color: 'purple' },
    { label: 'Tasa de Carga', value: 78, color: 'blue' },
    { label: 'Retención de Usuarios', value: 85, color: 'green' }
  ];

  return (
    <div>
      {/* Encabezado del Dashboard */}
      <div className="page-header">
        <h1>Bienvenido de nuevo, asdsads</h1>
        <p className="page-subtitle">Aquí está el resumen del rendimiento de tu negocio para el día de hoy.</p>
      </div>

      {/* Estado de conexión con el backend (Agente de Empleos) */}
      <div className={`api-status-banner ${apiStatus.state}`}>
        <span className="status-dot" />
        <span>{apiStatus.message}</span>
      </div>

      {/* Agente de Búsqueda de Empleo: perfil (CV/prompt) y vacantes encontradas */}
      <JobSearchPanel />

      {/* Grid de Métricas Principales */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <span className="stat-title">{stat.title}</span>
              <div className={`stat-icon-wrapper ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-body">
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-trend ${stat.isPositive ? 'up' : 'down'}`}>
                {stat.isPositive ? '↑' : '↓'} {stat.trend}
                <span className="trend-text"> vs. mes anterior</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Panel secundario con gráficos y métricas detalladas */}
      <div className="dashboard-grid">
        {/* Gráfico de Actividad */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Rendimiento Operativo</h3>
          </div>
          <div className="activity-chart">
            {chartData.map((data, i) => (
              <div key={i} className="chart-column">
                <div 
                  className="chart-bar-value" 
                  style={{ height: `${data.value}%` }}
                >
                  <span className="chart-tooltip">{data.displayValue}</span>
                </div>
                <span className="chart-label">{data.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de Rendimiento */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3>Objetivos Clave</h3>
          </div>
          <div className="progress-list">
            {performanceItems.map((item, i) => (
              <div key={i} className="progress-item">
                <div className="progress-meta">
                  <span className="progress-label">{item.label}</span>
                  <span className="progress-val">{item.value}%</span>
                </div>
                <div className="progress-track">
                  <div 
                    className={`progress-bar ${item.color}`} 
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';

const BRIEFCASE_ICON = (
  <svg className="main-icon" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);

export default function Products() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const occJobs = (data.jobs ?? []).filter((job) => job.source === 'occ');
        setJobs(occJobs);
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar las vacantes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* Encabezado */}
      <div className="page-header">
        <h1>Vacantes de OCC Mundial</h1>
        <p className="page-subtitle">Resultados guardados por el agente de búsqueda de empleo desde OCC.</p>
      </div>

      {loading && <p className="page-subtitle">Cargando vacantes...</p>}
      {!loading && error && <p className="page-subtitle">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p className="page-subtitle">Aún no hay vacantes de OCC guardadas. Ejecuta una búsqueda desde el Dashboard.</p>
      )}

      {/* Grid de Vacantes */}
      {jobs.length > 0 && (
        <div className="products-grid">
          {jobs.map((job) => (
            <div key={job.id} className="product-card">
              {/* Icono / Distintivo de fuente */}
              <div className="product-img-wrapper">
                <span className="product-badge">OCC Mundial</span>

                <div className="product-action-overlay">
                  <a href={job.link} target="_blank" rel="noreferrer" className="overlay-btn">
                    Ver Vacante
                  </a>
                </div>

                {BRIEFCASE_ICON}
              </div>

              {/* Información de la vacante */}
              <div className="product-info">
                <div>
                  <span className="product-category">{job.company || 'Empresa no especificada'}</span>
                  <h3 className="product-name" title={job.title}>{job.title}</h3>
                </div>

                {/* Compatibilidad */}
                <div className="product-rating">
                  {job.match_score != null ? (
                    <>
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {Math.round(job.match_score)}% compatible
                    </>
                  ) : (
                    <span>Sin evaluar aún</span>
                  )}
                </div>

                {/* Aplicar */}
                <div className="product-footer">
                  <span className="product-price">OCC Mundial</span>
                  <a href={job.link} target="_blank" rel="noreferrer" className="add-cart-btn" title="Ver vacante">
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Header({ onMenuToggle }) {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Efecto para sincronizar la clase HTML del tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Alternar entre modo claro y oscuro
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Obtener el título legible según la ruta actual
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    
    // Quita la barra / y capitaliza
    const segment = path.substring(1);
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Botón hamburguesa visible solo en móviles */}
        <button 
          className="mobile-toggle" 
          onClick={onMenuToggle}
          aria-label="Abrir menú"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        {/* Título dinámico de la página activa */}
        <h2 className="page-title">{getPageTitle()}</h2>
      </div>

      {/* Buscador interactivo (oculto en móviles) */}
      <div className="header-search">
        <div className="search-wrapper">
          <span className="search-icon">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
            </svg>
          </span>
          <input type="text" placeholder="Buscar métricas, productos..." />
        </div>
      </div>

      {/* Botones de acción derecha */}
      <div className="header-actions">
        {/* Conmutador de Tema Claro / Oscuro */}
        <button 
          className="action-btn theme-toggle" 
          onClick={toggleTheme}
          title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          ) : (
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.947-8.947h-2.25M5.147 12h-2.25m15.63-7.778-1.591 1.591M6.216 17.784-1.591-1.591m11.364 0-1.591-1.591M6.216 6.216l-1.591 1.591M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
            </svg>
          )}
        </button>

        {/* Campana de Notificaciones interactiva */}
        <button className="action-btn" title="Notificaciones">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="badge" />
        </button>

        {/* Perfil del Usuario abreviado */}
        <div className="user-profile-menu">
          <div className="avatar-thumb">JD</div>
          <div className="profile-info">
            <span className="profile-name">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}

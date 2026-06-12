import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/Header';
import Sidebar from '@components/Sidebar';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Barra lateral de navegación (Sidebar) */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Contenedor del contenido principal y cabecera */}
      <div className="main-content-wrapper">
        {/* Cabecera superior (Header) */}
        <Header 
          onMenuToggle={() => setIsMobileMenuOpen(prev => !prev)} 
        />

        {/* Área interactiva donde se renderizan las páginas activas */}
        <main className="page-content-area">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

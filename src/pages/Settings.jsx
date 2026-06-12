import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    mfa: false,
    darkModeAuto: true,
    language: 'es',
    frequency: 'weekly'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      {/* Encabezado */}
      <div className="page-header">
        <h1>Configuración</h1>
        <p className="page-subtitle">Personaliza las preferencias generales de tu sistema y cuenta.</p>
      </div>

      {/* Ajustes de Seguridad */}
      <div className="settings-section">
        <h3 className="settings-title">Seguridad y Cuenta</h3>
        <div className="settings-list">
          <div className="settings-item">
            <div className="item-info">
              <span className="item-label">Autenticación de Doble Factor (MFA)</span>
              <span className="item-desc">Añade una capa extra de seguridad solicitando un código al iniciar sesión.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.mfa} 
                onChange={() => handleToggle('mfa')} 
              />
              <span className="slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Ajustes de Preferencias */}
      <div className="settings-section">
        <h3 className="settings-title">Preferencias de Sistema</h3>
        <div className="settings-list">
          
          {/* Toggle Notificaciones */}
          <div className="settings-item">
            <div className="item-info">
              <span className="item-label">Notificaciones por Correo</span>
              <span className="item-desc">Recibe boletines de estadísticas y alertas de productos semanalmente.</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={settings.notifications} 
                onChange={() => handleToggle('notifications')} 
              />
              <span className="slider" />
            </label>
          </div>

          {/* Selector de idioma */}
          <div className="settings-item">
            <div className="item-info">
              <span className="item-label">Idioma de la Interfaz</span>
              <span className="item-desc">Idioma predeterminado para todos los módulos de la aplicación.</span>
            </div>
            <select 
              value={settings.language} 
              onChange={(e) => handleSelect('language', e.target.value)}
            >
              <option value="es">Español (ES)</option>
              <option value="en">English (US)</option>
              <option value="pt">Português (BR)</option>
            </select>
          </div>

          {/* Selector de reportes */}
          <div className="settings-item">
            <div className="item-info">
              <span className="item-label">Frecuencia de Reportes</span>
              <span className="item-desc">Cada cuánto tiempo deseas que se te envíen resúmenes en PDF.</span>
            </div>
            <select 
              value={settings.frequency} 
              onChange={(e) => handleSelect('frequency', e.target.value)}
            >
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}

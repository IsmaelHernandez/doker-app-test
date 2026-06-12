import { useState } from 'react';

export default function Profile() {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@coreapp.com',
    phone: '+1 (555) 234-5678',
    role: 'Administrator',
    location: 'San Francisco, CA'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Perfil actualizado con éxito!');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Mi Perfil</h1>
        <p className="page-subtitle">Gestiona tu información personal y detalles de contacto.</p>
      </div>
      <div className="profile-container">
        <div className="profile-banner" />
        <div className="profile-meta-section">
          <div className="profile-avatar-row">
            <div className="large-avatar">JD</div>
            <button className="edit-profile-btn" onClick={handleSubmit}>
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75a1.5 1.5 0 1 1 3 0l-12 12a1.5 1.5 0 0 1-.44.88L3 19.5l2.87-2.87a1.5 1.5 0 0 1 .88-.44l12-12Z" />
              </svg>
              Guardar Cambios
            </button>
          </div>

          <div className="profile-title-block">
            <h2>{formData.firstName} {formData.lastName}</h2>
            <span className="profile-handle">@johndoe_admin</span>
          </div>

          {/* Formulario de Detalles */}
          <form className="profile-details-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Ubicación</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

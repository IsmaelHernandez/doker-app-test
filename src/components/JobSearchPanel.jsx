import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const SOURCE_LABELS = {
  linkedin: 'LinkedIn',
  occ: 'OCC Mundial',
  computrabajo: 'Computrabajo',
};

export default function JobSearchPanel() {
  const [activeTab, setActiveTab] = useState('cv');
  const [profile, setProfile] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [saving, setSaving] = useState(false);

  const [searchPuesto, setSearchPuesto] = useState('');
  const [searchUbicacion, setSearchUbicacion] = useState('');
  const [searchRemoto, setSearchRemoto] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState({ type: 'idle', message: '' });
  const [evaluating, setEvaluating] = useState(false);
  const [minMatch, setMinMatch] = useState(0);

  const loadProfile = () => {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .catch(() => {});
  };

  const loadJobs = () => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    loadProfile();
    loadJobs();
  }, []);

  const handleCvSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setStatus({ type: 'error', message: 'Selecciona un archivo PDF.' });
      return;
    }

    setSaving(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);

      const res = await fetch('/api/profile/cv', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'No se pudo procesar el CV.');

      setProfile(data.profile);
      setCvFile(null);
      setStatus({ type: 'success', message: 'CV procesado correctamente.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!promptText.trim()) {
      setStatus({ type: 'error', message: 'Describe el puesto que buscas.' });
      return;
    }

    setSaving(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/profile/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptText }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'No se pudo guardar el perfil.');

      setProfile(data.profile);
      setStatus({ type: 'success', message: 'Perfil guardado correctamente.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchPuesto.trim()) {
      setSearchStatus({ type: 'error', message: 'Indica el puesto a buscar.' });
      return;
    }

    setSearching(true);
    setSearchStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/scrape/occ/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puesto: searchPuesto,
          ubicacion: searchUbicacion || undefined,
          remoto: searchRemoto,
        }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'No se pudo ejecutar la búsqueda.');

      loadJobs();
      setSearchStatus({
        type: 'success',
        message: `Se encontraron ${data.total} vacante(s), ${data.nuevas} nueva(s) guardada(s).`,
      });
    } catch (err) {
      setSearchStatus({ type: 'error', message: err.message });
    } finally {
      setSearching(false);
    }
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    setSearchStatus({ type: 'idle', message: '' });

    try {
      const res = await fetch('/api/jobs/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todas: true }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'No se pudo evaluar la compatibilidad.');

      loadJobs();
      setSearchStatus({
        type: 'success',
        message: `Se evaluaron ${data.evaluadas} vacante(s) pendiente(s).`,
      });
    } catch (err) {
      setSearchStatus({ type: 'error', message: err.message });
    } finally {
      setEvaluating(false);
    }
  };

  const filteredJobs = jobs.filter((job) => minMatch === 0 || (job.match_score ?? 0) >= minMatch);

  const sourceBodyTemplate = (job) => SOURCE_LABELS[job.source] ?? job.source;

  const matchBodyTemplate = (job) => {
    if (job.match_score == null) return <Tag severity="secondary" value="Sin evaluar" />;

    const score = Math.round(job.match_score);
    const severity = score >= 80 ? 'success' : score >= 50 ? 'warning' : 'danger';
    return <Tag severity={severity} value={`${score}%`} />;
  };

  const linkBodyTemplate = (job) => (
    <Button
      label="Ver vacante"
      icon="pi pi-external-link"
      size="small"
      text
      onClick={() => window.open(job.link, '_blank', 'noopener,noreferrer')}
    />
  );

  return (
    <div className="job-search-panel">
      <div className="dashboard-panel">
        <div className="panel-header">
          <h3>Perfil de búsqueda</h3>
        </div>

        {profile && (
          <div className="current-profile">
            <span className="current-profile-tag">
              {profile.source_type === 'cv' ? `CV: ${profile.file_name}` : 'Prompt de texto'}
            </span>
            <p className="current-profile-preview">{profile.content.slice(0, 220)}{profile.content.length > 220 ? '…' : ''}</p>
          </div>
        )}

        <div className="profile-input-tabs">
          <Button
            type="button"
            label="Subir CV (PDF)"
            outlined={activeTab !== 'cv'}
            onClick={() => setActiveTab('cv')}
          />
          <Button
            type="button"
            label="Describir puesto"
            outlined={activeTab !== 'prompt'}
            onClick={() => setActiveTab('prompt')}
          />
        </div>

        {activeTab === 'cv' ? (
          <form className="profile-input-form" onSubmit={handleCvSubmit}>
            <div className="form-group">
              <label htmlFor="cv-file">Archivo PDF</label>
              <input
                type="file"
                id="cv-file"
                accept="application/pdf"
                onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" label={saving ? 'Procesando...' : 'Subir CV'} loading={saving} />
          </form>
        ) : (
          <form className="profile-input-form" onSubmit={handlePromptSubmit}>
            <div className="form-group">
              <label htmlFor="prompt-text">¿Qué trabajo estás buscando?</label>
              <textarea
                id="prompt-text"
                rows={4}
                placeholder="Ej. Busco un puesto de desarrollador frontend con React, remoto, en México..."
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
              />
            </div>
            <Button type="submit" label={saving ? 'Guardando...' : 'Guardar perfil'} loading={saving} />
          </form>
        )}

        {status.message && (
          <p className={`profile-status ${status.type}`}>{status.message}</p>
        )}
      </div>

      <br />

      <div className="dashboard-panel jobs-panel">
        <div className="panel-header">
          <h3>Vacantes encontradas</h3>
        </div>

        <form className="search-trigger-form" onSubmit={handleSearchSubmit}>
          <div className="form-group">
            <label htmlFor="search-puesto">Puesto</label>
            <input
              type="text"
              id="search-puesto"
              placeholder="Ej. Desarrollador Frontend"
              value={searchPuesto}
              onChange={(e) => setSearchPuesto(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="search-ubicacion">Ubicación (opcional)</label>
            <input
              type="text"
              id="search-ubicacion"
              placeholder="Ej. Ciudad de México"
              value={searchUbicacion}
              onChange={(e) => setSearchUbicacion(e.target.value)}
            />
          </div>
          <label className="search-remoto-check">
            <input
              type="checkbox"
              checked={searchRemoto}
              onChange={(e) => setSearchRemoto(e.target.checked)}
            />
            Remoto
          </label>
          <Button type="submit" label={searching ? 'Buscando en OCC...' : 'Buscar ahora en OCC'} loading={searching} />
          <Button
            type="button"
            label={evaluating ? 'Evaluando...' : 'Evaluar compatibilidad'}
            outlined
            loading={evaluating}
            onClick={handleEvaluate}
          />
        </form>

        {searchStatus.message && (
          <p className={`profile-status ${searchStatus.type}`}>{searchStatus.message}</p>
        )}

        <div className="match-filter">
          <span className="match-filter-label">Filtrar por match:</span>
          {[0, 50, 80].map((umbral) => (
            <Button
              key={umbral}
              type="button"
              size="small"
              label={umbral === 0 ? 'Todas' : `≥ ${umbral}%`}
              outlined={minMatch !== umbral}
              onClick={() => setMinMatch(umbral)}
            />
          ))}
        </div>

        {jobs.length === 0 ? (
          <p className="jobs-empty">Aún no hay vacantes guardadas. Cuando el agente encuentre coincidencias, aparecerán aquí.</p>
        ) : (
          <DataTable
            value={filteredJobs}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 20]}
            emptyMessage="No hay vacantes que cumplan con el match mínimo seleccionado."
            stripedRows
          >
            <Column field="title" header="Puesto" />
            <Column field="company" header="Empresa" body={(job) => job.company || '—'} />
            <Column header="Fuente" body={sourceBodyTemplate} />
            <Column header="Match" body={matchBodyTemplate} />
            <Column header="" body={linkBodyTemplate} />
          </DataTable>
        )}
      </div>
    </div>
  );
}
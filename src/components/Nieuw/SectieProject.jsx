import { useNieuwForm } from './NieuwFormContext';
import './NieuwPage.css';

export default function SectieProject() {
  const {
    form,
    update,
    errCls,
    sections,
    toggleSection,
    projects,
  } = useNieuwForm();

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('project')}>
        <h3>Project</h3>
        <span className={`toggle ${sections.project ? 'open' : ''}`}>▾</span>
      </div>
      {sections.project && (
        <div className="section-content">
          <div className={`form-group${errCls('project')}`}>
            <label>Project *</label>
            <select value={form.project} onChange={e => update('project', e.target.value)}>
              <option value="">-- Kies --</option>
              {projects.map(p => (
                <option key={p.id} value={p.naam}>
                  {p.nummer ? `${p.nummer} - ${p.naam}` : p.naam}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row-3">
            <div className={`form-group${errCls('ringer_nummer')}`}>
              <label>Ringernr *</label>
              <input type="text" value={form.ringer_nummer}
                onChange={e => update('ringer_nummer', e.target.value)}
                placeholder="bijv. 3254" />
            </div>
            <div className="form-group">
              <label>Initiaal</label>
              <input type="text" value={form.ringer_initiaal}
                onChange={e => update('ringer_initiaal', e.target.value)}
                placeholder="bijv. TtA" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

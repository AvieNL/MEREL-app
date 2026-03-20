import { useNieuwForm } from './NieuwFormContext';
import { TAAL_LABELS } from './NieuwPage.constants';
import './NieuwPage.css';

export default function SectieSoort() {
  const {
    form,
    errCls,
    sections,
    toggleSection,
    settings,
    euringCode,
    speciesInfo,
    suggestions,
    vogelnaamRef,
    handleSpeciesInput,
    handleSpeciesFocus,
    selectSpecies,
    euringLookup,
    editRecord,
  } = useNieuwForm();

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('nieuweVangst')}>
        <h3>{editRecord ? 'Vangst wijzigen' : 'Nieuwe vangst'}</h3>
        <span className={`toggle ${sections.nieuweVangst ? 'open' : ''}`}>▾</span>
      </div>
      {sections.nieuweVangst && (
        <div className="section-content">
          <div className={`form-group species-input${errCls('vogelnaam')}`}>
            <label>Vogelnaam *</label>
            <input
              ref={vogelnaamRef}
              type="text"
              value={form.vogelnaam}
              onChange={e => handleSpeciesInput(e.target.value)}
              onFocus={handleSpeciesFocus}
              placeholder="Begin te typen..."
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map(s => {
                  const code = euringLookup[s.naam_nl?.toLowerCase()] || '';
                  return (
                    <li key={s.naam_nl + (s.matchedField || '')} onClick={() => selectSpecies(s.naam_nl)}>
                      <div className="suggestion-content">
                        <span className="suggestion-name">
                          {s.naam_nl}{code && <span className="suggestion-euring"> ({code})</span>}
                        </span>
                        {s.matchedName && (
                          <span className="suggestion-sub">{s.matchedName} ({TAAL_LABELS[s.matchedField]})</span>
                        )}
                        {s.isRecent && !s.matchedName && form.vogelnaam.length < 2 && (
                          <span className="suggestion-sub">Recent gebruikt</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Soort-info paneel */}
          {speciesInfo && settings?.hulpModus !== 'basis' && (
            <div className="soort-info-panel">
              <div className="soort-info-grid">
                <div className="soort-info-item highlight">
                  <span className="sii-label">Ringmaat</span>
                  <span className="sii-value">{speciesInfo.ringmaat || '—'}</span>
                </div>
                {speciesInfo.ruitype && (
                  <div className={`soort-info-item${['A','B','C','D'].includes(speciesInfo.ruitype) ? ' ruitype-highlight' : ''}`}>
                    <span className="sii-label">Ruitype</span>
                    <span className="sii-value">
                      {speciesInfo.ruitype}
                      {speciesInfo.ruitype === 'A' && <span className="ruitype-badge">Leeftijd beperkt</span>}
                      {speciesInfo.ruitype === 'B' && <span className="ruitype-badge">Ruigrens bepalend</span>}
                      {speciesInfo.ruitype === 'C' && <span className="ruitype-badge">Ruigrens bepalend</span>}
                      {speciesInfo.ruitype === 'D' && <span className="ruitype-badge">Kleed bepalend</span>}
                      {speciesInfo.ruitype === 'X' && <span className="ruitype-badge">Leeftijd niet bepaalbaar</span>}
                    </span>
                  </div>
                )}
                {euringCode && (
                  <div className="soort-info-item">
                    <span className="sii-label">EURING</span>
                    <span className="sii-value">{euringCode}</span>
                  </div>
                )}
              </div>

              {/* Boeken */}
              {speciesInfo.boeken && Object.keys(speciesInfo.boeken).length > 0 && (
                <div className="soort-info-boeken">
                  <span className="boeken-label">Boeken</span>
                  <div className="boeken-chips">
                    {Object.entries(speciesInfo.boeken).map(([boek, pagina]) => (
                      <span key={boek} className="boek-chip">
                        <span className="boek-chip-naam">{boek.replace(/_/g, ' ')}</span>
                        <span className="boek-chip-pagina">p.{pagina}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

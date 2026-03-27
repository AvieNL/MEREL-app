import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNieuwForm } from './NieuwFormContext';
import { useDisplayNaam } from '../../hooks/useDisplayNaam';
import './NieuwPage.css';

export default function SectieSoort() {
  const { t, i18n } = useTranslation();
  const displayNaam = useDisplayNaam();
  const {
    form,
    vogelnaamDisplay,
    setVogelnaamDisplay,
    errCls,
    sections,
    toggleSection,
    settings,
    euringCode,
    speciesInfo,
    suggestions,
    activeIndex,
    vogelnaamRef,
    handleSpeciesInput,
    handleSpeciesFocus,
    handleSpeciesKeyDown,
    selectSpecies,
    euringLookup,
    editRecord,
  } = useNieuwForm();

  useEffect(() => {
    if (activeIndex >= 0) {
      document.getElementById(`suggestion-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const TAAL_DISPLAY = {
    naam_nl: t('lang_nl'),
    naam_lat: t('lang_lat'),
    naam_en: t('lang_en'),
    naam_de: t('lang_de'),
  };

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('nieuweVangst')}>
        <h3>{editRecord ? t('form_section_edit_catch') : t('form_section_new_catch')}</h3>
        <span className={`toggle ${sections.nieuweVangst ? 'open' : ''}`}>▾</span>
      </div>
      {sections.nieuweVangst && (
        <div className="section-content">
          <div className={`form-group species-input${errCls('vogelnaam')}`}>
            <label>{t('form_bird_name')}</label>
            <input
              ref={vogelnaamRef}
              type="text"
              value={vogelnaamDisplay}
              onChange={e => handleSpeciesInput(e.target.value)}
              onFocus={handleSpeciesFocus}
              onKeyDown={handleSpeciesKeyDown}
              placeholder={t('form_bird_placeholder')}
              autoComplete="off"
              aria-autocomplete="list"
              aria-activedescendant={activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map(s => {
                  const code = euringLookup[s.naam_nl?.toLowerCase()] || '';
                  const primNaam = displayNaam(s.naam_nl) || s.naam_nl;
                  // Toon matchedName alleen als de overeenkomst in een andere taal was dan de weergavetaal
                  const showSub = s.matchedName && s.matchedField !== 'naam_' + i18n.language;
                  return (
                    <li key={s.naam_nl + (s.matchedField || '')}
                      id={`suggestion-${suggestions.indexOf(s)}`}
                      className={activeIndex === suggestions.indexOf(s) ? 'active' : ''}
                      onMouseDown={() => selectSpecies(s.naam_nl)}>
                      <div className="suggestion-content">
                        <span className="suggestion-name">
                          {primNaam}{code && <span className="suggestion-euring"> ({code})</span>}
                        </span>
                        {showSub && (
                          <span className="suggestion-sub">{s.matchedName} ({TAAL_DISPLAY[s.matchedField]})</span>
                        )}
                        {s.isRecent && !showSub && form.vogelnaam.length < 2 && (
                          <span className="suggestion-sub">{t('form_recently_used')}</span>
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
                  <span className="sii-label">{t('form_ring_size')}</span>
                  <span className="sii-value">{speciesInfo.ringmaat || '—'}</span>
                </div>
                {speciesInfo.ruitype && (
                  <div className={`soort-info-item${['A','B','C','D'].includes(speciesInfo.ruitype) ? ' ruitype-highlight' : ''}`}>
                    <span className="sii-label">{t('form_moult_type')}</span>
                    <span className="sii-value">
                      {speciesInfo.ruitype}
                      {speciesInfo.ruitype === 'A' && <span className="ruitype-badge">{t('form_moult_age_limited')}</span>}
                      {speciesInfo.ruitype === 'B' && <span className="ruitype-badge">{t('form_moult_boundary')}</span>}
                      {speciesInfo.ruitype === 'C' && <span className="ruitype-badge">{t('form_moult_boundary')}</span>}
                      {speciesInfo.ruitype === 'D' && <span className="ruitype-badge">{t('form_moult_plumage')}</span>}
                      {speciesInfo.ruitype === 'X' && <span className="ruitype-badge">{t('form_moult_indeterminate')}</span>}
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
                  <span className="boeken-label">{t('form_books')}</span>
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

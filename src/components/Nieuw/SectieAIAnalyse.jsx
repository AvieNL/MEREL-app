import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNieuwForm } from './NieuwFormContext';
import { useRole } from '../../hooks/useRole';
import { useReferentiebibliotheek } from '../../hooks/useReferentiebibliotheek';
import { verwerkFoto } from '../../utils/imageHelper';
import { analyseVogel, selectReferenties } from '../../utils/aiAnalyse';
import './SectieAIAnalyse.css';

const MAX_FOTOS = 3;

export default function SectieAIAnalyse() {
  const { t } = useTranslation();
  const { form, update, sections, toggleSection, aiFotos, setAiFotos, aiResultaat, setAiResultaat } = useNieuwForm();
  const { canUseAI, canAddReference } = useRole();
  const { referenties, addReferentie } = useReferentiebibliotheek();

  const [isConverting, setIsConverting] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState('');
  const [opgeslagen, setOpgeslagen] = useState(false);
  const fileInputRef = useRef(null);

  const isOnline = navigator.onLine;

  async function handleFotoToevoegen(files) {
    const nieuweFiles = Array.from(files).slice(0, MAX_FOTOS - aiFotos.length);
    if (!nieuweFiles.length) return;
    setError('');
    setIsConverting(true);
    try {
      const verwerkt = await Promise.all(nieuweFiles.map(verwerkFoto));
      setAiFotos(prev => [...prev, ...verwerkt].slice(0, MAX_FOTOS));
    } catch (e) {
      setError(t('ai_error', { msg: e.message }));
    } finally {
      setIsConverting(false);
    }
  }

  function handleFotoVerwijderen(index) {
    setAiFotos(prev => prev.filter((_, i) => i !== index));
    setAiResultaat(null);
    setOpgeslagen(false);
  }

  const VALID_GESLACHT = new Set(['M', 'F', 'V', 'U']);
  const VALID_GESLACHTSBEPALING = new Set(['A', 'B', 'C', 'D', 'E', 'L', 'P', 'S', 'T', 'U']);

  function maandUitDatum(datum) {
    if (!datum) return new Date().getMonth() + 1;
    const parts = datum.split('-');
    const m = parseInt(parts[1], 10);
    return isNaN(m) ? new Date().getMonth() + 1 : m;
  }

  async function handleAnalyseer() {
    if (!form.vogelnaam || !aiFotos.length || !isOnline) return;
    setError('');
    setIsAnalysing(true);
    setAiResultaat(null);
    setOpgeslagen(false);
    try {
      const maand = maandUitDatum(form.vangstdatum);
      const gekozenRef = selectReferenties(form.vogelnaam, maand, referenties);
      const resultaat = await analyseVogel(form.vogelnaam, maand, aiFotos, gekozenRef);
      setAiResultaat(resultaat);
    } catch (e) {
      setError(t('ai_error', { msg: e.message }));
    } finally {
      setIsAnalysing(false);
    }
  }

  function handleToepassen() {
    if (!aiResultaat) return;
    if (aiResultaat.leeftijd && /^[1-9A-Za-z]{1,2}$/.test(aiResultaat.leeftijd))
      update('leeftijd', aiResultaat.leeftijd);
    if (aiResultaat.geslacht && VALID_GESLACHT.has(aiResultaat.geslacht))
      update('geslacht', aiResultaat.geslacht);
    if (aiResultaat.geslachtsbepaling && VALID_GESLACHTSBEPALING.has(aiResultaat.geslachtsbepaling))
      update('geslachtsbepaling', aiResultaat.geslachtsbepaling);
  }

  async function handleOpslaanAlsReferentie() {
    if (!aiResultaat || !aiFotos.length) return;
    const maand = maandUitDatum(form.vangstdatum);
    const datum = form.vangstdatum || new Date().toISOString().split('T')[0];
    await addReferentie({
      soort:             form.vogelnaam,
      maand,
      datum,
      leeftijd:          aiResultaat.leeftijd  || '',
      geslacht:          aiResultaat.geslacht  || 'U',
      type:              'bevestigd',
      fotos:             aiFotos,
      toelichting:       aiResultaat.toelichting || '',
    });
    setOpgeslagen(true);
  }

  function getBetrouwbaarheidskleur(score) {
    if (score <= 40) return 'rood';
    if (score <= 70) return 'oranje';
    return 'groen';
  }

  function renderResultaat() {
    if (!aiResultaat) return null;
    const score = aiResultaat.betrouwbaarheid ?? 0;
    const kleur = getBetrouwbaarheidskleur(score);
    return (
      <div className="ai-resultaat">
        <div className="ai-betrouwbaarheid">
          <span className="ai-betrouwbaarheid-label">{t('ai_confidence')}: <strong>{score}%</strong></span>
          <div className="ai-balk-track">
            <div
              className={`ai-balk-fill ai-balk-fill--${kleur}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <div className="ai-velden">
          <div className="ai-veld">
            <span className="ai-veld-label">{t('ai_age')}</span>
            <span className="ai-veld-waarde">{aiResultaat.leeftijd || '—'}</span>
          </div>
          <div className="ai-veld">
            <span className="ai-veld-label">{t('ai_sex')}</span>
            <span className="ai-veld-waarde">{aiResultaat.geslacht || '—'}</span>
          </div>
          <div className="ai-veld">
            <span className="ai-veld-label">{t('ai_sex_determination')}</span>
            <span className="ai-veld-waarde">{aiResultaat.geslachtsbepaling || '—'}</span>
          </div>
        </div>
        {aiResultaat.toelichting && (
          <p className="ai-toelichting">{aiResultaat.toelichting}</p>
        )}
        <div className="ai-acties">
          <button type="button" className="btn-primary ai-btn" onClick={handleToepassen}>
            {t('ai_apply')}
          </button>
          {canAddReference && !opgeslagen && (
            <button type="button" className="btn-secondary ai-btn" onClick={handleOpslaanAlsReferentie}>
              {t('ai_save_reference')}
            </button>
          )}
          {opgeslagen && (
            <span className="ai-opgeslagen">{t('ai_saved_reference')}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header" onClick={() => toggleSection('aiAnalyse')}>
        <h3>✨ {t('ai_section_title')}</h3>
        <span className={`toggle ${sections.aiAnalyse ? 'open' : ''}`}>▾</span>
      </div>

      {sections.aiAnalyse && (
        <div className="section-content ai-sectie">
          {/* Offline */}
          {!isOnline && (
            <p className="ai-melding ai-melding--offline">{t('ai_section_no_internet')}</p>
          )}

          {/* Geen toegang */}
          {isOnline && !canUseAI && (
            <p className="ai-melding ai-melding--upgrade">{t('ai_section_upgrade')}</p>
          )}

          {isOnline && canUseAI && (
            <>
              {/* Soort vereist */}
              {!form.vogelnaam && (
                <p className="ai-melding ai-melding--hint">{t('ai_no_species')}</p>
              )}

              {/* Foto upload */}
              {form.vogelnaam && (
                <>
                  <div
                    className={`ai-upload-zone${aiFotos.length >= MAX_FOTOS ? ' ai-upload-zone--vol' : ''}`}
                    onClick={() => aiFotos.length < MAX_FOTOS && fileInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleFotoToevoegen(e.dataTransfer.files); }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && aiFotos.length < MAX_FOTOS && fileInputRef.current?.click()}
                    aria-label={t('ai_add_photo')}
                  >
                    {isConverting ? (
                      <span className="ai-converting">{t('ai_converting')}</span>
                    ) : aiFotos.length < MAX_FOTOS ? (
                      <>
                        <span className="ai-upload-icoon">📷</span>
                        <span>{t('ai_add_photo')}</span>
                        <small>{t('ai_add_photo_hint')}</small>
                      </>
                    ) : (
                      <span className="ai-upload-vol">{t('ai_max_photos')}</span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.heic"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => handleFotoToevoegen(e.target.files)}
                  />

                  {/* Thumbnails */}
                  {aiFotos.length > 0 && (
                    <div className="ai-thumbnails">
                      {aiFotos.map((foto, i) => (
                        <div key={i} className="ai-thumbnail">
                          <img src={foto.preview} alt={`Foto ${i + 1}`} />
                          <button
                            type="button"
                            className="ai-thumbnail-remove"
                            onClick={() => handleFotoVerwijderen(i)}
                            aria-label={t('ai_remove_photo')}
                          >×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Analyseer-knop */}
                  <button
                    type="button"
                    className={`btn-primary ai-analyseer-btn${isAnalysing ? ' ai-analyseer-btn--busy' : ''}`}
                    disabled={!aiFotos.length || isAnalysing || isConverting}
                    onClick={handleAnalyseer}
                  >
                    {isAnalysing ? t('ai_analysing') : t('ai_analyse_btn')}
                  </button>

                  {/* Foutmelding */}
                  {error && <p className="ai-fout">{error}</p>}

                  {/* Resultaat */}
                  {renderResultaat()}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

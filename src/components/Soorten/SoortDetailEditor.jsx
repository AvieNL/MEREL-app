import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SoortDetail.css';

// Textarea met B/I/U-opmaakbalk die automatisch meegroeit
function FormattedTextarea({ value, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [value]);

  const insert = (marker) => {
    const el = ref.current;
    if (!el) return;
    const s = el.selectionStart, e = el.selectionEnd;
    const selected = value.slice(s, e);
    const newVal = value.slice(0, s) + marker + selected + marker + value.slice(e);
    onChange({ target: { value: newVal } });
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      el.setSelectionRange(s + marker.length, e + marker.length);
    });
  };

  return (
    <div className="sd-fmt-wrapper">
      <div className="sd-fmt-toolbar">
        <button type="button" className="sd-fmt-btn sd-fmt-bold" onMouseDown={e => { e.preventDefault(); insert('**'); }}>B</button>
        <button type="button" className="sd-fmt-btn sd-fmt-italic" onMouseDown={e => { e.preventDefault(); insert('*'); }}>I</button>
        <button type="button" className="sd-fmt-btn sd-fmt-under" onMouseDown={e => { e.preventDefault(); insert('_'); }}>U</button>
      </div>
      <textarea ref={ref} className="sd-edit-textarea sd-edit-textarea--auto" value={value} onChange={onChange} placeholder={placeholder} rows={1} />
    </div>
  );
}

const ALL_BOEKEN_KEYS = [
  'svensson_2023', 'svensson_2016', 'demongin_2020', 'blasco_zumeta_2023',
  'jenni_winkler_2020', 'baker_2016', 'klaassen_voorjaar', 'klaassen_najaar',
  'conings_1999', 'speek_1994',
];
const boekKeys = new Set(ALL_BOEKEN_KEYS);
function isBoekKey(key) { return boekKeys.has(key); }

function resizeImage(file, maxWidth = 400) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * SoortDetailEditor — renders the full edit-mode UI for a species detail page.
 *
 * Props:
 *   editData          — current form state object
 *   setEditData       — setter for form state
 *   onSave            — async function: saves and exits edit mode
 *   onCancel          — function: cancels and exits edit mode
 *   soortInfo         — merged soort object (used for display names, badges, etc.)
 *   isNieuweSoort     — boolean: true when creating a new species
 *   bioRangesFromCatches — computed bio ranges from own catches
 */
export default function SoortDetailEditor({
  editData,
  setEditData,
  onSave,
  onCancel,
  soortInfo,
  isNieuweSoort,
  bioRangesFromCatches,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const BIO_FIELDS = [
    { key: 'vleugel',        label: t('sd_bio_vleugel'),         unit: 'mm' },
    { key: 'handpenlengte',  label: t('sd_bio_handpen'),         unit: 'mm' },
    { key: 'staartlengte',   label: t('sd_bio_staart'),          unit: 'mm' },
    { key: 'kop_snavel',     label: t('sd_bio_kop_snavel'),      unit: 'mm' },
    { key: 'snavel_schedel', label: t('sd_bio_snavel_schedel'),  unit: 'mm' },
    { key: 'tarsus_lengte',  label: t('sd_bio_tarsus'),          unit: 'mm' },
    { key: 'tarsus_dikte',   label: t('sd_bio_tarsus_dikte'),    unit: 'mm' },
    { key: 'gewicht',        label: t('sd_bio_gewicht'),         unit: 'g'  },
  ];

  const ALL_BOEKEN = [
    { key: 'svensson_2023',      label: 'Svensson (2023)' },
    { key: 'svensson_2016',      label: 'Svensson (2016)' },
    { key: 'demongin_2020',      label: 'Demongin (2020)' },
    { key: 'blasco_zumeta_2023', label: 'Blasco-Zumeta (2023)' },
    { key: 'jenni_winkler_2020', label: 'Jenni & Winkler (2020)' },
    { key: 'baker_2016',         label: 'Baker (2016)' },
    { key: 'klaassen_voorjaar',  label: t('sd_book_klaassen_vj') },
    { key: 'klaassen_najaar',    label: t('sd_book_klaassen_nj') },
    { key: 'conings_1999',       label: 'Conings (1999)' },
    { key: 'speek_1994',         label: 'Speek (1994)' },
  ];

  const EDITABLE_FIELDS = {
    namen: [
      { key: 'naam_lat', label: t('sd_namen_lat') },
      { key: 'naam_nl',  label: t('sd_namen_nl') },
      { key: 'naam_en',  label: t('sd_namen_en') },
      { key: 'naam_de',  label: t('sd_namen_de') },
      { key: 'naam_fr',  label: t('sd_namen_fr') },
      { key: 'naam_es',  label: t('sd_namen_es') },
    ],
    taxonomie: [
      { key: 'familie', label: t('sd_tax_familie') },
      { key: 'orde',    label: t('sd_tax_orde') },
    ],
    ring: [
      { key: 'ringmaat',    label: t('sd_ring_ringmaat') },
      { key: 'ruitype',     label: t('sd_ring_ruitype') },
      { key: 'euring_code', label: t('sd_ring_euring') },
    ],
    nest: [
      { key: 'nest_eileg',      label: t('sd_nest_eileg') },
      { key: 'nest_broedels',   label: t('sd_nest_broedels') },
      { key: 'nest_eieren',     label: t('sd_nest_eieren') },
      { key: 'nest_ei_dagen',   label: t('sd_nest_ei_dagen') },
      { key: 'nest_jong_dagen', label: t('sd_nest_jong_dagen') },
      { key: 'broed',           label: t('sd_nest_broed'), gender: true },
      { key: 'zorg',            label: t('sd_nest_zorg'),  gender: true },
    ],
    boeken: ALL_BOEKEN,
  };
  const cropRef = useRef(null);
  const dragStartRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleField = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    setEditData(prev => ({ ...prev, foto: dataUrl }));
  };

  const foto = editData.foto;
  const fotoCrop = editData.foto_crop ?? { x: 50, y: 50, zoom: 1 };

  const handleClearFoto = () => {
    handleField('foto', '');
    handleField('foto_crop', { x: 50, y: 50, zoom: 1 });
  };

  const handlePointerDown = (e) => {
    if (!cropRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const crop = editData.foto_crop ?? { x: 50, y: 50, zoom: 1 };
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      cropX: crop.x,
      cropY: crop.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragStartRef.current || !cropRef.current) return;
    const { clientX, clientY, cropX, cropY } = dragStartRef.current;
    const rect = cropRef.current.getBoundingClientRect();
    const zoom = editData.foto_crop?.zoom ?? 1;
    const dx = e.clientX - clientX;
    const dy = e.clientY - clientY;
    const newX = Math.max(0, Math.min(100, cropX - (dx / rect.width) * 100 * zoom));
    const newY = Math.max(0, Math.min(100, cropY - (dy / rect.height) * 100 * zoom));
    handleField('foto_crop', { zoom, x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const crop = editData.foto_crop ?? { x: 50, y: 50, zoom: 1 };
    const newZoom = Math.max(1, Math.min(3, crop.zoom - e.deltaY * 0.001));
    handleField('foto_crop', { ...crop, zoom: newZoom });
  };

  const renderEditField = (key, label, opts = {}) => {
    const val = editData[key] ?? '';
    return (
      <div className="sd-edit-row" key={key}>
        <label className="sd-edit-label">{label}</label>
        <input
          type="text"
          value={val}
          onChange={e => handleField(key, opts.gender ? e.target.value.toUpperCase() : e.target.value)}
          className="sd-edit-input"
          placeholder={opts.gender ? 'M, V of F, of combinatie (bijv. MV)' : (opts.placeholder || '')}
        />
        {opts.gender && (
          <span className="sd-gender-edit-hint">M = ♂ &nbsp;·&nbsp; V of F = ♀</span>
        )}
      </div>
    );
  };

  return (
    <div className="page soort-detail sd-edit-mode">
      {/* Edit topbar */}
      <div className="sd-edit-topbar">
        <span className="sd-edit-topbar-indicator">✏️</span>
        <span className="sd-edit-topbar-name">
          {isNieuweSoort ? (editData.naam_nl || 'Nieuwe soort') : soortInfo.naam_nl}
        </span>
        <button className="btn-secondary sd-topbar-btn" onClick={onCancel}>Annuleren</button>
        <button className="btn-primary sd-topbar-btn" onClick={onSave}>Opslaan</button>
      </div>

      {/* Hero */}
      <div className="sd-hero">
        {foto ? (
          <div className="sd-foto-edit-wrapper">
            <div
              ref={cropRef}
              className={`sd-foto sd-foto-crop${isDragging ? ' sd-foto-dragging' : ''}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
            >
              <img
                src={foto}
                alt={soortInfo.naam_nl}
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  objectPosition: `${fotoCrop.x}% ${fotoCrop.y}%`,
                  transform: fotoCrop.zoom !== 1 ? `scale(${fotoCrop.zoom})` : undefined,
                  transformOrigin: `${fotoCrop.x}% ${fotoCrop.y}%`,
                  pointerEvents: 'none', userSelect: 'none', display: 'block',
                }}
              />
            </div>
            <div className="sd-foto-crop-controls">
              <div className="sd-foto-zoom-row">
                <span>🔍</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={fotoCrop.zoom}
                  onChange={e => handleField('foto_crop', { ...fotoCrop, zoom: parseFloat(e.target.value) })}
                  className="sd-foto-zoom-slider"
                />
                <span>{fotoCrop.zoom.toFixed(1)}×</span>
              </div>
              <div className="sd-foto-crop-btns">
                <button className="btn-secondary sd-foto-btn" onClick={() => fileInputRef.current?.click()}>Vervangen</button>
                <button className="btn-secondary sd-foto-btn sd-foto-btn--del" onClick={handleClearFoto}>Wissen</button>
              </div>
              <span className="sd-foto-crop-hint">Sleep om te verschuiven</span>
            </div>
          </div>
        ) : (
          <div className="sd-foto sd-foto-edit" onClick={() => fileInputRef.current?.click()}>
            <div className="sd-foto-placeholder">
              <span>🐦</span>
              <span className="sd-foto-hint">Foto toevoegen</span>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          style={{ display: 'none' }}
        />
        <div className="sd-hero-info">
          {isNieuweSoort ? (
            <input
              type="text"
              className="sd-title-input"
              value={editData.naam_nl ?? ''}
              onChange={e => handleField('naam_nl', e.target.value)}
              placeholder="Nederlandse naam"
              autoFocus
            />
          ) : (
            <h2 className="sd-title">{soortInfo.naam_nl}</h2>
          )}
          {soortInfo.naam_lat && <p className="sd-subtitle">{soortInfo.naam_lat}</p>}
          <div className="sd-badges">
            {soortInfo.ringmaat && (
              <span className="sd-badge sd-badge-accent">Ring {soortInfo.ringmaat}</span>
            )}
            {soortInfo.ruitype && (
              <span className="sd-badge sd-badge-muted">{soortInfo.ruitype}</span>
            )}
          </div>
        </div>
      </div>

      {/* Geslachtsbepaling */}
      <div className="sd-card">
        <h3 className="sd-card-title">{t('sd_gender_det')}</h3>
        <div className="sd-det-fields">
          <div className="sd-det-block sd-det-block--m">
            <span className="sd-det-label sd-det-label--m">{'\u2642\uFE0E'} {t('sd_male')}</span>
            <FormattedTextarea
              value={editData.geslachts_notities_m || ''}
              onChange={e => handleField('geslachts_notities_m', e.target.value)}
              placeholder={t('sd_edit_gender_m_placeholder')}
            />
          </div>
          <div className="sd-det-block sd-det-block--f">
            <span className="sd-det-label sd-det-label--f">{'\u2640\uFE0E'} {t('sd_female')}</span>
            <FormattedTextarea
              value={editData.geslachts_notities_f || ''}
              onChange={e => handleField('geslachts_notities_f', e.target.value)}
              placeholder={t('sd_edit_gender_f_placeholder')}
            />
          </div>
        </div>
      </div>

      {/* Leeftijdsbepaling */}
      <div className="sd-card">
        <h3 className="sd-card-title">{t('sd_age_det')}</h3>
        <div className="sd-det-fields">
          <div className="sd-det-block sd-det-block--vj">
            <span className="sd-det-label sd-det-label--vj">{t('sd_spring')}</span>
            <FormattedTextarea
              value={editData.leeftijds_notities_vj || ''}
              onChange={e => handleField('leeftijds_notities_vj', e.target.value)}
              placeholder={t('sd_edit_age_vj_placeholder')}
            />
          </div>
          <div className="sd-det-block sd-det-block--nj">
            <span className="sd-det-label sd-det-label--nj">{t('sd_autumn')}</span>
            <FormattedTextarea
              value={editData.leeftijds_notities_nj || ''}
              onChange={e => handleField('leeftijds_notities_nj', e.target.value)}
              placeholder={t('sd_edit_age_nj_placeholder')}
            />
          </div>
        </div>
      </div>

      {/* Ring & Rui */}
      <div className="sd-card">
        <h3 className="sd-card-title">{t('sd_ring_rui')}</h3>
        {EDITABLE_FIELDS.ring.map(f => renderEditField(f.key, f.label))}
      </div>

      {/* Namen + Biometrie naast elkaar */}
      <div className="sd-two-cards">
        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_names')}</h3>
          {EDITABLE_FIELDS.namen
            .filter(f => !(isNieuweSoort && f.key === 'naam_nl'))
            .map(f => renderEditField(f.key, f.label))}
          <div className="sd-section-divider" />
          <span className="sd-section-label">{t('sd_taxonomy')}</span>
          {EDITABLE_FIELDS.taxonomie.map(f => renderEditField(f.key, f.label))}
        </div>

        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_biometrics')}</h3>
          {BIO_FIELDS.map(f => (
            <div key={f.key} className="sd-bio-edit-group">
              <div className="sd-bio-edit-field-label">
                {f.label} ({f.unit})
                {bioRangesFromCatches[f.key] && (
                  <span className="sd-bio-edit-rec-hint">
                    ~ {bioRangesFromCatches[f.key].min}–{bioRangesFromCatches[f.key].max}{' '}
                    <em>n={bioRangesFromCatches[f.key].n}</em>
                  </span>
                )}
              </div>
              {[
                { prefix: null, label: t('sd_general_abbr'), cls: '' },
                { prefix: 'M',  label: '\u2642\uFE0E', cls: ' sd-bio-edit-subrow--m' },
                { prefix: 'F',  label: '\u2640\uFE0E', cls: ' sd-bio-edit-subrow--f' },
              ].map(({ prefix, label, cls }) => (
                <div key={prefix ?? 'alg'} className={`sd-bio-edit-subrow${cls}`}>
                  <span className="sd-bio-gender-lbl">{label}</span>
                  <div className="sd-bio-edit-inputs">
                    {['min', 'max'].map(stat => {
                      const key = prefix
                        ? `bio_${f.key}_${prefix}_${stat}`
                        : `bio_${f.key}_${stat}`;
                      return (
                        <input
                          key={stat}
                          type="text"
                          inputMode="decimal"
                          value={editData[key] ?? ''}
                          onChange={e => handleField(key, e.target.value.replace(',', '.'))}
                          className="sd-edit-input"
                          placeholder={{ min: 'Min', max: 'Max' }[stat]}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Nestgegevens + Determinatieboeken naast elkaar */}
      <div className="sd-two-cards">
        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_nest_data')}</h3>
          {EDITABLE_FIELDS.nest.map(f => renderEditField(f.key, f.label, { gender: f.gender }))}
        </div>
        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_det_books')}</h3>
          {EDITABLE_FIELDS.boeken.map(f => renderEditField(f.key, f.label))}
        </div>
      </div>
    </div>
  );
}

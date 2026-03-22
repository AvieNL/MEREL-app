import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { parseEuringCode, euringCodeToNaam } from '../../utils/euringParser';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { formatDatum } from '../../utils/dateHelper';

const OVERLAY = {
  position: 'fixed', inset: 0, zIndex: 2000,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  padding: '24px 16px', overflowY: 'auto',
};

const MODAL = {
  background: 'var(--bg-secondary)',
  borderRadius: 'var(--radius)',
  padding: 24,
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

function PreviewRow({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--text-secondary)', minWidth: 140 }}>{label}</span>
      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ExternMeldingModal({ onClose, onSave }) {
  const { t } = useTranslation();
  const speciesRef = useSpeciesRef();
  const [raw, setRaw] = useState('');
  const [error, setError] = useState(null);

  const parsed = useMemo(() => {
    if (!raw.trim()) return null;
    const result = parseEuringCode(raw);
    if (!result) return null;
    const vogelnaam = euringCodeToNaam(speciesRef, result.euringSpeciesCode);
    return { ...result, vogelnaam };
  }, [raw, speciesRef]);

  function handleSave() {
    if (!parsed) { setError(t('extern_parse_error')); return; }
    if (!parsed.ringnummer) { setError(t('extern_no_ring')); return; }

    const bron = parsed.scenario === 'A' ? 'externe_tv_melding' : 'externe_ring_info';
    const record = {
      vogelnaam: parsed.vogelnaam || null,
      ringnummer: parsed.ringnummer,
      metalenringinfo: parsed.metalenringinfo,
      vangstdatum: parsed.vangstdatum || null,
      tijd: parsed.tijd || null,
      geslacht: parsed.geslacht || 'U',
      leeftijd: parsed.leeftijd || null,
      vangstmethode: parsed.vangstmethode || null,
      plaatscode: parsed.plaatscode || null,
      lat: parsed.lat != null ? String(parsed.lat) : null,
      lon: parsed.lon != null ? String(parsed.lon) : null,
      opmerkingen: `EURING ${parsed.euring_scheme || ''}`.trim(),
      bron,
      uploaded: true,
    };
    onSave(record);
    onClose();
  }

  const scenarioLabel = parsed?.scenario === 'A'
    ? t('extern_scenario_a')
    : parsed?.scenario === 'B'
    ? t('extern_scenario_b')
    : null;

  return (
    <div style={OVERLAY} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={MODAL}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem' }}>{t('extern_title')}</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.2rem', cursor: 'pointer', padding: 4 }}
          >✕</button>
        </div>

        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {t('extern_desc')}
        </p>

        <textarea
          value={raw}
          onChange={e => { setRaw(e.target.value); setError(null); }}
          placeholder={t('extern_placeholder')}
          rows={4}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            padding: '8px 10px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
        />

        {error && (
          <div style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>{error}</div>
        )}

        {parsed && (
          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {scenarioLabel && (
              <div style={{
                fontSize: '0.8rem', fontWeight: 700,
                color: parsed.scenario === 'A' ? 'var(--accent)' : 'var(--success)',
                marginBottom: 4,
              }}>
                {scenarioLabel}
              </div>
            )}
            <PreviewRow label={t('extern_field_ring')} value={parsed.ringnummer?.replace(/\./g, '')} />
            <PreviewRow label={t('extern_field_species')} value={parsed.vogelnaam
              ? parsed.vogelnaam
              : parsed.euringSpeciesCode
                ? `EURING ${parsed.euringSpeciesCode}`
                : null} />
            <PreviewRow label={t('extern_field_date')} value={formatDatum(parsed.vangstdatum)} />
            <PreviewRow label={t('extern_field_time')} value={parsed.tijd} />
            <PreviewRow label={t('extern_field_place')} value={parsed.plaatscode} />
            <PreviewRow
              label={t('extern_field_coords')}
              value={parsed.lat != null ? `${parsed.lat.toFixed(4)}, ${parsed.lon.toFixed(4)}` : null}
            />
            <PreviewRow label={t('extern_field_sex')} value={
              parsed.geslacht === 'M' ? '♂ Man' :
              parsed.geslacht === 'V' ? '♀ Vrouw' : null
            } />
            <PreviewRow label={t('extern_field_age')} value={parsed.leeftijd} />
            <PreviewRow label={t('extern_field_scheme')} value={parsed.euring_scheme} />
          </div>
        )}

        {!parsed && raw.trim() && (
          <div style={{ color: 'var(--warning)', fontSize: '0.85rem' }}>
            {t('extern_parse_error')}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            className="btn-secondary"
            onClick={onClose}
          >{t('btn_cancel')}</button>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={!parsed || !parsed.ringnummer}
          >{t('extern_save')}</button>
        </div>
      </div>
    </div>
  );
}

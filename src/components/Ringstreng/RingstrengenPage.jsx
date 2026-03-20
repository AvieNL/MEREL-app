import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRole } from '../../hooks/useRole';
import './RingstrengenPage.css';

function normalizeRing(s) {
  return s ? s.replace(/\./g, '').trim().toLowerCase() : '';
}

function parseRing(s) {
  const norm = normalizeRing(s);
  const m = norm.match(/^([a-z]*)(\d+)([a-z]*)$/);
  if (!m) return null;
  return { prefix: m[1], num: parseInt(m[2], 10), suffix: m[3], len: m[2].length };
}

function sameScheme(a, b) {
  return a && b && a.prefix === b.prefix && a.suffix === b.suffix;
}

function reconstructRing(parsed, num) {
  return (parsed.prefix + String(num).padStart(parsed.len, '0') + parsed.suffix).toUpperCase();
}

function parsePrijs(s) {
  return parseFloat(String(s).replace(',', '.'));
}

function formatBedrag(n) {
  return '€\u00a0' + n.toFixed(2).replace('.', ',');
}

const LEEG = { ringmaat: '', beschrijving: '', van: '', tot: '', huidige: '', prijsPerRing: '' };

export default function RingstrengenPage({ ringStrengen, records = [], onAdd, onUpdate, onDelete }) {
  const { canAdd, canEdit, canDelete } = useRole();
  const { t } = useTranslation();
  const speciesRef = useSpeciesRef();
  const RINGMATEN = useMemo(() => {
    const numeriek = [...new Set(
      speciesRef
        .map(s => s.ringmaat)
        .filter(m => m && !m.includes('-') && (/^\d/.test(m) || /^(S|laag S)\d/.test(m)))
    )].sort((a, b) => {
      const numA = parseFloat(a.replace(/[^0-9.]/g, '')) || 0;
      const numB = parseFloat(b.replace(/[^0-9.]/g, '')) || 0;
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b);
    });
    return [...numeriek, 'Onderzoek'];
  }, [speciesRef]);

  const [toonForm, setToonForm] = useState(false);
  const [form, setForm] = useState(LEEG);
  const [bewerkId, setBewerkId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [expandedVolIds, setExpandedVolIds] = useState(new Set());

  function toggleVol(id) {
    setExpandedVolIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const statsPerStreng = useMemo(() => {
    return ringStrengen.map(streng => {
      const v = parseRing(streng.van);
      const t = parseRing(streng.tot);
      const h = parseRing(streng.huidige);
      if (!v || !t || !h || !sameScheme(v, t)) return { inDatabase: new Set(), gaten: [], totaal: 0, beschikbaar: 0, vol: false };

      const totaalRingen = t.num - v.num + 1;
      const vol = h.num > t.num;
      const beschikbaar = vol ? 0 : t.num - h.num + 1;

      const inDatabase = new Set(
        records
          .map(r => r.ringnummer ? parseRing(r.ringnummer) : null)
          .filter(r => r && sameScheme(r, v) && r.num >= v.num && r.num <= t.num)
          .map(r => r.num)
      );

      const gaten = [];
      for (let n = v.num; n < h.num && n <= t.num; n++) {
        if (!inDatabase.has(n)) {
          gaten.push(reconstructRing(v, n));
        }
      }

      return { inDatabase, gaten, totaal: totaalRingen, beschikbaar, vol };
    });
  }, [ringStrengen, records]);

  const ringFields = ['van', 'tot', 'huidige'];

  function update(field, value) {
    const val = ringFields.includes(field) ? value.toUpperCase() : value;
    setForm(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'van' && !bewerkId) next.huidige = val;
      return next;
    });
  }

  function startBewerken(streng) {
    setForm({ ...streng });
    setBewerkId(streng.id);
    setToonForm(true);
  }

  function annuleer() {
    setForm(LEEG);
    setBewerkId(null);
    setToonForm(false);
  }

  function opslaan() {
    if (!form.ringmaat || !form.van || !form.tot) return;
    if (bewerkId) {
      onUpdate(bewerkId, form);
    } else {
      onAdd(form);
    }
    annuleer();
  }

  function renderForm(titel) {
    return (
      <div className="section ringstreng-bewerk-form">
        <div className="section-content">
          <h3 className="ringstreng-form-titel">{titel}</h3>
          <div className="form-row">
            <div className="form-group">
              <label>{t('rstrings_size')}</label>
              <select value={form.ringmaat} onChange={e => update('ringmaat', e.target.value)}>
                <option value="">{t('rstrings_size_choose')}</option>
                {RINGMATEN.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t('rstrings_description')}</label>
              <input type="text" value={form.beschrijving}
                onChange={e => update('beschrijving', e.target.value)}
                placeholder={t('rstrings_description_placeholder')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('rstrings_first')}</label>
              <input type="text" value={form.van}
                onChange={e => update('van', e.target.value)}
                placeholder={t('rstrings_first_placeholder')} />
            </div>
            <div className="form-group">
              <label>{t('rstrings_last')}</label>
              <input type="text" value={form.tot}
                onChange={e => update('tot', e.target.value)}
                placeholder={t('rstrings_last_placeholder')} />
            </div>
          </div>
          <div className="form-group">
            <label>{t('rstrings_current')}</label>
            <input type="text" value={form.huidige}
              onChange={e => update('huidige', e.target.value)}
              placeholder={t('rstrings_current_placeholder')} />
            <span className="field-hint">{t('rstrings_current_hint')}</span>
          </div>
          <div className="form-group">
            <label>{t('rstrings_price')}</label>
            <input type="text" inputMode="decimal" value={form.prijsPerRing}
              onChange={e => update('prijsPerRing', e.target.value)}
              placeholder="bijv. 0,08" />
          </div>
          <div className="ringstreng-form-acties">
            <button className="btn-primary" onClick={opslaan}>{t('rstrings_save')}</button>
            <button className="btn-secondary" onClick={annuleer}>{t('rstrings_cancel')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page ringstreng-page">
      <h2>{t('rstrings_title')}</h2>

      {ringStrengen.length === 0 && !toonForm && (
        <p className="ringstreng-leeg">{t('rstrings_empty')}</p>
      )}

      <div className="ringstreng-lijst">
        {ringStrengen.map((streng, idx) => {
          const stats = statsPerStreng[idx];
          const inDb = stats.inDatabase.size;
          const totaal = stats.totaal;
          const pct = totaal > 0 ? Math.round((inDb / totaal) * 100) : 0;

          const isVol = stats.vol;
          const isOpen = !isVol || expandedVolIds.has(streng.id);

          const actieBtnns = (
            <div className="ringstreng-iconen">
              {canEdit && confirmDeleteId !== streng.id && (
                <button className="ringstreng-icoon" onClick={e => { e.stopPropagation(); startBewerken(streng); }} title={t('rstrings_form_edit')}>✎</button>
              )}
              {canDelete && (
                confirmDeleteId === streng.id ? (
                  <>
                    <button className="ringstreng-icoon ringstreng-icoon--delete" style={{ opacity: 1, fontSize: '0.82rem', padding: '2px 8px' }}
                      onClick={e => { e.stopPropagation(); onDelete(streng.id); setConfirmDeleteId(null); }}>{t('rstrings_confirm_yes')}</button>
                    <button className="ringstreng-icoon" style={{ opacity: 1, fontSize: '0.82rem', padding: '2px 8px' }}
                      onClick={e => { e.stopPropagation(); setConfirmDeleteId(null); }}>{t('rstrings_confirm_no')}</button>
                  </>
                ) : (
                  <button className="ringstreng-icoon ringstreng-icoon--delete" onClick={e => { e.stopPropagation(); setConfirmDeleteId(streng.id); }} title={t('rstrings_delete_aria')} aria-label={t('rstrings_delete_aria')}>✕</button>
                )
              )}
            </div>
          );

          return (
            <div key={streng.id}>
              <div className={`ringstreng-kaart${isVol ? ' ringstreng-kaart--vol' : ''}${isVol && !isOpen ? ' ringstreng-kaart--compact' : ''}`}>
                <div
                  className="ringstreng-header"
                  onClick={isVol ? () => toggleVol(streng.id) : undefined}
                  style={isVol ? { cursor: 'pointer' } : undefined}
                >
                  <span className="ringstreng-maat">{streng.ringmaat}</span>
                  {streng.beschrijving && (
                    <span className="ringstreng-beschrijving">{streng.beschrijving}</span>
                  )}
                  {isVol && <span className="ringstreng-vol-badge">{t('rstrings_full')}</span>}
                  {isVol
                    ? <span className="ringstreng-toggle">{isOpen ? '▾' : '▸'}</span>
                    : actieBtnns
                  }
                </div>

                {isOpen && (
                  <>
                    <div className="ringstreng-range">
                      {streng.van} – {streng.tot}
                    </div>
                    <div className="ringstreng-voortgang">
                      <div className="ringstreng-balk">
                        <div className="ringstreng-balk-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="ringstreng-stats">
                        {inDb} {t('rstrings_in_db')} · <strong>{stats.beschikbaar} {t('rstrings_available')}</strong> · {t('rstrings_next')} <code>{streng.huidige}</code>
                      </span>
                      {streng.prijsPerRing && !isNaN(parsePrijs(streng.prijsPerRing)) && (
                        <span className="ringstreng-prijs">
                          {formatBedrag(parsePrijs(streng.prijsPerRing))} {t('rstrings_per_unit')} · {t('rstrings_paid_label')} <strong>{formatBedrag(parsePrijs(streng.prijsPerRing) * stats.totaal)}</strong> · {t('rstrings_stock_label')} <strong>{formatBedrag(parsePrijs(streng.prijsPerRing) * stats.beschikbaar)}</strong>
                        </span>
                      )}
                    </div>
                    {stats.gaten.length > 0 && (
                      <div className="ringstreng-gaten">
                        <span className="ringstreng-gaten-label">
                          {t('rstrings_missing', { count: stats.gaten.length })}
                        </span>
                        <span className="ringstreng-gaten-lijst">
                          {stats.gaten.slice(0, 8).join(', ')}
                          {stats.gaten.length > 8 && ` ${t('rstrings_and_more', { count: stats.gaten.length - 8 })}`}
                        </span>
                      </div>
                    )}
                    {isVol && actieBtnns}
                  </>
                )}
              </div>
              {bewerkId === streng.id && renderForm(t('rstrings_form_edit'))}
            </div>
          );
        })}
      </div>

      {(() => {
        const totaalWaarde = ringStrengen.reduce((sum, streng, idx) => {
          const prijs = parsePrijs(streng.prijsPerRing);
          if (isNaN(prijs)) return sum;
          return sum + prijs * statsPerStreng[idx].totaal;
        }, 0);
        const totaalBeschikbaar = ringStrengen.reduce((sum, streng, idx) => {
          const prijs = parsePrijs(streng.prijsPerRing);
          if (isNaN(prijs)) return sum;
          return sum + prijs * statsPerStreng[idx].beschikbaar;
        }, 0);
        const heeftPrijzen = ringStrengen.some(s => !isNaN(parsePrijs(s.prijsPerRing)));
        if (!heeftPrijzen || ringStrengen.length === 0) return null;
        return (
          <div className="ringstreng-totaal">
            <div className="ringstreng-totaal-rij">
              <span className="ringstreng-totaal-label">{t('rstrings_total_paid')}</span>
              <span className="ringstreng-totaal-waarde">{formatBedrag(totaalWaarde)}</span>
            </div>
            <div className="ringstreng-totaal-rij">
              <span className="ringstreng-totaal-label">{t('rstrings_stock_value')}</span>
              <span className="ringstreng-totaal-waarde ringstreng-totaal-waarde--beschikbaar">{formatBedrag(totaalBeschikbaar)}</span>
            </div>
          </div>
        );
      })()}

      {toonForm && !bewerkId && renderForm(t('rstrings_form_new'))}
      {!toonForm && canAdd && (
        <button className="btn-primary ringstreng-add-btn" onClick={() => setToonForm(true)}>
          {t('rstrings_add')}
        </button>
      )}
    </div>
  );
}

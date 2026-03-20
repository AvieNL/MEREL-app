import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpeciesRef, pullSpeciesIfNeeded } from '../../hooks/useSpeciesRef';
import { useRole } from '../../hooks/useRole';
import { db } from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { buildEuringLookup } from '../../utils/euring-lookup';
import RuitypeInfo from './RuitypeInfo';
import { VangstKaart } from '../Stats/Charts';
import { renderMarkdown } from '../../utils/textHelper';
import { formatDatum } from '../../utils/dateHelper';
import { LEEFTIJD_LABEL } from '../../data/constants';
import { computeBioRanges } from '../../utils/bioHelper';
import SoortDetailEditor from './SoortDetailEditor';
import './SoortDetail.css';

function leeftijdLabel(code) { return LEEFTIJD_LABEL[code] || code; }

const BIO_FIELDS = [
  { key: 'vleugel',       label: 'Vleugel',        unit: 'mm' },
  { key: 'handpenlengte', label: 'P8 / Handpen',   unit: 'mm' },
  { key: 'staartlengte',  label: 'Staart',          unit: 'mm' },
  { key: 'kop_snavel',    label: 'Snavel-veer',     unit: 'mm' },
  { key: 'snavel_schedel',label: 'Snavel-schedel',  unit: 'mm' },
  { key: 'tarsus_lengte', label: 'Tarsus',          unit: 'mm' },
  { key: 'tarsus_dikte',  label: 'Tarsus dikte',    unit: 'mm' },
  { key: 'gewicht',       label: 'Gewicht',         unit: 'g'  },
];

const ALL_BOEKEN = [
  { key: 'svensson_2023',        label: 'Svensson (2023)' },
  { key: 'svensson_2016',        label: 'Svensson (2016)' },
  { key: 'demongin_2020',        label: 'Demongin (2020)' },
  { key: 'blasco_zumeta_2023',   label: 'Blasco-Zumeta (2023)' },
  { key: 'jenni_winkler_2020',   label: 'Jenni & Winkler (2020)' },
  { key: 'baker_2016',           label: 'Baker (2016)' },
  { key: 'klaassen_voorjaar',    label: 'Klaassen voorjaar (2023)' },
  { key: 'klaassen_najaar',      label: 'Klaassen najaar (2023)' },
  { key: 'conings_1999',         label: 'Conings (1999)' },
  { key: 'speek_1994',           label: 'Speek (1994)' },
];

const EDITABLE_FIELDS = {
  namen: [
    { key: 'naam_lat', label: '🌐 Latijn' },
    { key: 'naam_nl',  label: '🇳🇱 Nederlands' },
    { key: 'naam_en',  label: '🇬🇧 Engels' },
    { key: 'naam_de',  label: '🇩🇪 Duits' },
    { key: 'naam_fr',  label: '🇫🇷 Frans' },
    { key: 'naam_es',  label: '🇪🇸 Spaans' },
  ],
  taxonomie: [
    { key: 'familie', label: 'Familie' },
    { key: 'orde',    label: 'Orde' },
  ],
  ring: [
    { key: 'ringmaat',    label: 'Ringmaat' },
    { key: 'ruitype',     label: 'Ruitype' },
    { key: 'euring_code', label: 'EURING-code' },
  ],
  nest: [
    { key: 'nest_eileg',      label: 'Eileg' },
    { key: 'nest_broedels',   label: 'Broedels' },
    { key: 'nest_eieren',     label: 'Eieren' },
    { key: 'nest_ei_dagen',   label: 'Broedtijd (dagen)' },
    { key: 'nest_jong_dagen', label: 'Nestjong (dagen)' },
    { key: 'broed',           label: 'Broed', gender: true },
    { key: 'zorg',            label: 'Zorg',  gender: true },
  ],
  boeken: ALL_BOEKEN,
};

const boekKeys = new Set(ALL_BOEKEN.map(b => b.key));

function isBoekKey(key) {
  return boekKeys.has(key);
}

export default function SoortDetail({ records, speciesOverrides }) {
  const { naam } = useParams();
  const navigate = useNavigate();
  const decodedNaam = decodeURIComponent(naam);
  const { isAdmin, isViewer } = useRole();
  const speciesRef = useSpeciesRef();
  const euringLookup = useMemo(() => buildEuringLookup(speciesRef), [speciesRef]);
  const soorten = useMemo(
    () => speciesRef.filter(s => s.naam_nl && !s.naam_nl.includes('groene tekst')),
    [speciesRef]
  );

  const defaultSoort = soorten.find(s => s.naam_nl === decodedNaam);
  const soort = speciesOverrides
    ? speciesOverrides.getMerged(decodedNaam, defaultSoort || {})
    : defaultSoort;

  const isNieuweSoort = decodedNaam === '__nieuw__';
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [vangstenOpen, setVangstenOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Auto-start edit voor een nieuwe soort
  useEffect(() => {
    if (isNieuweSoort && isAdmin) setEditMode(true);
  }, [isNieuweSoort, isAdmin]);

  const soortRecords = useMemo(() => {
    if (!decodedNaam) return [];
    const lower = decodedNaam.toLowerCase();
    return records.filter(r => r.vogelnaam && r.vogelnaam.toLowerCase() === lower);
  }, [records, decodedNaam]);

  // Biometriebereiken berekend uit eigen vangsten (min 3 records, geen pullus)
  const bioRangesFromCatches = useMemo(
    () => computeBioRanges(soortRecords.filter(r => r.leeftijd !== '1')),
    [soortRecords]
  );

  // Biometriewaarde: uit samengevoegde soortdata (admin-base + gebruikersoverride)
  const getBioValue = (field, stat) => soort[`bio_${field}_${stat}`] ?? '';
  const fmtBio = val => {
    if (val === '' || val == null) return val;
    const n = parseFloat(String(val).replace(',', '.'));
    return !isNaN(n) && n % 1 === 0 ? String(Math.round(n)) : val;
  };

  const startEdit = () => {
    const data = {};
    Object.values(EDITABLE_FIELDS).flat().forEach(f => {
      if (isBoekKey(f.key)) {
        data[f.key] = soort.boeken?.[f.key] ?? '';
      } else {
        data[f.key] = soort[f.key] ?? '';
      }
    });
    // Bio fields: prefill met huidige waarden (admin-basis of eigen override)
    BIO_FIELDS.forEach(f => {
      ['min', 'max'].forEach(stat => {
        const key = `bio_${f.key}_${stat}`;
        data[key] = getBioValue(f.key, stat);
      });
      // Geslachtsspecifieke biometrie
      ['M', 'F'].forEach(gender => {
        ['min', 'avg', 'max'].forEach(stat => {
          const key = `bio_${f.key}_${gender}_${stat}`;
          data[key] = soort[key] ?? '';
        });
      });
    });
    // Geslachtsbepaling: apart voor man en vrouw
    // Migratie: oude geslachts_notities / ruitype_notities valt terug op ♂-veld
    data.euring_code = soort.euring_code || euringLookup[decodedNaam.toLowerCase()] || '';
    data.geslachts_notities_m = soort.geslachts_notities_m ?? soort.geslachts_notities ?? soort.ruitype_notities ?? '';
    data.geslachts_notities_f = soort.geslachts_notities_f ?? '';
    // Leeftijdsbepaling: apart voor voorjaar en najaar
    // Migratie: oude leeftijds_notities valt terug op voorjaar-veld
    data.leeftijds_notities_vj = soort.leeftijds_notities_vj ?? soort.leeftijds_notities ?? '';
    data.leeftijds_notities_nj = soort.leeftijds_notities_nj ?? '';
    data.foto = soort.foto ?? '';
    data.foto_crop = soort.foto_crop ?? { x: 50, y: 50, zoom: 1 };
    setEditData(data);
    setEditMode(true);
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditData({});
    if (isNieuweSoort) navigate('/soorten');
  };

  const deleteSoort = async () => {
    if (!window.confirm(`Weet je zeker dat je "${decodedNaam}" wilt verwijderen? Dit kan niet ongedaan gemaakt worden.`)) return;
    await supabase.from('species').delete().eq('naam_nl', decodedNaam);
    await db.species.delete(decodedNaam);
    navigate('/soorten');
  };

  const saveEdit = async () => {
    if (isNieuweSoort && !editData.naam_nl?.trim()) {
      alert('Vul een Nederlandse naam in voor de nieuwe soort.');
      return;
    }

    // Alle data gaat altijd naar de centrale species-tabel in Supabase,
    // zodat alle apparaten exact dezelfde data zien.
    // Start vanuit de huidige samengevoegde soortdata (basisdata + eventuele override).
    const newData = {
      ...(soort || {}),
      boeken: { ...((soort?.boeken) || {}) },
    };

    Object.values(EDITABLE_FIELDS).flat().forEach(f => {
      if (isBoekKey(f.key)) {
        if (editData[f.key]) {
          newData.boeken[f.key] = editData[f.key];
        } else {
          delete newData.boeken[f.key];
        }
      } else {
        newData[f.key] = editData[f.key] ?? '';
      }
    });

    BIO_FIELDS.forEach(f => {
      ['min', 'max'].forEach(stat => {
        newData[`bio_${f.key}_${stat}`] = editData[`bio_${f.key}_${stat}`] ?? '';
      });
      ['M', 'F'].forEach(gender => {
        ['min', 'avg', 'max'].forEach(stat => {
          const key = `bio_${f.key}_${gender}_${stat}`;
          newData[key] = editData[key] ?? '';
        });
      });
    });

    newData.geslachts_notities_m  = editData.geslachts_notities_m  ?? '';
    newData.geslachts_notities_f  = editData.geslachts_notities_f  ?? '';
    newData.leeftijds_notities_vj = editData.leeftijds_notities_vj ?? '';
    newData.leeftijds_notities_nj = editData.leeftijds_notities_nj ?? '';
    if (editData.foto !== undefined) newData.foto = editData.foto;
    newData.foto_crop = editData.foto_crop ?? null;

    const newNaamNl = newData.naam_nl || decodedNaam;
    const naamGewijzigd = newNaamNl !== decodedNaam;

    if (naamGewijzigd) {
      await supabase.from('species').delete().eq('naam_nl', decodedNaam);
      await db.species.delete(decodedNaam);
    }

    const { error } = await supabase
      .from('species')
      .upsert({ naam_nl: newNaamNl, data: newData });

    if (error) {
      alert('Opslaan mislukt: ' + error.message);
      return;
    }

    await db.species.put(newData);

    // Verwijder eventuele lokale override: data staat nu in de centrale tabel
    if (speciesOverrides) {
      const ov = speciesOverrides.getOverride(decodedNaam);
      if (Object.keys(ov).length > 0) speciesOverrides.resetOverride(decodedNaam);
    }

    setEditMode(false);
    setEditData({});
    if (naamGewijzigd) navigate('/soorten/' + encodeURIComponent(newNaamNl));
  };

  const genderStats = useMemo(() => {
    const counts = {};
    soortRecords.forEach(r => {
      const g = r.geslacht || 'U';
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [soortRecords]);

  const ageStats = useMemo(() => {
    const counts = {};
    soortRecords.forEach(r => {
      const a = r.leeftijd || '0';
      counts[a] = (counts[a] || 0) + 1;
    });
    return counts;
  }, [soortRecords]);

  const tvCount = soortRecords.filter(r => r.metalenringinfo === 4 || r.metalenringinfo === '4').length;

  if (speciesRef.length === 0) {
    return (
      <div className="page">
        <button className="btn-secondary" onClick={() => navigate('/soorten')}>← Terug</button>
        <div className="empty-state">Laden...</div>
      </div>
    );
  }

  if (!defaultSoort && !isNieuweSoort) {
    return (
      <div className="page">
        <button className="btn-secondary" onClick={() => navigate('/soorten')}>← Terug</button>
        <div className="empty-state">Soort niet gevonden</div>
      </div>
    );
  }

  const foto = soort.foto;
  // Geslachtsbepaling per geslacht (migratie: oud veld → ♂)
  const geslachtsM = soort.geslachts_notities_m || soort.geslachts_notities || soort.ruitype_notities;
  const geslachtsF = soort.geslachts_notities_f;
  // Leeftijdsbepaling per seizoen (migratie: oud veld → voorjaar)
  const leeftijdsVj = soort.leeftijds_notities_vj || soort.leeftijds_notities;
  const leeftijdsNj = soort.leeftijds_notities_nj;

  // Biometrie: databron per cel bepalen voor weergavekleur + legenda
  const bioUserOverride = speciesOverrides?.getOverride(decodedNaam) || {};
  const hasBioData = BIO_FIELDS.some(b =>
    getBioValue(b.key, 'min') || getBioValue(b.key, 'max') ||
    soort[`bio_${b.key}_M_min`] || soort[`bio_${b.key}_M_max`] ||
    soort[`bio_${b.key}_F_min`] || soort[`bio_${b.key}_F_max`] ||
    bioRangesFromCatches[b.key]
  );
  const bioCellCls = (key) => {
    if (bioUserOverride[key] !== undefined && bioUserOverride[key] !== '') return 'sd-bio-num sd-bio-user-ov';
    if (defaultSoort?.[key] !== undefined && defaultSoort?.[key] !== '') return 'sd-bio-num sd-bio-lit';
    return 'sd-bio-num';
  };
  const hasAdminBio = BIO_FIELDS.some(b =>
    defaultSoort?.[`bio_${b.key}_min`] || defaultSoort?.[`bio_${b.key}_max`] ||
    defaultSoort?.[`bio_${b.key}_M_min`] || defaultSoort?.[`bio_${b.key}_F_min`]
  );
  const hasUserBio = BIO_FIELDS.some(b => {
    const keys = ['min', 'max'].flatMap(s =>
      [`bio_${b.key}_${s}`, `bio_${b.key}_M_${s}`, `bio_${b.key}_F_${s}`]
    );
    return keys.some(k => bioUserOverride[k] !== undefined && bioUserOverride[k] !== '');
  });

  const fotoCrop = soort.foto_crop ?? { x: 50, y: 50, zoom: 1 };

  const renderGenderIcons = (val) => {
    if (!val) return <span>—</span>;
    const v = val.toUpperCase();
    const hasM = v.includes('M');
    const hasF = v.includes('V') || v.includes('F');
    return (
      <>
        {hasM && <span className="sd-gender-icon--m">{'\u2642\uFE0E'}</span>}
        {hasF && <span className="sd-gender-icon--f">{'\u2640\uFE0E'}</span>}
        {!hasM && !hasF && <span>{val}</span>}
      </>
    );
  };

  const renderField = (key, label, opts = {}) => {
    const val = isBoekKey(key) ? soort.boeken?.[key] : (soort[key] || opts.fallback || '');
    if (!val) return null;
    let display;
    if (opts.gender) {
      display = renderGenderIcons(val);
    } else if (isBoekKey(key) && val) {
      display = <span>p.&nbsp;{val}</span>;
    } else {
      display = val || '—';
    }
    return (
      <div className={`sd-row${opts.muted ? ' sd-row--muted' : ''}`} key={key}>
        <span className="sd-label">{label}</span>
        <span className={`sd-value ${opts.italic ? 'sd-italic' : ''}`}>{display}</span>
      </div>
    );
  };

  if (editMode) {
    return (
      <SoortDetailEditor
        editData={editData}
        setEditData={setEditData}
        onSave={saveEdit}
        onCancel={cancelEdit}
        soortInfo={soort || {}}
        isNieuweSoort={isNieuweSoort}
        bioRangesFromCatches={bioRangesFromCatches}
      />
    );
  }

  return (
    <div className="page soort-detail">
      <button className="btn-secondary sd-back" onClick={() => navigate('/soorten')}>
        ← Terug
      </button>

      {/* Hero */}
      <div className="sd-hero">
        <div className="sd-foto">
          {foto ? (
            <img
              src={foto}
              alt={soort.naam_nl}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: `${fotoCrop.x}% ${fotoCrop.y}%`,
                transform: fotoCrop.zoom !== 1 ? `scale(${fotoCrop.zoom})` : undefined,
                transformOrigin: `${fotoCrop.x}% ${fotoCrop.y}%`,
                pointerEvents: 'none', userSelect: 'none', display: 'block',
              }}
            />
          ) : (
            <div className="sd-foto-placeholder">
              <span>🐦</span>
            </div>
          )}
        </div>
        <div className="sd-hero-info">
          <h2 className="sd-title">
            {soort.naam_nl}
            {euringLookup[soort.naam_nl?.toLowerCase()] && (
              <span className="euring-hint">({euringLookup[soort.naam_nl.toLowerCase()]})</span>
            )}
          </h2>
          {soort.naam_lat && <p className="sd-subtitle">{soort.naam_lat}</p>}
          <div className="sd-badges">
            {soort.ringmaat && (
              <span className="sd-badge sd-badge-accent">Ring {soort.ringmaat}</span>
            )}
            {soort.ruitype && (
              <span className="sd-badge sd-badge-muted">{soort.ruitype}</span>
            )}
          </div>
        </div>
        <div className="sd-hero-actions">
          <button
            className={`sd-refresh-btn${refreshing ? ' sd-refresh-btn--busy' : ''}`}
            title="Soortdata verversen"
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try { await pullSpeciesIfNeeded(true); } finally { setRefreshing(false); }
            }}
          >⟳</button>
          {!isViewer && (
            <button className="sd-edit-btn" onClick={startEdit} title="Bewerken">✏️</button>
          )}
          {isAdmin && (
            <button className="sd-delete-btn" onClick={deleteSoort} title="Soort verwijderen">🗑️</button>
          )}
        </div>
      </div>

      {/* Geslachtsbepaling */}
      {(geslachtsM || geslachtsF) && (
        <div className="sd-card">
          <h3 className="sd-card-title">Geslachtsbepaling</h3>
          <div className="sd-det-view">
            {geslachtsM && (
              <div className="sd-det-block">
                <span className="sd-det-label sd-det-label--m">{'\u2642\uFE0E'} Man</span>
                <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(geslachtsM) }} />
              </div>
            )}
            {geslachtsF && (
              <div className="sd-det-block">
                <span className="sd-det-label sd-det-label--f">{'\u2640\uFE0E'} Vrouw</span>
                <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(geslachtsF) }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leeftijdsbepaling */}
      {(leeftijdsVj || leeftijdsNj) && (
        <div className="sd-card">
          <h3 className="sd-card-title">Leeftijdsbepaling</h3>
          <div className="sd-det-view">
            {leeftijdsVj && (
              <div className="sd-det-block">
                <span className="sd-det-label sd-det-label--vj">Voorjaar</span>
                <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(leeftijdsVj) }} />
              </div>
            )}
            {leeftijdsNj && (
              <div className="sd-det-block">
                <span className="sd-det-label sd-det-label--nj">Najaar</span>
                <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(leeftijdsNj) }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ring & Rui */}
      <div className="sd-card">
        <h3 className="sd-card-title">Ring & Rui</h3>
        {EDITABLE_FIELDS.ring.map(f =>
          renderField(f.key, f.label, {
            fallback: f.key === 'euring_code' ? (euringLookup[decodedNaam.toLowerCase()] || '') : undefined,
          })
        )}
        {soort.ruitype && (
          <RuitypeInfo ruitype={soort.ruitype} />
        )}
      </div>

      {/* Namen + Biometrie naast elkaar */}
      <div className="sd-two-cards">
        <div className="sd-card">
          <h3 className="sd-card-title">Namen</h3>
          {EDITABLE_FIELDS.namen.map(f =>
            renderField(f.key, f.label, { italic: f.key === 'naam_lat' })
          )}
          <div className="sd-section-divider" />
          <span className="sd-section-label">Taxonomie</span>
          {EDITABLE_FIELDS.taxonomie.map(f =>
            renderField(f.key, f.label, { muted: true })
          )}
        </div>
        {hasBioData && (
          <div className="sd-card">
            <h3 className="sd-card-title">Biometrie</h3>
            <div className="sd-bio-list">
              {BIO_FIELDS.map(b => {
                const minVal = getBioValue(b.key, 'min');
                const maxVal = getBioValue(b.key, 'max');
                const gRows = [['M', '\u2642\uFE0E'], ['F', '\u2640\uFE0E']].map(([g, sym]) => ({
                  g, sym,
                  min: soort[`bio_${b.key}_${g}_min`],
                  max: soort[`bio_${b.key}_${g}_max`],
                  minKey: `bio_${b.key}_${g}_min`,
                })).filter(r => r.min || r.max);
                const recRange = bioRangesFromCatches[b.key];
                if (!minVal && !maxVal && gRows.length === 0 && !recRange) return null;
                return (
                  <div key={b.key} className="sd-bio-group">
                    <div className="sd-bio-group-label">
                      {b.label} <span className="sd-bio-unit">({b.unit})</span>
                    </div>
                    {(minVal || maxVal) && (
                      <div className="sd-bio-subrow">
                        <span className="sd-bio-subrow-cat">Alg.</span>
                        <span className={bioCellCls(`bio_${b.key}_min`)}>
                          {fmtBio(minVal) || '—'} – {fmtBio(maxVal) || '—'}
                        </span>
                      </div>
                    )}
                    {gRows.map(({ g, sym, min, max, minKey }) => (
                      <div key={g} className={`sd-bio-subrow sd-bio-subrow--${g.toLowerCase()}`}>
                        <span className="sd-bio-subrow-cat">{sym}</span>
                        <span className={bioCellCls(minKey)}>
                          {fmtBio(min) || '—'} – {fmtBio(max) || '—'}
                        </span>
                      </div>
                    ))}
                    {recRange && (
                      <div className="sd-bio-subrow sd-bio-subrow--rec">
                        <span className="sd-bio-subrow-cat sd-bio-rec-tag">~</span>
                        <span className="sd-bio-rec">
                          {fmtBio(recRange.min) || '—'} – {fmtBio(recRange.max) || '—'}
                        </span>
                        <span className="sd-bio-rec-n">n={recRange.n}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {(hasAdminBio || hasUserBio || BIO_FIELDS.some(b => bioRangesFromCatches[b.key])) && (
              <div className="sd-bio-legend">
                {hasAdminBio && (
                  <span className="sd-bio-legend-item">
                    <span className="sd-bio-legend-dot sd-bio-legend-dot--lit" />
                    Literatuurdata
                  </span>
                )}
                {hasUserBio && (
                  <span className="sd-bio-legend-item">
                    <span className="sd-bio-legend-dot sd-bio-legend-dot--user" />
                    Door jou ingevoerd
                  </span>
                )}
                {BIO_FIELDS.some(b => bioRangesFromCatches[b.key]) && (
                  <span className="sd-bio-legend-item">
                    <span className="sd-bio-legend-dot sd-bio-legend-dot--rec" />
                    Eigen vangsten
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nestgegevens + Determinatieboeken naast elkaar */}
      <div className="sd-two-cards">
        {(soort.nest_eileg && soort.nest_eileg !== 'maanden') && (
          <div className="sd-card">
            <h3 className="sd-card-title">Nestgegevens</h3>
            {EDITABLE_FIELDS.nest.map(f =>
              renderField(f.key, f.label, { gender: f.gender })
            )}
          </div>
        )}
        {(soort.boeken && Object.keys(soort.boeken).length > 0) && (
          <div className="sd-card">
            <h3 className="sd-card-title">Determinatieboeken</h3>
            {EDITABLE_FIELDS.boeken.map(f =>
              renderField(f.key, f.label)
            )}
          </div>
        )}
      </div>

      {/* Mijn vangsten */}
      <div className="sd-card">
        <div className="sd-vangsten-header" onClick={() => setVangstenOpen(o => !o)}>
          <h3 className="sd-card-title sd-card-title--toggle">
            Mijn vangsten
            {soortRecords.length > 0 && (
              <span className="sd-vangsten-count">{soortRecords.length}</span>
            )}
          </h3>
          <span className={`sd-vangsten-toggle${vangstenOpen ? ' sd-vangsten-toggle--open' : ''}`}>▼</span>
        </div>
        {vangstenOpen && (soortRecords.length === 0 ? (
          <p className="sd-empty" style={{ marginTop: 10 }}>Nog geen vangsten van deze soort</p>
        ) : (
          <div className="sd-vangsten-content">
            <div className="sd-stats-row">
              <div className="sd-stat">
                <div className="sd-stat-value">{soortRecords.length}</div>
                <div className="sd-stat-label">Totaal</div>
              </div>
              {tvCount > 0 && (
                <div className="sd-stat">
                  <div className="sd-stat-value sd-stat-value--tv">{tvCount}</div>
                  <div className="sd-stat-label">Terugv.</div>
                </div>
              )}
              {Object.entries(genderStats).map(([g, count]) => (
                <div key={g} className="sd-stat">
                  <div className="sd-stat-value">{count}</div>
                  <div className="sd-stat-label">
                    {g === 'M' ? <><span className="sd-gender-icon--m">{'\u2642\uFE0E'}</span> Man</> :
                     g === 'F' ? <><span className="sd-gender-icon--f">{'\u2640\uFE0E'}</span> Vrouw</> :
                     'Onbekend'}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(ageStats).length > 0 && (
              <div className="sd-age-section">
                <span className="sd-sub-title">Leeftijdsverdeling</span>
                {(() => {
                  const AGE_ORDER = ['1', '3', '4', '5', '6', '7', '8', '9', 'A', '2', '0'];
                  const sorted = AGE_ORDER.filter(c => ageStats[c]).map(c => [c, ageStats[c]]);
                  const maxCount = Math.max(...sorted.map(([, n]) => n));
                  return (
                    <div className="sd-age-chart">
                      {sorted.map(([code, count]) => (
                        <div key={code} className="sd-age-bar-row">
                          <span className="sd-age-bar-label">{leeftijdLabel(code)}</span>
                          <div className="sd-age-bar-track">
                            <div className="sd-age-bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                          </div>
                          <span className="sd-age-bar-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            <VangstKaart targetRecords={soortRecords} allRecords={records} />

            <div className="sd-recent-section">
              <span className="sd-sub-title">Recente vangsten</span>
              {[...soortRecords]
                .sort((a, b) => {
                  const dateA = a.vangstdatum || '';
                  const dateB = b.vangstdatum || '';
                  if (dateB !== dateA) return dateB > dateA ? 1 : -1;
                  // Zelfde datum: ringnummer als tiebreaker, maar alleen voor nieuwe vangsten
                  const isTvA = a.metalenringinfo === 4 || a.metalenringinfo === '4';
                  const isTvB = b.metalenringinfo === 4 || b.metalenringinfo === '4';
                  if (!isTvA && !isTvB) {
                    const ringNum = s => {
                      const m = s?.replace(/\./g, '').match(/^[A-Za-z]*(\d+)[A-Za-z]*$/);
                      return m ? parseInt(m[1], 10) : 0;
                    };
                    return ringNum(b.ringnummer) - ringNum(a.ringnummer);
                  }
                  return 0;
                })
                .slice(0, 10)
                .map(r => {
                  const isTerugvangst = r.metalenringinfo === 4 || r.metalenringinfo === '4';
                  return (
                    <div key={r.id} className={`sd-recent-item${isTerugvangst ? ' sd-recent-item--tv' : ''}`}>
                      <span className="sd-recent-type">{isTerugvangst ? 'TV' : 'NV'}</span>
                      <span
                        className="sd-recent-ring ring-link"
                        onClick={() => navigate('/records', { state: { openId: r.id } })}
                      >{r.ringnummer}</span>
                      <span className="sd-recent-date">{formatDatum(r.vangstdatum)}</span>
                      <span className="sd-recent-meta">
                        {r.geslacht && r.geslacht !== 'U' && <>{r.geslacht}</>}
                        {r.leeftijd && <> · {leeftijdLabel(r.leeftijd)}</>}
                      </span>
                    </div>
                  );
                })}
              <button
                className="sd-all-records-link"
                onClick={() => navigate('/records', { state: { filterSoort: decodedNaam } })}
              >
                Alle {soortRecords.length} vangsten van {soort.naam_nl} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

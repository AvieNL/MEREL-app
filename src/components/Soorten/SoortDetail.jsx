import { useState, useMemo, useRef } from 'react';
import { NestIcoon } from '../shared/Icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSpeciesRef, pullSpeciesIfNeeded } from '../../hooks/useSpeciesRef';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNestData } from '../../hooks/useNestData';
import { useModuleSwitch } from '../../App';
import { buildEuringLookup } from '../../utils/euring-lookup';
import RuitypeInfo from './RuitypeInfo';
import ZoonosePanel from '../Nieuw/ZoonosePanel';
import KrullevaarPage from './KrullevaarPage';
import { VangstKaart } from '../Stats/Charts';
import { renderMarkdown, renderLeeftijdMarkdown, renderIDKenmerken } from '../../utils/textHelper';
import { formatDatum, toYMD } from '../../utils/dateHelper';
import { LEEFTIJD_LABEL } from '../../data/constants';
import { computeBioRanges } from '../../utils/bioHelper';
import { TYPE_CFG, buildNvByRing, getVangstType } from '../../utils/vangstType';
import BronBadge from '../shared/BronBadge';
import DeterminatieButton from '../Determinatie/DeterminatieButton';
import DeterminatieOverzicht from '../Determinatie/DeterminatieOverzicht';
import { useDeterminatieAids, pullDeterminatieAidsIfNeeded } from '../../hooks/useDeterminatieAids';
import './SoortDetail.css';

function leeftijdLabel(code) { return LEEFTIJD_LABEL[code] || code; }

const ALL_BOEKEN_KEYS = [
  'svensson_2023', 'svensson_2016', 'demongin_2020', 'blasco_zumeta_2023',
  'jenni_winkler_2020', 'baker_2016', 'klaassen_voorjaar', 'klaassen_najaar',
  'conings_1999', 'speek_1994',
];

const boekKeys = new Set(ALL_BOEKEN_KEYS);

function isBoekKey(key) {
  return boekKeys.has(key);
}

const LANG_FIELD = { nl: 'naam_nl', en: 'naam_en', de: 'naam_de' };

const BIO_EXTREMEN_KEYS = ['vleugel', 'handpenlengte', 'staartlengte', 'kop_snavel', 'snavel_schedel', 'tarsus_lengte', 'tarsus_dikte', 'snavel_diepte', 'gewicht'];

export default function SoortDetail({ records, speciesOverrides }) {
  const { naam } = useParams();
  const navigate = useNavigate();
  const decodedNaam = decodeURIComponent(naam);
  const { user, profile, simulatedRole } = useAuth();
  const effectiveRole = simulatedRole || profile?.rol;
  const isAdmin = effectiveRole === 'admin';
  const { t, i18n } = useTranslation();

  const BIO_FIELDS = [
    { key: 'vleugel',           label: t('sd_bio_vleugel'),           unit: 'mm', hasJuv: true },
    { key: 'handpenlengte',     label: t('sd_bio_handpen'),           unit: 'mm' },
    { key: 'staartlengte',      label: t('sd_bio_staart'),            unit: 'mm', hasJuv: true },
    { key: 'kop_snavel',        label: t('sd_bio_kop_snavel'),        unit: 'mm' },
    { key: 'snavel_schedel',    label: t('sd_bio_snavel_schedel'),    unit: 'mm' },
    { key: 'snavel_neusgat',    label: 'Snavel tot neusgat',          unit: 'mm', refOnly: true },
    { key: 'tarsus_lengte',     label: t('sd_bio_tarsus'),            unit: 'mm' },
    { key: 'tarsus_dikte',      label: t('sd_bio_tarsus_dikte'),      unit: 'mm' },
    { key: 'snavel_diepte',     label: t('sd_bio_snavel_diepte'),     unit: 'mm' },
    { key: 'snavel_diepte_mid', label: 'Snaveldiepte mid. neusgat',   unit: 'mm', refOnly: true },
    { key: 'gewicht',           label: t('sd_bio_gewicht'),           unit: 'g'  },
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
      { key: 'nest_eileg',           label: t('sd_nest_eileg') },
      { key: 'nest_broedels',        label: t('sd_nest_broedels') },
      { key: 'nest_eieren',          label: t('sd_nest_eieren') },
      { key: 'nest_ei_dagen',        label: t('sd_nest_ei_dagen') },
      { key: 'nest_jong_dagen',      label: t('sd_nest_jong_dagen') },
      { key: 'broed',                label: t('sd_nest_broed'), gender: true },
      { key: 'zorg',                 label: t('sd_nest_zorg'),  gender: true },
      { key: 'eerste_broedleeftijd', label: 'Eerste broedleeftijd' },
    ],
    boeken: ALL_BOEKEN,
  };

  const speciesRef = useSpeciesRef();
  const euringLookup = useMemo(() => buildEuringLookup(speciesRef), [speciesRef]);
  const { getAidsVoorSoort, getAidById } = useDeterminatieAids();
  const soorten = useMemo(
    () => speciesRef.filter(s => s.naam_nl && !s.naam_nl.includes('groene tekst')),
    [speciesRef]
  );

  const defaultSoort = soorten.find(s => s.naam_nl === decodedNaam);
  // getMerged samenvoegt: defaultSoort (species-tabel) < species_overrides (gebruiker)
  // Boeken worden samengevoegd uit beide bronnen zodat niets verloren gaat.
  // Zie useSpeciesOverrides.js → getMerged voor de volledige merge-logica.
  const soort = speciesOverrides
    ? speciesOverrides.getMerged(decodedNaam, defaultSoort || {})
    : defaultSoort;

  const [vangstenOpen, setVangstenOpen] = useState(false);
  const [literatuurOpen, setLiteratuurOpen] = useState(false);
  const [nestenOpen, setNestenOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fotoUploading, setFotoUploading] = useState(false);
  const [fotoEditMode, setFotoEditMode] = useState(false);
  const [editFoto, setEditFoto] = useState(null);
  const [editCrop, setEditCrop] = useState({ x: 50, y: 50, zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const fotoInputRef = useRef(null);
  const previewRef = useRef(null);
  const dragRef = useRef(null);
  const [leeftijdSeizoen, setLeeftijdSeizoen] = useState(
    () => new Date().getMonth() + 1 <= 6 ? 'vj' : 'nj'
  );

  const { nesten, legsels, bezoeken, ringen } = useNestData();
  const switchModule = useModuleSwitch();

  const soortRecords = useMemo(() => {
    if (!decodedNaam) return [];
    const lower = decodedNaam.toLowerCase();
    return records.filter(r => r.vogelnaam && r.vogelnaam.toLowerCase() === lower);
  }, [records, decodedNaam]);

  const nvByRing = useMemo(() => buildNvByRing(records), [records]);

  // Biometriebereiken berekend uit eigen vangsten (min 3 records, geen pullus)
  const bioRangesFromCatches = useMemo(
    () => computeBioRanges(soortRecords.filter(r => r.leeftijd !== '1')),
    [soortRecords]
  );

  // Biometrie extremen uit eigen vangsten (excl. pulli)
  const bioExtremenEigen = useMemo(() => {
    const basis = soortRecords.filter(r => r.leeftijd !== '1');
    return BIO_EXTREMEN_KEYS.map(key => {
      const metWaarde = basis
        .filter(r => r[key] != null && r[key] !== '' && !isNaN(parseFloat(r[key])))
        .map(r => ({ r, val: parseFloat(r[key]) }));
      if (metWaarde.length === 0) return null;
      const sorted = [...metWaarde].sort((a, b) => a.val - b.val);
      return { key, min: sorted[0], max: sorted[sorted.length - 1] };
    }).filter(Boolean);
  }, [soortRecords]);

  // Biometriewaarde: uit samengevoegde soortdata (admin-base + gebruikersoverride)
  const getBioValue = (field, stat) => soort[`bio_${field}_${stat}`] ?? '';
  const fmtBio = val => {
    if (val === '' || val == null) return val;
    const n = parseFloat(String(val).replace(',', '.'));
    return !isNaN(n) && n % 1 === 0 ? String(Math.round(n)) : val;
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

  // Legsels voor deze soort (via bezoek.soort_euring of legsel.soort_euring)
  const soortEuringCode = soort?.euring_code || euringLookup[decodedNaam?.toLowerCase()] || '';
  const nestLegsels = useMemo(() => {
    if (!soortEuringCode || legsels.length === 0) return [];
    const relevanteLegselIds = new Set();
    bezoeken.forEach(b => { if (b.soort_euring === soortEuringCode) relevanteLegselIds.add(b.legsel_id); });
    legsels.forEach(l => { if (l.soort_euring === soortEuringCode) relevanteLegselIds.add(l.id); });
    return legsels
      .filter(l => relevanteLegselIds.has(l.id))
      .map(l => {
        const nest = nesten.find(n => n.id === l.nest_id);
        if (!nest || nest.deleted_at) return null;
        const legselBezoeken = bezoeken
          .filter(b => b.legsel_id === l.id)
          .sort((a, b) => a.datum.localeCompare(b.datum));
        const legselRingen = ringen.filter(r =>
          legselBezoeken.some(b => b.id === r.nestbezoek_id)
        );
        return { legsel: l, nest, bezoeken: legselBezoeken, ringen: legselRingen };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const latA = a.bezoeken.at(-1)?.datum || '';
        const latB = b.bezoeken.at(-1)?.datum || '';
        return latB.localeCompare(latA);
      });
  }, [soortEuringCode, legsels, bezoeken, nesten, ringen]);

  if (speciesRef.length === 0) {
    return (
      <div className="page">
        <button className="btn-secondary page-back" onClick={() => navigate(-1)}>{t('sd_back')}</button>
        <div className="empty-state">{t('sd_loading')}</div>
      </div>
    );
  }

  // 🐦 Easter egg — Krullevaar uit Pluk van de Petteflet
  if (decodedNaam === 'Krullevaar' || defaultSoort?.euring_code === '00001') {
    return <KrullevaarPage />;
  }

  if (!defaultSoort) {
    return (
      <div className="page">
        <button className="btn-secondary page-back" onClick={() => navigate(-1)}>{t('sd_back')}</button>
        <div className="empty-state">{t('sd_not_found')}</div>
      </div>
    );
  }

  const displayNaam = soort[LANG_FIELD[i18n.language] || 'naam_nl'] || soort.naam_nl;

  const foto = soort.foto;
  // Geslachtsbepaling per geslacht (migratie: oud veld → ♂)
  const geslachtsM = soort.geslachts_notities_m || soort.geslachts_notities || soort.ruitype_notities;
  const geslachtsF = soort.geslachts_notities_f;
  // Leeftijdsbepaling per seizoen (migratie: oud veld → voorjaar)
  const leeftijdsVj = soort.leeftijds_notities_vj || soort.leeftijds_notities;
  const leeftijdsNj = soort.leeftijds_notities_nj;
  // Soort-specifieke extra velden
  const vleugelformule = soort.vleugelformule;
  const determinatieIdNotities = soort.determinatie_id_notities;
  const ondersoorten = soort.ondersoorten;
  const bronBiometrie = soort.bron_biometrie;

  // Biometrie: databron per cel bepalen voor weergavekleur + legenda
  const bioUserOverride = speciesOverrides?.getOverride(decodedNaam) || {};
  const hasBioData = BIO_FIELDS.some(b =>
    getBioValue(b.key, 'min') || getBioValue(b.key, 'max') ||
    soort[`bio_${b.key}_M_min`] || soort[`bio_${b.key}_M_max`] ||
    soort[`bio_${b.key}_F_min`] || soort[`bio_${b.key}_F_max`] ||
    soort[`bio_${b.key}_JM_min`] || soort[`bio_${b.key}_JM_max`] ||
    soort[`bio_${b.key}_JF_min`] || soort[`bio_${b.key}_JF_max`] ||
    bioRangesFromCatches[b.key]
  );
  const bioCellCls = (key) => {
    if (bioUserOverride[key] !== undefined && bioUserOverride[key] !== '') return 'sd-bio-num sd-bio-user-ov';
    if (defaultSoort?.[key] !== undefined && defaultSoort?.[key] !== '') return 'sd-bio-num sd-bio-lit';
    return 'sd-bio-num';
  };
  const hasAdminBio = BIO_FIELDS.some(b =>
    defaultSoort?.[`bio_${b.key}_min`] || defaultSoort?.[`bio_${b.key}_max`] ||
    defaultSoort?.[`bio_${b.key}_M_min`] || defaultSoort?.[`bio_${b.key}_F_min`] ||
    defaultSoort?.[`bio_${b.key}_JM_min`] || defaultSoort?.[`bio_${b.key}_JF_min`]
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

  // Foto upload helpers (admin only)
  function resizeImage(file, maxWidth = 600) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Bestandskiezer → enter edit mode met nieuwe foto
  async function handleFotoFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeImage(file);
    setEditFoto(dataUrl);
    setEditCrop({ x: 50, y: 50, zoom: 1 });
    setFotoEditMode(true);
    if (fotoInputRef.current) fotoInputRef.current.value = '';
  }

  // Klik op foto-div (admin): enter edit mode
  function handleFotoClick() {
    if (!isAdmin) return;
    if (foto && !fotoEditMode) {
      // Bestaande foto → bewerk bijsnijding (gebruik huidige crop als startpunt)
      setEditFoto(foto);
      setEditCrop(fotoCrop);
      setFotoEditMode(true);
    } else if (!foto) {
      // Geen foto → open bestandskiezer
      fotoInputRef.current?.click();
    }
  }

  // Drag om positie aan te passen
  function getDragPos(e) {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function handleDragStart(e) {
    e.preventDefault();
    const pos = getDragPos(e);
    dragRef.current = { startX: pos.x, startY: pos.y, startCropX: editCrop.x, startCropY: editCrop.y };
    setIsDragging(true);
  }

  function handleDragMove(e) {
    if (!isDragging || !dragRef.current || !previewRef.current) return;
    const { startX, startY, startCropX, startCropY } = dragRef.current;
    const pos = getDragPos(e);
    const rect = previewRef.current.getBoundingClientRect();
    const sensitivity = 100 / editCrop.zoom;
    const newX = Math.max(0, Math.min(100, startCropX - ((pos.x - startX) / rect.width) * sensitivity));
    const newY = Math.max(0, Math.min(100, startCropY - ((pos.y - startY) / rect.height) * sensitivity));
    setEditCrop(prev => ({ ...prev, x: newX, y: newY }));
  }

  function handleDragEnd() {
    setIsDragging(false);
    dragRef.current = null;
  }

  // Opslaan naar Supabase
  async function handleFotoSave() {
    if (!soort || !editFoto) return;
    setFotoUploading(true);
    try {
      const { data: row, error: fetchErr } = await supabase
        .from('species')
        .select('data')
        .eq('naam_nl', soort.naam_nl)
        .single();
      if (fetchErr) throw fetchErr;
      const existingData = row?.data ?? {};
      const { error: updateErr } = await supabase
        .from('species')
        .update({ data: { ...existingData, foto: editFoto, foto_crop: editCrop } })
        .eq('naam_nl', soort.naam_nl);
      if (updateErr) throw updateErr;
      await pullSpeciesIfNeeded(true);
      setFotoEditMode(false);
    } catch (err) {
      console.error('Foto opslaan mislukt:', err.message);
      alert('Foto opslaan mislukt: ' + err.message);
    } finally {
      setFotoUploading(false);
    }
  }

  function handleFotoCancel() {
    setFotoEditMode(false);
    setEditFoto(null);
    setEditCrop({ x: 50, y: 50, zoom: 1 });
  }

  return (
    <div className="page soort-detail">
      <button className="btn-secondary page-back" onClick={() => navigate(-1)}>
        {t('sd_back')}
      </button>

      {/* Hero */}
      <div className="sd-hero">
        <div
          className={`sd-foto${isAdmin ? ' sd-foto--editable' : ''}`}
          onClick={handleFotoClick}
          title={isAdmin ? (foto ? 'Klik om foto te bewerken' : 'Klik om foto toe te voegen') : undefined}
        >
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
              {isAdmin && <span className="sd-foto-hint">+ foto</span>}
            </div>
          )}
        </div>
        <input
          ref={fotoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFotoFileSelect}
        />
        <div className="sd-hero-info">
          <h2 className="sd-title">
            {displayNaam}
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
            title={t('sd_refresh_title')}
            disabled={refreshing}
            onClick={async () => {
              setRefreshing(true);
              try {
                await Promise.all([
                  pullSpeciesIfNeeded(true),
                  pullDeterminatieAidsIfNeeded(true),
                ]);
              } finally { setRefreshing(false); }
            }}
          >⟳</button>
        </div>
      </div>

      {/* Foto bewerken (admin) */}
      {isAdmin && fotoEditMode && editFoto && (
        <div className="sd-foto-edit-panel">
          <div
            ref={previewRef}
            className={`sd-foto-preview${isDragging ? ' sd-foto-dragging' : ''}`}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <img
              src={editFoto}
              alt="voorvertoning"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                objectPosition: `${editCrop.x}% ${editCrop.y}%`,
                transform: editCrop.zoom !== 1 ? `scale(${editCrop.zoom})` : undefined,
                transformOrigin: `${editCrop.x}% ${editCrop.y}%`,
                pointerEvents: 'none', userSelect: 'none', display: 'block',
              }}
            />
            <div className="sd-foto-drag-hint">↕ Sleep om te positioneren</div>
          </div>
          <div className="sd-foto-edit-controls">
            <div className="sd-foto-zoom-row">
              <span className="sd-foto-zoom-label">Zoom</span>
              <input
                type="range" min="1" max="3" step="0.05"
                value={editCrop.zoom}
                onChange={e => setEditCrop(prev => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                className="sd-foto-zoom-slider"
              />
              <span className="sd-foto-zoom-val">{editCrop.zoom.toFixed(2)}×</span>
            </div>
            <div className="sd-foto-edit-btns">
              <button className="sd-foto-btn" onClick={() => fotoInputRef.current?.click()}>
                📷 Andere foto
              </button>
              <button
                className="sd-foto-btn sd-foto-btn--save"
                disabled={fotoUploading}
                onClick={handleFotoSave}
              >
                {fotoUploading ? 'Bezig…' : 'Opslaan'}
              </button>
              <button className="sd-foto-btn sd-foto-btn--cancel" onClick={handleFotoCancel}>
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Geslachtsbepaling */}
      {(geslachtsM || geslachtsF) && (
        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_gender_det')} <BronBadge bron={soort.bron_geslacht} /></h3>
          <div className="sd-det-view">
            {geslachtsM && (
              <div className="sd-det-block">
                <span className="sd-det-label sd-det-label--m">{'\u2642\uFE0E'} M</span>
                <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(geslachtsM) }} />
              </div>
            )}
            {geslachtsF && (
              <div className="sd-det-block">
                <span className="sd-det-label sd-det-label--f">{'\u2640\uFE0E'} V</span>
                <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(geslachtsF) }} />
              </div>
            )}
          </div>
          {/* Link naar determinatiehulp voor geslachtsbepaling, indien beschikbaar */}
          {(() => {
            const aid = getAidsVoorSoort(soortEuringCode).find(a => a.id.includes('geslacht'));
            if (!aid) return null;
            return (
              <a href="#determinatiehulp" className="sd-aid-link">
                {'\u2193'} {aid.naam}
              </a>
            );
          })()}
        </div>
      )}

      {/* Leeftijdsbepaling */}
      {(leeftijdsVj || leeftijdsNj) && (
        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_age_det')} <BronBadge bron={soort.bron_leeftijdsbepaling} /></h3>
          {leeftijdsVj && !leeftijdsNj ? (
            // Samengevoegde modus: één tekst met {{MM-MM}} maandblokken
            <>
              {/* Seizoenstabs */}
              <div className="sd-det-tabs">
                <button
                  className={`sd-det-tab${leeftijdSeizoen === 'vj' ? ' sd-det-tab--actief' : ''}`}
                  onClick={() => setLeeftijdSeizoen('vj')}
                >Voorjaar <span className="sd-det-tab__sub">jan–jun</span></button>
                <button
                  className={`sd-det-tab${leeftijdSeizoen === 'nj' ? ' sd-det-tab--actief' : ''}`}
                  onClick={() => setLeeftijdSeizoen('nj')}
                >Najaar <span className="sd-det-tab__sub">jul–dec</span></button>
              </div>
              <div className="sd-leeftijd-panel">
                {/* Legenda */}
                {(() => {
                  const BUFFER_DAYS = 21;
                  const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
                  const now = new Date();
                  const winStart = new Date(now); winStart.setDate(winStart.getDate() - BUFFER_DAYS);
                  const winEnd = new Date(now); winEnd.setDate(winEnd.getDate() + BUFFER_DAYS);
                  const fmt = d => `${d.getDate()} ${MAANDEN_KORT[d.getMonth()]}`;
                  return (
                    <p className="leeftijd-legenda">
                      <span className="leeftijd-legenda__kleur" aria-hidden="true" />
                      Gemarkeerd = momenteel relevant ({fmt(winStart)} – {fmt(winEnd)})
                    </p>
                  );
                })()}
                <div
                  className="sd-notities-text sd-leeftijd-blokken"
                  dangerouslySetInnerHTML={{ __html: renderLeeftijdMarkdown(leeftijdsVj, leeftijdSeizoen) }}
                />
              </div>
            </>
          ) : (
            // Klassieke modus: apart voorjaar en najaar
            <div className="sd-det-view">
              {leeftijdsVj && (
                <div className="sd-det-block">
                  <span className="sd-det-label sd-det-label--vj">{t('sd_spring')}</span>
                  <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(leeftijdsVj) }} />
                </div>
              )}
              {leeftijdsNj && (
                <div className="sd-det-block">
                  <span className="sd-det-label sd-det-label--nj">{t('sd_autumn')}</span>
                  <p className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(leeftijdsNj) }} />
                </div>
              )}
            </div>
          )}
          {/* Link naar determinatiehulp voor leeftijdsbepaling, indien beschikbaar */}
          {(() => {
            const aid = getAidsVoorSoort(soortEuringCode).find(a => a.id.includes('leeftijd'));
            if (!aid) return null;
            return (
              <a href="#determinatiehulp" className="sd-aid-link">
                {'↓'} {aid.naam}
              </a>
            );
          })()}
        </div>
      )}

      {/* ID-kenmerken (soort-specifiek, bijv. onderscheid met vergelijkbare soorten) */}
      {determinatieIdNotities && (
        <div className="sd-card">
          <h3 className="sd-card-title">ID-kenmerken <BronBadge bron={soort.bron_id_kenmerken} /></h3>
          <div dangerouslySetInnerHTML={{ __html: renderIDKenmerken(determinatieIdNotities) }} />
        </div>
      )}

      {/* Determinatiehulpen (naslag-modus) */}
      {(() => {
        const aids = getAidsVoorSoort(soortEuringCode);
        if (!aids.length) return null;
        return (
          <div className="sd-card" id="determinatiehulp">
            <h3 className="sd-card-title">Determinatiehulp</h3>
            <div className="sd-det-aids">
              {aids.map(aid => (
                <div key={aid.id} className="sd-det-aid-blok">
                  <div className="sd-det-aid-row">
                    <div className="sd-det-aid-info">
                      <span className="sd-det-aid-naam">{aid.naam}</span>
                      {aid.korte_beschrijving && (
                        <span className="sd-det-aid-beschrijving">{aid.korte_beschrijving}</span>
                      )}
                      {aid.bron && <BronBadge bron={aid.bron} />}
                    </div>
                    <DeterminatieButton
                      aid={aid}
                      getAidById={getAidById}
                      formValues={null}
                      onGebruik={null}
                      label="Probeer"
                    />
                  </div>
                  <DeterminatieOverzicht aid={aid} />
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Ring & Rui */}
      <div className="sd-card">
        <h3 className="sd-card-title">{t('sd_ring_rui')} <BronBadge bron={soort.bron_ring} /></h3>
        {EDITABLE_FIELDS.ring.map(f =>
          renderField(f.key, f.label, {
            fallback: f.key === 'euring_code' ? (euringLookup[decodedNaam.toLowerCase()] || '') : undefined,
          })
        )}
        {soort.ruitype && (
          <RuitypeInfo ruitype={soort.ruitype} />
        )}
        {soort.rui_notities && (
          <div className="sd-vleugelformule">
            <span className="sd-label">Ruitiming</span>
            <div className="sd-notities-text" dangerouslySetInnerHTML={{ __html: renderMarkdown(soort.rui_notities) }} />
          </div>
        )}
        {(soort.pennen_structuur || vleugelformule) && (() => {
          // ── Vleugelkenmerken uit pennen_structuur ──────────────────────────
          const ps = soort.pennen_structuur
            ? (typeof soort.pennen_structuur === 'string'
                ? JSON.parse(soort.pennen_structuur)
                : soort.pennen_structuur)
            : null;
          const kennisRijen = ps ? [
            ps.wp  ? { type: 'rij', label: 'Vleugelpunt',  waarde: String(ps.wp), note: null              } : null,
            ps.hp  ? { type: 'rij', label: 'Handpennen',   waarde: String(ps.hp), note: ps.hp_note || null } : null,
            ps.ap  ? { type: 'rij', label: 'Armpennen',    waarde: String(ps.ap), note: ps.ap_note || null } : null,
            ps.tp  ? { type: 'rij', label: 'Tertials',     waarde: String(ps.tp), note: ps.tp_note || null } : null,
            ps.sp  ? { type: 'rij', label: 'Staartpennen', waarde: String(ps.sp), note: ps.sp_note || null } : null,
          ].filter(Boolean) : [];

          // ── Vleugelformule tekst parsen ────────────────────────────────────
          const parseVF = (tekst) => {
            const result = [];
            for (const rawLine of tekst.split('\n')) {
              const line = rawLine.trim();
              if (!line) continue;
              if (line.endsWith(':')) {
                result.push({ type: 'kop', tekst: line.slice(0, -1) });
                continue;
              }
              if (line.includes('·')) {
                const delen = line.split('·').map(d => d.trim()).filter(Boolean);
                const alleKV = delen.every(d => { const ci = d.indexOf(':'); return ci > 0 && ci < d.length - 1; });
                if (alleKV) {
                  for (const d of delen) {
                    const ci = d.indexOf(':');
                    result.push({ type: 'rij', label: d.slice(0, ci).trim(), waarde: d.slice(ci + 1).trim(), note: null });
                  }
                  continue;
                }
                for (const d of delen) result.push({ type: 'vol', tekst: d });
                continue;
              }
              const ci = line.indexOf(':');
              if (ci > 0 && ci < line.length - 1) {
                result.push({ type: 'rij', label: line.slice(0, ci).replace(/\s+/g, ' ').trim(), waarde: line.slice(ci + 1).trim(), note: null });
                continue;
              }
              result.push({ type: 'vol', tekst: line });
            }
            return result;
          };
          const formuleRijen = vleugelformule ? parseVF(vleugelformule) : [];

          // Voeg scheidingskop in als beide blokken gevuld zijn
          const alleRijen = kennisRijen.length && formuleRijen.length
            ? [...kennisRijen, { type: 'kop', tekst: 'Formule' }, ...formuleRijen]
            : [...kennisRijen, ...formuleRijen];

          return (
            <div className="sd-vleugelformule">
              <span className="sd-label">Vleugelformule</span>
              <dl className="sd-pennen-grid sd-pennen-grid--vf">
                {alleRijen.map((r, i) => {
                  if (r.type === 'kop') return (
                    <div key={i} className="sd-pennen-rij sd-pennen-rij--kop">
                      <dt className="sd-pennen-koptekst">{r.tekst}</dt>
                    </div>
                  );
                  if (r.type === 'vol') return (
                    <div key={i} className="sd-pennen-rij sd-pennen-rij--vol">
                      <dt className="sd-pennen-voltekst">{r.tekst}</dt>
                    </div>
                  );
                  return (
                    <div key={i} className="sd-pennen-rij">
                      <dt className="sd-pennen-dt">{r.label}</dt>
                      <dd className="sd-pennen-dd">
                        <span className="sd-pennen-waarde">{r.waarde}</span>
                        {r.note && <span className="sd-pennen-note">{r.note}</span>}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })()}
        {soort.vangst_checklist?.length > 0 && (
          <div className="sd-vleugelformule">
            <span className="sd-label">Minimale vangstset</span>
            <dl className="sd-vangstset-grid">
              {soort.vangst_checklist.map((item, i) => (
                <div key={i} className="sd-vangstset-rij">
                  <dt className="sd-vangstset-dt">
                    <span className="sd-vangstset-icon">{item.type === 'meting' ? '📏' : '👁'}</span>
                    {item.label}
                  </dt>
                  <dd className="sd-vangstset-dd">
                    <span className="sd-vangstset-belang">
                      {[...Array(3)].map((_, b) => (
                        <span key={b} className={b < item.belang ? 'sd-vcl-dot sd-vcl-dot--aan' : 'sd-vcl-dot'} />
                      ))}
                    </span>
                    {item.note && <span className="sd-vangstset-note">{item.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {/* Zoönose-bemonsteringsprotocol */}
      {soortEuringCode && (
        <div className="sd-card">
          <ZoonosePanel euringCode={soortEuringCode} altijdTonen={true} />
        </div>
      )}

      {/* Namen + Biometrie naast elkaar */}
      <div className="sd-two-cards">
        <div className="sd-card">
          <h3 className="sd-card-title">{t('sd_names')}</h3>
          {EDITABLE_FIELDS.namen.map(f =>
            renderField(f.key, f.label, { italic: f.key === 'naam_lat' })
          )}
          {ondersoorten && (
            <>
              <div className="sd-section-divider" />
              <span className="sd-section-label">Ondersoorten</span>
              <BronBadge bron={soort.bron_ondersoorten} />
              <p className="sd-notities-text sd-notities-text--compact" dangerouslySetInnerHTML={{ __html: renderMarkdown(ondersoorten) }} />
            </>
          )}
          <div className="sd-section-divider" />
          <span className="sd-section-label">{t('sd_taxonomy')}</span>
          {EDITABLE_FIELDS.taxonomie.map(f =>
            renderField(f.key, f.label, { muted: true })
          )}
        </div>
        {hasBioData && (
          <div className="sd-card">
            <h3 className="sd-card-title">{t('sd_biometrics')}</h3>
            <div className="sd-bio-list">
              {BIO_FIELDS.map(b => {
                const minVal = getBioValue(b.key, 'min');
                const maxVal = getBioValue(b.key, 'max');
                const gRows = [
                  ['M',  '\u2642\uFE0E M',     ''],
                  ['F',  '\u2640\uFE0E V',     ''],
                  ['JM', '\u2642\uFE0E M 1kj', 'juv'],
                  ['JF', '\u2640\uFE0E V 1kj', 'juv'],
                ].map(([g, sym, cls]) => ({
                  g, sym, cls,
                  min: soort[`bio_${b.key}_${g}_min`],
                  max: soort[`bio_${b.key}_${g}_max`],
                  minKey: `bio_${b.key}_${g}_min`,
                })).filter(r => r.min || r.max);
                const recRange = b.refOnly ? null : bioRangesFromCatches[b.key];
                if (!minVal && !maxVal && gRows.length === 0 && !recRange) return null;
                return (
                  <div key={b.key} className="sd-bio-group">
                    <div className="sd-bio-group-label">
                      {b.label} <span className="sd-bio-unit">({b.unit})</span>
                    </div>
                    {(minVal || maxVal) && (
                      <div className="sd-bio-subrow">
                        <span className="sd-bio-subrow-cat">{t('sd_general_abbr')}</span>
                        <span className={bioCellCls(`bio_${b.key}_min`)}>
                          {fmtBio(minVal) || '—'} – {fmtBio(maxVal) || '—'}
                        </span>
                      </div>
                    )}
                    {gRows.map(({ g, sym, cls, min, max, minKey }) => (
                      <div key={g} className={`sd-bio-subrow sd-bio-subrow--${g.toLowerCase()}${cls ? ` sd-bio-subrow--${cls}` : ''}`}>
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
                    {t('sd_lit_data')}
                  </span>
                )}
                {hasUserBio && (
                  <span className="sd-bio-legend-item">
                    <span className="sd-bio-legend-dot sd-bio-legend-dot--user" />
                    {t('sd_user_data')}
                  </span>
                )}
                {BIO_FIELDS.some(b => bioRangesFromCatches[b.key]) && (
                  <span className="sd-bio-legend-item">
                    <span className="sd-bio-legend-dot sd-bio-legend-dot--rec" />
                    {t('sd_own_catches')}
                  </span>
                )}
              </div>
            )}
            {bronBiometrie && (
              <div className="sd-bio-bron"><BronBadge bron={bronBiometrie} /></div>
            )}
          </div>
        )}
      </div>

      {/* Nestgegevens + Determinatieboeken naast elkaar */}
      <div className="sd-two-cards">
        {(soort.nest_eileg && soort.nest_eileg !== 'maanden') && (
          <div className="sd-card">
            <h3 className="sd-card-title">{t('sd_nest_data')}</h3>
            {EDITABLE_FIELDS.nest.map(f =>
              renderField(f.key, f.label, { gender: f.gender })
            )}
          </div>
        )}
        {(soort.boeken && Object.keys(soort.boeken).length > 0) && (
          <div className="sd-card">
            <h3 className="sd-card-title">{t('sd_det_books')}</h3>
            {EDITABLE_FIELDS.boeken.map(f =>
              renderField(f.key, f.label)
            )}
          </div>
        )}
      </div>

      {/* Literatuur */}
      {(soort.referenties_literatuur?.length > 0) && (
        <div className="sd-card">
          <div className="sd-vangsten-header" onClick={() => setLiteratuurOpen(o => !o)}>
            <h3 className="sd-card-title sd-card-title--toggle">Literatuur</h3>
            <span className={`sd-vangsten-toggle${literatuurOpen ? ' sd-vangsten-toggle--open' : ''}`}>▼</span>
          </div>
          {literatuurOpen && (
            <ul className="sd-literatuur-list">
              {soort.referenties_literatuur.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Mijn vangsten — alleen voor ingelogde gebruikers */}
      {user && <div className="sd-card">
        <div className="sd-vangsten-header" onClick={() => setVangstenOpen(o => !o)}>
          <h3 className="sd-card-title sd-card-title--toggle">
            {t('sd_my_catches')}
            {soortRecords.length > 0 && (
              <span className="sd-vangsten-count">{soortRecords.length}</span>
            )}
          </h3>
          <span className={`sd-vangsten-toggle${vangstenOpen ? ' sd-vangsten-toggle--open' : ''}`}>▼</span>
        </div>
        {vangstenOpen && (soortRecords.length === 0 ? (
          <p className="sd-empty" style={{ marginTop: 10 }}>{t('sd_no_catches')}</p>
        ) : (
          <div className="sd-vangsten-content">
            <div className="sd-stats-row">
              <div className="sd-stat">
                <div className="sd-stat-value">{soortRecords.length}</div>
                <div className="sd-stat-label">{t('sd_total')}</div>
              </div>
              {tvCount > 0 && (
                <div className="sd-stat">
                  <div className="sd-stat-value sd-stat-value--tv">{tvCount}</div>
                  <div className="sd-stat-label">{t('sd_recap_abbr')}</div>
                </div>
              )}
              {Object.entries(genderStats).map(([g, count]) => (
                <div key={g} className="sd-stat">
                  <div className="sd-stat-value">{count}</div>
                  <div className="sd-stat-label">
                    {g === 'M' ? <><span className="sd-gender-icon--m">{'\u2642\uFE0E'}</span> M</> :
                     g === 'F' ? <><span className="sd-gender-icon--f">{'\u2640\uFE0E'}</span> V</> :
                     t('sd_unknown')}
                  </div>
                </div>
              ))}
            </div>

            {Object.keys(ageStats).length > 0 && (
              <div className="sd-age-section">
                <span className="sd-sub-title">{t('sd_age_dist')}</span>
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

            {bioExtremenEigen.length > 0 && (
              <div className="sd-bio-extremen">
                <span className="sd-sub-title">Extremen (excl. pulli)</span>
                <table className="sd-extremen-table">
                  <thead>
                    <tr>
                      <th>{t('sd_bio_meting')}</th>
                      <th>{t('sd_bio_max')}</th>
                      <th>{t('sd_bio_min')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bioExtremenEigen.map(({ key, min, max }) => {
                      const field = BIO_FIELDS.find(f => f.key === key);
                      if (!field) return null;
                      return (
                        <tr key={key}>
                          <td>{field.label}</td>
                          <td>
                            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{max.val} {field.unit}</span>
                            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>
                              {max.r.ringnummer?.replace(/\./g, '') || '—'} · {formatDatum(max.r.vangstdatum)}
                            </span>
                          </td>
                          <td>
                            {min.val !== max.val ? (
                              <>
                                <span style={{ fontWeight: 600 }}>{min.val} {field.unit}</span>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem' }}>
                                  {min.r.ringnummer?.replace(/\./g, '') || '—'} · {formatDatum(min.r.vangstdatum)}
                                </span>
                              </>
                            ) : <span style={{ color: 'var(--text-muted)' }}>= max</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <VangstKaart targetRecords={soortRecords} allRecords={records} />

            <div className="sd-recent-section">
              <span className="sd-sub-title">{t('sd_recent_catches')}</span>
              {[...soortRecords]
                .sort((a, b) => {
                  const dateA = toYMD(a.vangstdatum) || '';
                  const dateB = toYMD(b.vangstdatum) || '';
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
                  const type = getVangstType(r, nvByRing);
                  const cfg = TYPE_CFG[type];
                  return (
                    <div key={r.id} className="sd-recent-item">
                      <span className={`record-type ${cfg.cls}`}>{cfg.icon} {t(cfg.key)}</span>
                      <span
                        className="sd-recent-ring ring-link"
                        onClick={() => navigate('/ring/records', { state: { openId: r.id } })}
                      >{r.ringnummer?.replace(/\./g, '')}</span>
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
                onClick={() => navigate('/ring/records', { state: { filterSoort: decodedNaam } })}
              >
                {t('sd_all_catches', { count: soortRecords.length, naam: soort.naam_nl })}
              </button>
            </div>
          </div>
        ))}
      </div>}

      {/* Nesten — alleen voor ingelogde gebruikers */}
      {user && nestLegsels.length > 0 && (
        <div className="sd-card">
          <div className="sd-vangsten-header" onClick={() => setNestenOpen(o => !o)}>
            <h3 className="sd-card-title sd-card-title--toggle">
              {t('sd_nests')}
              <span className="sd-vangsten-count">{nestLegsels.length}</span>
            </h3>
            <span className={`sd-vangsten-toggle${nestenOpen ? ' sd-vangsten-toggle--open' : ''}`}>▼</span>
          </div>
          {nestenOpen && (
            <div className="sd-vangsten-content">
              {nestLegsels.map(({ legsel, nest, bezoeken: lb, ringen: lr }) => {
                const eersteBezoek = lb[0]?.datum;
                const laatste = lb.at(-1)?.datum;
                const succes = legsel.nestsucces;
                return (
                  <div key={legsel.id} className="sd-nest-item"
                    onClick={() => { if (switchModule) switchModule('nest'); navigate(`/nest/${nest.id}`); }}
                  >
                    <span className="sd-nest-kast">
                      <NestIcoon nest={nest} size={13} /> {nest.kastnummer}
                      {nest.omschrijving && <span className="sd-nest-omschrijving"> — {nest.omschrijving}</span>}
                    </span>
                    <span className="sd-nest-meta">
                      {legsel.jaar} · #{legsel.volgnummer}
                      {eersteBezoek && <> · {formatDatum(eersteBezoek)}{laatste && laatste !== eersteBezoek ? ` – ${formatDatum(laatste)}` : ''}</>}
                      {lr.length > 0 && <span className="sd-nest-ringen"> · {lr.length} geringd</span>}
                      {succes != null && succes >= 0 && <span className="sd-nest-succes"> · {succes} uitgevlogen</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

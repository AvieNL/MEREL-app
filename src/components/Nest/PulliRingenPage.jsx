import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRecords } from '../../hooks/useRecords';
import { useSettings } from '../../hooks/useSettings';
import { formatDatum } from '../../utils/nestPlanning';
import './PulliRingenPage.css';

const N_FRACTIE = {
  'N+': null, 'N0': 0.00, 'N1': 0.10, 'N2': 0.20, 'N3': 0.30,
  'N4': 0.45, 'N5': 0.60, 'N6': 0.75, 'N7': 0.90,
  'N9': 1.00, 'N10': 1.00, 'N11': 1.00,
};

function parseNestDagen(waarde, fallback = 18) {
  const n = parseInt(waarde, 10);
  return isNaN(n) ? fallback : n;
}

function berekenPullusLeeftijd(stadium, soort) {
  const fractie = N_FRACTIE[stadium];
  if (fractie === null || fractie === undefined) return null;
  const nestjong = parseNestDagen(soort?.nest_jong_dagen, 18);
  return Math.round(fractie * nestjong);
}

const LEEG_FORM = { ringnummer: '', geslacht: 'U', vleugel: '', gewicht: '', tarsus: '' };

export default function PulliRingenPage() {
  const { bezoekId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bezoeken, legsels, nesten, addNestring } = useNestData();
  const { addRecord } = useRecords();
  const { settings } = useSettings();
  const species = useSpeciesRef();

  const [form, setForm] = useState(LEEG_FORM);
  const [fouten, setFouten] = useState({});
  const [opgeslagen, setOpgeslagen] = useState([]);

  const bezoek = bezoeken.find(b => b.id === bezoekId);
  const legsel = bezoek ? legsels.find(l => l.id === bezoek.legsel_id) : null;
  const nest = legsel ? nesten.find(n => n.id === legsel.nest_id) : null;

  const soortEuring = bezoek?.soort_euring || legsel?.soort_euring || nest?.soort_euring || '';
  const soort = useMemo(
    () => species.find(s => s.euring_code === soortEuring) || null,
    [species, soortEuring]
  );

  const pullusLeeftijd = bezoek ? berekenPullusLeeftijd(bezoek.stadium, soort) : null;

  if (!bezoek || !legsel || !nest) {
    return (
      <div className="page">
        <button className="btn-secondary page-back" onClick={() => navigate(-1)}>{t('btn_back')}</button>
        <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>{t('nest_not_found')}</p>
      </div>
    );
  }

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (fouten[key]) setFouten(prev => ({ ...prev, [key]: false }));
  }

  async function handleOpslaan() {
    if (!form.ringnummer.trim()) {
      setFouten({ ringnummer: true });
      return;
    }

    const opmerkingen = `Nestkastonderzoek — kast ${nest.kastnummer}${nest.omschrijving ? ` ${nest.omschrijving}` : ''}`;

    const vangst = addRecord({
      vogelnaam: soort?.naam_nl || soortEuring,
      euring_code: soortEuring,
      vangstdatum: bezoek.datum,
      ringnummer: form.ringnummer.trim(),
      metalenringinfo: '2',
      leeftijd: '1',
      geslacht: form.geslacht || 'U',
      status: '-',
      conditie: '0',
      omstandigheden: '27',
      project: settings.nestProject || '',
      lat: nest.lat || '',
      lon: nest.lon || '',
      pul_leeftijd: pullusLeeftijd !== null ? String(pullusLeeftijd) : '99',
      nauwk_pul_leeftijd: pullusLeeftijd !== null ? 'E' : 'U',
      vleugel: form.vleugel || '',
      gewicht: form.gewicht || '',
      tarsus: form.tarsus || '',
      opmerkingen,
    });

    await addNestring({
      nestbezoek_id: bezoekId,
      vangst_id: vangst.id,
      ringnummer: form.ringnummer.trim(),
      centrale: 'NLA',
      leeftijd: 1,
      sexe: form.geslacht || 'U',
    });

    setOpgeslagen(prev => [...prev, { ...form, id: vangst.id }]);
    setForm(LEEG_FORM);
  }

  function handleKlaar() {
    navigate(`/nest/${nest.id}`);
  }

  const nestLabel = `⌂ ${nest.kastnummer}${nest.omschrijving ? ` — ${nest.omschrijving}` : ''}`;

  return (
    <div className="page pulli-ringen-page">
      <div className="nieuw-topbar">
        <button className="btn-secondary page-back" onClick={handleKlaar}>{t('btn_back')}</button>
        <span className="nieuw-topbar-titel">🔖 {t('pulli_ringen_titel')} — {nestLabel}</span>
      </div>

      {/* ── Context ── */}
      <div className="pulli-context">
        {soort?.naam_nl && (
          <div className="pulli-context__row">
            <span className="pulli-context__label">{t('pulli_soort')}</span>
            <span>{soort.naam_nl}</span>
          </div>
        )}
        <div className="pulli-context__row">
          <span className="pulli-context__label">{t('pulli_datum')}</span>
          <span>{formatDatum(bezoek.datum)}</span>
        </div>
        <div className="pulli-context__row">
          <span className="pulli-context__label">{t('pulli_stadium')}</span>
          <span>{bezoek.stadium}</span>
        </div>
        {pullusLeeftijd !== null && (
          <div className="pulli-context__row">
            <span className="pulli-context__label">{t('pulli_leeftijd')}</span>
            <span>~{pullusLeeftijd} {t('pulli_dagen')}</span>
          </div>
        )}
        {(nest.lat && nest.lon) && (
          <div className="pulli-context__row">
            <span className="pulli-context__label">{t('pulli_locatie')}</span>
            <span>{parseFloat(nest.lat).toFixed(5)}, {parseFloat(nest.lon).toFixed(5)}</span>
          </div>
        )}
        {settings.nestProject && (
          <div className="pulli-context__row">
            <span className="pulli-context__label">{t('pulli_project')}</span>
            <span>{settings.nestProject}</span>
          </div>
        )}
      </div>

      {/* ── Reeds geringd ── */}
      {opgeslagen.length > 0 && (
        <div className="pulli-opgeslagen">
          <p className="pulli-opgeslagen__titel">{t('pulli_geringd', { count: opgeslagen.length })}</p>
          {opgeslagen.map((p, i) => (
            <div key={p.id} className="pulli-opgeslagen__item">
              <span className="pulli-opgeslagen__nr">{i + 1}.</span>
              <span className="pulli-opgeslagen__ring">{p.ringnummer}</span>
              {p.geslacht && p.geslacht !== 'U' && <span className="pulli-opgeslagen__meta">{p.geslacht}</span>}
              {p.vleugel && <span className="pulli-opgeslagen__meta">{p.vleugel} mm</span>}
              {p.gewicht && <span className="pulli-opgeslagen__meta">{p.gewicht} g</span>}
              {p.tarsus && <span className="pulli-opgeslagen__meta">t: {p.tarsus} mm</span>}
            </div>
          ))}
        </div>
      )}

      {/* ── Invoerformulier ── */}
      <div className="pulli-form">
        <h3 className="pulli-form__titel">{t('pulli_nr', { nr: opgeslagen.length + 1 })}</h3>

        <div className={`form-group${fouten.ringnummer ? ' form-group--error' : ''}`}>
          <label>{t('pulli_ringnummer')} *</label>
          <input
            type="text"
            value={form.ringnummer}
            onChange={e => update('ringnummer', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleOpslaan()}
            placeholder="NLA 1234567"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label>{t('pulli_geslacht')}</label>
          <select value={form.geslacht} onChange={e => update('geslacht', e.target.value)}>
            <option value="U">{t('pulli_geslacht_u')}</option>
            <option value="M">{t('pulli_geslacht_m')}</option>
            <option value="F">{t('pulli_geslacht_f')}</option>
          </select>
        </div>

        <div className="pulli-biometrie">
          <div className="form-group">
            <label>{t('pulli_vleugel')}</label>
            <input type="number" step="0.5" value={form.vleugel} onChange={e => update('vleugel', e.target.value)} placeholder="0.0" />
          </div>
          <div className="form-group">
            <label>{t('pulli_gewicht')}</label>
            <input type="number" step="0.1" value={form.gewicht} onChange={e => update('gewicht', e.target.value)} placeholder="0.0" />
          </div>
          <div className="form-group">
            <label>{t('pulli_tarsus')}</label>
            <input type="number" step="0.1" value={form.tarsus} onChange={e => update('tarsus', e.target.value)} placeholder="0.0" />
          </div>
        </div>

        <div className="pulli-form__acties">
          <button className="btn-primary" onClick={handleOpslaan}>
            + {t('pulli_btn_volgende')}
          </button>
          <button className="btn-secondary" onClick={handleKlaar}>
            {opgeslagen.length > 0 ? t('pulli_btn_klaar', { count: opgeslagen.length }) : t('btn_cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}

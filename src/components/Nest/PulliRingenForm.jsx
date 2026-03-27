import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { formatDatum } from '../../utils/nestPlanning';

function normRing(r) { return String(r || '').replace(/[\s.]/g, '').toUpperCase(); }
import { useNestData } from '../../hooks/useNestData';
import { useSpeciesRef } from '../../hooks/useSpeciesRef';
import { useRecords } from '../../hooks/useRecords';
import { useSettings } from '../../hooks/useSettings';
import { useRingStrengen } from '../../hooks/useRingStrengen';
import { NAUWK_LEEFTIJD_OPTIONS } from '../Nieuw/NieuwPage.constants';
import { IconRing } from '../shared/Icons';
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

function kandidaatRingmaten(ringmaatStr) {
  if (!ringmaatStr) return [];
  return ringmaatStr
    .split('/')
    .map(s => s.trim().replace(/[♂♀].*$/, '').replace(/\s.*$/, '').trim())
    .filter(Boolean);
}

function huidigTijd() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

const LEEG_FORM = {
  ringnummer: '',
  geslacht: 'U',
  leeftijd: '',
  nauwk_pul_leeftijd: '2',
  vleugel: '',
  gewicht: '',
  tarsus: '',
  broedselgrootte: '',
  tijd: '',
};

export default function PulliRingenForm({ bezoekId }) {
  const { t } = useTranslation();
  const { bezoeken, legsels, nesten, addNestring, updateNestring } = useNestData();
  const bezoekRingen = useLiveQuery(
    () => db.nestring.where('nestbezoek_id').equals(bezoekId).toArray(),
    [bezoekId]
  ); // undefined = nog aan het laden
  const { addRecord, updateRecord, records } = useRecords();
  const { settings } = useSettings();
  const { ringStrengen, advanceHuidige } = useRingStrengen();
  const species = useSpeciesRef();

  const [form, setForm] = useState({ ...LEEG_FORM, tijd: huidigTijd() });
  const [fouten, setFouten] = useState({});
  const [opgeslagen, setOpgeslagen] = useState([]);
  const [klaar, setKlaar] = useState(false);
  const [bewerkId, setBewerkId] = useState(null);
  const [bewerkForm, setBewerkForm] = useState({});
  const geinitialiseerd = useRef(false);
  const lastSavedDatum = useRef(null);

  const bezoek = bezoeken.find(b => b.id === bezoekId);
  const legsel = bezoek ? legsels.find(l => l.id === bezoek.legsel_id) : null;
  const nest = legsel ? nesten.find(n => n.id === legsel.nest_id) : null;

  const soortEuring = bezoek?.soort_euring || legsel?.soort_euring || nest?.soort_euring || '';
  const soort = useMemo(
    () => species.find(s => s.euring_code === soortEuring) || null,
    [species, soortEuring]
  );

  const pullusLeeftijd = bezoek ? berekenPullusLeeftijd(bezoek.stadium, soort) : null;

  const passendeRingstreng = useMemo(() => {
    if (!soort?.ringmaat || !ringStrengen?.length) return null;
    const maten = kandidaatRingmaten(soort.ringmaat);
    return ringStrengen.find(r => maten.includes(r.ringmaat)) || null;
  }, [soort, ringStrengen]);

  useEffect(() => {
    if (passendeRingstreng?.huidige) {
      setForm(prev => prev.ringnummer ? prev : { ...prev, ringnummer: passendeRingstreng.huidige });
    }
  }, [passendeRingstreng?.huidige]);

  useEffect(() => {
    if (bezoek?.aantal_pulli != null) {
      setForm(prev => prev.broedselgrootte ? prev : {
        ...prev,
        broedselgrootte: String(bezoek.aantal_pulli),
      });
    }
  }, [bezoek?.aantal_pulli]);

  // Laad bestaande nestringen eenmalig via directe Dexie-lookup
  useEffect(() => {
    if (geinitialiseerd.current || bezoekRingen === undefined) return;
    geinitialiseerd.current = true;
    if (bezoekRingen.length === 0) return;

    Promise.all(bezoekRingen.map(async r => {
      const vangst = await db.vangsten.get(r.vangst_id);
      return {
        id: r.vangst_id,
        ringnummer: r.ringnummer,
        geslacht: r.sexe || 'U',
        vleugel: vangst?.vleugel || '',
        gewicht: vangst?.gewicht || '',
        tarsus: vangst?.tarsus_lengte || '',
      };
    })).then(geladen => {
      setOpgeslagen(geladen);
      setKlaar(true);
    });
  }, [bezoekRingen]);

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
    const plaatsnaam = nest.adres || `Nestkast ${nest.kastnummer}${nest.omschrijving ? ` ${nest.omschrijving}` : ''}`;
    const leeftijdBron = form.leeftijd !== '' ? parseInt(form.leeftijd, 10) : pullusLeeftijd;
    const leeftijdStr = leeftijdBron !== null && !isNaN(leeftijdBron) ? String(leeftijdBron).padStart(2, '0') : '99';
    const nauwkStr = form.nauwk_pul_leeftijd || 'U';
    const broedStr = form.broedselgrootte
      ? String(parseInt(form.broedselgrootte, 10)).padStart(2, '0')
      : '--';

    const vangst = addRecord({
      vogelnaam:          soort?.naam_nl || soortEuring,
      euring_code:        soortEuring,
      vangstdatum:        bezoek.datum,
      tijd:               form.tijd || huidigTijd(),
      ringnummer:         form.ringnummer.trim(),
      centrale:           'NLA',
      metalenringinfo:    '2',
      leeftijd:           '1',
      geslacht:           form.geslacht || 'U',
      status:             '-',
      conditie:           '8',
      omstandigheden:     '21',
      vangstmethode:      'N',
      project:            settings.nestProject || '',
      lat:                nest.lat || '',
      lon:                nest.lon || '',
      nauwk_coord:        '0',
      google_plaats:      plaatsnaam,
      ringer_nummer:      settings.ringerNummer || '',
      ringer_initiaal:    settings.ringerInitiaal || '',
      pul_leeftijd:       leeftijdStr,
      nauwk_pul_leeftijd: nauwkStr,
      broedselgrootte:    broedStr,
      vleugel:            form.vleugel || '',
      gewicht:            form.gewicht || '',
      tarsus_lengte:      form.tarsus || '',
      opmerkingen,
    });

    await addNestring({
      nestbezoek_id: bezoekId,
      vangst_id:     vangst.id,
      ringnummer:    form.ringnummer.trim(),
      centrale:      'NLA',
      leeftijd:      1,
      sexe:          form.geslacht || 'U',
    });

    if (passendeRingstreng) {
      advanceHuidige(passendeRingstreng.id);
    }

    setOpgeslagen(prev => [...prev, { ...form, id: vangst.id }]);

    const vandaag = new Date().toDateString();
    const tijdReset = lastSavedDatum.current !== vandaag ? huidigTijd() : form.tijd;
    lastSavedDatum.current = vandaag;

    setForm(prev => ({
      ...LEEG_FORM,
      ringnummer:         '',
      broedselgrootte:    prev.broedselgrootte,
      nauwk_pul_leeftijd: prev.nauwk_pul_leeftijd,
      tijd:               tijdReset,
    }));
  }

  const bestaandeMatch = useMemo(() => {
    const norm = normRing(form.ringnummer);
    if (norm.length < 5) return null;
    const match = records.find(r => normRing(r.ringnummer) === norm);
    if (!match) return null;
    if ((bezoekRingen ?? []).some(r => r.vangst_id === match.id)) return null;
    if (opgeslagen.some(p => p.id === match.id)) return null;
    return match;
  }, [form.ringnummer, records, bezoekRingen, opgeslagen]);

  async function handleKoppelen() {
    if (!bestaandeMatch) return;
    await addNestring({
      nestbezoek_id: bezoekId,
      vangst_id:     bestaandeMatch.id,
      ringnummer:    bestaandeMatch.ringnummer,
      centrale:      bestaandeMatch.centrale || 'NLA',
      leeftijd:      1,
      sexe:          bestaandeMatch.geslacht || 'U',
    });
    setOpgeslagen(prev => [...prev, {
      id:         bestaandeMatch.id,
      ringnummer: bestaandeMatch.ringnummer,
      geslacht:   bestaandeMatch.geslacht || 'U',
      vleugel:    bestaandeMatch.vleugel || '',
      gewicht:    bestaandeMatch.gewicht || '',
      tarsus:     bestaandeMatch.tarsus_lengte || '',
    }]);
    setForm(prev => ({
      ...LEEG_FORM,
      ringnummer:      '',
      broedselgrootte: prev.broedselgrootte,
      nauwk_pul_leeftijd: prev.nauwk_pul_leeftijd,
      tijd:            prev.tijd,
    }));
  }

  if (!bezoek || !legsel || !nest) return null;

  const gesorteerd = [...opgeslagen].sort((a, b) => a.ringnummer.localeCompare(b.ringnummer));

  function normDecimaal(s) { return String(s || '').replace(',', '.'); }

  async function handleBewerkOpslaan(p) {
    const nestring = (bezoekRingen ?? []).find(r => r.vangst_id === p.id);
    await updateRecord(p.id, {
      ringnummer:    bewerkForm.ringnummer.trim(),
      geslacht:      bewerkForm.geslacht,
      vleugel:       normDecimaal(bewerkForm.vleugel),
      gewicht:       normDecimaal(bewerkForm.gewicht),
      tarsus_lengte: normDecimaal(bewerkForm.tarsus),
    });
    if (nestring) {
      await updateNestring(nestring.id, {
        ringnummer: bewerkForm.ringnummer.trim(),
        sexe:       bewerkForm.geslacht,
      });
    }
    setOpgeslagen(prev => prev.map(x => x.id === p.id ? { ...x, ...bewerkForm, ringnummer: bewerkForm.ringnummer.trim() } : x));
    setBewerkId(null);
  }

  if (klaar) {
    return (
      <div className="pulli-ringen-inline">
        <div className="pulli-ringen-inline__header">
          <IconRing size={13} /> {t('pulli_geringd', { count: opgeslagen.length })}
        </div>
        {gesorteerd.map((p, i) => bewerkId === p.id ? (
          <div key={p.id} className="pulli-bewerk-item">
            <div className="pulli-bewerk-item__rij">
              <div className="form-group">
                <label>{t('pulli_ringnummer')}</label>
                <input type="text" value={bewerkForm.ringnummer}
                  onChange={e => setBewerkForm(prev => ({ ...prev, ringnummer: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t('pulli_geslacht')}</label>
                <select value={bewerkForm.geslacht} onChange={e => setBewerkForm(prev => ({ ...prev, geslacht: e.target.value }))}>
                  <option value="U">{t('pulli_geslacht_u')}</option>
                  <option value="M">{t('pulli_geslacht_m')}</option>
                  <option value="F">{t('pulli_geslacht_f')}</option>
                </select>
              </div>
            </div>
            <div className="pulli-bewerk-item__rij">
              <div className="form-group">
                <label>{t('pulli_vleugel')}</label>
                <input type="text" inputMode="decimal" value={bewerkForm.vleugel}
                  onChange={e => setBewerkForm(prev => ({ ...prev, vleugel: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t('pulli_gewicht')}</label>
                <input type="text" inputMode="decimal" value={bewerkForm.gewicht}
                  onChange={e => setBewerkForm(prev => ({ ...prev, gewicht: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>{t('pulli_tarsus')}</label>
                <input type="text" inputMode="decimal" value={bewerkForm.tarsus}
                  onChange={e => setBewerkForm(prev => ({ ...prev, tarsus: e.target.value }))} />
              </div>
            </div>
            <div className="pulli-bewerk-item__acties">
              <button type="button" className="btn-primary" onClick={() => handleBewerkOpslaan(p)}>{t('btn_save')}</button>
              <button type="button" className="btn-secondary" onClick={() => setBewerkId(null)}>{t('btn_cancel')}</button>
            </div>
          </div>
        ) : (
          <div key={p.id} className="pulli-opgeslagen__item pulli-opgeslagen__item--klikbaar"
            onClick={() => { setBewerkId(p.id); setBewerkForm({ ringnummer: p.ringnummer, geslacht: p.geslacht || 'U', vleugel: p.vleugel || '', gewicht: p.gewicht || '', tarsus: p.tarsus || '' }); }}>
            <span className="pulli-opgeslagen__nr">{i + 1}.</span>
            <span className="pulli-opgeslagen__ring">{p.ringnummer}</span>
            {p.geslacht && p.geslacht !== 'U' && <span className="pulli-opgeslagen__meta">{p.geslacht}</span>}
            {p.vleugel && <span className="pulli-opgeslagen__meta">{p.vleugel} mm</span>}
            {p.gewicht && <span className="pulli-opgeslagen__meta">{p.gewicht} g</span>}
            {p.tarsus && <span className="pulli-opgeslagen__meta">t: {p.tarsus} mm</span>}
            <span className="pulli-opgeslagen__edit-hint">✎</span>
          </div>
        ))}
        <button type="button" className="pulli-toevoegen-link" onClick={() => setKlaar(false)}>
          {t('pulli_btn_toevoegen')}
        </button>
      </div>
    );
  }

  return (
    <div className="pulli-ringen-inline">
      <div className="pulli-ringen-inline__header">
        <IconRing size={13} /> {t('pulli_ringen_titel')}
        {passendeRingstreng && (
          <span className="pulli-ringen-inline__streng">
            maat {passendeRingstreng.ringmaat} — {passendeRingstreng.huidige}
          </span>
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

        <div className="pulli-form__rij">
          <div className={`form-group${fouten.ringnummer ? ' form-group--error' : ''}`}>
            <label>{t('pulli_ringnummer')} *</label>
            <input
              type="text"
              value={form.ringnummer}
              onChange={e => update('ringnummer', e.target.value.replace(/\./g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleOpslaan()}
              placeholder="NLA 1234567"
            />
          </div>
          <div className="form-group">
            <label>{t('pulli_tijd')}</label>
            <input type="time" value={form.tijd} onChange={e => update('tijd', e.target.value)} />
          </div>
        </div>
        {bestaandeMatch && (
          <div className="pulli-match-suggestie">
            <span className="pulli-match-suggestie__tekst">
              {t('pulli_ring_bestaat')}: <strong>{bestaandeMatch.ringnummer}</strong>
              {bestaandeMatch.vogelnaam && ` · ${bestaandeMatch.vogelnaam}`}
              {bestaandeMatch.vangstdatum && ` · ${formatDatum(bestaandeMatch.vangstdatum)}`}
              {bestaandeMatch.google_plaats && ` · ${bestaandeMatch.google_plaats}`}
            </span>
            <button type="button" className="btn-primary pulli-match-suggestie__knop" onClick={handleKoppelen}>
              {t('pulli_koppelen')}
            </button>
          </div>
        )}

        <div className="pulli-form__rij">
          <div className="form-group">
            <label>{t('pulli_geslacht')}</label>
            <select value={form.geslacht} onChange={e => update('geslacht', e.target.value)}>
              <option value="U">{t('pulli_geslacht_u')}</option>
              <option value="M">{t('pulli_geslacht_m')}</option>
              <option value="F">{t('pulli_geslacht_f')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('pulli_leeftijd_invoer')}</label>
            <input
              type="number"
              min="0" max="99"
              value={form.leeftijd}
              onChange={e => update('leeftijd', e.target.value)}
              placeholder={pullusLeeftijd !== null ? `ca. ${pullusLeeftijd}` : '—'}
            />
          </div>
        </div>

        <div className="pulli-form__rij">
          <div className="form-group">
            <label>{t('pulli_nauwk_leeftijd')}</label>
            <select value={form.nauwk_pul_leeftijd} onChange={e => update('nauwk_pul_leeftijd', e.target.value)}>
              {NAUWK_LEEFTIJD_OPTIONS.filter(o => o.value !== '--').map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{t('pulli_broedselgrootte')}</label>
            <input
              type="number"
              min="1" max="20"
              value={form.broedselgrootte}
              onChange={e => update('broedselgrootte', e.target.value)}
              placeholder="—"
            />
          </div>
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
          <button className="btn-primary" type="button" onClick={handleOpslaan}>
            + {t('pulli_btn_volgende')}
          </button>
          <button className="btn-secondary" type="button" onClick={async () => {
            if (form.ringnummer.trim()) await handleOpslaan();
            setKlaar(true);
          }}>
            {(() => {
              const totaal = opgeslagen.length + (form.ringnummer.trim() ? 1 : 0);
              return totaal > 0 ? t('pulli_btn_klaar', { count: totaal }) : t('pulli_btn_klaar_leeg');
            })()}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './StadiumPicker.css';

// ── Categorie-definities ────────────────────────────────────────────────────
const CATEGORIEEN = [
  { id: 'leeg',       label: 'Leeg',       code: 'L0', kleur: '#64748b' },
  { id: 'bouw',       label: 'Nestbouw',   code: 'B',  kleur: '#f59e0b' },
  { id: 'eieren',     label: 'Eieren',     code: 'E',  kleur: '#a78bfa' },
  { id: 'jongen',     label: 'Jongen',     code: 'N',  kleur: '#38bdf8' },
  { id: 'nacontrole', label: 'Nacontrole', code: 'C',  kleur: '#22c55e' },
];

const BOUW_OPTIES = [
  { code: 'B0', label: 'Nest bezet' },
  { code: 'B1', label: 'Nestbouw' },
  { code: 'B2', label: 'Begin nestbouw' },
  { code: 'B3', label: 'Nest half klaar' },
  { code: 'B4', label: 'Nest bijna klaar' },
  { code: 'B5', label: 'Nest klaar incl. voering' },
];

const EIEREN_OPTIES = [
  { code: 'E0', label: 'Aantal onbekend' },
  { code: 'E1', label: 'Koud, onbebroed' },
  { code: 'E2', label: 'Warm' },
  { code: 'E3', label: 'Toegedekt' },
  { code: 'E4', label: 'Vers' },
  { code: 'E5', label: 'Bebroed' },
  { code: 'E6', label: 'Komen uit' },
  { code: 'E7', label: 'Jongen piepend in ei' },
];

const JONGEN_OPTIES = [
  { code: 'N+',  label: 'Aantal onbekend' },
  { code: 'N0',  label: 'Net uitgekomen' },
  { code: 'N1',  label: 'Naakt of in dons' },
  { code: 'N2',  label: 'Blind' },
  { code: 'N3',  label: 'Ogen open' },
  { code: 'N4',  label: 'Slagpennen in pin' },
  { code: 'N5',  label: 'Slagpennen uit bloedspoel' },
  { code: 'N6',  label: 'Slagpennen half volgroeid' },
  { code: 'N7',  label: 'Klaar om uit te vliegen' },
  { code: 'N9',  label: 'Uitgevlogen op controledag' },
  { code: 'N10', label: 'Pas uitgevl., amper vliegvaardig' },
  { code: 'N11', label: 'Pas uitgevl., vliegvaardig' },
];

const NACONTROLE_OPTIES = [
  { code: 'C1', label: 'Succesvol; eieren/dode jongen achtergebleven' },
  { code: 'C2', label: 'Succesvol; vliegvlugge jongen achtergebleven' },
  { code: 'C3', label: 'Succesvol; geheel leeg nest' },
  { code: 'C4', label: 'Succesvol; geen nacontrole' },
  { code: 'C5', label: 'Mislukt; nest leeg/vernield/verdwenen' },
  { code: 'C6', label: 'Mislukt; kapotte/verlaten eieren in nest' },
  { code: 'C7', label: 'Mislukt; alle jongen dood' },
  { code: 'C8', label: 'Nest niet teruggevonden' },
  { code: 'C9', label: 'Broedsucces onduidelijk' },
];

const OUDER_OPTIES = [
  { code: 'P0', label: 'Geen ouders aanwezig' },
  { code: 'P1', label: 'Één ouder aanwezig' },
  { code: 'P2', label: 'Beide ouders aanwezig' },
  { code: 'P3', label: 'Polygamie' },
  { code: 'P4', label: 'Ouder broedend' },
  { code: 'P5', label: 'Alarmerend paar aanwezig' },
  { code: 'P6', label: 'Geen alarmerend paar aanwezig' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
export function categorieVanCode(code) {
  if (!code) return null;
  if (code === 'L0') return 'leeg';
  if (code.startsWith('B')) return 'bouw';
  if (code.startsWith('E')) return 'eieren';
  if (code === 'N+' || code.startsWith('N')) return 'jongen';
  if (code.startsWith('C')) return 'nacontrole';
  return null;
}

/**
 * StadiumPicker — selectie van primair en optioneel secundair (ouders) stadium.
 *
 * Props:
 *   primair             {string}  SOVON-code voor het primaire stadium (L0, B*, E*, N*, C*)
 *   secundair           {string}  SOVON P-code voor ouderswaarneming (P0-P6) of ''
 *   onChangePrimair     {fn}      Callback (code) → void
 *   onChangeSecundair   {fn}      Callback (code) → void
 *   aantalEieren        {string}  Aantal eieren (apart van stadiumcode)
 *   onChangeAantalEieren{fn}      Callback (value) → void
 *   aantalPulli         {string}  Aantal pulli (apart van stadiumcode)
 *   onChangeAantalPulli {fn}      Callback (value) → void
 *   error               {bool}    Toon foutmarkering
 */
export default function StadiumPicker({
  primair, secundair,
  onChangePrimair, onChangeSecundair,
  aantalEieren, onChangeAantalEieren,
  aantalPulli, onChangeAantalPulli,
  error,
}) {
  const [openCat, setOpenCat] = useState(categorieVanCode(primair));
  const { t } = useTranslation();
  const toonOuders = openCat === 'eieren' || openCat === 'jongen';

  function kiesCategorie(catId) {
    setOpenCat(catId);
    if (catId === 'leeg') {
      onChangePrimair('L0');
    } else {
      // Wis sub-keuze zodat gebruiker opnieuw moet kiezen
      onChangePrimair('');
    }
    if (catId !== 'eieren' && catId !== 'jongen') {
      onChangeSecundair('');
    }
  }

  function kiestSubCode(code) {
    onChangePrimair(code);
  }

  return (
    <div className="stadium-picker">

      {/* ── Categorie-knoppen ── */}
      <div className="stadium-cat-rij">
        {CATEGORIEEN.map(cat => {
          const isActief = openCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`stadium-cat-knop${isActief ? ' stadium-cat-knop--actief' : ''}`}
              style={isActief ? { '--cat-kleur': cat.kleur } : {}}
              onClick={() => kiesCategorie(cat.id)}
            >
              {cat.label}
              <span className="stadium-cat-knop__code">{cat.code}</span>
            </button>
          );
        })}
      </div>

      {/* ── Sub-opties ── */}
      {openCat === 'bouw' && (
        <div className="stadium-sub">
          <span className="stadium-sub__label">Fase nestbouw</span>
          <div className="stadium-sub__knoppen">
            {BOUW_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {o.label}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {openCat === 'eieren' && (
        <div className="stadium-sub">
          <span className="stadium-sub__label">Stadium eieren</span>
          <div className="stadium-sub__knoppen stadium-sub__knoppen--compact">
            {EIEREN_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop stadium-sub__knop--getal${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {o.label}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
          <div className="stadium-sub stadium-sub--pulli-aantal">
            <span className="stadium-sub__label">Aantal eieren</span>
            <input
              type="number" min="0" max="25"
              className="stadium-pulli-input"
              value={aantalEieren}
              onChange={e => onChangeAantalEieren(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      )}

      {openCat === 'jongen' && (
        <div className="stadium-sub">
          <span className="stadium-sub__label">Ontwikkelingsstadium pulli</span>
          <div className="stadium-sub__knoppen stadium-sub__knoppen--compact">
            {JONGEN_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop stadium-sub__knop--getal${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {o.label}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
          <div className="stadium-sub stadium-sub--pulli-aantal">
            <span className="stadium-sub__label">Aantal pulli</span>
            <input
              type="number" min="0" max="25"
              className="stadium-pulli-input"
              value={aantalPulli}
              onChange={e => onChangeAantalPulli(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="stadium-sub stadium-sub--pulli-aantal">
            <span className="stadium-sub__label">Eieren ook aanwezig?</span>
            <input
              type="number" min="0" max="25"
              className="stadium-pulli-input"
              value={aantalEieren}
              onChange={e => onChangeAantalEieren(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      )}

      {openCat === 'nacontrole' && (
        <div className="stadium-sub">
          <span className="stadium-sub__label">Resultaat</span>
          <div className="stadium-sub__knoppen">
            {NACONTROLE_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {o.label}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Ouders (secundair, alleen bij E of N) ── */}
      {toonOuders && (
        <div className="stadium-sub stadium-sub--ouders">
          <span className="stadium-sub__label">Ouder(s) gezien?</span>
          <div className="stadium-sub__knoppen stadium-sub__knoppen--compact">
            <button type="button"
              className={`stadium-sub__knop${!secundair ? ' stadium-sub__knop--actief' : ''}`}
              onClick={() => onChangeSecundair('')}>
              Nee
            </button>
            {OUDER_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop${secundair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => onChangeSecundair(secundair === o.code ? '' : o.code)}>
                {o.label}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Foutindicator ── */}
      {error && <p className="stadium-fout">{t('nest_stadium_required')}</p>}
    </div>
  );
}

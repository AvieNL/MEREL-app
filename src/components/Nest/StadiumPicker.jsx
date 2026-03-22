import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './StadiumPicker.css';

// ── Categorie-definities ────────────────────────────────────────────────────
const CATEGORIEEN = [
  { id: 'leeg',       tKey: 'stad_cat_leeg',       code: 'L0', kleur: '#64748b' },
  { id: 'bouw',       tKey: 'stad_cat_bouw',        code: 'B',  kleur: '#f59e0b' },
  { id: 'eieren',     tKey: 'stad_cat_eieren',      code: 'E',  kleur: '#a78bfa' },
  { id: 'jongen',     tKey: 'stad_cat_jongen',      code: 'N',  kleur: '#38bdf8' },
  { id: 'nacontrole', tKey: 'stad_cat_nacontrole',  code: 'C',  kleur: '#22c55e' },
];

const BOUW_OPTIES = [
  { code: 'B0', tKey: 'stad_b0' },
  { code: 'B1', tKey: 'stad_b1' },
  { code: 'B2', tKey: 'stad_b2' },
  { code: 'B3', tKey: 'stad_b3' },
  { code: 'B4', tKey: 'stad_b4' },
  { code: 'B5', tKey: 'stad_b5' },
];

const EIEREN_OPTIES = [
  { code: 'E0', tKey: 'stad_e0' },
  { code: 'E1', tKey: 'stad_e1' },
  { code: 'E2', tKey: 'stad_e2' },
  { code: 'E3', tKey: 'stad_e3' },
  { code: 'E4', tKey: 'stad_e4' },
  { code: 'E5', tKey: 'stad_e5' },
  { code: 'E6', tKey: 'stad_e6' },
  { code: 'E7', tKey: 'stad_e7' },
];

const JONGEN_OPTIES = [
  { code: 'N+',  tKey: 'stad_nplus' },
  { code: 'N0',  tKey: 'stad_n0'  },
  { code: 'N1',  tKey: 'stad_n1'  },
  { code: 'N2',  tKey: 'stad_n2'  },
  { code: 'N3',  tKey: 'stad_n3'  },
  { code: 'N4',  tKey: 'stad_n4'  },
  { code: 'N5',  tKey: 'stad_n5'  },
  { code: 'N6',  tKey: 'stad_n6'  },
  { code: 'N7',  tKey: 'stad_n7'  },
  { code: 'N9',  tKey: 'stad_n9'  },
  { code: 'N10', tKey: 'stad_n10' },
  { code: 'N11', tKey: 'stad_n11' },
];

const NACONTROLE_OPTIES = [
  { code: 'C1', tKey: 'stad_c1' },
  { code: 'C2', tKey: 'stad_c2' },
  { code: 'C3', tKey: 'stad_c3' },
  { code: 'C4', tKey: 'stad_c4' },
  { code: 'C5', tKey: 'stad_c5' },
  { code: 'C6', tKey: 'stad_c6' },
  { code: 'C7', tKey: 'stad_c7' },
  { code: 'C8', tKey: 'stad_c8' },
  { code: 'C9', tKey: 'stad_c9' },
];

const OUDER_OPTIES = [
  { code: 'P0', tKey: 'stad_p0' },
  { code: 'P1', tKey: 'stad_p1' },
  { code: 'P2', tKey: 'stad_p2' },
  { code: 'P3', tKey: 'stad_p3' },
  { code: 'P4', tKey: 'stad_p4' },
  { code: 'P5', tKey: 'stad_p5' },
  { code: 'P6', tKey: 'stad_p6' },
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
              {t(cat.tKey)}
              <span className="stadium-cat-knop__code">{cat.code}</span>
            </button>
          );
        })}
      </div>

      {/* ── Sub-opties ── */}
      {openCat === 'bouw' && (
        <div className="stadium-sub">
          <span className="stadium-sub__label">{t('stad_lbl_fase_nestbouw')}</span>
          <div className="stadium-sub__knoppen">
            {BOUW_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {t(o.tKey)}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {openCat === 'eieren' && (
        <div className="stadium-sub">
          <span className="stadium-sub__label">{t('stad_lbl_stadium_eieren')}</span>
          <div className="stadium-sub__knoppen stadium-sub__knoppen--compact">
            {EIEREN_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop stadium-sub__knop--getal${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {t(o.tKey)}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
          <div className="stadium-sub stadium-sub--pulli-aantal">
            <span className="stadium-sub__label">{t('stad_lbl_aantal_eieren')}</span>
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
          <span className="stadium-sub__label">{t('stad_lbl_ontwikkeling_pulli')}</span>
          <div className="stadium-sub__knoppen stadium-sub__knoppen--compact">
            {JONGEN_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop stadium-sub__knop--getal${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {t(o.tKey)}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
          <div className="stadium-sub stadium-sub--pulli-aantal">
            <span className="stadium-sub__label">{t('stad_lbl_aantal_pulli')}</span>
            <input
              type="number" min="0" max="25"
              className="stadium-pulli-input"
              value={aantalPulli}
              onChange={e => onChangeAantalPulli(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="stadium-sub stadium-sub--pulli-aantal">
            <span className="stadium-sub__label">{t('stad_lbl_eieren_aanwezig')}</span>
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
          <span className="stadium-sub__label">{t('stad_lbl_resultaat')}</span>
          <div className="stadium-sub__knoppen">
            {NACONTROLE_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop${primair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => kiestSubCode(o.code)}>
                {t(o.tKey)}<span className="stadium-sub__code">{o.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Ouders (secundair, alleen bij E of N) ── */}
      {toonOuders && (
        <div className="stadium-sub stadium-sub--ouders">
          <span className="stadium-sub__label">{t('stad_lbl_ouders_gezien')}</span>
          <div className="stadium-sub__knoppen stadium-sub__knoppen--compact">
            <button type="button"
              className={`stadium-sub__knop${!secundair ? ' stadium-sub__knop--actief' : ''}`}
              onClick={() => onChangeSecundair('')}>
              {t('stad_lbl_nee')}
            </button>
            {OUDER_OPTIES.map(o => (
              <button key={o.code} type="button"
                className={`stadium-sub__knop${secundair === o.code ? ' stadium-sub__knop--actief' : ''}`}
                onClick={() => onChangeSecundair(secundair === o.code ? '' : o.code)}>
                {t(o.tKey)}<span className="stadium-sub__code">{o.code}</span>
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

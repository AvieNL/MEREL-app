import { ZOONOSE_DATA, ZOONOSE_SEIZOEN, NAALD_SPEC } from '../../data/zoonose';
import './ZoonosePanel.css';

// ── Iconen ────────────────────────────────────────────────────────────────────

const IconBloed = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M10 3L14 10a4 4 0 11-8 0L10 3z"/>
    <line x1="10" y1="9" x2="10" y2="13" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeLinecap="round"/>
  </svg>
);

const IconNaald = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="8" width="9" height="4" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="14" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="10" x2="3" y2="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="8" x2="8" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
    <line x1="11" y1="8" x2="11" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const IconSwab = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round">
    <line x1="10" y1="3" x2="10" y2="17" strokeWidth="1.5"/>
    <ellipse cx="10" cy="4" rx="3" ry="2" fill="currentColor" opacity="0.45" stroke="none"/>
    <ellipse cx="10" cy="16" rx="3" ry="2" fill="currentColor" opacity="0.45" stroke="none"/>
  </svg>
);

const IconTeken = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <ellipse cx="10" cy="11" rx="4" ry="5"/>
    <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" opacity="0.7"/>
    <line x1="6" y1="9"  x2="3" y2="7"/>
    <line x1="6" y1="11" x2="2" y2="11"/>
    <line x1="6" y1="13" x2="3" y2="15"/>
    <line x1="14" y1="9"  x2="17" y2="7"/>
    <line x1="14" y1="11" x2="18" y2="11"/>
    <line x1="14" y1="13" x2="17" y2="15"/>
  </svg>
);

const IconVeren = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 16C7 13 11 6 16 4C16 9 11 14 8 16"/>
    <line x1="8" y1="16" x2="16" y2="4"/>
    <line x1="11" y1="9"  x2="9"  y2="11" strokeWidth="0.8" opacity="0.5"/>
    <line x1="13" y1="7"  x2="11" y2="9"  strokeWidth="0.8" opacity="0.5"/>
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function bloeLabel(bloed) {
  const delen = [];
  if (bloed.serumbuis) delen.push('Serumbuis');
  if (bloed.fta) delen.push('FTA');
  return delen.join(' + ') || '—';
}

function swabLabel(swab) {
  const delen = [];
  if (swab.keel === true) delen.push('Keel');
  if (swab.keel === 'optioneel') delen.push('Keel*');
  if (swab.cloaca === true) delen.push('Cloaca');
  if (swab.cloaca === 'optioneel') delen.push('Cloaca*');
  return delen.join(' + ') || '—';
}

// ── Component ─────────────────────────────────────────────────────────────────

// altijdTonen=true: seizoensgate overgeslagen, panel toont het hele jaar (met seizoenslabel)
export default function ZoonosePanel({ euringCode, altijdTonen = false }) {
  const maand = new Date().getMonth() + 1;
  const inSeizoen = maand >= ZOONOSE_SEIZOEN.van && maand <= ZOONOSE_SEIZOEN.tot;
  if (!altijdTonen && !inSeizoen) return null;

  const key = euringCode ? String(parseInt(euringCode, 10)) : null;
  const info = key ? ZOONOSE_DATA[key] : null;
  if (!info) return null;

  const naaldSpec = NAALD_SPEC[info.naald] || {};
  const heeftOptSwab = info.swab.keel === 'optioneel' || info.swab.cloaca === 'optioneel';
  const panelClass = `zoonose-panel${altijdTonen ? ' zoonose-panel--detail' : ' zoonose-panel--form'}`;

  return (
    <div className={panelClass}>
      <div className="zoonose-header">
        <span className="zoonose-titel">Zoönose-onderzoek</span>
        <span className="zoonose-seizoen">
          {altijdTonen ? 'Bemonstering: 1 jul – 31 okt' : (inSeizoen ? '⬤ actief' : '1 jul – 31 okt')}
        </span>
        <div className="zoonose-groepen">
          {info.groepen.map(g => (
            <span key={g} className="zoonose-groep">Gr. {g}</span>
          ))}
        </div>
      </div>

      <div className="zoonose-items">

        <div className="zoonose-item">
          <span className="zoonose-icon"><IconBloed /></span>
          <span className="zoonose-item-label">Bloed</span>
          <span className="zoonose-item-value">{bloeLabel(info.bloed)}</span>
        </div>

        <div className="zoonose-item">
          <span className="zoonose-icon"><IconNaald /></span>
          <span className="zoonose-item-label">Naald</span>
          <span className="zoonose-item-value">
            {info.naald} mm
            {naaldSpec.kleur && (
              <span className="zoonose-naald-dot" style={{ background: naaldSpec.kleur }} title={naaldSpec.naam} />
            )}
          </span>
        </div>

        <div className="zoonose-item">
          <span className="zoonose-icon"><IconSwab /></span>
          <span className="zoonose-item-label">Swab</span>
          <span className="zoonose-item-value">{swabLabel(info.swab)}</span>
        </div>

        <div className="zoonose-item">
          <span className="zoonose-icon"><IconTeken /></span>
          <span className="zoonose-item-label">Teken</span>
          <span className="zoonose-item-value">{info.teken ? 'Ja' : '—'}</span>
        </div>

        <div className="zoonose-item">
          <span className="zoonose-icon"><IconVeren /></span>
          <span className="zoonose-item-label">Veren</span>
          <span className="zoonose-item-value">{info.veren ? 'Ja' : '—'}</span>
        </div>

      </div>

      {heeftOptSwab && (
        <p className="zoonose-voetnoot">* = optioneel</p>
      )}
    </div>
  );
}

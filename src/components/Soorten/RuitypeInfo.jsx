/**
 * Gedeelde component: toont ruikalender + seizoensomschrijving voor ruitype A/B/C/D.
 * Wordt gebruikt in SoortDetail (soortkaart) én in NieuwPage (invoerformulier).
 * Seizoensteksten komen uit useRuitypen (admin-bewerkbaar).
 */
import { useRuitypen } from '../../hooks/useRuitypen';
import './RuitypeInfo.css';

const MAANDEN = ['Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec','Jan','Feb','Mrt','Apr'];

function Kalender({ juv, ad }) {
  return (
    <div className="rui-kalender">
      <KalRij label="Juv." segmenten={juv} />
      <div className="rui-kal-maanden">
        {MAANDEN.map((m, i) => (
          <span
            key={m}
            className={`rui-kal-maand${m === 'Dec' ? ' rui-kal-maand--dec' : ''}${m === 'Jan' ? ' rui-kal-maand--jan' : ''}`}
          >{m}</span>
        ))}
      </div>
      <KalRij label="Ad." segmenten={ad} />
    </div>
  );
}

function KalRij({ label, segmenten }) {
  return (
    <div className="rui-kal-rij">
      <span className="rui-kal-zijlabel">{label}</span>
      <div className="rui-kal-balk">
        {segmenten.map(({ type, span, tekst }, i) => (
          <div key={i} className={`rui-kal-seg rui-kal-seg--${type}`} style={{ gridColumn: `span ${span}` }}>
            {tekst}
          </div>
        ))}
      </div>
    </div>
  );
}

function Seizoenen({ items }) {
  return (
    <div className="rui-tekst">
      {items.map(({ seizoen, opties, separator }, i) => (
        <div key={i} className={`rui-groep${separator ? ' rui-groep--separator' : ''}`}>
          <span className="rui-seizoen">{seizoen}</span>
          <div className="rui-opties">
            {opties.map(({ cond, val }, j) => (
              <div key={j} className="rui-optie">
                {cond && <span className="rui-cond">{cond}</span>}
                <span className="rui-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Kalender-configuraties (hardcoded — visuele indeling) ─────────────────
const KALENDARS = {
  A: {
    juv: [
      { type: 'pull', span: 1, tekst: 'pull.' },
      { type: 'juv',  span: 2, tekst: 'juv' },
      { type: 'rui',  span: 2, tekst: 'complete rui' },
      { type: 'vol',  span: 3, tekst: 'volgroeid' },
      { type: 'akj',  span: 4, tekst: 'na 1 kj' },
    ],
    ad: [
      { type: 'vol', span: 3, tekst: 'volgroeid' },
      { type: 'rui', span: 2, tekst: 'complete rui' },
      { type: 'vol', span: 3, tekst: 'volgroeid' },
      { type: 'akj', span: 4, tekst: 'na 1 kj' },
    ],
  },
  B: {
    juv: [
      { type: 'pull', span: 1, tekst: 'pull.' },
      { type: 'juv',  span: 2, tekst: 'juv' },
      { type: 'rui',  span: 2, tekst: 'part. rui' },
      { type: 'vol',  span: 3, tekst: '1 kj' },
      { type: 'akj',  span: 4, tekst: '2 kj' },
    ],
    ad: [
      { type: 'vol', span: 3, tekst: '2kj / na 2kj' },
      { type: 'rui', span: 2, tekst: 'complete rui' },
      { type: 'akj', span: 3, tekst: 'na 1 kj' },
      { type: 'akj', span: 4, tekst: 'na 2 kj' },
    ],
  },
  C: {
    juv: [
      { type: 'pull', span: 1, tekst: 'pull.' },
      { type: 'juv',  span: 2, tekst: 'juv' },
      { type: 'rui',  span: 2, tekst: 'part. rui' },
      { type: 'vol',  span: 3, tekst: '1 kj' },
      { type: 'rui',  span: 1, tekst: 'p.r.' },
      { type: 'vol',  span: 3, tekst: '2 kj' },
    ],
    ad: [
      { type: 'vol', span: 3, tekst: '2kj / na 2kj' },
      { type: 'rui', span: 2, tekst: 'complete rui' },
      { type: 'akj', span: 3, tekst: 'na 1 kj' },
      { type: 'rui', span: 1, tekst: 'p.r.' },
      { type: 'akj', span: 3, tekst: 'na 2 kj' },
    ],
  },
  D: {
    juv: [
      { type: 'pull', span: 1, tekst: 'pull.' },
      { type: 'juv',  span: 2, tekst: 'juv' },
      { type: 'rui',  span: 2, tekst: 'part. rui' },
      { type: 'vol',  span: 3, tekst: '1 kj' },
      { type: 'rui',  span: 1, tekst: 'c.r.' },
      { type: 'akj',  span: 3, tekst: 'na 1 kj' },
    ],
    ad: [
      { type: 'vol', span: 3, tekst: 'volgroeid' },
      { type: 'rui', span: 2, tekst: 'complete rui' },
      { type: 'akj', span: 3, tekst: 'na 1 kj' },
      { type: 'rui', span: 1, tekst: 'c.r.' },
      { type: 'akj', span: 3, tekst: 'na 1 kj' },
    ],
  },
};

// ─── Hoofd-export ──────────────────────────────────────────────────────────
export default function RuitypeInfo({ ruitype }) {
  const config = useRuitypen();
  const kal = KALENDARS[ruitype];
  const seizoen = config[ruitype];
  if (!kal || !seizoen) return null;

  return (
    <div className="rui-blok">
      <Kalender juv={kal.juv} ad={kal.ad} />
      <Seizoenen items={[
        { seizoen: 'Voorjaar', opties: seizoen.voorjaar },
        { seizoen: 'Najaar',   opties: seizoen.najaar, separator: true },
      ]} />
    </div>
  );
}

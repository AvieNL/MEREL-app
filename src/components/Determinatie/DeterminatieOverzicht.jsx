import './Determinatie.css';

/**
 * Rendert het overzicht-veld van een aid als uitgeschreven beslisboom.
 * Elk item heeft: conditie, resultaat?, zeker?, info?, sub?[]
 */
function OverzichtRegel({ item, diepte = 0 }) {
  const isInfo = item.info;

  return (
    <li className={`det-ov-item det-ov-item--d${Math.min(diepte, 3)}${isInfo ? ' det-ov-item--info' : ''}`}>
      <div className="det-ov-regel">
        {!isInfo && <span className="det-ov-pijl">{'›'}</span>}
        <span className="det-ov-conditie">{item.conditie}</span>
        {item.resultaat && (
          <>
            <span className="det-ov-sep">→</span>
            <span className={`det-ov-resultaat${item.zeker ? ' det-ov-resultaat--zeker' : ''}`}>
              {item.resultaat}
              {item.zeker && <span className="det-ov-zeker-badge">zeker</span>}
            </span>
          </>
        )}
      </div>
      {item.sub?.length > 0 && (
        <ul className="det-ov-sub">
          {item.sub.map((sub, i) => (
            <OverzichtRegel key={i} item={sub} diepte={diepte + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DeterminatieOverzicht({ aid }) {
  if (!aid.overzicht?.length) return null;

  return (
    <div className="det-ov">
      <ul className="det-ov-lijst">
        {aid.overzicht.map((item, i) => (
          <OverzichtRegel key={i} item={item} diepte={0} />
        ))}
      </ul>
    </div>
  );
}

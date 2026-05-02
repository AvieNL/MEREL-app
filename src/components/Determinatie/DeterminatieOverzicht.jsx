import { useState } from 'react';
import './Determinatie.css';

function FlowRegel({ item }) {
  return (
    <div className="fc-item">
      <div className="fc-row">
        <div className={`fc-box${item.info ? ' fc-box--info' : ''}`}>
          {item.conditie}
        </div>
        {item.resultaat && (
          <div className={`fc-uitkomst${item.zeker ? ' fc-uitkomst--zeker' : ''}`}>
            <span className="fc-pijl">→</span>
            <span className="fc-uitkomst-label">{item.resultaat}</span>
            {item.zeker && <span className="fc-zeker-chip">zeker</span>}
          </div>
        )}
      </div>
      {item.sub?.length > 0 && (
        <div className="fc-tak">
          {item.sub.map((sub, i) => (
            <FlowRegel key={i} item={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeterminatieOverzicht({ aid }) {
  const [open, setOpen] = useState(false);

  if (!aid.overzicht?.length) return null;

  return (
    <div className="det-ov">
      <button type="button" className="det-ov-toggle" onClick={() => setOpen(o => !o)}>
        <span className={`det-ov-toggle__pijl${open ? ' det-ov-toggle__pijl--open' : ''}`}>▾</span>
        {open ? 'Verberg schema' : 'Toon schema'}
      </button>
      {open && (
        <div className="fc-tree">
          {aid.overzicht.map((item, i) => (
            <FlowRegel key={i} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

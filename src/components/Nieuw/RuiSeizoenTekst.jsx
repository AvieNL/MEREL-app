// Renders de seizoensteksten vanuit de admin-configureerbare ruitype-config
export default function RuiSeizoenTekst({ type, config }) {
  const seizoen = config?.[type];
  if (!seizoen) return null;
  return (
    <div className="ruitype-kal-tekst">
      <div className="ruitype-groep">
        <span className="ruitype-seizoen">Voorjaar</span>
        <div className="ruitype-opties">
          {seizoen.voorjaar.map((o, i) => (
            <div key={i} className="ruitype-optie">
              {o.cond && <span className="ruitype-cond">{o.cond}</span>}
              <span className="ruitype-val">{o.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="ruitype-groep ruitype-groep--separator">
        <span className="ruitype-seizoen">Najaar</span>
        <div className="ruitype-opties">
          {seizoen.najaar.map((o, i) => (
            <div key={i} className="ruitype-optie">
              {o.cond && <span className="ruitype-cond">{o.cond}</span>}
              <span className="ruitype-val">{o.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

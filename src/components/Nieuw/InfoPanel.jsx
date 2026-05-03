import { renderMarkdown, renderLeeftijdActueel } from '../../utils/textHelper';

// Inline informatieblok onder een veld — toont soortspecifieke determinatieinfo.
// Tekst met {{MM-MM}} markers (samengevoegd leeftijdformaat) wordt gefilterd op
// het huidige ±21-dagenvenster en toont alleen momenteel relevante blokken.
export default function InfoPanel({ items }) {
  // Verwerk items: merged-formaat samenvoegen tot één "Nu relevant" item
  const verwerkt = (() => {
    const merged = items.filter(it => it.text?.includes('{{'));
    const overig  = items.filter(it => !it.text?.includes('{{'));

    if (!merged.length) return overig;

    // Alle merged-teksten samenvoegen en filteren op actueel
    const gecombineerd = merged.map(it => it.text).join('\n\n');
    const html = renderLeeftijdActueel(gecombineerd);
    if (!html) return overig;          // niets actueel — overige items gewoon tonen
    return [{ label: 'Nu relevant', _html: html }, ...overig];
  })();

  const hasContent = verwerkt.some(it => it.text?.trim() || it._html);
  if (!hasContent) return null;

  return (
    <div className="info-panel">
      {verwerkt.map((it, i) => {
        if (it._html) {
          return (
            <div key={i} className="info-panel-item">
              <span className="info-panel-label">{it.label}</span>
              <span dangerouslySetInnerHTML={{ __html: it._html }} />
            </div>
          );
        }
        return it.text?.trim() ? (
          <div key={i} className="info-panel-item">
            {it.label && <span className="info-panel-label">{it.label}</span>}
            <span dangerouslySetInnerHTML={{ __html: renderMarkdown(it.text) }} />
          </div>
        ) : null;
      })}
    </div>
  );
}

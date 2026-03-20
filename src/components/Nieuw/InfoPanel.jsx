import { renderMarkdown } from '../../utils/textHelper';

// Inline informatieblok onder een veld — toont soortspecifieke determinatieinfo
export default function InfoPanel({ items }) {
  const hasContent = items.some(it => it.text?.trim());
  if (!hasContent) return null;

  return (
    <div className="info-panel">
      {items.map((it, i) => it.text?.trim() ? (
        <div key={i} className="info-panel-item">
          {it.label && <span className="info-panel-label">{it.label}</span>}
          <span dangerouslySetInnerHTML={{ __html: renderMarkdown(it.text) }} />
        </div>
      ) : null)}
    </div>
  );
}

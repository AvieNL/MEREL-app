import DOMPurify from 'dompurify';

// Eenvoudige markdown-renderer: **bold**, *italic*, _underline_, [tekst](url)
export function renderMarkdown(text) {
  if (!text) return '';
  const html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gs, '<em>$1</em>')
    .replace(/_(.*?)_/gs, '<u>$1</u>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
    // Extra witregel vóór seizoenskoppen (Voorjaar/Najaar) die niet aan het begin staan
    .replace(/([^\n])\n(Voorjaar|Najaar)/g, '$1\n\n$2')
    .replace(/\n/g, '<br>');
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'u', 'br', 'a'],
    ALLOWED_ATTR: ['href', 'class'],
  });
}

// Renderer voor leeftijdsbepalingsteksten met {{MM-MM}} maandmarkeringen.
// Blokken gescheiden door dubbele newline. Relevante blokken (huidige datum ± 21 dagen)
// krijgen class 'leeftijd-blok--actueel'.
// seizoen: 'vj' (jan–jun) | 'nj' (jul–dec) | null (alles tonen)
export function renderLeeftijdMarkdown(text, seizoen = null) {
  if (!text) return '';

  const BUFFER_DAYS = 21;
  const now = new Date();
  const winStart = new Date(now);
  winStart.setDate(winStart.getDate() - BUFFER_DAYS);
  const winEnd = new Date(now);
  winEnd.setDate(winEnd.getDate() + BUFFER_DAYS);

  const MAANDEN = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const MARKER_RE = /^\{\{(\d{2})-(\d{2})\}\}\n?/;

  const blocks = text.split(/\n\n+/);

  const parts = blocks.flatMap(block => {
    const match = block.match(MARKER_RE);
    const content = match ? block.replace(MARKER_RE, '') : block;

    // Seizoensfilter: sla blok over als het niet overlapt met het geselecteerde seizoen
    if (match && seizoen) {
      const sm = parseInt(match[1], 10);
      const em = parseInt(match[2], 10);
      if (!blokOverlapt(sm, em, seizoen)) return [];
    }

    const inner = content
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gs, '<em>$1</em>')
      .replace(/_(.*?)_/gs, '<u>$1</u>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="md-link">$1</a>')
      .replace(/\n/g, '<br>');

    let cls = 'leeftijd-blok';
    let maandLabel = '';
    if (match) {
      const sm = parseInt(match[1], 10);
      const em = parseInt(match[2], 10);
      if (maandRelevant(sm, em, winStart, winEnd)) cls += ' leeftijd-blok--actueel';
      const isAltijd = sm === 1 && em === 12;
      maandLabel = isAltijd
        ? '<span class="leeftijd-maand">altijd</span>'
        : `<span class="leeftijd-maand">${MAANDEN[sm - 1]}–${MAANDEN[em - 1]}</span>`;
    }

    return [`<div class="${cls}">${maandLabel}${inner}</div>`];
  });

  return DOMPurify.sanitize(parts.join(''), {
    ALLOWED_TAGS: ['div', 'span', 'strong', 'em', 'u', 'br', 'a'],
    ALLOWED_ATTR: ['class', 'href'],
  });
}

// Controleer of een blok overlapt met het opgegeven seizoen.
// seizoen: 'vj' = maanden 1–6, 'nj' = maanden 7–12
function blokOverlapt(sm, em, seizoen) {
  const [sS, sE] = seizoen === 'vj' ? [1, 6] : [7, 12];
  if (sm <= em) {
    // Zelfde-jaar bereik
    return sm <= sE && em >= sS;
  } else {
    // Cross-jaar bereik (bijv. 07-04): splits in [sm–12] en [1–em]
    return (sm <= sE && 12 >= sS) || (1 <= sE && em >= sS);
  }
}

// Controleer of het huidige venster (winStart–winEnd) overlapt met het maandbereik.
// Cross-jaar bereiken (bijv. 07-04 = juli t/m april) worden ondersteund.
function maandRelevant(startM, endM, winStart, winEnd) {
  const y = winStart.getFullYear();

  if (startM <= endM) {
    // Zelfde-jaar bereik, bijv. 06-12
    const rS = new Date(y, startM - 1, 1);
    const rE = new Date(y, endM, 0); // laatste dag van endM
    return winStart <= rE && winEnd >= rS;
  } else {
    // Cross-jaar bereik, bijv. 07-04 (jul t/m apr)
    // Twee segmenten: [startM–dec dit jaar] en [jan–endM dit jaar]
    const s1 = new Date(y, startM - 1, 1);
    const e1 = new Date(y, 11, 31);
    const s2 = new Date(y, 0, 1);
    const e2 = new Date(y, endM, 0);
    return (winStart <= e1 && winEnd >= s1) ||
           (winStart <= e2 && winEnd >= s2);
  }
}

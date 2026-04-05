import DOMPurify from 'dompurify';

// Eenvoudige markdown-renderer: **bold**, *italic*, _underline_
export function renderMarkdown(text) {
  if (!text) return '';
  const html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/gs, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gs, '<em>$1</em>')
    .replace(/_(.*?)_/gs, '<u>$1</u>')
    // Extra witregel vóór seizoenskoppen (Voorjaar/Najaar) die niet aan het begin staan
    .replace(/([^\n])\n(Voorjaar|Najaar)/g, '$1\n\n$2')
    .replace(/\n/g, '<br>');
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: ['strong', 'em', 'u', 'br'] });
}

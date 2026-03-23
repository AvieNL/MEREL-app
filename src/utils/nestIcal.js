/**
 * iCal-export voor nestkastplanning.
 * Genereert een .ics bestand dat geïmporteerd of geabonneerd
 * kan worden in Apple Agenda, Google Calendar, Outlook etc.
 */

const TYPE_LABEL = {
  ringen:     'Ringen',
  nacontrole: 'Nacontrole',
  eileg:      'Eileg verwacht',
  jongen:     'Jongen verwacht',
  bouw:       'Nestbouw verwacht',
  check:      'Nestbezoek',
};

function icalDatum(iso) {
  return iso.replace(/-/g, '');
}

function icalDatumPlusEen(iso) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function icalEscape(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function fold(line) {
  // iCal-lijnen max 75 tekens; vervolg met CRLF + spatie
  const out = [];
  while (line.length > 75) {
    out.push(line.slice(0, 75));
    line = ' ' + line.slice(75);
  }
  out.push(line);
  return out.join('\r\n');
}

export function buildIcalContent(items) {
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WREN//Nestkastplanning//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Nestkastplanning WREN',
    'X-WR-CALDESC:Geplande nestbezoeken — WREN',
    'X-WR-TIMEZONE:Europe/Amsterdam',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
  ].join('\r\n');

  const events = items.map(item => {
    const type    = TYPE_LABEL[item.type] ?? 'Nestbezoek';
    const summary = [type, `kast ${item.kastnummer}`, item.soortNaam]
      .filter(Boolean).join(' — ');

    const descLines = [
      `Kast: ${item.kastnummer}`,
      item.omschrijving ? `Locatie: ${item.omschrijving}` : null,
      item.soortNaam    ? `Soort: ${item.soortNaam}`      : null,
      `Type: ${type}`,
      `Urgentie: ${item.urgentie}`,
    ].filter(Boolean).join('\n');

    return [
      'BEGIN:VEVENT',
      fold(`UID:vrs-nest-${item.legselId}-${item.datum}@vrs-breedenbroek.nl`),
      fold(`DTSTAMP:${now}`),
      fold(`DTSTART;VALUE=DATE:${icalDatum(item.datum)}`),
      fold(`DTEND;VALUE=DATE:${icalDatumPlusEen(item.datum)}`),
      fold(`SUMMARY:${icalEscape(summary)}`),
      fold(`DESCRIPTION:${icalEscape(descLines)}`),
      'STATUS:TENTATIVE',
      'END:VEVENT',
    ].join('\r\n');
  });

  return [header, ...events, 'END:VCALENDAR'].join('\r\n');
}

export function downloadNestIcal(items) {
  const content = buildIcalContent(items);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'nestkastplanning.ics';
  a.click();
  URL.revokeObjectURL(url);
}

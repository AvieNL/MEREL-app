/**
 * Edge Function: nest-ical
 * Genereert een live iCal-feed voor nestkastplanning.
 *
 * GET /functions/v1/nest-ical?token=<ical_token>
 * Retourneert een .ics bestand dat te abonneren is in Apple Agenda,
 * Google Calendar, Outlook etc.
 *
 * Beveiliging: token wordt gematcht tegen profiles.ical_token (UUID).
 * Niemand zonder het token kan de feed lezen.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')      ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const TYPE_LABEL: Record<string, string> = {
  ringen:     'Ringen',
  nacontrole: 'Nacontrole',
  eileg:      'Eileg verwacht',
  jongen:     'Jongen verwacht',
  bouw:       'Nestbouw verwacht',
  check:      'Nestbezoek',
};

const URGENTIE_LABEL: Record<string, string> = {
  verlopen:   'Verlopen',
  dringend:   'Dringend',
  binnenkort: 'Binnenkort',
  gepland:    'Gepland',
};

function icalDatum(iso: string) {
  return iso.replace(/-/g, '');
}

function icalDatumPlusEen(iso: string) {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

function icalEscape(str: string) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function fold(line: string): string {
  const out: string[] = [];
  while (line.length > 75) {
    out.push(line.slice(0, 75));
    line = ' ' + line.slice(75);
  }
  out.push(line);
  return out.join('\r\n');
}

interface PlanningItem {
  legselId:    string;
  kastnummer:  string;
  omschrijving: string;
  soortNaam:   string;
  datum:       string;
  type:        string | null;
  urgentie:    string;
}

function buildIcal(items: PlanningItem[]): string {
  const now = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VRS Breedenbroek//Nestkastplanning//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Nestkastplanning VRS',
    'X-WR-CALDESC:Geplande nestbezoeken VRS Breedenbroek',
    'X-WR-TIMEZONE:Europe/Amsterdam',
    'REFRESH-INTERVAL;VALUE=DURATION:PT6H',
    'X-PUBLISHED-TTL:PT6H',
  ].join('\r\n');

  const events = items.map(item => {
    const typeLabel    = TYPE_LABEL[item.type ?? ''] ?? 'Nestbezoek';
    const urgentieLabel = URGENTIE_LABEL[item.urgentie] ?? item.urgentie;
    const summary      = [typeLabel, `kast ${item.kastnummer}`, item.soortNaam]
      .filter(Boolean).join(' — ');

    const descLines = [
      `Kast: ${item.kastnummer}`,
      item.omschrijving ? `Locatie: ${item.omschrijving}` : null,
      item.soortNaam    ? `Soort: ${item.soortNaam}`      : null,
      `Type: ${typeLabel}`,
      `Urgentie: ${urgentieLabel}`,
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

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const url   = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response('token ontbreekt', { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Token opzoeken in profiles
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('ical_token', token)
    .maybeSingle();

  if (profileErr || !profile) {
    return new Response('Ongeldig token', { status: 401 });
  }

  const userId = profile.id;
  const jaar   = new Date().getFullYear();

  // Data ophalen
  const [nestenRes, legselsRes, bezoekenRes] = await Promise.all([
    supabase.from('nest').select('id, kastnummer, omschrijving').eq('aangemaakt_door', userId),
    supabase.from('legsel').select('id, nest_id, jaar, soort_euring').eq('aangemaakt_door', userId).eq('jaar', jaar),
    supabase.from('nestbezoek').select('id, legsel_id, datum, soort_euring, volgende_bezoek_suggestie, volgende_bezoek_type').eq('aangemaakt_door', userId),
  ]);

  const nesten   = nestenRes.data   ?? [];
  const legsels  = legselsRes.data  ?? [];
  const bezoeken = bezoekenRes.data ?? [];

  // Soorten ophalen voor namen
  const euringCodes = [...new Set(legsels.map(l => l.soort_euring).filter(Boolean))];
  const { data: soorten } = euringCodes.length > 0
    ? await supabase.from('species').select('euring_code, naam_nl').in('euring_code', euringCodes)
    : { data: [] };

  const speciesByEuring: Record<string, string> = {};
  (soorten ?? []).forEach((s: { euring_code: string; naam_nl: string }) => {
    speciesByEuring[s.euring_code] = s.naam_nl;
  });

  // Planning berekenen (zelfde logica als client-side berekenPlanningItems)
  const vandaag = new Date().toISOString().slice(0, 10);
  const items: PlanningItem[] = [];

  for (const nest of nesten) {
    const nestLegsels = legsels.filter((l: { nest_id: string }) => l.nest_id === nest.id);

    for (const legsel of nestLegsels) {
      const legselBezoeken = bezoeken
        .filter((b: { legsel_id: string }) => b.legsel_id === legsel.id)
        .sort((a: { datum: string }, b: { datum: string }) => b.datum.localeCompare(a.datum));

      const laatste = legselBezoeken[0];
      if (!laatste?.volgende_bezoek_suggestie) continue;

      const suggestieDatum = laatste.volgende_bezoek_suggestie;
      const dagenAf        = Math.round(
        (new Date(suggestieDatum + 'T12:00:00').getTime() - new Date(vandaag + 'T12:00:00').getTime()) / 86400000
      );

      const soortEuring = laatste.soort_euring || legsel.soort_euring;
      const soortNaam   = soortEuring ? (speciesByEuring[soortEuring] ?? '') : '';

      items.push({
        legselId:     legsel.id,
        kastnummer:   nest.kastnummer,
        omschrijving: nest.omschrijving ?? '',
        soortNaam,
        datum:        suggestieDatum,
        type:         laatste.volgende_bezoek_type ?? null,
        urgentie:     dagenAf < 0 ? 'verlopen' : dagenAf <= 2 ? 'dringend' : dagenAf <= 5 ? 'binnenkort' : 'gepland',
      });
    }
  }

  items.sort((a, b) => a.datum.localeCompare(b.datum));

  const ical = buildIcal(items);

  return new Response(ical, {
    status: 200,
    headers: {
      'Content-Type':        'text/calendar;charset=utf-8',
      'Content-Disposition': 'inline; filename="nestkastplanning.ics"',
      'Cache-Control':       'no-cache',
    },
  });
});

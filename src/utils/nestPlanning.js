/**
 * Berekent de openstaande planningsitems voor een verzameling nesten.
 *
 * Per legsel: pak het meest recente bezoek. Als dat een
 * volgende_bezoek_suggestie heeft, is het een open item.
 *
 * @returns Array van planningsitems, gesorteerd op datum (urgentst eerst).
 */
export function berekenPlanningItems({ nesten, legsels, bezoeken, speciesByEuring, jaar }) {
  const vandaag = new Date().toISOString().slice(0, 10);
  const items = [];

  for (const nest of nesten) {
    const nestLegsels = legsels.filter(l => l.nest_id === nest.id && l.jaar === jaar);

    for (const legsel of nestLegsels) {
      const legselBezoeken = bezoeken
        .filter(b => b.legsel_id === legsel.id)
        .sort((a, b) => b.datum.localeCompare(a.datum));

      const laatste = legselBezoeken[0];
      if (!laatste?.volgende_bezoek_suggestie) continue;

      const suggestieDatum = laatste.volgende_bezoek_suggestie;
      const dagenAf = Math.round(
        (new Date(suggestieDatum + 'T12:00:00') - new Date(vandaag + 'T12:00:00')) / 86400000
      );

      // Soort: bezoek-soort heeft prioriteit, dan legsel
      const soortEuring = laatste.soort_euring || legsel.soort_euring;
      const soort = soortEuring ? speciesByEuring[soortEuring] : null;

      items.push({
        nestId:    nest.id,
        legselId:  legsel.id,
        kastnummer: nest.kastnummer,
        omschrijving: nest.omschrijving || '',
        soortNaam: soort?.naam_nl || '',
        datum:     suggestieDatum,
        type:      laatste.volgende_bezoek_type || null, // indien opgeslagen
        dagenAf,
        urgentie:  dagenAf < 0 ? 'verlopen' : dagenAf <= 2 ? 'dringend' : dagenAf <= 5 ? 'binnenkort' : 'gepland',
      });
    }
  }

  return items.sort((a, b) => a.datum.localeCompare(b.datum));
}

/** Kleur per urgentie */
export const URGENTIE_KLEUR = {
  verlopen:   '#ef4444',
  dringend:   '#f59e0b',
  binnenkort: '#eab308',
  gepland:    '#22c55e',
};

/** Formatteer YYYY-MM-DD naar dd-mm-yyyy */
export function formatDatum(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}

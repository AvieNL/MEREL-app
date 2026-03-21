import { supabase } from '../lib/supabase';
import { blobNaarBase64 } from './imageHelper';
import { getFotoUrl } from '../hooks/useReferentiebibliotheek';

async function urlNaarBase64(url) {
  const resp = await fetch(url);
  const blob = await resp.blob();
  return blobNaarBase64(blob);
}

export const MAX_REFERENTIES = 10;

/**
 * Selecteer de meest relevante referenties voor de opgegeven soort en maand.
 * Sorteer op type-gewicht (bevestigd > gecorrigeerd > handmatig), dan op seizoensafstand.
 */
export function selectReferenties(soort, maand, alle) {
  const typeGewicht = { bevestigd: 0, gecorrigeerd: 1, handmatig: 2 };
  return alle
    .filter(r => r.soort === soort)
    .sort((a, b) => {
      const gA = typeGewicht[a.type] ?? 2;
      const gB = typeGewicht[b.type] ?? 2;
      if (gA !== gB) return gA - gB;
      return Math.abs(a.maand - maand) - Math.abs(b.maand - maand);
    })
    .slice(0, MAX_REFERENTIES);
}

/**
 * Bouw het Nederlandstalige analyse-prompt op.
 * @param {number} aantalRefFotos - Aantal referentiefoto's die visueel zijn meegestuurd
 */
export function buildPrompt(soort, referenties, aantalRefFotos = 0) {
  const refTekst = referenties.length > 0
    ? referenties.map((r, i) =>
        `Ref ${i + 1}: leeftijd=${r.leeftijd}, geslacht=${r.geslacht}, maand=${r.maand}, type=${r.type}`
      ).join('\n')
    : 'Geen referenties beschikbaar.';

  const refIntro = aantalRefFotos > 0
    ? `BELANGRIJK: De eerste foto('s) zijn bevestigde referentievangsten van dezelfde soort, met een door een expert vastgestelde leeftijd en geslacht. Gebruik deze referenties als primaire basis voor je analyse — als de te analyseren vogel sterk lijkt op een referentie, volg dan dat oordeel.`
    : '';

  return `Je bent een ervaren vogelringer. Analyseer de vogel en bepaal:
1. Leeftijd als EURING-leeftijdscode (bijv. "1"=pullus, "3"=eerste jaar, "4"=tweede jaar, "6"=adult)
2. Geslacht: M (man), F (vrouw), of U (onbekend)
3. Bepaling geslacht als EURING-code: A=plumage, B=broedvlek, C=cloaca, D=DNA, E=gekleurde ring, L=biometrie, P=niet te bepalen, S=sperma, T=gezang/roep, U=onbekend
4. Betrouwbaarheid van de analyse als getal 0–100 (verhoog de betrouwbaarheid als de vogel overeenkomt met een referentie)
5. Korte Nederlandse toelichting (max 2 zinnen)

Soort: ${soort}
${refIntro}

Referentiedata:
${refTekst}

Antwoord UITSLUITEND als geldige JSON, zonder uitleg of markdown:
{"leeftijd":"...","geslacht":"...","geslachtsbepaling":"...","betrouwbaarheid":0,"toelichting":"..."}`;
}

/**
 * Roep de Supabase Edge Function aan om de vogel te analyseren.
 * @param {string} soort - Nederlandse naam van de soort
 * @param {number} maand - Maandnummer 1-12
 * @param {Array<{blob:Blob}>} fotos - Gefilterde en geresizede foto-objecten
 * @param {Array} referenties - Geselecteerde referenties
 * @returns {Promise<{leeftijd,geslacht,geslachtsbepaling,betrouwbaarheid,toelichting}>}
 */
export async function analyseVogel(soort, maand, fotos, referenties) {
  const fotoData = await Promise.all(
    fotos.map(async f => ({
      mediaType: 'image/jpeg',
      data: await blobNaarBase64(f.blob),
    }))
  );

  // Stuur referentiefoto's mee als visuele context (max 3 referenties, max 3 foto's elk)
  const refMetFoto = referenties
    .filter(r => r.foto_paden?.length)
    .slice(0, 3);

  const refFotoData = await Promise.all(
    refMetFoto.map(async r => {
      const fotos = await Promise.all(
        r.foto_paden.slice(0, 3).map(async pad => ({
          mediaType: 'image/jpeg',
          data: await urlNaarBase64(getFotoUrl(pad)),
        }))
      );
      return { fotos, leeftijd: r.leeftijd, geslacht: r.geslacht, maand: r.maand, type: r.type };
    })
  );

  const prompt = buildPrompt(soort, referenties, refFotoData.length);

  const { data, error } = await supabase.functions.invoke('ai-analyse', {
    body: { soort, fotos: fotoData, refFotos: refFotoData, prompt },
  });

  if (error) throw new Error(error.message || String(error));

  // Edge Function geeft altijd 200 terug; fout staat in data.error
  if (data?.error) throw new Error(data.error);

  return data;
}

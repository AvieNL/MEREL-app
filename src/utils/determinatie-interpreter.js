/**
 * determinatie-interpreter.js
 *
 * Converteert een aid-definitie uit de database (pure JSON, geen functies)
 * terug naar een runtime-object met echte JS-functies.
 *
 * Alle 'transform_type' en 'bereken_type' strings worden hier geïnterpreteerd.
 * Voeg nieuwe types toe als de dataset groeit.
 */

// ─── Transform-types ────────────────────────────────────────────────────────

const TRANSFORMS = {
  /**
   * Broedvlek-veld: '0', '', null → 'nee'; alles anders → 'ja'
   */
  boolean_naar_ja_nee: v => (v && v !== '0' && v !== '') ? 'ja' : 'nee',

  /**
   * EURING-leeftijdscode → 'adult' | 'juveniel' | null
   * Code 1 (pull) en 3 (1e kj) → juveniel; rest → adult; leeg → null
   */
  euring_leeftijd_naar_adult_juveniel: v => {
    if (!v || v === '' || v === '0') return null;
    if (v === '1' || v === '3') return 'juveniel';
    return 'adult';
  },

  /**
   * ISO-datum (YYYY-MM-DD of Date) → 'jan_mei' | 'jun_dec' | null
   */
  datum_naar_periode: v => {
    if (!v) return null;
    const m = new Date(v).getMonth() + 1; // 1–12
    if (isNaN(m)) return null;
    return m >= 1 && m <= 5 ? 'jan_mei' : 'jun_dec';
  },
};

// ─── Bereken-types ───────────────────────────────────────────────────────────

/**
 * Lineaire grenswaarde: grens = slope * veld_b + intercept
 * Vergelijkt veld_a met de grens en geeft M/F/onbekend terug.
 */
function berekenLineaireGrenswaarde(inputs, cfg) {
  const a = parseFloat(String(inputs[cfg.veld_a] || '').replace(',', '.'));
  const b = parseFloat(String(inputs[cfg.veld_b] || '').replace(',', '.'));
  if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return null;

  const grens = cfg.slope * b + cfg.intercept;
  const grensStr = grens.toFixed(1);

  function vulUitleg(template) {
    return template
      .replace('{a}', a)
      .replace('{b}', b)
      .replace('{grens}', grensStr);
  }

  if (a > grens) {
    const r = { ...cfg.resultaat_groter };
    r.uitleg = vulUitleg(r.uitleg_template);
    delete r.uitleg_template;
    return r;
  }
  if (a < grens) {
    const r = { ...cfg.resultaat_kleiner };
    r.uitleg = vulUitleg(r.uitleg_template);
    delete r.uitleg_template;
    return r;
  }
  const r = { ...cfg.resultaat_gelijk };
  r.uitleg = vulUitleg(r.uitleg_template);
  delete r.uitleg_template;
  return r;
}

const BEREKEN = {
  lineaire_grenswaarde: berekenLineaireGrenswaarde,
};

// ─── Hydrate ─────────────────────────────────────────────────────────────────

/**
 * Vervangt type-strings door echte functies in een aid-definitie.
 * De input mag zowel het ruwe Supabase-object zijn als een al gehydrateerd object.
 */
export function hydrateAid(raw) {
  if (!raw || !raw.stappen) return raw;

  const stappen = {};
  for (const [id, stap] of Object.entries(raw.stappen)) {
    const s = { ...stap };

    // uit_formulier.transform_type → transform functie
    if (s.uit_formulier?.transform_type) {
      const fn = TRANSFORMS[s.uit_formulier.transform_type];
      if (fn) {
        s.uit_formulier = { ...s.uit_formulier, transform: fn };
      } else {
        console.warn(`[determinatie] Onbekend transform_type: ${s.uit_formulier.transform_type}`);
      }
    }

    // bereken_type + bereken_config → bereken functie
    if (s.bereken_type) {
      const berekenFn = BEREKEN[s.bereken_type];
      if (berekenFn && s.bereken_config) {
        const cfg = s.bereken_config;
        s.bereken = (inputs) => berekenFn(inputs, cfg);
      } else {
        console.warn(`[determinatie] Onbekend bereken_type: ${s.bereken_type}`);
      }
    }

    stappen[id] = s;
  }

  return { ...raw, stappen };
}

import { supabase } from '../lib/supabase';

const PAGE_SIZE = 1000;

/**
 * Gooit een Error als het Supabase-resultaat een fout bevat.
 * @param {{ data: unknown, error: unknown }} result
 * @param {string} context  Beschrijving voor in de foutmelding (bijv. 'pullProjecten')
 * @returns {unknown}       result.data bij succes
 */
export function assertNoError(result, context = '') {
  if (result.error) {
    throw new Error(context ? `[${context}] ${result.error.message}` : result.error.message);
  }
  return result.data;
}

/**
 * Haalt alle pagina's op van een Supabase-query.
 * @param {(from: number, to: number) => SupabaseQueryBuilder} buildQuery
 *   Functie die een query retourneert voor het gegeven bereik.
 * @returns {Promise<Array>} Gecombineerde rijen van alle pagina's.
 * @throws {Error} Als een pagina een fout retourneert.
 */
export async function fetchAllPages(buildQuery) {
  let offset = 0;
  let all = [];
  while (true) {
    const { data, error } = await buildQuery(offset, offset + PAGE_SIZE - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return all;
}

export { supabase };

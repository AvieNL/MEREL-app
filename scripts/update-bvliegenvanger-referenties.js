/**
 * update-bvliegenvanger-referenties.js
 * Voegt referenties toe aan de Bonte Vliegenvanger (EURING 13490).
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: row, error: fetchErr } = await sb.from('species')
  .select('euring_code, naam_nl, data')
  .eq('euring_code', '13490')
  .single();

if (fetchErr) { console.error('Ophalen mislukt:', fetchErr.message); process.exit(1); }

const newData = {
  ...row.data,
  referenties_literatuur: [
    'Alatalo et al. (1982)',
    'Alatalo et al. (1990)',
    'Alerstam et al. (1978)',
    'Bairlein (1985)',
    'Blasco-Zumeta & Heinze (2013)',
    'Corso (2013b)',
    'Corso (2013c)',
    'Dale et al. (2002)',
    'Demongin (2016)',
    'Gargallo (1995a)',
    'Gargallo et al. (2011)',
    'Garner (2014h)',
    'Gelter (1987)',
    'Gelter et al. (1992)',
    'Gustin (1988)',
    'Huhta et al. (1997)',
    'Hyytia & Vikberg (1973)',
    'Jenni & Winkler (1994)',
    'Karlsson et al. (1986b)',
    'Mead & Watmough (1976)',
    'Morales et al. (2007)',
    'Muller (1985)',
    'Normaja (2000)',
    'Normaja (2006)',
    'Norman (1991a)',
    'Potti & Merino (1995)',
    'Potti & Montalvo (1991)',
    'Raijmakers & Raijmakers (2002a)',
    'Ružić et al. (2011)',
    'Røskaft et al. (1986)',
    'Salewski et al. (2004)',
    'Svensson & Mild (1992)',
    'Sætre et al. (1999)',
    'Satre et al. (2001)',
    'Veen et al. (2001)',
    'Velasco (2015)',
    'Vepsalainen & Jarvinen (1977)',
  ],
};

const { error } = await sb.from('species').upsert({
  euring_code: row.euring_code,
  naam_nl: row.naam_nl,
  data: newData,
});

if (error) { console.error('Upsert mislukt:', error.message); process.exit(1); }
console.log('✓ Bonte Vliegenvanger referenties toegevoegd:', newData.referenties_literatuur.length, 'items');

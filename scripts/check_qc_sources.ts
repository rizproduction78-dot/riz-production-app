import { extractNormalizedDailySheetRows, parseDailySheet } from '../src/lib/dailySheetParser';
import { INITIAL_LOGBOOK_ENTRIES } from '../src/data';
import { CANONICAL_FIRESTORE_LOGBOOK_ENTRIES } from '../src/data/canonicalFirestoreData';
import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';

async function checkQC() {
  console.log('--- Canonical October Logbook Entries ---');
  const canOct = CANONICAL_FIRESTORE_LOGBOOK_ENTRIES.filter(l => l.date && l.date.startsWith('2026-10'));
  console.log('Count:', canOct.length);
  canOct.forEach(l => console.log(l.id, l.date, l.staffName, l.result));

  console.log('\n--- Initial October Logbook Entries ---');
  const initOct = INITIAL_LOGBOOK_ENTRIES.filter(l => l.date && l.date.startsWith('2026-10'));
  console.log('Count:', initOct.length);

  console.log('\n--- Supabase October Logbook Entries ---');
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');
  const sbOct = sbLogs.filter((l: any) => l.date && l.date.startsWith('2026-10'));
  console.log('Count:', sbOct.length);
  const okSb = sbOct.filter((l: any) => l.result === 'OK').length;
  const ngSb = sbOct.filter((l: any) => l.result === 'NG').length;
  console.log(`Supabase: OK = ${okSb}, NG = ${ngSb}`);
  sbOct.forEach((l: any) => console.log(l.id, l.date, l.staffName, l.result, (l.equipment || l.activity)?.slice(0, 30)));
}

checkQC();

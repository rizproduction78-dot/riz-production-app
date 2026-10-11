/**
 * Initial Seed: Push All Canonical Operational Data to Supabase
 * PT. Riz Production Multi Kreasi
 */

import 'dotenv/config';
import { pushCollectionToSupabase } from '../src/lib/supabaseSync';
import { getMasterStaffList } from '../src/data';
import {
  CANONICAL_FIRESTORE_DAILY_REPORTS,
  CANONICAL_FIRESTORE_LOGBOOK_ENTRIES,
  CANONICAL_FIRESTORE_FINDINGS,
  CANONICAL_FIRESTORE_WORK_ORDERS,
} from '../src/data/canonicalFirestoreData';

async function main() {
  console.log('================================================================');
  console.log('  MIGRASI DATA KANONIKAL KE SUPABASE POSTGRESQL RIZ PRODUCTION  ');
  console.log('================================================================\n');

  // 1. Master Staff
  const staffList = getMasterStaffList();
  console.log(`Mengunggah Master Staff (${staffList.length} karyawan)...`);
  const r1 = await pushCollectionToSupabase('master_staff', staffList);
  console.log(r1.success ? `✅ Berhasil migrasi ${r1.count} master staff` : `❌ Gagal: ${r1.error}`);

  // 2. Daily Reports
  console.log(`Mengunggah Daily Reports (${CANONICAL_FIRESTORE_DAILY_REPORTS.length} laporan)...`);
  const r2 = await pushCollectionToSupabase('daily_reports', CANONICAL_FIRESTORE_DAILY_REPORTS);
  console.log(r2.success ? `✅ Berhasil migrasi ${r2.count} daily reports` : `❌ Gagal: ${r2.error}`);

  // 3. Logbook Entries
  console.log(`Mengunggah Logbook QC (${CANONICAL_FIRESTORE_LOGBOOK_ENTRIES.length} entri)...`);
  const r3 = await pushCollectionToSupabase('logbook_entries', CANONICAL_FIRESTORE_LOGBOOK_ENTRIES);
  console.log(r3.success ? `✅ Berhasil migrasi ${r3.count} logbook QC` : `❌ Gagal: ${r3.error}`);

  // 4. Findings
  console.log(`Mengunggah Findings / Temuan Kerusakan (${CANONICAL_FIRESTORE_FINDINGS.length} temuan)...`);
  const r4 = await pushCollectionToSupabase('findings', CANONICAL_FIRESTORE_FINDINGS);
  console.log(r4.success ? `✅ Berhasil migrasi ${r4.count} findings` : `❌ Gagal: ${r4.error}`);

  // 5. Work Orders
  console.log(`Mengunggah Work Orders (${CANONICAL_FIRESTORE_WORK_ORDERS.length} WO)...`);
  const r5 = await pushCollectionToSupabase('work_orders', CANONICAL_FIRESTORE_WORK_ORDERS);
  console.log(r5.success ? `✅ Berhasil migrasi ${r5.count} work orders` : `❌ Gagal: ${r5.error}`);

  console.log('\n================================================================');
  console.log('  MIGRASI SELESAI                                              ');
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Fatal error during seed:', err);
  process.exit(1);
});

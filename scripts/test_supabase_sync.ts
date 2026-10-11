/**
 * Test Supabase Connection & Schema Status
 * PT. Riz Production Multi Kreasi
 */

import 'dotenv/config';
import { isSupabaseConfigured, checkSupabaseConnection, supabase } from '../src/lib/supabase';

async function main() {
  console.log('================================================================');
  console.log('  TEST KONEKSI & STATUS SUPABASE POSTGRESQL RIZ PRODUCTION      ');
  console.log('================================================================\n');

  console.log(`Status Konfigurasi Client: ${isSupabaseConfigured ? '✅ TERKONFIGURASI' : '⚠️ BELUM ADA KREDENSIAL'}`);
  console.log(`VITE_SUPABASE_URL: ${process.env.VITE_SUPABASE_URL ? 'Tersedia' : 'Kosong'}`);
  console.log(`VITE_SUPABASE_ANON_KEY: ${process.env.VITE_SUPABASE_ANON_KEY ? 'Tersedia' : 'Kosong'}\n`);

  const result = await checkSupabaseConnection();
  if (result.connected && supabase) {
    console.log(`✅ [SUKSES] ${result.message}\n`);
    
    // Check row counts from tables
    const tables = ['master_staff', 'daily_reports', 'logbook_entries', 'findings', 'work_orders'];
    for (const table of tables) {
      const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`- Tabel ${table}: ❌ Error: ${error.message}`);
      } else {
        console.log(`- Tabel ${table}: ✅ ${count} baris tersimpan`);
      }
    }
  } else {
    console.log(`ℹ️ [INFO] ${result.message}`);
  }

  console.log('\n================================================================\n');
}

main().catch(err => {
  console.error('Error testing Supabase:', err);
  process.exit(1);
});

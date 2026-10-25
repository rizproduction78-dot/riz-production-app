/**
 * TEST SUITE: PENGUJIAN SINKRONISASI LINTAS PERANGKAT (PONSEL, LOCALHOST & VERCEL)
 * PT. Riz Production Multi Kreasi
 */

import { isSupabaseConfigured, checkSupabaseConnection } from '../src/lib/supabase';
import {
  formatFromSupabase,
  pullCollectionFromSupabase,
  pullAllCollectionsFromSupabase,
  initSupabaseRealtimeChannel
} from '../src/lib/supabaseSync';
import fs from 'fs';
import path from 'path';

let passed = 0;
let total = 0;

function assert(condition: boolean, msg: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${msg}`);
  } else {
    console.error(`❌ [FAIL] ${msg}`);
    process.exit(1);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('  TEST SUITE: SINKRONISASI PONSEL <-> LOCALHOST & VERCEL');
  console.log('================================================================');

  // Test 1: Verifikasi fallback Supabase konfigurasi
  assert(isSupabaseConfigured, 'Supabase terkonfigurasi dengan fallback kredensial resmi');
  const conn = await checkSupabaseConnection();
  assert(conn.connected, `Koneksi Supabase aktif & terverifikasi: ${conn.message}`);

  // Test 2: Pengujian Format Mapping Supabase -> App Model
  const sampleSupabaseTask = {
    id: 'dt-test-mobile-01',
    title: 'Pembersihan Kabel & Testing Multicore',
    division: 'Audio',
    assigned_to: 'staff-unyin',
    assigned_name: 'Wahyudin',
    due_date: '2026-10-16',
    status: 'In Progress',
    priority: 'High',
    notes: 'Testing jalur return audio',
    created_by: 'Mboh',
    created_at: '2026-10-15T15:00:00Z',
    updated_at: '2026-10-15T15:10:00Z'
  };

  const formattedTask = formatFromSupabase('daily_tasks', sampleSupabaseTask);
  assert(formattedTask.id === 'dt-test-mobile-01', 'ID task terpetakan dengan benar');
  assert(formattedTask.title === 'Pembersihan Kabel & Testing Multicore', 'Title task terpetakan dengan benar');
  assert(formattedTask.assignedName === 'Wahyudin', 'assignedName camelCase terpetakan');
  assert(formattedTask.priority === 'Tinggi', 'Priority High termodifikasi ke Bahasa Indonesia (Tinggi)');
  assert(formattedTask.description === 'Testing jalur return audio', 'description terpetakan dari notes');

  const sampleSupabaseFinding = {
    id: 'fd-test-01',
    equipment: 'Speaker DB Tech No.18',
    asset_code: 'AST-SPK-018',
    division: 'Audio',
    issue_description: 'Modul amplifier serak pada volume tinggi',
    severity: 'Medium',
    status: 'Open',
    pic: 'Damri',
    target_date: '2026-10-20',
    cost_estimate: 150000,
    created_at: '2026-10-15T15:00:00Z'
  };

  const formattedFinding = formatFromSupabase('findings', sampleSupabaseFinding);
  assert(formattedFinding.equipment === 'Speaker DB Tech No.18', 'Equipment finding terpetakan');
  assert(formattedFinding.issue === 'Modul amplifier serak pada volume tinggi', 'issue terpetakan dari issue_description');
  assert(formattedFinding.priority === 'Sedang', 'severity Medium terpetakan ke Sedang');
  assert(formattedFinding.costEstimate === 150000, 'costEstimate numeric terpetakan');

  // Test 3: Pengujian Pull Koleksi dari Supabase Cloud
  const pulledTasks = await pullCollectionFromSupabase('daily_tasks');
  assert(Array.isArray(pulledTasks) && pulledTasks.length > 0, `Berhasil pull ${pulledTasks.length} daily_tasks dari Supabase Cloud`);

  const pulledReports = await pullCollectionFromSupabase('daily_reports');
  assert(Array.isArray(pulledReports) && pulledReports.length > 0, `Berhasil pull ${pulledReports.length} daily_reports dari Supabase Cloud`);

  const pulledStaff = await pullCollectionFromSupabase('master_staff');
  assert(Array.isArray(pulledStaff) && pulledStaff.length > 0, `Berhasil pull ${pulledStaff.length} master_staff dari Supabase Cloud`);

  // Test 4: Verifikasi konfigurasi Vite Dev Server untuk akses ponsel
  const viteConfigContent = fs.readFileSync(path.resolve(process.cwd(), 'vite.config.ts'), 'utf8');
  assert(viteConfigContent.includes("host: '0.0.0.0'"), 'Vite server dikonfigurasi host 0.0.0.0 untuk menerima koneksi ponsel');
  assert(viteConfigContent.includes("allowedHosts: true as const"), 'Vite server dikonfigurasi allowedHosts true agar IP ponsel tidak diblokir Vite 6');

  // Test 5: Verifikasi pembersihan Cache Storage di index.html dan public/sw.js
  const indexHtmlContent = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8');
  assert(indexHtmlContent.includes("caches.delete"), 'index.html memiliki script penghapusan Cache Storage untuk ponsel');
  assert(indexHtmlContent.includes("serviceWorker"), 'index.html melakukan unregister service worker lama');

  const swContent = fs.readFileSync(path.resolve(process.cwd(), 'public/sw.js'), 'utf8');
  assert(swContent.includes("caches.delete"), 'public/sw.js secara aktif membersihkan cache storage');
  assert(swContent.includes("registration.unregister()"), 'public/sw.js secara otomatis meng-unregister dirinya sendiri');

  console.log('================================================================');
  console.log(`  HASIL: SEMUA PENGUJIAN LULUS (${passed}/${total} - 100%)`);
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});

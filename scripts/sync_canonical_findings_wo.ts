/**
 * SYNC CANONICAL FINDINGS + WO + MISSING DAILY REPORTS → FIREBASE
 * Run: npx tsx scripts/sync_canonical_findings_wo.ts
 */
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { 
  CANONICAL_FIRESTORE_FINDINGS, 
  CANONICAL_FIRESTORE_WORK_ORDERS,
  CANONICAL_FIRESTORE_DAILY_REPORTS
} from '../src/data/canonicalFirestoreData';

const firebaseConfig = {
  apiKey: "AIzaSyBP__qbHdsnce8G5pygTTc_cMhPZwWSNHU",
  authDomain: "wh-logbook-2026.firebaseapp.com",
  projectId: "wh-logbook-2026",
  storageBucket: "wh-logbook-2026.firebasestorage.app",
  messagingSenderId: "690146850362",
  appId: "1:690146850362:web:fc61ed71723bad8037e703"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// IDs dari daily reports yang BARU ditambahkan (kehadiran yang sebelumnya hilang)
const MISSING_REPORT_IDS = [
  'rep-20260903-yudis-hadir',
  'rep-20260904-buluk-hadir',
  'rep-20260905-mboh-hadir',
  'rep-20260909-wigi-hadir',
  'rep-20260909-ayong-hadir',
  'rep-20260909-opik-hadir',
  'rep-20260909-butong-hadir',
  'rep-20260909-dani-hadir',
  'rep-20260917-buluk-hadir',
  'rep-20260917-butonk-hadir',
];

async function syncCanonical() {
  const now = new Date().toISOString();
  let newFindings = 0, newWOs = 0, newReports = 0, skipped = 0;

  console.log('\n================================================================');
  console.log('  SYNC: CANONICAL FINDINGS + WO + DAILY REPORTS → FIRESTORE');
  console.log('================================================================\n');

  // ── 1. FINDINGS ──────────────────────────────────────────────────────────
  console.log(`📋 Syncing ${CANONICAL_FIRESTORE_FINDINGS.length} Findings dari Google Sheet remark...`);
  for (const finding of CANONICAL_FIRESTORE_FINDINGS) {
    const ref = doc(db, 'findings', finding.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...finding, _syncMeta: { updatedAt: now, updatedBy: 'sync_canonical_findings_wo' } });
      console.log(`  ✅ NEW Finding: [${finding.id}] ${finding.equipment}`);
      newFindings++;
    } else {
      console.log(`  ⏭  SKIP (exists): ${finding.id}`);
      skipped++;
    }
  }

  // ── 2. WORK ORDERS ───────────────────────────────────────────────────────
  console.log(`\n🔧 Syncing ${CANONICAL_FIRESTORE_WORK_ORDERS.length} Work Orders...`);
  for (const wo of CANONICAL_FIRESTORE_WORK_ORDERS) {
    const ref = doc(db, 'work_orders', wo.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...wo, _syncMeta: { updatedAt: now, updatedBy: 'sync_canonical_findings_wo' } });
      console.log(`  ✅ NEW WO: [${wo.id}] ${wo.title}`);
      newWOs++;
    } else {
      console.log(`  ⏭  SKIP (exists): ${wo.id}`);
      skipped++;
    }
  }

  // ── 3. MISSING DAILY REPORTS ─────────────────────────────────────────────
  const missingReports = CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => MISSING_REPORT_IDS.includes(r.id));
  console.log(`\n📅 Syncing ${missingReports.length} missing Daily Reports (kehadiran yang belum tercatat)...`);
  for (const report of missingReports) {
    const ref = doc(db, 'daily_reports', report.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { ...report, _syncMeta: { updatedAt: now, updatedBy: 'sync_canonical_findings_wo' } });
      console.log(`  ✅ NEW Daily Report: [${report.id}] ${report.date} — ${report.staffName}`);
      newReports++;
    } else {
      console.log(`  ⏭  SKIP (exists): ${report.id}`);
      skipped++;
    }
  }

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log('  HASIL SYNC:');
  console.log(`  Findings baru    : ${newFindings}`);
  console.log(`  Work Orders baru : ${newWOs}`);
  console.log(`  Daily Reports baru: ${newReports}`);
  console.log(`  Dilewati (exists): ${skipped}`);
  console.log('================================================================\n');

  process.exit(0);
}

syncCanonical().catch(err => {
  console.error('\n❌ SYNC ERROR:', err.message);
  process.exit(1);
});

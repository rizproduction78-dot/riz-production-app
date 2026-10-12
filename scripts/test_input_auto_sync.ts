/**
 * Test input auto-sync and state persistence verification
 */
import { ALL_SYNC_COLLECTIONS, saveCloudDoc, subscribeCloudCollection } from '../src/lib/cloudSync';

async function testInputSync() {
  console.log('Testing Input Auto-Sync & Dual-Key Mirroring...');

  // Mock localStorage for node environment
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; }
  };
  (global as any).window = {
    dispatchEvent: (_evt: any) => {},
    addEventListener: (_type: string, _cb: any) => {},
    removeEventListener: (_type: string, _cb: any) => {}
  };

  // Test 1: Daily reports registry key
  const drReg = ALL_SYNC_COLLECTIONS.find(c => c.name === 'daily_reports');
  if (drReg?.key !== 'riz_daily_reports_v2') {
    throw new Error(`daily_reports key mismatch: expected riz_daily_reports_v2, got ${drReg?.key}`);
  }
  console.log('✅ [PASS] daily_reports key is riz_daily_reports_v2');

  // Test 2: Save cloud doc mirrors to both riz_daily_reports_v2 and riz_daily_reports
  const testDoc = {
    id: 'dr-test-999',
    date: '2026-10-12',
    staffName: 'Muhamad Rahmat',
    division: 'Audio',
    activity: 'Pengecekan Mixer FOH dan Routing Speaker',
    notes: 'Input otomatis masuk ke localhost',
    status: 'Submitted'
  };

  await saveCloudDoc('daily_reports', testDoc.id, testDoc, 'Test User');

  const v2Cached = JSON.parse(store['riz_daily_reports_v2'] || '[]');
  const legacyCached = JSON.parse(store['riz_daily_reports'] || '[]');

  if (!v2Cached.some((item: any) => item.id === 'dr-test-999')) {
    throw new Error('Item dr-test-999 not found in riz_daily_reports_v2');
  }
  if (!legacyCached.some((item: any) => item.id === 'dr-test-999')) {
    throw new Error('Item dr-test-999 not found in riz_daily_reports');
  }
  console.log('✅ [PASS] saveCloudDoc automatically writes to both riz_daily_reports_v2 and riz_daily_reports');

  // Test 3: Logbook entries
  const lbReg = ALL_SYNC_COLLECTIONS.find(c => c.name === 'logbook_entries');
  if (lbReg?.key !== 'riz_logbook_entries_v2') {
    throw new Error(`logbook_entries key mismatch: expected riz_logbook_entries_v2, got ${lbReg?.key}`);
  }
  const testLog = {
    id: 'lg-test-888',
    date: '2026-10-12',
    staffName: 'Heri',
    division: 'Lighting',
    activity: 'QC Moving Head Beam',
    notes: 'Kondisi lampu normal 100%'
  };
  await saveCloudDoc('logbook_entries', testLog.id, testLog, 'Test User');
  const lbV2 = JSON.parse(store['riz_logbook_entries_v2'] || '[]');
  const lbLegacy = JSON.parse(store['riz_logbook_entries'] || '[]');
  if (!lbV2.some((item: any) => item.id === 'lg-test-888') || !lbLegacy.some((item: any) => item.id === 'lg-test-888')) {
    throw new Error('Logbook entry not mirrored');
  }
  console.log('✅ [PASS] logbook_entries automatically written to both v2 and legacy keys');

  // Test 4: Daily Tasks
  const dtReg = ALL_SYNC_COLLECTIONS.find(c => c.name === 'daily_tasks');
  if (dtReg?.key !== 'riz_daily_tasks_v2') {
    throw new Error(`daily_tasks key mismatch: expected riz_daily_tasks_v2, got ${dtReg?.key}`);
  }
  const testTask = {
    id: 'task-test-777',
    title: 'Loading Genset Lapangan',
    division: 'Service',
    status: 'In Progress',
    assignedName: 'Mulyana'
  };
  await saveCloudDoc('daily_tasks', testTask.id, testTask, 'Test User');
  const dtV2 = JSON.parse(store['riz_daily_tasks_v2'] || '[]');
  const dtLegacy = JSON.parse(store['riz_daily_tasks'] || '[]');
  if (!dtV2.some((item: any) => item.id === 'task-test-777') || !dtLegacy.some((item: any) => item.id === 'task-test-777')) {
    throw new Error('Daily task not mirrored');
  }
  console.log('✅ [PASS] daily_tasks automatically written to both v2 and legacy keys');

  console.log('\n================================================================');
  console.log('ALL INPUT AUTO-SYNC CHECKS PASSED (100% OK)');
  console.log('================================================================');
}

testInputSync().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

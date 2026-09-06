import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { 
  STAFF_LIST, 
  INITIAL_FINDINGS, 
  INITIAL_LOGBOOK_ENTRIES, 
  INITIAL_DAILY_REPORTS, 
  INITIAL_DAILY_TASKS,
  INITIAL_FREELANCE_WORKERS,
  INITIAL_FLEET_DRIVERS,
  INITIAL_VEHICLES,
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS
} from '../src/data';

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

async function inspectAndSync() {
  console.log('--- 1. INSPECTING CURRENT FIRESTORE COLLECTIONS ---');
  
  const collectionsToInspect = [
    'findings', 
    'daily_tasks', 
    'daily_reports', 
    'logbook_entries', 
    'master_staff',
    'freelance_workers',
    'fleet_drivers',
    'master_vehicles',
    'assets',
    'work_orders',
    'maintenance_schedules'
  ];

  for (const colName of collectionsToInspect) {
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);
    console.log(`\nCollection [${colName}] -> ${snap.docs.length} docs`);
    snap.docs.forEach(d => {
      console.log(`  - Doc ID: ${d.id} ->`, JSON.stringify(d.data()).slice(0, 160));
    });
  }

  console.log('\n--- 2. PURGING STALE DOCS & SYNCING CANONICAL DATA ---');

  // 1. Findings
  const findingsCol = collection(db, 'findings');
  const findingsSnap = await getDocs(findingsCol);
  for (const d of findingsSnap.docs) {
    // If not in INITIAL_FINDINGS, delete it
    if (!INITIAL_FINDINGS.some(f => f.id === d.id)) {
      console.log(`Deleting obsolete finding doc: ${d.id}`);
      await deleteDoc(doc(db, 'findings', d.id));
    }
  }
  for (const f of INITIAL_FINDINGS) {
    console.log(`Setting canonical finding doc: ${f.id}`);
    await setDoc(doc(db, 'findings', f.id), {
      ...f,
      _syncMeta: { updatedAt: new Date().toISOString(), updatedBy: 'Master Sync', deviceOS: 'macOS' }
    });
  }

  // 2. Daily Tasks
  const tasksCol = collection(db, 'daily_tasks');
  const tasksSnap = await getDocs(tasksCol);
  for (const d of tasksSnap.docs) {
    if (!INITIAL_DAILY_TASKS.some(t => t.id === d.id)) {
      console.log(`Deleting obsolete daily_task doc: ${d.id}`);
      await deleteDoc(doc(db, 'daily_tasks', d.id));
    }
  }
  for (const t of INITIAL_DAILY_TASKS) {
    console.log(`Setting canonical daily_task doc: ${t.id}`);
    await setDoc(doc(db, 'daily_tasks', t.id), {
      ...t,
      _syncMeta: { updatedAt: new Date().toISOString(), updatedBy: 'Master Sync', deviceOS: 'macOS' }
    });
  }

  // 3. Daily Reports
  const reportsCol = collection(db, 'daily_reports');
  const reportsSnap = await getDocs(reportsCol);
  for (const d of reportsSnap.docs) {
    if (!INITIAL_DAILY_REPORTS.some(r => r.id === d.id)) {
      console.log(`Deleting obsolete daily_report doc: ${d.id}`);
      await deleteDoc(doc(db, 'daily_reports', d.id));
    }
  }
  for (const r of INITIAL_DAILY_REPORTS) {
    console.log(`Setting canonical daily_report doc: ${r.id}`);
    await setDoc(doc(db, 'daily_reports', r.id), {
      ...r,
      _syncMeta: { updatedAt: new Date().toISOString(), updatedBy: 'Master Sync', deviceOS: 'macOS' }
    });
  }

  // 4. Logbook Entries
  const logbookCol = collection(db, 'logbook_entries');
  const logbookSnap = await getDocs(logbookCol);
  for (const d of logbookSnap.docs) {
    if (!INITIAL_LOGBOOK_ENTRIES.some(l => l.id === d.id)) {
      console.log(`Deleting obsolete logbook doc: ${d.id}`);
      await deleteDoc(doc(db, 'logbook_entries', d.id));
    }
  }
  for (const l of INITIAL_LOGBOOK_ENTRIES) {
    console.log(`Setting canonical logbook doc: ${l.id}`);
    await setDoc(doc(db, 'logbook_entries', l.id), {
      ...l,
      _syncMeta: { updatedAt: new Date().toISOString(), updatedBy: 'Master Sync', deviceOS: 'macOS' }
    });
  }

  // 5. Master Staff (ensure Seno Subroto is Admin Division, Staff Role, Level 4)
  for (const s of STAFF_LIST) {
    console.log(`Setting canonical master_staff doc: ${s.id} (${s.name} - ${s.division} ${s.role})`);
    await setDoc(doc(db, 'master_staff', s.id), {
      ...s,
      _syncMeta: { updatedAt: new Date().toISOString(), updatedBy: 'Master Sync', deviceOS: 'macOS' }
    });
  }

  console.log('\n--- 3. CLOUD SYNC COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

inspectAndSync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});

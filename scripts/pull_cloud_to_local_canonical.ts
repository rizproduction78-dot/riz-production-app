/**
 * Script untuk menyinkronkan data Cloud Firestore ke data lokal kanonikal (src/data/canonicalFirestoreData.ts dan src/data.ts)
 * Memastikan data di localhost sama persis 100% dengan Cloud Firebase.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

const firebaseConfig = {
  apiKey: 'AIzaSyBP__qbHdsnce8G5pygTTc_cMhPZwWSNHU',
  authDomain: 'wh-logbook-2026.firebaseapp.com',
  projectId: 'wh-logbook-2026',
  storageBucket: 'wh-logbook-2026.firebasestorage.app',
  messagingSenderId: '690146850362',
  appId: '1:690146850362:web:fc61ed71723bad8037e703'
};

async function syncCloudToLocal() {
  console.log('Connecting to Firebase Cloud Firestore...');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 1. Fetch collections
  console.log('Fetching daily_reports...');
  const repSnap = await getDocs(collection(db, 'daily_reports'));
  const dailyReports = repSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('Fetching logbook_entries...');
  const logSnap = await getDocs(collection(db, 'logbook_entries'));
  const logbookEntries = logSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('Fetching findings...');
  const findSnap = await getDocs(collection(db, 'findings'));
  const findings = findSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('Fetching work_orders...');
  const woSnap = await getDocs(collection(db, 'work_orders'));
  const workOrders = woSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('Fetching freelance_workers...');
  const fwSnap = await getDocs(collection(db, 'freelance_workers'));
  const freelanceWorkers = fwSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('Fetching fleet_drivers...');
  const fdSnap = await getDocs(collection(db, 'fleet_drivers'));
  const fleetDrivers = fdSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log('Fetching master_vehicles...');
  const vehSnap = await getDocs(collection(db, 'master_vehicles'));
  const masterVehicles = vehSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  console.log(`Fetched counts:`);
  console.log(`- Daily Reports: ${dailyReports.length}`);
  console.log(`- Logbook Entries: ${logbookEntries.length}`);
  console.log(`- Findings: ${findings.length}`);
  console.log(`- Work Orders: ${workOrders.length}`);
  console.log(`- Freelance Workers: ${freelanceWorkers.length}`);
  console.log(`- Fleet Drivers: ${fleetDrivers.length}`);
  console.log(`- Master Vehicles: ${masterVehicles.length}`);

  // Sort function for deterministic order
  dailyReports.sort((a: any, b: any) => (a.date || '').localeCompare(b.date || '') || (a.id || '').localeCompare(b.id || ''));
  logbookEntries.sort((a: any, b: any) => (a.date || '').localeCompare(b.date || '') || (a.id || '').localeCompare(b.id || ''));
  findings.sort((a: any, b: any) => (a.dateCreated || a.date || '').localeCompare(b.dateCreated || b.date || '') || (a.id || '').localeCompare(b.id || ''));
  workOrders.sort((a: any, b: any) => (a.dateCreated || a.date || '').localeCompare(b.dateCreated || b.date || '') || (a.id || '').localeCompare(b.id || ''));

  // Update src/data/canonicalFirestoreData.ts
  const canonicalContent = `import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI CLOUD FIRESTORE & GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Disinkronkan langsung dari Cloud Firestore (wh-logbook-2026).
 * Total: ${dailyReports.length} Daily Reports | ${logbookEntries.length} Logbook Entries | ${findings.length} Findings | ${workOrders.length} Work Orders
 */

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = ${JSON.stringify(dailyReports, null, 2)};

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = ${JSON.stringify(logbookEntries, null, 2)};

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = ${JSON.stringify(findings, null, 2)};

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = ${JSON.stringify(workOrders, null, 2)};
`;

  const canonicalPath = path.resolve(process.cwd(), 'src/data/canonicalFirestoreData.ts');
  fs.writeFileSync(canonicalPath, canonicalContent, 'utf-8');
  console.log(`Successfully updated ${canonicalPath}`);

  // Save full json dumps for drivers, vehicles, freelance
  const dumpsDir = path.resolve(process.cwd(), 'src/data/cloudDumps');
  if (!fs.existsSync(dumpsDir)) fs.mkdirSync(dumpsDir, { recursive: true });
  fs.writeFileSync(path.join(dumpsDir, 'freelance_workers.json'), JSON.stringify(freelanceWorkers, null, 2));
  fs.writeFileSync(path.join(dumpsDir, 'fleet_drivers.json'), JSON.stringify(fleetDrivers, null, 2));
  fs.writeFileSync(path.join(dumpsDir, 'master_vehicles.json'), JSON.stringify(masterVehicles, null, 2));
  console.log(`Saved cloud dumps to ${dumpsDir}`);

  process.exit(0);
}

syncCloudToLocal().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});

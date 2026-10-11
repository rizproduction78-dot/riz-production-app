import { CANONICAL_FIRESTORE_DAILY_REPORTS } from '../src/data/canonicalFirestoreData';
import { STAFF_LIST } from '../src/data';
import { isStaffMatch } from '../src/utils/kpiCalculator';

console.log('=== INVESTIGASI T3: UJI PENYEBAB AEP SAEPUDIN / STAF LAIN DI OKTOBER ===\n');

const octReports = CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => r.date && r.date.startsWith('2026-10'));
console.log(`Total laporan Oktober di canonicalFirestoreData: ${octReports.length}`);

const uniqueStaffNames = Array.from(new Set(octReports.map(r => r.staffName)));
console.log('Nama-nama staf unik di laporan Oktober:', uniqueStaffNames);

console.log('\n--- HASIL PENCOCOKAN isStaffMatch UNTUK SETIAP NAMA UNIK ---');
for (const rawName of uniqueStaffNames) {
  const matchedStaff = STAFF_LIST.filter(s => isStaffMatch(s, rawName));
  console.log(`Input Name: "${rawName}" -> Cocok ke (${matchedStaff.length} staf): ${matchedStaff.map(s => `${s.name} [${s.id}]`).join(', ')}`);
}

console.log('\n--- TOTAL LAPORAN OKTOBER YANG DIHITUNG UNTUK SETIAP ANGGOTA STAF VIA isStaffMatch ---');
for (const staff of STAFF_LIST) {
  const matchedReports = octReports.filter(r => isStaffMatch(staff, r.staffName));
  if (matchedReports.length > 0) {
    console.log(`[${staff.id}] ${staff.name} -> ${matchedReports.length} laporan`);
  }
}

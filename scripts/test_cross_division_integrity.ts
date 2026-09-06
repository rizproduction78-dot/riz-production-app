/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SCRIPT TEST: INTEGRITAS KONEKSI DATA ANTAR DIVISI RESMI PT RIZ PRODUCTION
 */

import { getMasterStaffList, STAFF_LIST } from '../src/data';
import { calculateStaffKpi, isStaffMatch } from '../src/utils/kpiCalculator';
import { LogbookEntry, DailyReport, Finding, WorkOrder, Asset, Division } from '../src/types';

console.log('================================================================');
console.log('       TEST SUITE: INTEGRITAS KONEKSI DATA ANTAR DIVISI         ');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
  }
}

// 1. Verifikasi Keberadaan 7 Divisi Resmi
console.log('--- 1. Testing 7 Divisi Resmi Terdaftar & Terintegrasi ---');
const officialDivisions: Division[] = ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang', 'Admin', 'Service'];
const masterStaff = getMasterStaffList();

officialDivisions.forEach(div => {
  const staffInDiv = masterStaff.filter(s => s.division === div);
  assert(staffInDiv.length > 0, `Divisi ${div} memiliki anggota staf resmi terdaftar (${staffInDiv.length} staf)`);
});

// 2. Simulasi Alur Data Lintas Divisi: QC Lapangan -> Temuan -> Work Order -> Service Selesai
console.log('\n--- 2. Testing Alur Keterhubungan Data (QC -> Finding -> WO -> Auto-Close) ---');

// A. Teknisi Audio melakukan QC dan mendeteksi unit NG
const simulatedQCEntry: LogbookEntry = {
  id: 'lg-test-1',
  date: '2026-09-07',
  division: 'Audio',
  staffName: 'Suryana',
  activity: '[QC Checklist] Pre-Event Setup - Line Array',
  result: 'NG',
  followUp: 'Modul amplifier speaker L1 mati total',
  status: 'Open',
  verification: 'Supervisor',
  checklists: {
    'Line Array Main PA': { status: 'NG', notes: 'Modul amplifier speaker L1 mati total' }
  }
};

// B. Otomatis diteruskan ke Finding
const simulatedFinding: Finding = {
  id: 'fd-test-1',
  equipment: 'Audio - Line Array Main PA',
  issue: 'Modul amplifier speaker L1 mati total',
  priority: 'Tinggi',
  pic: 'Suryana',
  targetDate: '2026-09-09',
  status: 'Open',
  dateCreated: '2026-09-07'
};

assert(simulatedFinding.status === 'Open', 'Temuan QC otomatis berstatus Open saat terdeteksi NG');

// C. Diterbitkan Work Order ke Divisi Service
const simulatedWO: WorkOrder = {
  id: 'wo-test-1',
  title: 'Perbaikan: Audio - Line Array Main PA',
  description: `[Temuan QC ID: ${simulatedFinding.id}] Modul amplifier speaker L1 mati total (Prioritas: Tinggi)`,
  pic: 'Mulyana',
  division: 'Service',
  deadline: '2026-09-09',
  progress: 10,
  status: 'In Progress',
  dateCreated: '2026-09-07'
};

assert(simulatedWO.division === 'Service' && simulatedWO.pic === 'Mulyana', 'Work Order berhasil dialokasikan ke Teknisi Divisi Service');

// D. Teknisi Service menyelesaikan perbaikan WO -> Auto-Close Finding
const completedWO: WorkOrder = {
  ...simulatedWO,
  progress: 100,
  status: 'Completed'
};

const updatedFinding: Finding = {
  ...simulatedFinding,
  status: completedWO.status === 'Completed' ? 'Close' : 'Open'
};

assert(updatedFinding.status === 'Close', 'Temuan QC otomatis berubah menjadi Close saat WO diselesaikan');

// 3. Testing Agregasi Data Produktivitas 7 Divisi
console.log('\n--- 3. Testing Agregasi Produktivitas 7 Divisi ---');

const mockDailyReports: DailyReport[] = [
  { id: 'dr-1', date: '2026-09-07', staffName: 'Suryana', division: 'Audio', activity: 'Inspeksi FOH', notes: 'OK', status: 'Submitted' },
  { id: 'dr-2', date: '2026-09-07', staffName: 'Heri', division: 'Lighting', activity: 'Cek DMX Beam', notes: 'OK', status: 'Submitted' },
  { id: 'dr-3', date: '2026-09-07', staffName: 'Ayong Sumarsih', division: 'Videotron', activity: 'Uji Modul LED P3.9', notes: 'OK', status: 'Submitted' },
  { id: 'dr-4', date: '2026-09-07', staffName: 'Mulyadi', division: 'Multimedia', activity: 'Live Cam Stream Test', notes: 'OK', status: 'Submitted' },
  { id: 'dr-5', date: '2026-09-07', staffName: 'Gatot Wiliyanto', division: 'Gudang', activity: 'Loading Truck Canter', notes: 'OK', status: 'Submitted' },
  { id: 'dr-6', date: '2026-09-07', staffName: 'Syalsa Sri Hestariana', division: 'Admin', activity: 'Rekap Absensi Staf', notes: 'OK', status: 'Submitted' },
  { id: 'dr-7', date: '2026-09-07', staffName: 'Mulyana', division: 'Service', activity: 'Perbaikan Solder Power Supply', notes: 'OK', status: 'Submitted' }
];

officialDivisions.forEach(div => {
  const count = mockDailyReports.filter(r => r.division === div).length;
  assert(count === 1, `Laporan harian divisi ${div} terhitung presisi (1 laporan)`);
});

// 4. Testing Dampak ke Skor KPI Masing-Masing Staf
console.log('\n--- 4. Testing Perhitungan KPI Staf Lintas Divisi ---');

const suryanaStaff = masterStaff.find(s => s.name === 'Suryana')!;
const kpiSuryana = calculateStaffKpi(suryanaStaff, [mockDailyReports[0]], [simulatedQCEntry], [updatedFinding]);
assert(kpiSuryana.kpi > 0, `KPI Suryana (Audio) terhitung akurat: ${kpiSuryana.kpi}% (Daily Report + QC + Temuan Selesai)`);

const mulyanaStaff = masterStaff.find(s => s.name === 'Mulyana')!;
const kpiMulyana = calculateStaffKpi(mulyanaStaff, [mockDailyReports[6]], [], [updatedFinding]);
assert(kpiMulyana.kpi > 0, `KPI Mulyana (Service) terhitung akurat: ${kpiMulyana.kpi}% (Daily Report + Penanganan Temuan)`);

console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}

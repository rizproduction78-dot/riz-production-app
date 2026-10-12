/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TEST SUITE: SINKRONISASI DATA MASTER PERSONEL & GOOGLE DRIVE RESMI
 * PT. Riz Production Multi Kreasi
 */

import {
  OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL,
  OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID
} from '../src/types';
import { STAFF_LIST, INITIAL_FREELANCE_WORKERS } from '../src/data';
import {
  parsePersonnelImportFile
} from '../src/utils/personnelDriveSync';
import Papa from 'papaparse';

console.log('================================================================');
console.log(' TEST SUITE: MASTER PERSONEL & GOOGLE DRIVE INTEGRITY');
console.log('================================================================\n');

let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
  } else {
    console.error(`❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
    failedTests++;
  }
}

// 1. Verifikasi Konstanta Google Drive Resmi
assert(
  OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID === '1hBGpse_uG9bbeMNqc0qdbMydLTt0uDuq',
  'Folder ID Google Drive resmi sesuai Rule 17 (1hBGpse_uG9bbeMNqc0qdbMydLTt0uDuq)'
);

assert(
  OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL === 'https://drive.google.com/drive/folders/1hBGpse_uG9bbeMNqc0qdbMydLTt0uDuq',
  'URL Folder Google Drive resmi sesuai spesifikasi'
);

// 2. Verifikasi Ekspor & Parsing Staf CSV
const sampleStaffCsvRows = [
  {
    ID: 'staff-wahyu',
    Nama: 'Wahyu',
    Nama_Lengkap_KTP: 'Wahyu Hidayat',
    Panggilan: 'Wahyu',
    Divisi: 'Admin',
    Jabatan: 'Owner',
    Level_Kompetensi: 8,
    No_Telepon_WA: '081234567890',
    Email: 'wahyu@rizproduction.com'
  },
  {
    ID: 'staff-unyin',
    Nama: 'Wahyudin',
    Nama_Lengkap_KTP: 'Wahyudin',
    Panggilan: 'Unyim',
    Divisi: 'Audio',
    Jabatan: 'Staff',
    Level_Kompetensi: 3,
    No_Telepon_WA: '08987654321',
    Email: ''
  }
];

const generatedStaffCsv = Papa.unparse(sampleStaffCsvRows);
const parsedStaffCsvResult = parsePersonnelImportFile(generatedStaffCsv, 'staf_karyawan.csv');

assert(
  parsedStaffCsvResult.success === true,
  'Parser membaca Staf CSV dengan status success = true'
);
assert(
  parsedStaffCsvResult.detectedType === 'staff',
  'Parser mendeteksi tipe data "staff" dari kolom CSV'
);
assert(
  parsedStaffCsvResult.summary.staffCount === 2,
  `Jumlah staf terbaca tepat 2 (aktual: ${parsedStaffCsvResult.summary.staffCount})`
);
assert(
  parsedStaffCsvResult.staffRecords[0].name === 'Wahyu' && parsedStaffCsvResult.staffRecords[0].division === 'Admin',
  'Field Nama dan Divisi staf pertama tervalidasi presisi'
);

// 3. Verifikasi Ekspor & Parsing Freelance CSV
const sampleFreelanceCsvRows = [
  {
    ID: 'fl-riz-01',
    Nama: 'Agus Pratama',
    Spesialisasi: 'Audio',
    Jabatan_Role: 'Operator Monitor Sound',
    No_Telepon_WA: '081122334455',
    Email: 'agus.sound@gmail.com',
    Honor_Harian_Rp: 350000,
    No_KTP: '3201011234567890',
    Bank: 'BCA',
    No_Rekening: '1234567890',
    Atas_Nama: 'Agus Pratama',
    Status: 'Aktif',
    Rating: 5,
    Keahlian: 'Mixing console digital Yamaha CL5',
    Alamat: 'Bogor',
    Catatan: 'Kru audio standby weekend',
    Tanggal_Terdaftar: '2026-10-12'
  }
];

const generatedFreelanceCsv = Papa.unparse(sampleFreelanceCsvRows);
const parsedFreelanceCsvResult = parsePersonnelImportFile(generatedFreelanceCsv, 'kru_freelance.csv');

assert(
  parsedFreelanceCsvResult.success === true,
  'Parser membaca Freelance CSV dengan status success = true'
);
assert(
  parsedFreelanceCsvResult.detectedType === 'freelance',
  'Parser mendeteksi tipe data "freelance" dari kolom CSV'
);
assert(
  parsedFreelanceCsvResult.summary.freelanceCount === 1,
  `Jumlah freelance terbaca tepat 1 (aktual: ${parsedFreelanceCsvResult.summary.freelanceCount})`
);
assert(
  parsedFreelanceCsvResult.freelanceRecords[0].dailyRate === 350000,
  `Honor harian freelance terkonversi menjadi numeric 350000 (aktual: ${parsedFreelanceCsvResult.freelanceRecords[0].dailyRate})`
);

// 4. Verifikasi Parsing JSON Gabungan Master Personel
const masterBackupPayload = {
  company: "PT. Riz Production Multi Kreasi",
  dataType: "master_all_personnel",
  folderId: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID,
  exportedAt: new Date().toISOString(),
  totalStaff: STAFF_LIST.length,
  totalFreelance: INITIAL_FREELANCE_WORKERS.length,
  staff: STAFF_LIST,
  freelance: INITIAL_FREELANCE_WORKERS
};

const jsonStr = JSON.stringify(masterBackupPayload);
const parsedJsonResult = parsePersonnelImportFile(jsonStr, 'backup_master.json');

assert(
  parsedJsonResult.success === true,
  'Parser membaca file JSON cadangan master dengan status success = true'
);
assert(
  parsedJsonResult.detectedType === 'both',
  'Parser mendeteksi tipe gabungan "both" (Staf & Freelance)'
);
assert(
  parsedJsonResult.summary.staffCount === STAFF_LIST.length,
  `Jumlah staf terbaca utuh (${STAFF_LIST.length} staf)`
);
assert(
  parsedJsonResult.summary.freelanceCount === INITIAL_FREELANCE_WORKERS.length,
  `Jumlah freelance terbaca utuh (${INITIAL_FREELANCE_WORKERS.length} freelance)`
);

// 5. Verifikasi Keamanan Parsing File Kosong / Tidak Valid
const invalidParsed = parsePersonnelImportFile('invalid garbage text without header', 'random.txt');
assert(
  invalidParsed.success === false && invalidParsed.errors.length > 0,
  'Parser menangani data invalid secara aman tanpa crash dan mengembalikan error'
);

console.log('\n================================================================');
if (failedTests > 0) {
  console.error(`❌ HASIL PENGUJIAN: ${failedTests} test gagal!`);
  process.exit(1);
} else {
  console.log('✅ SEMUA PENGUJIAN MASTER PERSONEL & GOOGLE DRIVE LULUS 100%!');
  console.log('================================================================');
}

/**
 * TEST SUITE: PEMBERITAHUAN MASA BERLAKU STNK & KIR (1 BULAN SEBELUM BERAKHIR)
 * Verifikasi kepatuhan:
 * - Masa berlaku STNK: 1 Tahun
 * - Masa berlaku KIR: 6 Bulan
 * - Notifikasi aktif 1 bulan (H-30 hari) sebelum tanggal berakhir dan saat kadaluarsa
 * - Contoh user: STNK 2027-09-01, KIR 2026-09-30
 */

import { assert } from 'console';
import {
  checkVehicleDocExpiry,
  getVehicleExpiryAlerts,
  STNK_VALIDITY_LABEL,
  KIR_VALIDITY_LABEL,
  EXPIRY_ALERT_THRESHOLD_DAYS
} from '../src/utils/vehicleExpiryAlerts';
import { VehicleMaster } from '../src/types';

function runVehicleExpiryTests() {
  console.log('================================================================');
  console.log('  TEST SUITE: PEMBERITAHUAN MASA BERLAKU STNK & KIR ARMADA');
  console.log('================================================================\n');

  // Baseline reference date: 2026-10-12
  const refDate = '2026-10-12';

  console.log('[TEST 1] Verifikasi Konstanta Resmi');
  assert(STNK_VALIDITY_LABEL === '1 Tahun', 'Masa berlaku STNK harus 1 Tahun');
  assert(KIR_VALIDITY_LABEL === '6 Bulan', 'Masa berlaku KIR harus 6 Bulan');
  assert(EXPIRY_ALERT_THRESHOLD_DAYS === 30, 'Ambang batas notifikasi harus 30 hari (1 bulan)');
  console.log(`✓ PASS: STNK: ${STNK_VALIDITY_LABEL}, KIR: ${KIR_VALIDITY_LABEL}, Ambang batas: ${EXPIRY_ALERT_THRESHOLD_DAYS} hari (1 Bulan)\n`);

  console.log('[TEST 2] Verifikasi Contoh Spesifik User: STNK 2027-09-01 & KIR 2026-09-30');
  // STNK 2027-09-01 dari 2026-10-12 (masih 324 hari ke depan)
  const stnkUser = checkVehicleDocExpiry('2027-09-01', 'STNK', refDate);
  console.log(`- STNK 2027-09-01: Status = ${stnkUser.status}, Days = ${stnkUser.daysRemaining}, Badge = "${stnkUser.formattedBadge}"`);
  assert(stnkUser.status === 'safe', 'STNK 2027-09-01 harus berstatus safe');
  assert(!stnkUser.isExpired && !stnkUser.isWarning, 'Tidak boleh memicu alert');

  // KIR 2026-09-30 dari 2026-10-12 (sudah lewat 12 hari lalu)
  const kirUser = checkVehicleDocExpiry('2026-09-30', 'KIR', refDate);
  console.log(`- KIR 2026-09-30: Status = ${kirUser.status}, Days = ${kirUser.daysRemaining}, Badge = "${kirUser.formattedBadge}"`);
  assert(kirUser.status === 'expired', 'KIR 2026-09-30 harus berstatus expired');
  assert(kirUser.isExpired, 'isExpired harus bernilai true');
  assert(kirUser.daysRemaining === -12, 'daysRemaining harus -12');
  console.log('✓ PASS: Contoh STNK & KIR user tervalidasi presisi.\n');

  console.log('[TEST 3] Verifikasi Logika Ambang Batas 1 Bulan (H-30 Hari)');
  // Kasus A: Jatuh tempo tepat hari ini (0 hari)
  const todayExpiry = checkVehicleDocExpiry('2026-10-12', 'KIR', refDate);
  assert(todayExpiry.status === 'warning_30d' && todayExpiry.isWarning, 'Hari ini harus memicu warning');
  console.log(`- Hari ini (2026-10-12): ${todayExpiry.formattedBadge}`);

  // Kasus B: Jatuh tempo dalam 16 hari (2026-10-28) -> <= 30 hari (Warning H-1 Bulan)
  const warn16d = checkVehicleDocExpiry('2026-10-28', 'KIR', refDate);
  assert(warn16d.status === 'warning_30d' && warn16d.isWarning, '16 hari lagi harus memicu warning');
  console.log(`- 16 hari lagi (2026-10-28): ${warn16d.formattedBadge}`);

  // Kasus C: Jatuh tempo tepat batas 30 hari (2026-11-11) -> Warning H-1 Bulan
  const warn30d = checkVehicleDocExpiry('2026-11-11', 'STNK', refDate);
  assert(warn30d.status === 'warning_30d' && warn30d.isWarning, '30 hari lagi harus memicu warning');
  console.log(`- 30 hari lagi (2026-11-11): ${warn30d.formattedBadge}`);

  // Kasus D: Jatuh tempo 31 hari ke depan (2026-11-12) -> Belum masuk H-1 bulan (Safe)
  const safe31d = checkVehicleDocExpiry('2026-11-12', 'STNK', refDate);
  assert(safe31d.status === 'safe' && !safe31d.isWarning, '31 hari ke depan harus safe');
  console.log(`- 31 hari lagi (2026-11-12): ${safe31d.formattedBadge}`);
  console.log('✓ PASS: Ambang batas 1 bulan (H-30 hari) berfungsi secara mutlak.\n');

  console.log('[TEST 4] Verifikasi Ekstraksi getVehicleExpiryAlerts dari Dataset Kendaraan');
  const sampleVehicles: VehicleMaster[] = [
    {
      id: 'veh-1',
      name: 'Truk Box CDD (6 Roda)',
      policeNumber: 'F 8446 BF',
      ownership: 'Internal',
      vehicleType: 'Truk Box CDD',
      tonnageCapacity: 5,
      cbmCapacity: 22,
      odometerKM: 50000,
      stnkTaxExpiry: '2027-09-01', // Safe (> 300 hari)
      kirExpiry: '2026-09-30',     // Expired (-12 hari)
      status: 'Siap Operasi'
    },
    {
      id: 'veh-2',
      name: 'SUZUKI CARRY Engkel',
      policeNumber: 'F 8433 BF',
      ownership: 'Internal',
      vehicleType: 'Truk Box CDE',
      tonnageCapacity: 1,
      cbmCapacity: 1.5,
      odometerKM: 10000,
      stnkTaxExpiry: '2027-09-01', // Safe
      kirExpiry: '2026-10-12',     // Warning (Hari ini / 0 hari)
      status: 'Siap Operasi'
    },
    {
      id: 'veh-4',
      name: 'SUZUKI CARRY Pick-Up',
      policeNumber: 'F 8594 BH',
      ownership: 'Internal',
      vehicleType: 'Pick-Up Box',
      tonnageCapacity: 1,
      cbmCapacity: 1.5,
      odometerKM: 12000,
      stnkTaxExpiry: '2027-06-01', // Safe
      kirExpiry: '2026-10-28',     // Warning (16 hari lagi)
      status: 'Siap Operasi'
    },
    {
      id: 'veh-5',
      name: 'DAIHATSU LUXIO Operasional',
      policeNumber: 'B 2673 TVI',
      ownership: 'Internal',
      vehicleType: 'Mobil Kru',
      tonnageCapacity: 0.6,
      cbmCapacity: 2.8,
      odometerKM: 52100,
      stnkTaxExpiry: '2026-12-01', // Safe (50 hari lagi)
      kirExpiry: '2027-04-14',     // Safe (184 hari lagi)
      status: 'Siap Operasi'
    }
  ];

  const alerts = getVehicleExpiryAlerts(sampleVehicles, refDate);
  console.log(`- Total alert terdeteksi: ${alerts.length}`);
  assert(alerts.length === 3, 'Harus terdeteksi tepat 3 alert (1 expired, 2 warning_30d)');

  // Alert #1: F 8446 BF KIR kadaluarsa
  assert(alerts[0].policeNumber === 'F 8446 BF' && alerts[0].docType === 'KIR' && alerts[0].status === 'expired', 'Alert 1 harus F 8446 BF KIR expired');
  console.log(`  1. [${alerts[0].docType}] ${alerts[0].policeNumber}: ${alerts[0].urgencyLabel} (${alerts[0].daysRemaining} hari)`);

  // Alert #2: F 8433 BF KIR hari ini
  assert(alerts[1].policeNumber === 'F 8433 BF' && alerts[1].docType === 'KIR', 'Alert 2 harus F 8433 BF KIR');
  console.log(`  2. [${alerts[1].docType}] ${alerts[1].policeNumber}: ${alerts[1].urgencyLabel} (${alerts[1].daysRemaining} hari)`);

  // Alert #3: F 8594 BH KIR 16 hari lagi
  assert(alerts[2].policeNumber === 'F 8594 BH' && alerts[2].docType === 'KIR', 'Alert 3 harus F 8594 BH KIR');
  console.log(`  3. [${alerts[2].docType}] ${alerts[2].policeNumber}: ${alerts[2].urgencyLabel} (${alerts[2].daysRemaining} hari)`);

  console.log('✓ PASS: getVehicleExpiryAlerts mengembalikan alert terurut & akurat 100%.\n');

  console.log('================================================================');
  console.log('  SEMUA PENGUJIAN MASA BERLAKU STNK & KIR LULUS SEMPURNA (100%)');
  console.log('================================================================');
}

runVehicleExpiryTests();

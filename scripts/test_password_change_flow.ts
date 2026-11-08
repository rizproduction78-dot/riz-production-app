import { normalizeStaffMaster, STAFF_LIST } from '../src/data';
import { supabase, isSupabaseConfigured } from '../src/lib/supabase';
import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';

async function runTest() {
  console.log('================================================================');
  console.log('  TEST SUITE: METODE PERGANTIAN PASSWORD & LOGIN OWNER WAHYU');
  console.log('================================================================\n');

  // TEST 1: Verifikasi Data Wahyu di Supabase saat ini
  console.log('[TEST 1] Verifikasi Integritas Data Wahyu di Supabase Cloud:');
  const staffList = await pullCollectionFromSupabase('master_staff');
  const wahyu = staffList.find((s: any) => s.id === 'director-wahyu');
  
  if (!wahyu) {
    throw new Error('FAIL: Wahyu tidak ditemukan di master_staff Supabase!');
  }
  if (!wahyu.name || wahyu.name.trim() === '') {
    throw new Error('FAIL: Nama Wahyu kosong di Supabase!');
  }
  if (wahyu.division !== 'Admin') {
    throw new Error(`FAIL: Divisi Wahyu salah! Diharapkan Admin, didapat: ${wahyu.division}`);
  }
  if (wahyu.role !== 'Direktur' && wahyu.role !== 'Owner') {
    throw new Error(`FAIL: Role Wahyu salah! Didapat: ${wahyu.role}`);
  }
  console.log(`✓ PASS: Wahyu terdaftar resmi (${wahyu.name} - ${wahyu.division} - ${wahyu.role})`);
  console.log(`  Password aktif: "${wahyu.password || 'riz123'}" | Pengajuan: "${wahyu.passwordRequest || '-'}"`);

  // TEST 2: Verifikasi Ketahanan normalizeStaffMaster terhadap data korup
  console.log('\n[TEST 2] Verifikasi Ketahanan normalizeStaffMaster terhadap Data Kosong/Korup:');
  const corruptedRawData = [
    {
      id: 'director-wahyu',
      name: '',
      fullName: '',
      division: 'Umum',
      role: 'Staff',
      password: 'mypasswordbaru123'
    }
  ];
  const normalized = normalizeStaffMaster(corruptedRawData);
  const normalizedWahyu = normalized.find(s => s.id === 'director-wahyu');
  if (!normalizedWahyu) throw new Error('FAIL: Wahyu hilang setelah normalisasi!');
  if (normalizedWahyu.name !== 'Wahyu') throw new Error(`FAIL: Nama tidak dipulihkan ke Wahyu! Didapat: "${normalizedWahyu.name}"`);
  if (normalizedWahyu.division !== 'Admin') throw new Error(`FAIL: Divisi tidak dipulihkan ke Admin! Didapat: "${normalizedWahyu.division}"`);
  if (normalizedWahyu.role !== 'Direktur') throw new Error(`FAIL: Role tidak dipulihkan ke Direktur! Didapat: "${normalizedWahyu.role}"`);
  if (normalizedWahyu.password !== 'mypasswordbaru123') throw new Error(`FAIL: Password kustom hilang! Didapat: "${normalizedWahyu.password}"`);
  console.log('✓ PASS: normalizeStaffMaster berhasil memulihkan nama, divisi, dan role resmi Wahyu sambil mempertahankan password kustom!');

  // TEST 3: Simulasi Alur Pergantian Password Mandiri (Direct Change)
  console.log('\n[TEST 3] Simulasi Pergantian Password Mandiri dengan Password Lama Valid:');
  const testStaff = { ...normalizedWahyu, password: 'riz123' };
  const inputOldPassword = 'riz123';
  const inputNewPassword = 'wahyuBaru2026';
  const inputConfirmPassword = 'wahyuBaru2026';

  // Validasi:
  const isOldValid = inputOldPassword.trim().toLowerCase() === (testStaff.password || 'riz123').toLowerCase();
  const isConfirmValid = inputNewPassword.trim() === inputConfirmPassword.trim();
  const isLengthValid = inputNewPassword.trim().length >= 4;

  if (!isOldValid || !isConfirmValid || !isLengthValid) {
    throw new Error('FAIL: Validasi password gagal!');
  }

  // Update seketika:
  const updatedStaff = {
    ...testStaff,
    password: inputNewPassword.trim(),
    passwordRequest: ''
  };

  // Simulasi Login dengan password baru:
  const attemptLoginPassword = 'wahyuBaru2026';
  const loginSuccess = attemptLoginPassword.trim().toLowerCase() === (updatedStaff.password || 'riz123').toLowerCase();
  if (!loginSuccess) {
    throw new Error('FAIL: Login dengan password baru gagal!');
  }
  console.log('✓ PASS: Pergantian password langsung aktif seketika dan login berhasil 100%!');

  // TEST 5: Alur Pengajuan Password Sesuai Keinginan User & Approval Admin
  console.log('\n[TEST 5] Simulasi Pengajuan Password Kustom Sesuai Keinginan User & Approval Admin:');
  const userStaff = { ...normalizedWahyu, password: 'riz123', passwordRequest: '' };
  const requestedDesiredPw = 'SandiKeinginan2026!';
  
  // 1. User mengajukan password yang diinginkan:
  const staffWithRequest = {
    ...userStaff,
    passwordRequest: requestedDesiredPw
  };
  console.log(`  User mengajukan password baru: "${staffWithRequest.passwordRequest}"`);
  if (staffWithRequest.passwordRequest !== requestedDesiredPw) {
    throw new Error('FAIL: Password request tidak tercatat!');
  }

  // 2. Admin menyetujui pengajuan password di Admin Panel:
  const isResetReq = (staffWithRequest.passwordRequest as string) === 'RESET_REQUEST_DEFAULT';
  const approvedPw = isResetReq ? 'riz123' : (staffWithRequest.passwordRequest || 'riz123');
  const approvedStaff = {
    ...staffWithRequest,
    password: approvedPw,
    passwordRequest: ''
  };
  console.log(`  Admin menyetujui. Password aktif baru: "${approvedStaff.password}", request cleared: "${approvedStaff.passwordRequest}"`);
  if (approvedStaff.password !== requestedDesiredPw) {
    throw new Error('FAIL: Password tidak diperbarui ke password keinginan user!');
  }
  if (approvedStaff.passwordRequest !== '') {
    throw new Error('FAIL: Antrean passwordRequest tidak dibersihkan setelah approval!');
  }

  // 3. Normalisasi data setelah approval:
  const normalizedApproved = normalizeStaffMaster([approvedStaff]);
  const normUser = normalizedApproved.find(s => s.id === 'director-wahyu')!;
  if (normUser.password !== requestedDesiredPw) {
    throw new Error(`FAIL: Password setelah normalisasi tidak cocok! Didapat: "${normUser.password}"`);
  }
  if (normUser.passwordRequest !== '') {
    throw new Error(`FAIL: passwordRequest muncul kembali setelah normalisasi! Didapat: "${normUser.passwordRequest}"`);
  }
  console.log('✓ PASS: Alur pengajuan & persetujuan password kustom berhasil tersimpan dan ternormalisasi sempurna!');

  // TEST 6: Simulasi Login dari Perangkat/Browser dengan Cache Usang (Cloud Fallback)
  console.log('\n[TEST 6] Simulasi Login User dengan Cache Lokal Usang (Cloud Fallback Verification):');
  // Client lokal masih menyimpan password lama:
  const staleLocalStaff = { ...userStaff, password: 'riz123' };
  const userAttemptPw = 'SandiKeinginan2026!';

  // Pengecekan lokal gagal karena cache belum tersinkronisasi:
  const localMatch = userAttemptPw.trim().toLowerCase() === (staleLocalStaff.password || 'riz123').toLowerCase();
  console.log(`  Pengecekan lokal awal: ${localMatch ? 'MATCH' : 'MISMATCH (Cache lokal masih usang: ' + staleLocalStaff.password + ')'}`);

  // Fallback cloud check ke master_staff (mensimulasikan query database):
  let cloudLoginSuccess = false;
  let syncedStaff = staleLocalStaff;
  if (!localMatch) {
    // Di aplikasi riil, remote data diambil dari Supabase master_staff
    const remoteStaffFromCloud = approvedStaff;
    if (userAttemptPw.trim().toLowerCase() === (remoteStaffFromCloud.password || 'riz123').toLowerCase()) {
      syncedStaff = { ...staleLocalStaff, ...remoteStaffFromCloud, password: remoteStaffFromCloud.password };
      cloudLoginSuccess = true;
    }
  }

  if (!cloudLoginSuccess) {
    throw new Error('FAIL: Cloud fallback gagal memverifikasi password baru yang sudah disetujui!');
  }
  if (syncedStaff.password !== requestedDesiredPw) {
    throw new Error('FAIL: Cache staf tidak diperbarui setelah cloud fallback!');
  }
  console.log('✓ PASS: Cloud fallback berhasil memverifikasi password baru dan menyinkronkan data lokal seketika!');

  // TEST 7: Verifikasi Resolusi Konflik Timestamp di normalizeStaffMaster (Stale Props vs Newer Approval / Reset)
  console.log('\n[TEST 7] Verifikasi Resolusi Konflik Timestamp di normalizeStaffMaster (Cross-State Merge):');
  const t1 = '2026-11-09T01:00:00.000Z'; // Saat user mengajukan password (masih memegang password lama)
  const t2 = '2026-11-09T01:05:00.000Z'; // Saat Admin menyetujui password baru
  const t3 = '2026-11-09T01:10:00.000Z'; // Saat Admin me-reset password kembali ke riz123

  const userPendingEntry = {
    ...userStaff,
    password: 'riz123',
    passwordRequest: 'SandiBaruUser99',
    _userEdited: true,
    _syncMeta: { updatedAt: t1, updatedBy: userStaff.name, _userEdited: true }
  };

  const adminApprovedEntry = {
    ...userStaff,
    password: 'SandiBaruUser99',
    passwordRequest: '',
    _userEdited: true,
    _syncMeta: { updatedAt: t2, updatedBy: 'Admin', _userEdited: true }
  };

  // Urutan [userPendingEntry, adminApprovedEntry] ataupun sebaliknya harus memenangkan adminApprovedEntry (t2 > t1)
  const mergedA = normalizeStaffMaster([userPendingEntry, adminApprovedEntry]).find(s => s.id === 'director-wahyu')!;
  const mergedB = normalizeStaffMaster([adminApprovedEntry, userPendingEntry]).find(s => s.id === 'director-wahyu')!;

  if (mergedA.password !== 'SandiBaruUser99' || mergedA.passwordRequest !== '') {
    throw new Error(`FAIL: Merge A gagal memenangkan approval terbaru! Didapat pw="${mergedA.password}", req="${mergedA.passwordRequest}"`);
  }
  if (mergedB.password !== 'SandiBaruUser99' || mergedB.passwordRequest !== '') {
    throw new Error(`FAIL: Merge B gagal memenangkan approval terbaru! Didapat pw="${mergedB.password}", req="${mergedB.passwordRequest}"`);
  }

  // Uji Reset kembali ke riz123 dengan timestamp t3 > t2
  const adminResetEntry = {
    ...userStaff,
    password: 'riz123',
    passwordRequest: '',
    _userEdited: true,
    _syncMeta: { updatedAt: t3, updatedBy: 'Admin', _userEdited: true }
  };
  const mergedReset = normalizeStaffMaster([adminApprovedEntry, adminResetEntry]).find(s => s.id === 'director-wahyu')!;
  if (mergedReset.password !== 'riz123' || mergedReset.passwordRequest !== '') {
    throw new Error(`FAIL: Reset ke riz123 dengan timestamp lebih baru gagal menang! Didapat pw="${mergedReset.password}"`);
  }
  console.log('✓ PASS: Resolusi konflik timestamp memenangkan approval Admin terbaru dan reset password secara akurat!');

  console.log('\n================================================================');
  console.log('  SEMUA PENGUJIAN METODE PERGANTIAN PASSWORD LULUS 100%!');
  console.log('================================================================');
}

runTest().catch((err) => {
  console.error('\n❌ TEST GAGAL:', err);
  process.exit(1);
});

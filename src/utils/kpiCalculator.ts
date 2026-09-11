/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL PERHITUNGAN KPI RESMI SEMUA STAFF
 * PT. RIZ PRODUCTION MULTI KREASI
 * 
 * SUMBER ACUAN RESMI PRIORITAS PENILAIAN UTAMA KPI:
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc/edit?gid=198998470#gid=198998470
 * 
 * PRINSIP INTEGRITAS DATA:
 * - 100% Data Riil dari input operasional & spreadsheet resmi (tanpa halusinasi/data fiktif)
 * 
 * URUTAN PENILAIAN & PERANGKINGAN RESMI:
 * 1. Daily Report (Laporan Harian Operasional Lapangan & Event) - Bobot 25%
 * 2. QC Checklist Onhouse (Inspeksi & Kesiapan Alat Gudang) - Bobot 20%
 * 3. Work Order (WO) Selesai & Temuan Kerusakan Ditangani - Bobot 10%
 * 4. Uji Kompetensi yang Diikuti (6 Modul Standar Kelistrikan & Teknis) - Bobot 15%
 * 5. Kehadiran & Shift Roster Riil (Jadwal Dinas 1-31) - Bobot 15%
 * 6. Disiplin & Teamwork - Bobot 15%
 */

export const KPI_SPREADSHEET_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc/edit?gid=198998470#gid=198998470';
export const KPI_SPREADSHEET_GID = '198998470';

import { Staff, Division, DailyReport, LogbookEntry, Finding, AttendanceLog, WorkOrder } from '../types';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE, StaffScheduleRow } from '../data/september2026Schedule';

export interface StaffKpiResult {
  id: string;
  staffId: string;
  name: string;
  division: string;
  role: string;
  
  // 1. Absensi (Jumlah Absen & Kehadiran) - DITAMBAHKAN
  attendanceCount: number; // Jumlah kehadiran/absen riil
  attendanceTarget: number; // Target hari kerja (24 hari)
  attendanceScore: number;  // 0 - 100%
  
  // 2. Uji Kompetensi yang Diikuti - DITAMBAHKAN
  competencyCount: number;  // Jumlah unit kompetensi yang telah diuji & diverifikasi (0 - 6)
  competencyTotal: number;  // Total unit uji kompetensi (6)
  competencyScore: number;  // 0 - 100%
  
  // 3. Disiplin (TETAP ADA)
  disciplineScore: number;

  // 4. Produktivitas / Daily Task (TETAP ADA)
  reports: number;
  reportsCount: number;
  reportScore: number;
  
  // 5. Quality / QC Checklist (TETAP ADA)
  qcs: number;
  qcCount: number;
  qcScore: number;
  
  // 6. Kompleksitas Tugas & Work Order (TETAP ADA)
  wos: number;
  woCount: number;
  woScore: number;
  taskComplexityScore: number;

  // 7. Pengembangan Diri & Teamwork (TETAP ADA)
  teamworkScore: number;
  
  // Jam Kerja
  hours: number;
  
  // Total Nilai Akhir KPI
  kpi: number; // 0 - 100%
  grade: 'A' | 'B' | 'C' | 'D';
}

// Comprehensive Staff Aliases & Nickname Dictionaries (Mapping all variations used in the field)
export const KNOWN_STAFF_ALIASES: Record<string, string[]> = {
  // Gudang
  'staff-absobur': ['abah sobur', 'abah', 'sobur', 'abik'],
  'staff-gatot': ['gatot wiliyanto', 'gatot', 'wiliyanto', 'mas gatot'],
  'staff-udin': ['udin saepudin', 'udin', 'saepudin', 'mang ube', 'mang ubed', 'ube', 'ubed', 'mangudin', 'mang udin'],
  
  // Admin / Manajemen
  'director-wahyu': ['wahyu', 'pak wahyu', 'owner wahyu', 'direktur wahyu', 'direktur', 'owner'],
  'staff-agustino': ['agustino setiawan', 'agustino', 'agus', 'setiawan', 'agustinus'],
  'staff-fahrul': ['m. fahruyana . a', 'm. fahruyana', 'm fahruyana', 'fahruyana', 'fahrul', 'rullyana', 'rully', 'm fahrul', 'pak fahrul'],
  'staff-syalsa': ['syalsa sri hestariana', 'syalsa', 'caca', 'hestariana', 'teh caca'],
  'staff-seno': ['seno subroto', 'seno', 'subroto', 'om seno', 'pak seno'],
  
  // Videotron / LED
  'staff-ayong': ['ayong sumarsih', 'ayong', 'sumarsih', 'prabu', 'prabuam', 'kang ayong'],
  'staff-dedi': ['dedi agus wigiantoro', 'dedi agus', 'dedy', 'dedi', 'wigi', 'wigiantoro', 'mas wigi'],
  'staff-irvan': ['muhamad irvan', 'muhammad irvan', 'muhamad irfan', 'muhammad irfan', 'irvan', 'irfan', 'irfanthepul'],
  
  // Multimedia
  'staff-mulyadi': ['mulyadi', 'jay', 'jaymulyadi', 'jay mulyadi', 'bang jay'],
  
  // Lighting
  'staff-heri': ['heri', 'heriansyah', 'saputra', 'kang heri'],
  
  // Sound / Audio
  'staff-iwan': ['iwan kurniawan', 'iwan', 'kurniawan', 'butonk', 'butong', 'boetonk', 'boetonk2785', 'kang butonk', 'kang butong'],
  'staff-rahmat': ['muhamad rahmat', 'muhammad rahmat', 'rahmat', 'mboh', 'outsideprojectmboh', 'kang mboh', 'mas mboh'],
  'staff-ramdani': ['ramdani', 'dani', 'ismail ramdani', 'ismail', 'ismailramdani'],
  'staff-suryana': ['suryana', 'nana', 'buluk', 'bulux', 'kang nana', 'kang buluk', 'nana buluk'],
  'staff-unyin': ['wahyudin', 'unyin', 'unyim', 'kang unyim', 'kang unyin'],
  'staff-taufik': ['taufik diana', 'taufik', 'diana', 'opik', 'topik', 'taufikdya', 'kang opik', 'opik diana'],
  'staff-yudish': ['yudishtira purnama a', 'yudishtira', 'yudis', 'yudhis', 'purnama', 'yudhisintan'],
  
  // Service
  'staff-damri': ['damri', 'mang damri', 'mangdamri', 'pak damri'],
  'staff-mulyana': ['mulyana', 'kharo', 'karo', 'kharro', 'tabita', 'tabitakharo', 'mulyana kharo', 'mulyana karo', 'kharo mulyana', 'karo mulyana', 'kang kharo', 'kang karo', 'kang kharro']
};

export const STAFF_NAME_ALIAS_MAP: Record<string, string[]> = {
  'Abah Sobur': ['abah sobur', 'abah', 'sobur'],
  'Gatot Wiliyanto': ['gatot wiliyanto', 'gatot', 'wiliyanto'],
  'Udin Saepudin': ['udin saepudin', 'udin', 'saepudin', 'mang ube', 'mang ubed', 'ube', 'ubed', 'mangudin', 'mang udin'],
  'Wahyu': ['wahyu', 'pak wahyu', 'owner wahyu', 'direktur wahyu'],
  'Agustino Setiawan': ['agustino setiawan', 'agustino', 'agus', 'setiawan'],
  'M. Fahruyana . A': ['m. fahruyana . a', 'm. fahruyana', 'fahruyana', 'fahrul', 'rullyana', 'rully', 'm fahrul'],
  'Syalsa Sri Hestariana': ['syalsa sri hestariana', 'syalsa', 'caca', 'hestariana'],
  'Seno Subroto': ['seno subroto', 'seno', 'subroto', 'om seno'],
  'Ayong Sumarsih': ['ayong sumarsih', 'ayong', 'sumarsih', 'prabu'],
  'Dedi Agus Wigiantoro': ['dedi agus wigiantoro', 'dedi agus', 'dedy', 'dedi', 'wigi', 'wigiantoro'],
  'Muhamad Irvan': ['muhamad irvan', 'muhammad irvan', 'muhamad irfan', 'irvan', 'irfan'],
  'Mulyadi': ['mulyadi', 'jay', 'jaymulyadi', 'jay mulyadi'],
  'Heri': ['heri', 'heriansyah', 'saputra'],
  'Iwan Kurniawan': ['iwan kurniawan', 'iwan', 'kurniawan', 'butonk', 'butong', 'boetonk'],
  'Muhamad Rahmat': ['muhamad rahmat', 'muhammad rahmat', 'rahmat', 'mboh'],
  'Ramdani': ['ramdani', 'dani', 'ismail ramdani', 'ismail'],
  'Suryana': ['suryana', 'nana', 'buluk', 'bulux', 'kang nana', 'kang buluk', 'nana buluk'],
  'Wahyudin': ['wahyudin', 'unyin', 'unyim', 'kang unyim', 'kang unyin'],
  'Taufik Diana': ['taufik diana', 'taufik', 'diana', 'opik', 'topik'],
  'Yudishtira Purnama A': ['yudishtira purnama a', 'yudishtira', 'yudis', 'yudhis', 'purnama'],
  'Damri': ['damri', 'mang damri', 'mangdamri'],
  'Mulyana': ['mulyana', 'kharo', 'karo', 'kharro', 'tabita', 'mulyana kharo', 'mulyana karo', 'kharo mulyana', 'karo mulyana'],
  'Kharo': ['mulyana', 'kharo', 'karo', 'kharro', 'tabita', 'mulyana kharo', 'mulyana karo', 'kharo mulyana', 'karo mulyana'],
  'KARO': ['mulyana', 'kharo', 'karo', 'kharro', 'tabita', 'mulyana kharo', 'mulyana karo', 'kharo mulyana', 'karo mulyana'],
  'Mulyana (Kharo)': ['mulyana', 'kharo', 'karo', 'kharro', 'tabita', 'mulyana kharo', 'mulyana karo', 'kharo mulyana', 'karo mulyana']
};

/**
 * Mengambil semua kemungkinan alias, nama panggilan, variasi ejaan resmi & lapangan untuk seorang staff
 */
export function getAllStaffAliases(staff: Staff): string[] {
  const set = new Set<string>();

  if (staff.id && KNOWN_STAFF_ALIASES[staff.id]) {
    KNOWN_STAFF_ALIASES[staff.id].forEach(a => set.add(a.toLowerCase().trim()));
  }

  if (staff.name && STAFF_NAME_ALIAS_MAP[staff.name]) {
    STAFF_NAME_ALIAS_MAP[staff.name].forEach(a => set.add(a.toLowerCase().trim()));
  }

  // Cross check by name match in dictionary
  for (const [sName, aliases] of Object.entries(STAFF_NAME_ALIAS_MAP)) {
    const sNameNorm = sName.toLowerCase().trim();
    const curNameNorm = (staff.name || '').toLowerCase().trim();
    if (curNameNorm === sNameNorm || curNameNorm.includes(sNameNorm) || sNameNorm.includes(curNameNorm)) {
      aliases.forEach(a => set.add(a.toLowerCase().trim()));
    }
  }

  if (staff.name) set.add(staff.name.toLowerCase().trim());
  if (staff.nickname) set.add(staff.nickname.toLowerCase().trim());
  if (staff.fullName) set.add(staff.fullName.toLowerCase().trim());
  if (staff.email) {
    const emailPrefix = staff.email.split('@')[0].toLowerCase().trim();
    if (emailPrefix.length >= 3) set.add(emailPrefix);
  }

  return Array.from(set).filter(Boolean);
}

/**
 * Helper pencocokan nama staff cerdas dan toleran:
 * - Mendukung nama lengkap KTP, nama panggilan lapangan (Opik, Mboh, Jay, Kharo, Dani, Buluk, Butonk, Unyim, Wigi, Caca, Mang ube, dll)
 * - Mendukung format gabungan PIC tim (e.g. "Opik / Buluk", "Opik, Mboh", "Mboh, Yudis, Buluk, Butong", "Team Service / Mboh", "Damri & Kharo")
 */
export function isStaffMatch(staff: Staff, inputName?: string): boolean {
  if (!staff || !inputName) return false;
  
  const rawInput = inputName.toLowerCase().trim();
  if (!rawInput) return false;

  const aliases = getAllStaffAliases(staff);
  
  // 1. Direct exact match check
  for (const alias of aliases) {
    if (rawInput === alias) {
      if (staff.id === 'director-wahyu' && (rawInput === 'wahyudin' || rawInput === 'unyin' || rawInput === 'unyim')) return false;
      if (staff.id === 'staff-unyin' && (rawInput === 'wahyu' || rawInput === 'pak wahyu' || rawInput === 'direktur' || rawInput === 'owner')) return false;
      if (staff.id === 'staff-udin' && (rawInput === 'wahyudin' || rawInput === 'unyin' || rawInput === 'unyim')) return false;
      if (staff.id === 'staff-agustino' && (rawInput === 'dedi' || rawInput === 'wigi' || rawInput === 'dedy' || rawInput === 'dedi agus')) return false;
      return true;
    }
  }

  // 2. Tokenized match (handling separators like commas, slashes, ampersands, pluses, 'dan', 'and', 'bersama', etc.)
  const tokens = rawInput
    .split(/[,/&+;\n|()]|\s+dan\s+|\s+and\s+|\s+bersama\s+|\s+team\s+/i)
    .map(t => t.replace(/[^a-zA-Z0-9\s.]/g, ' ').trim().toLowerCase())
    .filter(t => t.length > 0);

  for (const token of tokens) {
    // Check token-specific safeguards
    if (staff.id === 'director-wahyu' && (token === 'wahyudin' || token === 'unyin' || token === 'unyim')) continue;
    if (staff.id === 'staff-unyin' && (token === 'wahyu' || token === 'pak wahyu' || token === 'direktur' || token === 'owner')) continue;
    if (staff.id === 'staff-udin' && (token === 'wahyudin' || token === 'unyin' || token === 'unyim')) continue;
    if (staff.id === 'staff-agustino' && (token === 'dedi' || token === 'wigi' || token === 'dedy' || token === 'dedi agus')) continue;
    if (staff.id === 'staff-suryana' && (token.includes('iwan') || token.includes('kurniawan') || token.includes('butong') || token.includes('butonk'))) continue;

    for (const alias of aliases) {
      if (token === alias) return true;
      if (alias.length >= 3 && token.length >= 3) {
        if (token === alias || token.includes(alias) || alias.includes(token)) {
          return true;
        }
      }
    }
  }

  // 3. If single-person string, word-boundary substring regex search across full input text
  if (tokens.length <= 1) {
    if (staff.id === 'director-wahyu' && (rawInput.includes('wahyudin') || rawInput.includes('unyin') || rawInput.includes('unyim'))) return false;
    if (staff.id === 'staff-unyin' && (rawInput === 'wahyu' || rawInput === 'pak wahyu' || rawInput === 'direktur' || rawInput === 'owner')) return false;
    if (staff.id === 'staff-udin' && (rawInput.includes('wahyudin') || rawInput.includes('unyin') || rawInput.includes('unyim'))) return false;
    if (staff.id === 'staff-agustino' && (rawInput.includes('dedi') || rawInput.includes('wigi') || rawInput.includes('dedy'))) return false;
    if (staff.id === 'staff-suryana' && (rawInput.includes('iwan') || rawInput.includes('kurniawan') || rawInput.includes('butong') || rawInput.includes('butonk'))) return false;

    for (const alias of aliases) {
      if (alias.length >= 3) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
        if (regex.test(rawInput)) return true;
      }
    }
  }

  return false;
}

/**
 * Mengambil seluruh divisi yang diemban oleh staff.
 * Mendukung staff dengan peran multi-divisi (misalnya: Mulyana/Kharo di Videotron dan Service).
 */
export function getStaffDivisions(staff: Staff | null | undefined): Division[] {
  if (!staff) return [];
  const divs: Division[] = [];
  if (staff.division) divs.push(staff.division);
  if (staff.secondaryDivision && !divs.includes(staff.secondaryDivision)) {
    divs.push(staff.secondaryDivision);
  }
  if (Array.isArray(staff.divisions)) {
    staff.divisions.forEach(d => {
      if (!divs.includes(d)) divs.push(d);
    });
  }
  // Khusus Mulyana / Kharo: Selalu berada di 2 posisi divisi resmi: Videotron & Service
  const sId = (staff.id || '').toLowerCase();
  const sName = (staff.name || '').toLowerCase();
  const sNick = (staff.nickname || '').toLowerCase();
  if (sId === 'staff-mulyana' || sName.includes('mulyana') || sNick.includes('kharo') || sNick.includes('karo')) {
    if (!divs.includes('Service')) divs.push('Service');
    if (!divs.includes('Videotron')) divs.push('Videotron');
  }
  return divs;
}

/**
 * Memeriksa apakah staff terdaftar pada divisi tertentu (mendukung multi-divisi).
 */
export function isStaffInDivision(staff: Staff | null | undefined, targetDivision: Division | string): boolean {
  if (!staff || !targetDivision) return false;
  const staffDivs = getStaffDivisions(staff);
  return staffDivs.some(d => d.toLowerCase() === targetDivision.toLowerCase());
}

/**
 * Menghitung KPI akurat untuk seorang staff dengan menghitung:
 * - Komponen asli: Disiplin, Produktivitas, Quality, Kompleksitas Tugas, Teamwork
 * - DITAMBAH DENGAN: Jumlah Absen & Uji Kompetensi yang Diikuti
 */
export function calculateStaffKpi(
  staff: Staff,
  dailyReports: DailyReport[] = [],
  logbookEntries: LogbookEntry[] = [],
  findings: Finding[] = [],
  attendanceLogsOverride?: AttendanceLog[],
  electricalCompetenciesOverride?: Record<string, Record<string, { verified: boolean }>>,
  septemberScheduleOverride?: StaffScheduleRow[],
  workOrdersOverride?: WorkOrder[]
): StaffKpiResult {
  // ─────────────────────────────────────────────────────────────
  // 1. MENGHITUNG JUMLAH ABSEN (KEHADIRAN) - DATA RESMI
  // ─────────────────────────────────────────────────────────────
  let realLogs: AttendanceLog[] = attendanceLogsOverride || [];
  if (!attendanceLogsOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_attendance_logs');
      if (saved) realLogs = JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  const staffLogsCount = realLogs.filter(
    l => (l.staffId === staff.id || isStaffMatch(staff, l.staffName)) &&
         (l.status === 'Hadir' || l.checkInTime)
  ).length;

  const scheduleRows = septemberScheduleOverride || OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  const staffScheduleRow = scheduleRows.find(
    r => isStaffMatch(staff, r.name)
  );

  let scheduledWorkingDays = 0;
  if (staffScheduleRow && staffScheduleRow.shifts) {
    for (let day = 1; day <= 30; day++) {
      const shift = staffScheduleRow.shifts[day];
      if (shift && shift !== 'L' && shift !== 'Cuti' && shift !== '-' && shift !== 'Libur') {
        scheduledWorkingDays++;
      }
    }
  }

  // Kehadiran riil: jika ada log presensi gunakan log, jika tidak gunakan total jadwal dinas resmi
  const attendanceCount = staffLogsCount > 0 ? staffLogsCount : scheduledWorkingDays;
  const attendanceTarget = scheduledWorkingDays > 0 ? scheduledWorkingDays : 24;
  const attendanceScore = attendanceTarget > 0 ? Math.min(100, Math.round((attendanceCount / attendanceTarget) * 100)) : 0;

  // ─────────────────────────────────────────────────────────────
  // 2. MENGHITUNG UJI KOMPETENSI YANG DIIKUTI - DITAMBAHKAN
  // ─────────────────────────────────────────────────────────────
  let competenciesData: Record<string, Record<string, { verified: boolean }>> = electricalCompetenciesOverride || {};
  if (!electricalCompetenciesOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_staff_electrical_competencies');
      if (saved) competenciesData = JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }

  const staffCompMap = competenciesData[staff.id] || {};
  const compKeys = ['comp_safety', 'comp_multimeter', 'comp_soldering', 'comp_phase_load', 'comp_grounding', 'comp_troubleshoot'];
  
  let competencyCount = 0;
  compKeys.forEach(k => {
    if (staffCompMap[k]?.verified) {
      competencyCount++;
    }
  });

  const competencyTotal = 6;
  const competencyScore = Math.round((competencyCount / competencyTotal) * 100);

  // ─────────────────────────────────────────────────────────────
  // 3. DISIPLIN KERJA (Non-aktif sementara)
  // ─────────────────────────────────────────────────────────────
  const disciplineScore = 0;

  // ─────────────────────────────────────────────────────────────
  // 4. PRODUKTIVITAS / DAILY TASK (Murni dari laporan harian yang diinput)
  // ─────────────────────────────────────────────────────────────
  const realReportsCount = dailyReports.filter(r => isStaffMatch(staff, r.staffName)).length;
  const reportsCount = realReportsCount;
  const reportScore = Math.min(100, Math.round((reportsCount / 2) * 100));

  // ─────────────────────────────────────────────────────────────
  // 5. QUALITY / QC CHECKLIST (Murni dari checklist QC & inspeksi teknis lapangan)
  // ─────────────────────────────────────────────────────────────
  const isNonQcDivision = ['Gudang', 'Admin'].includes(staff.division);
  const realQcCount = Math.max(
    logbookEntries.filter(e => isStaffMatch(staff, e.staffName)).length,
    dailyReports.filter(r => isStaffMatch(staff, r.staffName) && (
      r.activity?.toLowerCase().includes('cek') ||
      r.activity?.toLowerCase().includes('qc') ||
      r.activity?.toLowerCase().includes('cleaning') ||
      r.activity?.toLowerCase().includes('test') ||
      r.activity?.toLowerCase().includes('inspeksi') ||
      r.activity?.toLowerCase().includes('repair') ||
      r.activity?.toLowerCase().includes('perbaikan')
    )).length
  );
  const qcCount = isNonQcDivision ? 0 : realQcCount;
  const qcScore = isNonQcDivision ? 80 : (qcCount === 0 ? 0 : Math.min(100, Math.round((qcCount / 2) * 100)));

  // ─────────────────────────────────────────────────────────────
  // 6. KOMPLEKSITAS TUGAS & WORK ORDER (Murni dari WO yang diselesaikan & Temuan Closed)
  // ─────────────────────────────────────────────────────────────
  const realClosedFindingsCount = findings.filter(f => isStaffMatch(staff, f.pic) && f.status === 'Close').length;
  
  let realWOs: WorkOrder[] = workOrdersOverride || [];
  if (!workOrdersOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_work_orders');
      if (saved) realWOs = JSON.parse(saved);
    } catch (e) {}
  }
  const realCompletedWOCount = realWOs.filter(w => isStaffMatch(staff, w.pic) && (w.status === 'Completed' || w.progress === 100)).length;

  const woCount = Math.max(realClosedFindingsCount, realCompletedWOCount, (realClosedFindingsCount + realCompletedWOCount > 0) ? Math.max(realClosedFindingsCount, realCompletedWOCount) : 0);
  const woScore = Math.min(100, Math.round((woCount / 1) * 100));
  const taskComplexityScore = woScore;

  // ─────────────────────────────────────────────────────────────
  // 7. PENGEMBANGAN DIRI & TEAMWORK (Dari keaktifan uji kompetensi & laporan)
  // ─────────────────────────────────────────────────────────────
  const teamworkScore = Math.round((competencyScore * 0.5) + (reportScore * 0.5));

  // Jam kerja (Non-aktif sementara)
  const baseHours = 0;

  // ─────────────────────────────────────────────────────────────
  // 8. TOTAL NILAI KPI (KEHADIRAN DIAKTIFKAN KEMBALI)
  // ─────────────────────────────────────────────────────────────
  // Komposisi:
  // Divisi Non-QC (Gudang, Admin):
  // - Kehadiran: 15%
  // - Daily Report: 35%
  // - Work Order Selesai: 20%
  // - Uji Kompetensi: 15%
  // - Teamwork & Pengembangan Diri: 15%
  //
  // Divisi Teknis QC (Audio, Lighting, Videotron, Multimedia, Service):
  // - Kehadiran: 15%
  // - Daily Report: 25%
  // - QC Checklist: 25%
  // - Work Order Selesai: 15%
  // - Uji Kompetensi: 15%
  // - Teamwork & Pengembangan Diri: 5%
  let totalKpi: number;
  if (isNonQcDivision) {
    totalKpi = Math.round(
      (attendanceScore * 0.15) +
      (reportScore * 0.35) +
      (woScore * 0.20) +
      (competencyScore * 0.15) +
      (teamworkScore * 0.15)
    );
  } else {
    totalKpi = Math.round(
      (attendanceScore * 0.15) +
      (reportScore * 0.25) +
      (qcScore * 0.25) +
      (woScore * 0.15) +
      (competencyScore * 0.15) +
      (teamworkScore * 0.05)
    );
  }

  const kpi = Math.min(100, Math.max(0, totalKpi));

  let grade: 'A' | 'B' | 'C' | 'D' = 'D';
  if (kpi >= 90) grade = 'A';
  else if (kpi >= 80) grade = 'B';
  else if (kpi >= 70) grade = 'C';
  else grade = 'D';

  return {
    id: staff.id,
    staffId: staff.id,
    name: staff.name,
    division: staff.division,
    role: staff.role,
    attendanceCount: attendanceCount,
    attendanceTarget,
    attendanceScore: attendanceScore,
    competencyCount,
    competencyTotal,
    competencyScore,
    disciplineScore: 0,
    reports: reportsCount,
    reportsCount,
    reportScore,
    qcs: qcCount,
    qcCount,
    qcScore,
    wos: woCount,
    woCount,
    woScore,
    taskComplexityScore,
    teamworkScore,
    hours: 0,
    kpi,
    grade
  };
}

/**
 * Menghitung KPI untuk seluruh daftar staff dengan perangkingan resmi berdasarkan urutan prioritas:
 * 1. QC Checked (Checklist & Inspeksi QC)
 * 2. Daily Report (Laporan Aktivitas Harian)
 * 3. Work Order / Temuan (Penyelesaian Perbaikan & Temuan)
 * 4. Uji Kompetensi yang Diikuti
 * 5. Jumlah Absensi (Kehadiran Resmi)
 * 6. Nilai Total KPI (%)
 */
export function calculateAllStaffKpis(
  staffList: Staff[],
  dailyReports: DailyReport[] = [],
  logbookEntries: LogbookEntry[] = [],
  findings: Finding[] = [],
  attendanceLogs?: AttendanceLog[],
  electricalCompetencies?: Record<string, Record<string, { verified: boolean }>>,
  septemberSchedule?: StaffScheduleRow[],
  workOrders?: WorkOrder[]
): StaffKpiResult[] {
  return staffList
    .map(staff =>
      calculateStaffKpi(
        staff,
        dailyReports,
        logbookEntries,
        findings,
        attendanceLogs,
        electricalCompetencies,
        septemberSchedule,
        workOrders
      )
    )
    .sort((a, b) => {
      // 1. Prioritas 1: QC Checked
      if (b.qcs !== a.qcs) return b.qcs - a.qcs;

      // 2. Prioritas 2: Daily Report
      if (b.reports !== a.reports) return b.reports - a.reports;

      // 3. Prioritas 3: Work Order / Temuan
      if (b.wos !== a.wos) return b.wos - a.wos;

      // 4. Prioritas 4: Uji Kompetensi yang Diikuti
      if (b.competencyCount !== a.competencyCount) return b.competencyCount - a.competencyCount;

      // 5. Prioritas 5: Jumlah Absensi (Kehadiran)
      if (b.attendanceCount !== a.attendanceCount) return b.attendanceCount - a.attendanceCount;

      // 6. Nilai Total KPI (%)
      return b.kpi - a.kpi;
    });
}

/**
 * Daftar resmi nama staf yang bertugas sesuai referensi Google Sheet (September 2026).
 * Seluruh staf yang tidak tertulis nama stafnya dalam data referensi Google Sheet tidak disertakan/ditampilkan.
 */
export const OFFICIAL_GSHEET_STAFF_NAMES = [
  'taufik diana',
  'suryana',
  'muhamad rahmat',
  'ramdani',
  'iwan kurniawan',
  'heri',
  'mulyana',
  'mulyadi',
  'yudishtira purnama a',
  'ayong sumarsih',
  'dedi agus wigiantoro',
  'wahyudin'
];

/**
 * Memeriksa apakah seorang staf termasuk dalam daftar nama staf yang bertugas sesuai data referensi Google Sheet.
 */
export function isStaffInGoogleSheet(
  staff: Staff | { id?: string; name: string },
  activeDailyReports?: DailyReport[],
  activeLogbookEntries?: LogbookEntry[]
): boolean {
  if (!staff) return false;
  if (staff.id === 'director-wahyu' || staff.name === 'Wahyu') return false;
  if (staff.id === 'staff-damri' || staff.name === 'Damri') return false;
  if (staff.id === 'staff-agustino' || staff.name === 'Agustino Setiawan') return false;
  if (staff.id === 'staff-fahrul' || staff.name === 'M. Fahruyana . A') return false;
  if (staff.id === 'staff-syalsa' || staff.name === 'Syalsa Sri Hestariana') return false;
  if (staff.id === 'staff-seno' || staff.name === 'Seno Subroto') return false;
  if (staff.id === 'staff-absobur' || staff.name === 'Abah Sobur') return false;
  if (staff.id === 'staff-gatot' || staff.name === 'Gatot Wiliyanto') return false;
  if (staff.id === 'staff-udin' || staff.name === 'Udin Saepudin') return false;
  if (staff.id === 'staff-irvan' || staff.name === 'Muhamad Irvan') return false;

  const normName = (staff.name || '').toLowerCase().trim();

  // 1. Cek dari daftar 12 staf resmi yang bertugas di sheet acuan September 2026
  if (OFFICIAL_GSHEET_STAFF_NAMES.some(n => normName === n || normName.includes(n) || n.includes(normName))) {
    return true;
  }

  // 2. Cek dinamis jika ada nama staf baru yang ditarik dari Google Sheet
  if (activeDailyReports || activeLogbookEntries) {
    const isPresent = (activeDailyReports || []).some(
      r => (r._source === 'google_sheet' || r.id.startsWith('gsheet')) && isStaffMatch(staff as any, r.staffName)
    ) || (activeLogbookEntries || []).some(
      l => (l._source === 'google_sheet' || l.id.startsWith('gsheet') || l.id.startsWith('log-gsheet')) && isStaffMatch(staff as any, l.staffName)
    );
    if (isPresent) return true;
  }

  return false;
}


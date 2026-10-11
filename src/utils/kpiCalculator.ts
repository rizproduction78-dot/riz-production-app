/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL PERHITUNGAN KPI RESMI SEMUA STAFF
 * PT. RIZ PRODUCTION MULTI KREASI
 * 
 * SUMBER ACUAN RESMI PRIORITAS PENILAIAN UTAMA KPI:
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit?gid=198998470#gid=198998470
 * 
 * PRINSIP INTEGRITAS DATA:
 * - 100% Data Riil dari input operasional & spreadsheet resmi (tanpa halusinasi/data fiktif)
 * 
 * KATEGORI PENILAIAN & BOBOT RESMI (KOMIT RESMI):
 * 1. Disiplin Kerja - Bobot 10%
 * 2. Produktivitas (Daily Report) - Bobot 25%
 * 3. Kualitas Pemeriksaan QC - Bobot 20%
 * 4. Kompleksitas Tugas & Work Order - Bobot 10%
 * 5. Kerja Sama Tim & Pengembangan - Bobot 5%
 * 6. Jumlah Absensi (Kehadiran) - Bobot 15%
 * 7. Uji Kompetensi yang Diikuti - Bobot 15%
 * TOTAL: 100%
 */

export const KPI_SPREADSHEET_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit?gid=198998470#gid=198998470';
export const KPI_SPREADSHEET_GID = '198998470';

import { Staff, Division, DailyReport, LogbookEntry, Finding, AttendanceLog, WorkOrder, DailyTask } from '../types';
import { StaffScheduleRow, getCurrentMonthSchedule, getScheduleByKey, getActiveMonthKey } from '../data/staffSchedules';
import { NAME_TO_STAFF_ID } from '../lib/dailySheetParser';

export interface StaffKpiResult {
  id: string;
  staffId: string;
  name: string;
  nickname?: string;
  avatar?: string;
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
  'staff-absobur': ['aep saepudin', 'aep', 'subur', 'abah sobur', 'aep/subur'],
  'staff-gatot': ['gatot wiliyanto', 'gatot'],
  'staff-udin': ['udin saepudin', 'mang ube', 'udin', 'mang ubed', 'ube'],
  
  // Admin / Manajemen
  'director-wahyu': ['wahyu', 'director', 'direktur', 'owner', 'pak wahyu'],
  'staff-agustino': ['agustino setiawan', 'agus', 'supervisor'],
  'staff-fahrul': ['m. fahrulyana . a', 'm. fahruyana . a', 'fahrul', 'manager', 'm. fahrulyana', 'm. fahruyana', 'rullyana', 'rully'],
  'staff-syalsa': ['syalsa sri hestariana', 'caca', 'staff admin', 'syalsa'],
  'staff-seno': ['seno subroto', 'seno', 'staff admin'],
  
  // Videotron / LED
  'staff-ayong': ['ayong sumarsih', 'ayong', 'prabu', 'prabuam'],
  'staff-dedi': ['dedi agus wigiantoro', 'wigi', 'dedi agus', 'dedy'],
  'staff-irvan': ['muhamad irvan', 'irfan', 'muhammad irvan', 'irfanthepul'],
  
  // Multimedia
  'staff-mulyadi': ['mulyadi', 'jay', 'jaymulyadi', 'jay mulyadi'],
  
  // Lighting
  'staff-heri': ['heri', 'heriansyah', 'saputra', 'kang heri'],

  // Audio (Sound)
  'staff-iwan': ['iwan kurniawan', 'iwan', 'kurniawan', 'butonk', 'butong', 'boetonk', 'boetonk2785', 'kang butonk', 'kang butong'],
  'staff-rahmat': ['muhamad rahmat', 'muhammad rahmat', 'rahmat', 'mboh', 'outsideprojectmboh', 'kang mboh', 'mas mboh'],
  'staff-ramdani': ['ramdani', 'dani', 'ismail ramdani', 'ismail', 'ismailramdani'],
  'staff-suryana': ['suryana', 'nana', 'buluk', 'bulux', 'nana/buluk', 'nana / buluk', 'kang nana', 'kang buluk', 'nana buluk'],
  'staff-taufik': ['taufik diana', 'taufik', 'diana', 'opik', 'topik', 'taufikdya', 'kang opik', 'opik diana'],
  'staff-unyin': ['wahyudin', 'unyin', 'unyim', 'kang unyim', 'kang unyin'],
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

  const cleanInput = rawInput.replace(/^[-*•\s]+/, '').trim();

  // 1. Direct match via official dictionary NAME_TO_STAFF_ID
  const directId = NAME_TO_STAFF_ID[cleanInput];
  if (directId) {
    return staff.id === directId;
  }

  // 2. Tokenized match via official dictionary NAME_TO_STAFF_ID
  const tokens = cleanInput
    .split(/[,/&+;\n|()]|\s+dan\s+|\s+and\s+|\s+bersama\s+|\s+team\s+/i)
    .map(t => t.replace(/[^a-zA-Z0-9\s.]/g, ' ').trim().toLowerCase())
    .filter(t => t.length > 0);

  for (const token of tokens) {
    const tokenId = NAME_TO_STAFF_ID[token];
    if (tokenId) {
      if (staff.id === tokenId) return true;
    }
  }

  // 3. Fallback to exact alias check (EXACT MATCH ONLY - NO SUBSTRING INCLUDES)
  const aliases = getAllStaffAliases(staff);
  for (const alias of aliases) {
    if (cleanInput === alias) return true;
    for (const token of tokens) {
      if (token === alias) return true;
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
 * Mengambil informasi tanggal, bulan, dan tahun lokal saat ini secara akurat.
 */
export function getCurrentDateInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const monthKey = `${year}-${String(month).padStart(2, '0')}`;
  return { now, year, month, day, monthKey };
}

/**
 * Menghitung batas hari evaluasi (cutoff day) untuk bulan yang bersangkutan:
 * - Bulan Berjalan: Cutoff dihitung berdasarkan hari berjalan (atau tanggal data terbaru di sheet jika belum semua hari terisi).
 * - Bulan Lampau: Cutoff adalah akhir bulan penuh (30 / 31 hari).
 * - Bulan Masa Depan: 0 hari berjalan.
 */
export function getMonthEvaluationCutoff(targetMonthKey: string, dailyReports: DailyReport[] = []) {
  const { year: currentYear, month: currentMonth, day: currentDay, monthKey: currentMonthKey } = getCurrentDateInfo();

  const [yStr, mStr] = targetMonthKey.split('-');
  const y = parseInt(yStr, 10) || currentYear;
  const m = parseInt(mStr, 10) || currentMonth;
  const totalDaysInMonth = new Date(y, m, 0).getDate();

  const isCurrentRunningMonth = (targetMonthKey === currentMonthKey);
  const isPastMonth = (targetMonthKey < currentMonthKey);
  const isFutureMonth = (targetMonthKey > currentMonthKey);

  let evalCutoffDay = totalDaysInMonth;

  if (isCurrentRunningMonth) {
    let maxReportDay = 0;
    for (const r of dailyReports) {
      if (r.date && r.date.startsWith(targetMonthKey)) {
        const d = parseInt(r.date.slice(8, 10), 10);
        if (!isNaN(d) && d > maxReportDay) maxReportDay = d;
      }
    }
    // Jika laporan di Google Sheet baru disinkronkan sampai tanggal N, gunakan maxReportDay (atau currentDay jika sudah ada laporan hari ini)
    evalCutoffDay = maxReportDay > 0 ? Math.min(currentDay, maxReportDay) : Math.min(totalDaysInMonth, Math.max(1, currentDay));
  } else if (isFutureMonth) {
    evalCutoffDay = 0;
  } else {
    // Bulan lampau: evaluasi penuh 1 bulan
    evalCutoffDay = totalDaysInMonth;
  }

  return {
    isCurrentRunningMonth,
    isPastMonth,
    isFutureMonth,
    totalDaysInMonth,
    evalCutoffDay,
    currentDay,
    currentMonthKey
  };
}

/**
 * Menghitung KPI akurat untuk seorang staff dengan menghitung:
 * 7 PILAR RESMI PRIORITAS PENILAIAN KPI (KOMIT RESMI 100%):
 * 1. Disiplin Kerja - 10%
 * 2. Produktivitas (Daily Report) - 25%
 * 3. Kualitas Pemeriksaan QC - 20%
 * 4. Kompleksitas Tugas & Work Order - 10%
 * 5. Kerja Sama Tim & Pengembangan - 5%
 * 6. Jumlah Absensi (Kehadiran) - 15%
 * 7. Uji Kompetensi yang Diikuti - 15%
 * TOTAL: 100%
 */
export function calculateStaffKpi(
  staff: Staff,
  dailyReports: DailyReport[] = [],
  logbookEntries: LogbookEntry[] = [],
  findings: Finding[] = [],
  attendanceLogsOverride?: AttendanceLog[],
  electricalCompetenciesOverride?: Record<string, Record<string, { verified: boolean }>>,
  scheduleOverride?: StaffScheduleRow[],
  workOrdersOverride?: WorkOrder[],
  dailyTasksOverride?: DailyTask[],
  monthKeyOverride?: string
): StaffKpiResult {
  // ─────────────────────────────────────────────────────────────
  // 0. DETEKSI BULAN EVALUASI & TANGGAL BERJALAN SECARA DINAMIS
  // ─────────────────────────────────────────────────────────────
  let targetMonthKey = monthKeyOverride;
  if (!targetMonthKey) {
    const firstRepDate = dailyReports.find(r => r.date)?.date;
    if (firstRepDate && firstRepDate.length >= 7) {
      targetMonthKey = firstRepDate.slice(0, 7);
    } else {
      const firstLogDate = logbookEntries.find(e => e.date)?.date;
      if (firstLogDate && firstLogDate.length >= 7) {
        targetMonthKey = firstLogDate.slice(0, 7);
      } else {
        targetMonthKey = getCurrentDateInfo().monthKey;
      }
    }
  }

  const { isCurrentRunningMonth, isPastMonth, isFutureMonth, totalDaysInMonth, evalCutoffDay } = getMonthEvaluationCutoff(targetMonthKey, dailyReports);

  // Jadwal dinas resmi berdasarkan bulan yang dievaluasi
  const monthlyScheduleObj = getScheduleByKey(targetMonthKey);
  const scheduleRows = scheduleOverride || monthlyScheduleObj?.rows || getCurrentMonthSchedule().rows;
  const staffScheduleRow = scheduleRows.find(r => isStaffMatch(staff, r.name));

  let scheduledWorkingDaysFullMonth = 0;
  let scheduledWorkingDaysToDate = 0;

  if (staffScheduleRow && staffScheduleRow.shifts) {
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const shift = staffScheduleRow.shifts[day];
      const isWorking = shift && shift !== 'L' && shift !== 'Cuti' && shift !== '-' && shift !== 'Libur';
      if (isWorking) {
        scheduledWorkingDaysFullMonth++;
        if (day <= evalCutoffDay) {
          scheduledWorkingDaysToDate++;
        }
      }
    }
  }

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

  const staffDates = new Set<string>();
  dailyReports.filter(r => isStaffMatch(staff, r.staffName) && r.date).forEach(r => staffDates.add(r.date));
  logbookEntries.filter(e => isStaffMatch(staff, e.staffName) && e.date).forEach(e => staffDates.add(e.date));

  // Tambahkan juga dari attendance logs resmi jika ada
  realLogs.filter(
    l => (l.staffId === staff.id || isStaffMatch(staff, l.staffName)) &&
         (l.status === 'Hadir' || l.checkInTime) &&
         (!l.date || l.date.startsWith(targetMonthKey))
  ).forEach(l => {
    if (l.date) staffDates.add(l.date);
  });

  const attendanceCount = staffDates.size;

  let attendanceTarget = 0;
  if (isCurrentRunningMonth) {
    // Pada bulan berjalan, target dihitung proporsional terhadap jadwal kerja dinas yang sudah berjalan s/d hari ini
    if (scheduledWorkingDaysToDate > 0) {
      attendanceTarget = scheduledWorkingDaysToDate;
    } else {
      attendanceTarget = attendanceCount > 0 ? attendanceCount : 1;
    }
  } else if (isFutureMonth) {
    attendanceTarget = 0;
  } else {
    // Bulan lampau: gunakan total hari kerja dinas sebulan penuh dari roster resmi
    attendanceTarget = scheduledWorkingDaysFullMonth > 0 ? scheduledWorkingDaysFullMonth : 24;
  }

  const attendanceScore = attendanceTarget > 0 
    ? Math.min(100, Math.round((attendanceCount / attendanceTarget) * 100))
    : (attendanceCount > 0 ? 100 : 0);

  // ─────────────────────────────────────────────────────────────
  // 2. MENGHITUNG UJI KOMPETENSI YANG DIIKUTI (6 Unit Standar K3 & Kelistrikan)
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
  const competencyScore = Math.min(100, Math.round((competencyCount / competencyTotal) * 100));

  // ─────────────────────────────────────────────────────────────
  // 3. DISIPLIN KERJA (Bobot 10%: Basis 100%, Potongan Keterlambatan & Alpha)
  // ─────────────────────────────────────────────────────────────
  let lateDeductions = 0;
  let alphaDeductions = 0;
  const staffLogs = realLogs.filter(
    l => (l.staffId === staff.id || isStaffMatch(staff, l.staffName)) &&
         (!l.date || l.date.startsWith(targetMonthKey))
  );
  staffLogs.forEach(l => {
    if (l.isLate || (l.status as string) === 'Terlambat') lateDeductions += 10;
    if (l.status === 'Alpha') alphaDeductions += 25;
  });

  let disciplineScore = 0;
  if (attendanceCount > 0) {
    disciplineScore = Math.max(0, 100 - lateDeductions - alphaDeductions);
  } else {
    disciplineScore = (isCurrentRunningMonth && scheduledWorkingDaysToDate === 0) ? 100 : 0;
  }

  // ─────────────────────────────────────────────────────────────
  // 4. PRODUKTIVITAS / DAILY TASK (Bobot 25%: Laporan Harian Operasional & Daily Tasks)
  // ─────────────────────────────────────────────────────────────
  const reportsCount = dailyReports.filter(r => isStaffMatch(staff, r.staffName)).length;
  
  let realTasks: DailyTask[] = dailyTasksOverride || [];
  if (!dailyTasksOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_daily_tasks');
      if (saved) realTasks = JSON.parse(saved);
    } catch (e) {}
  }
  const completedTaskCount = realTasks.filter(
    t => (isStaffMatch(staff, t.assignedName) || (t.assignedTo === staff.id)) &&
         t.status === 'Done' &&
         (!t.dueDate || t.dueDate.startsWith(targetMonthKey) || !t.createdAt || t.createdAt.startsWith(targetMonthKey))
  ).length;

  const combinedProductivityCount = reportsCount + completedTaskCount;
  const reportTarget = Math.max(1, attendanceTarget);
  const reportScore = Math.min(100, Math.round((combinedProductivityCount / reportTarget) * 100));

  // ─────────────────────────────────────────────────────────────
  // 5. QUALITY / QC CHECKLIST (Bobot 20%: Inspeksi Teknis & Kesiapan Alat)
  // ─────────────────────────────────────────────────────────────
  const qcCount = logbookEntries.filter(e => isStaffMatch(staff, e.staffName)).length;
  const isSpecialistNonQC = staff.division === 'Admin';
  const qcTarget = Math.max(1, attendanceTarget);
  const rawQcScore = Math.min(100, Math.round((qcCount / qcTarget) * 100));
  const qcScore = isSpecialistNonQC ? reportScore : rawQcScore;

  // ─────────────────────────────────────────────────────────────
  // 6. KOMPLEKSITAS TUGAS & WORK ORDER (Bobot 10%: Penanganan Temuan Kerusakan & WO)
  // ─────────────────────────────────────────────────────────────
  const staffFindings = findings.filter(f => isStaffMatch(staff, f.pic));
  let realWOs: WorkOrder[] = workOrdersOverride || [];
  if (!workOrdersOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_work_orders');
      if (saved) realWOs = JSON.parse(saved);
    } catch (e) {}
  }
  const staffWOs = realWOs.filter(w => isStaffMatch(staff, w.pic) && (!w.dateCreated || w.dateCreated.startsWith(targetMonthKey)));

  const totalAssigned = staffFindings.length + staffWOs.length;
  const closedCount = staffFindings.filter(f => f.status === 'Close').length + staffWOs.filter(w => w.status === 'Completed' || w.progress === 100).length;

  const taskComplexityScore = totalAssigned > 0 
    ? Math.min(100, Math.round((closedCount / totalAssigned) * 100))
    : 0;
  const woCount = closedCount;
  const woScore = taskComplexityScore;

  // ─────────────────────────────────────────────────────────────
  // 7. PENGEMBANGAN DIRI & TEAMWORK (Bobot 5%: Sinergi Tim & Disiplin)
  // ─────────────────────────────────────────────────────────────
  const teamworkScore = Math.round((reportScore * 0.5) + (disciplineScore * 0.5));

  // ─────────────────────────────────────────────────────────────
  // 8. TOTAL NILAI KPI (KOMIT RESMI KATEGORI PENILAIAN KPI)
  // ─────────────────────────────────────────────────────────────
  // 1. Disiplin Kerja: 10%
  // 2. Produktivitas (Daily Report): 25%
  // 3. Kualitas Pemeriksaan QC: 20%
  // 4. Kompleksitas Tugas & Work Order: 10%
  // 5. Kerja Sama Tim & Pengembangan: 5%
  // 6. Jumlah Absensi (Kehadiran): 15%
  // 7. Uji Kompetensi yang Diikuti: 15%
  // TOTAL BOBOT: 100%
  let totalKpi = Math.round(
    (disciplineScore * 0.10) +
    (reportScore * 0.25) +
    (qcScore * 0.20) +
    (taskComplexityScore * 0.10) +
    (teamworkScore * 0.05) +
    (attendanceScore * 0.15) +
    (competencyScore * 0.15)
  );

  const kpi = Math.min(100, Math.max(0, totalKpi));

  let grade: 'A' | 'B' | 'C' | 'D' = 'D';
  if (kpi >= 85) grade = 'A';
  else if (kpi >= 70) grade = 'B';
  else if (kpi >= 55) grade = 'C';
  else grade = 'D';

  return {
    id: staff.id,
    staffId: staff.id,
    name: staff.fullName || staff.name,
    nickname: staff.nickname,
    avatar: staff.avatar,
    division: staff.division,
    role: staff.role,
    attendanceCount,
    attendanceTarget,
    attendanceScore,
    competencyCount,
    competencyTotal,
    competencyScore,
    disciplineScore,
    reports: combinedProductivityCount,
    reportsCount: combinedProductivityCount,
    reportScore,
    qcs: qcCount,
    qcCount,
    qcScore,
    wos: woCount,
    woCount,
    woScore,
    taskComplexityScore,
    teamworkScore,
    hours: attendanceCount * 8, // Menggunakan 8 jam x jumlah kehadiran
    kpi,
    grade
  };
}

/**
 * URUTAN PENILAIAN & PERANGKINGAN RESMI:
 * 1. Daily Report (Laporan Harian Operasional Lapangan & Event) - Bobot 25%
 * 2. QC Checklist Onhouse (Inspeksi & Kesiapan Alat Gudang) - Bobot 20%
 * 3. Work Order (WO) Selesai & Temuan Kerusakan Ditangani - Bobot 10%
 * 4. Uji Kompetensi yang Diikuti (6 Modul Standar Kelistrikan & Teknis) - Bobot 15%
 * 5. Kehadiran & Shift Roster Riil (Jadwal Dinas 1-31) - Bobot 15%
 * 6. Disiplin & Teamwork - Bobot 15%
 * 
 * PRINSIP INTEGRITAS DATA:
 * - 100% Data Riil dari input operasional & spreadsheet resmi (tanpa halusinasi/data fiktif)
 * - MENGHITUNG DENGAN BENAR, MENYUSUN DENGAN BENAR, MENGHASILKAN DENGAN BENAR DATA BERDASARKAN SUMBER REFERENSI RESMI
 */
export function calculateAllStaffKpis(
  staffList: Staff[],
  dailyReports: DailyReport[] = [],
  logbookEntries: LogbookEntry[] = [],
  findings: Finding[] = [],
  attendanceLogs?: AttendanceLog[],
  electricalCompetencies?: Record<string, Record<string, { verified: boolean }>>,
  scheduleOverride?: StaffScheduleRow[],
  workOrders?: WorkOrder[],
  dailyTasks?: DailyTask[],
  monthKeyOverride?: string
): StaffKpiResult[] {
  let targetMonthKey = monthKeyOverride;
  if (!targetMonthKey) {
    const firstRepDate = dailyReports.find(r => r.date)?.date;
    if (firstRepDate && firstRepDate.length >= 7) {
      targetMonthKey = firstRepDate.slice(0, 7);
    } else {
      const firstLogDate = logbookEntries.find(e => e.date)?.date;
      if (firstLogDate && firstLogDate.length >= 7) {
        targetMonthKey = firstLogDate.slice(0, 7);
      } else {
        targetMonthKey = getCurrentDateInfo().monthKey;
      }
    }
  }

  return staffList
    .filter(staff => isStaffInGoogleSheet(staff, dailyReports, logbookEntries, targetMonthKey))
    .map(staff =>
      calculateStaffKpi(
        staff,
        dailyReports,
        logbookEntries,
        findings,
        attendanceLogs,
        electricalCompetencies,
        scheduleOverride,
        workOrders,
        dailyTasks,
        targetMonthKey
      )
    )
    .sort((a, b) => {
      // Prioritas 1: Nilai Total KPI (%)
      if (b.kpi !== a.kpi) return b.kpi - a.kpi;

      // Prioritas 2: Kehadiran
      if (b.attendanceCount !== a.attendanceCount) return (b.attendanceCount || 0) - (a.attendanceCount || 0);

      // Prioritas 3: Daily Report
      if (b.reports !== a.reports) return (b.reports || 0) - (a.reports || 0);
      
      // Prioritas 4: QC Checklist
      if (b.qcs !== a.qcs) return (b.qcs || 0) - (a.qcs || 0);

      // Prioritas 5: WO Selesai
      if (b.wos !== a.wos) return (b.wos || 0) - (a.wos || 0);
      
      // Prioritas 6: Uji Komp
      if (b.competencyCount !== a.competencyCount) return (b.competencyCount || 0) - (a.competencyCount || 0);

      return 0;
    });
}

/**
 * Memeriksa apakah seorang staf termasuk dalam daftar nama staf yang bertugas sesuai jadwal bulan aktif atau data referensi Google Sheet.
 */
export function isStaffInGoogleSheet(
  staff: Staff | { id?: string; name: string },
  activeDailyReports?: DailyReport[],
  activeLogbookEntries?: LogbookEntry[],
  targetMonthKey?: string
): boolean {
  if (!staff) return false;
  
  // Abaikan level direksi/manajerial
  if (staff.id === 'director-wahyu' || staff.id === 'staff-wahyu' || (staff.name?.toLowerCase().trim() === 'wahyu' || staff.name?.toLowerCase().trim() === 'wahyu (owner)')) return false;
  if (staff.id === 'staff-agustino' || staff.name?.includes('Agustino')) return false;
  if (staff.id === 'staff-fahrul' || staff.name === 'M. Fahruyana . A') return false;
  if (staff.id === 'staff-syalsa' || staff.name === 'Syalsa Sri Hestariana') return false;
  if (staff.id === 'staff-seno' || staff.name === 'Seno Subroto') return false;
  
  // Staff semua divisi adalah placeholder, bukan staf riil
  if (staff.id === 'staff-semua-divisi') return false;

  // 1. Cek dinamis jika ada nama staf yang aktif di Google Sheet / Daily Report / Logbook bulan terpilih
  if (activeDailyReports || activeLogbookEntries) {
    const isPresent = (activeDailyReports || []).some(
      r => isStaffMatch(staff as any, r.staffName)
    ) || (activeLogbookEntries || []).some(
      l => isStaffMatch(staff as any, l.staffName)
    );
    if (isPresent) return true;
  }

  // 2. Cek dari jadwal aktif bulan ini / targetMonthKey
  const monthSchedule = targetMonthKey ? getScheduleByKey(targetMonthKey)?.rows : getCurrentMonthSchedule().rows;
  const currentSchedule = monthSchedule || getCurrentMonthSchedule().rows;
  const isInSchedule = currentSchedule.some(r => isStaffMatch(staff as Staff, r.name));
  if (isInSchedule) {
    // Hanya masukkan jika staf benar-benar bertugas di roster / daily log
    return true;
  }

  return false;
}


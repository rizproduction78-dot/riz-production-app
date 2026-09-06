/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL PERHITUNGAN KPI RESMI SEMUA STAFF
 * PT. RIZ PRODUCTION MULTI KREASI
 * 
 * SUMBER ACUAN RESMI PRIORITAS PENILAIAN KPI:
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit?gid=198998470#gid=198998470
 * 
 * PRIORITAS PENILAIAN UTAMA:
 * 1. Daily Report (Laporan Harian Operasional Lapangan & Event) - Bobot 25%
 * 2. QC Checklist Onhouse (Inspeksi & Kesiapan Alat Gudang) - Bobot 20%
 * 3. Work Order & Temuan Kerusakan Selesai (Penyelesaian WO/Tiket) - Bobot 10%
 * 4. Kehadiran & Shift Roster Riil (Jadwal Dinas 1-31) - Bobot 15% - 20%
 * 5. Uji Kompetensi yang Diikuti (6 Modul Standar Kelistrikan) - Bobot 15%
 * 6. Disiplin & Teamwork - Bobot 15%
 */

export const KPI_SPREADSHEET_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit?gid=198998470#gid=198998470';
export const KPI_SPREADSHEET_GID = '198998470';

import { Staff, DailyReport, LogbookEntry, Finding, AttendanceLog } from '../types';
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
  'staff-iwan': ['iwan kurniawan', 'iwan', 'kurniawan', 'butonk', 'butong', 'boetonk', 'buluk', 'boetonk2785', 'kang butonk', 'kang buluk'],
  'staff-rahmat': ['muhamad rahmat', 'muhammad rahmat', 'rahmat', 'mboh', 'outsideprojectmboh', 'kang mboh', 'mas mboh'],
  'staff-ramdani': ['ramdani', 'dani', 'ismail ramdani', 'ismail', 'ismailramdani'],
  'staff-unyin': ['wahyudin (unyim)', 'wahyudin', 'unyim', 'wahyudin unyim', 'wahyudin aka unyim', 'suryana', 'unyink', 'nia', 'kurni', 'kang unyim'],
  'staff-suryana': ['wahyudin (unyim)', 'wahyudin', 'unyim', 'wahyudin unyim', 'wahyudin aka unyim', 'suryana', 'unyink', 'nia', 'kurni', 'kang unyim'],
  'staff-taufik': ['taufik diana', 'taufik', 'diana', 'opik', 'topik', 'taufikdya', 'kang opik', 'opik diana'],
  'staff-yudish': ['yudishtira purnama a', 'yudishtira', 'yudis', 'yudhis', 'purnama', 'yudhisintan'],
  
  // Service
  'staff-damri': ['damri', 'mang damri', 'mangdamri', 'pak damri'],
  'staff-mulyana': ['mulyana', 'kharo', 'tabita', 'tabitakharo', 'mulyana kharo', 'kharo mulyana', 'kang kharo']
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
  'Iwan Kurniawan': ['iwan kurniawan', 'iwan', 'kurniawan', 'butonk', 'butong', 'boetonk', 'buluk'],
  'Muhamad Rahmat': ['muhamad rahmat', 'muhammad rahmat', 'rahmat', 'mboh'],
  'Ramdani': ['ramdani', 'dani', 'ismail ramdani', 'ismail'],
  'Wahyudin (Unyim)': ['wahyudin (unyim)', 'wahyudin', 'unyim', 'wahyudin unyim', 'wahyudin aka unyim', 'suryana', 'unyink', 'nia', 'kang unyim'],
  'Wahyudin': ['wahyudin (unyim)', 'wahyudin', 'unyim', 'wahyudin unyim', 'wahyudin aka unyim', 'suryana', 'unyink', 'nia', 'kang unyim'],
  'Unyim': ['wahyudin (unyim)', 'wahyudin', 'unyim', 'wahyudin unyim', 'wahyudin aka unyim', 'suryana', 'unyink', 'nia', 'kang unyim'],
  'Suryana': ['wahyudin (unyim)', 'wahyudin', 'unyim', 'wahyudin unyim', 'wahyudin aka unyim', 'suryana', 'unyink', 'nia', 'kang unyim'],
  'Taufik Diana': ['taufik diana', 'taufik', 'diana', 'opik', 'topik'],
  'Yudishtira Purnama A': ['yudishtira purnama a', 'yudishtira', 'yudis', 'yudhis', 'purnama'],
  'Damri': ['damri', 'mang damri', 'mangdamri'],
  'Mulyana': ['mulyana', 'kharo', 'tabita', 'mulyana kharo', 'kharo mulyana']
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
  
  // 1. Direct match check
  for (const alias of aliases) {
    if (rawInput === alias) return true;
  }

  // 2. Tokenized match (handling separators like commas, slashes, ampersands, pluses, 'dan', 'and', 'bersama', etc.)
  const tokens = rawInput
    .split(/[,/&+;\n|()]|\s+dan\s+|\s+and\s+|\s+bersama\s+|\s+team\s+/i)
    .map(t => t.replace(/[^a-zA-Z0-9\s.]/g, ' ').trim().toLowerCase())
    .filter(t => t.length > 0);

  for (const token of tokens) {
    for (const alias of aliases) {
      if (token === alias) return true;
      if (alias.length >= 3 && token.length >= 3) {
        if (token === alias || token.includes(alias) || alias.includes(token)) {
          return true;
        }
      }
    }
  }

  // 3. Word-boundary substring regex search across full input text
  for (const alias of aliases) {
    if (alias.length >= 3) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
      if (regex.test(rawInput)) return true;
    }
  }

  return false;
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
  septemberScheduleOverride?: StaffScheduleRow[]
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
  // 3. DISIPLIN KERJA (Dihitung dari kehadiran dan kepatuhan jam kerja)
  // ─────────────────────────────────────────────────────────────
  const disciplineScore = attendanceCount > 0 ? Math.min(100, Math.round((attendanceCount / attendanceTarget) * 100)) : 0;

  // ─────────────────────────────────────────────────────────────
  // 4. PRODUKTIVITAS / DAILY TASK (Murni dari laporan harian yang diinput)
  // ─────────────────────────────────────────────────────────────
  const realReportsCount = dailyReports.filter(r => isStaffMatch(staff, r.staffName)).length;
  const reportsCount = realReportsCount;
  const reportScore = Math.min(100, Math.round((reportsCount / 2) * 100));

  // ─────────────────────────────────────────────────────────────
  // 5. QUALITY / QC CHECKLIST (Murni dari checklist QC yang diinput)
  // ─────────────────────────────────────────────────────────────
  const isNonQcDivision = ['Gudang', 'Admin'].includes(staff.division);
  const realQcCount = logbookEntries.filter(e => isStaffMatch(staff, e.staffName)).length;
  const qcCount = isNonQcDivision ? 0 : realQcCount;
  const qcScore = isNonQcDivision ? 80 : (qcCount === 0 ? 0 : Math.min(100, Math.round((qcCount / 2) * 100)));

  // ─────────────────────────────────────────────────────────────
  // 6. KOMPLEKSITAS TUGAS & WORK ORDER (Murni dari WO yang diselesaikan)
  // ─────────────────────────────────────────────────────────────
  const realWoCount = findings.filter(f => isStaffMatch(staff, f.pic) && f.status === 'Close').length;
  const woCount = realWoCount;
  const woScore = Math.min(100, Math.round((woCount / 1) * 100));
  const taskComplexityScore = woScore;

  // ─────────────────────────────────────────────────────────────
  // 7. PENGEMBANGAN DIRI & TEAMWORK (Dari keaktifan uji kompetensi & laporan)
  // ─────────────────────────────────────────────────────────────
  const teamworkScore = Math.round((competencyScore * 0.5) + (reportScore * 0.5));

  // Jam kerja total riil (shift kehadiran x 8 jam)
  const baseHours = attendanceCount * 8;

  // ─────────────────────────────────────────────────────────────
  // 8. TOTAL NILAI KPI (SEMUA KOMPONEN LENGKAP & TIDAK DIHILANGKAN)
  // ─────────────────────────────────────────────────────────────
  // Komponen:
  // - Disiplin: 10%
  // - Produktivitas (Daily Report): 25%
  // - Quality (QC Checklist): 20%
  // - Kompleksitas Tugas / WO: 10%
  // - Teamwork & Pengembangan Diri: 5%
  // - Jumlah Absen / Kehadiran: 15%
  // - Uji Kompetensi yang Diikuti: 15%
  // Total = 10 + 25 + 20 + 10 + 5 + 15 + 15 = 100%
  let totalKpi: number;
  if (isNonQcDivision) {
    totalKpi = Math.round(
      (attendanceScore * 0.20) +
      (competencyScore * 0.15) +
      (disciplineScore * 0.10) +
      (reportScore * 0.30) +
      (woScore * 0.15) +
      (teamworkScore * 0.10)
    );
  } else {
    totalKpi = Math.round(
      (attendanceScore * 0.15) +
      (competencyScore * 0.15) +
      (disciplineScore * 0.10) +
      (reportScore * 0.25) +
      (qcScore * 0.20) +
      (woScore * 0.10) +
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
    attendanceCount,
    attendanceTarget,
    attendanceScore,
    competencyCount,
    competencyTotal,
    competencyScore,
    disciplineScore,
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
    hours: baseHours,
    kpi,
    grade
  };
}

/**
 * Menghitung KPI untuk seluruh daftar staff dengan perangkingan adil berdasarkan kontribusi riil
 */
export function calculateAllStaffKpis(
  staffList: Staff[],
  dailyReports: DailyReport[] = [],
  logbookEntries: LogbookEntry[] = [],
  findings: Finding[] = [],
  attendanceLogs?: AttendanceLog[],
  electricalCompetencies?: Record<string, Record<string, { verified: boolean }>>,
  septemberSchedule?: StaffScheduleRow[]
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
        septemberSchedule
      )
    )
    .sort((a, b) => {
      // 1. PRIORITAS UTAMA: Total Kontribusi Operasional (Daily Report + QC Checklist + WO Selesai)
      const bOps = (b.reports * 10) + (b.qcs * 8) + (b.wos * 12);
      const aOps = (a.reports * 10) + (a.qcs * 8) + (a.wos * 12);
      if (bOps !== aOps) return bOps - aOps;

      // 2. Prioritas Jumlah Daily Reports
      if (b.reports !== a.reports) return b.reports - a.reports;

      // 3. Prioritas Jumlah QC Checklist
      if (b.qcs !== a.qcs) return b.qcs - a.qcs;

      // 4. Prioritas Jumlah WO Selesai
      if (b.wos !== a.wos) return b.wos - a.wos;

      // 5. Prioritas Nilai Total KPI (%)
      if (b.kpi !== a.kpi) return b.kpi - a.kpi;

      // 6. Prioritas Uji Kompetensi yang Diikuti
      if (b.competencyCount !== a.competencyCount) return b.competencyCount - a.competencyCount;

      // 7. Jam Kerja & Kehadiran
      return b.attendanceCount - a.attendanceCount;
    });
}

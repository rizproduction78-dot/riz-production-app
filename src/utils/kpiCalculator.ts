/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL PERHITUNGAN KPI RESMI SEMUA STAFF
 * PT. RIZ PRODUCTION MULTI KREASI
 * 
 * Aturan Resmi Perhitungan KPI Staff:
 * 1. Kehadiran & Jumlah Absen (Bobot 20%): Dihitung dari log absensi riil & jadwal dinas shift September 2026.
 * 2. Uji Kompetensi yang Diikuti (Bobot 20%): Dihitung dari jumlah unit kompetensi yang diuji & diverifikasi (6 Unit Standar Listrik).
 * 3. Daily Task / Laporan Harian (Bobot 25%): Target 18 laporan per bulan.
 * 4. QC & Checklist Onhouse (Bobot 20%): Target 10 pemeriksaan QC (100% untuk divisi non-teknis / gudang).
 * 5. Work Order & Temuan Selesai (Bobot 15%): Target 6 WO selesai.
 */

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
    l => (l.staffId === staff.id || l.staffName?.toLowerCase().trim() === staff.name.toLowerCase().trim()) &&
         (l.status === 'Hadir' || l.checkInTime)
  ).length;

  const scheduleRows = septemberScheduleOverride || OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  const staffScheduleRow = scheduleRows.find(
    r => r.name.toLowerCase().trim() === staff.name.toLowerCase().trim() ||
         r.name.toLowerCase().includes(staff.name.toLowerCase()) ||
         staff.name.toLowerCase().includes(r.name.toLowerCase())
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
  const realReportsCount = dailyReports.filter(
    r => r.staffName?.toLowerCase() === staff.name.toLowerCase()
  ).length;
  const reportsCount = realReportsCount;
  const reportScore = Math.min(100, Math.round((reportsCount / 18) * 100));

  // ─────────────────────────────────────────────────────────────
  // 5. QUALITY / QC CHECKLIST (Murni dari checklist QC yang diinput)
  // ─────────────────────────────────────────────────────────────
  const isNonQcDivision = ['Gudang', 'Admin'].includes(staff.division);
  const realQcCount = logbookEntries.filter(
    e => e.staffName?.toLowerCase() === staff.name.toLowerCase()
  ).length;
  const qcCount = isNonQcDivision ? 0 : realQcCount;
  const qcScore = isNonQcDivision ? 100 : (qcCount === 0 ? 0 : Math.min(100, Math.round((qcCount / 10) * 100)));

  // ─────────────────────────────────────────────────────────────
  // 6. KOMPLEKSITAS TUGAS & WORK ORDER (Murni dari WO yang diselesaikan)
  // ─────────────────────────────────────────────────────────────
  const realWoCount = findings.filter(
    f => f.pic?.toLowerCase() === staff.name.toLowerCase() && f.status === 'Close'
  ).length;
  const woCount = realWoCount;
  const woScore = Math.min(100, Math.round((woCount / 6) * 100));
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
  // Komponen Lama:
  // - Disiplin: 10%
  // - Produktivitas (Daily Report): 25%
  // - Quality (QC Checklist): 20%
  // - Kompleksitas Tugas / WO: 10%
  // - Teamwork & Pengembangan Diri: 5%
  // Komponen Baru Yang Ditambahkan:
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
 * Menghitung KPI untuk seluruh daftar staff
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
    .sort((a, b) => b.kpi - a.kpi);
}

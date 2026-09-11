/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SISTEM JADWAL SHIFT MULTI-BULAN
 * PT. RIZ PRODUCTION MULTI KREASI
 * Mencakup September 2026 s/d seterusnya
 */

import {
  StaffScheduleRow,
  SHIFT_LEGEND,
  SCHEDULE_NOTE,
  OFFICIAL_SEPTEMBER_2026_SCHEDULE,
  SEPTEMBER_2026_DAYS
} from './september2026Schedule';

export type { StaffScheduleRow };
export { SHIFT_LEGEND, SCHEDULE_NOTE };

// ─────────────────────────────────────────────────────────────
// INTERFACE JADWAL BULANAN
// ─────────────────────────────────────────────────────────────
export interface DayInfo {
  day: number;
  dayName: string;
  isWeekend: boolean;
}

export interface MonthlySchedule {
  key: string;          // e.g. "2026-09"
  month: number;        // 1-12
  year: number;         // e.g. 2026
  label: string;        // e.g. "September 2026"
  labelShort: string;   // e.g. "Sep 2026"
  totalDays: number;    // 28/29/30/31
  days: DayInfo[];
  rows: StaffScheduleRow[];
}

// ─────────────────────────────────────────────────────────────
// HELPER: Generate days array for any month/year
// ─────────────────────────────────────────────────────────────
const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function generateMonthDays(year: number, month: number): DayInfo[] {
  const totalDays = new Date(year, month, 0).getDate(); // month is 1-based
  const days: DayInfo[] = [];
  for (let d = 1; d <= totalDays; d++) {
    const jsDate = new Date(year, month - 1, d);
    const dow = jsDate.getDay(); // 0=Sun, 6=Sat
    days.push({
      day: d,
      dayName: DAY_NAMES_ID[dow],
      isWeekend: dow === 0 || dow === 6
    });
  }
  return days;
}

const MONTH_NAMES_ID = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const MONTH_NAMES_SHORT = [
  '', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

// ─────────────────────────────────────────────────────────────
// TEMPLATE SHIFT — digunakan untuk bulan yang jadwalnya belum ada
// Pola rotasi 3-hari untuk Gudang, MD untuk semua divisi teknis
// ─────────────────────────────────────────────────────────────
function buildTemplateRows(year: number, month: number): StaffScheduleRow[] {
  const days = generateMonthDays(year, month);
  const totalDays = days.length;

  const buildShifts = (pattern: string[]): { [day: number]: string } => {
    const shifts: { [day: number]: string } = {};
    for (let i = 0; i < totalDays; i++) {
      shifts[i + 1] = pattern[i % pattern.length];
    }
    return shifts;
  };

  const buildLiburShifts = (offDayOfWeek: number): { [day: number]: string } => {
    const shifts: { [day: number]: string } = {};
    for (let i = 0; i < totalDays; i++) {
      const d = days[i];
      shifts[d.day] = d.isWeekend ? 'L' : 'MD';
    }
    return shifts;
  };

  return [
    // GUDANG — rotasi P/M/MD
    { no: 1, division: 'GUDANG', name: 'GATOT', shifts: buildShifts(['P', 'L', 'M', 'M', 'M', 'MD']) },
    { no: 2, division: 'GUDANG', name: 'MANG UBE', shifts: buildShifts(['L', 'P', 'P', 'P', 'P', 'P']) },
    { no: 3, division: 'GUDANG', name: 'ABAH', shifts: buildShifts(['M', 'M', 'L', 'L', 'M', 'M']) },
    // LED
    { no: 4, division: 'LED', name: 'AYONG', shifts: buildLiburShifts(6) },
    { no: 5, division: 'LED', name: 'WIGI', shifts: buildLiburShifts(5) },
    { no: 6, division: 'LED', name: 'IRFAN', shifts: buildLiburShifts(4) },
    { no: 7, division: 'SERVICE', name: 'Mulyana (Kharo)', shifts: buildLiburShifts(3) },
    // ADMIN
    { no: 8, division: 'ADMIN', name: 'AGUS', shifts: buildLiburShifts(6) },
    { no: 9, division: 'ADMIN', name: 'FAHRUL', shifts: buildLiburShifts(6) },
    { no: 10, division: 'ADMIN', name: 'CACA', shifts: buildLiburShifts(6) },
    { no: 11, division: 'ADMIN', name: 'OM SENO', shifts: buildLiburShifts(3) },
    { no: 12, division: 'ADMIN', name: 'WAHYU', shifts: buildLiburShifts(6) },
    // SOUND — piket bergilir
    { no: 13, division: 'SOUND', name: 'MBOH', shifts: buildShifts(['MD', 'MD', '-', '-', '-', '-', '-']) },
    { no: 14, division: 'SOUND', name: 'DANI', shifts: buildShifts(['-', '-', 'MD', '-', '-', '-', '-']) },
    { no: 15, division: 'SOUND', name: 'UNYIM', shifts: buildShifts(['MD', '-', '-', '-', 'MD', '-', '-']) },
    { no: 16, division: 'SOUND', name: 'BUTONK', shifts: buildShifts(['MD', '-', '-', '-', '-', 'MD', '-']) },
    { no: 17, division: 'SOUND', name: 'YUDIS', shifts: buildShifts(['-', '-', '-', 'MD', '-', '-', '-']) },
    { no: 18, division: 'SOUND', name: 'BULUX', shifts: buildShifts(['-', 'MD', '-', '-', '-', '-', 'MD']) },
    { no: 19, division: 'SOUND', name: 'OPIK', shifts: buildShifts(['-', 'MD', '-', '-', 'MD', '-', '-']) },
    // LIGHTING
    { no: 20, division: 'LIGHTING', name: 'HERI', shifts: buildShifts(['-', 'MD', '-', '-', 'MD', '-', '-']) },
    // MULTIMEDIA
    { no: 21, division: 'MULTIMEDIA', name: 'JAY', shifts: buildShifts(['-', 'MD', 'MD', '-', '-', '-', '-']) },
    // SERVICE
    { no: 22, division: 'SERVICE', name: 'DAMRI', shifts: buildLiburShifts(6) }
  ];
}

// ─────────────────────────────────────────────────────────────
// SEPTEMBER 2026 — Official (hardcoded dari dokumen resmi)
// ─────────────────────────────────────────────────────────────
export const SCHEDULE_SEP_2026: MonthlySchedule = {
  key: '2026-09',
  month: 9,
  year: 2026,
  label: 'September 2026',
  labelShort: 'Sep 2026',
  totalDays: 30,
  days: SEPTEMBER_2026_DAYS,
  rows: OFFICIAL_SEPTEMBER_2026_SCHEDULE
};

// ─────────────────────────────────────────────────────────────
// OKTOBER 2026 — Template (diisi Admin via aplikasi)
// Oktober 2026: 1 Okt = Kamis
// ─────────────────────────────────────────────────────────────
export const SCHEDULE_OCT_2026: MonthlySchedule = {
  key: '2026-10',
  month: 10,
  year: 2026,
  label: 'Oktober 2026',
  labelShort: 'Okt 2026',
  totalDays: 31,
  days: generateMonthDays(2026, 10),
  rows: buildTemplateRows(2026, 10)
};

// ─────────────────────────────────────────────────────────────
// NOVEMBER 2026 — Template
// ─────────────────────────────────────────────────────────────
export const SCHEDULE_NOV_2026: MonthlySchedule = {
  key: '2026-11',
  month: 11,
  year: 2026,
  label: 'November 2026',
  labelShort: 'Nov 2026',
  totalDays: 30,
  days: generateMonthDays(2026, 11),
  rows: buildTemplateRows(2026, 11)
};

// ─────────────────────────────────────────────────────────────
// DESEMBER 2026 — Template
// ─────────────────────────────────────────────────────────────
export const SCHEDULE_DEC_2026: MonthlySchedule = {
  key: '2026-12',
  month: 12,
  year: 2026,
  label: 'Desember 2026',
  labelShort: 'Des 2026',
  totalDays: 31,
  days: generateMonthDays(2026, 12),  // corrected: Dec has 31 days
  rows: buildTemplateRows(2026, 12)
};

// ─────────────────────────────────────────────────────────────
// REGISTRY — semua jadwal yang tersedia
// ─────────────────────────────────────────────────────────────
export const ALL_MONTHLY_SCHEDULES: MonthlySchedule[] = [
  SCHEDULE_SEP_2026,
  SCHEDULE_OCT_2026,
  SCHEDULE_NOV_2026,
  SCHEDULE_DEC_2026
];

export function getScheduleByKey(key: string): MonthlySchedule | undefined {
  return ALL_MONTHLY_SCHEDULES.find(s => s.key === key);
}

export function getScheduleByMonthYear(month: number, year: number): MonthlySchedule | undefined {
  return ALL_MONTHLY_SCHEDULES.find(s => s.month === month && s.year === year);
}

export function getCurrentMonthSchedule(): MonthlySchedule {
  const now = new Date();
  const found = getScheduleByMonthYear(now.getMonth() + 1, now.getFullYear());
  return found || SCHEDULE_SEP_2026;
}

export function getActiveMonthKey(): string {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const found = ALL_MONTHLY_SCHEDULES.find(s => s.key === key);
  return found ? key : '2026-09';
}

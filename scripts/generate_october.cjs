const fs = require('fs');

const DAY_NAMES_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
function generateMonthDays(year, month) {
  const totalDays = new Date(year, month, 0).getDate();
  const days = [];
  for (let d = 1; d <= totalDays; d++) {
    const jsDate = new Date(year, month - 1, d);
    const dow = jsDate.getDay();
    days.push({
      day: d,
      dayName: DAY_NAMES_ID[dow],
      isWeekend: dow === 0 || dow === 6
    });
  }
  return days;
}

const days = generateMonthDays(2026, 10);
const totalDays = days.length;

function buildShifts(pattern) {
  const shifts = {};
  for (let i = 0; i < totalDays; i++) {
    shifts[i + 1] = pattern[i % pattern.length];
  }
  return shifts;
}

function buildLiburShifts(offDayOfWeek) {
  const shifts = {};
  for (let i = 0; i < totalDays; i++) {
    const d = days[i];
    shifts[d.day] = d.isWeekend ? 'L' : 'MD';
  }
  return shifts;
}

const rows = [
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
  // SOUND
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

const content = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * JADWAL KERJA RESMI BULAN OKTOBER 2026
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import { StaffScheduleRow } from './staffSchedules';

export const OKTOBER_2026_DAYS: { day: number; dayName: string; isWeekend: boolean }[] = ${JSON.stringify(days, null, 2).replace(/"/g, "'")};

export const OFFICIAL_OKTOBER_2026_SCHEDULE: StaffScheduleRow[] = ${JSON.stringify(rows, null, 2)};
`;

fs.writeFileSync('src/data/oktober2026Schedule.ts', content);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * JADWAL KERJA RESMI BULAN SEPTEMBER 2026
 * PT. RIZ PRODUCTION MULTI KREASI
 * Berdasarkan Dokumen Resmi: SCHEDULE BULAN SEPTEMBER 2026
 */

export interface ScheduleShiftInfo {
  code: string;
  name: string;
  timeRange: string;
  bg: string;
  text: string;
  border: string;
}

export const SHIFT_LEGEND: Record<string, ScheduleShiftInfo> = {
  P: {
    code: 'P',
    name: 'Pagi',
    timeRange: 'Gudang: 07.00-19.00 | Admin: 07.00-15.00',
    bg: 'bg-emerald-100',
    text: 'text-emerald-800 font-black',
    border: 'border-emerald-300'
  },
  MD: {
    code: 'MD',
    name: 'Middle Day',
    timeRange: 'Sound/Light/LED/MM: 10.00-18.00 | Gudang: 10.00-22.00 | Admin: 09.00-17.00 / 12.00-20.00',
    bg: 'bg-blue-100',
    text: 'text-blue-800 font-black',
    border: 'border-blue-300'
  },
  M: {
    code: 'M',
    name: 'Malam',
    timeRange: 'Gudang: 19.00-07.00',
    bg: 'bg-indigo-900',
    text: 'text-indigo-100 font-black',
    border: 'border-indigo-700'
  },
  PM: {
    code: 'PM',
    name: 'Afternoon',
    timeRange: 'Admin: 16.00-00.00',
    bg: 'bg-purple-100',
    text: 'text-purple-800 font-black',
    border: 'border-purple-300'
  },
  L: {
    code: 'L',
    name: 'Libur',
    timeRange: 'Off Duty (Libur Mingguan)',
    bg: 'bg-amber-400',
    text: 'text-amber-950 font-black',
    border: 'border-amber-500'
  },
  Cuti: {
    code: 'Cuti',
    name: 'Cuti',
    timeRange: 'Cuti Resmi / Izin Tahunan',
    bg: 'bg-rose-600',
    text: 'text-white font-black',
    border: 'border-rose-700'
  },
  '-': {
    code: '-',
    name: 'Standby / Libur',
    timeRange: 'Off Standby',
    bg: 'bg-slate-50',
    text: 'text-slate-300',
    border: 'border-slate-200'
  }
};

export interface StaffScheduleRow {
  no: number;
  division: 'GUDANG' | 'LED' | 'ADMIN' | 'SOUND' | 'LIGHTING' | 'MULTIMEDIA';
  name: string;
  shifts: { [day: number]: string };
}

export const SEPTEMBER_2026_DAYS: { day: number; dayName: string; isWeekend: boolean }[] = [
  { day: 1, dayName: 'Sel', isWeekend: false },
  { day: 2, dayName: 'Rab', isWeekend: false },
  { day: 3, dayName: 'Kam', isWeekend: false },
  { day: 4, dayName: 'Jum', isWeekend: false },
  { day: 5, dayName: 'Sab', isWeekend: true },
  { day: 6, dayName: 'Min', isWeekend: true },
  { day: 7, dayName: 'Sen', isWeekend: false },
  { day: 8, dayName: 'Sel', isWeekend: false },
  { day: 9, dayName: 'Rab', isWeekend: false },
  { day: 10, dayName: 'Kam', isWeekend: false },
  { day: 11, dayName: 'Jum', isWeekend: false },
  { day: 12, dayName: 'Sab', isWeekend: true },
  { day: 13, dayName: 'Min', isWeekend: true },
  { day: 14, dayName: 'Sen', isWeekend: false },
  { day: 15, dayName: 'Sel', isWeekend: false },
  { day: 16, dayName: 'Rab', isWeekend: false },
  { day: 17, dayName: 'Kam', isWeekend: false },
  { day: 18, dayName: 'Jum', isWeekend: false },
  { day: 19, dayName: 'Sab', isWeekend: true },
  { day: 20, dayName: 'Min', isWeekend: true },
  { day: 21, dayName: 'Sen', isWeekend: false },
  { day: 22, dayName: 'Sel', isWeekend: false },
  { day: 23, dayName: 'Rab', isWeekend: false },
  { day: 24, dayName: 'Kam', isWeekend: false },
  { day: 25, dayName: 'Jum', isWeekend: false },
  { day: 26, dayName: 'Sab', isWeekend: true },
  { day: 27, dayName: 'Min', isWeekend: true },
  { day: 28, dayName: 'Sen', isWeekend: false },
  { day: 29, dayName: 'Sel', isWeekend: false },
  { day: 30, dayName: 'Rab', isWeekend: false },
];

export const OFFICIAL_SEPTEMBER_2026_SCHEDULE: StaffScheduleRow[] = [
  // ─────────────────────────────────────────────────────────────
  // GUDANG
  // ─────────────────────────────────────────────────────────────
  {
    no: 1,
    division: 'GUDANG',
    name: 'GATOT',
    shifts: {
      1: 'P', 2: 'L', 3: 'M', 4: 'M', 5: 'M', 6: 'MD', 7: 'P', 8: 'L', 9: 'Cuti', 10: 'M',
      11: 'M', 12: 'MD', 13: 'P', 14: 'L', 15: 'M', 16: 'M', 17: 'M', 18: 'MD', 19: 'P', 20: 'L',
      21: 'M', 22: 'M', 23: 'M', 24: 'MD', 25: 'P', 26: 'L', 27: 'M', 28: 'M', 29: 'M', 30: 'MD'
    }
  },
  {
    no: 2,
    division: 'GUDANG',
    name: 'MANG UBE',
    shifts: {
      1: 'L', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'L', 8: 'P', 9: 'P', 10: 'P',
      11: 'P', 12: 'P', 13: 'L', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'L', 20: 'P',
      21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'L', 26: 'P', 27: 'P', 28: 'P', 29: 'P', 30: 'P'
    }
  },
  {
    no: 3,
    division: 'GUDANG',
    name: 'ABAH',
    shifts: {
      1: 'M', 2: 'M', 3: 'L', 4: 'L', 5: 'M', 6: 'M', 7: 'M', 8: 'M', 9: 'L', 10: 'L',
      11: 'M', 12: 'M', 13: 'M', 14: 'M', 15: 'L', 16: 'L', 17: 'M', 18: 'M', 19: 'M', 20: 'M',
      21: 'L', 22: 'L', 23: 'M', 24: 'M', 25: 'M', 26: 'M', 27: 'L', 28: 'L', 29: 'M', 30: 'M'
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LED (VIDEOTRON)
  // ─────────────────────────────────────────────────────────────
  {
    no: 4,
    division: 'LED',
    name: 'AYONG',
    shifts: {
      1: 'MD', 2: 'MD', 3: 'MD', 4: 'MD', 5: 'MD', 6: 'L', 7: 'MD', 8: 'MD', 9: 'MD', 10: 'MD',
      11: 'MD', 12: 'L', 13: 'MD', 14: 'MD', 15: 'MD', 16: 'MD', 17: 'MD', 18: 'L', 19: 'MD', 20: 'MD',
      21: 'MD', 22: 'MD', 23: 'MD', 24: 'L', 25: 'MD', 26: 'MD', 27: 'MD', 28: 'MD', 29: 'MD', 30: 'L'
    }
  },
  {
    no: 5,
    division: 'LED',
    name: 'WIGI',
    shifts: {
      1: 'MD', 2: 'MD', 3: 'MD', 4: 'MD', 5: 'L', 6: 'MD', 7: 'MD', 8: 'MD', 9: 'MD', 10: 'MD',
      11: 'L', 12: 'MD', 13: 'MD', 14: 'MD', 15: 'MD', 16: 'MD', 17: 'L', 18: 'MD', 19: 'MD', 20: 'MD',
      21: 'MD', 22: 'MD', 23: 'L', 24: 'MD', 25: 'MD', 26: 'MD', 27: 'MD', 28: 'MD', 29: 'L', 30: 'MD'
    }
  },
  {
    no: 6,
    division: 'LED',
    name: 'IRFAN',
    shifts: {
      1: 'MD', 2: 'MD', 3: 'MD', 4: 'L', 5: 'MD', 6: 'MD', 7: 'MD', 8: 'MD', 9: 'MD', 10: 'L',
      11: 'MD', 12: 'MD', 13: 'MD', 14: 'MD', 15: 'MD', 16: 'L', 17: 'MD', 18: 'MD', 19: 'MD', 20: 'MD',
      21: 'MD', 22: 'L', 23: 'MD', 24: 'MD', 25: 'MD', 26: 'MD', 27: 'MD', 28: 'L', 29: 'MD', 30: 'MD'
    }
  },
  {
    no: 7,
    division: 'LED',
    name: 'KARO',
    shifts: {
      1: 'MD', 2: 'MD', 3: 'L', 4: 'MD', 5: 'MD', 6: 'MD', 7: 'MD', 8: 'MD', 9: 'L', 10: 'MD',
      11: 'MD', 12: 'MD', 13: 'MD', 14: 'MD', 15: 'L', 16: 'MD', 17: 'MD', 18: 'MD', 19: 'MD', 20: 'MD',
      21: 'L', 22: 'MD', 23: 'MD', 24: 'MD', 25: 'MD', 26: 'MD', 27: 'L', 28: 'MD', 29: 'MD', 30: 'MD'
    }
  },

  // ─────────────────────────────────────────────────────────────
  // ADMIN
  // ─────────────────────────────────────────────────────────────
  {
    no: 8,
    division: 'ADMIN',
    name: 'AGUS',
    shifts: {
      1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'L', 6: 'P', 7: 'P', 8: 'P', 9: 'L', 10: 'P',
      11: 'P', 12: 'P', 13: 'L', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'L',
      21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'L', 27: 'P', 28: 'P', 29: 'P', 30: 'L'
    }
  },
  {
    no: 9,
    division: 'ADMIN',
    name: 'FAHRUL',
    shifts: {
      1: 'PM', 2: 'L', 3: 'PM', 4: 'PM', 5: 'PM', 6: 'L', 7: 'PM', 8: 'PM', 9: 'PM', 10: 'PM',
      11: 'PM', 12: 'PM', 13: 'L', 14: 'PM', 15: 'PM', 16: 'PM', 17: 'PM', 18: 'PM', 19: 'L', 20: 'MD',
      21: 'PM', 22: 'PM', 23: 'L', 24: 'PM', 25: 'PM', 26: 'PM', 27: 'L', 28: 'PM', 29: 'PM', 30: 'PM'
    }
  },
  {
    no: 10,
    division: 'ADMIN',
    name: 'CACA',
    shifts: {
      1: 'MD', 2: 'MD', 3: 'MD', 4: 'MD', 5: 'P', 6: 'L', 7: 'MD', 8: 'MD', 9: 'P', 10: 'MD',
      11: 'MD', 12: 'L', 13: 'P', 14: 'MD', 15: 'MD', 16: 'L', 17: 'MD', 18: 'MD', 19: 'MD', 20: 'L',
      21: 'MD', 22: 'MD', 23: 'MD', 24: 'MD', 25: 'MD', 26: 'P', 27: 'L', 28: 'MD', 29: 'MD', 30: 'P'
    }
  },
  {
    no: 11,
    division: 'ADMIN',
    name: 'OM SENO',
    shifts: {
      1: 'MD', 2: 'MD', 3: 'L', 4: 'MD', 5: 'MD', 6: 'MD', 7: 'MD', 8: 'L', 9: 'MD', 10: 'MD',
      11: 'MD', 12: 'MD', 13: 'L', 14: 'MD', 15: 'MD', 16: 'MD', 17: 'MD', 18: 'L', 19: 'MD', 20: 'MD',
      21: 'MD', 22: 'MD', 23: 'L', 24: 'MD', 25: 'MD', 26: 'MD', 27: 'MD', 28: 'L', 29: 'MD', 30: 'MD'
    }
  },

  // ─────────────────────────────────────────────────────────────
  // SOUND (AUDIO)
  // ─────────────────────────────────────────────────────────────
  {
    no: 12,
    division: 'SOUND',
    name: 'MBOH',
    shifts: {
      1: 'MD', 2: 'MD', 6: 'MD', 9: 'MD', 12: 'MD', 15: 'MD', 22: 'MD', 25: 'MD', 29: 'MD'
    }
  },
  {
    no: 13,
    division: 'SOUND',
    name: 'DANI',
    shifts: {
      3: 'MD', 7: 'MD', 11: 'MD', 14: 'MD', 18: 'MD', 23: 'MD', 27: 'MD'
    }
  },
  {
    no: 14,
    division: 'SOUND',
    name: 'UNYINK',
    shifts: {
      1: 'MD', 5: 'MD', 9: 'MD', 12: 'MD', 17: 'MD', 20: 'MD', 21: 'MD', 25: 'MD', 29: 'MD'
    }
  },
  {
    no: 15,
    division: 'SOUND',
    name: 'BUTONK',
    shifts: {
      1: 'MD', 5: 'MD', 9: 'M', 13: 'MD', 16: 'MD', 20: 'MD', 21: 'MD', 25: 'MD', 29: 'MD'
    }
  },
  {
    no: 16,
    division: 'SOUND',
    name: 'YUDIS',
    shifts: {
      4: 'MD', 8: 'MD', 12: 'MD', 15: 'MD', 19: 'MD', 23: 'MD', 27: 'MD'
    }
  },
  {
    no: 17,
    division: 'SOUND',
    name: 'BULUX',
    shifts: {
      2: 'MD', 7: 'MD', 10: 'MD', 13: 'MD', 18: 'MD', 20: 'MD', 24: 'MD', 28: 'MD'
    }
  },
  {
    no: 18,
    division: 'SOUND',
    name: 'OPIK',
    shifts: {
      2: 'MD', 6: 'MD', 9: 'M', 11: 'MD', 14: 'MD', 17: 'MD', 22: 'MD', 24: 'MD', 26: 'MD', 30: 'MD'
    }
  },

  // ─────────────────────────────────────────────────────────────
  // LIGHTING
  // ─────────────────────────────────────────────────────────────
  {
    no: 19,
    division: 'LIGHTING',
    name: 'HERI',
    shifts: {
      2: 'MD', 5: 'MD', 9: 'MD', 13: 'MD', 16: 'MD', 19: 'MD', 22: 'MD', 25: 'MD', 29: 'MD'
    }
  },

  // ─────────────────────────────────────────────────────────────
  // MULTIMEDIA
  // ─────────────────────────────────────────────────────────────
  {
    no: 20,
    division: 'MULTIMEDIA',
    name: 'JAY',
    shifts: {
      2: 'MD', 3: 'MD', 8: 'MD', 12: 'MD', 17: 'MD', 18: 'MD', 21: 'MD', 27: 'MD', 28: 'MD'
    }
  }
];

export const SCHEDULE_NOTE = {
  rule1: 'Jika di jadwal masuk tsb ada JOB Event, Jadwal masuknya Bisa digantikan keesokan harinya atau lusanya.',
  rule2: 'Dalam minggu yang sama diwajibkan masuk minimal 2x dalam seminggu untuk Team Sound, Lighting dan Streaming (Multimedia).'
};

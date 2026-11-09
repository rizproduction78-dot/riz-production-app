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

export interface BalancedSheetTaskItem {
  activity: string;
  remark: string;
  isQc: boolean;
  isTechnicalWork: boolean;
}

const NON_QC_ACTIVITY_PATTERNS = /^(?:[-*•\d.)\s]*)(?:buat\s+dudukan|buat\s+colase|colase\b|repack\b|rapih|ngerapihin|merapihkan|beres[\s-]*beres|nyuci\s+pemberat|pembuatan\s+storytelling|belajar\b|training\b|prepare\b|pengembalian\s+alat|bantu\s+team|mencatat\s+serial|pencatatan\s+serial|melanjutkan\s+pencatatan|marking\b|setup\s+layout)/i;

const NON_EQUIPMENT_CLEANING_PATTERNS = /\b(?:rak\s+kantor|kamar\s+mandi|toilet|ruangan|lantai|halaman|sampah|meja\s+kerja)\b/i;

const TECHNICAL_QC_ACTIVITY_PATTERNS = /\b(?:qc|inspeksi|checklist|onhouse|p2h|cek|check|pengecekan|uji|testing|test\s+unit|maintenan+a?ce|maintenace|servi[cs]e|repair|ganti|benerin|sortir|update\s+firmware|touch\s*up|vacum|inventory|kabinet|modul|dl\s*32|dl\s*251|mixer|ewd|slxd|qlxd|iem|whm|parled|beam|hazer|smoke|ups|takel|tripot|tripod|avanda|sub\s+kla|db\s*tech|db\s*no|monitor|hdmi|sdi|kabel|prosesor|processor|hanging\s*bar|hangging\s*bar|drum|mic|speaker|headset|legran|legrand|box\s*led|stand\s*box)\b/i;

const TECHNICAL_REMARK_PATTERNS = /\b(?:ok|oke|aman|normal|bersih|bagus|terkoneksi|terkonecting|lengkap|siap\s+di\s*pakai|eror|error|rusak|mati|lemah|bermasalah|perbaikan|service|recieving|receiving|dead\s+pixel|ic\s+warna|ganti\s+jalur|ngacing|selesai|done|ada|sudah|beres)\b/i;

export function isSheetSubTaskQc(activity: string, remark: string = ''): boolean {
  const actClean = String(activity || '').trim();
  const remClean = String(remark || '').trim();
  if (!actClean && !remClean) return false;

  if (NON_QC_ACTIVITY_PATTERNS.test(actClean)) {
    // Pengecualian jika di baris yang sama eksplisit melakukan cek/check kelengkapan
    if (!/\b(?:cek|check|pengecekan|inspeksi|test\s+unit)\b/i.test(actClean)) {
      return false;
    }
  }

  if (NON_EQUIPMENT_CLEANING_PATTERNS.test(actClean)) {
    return false;
  }

  if (/\b(?:cleaning|bersih)/i.test(actClean)) {
    return true;
  }

  if (TECHNICAL_QC_ACTIVITY_PATTERNS.test(actClean)) {
    return true;
  }

  if (TECHNICAL_REMARK_PATTERNS.test(remClean) && !NON_QC_ACTIVITY_PATTERNS.test(actClean)) {
    return true;
  }

  return false;
}

export function isSheetSubTaskTechnicalWork(activity: string, remark: string = ''): boolean {
  if (isSheetSubTaskQc(activity, remark)) return true;
  const combined = `${activity || ''} ${remark || ''}`.toLowerCase();
  return /\b(?:servi[cs]e|repair|ganti|benerin|maintenan+a?ce|maintenace|repack|buat\s+dudukan|instal|pasang|solder|kanibal|modif|perbaikan|test\s+unit|cek|check|cleaning|bersih|rapih)\b/i.test(combined);
}

function isPureRemarkHeaderSentence(activity: string, remark: string): boolean {
  if (remark) return false;
  const clean = activity.replace(/^[-*•\s]+/, '').trim();
  if (!clean) return false;
  if (/^(?:cek|check|cleaning|bersih|servi[cs]e|repair|ganti|benerin|rapih|repack|mainten|proses|buat|setup|touch|training|belajar|prepare|sortir|vacum|update)\b/i.test(clean)) {
    return false;
  }
  return /\b(?:semua\s+dalam\s+kondisi\s+normal|siap\s+di\s*pakai\s+untuk\s+event|kondisi\s+normal\s+semua)\b/i.test(clean);
}

function isSheetContinuationLine(activity: string): boolean {
  const clean = activity.replace(/^[-*•\s]+/, '').trim();
  if (!clean) return true;
  // Baris yang hanya berisi nomor urut / rentang nomor unit atau lanjutan breket bernomor (contoh: "No. 1-2-3...", "14-15-16...", "Breket (No. 1-2-3...)", "Kelengkapan breket (No.1-2-3...)")
  if (/^(?:(?:kelengkapan\s+)?breket\s*)?\(?\s*(?:no\.?\s*)?[\d\s,.\-–s/d]+\)?$/i.test(clean)) {
    return true;
  }
  // Baris keterangan lanjutan kalimat sebelumnya (contoh: "massing2 menjadi 2 WHM dalam 1 box", "Note : G3 Yang isi 4...")
  if (/^(?:mass?ing\d*|masing\d*|note\s*:|catatan\s*:|nb\s*:)/i.test(clean)) {
    return true;
  }
  return false;
}

function isParentSummaryHeaderRow(
  current: { activity: string; remark: string },
  nextRow?: { activity: string; remark: string }
): boolean {
  if (!nextRow) return false;
  const cleanAct = current.activity.replace(/^[-*•\s]+/, '').trim();
  const nextAct = nextRow.activity.trim();

  // Header kategori inventaris/umum yang diikuti rincian sub-item
  if (/^(?:\d+[.)]\s*)?(?:update\s+inventory|inventory|cek\s+unit\s+tripot|cek\s+all\s+servisan|perbaikan\s*:?|service\s+&\s+cek\s+unit)$/i.test(cleanAct)) {
    return true;
  }

  // Header ringkasan servis kabinet LED (contoh: "servise 8 kabinet led", "servise 6 kabinet", "1. servise 7 kabinet led", "1. repair 12 kabinet")
  // yang langsung diikuti rincian sub-kabinet ("- 6 kabinet ganti dead pixel", "-1 kabinet ngacing", dst.)
  if (
    /^(?:\d+[.)]\s*)?(?:servi[cs]e|repair)\s+\d+\s+kabinet(?:\s+led)?$/i.test(cleanAct) &&
    /^-+\s*\d+\s*kabinet\b/i.test(nextAct)
  ) {
    return true;
  }

  // Header "2. cek 11 modul kabinet" yang diikuti rincian "- 2 modul ilang jalur ic", dst.
  if (
    /^(?:\d+[.)]\s*)?cek\s+\d+\s+modul\s+kabinet$/i.test(cleanAct) &&
    /^-+\s*\d+\s*modul\b/i.test(nextAct)
  ) {
    return true;
  }

  return false;
}

function getEquipmentTaskGroupKey(activity: string): string | null {
  let s = activity
    .replace(/^[-*•\s]+/, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  if (!s) return null;

  // Normalisasi ejaan umum di Google Sheet agar peralatan yang sama terkelompokkan secara adil
  s = s
    .replace(/\bmaintenan+a?ce\b|\bmaintenace\b/g, 'maintenance')
    .replace(/\bextention\b/g, 'extension')
    .replace(/\bservise\b/g, 'service')
    .replace(/\b(?:twitter|twiter|twitwe)\b/g, 'tweeter')
    .replace(/(\d+)\s*(?:meter|m)\b/g, '$1meter');

  // 1. Kelompokkan rentang unit Wireless Mic Sennheiser EWD ("EWD no. 5 - 8", "EWD no. 9 - 12", dst.)
  if (/^ewd\s+no\.?\s*[\d\s\-–,]+$/i.test(s)) {
    return 'whm-ewd-batch';
  }
  // 2. Kelompokkan rentang unit Wireless Mic Shure SLXD / QLXD ("SLXD no. 1 - 4", "QLXD no 9 - 12", dst.)
  if (/^(?:slxd|qlxd)\s+no\.?\s*[\d\s\-–,]+$/i.test(s)) {
    return 'whm-shure-batch';
  }
  // 3. Kelompokkan rincian inventaris stand ("stand speaker 22pcs", "stand mic lama 44pcs", dst.)
  if (/^stand\s+(?:speaker|mic|kick|boox|box|key|gtr|gitar)\b/i.test(s)) {
    return 'inventory-stand-batch';
  }
  // 4. Kelompokkan rincian marking mic berurutan ("marking mic sm58...", "marking mic drum")
  if (/^marking\s+mic\b/i.test(s)) {
    return 'marking-mic-batch';
  }
  // 5. Kelompokkan rincian inventaris takel ("takel 2ton 2pcs", "takel 1ton 8pcs", "setrap takel...")
  if (/^(?:setrap\s+)?takel\b/i.test(s)) {
    return 'inventory-takel-batch';
  }
  // 6. Kelompokkan rincian cek modul kabinet ("2 modul ilang jalur ic", "3 modul ilang jalur pixel", dst.)
  if (/^\d+\s*modul\s+(?:ilang|kena|arus|rusak|mati|error)\b/i.test(s)) {
    return 'cek-modul-kabinet-batch';
  }
  // 7. Kelompokkan rincian cek unit tripot A-G ("A , Tripot Centurion", "B , Tripot Centurion", dst.)
  if (/^[a-g]\s*,\s*tripot\b/i.test(s)) {
    return 'cek-tripot-batch';
  }
  // 8. Kelompokkan pengecekan/perbaikan unit bernomor seri sama ("DL 32 no 1".."DL 32 no 4", "Ganti tweeter DB No 15/18/5")
  const unitNoMatch = s.match(/^(.+?)\s+no\.?\s*\d+(?:\s*[-–,]\s*\d+)*$/i);
  if (unitNoMatch) {
    const base = unitNoMatch[1].trim();
    if (base.length >= 3) {
      return `unit-no:${base}`;
    }
  }
  // 9. Kelompokkan penomoran kabel/alat berurutan di akhir baris ("cek all kabel lan 1".."10", "maintenance kabel extension 50meter 1".."2", "10meter 1".."11")
  const trailingIdxMatch = s.match(/^(.+?)\s+\d+$/);
  if (trailingIdxMatch) {
    const base = trailingIdxMatch[1].trim();
    // Pastikan base memiliki minimal 2 kata agar tidak menggabungkan kalimat biasa
    if (base.split(/\s+/).length >= 2) {
      return `unit-idx:${base}`;
    }
  }

  return null;
}

/**
 * Mengekstrak daftar tugas terstruktur dan berimbang dari entri Google Sheet (DailyReport / LogbookEntry).
 * - Membaca rincian baris (`rowDetails` atau baris `activity`/`notes`) secara utuh.
 * - Menggabungkan baris lanjutan nomor unit (seperti rentang No. 1-48) ke tugas induknya.
 * - Melewati baris judul/ringkasan induk jika langsung diikuti rincian sub-tugas di bawahnya.
 * - Mengelompokkan penomoran unit berulang pada alat yang sama (seperti kabel LAN 1-10 atau kabel extension 1-11)
 *   menjadi 1 kesatuan tugas peralatan agar perhitungan antar-staf proporsional dan berimbang.
 */
export type SheetTaskSourceItem = Partial<DailyReport> | Partial<LogbookEntry> | Record<string, any> | null | undefined;

export function extractBalancedSheetTasks(
  item?: SheetTaskSourceItem
): BalancedSheetTaskItem[] {
  if (!item) return [];

  const rawRows: { activity: string; remark: string }[] = [];
  const details = (item as any).rowDetails;

  if (Array.isArray(details) && details.length > 0) {
    for (const d of details) {
      const actRaw = String(d?.activity || '').trim();
      const remRaw = String(d?.remark || '').trim();
      if (!actRaw && !remRaw) continue;

      const actLines = actRaw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const remLines = remRaw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      if (actLines.length > 1) {
        actLines.forEach((line, idx) => {
          rawRows.push({
            activity: line,
            remark: remLines[idx] ?? (idx === 0 ? remLines.join(' | ') : '')
          });
        });
      } else {
        rawRows.push({ activity: actRaw, remark: remRaw });
      }
    }
  } else {
    const actText = String(item.activity || '').trim();
    const remText = String((item as any).notes || (item as any).followUp || '').trim();
    const actLines = actText.split(/\r?\n/).map(l => l.trim()).filter(l => l && l !== '-');
    const remLines = remText.split(/\r?\n/).map(l => l.trim());

    if (actLines.length === 0 && remText && remText !== '-') {
      rawRows.push({ activity: remText, remark: remText });
    } else {
      actLines.forEach((line, idx) => {
        rawRows.push({
          activity: line,
          remark: remLines[idx] ?? (actLines.length > 1 && remLines.length === 1 ? remLines[0] : '')
        });
      });
    }
  }

  if (rawRows.length === 0) return [];

  // Tahap 1: Gabungkan baris remark di awal blok & baris lanjutan (nomor unit / catatan)
  const step1Rows: { activity: string; remark: string }[] = [];
  let pendingSharedRemark = '';

  for (let i = 0; i < rawRows.length; i++) {
    const curr = rawRows[i];
    const act = curr.activity.trim();
    const rem = curr.remark.trim();

    if (!act && !rem) continue;

    // Jika baris hanya berisi remark tanpa activity, tempelkan ke tugas sebelumnya
    if (!act && rem) {
      if (step1Rows.length > 0) {
        const prev = step1Rows[step1Rows.length - 1];
        prev.remark = prev.remark ? `${prev.remark} | ${rem}` : rem;
      } else {
        pendingSharedRemark = pendingSharedRemark ? `${pendingSharedRemark} | ${rem}` : rem;
      }
      continue;
    }

    // Jika baris pertama adalah kalimat status/remark umum untuk daftar unit di bawahnya (contoh: WHM Yudish)
    if (isPureRemarkHeaderSentence(act, rem) && i + 1 < rawRows.length) {
      pendingSharedRemark = pendingSharedRemark ? `${pendingSharedRemark} | ${act}` : act;
      continue;
    }

    // Jika baris adalah lanjutan nomor unit atau catatan dari baris di atasnya
    if (isSheetContinuationLine(act) && step1Rows.length > 0) {
      const prev = step1Rows[step1Rows.length - 1];
      prev.activity = `${prev.activity} ${act}`.replace(/\s+/g, ' ').trim();
      if (rem && !prev.remark.includes(rem)) {
        prev.remark = prev.remark ? `${prev.remark} | ${rem}` : rem;
      }
      continue;
    }

    const effectiveRemark = rem || pendingSharedRemark;
    // Reset pendingSharedRemark jika baris sudah berganti ke kalimat kerja baru yang memiliki remark sendiri
    if (rem) {
      pendingSharedRemark = '';
    }

    step1Rows.push({
      activity: act,
      remark: effectiveRemark
    });
  }

  if (step1Rows.length === 0 && pendingSharedRemark) {
    step1Rows.push({ activity: pendingSharedRemark, remark: pendingSharedRemark });
  }

  // Tahap 2: Lewati baris ringkasan induk jika langsung diikuti rincian sub-tugas
  const step2Rows: { activity: string; remark: string }[] = [];
  for (let i = 0; i < step1Rows.length; i++) {
    const curr = step1Rows[i];
    const next = step1Rows[i + 1];
    if (isParentSummaryHeaderRow(curr, next)) {
      if (curr.remark && next && !next.remark.includes(curr.remark)) {
        next.remark = next.remark ? `${curr.remark} | ${next.remark}` : curr.remark;
      }
      continue;
    }
    step2Rows.push(curr);
  }

  // Tahap 3: Kelompokkan penomoran unit berurutan untuk jenis alat/pekerjaan yang sama
  const groupedRows: { activity: string; remark: string; groupKey: string | null }[] = [];
  for (const row of step2Rows) {
    const gKey = getEquipmentTaskGroupKey(row.activity);
    const prev = groupedRows[groupedRows.length - 1];
    if (prev && gKey && prev.groupKey === gKey) {
      prev.activity = `${prev.activity}; ${row.activity}`;
      if (row.remark && !prev.remark.includes(row.remark)) {
        prev.remark = prev.remark ? `${prev.remark} | ${row.remark}` : row.remark;
      }
    } else {
      groupedRows.push({
        activity: row.activity,
        remark: row.remark,
        groupKey: gKey
      });
    }
  }

  return groupedRows.map(r => ({
    activity: r.activity,
    remark: r.remark,
    isQc: isSheetSubTaskQc(r.activity, r.remark),
    isTechnicalWork: isSheetSubTaskTechnicalWork(r.activity, r.remark)
  }));
}

export function countCompletedSheetTasks(item?: SheetTaskSourceItem): number {
  if (!item) return 0;
  const tasks = extractBalancedSheetTasks(item);
  return Math.max(1, tasks.length);
}

export function countCompletedSheetQcTasks(item?: SheetTaskSourceItem): number {
  if (!item) return 0;
  const details = (item as any).rowDetails;
  if (Array.isArray(details) && details.length > 0) {
    const tasks = extractBalancedSheetTasks(item);
    return tasks.filter(t => t.isQc).length;
  }
  const tasks = extractBalancedSheetTasks(item);
  const qcMatches = tasks.filter(t => t.isQc).length;
  if (qcMatches > 0) return qcMatches;
  // Jika dipanggil pada LogbookEntry lama tanpa rowDetails (contoh: data historis September / mock test)
  const itemAny = item as any;
  if ('result' in itemAny || 'checklists' in itemAny || String(itemAny.id || '').startsWith('log-') || String(itemAny.id || '').startsWith('lg-')) {
    return 1;
  }
  return 0;
}

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
  completedTasksCount?: number;
  combinedProductivityCount?: number;
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

  // Evaluasi patokan operasional untuk bulan berjalan vs bulan lampau
  const targetReports = dailyReports.filter(r => !r.date || r.date.startsWith(targetMonthKey));
  const targetLogs = logbookEntries.filter(e => !e.date || e.date.startsWith(targetMonthKey));
  const hasDetailedTargetReports = targetReports.some(
    r => Array.isArray((r as any).rowDetails) && (r as any).rowDetails.length > 0
  );

  // Hitung hari kehadiran unik tertinggi dan volume output tugas tertinggi dari staf aktif dalam batch data
  const staffAttendanceMap = new Map<string, Set<string>>();
  const staffReportCounts = new Map<string, number>();
  targetReports.forEach(r => {
    const sName = (r.staffName || '').trim();
    if (!sName) return;
    staffReportCounts.set(sName, (staffReportCounts.get(sName) || 0) + countCompletedSheetTasks(r));
    if (r.date) {
      if (!staffAttendanceMap.has(sName)) staffAttendanceMap.set(sName, new Set());
      staffAttendanceMap.get(sName)!.add(r.date);
    }
  });
  targetLogs.forEach(e => {
    const sName = (e.staffName || '').trim();
    if (sName && e.date) {
      if (!staffAttendanceMap.has(sName)) staffAttendanceMap.set(sName, new Set());
      staffAttendanceMap.get(sName)!.add(e.date);
    }
  });

  const maxTeamAttendance = staffAttendanceMap.size > 0
    ? Math.max(1, ...Array.from(staffAttendanceMap.values()).map(set => set.size))
    : 1;
  const maxTeamReports = staffReportCounts.size > 0 ? Math.max(1, ...staffReportCounts.values()) : 1;

  const staffQcCounts = new Map<string, number>();
  if (hasDetailedTargetReports) {
    targetReports.forEach(r => {
      const sName = (r.staffName || '').trim();
      if (sName) {
        staffQcCounts.set(sName, (staffQcCounts.get(sName) || 0) + countCompletedSheetQcTasks(r));
      }
    });
  } else {
    targetLogs.forEach(e => {
      const sName = (e.staffName || '').trim();
      if (sName) {
        staffQcCounts.set(sName, (staffQcCounts.get(sName) || 0) + countCompletedSheetQcTasks(e));
      }
    });
  }
  const maxTeamQcs = staffQcCounts.size > 0 ? Math.max(1, ...staffQcCounts.values()) : 1;

  let attendanceTarget = 0;
  if (isFutureMonth) {
    attendanceTarget = 0;
  } else {
    // Sesuai Komit Mutlak §6.11 & §6.12: Target kehadiran dipatok dinamis dari hari kerja riil tertinggi di Google Sheet (bukan shift template teoritis)
    attendanceTarget = Math.max(1, maxTeamAttendance);
  }

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

  const attendanceScore = attendanceTarget > 0
    ? (attendanceCount > 0 && alphaDeductions === 0
        ? Math.min(100, Math.round(40 + ((attendanceCount / attendanceTarget) * 60)))
        : Math.min(100, Math.round((attendanceCount / attendanceTarget) * 100)))
    : (attendanceCount > 0 ? 100 : 0);

  // ─────────────────────────────────────────────────────────────
  // 4. PRODUKTIVITAS / DAILY TASK (Bobot 25%: Laporan Harian Operasional & Detail Tugas GSheet)
  // ─────────────────────────────────────────────────────────────
  const staffTargetReports = targetReports.filter(r => isStaffMatch(staff, r.staffName));
  const reportsCount = staffTargetReports.reduce((sum, r) => sum + countCompletedSheetTasks(r), 0);
  const staffReportDates = new Set(staffTargetReports.map(r => r.date).filter(Boolean));

  let realTasks: DailyTask[] = dailyTasksOverride || [];
  if (!dailyTasksOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_daily_tasks_v2') || localStorage.getItem('riz_daily_tasks');
      if (saved) realTasks = JSON.parse(saved);
    } catch (e) {}
  }
  // Hanya tambahkan DailyTask mandiri yang belum tercermin pada DailyReport Google Sheet di tanggal yang sama
  const completedTaskCount = realTasks.filter(t => {
    if (!(isStaffMatch(staff, t.assignedName) || t.assignedTo === staff.id)) return false;
    if (t.status !== 'Done') return false;
    const taskDate = t.dueDate || t.createdAt || '';
    if (!taskDate.startsWith(targetMonthKey)) return false;
    if (String(t.id || '').startsWith('dt-2026') && staffReportDates.has(taskDate.slice(0, 10))) return false;
    if (staffReportDates.has(taskDate.slice(0, 10))) return false;
    return true;
  }).length;

  const combinedProductivityCount = reportsCount + completedTaskCount;
  const reportTarget = Math.max(1, maxTeamReports);
  const reportVolumeRatio = Math.min(1, combinedProductivityCount / reportTarget);
  const targetTasksPerDay = Math.max(2, reportTarget / Math.max(1, maxTeamAttendance));
  const staffTasksPerDay = attendanceCount > 0 ? (combinedProductivityCount / attendanceCount) : 0;
  const reportDailyRatio = Math.min(1, staffTasksPerDay / targetTasksPerDay);
  const reportScore = combinedProductivityCount > 0
    ? Math.min(100, Math.round(((reportVolumeRatio * 0.70) + (reportDailyRatio * 0.30)) * 100))
    : 0;

  // ─────────────────────────────────────────────────────────────
  // 5. QUALITY / QC CHECKLIST (Bobot 20%: Inspeksi Teknis & Kesiapan Alat)
  // ─────────────────────────────────────────────────────────────
  const staffTargetLogs = targetLogs.filter(e => isStaffMatch(staff, e.staffName));
  const staffHasDetailedReports = staffTargetReports.some(
    r => Array.isArray((r as any).rowDetails) && (r as any).rowDetails.length > 0
  );

  let qcCount = 0;
  if (staffHasDetailedReports) {
    const qcFromReports = staffTargetReports.reduce((sum, r) => sum + countCompletedSheetQcTasks(r), 0);
    const standaloneLogs = staffTargetLogs.filter(
      e => !String(e.id || '').startsWith('log-rep-') && !staffReportDates.has(String(e.date || ''))
    );
    qcCount = qcFromReports + standaloneLogs.reduce((sum, e) => sum + countCompletedSheetQcTasks(e), 0);
  } else if (staffTargetLogs.length > 0) {
    qcCount = staffTargetLogs.reduce((sum, e) => sum + countCompletedSheetQcTasks(e), 0);
  } else {
    qcCount = staffTargetReports.reduce((sum, r) => sum + countCompletedSheetQcTasks(r), 0);
  }

  const isSpecialistNonQC = staff.division === 'Admin';
  const qcTarget = Math.max(1, maxTeamQcs);
  const qcVolumeRatio = Math.min(1, qcCount / qcTarget);
  const targetQcsPerDay = Math.max(2, qcTarget / Math.max(1, maxTeamAttendance));
  const staffQcsPerDay = attendanceCount > 0 ? (qcCount / attendanceCount) : 0;
  const qcDailyRatio = Math.min(1, staffQcsPerDay / targetQcsPerDay);
  const rawQcScore = qcCount > 0
    ? Math.min(100, Math.round(((qcVolumeRatio * 0.70) + (qcDailyRatio * 0.30)) * 100))
    : 0;
  const qcScore = isSpecialistNonQC ? reportScore : rawQcScore;

  // ─────────────────────────────────────────────────────────────
  // 6. KOMPLEKSITAS TUGAS & WORK ORDER (Bobot 10%: Penanganan Teknis, Temuan QC & WO)
  // ─────────────────────────────────────────────────────────────
  const staffFindings = findings.filter(f => {
    if (!isStaffMatch(staff, f.pic)) return false;
    const fDate = f.dateCreated || f.date || f.targetDate || '';
    return !fDate || fDate.startsWith(targetMonthKey);
  });
  let realWOs: WorkOrder[] = workOrdersOverride || [];
  if (!workOrdersOverride && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('riz_work_orders_v2') || localStorage.getItem('riz_work_orders');
      if (saved) realWOs = JSON.parse(saved);
    } catch (e) {}
  }
  const staffWOs = realWOs.filter(w => {
    if (!isStaffMatch(staff, w.pic)) return false;
    const wDate = w.dateCreated || (w as any).date || w.deadline || '';
    return !wDate || wDate.startsWith(targetMonthKey);
  });

  const closedFindingsCount = staffFindings.filter(f => f.status === 'Close').length;
  const completedWOsCount = staffWOs.filter(w => w.status === 'Completed' || w.progress === 100).length;
  const inProgressWOsCount = staffWOs.filter(
    w => w.status === 'In Progress' || (Number(w.progress) > 0 && Number(w.progress) < 100)
  ).length;
  const closedCount = closedFindingsCount + completedWOsCount;

  const technicalTasksCount = staffTargetReports.reduce(
    (sum, r) => sum + extractBalancedSheetTasks(r).filter(t => t.isTechnicalWork).length,
    0
  );

  // Staf yang melaporkan temuan kerusakan saat inspeksi QC tidak dikenakan penalti (kpi_penalty_flag: false)
  const effectiveTechOutput = Math.max(combinedProductivityCount, technicalTasksCount) + closedCount + (inProgressWOsCount * 0.5);
  const taskComplexityScore = (combinedProductivityCount > 0 || closedCount > 0 || inProgressWOsCount > 0)
    ? Math.min(100, Math.round(50 + (Math.min(1, effectiveTechOutput / Math.max(1, maxTeamReports)) * 50)))
    : 0;
  const woCount = Math.max(closedCount, technicalTasksCount);
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
    reports: reportsCount,
    reportsCount,
    completedTasksCount: completedTaskCount,
    combinedProductivityCount,
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


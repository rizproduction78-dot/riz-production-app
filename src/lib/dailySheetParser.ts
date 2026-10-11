// src/lib/dailySheetParser.ts
// Modul parser bersama untuk sinkronisasi Google Sheet Daily Report
// Sesuai PRD V1.0 dan keputusan resmi user (K1-b, K2-c, K3-b, K4-a, K5-a)

export interface SheetRow {
  rowNumber: number;
  cells: string[]; // 7 sel: A..G (Tanggal, Crew, SOUND, LIGHTING, LED, MULTIMEDIA, REMARK)
}

export interface ParsedEntry {
  id: string;
  date: string; // YYYY-MM-DD
  staffName: string;
  staffId: string | null;
  division: 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Umum';
  activity: string;
  notes: string;
  isQc: boolean;
  sheetRow: number;
  _unmatched?: boolean;
}

// T2: Tabel pemetaan panggilan huruf kecil persis -> staffId resmi (AGENTS.md §2)
export const NAME_TO_STAFF_ID: Record<string, string> = {
  // Director / Owner
  'wahyu': 'director-wahyu',

  // Management & Admin
  'fahrul': 'staff-fahrul',
  'm. fahrulyana . a': 'staff-fahrul',
  'm. fahrulyana . a / fahrul': 'staff-fahrul',
  'fahrulyana': 'staff-fahrul',
  'agustino setiawan': 'staff-agustino',
  'agustino setiawan / agus': 'staff-agustino',
  'agus': 'staff-agustino',
  'agustino': 'staff-agustino',
  'syalsa sri hestariana': 'staff-syalsa',
  'syalsa sri hestariana / caca': 'staff-syalsa',
  'caca': 'staff-syalsa',
  'syalsa': 'staff-syalsa',
  'seno subroto': 'staff-seno',
  'seno subroto / seno': 'staff-seno',
  'seno': 'staff-seno',

  // Gudang
  'udin saepudin': 'staff-udin',
  'udin saepudin / mang ube': 'staff-udin',
  'mang ube': 'staff-udin',
  'mangube': 'staff-udin',
  'ube': 'staff-udin',
  'udin': 'staff-udin',
  'gatot wiliyanto': 'staff-gatot',
  'gatot wiliyanto / gatot': 'staff-gatot',
  'gatot': 'staff-gatot',
  'aep saepudin': 'staff-absobur',
  'aep saepudin / aep / subur': 'staff-absobur',
  'aep': 'staff-absobur',
  'subur': 'staff-absobur',
  'abah': 'staff-absobur',

  // Sound (Audio)
  'muhamad rahmat': 'staff-rahmat',
  'muhamad rahmat / mboh': 'staff-rahmat',
  'mboh': 'staff-rahmat',
  'rahmat': 'staff-rahmat',
  'wahyudin': 'staff-unyin',
  'wahyudin / unyim': 'staff-unyin',
  'unyim': 'staff-unyin',
  'unyin': 'staff-unyin',
  'unying': 'staff-unyin',
  'ramdani': 'staff-ramdani',
  'ramdani / dani': 'staff-ramdani',
  'dani': 'staff-ramdani',
  'iwan kurniawan': 'staff-iwan',
  'iwan kurniawan / butonk': 'staff-iwan',
  'butonk': 'staff-iwan',
  'butong': 'staff-iwan',
  'iwan': 'staff-iwan',
  'yudishtira purnama a': 'staff-yudish',
  'yudishtira purnama a / yudish': 'staff-yudish',
  'yudishtira': 'staff-yudish',
  'yudish': 'staff-yudish',
  'yudis': 'staff-yudish',
  'taufik diana': 'staff-taufik',
  'taufik diana / opik': 'staff-taufik',
  'taufik': 'staff-taufik',
  'opik': 'staff-taufik',
  'suryana': 'staff-suryana',
  'suryana / nana / buluk': 'staff-suryana',
  'nana': 'staff-suryana',
  'buluk': 'staff-suryana',
  'bulux': 'staff-suryana',

  // Lighting
  'heri': 'staff-heri',

  // Multimedia
  'mulyadi': 'staff-mulyadi',
  'mulyadi / jay': 'staff-mulyadi',
  'jay': 'staff-mulyadi',

  // Videotron
  'ayong sumarsih': 'staff-ayong',
  'ayong sumarsih / ayong': 'staff-ayong',
  'ayong': 'staff-ayong',
  'dedi agus wigiantoro': 'staff-dedi',
  'dedi agus wigiantoro / wigi': 'staff-dedi',
  'dedi': 'staff-dedi',
  'wigi': 'staff-dedi',
  'muhamad irvan': 'staff-irvan',
  'muhamad irvan / irfan': 'staff-irvan',
  'irvan': 'staff-irvan',
  'irfan': 'staff-irvan',
  'mulyana': 'staff-mulyana',
  'mulyana / kharo': 'staff-mulyana',
  'kharo': 'staff-mulyana',
  'karo': 'staff-mulyana',

  // Service
  'damri': 'staff-damri',
};

export const STAFF_ID_TO_OFFICIAL_NAME: Record<string, string> = {
  'director-wahyu': 'Wahyu',
  'staff-fahrul': 'M. Fahrulyana . A',
  'staff-agustino': 'Agustino Setiawan',
  'staff-syalsa': 'Syalsa Sri Hestariana',
  'staff-seno': 'Seno Subroto',
  'staff-udin': 'Udin Saepudin',
  'staff-gatot': 'Gatot Wiliyanto',
  'staff-absobur': 'Aep Saepudin',
  'staff-rahmat': 'Muhamad Rahmat',
  'staff-unyin': 'Wahyudin',
  'staff-ramdani': 'Ramdani',
  'staff-iwan': 'Iwan Kurniawan',
  'staff-yudish': 'Yudishtira Purnama A',
  'staff-taufik': 'Taufik Diana',
  'staff-suryana': 'Suryana',
  'staff-heri': 'Heri',
  'staff-mulyadi': 'Mulyadi',
  'staff-ayong': 'Ayong Sumarsih',
  'staff-dedi': 'Dedi Agus Wigiantoro',
  'staff-irvan': 'Muhamad Irvan',
  'staff-mulyana': 'Mulyana',
  'staff-damri': 'Damri',
};

export const STAFF_ID_TO_DEFAULT_DIVISION: Record<string, 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Umum'> = {
  'director-wahyu': 'Umum',
  'staff-fahrul': 'Umum',
  'staff-agustino': 'Umum',
  'staff-syalsa': 'Umum',
  'staff-seno': 'Umum',
  'staff-udin': 'Umum',
  'staff-gatot': 'Umum',
  'staff-absobur': 'Umum',
  'staff-rahmat': 'Audio',
  'staff-unyin': 'Audio',
  'staff-ramdani': 'Audio',
  'staff-iwan': 'Audio',
  'staff-yudish': 'Audio',
  'staff-taufik': 'Audio',
  'staff-suryana': 'Audio',
  'staff-heri': 'Lighting',
  'staff-mulyadi': 'Multimedia',
  'staff-ayong': 'Videotron',
  'staff-dedi': 'Videotron',
  'staff-irvan': 'Videotron',
  'staff-mulyana': 'Videotron',
  'staff-damri': 'Umum',
};

const INDONESIAN_MONTH_MAP: Record<string, string> = {
  'januari': '01', 'january': '01', 'jan': '01',
  'februari': '02', 'february': '02', 'feb': '02',
  'maret': '03', 'march': '03', 'mar': '03',
  'april': '04', 'apr': '04',
  'mei': '05', 'may': '05',
  'juni': '06', 'june': '06', 'jun': '06',
  'juli': '07', 'july': '07', 'jul': '07',
  'agustus': '08', 'august': '08', 'ags': '08', 'aug': '08',
  'september': '09', 'sep': '09', 'sept': '09',
  'oktober': '10', 'october': '10', 'okt': '10', 'oct': '10',
  'november': '11', 'nov': '11',
  'desember': '12', 'december': '12', 'des': '12', 'dec': '12',
};

/**
 * Normalisasi dan parse teks tanggal Indonesia/Inggris menjadi format YYYY-MM-DD.
 */
export function parseIndonesianDate(raw: string): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const clean = raw.trim().replace(/^['"\s]+|['"\s]+$/g, '');
  if (!clean) return null;

  // Cek format ISO YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Cek format teks: e.g. "1 Oktober 2026", "03 oktober 2026"
  const textMatch = clean.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})/);
  if (textMatch) {
    const day = textMatch[1].padStart(2, '0');
    const monthName = textMatch[2].toLowerCase();
    const year = textMatch[3];
    const month = INDONESIAN_MONTH_MAP[monthName];
    if (month) {
      return `${year}-${month}-${day}`;
    }
  }

  return null;
}

/**
 * Normalisasi teks nama kru sebelum pencocokan ke NAME_TO_STAFF_ID
 */
export function normalizeCrewName(raw: string): string {
  if (!raw) return '';
  return raw
    .trim()
    .replace(/^[-*•\d.)\s]+/, '') // hapus awalan bullet "- ", "* ", "1. "
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' '); // normalisasi multi-spasi
}

// Kata kunci QC: mendeteksi inspeksi teknis lapangan (qc, inspeksi, checklist, onhouse, p2h, cek, check, pengecekan, uji, testing)
const QC_KEYWORDS = ['qc', 'inspeksi', 'checklist', 'onhouse', 'p2h', 'cek', 'check', 'pengecekan', 'uji', 'testing'];

export function checkIsQc(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return QC_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Parser utama Google Sheet Daily Report
 * Menerapkan R1 - R7 secara murni:
 * - R1: Baris laporan HANYA dibuat bila Crew terisi DAN ada aktivitas di C-F atau remark.
 *       Baris dengan aktivitas kosong (contoh: baris 48 unying) TIDAK DIHITUNG / diabaikan.
 * - R2: Baris dengan Crew kosong adalah rincian/detail dari entri di atasnya,
 *       teksnya digabung ke activity/notes, BUKAN laporan baru.
 * - R6: QC hanya dihitung untuk kata kunci inspeksi/checklist resmi.
 */
export function parseDailySheet(rows: SheetRow[]): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  let lastDate: string = '';

  for (const row of rows) {
    const cells = row.cells || [];
    const rawDate = cells[0] ? String(cells[0]).trim() : '';
    const rawCrew = cells[1] ? String(cells[1]).trim() : '';
    const soundAct = cells[2] ? String(cells[2]).trim() : '';
    const lightingAct = cells[3] ? String(cells[3]).trim() : '';
    const ledAct = cells[4] ? String(cells[4]).trim() : '';
    const mmAct = cells[5] ? String(cells[5]).trim() : '';
    const remark = cells[6] ? String(cells[6]).trim() : '';

    // R3: Tanggal
    if (rawDate) {
      const parsedDate = parseIndonesianDate(rawDate);
      if (parsedDate) {
        lastDate = parsedDate;
      }
    }
    const currentDate = lastDate;

    // Tentukan divisi dan teks aktivitas dari kolom C - F
    let activityText = '';
    let division: 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Umum' = 'Umum';

    if (soundAct) {
      activityText = soundAct;
      division = 'Audio';
    } else if (lightingAct) {
      activityText = lightingAct;
      division = 'Lighting';
    } else if (ledAct) {
      activityText = ledAct;
      division = 'Videotron';
    } else if (mmAct) {
      activityText = mmAct;
      division = 'Multimedia';
    }

    // R1: Jika kolom Crew terisi
    if (rawCrew) {
      // Jika kolom aktivitas C-F dan remark kosong, kru TIDAK melakukan aktivitas (contoh: baris 48 unying)
      // Wajib diabaikan, jangan pernah mengarang atau mengikutkan aktivitas staf lain!
      if (!activityText && !remark) {
        continue;
      }

      // Pecah crew jika ada multi-crew dalam 1 sel (baris baru, koma, ampersand, kata 'dan', dsb)
      const rawCrewParts = rawCrew
        .split(/[\n\r,;/&]+|(?:\s+dan\s+)/i)
        .map((p) => p.trim())
        .filter(Boolean);

      const dateCompact = currentDate ? currentDate.replace(/-/g, '') : 'nodate';

      for (const part of rawCrewParts) {
        const normalized = normalizeCrewName(part);
        if (!normalized) continue;

        const staffId = NAME_TO_STAFF_ID[normalized] || null;
        const staffName = staffId ? (STAFF_ID_TO_OFFICIAL_NAME[staffId] || part) : part;
        const staffDiv = division !== 'Umum'
          ? division
          : (staffId ? (STAFF_ID_TO_DEFAULT_DIVISION[staffId] || 'Umum') : 'Umum');

        const fullText = [activityText, remark].filter(Boolean).join(' ');
        const isQc = checkIsQc(fullText);

        const appId = cells[7] ? String(cells[7]).trim() : '';
        const entryId = appId || `rep-${dateCompact}-${staffId || 'unknown'}-${row.rowNumber}`;

        entries.push({
          id: entryId,
          date: currentDate,
          staffName,
          staffId,
          division: staffDiv,
          activity: activityText || remark,
          notes: remark,
          isQc,
          sheetRow: row.rowNumber,
          ...(!staffId ? { _unmatched: true } : {}),
        });
      }
    } else {
      // R2: Baris lanjutan (Crew kosong) -> detail/rincian dari entri di atasnya
      // Teks digabung ke activity/notes entri sebelumnya, BUKAN laporan baru!
      if (entries.length > 0 && (activityText || remark)) {
        const lastEntry = entries[entries.length - 1];
        if (activityText) {
          lastEntry.activity += `\n${activityText}`;
        }
        if (remark) {
          lastEntry.notes = lastEntry.notes ? `${lastEntry.notes}\n${remark}` : remark;
        }
        if (!lastEntry.isQc) {
          lastEntry.isQc = checkIsQc(lastEntry.activity + ' ' + lastEntry.notes);
        }
      }
    }
  }

  return entries;
}

/**
 * Peta Resmi Tab Google Sheet PT. RIZ PRODUCTION (Spreadsheet ID: 1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA)
 */
export const OFFICIAL_GSHEET_TABS: Record<string, { label: string; gid: string }> = {
  '2026-05': { label: 'Mei 2026', gid: '673324712' },
  '2026-06': { label: 'Juni 2026', gid: '86125629' },
  '2026-07': { label: 'Juli 2026', gid: '2099865640' },
  '2026-08': { label: 'Agustus 2026', gid: '1894783738' },
  '2026-09': { label: 'September 2026', gid: '1869844599' },
  '2026-10': { label: 'Oktober 2026', gid: '1340328886' },
  '2026-11': { label: 'November 2026', gid: '1463883290' },
  '2026-12': { label: 'Desember 2026', gid: '646140708' },
};

/**
 * Ekstraktor dan normalisasi baris sheet mentah:
 * Mendeteksi posisi kolom Tanggal secara dinamis (mengatasi pergeseran kolom A di Mei-Agustus),
 * lalu memetakan ke 7 kolom standar: [Tanggal, Crew, SOUND, LIGHTING, LED, MULTIMEDIA, REMARK].
 */
export function extractNormalizedDailySheetRows(rawRows: string[][]): SheetRow[] {
  if (!Array.isArray(rawRows) || rawRows.length === 0) return [];

  // Cari baris header yang memuat 'tanggal'
  let headerRowIdx = -1;
  let colTanggal = -1;

  for (let r = 0; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!Array.isArray(row)) continue;
    const idx = row.findIndex(cell => String(cell || '').trim().toLowerCase() === 'tanggal');
    if (idx !== -1) {
      headerRowIdx = r;
      colTanggal = idx;
      break;
    }
  }

  // Fallback jika tidak ditemukan baris tanggal eksplisit
  if (headerRowIdx === -1) {
    return rawRows.map((r, idx) => ({
      rowNumber: idx + 1,
      cells: r.slice(0, 7)
    }));
  }

  // Baris subheader di bawahnya memuat Crew, SOUND, LIGHTING, dsb
  const subHeaderRow = rawRows[headerRowIdx + 1] || [];
  let colCrew = subHeaderRow.findIndex(cell => String(cell || '').trim().toLowerCase().includes('crew'));
  if (colCrew === -1) colCrew = colTanggal + 1;

  let colSound = subHeaderRow.findIndex(cell => String(cell || '').trim().toLowerCase().includes('sound'));
  if (colSound === -1) colSound = colCrew + 1;

  let colLighting = subHeaderRow.findIndex(cell => String(cell || '').trim().toLowerCase().includes('light'));
  if (colLighting === -1) colLighting = colSound + 1;

  let colLed = subHeaderRow.findIndex(cell => String(cell || '').trim().toLowerCase().includes('led'));
  if (colLed === -1) colLed = colLighting + 1;

  let colMM = subHeaderRow.findIndex(cell => String(cell || '').trim().toLowerCase().includes('multi'));
  if (colMM === -1) colMM = colLed + 1;

  // Remark / Keterangan bisa berada di baris header atas atau baris subheader
  let colRemark = rawRows[headerRowIdx].findIndex(cell => {
    const str = String(cell || '').trim().toLowerCase();
    return str.includes('remark') || str.includes('keterangan');
  });
  if (colRemark === -1) {
    colRemark = subHeaderRow.findIndex(cell => {
      const str = String(cell || '').trim().toLowerCase();
      return str.includes('remark') || str.includes('keterangan');
    });
  }
  if (colRemark === -1) colRemark = colMM + 1;

  // Data baris operasional dimulai tepat setelah subheader
  const dataRows = rawRows.slice(headerRowIdx + 2).filter(row => row && row.some(c => String(c || '').trim() !== ''));

  return dataRows.map((row, idx) => {
    const cells = [
      row[colTanggal] ? String(row[colTanggal]).trim() : '',
      row[colCrew] ? String(row[colCrew]).trim() : '',
      row[colSound] ? String(row[colSound]).trim() : '',
      row[colLighting] ? String(row[colLighting]).trim() : '',
      row[colLed] ? String(row[colLed]).trim() : '',
      row[colMM] ? String(row[colMM]).trim() : '',
      row[colRemark] ? String(row[colRemark]).trim() : ''
    ];
    return {
      rowNumber: idx + headerRowIdx + 3,
      cells
    };
  });
}


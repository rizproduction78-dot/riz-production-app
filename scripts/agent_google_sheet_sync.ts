import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';
import { parseDailySheet, SheetRow, extractNormalizedDailySheetRows } from '../src/lib/dailySheetParser';
import { isFindingRemark } from '../src/lib/googleSheetSync';
import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA';
const SYNC_TABS: { monthKey: string; gid: string; label: string }[] = [
  { monthKey: '2026-10', gid: '1340328886', label: 'Oktober 2026' },
  { monthKey: '2026-11', gid: '7916507', label: 'November 2026' },
  { monthKey: '2026-12', gid: '368237370', label: 'Desember 2026' },
];

console.log('================================================================');
console.log('    AGENT: GOOGLE SHEET R.A.G SYNC ENGINE (CSV FETCH)           ');
console.log('================================================================\n');

async function runAgent() {
  console.log(`[AGENT] Memulai proses fetch data multi-bulan dari Google Sheet...`);
  
  try {
    const allNewDailyReports: DailyReport[] = [];
    const allNewLogbookEntries: LogbookEntry[] = [];
    const syncedMonthPrefixes = new Set<string>();
    let mdContent = '<!-- markdownlint-disable -->\n';
    mdContent += '# DATA SINKRONISASI GOOGLE SHEET (OFFICIAL)\n\n';
    const headers = ['Tanggal', 'Crew', 'SOUND', 'LIGHTING', 'LED', 'MULTIMEDIA', 'REMARK'];

    for (const tab of SYNC_TABS) {
      const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${tab.gid}`;
      console.log(`[AGENT] Fetching ${tab.label} (gid=${tab.gid}) -> ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[AGENT] Gagal fetch ${tab.label}, status: ${response.status}`);
        continue;
      }

      const csvText = await response.text();
      console.log(`[AGENT] ${tab.label}: Data berhasil di-fetch (${csvText.length} karakter).`);

      const parsed = Papa.parse(csvText, { skipEmptyLines: true });
      const rows = parsed.data as string[][];
      if (rows.length === 0) continue;

      const sheetRows: SheetRow[] = extractNormalizedDailySheetRows(rows);
      console.log(`[AGENT] ${tab.label}: Ditemukan ${sheetRows.length} baris data ternormalisasi.`);

      mdContent += `## ${tab.label} (GID: ${tab.gid})\n\n`;
      mdContent += '| ' + headers.join(' | ') + ' |\n';
      mdContent += '| ' + headers.map(() => '---').join(' | ') + ' |\n';
      sheetRows.forEach((r) => {
        const sanitizedRow = r.cells.slice(0, 7).map(cell => cell.replace(/\n/g, '<br>').replace(/\|/g, '&#124;'));
        mdContent += '| ' + sanitizedRow.join(' | ') + ' |\n';
      });
      mdContent += '\n';

      const parsedEntries = parseDailySheet(sheetRows, tab.monthKey);
      console.log(`[AGENT] ${tab.label}: Total parsed entries = ${parsedEntries.length}`);

      if (parsedEntries.length > 0) {
        syncedMonthPrefixes.add(tab.monthKey);
      }

      const dailyReports: DailyReport[] = parsedEntries.map((e) => ({
        id: e.id,
        date: e.date,
        staffName: e.staffName,
        division: e.division,
        activity: e.activity,
        notes: e.notes || '',
        ...(e.rowDetails ? { rowDetails: e.rowDetails } : {}),
        status: 'Submitted',
        _source: 'google_sheet'
      }));

      const logbookEntries: LogbookEntry[] = parsedEntries
        .filter((e) => e.isQc)
        .map((e) => {
          const isNg = isFindingRemark(e.notes);
          return {
            id: `log-${e.id}`,
            date: e.date,
            division: e.division,
            staffName: e.staffName,
            activity: e.activity,
            result: isNg ? ('NG' as const) : ('OK' as const),
            followUp: e.notes || (isNg ? 'Perlu perbaikan teknis' : 'Pengecekan selesai aman'),
            status: isNg ? ('Open' as const) : ('Close' as const),
            verification: 'Auto-Synced',
            checklists: { [e.activity.substring(0, 40)]: { status: isNg ? ('NG' as const) : ('OK' as const), notes: e.notes || 'Synced from Google Sheet' } },
            ...(e.rowDetails ? { rowDetails: e.rowDetails } : {}),
            _source: 'google_sheet'
          };
        });

      allNewDailyReports.push(...dailyReports);
      allNewLogbookEntries.push(...logbookEntries);
    }

    const mdPath = path.join(__dirname, '../official_data_synced.md');
    fs.writeFileSync(mdPath, mdContent);
    console.log(`[AGENT] Data berhasil di-dump ke: official_data_synced.md`);

    console.log(`[AGENT] Berhasil membuat total ${allNewDailyReports.length} Daily Reports & ${allNewLogbookEntries.length} Logbook Entries QC.`);

    // ==========================================
    // PHASE 3: SAFE MONTH-SCOPED MERGE (T6)
    // ==========================================
    const tsPath = path.join(__dirname, '../src/data/canonicalFirestoreData.ts');
    if (fs.existsSync(tsPath)) {
      const canonicalModule = await import('../src/data/canonicalFirestoreData');
      const existingReports = (canonicalModule.CANONICAL_FIRESTORE_DAILY_REPORTS || []) as DailyReport[];
      const existingLogs = (canonicalModule.CANONICAL_FIRESTORE_LOGBOOK_ENTRIES || []) as LogbookEntry[];
      const existingFindings = (canonicalModule.CANONICAL_FIRESTORE_FINDINGS || []) as Finding[];
      const existingWOs = (canonicalModule.CANONICAL_FIRESTORE_WORK_ORDERS || []) as WorkOrder[];

      const OFFICIAL_OCT_NOV_FINDINGS: Finding[] = [
        {
          id: 'gsheet-finding-20261002-mulyana-modul-kabinet',
          dateCreated: '2026-10-02',
          division: 'Videotron',
          status: 'Open',
          pic: 'Mulyana',
          targetDate: '2026-10-04',
          issue: '2 modul hilang jalur IC, 3 modul hilang jalur pixel, 3 modul kena IC warna, 1 modul arus konslet',
          _source: 'google_sheet',
          equipment: '11 Modul Kabinet Videotron',
          priority: 'Tinggi'
        },
        {
          id: 'gsheet-finding-20261003-heri-tripot-custom',
          dateCreated: '2026-10-03',
          division: 'Lighting',
          status: 'Open',
          pic: 'Heri',
          targetDate: '2026-10-05',
          issue: 'Tripot Custom keadaan tidak komplite',
          _source: 'google_sheet',
          equipment: 'Tripot Custom (Lighting)',
          priority: 'Sedang'
        },
        {
          id: 'fd-20261003-kharo-pcb-bengkok',
          dateCreated: '2026-10-03',
          division: 'Videotron',
          status: 'Open',
          pic: 'Mulyana',
          targetDate: '2026-10-06',
          issue: '1 modul PCB bengkok saat repair 1 kabinet ganti IC warna + ganti dead pixel',
          _source: 'google_sheet',
          equipment: 'Modul Kabinet LED Videotron (1 Modul PCB Bengkok)',
          priority: 'Sedang'
        },
        {
          id: 'fd-20261007-wigi-box-led',
          dateCreated: '2026-10-07',
          division: 'Videotron',
          status: 'Open',
          pic: 'Dedi Agus Wigiantoro',
          targetDate: '2026-10-12',
          issue: 'Box No. 03 full service dead pixel, Box No. 25 terdapat 5 kabinet dead pixel (3 box kondisi baik No. 02, 12, 27)',
          _source: 'google_sheet',
          equipment: 'Box LED Videotron No. 03 & No. 25',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261009-kharo-2box-rusak-berat',
          dateCreated: '2026-10-09',
          division: 'Videotron',
          status: 'Open',
          pic: 'Mulyana',
          targetDate: '2026-10-16',
          issue: '1 box 4 kabinet on progress, 2 box rusak berat: Kerusakan ganti IC warna, ilang jalur, ganti konektor output sama ngacing',
          _source: 'google_sheet',
          equipment: '2 Box Kabinet LED Videotron (Rusak Berat)',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261010-butonk-iem-g3-sn',
          dateCreated: '2026-10-10',
          division: 'Audio',
          status: 'Open',
          pic: 'Iwan Kurniawan',
          targetDate: '2026-10-15',
          issue: 'Note: Sennheiser G3 yang isi 4 Serial Number (SN) nya rusak ga bisa input',
          _source: 'google_sheet',
          equipment: 'Headset / IEM Sennheiser G3 (Box Isi 4)',
          priority: 'Sedang'
        },
        {
          id: 'fd-20261014-kharo-led-strip',
          dateCreated: '2026-10-14',
          division: 'Videotron',
          status: 'Open',
          pic: 'Mulyana',
          targetDate: '2026-10-20',
          issue: '1 box kabinet LED status masih service berat, 1 rol (5m) LED strip status error saat cek 50 meter LED strip',
          _source: 'google_sheet',
          equipment: '1 Box Kabinet LED & 1 Roll (5m) LED Strip',
          priority: 'Sedang'
        },
        {
          id: 'fd-20261026-unyim-db18',
          dateCreated: '2026-10-26',
          division: 'Audio',
          status: 'Close',
          pic: 'Wahyudin',
          targetDate: '2026-11-04',
          issue: 'DB No. 18 tweeter mati saat cek unit monitor DB18 (Telah diganti tweeter DB No. 18 oleh Butonk pada 4 Nov 2026 — Kondisi OK)',
          _source: 'google_sheet',
          equipment: 'Speaker Monitor DB Tech No. 18',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261026-butonk-db15',
          dateCreated: '2026-10-26',
          division: 'Audio',
          status: 'Open',
          pic: 'Iwan Kurniawan',
          targetDate: '2026-11-04',
          issue: 'DB No. 15 tweeter kecil / lemah saat cek unit monitor DB15',
          _source: 'google_sheet',
          equipment: 'Speaker Monitor DB Tech No. 15',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261026-mboh-lvx15',
          dateCreated: '2026-10-26',
          division: 'Audio',
          status: 'Open',
          pic: 'Muhamad Rahmat',
          targetDate: '2026-11-02',
          issue: 'Mesin mati / dalam pengecekan Mang Damri saat cek unit monitor LVX15',
          _source: 'google_sheet',
          equipment: 'Speaker Monitor dBTechnologies LVX15',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261102-jay-ups',
          dateCreated: '2026-11-02',
          division: 'Multimedia',
          status: 'Open',
          pic: 'Mulyadi',
          targetDate: '2026-11-05',
          issue: 'Udah Ga bisa ngisi (UPS tidak dapat mengisi/menyimpan daya baterai saat pengecekan)',
          _source: 'google_sheet',
          equipment: 'UPS Multimedia',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261103-heri-parled-trfa64',
          dateCreated: '2026-11-03',
          division: 'Lighting',
          status: 'Open',
          pic: 'Heri',
          targetDate: '2026-11-07',
          issue: 'Bersih & Normal KECUALI NO. 5-12-19-33 Eror: No. 5 - Warm Separo, No. 12 - Red Mati 1 Mata, No. 19 - Warm Separo, No. 33 - Red Separo',
          _source: 'google_sheet',
          equipment: 'Parled TRF A64 No. 5, 12, 19, 33 (Lighting)',
          priority: 'Sedang'
        },
        {
          id: 'fd-20261103-kharo-kabinet-led',
          dateCreated: '2026-11-03',
          division: 'Videotron',
          status: 'Open',
          pic: 'Mulyana',
          targetDate: '2026-11-07',
          issue: 'Service 8 kabinet LED (6 kabinet ganti dead pixel, 1 kabinet ganti IC warna, 1 kabinet ganti jalur) — 2 unit minta ganti receiving card',
          _source: 'google_sheet',
          equipment: '8 Kabinet LED Videotron (2 Unit Receiving Card)',
          priority: 'Tinggi'
        },
        {
          id: 'fd-20261104-butonk-db15',
          dateCreated: '2026-11-04',
          division: 'Audio',
          status: 'Open',
          pic: 'Iwan Kurniawan',
          targetDate: '2026-11-08',
          issue: 'Ganti twitter DB No 15: Rekon-Kit Twitter masih bermasalah, suara kecil. Service ulang, DB no 15 belum normal (DB No 18 & DB No 5 kondisi OK)',
          _source: 'google_sheet',
          equipment: 'Speaker Monitor DB Tech No. 15 (Audio)',
          priority: 'Tinggi'
        }
      ];

      const OFFICIAL_OCT_NOV_WOS: WorkOrder[] = [
        {
          id: 'wo-20261002-mulyana-repair-kabinet',
          dateCreated: '2026-10-02',
          title: 'Perbaikan: Repair 3 kabinet IC warna + ganti dead pixel',
          division: 'Videotron',
          deadline: '2026-10-04',
          description: 'Repair 3 kabinet IC warna + ganti dead pixel 2 kabinet clear',
          status: 'Completed',
          progress: 100,
          priority: 'Tinggi',
          pic: 'Mulyana',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261008-heri-pompa-smoke1',
          dateCreated: '2026-10-08',
          title: 'Ganti Pompa Smoke Machine No. 1',
          division: 'Lighting',
          deadline: '2026-10-08',
          description: 'Ganti Pompa Smoke No. 1 — Kondisi Sudah Normal (OKE)',
          status: 'Completed',
          progress: 100,
          priority: 'Sedang',
          pic: 'Heri',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261010-opik-butonk-service',
          dateCreated: '2026-10-10',
          title: 'Service Headset 2 Unit & Service Kabel Legrand 1 Unit',
          division: 'Audio',
          deadline: '2026-10-10',
          description: 'Service Headset 2 Unit (Opik - Beres) dan Service kabel Legran 1 Unit (Butonk - Beres)',
          status: 'Completed',
          progress: 100,
          priority: 'Sedang',
          pic: 'Taufik Diana',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261014-endin-lampu-beam10',
          dateCreated: '2026-10-14',
          title: 'Ganti Lampu Moving Head Beam No. 10',
          division: 'Lighting',
          deadline: '2026-10-14',
          description: 'Ganti Lampu Beam No. 10 — Sudah Normal lagi Beam No. 10',
          status: 'Completed',
          progress: 100,
          priority: 'Sedang',
          pic: 'Heri',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261026-damri-lvx15',
          dateCreated: '2026-10-26',
          findingId: 'fd-20261026-mboh-lvx15',
          equipment: 'Speaker Monitor dBTechnologies LVX15',
          title: 'Pengecekan & Perbaikan Mesin Monitor LVX15 Mati',
          division: 'Service',
          deadline: '2026-11-02',
          description: 'Cek unit monitor LVX15: mesin mati / dalam pengecekan Mang Damri',
          status: 'In Progress',
          progress: 50,
          priority: 'Tinggi',
          pic: 'Damri',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261101-kharo-led-strip',
          dateCreated: '2026-11-01',
          equipment: '12 Roll LED Strip & Power Supply LED Strip',
          title: 'Cek & Service 12 Roll LED Strip + Buat Dudukan Power Supply LED Strip',
          division: 'Videotron',
          deadline: '2026-11-01',
          description: '- cek & servise 12 roll led strip (Bagus)\n- buat dudukan power suplly led strip (Done)',
          status: 'Completed',
          progress: 100,
          priority: 'Sedang',
          pic: 'Mulyana',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261102-jay-ups',
          dateCreated: '2026-11-02',
          findingId: 'fd-20261102-jay-ups',
          equipment: 'UPS Multimedia',
          title: 'Pengecekan & Perbaikan / Ganti Baterai UPS Multimedia',
          division: 'Multimedia',
          deadline: '2026-11-05',
          description: '[Temuan QC ID: fd-20261102-jay-ups] Cek UPS Multimedia: Udah Ga bisa ngisi',
          status: 'Pending',
          progress: 0,
          priority: 'Tinggi',
          pic: 'Mulyadi',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261103-heri-kabel-power',
          dateCreated: '2026-11-03',
          equipment: 'Kabel Power 4x2.5 (25M)',
          title: 'Perbaikan Kabel Power 4x2.5 (25M) — Pemasangan Steker',
          division: 'Lighting',
          deadline: '2026-11-03',
          description: '- Rapih2 Kabel Bekas Pakai Perbok (Rapih Sesuai Tulisan Dibok)\n- Benerin Kabel Power 4x2.5 (25M) (Sudah Kepasang Kembali Steker Nya)',
          status: 'Completed',
          progress: 100,
          priority: 'Sedang',
          pic: 'Heri',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261103-heri-parled-trfa64',
          dateCreated: '2026-11-03',
          findingId: 'fd-20261103-heri-parled-trfa64',
          equipment: 'Parled TRF A64 No. 5, 12, 19, 33 (Lighting)',
          title: 'Service Parled TRF A64 No. 5, 12, 19, 33 (Warm Separo & Red Mati 1 Mata / Separo)',
          division: 'Lighting',
          deadline: '2026-11-07',
          description: '[Temuan QC ID: fd-20261103-heri-parled-trfa64] Cleaning All Parled Trf A64 No. 1-48: Bersih & Normal KECUALI NO. 5-12-19-33 Eror (No. 5 - Warm Separo, No. 12 - Red Mati 1 Mata, No. 19 - Warm Separo, No. 33 - Red Separo)',
          status: 'Pending',
          progress: 0,
          priority: 'Sedang',
          pic: 'Heri',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261103-kharo-kabinet-led',
          dateCreated: '2026-11-03',
          findingId: 'fd-20261103-kharo-kabinet-led',
          equipment: '8 Kabinet LED Videotron (2 Unit Receiving Card)',
          title: 'Service 8 Kabinet LED (6 Dead Pixel, 1 IC Warna, 1 Jalur) & Ganti 2 Unit Receiving Card',
          division: 'Videotron',
          deadline: '2026-11-07',
          description: '[Temuan QC ID: fd-20261103-kharo-kabinet-led] servise 8 kabinet led (- 6 kabinet ganti dead pixel, -1 kabinet ganti ic warna, - 1 kabinet ganti jalur) — Remark: 2 unit minta ganti reciving card',
          status: 'In Progress',
          progress: 75,
          priority: 'Tinggi',
          pic: 'Mulyana',
          _source: 'google_sheet'
        },
        {
          id: 'wo-20261104-butonk-db-maintenance',
          dateCreated: '2026-11-04',
          findingId: 'fd-20261104-butonk-db15',
          equipment: 'Speaker Monitor DB Tech No. 5, No. 15 & No. 18 (Audio)',
          title: 'Ganti Tweeter & Speaker DB Tech No. 5, No. 18 (OK) & Service Ulang Rekon-Kit DB Tech No. 15',
          division: 'Audio',
          deadline: '2026-11-08',
          description: '[Temuan QC ID: fd-20261104-butonk-db15] Ganti twitter DB No 15 (Rekon-Kit Twitter masih bermasalah, suara kecil), Ganti twitter DB No 18 (Kondisi OK), Ganti twitter DB No 5 (Kondisi OK), Ganti Speaker DB no 5 (Kondisi OK), Proses Test Unit DB tech maintenance (Service ulang, DB no 15 belum normal)',
          status: 'In Progress',
          progress: 75,
          priority: 'Tinggi',
          pic: 'Iwan Kurniawan',
          _source: 'google_sheet'
        }
      ];

      const findingMap = new Map<string, Finding>();
      for (const f of [...existingFindings, ...OFFICIAL_OCT_NOV_FINDINGS]) {
        findingMap.set(f.id, f);
      }
      const mergedFindings = Array.from(findingMap.values());

      const woMap = new Map<string, WorkOrder>();
      for (const w of [...existingWOs, ...OFFICIAL_OCT_NOV_WOS]) {
        woMap.set(w.id, w);
      }
      const mergedWOs = Array.from(woMap.values());

      const preservedReports = existingReports.filter(
        (r) => !(r.date && Array.from(syncedMonthPrefixes).some(prefix => r.date.startsWith(prefix)) && r._source === 'google_sheet')
      );
      const reportMap = new Map<string, DailyReport>();
      for (const r of [...preservedReports, ...allNewDailyReports]) {
        reportMap.set(r.id, r);
      }
      const mergedReports = Array.from(reportMap.values());

      const preservedLogs = existingLogs.filter(
        (l) => !(l.date && Array.from(syncedMonthPrefixes).some(prefix => l.date.startsWith(prefix)) && l._source === 'google_sheet')
      );
      const logMap = new Map<string, LogbookEntry>();
      for (const l of [...preservedLogs, ...allNewLogbookEntries]) {
        logMap.set(l.id, l);
      }
      const mergedLogs = Array.from(logMap.values());

      const updatedContent = `import { DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';

/**
 * DATA KANONIKAL RESMI CLOUD FIRESTORE & GOOGLE SHEET PT. RIZ PRODUCTION MULTI KREASI
 * Disinkronkan langsung dari Cloud Firestore (wh-logbook-2026).
 * Total: ${mergedReports.length} Daily Reports | ${mergedLogs.length} Logbook Entries | ${mergedFindings.length} Findings | ${mergedWOs.length} Work Orders
 */

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = ${JSON.stringify(mergedReports, null, 2)};

export const CANONICAL_FIRESTORE_LOGBOOK_ENTRIES: LogbookEntry[] = ${JSON.stringify(mergedLogs, null, 2)};

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = ${JSON.stringify(mergedFindings, null, 2)};

export const CANONICAL_FIRESTORE_WORK_ORDERS: WorkOrder[] = ${JSON.stringify(mergedWOs, null, 2)};
`;

      fs.writeFileSync(tsPath, updatedContent);
      console.log(`[AGENT] Month-scoped replace selesai:`);
      console.log(`   - Daily Reports Total: ${mergedReports.length} (Synced gsheet: ${allNewDailyReports.length})`);
      console.log(`   - Logbook Entries QC Total: ${mergedLogs.length} (Synced gsheet: ${allNewLogbookEntries.length})`);
      console.log(`   - Findings & Work Orders Total: ${mergedFindings.length} findings, ${mergedWOs.length} work orders.`);
    }
    
    console.log('[AGENT] SINKRONISASI SELESAI.');
    
  } catch (err: any) {
    console.error(`[AGENT ERROR] Terjadi kesalahan saat sinkronisasi: ${err.message}`);
  }
}

runAgent();

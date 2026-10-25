import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';
import { extractNormalizedDailySheetRows, parseDailySheet } from '../src/lib/dailySheetParser';
import { CANONICAL_FIRESTORE_DAILY_REPORTS, CANONICAL_FIRESTORE_LOGBOOK_ENTRIES } from '../src/data/canonicalFirestoreData';
import { INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES } from '../src/data';
import { STAFF_LIST } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';
import { getScheduleByKey } from '../src/data/staffSchedules';

async function main() {
  // 1. Fetch current Google Sheet October data
  const url = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=1340328886';
  const response = await fetch(url);
  const text = await response.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  const parsed = JSON.parse(jsonMatch![1]);
  const rawRows = parsed?.table?.rows || [];
  const rawCellMatrix = rawRows.map((row: any) => (row.c || []).map((cell: any) => String(cell?.f || cell?.v || '')));
  const sheetRows = extractNormalizedDailySheetRows(rawCellMatrix);
  const sheetEntries = parseDailySheet(sheetRows);

  const sheetReports = sheetEntries.map(e => ({
    id: e.id,
    date: e.date,
    staffName: e.staffName,
    division: e.division,
    activity: e.activity,
    notes: e.notes || '',
    status: 'Submitted' as const,
    staffId: e.staffId || undefined,
  }));

  const sheetLogbook = sheetEntries.filter(e => e.isQc).map(e => ({
    id: `log-${e.id}`,
    date: e.date,
    division: e.division,
    staffName: e.staffName,
    staffId: e.staffId || undefined,
    equipment: e.activity,
    condition: (e.notes && e.notes.toLowerCase().includes('rusak')) ? 'Rusak' : 'Baik',
    result: (e.notes && (e.notes.toLowerCase().includes('rusak') || e.notes.toLowerCase().includes('trouble') || e.notes.toLowerCase().includes('error'))) ? 'NG' as const : 'OK' as const,
    notes: e.notes || '',
  }));

  console.log('=== OFFICIAL GOOGLE SHEET (SCREENSHOT 2) ===');
  console.log('Total sheet entries:', sheetEntries.length);
  const kpiSheet = calculateAllStaffKpis(
    STAFF_LIST,
    sheetReports,
    sheetLogbook as any,
    [],
    undefined,
    undefined,
    getScheduleByKey('2026-10')?.rows,
    [],
    [],
    '2026-10'
  );
  const activeSheet = kpiSheet.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log('Active staff:', activeSheet.length);
  console.log('Total Reports:', activeSheet.reduce((acc, s) => acc + s.reports, 0));
  console.log('Total QC:', activeSheet.reduce((acc, s) => acc + s.qcs, 0));
  console.log('Total Attendance:', activeSheet.reduce((acc, s) => acc + s.attendanceCount, 0));
  console.log('Total Work Hours:', activeSheet.reduce((acc, s) => acc + s.hours, 0));
  console.log('Average KPI:', Math.round(activeSheet.reduce((acc, s) => acc + s.kpi, 0) / (activeSheet.length || 1)));

  console.log('\n=== HOW DID SCREENSHOT 1 (61 REPORTS, 20 QC) GET CREATED? ===');
  // Look at Supabase reports:
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  const sbOct = sbReports.filter((r: any) => r.date && r.date.startsWith('2026-10'));
  console.log('Total Supabase October reports:', sbOct.length);

  // Notice in Screenshot 1:
  // Mulyana: 8 reports
  // Heri: 6 reports
  // Ramdani: 6 reports
  // Muhamad Rahmat: 6 reports
  // Taufik Diana: 5 reports
  // Ayong Sumarsih: 4 reports
  // Dedi Agus: 4 reports
  // Wahyudin: 4 reports
  // Total of these 8 = 43
  // Remaining 5 staff = 18 reports (total 61)

  // Look at canonicalFirestoreData.ts:
  // CANONICAL_FIRESTORE_DAILY_REPORTS has 22 October reports
  // What are the 22 October reports in CANONICAL_FIRESTORE_DAILY_REPORTS?
  console.log('\nCanonical October reports count:', CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => r.date.startsWith('2026-10')).length);

  // Let's check how many reports are in canonical vs sheet:
  const canonicalOct = CANONICAL_FIRESTORE_DAILY_REPORTS.filter(r => r.date.startsWith('2026-10'));
  const canonicalIds = new Set(canonicalOct.map(r => r.id));
  const sheetIds = new Set(sheetReports.map(r => r.id));

  const onlyInCanonical = canonicalOct.filter(r => !sheetIds.has(r.id));
  console.log('Reports only in Canonical (not matching sheet ID):', onlyInCanonical.length);
  onlyInCanonical.forEach(r => console.log(' -', r.id, r.staffName, r.date, r.activity?.slice(0, 30)));

  const onlyInSheet = sheetReports.filter(r => !canonicalIds.has(r.id));
  console.log('Reports only in Sheet (not matching canonical ID):', onlyInSheet.length);
}

main().catch(console.error);

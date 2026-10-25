import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';
import { extractNormalizedDailySheetRows, parseDailySheet, ParsedEntry } from '../src/lib/dailySheetParser';
import { INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES } from '../src/data';
import { CANONICAL_FIRESTORE_DAILY_REPORTS, CANONICAL_FIRESTORE_LOGBOOK_ENTRIES } from '../src/data/canonicalFirestoreData';
import { STAFF_LIST } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';
import { getScheduleByKey } from '../src/data/staffSchedules';

async function main() {
  const url = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=1340328886';
  const response = await fetch(url);
  const text = await response.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  if (!jsonMatch) {
    console.error('Failed to parse gviz json');
    return;
  }
  const parsed = JSON.parse(jsonMatch[1]);
  const rawRows = parsed?.table?.rows || [];
  const rawCellMatrix = rawRows.map((row: any) => (row.c || []).map((cell: any) => String(cell?.f || cell?.v || '')));
  const sheetRows = extractNormalizedDailySheetRows(rawCellMatrix);
  const parsedEntries = parseDailySheet(sheetRows);

  console.log('Total Parsed entries from Sheet:', parsedEntries.length);
  const sheetReports = parsedEntries.map(e => ({
    id: e.id,
    date: e.date,
    staffName: e.staffName,
    division: e.division,
    activity: e.activity,
    notes: e.notes || '',
    status: 'Submitted' as const,
    staffId: e.staffId || undefined,
  }));

  const sheetLogbook = parsedEntries.filter(e => e.isQc).map(e => ({
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

  console.log('Sheet reports count:', sheetReports.length);
  console.log('Sheet logbook count:', sheetLogbook.length);

  // 1. Calculate KPI using SHEET ONLY
  const kpiSheetOnly = calculateAllStaffKpis(
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

  const activeSheetOnly = kpiSheetOnly.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  const totalRepSheet = activeSheetOnly.reduce((acc, s) => acc + s.reports, 0);
  const totalQcSheet = activeSheetOnly.reduce((acc, s) => acc + s.qcs, 0);
  const totalAttSheet = activeSheetOnly.reduce((acc, s) => acc + s.attendanceCount, 0);
  const totalHoursSheet = activeSheetOnly.reduce((acc, s) => acc + s.workHours, 0);
  const avgKpiSheet = Math.round(activeSheetOnly.reduce((acc, s) => acc + s.kpi, 0) / (activeSheetOnly.length || 1));

  console.log('\n--- 1. KPI WITH SHEET ONLY ---');
  console.log('Active staff:', activeSheetOnly.length);
  console.log('Total Daily Reports:', totalRepSheet);
  console.log('Total QC Checked:', totalQcSheet);
  console.log('Total Kehadiran:', totalAttSheet);
  console.log('Total Jam Kerja:', totalHoursSheet);
  console.log('Avg KPI:', avgKpiSheet);
  activeSheetOnly.slice(0, 8).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.division}): Rep ${s.reports}, QC ${s.qcs}, Att ${s.attendanceCount}, ${s.hours}h, KPI ${s.kpi}%`);
  });

  // Section 05 with Sheet Only:
  const sheetQcTotal = sheetLogbook.length;
  const sheetQcOk = sheetLogbook.filter(e => e.result === 'OK').length;
  const sheetQcNg = sheetLogbook.filter(e => e.result === 'NG').length;
  console.log(`QC Section 05 (Sheet Only): Total ${sheetQcTotal}, OK ${sheetQcOk}, NG ${sheetQcNg}, %OK ${(sheetQcOk/sheetQcTotal*100).toFixed(1)}%`);

  // 2. Fetch Supabase data
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  const sbLogbook = await pullCollectionFromSupabase('logbook_entries');
  const sbOctReports = sbReports.filter((r: any) => r.date && r.date.startsWith('2026-10'));
  const sbOctLogbook = sbLogbook.filter((l: any) => l.date && l.date.startsWith('2026-10'));

  console.log('\n--- 2. SUPABASE DATA ---');
  console.log('Supabase Oct reports:', sbOctReports.length);
  console.log('Supabase Oct logbook:', sbOctLogbook.length);

  // Calculate KPI using Supabase
  const kpiSb = calculateAllStaffKpis(
    STAFF_LIST,
    sbOctReports,
    sbOctLogbook,
    [],
    undefined,
    undefined,
    getScheduleByKey('2026-10')?.rows,
    [],
    [],
    '2026-10'
  );
  const activeSb = kpiSb.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log('Supabase alone: Active staff:', activeSb.length);
  console.log('Total Reports:', activeSb.reduce((acc, s) => acc + s.reports, 0));
  console.log('Total QC:', activeSb.reduce((acc, s) => acc + s.qcs, 0));
  console.log('Total Kehadiran:', activeSb.reduce((acc, s) => acc + s.attendanceCount, 0));
  console.log('Total Jam Kerja:', activeSb.reduce((acc, s) => acc + s.hours, 0));
  console.log('Avg KPI:', Math.round(activeSb.reduce((acc, s) => acc + s.kpi, 0) / (activeSb.length || 1)));
  activeSb.slice(0, 8).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.division}): Rep ${s.reports}, QC ${s.qcs}, Att ${s.attendanceCount}, ${s.hours}h, KPI ${s.kpi}%`);
  });

  const sbQcTotal = sbOctLogbook.length;
  const sbQcOk = sbOctLogbook.filter((e: any) => e.result === 'OK').length;
  const sbQcNg = sbOctLogbook.filter((e: any) => e.result === 'NG').length;
  console.log(`QC Section 05 (Supabase): Total ${sbQcTotal}, OK ${sbQcOk}, NG ${sbQcNg}, %OK ${(sbQcOk/sbQcTotal*100).toFixed(1)}%`);

  // 3. What about INITIAL_DAILY_REPORTS merged with Sheet?
  const repMap = new Map();
  INITIAL_DAILY_REPORTS.filter(r => r.date.startsWith('2026-10')).forEach(r => repMap.set(r.id, r));
  sheetReports.forEach(r => repMap.set(r.id, r));
  const mergedInitAndSheet = Array.from(repMap.values());

  const logMap = new Map();
  INITIAL_LOGBOOK_ENTRIES.filter(l => l.date.startsWith('2026-10')).forEach(l => logMap.set(l.id, l));
  sheetLogbook.forEach(l => logMap.set(l.id, l));
  const mergedInitAndSheetLog = Array.from(logMap.values());

  const kpiMerged = calculateAllStaffKpis(
    STAFF_LIST,
    mergedInitAndSheet,
    mergedInitAndSheetLog as any,
    [],
    undefined,
    undefined,
    getScheduleByKey('2026-10')?.rows,
    [],
    [],
    '2026-10'
  );
  const activeMerged = kpiMerged.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log('\n--- 3. INITIAL + SHEET MERGE ---');
  console.log('Active staff:', activeMerged.length);
  console.log('Total Reports:', activeMerged.reduce((acc, s) => acc + s.reports, 0));
  console.log('Total QC:', activeMerged.reduce((acc, s) => acc + s.qcs, 0));
  console.log('Total Kehadiran:', activeMerged.reduce((acc, s) => acc + s.attendanceCount, 0));
  console.log('Total Jam Kerja:', activeMerged.reduce((acc, s) => acc + s.hours, 0));
  console.log('Avg KPI:', Math.round(activeMerged.reduce((acc, s) => acc + s.kpi, 0) / (activeMerged.length || 1)));
  activeMerged.slice(0, 8).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.division}): Rep ${s.reports}, QC ${s.qcs}, Att ${s.attendanceCount}, ${s.hours}h, KPI ${s.kpi}%`);
  });

  const mergedQcTotal = mergedInitAndSheetLog.length;
  const mergedQcOk = mergedInitAndSheetLog.filter((e: any) => e.result === 'OK').length;
  const mergedQcNg = mergedInitAndSheetLog.filter((e: any) => e.result === 'NG').length;
  console.log(`QC Section 05 (Initial + Sheet): Total ${mergedQcTotal}, OK ${mergedQcOk}, NG ${mergedQcNg}, %OK ${(mergedQcOk/mergedQcTotal*100).toFixed(1)}%`);
}

main().catch(console.error);

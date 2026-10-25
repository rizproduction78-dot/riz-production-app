import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';
import { extractNormalizedDailySheetRows, parseDailySheet } from '../src/lib/dailySheetParser';
import { STAFF_LIST } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';
import { getScheduleByKey } from '../src/data/staffSchedules';

function normalizeActivitySignature(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 35);
}

function dedupReports(reports: any[]): any[] {
  // Remove test reports
  const cleaned = reports.filter(r => r && !String(r.id || '').startsWith('dr-test') && !String(r.id || '').startsWith('test-'));
  
  const map = new Map<string, any>();
  cleaned.forEach(r => {
    const staffKey = String(r.staffId || r.staffName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const sig = normalizeActivitySignature(r.activity);
    const semKey = `${r.date}__${staffKey}__${sig}`;
    
    if (!map.has(semKey)) {
      map.set(semKey, r);
    } else {
      // Prioritize entry with better notes or canonical structure
      const existing = map.get(semKey);
      if ((r.notes || '').length > (existing.notes || '').length) {
        map.set(semKey, { ...existing, ...r });
      }
    }
  });

  return Array.from(map.values());
}

function dedupLogbook(logs: any[]): any[] {
  // Remove test logs
  const cleaned = logs.filter(l => l && !String(l.id || '').startsWith('lg-test') && !String(l.id || '').startsWith('test-'));

  const map = new Map<string, any>();
  cleaned.forEach(l => {
    const staffKey = String(l.staffId || l.staffName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const eqSig = normalizeActivitySignature(l.equipment || l.activity || '');
    const semKey = `${l.date}__${staffKey}__${eqSig}`;

    if (!map.has(semKey)) {
      map.set(semKey, l);
    } else {
      const existing = map.get(semKey);
      // Keep NG if one of them is NG
      const result = (existing.result === 'NG' || l.result === 'NG') ? 'NG' : 'OK';
      map.set(semKey, { ...existing, ...l, result });
    }
  });

  return Array.from(map.values());
}

async function test() {
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');

  const octReports = sbReports.filter((r: any) => r.date && r.date.startsWith('2026-10'));
  const octLogs = sbLogs.filter((l: any) => l.date && l.date.startsWith('2026-10'));

  console.log('Raw Supabase Oct Reports:', octReports.length);
  console.log('Raw Supabase Oct Logs:', octLogs.length);

  const dedupedReports = dedupReports(octReports);
  const dedupedLogs = dedupLogbook(octLogs);

  console.log('Deduped Oct Reports:', dedupedReports.length);
  console.log('Deduped Oct Logs:', dedupedLogs.length);

  const kpi = calculateAllStaffKpis(
    STAFF_LIST,
    dedupedReports,
    dedupedLogs as any,
    [],
    undefined,
    undefined,
    getScheduleByKey('2026-10')?.rows,
    [],
    [],
    '2026-10'
  );

  const active = kpi.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log('\n--- KPI AFTER DEDUP ---');
  console.log('Active staff:', active.length);
  console.log('Total Reports:', active.reduce((acc, s) => acc + s.reports, 0));
  console.log('Total QC:', active.reduce((acc, s) => acc + s.qcs, 0));
  console.log('Total Kehadiran:', active.reduce((acc, s) => acc + s.attendanceCount, 0));
  console.log('Total Jam Kerja:', active.reduce((acc, s) => acc + s.hours, 0));
  console.log('Avg KPI:', Math.round(active.reduce((acc, s) => acc + s.kpi, 0) / (active.length || 1)));

  active.slice(0, 8).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.division}): Rep ${s.reports}, QC ${s.qcs}, Att ${s.attendanceCount}, ${s.hours}h, KPI ${s.kpi}%`);
  });

  console.log('\n--- SECTION 05 AFTER DEDUP ---');
  const qcTotal = dedupedLogs.length;
  const qcOk = dedupedLogs.filter((l: any) => l.result === 'OK').length;
  const qcNg = dedupedLogs.filter((l: any) => l.result === 'NG').length;
  console.log(`Total QC: ${qcTotal}, OK: ${qcOk}, NG: ${qcNg}, %OK: ${(qcOk/qcTotal*100).toFixed(1)}%`);
}

test();

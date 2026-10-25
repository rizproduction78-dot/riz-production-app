import { normalizeCollectionItems } from '../src/lib/cloudSync';
import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';
import { STAFF_LIST } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';
import { getScheduleByKey } from '../src/data/staffSchedules';

function cleanReports(reports: any[]): any[] {
  const withoutTest = reports.filter(r => r && !String(r.id || '').startsWith('dr-test') && !String(r.id || '').startsWith('test-'));
  return normalizeCollectionItems('daily_reports', withoutTest);
}

function cleanLogs(logs: any[]): any[] {
  const withoutTest = logs.filter(l => l && !String(l.id || '').startsWith('lg-test') && !String(l.id || '').startsWith('test-'));
  return normalizeCollectionItems('logbook_entries', withoutTest);
}

async function run() {
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');

  const normReports = cleanReports(sbReports);
  const normLogs = cleanLogs(sbLogs);

  const octReports = normReports.filter(r => r.date && r.date.startsWith('2026-10'));
  const octLogs = normLogs.filter(l => l.date && l.date.startsWith('2026-10'));

  console.log('Cleaned Oct Reports count:', octReports.length);
  console.log('Cleaned Oct Logs count:', octLogs.length);

  const kpis = calculateAllStaffKpis(
    STAFF_LIST,
    octReports,
    octLogs,
    [],
    undefined,
    undefined,
    getScheduleByKey('2026-10')?.rows,
    [],
    [],
    '2026-10'
  );

  const active = kpis.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log('Active staff count:', active.length);
  console.log('Total Reports:', active.reduce((acc, s) => acc + s.reports, 0));
  console.log('Total QC Checked:', active.reduce((acc, s) => acc + s.qcs, 0));
  console.log('Total Kehadiran:', active.reduce((acc, s) => acc + s.attendanceCount, 0));
  console.log('Total Jam Kerja:', active.reduce((acc, s) => acc + s.hours, 0));
  console.log('Average KPI:', Math.round(active.reduce((acc, s) => acc + s.kpi, 0) / (active.length || 1)));

  active.slice(0, 8).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.division}): Rep ${s.reports}, QC ${s.qcs}, Att ${s.attendanceCount}, ${s.hours}h, KPI ${s.kpi}%`);
  });

  const ok = octLogs.filter((l: any) => l.result === 'OK').length;
  const ng = octLogs.filter((l: any) => l.result === 'NG').length;
  console.log(`Section 05: Total ${octLogs.length}, OK ${ok}, NG ${ng}, %OK ${(ok/octLogs.length*100).toFixed(1)}%`);
}

run();

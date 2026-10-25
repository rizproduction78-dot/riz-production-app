import { INITIAL_FINDINGS, INITIAL_WORK_ORDERS, INITIAL_DAILY_TASKS, STAFF_LIST } from '../src/data';
import { calculateAllStaffKpis } from '../src/utils/kpiCalculator';
import { getScheduleByKey } from '../src/data/staffSchedules';
import { pullCollectionFromSupabase } from '../src/lib/supabaseSync';

function normalizeActivitySignature(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 35);
}

async function test() {
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');
  const octReports = sbReports.filter((r: any) => r.date && r.date.startsWith('2026-10') && !String(r.id || '').startsWith('dr-test'));
  const octLogs = sbLogs.filter((l: any) => l.date && l.date.startsWith('2026-10') && !String(l.id || '').startsWith('lg-test'));

  const mapR = new Map();
  octReports.forEach((r: any) => {
    const k = r.date + '__' + (r.staffId || r.staffName).toLowerCase().replace(/[^a-z0-9]/g, '') + '__' + normalizeActivitySignature(r.activity);
    if (!mapR.has(k)) mapR.set(k, r);
  });
  const dedupR = Array.from(mapR.values());

  const mapL = new Map();
  octLogs.forEach((l: any) => {
    const k = l.date + '__' + (l.staffId || l.staffName).toLowerCase().replace(/[^a-z0-9]/g, '') + '__' + normalizeActivitySignature(l.equipment || l.activity || '');
    if (!mapL.has(k)) mapL.set(k, l);
  });
  const dedupL = Array.from(mapL.values());

  const kpis = calculateAllStaffKpis(
    STAFF_LIST,
    dedupR,
    dedupL,
    INITIAL_FINDINGS.filter(f => f.dateCreated.startsWith('2026-10')),
    undefined,
    undefined,
    getScheduleByKey('2026-10')?.rows,
    INITIAL_WORK_ORDERS.filter(w => w.dateCreated.startsWith('2026-10')),
    INITIAL_DAILY_TASKS.filter(t => t.createdAt.startsWith('2026-10')),
    '2026-10'
  );

  const active = kpis.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0);
  console.log('Top 8 Staff with findings and work orders:');
  active.slice(0, 8).forEach((s, idx) => {
    console.log(`${idx + 1}. ${s.name} (${s.division}): Rep ${s.reports}, QC ${s.qcs}, Att ${s.attendanceCount}, ${s.hours}h, KPI ${s.kpi}%`);
  });
}
test();

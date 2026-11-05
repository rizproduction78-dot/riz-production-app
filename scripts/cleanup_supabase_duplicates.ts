import { pullCollectionFromSupabase, deleteSupabaseDoc, pushCollectionToSupabase } from '../src/lib/supabaseSync';
import { normalizeCollectionItems } from '../src/lib/cloudSync';
import { INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES, INITIAL_DAILY_TASKS, INITIAL_FINDINGS } from '../src/data';

async function cleanup() {
  console.log('Fetching daily_reports from Supabase...');
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  console.log('Total daily_reports in Supabase:', sbReports.length);

  const mergedReports = normalizeCollectionItems('daily_reports', [...INITIAL_DAILY_REPORTS, ...sbReports]);
  const cleanReportIds = new Set(mergedReports.map((r: any) => String(r.id)));
  const dirtyReportIds = sbReports
    .filter((r: any) => !cleanReportIds.has(String(r.id)))
    .map((r: any) => String(r.id));

  console.log(`Deleting ${dirtyReportIds.length} obsolete/shifted report records from Supabase...`);
  for (const id of dirtyReportIds) {
    await deleteSupabaseDoc('daily_reports', id);
  }

  const novCanonicalReports = INITIAL_DAILY_REPORTS.filter((r: any) => String(r.date || '').startsWith('2026-11'));
  await pushCollectionToSupabase('daily_reports', novCanonicalReports as any[]);
  console.log(`Upserted ${novCanonicalReports.length} canonical November 2026 daily_reports to Supabase.`);

  console.log('\nFetching logbook_entries from Supabase...');
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');
  console.log('Total logbook_entries in Supabase:', sbLogs.length);

  const mergedLogs = normalizeCollectionItems('logbook_entries', [...INITIAL_LOGBOOK_ENTRIES, ...sbLogs]);
  const cleanLogIds = new Set(mergedLogs.map((l: any) => String(l.id)));
  const dirtyLogIds = sbLogs
    .filter((l: any) => !cleanLogIds.has(String(l.id)))
    .map((l: any) => String(l.id));

  console.log(`Deleting ${dirtyLogIds.length} obsolete/shifted logbook records from Supabase...`);
  for (const id of dirtyLogIds) {
    await deleteSupabaseDoc('logbook_entries', id);
  }

  const novCanonicalLogs = INITIAL_LOGBOOK_ENTRIES.filter((l: any) => String(l.date || '').startsWith('2026-11'));
  await pushCollectionToSupabase('logbook_entries', novCanonicalLogs as any[]);
  console.log(`Upserted ${novCanonicalLogs.length} canonical November 2026 logbook_entries to Supabase.`);

  console.log('\nFetching findings from Supabase...');
  const sbFindings = await pullCollectionFromSupabase('findings');
  const mergedFindings = normalizeCollectionItems('findings', [...INITIAL_FINDINGS, ...sbFindings]);
  const cleanFindingIds = new Set(mergedFindings.map((f: any) => String(f.id)));
  const dirtyFindingIds = sbFindings
    .filter((f: any) => !cleanFindingIds.has(String(f.id)))
    .map((f: any) => String(f.id));

  console.log(`Deleting ${dirtyFindingIds.length} obsolete finding records from Supabase...`);
  for (const id of dirtyFindingIds) {
    await deleteSupabaseDoc('findings', id);
  }
  await pushCollectionToSupabase('findings', INITIAL_FINDINGS as any[]);

  console.log('\nSyncing canonical daily_tasks to Supabase...');
  await pushCollectionToSupabase('daily_tasks', INITIAL_DAILY_TASKS as any[]);
  console.log(`Upserted ${INITIAL_DAILY_TASKS.length} canonical daily_tasks to Supabase.`);

  console.log('\nCleanup & reconciliation complete!');
}

cleanup().catch(console.error);

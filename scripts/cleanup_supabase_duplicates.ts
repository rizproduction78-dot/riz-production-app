import { pullCollectionFromSupabase, deleteSupabaseDoc, saveSupabaseDoc } from '../src/lib/supabaseSync';
import { normalizeCollectionItems } from '../src/lib/cloudSync';

async function cleanup() {
  console.log('Fetching daily_reports from Supabase...');
  const sbReports = await pullCollectionFromSupabase('daily_reports');
  console.log('Total daily_reports:', sbReports.length);

  // Identify test IDs
  const testReports = sbReports.filter((r: any) => String(r.id || '').startsWith('dr-test') || String(r.id || '').startsWith('test-'));
  console.log('Test reports to delete:', testReports.map((r: any) => r.id));
  for (const r of testReports) {
    await deleteSupabaseDoc('daily_reports', r.id);
  }

  // Identify duplicate October reports
  const octReports = sbReports.filter((r: any) => r.date && r.date.startsWith('2026-10') && !String(r.id || '').startsWith('dr-test'));
  console.log('October reports before cleanup:', octReports.length);
  
  const cleanOctReports = normalizeCollectionItems('daily_reports', octReports);
  console.log('Clean October reports:', cleanOctReports.length);

  const cleanIds = new Set(cleanOctReports.map(r => r.id));
  const dirtyIds = octReports.filter((r: any) => !cleanIds.has(r.id)).map((r: any) => r.id);
  console.log(`Deleting ${dirtyIds.length} duplicate/shifted report records from Supabase...`);
  for (const id of dirtyIds) {
    await deleteSupabaseDoc('daily_reports', id);
  }

  // Now do the same for logbook_entries
  console.log('\nFetching logbook_entries from Supabase...');
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');
  console.log('Total logbook_entries:', sbLogs.length);

  const testLogs = sbLogs.filter((l: any) => String(l.id || '').startsWith('lg-test') || String(l.id || '').startsWith('test-'));
  console.log('Test logs to delete:', testLogs.map((l: any) => l.id));
  for (const l of testLogs) {
    await deleteSupabaseDoc('logbook_entries', l.id);
  }

  const octLogs = sbLogs.filter((l: any) => l.date && l.date.startsWith('2026-10') && !String(l.id || '').startsWith('lg-test'));
  console.log('October logs before cleanup:', octLogs.length);

  const cleanOctLogs = normalizeCollectionItems('logbook_entries', octLogs);
  console.log('Clean October logs:', cleanOctLogs.length);

  const cleanLogIds = new Set(cleanOctLogs.map(l => l.id));
  const dirtyLogIds = octLogs.filter((l: any) => !cleanLogIds.has(l.id)).map((l: any) => l.id);
  console.log(`Deleting ${dirtyLogIds.length} duplicate/shifted log records from Supabase...`);
  for (const id of dirtyLogIds) {
    await deleteSupabaseDoc('logbook_entries', id);
  }

  console.log('\nCleanup complete!');
}

cleanup().catch(console.error);

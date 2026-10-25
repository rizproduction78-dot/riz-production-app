import { saveSupabaseDoc, pullCollectionFromSupabase } from '../src/lib/supabaseSync';

async function update20261019() {
  const sbLogs = await pullCollectionFromSupabase('logbook_entries');
  const targetLogs = sbLogs.filter((l: any) => l.date === '2026-10-19');

  console.log('Target logs on 2026-10-19:', targetLogs.length);
  for (const l of targetLogs) {
    console.log('Updating to OK:', l.id, l.staffName);
    await saveSupabaseDoc('logbook_entries', l.id, {
      ...l,
      result: 'OK',
      status: 'Close',
      followUp: 'Pengecekan selesai aman'
    });
  }

  // Also delete the duplicate log-gsheet-20261001-staff-irvan-6
  const { deleteSupabaseDoc } = await import('../src/lib/supabaseSync');
  await deleteSupabaseDoc('logbook_entries', 'log-gsheet-20261001-staff-irvan-6');

  console.log('Update complete!');
}

update20261019().catch(console.error);

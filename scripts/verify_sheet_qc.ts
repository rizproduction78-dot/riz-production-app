import { extractNormalizedDailySheetRows, parseDailySheet } from '../src/lib/dailySheetParser';

async function verifySheet() {
  const url = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=1340328886';
  const response = await fetch(url);
  const text = await response.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
  const parsed = JSON.parse(jsonMatch![1]);
  const rawRows = parsed?.table?.rows || [];
  const rawCellMatrix = rawRows.map((row: any) => (row.c || []).map((cell: any) => String(cell?.f || cell?.v || '')));
  const sheetRows = extractNormalizedDailySheetRows(rawCellMatrix);
  const entries = parseDailySheet(sheetRows);

  console.log('Total entries:', entries.length);
  const qcEntries = entries.filter(e => e.isQc);
  console.log('Total QC entries:', qcEntries.length);

  let okCount = 0;
  let ngCount = 0;

  qcEntries.forEach((e, idx) => {
    const isNg = /harus service|service|rusak|kendala|masalah|error|mati|tidak berfungsi|ganti|perbaikan|repair|tidak ok|ng|perlu/i.test(e.notes);
    if (isNg) ngCount++;
    else okCount++;
    console.log(`${idx + 1}. [${isNg ? 'NG' : 'OK'}] ${e.date} | ${e.staffName} | Act: ${e.activity.slice(0, 35)} | Notes: ${e.notes.slice(0, 35)}`);
  });

  console.log(`\nResult: Total QC = ${qcEntries.length}, OK = ${okCount}, NG = ${ngCount}`);
}

verifySheet();

import { pullDailyLogFromGviz } from '../src/lib/googleSheetSync';
async function runSync() {
  console.log("Memulai sinkronisasi paksa dari Google Sheet Resmi...");
  await pullDailyLogFromGviz();
  console.log("Sinkronisasi berhasil!");
}
runSync().catch(console.error);

import { pullDailyLogFromGviz } from './src/lib/googleSheetSync.ts';
async function test() {
  const data = await pullDailyLogFromGviz('938476420');
  console.log("Returned:", data);
}
test().catch(console.error);

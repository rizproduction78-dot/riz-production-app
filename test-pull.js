import { pullDailyLogFromGviz } from './src/lib/googleSheetSync.ts';
async function test() {
  const data = await pullDailyLogFromGviz('938476420');
  console.log("Extracted items:", data.length);
  console.log(JSON.stringify(data.slice(0,2), null, 2));
}
test().catch(console.error);

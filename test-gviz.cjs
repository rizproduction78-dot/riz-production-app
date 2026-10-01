const fetch = require('node-fetch');
async function test() {
  const url = `https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=938476420`;
  const response = await fetch(url);
  const text = await response.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
  const parsed = JSON.parse(jsonMatch[1]);
  console.log(JSON.stringify(parsed.table.rows, null, 2));
}
test();

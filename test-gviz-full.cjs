const https = require('https');
https.get('https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=938476420', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const match = data.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
    const json = JSON.parse(match[1]);
    console.log(JSON.stringify(json.table.rows, null, 2));
  });
});

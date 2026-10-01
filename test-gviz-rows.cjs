const https = require('https');
const url = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=938476420';
https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const jsonStr = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonStr);
    console.log(JSON.stringify(parsed.table.rows, null, 2));
  });
});

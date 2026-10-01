const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=938476420';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const jsonStr = data.substring(data.indexOf('{'), data.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonStr);
    const rows = parsed.table.rows;
    let ayong = 0;
    let irvan = 0;
    rows.forEach(r => {
      const staffCol = r.c[1];
      if (staffCol && staffCol.v) {
        if (staffCol.v.toLowerCase().includes('ayong')) ayong++;
        if (staffCol.v.toLowerCase().includes('irfan')) irvan++;
      }
    });
    console.log(`Total rows: ${rows.length}`);
    console.log(`Ayong rows: ${ayong}`);
    console.log(`Irfan rows: ${irvan}`);
  });
});

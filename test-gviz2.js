async function test() {
  const url = `https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/gviz/tq?tqx=out:json&gid=938476420`;
  const response = await fetch(url);
  const text = await response.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
  const parsed = JSON.parse(jsonMatch[1]);
  const rows = parsed.table.rows;
  
  let currentDate = null;
  let currentStaffNames = [];
  let newReports = 0;

  for (const row of rows) {
      const cells = row.c || [];
      const rawDate   = cells[0]?.f || cells[0]?.v || '';
      const rawStaff  = cells[1]?.v || '';
      const sound     = cells[2]?.v || '';
      const lighting  = cells[3]?.v || '';
      const led       = cells[4]?.v || '';
      const multimedia= cells[5]?.v || '';
      const remark    = cells[6]?.v || '';

      if (rawDate) {
        // mock parseIndonesianDate
        if (String(rawDate).includes('1 Oktober 2026')) {
            if ('2026-10-01' !== currentDate) currentStaffNames = [];
            currentDate = '2026-10-01';
        }
      }
      if (!currentDate) continue;

      const staffStr = String(rawStaff);
      let parsedStaff = [];
      if (staffStr && staffStr.trim()) {
        parsedStaff = staffStr.split(/[\n,;/]+|\s+-\s+|\s+&\s+|\s+dan\s+/i)
            .map(s => s.replace(/^[-–*•\s]+/, '').trim())
            .filter(Boolean);
      }
      if (parsedStaff.length > 0) currentStaffNames = parsedStaff;
      const activeStaffList = parsedStaff.length > 0 ? parsedStaff : (currentStaffNames.length > 0 ? currentStaffNames : ['Tim Operasional']);

      const activity = [sound, lighting, led, multimedia].filter(Boolean).join('; ').trim();
      console.log({rawDate, rawStaff, activity, remark, currentDate, activeStaffList});
  }
}
test();

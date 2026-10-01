const months: Record<string, string> = {
  'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
  'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
  'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
};

function parseIndonesianDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const gvizMatch = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (gvizMatch) {
    const y = gvizMatch[1];
    const m = String(parseInt(gvizMatch[2]) + 1).padStart(2, '0');
    const d = String(gvizMatch[3]).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const parts = dateStr.toLowerCase().trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].replace(/\D/g, '').padStart(2, '0');
    const month = months[parts[1]] || '01';
    const year = parts[2];
    if (day && month && year) return `${year}-${month}-${day}`;
  }
  return null;
}
console.log(parseIndonesianDate("1 Oktober 2026"));
console.log(parseIndonesianDate("01 Oktober 2026"));
console.log(parseIndonesianDate("Date(2026,9,1)"));

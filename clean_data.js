const fs = require('fs');

const dataFile = 'src/data/canonicalFirestoreData.ts';
let code = fs.readFileSync(dataFile, 'utf8');

// The file has export const canonicalDailyReports = [ ... ];
// Since it's TS we can't easily require it.
// We'll just remove the lines using a simple parser or regex.
// Wait, regex might break. Let's just remove the blocks that we know are fake.
// Actually, it's easier to use replace_file_content if we know the line numbers.

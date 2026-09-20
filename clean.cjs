const fs = require('fs');

let file = fs.readFileSync('src/data/canonicalFirestoreData.ts', 'utf8');

// We know the exact structure.
// Let's remove from // 12 September 2026 up to before ]; in Reports
let reportEnd = file.indexOf('];', file.indexOf('CANONICAL_FIRESTORE_DAILY_REPORTS'));
let reportStart = file.indexOf('  // 12 September 2026');
if (reportStart !== -1 && reportStart < reportEnd) {
    file = file.substring(0, reportStart) + file.substring(reportEnd);
}

// For LOGBOOK, starts at // 12 Sept
let logEnd = file.indexOf('];', file.indexOf('CANONICAL_FIRESTORE_LOGBOOK_ENTRIES'));
let logStart = file.indexOf('  // 12 Sept', file.indexOf('CANONICAL_FIRESTORE_LOGBOOK_ENTRIES'));
if (logStart !== -1 && logStart < logEnd) {
    file = file.substring(0, logStart) + file.substring(logEnd);
}

// For FINDINGS, we need to find { id: "find-20260912-parled13" and remove up to ];
let findEnd = file.indexOf('];', file.indexOf('CANONICAL_FIRESTORE_FINDINGS'));
let findStart = file.indexOf('  {\n    id: "find-20260912-parled13"');
if (findStart !== -1 && findStart < findEnd) {
    file = file.substring(0, findStart) + file.substring(findEnd);
}

// Fix trailing commas if any
file = file.replace(/,\n\];/g, '\n];');

fs.writeFileSync('src/data/canonicalFirestoreData.ts', file);
console.log("Done cleaning");

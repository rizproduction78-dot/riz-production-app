import {
  INITIAL_JOB_ASSIGNMENTS,
  normalizeJobAssignmentsMaster,
  isStrictJobOrEventCalendarEntry,
} from '../src/data/jobAssignmentsData';
import { INITIAL_DAILY_TASKS } from '../src/data';
import { normalizeCollectionItems } from '../src/lib/cloudSync';
import {
  GOOGLE_CALENDAR_AUTO_SYNC_INTERVAL_MS,
  parseGoogleCalendarIcsToJobAssignments,
  buildDailyTasksFromJobAssignment,
  syncJobAssignmentsToCrewDailyTasks,
  mergeLiveGoogleCalendarJobs,
} from '../src/lib/googleCalendarSync';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('=== TEST: STRICT GOOGLE CALENDAR JOB/EVENT FILTER & CREW WORK ASSIGNMENT LINKAGE ===');

// 1. Verify non-Job / non-Event summaries are strictly rejected
const blockedSamples = [
  'Meeting event Hyundai jam 15.00 online',
  'Meeting online Djarum Padel',
  'Techmet Rancamaya',
  'Technet Rancamaya & Survey Jagorawi',
  'Techmeeting Lorin 14.00',
  "met'up pengurus dikantor",
  'Kopdar Imigrasi',
  'SURVEI PURI BEGAWAN D',
  'Survey event Rancamaya golf & hotel',
  'survey ruang design jam',
  'BU PUNTIAH VISIT KANTOR',
  'Konsultasi Pajak ( Pak Hendra )',
  'Woyo urus pajak engkel',
  'Aulia Loan',
  'Bank Sumsel KUR',
  'BAYAR KGS PT',
  'CIONK IJIN',
  'PENGIRIMAN HAMPERS CLIENT',
  'bagi hampers crew',
  'Undangan Bpk Dian Bracom',
  'Bagas adenya meried',
  'Bukber Gabungan RI',
  'Training Grand MA',
  'Yamaha training DM5',
  'WhitepaperIndustriEvent',
  '9 Nov 2026 RP 9-16',
  '30 Mar 2026 MD',
];

for (const sample of blockedSamples) {
  assert(
    !isStrictJobOrEventCalendarEntry(sample, ''),
    `Sample non-job "${sample}" seharusnya diblokir oleh isStrictJobOrEventCalendarEntry`
  );
}
console.log(`✅ Semua ${blockedSamples.length} pola non-Job (Meeting/Survey/Pajak/KUR/Ijin/Hampers/dll) berhasil diblokir.`);

// 2. Verify valid Job/Event entries pass
const validJobSamples = [
  'Pak Wendi Rancamaya',
  'Shutt Shoot Brick Hall 15rb',
  'Discovery Evocentro',
  'Bu Ghita The Adrres Cibubur',
  'Keanu Bucketlist',
  'Natalan GBI',
  'Hyundai Gowa Cibinong 5jt',
];

for (const validSample of validJobSamples) {
  assert(
    isStrictJobOrEventCalendarEntry(validSample, ''),
    `Sample Job/Event "${validSample}" seharusnya lolos isStrictJobOrEventCalendarEntry`
  );
}
console.log(`✅ Semua ${validJobSamples.length} jadwal Job/Event produksi valid berhasil lolos filter.`);

// 3. Verify INITIAL_JOB_ASSIGNMENTS and normalizeJobAssignmentsMaster contain 0 non-Job entries
for (const job of INITIAL_JOB_ASSIGNMENTS) {
  assert(
    isStrictJobOrEventCalendarEntry(job.venue, job.notes || ''),
    `INITIAL_JOB_ASSIGNMENTS masih memiliki entri non-Job: ${job.id} (${job.venue})`
  );
}
const nov2026Venues = INITIAL_JOB_ASSIGNMENTS.filter(j => j.monthKey === '2026-11').map(j => j.venue);
assert(nov2026Venues.includes('Shutt Shoot Brick Hall 15rb'), 'Shutt Shoot Brick Hall 15rb wajib ada di November 2026');
assert(nov2026Venues.includes('Discovery Evocentro'), 'Discovery Evocentro wajib ada di November 2026');
assert(nov2026Venues.includes('Bu Ghita The Adrres Cibubur'), 'Bu Ghita The Adrres Cibubur wajib ada di November 2026');
assert(nov2026Venues.includes('Keanu Bucketlist'), 'Keanu Bucketlist wajib ada di November 2026');
console.log(`✅ INITIAL_JOB_ASSIGNMENTS (${INITIAL_JOB_ASSIGNMENTS.length} jadwal Job/Event) 100% bersih dari jadwal non-Job.`);

// 4. Verify normalizeJobAssignmentsMaster purges injected non-Job items
const pollutedList = [
  ...INITIAL_JOB_ASSIGNMENTS.slice(0, 3),
  {
    id: 'job-fake-meeting-999',
    date: '2026-11-12',
    dateLabel: '12 November - Techmet & Survey Klien',
    monthKey: '2026-11',
    venue: 'Techmet & Survey Klien',
    loadingSchedule: 'Sesuai Jadwal Google Calendar',
    pic: 'Admin / Tim Operasional',
    status: 'Terjadwal' as const,
    sections: [],
  },
];
const cleanedList = normalizeJobAssignmentsMaster(pollutedList);
assert(
  !cleanedList.some(j => j.id === 'job-fake-meeting-999'),
  'normalizeJobAssignmentsMaster wajib membuang entri Techmet & Survey Klien'
);
console.log('✅ normalizeJobAssignmentsMaster otomatis memfilter keluar entri non-Job.');

// 5. Verify ICS parser filters out non-Job VEVENTs and parses valid Job/Event VEVENTs with sections & crew
const sampleIcs = [
  'BEGIN:VCALENDAR',
  'BEGIN:VEVENT',
  'UID:meeting-123@google.com',
  'DTSTART;VALUE=DATE:20261114',
  'SUMMARY:Meeting Vendor Panggung 14.00',
  'DESCRIPTION:Rapat koordinasi di kantor',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:job-keanu-20261120@google.com',
  'DTSTART;VALUE=DATE:20261120',
  'SUMMARY:Keanu Bucketlist',
  'DESCRIPTION:Sound 7000\\nLED 3x10\\nLighting Beam\\nOpik, Dani, Ayong, Heri',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

const parsedFromIcs = parseGoogleCalendarIcsToJobAssignments(sampleIcs);
assert(parsedFromIcs.length === 1, `Seharusnya hanya 1 Job/Event yang diimpor dari ICS, dapat: ${parsedFromIcs.length}`);
assert(parsedFromIcs[0].venue === 'Keanu Bucketlist', 'Venue ICS yang lolos harus Keanu Bucketlist');
assert(parsedFromIcs[0].sections.length >= 2, 'Divisi dan alat harus ter-ekstrak dari deskripsi ICS');
console.log('✅ parseGoogleCalendarIcsToJobAssignments memblokir VEVENT Meeting dan mengekstrak VEVENT Job/Event beserta divisi & alat.');

// 6. Verify 5W Crew Work Assignment (DailyTask) generation & Crew Linkage across INITIAL_JOB_ASSIGNMENTS
const jobsWithoutCrew = INITIAL_JOB_ASSIGNMENTS.filter(
  j => !j.sections || j.sections.every(s => !s.crew || s.crew.length === 0)
);
assert(
  jobsWithoutCrew.length === 0,
  `Seluruh Job/Event di INITIAL_JOB_ASSIGNMENTS wajib memiliki keterkaitan penugasan crew/staff, ditemukan ${jobsWithoutCrew.length} kosong`
);

const rebingJob = INITIAL_JOB_ASSIGNMENTS.find(j => j.venue.includes('Rebing Harris Cibinong'))!;
assert(Boolean(rebingJob), 'Job Rebing Harris Cibinong harus ada di INITIAL_JOB_ASSIGNMENTS');
assert(
  rebingJob.sections.some(s => s.crew.some(c => c.canonicalName === 'REBING' && c.personnelType === 'Freelance')),
  'Job Rebing Harris Cibinong wajib menugaskan Rebing (Freelance Audio)'
);

const uganJob = INITIAL_JOB_ASSIGNMENTS.find(j => j.venue.includes('Ugan order'))!;
assert(Boolean(uganJob), 'Job Ugan order harus ada di INITIAL_JOB_ASSIGNMENTS');
assert(
  uganJob.sections.some(s => s.crew.some(c => c.canonicalName === 'UGAN')) &&
    uganJob.sections.some(s => s.crew.some(c => c.staffId === 'staff-heri')),
  'Job Ugan order wajib menugaskan Ugan (Freelance Lighting) dan Heri (Team Leader Lighting)'
);

const keanuJob = INITIAL_JOB_ASSIGNMENTS.find(j => j.id === 'gcal-5abeh08spshtjrg0age00r2lkj')!;
assert(Boolean(keanuJob), 'Job Keanu Bucketlist harus ditemukan di INITIAL_JOB_ASSIGNMENTS');
const activeSyncedTasks = syncJobAssignmentsToCrewDailyTasks(INITIAL_JOB_ASSIGNMENTS);
assert(
  activeSyncedTasks.length >= 25,
  `syncJobAssignmentsToCrewDailyTasks wajib menghasilkan >= 25 DailyTask penugasan aktif, dapat: ${activeSyncedTasks.length}`
);

const generatedFromIcsJob = buildDailyTasksFromJobAssignment(parsedFromIcs[0]);
assert(
  generatedFromIcsJob.length >= 4,
  `Seharusnya menghasilkan >= 4 DailyTask kru untuk Keanu Bucketlist, dapat: ${generatedFromIcsJob.length}`
);
const opikTask = generatedFromIcsJob.find(
  t => t.assignedTo === 'staff-taufik' || (t.assignedName && t.assignedName.includes('Taufik'))
);
assert(
  Boolean(opikTask),
  'Opik (Taufik Diana) wajib mendapatkan DailyTask penugasan kerja dari Job Keanu Bucketlist'
);
assert(opikTask!.division === 'Audio', `Divisi tugas Opik harus Audio, dapat: ${opikTask!.division}`);
assert(opikTask!.title.includes('Keanu Bucketlist'), 'Judul tugas harus mencantumkan nama Job/Event');
console.log(
  `✅ Seluruh ${INITIAL_JOB_ASSIGNMENTS.length} Job/Event memiliki penugasan Crew/Staff terstruktur & menghasilkan ${activeSyncedTasks.length} DailyTask 5W aktif.`
);

// 7. Verify Pusat Notifikasi & Daily Task STRICTLY block Job/Event (jobtask-* / [PENUGASAN JOB])
const pollutedDailyTasks = [
  ...INITIAL_DAILY_TASKS,
  ...generatedFromIcsJob,
];
const cleanedDailyTasks = normalizeCollectionItems('daily_tasks', pollutedDailyTasks);
assert(
  !cleanedDailyTasks.some(
    t => String(t.id).startsWith('jobtask-') || String(t.title || '').startsWith('[PENUGASAN JOB]')
  ),
  'Daily Task & Pusat Notifikasi WAJIB memblokir mutlak seluruh item jobtask-* / [PENUGASAN JOB]'
);
console.log(
  '✅ Pusat Notifikasi & Daily Task 100% bersih dari daftar Job/Event (hanya untuk Daily Log/Task).'
);

// 8. Verify every technical & warehouse staff has assigned Job/Events in Jadwal Penugasan after log-in
const requiredStaffIds = [
  'staff-rahmat',
  'staff-unyin',
  'staff-ramdani',
  'staff-iwan',
  'staff-yudish',
  'staff-taufik',
  'staff-suryana',
  'staff-heri',
  'staff-mulyadi',
  'staff-ayong',
  'staff-dedi',
  'staff-irvan',
  'staff-mulyana',
  'staff-udin',
  'staff-gatot',
  'staff-absobur',
  'staff-damri',
];
const nov2026Jobs = INITIAL_JOB_ASSIGNMENTS.filter(j => j.monthKey === '2026-11');
for (const stId of requiredStaffIds) {
  const assignedInNov = nov2026Jobs.filter(j =>
    j.sections.some(s => s.crew.some(c => c.staffId === stId))
  );
  assert(
    assignedInNov.length > 0,
    `Staff ${stId} wajib memiliki Jadwal Penugasan Job/Event pada bulan berjalan setelah log-in`
  );
}
console.log(
  `✅ Seluruh ${requiredStaffIds.length} Staff memiliki Jadwal Penugasan Job/Event pada masing-masing akun user setelah log-in.`
);

// 9. Verify 30-second auto-sync interval & direct Admin edits from Google Calendar propagate accurately
assert(
  GOOGLE_CALENDAR_AUTO_SYNC_INTERVAL_MS === 30 * 1000,
  `Interval auto-update Google Calendar wajib 30 detik (30000 ms), dapat: ${GOOGLE_CALENDAR_AUTO_SYNC_INTERVAL_MS}`
);

const existingAssessedKeanu = {
  ...keanuJob,
  adminAssessmentStatus: 'Terverifikasi Admin (Approved)' as const,
  adminAssessedBy: 'M. Fahrulyana . A',
  _userEdited: true,
};
const adminEditedInGcalIcs = [
  'BEGIN:VCALENDAR',
  'BEGIN:VEVENT',
  'UID:5abeh08spshtjrg0age00r2lkj@google.com',
  'DTSTART;VALUE=DATE:20261121',
  'SUMMARY:Keanu Bucketlist Hall Utama Bogor',
  'LOCATION:Keanu Bucketlist Hall Utama Bogor',
  'DESCRIPTION:Sound 10000 Watt Upgrade\\nLED P2.9 Indoor\\nMboh, Opik, Ayong',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');
const parsedAdminGcalEdit = parseGoogleCalendarIcsToJobAssignments(adminEditedInGcalIcs);
const { merged: mergedAfterAdminGcalEdit, changedJobs } = mergeLiveGoogleCalendarJobs(
  [existingAssessedKeanu],
  parsedAdminGcalEdit,
  { isAuthoritativeRemoteFeed: true }
);
const updatedKeanu = mergedAfterAdminGcalEdit.find(j => j.id === 'gcal-5abeh08spshtjrg0age00r2lkj')!;
assert(Boolean(updatedKeanu), 'Event Keanu yang diedit langsung di Google Calendar harus tetap ada');
assert(
  updatedKeanu.date === '2026-11-21' && updatedKeanu.venue === 'Keanu Bucketlist Hall Utama Bogor',
  `Perubahan tanggal & venue langsung dari Google Calendar oleh Admin wajib ter-update otomatis (dapat: ${updatedKeanu.date} / ${updatedKeanu.venue})`
);
assert(
  updatedKeanu.adminAssessmentStatus === 'Terverifikasi Admin (Approved)',
  'Status Assessment Admin yang sudah ada wajib tetap terjaga saat event diupdate dari Google Calendar'
);
assert(
  changedJobs.some(j => j.id === 'gcal-5abeh08spshtjrg0age00r2lkj'),
  'Event yang diubah Admin di Google Calendar wajib masuk ke daftar changedJobs untuk di-push ke seluruh user'
);
console.log(
  '✅ Auto-update 30 detik (30s) & perubahan langsung oleh Admin dari Google Calendar terbukti sinkron otomatis ke seluruh user.'
);

console.log('=== SEMUA TEST LULUS 100% ===');

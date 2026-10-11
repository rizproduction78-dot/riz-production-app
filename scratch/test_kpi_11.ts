import { STAFF_LIST } from '../src/data';
import { calculateStaffKpi, isStaffMatch } from '../src/utils/kpiCalculator';

const octReports = [
  { id: 'rep-20261001-staff-irvan-6', staffName: 'Muhamad Irvan', date: '2026-10-01', activity: '- Cek kabel lan' },
  { id: 'rep-20261001-staff-ayong-7', staffName: 'Ayong Sumarsih', date: '2026-10-01', activity: '- Bersiin Prosesor' },
  { id: 'rep-20261002-staff-mulyana-9', staffName: 'Mulyana', date: '2026-10-02', activity: '1. repair 3 kabinet' },
  { id: 'rep-20261002-staff-unyin-17', staffName: 'Wahyudin', date: '2026-10-02', activity: 'inventory' },
  { id: 'rep-20261002-staff-irvan-34', staffName: 'Muhamad Irvan', date: '2026-10-02', activity: '- Beraihin kaki level' },
  { id: 'rep-20261002-staff-ayong-35', staffName: 'Ayong Sumarsih', date: '2026-10-02', activity: '- Bersihin Ambalan' },
  { id: 'rep-20261002-staff-dedi-36', staffName: 'Dedi Agus Wigiantoro', date: '2026-10-02', activity: '- Beneren perleng' },
  { id: 'rep-20261003-staff-heri-37', staffName: 'Heri', date: '2026-10-03', activity: 'Cek Unit Tripot' },
  { id: 'rep-20261003-staff-mulyana-45', staffName: 'Mulyana', date: '2026-10-03', activity: '- repair 1 kabinet' },
  { id: 'rep-20261004-staff-ramdani-47', staffName: 'Ramdani', date: '2026-10-04', activity: 'cleaning up' },
  { id: 'rep-20261004-staff-heri-49', staffName: 'Heri', date: '2026-10-04', activity: 'Cleaning All Beam' }
];

console.log('--- TEST SETIAP STAF DI STAFF_LIST ---');
for (const staff of STAFF_LIST) {
  const kpi = calculateStaffKpi(staff as any, octReports as any, [], [], undefined, undefined, undefined, [], []);
  if (kpi.reports > 0 || kpi.attendanceCount > 0) {
    console.log(`[${staff.id}] ${staff.name} (${staff.division}): reports=${kpi.reports}, att=${kpi.attendanceCount}`);
  }
}

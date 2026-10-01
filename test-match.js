import { isStaffMatch } from './src/utils/kpiCalculator.ts';

const staffRahmat = { id: 'staff-rahmat', name: 'Muhamad Rahmat' };
console.log('Rahmat matches Irvan?', isStaffMatch(staffRahmat, 'Muhamad Irvan'));

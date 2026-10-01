import { isStaffMatch } from './src/utils/kpiCalculator';
import { STAFF_LIST } from './src/data';

console.log('Match Muhamad Irvan:', STAFF_LIST.find(s => isStaffMatch(s, 'Muhamad Irvan'))?.name);

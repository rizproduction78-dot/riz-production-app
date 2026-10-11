import { STAFF_LIST } from '../src/data';
import { isStaffMatch } from '../src/utils/kpiCalculator';

console.log('=== TEST VARIATION INPUT DENGAN isStaffMatch ===');
const testNames = [
  'Udin Saepudin',
  'udin saepudin',
  'Saepudin',
  'saepudin',
  'Mang Ube',
  'Aep Saepudin',
  'Aep',
  'Subur',
  'unying',
  'unyim',
  'Wahyu',
  'wahyu',
  'Wahyudin'
];

for (const name of testNames) {
  const matches = STAFF_LIST.filter(s => isStaffMatch(s, name));
  console.log(`"${name}" cocok ke: ${matches.map(s => `${s.name} (${s.id})`).join(', ')}`);
}

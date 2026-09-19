import { normalizeStaffMaster } from '../src/data.ts';

const originalStaff = { id: 'staff-absobur', name: 'Abah Sobur', fullName: 'Abah Sobur', nickname: 'Abah Sobur', division: 'Gudang', role: 'Gudang', level: 3 };

const updatedStaffObj = {
  ...originalStaff,
  name: 'Abah Subur',
  fullName: 'Aep Saepudin',
  nickname: 'Abah Subur'
};

const result = normalizeStaffMaster([updatedStaffObj]);
console.log('Result after normalizeStaffMaster:', result.find(s => s.id === 'staff-absobur'));

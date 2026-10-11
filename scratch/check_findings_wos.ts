import { CANONICAL_FIRESTORE_FINDINGS, CANONICAL_FIRESTORE_WORK_ORDERS } from '../src/data/canonicalFirestoreData';
import { INITIAL_DAILY_TASKS, STAFF_LIST } from '../src/data';
import { isStaffMatch } from '../src/utils/kpiCalculator';

const aep = STAFF_LIST.find(s => s.id === 'staff-absobur')!;

console.log('=== CEK FINDINGS, WORK ORDERS, DAILY TASKS OKTOBER UNTUK AEP ===');

const octFindings = CANONICAL_FIRESTORE_FINDINGS.filter(f => f.dateCreated?.startsWith('2026-10') || f.targetDate?.startsWith('2026-10'));
console.log('Oct findings:', octFindings.length);
for (const f of octFindings) {
  console.log('Finding:', f.id, f.pic, 'match Aep:', isStaffMatch(aep, f.pic));
}

const octWOs = CANONICAL_FIRESTORE_WORK_ORDERS.filter(w => w.dateCreated?.startsWith('2026-10') || w.deadline?.startsWith('2026-10'));
console.log('Oct WOs:', octWOs.length);
for (const w of octWOs) {
  console.log('WO:', w.id, w.pic, 'match Aep:', isStaffMatch(aep, w.pic));
}

const octTasks = INITIAL_DAILY_TASKS.filter(t => t.createdAt?.startsWith('2026-10') || t.dueDate?.startsWith('2026-10'));
console.log('Oct tasks:', octTasks.length);
for (const t of octTasks) {
  console.log('Task:', t.id, t.assignedName, t.assignedTo, 'match Aep:', isStaffMatch(aep, t.assignedName) || t.assignedTo === aep.id);
}

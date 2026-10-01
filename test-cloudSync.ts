import fs from 'fs';

const code = fs.readFileSync('src/lib/cloudSync.ts', 'utf-8');
const lines = code.split('\n');

const startIndex = lines.findIndex(l => l.includes('(initialFallback || []).forEach((fb: any) => {'));
console.log('Start index:', startIndex);
for(let i=startIndex-10; i<startIndex+15; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}

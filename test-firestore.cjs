const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: "log-task-book-riz-production",
  databaseURL: "(default)"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const snapshot = await getDocs(collection(db, 'daily_reports'));
  let count = 0;
  snapshot.forEach(doc => {
    if (doc.id.includes('202610')) {
      console.log('Doc:', doc.id, doc.data());
      count++;
    }
  });
  console.log('Total Oct reports:', count);
}
test().catch(console.error);

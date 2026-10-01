const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBe_dummy_key_just_for_local_test",
  authDomain: "riz-production-app.firebaseapp.com",
  projectId: "riz-production-app",
  storageBucket: "riz-production-app.appspot.com",
  messagingSenderId: "59617302484",
  appId: "1:59617302484:web:8c5b3d758f2f4585c2c77d",
  measurementId: "G-H88X7B3H01"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log('Querying daily_reports...');
  const snapshot = await getDocs(collection(db, 'daily_reports'));
  const allDocs = snapshot.docs.map(doc => doc.data());
  const octDocs = allDocs.filter(d => d.date && d.date.startsWith('2026-10'));
  console.log(`Found ${octDocs.length} reports for October`);
  
  const byStaff = {};
  octDocs.forEach(d => {
    byStaff[d.staffName] = (byStaff[d.staffName] || 0) + 1;
  });
  console.log(byStaff);
}
run().catch(console.error);

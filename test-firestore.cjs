const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBP__qbHdsnce8G5pygTTc_cMhPZwWSNHU",
  authDomain: "wh-logbook-2026.firebaseapp.com",
  projectId: "wh-logbook-2026",
  storageBucket: "wh-logbook-2026.firebasestorage.app",
  messagingSenderId: "690146850362",
  appId: "1:690146850362:web:fc61ed71723bad8037e703"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const snapshot = await getDocs(collection(db, 'master_staff'));
  console.log("Documents in master_staff: " + snapshot.docs.length);
  snapshot.docs.forEach(d => {
    if(d.id === 'staff-seno') {
      console.log("Seno: ", d.data());
    }
  });
}
test().catch(console.error);

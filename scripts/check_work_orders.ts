import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

async function check() {
  const colRef = collection(db, 'work_orders');
  const snap = await getDocs(colRef);
  console.log(`Found ${snap.docs.length} work orders in Firestore.`);
  snap.docs.forEach(d => {
    console.log(`ID: ${d.id}, Title: ${d.data().title}, PIC: ${d.data().assignedName}`);
  });
  process.exit(0);
}
check();

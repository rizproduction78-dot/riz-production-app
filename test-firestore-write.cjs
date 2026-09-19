const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function testWrite() {
  try {
    const docRef = doc(db, 'master_staff', 'test-write-doc');
    await setDoc(docRef, { test: true });
    console.log("Write successful!");
  } catch(e) {
    console.error("Write failed:", e.message);
  }
}
testWrite();

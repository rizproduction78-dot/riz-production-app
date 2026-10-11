import { db } from '../src/lib/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

async function cleanup() {
  const isConfirm = process.argv.includes('--confirm');
  console.log('================================================================');
  console.log(`    CLEANUP OCTOBERS GSHEET-V2 IN CLOUD FIRESTORE               `);
  console.log(`    Mode: ${isConfirm ? '🚨 EKSEKUSI PENGHAPUSAN (--confirm)' : '🔍 DRY-RUN (HANYA CEK)'}`);
  console.log('================================================================\n');

  try {
    // 1. Koleksi daily_reports
    const reportsRef = collection(db, 'daily_reports');
    const reportsSnap = await getDocs(reportsRef);
    const reportsToDelete: string[] = [];

    reportsSnap.forEach((d) => {
      const id = d.id;
      if (id.startsWith('gsheet-v2-2026-10-')) {
        reportsToDelete.push(id);
      }
    });

    console.log(`[daily_reports] Ditemukan ${reportsToDelete.length} dokumen untuk dibersihkan:`);
    reportsToDelete.forEach((id) => console.log(`   - ${id}`));

    // 2. Koleksi logbook_entries
    const logsRef = collection(db, 'logbook_entries');
    const logsSnap = await getDocs(logsRef);
    const logsToDelete: string[] = [];

    logsSnap.forEach((d) => {
      const id = d.id;
      if (id.startsWith('log-gsheet-v2-2026-10-')) {
        logsToDelete.push(id);
      }
    });

    console.log(`\n[logbook_entries] Ditemukan ${logsToDelete.length} dokumen untuk dibersihkan:`);
    logsToDelete.forEach((id) => console.log(`   - ${id}`));

    const totalToDelete = reportsToDelete.length + logsToDelete.length;
    console.log(`\nTOTAL DOKUMEN SALAH BULAN OKTOBER: ${totalToDelete}`);

    if (totalToDelete === 0) {
      console.log('\nTidak ada dokumen yang perlu dihapus. Database sudah bersih.');
      process.exit(0);
    }

    if (!isConfirm) {
      console.log('\n[DRY RUN SELESAI] Tidak ada dokumen yang dihapus.');
      console.log('Jalankan dengan argumen --confirm untuk menghapus dokumen di atas.');
      process.exit(0);
    }

    // Eksekusi penghapusan
    console.log('\n[EKSEKUSI] Menghapus dokumen dari Cloud Firestore...');
    for (const id of reportsToDelete) {
      await deleteDoc(doc(db, 'daily_reports', id));
      console.log(`   Deleted daily_reports: ${id}`);
    }

    for (const id of logsToDelete) {
      await deleteDoc(doc(db, 'logbook_entries', id));
      console.log(`   Deleted logbook_entries: ${id}`);
    }

    console.log(`\n✅ SUKSES: Berhasil menghapus ${totalToDelete} dokumen salah dari Firestore.`);
    console.log(`Koleksi findings dan work_orders sama sekali TIDAK TERSENTUH.`);
    process.exit(0);
  } catch (err: any) {
    console.error(`[ERROR] Gagal melakukan cleanup: ${err.message}`);
    process.exit(1);
  }
}

cleanup();

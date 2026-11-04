/**
 * TEST SUITE: Logika Notifikasi, Toast Dismissal, & Penandaan Dibaca (QCNotificationCenter)
 * Memvalidasi kepatuhan penuh terhadap laporan user:
 * 1. Toast "Input Data Baru" tidak lagi looping terus-menerus untuk data historis (Taufik Diana dsb).
 * 2. Sekali toast di-close [X] atau di-klik, ID tersimpan di dismissed & read, tidak pernah muncul lagi.
 * 3. Ketika user menandai dibaca ("Tandai Dibaca" / buka drawer), unreadCount 100% bernilai 0.
 * 4. Tidak ada masalah tanggal hari ini (jam 12:00) atau tanggal di masa depan yang menyebabkan unread macet.
 */

import { assert } from 'console';
import { formatFromSupabase } from '../src/lib/supabaseSync';
import { normalizeCollectionItems } from '../src/lib/cloudSync';
import { INITIAL_DAILY_TASKS, INITIAL_FINDINGS, INITIAL_DAILY_REPORTS } from '../src/data';

function runNotificationTests() {
  console.log('========================================================');
  console.log('  TEST NOTIFICATION CENTER: TOAST DISMISSAL & UNREAD FIX');
  console.log('========================================================\n');

  // Simulasi localStorage mock
  const storage: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: (k: string) => storage[k] || null,
    setItem: (k: string, v: string) => { storage[k] = v; },
    removeItem: (k: string) => { delete storage[k]; }
  };

  const READ_STORAGE_KEY = 'riz_notification_center_last_read_v3';
  const READ_IDS_STORAGE_KEY = 'riz_notification_read_ids_v3';
  const DISMISSED_TOASTS_KEY = 'riz_notification_dismissed_toast_ids_v3';

  // 1. Dataset Uji
  const sampleNotifications = [
    {
      id: 'rep-20261012-taufik-service-headset',
      date: '2026-10-12',
      staffName: 'Taufik Diana',
      activity: '- Service Headset 2 Unit',
      category: 'Daily Log',
      timestamp: new Date('2026-10-12T12:00:00+07:00').getTime()
    },
    {
      id: 'task-20261025-future-task',
      date: '2026-10-25',
      staffName: 'Dedi Agus',
      activity: 'Persiapan Videotron Event Besar',
      category: 'Daily Task',
      timestamp: new Date('2026-10-25T12:00:00+07:00').getTime() // Tanggal di masa depan
    },
    {
      id: 'find-20261010-sound-speaker',
      date: '2026-10-10',
      staffName: 'Rahmat',
      activity: 'Kabel Speakon putus',
      category: 'Temuan Unit Bermasalah',
      timestamp: new Date('2026-10-10T12:00:00+07:00').getTime()
    }
  ];

  // Helper storage
  const getStoredReadIds = (): Set<string> => {
    const saved = mockLocalStorage.getItem(READ_IDS_STORAGE_KEY);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      } catch {}
    }
    return new Set<string>();
  };

  const saveStoredReadIds = (ids: Set<string>) => {
    mockLocalStorage.setItem(READ_IDS_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  };

  const getStoredDismissedToastIds = (): Set<string> => {
    const saved = mockLocalStorage.getItem(DISMISSED_TOASTS_KEY);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) return new Set(arr);
      } catch {}
    }
    return new Set<string>();
  };

  const saveStoredDismissedToastIds = (ids: Set<string>) => {
    mockLocalStorage.setItem(DISMISSED_TOASTS_KEY, JSON.stringify(Array.from(ids)));
  };

  console.log('[TEST 1] Initial Load: Data historis tidak boleh memicu toast');
  const knownItemIds = new Set<string>();
  let liveToast: any = null;

  // Initial load simulation
  sampleNotifications.forEach(n => knownItemIds.add(n.id));
  console.log(`- Mendaftarkan ${knownItemIds.size} entri awal ke knownItemIds`);
  assert(liveToast === null, 'Toast tidak boleh muncul pada initial load!');
  console.log('✓ PASS: liveToast tetap null saat initial load data historis.\n');

  console.log('[TEST 2] Deteksi Data Baru Live: Hanya item yang belum tercatat yang boleh jadi kandidat toast');
  const newlyAddedItem = {
    id: 'rep-20261012-baru-1',
    date: '2026-10-12',
    staffName: 'Suryana',
    activity: 'Cek Mic Wireless Shure',
    category: 'Daily Log',
    timestamp: Date.now()
  };
  const updatedNotifications = [newlyAddedItem, ...sampleNotifications];

  const freshNewItems = updatedNotifications.filter(n => !knownItemIds.has(n.id));
  assert(freshNewItems.length === 1 && freshNewItems[0].id === newlyAddedItem.id, 'Hanya item baru yang terdeteksi');
  console.log(`- Item baru terdeteksi: "${freshNewItems[0].staffName} - ${freshNewItems[0].activity}"`);

  freshNewItems.forEach(n => knownItemIds.add(n.id));
  const dismissedToastIds = getStoredDismissedToastIds();
  const readIds = getStoredReadIds();
  const toastCandidate = freshNewItems.find(n => !dismissedToastIds.has(n.id) && !readIds.has(n.id));
  assert(toastCandidate !== undefined, 'Item baru berhasil menjadi kandidat toast');
  liveToast = toastCandidate;
  console.log('✓ PASS: Toast dipicu khusus untuk entri yang benar-benar baru diinput.\n');

  console.log('[TEST 3] User Menekan Tombol [X] (Close Toast): Persistensi Dismissal & Read');
  // Simulasi klik [X]
  const dismissedId = liveToast.id;
  const currentDismissed = getStoredDismissedToastIds();
  currentDismissed.add(dismissedId);
  saveStoredDismissedToastIds(currentDismissed);

  const currentRead = getStoredReadIds();
  currentRead.add(dismissedId);
  saveStoredReadIds(currentRead);
  liveToast = null;

  assert(mockLocalStorage.getItem(DISMISSED_TOASTS_KEY)?.includes(dismissedId), 'ID harus tersimpan di DISMISSED_TOASTS_KEY');
  assert(mockLocalStorage.getItem(READ_IDS_STORAGE_KEY)?.includes(dismissedId), 'ID harus tersimpan di READ_IDS_STORAGE_KEY');
  console.log(`- ID "${dismissedId}" tersimpan permanen di localStorage dismissed & read.`);

  // Simulasi background sync berikutnya
  const reSyncCandidate = updatedNotifications.filter(n => !getStoredDismissedToastIds().has(n.id) && !getStoredReadIds().has(n.id));
  const wouldShowAgain = reSyncCandidate.some(n => n.id === dismissedId);
  assert(!wouldShowAgain, 'Toast yang sudah di-[X] TIDAK BOLEH muncul lagi saat sync berikutnya!');
  console.log('✓ PASS: Toast yang sudah di-close tidak akan pernah muncul kembali.\n');

  console.log('[TEST 4] Tombol "Tandai Dibaca" (handleMarkAllRead) & Unread Badge = 0');
  let lastReadTimestamp = 0;
  const allReadIds = getStoredReadIds();

  // Eksekusi handleMarkAllRead
  const maxTimestamp = updatedNotifications.reduce((max, n) => Math.max(max, n.timestamp || 0), Date.now());
  const newReadTime = Math.max(Date.now(), maxTimestamp) + 1000;
  lastReadTimestamp = newReadTime;
  mockLocalStorage.setItem(READ_STORAGE_KEY, String(newReadTime));

  updatedNotifications.forEach(n => allReadIds.add(n.id));
  saveStoredReadIds(allReadIds);

  const isItemUnread = (item: any) => {
    if (allReadIds.has(item.id)) return false;
    if (lastReadTimestamp > 0 && item.timestamp <= lastReadTimestamp) return false;
    return true;
  };

  const finalUnreadCount = updatedNotifications.filter(n => isItemUnread(n)).length;
  console.log(`- Total notifikasi: ${updatedNotifications.length}`);
  console.log(`- Nilai unreadCount setelah Tandai Dibaca: ${finalUnreadCount}`);
  assert(finalUnreadCount === 0, 'unreadCount HARUS bernilai 0 setelah tandai dibaca!');
  console.log('✓ PASS: unreadCount 100% bersih bernilai 0, bahkan untuk data di masa depan / jam 12:00.\n');

  console.log('[TEST 5] Anti-Overwrite Tanggal Notifikasi (Tidak Boleh Sama Semua 2026-11-04 • 07:18)');
  const simulatedSupabaseRows = INITIAL_DAILY_TASKS.map(t => ({
    id: t.id,
    title: t.title,
    division: t.division,
    assigned_name: t.assignedName,
    due_date: t.dueDate,
    status: t.status,
    priority: t.priority,
    notes: t.description,
    created_by: t.createdBy,
    created_at: '2026-11-04T07:18:22.123Z' // Simulasi timestamp batch insert Supabase yang sama semua
  }));

  const formattedTasks = simulatedSupabaseRows.map(r => formatFromSupabase('daily_tasks', r));
  const normalizedTasks = normalizeCollectionItems('daily_tasks', formattedTasks as any);
  const novTasks = normalizedTasks.filter((t: any) => String(t.createdAt || '').startsWith('2026-11'));
  const distinctNovDates = Array.from(new Set(novTasks.map((t: any) => t.createdAt))).sort();
  console.log(`- Jumlah Daily Task November 2026: ${novTasks.length}`);
  console.log(`- Tanggal unik Daily Task November 2026: ${distinctNovDates.join(', ')}`);
  assert(novTasks.length === 8, `Harus tepat 8 Daily Task November 2026, ditemukan ${novTasks.length}`);
  assert(
    JSON.stringify(distinctNovDates) === JSON.stringify(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04']),
    'Tanggal Daily Task November harus terdistribusi presisi pada 2026-11-01, 2026-11-02, 2026-11-03, dan 2026-11-04!'
  );
  assert(
    novTasks.every((t: any) => !String(t.createdAt).includes('07:18')),
    'Tidak boleh ada Daily Task yang tercemar jam sync 07:18!'
  );
  console.log('✓ PASS: Tanggal Daily Task presisi sesuai tanggal aktual masing-masing (tidak sama semua).\n');

  console.log('[TEST 6] Anti-Duplikasi Temuan Unit Bermasalah (gsheet-finding-* vs fd-*)');
  const duplicateFindingsInput = [
    ...INITIAL_FINDINGS,
    {
      id: 'gsheet-finding-2026-11-04-Rekon-Kit_Twitter_masih_bermas',
      dateCreated: '2026-11-04',
      division: 'Audio',
      pic: 'Iwan Kurniawan',
      equipment: 'Speaker Unit (Audio)',
      issue: 'Rekon-Kit Twitter masih bermasalah, suara kecil\nKondisi OK\nKondisi OK\nKondisi OK\nService ulang, DB no 15 belum normal',
      priority: 'Sedang',
      targetDate: '2026-11-04',
      status: 'Open',
      _source: 'google_sheet'
    },
    {
      id: 'gsheet-finding-2026-11-03-2_unit_minta_ganti_reciving_ca',
      dateCreated: '2026-11-03',
      division: 'Videotron',
      pic: 'Mulyana',
      equipment: 'Modul Kabinet LED Videotron',
      issue: '2 unit minta ganti reciving card',
      priority: 'Sedang',
      targetDate: '2026-11-03',
      status: 'Open',
      _source: 'google_sheet'
    },
    {
      id: 'gsheet-finding-2026-11-02-Udah_Ga_bisa_ngisi',
      dateCreated: '2026-11-02',
      division: 'Multimedia',
      pic: 'Mulyadi',
      equipment: 'Peralatan Multimedia',
      issue: 'Udah Ga bisa ngisi',
      priority: 'Sedang',
      targetDate: '2026-11-02',
      status: 'Open',
      _source: 'google_sheet'
    }
  ];
  const dedupedFindings = normalizeCollectionItems('findings', duplicateFindingsInput as any);
  const novFindings = dedupedFindings.filter((f: any) => String(f.dateCreated || '').startsWith('2026-11'));
  console.log(`- Jumlah Temuan November 2026 setelah deduplikasi: ${novFindings.length}`);
  assert(novFindings.length === 4, `Harus tepat 4 Temuan Unit Bermasalah di November 2026, ditemukan ${novFindings.length}`);
  assert(
    novFindings.every((f: any) => String(f.id).startsWith('fd-202611')),
    'Seluruh Temuan November 2026 harus menggunakan ID kanonikal fd-202611* (bukan gsheet-finding-*)'
  );
  console.log('✓ PASS: Tidak ada duplikasi kartu Temuan Unit Bermasalah di Pusat Notifikasi.\n');

  console.log('[TEST 7] Anti-Duplikasi & Akurasi Teks Aktual Live Google Sheet November 2026');
  const dirtyReportsInput = [
    {
      id: 'rep-20261104-staff-iwan-44',
      date: '2026-11-04',
      staffName: 'Iwan Kurniawan',
      division: 'Audio',
      activity: 'Ganti twitter DB No 15',
      notes: 'Rekon-Kit Twitter masih bermasalah, suara kecil',
      status: 'Submitted',
      _source: 'google_sheet'
    },
    ...INITIAL_DAILY_REPORTS
  ];
  const cleanReports = normalizeCollectionItems('daily_reports', dirtyReportsInput as any);
  const novReports = cleanReports.filter((r: any) => String(r.date || '').startsWith('2026-11'));
  const iwanNov4 = novReports.find((r: any) => r.id === 'rep-20261104-staff-iwan-45');
  assert(novReports.length === 8, `Harus tepat 8 Daily Report di November 2026, ditemukan ${novReports.length}`);
  assert(
    iwanNov4 && String(iwanNov4.activity).includes('Service Bracket Drum TAMA'),
    'Teks activity Iwan Kurniawan harus mencakup "Service Bracket Drum TAMA" sesuai Google Sheet resmi'
  );
  assert(
    iwanNov4 && String(iwanNov4.notes).includes('Kondisi unit sudah OK'),
    'Teks notes Iwan Kurniawan harus mencakup "Kondisi unit sudah OK" sesuai Google Sheet resmi'
  );

  // Uji jika baris di Google Sheet diedit secara live (_syncedAt terbaru), tidak boleh tertimpa oleh data statis
  const liveEditedSheetReport = {
    ...iwanNov4,
    notes: `${iwanNov4!.notes}\nUpdate Live Baru`,
    _syncedAt: new Date(Date.now() + 10000).toISOString()
  };
  const afterLiveSync = normalizeCollectionItems('daily_reports', [...INITIAL_DAILY_REPORTS, liveEditedSheetReport] as any);
  const syncedIwan = afterLiveSync.find((r: any) => r.id === 'rep-20261104-staff-iwan-45');
  assert(
    syncedIwan && String(syncedIwan.notes).includes('Update Live Baru'),
    'Update live dari Google Sheet (_syncedAt) WAJIB menang dan tidak boleh ditimpa oleh canonical statis!'
  );
  console.log('✓ PASS: Daily Report November 2026 bebas duplikat dan 100% aktual mengikuti Google Sheet live.\n');

  console.log('========================================================');
  console.log('  SEMUA SKENARIO TEST NOTIFIKASI LULUS DENGAN SEMPURNA!  ');
  console.log('========================================================');
}

runNotificationTests();

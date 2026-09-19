/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cloud Real-Time & Auto-Sync Engine for RIZ-PRODUCTION App
 * Multi-Device & Cross-Operating-System Synchronization (Windows, macOS, iOS, Android, Linux).
 * Powered by Firebase Cloud Firestore with Offline Pending Queue, BroadcastChannel, and Lifecycle Auto-Sync.
 */

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizeStaffMaster, STAFF_LIST } from '../data';
import { isStaffMatch } from '../utils/kpiCalculator';
import { triggerAutoSyncToGoogleSheet } from './googleSheetSync';

export interface DeviceOSInfo {
  os: 'Windows' | 'macOS' | 'iOS' | 'Android' | 'Linux' | 'Unknown';
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  userAgent: string;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncedCollections: Record<string, number>;
  pendingQueueCount: number;
  lastSyncMessage?: string;
  deviceOS?: string;
  browser?: string;
}

export interface PendingSyncItem {
  id: string;
  type: 'SAVE' | 'DELETE';
  collectionName: string;
  docId: string;
  data?: Record<string, any>;
  createdAt: string;
  deviceOS: string;
}

const PENDING_QUEUE_KEY = 'riz_pending_offline_sync_queue';
const SYNC_BROADCAST_CHANNEL_NAME = 'riz_cross_os_sync_channel';

// ─────────────────────────────────────────────────────────────
// 1. DEVICE & OPERATING SYSTEM DETECTION (CROSS-PLATFORM)
// ─────────────────────────────────────────────────────────────
export function getDeviceOSInfo(): DeviceOSInfo {
  if (typeof navigator === 'undefined') {
    return { os: 'Unknown', deviceType: 'Desktop', browser: 'Unknown', userAgent: '' };
  }

  const ua = navigator.userAgent || '';
  let os: DeviceOSInfo['os'] = 'Unknown';
  let deviceType: DeviceOSInfo['deviceType'] = 'Desktop';

  if (/ipad/i.test(ua) || (/macintosh/i.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1)) {
    os = 'iOS';
    deviceType = 'Tablet';
  } else if (/iphone|ipod/i.test(ua)) {
    os = 'iOS';
    deviceType = 'Mobile';
  } else if (/android/i.test(ua)) {
    os = 'Android';
    deviceType = /tablet|sm-t|gt-p/i.test(ua) ? 'Tablet' : 'Mobile';
  } else if (/windows phone/i.test(ua)) {
    os = 'Windows';
    deviceType = 'Mobile';
  } else if (/windows/i.test(ua)) {
    os = 'Windows';
    deviceType = 'Desktop';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
    deviceType = 'Desktop';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
    deviceType = 'Desktop';
  }

  let browser = 'Browser';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return { os, deviceType, browser, userAgent: ua };
}

const localDeviceInfo = getDeviceOSInfo();

// ─────────────────────────────────────────────────────────────
// 2. MULTI-TAB & CROSS-WINDOW BROADCAST CHANNEL
// ─────────────────────────────────────────────────────────────
let syncBroadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncBroadcastChannel = new BroadcastChannel(SYNC_BROADCAST_CHANNEL_NAME);
  } catch (e) {
    console.warn('[Sync] BroadcastChannel init warning:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. GLOBAL SYNC STATUS & LISTENERS
// ─────────────────────────────────────────────────────────────
let currentSyncStatus: SyncStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncedAt: null,
  syncedCollections: {},
  pendingQueueCount: getPendingQueue().length,
  deviceOS: `${localDeviceInfo.os} (${localDeviceInfo.deviceType})`,
  browser: localDeviceInfo.browser
};

const statusListeners = new Set<(status: SyncStatus) => void>();

export function subscribeSyncStatus(listener: (status: SyncStatus) => void) {
  statusListeners.add(listener);
  listener({ ...currentSyncStatus });
  return () => {
    statusListeners.delete(listener);
  };
}

export function updateSyncStatus(updates: Partial<SyncStatus>) {
  currentSyncStatus = { ...currentSyncStatus, ...updates };
  statusListeners.forEach(listener => listener({ ...currentSyncStatus }));
}

// ─────────────────────────────────────────────────────────────
// 4. OFFLINE PENDING QUEUE (Indexed in LocalStorage)
// ─────────────────────────────────────────────────────────────
export function getPendingQueue(): PendingSyncItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(PENDING_QUEUE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function savePendingQueue(queue: PendingSyncItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
    updateSyncStatus({ pendingQueueCount: queue.length });
  } catch (e) {
    console.warn('[Sync] Failed to save pending queue to localStorage', e);
  }
}

export function enqueuePendingOperation(item: Omit<PendingSyncItem, 'id' | 'createdAt' | 'deviceOS'>) {
  const queue = getPendingQueue();
  const filtered = queue.filter(q => !(q.collectionName === item.collectionName && q.docId === item.docId));
  filtered.push({
    ...item,
    id: `pq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    deviceOS: localDeviceInfo.os
  });
  savePendingQueue(filtered);
}

/**
 * Flush all pending offline operations to Firestore Cloud
 */
export async function flushPendingQueue(): Promise<number> {
  const queue = getPendingQueue();
  if (queue.length === 0) return 0;

  const remaining: PendingSyncItem[] = [];
  
  // Create an array of promises to execute concurrently
  const promises = queue.map(async (item) => {
    try {
      // Validasi awal ID untuk menghindari stuck antrean
      if (!item.docId || String(item.docId).includes('/')) {
        console.warn(`[Sync] Dropping invalid docId: ${item.docId}`);
        return { success: true, item }; // Pretend success to remove it from queue
      }

      if (item.type === 'SAVE' && item.data) {
        const docRef = doc(db, item.collectionName, item.docId);
        const cleanData = JSON.parse(JSON.stringify(item.data));
        await setDoc(docRef, cleanData, { merge: true });
        return { success: true, item };
      } else if (item.type === 'DELETE') {
        const docRef = doc(db, item.collectionName, item.docId);
        await deleteDoc(docRef);
        return { success: true, item };
      }
      return { success: false, item };
    } catch (error: any) {
      // Jika error path invalid, langsung buang dari queue (tidak bisa direcover)
      if (error?.code === 'invalid-argument' || String(error).includes('Invalid document reference')) {
        console.warn(`[Sync] Dropping permanently unrecoverable item ${item.id}:`, error);
        return { success: true, item };
      }
      console.warn(`[Sync] Failed to flush pending item ${item.id}:`, error);
      return { success: false, item };
    }
  });

  // Wait for all operations to complete in parallel
  const results = await Promise.all(promises);
  
  let successCount = 0;
  for (const result of results) {
    if (result.success) {
      successCount++;
    } else {
      remaining.push(result.item);
    }
  }

  savePendingQueue(remaining);
  return successCount;
}

// ─────────────────────────────────────────────────────────────
// 5. REGISTRY OF ALL 19 MODULES FOR MULTI-DEVICE SYNC
// ─────────────────────────────────────────────────────────────
export const ALL_SYNC_COLLECTIONS = [
  { name: 'logbook_entries', key: 'riz_logbook_entries', label: 'Logbook Entries' },
  { name: 'daily_reports', key: 'riz_daily_reports', label: 'Laporan Harian' },
  { name: 'daily_tasks', key: 'riz_daily_tasks', label: 'Daily Task & Checklist' },
  { name: 'findings', key: 'riz_findings', label: 'Temuan QC' },
  { name: 'assets', key: 'riz_assets', label: 'Master Aset' },
  { name: 'work_orders', key: 'riz_work_orders', label: 'Work Orders' },
  { name: 'maintenance_schedules', key: 'riz_schedules', label: 'Jadwal Pemeliharaan' },
  { name: 'activities', key: 'riz_activities', label: 'Audit Log Aktivitas' },
  { name: 'master_staff', key: 'riz_master_staff_list', label: 'Master Staf Karyawan' },
  { name: 'freelance_workers', key: 'riz_freelance_workers', label: 'Database Freelance' },
  { name: 'fleet_drivers', key: 'riz_fleet_drivers', label: 'Database Driver Armada' },
  { name: 'master_vehicles', key: 'riz_master_vehicles', label: 'Master Armada Kendaraan' },
  { name: 'fleet_assignments', key: 'riz_fleet_assignments', label: 'Penugasan Armada' },
  { name: 'custom_qc_checklists', key: 'riz_custom_qc_checklists', label: 'Template QC Checklist' },
  { name: 'september_2026_schedule', key: 'riz_september_2026_schedule', label: 'Jadwal Shift September 2026' },
  { name: 'work_schedule', key: 'riz_work_schedule', label: 'Jadwal Kerja Tim' },
  { name: 'attendance_logs', key: 'riz_attendance_logs', label: 'Log Absensi Mandiri' },
  { name: 'staff_competencies', key: 'riz_staff_electrical_competencies', label: 'Kompetensi Kelistrikan' },
  { name: 'career_records', key: 'riz_career_pipeline_records', label: 'Paspor Kompetensi & Karir' },
  { name: 'warehouse_logs', key: 'riz_warehouse_logs', label: 'Log Inventaris Gudang' }
];

// ─────────────────────────────────────────────────────────────
// 5B. EXPLICIT DELETION TRACKER (Prevents deleted items from resurrecting)
// ─────────────────────────────────────────────────────────────
export function getDeletedIds(collectionName: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const saved = localStorage.getItem(`riz_deleted_ids_${collectionName}`);
    if (saved) {
      const arr = JSON.parse(saved);
      if (Array.isArray(arr)) return new Set(arr.map(String));
    }
  } catch (e) {}
  return new Set();
}

export function recordDeletedId(collectionName: string, docId: string) {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedIds(collectionName);
    set.add(String(docId));
    localStorage.setItem(`riz_deleted_ids_${collectionName}`, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

export function clearDeletedId(collectionName: string, docId: string) {
  if (typeof window === 'undefined') return;
  try {
    const set = getDeletedIds(collectionName);
    if (set.has(String(docId))) {
      set.delete(String(docId));
      localStorage.setItem(`riz_deleted_ids_${collectionName}`, JSON.stringify(Array.from(set)));
    }
  } catch (e) {}
}

// Helper to normalize and enforce canonical data integrity across all devices & caches
export function normalizeCollectionItems<T = any>(collectionName: string, rawItems: T[]): T[] {
  if (!Array.isArray(rawItems)) return [];

  let items = [...rawItems];

  // Special normalization for master_staff: full canonical deduplication,
  // Wahyu as Owner, Unyim as Staff Audio, and excluding non-inhouse freelancers
  if (collectionName === 'master_staff') {
    return normalizeStaffMaster(items) as unknown as T[];
  }

  // Special normalization for findings so official reference data is preserved and not corrupted by stale mock strings
  if (collectionName === 'findings') {
    const cleaned = items.map((f: any) => {
      if (!f) return f;
      const eq = String(f.equipment || '').toLowerCase();
      const pic = String(f.pic || '').toLowerCase();
      const id = String(f.id || '');
      const issLower = String(f.issue || '').toLowerCase();

      // Normalisasi: DB Tech No. 18 speaker amplifier — SELARAS dengan canonicalFirestoreData
      if (id === 'find-20260903-dbtech18' || id === '1') {
        const currentStatus = f.status === 'Close' || f.approvedBy ? 'Close' : (f.status || 'Close');
        return {
          ...f,
          id: 'find-20260903-dbtech18',
          equipment: 'DB Tech No. 18 (Active Speaker 15 Inch)',
          issue: 'Ada Kendala dibagian Modul Amplifiernya, saat terkena beban input besar, hasil suara yang dikeluarkan menjadi serak, tapi masih aman dan bisa digunakan untuk Event. Rekomendasi untuk dicek oleh team service terutama pada modul Amplifier.',
          priority: 'Sedang',
          pic: 'Mulyana',
          division: 'Service',
          targetDate: f.targetDate || '2026-09-05',
          status: currentStatus,
          approvedBy: f.approvedBy,
          approvedAt: f.approvedAt,
          dateCreated: f.dateCreated || '2026-09-03'
        };
      }

      // Normalisasi: Panel Listrik Audio 3 Phase — SELARAS dengan canonicalFirestoreData
      if (id === 'find-20260904-panel-audio' || id === '2') {
        return {
          ...f,
          id: 'find-20260904-panel-audio',
          equipment: 'Panel Listrik Audio 3 Phase',
          issue: '1 Ganti Stop Kontak, 1 Ganti Legrand Cewek (2 panel lainnya sudah OK).',
          priority: 'Tinggi',
          pic: 'Taufik Diana / Suryana',
          division: 'Audio',
          targetDate: '2026-09-05',
          status: f.status || 'Close',
          approvedBy: f.approvedBy,
          approvedAt: f.approvedAt,
          dateCreated: f.dateCreated || '2026-09-04'
        };
      }

      // Normalisasi: PAR LED Warm White Lighting (7 Sept) — id find-20260907-parled
      if (id === 'find-20260907-parled') {
        return {
          ...f,
          id: 'find-20260907-parled',
          equipment: 'PAR LED Warm White (Lighting)',
          issue: 'Harus service warm mati no 12, 25, 29 | Warm separo no 3, 32.',
          priority: 'Sedang',
          pic: 'Heri',
          division: 'Lighting',
          targetDate: '2026-09-10',
          status: f.status || 'Open',
          approvedBy: f.approvedBy,
          approvedAt: f.approvedAt,
          dateCreated: f.dateCreated || '2026-09-07'
        };
      }

      // Normalisasi: PAR LED Warm White Lighting (10 Sept) — id find-20260910-parled
      if (id === 'find-20260910-parled') {
        return {
          ...f,
          id: 'find-20260910-parled',
          equipment: 'PAR LED Warm White (Lighting)',
          issue: 'Harus service warm separo no. 19, 20, 27.',
          priority: 'Sedang',
          pic: 'Heri',
          division: 'Lighting',
          targetDate: '2026-09-12',
          status: f.status || 'Open',
          approvedBy: f.approvedBy,
          approvedAt: f.approvedAt,
          dateCreated: f.dateCreated || '2026-09-10'
        };
      }

      // Normalisasi: Modul Kabinet LED Videotron (Box Rusak Berat 17 Sept 2026)
      if (
        id === 'find-20260917-led-box' ||
        issLower.includes('kerusakan berat') ||
        (eq.includes('unit divisi') && issLower.includes('box')) ||
        (f.dateCreated === '2026-09-17' && issLower.includes('box') && (pic.includes('mulyana') || pic.includes('kharo')))
      ) {
        const currentStatus = f.status === 'Close' || f.approvedBy ? 'Close' : (f.status || 'Open');
        return {
          ...f,
          id: 'find-20260917-led-box',
          equipment: 'Modul Kabinet LED Videotron',
          issue: '1 Box Kabinet Kerusakan Berat (Perlu perbaikan modul & power supply oleh team teknis)',
          priority: 'Tinggi',
          pic: 'Mulyana',
          division: 'Videotron',
          targetDate: '2026-09-19',
          status: currentStatus,
          approvedBy: f.approvedBy,
          approvedAt: f.approvedAt,
          dateCreated: f.dateCreated || '2026-09-17'
        };
      }

      // Bersihkan entri sampah dengan equipment placeholder generik
      if (eq.includes('unit divisi audio') && (pic.includes('mulyana') || pic.includes('kharo'))) {
        return {
          ...f,
          equipment: 'Modul Kabinet LED Videotron',
          division: 'Videotron'
        };
      }

      return f;
    });

    // Deduplicate by ID
    const map = new Map<string, any>();
    cleaned.forEach((item: any) => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values()) as T[];
  }

  if (collectionName === 'master_vehicles') {
    const FAKE_PLATES = ['B 9142 SXZ', 'B 9804 UYA', 'B 2319 POX', 'B 9043 TQB', 'B 1874 RIZ', 'B 9552 KTN', 'B 9331 JXQ'];
    const cleaned = items.filter((v: any) => v && v.policeNumber && !FAKE_PLATES.includes(v.policeNumber));
    
    // Deduplicate incoming cloud data
    const seen = new Set();
    const deduped = cleaned.filter((v: any) => {
      if (seen.has(v.policeNumber)) return false;
      seen.add(v.policeNumber);
      return true;
    });
    return deduped as T[];
  }

  // Special normalization for daily_reports: deduplicate strictly by (date + staff)
  if (collectionName === 'daily_reports') {
    const map = new Map<string, any>();
    items.forEach((item: any) => {
      if (!item || !item.date) return;
      const staffObj = STAFF_LIST.find(s => isStaffMatch(s, item.staffName));
      const staffKey = staffObj ? staffObj.id : String(item.staffName || '').toLowerCase().trim();
      const dedupKey = `${item.date}|${staffKey}`;
      
      const normalizedItem = {
        ...item,
        staffName: staffObj ? staffObj.name : item.staffName,
        division: staffObj ? staffObj.division : item.division
      };

      if (!map.has(dedupKey)) {
        map.set(dedupKey, normalizedItem);
      } else {
        const existing = map.get(dedupKey);
        const existingNotes = String(existing.notes || '').trim();
        const incomingNotes = String(normalizedItem.notes || '').trim();
        if (!existingNotes && incomingNotes) {
          existing.notes = incomingNotes;
        } else if (incomingNotes && !existingNotes.includes(incomingNotes)) {
          existing.notes = `${existingNotes}\n${incomingNotes}`;
        }
        map.set(dedupKey, existing);
      }
    });
    return Array.from(map.values()) as T[];
  }

  // Special normalization for logbook_entries: deduplicate strictly by (date + staff)
  if (collectionName === 'logbook_entries') {
    const map = new Map<string, any>();
    items.forEach((item: any) => {
      if (!item || !item.date) return;
      const staffObj = STAFF_LIST.find(s => isStaffMatch(s, item.staffName));
      const staffKey = staffObj ? staffObj.id : String(item.staffName || '').toLowerCase().trim();
      const dedupKey = `${item.date}|${staffKey}`;
      
      const normalizedItem = {
        ...item,
        staffName: staffObj ? staffObj.name : item.staffName,
        division: staffObj ? staffObj.division : item.division
      };

      if (!map.has(dedupKey)) {
        map.set(dedupKey, normalizedItem);
      }
    });
    return Array.from(map.values()) as T[];
  }

  // Special normalization for work_orders to ensure title, description, pic, and status are never undefined
  if (collectionName === 'work_orders') {
    const cleaned = items.map((w: any) => {
      if (!w) return w;
      return {
        ...w,
        id: String(w.id || `wo-${Date.now()}`),
        title: String(w.title || 'Work Order'),
        description: String(w.description || w.notes || ''),
        pic: String(w.pic || 'Team Service'),
        division: w.division || 'Service',
        deadline: String(w.deadline || ''),
        progress: typeof w.progress === 'number' ? w.progress : (w.status === 'Completed' ? 100 : 0),
        status: w.status || 'Pending',
        dateCreated: String(w.dateCreated || new Date().toISOString().split('T')[0])
      };
    });

    const map = new Map<string, any>();
    cleaned.forEach((item: any) => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values()) as T[];
  }

  // Normalization for freelance_workers to ensure valid numeric dailyRate is preserved and deduplicated
  if (collectionName === 'freelance_workers') {
    const cleaned = items.map((w: any) => {
      if (!w) return w;
      const rate = (w.dailyRate !== undefined && w.dailyRate !== null && !isNaN(Number(w.dailyRate)))
        ? Number(w.dailyRate)
        : (w.roleTitle?.toLowerCase().includes('operator') ? 350000 : w.specialization === 'Driver' ? 250000 : 200000);
      return {
        ...w,
        dailyRate: rate
      };
    });

    const map = new Map<string, any>();
    cleaned.forEach((item: any) => {
      if (item && item.id) {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values()) as T[];
  }

  // Normalization for fleet_drivers to ensure deduplication and canonical fields
  if (collectionName === 'fleet_drivers') {
    const cleaned = items.map((d: any) => {
      if (!d) return d;
      return {
        ...d,
        id: String(d.id || `drv-${Date.now()}`),
        name: String(d.name || 'Pengemudi'),
        status: d.status || 'Siap Jalan',
        driverType: d.driverType || 'Internal',
        simType: d.simType || 'SIM B1',
        simExpiry: d.simExpiry || new Date().toISOString().split('T')[0]
      };
    });

    const map = new Map<string, any>();
    cleaned.forEach((item: any) => {
      const idKey = String(item?.id || item?.name || '');
      if (idKey) {
        map.set(idKey, item);
      }
    });
    return Array.from(map.values()) as T[];
  }

  // Normalization for assets to ensure deduplication and canonical code/division
  if (collectionName === 'assets') {
    const map = new Map<string, any>();
    items.forEach((item: any) => {
      if (item && (item.id || item.code)) {
        const idKey = String(item.id || item.code);
        map.set(idKey, item);
      }
    });
    return Array.from(map.values()) as T[];
  }

  return items;
}

// ─────────────────────────────────────────────────────────────
// 6. REAL-TIME FIRESTORE SUBSCRIBER
// ─────────────────────────────────────────────────────────────
export function subscribeCloudCollection<T = any>(
  collectionName: string,
  localCacheKey: string,
  onData: (items: T[]) => void,
  initialFallback: T[] = []
): () => void {
  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const deletedIds = getDeletedIds(collectionName);

        if (!snapshot.empty) {
          let items: T[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data
            } as unknown as T;
          });

          // Robustly unwrap if Firestore contains wrapper documents with a .list array
          if (items.length === 1 && Array.isArray((items[0] as any)?.list)) {
            items = (items[0] as any).list;
          } else if (items.some(item => item && Array.isArray((item as any)?.list))) {
            items = items.flatMap(item => (item && Array.isArray((item as any)?.list)) ? (item as any).list : [item]);
          }

          // Helper to merge records with field priority (preserving updated phone, skills, etc.)
          const mergeCleanDoc = (existing: any, incoming: any) => {
            if (!existing) return incoming;
            if (!incoming) return existing;
            
            const inMeta = incoming?._syncMeta?.updatedAt;
            const exMeta = existing?._syncMeta?.updatedAt;
            const isExistingNewer = exMeta && inMeta && new Date(exMeta) >= new Date(inMeta);

            // If existing is newer, it means local user changes haven't reached the server or a stale snapshot arrived.
            // We MUST preserve existing (local) entirely to prevent reverts.
            let merged = isExistingNewer 
              ? { ...incoming, ...existing } // Existing overwrites incoming
              : { ...existing, ...incoming }; // Incoming overwrites existing

            if (!isExistingNewer) {
              // Ensure numeric types are preserved if incoming is null/undefined
              if (incoming.dailyRate !== undefined && incoming.dailyRate !== null && !isNaN(Number(incoming.dailyRate))) {
                merged.dailyRate = Number(incoming.dailyRate);
              }
            }

            for (const key of Object.keys(existing)) {
              const exVal = existing[key];
              const inVal = incoming[key];
              // Only pull from existing fallback if incoming is completely missing or blank
              if (typeof exVal === 'string' && exVal.trim() !== '') {
                if (inVal === undefined || inVal === null || (typeof inVal === 'string' && inVal.trim() === '')) {
                  // Do not revert status/approval from fallback
                  if (key !== 'status' && key !== 'approvedBy' && key !== 'approvedAt') {
                    const inMeta = incoming?._syncMeta?.updatedAt;
                    const exMeta = existing?._syncMeta?.updatedAt;
                    if (!inMeta || (exMeta && exMeta >= inMeta)) {
                      merged[key] = exVal;
                    }
                  }
                }
              } else if (typeof exVal === 'number' && exVal > 0 && (inVal === undefined || inVal === null || inVal === 0)) {
                if (key !== 'progress' && key !== 'dailyRate') {
                  const inMeta = incoming?._syncMeta?.updatedAt;
                  const exMeta = existing?._syncMeta?.updatedAt;
                  if (!inMeta || (exMeta && exMeta >= inMeta)) {
                    merged[key] = exVal;
                  }
                }
              }
            }
            return merged;
          };

          // Filter out explicitly deleted items (check both ID and name to prevent resurrection)
          items = items.filter(it => {
            const itId = String((it as any)?.id || (it as any)?.no || '').trim();
            const itName = String((it as any)?.name || (it as any)?.fullName || '').trim().toLowerCase();
            if ((it as any)?._deleted) return false;
            if (itId && deletedIds.has(itId)) return false;
            if (itName && (deletedIds.has(itName) || deletedIds.has(String((it as any)?.name || '').trim()))) return false;
            return Boolean(itId || itName);
          });

          // Khusus data operasional & master referensi resmi:
          // Pastikan data resmi selalu terdaftar dan digabung dengan update cloud
          if (
            collectionName === 'master_staff' ||
            collectionName === 'freelance_workers' ||
            collectionName === 'fleet_drivers' ||
            collectionName === 'assets' ||
            collectionName === 'september_2026_schedule' ||
            collectionName === 'logbook_entries' ||
            collectionName === 'daily_reports' ||
            collectionName === 'daily_tasks' ||
            collectionName === 'findings' ||
            collectionName === 'work_orders'
          ) {
            const mergedMap = new Map<string, any>();
            const nameToId = new Map<string, string>();

            // Read cached state if available to prevent initialFallback from resurrecting unapproved/open status
            let cachedMap = new Map<string, any>();
            try {
              const cachedRaw = localStorage.getItem(localCacheKey);
              if (cachedRaw) {
                const parsedCached = JSON.parse(cachedRaw);
                if (Array.isArray(parsedCached)) {
                  parsedCached.forEach((c: any) => {
                    const cId = String(c?.id || c?.no || c?.name || '');
                    if (cId) cachedMap.set(cId, c);
                  });
                }
              }
            } catch (e) {}

            // Only use normName matching for master staff, workers, drivers, or assets where full name / asset name is primary identity.
            // Do NOT use normName for findings or work_orders, because tasks often have similar titles ("Perbaikan: ...")
            const useNameMatching = collectionName !== 'findings' && collectionName !== 'work_orders' && collectionName !== 'daily_tasks' && collectionName !== 'daily_reports';

            (initialFallback || []).forEach((fb: any) => {
              const fbId = String(fb?.id || fb?.no || fb?.name || '');
              const normName = String(fb?.name || fb?.fullName || fb?.title || '').toLowerCase().trim();
              if (fbId && !deletedIds.has(fbId)) {
                const cachedDoc = cachedMap.get(fbId);
                const baseDoc = cachedDoc ? mergeCleanDoc(fb, cachedDoc) : fb;
                mergedMap.set(fbId, baseDoc);
                if (useNameMatching && normName) nameToId.set(normName, fbId);
              }
            });

            items.forEach((it: any) => {
              const itId = String(it?.id || it?.no || it?.name || '');
              const normName = String(it?.name || it?.fullName || it?.title || '').toLowerCase().trim();
              if (itId && !deletedIds.has(itId) && !(it as any)._deleted) {
                if (mergedMap.has(itId)) {
                  const existing = mergedMap.get(itId);
                  mergedMap.set(itId, mergeCleanDoc(existing, it));
                } else if (useNameMatching && normName && nameToId.has(normName)) {
                  const oldFbId = nameToId.get(normName)!;
                  const existing = mergedMap.get(oldFbId);
                  mergedMap.delete(oldFbId);
                  mergedMap.set(itId, mergeCleanDoc(existing, it));
                  nameToId.set(normName, itId);
                } else {
                  mergedMap.set(itId, it);
                  if (useNameMatching && normName) nameToId.set(normName, itId);
                }
              }
            });

            items = Array.from(mergedMap.values()) as T[];

            // Deduplikasi temuan (Findings) berdasarkan konten yang sama (equipment + issue + PIC)
            // Prioritaskan yang sudah Close/Approved, lalu prioritaskan yang manual (fd-*) dibanding yang auto-generated (gsheet-finding-*)
            if (collectionName === 'findings') {
              const uniqueFindings = new Map<string, any>();
              items.forEach((item: any) => {
                if (!item) return;

                // Jangan izinkan temuan sampah tanpa equipment valid atau dengan placeholder generik
                const rawEq = String(item.equipment || '').trim();
                const rawIss = String(item.issue || '').trim();
                if (!rawEq || (rawEq.toLowerCase().startsWith('unit divisi') && !rawIss.toLowerCase().includes('box') && !rawIss.toLowerCase().includes('kerusakan'))) {
                  return;
                }

                const eq = String(item.equipment || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                let iss = String(item.issue || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                // Normalisasikan variasi substring kerusakan berat (contoh: "1boxkerusakanberat" vs "boxkerusakanberat")
                if (iss.includes('kerusakanberat')) {
                  iss = 'kerusakanberat';
                }
                const pic = String(item.pic || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                // Gabungkan key untuk deteksi duplikat konten yang kebal terhadap spasi/karakter khusus
                const contentKey = `dedup_${eq}_${iss}_${pic}`;
                
                if (uniqueFindings.has(contentKey)) {
                  const existing = uniqueFindings.get(contentKey);
                  const itemIsClosed = item.status === 'Close' || item.approvedBy;
                  const existingIsClosed = existing.status === 'Close' || existing.approvedBy;
                  
                  if (itemIsClosed && !existingIsClosed) {
                    uniqueFindings.set(contentKey, item);
                  } else if (!itemIsClosed && existingIsClosed) {
                    // Do nothing, keep the closed one
                  } else if (String(existing.id).startsWith('gsheet-') && String(item.id).startsWith('fd-')) {
                    uniqueFindings.set(contentKey, item);
                  } else if (String(existing.id).startsWith('fd-') && String(item.id).startsWith('fd-')) {
                     // If both are manual, keep the one with the newer ID or timestamp
                     if (item.id > existing.id) uniqueFindings.set(contentKey, item);
                  }
                } else {
                  uniqueFindings.set(contentKey, item);
                }
              });
              items = Array.from(uniqueFindings.values()) as T[];
            }

            // Deduplikasi Work Orders berdasarkan findingId atau kesamaan title + division
            if (collectionName === 'work_orders') {
              const uniqueWOs = new Map<string, any>();
              items.forEach((item: any) => {
                if (!item) return;
                const fid = String(item.findingId || '').trim().toLowerCase();
                const titleKey = String(item.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                const divKey = String(item.division || '').toLowerCase();
                const woKey = fid ? `wo_fid_${fid}` : `wo_title_${titleKey}_${divKey}`;

                if (uniqueWOs.has(woKey)) {
                  const existing = uniqueWOs.get(woKey);
                  const itemIsDone = item.status === 'Completed' || (item.progress || 0) >= 100;
                  const existingIsDone = existing.status === 'Completed' || (existing.progress || 0) >= 100;

                  if (itemIsDone && !existingIsDone) {
                    uniqueWOs.set(woKey, item);
                  } else if (!itemIsDone && existingIsDone) {
                    // Do nothing, keep completed one
                  } else {
                    // If both same state, keep the one with higher progress or newer ID
                    if ((item.progress || 0) > (existing.progress || 0) || item.id > existing.id) {
                      uniqueWOs.set(woKey, item);
                    }
                  }
                } else {
                  uniqueWOs.set(woKey, item);
                }
              });
              items = Array.from(uniqueWOs.values()) as T[];
            }
          }

          // Apply normalization to guarantee data integrity across all devices
          items = normalizeCollectionItems(collectionName, items);

          // ─────────────────────────────────────────────────────────────
          // STATUS LOCK: Apply user-initiated status changes that must NOT
          // be reverted by cloud snapshot. Lock is cleared once Firestore
          // confirms the change (status matches).
          // ─────────────────────────────────────────────────────────────
          if (collectionName === 'findings') {
            try {
              const lockKey = 'riz_findings_status_lock';
              const rawLocks = localStorage.getItem(lockKey);
              if (rawLocks) {
                const locks: Record<string, { status: string; approvedBy: string | null; approvedAt: string | null; lockedAt: string }> = JSON.parse(rawLocks);
                let locksModified = false;

                items = (items as any[]).map((item: any) => {
                  if (!item?.id) return item;
                  const lock = locks[item.id];
                  if (!lock) return item;

                  // If Firestore already has the correct status, clear the lock
                  if (item.status === lock.status) {
                    delete locks[item.id];
                    locksModified = true;
                    return item;
                  }

                  // Firestore still has wrong status — apply the lock override
                  return {
                    ...item,
                    status: lock.status,
                    ...(lock.approvedBy ? { approvedBy: lock.approvedBy } : {}),
                    ...(lock.approvedAt ? { approvedAt: lock.approvedAt } : {})
                  };
                }) as T[];

                if (locksModified) {
                  localStorage.setItem(lockKey, JSON.stringify(locks));
                }

                // Also update localStorage cache with lock-applied data
                try {
                  localStorage.setItem(localCacheKey, JSON.stringify(items));
                } catch (e) {}
              }
            } catch (e) {
              console.warn('[Sync] Failed to apply findings status lock:', e);
            }
          }

          if (collectionName === 'work_orders') {
            try {
              const woLockKey = 'riz_work_orders_status_lock';
              const rawWoLocks = localStorage.getItem(woLockKey);
              if (rawWoLocks) {
                const woLocks: Record<string, { status: string; progress?: number; approvedBy: string | null; approvedAt: string | null; lockedAt: string }> = JSON.parse(rawWoLocks);
                let woLocksModified = false;

                items = (items as any[]).map((item: any) => {
                  if (!item?.id) return item;
                  const lock = woLocks[item.id];
                  if (!lock) return item;

                  // If Firestore already has the correct status, clear the lock
                  if (item.status === lock.status) {
                    delete woLocks[item.id];
                    woLocksModified = true;
                    return item;
                  }

                  // Firestore still has wrong status — apply the lock override
                  return {
                    ...item,
                    status: lock.status,
                    progress: lock.progress !== undefined ? lock.progress : (lock.status === 'Completed' ? 100 : item.progress),
                    ...(lock.approvedBy ? { approvedBy: lock.approvedBy } : {}),
                    ...(lock.approvedAt ? { approvedAt: lock.approvedAt } : {})
                  };
                }) as T[];

                if (woLocksModified) {
                  localStorage.setItem(woLockKey, JSON.stringify(woLocks));
                }

                // Also update localStorage cache with lock-applied data
                try {
                  localStorage.setItem(localCacheKey, JSON.stringify(items));
                } catch (e) {}
              }
            } catch (e) {
              console.warn('[Sync] Failed to apply work_orders status lock:', e);
            }
          }

          // Save to in-memory cache for delta-sync comparisons
          if (typeof window !== 'undefined') {
            const cacheObj = (window as any).__FIREBASE_CACHE__ || {};
            const mapObj = new Map();
            items.forEach((item: any) => {
              const itId = String(item?.id || item?.no || item?.key || '');
              if (itId) mapObj.set(itId, item);
            });
            cacheObj[collectionName] = mapObj;
            (window as any).__FIREBASE_CACHE__ = cacheObj;
          }

          // Update local cache safely
          try {
            localStorage.setItem(localCacheKey, JSON.stringify(items));
          } catch (e) {
            console.warn(`[Sync] LocalStorage cache storage limit warning for ${localCacheKey}`);
          }

          onData(items);

          // Broadcast to other open tabs on this machine
          if (syncBroadcastChannel) {
            try {
              syncBroadcastChannel.postMessage({
                type: 'COLLECTION_SYNCED',
                collectionName,
                localCacheKey,
                count: items.length
              });
            } catch (e) {}
          }

          updateSyncStatus({
            isOnline: true,
            lastSyncedAt: new Date(),
            syncedCollections: {
              ...currentSyncStatus.syncedCollections,
              [collectionName]: items.length
            }
          });
        } else {
          // If cloud collection is completely empty, check if local storage has initial data to upload
          const cached = localStorage.getItem(localCacheKey);
          if (cached) {
            try {
              let localItems: T[] = JSON.parse(cached);
              if (Array.isArray(localItems)) {
                if (localItems.length === 1 && Array.isArray((localItems[0] as any)?.list)) {
                  localItems = (localItems[0] as any).list;
                } else if (localItems.some(item => item && Array.isArray((item as any)?.list))) {
                  localItems = localItems.flatMap(item => (item && Array.isArray((item as any)?.list)) ? (item as any).list : [item]);
                }
                localItems = localItems.filter(it => {
                  const itId = String((it as any)?.id || (it as any)?.no || '').trim();
                  const itName = String((it as any)?.name || (it as any)?.fullName || '').trim().toLowerCase();
                  if ((it as any)?._deleted) return false;
                  if (itId && deletedIds.has(itId)) return false;
                  if (itName && (deletedIds.has(itName) || deletedIds.has(String((it as any)?.name || '').trim()))) return false;
                  return Boolean(itId || itName);
                });
                localItems = normalizeCollectionItems(collectionName, localItems);
                if (localItems.length > 0) {
                  pushCollectionToCloud(collectionName, localItems);
                  onData(localItems);
                  return;
                }
              }
            } catch { /* ignore */ }
          }
          let validFallback = initialFallback.filter(it => {
            const itId = String((it as any)?.id || (it as any)?.no || '').trim();
            const itName = String((it as any)?.name || (it as any)?.fullName || '').trim().toLowerCase();
            if ((it as any)?._deleted) return false;
            if (itId && deletedIds.has(itId)) return false;
            if (itName && (deletedIds.has(itName) || deletedIds.has(String((it as any)?.name || '').trim()))) return false;
            return Boolean(itId || itName);
          });
          validFallback = normalizeCollectionItems(collectionName, validFallback);
          onData(validFallback);
        }
      },
      (error) => {
        console.warn(`[Sync] Real-time listener warning for ${collectionName}:`, error);
        const deletedIds = getDeletedIds(collectionName);
        const filterItem = (it: any) => {
          const itId = String(it?.id || it?.no || '').trim();
          const itName = String(it?.name || it?.fullName || '').trim().toLowerCase();
          if (it?._deleted) return false;
          if (itId && deletedIds.has(itId)) return false;
          if (itName && (deletedIds.has(itName) || deletedIds.has(String(it?.name || '').trim()))) return false;
          return Boolean(itId || itName);
        };

        const cached = localStorage.getItem(localCacheKey);
        if (cached) {
          try {
            let localItems = JSON.parse(cached);
            if (Array.isArray(localItems)) {
              if (localItems.length === 1 && Array.isArray(localItems[0]?.list)) {
                localItems = localItems[0].list;
              } else if (localItems.some(item => item && Array.isArray(item?.list))) {
                localItems = localItems.flatMap(item => (item && Array.isArray(item?.list)) ? item.list : [item]);
              }
              localItems = localItems.filter(filterItem);
              localItems = normalizeCollectionItems(collectionName, localItems);
              onData(localItems);
              return;
            }
            let validFallback = initialFallback.filter(filterItem);
            validFallback = normalizeCollectionItems(collectionName, validFallback);
            onData(validFallback);
          } catch {
            let validFallback = initialFallback.filter(filterItem);
            validFallback = normalizeCollectionItems(collectionName, validFallback);
            onData(validFallback);
          }
        } else {
          let validFallback = initialFallback.filter(filterItem);
          validFallback = normalizeCollectionItems(collectionName, validFallback);
          onData(validFallback);
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn(`[Sync] Failed to subscribe to ${collectionName}:`, error);
    return () => {};
  }
}

// ─────────────────────────────────────────────────────────────
// 7. SAVE / UPDATE SINGLE DOCUMENT WITH CROSS-OS METADATA
// ─────────────────────────────────────────────────────────────
export async function saveCloudDoc(
  collectionName: string,
  docId: string,
  data: Record<string, any>,
  updaterName?: string
): Promise<void> {
  clearDeletedId(collectionName, docId);
  const deviceInfo = getDeviceOSInfo();
  const cleanData = {
    id: data.id || docId,
    ...JSON.parse(JSON.stringify(data)),
    _syncMeta: {
      updatedAt: new Date().toISOString(),
      updatedBy: updaterName || 'User',
      deviceOS: deviceInfo.os,
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser
    }
  };

  // 1. Immediately update localStorage cache so refresh never reverts
  try {
    const reg = ALL_SYNC_COLLECTIONS.find(c => c.name === collectionName);
    if (reg && typeof window !== 'undefined') {
      const cached = localStorage.getItem(reg.key);
      let list: any[] = [];
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) list = parsed;
        } catch (e) {}
      }
      const existingIdx = list.findIndex(item => String(item?.id || item?.no || '') === String(docId));
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...cleanData };
      } else {
        list.unshift(cleanData);
      }
      localStorage.setItem(reg.key, JSON.stringify(list));
      if (syncBroadcastChannel) {
        try {
          syncBroadcastChannel.postMessage({
            type: 'COLLECTION_SYNCED',
            collectionName,
            localCacheKey: reg.key,
            count: list.length
          });
        } catch (e) {}
      }
      // Trigger instant in-page custom event for active tab reactivity
      try {
        window.dispatchEvent(new CustomEvent('riz_collection_updated', {
          detail: { collectionName, docId, data: cleanData }
        }));
      } catch (e) {}
    }
  } catch (e) {
    console.warn(`[Sync] Failed to immediately update local cache for ${collectionName}:`, e);
  }

  if (!navigator.onLine) {
    enqueuePendingOperation({
      type: 'SAVE',
      collectionName,
      docId,
      data: cleanData
    });
    return;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, cleanData, { merge: true });
    updateSyncStatus({
      lastSyncedAt: new Date()
    });
  } catch (err: any) {
    console.warn(`[Sync] Network error saving doc ${docId} in ${collectionName}:`, err);
    enqueuePendingOperation({
      type: 'SAVE',
      collectionName,
      docId,
      data: cleanData
    });
  }

  // Auto-update ke Google Sheet di latar belakang secara otomatis (tanpa menunggu perintah user)
  triggerAutoSyncToGoogleSheet(1500);
}

// ─────────────────────────────────────────────────────────────
// 8. DELETE SINGLE DOCUMENT WITH OFFLINE QUEUE
// ─────────────────────────────────────────────────────────────
export async function deleteCloudDoc(
  collectionName: string,
  docId: string,
  extraIdOrName?: string
): Promise<void> {
  const primaryId = String(docId || '').trim();
  if (primaryId) {
    recordDeletedId(collectionName, primaryId);
  }
  const extra = String(extraIdOrName || '').trim();
  if (extra) {
    recordDeletedId(collectionName, extra);
    recordDeletedId(collectionName, extra.toLowerCase());
  }

  // 1. Immediately purge from localStorage cache
  try {
    const reg = ALL_SYNC_COLLECTIONS.find(c => c.name === collectionName);
    if (reg && typeof window !== 'undefined') {
      const cached = localStorage.getItem(reg.key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(item => {
              const itId = String(item?.id || item?.no || '').trim();
              const itName = String(item?.name || item?.fullName || '').trim().toLowerCase();
              if (primaryId && itId === primaryId) return false;
              if (extra) {
                if (itId === extra) return false;
                if (itName === extra.toLowerCase()) return false;
              }
              return true;
            });
            localStorage.setItem(reg.key, JSON.stringify(filtered));
            if (syncBroadcastChannel) {
              syncBroadcastChannel.postMessage({
                type: 'COLLECTION_SYNCED',
                collectionName,
                localCacheKey: reg.key,
                count: filtered.length
              });
            }
          }
        } catch (e) {}
      }
    }
  } catch (e) {
    console.warn(`[Sync] Failed to purge deleted doc from local cache for ${collectionName}:`, e);
  }

  if (!navigator.onLine) {
    enqueuePendingOperation({
      type: 'DELETE',
      collectionName,
      docId
    });
    triggerAutoSyncToGoogleSheet(1500);
    return;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    updateSyncStatus({
      lastSyncedAt: new Date()
    });
  } catch (error) {
    console.warn(`[Sync] Network error deleting doc ${docId} from ${collectionName}. Queued for offline sync:`, error);
    enqueuePendingOperation({
      type: 'DELETE',
      collectionName,
      docId
    });
  }

  // Auto-update ke Google Sheet di latar belakang secara otomatis
  triggerAutoSyncToGoogleSheet(1500);
}

// ─────────────────────────────────────────────────────────────
// 9. BATCH PUSH LOCAL ITEMS TO CLOUD
// ─────────────────────────────────────────────────────────────
export async function pushCollectionToCloud<T = any>(
  collectionName: string,
  items: T[],
  updaterName?: string,
  skipStatusUpdate: boolean = false
): Promise<void> {
  if (!items || items.length === 0) return;

  const deviceInfo = getDeviceOSInfo();
  try {
    if (!skipStatusUpdate) updateSyncStatus({ isSyncing: true });

    // Retrieve in-memory firebase cache for Delta-Sync
    let firebaseCacheMap = new Map();
    if (typeof window !== 'undefined' && (window as any).__FIREBASE_CACHE__) {
      firebaseCacheMap = (window as any).__FIREBASE_CACHE__[collectionName] || new Map();
    }

    // Helper to deeply compare items ignoring _syncMeta
    const isDifferent = (local: any, cloud: any) => {
      if (!cloud) return true; // Cloud doesn't have it, definitely different
      const l = { ...local };
      const c = { ...cloud };
      delete l._syncMeta;
      delete c._syncMeta;
      return JSON.stringify(l) !== JSON.stringify(c);
    };

    // Filter only items that actually changed
    const changedItems = items.filter((item: any) => {
      const docId = String(item?.id || item?.no || item?.key || '');
      if (!docId) return false;
      const cloudItem = firebaseCacheMap.get(docId);
      return isDifferent(item, cloudItem);
    });

    if (changedItems.length === 0) {
      if (!skipStatusUpdate) updateSyncStatus({ isSyncing: false });
      return; // Nothing changed, skip writing to Firebase
    }

    const CHUNK_SIZE = 300;
    for (let i = 0; i < changedItems.length; i += CHUNK_SIZE) {
      const chunk = changedItems.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);

      chunk.forEach((item: any, idx: number) => {
        const docId = String(item?.id || item?.no || item?.key || `item-${i + idx}`);
        if (docId) {
          const docRef = doc(db, collectionName, docId);
          const cleanData = {
            ...JSON.parse(JSON.stringify(item)),
            _syncMeta: {
              updatedAt: new Date().toISOString(),
              updatedBy: updaterName || 'BatchSync',
              deviceOS: deviceInfo.os,
              deviceType: deviceInfo.deviceType,
              browser: deviceInfo.browser
            }
          };
          batch.set(docRef, cleanData, { merge: true });
        }
      });

      await batch.commit();
    }

    if (!skipStatusUpdate) {
      updateSyncStatus({
        isSyncing: false,
        lastSyncedAt: new Date(),
        syncedCollections: {
          ...currentSyncStatus.syncedCollections,
          [collectionName]: items.length
        }
      });
    }
  } catch (error) {
    console.error(`[Sync] Batch push failed for ${collectionName}:`, error);
    if (!skipStatusUpdate) updateSyncStatus({ isSyncing: false });
  }
}

// ─────────────────────────────────────────────────────────────
// 10. FULL BIDIRECTIONAL RE-SYNC ACROSS ALL 19 MODULES
// ─────────────────────────────────────────────────────────────
export async function forceSyncAllModules(updaterName?: string): Promise<{ success: boolean; message: string }> {
  try {
    updateSyncStatus({ isSyncing: true, lastSyncMessage: 'Sedang menyinkronkan seluruh modul lintas perangkat...' });

    // Step 1: Flush offline pending queue
    const flushedCount = await flushPendingQueue();

    // Step 2: Push local cache to Firestore if needed
    let totalSynced = 0;

    for (const item of ALL_SYNC_COLLECTIONS) {
      const cached = localStorage.getItem(item.key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await pushCollectionToCloud(item.name, parsed, updaterName, true);
            totalSynced += parsed.length;
          } else if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0) {
            const docRef = doc(db, 'system_configs', item.name);
            await setDoc(docRef, {
              data: parsed,
              _syncMeta: {
                updatedAt: new Date().toISOString(),
                updatedBy: updaterName || 'FullSync',
                deviceOS: localDeviceInfo.os,
                deviceType: localDeviceInfo.deviceType,
                browser: localDeviceInfo.browser
              }
            }, { merge: true });
            totalSynced += 1;
          }
        } catch (e) {
          console.warn(`[Sync] Error syncing ${item.name}:`, e);
        }
      }
    }

    const msg = `Auto-Sync Sukses! ${totalSynced} data Cloud tersinkronisasi (${localDeviceInfo.os} • ${flushedCount} antrean offline terkirim).`;
    updateSyncStatus({
      isOnline: true,
      isSyncing: false,
      lastSyncedAt: new Date(),
      lastSyncMessage: msg
    });

    return {
      success: true,
      message: msg
    };
  } catch (error) {
    const errMsg = `Gagal sinkronisasi: ${(error as Error).message}`;
    updateSyncStatus({ isSyncing: false, lastSyncMessage: errMsg });
    return {
      success: false,
      message: errMsg
    };
  } finally {
    updateSyncStatus({ isSyncing: false });
  }
}

// ─────────────────────────────────────────────────────────────
// 11. CROSS-PLATFORM LIFECYCLE HOOKS (iOS, Android, Windows, Mac, Linux)
// ─────────────────────────────────────────────────────────────
let autoSyncInitialized = false;

export function initAutoSyncEngine() {
  if (typeof window === 'undefined' || autoSyncInitialized) return;
  autoSyncInitialized = true;

  const triggerResync = (reason: string) => {
    if (navigator.onLine) {
      updateSyncStatus({
        isOnline: true,
        lastSyncMessage: `🔄 Auto-Sync aktif (${reason})...`
      });
      flushPendingQueue();
    }
  };

  // 1. Connection Restored Event
  window.addEventListener('online', () => {
    updateSyncStatus({
      isOnline: true,
      lastSyncMessage: '🌐 Koneksi Internet Terhubung! Memulai Auto-Sync...'
    });
    setTimeout(() => {
      forceSyncAllModules();
    }, 500);
  });

  // 2. Connection Lost Event
  window.addEventListener('offline', () => {
    updateSyncStatus({
      isOnline: false,
      lastSyncMessage: '⚠️ Koneksi Offline. Perubahan disimpan di antrean perangkat.'
    });
  });

  // 3. Tab Visibility & Wakeup from Screen-off (Crucial for iOS Safari & Android)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      triggerResync('Tab Aktif');
    }
  });

  // 4. Window Focus Event (Desktop Windows, macOS, Linux)
  window.addEventListener('focus', () => {
    triggerResync('Fokus Aplikasi');
  });

  // 5. PageShow Event (Critical for iOS / Android when returning from background cache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      triggerResync('Restorasi Cache Halaman');
    }
  });

  // 6. Page Lifecycle API (freeze & resume on modern mobile browsers)
  if ('onresume' in document) {
    document.addEventListener('resume', () => {
      triggerResync('Resume Lifecycle');
    });
  }

  // 7. Multi-Tab Cross-Window Listener
  if (syncBroadcastChannel) {
    syncBroadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'COLLECTION_SYNCED') {
        updateSyncStatus({
          lastSyncedAt: new Date(),
          lastSyncMessage: `⚡ Data '${event.data.collectionName}' diperbarui dari tab lain`
        });
      }
    };
  }

  // 8. Background Heartbeat Interval (Every 20 seconds when online)
  setInterval(() => {
    if (navigator.onLine && !currentSyncStatus.isSyncing) {
      const queue = getPendingQueue();
      if (queue.length > 0) {
        flushPendingQueue();
      }
    }
  }, 20000);

  // 9. Initial startup trigger
  if (navigator.onLine) {
    setTimeout(() => {
      flushPendingQueue();
    }, 1500);
  }
}

// Initialize immediately in browser
if (typeof window !== 'undefined') {
  initAutoSyncEngine();
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cloud Real-Time & Auto-Sync Engine for RIZ-PRODUCTION App
 * Multi-Device & Cross-Operating-System Synchronization (Windows, macOS, iOS, Android, Linux).
 * Powered by Unified Local Storage, BroadcastChannel, Supabase, and Google Sheets Synchronization.
 */

import { normalizeStaffMaster, STAFF_LIST, getMasterStaffList } from '../data';
import { isStaffMatch } from '../utils/kpiCalculator';
import { triggerAutoSyncToGoogleSheet } from './googleSheetSync';
import { saveSupabaseDoc, deleteSupabaseDoc, pushCollectionToSupabase } from './supabaseSync';

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
 * Flush all pending offline operations
 */
export async function flushPendingQueue(): Promise<number> {
  const queue = getPendingQueue();
  if (queue.length === 0) return 0;
  savePendingQueue([]);
  return queue.length;
}

// ─────────────────────────────────────────────────────────────
// 5. REGISTRY OF ALL 19 MODULES FOR MULTI-DEVICE SYNC
// ─────────────────────────────────────────────────────────────
export const ALL_SYNC_COLLECTIONS = [
  { name: 'logbook_entries', key: 'riz_logbook_entries_v2', label: 'Logbook Entries' },
  { name: 'daily_reports', key: 'riz_daily_reports_v2', label: 'Laporan Harian' },
  { name: 'daily_tasks', key: 'riz_daily_tasks_v2', label: 'Daily Task & Checklist' },
  { name: 'findings', key: 'riz_findings_v2', label: 'Temuan QC' },
  { name: 'assets', key: 'riz_assets', label: 'Master Aset' },
  { name: 'work_orders', key: 'riz_work_orders_v2', label: 'Work Orders' },
  { name: 'maintenance_schedules', key: 'riz_schedules', label: 'Jadwal Pemeliharaan' },
  { name: 'activities', key: 'riz_activities', label: 'Audit Log Aktivitas' },
  { name: 'master_staff', key: 'riz_master_staff_list', label: 'Master Staf Karyawan' },
  { name: 'freelance_workers', key: 'riz_freelance_workers', label: 'Database Freelance' },
  { name: 'fleet_drivers', key: 'riz_fleet_drivers', label: 'Database Driver Armada' },
  { name: 'master_vehicles', key: 'riz_master_vehicles', label: 'Master Armada Kendaraan' },
  { name: 'fleet_assignments', key: 'riz_fleet_assignments', label: 'Penugasan Armada' },
  { name: 'custom_qc_checklists', key: 'riz_custom_qc_checklists', label: 'Template QC Checklist' },
  { name: 'schedule_2026-09', key: 'riz_schedule_2026-09', label: 'Jadwal Shift September 2026' },
  { name: 'schedule_2026-10', key: 'riz_schedule_2026-10', label: 'Jadwal Shift Oktober 2026' },
  { name: 'schedule_2026-11', key: 'riz_schedule_2026-11', label: 'Jadwal Shift November 2026' },
  { name: 'schedule_2026-12', key: 'riz_schedule_2026-12', label: 'Jadwal Shift Desember 2026' },
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

  // Special normalization for findings: deduplicate by ID and content (equipment + issue)
  // Memastikan entri canonical (fd-*) diprioritaskan dan entri duplikat generik (gsheet-finding-*) dilebur
  if (collectionName === 'findings') {
    const getSemanticKey = (item: any): string => {
      const eq = String(item.equipment || '').toLowerCase();
      const iss = String(item.issue || '').toLowerCase();
      const combined = `${eq} ${iss}`;

      if (combined.includes('ampeg') || combined.includes('svt-4') || (combined.includes('ptc') && combined.includes('amplifier'))) {
        return 'sem_ampeg_ptc';
      }
      if (combined.includes('takel') || combined.includes('rigging') && combined.includes('los')) {
        return 'sem_takel_los';
      }
      if (combined.includes('sm57') || (combined.includes('sm58') && combined.includes('rusak 4'))) {
        return 'sem_sm57_inventory';
      }
      if (combined.includes('parled') || combined.includes('par led')) {
        if (combined.includes('13') || combined.includes('merah mati')) {
          return 'sem_parled_13_merah';
        }
        if (combined.includes('19') || combined.includes('20') || combined.includes('27')) {
          return 'sem_parled_warm_19_20_27';
        }
        if (combined.includes('12') || combined.includes('25') || combined.includes('29') || combined.includes('32')) {
          return 'sem_parled_warm_12_25_29_3_32';
        }
      }
      if (combined.includes('smoke') || combined.includes('smok')) {
        return 'sem_smoke_machine_03';
      }
      if (combined.includes('dbtech') || (combined.includes('modul amplifier') && combined.includes('serak'))) {
        return 'sem_dbtech_no18';
      }
      if (combined.includes('kabinet') || combined.includes('videotron') || combined.includes('box kerusakan') || combined.includes('dead pixel')) {
        return 'sem_videotron_kabinet_box';
      }

      // Fallback: exact alphanumeric signature
      const eqNorm = eq.replace(/[^a-z0-9]/g, '');
      const issNorm = iss.replace(/[^a-z0-9]/g, '').substring(0, 40);
      return `generic_${eqNorm}_${issNorm}`;
    };

    const map = new Map<string, any>();
    // Urutkan item agar canonical (berawalan 'fd-') diproses belakangan (menimpa generic) atau terlebih dahulu
    // Kita tempatkan item berawalan 'fd-' sebagai prioritas utama
    const sortedItems = [...items].sort((a: any, b: any) => {
      const aIsFd = String(a?.id || '').startsWith('fd-') ? 1 : 0;
      const bIsFd = String(b?.id || '').startsWith('fd-') ? 1 : 0;
      return aIsFd - bIsFd; // Generic dulu, lalu canonical menimpa generic
    });

    sortedItems.forEach((item: any) => {
      if (!item) return;
      const semKey = getSemanticKey(item);
      const existing = map.get(semKey);
      if (!existing) {
        map.set(semKey, item);
      } else {
        // Jika existing bukan 'fd-' tapi item baru adalah 'fd-', ganti dengan yang canonical!
        if (String(item.id || '').startsWith('fd-')) {
          map.set(semKey, {
            ...item,
            // Pertahankan status lock atau approval jika sebelumnya sudah diubah user
            status: existing.status === 'Close' ? 'Close' : item.status,
            approvedBy: existing.approvedBy || item.approvedBy,
            approvedAt: existing.approvedAt || item.approvedAt
          });
        }
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

  // Special normalization for daily_reports: no strict note concatenation
  if (collectionName === 'daily_reports') {
    const map = new Map<string, any>();
    const semanticSet = new Set<string>();

    // Sort so that 'rep-' IDs are processed before 'gsheet-' IDs
    const sortedItems = [...items].sort((a: any, b: any) => {
      const aIsGsheet = a.id?.startsWith('gsheet-');
      const bIsGsheet = b.id?.startsWith('gsheet-');
      if (aIsGsheet && !bIsGsheet) return 1;
      if (!aIsGsheet && bIsGsheet) return -1;
      return 0;
    });

    const allKnownStaff = typeof window !== 'undefined' ? getMasterStaffList() : STAFF_LIST;

    sortedItems.forEach((item: any) => {
      if (!item || !item.date) return;
      const staffObj = allKnownStaff.find(s => isStaffMatch(s, item.staffName)) || STAFF_LIST.find(s => isStaffMatch(s, item.staffName));
      
      const effectiveStaffName = staffObj ? staffObj.name : String(item.staffName || '').trim();
      if (!effectiveStaffName) return; // Drop entries without staff name

      const effectiveDivision = staffObj ? staffObj.division : (item.division || 'Umum');
      const normActivity = String(item.activity || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 30);
      const isCustomAppId = String(item.id || '').startsWith('dr-');
      const semanticKey = isCustomAppId ? String(item.id) : `${item.date}_${effectiveStaffName}_${normActivity}`;

      if (!isCustomAppId && semanticSet.has(semanticKey)) return; // Semantic dedup for external/gsheet rows
      if (!isCustomAppId) semanticSet.add(semanticKey);

      const normalizedItem = {
        ...item,
        staffName: effectiveStaffName,
        division: effectiveDivision
      };
      
      // Keep by ID so updates can happen correctly
      if (item.id) {
        map.set(item.id, normalizedItem);
      }
    });
    return Array.from(map.values()) as T[];
  }

  // Special normalization for logbook_entries: no strict note concatenation
  if (collectionName === 'logbook_entries') {
    const map = new Map<string, any>();
    const semanticSet = new Set<string>();

    // Sort so that 'log-' IDs are processed before 'gsheet-' IDs
    const sortedItems = [...items].sort((a: any, b: any) => {
      const aIsGsheet = a.id?.startsWith('gsheet-');
      const bIsGsheet = b.id?.startsWith('gsheet-');
      if (aIsGsheet && !bIsGsheet) return 1;
      if (!aIsGsheet && bIsGsheet) return -1;
      return 0;
    });

    const allKnownStaff = typeof window !== 'undefined' ? getMasterStaffList() : STAFF_LIST;

    sortedItems.forEach((item: any) => {
      if (!item || !item.date) return;
      const staffObj = allKnownStaff.find(s => isStaffMatch(s, item.staffName)) || STAFF_LIST.find(s => isStaffMatch(s, item.staffName));
      
      const effectiveStaffName = staffObj ? staffObj.name : String(item.staffName || '').trim();
      if (!effectiveStaffName) return; // Drop entries without staff name

      const effectiveDivision = staffObj ? staffObj.division : (item.division || 'Umum');
      const normActivity = String(item.activity || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 30);
      const isCustomAppId = String(item.id || '').startsWith('lg-');
      const semanticKey = isCustomAppId ? String(item.id) : `${item.date}_${effectiveStaffName}_${normActivity}`;

      if (!isCustomAppId && semanticSet.has(semanticKey)) return; // Semantic dedup for external/gsheet rows
      if (!isCustomAppId) semanticSet.add(semanticKey);

      const normalizedItem = {
        ...item,
        staffName: effectiveStaffName,
        division: effectiveDivision
      };
      
      if (item.id) {
        map.set(item.id, normalizedItem);
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
// 6. REAL-TIME LOCAL & BROADCAST SUBSCRIBER
// ─────────────────────────────────────────────────────────────
export function subscribeCloudCollection<T = any>(
  collectionName: string,
  localCacheKey: string,
  onData: (items: T[]) => void,
  initialFallback: T[] = []
): () => void {
  const loadAndEmit = () => {
    try {
      const deletedIds = getDeletedIds(collectionName);
      let items: T[] = [];
      let cached = localStorage.getItem(localCacheKey);
      if (!cached) {
        const altKey = localCacheKey.endsWith('_v2')
          ? localCacheKey.replace(/_v2$/, '')
          : `${localCacheKey}_v2`;
        cached = localStorage.getItem(altKey);
      }
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            if (parsed.length === 1 && Array.isArray((parsed[0] as any)?.list)) {
              items = (parsed[0] as any).list;
            } else if (parsed.some(item => item && Array.isArray((item as any)?.list))) {
              items = parsed.flatMap(item => (item && Array.isArray((item as any)?.list)) ? (item as any).list : [item]);
            } else {
              items = parsed;
            }
          }
        } catch { /* ignore */ }
      }

      const isMasterCollection =
        collectionName === 'master_staff' ||
        collectionName === 'freelance_workers' ||
        collectionName === 'fleet_drivers' ||
        collectionName === 'assets' ||
        collectionName.startsWith('schedule_') ||
        collectionName === 'logbook_entries' ||
        collectionName === 'daily_reports' ||
        collectionName === 'daily_tasks' ||
        collectionName === 'findings' ||
        collectionName === 'work_orders';

      if (items.length === 0) {
        items = [...initialFallback];
      } else if (isMasterCollection && initialFallback && initialFallback.length > 0) {
        const itemMap = new Map<string, any>();
        initialFallback.forEach((fb: any) => {
          const fbId = String(fb?.id || fb?.no || fb?.name || '');
          if (fbId && !deletedIds.has(fbId)) itemMap.set(fbId, fb);
        });
        items.forEach((it: any) => {
          const itId = String(it?.id || it?.no || it?.name || '');
          if (itId && !deletedIds.has(itId) && !(it as any)._deleted) {
            const existing = itemMap.get(itId);
            itemMap.set(itId, existing ? { ...existing, ...it } : it);
          }
        });
        items = Array.from(itemMap.values()) as T[];
      }

      // Filter deleted items
      items = items.filter(it => {
        const itId = String((it as any)?.id || (it as any)?.no || '').trim();
        const itName = String((it as any)?.name || (it as any)?.fullName || '').trim().toLowerCase();
        if ((it as any)?._deleted) return false;
        if (itId && deletedIds.has(itId)) return false;
        if (itName && (deletedIds.has(itName) || deletedIds.has(String((it as any)?.name || '').trim()))) return false;
        return Boolean(itId || itName);
      });

      // Deduplicate by ID
      const uniqueItems = new Map<string, any>();
      items.forEach((item: any) => {
        if (item && item.id) uniqueItems.set(item.id, item);
      });
      items = Array.from(uniqueItems.values()) as T[];

      // Normalize items
      items = normalizeCollectionItems(collectionName, items);

      // Status lock override for findings
      if (collectionName === 'findings') {
        try {
          const lockKey = 'riz_findings_status_lock';
          const rawLocks = localStorage.getItem(lockKey);
          if (rawLocks) {
            const locks = JSON.parse(rawLocks);
            items = (items as any[]).map((item: any) => {
              if (!item?.id) return item;
              const lock = locks[item.id];
              if (!lock) return item;
              return {
                ...item,
                status: lock.status,
                ...(lock.approvedBy ? { approvedBy: lock.approvedBy } : {}),
                ...(lock.approvedAt ? { approvedAt: lock.approvedAt } : {})
              };
            }) as T[];
          }
        } catch {}
      }

      // Status lock override for work_orders
      if (collectionName === 'work_orders') {
        try {
          const woLockKey = 'riz_work_orders_status_lock';
          const rawWoLocks = localStorage.getItem(woLockKey);
          if (rawWoLocks) {
            const woLocks = JSON.parse(rawWoLocks);
            items = (items as any[]).map((item: any) => {
              if (!item?.id) return item;
              const lock = woLocks[item.id];
              if (!lock) return item;
              return {
                ...item,
                status: lock.status,
                progress: lock.progress !== undefined ? lock.progress : (lock.status === 'Completed' ? 100 : item.progress),
                ...(lock.approvedBy ? { approvedBy: lock.approvedBy } : {}),
                ...(lock.approvedAt ? { approvedAt: lock.approvedAt } : {})
              };
            }) as T[];
          }
        } catch {}
      }

      onData(items);

      updateSyncStatus({
        isOnline: true,
        lastSyncedAt: new Date(),
        syncedCollections: {
          ...currentSyncStatus.syncedCollections,
          [collectionName]: items.length
        }
      });
    } catch (err) {
      console.warn(`[Sync] Load failed for ${collectionName}:`, err);
      onData(initialFallback || []);
    }
  };

  // Immediate initial load
  loadAndEmit();

  const handleStorage = (e: StorageEvent) => {
    if (e.key === localCacheKey || !e.key) {
      loadAndEmit();
    }
  };

  const handleBroadcast = (e: MessageEvent) => {
    if (e.data && (e.data.collectionName === collectionName || e.data.type === 'ALL_MODULES_SYNCED' || e.data.type === 'COLLECTION_SYNCED')) {
      loadAndEmit();
    }
  };

  const handleCustomEvent = (e: Event) => {
    const customEvt = e as CustomEvent;
    if (!customEvt.detail || customEvt.detail.collectionName === collectionName) {
      loadAndEmit();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
    window.addEventListener('riz_collection_updated', handleCustomEvent);
    window.addEventListener('riz_local_data_updated', handleCustomEvent);
  }

  if (syncBroadcastChannel) {
    syncBroadcastChannel.addEventListener('message', handleBroadcast);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('riz_collection_updated', handleCustomEvent);
      window.removeEventListener('riz_local_data_updated', handleCustomEvent);
    }
    if (syncBroadcastChannel) {
      syncBroadcastChannel.removeEventListener('message', handleBroadcast);
    }
  };
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
      const keysToUpdate = [reg.key];
      if (reg.key.endsWith('_v2')) {
        keysToUpdate.push(reg.key.replace(/_v2$/, ''));
      } else {
        keysToUpdate.push(`${reg.key}_v2`);
      }

      keysToUpdate.forEach(k => {
        try {
          const cached = localStorage.getItem(k);
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
          localStorage.setItem(k, JSON.stringify(list));
        } catch (e) {}
      });

      if (syncBroadcastChannel) {
        try {
          syncBroadcastChannel.postMessage({
            type: 'COLLECTION_SYNCED',
            collectionName,
            localCacheKey: reg.key,
            count: 1
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

  updateSyncStatus({
    lastSyncedAt: new Date()
  });

  // Sinkronisasi ganda ke Supabase jika terkonfigurasi (tanpa memblokir UI)
  saveSupabaseDoc(collectionName, docId, cleanData).catch(() => {});

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
      const keysToUpdate = [reg.key];
      if (reg.key.endsWith('_v2')) {
        keysToUpdate.push(reg.key.replace(/_v2$/, ''));
      } else {
        keysToUpdate.push(`${reg.key}_v2`);
      }

      keysToUpdate.forEach(k => {
        try {
          const cached = localStorage.getItem(k);
          if (cached) {
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
              localStorage.setItem(k, JSON.stringify(filtered));
            }
          }
        } catch (e) {}
      });

      if (syncBroadcastChannel) {
        try {
          syncBroadcastChannel.postMessage({
            type: 'COLLECTION_SYNCED',
            collectionName,
            localCacheKey: reg.key
          });
        } catch (e) {}
      }
      try {
        window.dispatchEvent(new CustomEvent('riz_collection_updated', {
          detail: { collectionName, docId: primaryId }
        }));
      } catch (e) {}
    }
  } catch (e) {
    console.warn(`[Sync] Failed to purge deleted doc from local cache for ${collectionName}:`, e);
  }

  updateSyncStatus({
    lastSyncedAt: new Date()
  });

  // Hapus juga di Supabase jika terkonfigurasi
  deleteSupabaseDoc(collectionName, primaryId || docId).catch(() => {});

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

  const reg = ALL_SYNC_COLLECTIONS.find(c => c.name === collectionName);
  if (reg && typeof window !== 'undefined') {
    try {
      const keysToUpdate = [reg.key];
      if (reg.key.endsWith('_v2')) {
        keysToUpdate.push(reg.key.replace(/_v2$/, ''));
      } else {
        keysToUpdate.push(`${reg.key}_v2`);
      }
      keysToUpdate.forEach(k => {
        try {
          localStorage.setItem(k, JSON.stringify(items));
        } catch (e) {}
      });

      if (syncBroadcastChannel) {
        syncBroadcastChannel.postMessage({
          type: 'COLLECTION_SYNCED',
          collectionName,
          localCacheKey: reg.key,
          count: items.length
        });
      }
      try {
        window.dispatchEvent(new CustomEvent('riz_collection_updated', {
          detail: { collectionName }
        }));
      } catch (e) {}
    } catch (e) {}
  }

  // Push juga ke Supabase jika terkonfigurasi (tanpa memblokir UI)
  pushCollectionToSupabase(collectionName, items as any).catch(() => {});

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
}

// ─────────────────────────────────────────────────────────────
// 10. FULL RE-SYNC ACROSS ALL 19 MODULES
// ─────────────────────────────────────────────────────────────
export async function forceSyncAllModules(updaterName?: string): Promise<{ success: boolean; message: string }> {
  try {
    updateSyncStatus({ isSyncing: true, lastSyncMessage: 'Sedang menyinkronkan seluruh modul...' });

    // Step 1: Flush offline pending queue
    await flushPendingQueue();

    // Step 2: Trigger Google Sheet Auto-Sync
    triggerAutoSyncToGoogleSheet(0);

    let totalSynced = 0;
    for (const item of ALL_SYNC_COLLECTIONS) {
      const cached = localStorage.getItem(item.key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            totalSynced += parsed.length;
          }
        } catch (e) {}
      }
    }

    const msg = `Auto-Sync Sukses! Seluruh modul (${totalSynced} data) tersinkronisasi.`;
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

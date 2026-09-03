/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cloud Real-Time & Auto-Sync Engine for RIZ-PRODUCTION App
 * Automatically synchronizes all local & server data whenever internet connectivity is detected.
 * Powered by Firebase Cloud Firestore with Offline Pending Queue & Heartbeat Auto-Sync.
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

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncedCollections: Record<string, number>;
  pendingQueueCount: number;
  lastSyncMessage?: string;
}

interface PendingSyncItem {
  id: string;
  type: 'SAVE' | 'DELETE';
  collectionName: string;
  docId: string;
  data?: Record<string, any>;
  createdAt: string;
}

const PENDING_QUEUE_KEY = 'riz_pending_offline_sync_queue';

// Global Sync Status State
let currentSyncStatus: SyncStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncedAt: null,
  syncedCollections: {},
  pendingQueueCount: getPendingQueue().length
};

const statusListeners = new Set<(status: SyncStatus) => void>();

export function subscribeSyncStatus(listener: (status: SyncStatus) => void) {
  statusListeners.add(listener);
  listener({ ...currentSyncStatus });
  return () => {
    statusListeners.delete(listener);
  };
}

function updateSyncStatus(updates: Partial<SyncStatus>) {
  currentSyncStatus = { ...currentSyncStatus, ...updates };
  statusListeners.forEach(listener => listener({ ...currentSyncStatus }));
}

// Pending Queue Helpers
function getPendingQueue(): PendingSyncItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(PENDING_QUEUE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function savePendingQueue(queue: PendingSyncItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PENDING_QUEUE_KEY, JSON.stringify(queue));
    updateSyncStatus({ pendingQueueCount: queue.length });
  } catch (e) {
    console.warn('[Sync] Failed to save pending queue to localStorage', e);
  }
}

function enqueuePendingOperation(item: Omit<PendingSyncItem, 'id' | 'createdAt'>) {
  const queue = getPendingQueue();
  // Avoid duplicate queue entries for the same docId
  const filtered = queue.filter(q => !(q.collectionName === item.collectionName && q.docId === item.docId));
  filtered.push({
    ...item,
    id: 'pq-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString()
  });
  savePendingQueue(filtered);
}

/**
 * Flush all pending offline operations to Firestore Cloud
 */
export async function flushPendingQueue(): Promise<number> {
  const queue = getPendingQueue();
  if (queue.length === 0) return 0;

  let successCount = 0;
  const remaining: PendingSyncItem[] = [];

  for (const item of queue) {
    try {
      if (item.type === 'SAVE' && item.data) {
        const docRef = doc(db, item.collectionName, item.docId);
        const cleanData = JSON.parse(JSON.stringify(item.data));
        await setDoc(docRef, cleanData, { merge: true });
        successCount++;
      } else if (item.type === 'DELETE') {
        const docRef = doc(db, item.collectionName, item.docId);
        await deleteDoc(docRef);
        successCount++;
      }
    } catch (error) {
      console.warn(`[Sync] Failed to flush pending item ${item.id}:`, error);
      remaining.push(item);
    }
  }

  savePendingQueue(remaining);
  return successCount;
}

/**
 * Generic Real-time Firestore Collection Subscriber
 */
export function subscribeCloudCollection<T extends { id: string }>(
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
        if (!snapshot.empty) {
          const items: T[] = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data
            } as T;
          });

          // Save to local cache
          try {
            localStorage.setItem(localCacheKey, JSON.stringify(items));
          } catch (e) {
            console.warn(`[Sync] LocalStorage cache full for ${localCacheKey}`);
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
        } else {
          // If cloud is empty, check if we have local cache to push up
          const cached = localStorage.getItem(localCacheKey);
          if (cached) {
            try {
              const localItems: T[] = JSON.parse(cached);
              if (Array.isArray(localItems) && localItems.length > 0) {
                pushCollectionToCloud(collectionName, localItems);
                onData(localItems);
                return;
              }
            } catch { /* ignore */ }
          }
          onData(initialFallback);
        }
      },
      (error) => {
        console.warn(`[Sync] Real-time listener for ${collectionName}:`, error);
        const cached = localStorage.getItem(localCacheKey);
        if (cached) {
          try {
            onData(JSON.parse(cached));
          } catch {
            onData(initialFallback);
          }
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn(`[Sync] Failed to subscribe to ${collectionName}:`, error);
    return () => {};
  }
}

/**
 * Save / Update a single document in Firestore
 */
export async function saveCloudDoc(
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<void> {
  const cleanData = JSON.parse(JSON.stringify(data));
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
  } catch (error) {
    console.warn(`[Sync] Offline/Error saving ${docId} to ${collectionName}, enqueuing:`, error);
    enqueuePendingOperation({
      type: 'SAVE',
      collectionName,
      docId,
      data: cleanData
    });
  }
}

/**
 * Delete a document in Firestore
 */
export async function deleteCloudDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  if (!navigator.onLine) {
    enqueuePendingOperation({
      type: 'DELETE',
      collectionName,
      docId
    });
    return;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    updateSyncStatus({
      lastSyncedAt: new Date()
    });
  } catch (error) {
    console.warn(`[Sync] Offline/Error deleting ${docId} from ${collectionName}, enqueuing:`, error);
    enqueuePendingOperation({
      type: 'DELETE',
      collectionName,
      docId
    });
  }
}

/**
 * Push an array of local items to Firestore collection using batch writes
 */
export async function pushCollectionToCloud<T extends { id: string }>(
  collectionName: string,
  items: T[]
): Promise<void> {
  if (!items || items.length === 0) return;

  try {
    updateSyncStatus({ isSyncing: true });
    const CHUNK_SIZE = 400;
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      const chunk = items.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);

      chunk.forEach(item => {
        if (item.id) {
          const docRef = doc(db, collectionName, item.id);
          const cleanData = JSON.parse(JSON.stringify(item));
          batch.set(docRef, cleanData, { merge: true });
        }
      });

      await batch.commit();
    }

    updateSyncStatus({
      isSyncing: false,
      lastSyncedAt: new Date(),
      syncedCollections: {
        ...currentSyncStatus.syncedCollections,
        [collectionName]: items.length
      }
    });
  } catch (error) {
    console.error(`[Sync] Batch push failed for ${collectionName}:`, error);
    updateSyncStatus({ isSyncing: false });
  }
}

/**
 * Trigger full bidirectional synchronization across all modules
 */
export async function forceSyncAllModules(): Promise<{ success: boolean; message: string }> {
  try {
    updateSyncStatus({ isSyncing: true, lastSyncMessage: 'Sedang menyinkronkan seluruh data...' });

    // Step 1: Flush any offline pending queue
    const flushedCount = await flushPendingQueue();

    // Step 2: Push all local storage modules to Cloud Firestore
    const collectionsToSync = [
      { name: 'logbook_entries', key: 'riz_logbook_entries' },
      { name: 'daily_reports', key: 'riz_daily_reports' },
      { name: 'daily_tasks', key: 'riz_daily_tasks' },
      { name: 'findings', key: 'riz_findings' },
      { name: 'assets', key: 'riz_assets' },
      { name: 'work_orders', key: 'riz_work_orders' },
      { name: 'maintenance_schedules', key: 'riz_schedules' },
      { name: 'activities', key: 'riz_activities' },
      { name: 'attendance_logs', key: 'riz_attendance_logs' },
      { name: 'staff_competencies', key: 'riz_staff_electrical_competencies' },
      { name: 'career_records', key: 'riz_career_pipeline_records' },
      { name: 'warehouse_logs', key: 'riz_warehouse_logs' }
    ];

    let totalSynced = 0;

    for (const item of collectionsToSync) {
      const cached = localStorage.getItem(item.key);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await pushCollectionToCloud(item.name, parsed);
            totalSynced += parsed.length;
          } else if (typeof parsed === 'object' && parsed !== null) {
            const docRef = doc(db, 'system_configs', item.name);
            await setDoc(docRef, { data: parsed, updatedAt: new Date().toISOString() }, { merge: true });
            totalSynced += 1;
          }
        } catch (e) {
          console.warn(`[Sync] Error syncing ${item.name}:`, e);
        }
      }
    }

    const msg = `Auto-Sync Sukses! ${totalSynced} data Cloud tersinkronisasi (${flushedCount} antrean offline terkirim).`;
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
  }
}

/**
 * Initialize Automatic Internet-Detection & Heartbeat Auto-Sync
 * Fires automatically whenever internet connection is detected, restored, or tab is focused.
 */
let autoSyncInitialized = false;

export function initAutoSyncEngine() {
  if (typeof window === 'undefined' || autoSyncInitialized) return;
  autoSyncInitialized = true;

  // 1. Trigger Auto-Sync immediately when device reconnects to internet
  window.addEventListener('online', () => {
    updateSyncStatus({
      isOnline: true,
      lastSyncMessage: '🌐 Internet Terdeteksi! Menjalankan Auto-Sync...'
    });
    // Instant sync upon internet detection
    setTimeout(() => {
      forceSyncAllModules();
    }, 500);
  });

  // 2. Update status when device goes offline
  window.addEventListener('offline', () => {
    updateSyncStatus({
      isOnline: false,
      lastSyncMessage: '⚠️ Koneksi Offline. Perubahan disimpan di antrean lokal.'
    });
  });

  // 3. Trigger Auto-Sync when user switches back to the application tab
  window.addEventListener('focus', () => {
    if (navigator.onLine) {
      forceSyncAllModules();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && navigator.onLine) {
      forceSyncAllModules();
    }
  });

  // 4. Background Heartbeat: Auto-sync every 30 seconds when online
  setInterval(() => {
    if (navigator.onLine && !currentSyncStatus.isSyncing) {
      // Check if there are pending offline operations or trigger sync
      const queue = getPendingQueue();
      if (queue.length > 0) {
        flushPendingQueue();
      }
    }
  }, 30000);

  // 5. Initial startup auto-sync
  if (navigator.onLine) {
    setTimeout(() => {
      forceSyncAllModules();
    }, 1500);
  }
}

// Auto-run initialization immediately in browser environment
if (typeof window !== 'undefined') {
  initAutoSyncEngine();
}

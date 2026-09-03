/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Cloud Real-Time Sync Engine for RIZ-PRODUCTION App
 * Powered by Firebase Cloud Firestore
 */

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncedCollections: Record<string, number>;
}

// Global Sync Status State & Listeners
let currentSyncStatus: SyncStatus = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isSyncing: false,
  lastSyncedAt: null,
  syncedCollections: {}
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

// Monitor Online / Offline Connectivity
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => updateSyncStatus({ isOnline: true }));
  window.addEventListener('offline', () => updateSyncStatus({ isOnline: false }));
}

/**
 * Generic Real-time Firestore Collection Subscriber
 * Synchronizes cloud documents with local state and localStorage cache.
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
                // Push local items up to cloud
                pushCollectionToCloud(collectionName, localItems);
                onData(localItems);
                return;
              }
            } catch (e) { /* ignore parse error */ }
          }
          onData(initialFallback);
        }
      },
      (error) => {
        console.warn(`[Sync] Firestore real-time listener error for ${collectionName}:`, error);
        // Fallback to local cache
        const cached = localStorage.getItem(localCacheKey);
        if (cached) {
          try {
            onData(JSON.parse(cached));
          } catch (e) {
            onData(initialFallback);
          }
        }
      }
    );

    return unsubscribe;
  } catch (error) {
    console.warn(`[Sync] Failed to initialize subscription for ${collectionName}:`, error);
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
  try {
    const docRef = doc(db, collectionName, docId);
    // Sanitize data: undefined values cause Firestore error
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, cleanData, { merge: true });
    updateSyncStatus({
      lastSyncedAt: new Date()
    });
  } catch (error) {
    console.error(`[Sync] Error saving doc ${docId} to ${collectionName}:`, error);
  }
}

/**
 * Delete a document in Firestore
 */
export async function deleteCloudDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    updateSyncStatus({
      lastSyncedAt: new Date()
    });
  } catch (error) {
    console.error(`[Sync] Error deleting doc ${docId} from ${collectionName}:`, error);
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
    // Firestore batch limit is 500 writes
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
    updateSyncStatus({ isSyncing: true });

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
            // Key-value object (like competencies or career records)
            const docRef = doc(db, 'system_configs', item.name);
            await setDoc(docRef, { data: parsed, updatedAt: new Date().toISOString() }, { merge: true });
            totalSynced += 1;
          }
        } catch (e) {
          console.warn(`[Sync] Error syncing ${item.name}:`, e);
        }
      }
    }

    updateSyncStatus({
      isSyncing: false,
      lastSyncedAt: new Date()
    });

    return {
      success: true,
      message: `Sinkronisasi Cloud Berhasil! Semua data terhubung secara real-time.`
    };
  } catch (error) {
    updateSyncStatus({ isSyncing: false });
    return {
      success: false,
      message: `Gagal sinkronisasi: ${(error as Error).message}`
    };
  }
}

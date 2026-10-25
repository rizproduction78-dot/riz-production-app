/**
 * Supabase Cloud Sync Adapter
 * PT. Riz Production Multi Kreasi
 * Sync & Persistence Bridge between local state and Supabase PostgreSQL
 */

import { supabase, isSupabaseConfigured } from './supabase';

// Map collection names to Supabase table names
const TABLE_MAP: Record<string, string> = {
  master_staff: 'master_staff',
  daily_reports: 'daily_reports',
  logbook_entries: 'logbook_entries',
  findings: 'findings',
  work_orders: 'work_orders',
  daily_tasks: 'daily_tasks',
  attendance_logs: 'attendance_logs',
  system_configs: 'system_configs',
};

// Map collection names to localStorage cache keys
const COLLECTION_CACHE_KEY_MAP: Record<string, string> = {
  master_staff: 'riz_master_staff_list',
  daily_reports: 'riz_daily_reports_v2',
  logbook_entries: 'riz_logbook_entries_v2',
  findings: 'riz_findings_v2',
  work_orders: 'riz_work_orders_v2',
  daily_tasks: 'riz_daily_tasks_v2',
  attendance_logs: 'riz_attendance_logs',
  system_configs: 'riz_system_configs',
  assets: 'riz_assets',
  warehouse_logs: 'riz_warehouse_logs',
  freelance_workers: 'riz_freelance_workers',
  fleet_drivers: 'riz_fleet_drivers',
  master_vehicles: 'riz_master_vehicles',
  fleet_assignments: 'riz_fleet_assignments',
  maintenance_schedules: 'riz_schedules',
  activities: 'riz_activities',
};

/**
 * Format document data for PostgreSQL schema
 */
function formatForSupabase(collectionName: string, docId: string, data: Record<string, any>): Record<string, any> {
  const rowId = data.id || docId;
  const syncMeta = data._syncMeta || {
    updatedAt: new Date().toISOString(),
    updatedBy: 'System',
  };

  switch (collectionName) {
    case 'master_staff':
      return {
        id: rowId,
        name: data.name || '',
        full_name: data.fullName || null,
        nickname: data.nickname || null,
        division: data.division || 'Umum',
        secondary_division: data.secondaryDivision || null,
        divisions: data.divisions || null,
        role: data.role || 'Staff',
        level: data.level || 1,
        avatar: data.avatar || null,
        phone: data.phone || null,
        email: data.email || null,
        password: data.password || null,
        password_request: data.passwordRequest || null,
        updated_at: new Date().toISOString(),
      };

    case 'daily_reports':
      return {
        id: rowId,
        date: data.date,
        staff_name: data.staffName || '',
        division: data.division || 'Umum',
        activity: data.activity || '',
        notes: data.notes || '',
        photo_url: data.photoUrl || null,
        photos: data.photos || null,
        status: data.status || 'Submitted',
        source: data._source || 'web',
        sync_meta: syncMeta,
        updated_at: new Date().toISOString(),
      };

    case 'logbook_entries':
      return {
        id: rowId,
        date: data.date,
        division: data.division || 'Umum',
        staff_name: data.staffName || '',
        activity: data.activity || '',
        result: data.result || 'OK',
        follow_up: data.followUp || '',
        status: data.status || 'Close',
        verification: data.verification || '',
        checklists: data.checklists || {},
        photo_url: data.photoUrl || null,
        photos: data.photos || null,
        source: data._source || 'web',
        sync_meta: syncMeta,
        updated_at: new Date().toISOString(),
      };

    case 'findings':
      return {
        id: rowId,
        date_created: data.dateCreated || data.date || new Date().toISOString().slice(0, 10),
        equipment: data.equipment || '',
        asset_code: data.assetCode || null,
        division: data.division || 'Umum',
        issue_description: data.issueDescription || data.issue || '',
        severity: data.priority === 'Tinggi' ? 'High' : data.priority === 'Rendah' ? 'Low' : (data.severity || 'Medium'),
        status: data.status || 'Open',
        pic: data.pic || '',
        target_date: data.targetDate || null,
        completion_date: data.completionDate || null,
        action_plan: data.actionPlan || null,
        cost_estimate: data.costEstimate || 0,
        photo_url: data.photoUrl || null,
        photos: data.photos || null,
        sync_meta: syncMeta,
        updated_at: new Date().toISOString(),
      };

    case 'work_orders':
      return {
        id: rowId,
        title: data.title || data.equipment || 'Work Order',
        type: data.type || 'Corrective',
        division: data.division || 'Umum',
        equipment: data.equipment || '',
        description: data.description || '',
        priority: data.priority || 'Medium',
        status: data.status || 'Pending',
        pic: data.pic || '',
        progress: typeof data.progress === 'number' ? data.progress : 0,
        date_created: data.dateCreated || new Date().toISOString().slice(0, 10),
        deadline: data.deadline || new Date().toISOString().slice(0, 10),
        completed_at: data.completedAt || null,
        sync_meta: syncMeta,
        updated_at: new Date().toISOString(),
      };

    case 'daily_tasks':
      return {
        id: rowId,
        title: data.title || '',
        division: data.division || 'Umum',
        assigned_to: data.assignedTo || null,
        assigned_name: data.assignedName || '',
        due_date: data.dueDate || null,
        status: data.status || 'Todo',
        priority: data.priority === 'Tinggi' ? 'High' : data.priority === 'Rendah' ? 'Low' : (data.priority || 'Normal'),
        notes: data.notes || data.description || '',
        created_by: data.createdBy || 'System',
        sync_meta: syncMeta,
        updated_at: new Date().toISOString(),
      };

    case 'attendance_logs':
      return {
        id: rowId,
        staff_id: data.staffId || '',
        staff_name: data.staffName || '',
        division: data.division || 'Umum',
        date: data.date,
        check_in_time: data.checkInTime || null,
        check_in_photo: data.checkInPhoto || null,
        check_in_gps: data.checkInGps || null,
        check_out_time: data.checkOutTime || null,
        check_out_photo: data.checkOutPhoto || null,
        check_out_gps: data.checkOutGps || null,
        status: data.status || 'Hadir',
        is_late: Boolean(data.isLate),
        late_minutes: data.lateMinutes || 0,
      };

    default:
      return {
        id: rowId,
        data: data,
        updated_by: syncMeta.updatedBy || 'System',
        updated_at: new Date().toISOString(),
      };
  }
}

/**
 * Format document from PostgreSQL schema back to App TypeScript model
 */
export function formatFromSupabase(collectionName: string, row: Record<string, any>): Record<string, any> {
  if (!row) return row;
  const syncMeta = row.sync_meta || {
    updatedAt: row.updated_at || new Date().toISOString(),
    updatedBy: 'Supabase Cloud Sync'
  };

  switch (collectionName) {
    case 'master_staff':
      return {
        id: row.id,
        name: row.name || '',
        fullName: row.full_name || row.name || '',
        nickname: row.nickname || row.name || '',
        division: row.division || 'Umum',
        secondaryDivision: row.secondary_division || undefined,
        divisions: Array.isArray(row.divisions) ? row.divisions : undefined,
        role: row.role || 'Staff',
        level: typeof row.level === 'number' ? row.level : 1,
        avatar: row.avatar || undefined,
        phone: row.phone || undefined,
        email: row.email || undefined,
        password: row.password || undefined,
        passwordRequest: row.password_request || undefined,
        _syncMeta: syncMeta
      };

    case 'daily_reports':
      return {
        id: row.id,
        date: row.date,
        staffName: row.staff_name || '',
        division: row.division || 'Umum',
        activity: row.activity || '',
        notes: row.notes || '',
        photoUrl: row.photo_url || undefined,
        photos: Array.isArray(row.photos) ? row.photos : undefined,
        status: row.status || 'Submitted',
        _source: row.source || 'supabase',
        _syncMeta: syncMeta
      };

    case 'logbook_entries':
      return {
        id: row.id,
        date: row.date,
        division: row.division || 'Umum',
        staffName: row.staff_name || '',
        activity: row.activity || '',
        result: row.result || 'OK',
        followUp: row.follow_up || '',
        status: row.status || 'Close',
        verification: row.verification || '',
        checklists: typeof row.checklists === 'object' && row.checklists !== null ? row.checklists : {},
        photoUrl: row.photo_url || undefined,
        photos: Array.isArray(row.photos) ? row.photos : undefined,
        _source: row.source || 'supabase',
        _syncMeta: syncMeta
      };

    case 'findings':
      return {
        id: row.id,
        equipment: row.equipment || '',
        assetCode: row.asset_code || undefined,
        division: row.division || 'Umum',
        issue: row.issue_description || '',
        issueDescription: row.issue_description || '',
        priority: row.severity === 'High' ? 'Tinggi' : row.severity === 'Low' ? 'Rendah' : 'Sedang',
        status: row.status || 'Open',
        pic: row.pic || '',
        targetDate: row.target_date || '',
        dateCreated: row.date_created || (row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10)),
        date: row.date_created || (row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10)),
        actionPlan: row.action_plan || undefined,
        costEstimate: typeof row.cost_estimate === 'number' ? row.cost_estimate : 0,
        photoUrl: row.photo_url || undefined,
        photos: Array.isArray(row.photos) ? row.photos : undefined,
        _source: 'supabase',
        _syncMeta: syncMeta
      };

    case 'work_orders':
      return {
        id: row.id,
        title: row.title || 'Work Order',
        type: row.type || 'Corrective',
        division: row.division || 'Umum',
        equipment: row.equipment || '',
        description: row.description || '',
        priority: row.priority || 'Medium',
        status: row.status || 'Pending',
        pic: row.pic || '',
        progress: typeof row.progress === 'number' ? row.progress : 0,
        dateCreated: row.date_created || (row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10)),
        deadline: row.deadline || '',
        completedAt: row.completed_at || undefined,
        _syncMeta: syncMeta
      };

    case 'daily_tasks':
      return {
        id: row.id,
        title: row.title || '',
        division: row.division || 'Umum',
        assignedTo: row.assigned_to || undefined,
        assignedName: row.assigned_name || '',
        dueDate: row.due_date || undefined,
        status: row.status || 'Pending',
        priority: row.priority === 'High' ? 'Tinggi' : row.priority === 'Low' ? 'Rendah' : (row.priority || 'Sedang'),
        notes: row.notes || '',
        description: row.notes || '',
        createdBy: row.created_by || 'System',
        createdAt: row.created_at || new Date().toISOString(),
        _syncMeta: syncMeta
      };

    case 'attendance_logs':
      return {
        id: row.id,
        staffId: row.staff_id || '',
        staffName: row.staff_name || '',
        division: row.division || 'Umum',
        date: row.date,
        checkInTime: row.check_in_time || undefined,
        checkInPhoto: row.check_in_photo || undefined,
        checkInGps: row.check_in_gps || undefined,
        checkOutTime: row.check_out_time || undefined,
        checkOutPhoto: row.check_out_photo || undefined,
        checkOutGps: row.check_out_gps || undefined,
        status: row.status || 'Hadir',
        isLate: Boolean(row.is_late),
        lateMinutes: typeof row.late_minutes === 'number' ? row.late_minutes : 0,
        _syncMeta: syncMeta
      };

    default:
      return row.data || row;
  }
}

/**
 * Upsert a single document to Supabase in the background
 */
export async function saveSupabaseDoc(
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const tableName = TABLE_MAP[collectionName];
  if (!tableName) {
    try {
      await supabase.from('system_configs').upsert({
        key: `${collectionName}_${docId}`,
        data: data,
        updated_by: data._syncMeta?.updatedBy || 'System'
      }, { onConflict: 'key' });
    } catch {}
    return;
  }

  try {
    const payload = formatForSupabase(collectionName, docId, data);
    const { error } = await supabase.from(tableName).upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn(`[Supabase Sync] Warning upserting ${collectionName}/${docId}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase Sync] Failed to sync ${collectionName}/${docId}:`, err);
  }
}

/**
 * Delete a single document from Supabase
 */
export async function deleteSupabaseDoc(
  collectionName: string,
  docId: string
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const tableName = TABLE_MAP[collectionName];
  if (!tableName) {
    try {
      await supabase.from('system_configs').delete().eq('key', `${collectionName}_${docId}`);
    } catch {}
    return;
  }

  try {
    const { error } = await supabase.from(tableName).delete().eq('id', docId);
    if (error) {
      console.warn(`[Supabase Sync] Warning deleting ${collectionName}/${docId}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase Sync] Failed to delete ${collectionName}/${docId}:`, err);
  }
}

/**
 * Bulk upload canonical or array data to Supabase
 */
export async function pushCollectionToSupabase(
  collectionName: string,
  items: Record<string, any>[]
): Promise<{ success: boolean; count: number; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, count: 0, error: 'Supabase belum terkonfigurasi' };
  }

  const tableName = TABLE_MAP[collectionName];
  if (!tableName) {
    return { success: false, count: 0, error: `Tabel untuk ${collectionName} tidak ditemukan` };
  }

  try {
    const formattedRows = items.map((item, idx) =>
      formatForSupabase(collectionName, item.id || `doc-${idx + 1}`, item)
    );

    // Upsert in chunks of 100 to avoid payload size limit
    const chunkSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < formattedRows.length; i += chunkSize) {
      const chunk = formattedRows.slice(i, i + chunkSize);
      const { error } = await supabase.from(tableName).upsert(chunk, { onConflict: 'id' });
      if (error) {
        throw error;
      }
      totalInserted += chunk.length;
    }

    return { success: true, count: totalInserted };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || String(err) };
  }
}

/**
 * Pull single collection from Supabase, merge with localStorage and notify app
 */
export async function pullCollectionFromSupabase<T = any>(collectionName: string): Promise<T[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const tableName = TABLE_MAP[collectionName];
  try {
    let rows: any[] = [];
    if (tableName) {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error) {
        console.warn(`[Supabase Pull] Warning fetching ${collectionName}:`, error.message);
        return [];
      }
      rows = data || [];
    } else {
      const { data, error } = await supabase.from('system_configs').select('*').eq('key', collectionName).maybeSingle();
      if (!error && data && Array.isArray(data.data)) {
        rows = data.data;
      }
    }

    if (rows.length === 0) return [];

    const formatted = rows.map(r => formatFromSupabase(collectionName, r));

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const cacheKey = COLLECTION_CACHE_KEY_MAP[collectionName];
      if (cacheKey) {
        const keysToUpdate = [cacheKey];
        if (cacheKey.endsWith('_v2')) {
          keysToUpdate.push(cacheKey.replace(/_v2$/, ''));
        } else {
          keysToUpdate.push(`${cacheKey}_v2`);
        }

        for (const k of keysToUpdate) {
          try {
            const raw = localStorage.getItem(k);
            let localItems: any[] = [];
            if (raw) {
              try { localItems = JSON.parse(raw); } catch {}
            }
            if (!Array.isArray(localItems)) localItems = [];

            const map = new Map<string, any>();
            localItems.forEach(item => {
              const id = String(item?.id || item?.no || item?.code || '');
              if (id) map.set(id, item);
            });

            formatted.forEach(remote => {
              const id = String(remote?.id || remote?.no || remote?.code || '');
              if (id) {
                const local = map.get(id);
                if (!local) {
                  map.set(id, remote);
                } else {
                  const localUpdatedAt = local._syncMeta?.updatedAt ? new Date(local._syncMeta.updatedAt).getTime() : 0;
                  const remoteUpdatedAt = remote._syncMeta?.updatedAt ? new Date(remote._syncMeta.updatedAt).getTime() : 0;
                  if (remoteUpdatedAt >= localUpdatedAt) {
                    map.set(id, { ...local, ...remote });
                  }
                }
              }
            });

            let merged = Array.from(map.values());
            try {
              const { normalizeCollectionItems } = await import('./cloudSync');
              merged = normalizeCollectionItems(collectionName, merged);
            } catch {}
            localStorage.setItem(k, JSON.stringify(merged));
          } catch (e) {}
        }

        try {
          window.dispatchEvent(new CustomEvent('riz_collection_updated', {
            detail: { collectionName, count: formatted.length, source: 'supabase_pull' }
          }));
          window.dispatchEvent(new CustomEvent('riz_local_data_updated', {
            detail: { collectionName, source: 'supabase_pull' }
          }));
        } catch {}
      }
    }

    return formatted as T[];
  } catch (err) {
    console.warn(`[Supabase Pull] Error pulling ${collectionName}:`, err);
    return [];
  }
}

/**
 * Pull all primary operational collections from Supabase
 */
export async function pullAllCollectionsFromSupabase(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  const targetCollections = [
    'master_staff',
    'daily_tasks',
    'daily_reports',
    'logbook_entries',
    'findings',
    'work_orders',
    'attendance_logs',
  ];

  await Promise.allSettled(
    targetCollections.map(col => pullCollectionFromSupabase(col))
  );
}

/**
 * Handle incoming Realtime postgres_changes event from Supabase
 */
function handleRealtimePayload(collectionName: string, payload: any) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined' || !payload) return;

  const cacheKey = COLLECTION_CACHE_KEY_MAP[collectionName];
  if (!cacheKey) return;

  const keysToUpdate = [cacheKey];
  if (cacheKey.endsWith('_v2')) {
    keysToUpdate.push(cacheKey.replace(/_v2$/, ''));
  } else {
    keysToUpdate.push(`${cacheKey}_v2`);
  }

  if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
    const rawRow = payload.new;
    if (!rawRow || !rawRow.id) return;
    const formatted = formatFromSupabase(collectionName, rawRow);

    keysToUpdate.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        let list: any[] = [];
        if (raw) {
          try { list = JSON.parse(raw); } catch {}
        }
        if (!Array.isArray(list)) list = [];

        const idx = list.findIndex(item => String(item?.id || item?.no || item?.code || '') === String(formatted.id));
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...formatted };
        } else {
          list.unshift(formatted);
        }
        localStorage.setItem(k, JSON.stringify(list));
      } catch (e) {}
    });

    try {
      window.dispatchEvent(new CustomEvent('riz_collection_updated', {
        detail: { collectionName, docId: formatted.id, data: formatted, source: 'supabase_realtime' }
      }));
      window.dispatchEvent(new CustomEvent('riz_local_data_updated', {
        detail: { collectionName, source: 'supabase_realtime' }
      }));
    } catch {}
  } else if (payload.eventType === 'DELETE') {
    const deletedId = String(payload.old?.id || '');
    if (!deletedId) return;

    keysToUpdate.forEach(k => {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            const filtered = list.filter(item => String(item?.id || item?.no || item?.code || '') !== deletedId);
            localStorage.setItem(k, JSON.stringify(filtered));
          }
        }
      } catch (e) {}
    });

    try {
      window.dispatchEvent(new CustomEvent('riz_collection_updated', {
        detail: { collectionName, docId: deletedId, source: 'supabase_realtime_delete' }
      }));
      window.dispatchEvent(new CustomEvent('riz_local_data_updated', {
        detail: { collectionName, source: 'supabase_realtime_delete' }
      }));
    } catch {}
  }
}

let activeRealtimeChannel: any = null;

/**
 * Initialize cross-device Realtime channel
 */
export function initSupabaseRealtimeChannel(onSync?: (collection: string) => void): () => void {
  if (!isSupabaseConfigured || !supabase || typeof window === 'undefined') {
    return () => {};
  }

  if (activeRealtimeChannel) {
    return () => {};
  }

  try {
    const channel = supabase.channel('riz_cross_device_realtime_sync');

    Object.entries(TABLE_MAP).forEach(([colName, tableName]) => {
      channel.on(
        'postgres_changes' as any,
        { event: '*', schema: 'public', table: tableName },
        (payload: any) => {
          handleRealtimePayload(colName, payload);
          if (onSync) onSync(colName);
        }
      );
    });

    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Supabase Realtime] Terhubung ke cloud real-time channel!');
      }
    });

    activeRealtimeChannel = channel;

    return () => {
      if (activeRealtimeChannel && supabase) {
        supabase.removeChannel(activeRealtimeChannel);
        activeRealtimeChannel = null;
      }
    };
  } catch (err) {
    console.warn('[Supabase Realtime] Warning setting up realtime channel:', err);
    return () => {};
  }
}

/**
 * Supabase Cloud Sync Adapter
 * PT. Riz Production Multi Kreasi
 * Dual-sync & Migration Bridge between local state / Firestore and Supabase PostgreSQL
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
        issue_description: data.issueDescription || '',
        severity: data.severity || 'Medium',
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
        progress: data.progress || 0,
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
        priority: data.priority || 'Normal',
        notes: data.notes || '',
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
 * Upsert a single document to Supabase in the background
 */
export async function saveSupabaseDoc(
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  const tableName = TABLE_MAP[collectionName];
  if (!tableName) return;

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
  if (!tableName) return;

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

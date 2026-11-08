/**
 * Supabase Cloud Sync Adapter
 * PT. Riz Production Multi Kreasi
 * Sync & Persistence Bridge between local state and Supabase PostgreSQL
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { STAFF_LIST } from '../data';

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
  'schedule_2026-09': 'riz_schedule_2026-09',
  'schedule_2026-10': 'riz_schedule_2026-10',
  'schedule_2026-11': 'riz_schedule_2026-11',
  'schedule_2026-12': 'riz_schedule_2026-12',
  work_schedule: 'riz_work_schedule',
  custom_qc_checklists: 'riz_custom_qc_checklists',
  staff_competencies: 'riz_staff_electrical_competencies',
  career_records: 'riz_career_pipeline_records',
  job_assignments: 'riz_job_assignments_v1',
};

/**
 * Extract canonical YYYY-MM-DD date from deterministic record IDs
 * (e.g., dt-20261103-02, rep-20261101-..., fd-20261102-..., wo-20261104-...)
 */
function extractCanonicalDateFromId(id?: string): string | undefined {
  if (!id) return undefined;
  const m = String(id).match(/(20\d{2})-?(\d{2})-?(\d{2})/);
  if (!m) return undefined;
  const [, yyyy, mm, dd] = m;
  if (Number(mm) >= 1 && Number(mm) <= 12 && Number(dd) >= 1 && Number(dd) <= 31) {
    return `${yyyy}-${mm}-${dd}`;
  }
  return undefined;
}

/**
 * Format document data for PostgreSQL schema
 */
function formatForSupabase(collectionName: string, docId: string, data: Record<string, any>): Record<string, any> {
  const rowId = data.id || docId;
  const syncMeta = {
    updatedAt: new Date().toISOString(),
    updatedBy: 'System',
    ...(data._syncMeta || {}),
    ...(data._userEdited || data._syncMeta?._userEdited ? { _userEdited: true } : {}),
    ...(data._syncedAt || data._syncMeta?._syncedAt ? { _syncedAt: data._syncedAt || data._syncMeta?._syncedAt } : {}),
    ...(Array.isArray(data.rowDetails) ? { rowDetails: data.rowDetails } : {}),
  };

  switch (collectionName) {
    case 'master_staff': {
      const canonical = STAFF_LIST.find(s => s.id === rowId);
      let existingStaff: any = null;
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem('riz_master_staff_list');
          if (cached) {
            const list = JSON.parse(cached);
            if (Array.isArray(list)) {
              existingStaff = list.find((item: any) => String(item?.id) === String(rowId));
            }
          }
        } catch {}
      }

      const name = (data.name && String(data.name).trim().length > 0)
        ? data.name
        : (existingStaff?.name || canonical?.name || '');
      const fullName = data.fullName || data.full_name || existingStaff?.fullName || canonical?.fullName || name || null;
      const nickname = data.nickname || existingStaff?.nickname || canonical?.nickname || null;
      const division = (data.division && data.division !== 'Umum')
        ? data.division
        : (existingStaff?.division || canonical?.division || data.division || 'Umum');
      const role = (data.role && data.role !== 'Staff')
        ? data.role
        : (existingStaff?.role || canonical?.role || data.role || 'Staff');
      const level = data.level || existingStaff?.level || canonical?.level || 1;
      const email = data.email || existingStaff?.email || canonical?.email || null;
      const phone = data.phone || existingStaff?.phone || canonical?.phone || null;
      const avatar = data.avatar || existingStaff?.avatar || canonical?.avatar || null;
      const secondaryDivision = data.secondaryDivision || data.secondary_division || existingStaff?.secondaryDivision || canonical?.secondaryDivision || null;
      const divisions = data.divisions || existingStaff?.divisions || canonical?.divisions || null;

      // Handle password: if undefined in data, preserve existingStaff?.password
      const password = data.password !== undefined
        ? (data.password || null)
        : (existingStaff?.password || null);

      // Handle passwordRequest: if undefined in data, preserve existingStaff?.passwordRequest
      const passwordRequest = data.passwordRequest !== undefined
        ? (data.passwordRequest || null)
        : (existingStaff?.passwordRequest || null);

      return {
        id: rowId,
        name,
        full_name: fullName,
        nickname,
        division,
        secondary_division: secondaryDivision,
        divisions,
        role,
        level,
        avatar,
        phone,
        email,
        password,
        password_request: passwordRequest,
        updated_at: new Date().toISOString(),
      };
    }

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

    case 'findings': {
      const idDate = extractCanonicalDateFromId(rowId);
      return {
        id: rowId,
        date_created: idDate || data.dateCreated || data.date || new Date().toISOString().slice(0, 10),
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
    }

    case 'work_orders': {
      const idDate = extractCanonicalDateFromId(rowId);
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
        date_created: idDate || data.dateCreated || new Date().toISOString().slice(0, 10),
        deadline: data.deadline || idDate || new Date().toISOString().slice(0, 10),
        completed_at: data.completedAt || null,
        sync_meta: syncMeta,
        updated_at: new Date().toISOString(),
      };
    }

    case 'daily_tasks': {
      const idDate = extractCanonicalDateFromId(rowId);
      const effectiveDueDate = data.dueDate ? String(data.dueDate).slice(0, 10) : (idDate || null);
      const effectiveCreatedAt = idDate || (data.createdAt ? String(data.createdAt).slice(0, 10) : effectiveDueDate);
      return {
        id: rowId,
        title: data.title || '',
        division: data.division || 'Umum',
        assigned_to: data.assignedTo || null,
        assigned_name: data.assignedName || '',
        due_date: effectiveDueDate,
        status: data.status || 'Todo',
        priority: data.priority === 'Tinggi' ? 'High' : data.priority === 'Rendah' ? 'Low' : (data.priority || 'Normal'),
        notes: data.notes || data.description || '',
        created_by: data.createdBy || 'System',
        sync_meta: {
          ...syncMeta,
          createdAt: effectiveCreatedAt,
          dueDate: effectiveDueDate,
        },
        updated_at: new Date().toISOString(),
      };
    }

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
  const userEditedFlag = syncMeta?._userEdited ? { _userEdited: true } : {};
  const syncedAtFlag = syncMeta?._syncedAt ? { _syncedAt: syncMeta._syncedAt } : {};

  switch (collectionName) {
    case 'master_staff': {
      const hasCustomPwOrReq = Boolean((row.password && row.password !== 'riz123') || row.password_request);
      const staffMeta = {
        ...syncMeta,
        ...(hasCustomPwOrReq ? { _userEdited: true } : {})
      };
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
        password: row.password ? String(row.password).trim() : 'riz123',
        passwordRequest: row.password_request ? String(row.password_request).trim() : '',
        ...(hasCustomPwOrReq ? { _userEdited: true } : userEditedFlag),
        _syncMeta: staffMeta
      };
    }

    case 'daily_reports': {
      const idDate = extractCanonicalDateFromId(row.id);
      return {
        id: row.id,
        date: row.date || idDate || '',
        staffName: row.staff_name || '',
        division: row.division || 'Umum',
        activity: row.activity || '',
        notes: row.notes || '',
        rowDetails: Array.isArray(syncMeta?.rowDetails) ? syncMeta.rowDetails : undefined,
        photoUrl: row.photo_url || undefined,
        photos: Array.isArray(row.photos) ? row.photos : undefined,
        status: row.status || 'Submitted',
        _source: row.source || 'supabase',
        ...userEditedFlag,
        ...syncedAtFlag,
        _syncMeta: syncMeta
      };
    }

    case 'logbook_entries': {
      const idDate = extractCanonicalDateFromId(row.id);
      return {
        id: row.id,
        date: row.date || idDate || '',
        division: row.division || 'Umum',
        staffName: row.staff_name || '',
        activity: row.activity || '',
        result: row.result || 'OK',
        followUp: row.follow_up || '',
        rowDetails: Array.isArray(syncMeta?.rowDetails) ? syncMeta.rowDetails : undefined,
        status: row.status || 'Close',
        verification: row.verification || '',
        checklists: typeof row.checklists === 'object' && row.checklists !== null ? row.checklists : {},
        photoUrl: row.photo_url || undefined,
        photos: Array.isArray(row.photos) ? row.photos : undefined,
        _source: row.source || 'supabase',
        ...userEditedFlag,
        ...syncedAtFlag,
        _syncMeta: syncMeta
      };
    }

    case 'findings': {
      const idDate = extractCanonicalDateFromId(row.id);
      const effectiveDateCreated = idDate || row.date_created || (row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10));
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
        dateCreated: effectiveDateCreated,
        date: effectiveDateCreated,
        actionPlan: row.action_plan || undefined,
        costEstimate: typeof row.cost_estimate === 'number' ? row.cost_estimate : 0,
        photoUrl: row.photo_url || undefined,
        photos: Array.isArray(row.photos) ? row.photos : undefined,
        _source: 'supabase',
        ...userEditedFlag,
        _syncMeta: syncMeta
      };
    }

    case 'work_orders': {
      const idDate = extractCanonicalDateFromId(row.id);
      const effectiveDateCreated = idDate || row.date_created || (row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10));
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
        dateCreated: effectiveDateCreated,
        deadline: row.deadline || '',
        completedAt: row.completed_at || undefined,
        ...userEditedFlag,
        _syncMeta: syncMeta
      };
    }

    case 'daily_tasks': {
      const idDate = extractCanonicalDateFromId(row.id);
      const metaCreatedAt = row.sync_meta?.createdAt ? String(row.sync_meta.createdAt).slice(0, 10) : undefined;
      const dueDateVal = row.due_date ? String(row.due_date).slice(0, 10) : (idDate || undefined);
      // Jangan pernah menimpa tanggal tugas dengan row.created_at database Supabase!
      const effectiveCreatedAt =
        idDate ||
        metaCreatedAt ||
        dueDateVal ||
        (row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10));
      return {
        id: row.id,
        title: row.title || '',
        division: row.division || 'Umum',
        assignedTo: row.assigned_to || undefined,
        assignedName: row.assigned_name || '',
        dueDate: dueDateVal || effectiveCreatedAt,
        status: row.status || 'Pending',
        priority: row.priority === 'High' ? 'Tinggi' : row.priority === 'Low' ? 'Rendah' : (row.priority || 'Sedang'),
        notes: row.notes || '',
        description: row.notes || '',
        createdBy: row.created_by || 'System',
        createdAt: effectiveCreatedAt,
        ...userEditedFlag,
        _syncMeta: syncMeta
      };
    }

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
 * Persist staff password & passwordRequest to local lock and Supabase system_configs vault
 * so password changes and Admin approvals never get lost or overwritten by bulk syncs.
 */
export async function syncStaffPasswordVault(
  staffId: string,
  password: string | undefined | null,
  passwordRequest: string | undefined | null,
  updatedBy: string = 'User',
  updatedAtIso?: string
): Promise<void> {
  if (!staffId) return;
  const nowIso = updatedAtIso || new Date().toISOString();
  const cleanPw = password !== undefined && password !== null && String(password).trim() !== ''
    ? String(password).trim()
    : 'riz123';
  const cleanReq = passwordRequest !== undefined && passwordRequest !== null
    ? String(passwordRequest).trim()
    : '';

  const entry = {
    password: cleanPw,
    passwordRequest: cleanReq,
    updatedAt: nowIso,
    updatedBy
  };

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem('riz_staff_passwords_lock_v1');
      const map = raw ? JSON.parse(raw) : {};
      map[staffId] = entry;
      localStorage.setItem('riz_staff_passwords_lock_v1', JSON.stringify(map));
    } catch {}
  }

  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { data: existingRow } = await supabase
      .from('system_configs')
      .select('data')
      .eq('key', 'staff_passwords_v1')
      .maybeSingle();

    const currentMap = (existingRow?.data && typeof existingRow.data === 'object' && !Array.isArray(existingRow.data))
      ? { ...existingRow.data }
      : {};
    currentMap[staffId] = entry;

    await supabase.from('system_configs').upsert({
      key: 'staff_passwords_v1',
      data: currentMap,
      updated_by: updatedBy,
      updated_at: nowIso
    }, { onConflict: 'key' });
  } catch (err) {
    console.warn('[Supabase Sync] Warning syncing staff_passwords_v1 vault:', err);
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
    if (collectionName === 'master_staff' && (data.password !== undefined || data.passwordRequest !== undefined)) {
      await syncStaffPasswordVault(
        docId,
        payload.password || 'riz123',
        payload.password_request || '',
        data._syncMeta?.updatedBy || 'User',
        payload.updated_at
      );
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
    try {
      const { error } = await supabase.from('system_configs').upsert({
        key: collectionName,
        data: items,
        updated_by: 'System',
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
      // Bersihkan baris individual usang (misal master_vehicles_veh-1) agar tidak menimpa data koleksi terbaru
      await supabase.from('system_configs').delete().like('key', `${collectionName}_%`);
      if (error) {
        return { success: false, count: 0, error: error.message };
      }
      return { success: true, count: items.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || String(err) };
    }
  }

  try {
    let formattedRows = items.map((item, idx) =>
      formatForSupabase(collectionName, item.id || `doc-${idx + 1}`, item)
    );

    // Protect master_staff passwords & password_request from being wiped by bulk sync
    if (collectionName === 'master_staff') {
      try {
        const [{ data: existingStaffRows }, { data: vaultRow }] = await Promise.all([
          supabase.from('master_staff').select('id, password, password_request, updated_at'),
          supabase.from('system_configs').select('data').eq('key', 'staff_passwords_v1').maybeSingle()
        ]);
        const remoteStaffMap = new Map<string, any>();
        if (Array.isArray(existingStaffRows)) {
          existingStaffRows.forEach(r => { if (r?.id) remoteStaffMap.set(r.id, r); });
        }
        const vaultMap = (vaultRow?.data && typeof vaultRow.data === 'object' && !Array.isArray(vaultRow.data))
          ? vaultRow.data
          : {};

        formattedRows = formattedRows.map((row: any, idx: number) => {
          const rawItem = items[idx] || {};
          const itemTime = rawItem._syncMeta?.updatedAt ? new Date(rawItem._syncMeta.updatedAt).getTime() : 0;
          const remoteRow = remoteStaffMap.get(row.id);
          const vaultEntry = vaultMap[row.id];
          const remoteTime = Math.max(
            remoteRow?.updated_at ? new Date(remoteRow.updated_at).getTime() : 0,
            vaultEntry?.updatedAt ? new Date(vaultEntry.updatedAt).getTime() : 0
          );
          const remotePw = vaultEntry?.password || remoteRow?.password || null;
          const remoteReq = (vaultEntry?.passwordRequest !== undefined ? vaultEntry.passwordRequest : remoteRow?.password_request) || null;

          // If remote has a newer timestamp or if local item has default/empty password while remote has a custom password/request
          if (remoteTime > itemTime || (!rawItem._userEdited && (remotePw || remoteReq))) {
            return {
              ...row,
              password: remotePw !== null ? remotePw : row.password,
              password_request: remoteReq !== null ? remoteReq : row.password_request,
            };
          }
          return row;
        });
      } catch (e) {
        console.warn('[Supabase Sync] Warning checking existing master_staff passwords before bulk push:', e);
      }
    }

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
      const { data: bulkData, error: bulkErr } = await supabase.from('system_configs').select('*').eq('key', collectionName).maybeSingle();
      if (!bulkErr && bulkData && Array.isArray(bulkData.data)) {
        rows = [...bulkData.data];
      }
      const { data: singleDocs, error: singleErr } = await supabase.from('system_configs').select('*').like('key', `${collectionName}_%`);
      if (!singleErr && Array.isArray(singleDocs) && singleDocs.length > 0) {
        const rowMap = new Map<string, any>();
        rows.forEach((r, idx) => {
          const rid = String(r?.id || r?.no || r?.code || `idx-${idx}`);
          rowMap.set(rid, r);
        });
        const bulkUpdatedAt = bulkData?.updated_at ? new Date(bulkData.updated_at).getTime() : 0;
        singleDocs.forEach(docRow => {
          if (docRow && docRow.data && typeof docRow.data === 'object') {
            const d = docRow.data;
            const did = String(d?.id || d?.no || d?.code || docRow.key.replace(`${collectionName}_`, ''));
            const existing = rowMap.get(did);
            if (!existing) {
              rowMap.set(did, d);
            } else {
              const existingTime = existing._syncMeta?.updatedAt ? new Date(existing._syncMeta.updatedAt).getTime() : bulkUpdatedAt;
              const singleTime = d._syncMeta?.updatedAt ? new Date(d._syncMeta.updatedAt).getTime() : (docRow.updated_at ? new Date(docRow.updated_at).getTime() : 0);
              const singleUserEdited = Boolean(d._userEdited || d._syncMeta?._userEdited);
              const existingUserEdited = Boolean(existing._userEdited || existing._syncMeta?._userEdited);
              if ((singleUserEdited && !existingUserEdited) || singleTime > existingTime) {
                rowMap.set(did, { ...existing, ...d });
              }
            }
          }
        });
        rows = Array.from(rowMap.values());
      }
    }

    if (rows.length === 0) return [];

    let formatted = rows.map(r => formatFromSupabase(collectionName, r));

    // Hydrate master_staff with authoritative passwords from staff_passwords_v1 vault if present
    if (collectionName === 'master_staff') {
      try {
        const { data: vaultRow } = await supabase
          .from('system_configs')
          .select('data')
          .eq('key', 'staff_passwords_v1')
          .maybeSingle();

        const remoteVault = (vaultRow?.data && typeof vaultRow.data === 'object' && !Array.isArray(vaultRow.data))
          ? vaultRow.data
          : {};

        let mergedVault: Record<string, any> = { ...remoteVault };
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          try {
            const rawLocalVault = localStorage.getItem('riz_staff_passwords_lock_v1');
            const localVault = rawLocalVault ? JSON.parse(rawLocalVault) : {};
            Object.keys(localVault).forEach(sid => {
              const lEntry = localVault[sid];
              const rEntry = remoteVault[sid];
              const lTime = lEntry?.updatedAt ? new Date(lEntry.updatedAt).getTime() : 0;
              const rTime = rEntry?.updatedAt ? new Date(rEntry.updatedAt).getTime() : 0;
              // If remote resolved a pending passwordRequest (Admin approved/rejected), remote wins even if clocks differ
              const adminResolvedRequest = Boolean(lEntry?.passwordRequest && rEntry && !rEntry.passwordRequest);
              if (!rEntry && lTime > 0) {
                mergedVault[sid] = lEntry;
              } else if (rEntry && (adminResolvedRequest || rTime >= lTime)) {
                mergedVault[sid] = rEntry;
              } else if (lEntry) {
                mergedVault[sid] = lEntry;
              }
            });
          } catch {}
        }

        formatted = formatted.map((staffItem: any) => {
          const sid = String(staffItem?.id || '');
          const vEntry = mergedVault[sid];
          const rowTime = staffItem._syncMeta?.updatedAt ? new Date(staffItem._syncMeta.updatedAt).getTime() : 0;
          const vTime = vEntry?.updatedAt ? new Date(vEntry.updatedAt).getTime() : 0;

          if (vEntry && vTime >= rowTime) {
            const finalPw = vEntry.password ? String(vEntry.password).trim() : (staffItem.password || 'riz123');
            const finalReq = vEntry.passwordRequest !== undefined ? String(vEntry.passwordRequest).trim() : (staffItem.passwordRequest || '');
            return {
              ...staffItem,
              password: finalPw,
              passwordRequest: finalReq,
              _userEdited: true,
              _syncMeta: {
                ...(staffItem._syncMeta || {}),
                updatedAt: vEntry.updatedAt || staffItem._syncMeta?.updatedAt || new Date().toISOString(),
                updatedBy: vEntry.updatedBy || staffItem._syncMeta?.updatedBy || 'Supabase Cloud Sync',
                _userEdited: true
              }
            };
          } else {
            // Update vault entry from master_staff row if master_staff row is newer
            if ((staffItem.password && staffItem.password !== 'riz123') || staffItem.passwordRequest) {
              mergedVault[sid] = {
                password: staffItem.password || 'riz123',
                passwordRequest: staffItem.passwordRequest || '',
                updatedAt: staffItem._syncMeta?.updatedAt || new Date().toISOString(),
                updatedBy: staffItem._syncMeta?.updatedBy || 'Supabase Cloud Sync'
              };
            }
            return staffItem;
          }
        });

        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem('riz_staff_passwords_lock_v1', JSON.stringify(mergedVault));
          } catch {}
        }
      } catch (e) {
        console.warn('[Supabase Pull] Warning hydrating staff_passwords_v1:', e);
      }
    }

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
                  const localUserEdited = Boolean(local._userEdited || local._syncMeta?._userEdited);
                  const remoteUserEdited = Boolean(remote._userEdited || remote._syncMeta?._userEdited);

                  if (collectionName === 'master_staff') {
                    // For master_staff: if Admin approved/rejected a pending request or updated password in Cloud, always accept remote
                    const requestWasResolvedRemotely = Boolean(local.passwordRequest && !remote.passwordRequest);
                    const passwordChangedRemotely = Boolean(remote.password && remote.password !== local.password && (remote.password !== 'riz123' || requestWasResolvedRemotely));
                    const requestAddedRemotely = Boolean(remote.passwordRequest && remote.passwordRequest !== local.passwordRequest);
                    if (requestWasResolvedRemotely || passwordChangedRemotely || requestAddedRemotely || remoteUpdatedAt >= localUpdatedAt || (!localUserEdited && localUpdatedAt === 0)) {
                      map.set(id, { ...local, ...remote });
                    }
                  } else if (localUserEdited && !remoteUserEdited && remoteUpdatedAt <= localUpdatedAt) {
                    // Pertahankan hasil editan user lokal agar tidak tertimpa data default lama dari server
                  } else if (remoteUpdatedAt > localUpdatedAt || (!localUserEdited && localUpdatedAt === 0)) {
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
    'master_vehicles',
    'warehouse_logs',
    'freelance_workers',
    'fleet_drivers',
    'fleet_assignments',
    'schedule_2026-09',
    'schedule_2026-10',
    'schedule_2026-11',
    'schedule_2026-12',
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

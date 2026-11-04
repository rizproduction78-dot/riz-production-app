import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Filter,
  Clock,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  CheckCheck,
  Wrench,
  Music2,
  SunMedium,
  Tv,
  Laptop,
  Folder,
  ExternalLink,
  FileText,
  ClipboardList,
  UserCheck,
  Activity,
  Package,
  Sparkles,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import {
  DailyReport,
  LogbookEntry,
  Finding,
  DailyTask,
  WorkOrder,
  AttendanceLog,
  UserActivity,
  WarehouseLog,
  VehicleMaster,
  OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL,
  OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL
} from '../types';
import { getVehicleExpiryAlerts } from '../utils/vehicleExpiryAlerts';
import { INITIAL_VEHICLES, INITIAL_DAILY_REPORTS } from '../data';
import { formatMonthLabel } from '../data/staffSchedules';

export interface QCNotificationCenterProps {
  dailyReports?: DailyReport[];
  logbookEntries?: LogbookEntry[];
  findings?: Finding[];
  dailyTasks?: DailyTask[];
  warehouseLogs?: WarehouseLog[];
  workOrders?: WorkOrder[];
  attendanceLogs?: AttendanceLog[];
  activities?: UserActivity[];
  vehicles?: VehicleMaster[];
  lastSyncTime?: string | Date | null;
  onNavigateTab?: (tabId: string) => void;
  onSyncSheet?: () => void;
  isSyncingSheet?: boolean;
  buttonClassName?: string;
  isMobileHeader?: boolean;
  activeMonth?: string;
}

const READ_STORAGE_KEY = 'riz_notification_center_last_read_v3';
const READ_STORAGE_KEY_LEGACY = 'riz_notification_center_last_read_v2';
const READ_IDS_STORAGE_KEY = 'riz_notification_read_ids_v3';
const DISMISSED_TOASTS_KEY = 'riz_notification_dismissed_toast_ids_v3';
const KNOWN_REVISIONS_STORAGE_KEY = 'riz_notification_known_revisions_v4';

const getStoredReadIds = (): Set<string> => {
  try {
    const saved = localStorage.getItem(READ_IDS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set<string>();
};

const saveStoredReadIds = (ids: Set<string>) => {
  try {
    const arr = Array.from(ids).slice(-2000);
    localStorage.setItem(READ_IDS_STORAGE_KEY, JSON.stringify(arr));
  } catch {}
};

const getStoredDismissedToastIds = (): Set<string> => {
  try {
    const saved = localStorage.getItem(DISMISSED_TOASTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch {}
  return new Set<string>();
};

const saveStoredDismissedToastIds = (ids: Set<string>) => {
  try {
    const arr = Array.from(ids).slice(-2000);
    localStorage.setItem(DISMISSED_TOASTS_KEY, JSON.stringify(arr));
  } catch {}
};

const getStoredKnownRevisions = (): Map<string, string> => {
  try {
    const saved = localStorage.getItem(KNOWN_REVISIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return new Map<string, string>(Object.entries(parsed));
      }
    }
  } catch {}
  return new Map<string, string>();
};

const saveStoredKnownRevisions = (map: Map<string, string>) => {
  try {
    const entries = Array.from(map.entries()).slice(-1500);
    localStorage.setItem(KNOWN_REVISIONS_STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {}
};

export type NotificationCategory =
  | 'Semua'
  | 'Daily Task'
  | 'Daily Log'
  | 'Temuan Unit Bermasalah'
  | 'Mutasi Unit Gudang';

export interface PairedActivityRow {
  activity: string;
  remark: string;
  isNg: boolean;
}

export interface NotificationItem {
  id: string;
  date: string;
  time?: string;
  staffName: string;
  division: string;
  category: 'Daily Task' | 'Daily Log' | 'Temuan Unit Bermasalah' | 'Mutasi Unit Gudang';
  title: string;
  subtitle?: string;
  metaBadge?: string;
  activity: string;
  notes?: string;
  pairedRows?: PairedActivityRow[];
  qcResult: 'OK' | 'NG' | 'INFO';
  timestamp: number;
  updatedAtMs?: number;
  revisionKey?: string;
  source: string;
  targetTab: string;
}

// Kata kunci spesifik temuan kendala / kerusakan nyata
const STRICT_FINDING_TERMS = [
  'dead pixel',
  'ilang jalur',
  'hilang jalur',
  'ganti jalur',
  'kena ic',
  'ganti ic warna',
  'mati total',
  'led merah mati',
  'red mati',
  'warm separo',
  'red separo',
  'separo',
  'suara serak',
  'serak',
  'suara kecil',
  'error',
  'eror',
  'rusak',
  'hilang',
  'los 1 unit',
  '1 unit los',
  'ganti ptc',
  'minus breket',
  'blm clear',
  'belum clear',
  'belum normal',
  'masih bermasalah',
  'bermasalah',
  'minta ganti',
  'ga bisa ngisi',
  'tidak bisa ngisi',
  'ga bisa input',
  'twiter mati',
  'tweeter mati',
  'twitwe kecil',
  'mesin mati',
  'tidak komplite',
  'pcb bengkok',
  'servise berat',
  'service berat',
  'kirim ke pib',
  'modul rusak',
  'korslet',
  'konslet',
  'bocor'
];

function extractDateFromId(idStr?: string): string | undefined {
  if (!idStr) return undefined;
  const m = String(idStr).match(/(20\d{2})-?(\d{2})-?(\d{2})/);
  if (!m) return undefined;
  const [, yyyy, mm, dd] = m;
  if (Number(mm) >= 1 && Number(mm) <= 12 && Number(dd) >= 1 && Number(dd) <= 31) {
    return `${yyyy}-${mm}-${dd}`;
  }
  return undefined;
}

export default function QCNotificationCenter({
  dailyReports = [],
  logbookEntries = [],
  findings = [],
  dailyTasks = [],
  warehouseLogs = [],
  workOrders = [],
  attendanceLogs = [],
  activities = [],
  vehicles = [],
  lastSyncTime,
  onNavigateTab,
  onSyncSheet,
  isSyncingSheet = false,
  buttonClassName = '',
  isMobileHeader = false,
  activeMonth = 'all'
}: QCNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('Semua');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NG' | 'OK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveToast, setLiveToast] = useState<NotificationItem | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(50);

  // Sumber armada kendaraan aktif
  const effectiveVehicles = useMemo<VehicleMaster[]>(() => {
    if (Array.isArray(vehicles) && vehicles.length > 0) return vehicles;
    try {
      const saved = localStorage.getItem('riz_master_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const flat = parsed.flatMap((item: any) => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter((v: any) => Boolean(v && typeof v === 'object' && (v.name || v.policeNumber)));
          if (valid.length > 0) return valid as VehicleMaster[];
        }
      }
    } catch {}
    return INITIAL_VEHICLES;
  }, [vehicles]);

  const [readIds, setReadIds] = useState<Set<string>>(() => getStoredReadIds());
  const [dismissedToastIds, setDismissedToastIds] = useState<Set<string>>(() => getStoredDismissedToastIds());
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY) || localStorage.getItem(READ_STORAGE_KEY_LEGACY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const knownRevisionsRef = useRef<Map<string, string>>(getStoredKnownRevisions());
  const isInitialLoadRef = useRef<boolean>(true);
  const [recentUpdatedIds, setRecentUpdatedIds] = useState<Set<string>>(() => new Set<string>());
  const [drawerSessionUnreadIds, setDrawerSessionUnreadIds] = useState<Set<string>>(() => new Set<string>());

  // Sinkronisasi antar-tab & antar-instance (Desktop & Mobile Header)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedRead = localStorage.getItem(READ_STORAGE_KEY) || localStorage.getItem(READ_STORAGE_KEY_LEGACY);
        if (savedRead) setLastReadTimestamp(parseInt(savedRead, 10));
        setReadIds(getStoredReadIds());
        setDismissedToastIds(getStoredDismissedToastIds());
        knownRevisionsRef.current = getStoredKnownRevisions();
      } catch {}
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('riz-notification-sync', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('riz-notification-sync', syncFromStorage);
    };
  }, []);

  // Reset display limit saat filter berubah
  useEffect(() => {
    setDisplayLimit(50);
  }, [selectedDivision, selectedCategory, statusFilter, searchQuery, activeMonth]);

  // Kunci scroll halaman ketika drawer terbuka & dengarkan tombol Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [isOpen]);

  // Ekstraksi timestamp yang aman dan presisi
  const parseSafeTimestamp = (dateStr?: string, timeStr?: string, idStr?: string): number => {
    if (!dateStr) return Date.now();
    
    // Format ISO lengkap dengan T
    if (dateStr.includes('T')) {
      const parsedIso = new Date(dateStr).getTime();
      if (!isNaN(parsedIso)) return parsedIso;
    }

    const cleanDate = dateStr.slice(0, 10);
    const cleanTime = timeStr && /^\d{1,2}:\d{2}/.test(timeStr) ? timeStr : '12:00';
    const isoCombined = `${cleanDate}T${cleanTime.length === 5 ? cleanTime + ':00' : cleanTime}+07:00`;
    const combinedVal = new Date(isoCombined).getTime();
    if (!isNaN(combinedVal)) return combinedVal;

    const baseVal = new Date(cleanDate).getTime();
    return isNaN(baseVal) ? Date.now() : baseVal;
  };

  // Ekstraksi waktu sinkronisasi/update aktual untuk deteksi notifikasi masuk secara live
  const parseLiveUpdateTimestamp = (rawItem: any, fallbackTs: number): number => {
    if (!rawItem) return fallbackTs;
    const syncedAt = rawItem._syncedAt;
    if (syncedAt && typeof syncedAt === 'string') {
      const parsed = new Date(syncedAt).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    const metaUpdated = rawItem._syncMeta?.updatedAt;
    const metaBy = rawItem._syncMeta?.updatedBy;
    if (metaUpdated && typeof metaUpdated === 'string' && metaBy !== 'System Canonical Sync' && metaBy !== 'BatchSync') {
      const parsed = new Date(metaUpdated).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    return fallbackTs;
  };

  const buildRevisionKey = (id: string, activity: string, notes?: string, qcResult?: string): string => {
    return `${id}::${String(activity || '').trim()}::${String(notes || '').trim()}::${qcResult || ''}`;
  };

  const isRowKendalaText = (text?: string): boolean => {
    if (!text) return false;
    const lower = String(text).toLowerCase();
    return STRICT_FINDING_TERMS.some(t => lower.includes(t));
  };

  // Menggabungkan HANYA 4 SUMBER INPUT OPERASIONAL RESMI:
  // 1. Daily Task
  // 2. Daily Log (Daily Report & Logbook QC)
  // 3. Temuan Unit Bermasalah Oleh Semua Divisi
  // 4. Unit Yang Dikeluarkan dan Diterima Oleh Divisi Gudang / Warehouse
  // Tersinkronisasi dinamis dengan periode bulan aktif (activeMonth)
  const notifications = useMemo(() => {
    const list: NotificationItem[] = [];
    const seenIds = new Set<string>();
    const seenContentKeys = new Set<string>();
    const filterMonth = activeMonth && activeMonth !== 'all' ? activeMonth : null;

    // Peta referensi cepat rowDetails dari laporan harian (termasuk fallback canonical)
    const canonicalRowDetailsById = new Map<string, Array<{ activity: string; remark: string }>>();
    const rowDetailsByDateStaff = new Map<string, Array<{ activity: string; remark: string }>>();

    INITIAL_DAILY_REPORTS.forEach(r => {
      if (r && r.id && Array.isArray(r.rowDetails) && r.rowDetails.length > 0) {
        canonicalRowDetailsById.set(r.id, r.rowDetails);
        const normStaff = String(r.staffName || '').toLowerCase().trim();
        const dKey = `${String(r.date || '').slice(0, 10)}_${normStaff}`;
        rowDetailsByDateStaff.set(dKey, r.rowDetails);
      }
    });

    dailyReports.forEach(r => {
      if (r && r.id && Array.isArray(r.rowDetails) && r.rowDetails.length > 0) {
        canonicalRowDetailsById.set(r.id, r.rowDetails);
        const normStaff = String(r.staffName || '').toLowerCase().trim();
        const dKey = `${String(r.date || '').slice(0, 10)}_${normStaff}`;
        rowDetailsByDateStaff.set(dKey, r.rowDetails);
      }
    });

    // Helper membangun pasangan baris Aktivitas <-> Remark agar tidak menumpuk terpisah di bawah
    const buildReportPairedRows = (
      rawDetails: Array<{ activity: string; remark: string }> | undefined,
      activityStr: string,
      notesStr?: string
    ): PairedActivityRow[] => {
      if (Array.isArray(rawDetails) && rawDetails.length > 0) {
        return rawDetails
          .filter(r => r && String(r.activity || '').trim() !== '')
          .map(r => {
            const act = String(r.activity || '').trim();
            const rem = r.remark && r.remark !== '-' ? String(r.remark).trim() : '';
            return {
              activity: act,
              remark: rem,
              isNg: isRowKendalaText(act) || isRowKendalaText(rem)
            };
          });
      }

      const actLines = String(activityStr || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const remLines = String(notesStr || '')
        .split('\n')
        .map(s => s.trim())
        .filter(s => s !== '' && s !== '-');

      if (actLines.length === 0) return [];
      if (actLines.length === remLines.length) {
        return actLines.map((act, idx) => ({
          activity: act,
          remark: remLines[idx] || '',
          isNg: isRowKendalaText(act) || isRowKendalaText(remLines[idx])
        }));
      }
      if (actLines.length === 1 && remLines.length > 0) {
        const joinedRem = remLines.join(' • ');
        return [
          {
            activity: actLines[0],
            remark: joinedRem,
            isNg: isRowKendalaText(actLines[0]) || isRowKendalaText(joinedRem)
          }
        ];
      }
      return actLines.map(act => ({
        activity: act,
        remark: '',
        isNg: isRowKendalaText(act)
      }));
    };

    // Helper deduplikasi konten identik (misal logbook entry kembar dari daily report yang sama)
    const checkIsDuplicate = (date: string, staff: string, act: string) => {
      const normDate = String(date || '').slice(0, 10);
      const normStaff = String(staff || '').toLowerCase().trim();
      const normAct = String(act || '').toLowerCase().trim().replace(/\s+/g, ' ');
      const key = `${normDate}_${normStaff}_${normAct}`;
      if (seenContentKeys.has(key)) return true;
      seenContentKeys.add(key);
      return false;
    };

    // 1. INPUT DAILY TASK
    dailyTasks.forEach(task => {
      if (!task || !task.title) return;
      const id = task.id || `task-${task.createdAt || Date.now()}-${task.title}`;
      const idDate = extractDateFromId(id);
      const dueDateClean = task.dueDate ? String(task.dueDate).split('T')[0] : '';
      const createdDateClean = task.createdAt ? String(task.createdAt).split('T')[0] : '';
      const dateVal = idDate || dueDateClean || createdDateClean || new Date().toISOString().split('T')[0];

      if (filterMonth && !dateVal.startsWith(filterMonth)) return;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const syncUpdatedBy = (task as any)._syncMeta?.updatedBy;
      const isSyncTimestamp =
        Boolean(idDate) ||
        createdDateClean !== dateVal ||
        syncUpdatedBy === 'Supabase Cloud Sync' ||
        syncUpdatedBy === 'System Canonical Sync';
      const timeVal =
        !isSyncTimestamp && task.createdAt && task.createdAt.includes('T')
          ? task.createdAt.split('T')[1].slice(0, 5)
          : undefined;
      const staffVal = task.assignedName || task.assignedTo || 'Tim Lapangan';
      const effectiveTargetDate = dueDateClean || dateVal;

      if (checkIsDuplicate(dateVal, staffVal, task.title)) return;

      const rawDesc = String(task.description || task.title || '').trim();
      const remarkSplit = rawDesc.split(/\n\s*REMARK:\s*\n?/i);
      const cleanActPart = (remarkSplit[0] || task.title).trim();
      const cleanRemPart = remarkSplit.length > 1 ? remarkSplit.slice(1).join('\n').trim() : '';

      const dKey = `${dateVal}_${staffVal.toLowerCase().trim()}`;
      const matchedSheetRows = rowDetailsByDateStaff.get(dKey);
      const taskActLines = cleanActPart.split('\n').map(s => s.trim()).filter(Boolean);
      const useSheetRows =
        matchedSheetRows &&
        matchedSheetRows.length === taskActLines.length &&
        matchedSheetRows[0]?.activity.toLowerCase() === taskActLines[0]?.toLowerCase();

      const taskPairedRows = buildReportPairedRows(
        useSheetRows ? matchedSheetRows : undefined,
        cleanActPart,
        cleanRemPart
      );

      const hasUnpairedSummaryNote =
        !useSheetRows &&
        cleanRemPart !== '' &&
        taskPairedRows.length > 1 &&
        taskPairedRows.every(r => !r.remark);

      const lowerTaskText = `${task.title || ''} ${rawDesc} ${(task as any).notes || ''}`.toLowerCase();
      const isTaskKendala =
        taskPairedRows.some(r => r.isNg) || STRICT_FINDING_TERMS.some(t => lowerTaskText.includes(t));
      const taskQcResult: 'OK' | 'NG' | 'INFO' = isTaskKendala ? 'NG' : (task.status === 'Done' ? 'OK' : 'INFO');
      const taskBaseTs = parseSafeTimestamp(dateVal, timeVal, task.id);
      const taskMetaBadge = `${effectiveTargetDate ? `Target: ${effectiveTargetDate}` : ''}${task.status ? ` • Status: ${task.status}` : ''}`;

      list.push({
        id,
        date: dateVal,
        time: timeVal,
        staffName: staffVal,
        division: task.division || 'Umum',
        category: 'Daily Task',
        title: `Input Daily Task: ${task.title}`,
        subtitle: task.title !== cleanActPart ? `Tugas: ${task.title}` : undefined,
        metaBadge: taskMetaBadge || undefined,
        activity: cleanActPart,
        notes: hasUnpairedSummaryNote ? cleanRemPart : undefined,
        pairedRows: taskPairedRows.length > 0 ? taskPairedRows : undefined,
        qcResult: taskQcResult,
        timestamp: taskBaseTs,
        updatedAtMs: parseLiveUpdateTimestamp(task, taskBaseTs),
        revisionKey: buildRevisionKey(id, rawDesc, taskMetaBadge, taskQcResult),
        source: 'Daily Task Kanban',
        targetTab: 'log_task'
      });
    });

    // 2. INPUT DAILY LOG (Laporan Harian Staf & Checklist Logbook QC)
    dailyReports.forEach(rep => {
      if (!rep || !rep.activity || rep.activity === '-' || String(rep.activity).trim() === '') return;
      const id = rep.id || `rep-${rep.date}-${rep.staffName}-${rep.activity.slice(0, 10)}`;
      const dateVal = extractDateFromId(id) || (rep.date ? String(rep.date).slice(0, 10) : '');
      if (!dateVal || (filterMonth && !dateVal.startsWith(filterMonth))) return;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const staffVal = rep.staffName || 'Staff';
      if (checkIsDuplicate(dateVal, staffVal, rep.activity)) return;

      const effectiveRowDetails =
        (Array.isArray(rep.rowDetails) && rep.rowDetails.length > 0 ? rep.rowDetails : undefined) ||
        canonicalRowDetailsById.get(id) ||
        rowDetailsByDateStaff.get(`${dateVal}_${staffVal.toLowerCase().trim()}`);

      const repNotes = rep.notes && rep.notes !== '-' ? rep.notes : undefined;
      const repPairedRows = buildReportPairedRows(effectiveRowDetails, rep.activity, repNotes);

      const lowerAct = String(rep.activity).toLowerCase();
      const lowerNotes = String(rep.notes || '').toLowerCase();
      const isKendala =
        repPairedRows.some(r => r.isNg) ||
        STRICT_FINDING_TERMS.some(t => lowerAct.includes(t) || lowerNotes.includes(t));
      const repQcResult: 'OK' | 'NG' = isKendala ? 'NG' : 'OK';
      const repBaseTs = parseSafeTimestamp(dateVal, undefined, rep.id);

      const allRemarksPairedInline =
        repPairedRows.length > 0 && repPairedRows.some(r => r.remark && r.remark.trim() !== '');

      list.push({
        id,
        date: dateVal,
        staffName: staffVal,
        division: rep.division || 'Umum',
        category: 'Daily Log',
        title: `Daily Log: ${staffVal}`,
        activity: rep.activity,
        notes: allRemarksPairedInline ? undefined : repNotes,
        pairedRows: repPairedRows.length > 0 ? repPairedRows : undefined,
        qcResult: repQcResult,
        timestamp: repBaseTs,
        updatedAtMs: parseLiveUpdateTimestamp(rep, repBaseTs),
        revisionKey: buildRevisionKey(id, rep.activity, repNotes, repQcResult),
        source: rep._source === 'google_sheet' ? 'Google Sheet Sync' : 'Input Aplikasi',
        targetTab: 'log_task'
      });
    });

    logbookEntries.forEach(log => {
      if (!log || !log.activity) return;
      const id = log.id || `qc-${log.date}-${log.staffName}-${log.activity.slice(0, 10)}`;
      const dateVal = extractDateFromId(id) || (log.date ? String(log.date).slice(0, 10) : '');
      if (!dateVal || (filterMonth && !dateVal.startsWith(filterMonth))) return;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const staffVal = log.staffName || 'Teknisi QC';
      if (checkIsDuplicate(dateVal, staffVal, log.activity)) return;

      const effectiveRowDetails =
        (Array.isArray(log.rowDetails) && log.rowDetails.length > 0 ? log.rowDetails : undefined) ||
        rowDetailsByDateStaff.get(`${dateVal}_${staffVal.toLowerCase().trim()}`);

      const logNotes = log.followUp && log.followUp !== '-' ? log.followUp : undefined;
      const logPairedRows = buildReportPairedRows(effectiveRowDetails, log.activity, logNotes);
      const allRemarksPairedInline =
        logPairedRows.length > 0 && logPairedRows.some(r => r.remark && r.remark.trim() !== '');

      const isNg = log.result === 'NG' || logPairedRows.some(r => r.isNg);
      const logQcResult: 'OK' | 'NG' = isNg ? 'NG' : 'OK';
      const logBaseTs = parseSafeTimestamp(dateVal, log.time, log.id);
      list.push({
        id,
        date: dateVal,
        time: log.time,
        staffName: staffVal,
        division: log.division || 'Umum',
        category: 'Daily Log',
        title: `Daily Log QC ${log.division} (${log.result})`,
        activity: log.activity,
        notes: allRemarksPairedInline ? undefined : logNotes,
        pairedRows: logPairedRows.length > 0 ? logPairedRows : undefined,
        qcResult: logQcResult,
        timestamp: logBaseTs,
        updatedAtMs: parseLiveUpdateTimestamp(log, logBaseTs),
        revisionKey: buildRevisionKey(id, log.activity, logNotes, logQcResult),
        source: 'Form QC Onhouse',
        targetTab: 'log_task'
      });
    });

    // 3. TEMUAN UNIT BERMASALAH OLEH SEMUA DIVISI (Findings Audio, Lighting, Videotron, Multimedia, Service, Gudang)
    const seenFindingStaffDateKeys = new Set<string>();
    const sortedFindings = [...findings].sort((a, b) => {
      const aIsFd = String(a?.id || '').startsWith('fd-') ? 0 : 1;
      const bIsFd = String(b?.id || '').startsWith('fd-') ? 0 : 1;
      return aIsFd - bIsFd; // Prioritaskan canonical fd-* sebelum gsheet-finding-*
    });

    sortedFindings.forEach(f => {
      if (!f || !f.issue) return;
      const id = f.id || `find-${f.dateCreated}-${f.equipment}-${f.issue.slice(0, 10)}`;
      if (id.startsWith('gsheet-finding-2021-')) return;
      const dateVal = extractDateFromId(id) || (f.dateCreated ? String(f.dateCreated).slice(0, 10) : new Date().toISOString().split('T')[0]);
      if (filterMonth && !dateVal.startsWith(filterMonth)) return;
      if (seenIds.has(id)) return;

      const staffVal = f.pic || 'Teknisi';
      const normStaff = String(staffVal).toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      const isSheetFinding = f._source === 'google_sheet' || id.startsWith('gsheet-finding-') || id.startsWith('fd-2026');
      if (isSheetFinding && !dateVal.startsWith('2026-09')) {
        const staffDateKey = `${dateVal}_${normStaff}`;
        if (seenFindingStaffDateKeys.has(staffDateKey)) return;
        seenFindingStaffDateKeys.add(staffDateKey);
      }

      // Bersihkan teks "(... Kondisi unit sudah OK)" bila masih ada dari cache lama
      const cleanedIssueText = String(f.issue || '')
        .replace(/\s*\([^)]*kondisi(?:\s+unit)?(?:\s+sudah)?\s+ok[^)]*\)/gi, '')
        .trim();

      if (checkIsDuplicate(dateVal, staffVal, cleanedIssueText)) return;
      seenIds.add(id);

      // Parse segmen temuan per baris unit bermasalah
      const issueSegments = cleanedIssueText
        .split(/\s*\|\s*|\n+/)
        .map(s => s.trim())
        .filter(Boolean)
        .filter(s => !/^kondisi(?:\s+unit)?(?:\s+sudah)?\s+ok$/i.test(s));

      const findingPairedRows: PairedActivityRow[] = issueSegments.map(seg => {
        const colonIdx = seg.indexOf(':');
        if (colonIdx > 0 && colonIdx < seg.length - 1) {
          const actPart = seg.slice(0, colonIdx).trim();
          const remPart = seg.slice(colonIdx + 1).trim();
          return {
            activity: actPart,
            remark: remPart,
            isNg: true
          };
        }
        return {
          activity: seg,
          remark: '',
          isNg: true
        };
      });

      const findMetaBadge = [
        f.priority ? `Prioritas: ${f.priority}` : '',
        f.targetDate ? `Target: ${f.targetDate}` : '',
        f.status ? `Status: ${f.status}` : ''
      ]
        .filter(Boolean)
        .join(' • ');

      const findBaseTs = parseSafeTimestamp(dateVal, undefined, f.id);

      list.push({
        id,
        date: dateVal,
        staffName: staffVal,
        division: f.division || 'Semua Divisi',
        category: 'Temuan Unit Bermasalah',
        title: `Temuan Unit: ${f.equipment} (${f.division || 'Umum'})`,
        subtitle: f.equipment ? `Unit: ${f.equipment}` : undefined,
        metaBadge: findMetaBadge || undefined,
        activity: cleanedIssueText,
        pairedRows: findingPairedRows.length > 0 ? findingPairedRows : undefined,
        qcResult: 'NG',
        timestamp: findBaseTs,
        updatedAtMs: parseLiveUpdateTimestamp(f, findBaseTs),
        revisionKey: buildRevisionKey(id, cleanedIssueText, findMetaBadge, 'NG'),
        source: 'Log Temuan Kerusakan',
        targetTab: 'findings'
      });
    });

    // 4. UNIT YANG DIKELUARKAN DAN DITERIMA OLEH DIVISI GUDANG / WAREHOUSE (Mutasi Logistik)
    warehouseLogs.forEach(log => {
      if (!log || !log.itemName) return;
      if (filterMonth && log.date && !log.date.startsWith(filterMonth)) return;
      const id = log.id || `wh-${log.date}-${log.itemName}-${log.type}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const isReceived = log.type === 'Masuk' || log.type === 'Servis Masuk' || log.type === 'Unloading';
      const actionLabel = isReceived ? 'Unit Diterima' : 'Unit Dikeluarkan';
      const title = `${actionLabel} Gudang: ${log.itemName}`;
      const activity = `[${log.type}] ${log.qty || 1} unit ${log.itemName} • PIC: ${log.pic || 'Gudang'}`;
      const dateVal = log.date || new Date().toISOString().split('T')[0];
      const staffVal = log.pic || 'Staff Gudang';

      if (checkIsDuplicate(dateVal, staffVal, activity)) return;

      const whNotes = log.notes && log.notes !== '-' ? log.notes : undefined;
      const whQcResult: 'OK' | 'INFO' = isReceived ? 'OK' : 'INFO';
      const whBaseTs = parseSafeTimestamp(dateVal, undefined, log.id);

      list.push({
        id,
        date: dateVal,
        staffName: staffVal,
        division: 'Gudang',
        category: 'Mutasi Unit Gudang',
        title,
        subtitle: `${actionLabel}: ${log.itemName} (${log.qty || 1} unit)`,
        activity,
        notes: whNotes,
        qcResult: whQcResult,
        timestamp: whBaseTs,
        updatedAtMs: parseLiveUpdateTimestamp(log, whBaseTs),
        revisionKey: buildRevisionKey(id, activity, whNotes, whQcResult),
        source: 'Manajemen Logistik Gudang',
        targetTab: 'gudang'
      });
    });

    // 5. PEMBERITAHUAN JATUH TEMPO STNK (1 TAHUN) & KIR (6 BULAN) ARMADA GUDANG (H-30 HARI & KADALUARSA)
    const vehicleAlerts = getVehicleExpiryAlerts(effectiveVehicles);
    vehicleAlerts.forEach(alert => {
      const alertId = `veh-doc-${alert.vehicleId}-${alert.docType}-${alert.expiryDate}`;
      if (seenIds.has(alertId)) return;
      seenIds.add(alertId);

      const dateVal = alert.expiryDate ? alert.expiryDate.slice(0, 10) : new Date().toISOString().split('T')[0];
      // Jika filter bulan aktif dipilih, tampilkan jika jatuh tempo di bulan tersebut atau jika sudah kadaluarsa
      if (filterMonth && !dateVal.startsWith(filterMonth) && alert.status !== 'expired') return;

      list.push({
        id: alertId,
        date: dateVal,
        staffName: 'Divisi Gudang / Logistik',
        division: 'Gudang',
        category: 'Temuan Unit Bermasalah',
        title: `Pemberitahuan ${alert.docType}: ${alert.policeNumber} (${alert.vehicleName})`,
        subtitle: `${alert.docType} Armada: ${alert.policeNumber} (${alert.vehicleName})`,
        metaBadge: `Masa Berlaku: ${alert.validityPeriod} • Status: ${alert.status === 'expired' ? 'KADALUARSA' : 'H-1 BULAN SEBELUM BERAKHIR'}`,
        activity: alert.message,
        qcResult: 'NG',
        timestamp: parseSafeTimestamp(dateVal, undefined, alertId),
        source: 'Legalitas Dokumen Armada Gudang',
        targetTab: 'gudang'
      });
    });

    // Urutkan daftar secara mutlak dari TANGGAL MASUK TERBARU (Descending YYYY-MM-DD)
    return list.sort((a, b) => {
      // 1. Tanggal (YYYY-MM-DD) terbaru paling atas
      const dateA = String(a.date || '').slice(0, 10);
      const dateB = String(b.date || '').slice(0, 10);
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }

      // 2. Jika tanggal sama, jam/waktu (HH:mm) terbaru paling atas
      if (a.time && b.time && a.time !== b.time) {
        return String(b.time).localeCompare(String(a.time));
      }

      // 3. Jika tanggal sama, urutan prioritas kategori agar Daily Log (Google Sheet) berada paling atas
      const catOrder: Record<string, number> = {
        'Daily Log': 0,
        'Temuan Unit Bermasalah': 1,
        'Daily Task': 2,
        'Mutasi Unit Gudang': 3
      };
      const orderA = catOrder[a.category] ?? 9;
      const orderB = catOrder[b.category] ?? 9;
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // 4. Jika tanggal & kategori sama, timestamp numerik terbaru paling atas
      if (b.timestamp !== a.timestamp) {
        return b.timestamp - a.timestamp;
      }

      // 5. Stable sort
      return String(b.id || '').localeCompare(String(a.id || ''));
    });
  }, [dailyReports, logbookEntries, findings, dailyTasks, warehouseLogs, activeMonth, effectiveVehicles]);

  // Deteksi penambahan atau perubahan data input secara live dalam sesi aktif maupun lintas reload via localStorage
  useEffect(() => {
    if (notifications.length === 0) return;

    // Jika belum pernah ada baseline revisi di localStorage sama sekali (kunjungan pertama kali),
    // rekam baseline awal sekali saja lalu aktifkan deteksi live untuk sinkronisasi Google Sheet berikutnya
    if (isInitialLoadRef.current && knownRevisionsRef.current.size === 0) {
      notifications.forEach(n => {
        knownRevisionsRef.current.set(n.id, n.revisionKey || n.id);
      });
      saveStoredKnownRevisions(knownRevisionsRef.current);
      isInitialLoadRef.current = false;
      return;
    }
    isInitialLoadRef.current = false;

    // Cari item yang benar-benar baru masuk ATAU yang kontennya baru saja berubah di Google Sheet / aplikasi
    const freshOrUpdatedItems: Array<{ item: NotificationItem; isUpdatedRevision: boolean }> = [];
    let hasMapChanged = false;

    notifications.forEach(n => {
      const rev = n.revisionKey || n.id;
      const prevRev = knownRevisionsRef.current.get(n.id);
      if (prevRev === undefined) {
        freshOrUpdatedItems.push({ item: n, isUpdatedRevision: false });
        knownRevisionsRef.current.set(n.id, rev);
        hasMapChanged = true;
      } else if (prevRev !== rev) {
        freshOrUpdatedItems.push({ item: n, isUpdatedRevision: true });
        knownRevisionsRef.current.set(n.id, rev);
        hasMapChanged = true;
      }
    });

    if (hasMapChanged) {
      saveStoredKnownRevisions(knownRevisionsRef.current);
    }

    if (freshOrUpdatedItems.length > 0) {
      const changedIds = freshOrUpdatedItems.map(x => x.item.id);
      const revisedIds = freshOrUpdatedItems.filter(x => x.isUpdatedRevision).map(x => x.item.id);

      setRecentUpdatedIds(prev => {
        const next = new Set<string>(prev);
        changedIds.forEach(id => next.add(id));
        return next;
      });

      setDrawerSessionUnreadIds(prev => {
        const next = new Set<string>(prev);
        changedIds.forEach(id => next.add(id));
        return next;
      });

      if (revisedIds.length > 0) {
        setReadIds(prev => {
          const next = new Set<string>(prev);
          revisedIds.forEach(id => next.delete(id));
          saveStoredReadIds(next);
          return next;
        });
      }

      const toastEntry = freshOrUpdatedItems.find(({ item: n, isUpdatedRevision }) => {
        if (n.id.startsWith('veh-doc-')) return false;
        const revKey = n.revisionKey || n.id;
        if (dismissedToastIds.has(revKey)) return false;
        if (!isUpdatedRevision && readIds.has(revKey)) return false;
        return true;
      });

      if (toastEntry && !isMobileHeader) {
        const toastCandidate = toastEntry.item;
        const toastRevKey = toastCandidate.revisionKey || toastCandidate.id;
        setLiveToast(toastCandidate);
        const timer = setTimeout(() => {
          setLiveToast(null);
          setDismissedToastIds(prev => {
            const next = new Set<string>(prev);
            next.add(toastRevKey);
            saveStoredDismissedToastIds(next);
            return next;
          });
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, isMobileHeader, dismissedToastIds, readIds, lastReadTimestamp]);

  // Cek apakah notifikasi berstatus belum dibaca (mendukung deteksi revisi baru dari Google Sheet)
  const isItemUnread = (item: NotificationItem): boolean => {
    const revKey = item.revisionKey || item.id;
    if (readIds.has(revKey)) return false;
    if (recentUpdatedIds.has(item.id)) return true;
    const effectiveTs = item.updatedAtMs || item.timestamp;
    if (readIds.has(item.id) && effectiveTs <= lastReadTimestamp) return false;
    if (lastReadTimestamp > 0 && effectiveTs <= lastReadTimestamp && readIds.has(item.id)) return false;
    if (lastReadTimestamp > 0 && effectiveTs <= lastReadTimestamp && item.timestamp <= lastReadTimestamp) return false;
    return true;
  };

  // Hitung jumlah notifikasi belum dibaca
  const unreadCount = useMemo(() => {
    if (lastReadTimestamp === 0 && readIds.size === 0) {
      // Default pertama kali buka: tampilkan indikator data terbaru (maks 12 item)
      return Math.min(notifications.length, 12);
    }
    return notifications.filter(n => isItemUnread(n)).length;
  }, [notifications, lastReadTimestamp, readIds, recentUpdatedIds]);

  // Total kendala global
  const totalKendalaGlobal = useMemo(() => {
    return notifications.filter(n => n.qcResult === 'NG').length;
  }, [notifications]);

  // Aturan Mutlak Staf Dual-Divisi (AGENTS.md Rule 2): Mulyana / Kharo bertugas di Service (primer) & Videotron (sekunder)
  const isMulyanaDualDivisionStaff = (staffName?: string): boolean => {
    if (!staffName) return false;
    const lower = staffName.toLowerCase();
    return lower.includes('mulyana') || lower.includes('kharo');
  };

  // Statistik per divisi
  const divisionStats = useMemo(() => {
    const stats: Record<string, { total: number; ng: number }> = {
      Semua: { total: notifications.length, ng: totalKendalaGlobal }
    };
    const addDivCount = (div: string, isNg: boolean) => {
      if (!stats[div]) {
        stats[div] = { total: 0, ng: 0 };
      }
      stats[div].total += 1;
      if (isNg) stats[div].ng += 1;
    };
    notifications.forEach(n => {
      const isNg = n.qcResult === 'NG';
      addDivCount(n.division, isNg);
      if (isMulyanaDualDivisionStaff(n.staffName)) {
        if (n.division === 'Videotron') {
          addDivCount('Service', isNg);
        } else if (n.division === 'Service') {
          addDivCount('Videotron', isNg);
        }
      }
    });
    return stats;
  }, [notifications, totalKendalaGlobal]);

  // Filter notifikasi sesuai tab divisi, kategori input, status, dan pencarian teks
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchDiv =
        selectedDivision === 'Semua' ||
        n.division === selectedDivision ||
        (isMulyanaDualDivisionStaff(n.staffName) && (selectedDivision === 'Service' || selectedDivision === 'Videotron'));
      const matchCat = selectedCategory === 'Semua' || n.category === selectedCategory;
      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'NG' && n.qcResult === 'NG') ||
        (statusFilter === 'OK' && n.qcResult === 'OK');
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        query === '' ||
        n.staffName.toLowerCase().includes(query) ||
        n.activity.toLowerCase().includes(query) ||
        (n.subtitle && n.subtitle.toLowerCase().includes(query)) ||
        (n.notes && n.notes.toLowerCase().includes(query)) ||
        n.division.toLowerCase().includes(query) ||
        n.category.toLowerCase().includes(query) ||
        n.date.includes(query);
      return matchDiv && matchCat && matchStatus && matchSearch;
    });
  }, [notifications, selectedDivision, selectedCategory, statusFilter, searchQuery]);

  const handleDismissToast = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (liveToast) {
      const toastId = liveToast.id;
      const toastRev = liveToast.revisionKey || toastId;
      setDismissedToastIds(prev => {
        const next = new Set<string>(prev);
        next.add(toastId);
        next.add(toastRev);
        saveStoredDismissedToastIds(next);
        return next;
      });
      setReadIds(prev => {
        const next = new Set<string>(prev);
        next.add(toastId);
        next.add(toastRev);
        saveStoredReadIds(next);
        return next;
      });
      window.dispatchEvent(new CustomEvent('riz-notification-sync'));
    }
    setLiveToast(null);
  };

  const handleClickToast = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liveToast) {
      const toastId = liveToast.id;
      const toastRev = liveToast.revisionKey || toastId;
      setDismissedToastIds(prev => {
        const next = new Set<string>(prev);
        next.add(toastId);
        next.add(toastRev);
        saveStoredDismissedToastIds(next);
        return next;
      });
    }
    setLiveToast(null);
    handleOpenDrawer();
  };

  const handleOpenDrawer = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Simpan daftar item yang berstatus belum dibaca saat drawer dibuka agar badge "BARU" tetap terlihat jelas di kartu
    const currentlyUnread = new Set<string>();
    notifications.forEach(n => {
      if (isItemUnread(n) || recentUpdatedIds.has(n.id)) {
        currentlyUnread.add(n.id);
      }
    });
    setDrawerSessionUnreadIds(currentlyUnread);
    setIsOpen(true);

    // Bersihkan angka badge di tombol lonceng luar tanpa menghilangkan highlight "BARU" di dalam sesi drawer yang sedang dibuka
    const maxTimestamp = notifications.reduce(
      (max, n) => Math.max(max, n.timestamp || 0, n.updatedAtMs || 0),
      Date.now()
    );
    const newReadTime = Math.max(Date.now(), maxTimestamp) + 1000;
    setLastReadTimestamp(newReadTime);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(newReadTime));
      localStorage.setItem(READ_STORAGE_KEY_LEGACY, String(newReadTime));
    } catch {}
    setReadIds(prev => {
      const next = new Set<string>(prev);
      notifications.forEach(n => {
        next.add(n.id);
        if (n.revisionKey) next.add(n.revisionKey);
      });
      saveStoredReadIds(next);
      return next;
    });
    setDismissedToastIds(prev => {
      const next = new Set<string>(prev);
      notifications.forEach(n => {
        next.add(n.id);
        if (n.revisionKey) next.add(n.revisionKey);
      });
      if (liveToast) {
        next.add(liveToast.id);
        if (liveToast.revisionKey) next.add(liveToast.revisionKey);
      }
      saveStoredDismissedToastIds(next);
      return next;
    });
    setRecentUpdatedIds(new Set<string>());
    setLiveToast(null);
    window.dispatchEvent(new CustomEvent('riz-notification-sync'));
  };

  const handleMarkAllRead = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const maxTimestamp = notifications.reduce(
      (max, n) => Math.max(max, n.timestamp || 0, n.updatedAtMs || 0),
      Date.now()
    );
    const newReadTime = Math.max(Date.now(), maxTimestamp) + 1000;
    setLastReadTimestamp(newReadTime);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(newReadTime));
      localStorage.setItem(READ_STORAGE_KEY_LEGACY, String(newReadTime));
    } catch {}
    setReadIds(prev => {
      const next = new Set<string>(prev);
      notifications.forEach(n => {
        next.add(n.id);
        if (n.revisionKey) next.add(n.revisionKey);
      });
      saveStoredReadIds(next);
      return next;
    });
    setDismissedToastIds(prev => {
      const next = new Set<string>(prev);
      notifications.forEach(n => {
        next.add(n.id);
        if (n.revisionKey) next.add(n.revisionKey);
      });
      if (liveToast) {
        next.add(liveToast.id);
        if (liveToast.revisionKey) next.add(liveToast.revisionKey);
      }
      saveStoredDismissedToastIds(next);
      return next;
    });
    setDrawerSessionUnreadIds(new Set<string>());
    setRecentUpdatedIds(new Set<string>());
    setLiveToast(null);
    window.dispatchEvent(new CustomEvent('riz-notification-sync'));
  };

  const handleItemClick = (item: NotificationItem) => {
    setReadIds(prev => {
      const next = new Set<string>(prev);
      next.add(item.id);
      if (item.revisionKey) next.add(item.revisionKey);
      saveStoredReadIds(next);
      return next;
    });
    setDismissedToastIds(prev => {
      const next = new Set<string>(prev);
      next.add(item.id);
      if (item.revisionKey) next.add(item.revisionKey);
      saveStoredDismissedToastIds(next);
      return next;
    });
    setDrawerSessionUnreadIds(prev => {
      const next = new Set<string>(prev);
      next.delete(item.id);
      return next;
    });
    window.dispatchEvent(new CustomEvent('riz-notification-sync'));
    if (onNavigateTab && item.targetTab) {
      onNavigateTab(item.targetTab);
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Daily Task': return <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Daily Log': return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'Temuan Unit Bermasalah': return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'Mutasi Unit Gudang': return <Package className="w-3.5 h-3.5 text-orange-600" />;
      default: return <Layers className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getDivisionIcon = (div: string) => {
    switch (div) {
      case 'Audio': return <Music2 className="w-3 h-3" />;
      case 'Lighting': return <SunMedium className="w-3 h-3" />;
      case 'Videotron': return <Tv className="w-3 h-3" />;
      case 'Service': return <Wrench className="w-3 h-3" />;
      case 'Multimedia': return <Laptop className="w-3 h-3" />;
      case 'Gudang': return <Package className="w-3 h-3" />;
      default: return <Layers className="w-3 h-3" />;
    }
  };

  const getDivisionColor = (div: string) => {
    switch (div) {
      case 'Audio': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Lighting': return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Videotron': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Service': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Multimedia': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Gudang': return 'bg-orange-50 text-orange-800 border-orange-200';
      default: return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <>
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOMBOL UTAMA ICON LONCENG NOTIFIKASI                    */}
      {/* ────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleOpenDrawer}
        className={`relative flex items-center justify-center transition-all cursor-pointer select-none ${
          isMobileHeader
            ? 'p-2 bg-[#1e293b] hover:bg-slate-700 text-white rounded-lg border border-slate-700 active:scale-95 shadow-xs'
            : buttonClassName ||
              'px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 active:scale-95'
        }`}
        title={`Buka Pusat Notifikasi Input Data & QC (${activeMonth === 'all' ? 'Semua Periode' : activeMonth})`}
        aria-label={`Buka Pusat Notifikasi Input Data & QC (${activeMonth === 'all' ? 'Semua Periode' : activeMonth})`}
      >
        <div className="relative flex items-center pointer-events-none">
          <Bell className={`w-4 h-4 ${isMobileHeader ? 'text-amber-400' : 'text-indigo-600'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[9px] font-black shadow-xs ring-2 ring-white animate-pulse pointer-events-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>

        {!isMobileHeader && (
          <span className="ml-1.5 hidden lg:inline text-xs font-bold text-slate-700 pointer-events-none">
            Notifikasi Input Data
          </span>
        )}

        {!isMobileHeader && totalKendalaGlobal > 0 && (
          <span className="ml-1.5 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 pointer-events-none">
            {totalKendalaGlobal} Kendala
          </span>
        )}
      </button>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. REAL-TIME LIVE TOAST NOTIFICATION (Pop-up Singkat)       */}
      {/* ────────────────────────────────────────────────────────── */}
      {liveToast && !isMobileHeader && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={handleClickToast}
          className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-[99999] bg-slate-900/95 backdrop-blur-md text-white p-3 px-4 rounded-xl shadow-2xl border border-indigo-500/50 flex items-center gap-3 cursor-pointer max-w-full sm:max-w-sm hover:border-indigo-400 transition-all select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600/40 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shrink-0 pointer-events-none">
            <Bell className="w-4 h-4 animate-bounce" />
          </div>
          <div className="min-w-0 flex-1 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-white">Input Data Baru</span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[9px] font-mono">
                {liveToast.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate mt-0.5">
              <strong className="text-white">{liveToast.staffName}</strong>: {liveToast.activity}
            </p>
          </div>
          <button 
            type="button"
            onClick={handleDismissToast}
            className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>,
        document.body
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. SLIDE-OVER DRAWER NOTIFIKASI (PORTAL VIEWPORT 100%)     */}
      {/* ────────────────────────────────────────────────────────── */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-hidden flex justify-end" 
          role="dialog" 
          aria-modal="true"
        >
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200 cursor-pointer"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(false);
              }
            }}
            aria-hidden="true"
          />

          {/* Full-Height Drawer Panel */}
          <div
            className="relative z-10 w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden h-full max-h-screen pt-[max(env(safe-area-inset-top),0px)] pb-[max(env(safe-area-inset-bottom),0px)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Top Header */}
            <div className="shrink-0 bg-[#0f172a] text-white px-4 py-3.5 border-b border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                        Pusat Notifikasi Operasional
                      </h2>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-mono font-bold uppercase tracking-wider shrink-0">
                        {activeMonth && activeMonth !== 'all' ? formatMonthLabel(activeMonth) : 'Semua Periode'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      Daily Task • Daily Log • Temuan Unit • Mutasi Gudang ({notifications.length} data)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {onSyncSheet && (
                    <button
                      type="button"
                      onClick={onSyncSheet}
                      disabled={isSyncingSheet}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 flex items-center gap-1 transition-colors cursor-pointer ${
                        isSyncingSheet ? 'opacity-70 cursor-not-allowed animate-pulse' : ''
                      }`}
                      title="Tarik & sinkronkan data terbaru dari Google Sheet"
                    >
                      <RefreshCw className={`w-3 h-3 text-emerald-300 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline">{isSyncingSheet ? 'Menarik...' : 'Sync Sheet'}</span>
                    </button>
                  )}

                  <button
                    onClick={handleMarkAllRead}
                    className="px-2 py-1 text-[10px] font-bold text-blue-300 hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center gap-1 cursor-pointer"
                    title="Tandai semua notifikasi sudah dibaca"
                  >
                    <CheckCheck className="w-3 h-3 text-blue-400" />
                    <span className="hidden sm:inline">Tandai Dibaca</span>
                  </button>

                  <a
                    href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded-md text-[10px] font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Buka Folder Google Drive Bukti Resmi"
                  >
                    <Folder className="w-3 h-3 text-amber-300" />
                    <span className="hidden sm:inline">Drive Bukti</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                  </a>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Tutup (Esc)"
                    aria-label="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Toolbar Filter & Pencarian */}
            <div className="flex-none px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
              
              {/* Baris 1: Filter Kategori Input Data (4 Kategori Resmi Sesuai Komit) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {([
                  'Semua',
                  'Daily Task',
                  'Daily Log',
                  'Temuan Unit Bermasalah',
                  'Mutasi Unit Gudang'
                ] as const).map(cat => {
                  const isSelected = selectedCategory === cat;
                  const count = cat === 'Semua'
                    ? notifications.length
                    : notifications.filter(n => n.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat as NotificationCategory)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                      <span className={`text-[9px] px-1 rounded font-mono ${isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Baris 2: Filter Divisi */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['Semua', 'Audio', 'Videotron', 'Lighting', 'Service', 'Multimedia', 'Gudang'].map(div => {
                  const stats = divisionStats[div] || { total: 0, ng: 0 };
                  const isSelected = selectedDivision === div;
                  return (
                    <button
                      key={div}
                      onClick={() => setSelectedDivision(div)}
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {getDivisionIcon(div)}
                      <span>{div}</span>
                      <span className={`text-[9px] px-1 rounded font-mono ${isSelected ? 'bg-slate-900 text-slate-200' : 'bg-slate-200 text-slate-600'}`}>
                        {stats.total}
                      </span>
                      {stats.ng > 0 && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rose-300' : 'bg-rose-500'}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Baris 3: Search Input + Status Filter Toggle */}
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama staf, judul tugas, kendala..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-7 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Toggle Status */}
                <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shrink-0 text-[10px] font-bold">
                  <button
                    onClick={() => setStatusFilter('ALL')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      statusFilter === 'ALL'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setStatusFilter('NG')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      statusFilter === 'NG'
                        ? 'bg-rose-600 text-white'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                    title="Hanya temuan kendala"
                  >
                    Kendala
                  </button>
                  <button
                    onClick={() => setStatusFilter('OK')}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      statusFilter === 'OK'
                        ? 'bg-emerald-600 text-white'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                    title="Hanya hasil aman"
                  >
                    Aman
                  </button>
                </div>
              </div>
            </div>

            {/* Feed Notifikasi Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 bg-slate-100/70">
              {filteredNotifications.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Clock className="w-8 h-8 mx-auto text-slate-300 mb-1.5" />
                  <p className="text-xs font-semibold text-slate-600">
                    Tidak ada rekaman aktivitas yang sesuai filter
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Ganti pilihan divisi, kategori input, atau kata kunci pencarian
                  </p>
                </div>
              ) : (
                <>
                  {filteredNotifications.slice(0, displayLimit).map(item => {
                    const isNg = item.qcResult === 'NG';
                    const isCardNew = drawerSessionUnreadIds.has(item.id) || isItemUnread(item);
                    const hasPairedRows = Array.isArray(item.pairedRows) && item.pairedRows.length > 0;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`rounded-lg border bg-white transition-all shadow-xs overflow-hidden cursor-pointer hover:shadow-md ${
                          isNg
                            ? 'border-l-4 border-l-rose-500 border-slate-200'
                            : 'border-l-4 border-l-emerald-500 border-slate-200'
                        } ${isCardNew ? 'ring-1 ring-indigo-400/70' : ''}`}
                      >
                        <div className="p-3">
                          {/* Header Kartu: Staf, Divisi, Tanggal & Kategori */}
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {item.staffName}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getDivisionColor(
                                  item.division
                                )}`}
                              >
                                {item.division}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {item.category}
                              </span>
                              {isCardNew && (
                                <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-indigo-600 text-white uppercase tracking-wider">
                                  BARU
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                {item.date}{item.time && item.time !== item.date ? ` • ${item.time}` : ''}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  isNg
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {isNg ? (
                                  <>
                                    <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
                                    <span>Kendala</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                    <span>Aman</span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Sub-header Unit / Judul Tugas & Info Target/Prioritas */}
                          {(item.subtitle || item.metaBadge) && (
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5 px-2 py-1 rounded bg-slate-100/90 border border-slate-200/80 text-[10px]">
                              {item.subtitle && (
                                <span className="font-bold text-slate-800">
                                  {item.subtitle}
                                </span>
                              )}
                              {item.metaBadge && (
                                <span className="font-mono font-semibold text-slate-600">
                                  {item.metaBadge}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Detail Pekerjaan & Remark Terpasang Per Baris */}
                          {hasPairedRows ? (
                            <div
                              className={`rounded border divide-y mb-1.5 overflow-hidden ${
                                isNg
                                  ? 'bg-rose-50/30 border-rose-100 divide-rose-100/80'
                                  : 'bg-slate-50/80 border-slate-100 divide-slate-200/60'
                              }`}
                            >
                              {item.pairedRows!.map((row, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="px-2.5 py-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs"
                                >
                                  <div className="flex items-start gap-1.5 min-w-0 flex-1">
                                    <span
                                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                        row.isNg ? 'bg-rose-500' : 'bg-emerald-500'
                                      }`}
                                    />
                                    <span
                                      className={`font-medium leading-snug ${
                                        row.isNg ? 'text-rose-950 font-semibold' : 'text-slate-800'
                                      }`}
                                    >
                                      {row.activity}
                                    </span>
                                  </div>
                                  {row.remark && row.remark.trim() !== '' && (
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 self-start sm:self-center max-w-full sm:max-w-[52%] ${
                                        row.isNg
                                          ? 'bg-rose-100/90 text-rose-800 border border-rose-200'
                                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                                      }`}
                                    >
                                      {row.isNg ? (
                                        <AlertTriangle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                                      ) : (
                                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                      )}
                                      <span className="truncate" title={row.remark}>
                                        {row.remark}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div
                              className={`rounded p-2 text-xs font-medium leading-relaxed mb-1.5 ${
                                isNg
                                  ? 'bg-rose-50/50 text-rose-950 border border-rose-100'
                                  : 'bg-slate-50 text-slate-800 border border-slate-100'
                              }`}
                            >
                              <p className="whitespace-pre-line">{item.activity}</p>
                            </div>
                          )}

                          {/* Catatan Tambahan jika ada dan belum terpasang per baris */}
                          {item.notes && item.notes.trim() !== '' && (
                            <div
                              className={`text-[11px] rounded p-1.5 px-2 mb-1.5 border-l-2 ${
                                isNg
                                  ? 'bg-rose-100/60 text-rose-900 border-l-rose-500 border border-rose-200/60'
                                  : 'bg-amber-50/70 text-amber-900 border-l-amber-500 border border-amber-200/60'
                              }`}
                            >
                              <span className="font-bold mr-1">Catatan:</span>
                              <span className="whitespace-pre-line">{item.notes}</span>
                            </div>
                          )}

                          {/* Footer Sumber & Tombol Akses Cepat */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {item.source}
                            </span>
                            <span className="text-indigo-600 font-bold flex items-center gap-0.5 hover:underline">
                              Buka Modul
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredNotifications.length > displayLimit && (
                    <button
                      type="button"
                      onClick={() => setDisplayLimit(prev => prev + 50)}
                      className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-all shadow-xs cursor-pointer text-center"
                    >
                      Tampilkan Lebih Banyak ({filteredNotifications.length - displayLimit} data tersisa)
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Bottom Footer */}
            <div className="flex-none px-4 py-2.5 bg-white border-t border-slate-200 flex items-center justify-between">
              <div className="text-[11px] font-bold text-slate-600">
                <span>{filteredNotifications.length} Aktivitas Ditampilkan</span>
                {totalKendalaGlobal > 0 && (
                  <span className="ml-1 text-rose-600 font-bold">
                    ({totalKendalaGlobal} kendala tercatat)
                  </span>
                )}
              </div>

              {onNavigateTab && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateTab('log_task');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Lihat Daily Task & QC</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

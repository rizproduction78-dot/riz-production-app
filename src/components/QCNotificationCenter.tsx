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
import { INITIAL_VEHICLES } from '../data';

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

export type NotificationCategory =
  | 'Semua'
  | 'Daily Task'
  | 'Daily Log'
  | 'Temuan Unit Bermasalah'
  | 'Mutasi Unit Gudang';

export interface NotificationItem {
  id: string;
  date: string;
  time?: string;
  staffName: string;
  division: string;
  category: 'Daily Task' | 'Daily Log' | 'Temuan Unit Bermasalah' | 'Mutasi Unit Gudang';
  title: string;
  activity: string;
  notes?: string;
  qcResult: 'OK' | 'NG' | 'INFO';
  timestamp: number;
  source: string;
  targetTab: string;
}

// Kata kunci spesifik temuan kendala / kerusakan nyata
const STRICT_FINDING_TERMS = [
  'dead pixel',
  'ilang jalur',
  'hilang jalur',
  'kena ic',
  'mati total',
  'led merah mati',
  'warm separo',
  'separo',
  'suara serak',
  'serak',
  'error',
  'rusak',
  'hilang',
  'los 1 unit',
  '1 unit los',
  'ganti ptc',
  'minus breket',
  'blm clear',
  'belum clear',
  'kirim ke pib',
  'modul rusak',
  'korslet',
  'bocor'
];

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

  const knownItemIdsRef = useRef<Set<string>>(new Set<string>());
  const isInitialLoadRef = useRef<boolean>(true);

  // Sinkronisasi antar-tab & antar-instance (Desktop & Mobile Header)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedRead = localStorage.getItem(READ_STORAGE_KEY) || localStorage.getItem(READ_STORAGE_KEY_LEGACY);
        if (savedRead) setLastReadTimestamp(parseInt(savedRead, 10));
        setReadIds(getStoredReadIds());
        setDismissedToastIds(getStoredDismissedToastIds());
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
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
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
      const taskDate = task.createdAt ? task.createdAt.split('T')[0] : '';
      if (filterMonth && taskDate && !taskDate.startsWith(filterMonth) && (!task.dueDate || !task.dueDate.startsWith(filterMonth))) return;
      const id = task.id || `task-${task.createdAt || Date.now()}-${task.title}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const dateVal = task.createdAt ? task.createdAt.split('T')[0] : new Date().toISOString().split('T')[0];
      const timeVal = task.createdAt && task.createdAt.includes('T') ? task.createdAt.split('T')[1].slice(0, 5) : undefined;
      const staffVal = task.assignedName || task.assignedTo || 'Tim Lapangan';
      const actVal = `${task.description || task.title}${task.dueDate ? ` • Target: ${task.dueDate}` : ''} [Status: ${task.status}]`;

      if (checkIsDuplicate(dateVal, staffVal, task.title)) return;

      list.push({
        id,
        date: dateVal,
        time: timeVal,
        staffName: staffVal,
        division: task.division || 'Umum',
        category: 'Daily Task',
        title: `Input Daily Task: ${task.title}`,
        activity: actVal,
        qcResult: task.status === 'Done' ? 'OK' : 'INFO',
        timestamp: parseSafeTimestamp(task.createdAt, timeVal, task.id),
        source: 'Daily Task Kanban',
        targetTab: 'log_task'
      });
    });

    // 2. INPUT DAILY LOG (Laporan Harian Staf & Checklist Logbook QC)
    dailyReports.forEach(rep => {
      if (!rep || !rep.activity || rep.activity === '-' || String(rep.activity).trim() === '') return;
      if (filterMonth && rep.date && !rep.date.startsWith(filterMonth)) return;
      const id = rep.id || `rep-${rep.date}-${rep.staffName}-${rep.activity.slice(0, 10)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const staffVal = rep.staffName || 'Staff';
      if (checkIsDuplicate(rep.date, staffVal, rep.activity)) return;

      const lowerAct = String(rep.activity).toLowerCase();
      const lowerNotes = String(rep.notes || '').toLowerCase();
      const isKendala = STRICT_FINDING_TERMS.some(t => lowerAct.includes(t) || lowerNotes.includes(t));

      list.push({
        id,
        date: rep.date,
        staffName: staffVal,
        division: rep.division || 'Umum',
        category: 'Daily Log',
        title: `Daily Log: ${staffVal}`,
        activity: rep.activity,
        notes: rep.notes && rep.notes !== '-' ? rep.notes : undefined,
        qcResult: isKendala ? 'NG' : 'OK',
        timestamp: parseSafeTimestamp(rep.date, undefined, rep.id),
        source: rep._source === 'google_sheet' ? 'Google Sheet Sync' : 'Input Aplikasi',
        targetTab: 'log_task'
      });
    });

    logbookEntries.forEach(log => {
      if (!log || !log.activity) return;
      if (filterMonth && log.date && !log.date.startsWith(filterMonth)) return;
      const id = log.id || `qc-${log.date}-${log.staffName}-${log.activity.slice(0, 10)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const staffVal = log.staffName || 'Teknisi QC';
      if (checkIsDuplicate(log.date, staffVal, log.activity)) return;

      const isNg = log.result === 'NG';
      list.push({
        id,
        date: log.date,
        time: log.time,
        staffName: staffVal,
        division: log.division || 'Umum',
        category: 'Daily Log',
        title: `Daily Log QC ${log.division} (${log.result})`,
        activity: log.activity,
        notes: log.followUp && log.followUp !== '-' ? log.followUp : undefined,
        qcResult: isNg ? 'NG' : 'OK',
        timestamp: parseSafeTimestamp(log.date, log.time, log.id),
        source: 'Form QC Onhouse',
        targetTab: 'log_task'
      });
    });

    // 3. TEMUAN UNIT BERMASALAH OLEH SEMUA DIVISI (Findings Audio, Lighting, Videotron, Multimedia, Service, Gudang)
    findings.forEach(f => {
      if (!f || !f.issue) return;
      if (filterMonth && f.dateCreated && !f.dateCreated.startsWith(filterMonth) && (!f.targetDate || !f.targetDate.startsWith(filterMonth))) return;
      const id = f.id || `find-${f.dateCreated}-${f.equipment}-${f.issue.slice(0, 10)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const dateVal = f.dateCreated || new Date().toISOString().split('T')[0];
      const staffVal = f.pic || 'Teknisi';
      if (checkIsDuplicate(dateVal, staffVal, f.issue)) return;

      list.push({
        id,
        date: dateVal,
        staffName: staffVal,
        division: f.division || 'Semua Divisi',
        category: 'Temuan Unit Bermasalah',
        title: `Temuan Unit: ${f.equipment} (${f.division || 'Umum'})`,
        activity: `${f.issue}${f.targetDate ? ` • Target: ${f.targetDate}` : ''} [Status: ${f.status}]`,
        notes: f.priority ? `Prioritas: ${f.priority}` : undefined,
        qcResult: 'NG',
        timestamp: parseSafeTimestamp(dateVal, undefined, f.id),
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
      const activity = `[${log.type}] ${log.qty || 1} unit ${log.itemName} • PIC: ${log.pic || 'Gudang'}${log.notes ? ` • Catatan: ${log.notes}` : ''}`;
      const dateVal = log.date || new Date().toISOString().split('T')[0];
      const staffVal = log.pic || 'Staff Gudang';

      if (checkIsDuplicate(dateVal, staffVal, activity)) return;

      list.push({
        id,
        date: dateVal,
        staffName: staffVal,
        division: 'Gudang',
        category: 'Mutasi Unit Gudang',
        title,
        activity,
        notes: log.notes && log.notes !== '-' ? log.notes : undefined,
        qcResult: isReceived ? 'OK' : 'INFO',
        timestamp: parseSafeTimestamp(dateVal, undefined, log.id),
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
        activity: alert.message,
        notes: `Masa Berlaku: ${alert.validityPeriod} • Status: ${alert.status === 'expired' ? 'KADALUARSA' : 'H-1 BULAN SEBELUM BERAKHIR'}`,
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

      // 3. Jika tanggal sama, timestamp numerik terbaru paling atas
      if (b.timestamp !== a.timestamp) {
        return b.timestamp - a.timestamp;
      }

      // 4. Stable sort
      return String(b.id || '').localeCompare(String(a.id || ''));
    });
  }, [dailyReports, logbookEntries, findings, dailyTasks, warehouseLogs, activeMonth, effectiveVehicles]);

  // Deteksi penambahan data input secara live dalam sesi aktif untuk memicu Toast
  useEffect(() => {
    if (notifications.length === 0) return;

    // Saat inisialisasi pertama: daftarkan seluruh ID notifikasi yang sudah ada tanpa memicu popup toast
    if (isInitialLoadRef.current) {
      notifications.forEach(n => knownItemIdsRef.current.add(n.id));
      isInitialLoadRef.current = false;
      return;
    }

    // Hanya cari item yang benar-benar baru masuk ke sesi aktif (belum pernah tercatat di knownItemIdsRef)
    const freshNewItems = notifications.filter(n => !knownItemIdsRef.current.has(n.id));
    if (freshNewItems.length > 0) {
      freshNewItems.forEach(n => knownItemIdsRef.current.add(n.id));

      // Cari kandidat yang belum pernah di-dismiss dan belum pernah dibaca
      const toastCandidate = freshNewItems.find(
        n => !dismissedToastIds.has(n.id) && !readIds.has(n.id)
      );

      if (toastCandidate && !isMobileHeader) {
        setLiveToast(toastCandidate);
        const timer = setTimeout(() => {
          setLiveToast(null);
          // Simpan ke dismissed agar tidak pernah memicu toast lagi
          setDismissedToastIds(prev => {
            const next = new Set(prev);
            next.add(toastCandidate.id);
            saveStoredDismissedToastIds(next);
            return next;
          });
        }, 4500);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, isMobileHeader, dismissedToastIds, readIds]);

  // Cek apakah notifikasi berstatus belum dibaca
  const isItemUnread = (item: NotificationItem): boolean => {
    if (readIds.has(item.id)) return false;
    if (lastReadTimestamp > 0 && item.timestamp <= lastReadTimestamp) return false;
    return true;
  };

  // Hitung jumlah notifikasi belum dibaca
  const unreadCount = useMemo(() => {
    if (lastReadTimestamp === 0 && readIds.size === 0) {
      // Default pertama kali buka: tampilkan indikator data terbaru (maks 12 item)
      return Math.min(notifications.length, 12);
    }
    return notifications.filter(n => isItemUnread(n)).length;
  }, [notifications, lastReadTimestamp, readIds]);

  // Total kendala global
  const totalKendalaGlobal = useMemo(() => {
    return notifications.filter(n => n.qcResult === 'NG').length;
  }, [notifications]);

  // Statistik per divisi
  const divisionStats = useMemo(() => {
    const stats: Record<string, { total: number; ng: number }> = {
      Semua: { total: notifications.length, ng: totalKendalaGlobal }
    };
    notifications.forEach(n => {
      if (!stats[n.division]) {
        stats[n.division] = { total: 0, ng: 0 };
      }
      stats[n.division].total += 1;
      if (n.qcResult === 'NG') stats[n.division].ng += 1;
    });
    return stats;
  }, [notifications, totalKendalaGlobal]);

  // Filter notifikasi sesuai tab divisi, kategori input, status, dan pencarian teks
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchDiv = selectedDivision === 'Semua' || n.division === selectedDivision;
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
      setDismissedToastIds(prev => {
        const next = new Set(prev);
        next.add(toastId);
        saveStoredDismissedToastIds(next);
        return next;
      });
      setReadIds(prev => {
        const next = new Set(prev);
        next.add(toastId);
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
      setDismissedToastIds(prev => {
        const next = new Set(prev);
        next.add(toastId);
        saveStoredDismissedToastIds(next);
        return next;
      });
      setReadIds(prev => {
        const next = new Set(prev);
        next.add(toastId);
        saveStoredReadIds(next);
        return next;
      });
      window.dispatchEvent(new CustomEvent('riz-notification-sync'));
    }
    setLiveToast(null);
    handleOpenDrawer();
  };

  const handleOpenDrawer = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(true);
    // Saat drawer dibuka, tandai semua notifikasi saat ini sebagai sudah dibaca
    const maxTimestamp = notifications.reduce((max, n) => Math.max(max, n.timestamp || 0), Date.now());
    const newReadTime = Math.max(Date.now(), maxTimestamp) + 1000;
    setLastReadTimestamp(newReadTime);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(newReadTime));
      localStorage.setItem(READ_STORAGE_KEY_LEGACY, String(newReadTime));
    } catch {}
    setReadIds(prev => {
      const next = new Set(prev);
      notifications.forEach(n => next.add(n.id));
      saveStoredReadIds(next);
      return next;
    });
    if (liveToast) {
      setDismissedToastIds(prev => {
        const next = new Set(prev);
        next.add(liveToast.id);
        saveStoredDismissedToastIds(next);
        return next;
      });
      setLiveToast(null);
    }
    window.dispatchEvent(new CustomEvent('riz-notification-sync'));
  };

  const handleMarkAllRead = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const maxTimestamp = notifications.reduce((max, n) => Math.max(max, n.timestamp || 0), Date.now());
    const newReadTime = Math.max(Date.now(), maxTimestamp) + 1000;
    setLastReadTimestamp(newReadTime);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(newReadTime));
      localStorage.setItem(READ_STORAGE_KEY_LEGACY, String(newReadTime));
    } catch {}
    setReadIds(prev => {
      const next = new Set(prev);
      notifications.forEach(n => next.add(n.id));
      saveStoredReadIds(next);
      return next;
    });
    if (liveToast) {
      setDismissedToastIds(prev => {
        const next = new Set(prev);
        next.add(liveToast.id);
        saveStoredDismissedToastIds(next);
        return next;
      });
      setLiveToast(null);
    }
    window.dispatchEvent(new CustomEvent('riz-notification-sync'));
  };

  const handleItemClick = (item: NotificationItem) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(item.id);
      saveStoredReadIds(next);
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
          className="fixed top-4 right-4 z-[99999] bg-slate-900/95 backdrop-blur-md text-white p-3 px-4 rounded-xl shadow-2xl border border-indigo-500/50 flex items-center gap-3 cursor-pointer max-w-sm hover:border-indigo-400 transition-all select-none"
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
            className="relative z-10 w-full sm:max-w-lg md:max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden h-full max-h-screen"
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
                        {activeMonth && activeMonth !== 'all' ? (activeMonth === '2026-10' ? 'Oktober 2026' : activeMonth === '2026-09' ? 'September 2026' : activeMonth) : 'Semua Periode'}
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
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`rounded-lg border bg-white transition-all shadow-xs overflow-hidden cursor-pointer hover:shadow-md ${
                          isNg
                            ? 'border-l-4 border-l-rose-500 border-slate-200'
                            : 'border-l-4 border-l-emerald-500 border-slate-200'
                        }`}
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

                          {/* Judul & Detail Pekerjaan */}
                          <div
                            className={`rounded p-2 text-xs font-medium leading-relaxed mb-1.5 ${
                              isNg
                                ? 'bg-rose-50/50 text-rose-950 border border-rose-100'
                                : 'bg-slate-50 text-slate-800 border border-slate-100'
                            }`}
                          >
                            <p className="whitespace-pre-line">{item.activity}</p>
                          </div>

                          {/* Catatan Tambahan jika ada */}
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

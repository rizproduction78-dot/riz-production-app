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
  ArrowUpRight
} from 'lucide-react';
import {
  DailyReport,
  LogbookEntry,
  Finding,
  DailyTask,
  WorkOrder,
  AttendanceLog,
  UserActivity,
  OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL,
  OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL
} from '../types';

export interface QCNotificationCenterProps {
  dailyReports?: DailyReport[];
  logbookEntries?: LogbookEntry[];
  findings?: Finding[];
  dailyTasks?: DailyTask[];
  workOrders?: WorkOrder[];
  attendanceLogs?: AttendanceLog[];
  activities?: UserActivity[];
  lastSyncTime?: string | Date | null;
  onNavigateTab?: (tabId: string) => void;
  buttonClassName?: string;
  isMobileHeader?: boolean;
}

const READ_STORAGE_KEY = 'riz_notification_center_last_read_v2';

export type NotificationCategory =
  | 'Semua Kategori'
  | 'Laporan Harian'
  | 'QC Checklist'
  | 'Daily Task'
  | 'Temuan Kendala'
  | 'Work Order'
  | 'Absensi'
  | 'Aktivitas';

export interface NotificationItem {
  id: string;
  date: string;
  time?: string;
  staffName: string;
  division: string;
  category: 'Laporan Harian' | 'QC Checklist' | 'Daily Task' | 'Temuan Kendala' | 'Work Order' | 'Absensi' | 'Aktivitas';
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
  workOrders = [],
  attendanceLogs = [],
  activities = [],
  lastSyncTime,
  onNavigateTab,
  buttonClassName = '',
  isMobileHeader = false
}: QCNotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('Semua Kategori');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NG' | 'OK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveToast, setLiveToast] = useState<NotificationItem | null>(null);

  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const previousCountRef = useRef<number>(0);

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
  const parseSafeTimestamp = (dateStr?: string, idStr?: string): number => {
    if (!dateStr) return Date.now();
    
    // Coba ekstrak timestamp numerik dari ID jika format id-timestamp
    if (idStr && idStr.includes('-')) {
      const parts = idStr.split('-');
      const last = parts[parts.length - 1];
      const parsedNum = parseInt(last, 10);
      if (!isNaN(parsedNum) && parsedNum > 1500000000000) {
        return parsedNum;
      }
    }

    // Format ISO atau YYYY-MM-DD
    const isoDate = new Date(dateStr.length === 10 ? `${dateStr}T12:00:00+07:00` : dateStr);
    const timeVal = isoDate.getTime();
    return isNaN(timeVal) ? Date.now() : timeVal;
  };

  // Menggabungkan SELURUH rekaman input data user (Laporan Harian, QC, Daily Task, Temuan, WO, Absensi)
  const notifications = useMemo(() => {
    const list: NotificationItem[] = [];
    const seenIds = new Set<string>();

    // 1. INPUT LAPORAN HARIAN (Daily Reports)
    dailyReports.forEach(rep => {
      if (!rep || !rep.activity || rep.activity === '-' || String(rep.activity).trim() === '') return;
      const id = rep.id || `rep-${rep.date}-${rep.staffName}-${rep.activity.slice(0, 10)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const lowerAct = String(rep.activity).toLowerCase();
      const lowerNotes = String(rep.notes || '').toLowerCase();
      const isKendala = STRICT_FINDING_TERMS.some(t => lowerAct.includes(t) || lowerNotes.includes(t));

      list.push({
        id,
        date: rep.date,
        staffName: rep.staffName || 'Staff',
        division: rep.division || 'Umum',
        category: 'Laporan Harian',
        title: `Input Laporan Harian: ${rep.staffName}`,
        activity: rep.activity,
        notes: rep.notes && rep.notes !== '-' ? rep.notes : undefined,
        qcResult: isKendala ? 'NG' : 'OK',
        timestamp: parseSafeTimestamp(rep.date, rep.id),
        source: rep._source === 'google_sheet' ? 'Google Sheet Sync' : 'Input Aplikasi',
        targetTab: 'log_task'
      });
    });

    // 2. INPUT CHECKLIST QC / LOGBOOK (Logbook Entries)
    logbookEntries.forEach(log => {
      if (!log || !log.activity) return;
      const id = log.id || `qc-${log.date}-${log.staffName}-${log.activity.slice(0, 10)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      const isNg = log.result === 'NG';
      list.push({
        id,
        date: log.date,
        staffName: log.staffName || 'Teknisi QC',
        division: log.division || 'Umum',
        category: 'QC Checklist',
        title: `Input QC ${log.division} (${log.result})`,
        activity: log.activity,
        notes: log.followUp && log.followUp !== '-' ? log.followUp : undefined,
        qcResult: isNg ? 'NG' : 'OK',
        timestamp: parseSafeTimestamp(log.date, log.id),
        source: 'Form QC Onhouse',
        targetTab: 'log_task'
      });
    });

    // 3. INPUT DAILY TASK KANBAN
    dailyTasks.forEach(task => {
      if (!task || !task.title) return;
      const id = task.id || `task-${task.createdAt || Date.now()}-${task.title}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      list.push({
        id,
        date: task.createdAt ? task.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        staffName: task.assignedName || task.assignedTo || 'Tim Lapangan',
        division: task.division || 'Umum',
        category: 'Daily Task',
        title: `Input Tugas: ${task.title}`,
        activity: `${task.description || task.title}${task.dueDate ? ` • Target: ${task.dueDate}` : ''} [Status: ${task.status}]`,
        qcResult: task.status === 'Done' ? 'OK' : 'INFO',
        timestamp: parseSafeTimestamp(task.createdAt, task.id),
        source: 'Daily Task Kanban',
        targetTab: 'log_task'
      });
    });

    // 4. INPUT TEMUAN KENDALA (Findings)
    findings.forEach(f => {
      if (!f || !f.issue) return;
      const id = f.id || `find-${f.dateCreated}-${f.equipment}-${f.issue.slice(0, 10)}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      list.push({
        id,
        date: f.dateCreated || new Date().toISOString().split('T')[0],
        staffName: f.pic || 'Teknisi',
        division: f.division || 'Service',
        category: 'Temuan Kendala',
        title: `Input Temuan Kendala: ${f.equipment}`,
        activity: `${f.issue}${f.targetDate ? ` • Target: ${f.targetDate}` : ''} [Status: ${f.status}]`,
        notes: f.priority ? `Prioritas: ${f.priority}` : undefined,
        qcResult: 'NG',
        timestamp: parseSafeTimestamp(f.dateCreated, f.id),
        source: 'Log Temuan Kerusakan',
        targetTab: 'findings'
      });
    });

    // 5. INPUT WORK ORDER (WO)
    workOrders.forEach(wo => {
      if (!wo || !wo.title) return;
      const id = wo.id || `wo-${wo.dateCreated}-${wo.title}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      list.push({
        id,
        date: wo.dateCreated ? wo.dateCreated.split('T')[0] : new Date().toISOString().split('T')[0],
        staffName: wo.pic || 'Tim Perbaikan',
        division: wo.division || 'Service',
        category: 'Work Order',
        title: `Input Work Order: ${wo.title}`,
        activity: `Prioritas: ${wo.priority || 'Normal'} • Status: ${wo.status} • Target: ${wo.deadline || '-'}`,
        qcResult: wo.status === 'Completed' ? 'OK' : 'INFO',
        timestamp: parseSafeTimestamp(wo.dateCreated, wo.id),
        source: 'Work Order Management',
        targetTab: 'findings'
      });
    });

    // 6. INPUT ABSENSI (Attendance Logs)
    attendanceLogs.forEach(att => {
      if (!att || !att.staffName) return;
      const id = att.id || `att-${att.date}-${att.staffName}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      list.push({
        id,
        date: att.date,
        staffName: att.staffName,
        division: att.division || 'Umum',
        category: 'Absensi',
        title: `Input Absensi: ${att.staffName}`,
        activity: `Status: ${att.status} • Jam Masuk: ${att.checkInTime || '-'} ${att.isLate ? `(Terlambat ${att.lateMinutes} menit)` : '(Tepat Waktu)'}`,
        notes: att.checkInGps ? `GPS: ${att.checkInGps}` : undefined,
        qcResult: att.isLate ? 'NG' : 'OK',
        timestamp: parseSafeTimestamp(att.date, att.id),
        source: 'Absensi Mandiri (GPS + Selfie)',
        targetTab: 'absensi_self'
      });
    });

    // 7. INPUT AKTIVITAS OPERASIONAL (Activities)
    activities.forEach(act => {
      if (!act || !act.action || act.username === 'System Boot') return;
      const id = act.id || `act-${act.timestamp}-${act.username}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);

      list.push({
        id,
        date: new Date().toISOString().split('T')[0],
        time: act.timestamp,
        staffName: act.username,
        division: act.role || 'Operasional',
        category: 'Aktivitas',
        title: `Aktivitas Input: ${act.username}`,
        activity: act.action,
        qcResult: 'INFO',
        timestamp: Date.now(),
        source: 'Audit Log Real-Time',
        targetTab: 'activities'
      });
    });

    // Urutkan dari data terbaru ke data terlama (Descending timestamp)
    return list.sort((a, b) => b.timestamp - a.timestamp);
  }, [dailyReports, logbookEntries, findings, dailyTasks, workOrders, attendanceLogs, activities]);

  // Deteksi penambahan data input secara live dalam sesi aktif untuk memicu Toast
  useEffect(() => {
    if (notifications.length > previousCountRef.current && previousCountRef.current > 0) {
      const newestItem = notifications[0];
      if (newestItem) {
        setLiveToast(newestItem);
        const timer = setTimeout(() => {
          setLiveToast(null);
        }, 4500);
        return () => clearTimeout(timer);
      }
    }
    previousCountRef.current = notifications.length;
  }, [notifications]);

  // Hitung jumlah notifikasi belum dibaca
  const unreadCount = useMemo(() => {
    if (lastReadTimestamp === 0) {
      // Default pertama kali buka: tampilkan indikator data terbaru (maks 15 item)
      return Math.min(notifications.length, 12);
    }
    return notifications.filter(n => n.timestamp > lastReadTimestamp).length;
  }, [notifications, lastReadTimestamp]);

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
      const matchCat = selectedCategory === 'Semua Kategori' || n.category === selectedCategory;
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

  const handleOpenDrawer = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(true);
    const now = Date.now();
    setLastReadTimestamp(now);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(now));
    } catch {}
  };

  const handleMarkAllRead = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const now = Date.now();
    setLastReadTimestamp(now);
    try {
      localStorage.setItem(READ_STORAGE_KEY, String(now));
    } catch {}
  };

  const handleItemClick = (item: NotificationItem) => {
    if (onNavigateTab && item.targetTab) {
      const target = item.targetTab === 'absensi' ? 'absensi_self' : item.targetTab;
      onNavigateTab(target);
      setIsOpen(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Laporan Harian': return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'QC Checklist': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Daily Task': return <ClipboardList className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Temuan Kendala': return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'Work Order': return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case 'Absensi': return <UserCheck className="w-3.5 h-3.5 text-purple-600" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-600" />;
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
        title="Buka Pusat Notifikasi Input Data User & QC"
        aria-label="Buka Pusat Notifikasi Input Data User & QC"
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
          <span className="ml-1.5 hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200 pointer-events-none">
            {totalKendalaGlobal} Kendala
          </span>
        )}
      </button>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. REAL-TIME LIVE TOAST NOTIFICATION (Pop-up Singkat)       */}
      {/* ────────────────────────────────────────────────────────── */}
      {liveToast && (
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiveToast(null);
            handleOpenDrawer();
          }}
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
            onClick={(e) => {
              e.stopPropagation();
              setLiveToast(null);
            }}
            className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
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
                        Pusat Notifikasi Input Data & QC
                      </h2>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-mono font-bold uppercase tracking-wider shrink-0">
                        Live Sync
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      Monitoring Seluruh Input Staf • PT. Riz Production Multi Kreasi
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
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
              
              {/* Baris 1: Filter Kategori Input Data */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[
                  'Semua Kategori',
                  'QC Checklist',
                  'Daily Task',
                  'Temuan Kendala',
                  'Laporan Harian',
                  'Absensi'
                ].map(cat => {
                  const isSelected = selectedCategory === cat;
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
                filteredNotifications.map(item => {
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
                            <span className="text-[10px] font-mono text-slate-400 font-semibold">
                              {item.time || item.date}
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
                })
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

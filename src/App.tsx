/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Staff, LogbookEntry, DailyReport as DailyReportType, Finding, Asset, WorkOrder, MaintenanceSchedule, UserActivity, DailyTask, AttendanceLog, WarehouseLog, OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL } from './types';
import {
  STAFF_LIST,
  getMasterStaffList,
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_FINDINGS,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_DAILY_REPORTS,
  INITIAL_DAILY_TASKS,
  INITIAL_FREELANCE_WORKERS,
  INITIAL_VEHICLES,
  INITIAL_JOB_ASSIGNMENTS,
  normalizeVehiclesMaster,
  normalizeJobAssignmentsMaster
} from './data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from './data/september2026Schedule';
import { getActiveMonthKey, ALL_MONTHLY_SCHEDULES, formatMonthLabel } from './data/staffSchedules';
import { isStaffMatch } from './utils/kpiCalculator';

import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import DailyReport from './components/DailyReport';
import LogTaskModule from './components/LogTaskModule';
import Findings from './components/Findings';
import Maintenance from './components/Maintenance';
import AssetManagement from './components/AssetManagement';
import Reports from './components/Reports';
import ActivityHistory from './components/ActivityHistory';
import Absensi from './components/Absensi';
import Gudang from './components/Gudang';
import CareerCompetencyModule from './components/CareerCompetencyModule';
import EmployeePerformanceModule from './components/EmployeePerformanceModule';
import AdminPanel from './components/AdminPanel';
import QCNotificationCenter from './components/QCNotificationCenter';

import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  AlertOctagon,
  Wrench,
  Package,
  FileCheck,
  History,
  LogOut,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  UserCheck,
  Zap,
  Calendar,
  Award,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Sliders,
  Truck,
  Briefcase,
  Download,
  Smartphone,
  Share,
  Folder,
  Boxes
} from 'lucide-react';
import {
  subscribeCloudCollection,
  saveCloudDoc,
  deleteCloudDoc,
  clearDeletedId,
  forceSyncAllModules,
  subscribeSyncStatus,
  normalizeCollectionItems,
  SyncStatus
} from './lib/cloudSync';
import { checkIsQc } from './lib/dailySheetParser';
import { workspaceManager } from './lib/workspaceConfig';
import {
  pullDailyLogFromGviz,
  getGidForMonth,
  getDailyLogLastPull,
  appendDailyReportToGoogleSheet,
  isFindingRemark
} from './lib/googleSheetSync';

export default function App() {
  const activeWorkspace = workspaceManager.getActiveWorkspace();

  // Session State
  const [currentUser, setCurrentUser] = useState<Staff | null>(() => {
    const saved = localStorage.getItem('riz_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>(() => {
    const saved = localStorage.getItem('riz_active_tab');
    return saved && saved !== 'assets' ? saved : 'dashboard';
  });

  // Active Month for multi-month schedule system (Default: Bulan Kalender Aktif)
  const [activeMonth, setActiveMonth] = useState<string>(() => {
    const currentCalendarMonth = getActiveMonthKey();
    const lastCalendarMonth = localStorage.getItem('riz_last_calendar_month');
    const saved = localStorage.getItem('riz_active_month');
    if (lastCalendarMonth !== currentCalendarMonth) {
      try {
        localStorage.setItem('riz_last_calendar_month', currentCalendarMonth);
        localStorage.setItem('riz_active_month', currentCalendarMonth);
      } catch (e) {}
      return currentCalendarMonth;
    }
    return saved || currentCalendarMonth;
  });

  const handleActiveMonthChange = (monthKey: string) => {
    setActiveMonth(monthKey);
    try {
      localStorage.setItem('riz_active_month', monthKey);
    } catch (e) {}
  };

  // Mobile sidebar menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Master Staff List State with Cloud Sync
  const [staffList, setStaffList] = useState<Staff[]>(() => getMasterStaffList());

  // PWA Install Prompt State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showIOSInstallGuide, setShowIOSInstallGuide] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Check if running on iOS (iPhone/iPad)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // Check if already launched as standalone PWA (iOS Safari / Android Chrome)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true;
    if (isStandalone) {
      setIsAppInstalled(true);
    }

    const unsubStaff = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setStaffList,
      STAFF_LIST
    );

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      unsubStaff();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsAppInstalled(true);
      }
      setDeferredInstallPrompt(null);
    } else if (isIOSDevice && !isAppInstalled) {
      setShowIOSInstallGuide(true);
    }
  };

  // Define tab navigation elements based on current user role (Hak Akses)
  interface NavigationItem {
    id: string;
    label: string;
    icon: any;
    category: string;
  }

  const NAVIGATION_ITEMS: NavigationItem[] = (() => {
    if (!currentUser) return [];
    const role = currentUser?.role;
    const isOwnerOrAdmin = currentUser?.division === 'Admin' || role === 'Owner' || role === 'Direktur' || role === 'Admin' || currentUser?.id === 'director-wahyu' || String(currentUser?.name || '').toLowerCase().includes('wahyu (owner)');

    // 1. Owner & Admin / Management (Fitur Lengkap Sesuai Workflow Operasional 5W)
    if (isOwnerOrAdmin) {
      return [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'job_schedule', label: 'Jadwal Penugasan Kerja', icon: Briefcase, category: 'Operasional 5W & QC' },
        { id: 'absensi_schedule', label: 'Jadwal Shift (1-31)', icon: Calendar, category: 'Operasional 5W & QC' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'Operasional 5W & QC' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional 5W & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional 5W & QC' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'kinerja_karyawan', label: 'Kinerja & KPI Karyawan', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' },
        { id: 'reports', label: 'Laporan & Ekspor', icon: FileCheck, category: 'Laporan & Sistem' },
        { id: 'activities', label: 'Audit Aktivitas', icon: History, category: 'Laporan & Sistem' },
        { id: 'admin_panel', label: 'Panel Kontrol Admin', icon: Sliders, category: 'Laporan & Sistem' }
      ];
    }
    
    // 2. Manager
    if (role === 'Manager') {
      return [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'job_schedule', label: 'Jadwal Penugasan Kerja', icon: Briefcase, category: 'Operasional 5W & QC' },
        { id: 'absensi_schedule', label: 'Jadwal Shift (1-31)', icon: Calendar, category: 'Operasional 5W & QC' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'Operasional 5W & QC' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional 5W & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional 5W & QC' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'kinerja_karyawan', label: 'Kinerja & KPI Karyawan', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' },
        { id: 'reports', label: 'Laporan & Approval', icon: FileCheck, category: 'Laporan & Sistem' },
        { id: 'activities', label: 'Audit Aktivitas', icon: History, category: 'Laporan & Sistem' },
        { id: 'admin_panel', label: 'Panel Kontrol Admin', icon: Sliders, category: 'Laporan & Sistem' }
      ];
    }
    
    // 3. Supervisor
    if (role === 'Supervisor') {
      return [
        { id: 'dashboard', label: 'Dashboard Monitoring', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'job_schedule', label: 'Jadwal Penugasan Kerja', icon: Briefcase, category: 'Operasional 5W & QC' },
        { id: 'absensi_schedule', label: 'Jadwal Shift (1-31)', icon: Calendar, category: 'Operasional 5W & QC' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'Operasional 5W & QC' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional 5W & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional 5W & QC' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' },
        { id: 'reports', label: 'Approval & Laporan', icon: FileCheck, category: 'Laporan & Sistem' },
        { id: 'activities', label: 'Audit Aktivitas', icon: History, category: 'Laporan & Sistem' },
        { id: 'admin_panel', label: 'Panel Kontrol Admin', icon: Sliders, category: 'Laporan & Sistem' }
      ];
    }
    
    // 4. Team Leader
    if (role === 'Team Leader') {
      return [
        { id: 'dashboard', label: 'Dashboard Divisi', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'job_schedule', label: `Jadwal Penugasan (${currentUser.nickname || currentUser.name.split(' ')[0]})`, icon: Briefcase, category: 'Operasional 5W & QC' },
        { id: 'absensi_schedule', label: 'Jadwal Kerja (1-31)', icon: Calendar, category: 'Operasional 5W & QC' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'Operasional 5W & QC' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional 5W & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional 5W & QC' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'reports', label: 'Laporan Divisi', icon: FileCheck, category: 'Laporan & Sistem' }
      ];
    }
    
    // 5. Staff
    if (role === 'Staff') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'job_schedule', label: `Jadwal Penugasan (${currentUser.nickname || currentUser.name.split(' ')[0]})`, icon: Briefcase, category: 'Operasional 5W & QC' },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck, category: 'Operasional 5W & QC' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional 5W & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional 5W & QC' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
        { id: 'kinerja_karyawan', label: 'Kinerja Saya', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' }
      ];
    }
    
    // 6. Gudang
    if (role === 'Gudang') {
      return [
        { id: 'dashboard', label: 'Dashboard Gudang', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'job_schedule', label: `Jadwal Penugasan (${currentUser.nickname || currentUser.name.split(' ')[0]})`, icon: Briefcase, category: 'Operasional 5W & QC' },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck, category: 'Operasional 5W & QC' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'log_task', label: 'Log Task / Daily Task', icon: ClipboardList, category: 'Operasional 5W & QC' },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' }
      ];
    }
    
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Ringkasan' },
      { id: 'job_schedule', label: 'Jadwal Penugasan Kerja', icon: Briefcase, category: 'Operasional 5W & QC' },
      { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'Operasional 5W & QC' },
      { id: 'log_task', label: 'Log Task / Daily Task', icon: ClipboardList, category: 'Operasional 5W & QC' },
      { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
      { id: 'gudang_inventory', label: 'Susunan Unit Inventory', icon: Boxes, category: 'Logistik & Fasilitas' },
      { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Evaluasi KPI' },
      { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Evaluasi KPI' },
      { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' }
    ];
  })();

  // Helper untuk memeriksa status aktif jalur penghubung (termasuk sub-jalur seperti 'qc', 'daily', dan 'work_orders')
  const isTabActive = (tabId: string) => {
    if (activeTab === tabId) return true;
    if (tabId === 'log_task' && (activeTab === 'daily' || activeTab === 'qc')) return true;
    if (tabId === 'findings' && activeTab === 'work_orders') return true;
    if (tabId === 'gudang' && activeTab === 'armada') return true;
    return false;
  };

  // Group navigation items by category
  const groupedNavItems = NAVIGATION_ITEMS.reduce<Record<string, NavigationItem[]>>((acc, item) => {
    const cat = item.category || 'Lainnya';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Redirect to first allowed tab if current active tab is not allowed for the role
  useEffect(() => {
    if (currentUser) {
      const allowedTabIds = NAVIGATION_ITEMS.map(item => item.id);
      const isAllowed = allowedTabIds.includes(activeTab) ||
        ((activeTab === 'daily' || activeTab === 'qc') && allowedTabIds.includes('log_task')) ||
        (activeTab === 'work_orders' && allowedTabIds.includes('findings')) ||
        (activeTab === 'armada' && allowedTabIds.includes('gudang'));
      if (allowedTabIds.length > 0 && !isAllowed) {
        setActiveTab(allowedTabIds[0]);
      }
    }
  }, [currentUser, activeTab]);

  // Forced one-time re-sync for all official data from Google Sheet & Google Calendar reference while preserving 100% of user edits
  const REF_SYNC_KEY = 'riz_ref_synced_v110_gcal_strict_job_event_2026';
  if (typeof window !== 'undefined' && !localStorage.getItem(REF_SYNC_KEY)) {
    const mergeById = <T extends { id: string }>(canonical: T[], storageKey: string): T[] => {
      try {
        const raw = localStorage.getItem(storageKey);
        const existing: T[] = raw ? JSON.parse(raw) : [];
        const map = new Map<string, T>();
        // 1. Place canonical baseline first
        canonical.forEach(item => { if (item?.id) map.set(item.id, item); });
        // 2. Overlay existing user data on top so user edits NEVER revert back
        if (Array.isArray(existing)) {
          existing.forEach((item: any) => {
            if (!item?.id) return;
            const idStr = String(item.id);
            const isUserEdited = Boolean(item._userEdited || item._syncMeta?._userEdited);
            // Bersihkan entri usang/test yang belum pernah diedit user dan tidak ada di canonical
            if (!isUserEdited && !map.has(idStr)) {
              return;
            }
            const canonItem = map.get(idStr) as any;
            if (canonItem) {
              if (isUserEdited) {
                map.set(idStr, { ...canonItem, ...item });
              } else {
                map.set(idStr, {
                  ...item,
                  ...canonItem,
                  ...(item.status === 'Close' || item.status === 'Completed' ? { status: item.status } : {}),
                  ...(item.approvedBy ? { approvedBy: item.approvedBy } : {}),
                  ...(item.approvedAt ? { approvedAt: item.approvedAt } : {}),
                });
              }
            } else {
              map.set(idStr, item);
            }
          });
        }
        return Array.from(map.values());
      } catch {
        return canonical;
      }
    };
    const mergedDailyTasks = normalizeCollectionItems('daily_tasks', mergeById(INITIAL_DAILY_TASKS, 'riz_daily_tasks_v2'));
    localStorage.setItem('riz_findings_v2', JSON.stringify(normalizeCollectionItems('findings', mergeById(INITIAL_FINDINGS, 'riz_findings_v2'))));
    localStorage.setItem('riz_daily_tasks_v2', JSON.stringify(mergedDailyTasks));
    localStorage.setItem('riz_daily_tasks', JSON.stringify(mergedDailyTasks));
    localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(normalizeCollectionItems('logbook_entries', mergeById(INITIAL_LOGBOOK_ENTRIES, 'riz_logbook_entries_v2'))));
    localStorage.setItem('riz_daily_reports_v2', JSON.stringify(normalizeCollectionItems('daily_reports', mergeById(INITIAL_DAILY_REPORTS, 'riz_daily_reports_v2'))));
    localStorage.setItem('riz_work_orders_v2', JSON.stringify(normalizeCollectionItems('work_orders', mergeById(INITIAL_WORK_ORDERS, 'riz_work_orders_v2'))));
    localStorage.setItem('riz_master_staff_list', JSON.stringify(normalizeCollectionItems('master_staff', mergeById(STAFF_LIST, 'riz_master_staff_list'))));
    localStorage.setItem('riz_freelance_workers', JSON.stringify(normalizeCollectionItems('freelance_workers', mergeById(INITIAL_FREELANCE_WORKERS, 'riz_freelance_workers'))));
    localStorage.setItem('riz_master_vehicles', JSON.stringify(normalizeVehiclesMaster(mergeById(INITIAL_VEHICLES, 'riz_master_vehicles'))));
    localStorage.setItem('riz_assets', JSON.stringify(normalizeCollectionItems('assets', mergeById(INITIAL_ASSETS, 'riz_assets'))));
    localStorage.removeItem('riz_job_assignments_v1');
    localStorage.setItem(
      'riz_job_assignments_gcal_v2',
      JSON.stringify(normalizeJobAssignmentsMaster(mergeById(INITIAL_JOB_ASSIGNMENTS, 'riz_job_assignments_gcal_v2')))
    );
    localStorage.removeItem('riz_notification_known_revisions_v4');
    localStorage.removeItem('riz_notification_read_ids_v4');
    ALL_MONTHLY_SCHEDULES.forEach(sch => {
      if (!localStorage.getItem(`riz_schedule_${sch.key}`)) {
        localStorage.setItem(`riz_schedule_${sch.key}`, JSON.stringify(sch.rows));
      }
    });

    localStorage.setItem(REF_SYNC_KEY, 'true');

    // Hapus ID duplikat/usang dari penyimpanan Cloud
    ['dt-20261101-02', 'dt-20261101-03', 'task-test-777'].forEach(id => deleteCloudDoc('daily_tasks', id).catch(() => {}));
    deleteCloudDoc('logbook_entries', 'lg-test-888').catch(() => {});
    [
      'find-20261101-kharo-2',
      'find-20261103-heri-1',
      'find-20261103-yudis-1',
      'find-20261104-butonk-1',
      'gsheet-finding-2026-11-02-Udah_Ga_bisa_ngisi',
      'gsheet-finding-2026-11-03--_Rapih_Sesuai_Tulisan_Dibok_-',
      'gsheet-finding-2026-11-03-2_unit_minta_ganti_recivibg_ca',
      'gsheet-finding-2026-11-03-2_unit_minta_ganti_recieving_c',
      'gsheet-finding-2026-11-03-2_unit_minta_ganti_reciving_ca',
      'gsheet-finding-2026-11-04-Rekon-Kit_Twitter_masih_bermas',
      'gsheet-finding-2026-10-02-Aman_Beres_Perbaikan_Perbaikan',
      'gsheet-finding-2021-09-21--_Cover2_lengkap',
    ].forEach(id => deleteCloudDoc('findings', id).catch(() => {}));
    [
      'rep-20261101-staff-mulyana-1',
      'rep-20261102-staff-unyin-3',
      'rep-20261102-staff-rahmat-9',
      'rep-20261102-staff-mulyadi-13',
      'rep-20261103-staff-yudish-17',
      'rep-20261103-unknown-17',
      'rep-20261103-staff-heri-29',
      'rep-20261103-staff-mulyana-40',
      'rep-20261104-staff-iwan-44',
      'dr-test-999',
    ].forEach(id => deleteCloudDoc('daily_reports', id).catch(() => {}));
    ['wo-20261101-kharo-2', 'wo-20261103-heri-1', 'wo-20261103-yudis-1', 'wo-20261104-butonk-1'].forEach(id => deleteCloudDoc('work_orders', id).catch(() => {}));
    deleteCloudDoc('master_staff', 'staff-chandra').catch(() => {});
    deleteCloudDoc('master_staff', 'staff-rizky').catch(() => {});
  }

  // Core States - Bersih murni dari data dummy & tersinkronisasi data riil resmi
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>(() => {
    let baseLogs = INITIAL_LOGBOOK_ENTRIES;
    const saved = localStorage.getItem('riz_logbook_entries_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map(baseLogs.map(l => [l.id, l]));
          parsed.forEach((l: LogbookEntry) => map.set(l.id, l));
          return normalizeCollectionItems('logbook_entries', Array.from(map.values()));
        }
      } catch (e) {}
    }
    return normalizeCollectionItems('logbook_entries', baseLogs);
  });

  const [dailyReports, setDailyReports] = useState<DailyReportType[]>(() => {
    let baseReports = INITIAL_DAILY_REPORTS;
    const saved = localStorage.getItem('riz_daily_reports_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map(baseReports.map(r => [r.id, r]));
          parsed.forEach((r: DailyReportType) => map.set(r.id, r));
          return normalizeCollectionItems('daily_reports', Array.from(map.values()));
        }
      } catch (e) {}
    }
    return normalizeCollectionItems('daily_reports', baseReports);
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const map = new Map<string, DailyTask>(INITIAL_DAILY_TASKS.map(t => [t.id, t]));
    const saved = localStorage.getItem('riz_daily_tasks_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((t: DailyTask) => { if (t?.id) map.set(t.id, t); });
        }
      } catch (e) {}
    }
    return normalizeCollectionItems('daily_tasks', Array.from(map.values()));
  });

  const [findings, setFindings] = useState<Finding[]>(() => {
    const map = new Map<string, Finding>(INITIAL_FINDINGS.map(f => [f.id, f]));
    const saved = localStorage.getItem('riz_findings_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((f: Finding) => { if (f?.id) map.set(f.id, f); });
        }
      } catch (e) {}
    }
    let baseFindings: Finding[] = Array.from(map.values());
    // Normalisasi dan deduplikasi semantik kanonikal lokal
    baseFindings = normalizeCollectionItems('findings', baseFindings);

    // Apply status lock so initial render always shows correct status
    try {
      const lockKey = 'riz_findings_status_lock';
      const rawLocks = localStorage.getItem(lockKey);
      if (rawLocks) {
        const locks: Record<string, any> = JSON.parse(rawLocks);
        return baseFindings.map(f => {
          const lock = locks[f.id];
          if (!lock) return f;
          return {
            ...f,
            status: lock.status as 'Open' | 'Close',
            ...(lock.approvedBy ? { approvedBy: lock.approvedBy } : {}),
            ...(lock.approvedAt ? { approvedAt: lock.approvedAt } : {})
          };
        });
      }
    } catch (e) {}
    return baseFindings;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('riz_assets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return normalizeCollectionItems('assets', parsed);
        }
      } catch (e) {}
    }
    return normalizeCollectionItems('assets', INITIAL_ASSETS);
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const map = new Map<string, WorkOrder>(INITIAL_WORK_ORDERS.map(w => [w.id, w]));
    const saved = localStorage.getItem('riz_work_orders_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((w: WorkOrder) => { if (w?.id) map.set(w.id, w); });
        }
      } catch (e) {}
    }
    const baseWO: WorkOrder[] = Array.from(map.values());
    // Apply work order status lock so initial render always shows correct status
    try {
      const woLockKey = 'riz_work_orders_status_lock';
      const rawWoLocks = localStorage.getItem(woLockKey);
      if (rawWoLocks) {
        const woLocks: Record<string, any> = JSON.parse(rawWoLocks);
        return baseWO.map(w => {
          const lock = woLocks[w.id];
          if (!lock) return w;
          return {
            ...w,
            status: lock.status,
            progress: lock.progress !== undefined ? lock.progress : (lock.status === 'Completed' ? 100 : w.progress),
            ...(lock.approvedBy ? { approvedBy: lock.approvedBy } : {}),
            ...(lock.approvedAt ? { approvedAt: lock.approvedAt } : {})
          };
        });
      }
    } catch (e) {}
    return baseWO;
  });

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    const saved = localStorage.getItem('riz_schedules');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_SCHEDULES;
  });

  const [activities, setActivities] = useState<UserActivity[]>(() => {
    try {
      const saved = localStorage.getItem('riz_activities');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Bersihkan seluruh rekaman aktifitas server penarikan/pengiriman data
          const userOnly = parsed.filter(act =>
            act &&
            act.role !== 'Server' &&
            act.username !== 'System Auto-Sync' &&
            act.username !== 'System Boot' &&
            !String(act.action || '').toLowerCase().includes('sinkronisasi') &&
            !String(act.action || '').toLowerCase().includes('auto-sync')
          );
          localStorage.setItem('riz_activities', JSON.stringify(userOnly));
          return userOnly;
        }
      }
    } catch {}
    return [];
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    try {
      const saved = localStorage.getItem('riz_attendance_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [warehouseLogs, setWarehouseLogs] = useState<WarehouseLog[]>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('riz_warehouse_logs');
        if (saved) {
          const parsed: WarehouseLog[] = JSON.parse(saved);
          return parsed.filter(l => l && l.id !== 'wl-1' && l.id !== 'wl-2');
        }
      }
    } catch {}
    return [];
  });

  // Google Sheet Daily Log Pull State
  const [isSyncingSheet, setIsSyncingSheet] = useState<boolean>(false);
  const [lastSheetPull, setLastSheetPull] = useState<string | null>(() => getDailyLogLastPull());
  const [sheetPullMessage, setSheetPullMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Cloud Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSyncing: false,
    lastSyncedAt: null,
    syncedCollections: {}
  });

  // Real-time Cloud Subscriptions
  useEffect(() => {
    const unsubStatus = subscribeSyncStatus(setSyncStatus);

    const unsubLogbook = subscribeCloudCollection<LogbookEntry>(
      'logbook_entries',
      'riz_logbook_entries_v2',
      setLogbookEntries,
      INITIAL_LOGBOOK_ENTRIES
    );

    const unsubReports = subscribeCloudCollection<DailyReportType>(
      'daily_reports',
      'riz_daily_reports_v2',
      setDailyReports,
      INITIAL_DAILY_REPORTS
    );

    const unsubTasks = subscribeCloudCollection<DailyTask>(
      'daily_tasks',
      'riz_daily_tasks_v2',
      setDailyTasks,
      INITIAL_DAILY_TASKS
    );

    const unsubFindings = subscribeCloudCollection<Finding>(
      'findings',
      'riz_findings_v2',
      setFindings,
      INITIAL_FINDINGS
    );

    const unsubAssets = subscribeCloudCollection<Asset>(
      'assets',
      'riz_assets',
      setAssets,
      INITIAL_ASSETS
    );

    const unsubWO = subscribeCloudCollection<WorkOrder>(
      'work_orders',
      'riz_work_orders_v2',
      setWorkOrders,
      INITIAL_WORK_ORDERS
    );

    const unsubSchedules = subscribeCloudCollection<MaintenanceSchedule>(
      'maintenance_schedules',
      'riz_schedules',
      setSchedules,
      INITIAL_MAINTENANCE_SCHEDULES
    );

    const unsubActivities = subscribeCloudCollection<UserActivity>(
      'activities',
      'riz_activities',
      (items) => {
        // Filter agar aktifitas server penarikan/pengiriman data tidak dimunculkan
        const userOnly = items.filter(act =>
          act &&
          act.role !== 'Server' &&
          act.username !== 'System Auto-Sync' &&
          act.username !== 'System Boot' &&
          !String(act.action || '').toLowerCase().includes('sinkronisasi') &&
          !String(act.action || '').toLowerCase().includes('auto-sync')
        );
        setActivities(userOnly);
      },
      []
    );

    const unsubAttendance = subscribeCloudCollection<AttendanceLog>(
      'attendance_logs',
      'riz_attendance_logs',
      setAttendanceLogs,
      []
    );

    const unsubWarehouse = subscribeCloudCollection<WarehouseLog>(
      'warehouse_logs',
      'riz_warehouse_logs',
      (items) => {
        setWarehouseLogs(items.filter(l => l && l.id !== 'wl-1' && l.id !== 'wl-2'));
      },
      []
    );

    const handleDailyTasksSynced = (e: Event) => {
      const customEvt = e as CustomEvent<DailyTask[]>;
      if (Array.isArray(customEvt.detail)) {
        setDailyTasks(normalizeCollectionItems('daily_tasks', customEvt.detail));
      }
    };
    window.addEventListener('riz-daily-tasks-synced', handleDailyTasksSynced);

    return () => {
      window.removeEventListener('riz-daily-tasks-synced', handleDailyTasksSynced);
      unsubStatus();
      unsubLogbook();
      unsubReports();
      unsubTasks();
      unsubFindings();
      unsubAssets();
      unsubWO();
      unsubSchedules();
      unsubActivities();
      unsubAttendance();
      unsubWarehouse();
    };
  }, []);

  // Persistence hooks for user and tab
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('riz_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('riz_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('riz_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('riz_active_month_key', activeMonth);
  }, [activeMonth]);

  // Logging Activity helper (hanya aktivitas user riil; aktifitas server tidak disimpan/ditampilkan)
  const handleLogActivity = (username: string, role: string, action: string) => {
    if (
      role === 'Server' ||
      username === 'System Auto-Sync' ||
      username === 'System Boot' ||
      String(action || '').toLowerCase().includes('sinkronisasi') ||
      String(action || '').toLowerCase().includes('auto-sync')
    ) {
      return;
    }
    const newAct: UserActivity = {
      id: 'act-' + Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      username,
      role,
      action
    };
    setActivities(prev => [newAct, ...prev]);
    saveCloudDoc('activities', newAct.id, newAct);
  };

  // Google Sheet Daily Log Pull — Auto-Sync setiap 30 menit
  const handleSyncDailyLogFromSheet = async (gid?: string) => {
    const targetGid = gid || getGidForMonth(activeMonth);
    setIsSyncingSheet(true);
    setSheetPullMessage({ text: 'Mengambil data terbaru dari Google Sheet...', type: 'info' });
    try {
      // Kumpulkan semua ID dan (date + staff) daily_reports, findings, dan logbook_entries yang sudah ada untuk dedup
      const existingIds = new Set<string>();
      // Baca dari state aktif sebagai sumber utama dedup
      dailyReports.forEach(r => { if (r.id) existingIds.add(r.id); });
      findings.forEach(f => {
        if (f.id) existingIds.add(f.id);
        if (f.issue) existingIds.add(String(f.issue).trim().toLowerCase().substring(0, 30));
        
        // rigorous deduplication key
        const eqNorm = String(f.equipment || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const issNorm = String(f.issue || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const picNorm = String(f.pic || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const fDate = String(f.dateCreated || (f as any).date || f.targetDate || '').trim().slice(0, 10);
        existingIds.add(`dedup_${eqNorm}_${issNorm}_${picNorm}`);
        if (fDate && picNorm) existingIds.add(`dedup_date_staff_${fDate}_${picNorm}`);
      });
      logbookEntries.forEach(l => { if (l.id) existingIds.add(l.id); });

      // Baca dari localStorage sebagai backup
      try {
        const savedReports = JSON.parse(localStorage.getItem('riz_daily_reports_v2') || '[]');
        const savedFindings = JSON.parse(localStorage.getItem('riz_findings_v2') || '[]');
        const savedLogs = JSON.parse(localStorage.getItem('riz_logbook_entries_v2') || '[]');
        (savedReports as any[]).forEach((r: any) => { if (r.id) existingIds.add(r.id); });
        (savedFindings as any[]).forEach((f: any) => {
          if (f.id) existingIds.add(f.id);
          if (f.issue) existingIds.add(String(f.issue).trim().toLowerCase().substring(0, 30));
          
          const eqNorm = String(f.equipment || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const issNorm = String(f.issue || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const picNorm = String(f.pic || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          const fDate = String(f.dateCreated || f.date || f.targetDate || '').trim().slice(0, 10);
          existingIds.add(`dedup_${eqNorm}_${issNorm}_${picNorm}`);
          if (fDate && picNorm) existingIds.add(`dedup_date_staff_${fDate}_${picNorm}`);
        });
        (savedLogs as any[]).forEach((l: any) => { if (l.id) existingIds.add(l.id); });
      } catch (_e) {}

      // Kumpulkan entry baru (sementara) untuk update state lokal langsung
      const newReportDocs: any[] = [];
      const newFindingDocs: any[] = [];
      const newLogDocs: any[] = [];

      const result = await pullDailyLogFromGviz(
        targetGid,
        async (id, docData) => {
          const { getDeletedIds } = await import('./lib/cloudSync');
          if (getDeletedIds('daily_reports').has(id)) return;
          try {
            const currentRaw = localStorage.getItem('riz_daily_reports_v2');
            if (currentRaw) {
              const currentList = JSON.parse(currentRaw);
              const existing = Array.isArray(currentList) ? currentList.find((r: any) => r.id === id) : null;
              if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
            }
          } catch {}

          saveCloudDoc('daily_reports', id, docData, 'System Auto-Sync').catch(e => console.error('[Sheet Sync] report save error:', e));
          newReportDocs.push(docData);
        },
        async (id, docData) => {
          const { getDeletedIds } = await import('./lib/cloudSync');
          if (getDeletedIds('findings').has(id)) return;

          // Cek apakah sudah pernah diedit user atau apakah teks issue persis sama
          const currentFindingsRaw = localStorage.getItem('riz_findings_v2');
          if (currentFindingsRaw) {
            try {
              const currentList = JSON.parse(currentFindingsRaw);
              if (Array.isArray(currentList)) {
                const existing = currentList.find((f: any) => f.id === id);
                if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
                if (existing && existing.issue === docData.issue) return;
              }
            } catch {}
          }

          saveCloudDoc('findings', id, docData, 'System Auto-Sync').catch(e => console.error('[Sheet Sync] finding save error:', e));
          newFindingDocs.push(docData);
        },
        existingIds,
        async (id, docData) => {
          const { getDeletedIds } = await import('./lib/cloudSync');
          if (getDeletedIds('logbook_entries').has(id)) return;
          try {
            const currentRaw = localStorage.getItem('riz_logbook_entries_v2');
            if (currentRaw) {
              const currentList = JSON.parse(currentRaw);
              const existing = Array.isArray(currentList) ? currentList.find((l: any) => l.id === id) : null;
              if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
            }
          } catch {}

          saveCloudDoc('logbook_entries', id, docData, 'System Auto-Sync').catch(e => console.error('[Sheet Sync] logbook save error:', e));
          newLogDocs.push(docData);
        }
      );

      // Update state lokal LANGSUNG secara reaktif & rekonsiliasi bulan aktif (menulis ulang dengan membuang data lama yang diedit/dihapus)
      const parsedEntries = result.parsedEntries || [];
      const syncedMonthKey = result.monthKey || activeMonth;
      const validSheetReportIds = new Set<string>(parsedEntries.map(e => e.id));
      const validSheetLogIds = new Set<string>(parsedEntries.filter(e => e.isQc).map(e => `log-${e.id}`));

      // Pastikan ID valid terbaru dari Google Sheet tidak terblokir oleh tombstone lama
      validSheetReportIds.forEach(id => clearDeletedId('daily_reports', id));
      validSheetLogIds.forEach(id => clearDeletedId('logbook_entries', id));

      let localDataUpdated = newReportDocs.length > 0 || newLogDocs.length > 0 || newFindingDocs.length > 0;

      if (result.success && parsedEntries.length > 0 && syncedMonthKey && syncedMonthKey !== 'all') {
        const staleReportIdsToRemove = new Set<string>();
        const staleLogIdsToRemove = new Set<string>();

        setDailyReports(prev => {
          const map = new Map<string, any>();
          prev.forEach(r => {
            if (!r?.id) return;
            const idStr = String(r.id);
            const rDate = String(r.date || '');
            const isInSyncedMonth = rDate.startsWith(syncedMonthKey);
            const isSheetRow = r._source === 'google_sheet' || idStr.startsWith('rep-') || idStr.startsWith('gsheet-');
            const isUserEdited = Boolean((r as any)._userEdited || r._syncMeta?._userEdited);
            if (isInSyncedMonth && isSheetRow && !isUserEdited && !validSheetReportIds.has(idStr)) {
              staleReportIdsToRemove.add(idStr);
              return;
            }
            map.set(idStr, r);
          });
          newReportDocs.forEach(d => {
            const existing = map.get(d.id);
            if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
            map.set(d.id, existing ? { ...existing, ...d } : d);
          });
          if (staleReportIdsToRemove.size === 0 && newReportDocs.length === 0) return prev;
          localDataUpdated = true;
          const merged = normalizeCollectionItems('daily_reports', Array.from(map.values()));
          try {
            localStorage.setItem('riz_daily_reports_v2', JSON.stringify(merged));
            localStorage.setItem('riz_daily_reports', JSON.stringify(merged));
          } catch (_e) {}
          return merged as any;
        });

        staleReportIdsToRemove.forEach(staleId => {
          deleteCloudDoc('daily_reports', staleId).catch(() => {});
        });

        setLogbookEntries(prev => {
          const map = new Map<string, any>();
          prev.forEach(l => {
            if (!l?.id) return;
            const idStr = String(l.id);
            const lDate = String(l.date || '');
            const isInSyncedMonth = lDate.startsWith(syncedMonthKey);
            const isSheetRow = l._source === 'google_sheet' || idStr.startsWith('log-rep-') || idStr.startsWith('gsheet-');
            const isUserEdited = Boolean((l as any)._userEdited || l._syncMeta?._userEdited);
            if (isInSyncedMonth && isSheetRow && !isUserEdited && !validSheetLogIds.has(idStr)) {
              staleLogIdsToRemove.add(idStr);
              return;
            }
            map.set(idStr, l);
          });
          newLogDocs.forEach(d => {
            const existing = map.get(d.id);
            if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
            map.set(d.id, existing ? { ...existing, ...d } : d);
          });
          if (staleLogIdsToRemove.size === 0 && newLogDocs.length === 0) return prev;
          localDataUpdated = true;
          const merged = normalizeCollectionItems('logbook_entries', Array.from(map.values()));
          try {
            localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(merged));
            localStorage.setItem('riz_logbook_entries', JSON.stringify(merged));
          } catch (_e) {}
          return merged as any;
        });

        staleLogIdsToRemove.forEach(staleId => {
          deleteCloudDoc('logbook_entries', staleId).catch(() => {});
        });

        // Sinkronkan juga DailyTask kanban (dt-YYYYMMDD-*) yang berpasangan dengan laporan Google Sheet
        setDailyTasks(prev => {
          let changed = false;
          const updated = prev.map(t => {
            if (!t || !String(t.id || '').startsWith('dt-2026')) return t;
            if ((t as any)._userEdited || (t as any)._syncMeta?._userEdited) return t;
            const taskDate = String(t.dueDate || t.createdAt || '').slice(0, 10);
            if (!taskDate.startsWith(syncedMonthKey)) return t;
            const matchedEntry = parsedEntries.find(
              r => r.date === taskDate && (
                String(r.staffName || '').toLowerCase() === String(t.assignedName || '').toLowerCase() ||
                isStaffMatch({ id: t.assignedTo || '', name: t.assignedName || '' } as any, r.staffName)
              )
            );
            if (!matchedEntry) return t;
            const newDesc = matchedEntry.notes
              ? `${matchedEntry.activity}\nREMARK:\n${matchedEntry.notes}`
              : matchedEntry.activity;
            if (t.description === newDesc && t.division === matchedEntry.division) return t;
            changed = true;
            const nextTask = {
              ...t,
              division: matchedEntry.division,
              description: newDesc,
              _syncedAt: result.timestamp
            };
            saveCloudDoc('daily_tasks', nextTask.id, nextTask, 'System Auto-Sync').catch(() => {});
            return nextTask;
          });
          if (!changed) return prev;
          localDataUpdated = true;
          const merged = normalizeCollectionItems('daily_tasks', updated);
          try {
            localStorage.setItem('riz_daily_tasks_v2', JSON.stringify(merged));
            localStorage.setItem('riz_daily_tasks', JSON.stringify(merged));
          } catch (_e) {}
          return merged;
        });
      } else {
        if (newReportDocs.length > 0) {
          setDailyReports(prev => {
            const map = new Map<string, any>();
            prev.forEach(r => { if (r?.id) map.set(r.id, r); });
            newReportDocs.forEach(d => {
              const existing = map.get(d.id);
              if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
              map.set(d.id, existing ? { ...existing, ...d } : d);
            });
            const merged = normalizeCollectionItems('daily_reports', Array.from(map.values()));
            try { localStorage.setItem('riz_daily_reports_v2', JSON.stringify(merged)); } catch (_e) {}
            return merged as any;
          });
        }
        if (newLogDocs.length > 0) {
          setLogbookEntries(prev => {
            const map = new Map<string, any>();
            prev.forEach(l => { if (l?.id) map.set(l.id, l); });
            newLogDocs.forEach(d => {
              const existing = map.get(d.id);
              if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
              map.set(d.id, existing ? { ...existing, ...d } : d);
            });
            const merged = normalizeCollectionItems('logbook_entries', Array.from(map.values()));
            try { localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(merged)); } catch (_e) {}
            return merged as any;
          });
        }
      }

      if (syncedMonthKey && parsedEntries.length > 0) {
        const validSheetFindingIds = new Set(newFindingDocs.map(d => d.id));
        const canonicalFindingIds = new Set(INITIAL_FINDINGS.map(f => f.id));
        const staleFindingIdsToRemove = new Set<string>();
        setFindings(prev => {
          const map = new Map<string, any>();
          prev.forEach(f => {
            if (!f?.id) return;
            const idStr = String(f.id);
            const fDate = String(f.dateCreated || '');
            const isInSyncedMonth = fDate.startsWith(syncedMonthKey);
            const isAutoSheetFinding = idStr.startsWith('gsheet-finding-') && !canonicalFindingIds.has(idStr);
            const isUserEdited = Boolean((f as any)._userEdited || f._syncMeta?._userEdited);
            if (isInSyncedMonth && isAutoSheetFinding && !isUserEdited && !validSheetFindingIds.has(idStr)) {
              staleFindingIdsToRemove.add(idStr);
              return;
            }
            map.set(idStr, f);
          });
          newFindingDocs.forEach(d => {
            const existing = map.get(d.id);
            if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
            map.set(d.id, existing ? { ...existing, ...d, status: existing.status || d.status } : d);
          });
          const merged = normalizeCollectionItems('findings', Array.from(map.values()));
          try {
            localStorage.setItem('riz_findings_v2', JSON.stringify(merged));
            localStorage.setItem('riz_findings', JSON.stringify(merged));
          } catch (_e) {}
          return merged as any;
        });
        staleFindingIdsToRemove.forEach(staleId => {
          deleteCloudDoc('findings', staleId).catch(() => {});
        });
      } else if (newFindingDocs.length > 0) {
        setFindings(prev => {
          const map = new Map<string, any>();
          prev.forEach(f => { if (f?.id) map.set(f.id, f); });
          newFindingDocs.forEach(d => {
            const existing = map.get(d.id);
            if (existing && (existing._userEdited || existing._syncMeta?._userEdited)) return;
            map.set(d.id, existing ? { ...existing, ...d, status: existing.status || d.status } : d);
          });
          const merged = normalizeCollectionItems('findings', Array.from(map.values()));
          try { localStorage.setItem('riz_findings_v2', JSON.stringify(merged)); } catch (_e) {}
          return merged as any;
        });
      }

      if (localDataUpdated) {
        try {
          window.dispatchEvent(new CustomEvent('riz_local_data_updated', { detail: { source: 'google_sheet_sync' } }));
        } catch (_e) {}
      }

      setSheetPullMessage({ text: result.message, type: result.success ? 'success' : 'error' });
      if (result.success && (result.newReportsCount > 0 || result.newFindingsCount > 0)) {
        const ts = new Date().toISOString();
        setLastSheetPull(ts);
        try { localStorage.setItem('riz_daily_log_last_pull', ts); } catch (_e) {}
      } else if (result.success) {
        setLastSheetPull(new Date().toISOString());
        try { localStorage.setItem('riz_daily_log_last_pull', new Date().toISOString()); } catch (_e) {}
      }
      console.log('[Sheet Sync] Result:', result.message);
    } catch (e: any) {
      console.error('[Sheet Sync] ERROR:', e);
      setSheetPullMessage({ text: `Gagal: ${e?.message || 'Koneksi bermasalah'}`, type: 'error' });
    } finally {
      setIsSyncingSheet(false);
      setTimeout(() => setSheetPullMessage(null), 8000);
    }
  };

  // Ref untuk selalu memanggil versi terbaru handleSyncDailyLogFromSheet (fix stale closure)
  const syncHandlerRef = React.useRef(handleSyncDailyLogFromSheet);
  syncHandlerRef.current = handleSyncDailyLogFromSheet;

  useEffect(() => {
    syncHandlerRef.current();
  }, [activeMonth]);

  // Auto-sync berkala & reaktif (selalu up to date dari Google Sheet)
  useEffect(() => {
    const AUTO_SYNC_INTERVAL_MS = 30 * 1000; // 30 detik (agar data selalu segar dan cepat)
    let lastPullTime = Date.now();

    // 1. Jalankan sekali saat startup (setelah 500ms)
    const startupTimer = setTimeout(() => {
      syncHandlerRef.current();
      lastPullTime = Date.now();
    }, 500);

    // 2. Kemudian ulangi setiap 3 menit
    const interval = setInterval(() => {
      syncHandlerRef.current();
      lastPullTime = Date.now();
    }, AUTO_SYNC_INTERVAL_MS);

    // 3. Reaktif saat tab aplikasi dibuka kembali / user kembali ke browser
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible' || document.hasFocus()) {
        const elapsed = Date.now() - lastPullTime;
        // Jika sudah lebih dari 15 detik sejak sinkronisasi terakhir, tarik data baru
        if (elapsed > 15 * 1000) {
          syncHandlerRef.current();
          lastPullTime = Date.now();
        }
      }
    };

    // 4. Reaktif saat koneksi internet pulih (online)
    const handleOnline = () => {
      syncHandlerRef.current();
      lastPullTime = Date.now();
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      clearTimeout(startupTimer);
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // (handleLogActivity now defined above)
  // Keep this dummy line to avoid breaking any references
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleLogActivityAlias = handleLogActivity;


  // Logbook functions
  const handleAddLogbookEntry = (entry: Omit<LogbookEntry, 'id'>) => {
    const newEntry: LogbookEntry = {
      ...entry,
      id: 'lg-' + Date.now() + Math.floor(Math.random() * 1000)
    };
    
    let isDuplicate = false;
    setLogbookEntries(prev => {
      const existing = prev.find(e => e.activity === entry.activity && e.staffName === entry.staffName && e.date === entry.date);
      if (existing) {
        isDuplicate = true;
        return prev;
      }
      const next = [newEntry, ...prev];
      try {
        localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(next));
        localStorage.setItem('riz_logbook_entries', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    
    setTimeout(() => {
      if (!isDuplicate) {
        saveCloudDoc('logbook_entries', newEntry.id, newEntry);
      }
    }, 0);
  };

  // Daily Report functions
  const handleAddReport = (report: Omit<DailyReportType, 'id'>) => {
    const newRep: DailyReportType = {
      ...report,
      id: 'dr-' + Date.now() + Math.floor(Math.random() * 1000)
    };

    let isDuplicate = false;
    setDailyReports(prev => {
      const existing = prev.find(r => r.date === report.date && r.activity === report.activity && r.notes === report.notes);
      if (existing) {
        isDuplicate = true;
        return prev;
      }
      const next = [newRep, ...prev];
      try {
        localStorage.setItem('riz_daily_reports_v2', JSON.stringify(next));
        localStorage.setItem('riz_daily_reports', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setTimeout(() => {
      if (!isDuplicate) {
        saveCloudDoc('daily_reports', newRep.id, newRep);
        appendDailyReportToGoogleSheet(newRep).catch(err => {
          console.warn('[App] Gagal sync Arah B ke Google Sheet:', err);
        });
      }
    }, 0);
  };

  const handleDeleteReport = (id: string) => {
    setDailyReports(prev => {
      const next = prev.filter(r => r.id !== id);
      try {
        localStorage.setItem('riz_daily_reports_v2', JSON.stringify(next));
        localStorage.setItem('riz_daily_reports', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    deleteCloudDoc('daily_reports', id);

    // Hapus juga pasangan LogbookEntry QC (log-<id>) jika ada agar metrik QC CHECKED & KPI ikut auto-update
    const pairedLogId = `log-${id}`;
    setLogbookEntries(prev => {
      const hasPaired = prev.some(l => l.id === pairedLogId);
      if (!hasPaired) return prev;
      const next = prev.filter(l => l.id !== pairedLogId);
      try {
        localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(next));
        localStorage.setItem('riz_logbook_entries', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    deleteCloudDoc('logbook_entries', pairedLogId).catch(() => {});
  };

  const handleUpdateReport = (id: string, updatedFields: Partial<DailyReportType>) => {
    const nowIso = new Date().toISOString();
    let updatedReportObj: any = null;

    setDailyReports(prev => {
      const next = prev.map(r => {
        if (r.id !== id) return r;
        const nextRep: any = {
          ...r,
          ...updatedFields,
          _userEdited: true,
          _syncedAt: nowIso,
          _syncMeta: {
            ...(r._syncMeta || {}),
            updatedAt: nowIso,
            updatedBy: currentUser?.name || 'User',
            _userEdited: true,
            _syncedAt: nowIso
          }
        };
        updatedReportObj = nextRep;
        saveCloudDoc('daily_reports', id, nextRep, currentUser?.name);
        return nextRep;
      });
      const normalized = normalizeCollectionItems('daily_reports', next);
      try {
        localStorage.setItem('riz_daily_reports_v2', JSON.stringify(normalized));
        localStorage.setItem('riz_daily_reports', JSON.stringify(normalized));
      } catch (e) {}
      return normalized as any;
    });

    if (updatedReportObj) {
      const pairedLogId = `log-${id}`;
      const isNowQc = checkIsQc(`${updatedReportObj.activity || ''} ${updatedReportObj.notes || ''}`);
      const isNg = isFindingRemark(updatedReportObj.notes || '');

      if (isNowQc) {
        const logDoc: any = {
          id: pairedLogId,
          date: updatedReportObj.date,
          division: updatedReportObj.division,
          staffName: updatedReportObj.staffName,
          activity: updatedReportObj.activity,
          result: isNg ? ('NG' as const) : ('OK' as const),
          followUp: updatedReportObj.notes || (isNg ? 'Perlu perbaikan teknis' : 'Pengecekan selesai aman'),
          status: isNg ? ('Open' as const) : ('Close' as const),
          verification: 'Supervisor Operasional',
          checklists: {
            [String(updatedReportObj.activity || '').substring(0, 40)]: {
              status: isNg ? ('NG' as const) : ('OK' as const),
              notes: updatedReportObj.notes || 'Kondisi operasional normal'
            }
          },
          _userEdited: true,
          _syncedAt: nowIso,
          _syncMeta: {
            updatedAt: nowIso,
            updatedBy: currentUser?.name || 'User',
            _userEdited: true,
            _syncedAt: nowIso
          }
        };
        setLogbookEntries(prev => {
          const map = new Map<string, any>();
          prev.forEach(l => { if (l?.id) map.set(l.id, l); });
          map.set(pairedLogId, { ...(map.get(pairedLogId) || {}), ...logDoc });
          const normalized = normalizeCollectionItems('logbook_entries', Array.from(map.values()));
          try {
            localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(normalized));
            localStorage.setItem('riz_logbook_entries', JSON.stringify(normalized));
          } catch (e) {}
          return normalized as any;
        });
        saveCloudDoc('logbook_entries', pairedLogId, logDoc, currentUser?.name);
      } else {
        setLogbookEntries(prev => {
          if (!prev.some(l => l.id === pairedLogId)) return prev;
          const next = prev.filter(l => l.id !== pairedLogId);
          try {
            localStorage.setItem('riz_logbook_entries_v2', JSON.stringify(next));
            localStorage.setItem('riz_logbook_entries', JSON.stringify(next));
          } catch (e) {}
          return next;
        });
        deleteCloudDoc('logbook_entries', pairedLogId).catch(() => {});
      }
    }
  };

  // Findings functions
  const handleAddFinding = (finding: Omit<Finding, 'id' | 'dateCreated'>) => {
    const newFinding: Finding = {
      ...finding,
      id: 'fd-' + Date.now() + Math.floor(Math.random() * 1000),
      dateCreated: new Date().toISOString().split('T')[0],
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'User'
      }
    };
    
    let isDuplicate = false;
    setFindings(prev => {
      const existing = prev.find(f => f.issue === finding.issue && f.equipment === finding.equipment && f.status === 'Open');
      if (existing) {
        isDuplicate = true;
        return prev;
      }
      
      const next = [newFinding, ...prev];
      try {
        localStorage.setItem('riz_findings_v2', JSON.stringify(next));
        localStorage.setItem('riz_findings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setTimeout(() => {
      if (!isDuplicate) {
        saveCloudDoc('findings', newFinding.id, newFinding, currentUser?.name);
      }
    }, 0);
  };

  const handleUpdateFindingStatus = (id: string, status: 'Open' | 'Close', approvedBy?: string, approvedAt?: string) => {
    // CRITICAL: Write status lock to prevent cloud sync from reverting on refresh
    // This key is NEVER overwritten by cloud sync operations
    try {
      const lockKey = 'riz_findings_status_lock';
      const existingLocks = JSON.parse(localStorage.getItem(lockKey) || '{}');
      existingLocks[id] = {
        status,
        approvedBy: approvedBy || null,
        approvedAt: approvedAt || null,
        lockedAt: new Date().toISOString()
      };
      localStorage.setItem(lockKey, JSON.stringify(existingLocks));
    } catch (e) {}

    setFindings(prev => {
      const next = prev.map(f => {
        if (f.id === id) {
          const updated: Finding = {
            ...f,
            status,
            ...(approvedBy ? { approvedBy } : {}),
            ...(approvedAt ? { approvedAt } : {}),
            _syncMeta: {
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser?.name || 'User'
            }
          };
          saveCloudDoc('findings', id, updated, currentUser?.name);
          return updated;
        }
        return f;
      });
      try {
        localStorage.setItem('riz_findings_v2', JSON.stringify(next));
        localStorage.setItem('riz_findings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleDeleteFinding = (id: string) => {
    setFindings(prev => {
      const next = prev.filter(f => f.id !== id);
      try {
        localStorage.setItem('riz_findings_v2', JSON.stringify(next));
        localStorage.setItem('riz_findings', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    deleteCloudDoc('findings', id);
  };

  // Maintenance functions
  const handleAddSchedule = (schedule: Omit<MaintenanceSchedule, 'id'>) => {
    const newSch: MaintenanceSchedule = {
      ...schedule,
      id: 'ms-' + Date.now() + Math.floor(Math.random() * 1000)
    };
    
    let isDuplicate = false;
    setSchedules(prev => {
      const existing = prev.find(s => s.assetName === schedule.assetName && s.nextDate === schedule.nextDate);
      if (existing) {
        isDuplicate = true;
        return prev;
      }
      return [newSch, ...prev];
    });

    setTimeout(() => {
      if (!isDuplicate) {
        saveCloudDoc('maintenance_schedules', newSch.id, newSch);
      }
    }, 0);
  };

  const handleUpdateSchedule = (id: string, updatedFields: Partial<MaintenanceSchedule>) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updatedFields };
        saveCloudDoc('maintenance_schedules', id, updated);
        return updated;
      }
      return s;
    }));
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    deleteCloudDoc('maintenance_schedules', id);
  };

  const handleUpdateScheduleStatus = (
    id: string,
    status: 'Scheduled' | 'Done' | 'Overdue',
    notes?: string,
    sparepart?: string,
    vendor?: string,
    biaya?: number,
    photoUrl?: string
  ) => {
    setSchedules(prev => prev.map(s => {
      if (s.id === id) {
        const updated = {
          ...s,
          status,
          lastDate: new Date().toISOString().split('T')[0],
          nextDate: status === 'Done' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : s.nextDate,
          notes: notes ? notes : s.notes,
          sparepart: sparepart !== undefined ? sparepart : s.sparepart,
          vendor: vendor !== undefined ? vendor : s.vendor,
          biaya: biaya !== undefined ? biaya : s.biaya,
          photoUrl: photoUrl !== undefined ? photoUrl : s.photoUrl
        };
        saveCloudDoc('maintenance_schedules', id, updated);
        return updated;
      }
      return s;
    }));
  };

  // Assets functions
  const handleAddAsset = (asset: Omit<Asset, 'id' | 'repairHistory'>) => {
    const newAsset: Asset = {
      ...asset,
      id: 'ast-' + Date.now() + Math.floor(Math.random() * 1000),
      repairHistory: [],
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'User'
      }
    };
    
    let isDuplicate = false;
    setAssets(prev => {
      const existing = prev.find(a => a.name === asset.name && a.location === asset.location);
      if (existing) {
        isDuplicate = true;
        return prev;
      }
      return [newAsset, ...prev];
    });

    setTimeout(() => {
      if (!isDuplicate) {
        saveCloudDoc('assets', newAsset.id, newAsset, currentUser?.name);
      }
    }, 0);
  };

  const handleUpdateAsset = (id: string, updatedFields: Partial<Asset>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const updated = {
          ...a,
          ...updatedFields,
          _syncMeta: {
            updatedAt: new Date().toISOString(),
            updatedBy: currentUser?.name || 'User'
          }
        };
        saveCloudDoc('assets', id, updated, currentUser?.name);
        return updated;
      }
      return a;
    }));
  };

  const handleUpdateAssetCondition = (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, condition };
        saveCloudDoc('assets', id, updated);
        return updated;
      }
      return a;
    }));
  };

  const handleUpdateAssetLocation = (id: string, location: string) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, location };
        saveCloudDoc('assets', id, updated);
        return updated;
      }
      return a;
    }));
  };

  const handleAddRepairRecord = (id: string, record: { date: string; description: string; cost: number; PIC: string }) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const updated = {
          ...a,
          repairHistory: [record, ...a.repairHistory]
        };
        saveCloudDoc('assets', id, updated);
        return updated;
      }
      return a;
    }));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    deleteCloudDoc('assets', id);
  };

  // Findings functions
  const handleUpdateFinding = (id: string, updatedFields: Partial<Finding>) => {
    setFindings(prev => {
      const next = prev.map(f => {
        if (f.id === id) {
          const updated: Finding = {
            ...f,
            ...updatedFields,
            _syncMeta: {
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser?.name || 'User'
            }
          };
          saveCloudDoc('findings', id, updated, currentUser?.name);
          return updated;
        }
        return f;
      });
      try {
        localStorage.setItem('riz_findings_v2', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Work Orders functions
  const handleAddWorkOrder = (wo: Omit<WorkOrder, 'id' | 'dateCreated'>) => {
    const newWO: WorkOrder = {
      ...wo,
      id: 'wo-' + Date.now() + Math.floor(Math.random() * 1000),
      dateCreated: new Date().toISOString().split('T')[0],
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.name || 'User'
      }
    };

    let isDuplicate = false;

    setWorkOrders(prev => {
      // Cek duplikasi WO secara atomic di dalam state update
      const existing = prev.find(w => {
        if (wo.findingId && w.findingId === wo.findingId) return true;
        const t1 = String(w.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const t2 = String(wo.title || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        return t1 && t2 && t1 === t2 && w.division === wo.division;
      });

      if (existing) {
        console.info('[WorkOrders] Tiket WO sudah ada, mengabaikan duplikasi:', existing.id);
        isDuplicate = true;
        return prev;
      }

      const next = [newWO, ...prev];
      try {
        localStorage.setItem('riz_work_orders_v2', JSON.stringify(next));
        localStorage.setItem('riz_work_orders', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Panggil cloud sync HANYA jika bukan duplikat
    setTimeout(() => {
      if (!isDuplicate) {
        saveCloudDoc('work_orders', newWO.id, newWO, currentUser?.name);
      }
    }, 0);
  };

  const handleUpdateWorkOrder = (id: string, updatedFields: Partial<WorkOrder>) => {
    setWorkOrders(prev => {
      const next = prev.map(w => {
        if (w.id === id) {
          const updated: WorkOrder = {
            ...w,
            ...updatedFields,
            _syncMeta: {
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser?.name || 'User'
            }
          };
          saveCloudDoc('work_orders', id, updated, currentUser?.name);
          return updated;
        }
        return w;
      });
      try {
        localStorage.setItem('riz_work_orders_v2', JSON.stringify(next));
        localStorage.setItem('riz_work_orders', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleUpdateWorkOrderProgress = (id: string, progress: number) => {
    setWorkOrders(prev => {
      const next = prev.map(w => {
        if (w.id === id) {
          const updated: WorkOrder = {
            ...w,
            progress,
            _syncMeta: {
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser?.name || 'User'
            }
          };
          saveCloudDoc('work_orders', id, updated, currentUser?.name);
          return updated;
        }
        return w;
      });
      try {
        localStorage.setItem('riz_work_orders_v2', JSON.stringify(next));
        localStorage.setItem('riz_work_orders', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleUpdateWorkOrderStatus = (
    id: string,
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
    approvedBy?: string,
    approvedAt?: string
  ) => {
    // Write work order status lock to prevent cloud sync from reverting on refresh/slow snapshot
    try {
      const woLockKey = 'riz_work_orders_status_lock';
      const existingLocks = JSON.parse(localStorage.getItem(woLockKey) || '{}');
      existingLocks[id] = {
        status,
        progress: status === 'Completed' ? 100 : undefined,
        approvedBy: approvedBy || null,
        approvedAt: approvedAt || null,
        lockedAt: new Date().toISOString()
      };
      localStorage.setItem(woLockKey, JSON.stringify(existingLocks));
    } catch (e) {}

    setWorkOrders(prev => {
      const next = prev.map(w => {
        if (w.id === id) {
          const updated: WorkOrder = {
            ...w,
            status,
            progress: status === 'Completed' ? 100 : w.progress,
            ...(approvedBy ? { approvedBy } : {}),
            ...(approvedAt ? { approvedAt } : {}),
            _syncMeta: {
              updatedAt: new Date().toISOString(),
              updatedBy: currentUser?.name || 'User'
            }
          };
          saveCloudDoc('work_orders', id, updated, currentUser?.name);
          // P3.2: Auto-create Daily Report saat WO di-Completed
          if (status === 'Completed') {
            const newRep = {
              id: 'dr-' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              staffName: w.pic,
              division: w.division,
              activity: approvedBy ? `[Admin Approved WO] ${w.title}` : `[Penyelesaian Work Order] ${w.title}`,
              notes: approvedBy
                ? `Work Order telah disetujui (Approved) & diselesaikan oleh Admin (${approvedBy}). Unit siap operasional 100%. Instruksi: ${w.description}`
                : `Work Order berhasil diselesaikan 100%. ${w.description}`,
              status: 'Submitted' as const,
              _syncMeta: {
                updatedAt: new Date().toISOString(),
                updatedBy: currentUser?.name || 'User'
              }
            };
            setDailyReports(drs => [newRep, ...drs]);
            saveCloudDoc('daily_reports', newRep.id, newRep, currentUser?.name);
          }
          return updated;
        }
        return w;
      });
      try {
        localStorage.setItem('riz_work_orders_v2', JSON.stringify(next));
        localStorage.setItem('riz_work_orders', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleDeleteWorkOrder = (id: string) => {
    setWorkOrders(prev => {
      const next = prev.filter(w => w.id !== id);
      try {
        localStorage.setItem('riz_work_orders_v2', JSON.stringify(next));
        localStorage.setItem('riz_work_orders', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    deleteCloudDoc('work_orders', id);
  };

  // Activities functions
  const handleClearActivities = () => {
    setActivities([]);
  };

  // Manual Full Sync Trigger
  const handleManualSync = async () => {
    const res = await forceSyncAllModules();
    alert(res.message);
  };

  const handleLogout = () => {
    if (currentUser) {
      handleLogActivity(currentUser.name, currentUser.role, 'User melakukan logout dari sistem');
    }
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={setCurrentUser}
        onLogActivity={handleLogActivity}
        staffList={staffList}
        onInstallPWA={handleInstallPWA}
        canInstallPWA={Boolean(deferredInstallPrompt)}
        isAppInstalled={isAppInstalled}
        isIOSDevice={isIOSDevice}
      />
    );
  }

  // Define tab navigation elements
  // (Using role-based dynamic NAVIGATION_ITEMS declared above)

  const isOwnerOrAdmin = currentUser?.division === 'Admin' || currentUser?.role === 'Owner' || currentUser?.role === 'Direktur' || currentUser?.role === 'Admin' || currentUser?.id === 'director-wahyu' || String(currentUser?.name || '').toLowerCase().includes('wahyu (owner)');
  const isManagement = Boolean(
    currentUser && (
      isOwnerOrAdmin ||
      currentUser.role === 'Manager' ||
      currentUser.role === 'Supervisor'
    )
  );
  const isLeaderOrHigher = Boolean(
    currentUser && (
      isManagement ||
      currentUser.role === 'Team Leader'
    )
  );
  const isGudangAuthorized = Boolean(currentUser);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Sidebar for Desktop - Hidden on Print */}
      <aside className={`no-print hidden md:flex flex-col bg-[#0f172a] text-[#f8fafc] shrink-0 h-screen sticky top-0 border-r border-[#1e293b] z-30 select-none shadow-xl transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Brand Header */}
        <div className="flex-none px-4 py-4 border-b border-[#1e293b] bg-[#0c1322] flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-[10px] tracking-widest px-2 py-0.5 rounded shadow-sm">
                  RIZ-PRO
                </div>
                <div className="bg-emerald-500 text-white font-bold text-[8px] tracking-wider px-1.5 py-0.5 rounded">
                  LOG
                </div>
                <div className="border border-emerald-500/30 text-emerald-400 font-bold text-[8px] tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 hidden lg:block">
                  RIZ-PROD
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 tracking-wider">QC & OPS SYSTEM V2.0</span>
                <span className="text-[8px] font-mono font-bold text-blue-400/80">workspace</span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors mx-auto"
            title={isSidebarCollapsed ? "Perluas Sidebar" : "Sembunyikan Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {Object.entries(groupedNavItems).map(([category, items]) => (
            <div key={category} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 pt-1">
                  {category}
                </div>
              )}
              <div className={`relative space-y-1 ${!isSidebarCollapsed ? 'pl-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1e293b]' : ''}`}>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isTabActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'} rounded-lg text-xs font-semibold tracking-wide transition-all group ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner'
                          : 'text-[#94a3b8] hover:text-[#f8fafc] hover:bg-slate-800/80 border border-transparent'
                      }`}
                      title={isSidebarCollapsed ? item.label : undefined}
                    >
                      {!isSidebarCollapsed && (
                        <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600 group-hover:bg-slate-400 transition-colors'}`} />
                      )}
                      <Icon className="w-4 h-4 shrink-0" />
                      {!isSidebarCollapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile & Actions Footer */}
        <div className="flex-none p-3 border-t border-[#1e293b] bg-[#0c1322] space-y-2">
          {!isSidebarCollapsed ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] shrink-0"></span>
                    {currentUser.division} • {currentUser.role}
                  </p>
                </div>
              </div>
              <a
                href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Penyimpanan Foto (Drive)</span>
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg text-[11px] font-bold transition-colors border border-transparent hover:border-rose-900/50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Aplikasi</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shrink-0" title={`${currentUser.name} (${currentUser.division})`}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <a
                href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded-lg transition-colors cursor-pointer"
                title="Penyimpanan Foto (Drive)"
              >
                <Folder className="w-4 h-4" />
              </a>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-900/50"
                title="Keluar Aplikasi"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Header - Hidden on Print */}
      <header className="no-print md:hidden bg-[#0f172a] text-white flex items-center justify-between px-3.5 py-2.5 pt-[max(env(safe-area-inset-top),0.75rem)] sticky top-0 z-50 shadow-md border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <span>RIZ-PRO</span>
            <span className="bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">LOG</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Bell Notification Icon Mobile */}
          <QCNotificationCenter
            dailyReports={dailyReports}
            logbookEntries={logbookEntries}
            findings={findings}
            dailyTasks={dailyTasks}
            warehouseLogs={warehouseLogs}
            onNavigateTab={setActiveTab}
            onSyncSheet={() => handleSyncDailyLogFromSheet()}
            isSyncingSheet={isSyncingSheet}
            lastSyncTime={syncStatus.lastSyncedAt}
            isMobileHeader={true}
            activeMonth={activeMonth}
          />

          <span className="text-[11px] font-mono text-[#94a3b8] font-bold bg-[#1e293b] px-2 py-0.5 rounded border border-slate-700">
            {currentUser.name}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 bg-[#1e293b] text-white rounded border border-slate-700 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Drawer & Backdrop - Hidden on Print */}
      {/* Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="no-print md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Slide-out Drawer */}
      <div className={`no-print md:hidden fixed inset-y-0 left-0 w-[290px] max-w-[85vw] bg-[#0f172a] text-slate-300 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className="flex-none px-4 py-3.5 pt-[max(env(safe-area-inset-top),1rem)] border-b border-[#1e293b] bg-[#0c1322] flex items-center justify-between">
          <div className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <span className="text-white">RIZ-PRO</span>
            <span className="bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">LOG</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded bg-[#1e293b] text-slate-400 hover:text-white border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar touch-scroll">
          <div className="space-y-4">
            {Object.entries(groupedNavItems).map(([category, items]) => (
              <div key={category} className="space-y-1.5">
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2">
                  {category}
                </div>
                <div className="relative pl-2 space-y-1 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1e293b]">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isTabActive(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-inner font-bold'
                            : 'text-[#94a3b8] hover:text-white hover:bg-slate-800/80 border border-transparent'
                        }`}
                      >
                        <span className={`w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'bg-slate-600'}`} />
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="flex-none p-4 pb-[max(env(safe-area-inset-bottom),1rem)] border-t border-[#1e293b] bg-[#0c1322] space-y-2">
          <div className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-slate-800 shadow-inner mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20 shrink-0">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)] shrink-0"></span>
                {currentUser.division}
              </p>
            </div>
          </div>
          
          <a
            href={OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Penyimpanan Foto (Drive)</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg text-[11px] font-bold transition-colors border border-transparent hover:border-rose-900/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-2.5 sm:p-4 md:p-8 pb-[max(env(safe-area-inset-bottom),2rem)] max-w-full font-sans">
        
        {/* Real-time Cloud Auto-Sync Header Status Bar */}
        <div className="no-print mb-4 sm:mb-6 bg-white/95 backdrop-blur-xs p-2.5 sm:p-3 sm:px-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                syncStatus.isOnline ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                syncStatus.isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">
                {syncStatus.isOnline ? 'Penyimpanan Terpadu: Auto-Sync Aktif' : 'Mode Offline (Penyimpanan Lokal)'}
              </span>
              {syncStatus.pendingQueueCount > 0 && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] sm:text-[10px] font-bold">
                  {syncStatus.pendingQueueCount} antrean menunggu sync
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                {syncStatus.lastSyncedAt
                  ? `• Terakhir sync: ${syncStatus.lastSyncedAt.toLocaleTimeString('id-ID')}`
                  : '• Auto-sync setiap terhubung internet'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
            {/* Bell Notification Icon Desktop */}
            <QCNotificationCenter
              dailyReports={dailyReports}
              logbookEntries={logbookEntries}
              findings={findings}
              dailyTasks={dailyTasks}
              warehouseLogs={warehouseLogs}
              onNavigateTab={setActiveTab}
              onSyncSheet={() => handleSyncDailyLogFromSheet()}
              isSyncingSheet={isSyncingSheet}
              lastSyncTime={syncStatus.lastSyncedAt}
              activeMonth={activeMonth}
            />

            {/* Global Period Selector - Terkoordinasi ke seluruh modul & side panel */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Periode:</span>
              <select
                value={activeMonth}
                onChange={(e) => handleActiveMonthChange(e.target.value)}
                className="text-xs font-bold text-indigo-950 bg-transparent focus:outline-none cursor-pointer"
                title="Pilih periode kerja aktif untuk seluruh panel navigasi"
              >
                {!['2026-12', '2026-11', '2026-10', '2026-09', '2026-08', '2026-07', '2026-06', '2026-05', 'all'].includes(activeMonth) && (
                  <option value={activeMonth}>{formatMonthLabel(activeMonth)}</option>
                )}
                <option value="2026-12">Desember 2026</option>
                <option value="2026-11">November 2026</option>
                <option value="2026-10">Oktober 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-08">Agustus 2026</option>
                <option value="2026-07">Juli 2026</option>
                <option value="2026-06">Juni 2026</option>
                <option value="2026-05">Mei 2026</option>
                <option value="all">Semua Periode</option>
              </select>
            </div>

            <button
              onClick={handleManualSync}
              disabled={syncStatus.isSyncing}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Klik untuk menyinkronkan data seketika"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden xs:inline">{syncStatus.isSyncing ? 'Menyinkronkan...' : 'Auto-Sync Sekarang'}</span>
              <span className="xs:hidden">{syncStatus.isSyncing ? 'Sync...' : 'Sync'}</span>
            </button>
          </div>
        </div>

        {/* Active view switcher */}
        {activeTab === 'dashboard' && (
          <Dashboard
            logbookEntries={logbookEntries}
            dailyReports={dailyReports}
            findings={findings}
            workOrders={workOrders}
            dailyTasks={dailyTasks}
            schedules={schedules}
            currentUser={currentUser}
            onNavigate={setActiveTab}
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
            onSyncDailyLogFromSheet={handleSyncDailyLogFromSheet}
            isSyncingSheet={isSyncingSheet}
          />
        )}

        {(activeTab === 'log_task' || activeTab === 'daily' || activeTab === 'qc') && (
          <LogTaskModule
            currentUser={currentUser}
            dailyReports={dailyReports}
            onAddReport={handleAddReport}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
            initialTasks={dailyTasks}
            onUpdateTasks={setDailyTasks}
            logbookEntries={logbookEntries}
            onAddLogbookEntry={handleAddLogbookEntry}
            workOrders={workOrders}
            initialSubTab={activeTab === 'qc' ? 'qc_checklist' : 'kanban'}
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {(activeTab === 'findings' || activeTab === 'work_orders') && (
          <Findings
            findings={findings}
            workOrders={workOrders}
            assets={assets}
            onAddFinding={handleAddFinding}
            onUpdateFindingStatus={handleUpdateFindingStatus}
            onDeleteFinding={handleDeleteFinding}
            onAddWorkOrder={handleAddWorkOrder}
            onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
            onUpdateWorkOrderProgress={handleUpdateWorkOrderProgress}
            onDeleteWorkOrder={handleDeleteWorkOrder}
            onAddReport={handleAddReport}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            initialSubTab={activeTab === 'work_orders' ? 'work_orders' : 'findings'}
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}


        {activeTab === 'reports' && isLeaderOrHigher && (
          <Reports
            logbookEntries={logbookEntries}
            dailyReports={dailyReports}
            findings={findings}
            workOrders={workOrders}
            dailyTasks={dailyTasks}
            schedules={schedules}
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
            onSyncDailyLogFromSheet={handleSyncDailyLogFromSheet}
            isSyncingSheet={isSyncingSheet}
          />
        )}

        {activeTab === 'absensi_self' && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="self"
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {activeTab === 'job_schedule' && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="schedule"
            initialScheduleViewMode="job_assignments"
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {activeTab === 'absensi_schedule' && isLeaderOrHigher && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="schedule"
            initialScheduleViewMode="official"
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {activeTab === 'maintenance_dashboard' && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="maintenance_dashboard"
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {activeTab === 'admin_panel' && isManagement && (
          <AdminPanel
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            findings={findings}
            onAddFinding={handleAddFinding}
            onUpdateFinding={handleUpdateFinding}
            onDeleteFinding={handleDeleteFinding}
            workOrders={workOrders}
            onAddWorkOrder={handleAddWorkOrder}
            onUpdateWorkOrder={handleUpdateWorkOrder}
            onDeleteWorkOrder={handleDeleteWorkOrder}
            maintenanceSchedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            onDeleteSchedule={handleDeleteSchedule}
            assets={assets}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            dailyReports={dailyReports}
            logbookEntries={logbookEntries}
            onSyncDailyLogFromSheet={handleSyncDailyLogFromSheet}
            isSyncingSheet={isSyncingSheet}
            lastSheetPull={lastSheetPull}
            sheetPullMessage={sheetPullMessage}
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {activeTab === 'uji_kompetensi' && (
          <CareerCompetencyModule
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            dailyReports={dailyReports}
            logbookEntries={logbookEntries}
            findings={findings}
            workOrders={workOrders}
            dailyTasks={dailyTasks}
            activeMonth={activeMonth}
          />
        )}

        {activeTab === 'kinerja_karyawan' && (
          <EmployeePerformanceModule
            currentUser={currentUser}
            dailyReports={dailyReports}
            logbookEntries={logbookEntries}
            findings={findings}
            workOrders={workOrders}
            dailyTasks={dailyTasks}
            activeMonth={activeMonth}
            onActiveMonthChange={handleActiveMonthChange}
          />
        )}

        {activeTab === 'gudang' && isGudangAuthorized && (
          <Gudang
            currentUser={currentUser}
            assets={assets}
            findings={findings}
            workOrders={workOrders}
            dailyReports={dailyReports}
            activeMonth={activeMonth}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onUpdateAssetLocation={handleUpdateAssetLocation}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
            forceSubTab="logs"
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'gudang_inventory' && isGudangAuthorized && (
          <Gudang
            currentUser={currentUser}
            assets={assets}
            findings={findings}
            workOrders={workOrders}
            dailyReports={dailyReports}
            activeMonth={activeMonth}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onUpdateAssetLocation={handleUpdateAssetLocation}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
            forceSubTab="inventory"
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'armada' && isGudangAuthorized && (
          <Gudang
            currentUser={currentUser}
            assets={assets}
            findings={findings}
            workOrders={workOrders}
            dailyReports={dailyReports}
            activeMonth={activeMonth}
            onAddAsset={handleAddAsset}
            onUpdateAsset={handleUpdateAsset}
            onDeleteAsset={handleDeleteAsset}
            onUpdateAssetLocation={handleUpdateAssetLocation}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
            forceSubTab="armada_governance"
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'activities' && isManagement && (
          <ActivityHistory
            activities={activities}
            onClearActivities={handleClearActivities}
            currentUser={currentUser}
          />
        )}
      </main>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Staff, LogbookEntry, DailyReport as DailyReportType, Finding, Asset, WorkOrder, MaintenanceSchedule, UserActivity, DailyTask } from './types';
import {
  STAFF_LIST,
  getMasterStaffList,
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_FINDINGS,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_DAILY_REPORTS,
  INITIAL_DAILY_TASKS
} from './data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from './data/september2026Schedule';

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
  Truck
} from 'lucide-react';
import {
  subscribeCloudCollection,
  saveCloudDoc,
  deleteCloudDoc,
  forceSyncAllModules,
  subscribeSyncStatus,
  SyncStatus
} from './lib/cloudSync';

export default function App() {
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

  // Mobile sidebar menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Master Staff List State with Cloud Sync
  const [staffList, setStaffList] = useState<Staff[]>(() => getMasterStaffList());

  useEffect(() => {
    const unsubStaff = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setStaffList,
      STAFF_LIST
    );
    return () => unsubStaff();
  }, []);

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
    const isOwnerOrAdmin = currentUser?.division === 'Admin' || role === 'Owner' || role === 'Direktur' || role === 'Admin' || currentUser?.id === 'director-wahyu' || String(currentUser?.name || '').toLowerCase() === 'wahyu';

    // 1. Owner & Admin / Management (14 Fitur Lengkap & Terintegrasi)
    if (isOwnerOrAdmin) {
      return [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional & QC' },
        { id: 'maintenance', label: 'Jadwal Maintenance', icon: Wrench, category: 'Operasional & QC' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
        { id: 'kinerja_karyawan', label: 'Kinerja & KPI Karyawan', icon: TrendingUp, category: 'SDM & Performa' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'SDM & Performa' },
        { id: 'absensi_schedule', label: 'Jadwal Shift (1-31)', icon: Calendar, category: 'SDM & Performa' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'reports', label: 'Laporan & Ekspor', icon: FileCheck, category: 'Laporan & Sistem' },
        { id: 'activities', label: 'Audit Aktivitas', icon: History, category: 'Laporan & Sistem' },
        { id: 'admin_panel', label: 'Panel Kontrol Admin', icon: Sliders, category: 'Laporan & Sistem' }
      ];
    }
    
    // 2. Manager
    if (role === 'Manager') {
      return [
        { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional & QC' },
        { id: 'maintenance', label: 'Jadwal Maintenance', icon: Wrench, category: 'Operasional & QC' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
        { id: 'kinerja_karyawan', label: 'Kinerja & KPI Karyawan', icon: TrendingUp, category: 'SDM & Performa' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'SDM & Performa' },
        { id: 'absensi_schedule', label: 'Jadwal Shift (1-31)', icon: Calendar, category: 'SDM & Performa' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'reports', label: 'Laporan & Approval', icon: FileCheck, category: 'Laporan & Sistem' },
        { id: 'activities', label: 'Audit Aktivitas', icon: History, category: 'Laporan & Sistem' },
        { id: 'admin_panel', label: 'Panel Kontrol Admin', icon: Sliders, category: 'Laporan & Sistem' }
      ];
    }
    
    // 3. Supervisor
    if (role === 'Supervisor') {
      return [
        { id: 'dashboard', label: 'Dashboard Monitoring', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional & QC' },
        { id: 'maintenance', label: 'Jadwal Maintenance', icon: Wrench, category: 'Operasional & QC' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Performa' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'SDM & Performa' },
        { id: 'absensi_schedule', label: 'Jadwal Shift (1-31)', icon: Calendar, category: 'SDM & Performa' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'reports', label: 'Approval & Laporan', icon: FileCheck, category: 'Laporan & Sistem' },
        { id: 'activities', label: 'Audit Aktivitas', icon: History, category: 'Laporan & Sistem' },
        { id: 'admin_panel', label: 'Panel Kontrol Admin', icon: Sliders, category: 'Laporan & Sistem' }
      ];
    }
    
    // 4. Team Leader
    if (role === 'Team Leader') {
      return [
        { id: 'dashboard', label: 'Dashboard Divisi', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional & QC' },
        { id: 'maintenance', label: 'Jadwal Maintenance', icon: Wrench, category: 'Operasional & QC' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Performa' },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'SDM & Performa' },
        { id: 'absensi_schedule', label: 'Jadwal Kerja (1-31)', icon: Calendar, category: 'SDM & Performa' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
        { id: 'reports', label: 'Laporan Divisi', icon: FileCheck, category: 'Laporan & Sistem' }
      ];
    }
    
    // 5. Staff
    if (role === 'Staff') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList, category: 'Operasional & QC' },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon, category: 'Operasional & QC' },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, category: 'Operasional & QC' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
        { id: 'kinerja_karyawan', label: 'Kinerja Saya', icon: TrendingUp, category: 'SDM & Performa' },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck, category: 'SDM & Performa' },
        { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' }
      ];
    }
    
    // 6. Gudang
    if (role === 'Gudang') {
      return [
        { id: 'dashboard', label: 'Dashboard Gudang', icon: LayoutDashboard, category: 'Ringkasan' },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package, category: 'Logistik & Fasilitas' },
        { id: 'armada', label: 'Kelola Armada', icon: Truck, category: 'Logistik & Fasilitas' },
        { id: 'log_task', label: 'Log Task / Daily Task', icon: ClipboardList, category: 'Operasional & QC' },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp, category: 'SDM & Performa' },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck, category: 'SDM & Performa' }
      ];
    }
    
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Ringkasan' },
      { id: 'log_task', label: 'Log Task / Daily Task', icon: ClipboardList, category: 'Operasional & QC' },
      { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award, category: 'SDM & Performa' },
      { id: 'maintenance_dashboard', label: 'Monitoring Fasilitas', icon: Activity, category: 'Logistik & Fasilitas' },
      { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck, category: 'SDM & Performa' }
    ];
  })();

  // Helper untuk memeriksa status aktif jalur penghubung (termasuk sub-jalur seperti 'qc' dan 'daily')
  const isTabActive = (tabId: string) => {
    if (activeTab === tabId) return true;
    if (tabId === 'log_task' && (activeTab === 'daily' || activeTab === 'qc')) return true;
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
      if (allowedTabIds.length > 0 && !allowedTabIds.includes(activeTab) && activeTab !== 'daily' && activeTab !== 'qc') {
        setActiveTab(allowedTabIds[0]);
      }
    }
  }, [currentUser, activeTab]);

  // Forced one-time re-sync for all 22 official inhouse staff (including Wahyudin / Unyim) & exact daily task sheet
  const REF_SYNC_KEY = 'riz_ref_synced_v26_exact_daily_task_qc_sept2026_canonical';
  if (typeof window !== 'undefined' && !localStorage.getItem(REF_SYNC_KEY)) {
    // Reset local caches to exact authentic reference dataset
    localStorage.setItem('riz_findings', JSON.stringify(INITIAL_FINDINGS));
    localStorage.setItem('riz_daily_tasks', JSON.stringify(INITIAL_DAILY_TASKS));
    localStorage.setItem('riz_logbook_entries', JSON.stringify(INITIAL_LOGBOOK_ENTRIES));
    localStorage.setItem('riz_daily_reports', JSON.stringify(INITIAL_DAILY_REPORTS));
    localStorage.setItem('riz_work_orders', JSON.stringify(INITIAL_WORK_ORDERS));
    localStorage.setItem('riz_master_staff_list', JSON.stringify(STAFF_LIST));
    localStorage.setItem('riz_september_2026_schedule', JSON.stringify(OFFICIAL_SEPTEMBER_2026_SCHEDULE));
    
    // Clear any obsolete deleted ID records
    localStorage.removeItem('riz_deleted_ids_findings');
    localStorage.removeItem('riz_deleted_ids_daily_tasks');
    localStorage.removeItem('riz_deleted_ids_logbook_entries');
    localStorage.removeItem('riz_deleted_ids_daily_reports');
    localStorage.removeItem('riz_deleted_ids_work_orders');
    localStorage.removeItem('riz_deleted_ids_master_staff');

    localStorage.setItem(REF_SYNC_KEY, 'true');

    // Simpan Wahyudin (Unyim) resmi ke Cloud master_staff
    saveCloudDoc('master_staff', 'staff-unyin', {
      id: 'staff-unyin',
      name: 'Wahyudin',
      fullName: 'Wahyudin',
      nickname: 'Unyim',
      email: 'wahyudin.unyin@gmail.com',
      phone: '085812345678',
      division: 'Audio',
      role: 'Staff',
      level: 3
    }, 'System Auto-Sync').catch(() => {});

    // Hapus non-inhouse freelance dari master_staff
    deleteCloudDoc('master_staff', 'staff-chandra').catch(() => {});
    deleteCloudDoc('master_staff', 'staff-rizky').catch(() => {});

    // Simpan staff-suryana resmi
    saveCloudDoc('master_staff', 'staff-suryana', {
      id: 'staff-suryana',
      name: 'Suryana',
      fullName: 'Suryana',
      nickname: 'Nana / Buluk',
      email: 'nia.kurni1930@gmail.com',
      phone: '083847130366',
      division: 'Audio',
      role: 'Staff',
      level: 3
    }, 'System Auto-Sync').catch(() => {});

    // Sinkronisasi data Wahyu (Owner) ke Cloud master_staff
    saveCloudDoc('master_staff', 'director-wahyu', {
      id: 'director-wahyu',
      name: 'Wahyu',
      fullName: 'Wahyu',
      nickname: 'Wahyu',
      email: 'zakimau06@gmail.com',
      phone: '083819947193',
      division: 'Admin',
      role: 'Owner',
      level: 8
    }, 'System Auto-Sync').catch(() => {});

    // Sinkronisasi data Seno ke Cloud master_staff
    saveCloudDoc('master_staff', 'staff-seno', {
      id: 'staff-seno',
      name: 'Seno Subroto',
      fullName: 'Seno Subroto',
      nickname: 'Seno',
      email: 'seno.subroto78@gmail.com',
      phone: '081297541980',
      division: 'Admin',
      role: 'Staff',
      level: 4
    }, 'System Auto-Sync').catch(() => {});

    // Sinkronisasi data Damri (Leader Service) ke Cloud master_staff
    saveCloudDoc('master_staff', 'staff-damri', {
      id: 'staff-damri',
      name: 'Damri',
      fullName: 'Damri',
      nickname: 'Mang Damri',
      email: 'damri.service@rizproduction.com',
      phone: '081288990011',
      division: 'Service',
      role: 'Team Leader',
      level: 5
    }, 'System Auto-Sync').catch(() => {});

    // Sinkronisasi data Mulyana (Staff Service) ke Cloud master_staff
    saveCloudDoc('master_staff', 'staff-mulyana', {
      id: 'staff-mulyana',
      name: 'Mulyana',
      fullName: 'Mulyana',
      nickname: 'Kharo',
      email: 'tabitakharo@gmail.com',
      phone: '089523134060',
      division: 'Service',
      role: 'Staff',
      level: 3
    }, 'System Auto-Sync').catch(() => {});

    // Sinkronisasi data Wahyudin (Unyim) (Staff Audio) ke Cloud master_staff
    saveCloudDoc('master_staff', 'staff-unyin', {
      id: 'staff-unyin',
      name: 'Wahyudin',
      fullName: 'Wahyudin',
      nickname: 'Unyim',
      email: 'wahyudin.unyin@gmail.com',
      phone: '085812345678',
      division: 'Audio',
      role: 'Staff',
      level: 3
    }, 'System Auto-Sync').catch(() => {});

    // Sinkronisasi Temuan QC Resmi ke Cloud Firestore
    INITIAL_FINDINGS.forEach(f => {
      saveCloudDoc('findings', f.id, f, 'System Canonical Sync').catch(() => {});
    });

    // Sinkronisasi Daily Reports Resmi ke Cloud Firestore
    INITIAL_DAILY_REPORTS.forEach(r => {
      saveCloudDoc('daily_reports', r.id, r, 'System Canonical Sync').catch(() => {});
    });

    // Sinkronisasi Logbook Entries Resmi ke Cloud Firestore
    INITIAL_LOGBOOK_ENTRIES.forEach(l => {
      saveCloudDoc('logbook_entries', l.id, l, 'System Canonical Sync').catch(() => {});
    });

    // Sinkronisasi Daily Tasks Resmi ke Cloud Firestore
    INITIAL_DAILY_TASKS.forEach(t => {
      saveCloudDoc('daily_tasks', t.id, t, 'System Canonical Sync').catch(() => {});
    });

    // Sinkronisasi Work Orders Resmi ke Cloud Firestore
    INITIAL_WORK_ORDERS.forEach(w => {
      saveCloudDoc('work_orders', w.id, w, 'System Canonical Sync').catch(() => {});
    });

    // Sinkronisasi Jadwal Kerja September 2026 ke Cloud Firestore
    OFFICIAL_SEPTEMBER_2026_SCHEDULE.forEach((row, idx) => {
      saveCloudDoc('september_2026_schedule', `row-${row.no || idx + 1}`, row, 'System Auto-Sync').catch(() => {});
    });
  }

  // Core States - Bersih murni dari data dummy & tersinkronisasi data riil resmi
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>(() => {
    const saved = localStorage.getItem('riz_logbook_entries');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_LOGBOOK_ENTRIES;
  });

  const [dailyReports, setDailyReports] = useState<DailyReportType[]>(() => {
    const saved = localStorage.getItem('riz_daily_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DAILY_REPORTS;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('riz_daily_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_DAILY_TASKS;
  });

  const [findings, setFindings] = useState<Finding[]>(() => {
    const saved = localStorage.getItem('riz_findings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_FINDINGS;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('riz_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('riz_work_orders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    const saved = localStorage.getItem('riz_schedules');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_SCHEDULES;
  });

  const [activities, setActivities] = useState<UserActivity[]>(() => {
    const saved = localStorage.getItem('riz_activities');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString('id-ID'),
        username: 'System Boot',
        role: 'Server',
        action: 'Sistem logbook RIZ-PRODUCTION online'
      }
    ];
  });

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
      'riz_logbook_entries',
      setLogbookEntries,
      INITIAL_LOGBOOK_ENTRIES
    );

    const unsubReports = subscribeCloudCollection<DailyReportType>(
      'daily_reports',
      'riz_daily_reports',
      setDailyReports,
      INITIAL_DAILY_REPORTS
    );

    const unsubTasks = subscribeCloudCollection<DailyTask>(
      'daily_tasks',
      'riz_daily_tasks',
      setDailyTasks,
      INITIAL_DAILY_TASKS
    );

    const unsubFindings = subscribeCloudCollection<Finding>(
      'findings',
      'riz_findings',
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
      'riz_work_orders',
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
      setActivities,
      []
    );

    return () => {
      unsubStatus();
      unsubLogbook();
      unsubReports();
      unsubTasks();
      unsubFindings();
      unsubAssets();
      unsubWO();
      unsubSchedules();
      unsubActivities();
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

  // Logging Activity helper
  const handleLogActivity = (username: string, role: string, action: string) => {
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

  // Logbook functions
  const handleAddLogbookEntry = (entry: Omit<LogbookEntry, 'id'>) => {
    const newEntry: LogbookEntry = {
      ...entry,
      id: 'lg-' + Date.now()
    };
    setLogbookEntries(prev => [newEntry, ...prev]);
    saveCloudDoc('logbook_entries', newEntry.id, newEntry);
  };

  // Daily Report functions
  const handleAddReport = (report: Omit<DailyReportType, 'id'>) => {
    const newRep: DailyReportType = {
      ...report,
      id: 'dr-' + Date.now()
    };
    setDailyReports(prev => [newRep, ...prev]);
    saveCloudDoc('daily_reports', newRep.id, newRep);
  };

  const handleDeleteReport = (id: string) => {
    setDailyReports(prev => prev.filter(r => r.id !== id));
    deleteCloudDoc('daily_reports', id);
  };

  // Findings functions
  const handleAddFinding = (finding: Omit<Finding, 'id' | 'dateCreated'>) => {
    const newFinding: Finding = {
      ...finding,
      id: 'fd-' + Date.now(),
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setFindings(prev => [newFinding, ...prev]);
    saveCloudDoc('findings', newFinding.id, newFinding);
  };

  const handleUpdateFindingStatus = (id: string, status: 'Open' | 'Close', approvedBy?: string, approvedAt?: string) => {
    setFindings(prev => prev.map(f => {
      if (f.id === id) {
        const updated = {
          ...f,
          status,
          ...(approvedBy ? { approvedBy } : {}),
          ...(approvedAt ? { approvedAt } : {})
        };
        saveCloudDoc('findings', id, updated);
        return updated;
      }
      return f;
    }));
  };

  const handleDeleteFinding = (id: string) => {
    setFindings(prev => prev.filter(f => f.id !== id));
    deleteCloudDoc('findings', id);
  };

  // Maintenance functions
  const handleAddSchedule = (schedule: Omit<MaintenanceSchedule, 'id'>) => {
    const newSch: MaintenanceSchedule = {
      ...schedule,
      id: 'ms-' + Date.now()
    };
    setSchedules(prev => [newSch, ...prev]);
    saveCloudDoc('maintenance_schedules', newSch.id, newSch);
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
      id: 'ast-' + Date.now(),
      repairHistory: []
    };
    setAssets(prev => [newAsset, ...prev]);
    saveCloudDoc('assets', newAsset.id, newAsset);
  };

  const handleUpdateAsset = (id: string, updatedFields: Partial<Asset>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updatedFields };
        saveCloudDoc('assets', id, updated);
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
    setFindings(prev => prev.map(f => {
      if (f.id === id) {
        const updated = { ...f, ...updatedFields };
        saveCloudDoc('findings', id, updated);
        return updated;
      }
      return f;
    }));
  };

  // Work Orders functions
  const handleAddWorkOrder = (wo: Omit<WorkOrder, 'id' | 'dateCreated'>) => {
    const newWO: WorkOrder = {
      ...wo,
      id: 'wo-' + Date.now(),
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setWorkOrders(prev => [newWO, ...prev]);
    saveCloudDoc('work_orders', newWO.id, newWO);
  };

  const handleUpdateWorkOrder = (id: string, updatedFields: Partial<WorkOrder>) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === id) {
        const updated = { ...w, ...updatedFields };
        saveCloudDoc('work_orders', id, updated);
        return updated;
      }
      return w;
    }));
  };

  const handleUpdateWorkOrderProgress = (id: string, progress: number) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === id) {
        const updated = { ...w, progress };
        saveCloudDoc('work_orders', id, updated);
        return updated;
      }
      return w;
    }));
  };

  const handleUpdateWorkOrderStatus = (
    id: string,
    status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled',
    approvedBy?: string,
    approvedAt?: string
  ) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === id) {
        const updated = {
          ...w,
          status,
          progress: status === 'Completed' ? 100 : w.progress,
          ...(approvedBy ? { approvedBy } : {}),
          ...(approvedAt ? { approvedAt } : {})
        };
        saveCloudDoc('work_orders', id, updated);
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
            status: 'Submitted' as const
          };
          setDailyReports(drs => [newRep, ...drs]);
          saveCloudDoc('daily_reports', newRep.id, newRep);
        }
        return updated;
      }
      return w;
    }));
  };

  const handleDeleteWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
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
      />
    );
  }

  // Define tab navigation elements
  // (Using role-based dynamic NAVIGATION_ITEMS declared above)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      
      {/* Sidebar for Desktop - Hidden on Print */}
      <aside className="no-print hidden md:flex flex-col w-64 bg-[#0f172a] text-[#f8fafc] shrink-0 h-screen sticky top-0 border-r border-[#1e293b] z-30 select-none shadow-xl">
        {/* Brand Header */}
        <div className="flex-none px-5 py-4 border-b border-[#1e293b] bg-[#0c1322]">
          <div className="font-extrabold text-base tracking-tight flex items-center gap-2">
            <span className="text-white font-black tracking-wider">RIZ-PRO</span>
            <span className="bg-blue-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">LOG</span>
          </div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
            QC & OPERATIONAL SYSTEM v2.0
          </div>
        </div>

        {/* Main Navigation Links with Synchronized Jalur Penghubung */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-3">
          {Object.entries(groupedNavItems).map(([category, items]) => (
            <div key={category} className="space-y-1">
              <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 pt-1">
                {category}
              </div>
              {/* Jalur Penghubung Vertical Connector Track */}
              <div className="relative pl-2.5 space-y-0.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800/80">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isTabActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold rounded-lg transition-all text-left relative cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? 'bg-blue-400 shadow-xs shadow-blue-400' : 'bg-slate-700'}`} />
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Staff Footer & Logout */}
        <div className="flex-none px-3.5 pt-3 pb-4 border-t border-[#1e293b] bg-[#0c1322] space-y-2.5">
          <div className="flex items-center gap-2.5 bg-slate-900/80 p-2 rounded-lg border border-slate-800/90">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.name.substring(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.division} • {currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800/60 hover:bg-rose-950/70 hover:text-rose-200 text-slate-300 border border-slate-700/70 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header - Hidden on Print */}
      <header className="no-print md:hidden bg-[#0f172a] text-white flex items-center justify-between p-4 sticky top-0 z-50 shadow-md border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
            <span>RIZ-PRO</span>
            <span className="bg-blue-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">LOG</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
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

      {/* Mobile Sidebar Dropdown menu - Hidden on Print */}
      {mobileMenuOpen && (
        <div className="no-print md:hidden bg-[#0f172a] text-slate-300 fixed inset-0 top-[57px] z-40 flex flex-col p-4 space-y-3 border-t border-[#1e293b] overflow-y-auto">
          <div className="flex-1 space-y-3">
            {Object.entries(groupedNavItems).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2 pt-1">
                  {category}
                </div>
                <div className="relative pl-2 space-y-1 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
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
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-bold'
                            : 'text-[#94a3b8] hover:text-white hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'bg-blue-400' : 'bg-slate-700'}`} />
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800/60 hover:bg-red-950/60 hover:text-red-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700 shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full font-sans">
        
        {/* Real-time Cloud Auto-Sync Header Status Bar */}
        <div className="no-print mb-6 bg-white/95 backdrop-blur-xs p-3 px-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                syncStatus.isOnline ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                syncStatus.isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800">
                {syncStatus.isOnline ? 'Cloud Firestore: Auto-Sync Aktif' : 'Mode Offline (Penyimpanan Lokal)'}
              </span>
              {syncStatus.pendingQueueCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={syncStatus.isSyncing}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Klik untuk menyinkronkan data seketika"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus.isSyncing ? 'Menyinkronkan...' : 'Auto-Sync Sekarang'}</span>
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
            schedules={schedules}
            currentUser={currentUser}
            onNavigate={setActiveTab}
          />
        )}

        {(activeTab === 'log_task' || activeTab === 'daily' || activeTab === 'qc') && (
          <LogTaskModule
            currentUser={currentUser}
            dailyReports={dailyReports}
            onAddReport={handleAddReport}
            onDeleteReport={handleDeleteReport}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
            initialTasks={dailyTasks}
            onUpdateTasks={setDailyTasks}
            logbookEntries={logbookEntries}
            onAddLogbookEntry={handleAddLogbookEntry}
            workOrders={workOrders}
            initialSubTab={activeTab === 'qc' ? 'qc_checklist' : 'kanban'}
          />
        )}

        {activeTab === 'findings' && (
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
          />
        )}

        {activeTab === 'maintenance' && (
          <Maintenance
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateScheduleStatus={handleUpdateScheduleStatus}
            onUpdateSchedule={handleUpdateSchedule}
            onAddFinding={handleAddFinding}
            onAddWorkOrder={handleAddWorkOrder}
            onAddReport={handleAddReport}
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            logbookEntries={logbookEntries}
            dailyReports={dailyReports}
            findings={findings}
            workOrders={workOrders}
            schedules={schedules}
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'absensi_self' && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="self"
          />
        )}

        {activeTab === 'absensi_schedule' && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="schedule"
          />
        )}

        {activeTab === 'maintenance_dashboard' && (
          <Absensi
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
            forceSubTab="maintenance_dashboard"
          />
        )}

        {activeTab === 'admin_panel' && (
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
          />
        )}

        {activeTab === 'uji_kompetensi' && (
          <CareerCompetencyModule
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'kinerja_karyawan' && (
          <EmployeePerformanceModule
            currentUser={currentUser}
            dailyReports={dailyReports}
            logbookEntries={logbookEntries}
            findings={findings}
            workOrders={workOrders}
          />
        )}

        {activeTab === 'gudang' && (
          <Gudang
            currentUser={currentUser}
            assets={assets}
            onUpdateAssetLocation={handleUpdateAssetLocation}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'armada' && (
          <Gudang
            currentUser={currentUser}
            assets={assets}
            onUpdateAssetLocation={handleUpdateAssetLocation}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            onAddFinding={handleAddFinding}
            onLogActivity={handleLogActivity}
            forceSubTab="armada_governance"
          />
        )}

        {activeTab === 'activities' && (
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

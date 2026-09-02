/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Staff, LogbookEntry, DailyReport as DailyReportType, Finding, Asset, WorkOrder, MaintenanceSchedule, UserActivity, DailyTask } from './types';
import {
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_SCHEDULES,
  INITIAL_WORK_ORDERS,
  INITIAL_FINDINGS,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_DAILY_REPORTS,
  INITIAL_DAILY_TASKS
} from './data';

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
  TrendingUp
} from 'lucide-react';

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

  // Define tab navigation elements based on current user role (Hak Akses)
  const NAVIGATION_ITEMS = (() => {
    if (!currentUser) return [];
    const role = currentUser.role;
    if (role === 'Admin') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp },
        { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
        { id: 'findings', label: 'Temuan QC & WO', icon: AlertOctagon },
        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck },
        { id: 'absensi_schedule', label: 'Penjadwalan (1-31)', icon: Calendar },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package },
        { id: 'reports', label: 'Laporan & Ekspor', icon: FileCheck },
        { id: 'activities', label: 'Audit Activity', icon: History }
      ];
    }
    
    // Manager
    if (role === 'Manager') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp },
        { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck },
        { id: 'absensi_schedule', label: 'Penjadwalan (1-31)', icon: Calendar },
        { id: 'reports', label: 'Laporan & Approval', icon: FileCheck },
        { id: 'activities', label: 'Audit Activity', icon: History }
      ];
    }
    
    // Supervisor
    if (role === 'Supervisor') {
      return [
        { id: 'dashboard', label: 'Divisi Monitoring', icon: LayoutDashboard },
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp },
        { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
        { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck },
        { id: 'absensi_schedule', label: 'Work Schedule (1-31)', icon: Calendar },
        { id: 'reports', label: 'Approval & Laporan', icon: FileCheck },
        { id: 'activities', label: 'Audit Activity', icon: History }
      ];
    }
    
    // Team Leader
    if (role === 'Team Leader') {
      return [
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp },
        { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck }
      ];
    }
    
    // Staff
    if (role === 'Staff') {
      return [
        { id: 'log_task', label: 'Daily Task & QC Checklist', icon: ClipboardList },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp },
        { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck }
      ];
    }
    
    // Gudang
    if (role === 'Gudang') {
      return [
        { id: 'log_task', label: 'Log Task / Daily Task', icon: ClipboardList },
        { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
        { id: 'kinerja_karyawan', label: 'Kinerja Karyawan', icon: TrendingUp },
        { id: 'gudang', label: 'Manajemen Gudang', icon: Package },
        { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
        { id: 'absensi_self', label: 'Absensi Harian', icon: UserCheck }
      ];
    }
    
    return [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'log_task', label: 'Log Task / Daily Task', icon: ClipboardList },
      { id: 'uji_kompetensi', label: 'Karir & Paspor Kompetensi', icon: Award },
      { id: 'maintenance_dashboard', label: 'Dashboard Pemeliharaan', icon: Wrench },
      { id: 'absensi_self', label: 'Absensi Mandiri', icon: UserCheck }
    ];
  })();

  // Redirect to first allowed tab if current active tab is not allowed for the role
  useEffect(() => {
    if (currentUser) {
      const allowedTabIds = NAVIGATION_ITEMS.map(item => item.id);
      if (allowedTabIds.length > 0 && !allowedTabIds.includes(activeTab)) {
        setActiveTab(allowedTabIds[0]);
      }
    }
  }, [currentUser, activeTab]);

  // Pembersihan total data dummy lama di localStorage agar user dapat mulai mengisi data riil
  const DUMMY_PURGE_KEY = 'riz_dummy_purged_v1';
  if (typeof window !== 'undefined' && !localStorage.getItem(DUMMY_PURGE_KEY)) {
    localStorage.removeItem('riz_logbook_entries');
    localStorage.removeItem('riz_daily_reports');
    localStorage.removeItem('riz_daily_tasks');
    localStorage.removeItem('riz_findings');
    localStorage.removeItem('riz_assets');
    localStorage.removeItem('riz_work_orders');
    localStorage.removeItem('riz_schedules');
    localStorage.removeItem('riz_attendance_logs');
    localStorage.setItem(DUMMY_PURGE_KEY, 'true');
  }

  // Core States - Bersih murni dari data dummy
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>(() => {
    const saved = localStorage.getItem('riz_logbook_entries');
    return saved ? JSON.parse(saved) : INITIAL_LOGBOOK_ENTRIES;
  });

  const [dailyReports, setDailyReports] = useState<DailyReportType[]>(() => {
    const saved = localStorage.getItem('riz_daily_reports');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_REPORTS;
  });

  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(() => {
    const saved = localStorage.getItem('riz_daily_tasks');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_TASKS;
  });

  const [findings, setFindings] = useState<Finding[]>(() => {
    const saved = localStorage.getItem('riz_findings');
    return saved ? JSON.parse(saved) : INITIAL_FINDINGS;
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

  // Persistence hooks
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
    localStorage.setItem('riz_logbook_entries', JSON.stringify(logbookEntries));
  }, [logbookEntries]);

  useEffect(() => {
    localStorage.setItem('riz_daily_reports', JSON.stringify(dailyReports));
  }, [dailyReports]);

  useEffect(() => {
    localStorage.setItem('riz_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

  useEffect(() => {
    localStorage.setItem('riz_findings', JSON.stringify(findings));
  }, [findings]);

  useEffect(() => {
    localStorage.setItem('riz_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('riz_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('riz_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('riz_activities', JSON.stringify(activities));
  }, [activities]);

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
  };

  // Logbook functions
  const handleAddLogbookEntry = (entry: Omit<LogbookEntry, 'id'>) => {
    const newEntry: LogbookEntry = {
      ...entry,
      id: 'lg-' + Date.now()
    };
    setLogbookEntries(prev => [newEntry, ...prev]);
  };

  // Daily Report functions
  const handleAddReport = (report: Omit<DailyReportType, 'id'>) => {
    const newRep: DailyReportType = {
      ...report,
      id: 'dr-' + Date.now()
    };
    setDailyReports(prev => [newRep, ...prev]);
  };

  const handleDeleteReport = (id: string) => {
    setDailyReports(prev => prev.filter(r => r.id !== id));
  };

  // Findings functions
  const handleAddFinding = (finding: Omit<Finding, 'id' | 'dateCreated'>) => {
    const newFinding: Finding = {
      ...finding,
      id: 'fd-' + Date.now(),
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setFindings(prev => [newFinding, ...prev]);
  };

  const handleUpdateFindingStatus = (id: string, status: 'Open' | 'Close') => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const handleDeleteFinding = (id: string) => {
    setFindings(prev => prev.filter(f => f.id !== id));
  };

  // Maintenance functions
  const handleAddSchedule = (schedule: Omit<MaintenanceSchedule, 'id'>) => {
    const newSch: MaintenanceSchedule = {
      ...schedule,
      id: 'ms-' + Date.now()
    };
    setSchedules(prev => [newSch, ...prev]);
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
        return {
          ...s,
          status,
          lastDate: new Date().toISOString().split('T')[0],
          nextDate: status === 'Done' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : s.nextDate, // push by 30 days if completed
          notes: notes ? notes : s.notes,
          sparepart: sparepart !== undefined ? sparepart : s.sparepart,
          vendor: vendor !== undefined ? vendor : s.vendor,
          biaya: biaya !== undefined ? biaya : s.biaya,
          photoUrl: photoUrl !== undefined ? photoUrl : s.photoUrl
        };
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
  };

  const handleUpdateAssetCondition = (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, condition } : a));
  };

  const handleUpdateAssetLocation = (id: string, location: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, location } : a));
  };

  const handleAddRepairRecord = (id: string, record: { date: string; description: string; cost: number; PIC: string }) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          repairHistory: [record, ...a.repairHistory]
        };
      }
      return a;
    }));
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // Work Orders functions
  const handleAddWorkOrder = (wo: Omit<WorkOrder, 'id' | 'dateCreated'>) => {
    const newWO: WorkOrder = {
      ...wo,
      id: 'wo-' + Date.now(),
      dateCreated: new Date().toISOString().split('T')[0]
    };
    setWorkOrders(prev => [newWO, ...prev]);
  };

  const handleUpdateWorkOrderProgress = (id: string, progress: number) => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, progress } : w));
  };

  const handleUpdateWorkOrderStatus = (id: string, status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled') => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, status, progress: status === 'Completed' ? 100 : w.progress } : w));
  };

  const handleDeleteWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(w => w.id !== id));
  };

  // Activities functions
  const handleClearActivities = () => {
    setActivities([]);
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
      <aside className="no-print hidden md:flex flex-col w-[220px] bg-[#0f172a] text-[#f8fafc] shrink-0 h-screen sticky top-0 py-6">
        {/* Brand Logo */}
        <div className="px-6 pb-6 border-b border-[#1e293b]">
          <div className="font-extrabold text-lg tracking-tight">
            RIZ-PRO<span className="text-[#3b82f6]">LOG</span>
          </div>
          <div className="text-[10px] text-[#475569] font-semibold mt-1 uppercase tracking-wider">
            QC ASSET MANAGEMENT v2.0
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 mt-6 space-y-0.5 overflow-y-auto">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-xs font-semibold tracking-wide transition-all border-l-3 text-left ${
                  isActive
                    ? 'bg-[#1e293b] text-white border-[#3b82f6]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#94a3b8]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Staff Footer & Logout */}
        <div className="px-6 pt-4 border-t border-[#334155] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#334155] flex items-center justify-center font-bold text-white text-xs shrink-0">
              {currentUser.name.substring(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-xs text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-[#94a3b8] truncate">{currentUser.division} Division</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800/50 hover:bg-red-900/40 hover:text-red-200 border border-slate-700/60 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header - Hidden on Print */}
      <header className="no-print md:hidden bg-[#0f172a] text-white flex items-center justify-between p-4 sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-sm tracking-tight">
            RIZ-PRO<span className="text-[#3b82f6]">LOG</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#94a3b8] font-bold bg-[#1e293b] px-2 py-0.5 rounded">
            {currentUser.name}
          </span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 bg-[#1e293b] rounded focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Dropdown menu - Hidden on Print */}
      {mobileMenuOpen && (
        <div className="no-print md:hidden bg-[#0f172a] text-slate-300 fixed inset-0 top-[52px] z-40 flex flex-col p-4 space-y-2 border-t border-[#1e293b]">
          <div className="flex-1 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all border-l-3 ${
                    isActive
                      ? 'bg-[#1e293b] text-white border-[#3b82f6] font-bold'
                      : 'text-[#94a3b8] hover:text-white hover:bg-slate-800/60 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800/50 hover:bg-red-950/50 hover:text-red-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Aplikasi</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full font-sans">
        
        {/* Active view switcher */}
        {activeTab === 'dashboard' && (
          <Dashboard
            logbookEntries={logbookEntries}
            dailyReports={dailyReports}
            findings={findings}
            workOrders={workOrders}
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
            initialSubTab={activeTab === 'qc' ? 'qc_checklist' : 'kanban'}
          />
        )}

        {activeTab === 'findings' && (
          <Findings
            findings={findings}
            onAddFinding={handleAddFinding}
            onUpdateFindingStatus={handleUpdateFindingStatus}
            onDeleteFinding={handleDeleteFinding}
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'maintenance' && (
          <Maintenance
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onUpdateScheduleStatus={handleUpdateScheduleStatus}
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            logbookEntries={logbookEntries}
            dailyReports={dailyReports}
            findings={findings}
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

        {activeTab === 'uji_kompetensi' && (
          <CareerCompetencyModule
            currentUser={currentUser}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'kinerja_karyawan' && (
          <EmployeePerformanceModule
            currentUser={currentUser}
          />
        )}

        {activeTab === 'gudang' && (
          <Gudang
            currentUser={currentUser}
            assets={assets}
            onUpdateAssetLocation={handleUpdateAssetLocation}
            onUpdateAssetCondition={handleUpdateAssetCondition}
            onLogActivity={handleLogActivity}
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

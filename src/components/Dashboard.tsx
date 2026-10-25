/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogbookEntry, DailyReport, Finding, WorkOrder, AttendanceLog, DailyTask } from '../types';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Activity, 
  FileText, 
  Server, 
  Settings, 
  Users, 
  Shield,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart2,
  FileSpreadsheet,
  Inbox,
  Briefcase,
  Award,
  PenTool,
  CheckSquare,
  PieChart
} from 'lucide-react';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { calculateAllStaffKpis, isStaffInDivision, isStaffMatch, isStaffInGoogleSheet } from '../utils/kpiCalculator';
import { getScheduleByKey, StaffScheduleRow, ALL_MONTHLY_SCHEDULES } from '../data/staffSchedules';
import { subscribeCloudCollection } from '../lib/cloudSync';
import { Staff, MaintenanceSchedule } from '../types';

interface DashboardProps {
  logbookEntries: LogbookEntry[];
  dailyReports: DailyReport[];
  findings: Finding[];
  workOrders: WorkOrder[];
  dailyTasks: DailyTask[];
  schedules?: MaintenanceSchedule[];
  currentUser: any;
  onNavigate: (tab: string) => void;
  activeMonth?: string;
  onActiveMonthChange?: (monthKey: string) => void;
  onSyncDailyLogFromSheet?: (gid?: string) => Promise<any>;
  isSyncingSheet?: boolean;
}

export default function Dashboard({
  logbookEntries,
  dailyReports,
  findings,
  workOrders,
  dailyTasks,
  schedules = [],
  currentUser,
  onNavigate,
  activeMonth = '2026-10',
  onActiveMonthChange,
  onSyncDailyLogFromSheet,
  isSyncingSheet,
}: DashboardProps) {
  // Master Staff Dynamic State with Cloud Subscription
  const [staffList, setStaffList] = React.useState<Staff[]>(() => getMasterStaffList());

  React.useEffect(() => {
    const unsub = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setStaffList,
      STAFF_LIST
    );
    return () => unsub();
  }, []);

  // State for switching dashboard modes: 'harian' (ringkasan), 'graphic_view', 'daily_report', 'weekly_report', 'monthly_report'
  const [activeTab, setActiveTab] = React.useState<'harian' | 'graphic_view' | 'daily_report' | 'weekly_report' | 'monthly_report'>('monthly_report');
  
  // Custom states for the report period & editable notes
  const [targetDate, setTargetDate] = React.useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [targetStartDate, setTargetStartDate] = React.useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [targetEndDate, setTargetEndDate] = React.useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [targetMonth, setTargetMonth] = React.useState(() => {
    const defaultSch = getScheduleByKey(activeMonth);
    return defaultSch ? defaultSch.label : 'Oktober 2026';
  });

  // Update targetMonth when activeMonth changes
  React.useEffect(() => {
    const defaultSch = getScheduleByKey(activeMonth);
    if (defaultSch) setTargetMonth(defaultSch.label);
  }, [activeMonth]);

  // Auto-sync Google Sheet saat Dashboard dimuat (baik di server internal maupun cloud)
  React.useEffect(() => {
    if (onSyncDailyLogFromSheet) {
      onSyncDailyLogFromSheet().catch(e => console.warn('[Dashboard] GSheet auto-sync info:', e));
    }
  }, []);

  const [notesKendala, setNotesKendala] = React.useState('');
  const [notesAkar, setNotesAkar] = React.useState('');
  const [notesSolusi, setNotesSolusi] = React.useState('');
  const [notesTarget, setNotesTarget] = React.useState('');

  // Analisis Manajemen — reset saat bulan berubah agar teks manual tetap konsisten per periode
  React.useEffect(() => {
    setNotesKendala('');
    setNotesAkar('');
    setNotesSolusi('');
    setNotesTarget('');
  }, [activeMonth]);


  // Date and Calculations
  const today = new Date().toISOString().split('T')[0];
  
  // Total jobs today (Daily Reports + QC logs submitted today)
  const totalJobsToday = 
    dailyReports.filter(r => r.date === today).length + 
    logbookEntries.filter(e => e.date === today).length;

  // Filtered operational datasets based on chosen report type
  const activeDailyReports = React.useMemo(() => {
    if (activeTab === 'harian') return dailyReports.filter(r => r.date === today);
    if (activeTab === 'daily_report') return dailyReports.filter(r => r.date === targetDate);
    if (activeTab === 'weekly_report') return dailyReports.filter(r => r.date >= targetStartDate && r.date <= targetEndDate);
    return dailyReports.filter(r => r.date.startsWith(activeMonth)); // monthly_report & graphic_view
  }, [dailyReports, activeTab, targetDate, targetStartDate, targetEndDate, activeMonth, today]);

  const activeLogbookEntries = React.useMemo(() => {
    if (activeTab === 'harian') return logbookEntries.filter(e => e.date === today);
    if (activeTab === 'daily_report') return logbookEntries.filter(e => e.date === targetDate);
    if (activeTab === 'weekly_report') return logbookEntries.filter(e => e.date >= targetStartDate && e.date <= targetEndDate);
    return logbookEntries.filter(e => e.date.startsWith(activeMonth)); // monthly_report & graphic_view
  }, [logbookEntries, activeTab, targetDate, targetStartDate, targetEndDate, activeMonth, today]);

  const activeFindings = React.useMemo(() => {
    if (activeTab === 'harian') return findings.filter(f => f.dateCreated === today || f.targetDate === today);
    if (activeTab === 'daily_report') return findings.filter(f => f.dateCreated === targetDate || f.targetDate === targetDate);
    if (activeTab === 'weekly_report') return findings.filter(f => (f.dateCreated >= targetStartDate && f.dateCreated <= targetEndDate) || (f.targetDate >= targetStartDate && f.targetDate <= targetEndDate));
    return findings.filter(f => f.dateCreated.startsWith(activeMonth) || (f.targetDate && f.targetDate.startsWith(activeMonth))); // monthly_report & graphic_view
  }, [findings, activeTab, targetDate, targetStartDate, targetEndDate, activeMonth, today]);

  const activeWorkOrders = React.useMemo(() => {
    if (activeTab === 'harian') {
      return workOrders.filter(w => w.dateCreated === today || (w as any).date === today || w.deadline === today);
    }
    if (activeTab === 'daily_report') {
      return workOrders.filter(w => w.dateCreated === targetDate || (w as any).date === targetDate || w.deadline === targetDate);
    }
    if (activeTab === 'weekly_report') {
      return workOrders.filter(w => 
        (w.dateCreated >= targetStartDate && w.dateCreated <= targetEndDate) ||
        (w.deadline >= targetStartDate && w.deadline <= targetEndDate)
      );
    }
    return workOrders.filter(w => w.dateCreated.startsWith(activeMonth) || (w as any).date?.startsWith(activeMonth) || w.deadline.startsWith(activeMonth)); // monthly_report
  }, [workOrders, activeTab, targetDate, targetStartDate, targetEndDate, activeMonth, today]);

  const activeDailyTasks = React.useMemo(() => {
    if (activeTab === 'harian') {
      return dailyTasks.filter(t => t.createdAt === today || t.dueDate === today);
    }
    if (activeTab === 'daily_report') {
      return dailyTasks.filter(t => t.createdAt === targetDate || t.dueDate === targetDate);
    }
    if (activeTab === 'weekly_report') {
      return dailyTasks.filter(t => 
        (t.createdAt >= targetStartDate && t.createdAt <= targetEndDate) ||
        (t.dueDate >= targetStartDate && t.dueDate <= targetEndDate)
      );
    }
    return dailyTasks.filter(t => t.createdAt.startsWith(activeMonth) || t.dueDate.startsWith(activeMonth)); // monthly_report
  }, [dailyTasks, activeTab, targetDate, targetStartDate, targetEndDate, activeMonth, today]);

  const activeSchedules = React.useMemo(() => {
    if (activeTab === 'harian') {
      return schedules.filter(s => s.lastDate === today || s.nextDate === today);
    }
    if (activeTab === 'daily_report') {
      return schedules.filter(s => s.lastDate === targetDate || s.nextDate === targetDate);
    }
    if (activeTab === 'weekly_report') {
      return schedules.filter(s => 
        (s.lastDate >= targetStartDate && s.lastDate <= targetEndDate) ||
        (s.nextDate >= targetStartDate && s.nextDate <= targetEndDate)
      );
    }
    return schedules; // monthly_report
  }, [schedules, activeTab, targetDate, targetStartDate, targetEndDate, today]);

  // QC Stats from all logbooks
  let totalQCOk = 0;
  let totalQCNg = 0;

  activeLogbookEntries.forEach(entry => {
    if (entry.checklists && Object.keys(entry.checklists).length > 0) {
      Object.values(entry.checklists).forEach((ch: any) => {
        if (ch.status === 'OK') totalQCOk++;
        if (ch.status === 'NG') totalQCNg++;
      });
    } else {
      if (entry.result === 'OK') totalQCOk++;
      if (entry.result === 'NG') totalQCNg++;
    }
  });

  // Findings/Issues Stats
  const openIssues = activeFindings.filter(f => f.status === 'Open').length;
  const closedIssues = activeFindings.filter(f => f.status === 'Close').length;

  // Dynamic PM metrics - strictly based on PM schedules and PM Work Orders
  const pmFromSchedules = activeSchedules.filter(s => s.type === 'Preventive');
  const pmFromWO = activeWorkOrders.filter(w => w.type === 'PM' || w.title?.toLowerCase().includes('pm') || w.title?.toLowerCase().includes('preventive'));
  const totalPM = pmFromSchedules.length + pmFromWO.length;
  const donePM = pmFromSchedules.filter(s => s.status === 'Done').length + pmFromWO.filter(w => w.status === 'Completed').length;
  const pendingPM = Math.max(0, totalPM - donePM);
  const kepatuhanPM = totalPM > 0 ? ((donePM / totalPM) * 100).toFixed(1) : '100.0';

  // Dynamic CM / Repair metrics (Corrective Maintenance)
  const cmFromSchedules = activeSchedules.filter(s => s.type === 'Corrective');
  const totalRepair = activeFindings.length + cmFromSchedules.length;
  const doneRepair = activeFindings.filter(f => f.status === 'Close').length + cmFromSchedules.filter(s => s.status === 'Done').length;
  const pendingRepair = activeFindings.filter(f => f.status === 'Open').length + cmFromSchedules.filter(s => s.status !== 'Done').length;
  const waitingSparepart = activeFindings.filter(f => f.status === 'Open' && (
    f.issue?.toLowerCase().includes('sparepart') ||
    f.action?.toLowerCase().includes('sparepart') ||
    f.issue?.toLowerCase().includes('menunggu part') ||
    f.action?.toLowerCase().includes('menunggu part')
  )).length;

  // Dynamic derivations for report cards
  const totalDailyReportsCount = activeDailyReports.length;
  const totalQCCount = activeLogbookEntries.length;
  const totalWorkOrdersCount = totalRepair + totalPM;
  const uniqueWorkingDays = React.useMemo(() => {
    return new Set(activeDailyReports.map(r => r.date).filter(Boolean)).size;
  }, [activeDailyReports]);

  // Staff Productivity metrics with comprehensive KPI calculating Attendance and Competency Tests
  // 1. Monthly Staff KPIs calculated from the entire monthly dataset (canonical Google Sheet)
  const monthlyStaffKpis = React.useMemo(() => {
    return calculateAllStaffKpis(
      staffList,
      dailyReports.filter(r => r.date.startsWith(activeMonth)),
      logbookEntries.filter(e => e.date.startsWith(activeMonth)),
      findings.filter(f => f.dateCreated.startsWith(activeMonth) || (f.targetDate && f.targetDate.startsWith(activeMonth))),
      undefined,
      undefined,
      getScheduleByKey(activeMonth)?.rows,
      workOrders.filter(w => w.dateCreated.startsWith(activeMonth) || (w as any).date?.startsWith(activeMonth) || w.deadline.startsWith(activeMonth)),
      dailyTasks.filter(t => t.createdAt.startsWith(activeMonth) || t.dueDate.startsWith(activeMonth)),
      activeMonth
    );
  }, [staffList, dailyReports, logbookEntries, findings, workOrders, dailyTasks, activeMonth]);

  // 2. Active Period Staff KPIs (Always use monthly for consistent grading, regardless of active tab view)
  const staffKpis = React.useMemo(() => {
    return monthlyStaffKpis;
  }, [monthlyStaffKpis]);
  
  const activeStaff = React.useMemo(() => {
    return staffKpis;
  }, [staffKpis]);

  // Filter staf yang bertugas sesuai data referensi Google Sheet dan memiliki aktivitas riil
  const activeStaffProductivityData = React.useMemo(() => {
    return [...activeStaff]
      .filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0)
      .sort((a, b) => {
        if (b.kpi !== a.kpi) return b.kpi - a.kpi;
        if ((b.attendanceCount || 0) !== (a.attendanceCount || 0)) return (b.attendanceCount || 0) - (a.attendanceCount || 0);
        if (b.reports !== a.reports) return (b.reports || 0) - (a.reports || 0);
        if (b.qcs !== a.qcs) return (b.qcs || 0) - (a.qcs || 0);
        if (b.wos !== a.wos) return (b.wos || 0) - (a.wos || 0);
        return 0;
      });
  }, [activeStaff]);

  // State filter divisi interaktif di Bagian 04
  const [selectedDivisionFilter, setSelectedDivisionFilter] = React.useState<string>('All');

  // Filter staf berdasarkan divisi yang dipilih (dengan dukungan penuh staf dual-divisi Mulyana)
  const filteredStaffProductivityData = React.useMemo(() => {
    if (selectedDivisionFilter === 'All') return activeStaffProductivityData;
    return activeStaffProductivityData.filter(s => {
      if (s.division === selectedDivisionFilter) return true;
      // Staf dual-divisi Mulyana: muncul di Service dan Videotron
      if ((selectedDivisionFilter === 'Videotron' || selectedDivisionFilter === 'Service') &&
          (s.name.toLowerCase().includes('mulyana') || s.name.toLowerCase().includes('kharo') || s.id === 'staff-mulyana')) {
        return true;
      }
      return false;
    });
  }, [activeStaffProductivityData, selectedDivisionFilter]);

  // Total akumulasi untuk footer tabel Bagian 04 (Sinkron 100% dengan Bagian 03)
  const totalsFilteredStaff = React.useMemo(() => {
    const totalReports = filteredStaffProductivityData.reduce((acc, s) => acc + (s.reports || 0), 0);
    const totalQcs = filteredStaffProductivityData.reduce((acc, s) => acc + (s.qcs || 0), 0);
    const totalAttendance = filteredStaffProductivityData.reduce((acc, s) => acc + (s.attendanceCount || 0), 0);
    const totalHours = filteredStaffProductivityData.reduce((acc, s) => acc + (s.hours || (s.attendanceCount * 8) || 0), 0);
    const avgKpi = filteredStaffProductivityData.length > 0
      ? Math.round(filteredStaffProductivityData.reduce((acc, s) => acc + s.kpi, 0) / filteredStaffProductivityData.length)
      : 0;
    return { totalReports, totalQcs, totalAttendance, totalHours, avgKpi };
  }, [filteredStaffProductivityData]);

  // Grade distributions dynamically calculated from real active data
  const countGradeA = activeStaffProductivityData.filter(s => s.grade === 'A').length;
  const countGradeB = activeStaffProductivityData.filter(s => s.grade === 'B').length;
  const countGradeC = activeStaffProductivityData.filter(s => s.grade === 'C').length;
  const countGradeD = activeStaffProductivityData.filter(s => s.grade === 'D').length;

  // Top Performer Bulan Ini: Selalu dihitung dari akumulasi bulanan resmi Google Sheet (1-10 Top Performer)
  const topPerformers = React.useMemo(() => {
    return [...monthlyStaffKpis]
      .filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0 || s.attendanceCount > 0)
      .sort((a, b) => {
        if (b.kpi !== a.kpi) return b.kpi - a.kpi;
        if ((b.attendanceCount || 0) !== (a.attendanceCount || 0)) return (b.attendanceCount || 0) - (a.attendanceCount || 0);
        if (b.reports !== a.reports) return (b.reports || 0) - (a.reports || 0);
        if (b.qcs !== a.qcs) return (b.qcs || 0) - (a.qcs || 0);
        if (b.wos !== a.wos) return (b.wos || 0) - (a.wos || 0);
        return 0;
      })
      .slice(0, 10);
  }, [monthlyStaffKpis]);

  // 100% Dynamic Division Metrics
  const divisionListConfig = [
    { label: 'Audio (Sound)', key: 'Audio' },
    { label: 'Lighting', key: 'Lighting' },
    { label: 'Videotron', key: 'Videotron' },
    { label: 'Multimedia', key: 'Multimedia' },
    { label: 'Gudang Logistik', key: 'Gudang' },
    { label: 'Service (Perbaikan)', key: 'Service' },
    { label: 'Administrasi (Admin)', key: 'Admin' }
  ];

  const divisionStatsDynamic = divisionListConfig.map(d => {
    // Staff Mulyana/Kharo berada di 2 posisi divisi: Videotron & Service
    const isDualStaff = (name?: string) => {
      const lower = (name || '').toLowerCase();
      return lower.includes('mulyana') || lower.includes('kharo') || lower.includes('karo');
    };

    const dr = activeDailyReports.filter(r => {
      if (r.division === d.key) return true;
      if ((d.key === 'Videotron' || d.key === 'Service') && isDualStaff(r.staffName)) return true;
      return false;
    }).length;

    const qc = activeLogbookEntries.filter(e => {
      if (e.division === d.key) return true;
      if ((d.key === 'Videotron' || d.key === 'Service') && isDualStaff(e.staffName)) return true;
      return false;
    }).length;

    const wo = activeWorkOrders.filter(w => {
      if (w.division === d.key) return true;
      if ((d.key === 'Videotron' || d.key === 'Service') && isDualStaff(w.pic)) return true;
      return false;
    }).length;

    const totalActs = dr + qc + wo;
    
    // Dynamic KPI for this division
    const divStaff = activeStaffProductivityData.filter(s => {
      if (s.division === d.key) return true;
      const foundStaff = staffList.find(st => st.id === s.id);
      return isStaffInDivision(foundStaff, d.key);
    });
    const avgKpi = divStaff.length > 0 
      ? Math.round(divStaff.reduce((acc, s) => acc + s.kpi, 0) / divStaff.length)
      : 0;

    // Damage statistics for this division
    const divFindings = activeFindings.filter(f => {
      if (f.division === d.key) return true;
      const eq = (f.equipment || '').toLowerCase();
      const iss = (f.issue || '').toLowerCase();
      const divKey = d.key.toLowerCase();
      if (eq.includes(divKey) || iss.includes(divKey)) return true;
      if (d.key === 'Audio' || d.key === 'Audio (Sound)') {
        return /audio|sound|speaker|mic|mixer|dbtech|dva|xlr|cable|power amp|subwoofer|line array/i.test(eq) || /audio|sound|speaker|mic|mixer|dbtech|dva|xlr|subwoofer/i.test(iss);
      }
      if (d.key === 'Lighting') {
        return /light|lampu|parled|beam|moving head|dimmer|dmx|fresnel|b-eye|bsw/i.test(eq) || /light|lampu|parled|beam|moving head|dimmer|dmx|fresnel|b-eye|bsw/i.test(iss);
      }
      if (d.key === 'Videotron') {
        return /video|led|videotron|screen|panel led|modul|novastar|processor/i.test(eq) || /video|led|videotron|screen|panel led|modul/i.test(iss);
      }
      if (d.key === 'Multimedia') {
        return /multi|kamera|camera|switcher|hdmi|sdi|obs|streaming|vmix/i.test(eq) || /multi|kamera|camera|switcher|hdmi|sdi|obs|streaming|vmix/i.test(iss);
      }
      if (d.key === 'Gudang' || d.key === 'Gudang Logistik') {
        return /gudang|logistik|kabel roll|tenda|flightcase|terpal|pallet/i.test(eq) || /gudang|logistik/i.test(iss);
      }
      if (d.key === 'Service' || d.key === 'Service (Perbaikan)') {
        return /service|perbaikan|solder|sparepart|modul rusak|jalur pcb/i.test(eq) || /service|perbaikan|rusak/i.test(iss);
      }
      return false;
    });
    const ringan = divFindings.filter(f => f.priority === 'Rendah').length;
    const sedang = divFindings.filter(f => f.priority === 'Sedang').length;
    const berat = divFindings.filter(f => f.priority === 'Tinggi').length;
    const totalDamages = divFindings.length;

    return {
      ...d,
      dr,
      qc,
      wo,
      totalActs,
      avgKpi,
      ringan,
      sedang,
      berat,
      totalDamages
    };
  });

  const maxDivisionActs = Math.max(...divisionStatsDynamic.map(d => d.totalActs), 1);

  // Dynamic QC metrics
  const totalQC = activeLogbookEntries.length;
  const totalOK = activeLogbookEntries.filter(e => e.result === 'OK').length;
  const totalNG = activeLogbookEntries.filter(e => e.result === 'NG').length;
  const percentOK = totalQC > 0 ? parseFloat(((totalOK / totalQC) * 100).toFixed(1)) : 0;
  const percentNG = totalQC > 0 ? parseFloat(((totalNG / totalQC) * 100).toFixed(1)) : 0;

  // Dynamic Top 10 Equipment with Issues
  const equipmentFrequencyMap: Record<string, { count: number; lastStatus: string }> = {};
  activeFindings.forEach(f => {
    const name = f.equipment || 'Unknown';
    if (!equipmentFrequencyMap[name]) {
      equipmentFrequencyMap[name] = {
        count: 0,
        lastStatus: f.status === 'Close' ? 'Selesai Diperbaiki' : 'Dalam Perbaikan'
      };
    }
    equipmentFrequencyMap[name].count++;
    if (f.status === 'Open') {
      equipmentFrequencyMap[name].lastStatus = 'Dalam Perbaikan';
    }
  });

  const topEquipmentsWithIssues = Object.entries(equipmentFrequencyMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Chart data: count how many QC checklist items are checked per division
  const divisionsList = ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'] as const;
  const divisionStats = divisionsList.map(div => {
    const divEntries = activeLogbookEntries.filter(e => e.division === div);
    let okCount = 0;
    let ngCount = 0;
    divEntries.forEach(e => {
      Object.values(e.checklists || {}).forEach((ch: any) => {
        if (ch.status === 'OK') okCount++;
        if (ch.status === 'NG') ngCount++;
      });
    });
    return {
      name: div,
      ok: okCount,
      ng: ngCount,
      total: okCount + ngCount
    };
  });

  // Dynamic Attendance Statistics per Division for September 2026
  const divisionsAttendanceList = [
    { key: 'Audio', label: 'Audio (Sound)' },
    { key: 'Lighting', label: 'Lighting' },
    { key: 'Videotron', label: 'Videotron' },
    { key: 'Multimedia', label: 'Multimedia' },
    { key: 'Gudang', label: 'Gudang Logistik' },
    { key: 'Service', label: 'Service (Perbaikan)' },
    { key: 'Admin', label: 'Administrasi (Admin)' },
  ];

  let rawAttendanceLogs: AttendanceLog[] = [];
  try {
    const saved = localStorage.getItem('riz_attendance_logs');
    if (saved) rawAttendanceLogs = JSON.parse(saved);
  } catch (e) {}
  const [monthlyScheduleData, setMonthlyScheduleData] = React.useState<StaffScheduleRow[]>(() => {
    try {
      const saved = localStorage.getItem(`riz_schedule_${activeMonth}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const defaultSch = getScheduleByKey(activeMonth);
    return defaultSch ? defaultSch.rows : [];
  });

  React.useEffect(() => {
    const unsubSchedule = subscribeCloudCollection<any>(
      `schedule_${activeMonth}`,
      `riz_schedule_${activeMonth}`,
      (data) => {
        if (data.length > 0) {
          const flatItems = data.flatMap((item: any) => {
            if (item && Array.isArray(item.list)) return item.list;
            return item;
          });
          const validItems = flatItems.filter((i: any) => i && typeof i === 'object' && i.no);
          if (validItems.length > 0) {
            validItems.sort((a, b) => (a.no || 0) - (b.no || 0));
            setMonthlyScheduleData(validItems);
          } else {
            const defaultSch = getScheduleByKey(activeMonth);
            setMonthlyScheduleData(defaultSch ? defaultSch.rows : []);
          }
        } else {
          const defaultSch = getScheduleByKey(activeMonth);
          setMonthlyScheduleData(defaultSch ? defaultSch.rows : []);
        }
      },
      getScheduleByKey(activeMonth)?.rows || []
    );
    return () => unsubSchedule();
  }, [activeMonth]);

  // Aggregate staff KPI metrics dynamically over all operational data
  const staffKpiList = React.useMemo(() => {
    return calculateAllStaffKpis(
      staffList, 
      activeDailyReports,   // dailyReports (posisi ke-2)
      activeLogbookEntries, // logbookEntries (posisi ke-3)
      activeFindings,       // findings (posisi ke-4)
      rawAttendanceLogs,    // attendanceLogs
      undefined,            // electricalCompetencies
      monthlyScheduleData.length > 0 ? monthlyScheduleData : getScheduleByKey(activeMonth)?.rows,
      activeWorkOrders,     // workOrders (posisi ke-8)
      activeDailyTasks,     // dailyTasks (posisi ke-9)
      activeMonth
    );
  }, [staffList, activeDailyReports, activeLogbookEntries, activeFindings, activeWorkOrders, activeDailyTasks, monthlyScheduleData, activeMonth]);

  // Helper pencocokan divisi jadwal dengan divisi standar
  const isScheduleDivisionMatch = (schDiv: string, targetKey: string): boolean => {
    const s = (schDiv || '').trim().toLowerCase();
    const t = (targetKey || '').trim().toLowerCase();
    if (s === t) return true;
    if ((t === 'audio' || t === 'sound') && (s === 'audio' || s === 'sound')) return true;
    if ((t === 'videotron' || t === 'led') && (s === 'videotron' || s === 'led')) return true;
    if ((t === 'gudang' || t === 'warehouse') && (s === 'gudang' || s === 'warehouse')) return true;
    if ((t === 'admin' || t === 'administrasi') && (s === 'admin' || s === 'administrasi')) return true;
    if ((t === 'service' || t === 'perbaikan') && (s === 'service' || s === 'perbaikan')) return true;
    return false;
  };

  const uniqueScheduleRows = React.useMemo(() => {
    const seen = new Set<string>();
    const source = monthlyScheduleData.length > 0 ? monthlyScheduleData : (getScheduleByKey(activeMonth)?.rows || []);
    return source.filter(row => {
      const key = (row.name || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [monthlyScheduleData, activeMonth]);

  const divisionAttendanceStats = divisionsAttendanceList.map(div => {
    const staffInDiv = staffList.filter(s => isStaffInDivision(s, div.key));
    let hadirCount = 0;
    let terlambatCount = 0;
    let izinCount = 0;
    let sakitCount = 0;
    let alphaCount = 0;

    const isDateInRange = (dateStr?: string) => {
      if (!dateStr) return false;
      if (activeTab === 'harian') return dateStr === today;
      if (activeTab === 'daily_report') return dateStr === targetDate;
      if (activeTab === 'weekly_report') return dateStr >= targetStartDate && dateStr <= targetEndDate;
      if (activeTab === 'monthly_report' || activeTab === 'graphic_view') return dateStr.startsWith(activeMonth);
      return true;
    };

    staffInDiv.forEach(st => {
      const staffDates = new Set<string>();
      activeDailyReports
        .filter(r => isStaffMatch(st, r.staffName) && isDateInRange(r.date))
        .forEach(r => staffDates.add(r.date));

      activeLogbookEntries
        .filter(e => isStaffMatch(st, e.staffName) && isDateInRange(e.date))
        .forEach(e => staffDates.add(e.date));

      rawAttendanceLogs
        .filter(l => (l.staffId === st.id || isStaffMatch(st, l.staffName)) && (l.status === 'Hadir' || l.checkInTime) && isDateInRange(l.date))
        .forEach(l => { if (l.date) staffDates.add(l.date); });

      hadirCount += staffDates.size;
    });

    const divLogs = rawAttendanceLogs.filter(l => {
      const matchDiv = isScheduleDivisionMatch(l.division || '', div.key) ||
        staffInDiv.some(st => st.id === l.staffId || isStaffMatch(st, l.staffName));
      return matchDiv && isDateInRange(l.date);
    });

    divLogs.forEach(l => {
      if (l.isLate) terlambatCount++;
      else if (l.status === 'Izin') izinCount++;
      else if (l.status === 'Sakit') sakitCount++;
      else if (l.status === 'Alpha') alphaCount++;
    });

    return {
      label: div.label,
      hadir: hadirCount,
      terlambat: terlambatCount,
      izin: izinCount,
      sakit: sakitCount,
      alpha: alphaCount,
      total: hadirCount + terlambatCount + izinCount + sakitCount + alphaCount
    };
  });

  const totalHadirAll = divisionAttendanceStats.reduce((acc, d) => acc + d.hadir, 0);
  const totalTerlambatAll = divisionAttendanceStats.reduce((acc, d) => acc + d.terlambat, 0);
  const totalSlotsAll = divisionAttendanceStats.reduce((acc, d) => acc + d.total, 0);
  const avgAttendancePercent = totalSlotsAll > 0 ? ((totalHadirAll / totalSlotsAll) * 100).toFixed(1) : '0.0';
  const avgLatePercent = totalSlotsAll > 0 ? ((totalTerlambatAll / totalSlotsAll) * 100).toFixed(1) : '0.0';

  const reportTypeName = activeTab === 'daily_report' ? 'Harian' : activeTab === 'weekly_report' ? 'Mingguan' : 'Bulanan';
  const reportBadgeText = activeTab === 'daily_report' ? 'Laporan Resmi Harian' : activeTab === 'weekly_report' ? 'Laporan Resmi Mingguan' : 'Laporan Resmi Bulanan';
  const reportMainTitle = activeTab === 'daily_report' ? 'DAILY OPERATION REPORT' : activeTab === 'weekly_report' ? 'WEEKLY OPERATION REPORT' : 'MONTHLY OPERATION REPORT';
  const periodDisplay = activeTab === 'daily_report' ? targetDate : activeTab === 'weekly_report' ? `${targetStartDate} s/d ${targetEndDate}` : targetMonth;

  return (
    <div className="space-y-6 font-sans">
      {/* Tab Switcher / Control bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Navigasi Dashboard</h1>
          <p className="text-[11px] text-slate-500">Pilih tampilan dashboard harian atau semua jenis pelaporan operasi (Harian, Mingguan, Bulanan)</p>
        </div>
        <div className="flex items-center overflow-x-auto no-scrollbar touch-scroll bg-slate-100 p-1 rounded-lg w-full md:w-auto gap-1 max-w-full">
          <button
            onClick={() => setActiveTab('harian')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'harian' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ringkasan Harian
          </button>
          <button
            onClick={() => setActiveTab('graphic_view')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'graphic_view' ? 'bg-indigo-600 text-white font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Graphic View</span>
          </button>
          <button
            onClick={() => setActiveTab('daily_report')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'daily_report' ? 'bg-white text-indigo-700 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Daily Operation Report
          </button>
          <button
            onClick={() => setActiveTab('weekly_report')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'weekly_report' ? 'bg-white text-indigo-700 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Weekly Operation Report
          </button>
          <button
            onClick={() => setActiveTab('monthly_report')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === 'monthly_report' ? 'bg-white text-indigo-700 font-extrabold shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Operation Report
          </button>
        </div>
      </div>

      {activeTab === 'harian' ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="header-title">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Logbook Harian</h1>
              <p className="text-xs text-slate-500 mt-1">PT RIZ-PRODUCTION • {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate('reports')}
                className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Ekspor & Cetak PDF
              </button>
              <button
                onClick={() => onNavigate('qc')}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white border-none px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                + Logbook QC Baru
              </button>
            </div>
          </div>

          {/* Stat Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => onNavigate('qc')}
              className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
              title="Buka QC Checklist"
            >
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2 group-hover:text-blue-600 transition-colors">Checked Today</div>
              <div className="text-3xl font-display font-extrabold tracking-tight text-slate-900 flex items-baseline">
                {totalQCOk + totalQCNg}
                <span className="text-xs font-normal text-slate-500 ml-1.5">Units &rarr;</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('qc')}
              className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
              title="Buka QC Checklist"
            >
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2 group-hover:text-emerald-600 transition-colors">Condition OK</div>
              <div className="text-3xl font-display font-extrabold tracking-tight text-[#10b981]">{totalQCOk} <span className="text-xs font-normal text-slate-400">&rarr;</span></div>
            </div>

            <div
              onClick={() => onNavigate('findings')}
              className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-rose-300 hover:shadow-md transition-all group"
              title="Buka Temuan QC & WO"
            >
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2 group-hover:text-rose-600 transition-colors">Requires Action (NG)</div>
              <div className="text-3xl font-display font-extrabold tracking-tight text-[#ef4444]">{totalQCNg} <span className="text-xs font-normal text-slate-400">&rarr;</span></div>
            </div>

            <div
              onClick={() => onNavigate('work_orders')}
              className="bg-white p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group"
              title="Buka Work Order Perbaikan"
            >
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2 group-hover:text-amber-600 transition-colors">Pending Repairs</div>
              <div className="text-3xl font-display font-extrabold tracking-tight text-[#f59e0b]">{openIssues} <span className="text-xs font-normal text-slate-400">&rarr;</span></div>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-sm text-slate-900">Recent QC Activity</h2>
                <button onClick={() => onNavigate('qc')} className="text-xs text-[#3b82f6] hover:underline font-semibold">
                  Lihat Semua
                </button>
              </div>
              <div className="flex-1 overflow-x-auto touch-scroll">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="bg-[#f1f5f9] text-[#475569] border-b border-slate-200 font-semibold">
                      <th className="px-4 py-3">Staff</th>
                      <th className="px-4 py-3">Division</th>
                      <th className="px-4 py-3">Equipment / Area</th>
                      <th className="px-4 py-3">Result</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeLogbookEntries.slice(0, 6).map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-900">{e.staffName}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#e0f2fe] text-[#075985]">
                            {e.division}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 truncate max-w-[180px]">{e.activity}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            e.result === 'OK' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}>
                            {e.result}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-mono font-bold text-slate-500">{e.status}</td>
                      </tr>
                    ))}
                    {logbookEntries.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center bg-slate-50/50">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-slate-700">Tidak Ada Aktivitas QC</span>
                            <span className="text-xs text-slate-500 mt-1">Belum ada aktivitas inspeksi QC yang tercatat.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 flex flex-col p-5 space-y-5">
              <div>
                <h2 className="font-semibold text-sm text-slate-900">Division Asset Health</h2>
              </div>
              
              <div className="space-y-4">
                {divisionStats.map(stat => {
                  const hasInspections = stat.total > 0;
                  const healthPercent = hasInspections ? Math.round((stat.ok / stat.total) * 100) : 0;
                  const barColor = !hasInspections ? '#94a3b8' : healthPercent >= 80 ? '#10b981' : healthPercent >= 60 ? '#f59e0b' : '#ef4444';

                  return (
                    <div key={stat.name} className="flex flex-col gap-1.5 text-[13px]">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">{stat.name}</span>
                        <span className="font-semibold text-slate-900">
                          {hasInspections ? `${healthPercent}%` : 'N/A (Belum Ada Cek)'}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: hasInspections ? `${healthPercent}%` : '0%', backgroundColor: barColor }}
                          className="h-full rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Issues</div>
                  <button
                    onClick={() => onNavigate('findings')}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold hover:underline cursor-pointer"
                  >
                    Buka Temuan QC &rarr;
                  </button>
                </div>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {findings.filter(f => f.status === 'Open').slice(0, 2).map((f) => (
                    <div key={f.id} className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs">
                      <div className="font-semibold text-rose-800">{f.equipment}</div>
                      <div className="text-rose-600 mt-1">{f.issue}</div>
                      <div className="text-[10px] text-rose-500 mt-1 font-mono">PIC: {f.pic} • Priority: {f.priority.toUpperCase()}</div>
                    </div>
                  ))}
                  {findings.filter(f => f.status === 'Open').length === 0 && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500 italic text-center">
                      Tidak ada kendala kritis saat ini. Semua alat siap beroperasi.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'graphic_view' ? (
        /* DEDICATED GRAPHIC VIEW / VISUAL CHART ANALYTICS */
        <div className="space-y-6">
          {/* Header Graphic View */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 text-[10px] font-mono px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Visual Analytics & Charts
              </span>
              <h1 className="text-2xl font-black tracking-tight mt-2 flex items-center gap-2.5">
                <PieChart className="w-6 h-6 text-indigo-400" />
                <span>GRAPHIC VIEW — RIZ-PRO LOG</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Visualisasi grafis interaktif produktivitas divisi, kelulusan QC, statistik kerusakan, dan skor KPI seluruh staff.
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-slate-300">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{targetMonth}</span>
            </div>
          </div>

          {/* Graphic Grid 1: Produktivitas Divisi Bar Chart & QC Pass/Fail Ratio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Bar Chart Produktivitas Divisi */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Grafik Produktivitas Operasional per Divisi</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">Total {totalDailyReportsCount + totalQCCount + workOrders.length} Kegiatan</span>
                  <button
                    onClick={() => onNavigate('log_task')}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                  >
                    Buka Daily Task &rarr;
                  </button>
                </div>
              </div>

              <div className="space-y-3.5 pt-2">
                {divisionStatsDynamic.map((d, idx) => {
                  const percent = maxDivisionActs > 0 ? Math.round((d.totalActs / maxDivisionActs) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                          {d.label}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-slate-500">Lap: {d.dr} | QC: {d.qc} | WO: {d.wo}</span>
                          <strong className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">{d.totalActs} Acts</strong>
                        </div>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 flex">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(percent, 4)}%` }}
                        >
                          {percent >= 25 && <span className="text-[9px] text-white font-mono font-bold">{percent}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: QC Kelulusan OK vs NG Donut / Ratio Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Rasio Kelulusan QC</h2>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {percentOK}% Lulus
                </span>
              </div>

              {/* Graphical Visual Ring / Meter */}
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent transition-all duration-1000"
                    style={{ transform: `rotate(${Math.round((percentOK / 100) * 360)}deg)` }}
                  ></div>
                  <div className="text-center">
                    <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">{percentOK}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Kondisi OK</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 font-mono text-xs">
                <div className="flex justify-between items-center bg-emerald-50/70 p-2 rounded-lg border border-emerald-100 text-emerald-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Unit Siap Pakai (OK)
                  </span>
                  <span>{totalOK} Unit</span>
                </div>
                <div className="flex justify-between items-center bg-rose-50/70 p-2 rounded-lg border border-rose-100 text-rose-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    Butuh Perbaikan (NG)
                  </span>
                  <span>{totalNG} Unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graphic Grid 2: Leaderboard KPI Staff & Tingkat Kerusakan */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Leaderboard Visual Bar KPI Karyawan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Grafik Skor KPI Karyawan Teratas</h2>
                </div>
                <button
                  onClick={() => onNavigate('kinerja_karyawan')}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                >
                  Detail KPI &rarr;
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {activeStaffProductivityData.map((staff, idx) => {
                  const barColor = staff.kpi >= 80 ? 'from-emerald-500 to-teal-600' : staff.kpi >= 60 ? 'from-blue-500 to-indigo-600' : 'from-amber-500 to-orange-500';
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 font-mono text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          {staff.name} <span className="text-[10px] text-slate-400 font-normal">({staff.division})</span>
                        </span>
                        <span className="font-mono font-bold text-indigo-700 text-xs">{staff.kpi}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(staff.kpi, 5)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 4: Grafik Tingkat Kerusakan & Top Problematic Assets */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <h2 className="font-bold text-sm text-slate-900 uppercase tracking-tight">Grafik Kerusakan Peralatan & Work Order</h2>
                </div>
                <button
                  onClick={() => onNavigate('findings')}
                  className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                >
                  Kelola Temuan ({findings.length}) &rarr;
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {topEquipmentsWithIssues.slice(0, 5).map((eq, idx) => {
                  const maxIssue = Math.max(...topEquipmentsWithIssues.map(e => e.count), 1);
                  const percent = Math.round((eq.count / maxIssue) * 100);
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-slate-800 truncate max-w-[200px]">{eq.name}</span>
                        <span className="font-mono text-rose-600 text-xs font-bold">{eq.count} Kali Bermasalah</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-gradient-to-r from-rose-400 to-red-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                {topEquipmentsWithIssues.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs italic">
                    Belum ada riwayat kerusakan alat. Seluruh peralatan dalam kondisi prima.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Ringan</span>
                  <strong className="text-amber-600 text-sm mt-0.5 block">{findings.filter(f => f.priority === 'Rendah').length}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sedang</span>
                  <strong className="text-orange-600 text-sm mt-0.5 block">{findings.filter(f => f.priority === 'Sedang').length}</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Berat</span>
                  <strong className="text-rose-600 text-sm mt-0.5 block">{findings.filter(f => f.priority === 'Tinggi').length}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 15 SECTIONS OPERATION REPORT (HARIAN, MINGGUAN, BULANAN) */
        <div id="monthly-operation-report-view" className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          {/* Title Header */}
          <div className="border-b-2 border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {reportBadgeText}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-950 mt-1.5 tracking-tight font-sans">
                {reportMainTitle}
              </h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">PT RIZ-PRODUCTION • Sistem Informasi Manajemen Operational QC & Maintenance</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 font-mono">PERIODE :</label>
              {activeTab === 'daily_report' && (
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
              {activeTab === 'weekly_report' && (
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={targetStartDate}
                    onChange={(e) => setTargetStartDate(e.target.value)}
                    className="bg-white border border-slate-300 text-[11px] font-bold text-slate-800 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <span className="text-xs text-slate-400 font-bold">s/d</span>
                  <input
                    type="date"
                    value={targetEndDate}
                    onChange={(e) => setTargetEndDate(e.target.value)}
                    className="bg-white border border-slate-300 text-[11px] font-bold text-slate-800 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
              {activeTab === 'monthly_report' && (
                <select
                  value={activeMonth}
                  onChange={(e) => {
                    const newKey = e.target.value;
                    if (onActiveMonthChange) onActiveMonthChange(newKey);
                    const sch = getScheduleByKey(newKey);
                    if (sch) setTargetMonth(sch.label);
                  }}
                  className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm"
                >
                  {ALL_MONTHLY_SCHEDULES.map((sch) => (
                    <option key={sch.key} value={sch.key}>
                      {sch.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">01.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">EXECUTIVE SUMMARY</h2>
            </div>
            
            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Penyusunan laporan {reportTypeName.toLowerCase()} operasi periode <strong className="text-slate-900">{periodDisplay}</strong> ini mencakup performa kerja tim teknis harian (Sound, Lighting, Videotron, Multimedia) serta kepatuhan Preventive Maintenance (PM).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Hari Kerja</span>
                  <strong className="text-base text-slate-900 block mt-1 font-sans">
                    {activeTab === 'daily_report' ? '1 Hari' : activeTab === 'weekly_report' ? '7 Hari' : `${uniqueWorkingDays} Hari`}
                  </strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Staff Aktif</span>
                  <strong className="text-base text-slate-900 block mt-1 font-sans">
                    {activeStaffProductivityData.length} Staff
                  </strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Daily Report</span>
                  <strong className="text-base text-indigo-600 block mt-1 font-sans">{totalDailyReportsCount}</strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Total QC</span>
                  <strong className="text-base text-emerald-600 block mt-1 font-sans">{totalQCCount}</strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Prev. Main</span>
                  <strong className="text-base text-blue-600 block mt-1 font-sans">{totalPM}</strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Corr. Main</span>
                  <strong className={`text-base block mt-1 font-sans ${pendingRepair > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {pendingRepair}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: KEHADIRAN STAFF */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">02.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">KEHADIRAN STAFF</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table */}
              <div className="lg:col-span-2 overflow-x-auto touch-scroll border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                      <th className="p-3">Divisi</th>
                      <th className="p-3 text-center">Hadir</th>
                      <th className="p-3 text-center">Terlambat</th>
                      <th className="p-3 text-center">Izin</th>
                      <th className="p-3 text-center">Sakit</th>
                      <th className="p-3 text-center">Alpha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {divisionAttendanceStats.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-sans font-bold text-slate-800">{d.label}</td>
                        <td className="p-3 text-center text-emerald-600 font-bold">{d.hadir}</td>
                        <td className="p-3 text-center text-amber-600 font-bold">{d.terlambat}</td>
                        <td className="p-3 text-center text-slate-500">{d.izin}</td>
                        <td className="p-3 text-center text-indigo-500">{d.sakit}</td>
                        <td className="p-3 text-center text-rose-600 font-bold">{d.alpha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status Note - Full Opacity */}
              <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-slate-600">
                  Pencatatan Kehadiran berkontribusi bobot <strong>15%</strong> pada KPI resmi, dihitung secara proporsional dari kehadiran aktual dan shift kerja.
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUKTIVITAS DIVISI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">03.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">PRODUKTIVITAS DIVISI</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table */}
              <div className="lg:col-span-2 overflow-x-auto touch-scroll border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                      <th className="p-3">Divisi</th>
                      <th className="p-3 text-center">Daily Report</th>
                      <th className="p-3 text-center">QC</th>
                      <th className="p-3 text-center">Maintenance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {divisionStatsDynamic.map((d, idx) => {
                      const isSelected = selectedDivisionFilter === d.key;
                      return (
                        <tr
                          key={idx}
                          onClick={() => setSelectedDivisionFilter(isSelected ? 'All' : d.key)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-indigo-50/80 font-bold text-indigo-900 border-l-4 border-indigo-600'
                              : 'hover:bg-slate-50/70'
                          }`}
                          title={`Klik untuk memfilter daftar staf divisi ${d.label} di Bagian 04`}
                        >
                          <td className="p-3 font-sans font-bold text-slate-800 flex items-center justify-between">
                            <span>{d.label}</span>
                            {isSelected && (
                              <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                                Aktif
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">{d.dr}</td>
                          <td className="p-3 text-center">{d.qc}</td>
                          <td className="p-3 text-center">{d.wo}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Produktivitas per Divisi</h3>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {divisionStatsDynamic.map((d, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span>{d.label} ({d.totalActs} acts)</span>
                        <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3b82f6]"
                            style={{ width: `${maxDivisionActs > 0 ? (d.totalActs / maxDivisionActs) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Aktivitas Operasi</h3>
                  <div className="space-y-1 font-mono text-[10px] text-slate-500">
                    <div className="flex justify-between">
                      <span>Total Daily Report:</span>
                      <strong className="text-slate-800">{totalDailyReportsCount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total QC Log:</span>
                      <strong className="text-slate-800">{totalQCCount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Work Order / Temuan:</span>
                      <strong className="text-slate-800">{activeFindings.length + activeWorkOrders.length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRODUKTIVITAS STAFF & TOP 10 PERFORMERS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">04.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">PRODUKTIVITAS STAFF</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Productivity Table */}
              <div className="lg:col-span-2 space-y-2">
                {/* Quick Division Filter Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider mr-1">Filter Divisi:</span>
                    {[
                      { key: 'All', label: 'Semua Divisi' },
                      { key: 'Audio', label: 'Audio (Sound)' },
                      { key: 'Lighting', label: 'Lighting' },
                      { key: 'Videotron', label: 'Videotron' },
                      { key: 'Service', label: 'Service' },
                    ].map(tab => {
                      const isSelected = selectedDivisionFilter === tab.key;
                      const count = tab.key === 'All' 
                        ? activeStaffProductivityData.length 
                        : activeStaffProductivityData.filter(s => {
                            if (s.division === tab.key) return true;
                            if ((tab.key === 'Videotron' || tab.key === 'Service') &&
                                (s.name.toLowerCase().includes('mulyana') || s.name.toLowerCase().includes('kharo') || s.id === 'staff-mulyana')) {
                              return true;
                            }
                            return false;
                          }).length;

                      return (
                        <button
                          key={tab.key}
                          onClick={() => setSelectedDivisionFilter(tab.key)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedDivisionFilter !== 'All' && (
                    <button
                      onClick={() => setSelectedDivisionFilter('All')}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto touch-scroll border border-slate-200 rounded-xl max-h-[520px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px] sticky top-0 z-10">
                        <th className="p-3 text-center w-12">No</th>
                        <th className="p-3">Nama Staff</th>
                        <th className="p-3">Divisi</th>
                        <th className="p-3 text-center">Daily Report</th>
                        <th className="p-3 text-center">QC Checked</th>
                        <th className="p-3 text-center">Kehadiran</th>
                        <th className="p-3 text-center">Uji Komp.</th>
                        <th className="p-3 text-center">Jam Kerja</th>
                        <th className="p-3 text-center">KPI Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {filteredStaffProductivityData.length > 0 ? (
                        filteredStaffProductivityData.map((staff, idx) => {
                          const originalStaff = staffList.find(st => st.id === staff.id || st.name === staff.name) || (staff as any);
                          const attendanceDays = staff.attendanceCount;
                          const workHours = staff.hours || (attendanceDays * 8);
                          const isDualStaff = staff.name.toLowerCase().includes('mulyana') || 
                                              staff.name.toLowerCase().includes('kharo') || 
                                              staff.id === 'staff-mulyana';

                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 text-center font-bold text-slate-500 font-mono">{idx + 1}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={originalStaff?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=0f172a&color=fff&rounded=true&bold=true`}
                                    alt={staff.name}
                                    className="w-7 h-7 rounded-full border border-slate-200"
                                  />
                                  <span className="font-sans font-bold text-slate-800">{staff.name}</span>
                                </div>
                              </td>
                              <td className="p-3 font-sans">
                                {isDualStaff ? (
                                  <div className="flex flex-wrap items-center gap-1">
                                    <span className="font-bold text-slate-800">Service</span>
                                    <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-mono font-bold border border-sky-200">
                                      + Videotron
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-600">{staff.division}</span>
                                )}
                              </td>
                              <td className="p-3 text-center font-bold text-slate-800">{staff.reports}</td>
                              <td className="p-3 text-center text-slate-700">{staff.qcs}</td>
                              <td className="p-3 text-center text-slate-700 font-sans">{attendanceDays > 0 ? `${attendanceDays} Hari` : '-'}</td>
                              <td className="p-3 text-center text-slate-700">{staff.competencyCount}/6</td>
                              <td className="p-3 text-center text-slate-700 font-sans">{workHours > 0 ? `${workHours} Jam` : '-'}</td>
                              <td className="p-3 text-center">
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold text-[11px]">
                                  {staff.kpi}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="p-4 text-center text-slate-400 italic">
                            Tidak ada aktifitas staff tercatat pada periode ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {filteredStaffProductivityData.length > 0 && (
                      <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-mono font-bold text-slate-800 sticky bottom-0 z-10 shadow-xs">
                        <tr>
                          <td colSpan={2} className="p-3 text-center uppercase tracking-wider text-[11px] text-indigo-900 bg-indigo-50/70 font-sans">
                            Total Akumulasi {selectedDivisionFilter !== 'All' ? `(${selectedDivisionFilter})` : 'Tim Aktif'}
                          </td>
                          <td className="p-3 text-slate-600 font-sans text-xs">
                            {filteredStaffProductivityData.length} Staf
                          </td>
                          <td className="p-3 text-center text-indigo-700 font-black text-xs">
                            {totalsFilteredStaff.totalReports}
                          </td>
                          <td className="p-3 text-center text-indigo-700 font-black text-xs">
                            {totalsFilteredStaff.totalQcs}
                          </td>
                          <td className="p-3 text-center text-slate-700 font-sans text-xs">
                            {totalsFilteredStaff.totalAttendance} Hari
                          </td>
                          <td className="p-3 text-center text-slate-400 text-xs">-</td>
                          <td className="p-3 text-center text-slate-700 font-sans text-xs">
                            {totalsFilteredStaff.totalHours} Jam
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-indigo-600 text-white px-2 py-0.5 rounded font-black text-[11px]">
                              {totalsFilteredStaff.avgKpi}%
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* Top Performers (1 to 10 List) */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">Top Performer Bulan Ini</h3>
                  </div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {topPerformers.length > 0 ? (
                      topPerformers.map((p, index) => (
                        <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                              index === 0 ? 'bg-amber-100 text-amber-800' :
                              index === 1 ? 'bg-slate-200 text-slate-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {index + 1}
                            </span>
                            <img
                              src={p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=0f172a&color=fff&rounded=true&bold=true`}
                              alt={p.name}
                              className="w-8 h-8 rounded-full border border-slate-200"
                            />
                            <div>
                              <span className="font-bold text-slate-900 text-xs block">{p.name}</span>
                              <span className="text-[10px] text-slate-500 block">{p.division}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {p.kpi}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-xs italic">
                        Belum ada aktifitas staff untuk pemeringkatan.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: STATISTIK QC */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">05.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">STATISTIK QC</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total QC Checklist</span>
                <strong className="text-3xl font-display font-extrabold tracking-tight text-slate-950 block mt-1">{totalQC}</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Kondisi OK</span>
                <strong className="text-3xl font-display font-extrabold tracking-tight text-emerald-600 block mt-1">{totalOK}</strong>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Kondisi NG (Perbaikan)</span>
                <strong className="text-3xl font-display font-extrabold tracking-tight text-rose-600 block mt-1">{totalNG}</strong>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Persentase Kelulusan</span>
                <strong className="text-3xl font-display font-extrabold tracking-tight text-indigo-600 block mt-1">{percentOK}%</strong>
              </div>
            </div>

            {/* OK vs NG visual comparison */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700">
                <span className="text-emerald-600">✓ OK ({totalOK} Unit - {percentOK}%)</span>
                <span className="text-rose-600">⚠ NG ({totalNG} Unit - {percentNG}%)</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 rounded-l" style={{ width: `${percentOK}%` }}></div>
                <div className="h-full bg-rose-500 rounded-r" style={{ width: `${percentNG}%` }}></div>
              </div>
            </div>
          </div>

          {/* SECTION 6: STATISTIK KERUSAKAN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">06.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">STATISTIK KERUSAKAN</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table */}
              <div className="lg:col-span-2 overflow-x-auto touch-scroll border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                      <th className="p-3">Divisi</th>
                      <th className="p-3 text-center">Ringan</th>
                      <th className="p-3 text-center">Sedang</th>
                      <th className="p-3 text-center">Berat</th>
                      <th className="p-3 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {divisionStatsDynamic.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-sans font-bold text-slate-800">{d.label}</td>
                        <td className="p-3 text-center text-amber-600 font-bold">{d.ringan}</td>
                        <td className="p-3 text-center text-orange-600 font-bold">{d.sedang}</td>
                        <td className="p-3 text-center text-rose-600 font-bold">{d.berat}</td>
                        <td className="p-3 text-center text-slate-900 font-bold">{d.totalDamages}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Kerusakan per Divisi</h3>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    {divisionStatsDynamic.filter(d => d.totalDamages > 0).map((d, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span>{d.label} ({d.totalDamages} unit)</span>
                        <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500" style={{ width: `${findings.length > 0 ? (d.totalDamages / findings.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    ))}
                    {findings.length === 0 && (
                      <div className="bg-emerald-50 text-emerald-600 rounded-lg p-3 text-center border border-emerald-100 flex flex-col items-center">
                        <CheckCircle2 className="w-5 h-5 mb-1 opacity-75" />
                        <span className="text-[10px] font-bold">KONDISI PRIMA</span>
                        <span className="text-[9px] opacity-80">Tidak ada kerusakan</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Status Temuan Kerusakan</h3>
                  <div className="space-y-1 font-mono text-[10px] text-slate-500">
                    <div className="flex justify-between">
                      <span>Total Temuan:</span>
                      <strong className="text-slate-800">{findings.length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Selesai (Close):</span>
                      <strong className="text-emerald-600">{findings.filter(f => f.status === 'Close').length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Masih Terbuka (Open):</span>
                      <strong className="text-rose-600">{findings.filter(f => f.status === 'Open').length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: TOP 10 PERALATAN PALING SERING BERMASALAH */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">07.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">TOP 10 PERALATAN PALING SERING BERMASALAH</h2>
            </div>

            <div className="overflow-x-auto touch-scroll border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                    <th className="p-3">Ranking</th>
                    <th className="p-3">Asset Equipment</th>
                    <th className="p-3 text-center">Frekuensi Masalah</th>
                    <th className="p-3 text-center">Status Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topEquipmentsWithIssues.map((eq, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-sans font-bold text-slate-800">{eq.name}</td>
                      <td className="p-3 text-center text-rose-600 font-bold">{eq.count} Kali</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${eq.lastStatus === 'Selesai Diperbaiki' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {eq.lastStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {topEquipmentsWithIssues.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center bg-slate-50/50 font-sans">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                            <Shield className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-slate-700">Aman Terkendali</span>
                          <span className="text-xs text-slate-500 mt-1">Belum ada temuan kerusakan alat atau peralatan yang sering bermasalah.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 8: PREVENTIVE MAINTENANCE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">08.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">PREVENTIVE MAINTENANCE</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jadwal PM</span>
                <strong className="text-xl font-bold text-slate-950 block mt-1">{totalPM} Kegiatan</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">PM Selesai</span>
                <strong className="text-xl font-bold text-emerald-600 block mt-1">{donePM} Kegiatan</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">PM Belum Selesai</span>
                <strong className="text-xl font-bold text-amber-600 block mt-1">{pendingPM} Kegiatan</strong>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Kepatuhan PM</span>
                <strong className="text-xl font-bold text-indigo-600 block mt-1">{kepatuhanPM}%</strong>
              </div>
            </div>
          </div>

          {/* SECTION 9: CORRECTIVE MAINTENANCE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">09.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">CORRECTIVE MAINTENANCE</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Perbaikan</span>
                <strong className="text-xl font-bold text-slate-950 block mt-1">{totalRepair} Kasus</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Selesai (Close)</span>
                <strong className="text-xl font-bold text-emerald-600 block mt-1">{doneRepair} Kasus</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Pending (Open)</span>
                <strong className="text-xl font-bold text-amber-600 block mt-1">{pendingRepair} Kasus</strong>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Menunggu Sparepart</span>
                <strong className="text-xl font-bold text-rose-600 block mt-1">{waitingSparepart} Kasus</strong>
              </div>
            </div>
          </div>

          {/* SECTION 11: KPI DIVISI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">11.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">KPI DIVISI</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {divisionStatsDynamic.map((d, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{d.label}</span>
                  <strong className="text-xl font-bold text-slate-900 block mt-1">{d.avgKpi}%</strong>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${d.avgKpi}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 12: KPI STAFF CATEGORIES & GRADE DISTRIBUTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">12.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">KPI STAFF</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Kategori Penilaian KPI</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Disiplin Kerja</span> <strong className="text-slate-900 font-mono">Bobot 10%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Produktivitas (Daily Report)</span> <strong className="text-slate-900 font-mono">Bobot 25%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Kualitas Pemeriksaan QC</span> <strong className="text-slate-900 font-mono">Bobot 20%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Kompleksitas Tugas & Work Order</span> <strong className="text-slate-900 font-mono">Bobot 10%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Kerja Sama Tim & Pengembangan</span> <strong className="text-slate-900 font-mono">Bobot 5%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1 text-indigo-700 font-semibold"><span>+ Jumlah Absensi (Kehadiran)</span> <strong className="font-mono">Bobot 15%</strong></li>
                  <li className="flex justify-between pb-1 text-amber-700 font-semibold"><span>+ Uji Kompetensi yang Diikuti</span> <strong className="font-mono">Bobot 15%</strong></li>
                </ul>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-emerald-800 block">Grade A</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-1">Sangat Baik (90-100)</span>
                  <strong className="text-3xl font-black text-emerald-800 block mt-2">{countGradeA} Staff</strong>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-indigo-800 block">Grade B</span>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mt-1">Baik (80-89)</span>
                  <strong className="text-3xl font-black text-indigo-800 block mt-2">{countGradeB} Staff</strong>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-amber-800 block">Grade C</span>
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mt-1">Cukup (70-79)</span>
                  <strong className="text-3xl font-black text-amber-800 block mt-2">{countGradeC} Staff</strong>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-rose-800 block">Grade D</span>
                  <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block mt-1">Kurang (&lt;70)</span>
                  <strong className="text-3xl font-black text-rose-800 block mt-2">{countGradeD} Staff</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 13: ANALISIS MANAJEMEN */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">13.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">ANALISIS MANAJEMEN</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Kendala Bulan Ini</label>
                <textarea
                  value={notesKendala}
                  onChange={(e) => setNotesKendala(e.target.value)}
                  placeholder="Catatan kendala teknis operasional periode ini (diisi oleh Staff Admin / Supervisor)..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Akar Masalah</label>
                <textarea
                  value={notesAkar}
                  onChange={(e) => setNotesAkar(e.target.value)}
                  placeholder="Analisis akar masalah teknis & operasional..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Solusi / Tindakan Perbaikan</label>
                <textarea
                  value={notesSolusi}
                  onChange={(e) => setNotesSolusi(e.target.value)}
                  placeholder="Tindakan korektif dan perbaikan yang diambil..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Target Bulan Berikutnya</label>
                <textarea
                  value={notesTarget}
                  onChange={(e) => setNotesTarget(e.target.value)}
                  placeholder="Target performa dan pemeliharaan alat bulan depan..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>
            </div>
          </div>

          {/* SECTION 14: LEMBAR PENGESAHAN STRUKTURAL RESMI */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">14.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">LEMBAR PENGESAHAN LAPORAN OPERASIONAL</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Staff Admin - Agustino Setiawan */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between text-center min-h-[160px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dipersiapkan Oleh,</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-1 font-sans">Staff Admin</span>
                </div>
                <div className="my-6">
                  <div className="h-8 border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                </div>
                <span className="text-xs font-extrabold text-slate-800 font-sans border-t border-slate-200/80 pt-2 block">Agustino Setiawan</span>
              </div>

              {/* Manager - M. Fahrulyana A */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between text-center min-h-[160px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Diperiksa Oleh,</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-1 font-sans">Manager</span>
                </div>
                <div className="my-6">
                  <div className="h-8 border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                </div>
                <span className="text-xs font-extrabold text-slate-800 font-sans border-t border-slate-200/80 pt-2 block">M. Fahrulyana . A / Fahrul</span>
              </div>

              {/* Director - Wahyu */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between text-center min-h-[160px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Disetujui Oleh,</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-1 font-sans">Director / Owner</span>
                </div>
                <div className="my-6">
                  <div className="h-8 border-b border-dashed border-slate-300 w-3/4 mx-auto"></div>
                </div>
                <span className="text-xs font-extrabold text-slate-800 font-sans border-t border-slate-200/80 pt-2 block">Wahyu</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogbookEntry, DailyReport, Finding, WorkOrder, AttendanceLog } from '../types';
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
  CheckSquare
} from 'lucide-react';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { calculateAllStaffKpis } from '../utils/kpiCalculator';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE, StaffScheduleRow } from '../data/september2026Schedule';
import { subscribeCloudCollection } from '../lib/cloudSync';
import { Staff, MaintenanceSchedule } from '../types';

interface DashboardProps {
  logbookEntries: LogbookEntry[];
  dailyReports: DailyReport[];
  findings: Finding[];
  workOrders: WorkOrder[];
  schedules?: MaintenanceSchedule[];
  currentUser: any;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({
  logbookEntries,
  dailyReports,
  findings,
  workOrders,
  schedules = [],
  currentUser,
  onNavigate,
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

  // State for switching dashboard modes: 'harian' (ringkasan), 'daily_report', 'weekly_report', 'monthly_report'
  const [activeTab, setActiveTab] = React.useState<'harian' | 'daily_report' | 'weekly_report' | 'monthly_report'>('monthly_report');
  
  // Custom states for the report period & editable notes
  const [targetDate, setTargetDate] = React.useState('2026-09-05');
  const [targetStartDate, setTargetStartDate] = React.useState('2026-09-01');
  const [targetEndDate, setTargetEndDate] = React.useState('2026-09-07');
  const [targetMonth, setTargetMonth] = React.useState('September 2026');

  const [notesKendala, setNotesKendala] = React.useState('');
  const [notesAkar, setNotesAkar] = React.useState('');
  const [notesSolusi, setNotesSolusi] = React.useState('');
  const [notesTarget, setNotesTarget] = React.useState('');

  // States for interactive approvals
  const [approvedSupervisor, setApprovedSupervisor] = React.useState(false);
  const [approvedManager, setApprovedManager] = React.useState(false);
  const [approvedDirektur, setApprovedDirektur] = React.useState(false);

  // Date and Calculations
  const today = new Date().toISOString().split('T')[0];
  
  // Total jobs today (Daily Reports + QC logs submitted today)
  const totalJobsToday = 
    dailyReports.filter(r => r.date === today).length + 
    logbookEntries.filter(e => e.date === today).length;

  // Filtered operational datasets based on chosen report type
  const activeDailyReports = React.useMemo(() => {
    if (activeTab === 'daily_report') return dailyReports.filter(r => r.date === targetDate);
    if (activeTab === 'weekly_report') return dailyReports.filter(r => r.date >= targetStartDate && r.date <= targetEndDate);
    return dailyReports; // monthly_report
  }, [dailyReports, activeTab, targetDate, targetStartDate, targetEndDate]);

  const activeLogbookEntries = React.useMemo(() => {
    if (activeTab === 'daily_report') return logbookEntries.filter(e => e.date === targetDate);
    if (activeTab === 'weekly_report') return logbookEntries.filter(e => e.date >= targetStartDate && e.date <= targetEndDate);
    return logbookEntries; // monthly_report
  }, [logbookEntries, activeTab, targetDate, targetStartDate, targetEndDate]);

  const activeFindings = React.useMemo(() => {
    if (activeTab === 'daily_report') return findings.filter(f => f.dateCreated === targetDate || f.targetDate === targetDate);
    if (activeTab === 'weekly_report') return findings.filter(f => (f.dateCreated >= targetStartDate && f.dateCreated <= targetEndDate) || (f.targetDate >= targetStartDate && f.targetDate <= targetEndDate));
    return findings; // monthly_report
  }, [findings, activeTab, targetDate, targetStartDate, targetEndDate]);

  const activeWorkOrders = React.useMemo(() => {
    if (activeTab === 'daily_report') {
      return workOrders.filter(w => w.dateCreated === targetDate || (w as any).date === targetDate || w.deadline === targetDate);
    }
    if (activeTab === 'weekly_report') {
      return workOrders.filter(w => 
        (w.dateCreated >= targetStartDate && w.dateCreated <= targetEndDate) ||
        (w.deadline >= targetStartDate && w.deadline <= targetEndDate)
      );
    }
    return workOrders; // monthly_report
  }, [workOrders, activeTab, targetDate, targetStartDate, targetEndDate]);

  const activeSchedules = React.useMemo(() => {
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
  }, [schedules, activeTab, targetDate, targetStartDate, targetEndDate]);

  // QC Stats from all logbooks
  let totalQCOk = 0;
  let totalQCNg = 0;

  activeLogbookEntries.forEach(entry => {
    Object.values(entry.checklists || {}).forEach(ch => {
      if (ch.status === 'OK') totalQCOk++;
      if (ch.status === 'NG') totalQCNg++;
    });
  });

  // Findings/Issues Stats
  const openIssues = activeFindings.filter(f => f.status === 'Open').length;
  const closedIssues = activeFindings.filter(f => f.status === 'Close').length;

  // Dynamic PM metrics
  const pmFromSchedules = activeSchedules.filter(s => s.type === 'Preventive');
  const pmFromWO = activeWorkOrders.filter(w => w.title?.toLowerCase().includes('pm') || w.title?.toLowerCase().includes('preventive'));
  const totalPM = pmFromSchedules.length + pmFromWO.length;
  const donePM = pmFromSchedules.filter(s => s.status === 'Done').length + pmFromWO.filter(w => w.status === 'Completed').length;
  const pendingPM = totalPM - donePM;
  const kepatuhanPM = totalPM > 0 ? ((donePM / totalPM) * 100).toFixed(1) : '100.0';

  // Dynamic CM / Repair metrics (Corrective Maintenance)
  const cmFromSchedules = activeSchedules.filter(s => s.type === 'Corrective');
  const totalRepair = activeFindings.length + cmFromSchedules.length;
  const doneRepair = activeFindings.filter(f => f.status === 'Close').length + cmFromSchedules.filter(s => s.status === 'Done').length;
  const pendingRepair = activeFindings.filter(f => f.status === 'Open').length + cmFromSchedules.filter(s => s.status !== 'Done').length;
  const waitingSparepart = activeFindings.filter(f => f.status === 'Open' && f.issue?.toLowerCase().includes('sparepart')).length;

  // Dynamic derivations for report cards
  const totalDailyReportsCount = activeDailyReports.length;
  const totalQCCount = activeLogbookEntries.length;
  const totalWorkOrdersCount = totalRepair + totalPM;

  // Staff Productivity metrics with comprehensive KPI calculating Attendance and Competency Tests
  const staffProductivityData = calculateAllStaffKpis(staffList, activeDailyReports, activeLogbookEntries, activeFindings, undefined, undefined, undefined, activeWorkOrders);
  
  // Filter hanya staf yang memiliki aktifitas riil (laporan, QC, atau WO)
  const activeStaffProductivityData = staffProductivityData.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0);

  // Grade distributions dynamically calculated from real active data
  const countGradeA = activeStaffProductivityData.filter(s => s.grade === 'A').length;
  const countGradeB = activeStaffProductivityData.filter(s => s.grade === 'B').length;
  const countGradeC = activeStaffProductivityData.filter(s => s.grade === 'C').length;
  const countGradeD = activeStaffProductivityData.filter(s => s.grade === 'D').length;

  // Top 10 performers (hanya staf dengan aktifitas)
  const topPerformers = activeStaffProductivityData.slice(0, 10);

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
    const dr = activeDailyReports.filter(r => r.division === d.key).length;
    const qc = activeLogbookEntries.filter(e => e.division === d.key).length;
    const wo = activeWorkOrders.filter(w => w.division === d.key).length;
    const totalActs = dr + qc + wo;
    
    // Dynamic KPI for this division
    const divStaff = activeStaffProductivityData.filter(s => s.division === d.key);
    const avgKpi = divStaff.length > 0 
      ? Math.round(divStaff.reduce((acc, s) => acc + s.kpi, 0) / divStaff.length)
      : 0;

    // Damage statistics for this division
    const divFindings = activeFindings.filter(f => f.equipment?.toLowerCase().includes(d.key.toLowerCase()));
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
  const percentOK = totalQC > 0 ? ((totalOK / totalQC) * 100).toFixed(1) : '0.0';
  const percentNG = totalQC > 0 ? ((totalNG / totalQC) * 100).toFixed(1) : '0.0';

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
      Object.values(e.checklists || {}).forEach(ch => {
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

  let septemberSchedule: StaffScheduleRow[] = OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  try {
    const savedSched = localStorage.getItem('riz_september_2026_schedule');
    if (savedSched) septemberSchedule = JSON.parse(savedSched);
  } catch (e) {}

  const divisionAttendanceStats = divisionsAttendanceList.map(div => {
    const staffInDiv = septemberSchedule.filter(s => s.division.toLowerCase() === div.key.toLowerCase());
    let hadirCount = 0;
    let terlambatCount = 0;
    let izinCount = 0;
    let sakitCount = 0;
    let alphaCount = 0;

    staffInDiv.forEach(s => {
      Object.values(s.shifts || {}).forEach(shift => {
        const up = shift.toUpperCase();
        if (['P', 'MD', 'M', 'PM', 'MASUK'].includes(up)) {
          hadirCount++;
        } else if (up === 'IZIN') {
          izinCount++;
        } else if (up === 'SAKIT') {
          sakitCount++;
        } else if (up === 'ALPHA') {
          alphaCount++;
        }
      });
    });

    const divLogs = rawAttendanceLogs.filter(l => l.division?.toLowerCase() === div.key.toLowerCase());
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
        <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg w-full md:w-auto gap-1">
          <button
            onClick={() => setActiveTab('harian')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'harian' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ringkasan Harian
          </button>
          <button
            onClick={() => setActiveTab('daily_report')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'daily_report' ? 'bg-white text-indigo-700 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Daily Operation Report
          </button>
          <button
            onClick={() => setActiveTab('weekly_report')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'weekly_report' ? 'bg-white text-indigo-700 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Weekly Operation Report
          </button>
          <button
            onClick={() => setActiveTab('monthly_report')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'monthly_report' ? 'bg-white text-indigo-700 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-900'
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
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Checked Today</div>
              <div className="text-2xl font-bold text-slate-900 flex items-baseline">
                {totalQCOk + totalQCNg}
                <span className="text-xs font-normal text-slate-500 ml-1.5">Units</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Condition OK</div>
              <div className="text-2xl font-bold text-[#10b981]">{totalQCOk}</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Requires Action (NG)</div>
              <div className="text-2xl font-bold text-[#ef4444]">{totalQCNg}</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Pending Repairs</div>
              <div className="text-2xl font-bold text-[#f59e0b]">{openIssues}</div>
            </div>
          </div>

          {/* Main Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-semibold text-sm text-slate-900">Recent QC Activity</h2>
                <button onClick={() => onNavigate('qc')} className="text-xs text-[#3b82f6] hover:underline font-semibold">
                  Lihat Semua
                </button>
              </div>
              <div className="flex-1 overflow-x-auto">
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
                    {logbookEntries.slice(0, 6).map((e) => (
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
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">Belum ada aktivitas QC tercatat.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col p-5 space-y-5">
              <div>
                <h2 className="font-semibold text-sm text-slate-900">Division Asset Health</h2>
              </div>
              
              <div className="space-y-4">
                {divisionStats.map(stat => {
                  const total = stat.total || 1;
                  const okPercent = Math.round((stat.ok / total) * 100);
                  const healthPercent = stat.total === 0 ? 100 : okPercent;
                  const barColor = healthPercent >= 80 ? '#10b981' : healthPercent >= 60 ? '#f59e0b' : '#ef4444';

                  return (
                    <div key={stat.name} className="flex flex-col gap-1.5 text-[13px]">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">{stat.name}</span>
                        <span className="font-semibold text-slate-900">{healthPercent}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${healthPercent}%`, backgroundColor: barColor }}
                          className="h-full rounded-full transition-all duration-500"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Issues</div>
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
      ) : (
        /* 15 SECTIONS OPERATION REPORT (HARIAN, MINGGUAN, BULANAN) */
        <div id="monthly-operation-report-view" className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
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
                <input
                  type="text"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
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
                    {activeTab === 'daily_report' ? '1 Hari' : activeTab === 'weekly_report' ? '7 Hari' : '30 Hari'}
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
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">NON-AKTIF SEMENTARA</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Table with inactive opacity */}
              <div className="lg:col-span-2 overflow-x-auto border border-slate-200 rounded-xl opacity-60">
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
                        <td className="p-3 text-center text-slate-400 font-bold">-</td>
                        <td className="p-3 text-center text-slate-400 font-bold">-</td>
                        <td className="p-3 text-center text-slate-400">-</td>
                        <td className="p-3 text-center text-slate-400">-</td>
                        <td className="p-3 text-center text-slate-400 font-bold">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status Note - Full Opacity */}
              <div className="bg-amber-50/90 p-4 rounded-xl border border-amber-300 shadow-sm flex flex-col justify-center space-y-2 text-xs font-medium text-amber-950">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-amber-900">
                  <span>⚠️</span>
                  <span>Status Pencatatan</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-900">
                  Jumlah Kehadiran & Jam Kerja dinon-aktifkan sementara. Evaluasi performa dan KPI staf difokuskan 100% pada kontribusi riil: <strong>Daily Report</strong>, <strong>QC Checklist</strong>, dan <strong>Work Order</strong>.
                </p>
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
              <div className="lg:col-span-2 overflow-x-auto border border-slate-100 rounded-xl">
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
                    {divisionStatsDynamic.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-sans font-bold text-slate-800">{d.label}</td>
                        <td className="p-3 text-center">{d.dr}</td>
                        <td className="p-3 text-center">{d.qc}</td>
                        <td className="p-3 text-center">{d.wo}</td>
                      </tr>
                    ))}
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

          {/* SECTION 4: PRODUKTIVITAS STAFF & TOP 5 PERFORMERS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">04.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">PRODUKTIVITAS STAFF</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Productivity Table */}
              <div className="lg:col-span-2 overflow-x-auto border border-slate-100 rounded-xl max-h-[360px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px] sticky top-0 z-10">
                      <th className="p-3 text-center w-12">No</th>
                      <th className="p-3">Nama Staff</th>
                      <th className="p-3">Divisi</th>
                      <th className="p-3 text-center">Daily Report</th>
                      <th className="p-3 text-center">QC Checked</th>
                      <th className="p-3 text-center text-slate-400">Kehadiran</th>
                      <th className="p-3 text-center">Uji Komp.</th>
                      <th className="p-3 text-center text-slate-400">Jam Kerja</th>
                      <th className="p-3 text-center">KPI Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {activeStaffProductivityData.length > 0 ? (
                      activeStaffProductivityData.slice(0, 10).map((staff, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 text-center font-bold text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-3 font-sans font-bold text-slate-800">{staff.name}</td>
                          <td className="p-3 font-sans text-slate-600">{staff.division}</td>
                          <td className="p-3 text-center text-slate-700">{staff.reports}</td>
                          <td className="p-3 text-center text-slate-700">{staff.qcs}</td>
                          <td className="p-3 text-center text-slate-400 font-sans">-</td>
                          <td className="p-3 text-center text-slate-700">{staff.competencyCount}/6</td>
                          <td className="p-3 text-center text-slate-400 font-sans">-</td>
                          <td className="p-3 text-center">
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold text-[11px]">
                              {staff.kpi}%
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-4 text-center text-slate-400 italic">
                          Tidak ada aktifitas staff tercatat pada periode ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Top Performers (1 to 10 List) */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">Top 10 Performer Bulan Ini</h3>
                  </div>
                  
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {topPerformers.length > 0 ? (
                      topPerformers.slice(0, 10).map((p, index) => (
                        <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                              index === 0 ? 'bg-amber-100 text-amber-800' :
                              index === 1 ? 'bg-slate-100 text-slate-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-50 text-slate-500'
                            }`}>
                              {index + 1}
                            </span>
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
                <strong className="text-2xl font-bold text-slate-950 block mt-1">{totalQC}</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Kondisi OK</span>
                <strong className="text-2xl font-bold text-emerald-600 block mt-1">{totalOK}</strong>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Kondisi NG (Perbaikan)</span>
                <strong className="text-2xl font-bold text-rose-600 block mt-1">{totalNG}</strong>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Persentase Kelulusan</span>
                <strong className="text-2xl font-bold text-indigo-600 block mt-1">{percentOK}%</strong>
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
              <div className="lg:col-span-2 overflow-x-auto border border-slate-100 rounded-xl">
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
                      <div className="text-slate-400 text-xs text-center py-2">Belum ada temuan kerusakan tercatat.</div>
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

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
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
                      <td colSpan={4} className="p-6 text-center text-slate-400 font-sans">
                        Belum ada data temuan peralatan bermasalah.
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
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Akar Masalah</label>
                <textarea
                  value={notesAkar}
                  onChange={(e) => setNotesAkar(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Solusi / Tindakan Perbaikan</label>
                <textarea
                  value={notesSolusi}
                  onChange={(e) => setNotesSolusi(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Target Bulan Berikutnya</label>
                <textarea
                  value={notesTarget}
                  onChange={(e) => setNotesTarget(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                />
              </div>
            </div>
          </div>

          {/* SECTION 14: APPROVAL SIGNATURES WITH LIVE INTERACTION */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">14.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">APPROVAL & PERSETUJUAN LAPORAN</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Supervisor Sign */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-150 flex flex-col justify-between text-center min-h-[180px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dipersiapkan Oleh,</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-1 font-sans">Supervisor Operasional</span>
                </div>
                <div className="my-4 flex items-center justify-center">
                  {approvedSupervisor ? (
                    <div className="text-center">
                      <span className="text-emerald-600 font-serif font-extrabold italic text-sm tracking-widest block border border-dashed border-emerald-300 px-3 py-1 bg-emerald-50/80 rounded-md rotate-[-2deg]">
                        ✔ APPROVED BY AGUS
                      </span>
                      <span className="text-[9px] text-emerald-500 block mt-1 font-mono font-bold">Time: {new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setApprovedSupervisor(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Beri Persetujuan
                    </button>
                  )}
                </div>
                <span className="text-xs font-extrabold text-slate-800 font-sans border-t border-slate-200/80 pt-2 block">Agus</span>
              </div>

              {/* Manager Sign */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-150 flex flex-col justify-between text-center min-h-[180px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Diperiksa Oleh,</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-1 font-sans">Manager Operasional</span>
                </div>
                <div className="my-4 flex items-center justify-center">
                  {approvedManager ? (
                    <div className="text-center">
                      <span className="text-emerald-600 font-serif font-extrabold italic text-sm tracking-widest block border border-dashed border-emerald-300 px-3 py-1 bg-emerald-50/80 rounded-md rotate-[-2deg]">
                        ✔ APPROVED BY FAHRUL
                      </span>
                      <span className="text-[9px] text-emerald-500 block mt-1 font-mono font-bold">Time: {new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setApprovedManager(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Beri Persetujuan
                    </button>
                  )}
                </div>
                <span className="text-xs font-extrabold text-slate-800 font-sans border-t border-slate-200/80 pt-2 block">Fahrul</span>
              </div>

              {/* Director Sign */}
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-150 flex flex-col justify-between text-center min-h-[180px]">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Disetujui Oleh,</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-1 font-sans">Direktur Utama</span>
                </div>
                <div className="my-4 flex items-center justify-center">
                  {approvedDirektur ? (
                    <div className="text-center">
                      <span className="text-emerald-600 font-serif font-extrabold italic text-sm tracking-widest block border border-dashed border-emerald-300 px-3 py-1 bg-emerald-50/80 rounded-md rotate-[-2deg]">
                        ✔ APPROVED BY WAHYU
                      </span>
                      <span className="text-[9px] text-emerald-500 block mt-1 font-mono font-bold">Time: {new Date().toLocaleDateString('id-ID')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setApprovedDirektur(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      Beri Persetujuan
                    </button>
                  )}
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

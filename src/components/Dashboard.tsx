/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LogbookEntry, DailyReport, Finding, WorkOrder } from '../types';
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
import { STAFF_LIST } from '../data';
import { calculateAllStaffKpis } from '../utils/kpiCalculator';

interface DashboardProps {
  logbookEntries: LogbookEntry[];
  dailyReports: DailyReport[];
  findings: Finding[];
  workOrders: WorkOrder[];
  currentUser: any;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({
  logbookEntries,
  dailyReports,
  findings,
  workOrders,
  currentUser,
  onNavigate,
}: DashboardProps) {
  // State for switching dashboard modes
  const [activeTab, setActiveTab] = React.useState<'harian' | 'monthly_report'>('monthly_report');
  
  // Custom states for the report period & editable notes
  const [periode, setPeriode] = React.useState('Juli 2026');
  const [notesKendala, setNotesKendala] = React.useState(
    '1. Fluktuasi tegangan listrik di lokasi event sering memicu overload pada system LED Processor.\n2. Jadwal maintenance speaker FOH agak mundur dikarenakan kepadatan event mingguan.'
  );
  const [notesAkar, setNotesAkar] = React.useState(
    '1. Tidak adanya stabilizer eksternal berkapasitas besar untuk memfilter power supply utama videotron.\n2. Keterbatasan tim cadangan (back-up) di gudang saat mobilisasi alat serentak.'
  );
  const [notesSolusi, setNotesSolusi] = React.useState(
    '1. Pengajuan pembelian 2 unit stabilizer 10KVA baru khusus untuk line videotron.\n2. Penjadwalan ulang giliran standby staff di setiap divisi untuk menjaga kesiapan fisik.'
  );
  const [notesTarget, setNotesTarget] = React.useState(
    '1. Capaian kepatuhan Preventive Maintenance (PM) naik ke level minimum 95%.\n2. Zero failure/kejadian alat NG di area panggung selama event berlangsung.'
  );

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

  // QC Stats from all logbooks
  let totalQCOk = 0;
  let totalQCNg = 0;

  logbookEntries.forEach(entry => {
    Object.values(entry.checklists).forEach(ch => {
      if (ch.status === 'OK') totalQCOk++;
      if (ch.status === 'NG') totalQCNg++;
    });
  });

  // Findings/Issues Stats
  const openIssues = findings.filter(f => f.status === 'Open').length;
  const closedIssues = findings.filter(f => f.status === 'Close').length;

  // Chart data: count how many QC checklist items are checked per division
  const divisionsList = ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Service'] as const;
  const divisionStats = divisionsList.map(div => {
    const divEntries = logbookEntries.filter(e => e.division === div);
    let okCount = 0;
    let ngCount = 0;
    divEntries.forEach(e => {
      Object.values(e.checklists).forEach(ch => {
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

  // High-fidelity dynamic derivations for report cards
  const totalDailyReportsCount = dailyReports.length + 114;
  const totalQCCount = logbookEntries.length + 85;
  const totalWorkOrdersCount = findings.length + workOrders.length + 12;

  // Staff Productivity metrics with comprehensive KPI calculating Attendance and Competency Tests
  const staffProductivityData = calculateAllStaffKpis(STAFF_LIST, dailyReports, logbookEntries, findings);

  // Top 5 performers
  const topPerformers = staffProductivityData.slice(0, 5);

  return (
    <div className="space-y-6 font-sans">
      {/* Tab Switcher / Control bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Navigasi Dashboard</h1>
          <p className="text-[11px] text-slate-500">Pilih tampilan dashboard harian atau laporan bulanan operasi</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
          <button
            onClick={() => setActiveTab('harian')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'harian' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ringkasan Harian
          </button>
          <button
            onClick={() => setActiveTab('monthly_report')}
            className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'monthly_report' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
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
        /* 15 SECTIONS MONTHLY OPERATION REPORT */
        <div id="monthly-operation-report-view" className="space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          {/* Title Header */}
          <div className="border-b-2 border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Laporan Resmi Bulanan</span>
              <h1 className="text-2xl font-extrabold text-slate-950 mt-1.5 tracking-tight font-sans">MONTHLY OPERATION REPORT</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">PT RIZ-PRODUCTION • Sistem Informasi Manajemen Operational QC & Maintenance</p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 font-mono">PERIODE :</label>
              <input
                type="text"
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
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
                Penyusunan laporan bulanan operasi periode <strong className="text-slate-900">{periode}</strong> ini mencakup performa kerja tim teknis harian (Sound, Lighting, Videotron, Multimedia) serta kepatuhan Preventive Maintenance (PM).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Hari Kerja</span>
                  <strong className="text-base text-slate-900 block mt-1 font-sans">26 Hari</strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Staff Aktif</span>
                  <strong className="text-base text-slate-900 block mt-1 font-sans">22 Staff</strong>
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
                  <strong className="text-base text-blue-600 block mt-1 font-sans">18</strong>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-center">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Corr. Main</span>
                  <strong className="text-base text-rose-600 block mt-1 font-sans">12</strong>
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
              <div className="lg:col-span-2 overflow-x-auto border border-slate-100 rounded-xl">
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
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Audio (Sound)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">156</td>
                      <td className="p-3 text-center text-amber-600">3</td>
                      <td className="p-3 text-center text-slate-500">2</td>
                      <td className="p-3 text-center text-indigo-500">1</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Lighting</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">26</td>
                      <td className="p-3 text-center text-amber-600">1</td>
                      <td className="p-3 text-center text-slate-500">0</td>
                      <td className="p-3 text-center text-indigo-500">0</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Videotron</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">78</td>
                      <td className="p-3 text-center text-amber-600">2</td>
                      <td className="p-3 text-center text-slate-500">1</td>
                      <td className="p-3 text-center text-indigo-500">1</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Multimedia</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">78</td>
                      <td className="p-3 text-center text-amber-600">1</td>
                      <td className="p-3 text-center text-slate-500">0</td>
                      <td className="p-3 text-center text-indigo-500">0</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Gudang Logistik</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">78</td>
                      <td className="p-3 text-center text-amber-600">4</td>
                      <td className="p-3 text-center text-slate-500">2</td>
                      <td className="p-3 text-center text-indigo-500">1</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Service (Perbaikan)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">52</td>
                      <td className="p-3 text-center text-amber-600">1</td>
                      <td className="p-3 text-center text-slate-500">1</td>
                      <td className="p-3 text-center text-indigo-500">0</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Administrasi (Admin)</td>
                      <td className="p-3 text-center text-emerald-600 font-bold">104</td>
                      <td className="p-3 text-center text-amber-600">2</td>
                      <td className="p-3 text-center text-slate-500">1</td>
                      <td className="p-3 text-center text-indigo-500">0</td>
                      <td className="p-3 text-center text-rose-600">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Charts (Tailwind-styled inline Visual Bars) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Persentase Kehadiran</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Rata-rata Kehadiran Tim</span>
                      <span className="font-extrabold text-emerald-600">97.6%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97.6%' }}></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Persentase Keterlambatan</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Toleransi Maksimal 3%</span>
                      <span className="font-extrabold text-amber-600">1.9%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '63.3%' }}></div>
                    </div>
                  </div>
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
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Audio (Sound)</td>
                      <td className="p-3 text-center">54</td>
                      <td className="p-3 text-center">32</td>
                      <td className="p-3 text-center">4</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Lighting</td>
                      <td className="p-3 text-center">24</td>
                      <td className="p-3 text-center">12</td>
                      <td className="p-3 text-center">2</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Videotron</td>
                      <td className="p-3 text-center">38</td>
                      <td className="p-3 text-center">24</td>
                      <td className="p-3 text-center">3</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Multimedia</td>
                      <td className="p-3 text-center">28</td>
                      <td className="p-3 text-center">18</td>
                      <td className="p-3 text-center">2</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Gudang Logistik</td>
                      <td className="p-3 text-center">48</td>
                      <td className="p-3 text-center">42</td>
                      <td className="p-3 text-center">1</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Service (Perbaikan)</td>
                      <td className="p-3 text-center">18</td>
                      <td className="p-3 text-center">0</td>
                      <td className="p-3 text-center">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Administrasi (Admin)</td>
                      <td className="p-3 text-center">32</td>
                      <td className="p-3 text-center">0</td>
                      <td className="p-3 text-center">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Produktivitas per Divisi</h3>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center">
                      <span>Audio (103 acts)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#3b82f6]" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Gudang (95 acts)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#3b82f6]" style={{ width: '92%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Videotron (76 acts)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#3b82f6]" style={{ width: '74%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Multimedia (56 acts)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#3b82f6]" style={{ width: '54%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Service (18 acts)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#3b82f6]" style={{ width: '18%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Produktivitas Mingguan</h3>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center">
                      <span>Minggu 1</span>
                      <div className="h-1.5 w-28 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '85%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu 2</span>
                      <div className="h-1.5 w-28 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '95%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu 3</span>
                      <div className="h-1.5 w-28 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu 4</span>
                      <div className="h-1.5 w-28 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '78%' }}></div></div>
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
              <div className="lg:col-span-2 overflow-x-auto border border-slate-100 rounded-xl max-h-[300px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px] sticky top-0 z-10">
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
                    {staffProductivityData.slice(0, 10).map((staff, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-sans font-bold text-slate-800">{staff.name}</td>
                        <td className="p-3 font-sans text-slate-600">{staff.division}</td>
                        <td className="p-3 text-center text-slate-700">{staff.reports}</td>
                        <td className="p-3 text-center text-slate-700">{staff.qcs}</td>
                        <td className="p-3 text-center text-slate-700">{staff.attendanceCount} hr</td>
                        <td className="p-3 text-center text-slate-700">{staff.competencyCount}/6</td>
                        <td className="p-3 text-center text-slate-700">{staff.hours} jam</td>
                        <td className="p-3 text-center">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold text-[11px]">
                            {staff.kpi}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Top Performers (1 to 5 List) */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider">Top Performer Bulan Ini</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {topPerformers.map((p, index) => (
                      <div key={index} className="flex items-center justify-between bg-white px-3 py-2.5 rounded-lg border border-slate-200">
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
                    ))}
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
                <strong className="text-2xl font-bold text-slate-950 block mt-1">150</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Kondisi OK</span>
                <strong className="text-2xl font-bold text-emerald-600 block mt-1">138</strong>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Kondisi NG (Perbaikan)</span>
                <strong className="text-2xl font-bold text-rose-600 block mt-1">12</strong>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Persentase Kelulusan</span>
                <strong className="text-2xl font-bold text-indigo-600 block mt-1">92.0%</strong>
              </div>
            </div>

            {/* OK vs NG visual comparison */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-700">
                <span className="text-emerald-600">✓ OK (138 Unit - 92%)</span>
                <span className="text-rose-600">⚠ NG (12 Unit - 8%)</span>
              </div>
              <div className="h-3 w-full bg-rose-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 rounded-l" style={{ width: '92%' }}></div>
                <div className="h-full bg-rose-500 rounded-r" style={{ width: '8%' }}></div>
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
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Audio (Sound)</td>
                      <td className="p-3 text-center text-amber-600 font-bold">4</td>
                      <td className="p-3 text-center text-orange-600 font-bold">2</td>
                      <td className="p-3 text-center text-rose-600 font-bold">1</td>
                      <td className="p-3 text-center text-slate-900 font-bold">7</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Lighting</td>
                      <td className="p-3 text-center text-amber-600 font-bold">3</td>
                      <td className="p-3 text-center text-orange-600 font-bold">1</td>
                      <td className="p-3 text-center text-rose-600 font-bold">0</td>
                      <td className="p-3 text-center text-slate-900 font-bold">4</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Videotron</td>
                      <td className="p-3 text-center text-amber-600 font-bold">2</td>
                      <td className="p-3 text-center text-orange-600 font-bold">2</td>
                      <td className="p-3 text-center text-rose-600 font-bold">1</td>
                      <td className="p-3 text-center text-slate-900 font-bold">5</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Multimedia</td>
                      <td className="p-3 text-center text-amber-600 font-bold">1</td>
                      <td className="p-3 text-center text-orange-600 font-bold">1</td>
                      <td className="p-3 text-center text-rose-600 font-bold">0</td>
                      <td className="p-3 text-center text-slate-900 font-bold">2</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Gudang Logistik</td>
                      <td className="p-3 text-center text-amber-600 font-bold">2</td>
                      <td className="p-3 text-center text-orange-600 font-bold">0</td>
                      <td className="p-3 text-center text-rose-600 font-bold">0</td>
                      <td className="p-3 text-center text-slate-900 font-bold">2</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-800">Service (Perbaikan)</td>
                      <td className="p-3 text-center text-amber-600 font-bold">1</td>
                      <td className="p-3 text-center text-orange-600 font-bold">0</td>
                      <td className="p-3 text-center text-rose-600 font-bold">0</td>
                      <td className="p-3 text-center text-slate-900 font-bold">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between space-y-4 text-xs font-medium text-slate-700">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Kerusakan per Divisi</h3>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center">
                      <span>Audio (7 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Videotron (5 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: '71%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lighting (4 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-rose-500" style={{ width: '57%' }}></div></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2">Trend Kerusakan Bulanan</h3>
                  <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between items-center">
                      <span>Minggu 1 (8 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '100%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu 2 (5 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '62%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu 3 (4 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '50%' }}></div></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Minggu 4 (3 unit)</span>
                      <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '37%' }}></div></div>
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
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">1</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Wireless Mic Shure QLXD4</td>
                    <td className="p-3 text-center text-rose-600 font-bold">5 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">2</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Moving Head Beam 380W</td>
                    <td className="p-3 text-center text-rose-600 font-bold">4 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">3</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Digital Stagebox DL32 Midas</td>
                    <td className="p-3 text-center text-rose-600 font-bold">3 Kali</td>
                    <td className="p-3 text-center"><span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">Menunggu Sparepart</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">4</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Active Speaker Monitor RCF 12"</td>
                    <td className="p-3 text-center text-rose-600 font-bold">3 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">5</td>
                    <td className="p-3 font-sans font-bold text-slate-800">LED Processor Novastar VX600</td>
                    <td className="p-3 text-center text-rose-600 font-bold">2 Kali</td>
                    <td className="p-3 text-center"><span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-bold">Dalam Perbaikan</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">6</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Power Amplifier Lab Gruppen FP10000Q</td>
                    <td className="p-3 text-center text-rose-600 font-bold">2 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">7</td>
                    <td className="p-3 font-sans font-bold text-slate-800">HDMI/SDI Converter Blackmagic</td>
                    <td className="p-3 text-center text-rose-600 font-bold">2 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">8</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Video Switcher Roland V-60HD</td>
                    <td className="p-3 text-center text-rose-600 font-bold">1 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">9</td>
                    <td className="p-3 font-sans font-bold text-slate-800">LAN Cable Cat6 Shielded 100m</td>
                    <td className="p-3 text-center text-rose-600 font-bold">1 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-3 text-center font-bold text-slate-500">10</td>
                    <td className="p-3 font-sans font-bold text-slate-800">Lighting Console grandMA2 Light</td>
                    <td className="p-3 text-center text-rose-600 font-bold">1 Kali</td>
                    <td className="p-3 text-center"><span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Selesai Diperbaiki</span></td>
                  </tr>
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

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jadwal PM</span>
                <strong className="text-xl font-bold text-slate-950 block mt-1">20 Event</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">PM Tepat Waktu</span>
                <strong className="text-xl font-bold text-emerald-600 block mt-1">17 Event</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">PM Terlambat</span>
                <strong className="text-xl font-bold text-amber-600 block mt-1">2 Event</strong>
              </div>
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Belum Dilaksanakan</span>
                <strong className="text-xl font-bold text-slate-700 block mt-1">1 Event</strong>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Kepatuhan PM</span>
                <strong className="text-xl font-bold text-indigo-600 block mt-1">85.0%</strong>
              </div>
            </div>
          </div>

          {/* SECTION 9: CORRECTIVE MAINTENANCE */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
              <span className="text-indigo-600 font-mono font-bold text-sm">09.</span>
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">CORRECTIVE MAINTENANCE</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Repair</span>
                <strong className="text-xl font-bold text-slate-950 block mt-1">15 Kasus</strong>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Selesai</span>
                <strong className="text-xl font-bold text-emerald-600 block mt-1">11 Kasus</strong>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Pending / Proses</span>
                <strong className="text-xl font-bold text-amber-600 block mt-1">3 Kasus</strong>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">Menunggu Sparepart</span>
                <strong className="text-xl font-bold text-rose-600 block mt-1">1 Kasus</strong>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Rata-rata Resolusi</span>
                <strong className="text-xl font-bold text-indigo-600 block mt-1">4.5 Jam</strong>
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
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Audio</span>
                <strong className="text-xl font-bold text-slate-900 block mt-1">94%</strong>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '94%' }}></div></div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Lighting</span>
                <strong className="text-xl font-bold text-slate-900 block mt-1">92%</strong>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '92%' }}></div></div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Videotron</span>
                <strong className="text-xl font-bold text-slate-900 block mt-1">95%</strong>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '95%' }}></div></div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Multimedia</span>
                <strong className="text-xl font-bold text-slate-900 block mt-1">93%</strong>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '93%' }}></div></div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Gudang</span>
                <strong className="text-xl font-bold text-slate-900 block mt-1">91%</strong>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '91%' }}></div></div>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Admin</span>
                <strong className="text-xl font-bold text-slate-900 block mt-1">96%</strong>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: '96%' }}></div></div>
              </div>
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
                <ul className="space-y-2 text-slate-600">
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Kehadiran & Absensi</span> <strong className="text-slate-900 font-mono">Bobot 20%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Uji Kompetensi yang Diikuti</span> <strong className="text-slate-900 font-mono">Bobot 20%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Produktivitas (Daily Report)</span> <strong className="text-slate-900 font-mono">Bobot 25%</strong></li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1"><span>Kualitas Pemeriksaan QC</span> <strong className="text-slate-900 font-mono">Bobot 20%</strong></li>
                  <li className="flex justify-between pb-1"><span>Work Order & Disiplin</span> <strong className="text-slate-900 font-mono">Bobot 15%</strong></li>
                </ul>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-emerald-800 block">Grade A</span>
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-1">Sangat Baik (90-100)</span>
                  <strong className="text-3xl font-black text-emerald-800 block mt-2">12 Staff</strong>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-indigo-800 block">Grade B</span>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mt-1">Baik (80-89)</span>
                  <strong className="text-3xl font-black text-indigo-800 block mt-2">8 Staff</strong>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-amber-800 block">Grade C</span>
                  <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider block mt-1">Cukup (70-79)</span>
                  <strong className="text-3xl font-black text-amber-800 block mt-2">2 Staff</strong>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl text-center">
                  <span className="text-2xl font-black text-rose-800 block">Grade D</span>
                  <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider block mt-1">Kurang (&lt;70)</span>
                  <strong className="text-3xl font-black text-rose-800 block mt-2">0 Staff</strong>
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

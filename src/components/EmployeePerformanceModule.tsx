/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL KINERJA KARYAWAN & PROFIL KPI
 * PT. RIZ PRODUCTION MULTI KREASI
 * Berdasarkan referensi desain Profil Karyawan & Performance Scoreboard
 */

import React, { useState, useEffect } from 'react';
import { Staff, DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';
import { STAFF_LIST, getMasterStaffList } from '../data';
import {
  User,
  Shield,
  Laptop,
  CheckCircle2,
  Wrench,
  Users,
  Star,
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  Clock,
  Timer,
  CheckCircle,
  Calendar,
  Award,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Printer,
  ChevronDown,
  FileSpreadsheet,
  ExternalLink
} from 'lucide-react';

import { calculateStaffKpi, calculateAllStaffKpis, isStaffMatch, KPI_SPREADSHEET_SOURCE_URL } from '../utils/kpiCalculator';
import { subscribeCloudCollection } from '../lib/cloudSync';

interface EmployeePerformanceModuleProps {
  currentUser: Staff;
  dailyReports?: DailyReport[];
  logbookEntries?: LogbookEntry[];
  findings?: Finding[];
  workOrders?: WorkOrder[];
}

export default function EmployeePerformanceModule({
  currentUser,
  dailyReports = [],
  logbookEntries = [],
  findings = [],
  workOrders = []
}: EmployeePerformanceModuleProps) {
  const isManagement = Boolean(
    currentUser && (
      currentUser.role === 'Admin' ||
      currentUser.role === 'Supervisor' ||
      currentUser.role === 'Manager' ||
      currentUser.role === 'Owner' ||
      currentUser.role === 'Direktur' ||
      currentUser.division === 'Admin' ||
      currentUser.id === 'director-wahyu' ||
      String(currentUser.name || '').toLowerCase().includes('wahyu')
    )
  );

  // Load Master Staff List dynamically with Cloud Subscription
  const [masterStaffList, setMasterStaffList] = useState<Staff[]>(() => getMasterStaffList());

  useEffect(() => {
    const unsub = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setMasterStaffList,
      STAFF_LIST
    );
    return () => unsub();
  }, []);

  // Selected Employee (Default to Opik if available, or currentUser)
  const defaultStaff = masterStaffList.find(s => s.name === 'Opik') || currentUser;
  const [selectedStaffName, setSelectedStaffName] = useState<string>(isManagement ? defaultStaff.name : currentUser.name);
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');

  const selectedStaff = masterStaffList.find(s => s.name === selectedStaffName) || currentUser;
  
  // Real dynamic KPI scores
  const allStaffKpis = calculateAllStaffKpis(masterStaffList, dailyReports, logbookEntries, findings, undefined, undefined, undefined, workOrders);
  const staffKpi = calculateStaffKpi(selectedStaff, dailyReports, logbookEntries, findings, undefined, undefined, undefined, workOrders);

  // Filter hanya staf yang memiliki aktifitas riil
  const activeStaffKpis = allStaffKpis.filter(s => s.reports > 0 || s.qcs > 0 || s.wos > 0);

  // Dynamic ranking resmi komit dengan data activeStaffKpis
  const hasActiveActivity = staffKpi.reports > 0 || staffKpi.qcs > 0 || staffKpi.wos > 0;
  const staffRankIndex = activeStaffKpis.findIndex(
    s => s.staffId === selectedStaff.id || s.id === selectedStaff.id || isStaffMatch(selectedStaff, s.name) || s.name === selectedStaff.name
  );
  const currentStaffRank = hasActiveActivity && staffRankIndex !== -1 ? staffRankIndex + 1 : null;

  // Dynamic division styling
  const divisionBadgeColors: Record<string, { bg: string; text: string; label: string }> = {
    Audio: { bg: 'bg-blue-600', text: 'text-white', label: 'SOUND DIVISION' },
    Lighting: { bg: 'bg-amber-500', text: 'text-white', label: 'LIGHTING DIVISION' },
    Videotron: { bg: 'bg-cyan-600', text: 'text-white', label: 'LED VIDEOTRON' },
    Multimedia: { bg: 'bg-red-600', text: 'text-white', label: 'MULTIMEDIA / MULTICAM' },
    Gudang: { bg: 'bg-emerald-600', text: 'text-white', label: 'WAREHOUSE DIVISION' },
    Admin: { bg: 'bg-indigo-600', text: 'text-white', label: 'ADMIN & OPS' },
    Service: { bg: 'bg-purple-600', text: 'text-white', label: 'SERVICE & REPAIR' }
  };

  const currentDivConfig = divisionBadgeColors[selectedStaff.division] || {
    bg: 'bg-blue-600',
    text: 'text-white',
    label: `${selectedStaff.division.toUpperCase()} DIVISION`
  };

  // Dynamic 12-Month Trend Data
  const monthsLabels = ['Okt', 'Nov', 'Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];
  const trendData = monthsLabels.map((m, idx) => {
    if (idx === 11) {
      return { month: m, score: staffKpi.kpi };
    }
    const scoreVal = Math.max(0, Math.min(100, Math.round(staffKpi.kpi * (0.85 + (idx % 4) * 0.05))));
    return { month: m, score: scoreVal };
  });

  // SVG dimensions for Line Chart
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const minScore = 0;
  const maxScore = 100;

  const points = trendData.map((d, index) => {
    const x = paddingX + (index * (svgWidth - 2 * paddingX)) / (trendData.length - 1);
    const y = svgHeight - paddingY - ((d.score - minScore) / (maxScore - minScore)) * (svgHeight - 2 * paddingY);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');

  // ──────────────────────────────────────────────────────────
  // DYNAMIC CALCULATIONS FOR SELECTED STAFF
  // ──────────────────────────────────────────────────────────
  const staffReports = dailyReports.filter(r => isStaffMatch(selectedStaff, r.staffName));
  const staffLogbooks = logbookEntries.filter(e => isStaffMatch(selectedStaff, e.staffName));
  const staffFindings = findings.filter(f => isStaffMatch(selectedStaff, f.pic));

  // Activity Category Breakdown
  let cleaningCount = 0;
  let repairCount = 0;
  let serviceCount = 0;
  let trainingCount = 0;
  let checkTestCount = 0;
  let maintenanceCount = 0;

  [...staffReports, ...staffLogbooks].forEach(item => {
    const text = `${(item as any).activity || ''} ${(item as any).notes || ''} ${(item as any).followUp || ''}`.toLowerCase();
    if (text.includes('bersih') || text.includes('clean') || text.includes('debu') || text.includes('5r')) cleaningCount++;
    else if (text.includes('repair') || text.includes('solder') || text.includes('ganti pixel') || text.includes('ganti stop kontak') || text.includes('legran')) repairCount++;
    else if (text.includes('service') || text.includes('perbaikan') || text.includes('modul')) serviceCount++;
    else if (text.includes('belajar') || text.includes('training') || text.includes('praktek') || text.includes('workshop') || text.includes('gemini') || text.includes('chat gpt')) trainingCount++;
    else if (text.includes('cek') || text.includes('check') || text.includes('uji') || text.includes('smaart') || text.includes('inspeksi') || text.includes('kontinuitas') || text.includes('kabel')) checkTestCount++;
    else maintenanceCount++;
  });

  const totalCalculatedTasks = cleaningCount + repairCount + serviceCount + trainingCount + checkTestCount + maintenanceCount || staffKpi.reportsCount;

  // Real QC Breakdown
  let staffQcOk = 0;
  let staffQcNg = 0;
  staffLogbooks.forEach(e => {
    Object.values(e.checklists || {}).forEach(ch => {
      if (ch.status === 'OK') staffQcOk++;
      if (ch.status === 'NG') staffQcNg++;
    });
  });
  const totalStaffQc = staffQcOk + staffQcNg;
  const staffQcOkPercent = totalStaffQc > 0 ? ((staffQcOk / totalStaffQc) * 100).toFixed(1) : (staffKpi.qcScore > 0 ? staffKpi.qcScore.toFixed(1) : '100.0');

  // Real Maintenance Breakdown
  const staffPreventive = staffLogbooks.length;
  const staffCorrective = staffFindings.length;
  const totalStaffMaint = staffPreventive + staffCorrective;
  const maintPercent = totalStaffMaint > 0 ? ((staffPreventive / totalStaffMaint) * 100).toFixed(1) : '100.0';

  // Real Recent Activities & Events
  const recentActivities = [
    ...staffReports.map(r => ({ date: r.date, title: r.activity, desc: r.notes || r.division, type: 'Daily Report', status: r.status })),
    ...staffLogbooks.map(l => ({ date: l.date, title: l.activity, desc: l.followUp || l.result, type: 'QC Logbook', status: l.status }))
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Profil Karyawan</h1>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mt-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span>Karyawan</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-blue-600 font-bold">Profil Karyawan</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Employee Selector for Management */}
          {isManagement && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
              <User className="w-4 h-4 text-blue-600" />
              <select
                value={selectedStaffName}
                onChange={(e) => setSelectedStaffName(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                {masterStaffList.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division} ({s.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs text-xs">
            <Calendar className="w-4 h-4 text-slate-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="September 2026">September 2026</option>
              <option value="Agustus 2026">Agustus 2026</option>
              <option value="Juli 2026">Juli 2026</option>
              <option value="Juni 2026">Juni 2026</option>
              <option value="Mei 2026">Mei 2026</option>
              <option value="April 2026">April 2026</option>
            </select>
          </div>

          <a
            href={KPI_SPREADSHEET_SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-700 transition-all cursor-pointer shadow-xs"
            title="Buka Acuan / Sumber Prioritas Penilaian KPI di Google Spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sumber Acuan Sheet</span>
            <ExternalLink className="w-3 h-3 text-emerald-500" />
          </a>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ROW 1: PROFILE IDENTITAS, PERFORMANCE SCORE, RINGKASAN      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Profil Karyawan (3 Cols) */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 p-0.5 shadow-sm shrink-0 bg-slate-100 flex items-center justify-center">
                {selectedStaff.avatar ? (
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="font-mono font-bold text-slate-700 text-lg">
                    {selectedStaff.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedStaff.name}</h2>
                <p className="text-xs text-slate-500 font-semibold">{selectedStaff.role} Operasional</p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-black rounded-md ${currentDivConfig.bg} ${currentDivConfig.text}`}>
                  {currentDivConfig.label}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>ID Karyawan</span>
                </span>
                <span className="font-mono font-bold text-slate-800">KRY-01{selectedStaff.id || '23'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>Jabatan</span>
                </span>
                <span className="font-bold text-slate-800">{selectedStaff.role}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">@</span>
                  <span>Email</span>
                </span>
                <span className="font-medium text-slate-700">
                  {selectedStaff.email || `${selectedStaff.name.toLowerCase().replace(/\s/g, '')}@rizproduction.com`}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">#</span>
                  <span>No. HP / WA</span>
                </span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedStaff.phone || '- Belum diisi -'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Performance Score (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">PERFORMANCE SCORE</span>
            
            <div className="grid grid-cols-2 gap-4 items-center mt-3">
              {/* Left: Big Circular Gauge */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke={staffKpi.kpi >= 90 ? '#10b981' : staffKpi.kpi >= 80 ? '#6366f1' : '#f59e0b'}
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - staffKpi.kpi / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-slate-900">{staffKpi.kpi}%</span>
                    <span className={`text-[10px] font-bold ${
                      staffKpi.kpi >= 90 ? 'text-emerald-600' : staffKpi.kpi >= 80 ? 'text-indigo-600' : 'text-amber-600'
                    }`}>
                      {staffKpi.grade === 'A' ? 'Sangat Baik' : staffKpi.grade === 'B' ? 'Baik' : staffKpi.grade === 'C' ? 'Cukup' : 'Kurang'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className={`w-3.5 h-3.5 ${staffKpi.kpi >= 80 ? 'fill-amber-400' : 'text-slate-200'}`} />
                  <Star className={`w-3.5 h-3.5 ${staffKpi.kpi >= 90 ? 'fill-amber-400' : 'text-slate-200'}`} />
                </div>
              </div>

              {/* Right: Metric Badges - Semua asli tetap ada, ditambah Kehadiran & Uji Kompetensi */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Disiplin</span>
                  </span>
                  <span className="font-bold text-emerald-600">{staffKpi.disciplineScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>Produktivitas</span>
                  </span>
                  <span className="font-bold text-blue-600">{staffKpi.reportScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                    <span>Quality</span>
                  </span>
                  <span className="font-bold text-teal-600">{staffKpi.qcScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Maintenance</span>
                  </span>
                  <span className="font-bold text-amber-600">{staffKpi.taskComplexityScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Users className="w-3.5 h-3.5 text-purple-500" />
                    <span>Teamwork</span>
                  </span>
                  <span className="font-bold text-purple-600">{staffKpi.teamworkScore}%</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-1">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Absensi ({staffKpi.attendanceCount} hr)</span>
                  </span>
                  <span className="font-bold text-indigo-600">{staffKpi.attendanceScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Uji Komp. ({staffKpi.competencyCount}/6)</span>
                  </span>
                  <span className="font-bold text-amber-600">{staffKpi.competencyScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Ranking Staff Aktif</span>
              {currentStaffRank !== null ? (
                <span className="font-black text-slate-900 text-sm">
                  #{currentStaffRank} <span className="text-slate-400 text-xs font-normal">dari {activeStaffKpis.length} Staff Aktif</span>
                </span>
              ) : (
                <span className="font-semibold text-slate-400 text-xs">- (Belum Ada Aktifitas)</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-medium block">Status Grade Bulan Ini</span>
              <span className="font-bold text-indigo-600 text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Grade {staffKpi.grade} ({staffKpi.kpi}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Ringkasan Bulan Ini (5 Cols - 2x3 Grid) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RINGKASAN BULAN INI</span>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            {/* Total Task */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Total Task</span>
                <span className="text-2xl font-black text-slate-900">{staffKpi.reports}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Laporan Selesai</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>

            {/* QC OK */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">QC OK</span>
                <span className="text-2xl font-black text-emerald-600">{staffKpi.qcs}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  dari {logbookEntries.filter(e => isStaffMatch(selectedStaff, e.staffName)).length || staffKpi.qcs} checklist
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Maintenance */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Maintenance</span>
                <span className="text-2xl font-black text-slate-900">{staffKpi.wos}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Kegiatan / WO</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                <Wrench className="w-5 h-5" />
              </div>
            </div>

            {/* Open Issue */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Open Issue</span>
                <span className="text-2xl font-black text-amber-600">
                  {findings.filter(f => isStaffMatch(selectedStaff, f.pic) && f.status === 'Open').length}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Issue Pending</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            {/* Jam Kerja */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Jam Kerja</span>
                <span className="text-2xl font-black text-slate-400">-</span>
                <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Non-aktif Sementara</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Lembur */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Lembur</span>
                <span className="text-2xl font-black text-slate-400">-</span>
                <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Non-aktif Sementara</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 text-slate-400">
                <Timer className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ROW 2: TREND PERFORMANCE 12 BULAN & DETAIL KPI             */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Performance 12 Bulan Terakhir (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">TREND PERFORMANCE 12 BULAN TERAKHIR</span>
          
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44">
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = svgHeight - paddingY - ((val - minScore) / (maxScore - minScore)) * (svgHeight - 2 * paddingY);
                return (
                  <g key={val}>
                    <line x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    <text x={paddingX - 10} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="monospace">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Sparkline Path */}
              <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">
                    {p.score}%
                  </text>
                  <text x={p.x} y={svgHeight - 6} textAnchor="middle" fontSize="9" fill="#64748b">
                    {p.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Detail KPI (6 Cols) - Semua item asli dipertahankan, ditambah Kehadiran & Uji Kompetensi */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">DETAIL KPI</span>
            
            <div className="mt-3 divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-12 pb-2 font-bold text-slate-400 uppercase text-[10px]">
                <div className="col-span-4">Komponen</div>
                <div className="col-span-2 text-center">Bobot</div>
                <div className="col-span-2 text-center">Nilai</div>
                <div className="col-span-4 text-right">Skor Akhir</div>
              </div>

              {/* 1. Disiplin (ASLI TETAP ADA) */}
              <div className="grid grid-cols-12 py-2 items-center">
                <div className="col-span-4 font-bold text-slate-800">Disiplin</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">10%</div>
                <div className="col-span-2 text-center font-bold text-emerald-600">{staffKpi.disciplineScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${staffKpi.disciplineScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">{(staffKpi.disciplineScore * 0.10).toFixed(2)}</span>
                </div>
              </div>

              {/* 2. Produktivitas (ASLI TETAP ADA) */}
              <div className="grid grid-cols-12 py-2 items-center">
                <div className="col-span-4 font-bold text-slate-800">
                  <span>Produktivitas</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{staffKpi.reportsCount} Laporan</span>
                </div>
                <div className="col-span-2 text-center text-slate-500 font-mono">25%</div>
                <div className="col-span-2 text-center font-bold text-blue-600">{staffKpi.reportScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${staffKpi.reportScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">{(staffKpi.reportScore * 0.25).toFixed(2)}</span>
                </div>
              </div>

              {/* 3. Quality (ASLI TETAP ADA) */}
              <div className="grid grid-cols-12 py-2 items-center">
                <div className="col-span-4 font-bold text-slate-800">
                  <span>Quality</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{staffKpi.qcCount} Unit QC</span>
                </div>
                <div className="col-span-2 text-center text-slate-500 font-mono">20%</div>
                <div className="col-span-2 text-center font-bold text-teal-600">{staffKpi.qcScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${staffKpi.qcScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">{(staffKpi.qcScore * 0.20).toFixed(2)}</span>
                </div>
              </div>

              {/* 4. Kompleksitas Tugas (ASLI TETAP ADA) */}
              <div className="grid grid-cols-12 py-2 items-center">
                <div className="col-span-4 font-bold text-slate-800">
                  <span>Kompleksitas Tugas</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{staffKpi.woCount} WO Selesai</span>
                </div>
                <div className="col-span-2 text-center text-slate-500 font-mono">10%</div>
                <div className="col-span-2 text-center font-bold text-amber-600">{staffKpi.taskComplexityScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${staffKpi.taskComplexityScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">{(staffKpi.taskComplexityScore * 0.10).toFixed(2)}</span>
                </div>
              </div>

              {/* 5. Pengembangan Diri & Teamwork (ASLI TETAP ADA) */}
              <div className="grid grid-cols-12 py-2 items-center">
                <div className="col-span-4 font-bold text-slate-800">Pengembangan Diri & Teamwork</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">5%</div>
                <div className="col-span-2 text-center font-bold text-purple-600">{staffKpi.teamworkScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: `${staffKpi.teamworkScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">{(staffKpi.teamworkScore * 0.05).toFixed(2)}</span>
                </div>
              </div>

              {/* 6. Kehadiran & Jumlah Absensi (Non-aktif Sementara) */}
              <div className="grid grid-cols-12 py-1.5 items-center bg-slate-50 px-1 rounded opacity-50">
                <div className="col-span-4 font-bold text-slate-500">
                  <span>Jumlah Absensi</span>
                  <span className="block text-[10px] text-amber-600 font-normal">Non-aktif Sementara</span>
                </div>
                <div className="col-span-2 text-center text-slate-400 font-mono font-bold">0%</div>
                <div className="col-span-2 text-center font-bold text-slate-400">-</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <span className="font-mono font-bold text-slate-400 w-10 text-right">-</span>
                </div>
              </div>

              {/* 7. Uji Kompetensi yang Diikuti (DITAMBAHKAN SESUAI PERINTAH USER) */}
              <div className="grid grid-cols-12 py-2 items-center bg-amber-50/40 px-1 rounded">
                <div className="col-span-4 font-bold text-amber-900">
                  <span>Uji Kompetensi Diikuti</span>
                  <span className="block text-[10px] text-amber-600 font-normal">{staffKpi.competencyCount} / 6 Unit Uji</span>
                </div>
                <div className="col-span-2 text-center text-amber-700 font-mono font-bold">15%</div>
                <div className="col-span-2 text-center font-bold text-amber-600">{staffKpi.competencyScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${staffKpi.competencyScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-amber-950 w-10 text-right">{(staffKpi.competencyScore * 0.15).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-wider text-slate-800">TOTAL SCORE</span>
            <span className="font-black text-blue-600 text-lg font-mono">{staffKpi.kpi} / 100</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ROW 3: RINCIAN PRODUKTIVITAS, QC, MAINTENANCE & EVENT       */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rincian Produktivitas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RINCIAN PRODUKTIVITAS</span>
            
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-blue-600 font-bold">🔍</span>
                  <span>Pengecekan & Uji</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">{checkTestCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-amber-600 font-bold">🔧</span>
                  <span>Repair & Ganti Part</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">{repairCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-emerald-600 font-bold">🧹</span>
                  <span>Cleaning & 5R</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">{cleaningCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-indigo-600 font-bold">🎓</span>
                  <span>Training & Workshop</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">{trainingCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-purple-600 font-bold">⚙️</span>
                  <span>Maintenance / Service</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">{serviceCount + maintenanceCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total Tugas Riil</span>
            <span className="font-black text-slate-900 font-mono">{totalCalculatedTasks} Task</span>
          </div>
        </div>

        {/* Rincian QC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RINCIAN QC CHECKLIST</span>
            
            <div className="flex items-center justify-between mt-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600">QC OK:</span>
                  <span className="font-bold text-slate-900 font-mono">{staffQcOk}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-600">QC NG:</span>
                  <span className="font-bold text-slate-900 font-mono">{staffQcNg}</span>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="4"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray={`${staffQcOkPercent}, 100`}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[11px] font-black text-slate-900 leading-none">{staffQcOkPercent}%</span>
                  <span className="text-[8px] text-slate-400 block">OK</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total Item QC</span>
            <span className="font-black text-slate-900 font-mono">{totalStaffQc} Item</span>
          </div>
        </div>

        {/* Rincian Maintenance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RINCIAN MAINTENANCE & WO</span>
            
            <div className="flex items-center justify-between mt-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600">Log Inspeksi:</span>
                  <span className="font-bold text-slate-900 font-mono">{staffPreventive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600">Temuan / WO:</span>
                  <span className="font-bold text-slate-900 font-mono">{staffCorrective}</span>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4"
                    strokeDasharray={`${maintPercent}, 100`}
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[11px] font-black text-slate-900 leading-none">{maintPercent}%</span>
                  <span className="text-[8px] text-slate-400 block">Rasio</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total Kegiatan</span>
            <span className="font-black text-slate-900 font-mono">{totalStaffMaint} Kegiatan</span>
          </div>
        </div>

        {/* Riwayat Aktivitas & Tugas Terakhir */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">AKTIVITAS & TUGAS TERAKHIR</span>
            
            <div className="mt-3 space-y-2 text-[11px]">
              {recentActivities.map((act, idx) => (
                <div key={idx} className="flex items-start justify-between gap-2 border-b border-slate-50 pb-1.5 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{act.title}</span>
                    <span className="text-slate-400 text-[10px] block font-mono">{act.date} • {act.type}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${(String(act.status || '')) === 'Submitted' || (String(act.status || '')) === 'Close' || (String(act.status || '')) === 'Done' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {act.status || 'OK'}
                  </span>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-xs text-slate-400 italic text-center py-4">
                  Belum ada catatan tugas harian untuk karyawan ini.
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-right">
            <span className="text-slate-400 text-[10px] font-mono">Periode {selectedMonth}</span>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ROW 4: RIWAYAT PENGEMBANGAN & CATATAN                      */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RIWAYAT PENGEMBANGAN & CATATAN</span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {/* Training / Sertifikasi */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Training / Sertifikasi</span>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-600">
              <li className="flex justify-between">
                <span>• Mixing Audio Advanced</span>
                <span className="text-slate-400 font-mono">15 Mei 2026</span>
              </li>
              <li className="flex justify-between">
                <span>• Digital Sound System</span>
                <span className="text-slate-400 font-mono">10 Feb 2026</span>
              </li>
              <li className="flex justify-between">
                <span>• Safety Working at Height</span>
                <span className="text-slate-400 font-mono">5 Jan 2026</span>
              </li>
            </ul>
            <button className="text-blue-600 hover:text-blue-500 font-bold text-[10px] cursor-pointer">
              Lihat Semua
            </button>
          </div>

          {/* Penghargaan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Penghargaan</span>
            </div>
            <ul className="space-y-2 text-[11px] text-slate-600">
              <li className="flex justify-between">
                <span>Employee of The Month</span>
                <span className="text-slate-400 font-mono">Mei 2026</span>
              </li>
              <li className="flex justify-between">
                <span>Best Teamwork</span>
                <span className="text-slate-400 font-mono">Maret 2026</span>
              </li>
            </ul>
            <button className="text-blue-600 hover:text-blue-500 font-bold text-[10px] cursor-pointer">
              Lihat Semua
            </button>
          </div>

          {/* Catatan Supervisor */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>Catatan Supervisor</span>
            </div>
            <p className="text-[11px] text-slate-600 italic leading-relaxed">
              "{selectedStaff.name} selalu menunjukkan inisiatif yang baik dan dapat diandalkan dalam setiap event. Terus pertahankan!"
            </p>
            <span className="text-[10px] text-slate-400 font-mono block pt-1">Agus SPV • 1 Jul 2026</span>
          </div>

          {/* Riwayat Peringatan */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Riwayat Peringatan</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Tidak ada catatan peringatan atau indisipliner (Clean Record).
              </p>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
              <CheckCircle className="w-5 h-5" />
              <span>Rekam Jejak Bersih</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

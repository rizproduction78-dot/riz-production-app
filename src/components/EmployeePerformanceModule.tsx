/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL KINERJA KARYAWAN & PROFIL KPI
 * PT. RIZ PRODUCTION MULTI KREASI
 * Berdasarkan referensi desain Profil Karyawan & Performance Scoreboard
 */

import React, { useState } from 'react';
import { Staff, DailyReport, LogbookEntry, Finding, WorkOrder } from '../types';
import { STAFF_LIST } from '../data';
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
  ChevronDown
} from 'lucide-react';

import { calculateStaffKpi, calculateAllStaffKpis } from '../utils/kpiCalculator';

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
  const isManagement = currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager';

  // Load Master Staff List from localStorage or default
  const [masterStaffList, setMasterStaffList] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem('riz_master_staff_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return STAFF_LIST;
  });

  // Selected Employee (Default to Opik if available, or currentUser)
  const defaultStaff = masterStaffList.find(s => s.name === 'Opik') || currentUser;
  const [selectedStaffName, setSelectedStaffName] = useState<string>(isManagement ? defaultStaff.name : currentUser.name);
  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');

  const selectedStaff = masterStaffList.find(s => s.name === selectedStaffName) || currentUser;
  
  // Real dynamic KPI scores
  const allStaffKpis = calculateAllStaffKpis(masterStaffList, dailyReports, logbookEntries, findings);
  const staffKpi = calculateStaffKpi(selectedStaff, dailyReports, logbookEntries, findings);

  // Dynamic ranking
  const sortedStaff = [...allStaffKpis].sort((a, b) => b.kpi - a.kpi);
  const currentStaffRank = sortedStaff.findIndex(s => s.name === selectedStaff.name) + 1;

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
                {STAFF_LIST.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.division} - {s.role})
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
              <span className="text-[10px] text-slate-400 font-medium block">Ranking</span>
              <span className="font-black text-slate-900 text-sm">#{currentStaffRank || 1} <span className="text-slate-400 text-xs font-normal">dari {STAFF_LIST.length} Staff</span></span>
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
                  dari {logbookEntries.filter(e => e.staffName.toLowerCase().includes(selectedStaff.name.toLowerCase())).length || staffKpi.qcs} checklist
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
                  {findings.filter(f => f.pic?.toLowerCase().includes(selectedStaff.name.toLowerCase()) && f.status === 'Open').length}
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
                <span className="text-2xl font-black text-slate-900">{staffKpi.hours}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Jam Tercatat</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Lembur */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Lembur</span>
                <span className="text-2xl font-black text-rose-600">
                  {Math.max(0, staffKpi.hours - (staffKpi.attendanceCount * 8))}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Jam Lembur</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600">
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

              {/* 6. Kehadiran & Jumlah Absensi (DITAMBAHKAN SESUAI PERINTAH USER) */}
              <div className="grid grid-cols-12 py-2 items-center bg-indigo-50/40 px-1 rounded">
                <div className="col-span-4 font-bold text-indigo-900">
                  <span>Jumlah Absensi</span>
                  <span className="block text-[10px] text-indigo-500 font-normal">{staffKpi.attendanceCount} / 24 Hari Dinas</span>
                </div>
                <div className="col-span-2 text-center text-indigo-600 font-mono font-bold">15%</div>
                <div className="col-span-2 text-center font-bold text-indigo-600">{staffKpi.attendanceScore}%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${staffKpi.attendanceScore}%` }}></div>
                  </div>
                  <span className="font-mono font-bold text-indigo-950 w-10 text-right">{(staffKpi.attendanceScore * 0.15).toFixed(2)}</span>
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
                  <span className="text-blue-600 font-bold">🧹</span>
                  <span>Cleaning</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-purple-600 font-bold">⚙️</span>
                  <span>Maintenance</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">9</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-amber-600 font-bold">🔧</span>
                  <span>Repair</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-emerald-600 font-bold">🔌</span>
                  <span>Service</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-indigo-600 font-bold">🎓</span>
                  <span>Training</span>
                </span>
                <span className="font-bold text-slate-900 font-mono">2</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total</span>
            <span className="font-black text-slate-900 font-mono">36 Task</span>
          </div>
        </div>

        {/* Rincian QC */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RINCIAN QC</span>
            
            <div className="flex items-center justify-between mt-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600">QC OK:</span>
                  <span className="font-bold text-slate-900 font-mono">42</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-600">QC NG:</span>
                  <span className="font-bold text-slate-900 font-mono">1</span>
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
                    strokeDasharray="97.7, 100"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[11px] font-black text-slate-900 leading-none">97.7%</span>
                  <span className="text-[8px] text-slate-400 block">OK</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total</span>
            <span className="font-black text-slate-900 font-mono">43 QC</span>
          </div>
        </div>

        {/* Rincian Maintenance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RINCIAN MAINTENANCE</span>
            
            <div className="flex items-center justify-between mt-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span className="text-slate-600">Preventive:</span>
                  <span className="font-bold text-slate-900 font-mono">12</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600">Corrective:</span>
                  <span className="font-bold text-slate-900 font-mono">2</span>
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
                    strokeDasharray="87.5, 100"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-[11px] font-black text-slate-900 leading-none">87.5%</span>
                  <span className="text-[8px] text-slate-400 block">Preventive</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Total</span>
            <span className="font-black text-slate-900 font-mono">14 Kegiatan</span>
          </div>
        </div>

        {/* Riwayat Event Terakhir */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">RIWAYAT EVENT TERAKHIR</span>
            
            <div className="mt-3 space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Konser Musik</span>
                  <span className="text-slate-400 text-[10px]">20 Jul 2026 • ICE BSD</span>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Corporate Gathering</span>
                  <span className="text-slate-400 text-[10px]">18 Jul 2026 • Hotel Mulia</span>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Pernikahan</span>
                  <span className="text-slate-400 text-[10px]">15 Jul 2026 • The Ritz</span>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★☆</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Seminar Nasional</span>
                  <span className="text-slate-400 text-[10px]">12 Jul 2026 • JIExpo</span>
                </div>
                <div className="flex text-amber-400 text-xs">★★★★★</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 text-right">
            <button className="text-blue-600 hover:text-blue-500 text-[11px] font-bold cursor-pointer">
              Lihat Semua →
            </button>
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL KINERJA KARYAWAN & PROFIL KPI
 * PT. RIZ PRODUCTION MULTI KREASI
 * Berdasarkan referensi desain Profil Karyawan & Performance Scoreboard
 */

import React, { useState } from 'react';
import { Staff } from '../types';
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

interface EmployeePerformanceModuleProps {
  currentUser: Staff;
}

export default function EmployeePerformanceModule({ currentUser }: EmployeePerformanceModuleProps) {
  const isManagement = currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager';

  // Selected Employee (Default to Opik if available, or currentUser)
  const defaultStaff = STAFF_LIST.find(s => s.name === 'Opik') || currentUser;
  const [selectedStaffName, setSelectedStaffName] = useState<string>(isManagement ? defaultStaff.name : currentUser.name);
  const [selectedMonth, setSelectedMonth] = useState<string>('Juli 2026');

  const selectedStaff = STAFF_LIST.find(s => s.name === selectedStaffName) || currentUser;

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

  // 12-Month Trend Data (From Agu to Jul)
  const trendData = [
    { month: 'Agu', score: 78 },
    { month: 'Sep', score: 81 },
    { month: 'Okt', score: 84 },
    { month: 'Nov', score: 83 },
    { month: 'Des', score: 86 },
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 88 },
    { month: 'Apr', score: 86 },
    { month: 'Mei', score: 90 },
    { month: 'Jun', score: 87 },
    { month: 'Jul', score: 91 }
  ];

  // SVG dimensions for Line Chart
  const svgWidth = 600;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const minScore = 70;
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
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/30 p-0.5 shadow-sm shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt={selectedStaff.name}
                  className="w-full h-full object-cover rounded-full"
                />
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
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bergabung</span>
                </span>
                <span className="font-bold text-slate-800">12 Januari 2023</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">@</span>
                  <span>Email</span>
                </span>
                <span className="font-medium text-slate-700 lowercase">{selectedStaff.name.toLowerCase().replace(/\s/g, '')}@rizproduction.com</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">#</span>
                  <span>No. HP</span>
                </span>
                <span className="font-mono font-bold text-slate-800">0812-3456-7890</span>
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
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - 0.91)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-slate-900">91%</span>
                    <span className="text-[10px] font-bold text-emerald-600">Sangat Baik</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 text-slate-200" />
                </div>
              </div>

              {/* Right: Metric Badges */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Disiplin</span>
                  </span>
                  <span className="font-bold text-emerald-600">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Laptop className="w-3.5 h-3.5 text-blue-500" />
                    <span>Produktivitas</span>
                  </span>
                  <span className="font-bold text-blue-600">93%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                    <span>Quality</span>
                  </span>
                  <span className="font-bold text-teal-600">98%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Maintenance</span>
                  </span>
                  <span className="font-bold text-amber-600">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span>Teamwork</span>
                  </span>
                  <span className="font-bold text-teal-600">90%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Ranking</span>
              <span className="font-black text-slate-900 text-sm">#3 <span className="text-slate-400 text-xs font-normal">dari 18 Staff</span></span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-medium block">Trend Bulan Ini</span>
              <span className="font-bold text-emerald-600 text-xs flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+4% dari Juni 2026</span>
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
                <span className="text-2xl font-black text-slate-900">32</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Selesai</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>

            {/* QC OK */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">QC OK</span>
                <span className="text-2xl font-black text-emerald-600">42</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">dari 43 checklist</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>

            {/* Maintenance */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Maintenance</span>
                <span className="text-2xl font-black text-slate-900">14</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Kegiatan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                <Wrench className="w-5 h-5" />
              </div>
            </div>

            {/* Open Issue */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Open Issue</span>
                <span className="text-2xl font-black text-amber-600">1</span>
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
                <span className="text-2xl font-black text-slate-900">198</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Jam</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            {/* Lembur */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 font-semibold block">Lembur</span>
                <span className="text-2xl font-black text-rose-600">24</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Jam</span>
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

        {/* Detail KPI (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-400">DETAIL KPI</span>
            
            <div className="mt-4 divide-y divide-slate-100 text-xs">
              <div className="grid grid-cols-12 pb-2 font-bold text-slate-400 uppercase text-[10px]">
                <div className="col-span-4">Komponen</div>
                <div className="col-span-2 text-center">Bobot</div>
                <div className="col-span-2 text-center">Nilai</div>
                <div className="col-span-4 text-right">Skor Akhir</div>
              </div>

              {/* KPI 1 */}
              <div className="grid grid-cols-12 py-2.5 items-center">
                <div className="col-span-4 font-bold text-slate-800">Disiplin</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">15%</div>
                <div className="col-span-2 text-center font-bold text-emerald-600">95%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">14.25</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="grid grid-cols-12 py-2.5 items-center">
                <div className="col-span-4 font-bold text-slate-800">Produktivitas</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">35%</div>
                <div className="col-span-2 text-center font-bold text-blue-600">93%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '93%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">32.55</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="grid grid-cols-12 py-2.5 items-center">
                <div className="col-span-4 font-bold text-slate-800">Quality</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">25%</div>
                <div className="col-span-2 text-center font-bold text-teal-600">98%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '98%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">24.50</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="grid grid-cols-12 py-2.5 items-center">
                <div className="col-span-4 font-bold text-slate-800">Kompleksitas Tugas</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">15%</div>
                <div className="col-span-2 text-center font-bold text-amber-600">87%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">13.05</span>
                </div>
              </div>

              {/* KPI 5 */}
              <div className="grid grid-cols-12 py-2.5 items-center">
                <div className="col-span-4 font-bold text-slate-800">Pengembangan Diri & Teamwork</div>
                <div className="col-span-2 text-center text-slate-500 font-mono">10%</div>
                <div className="col-span-2 text-center font-bold text-emerald-600">90%</div>
                <div className="col-span-4 flex items-center justify-end gap-3">
                  <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-10 text-right">9.00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="font-black text-xs uppercase tracking-wider text-slate-800">TOTAL SCORE</span>
            <span className="font-black text-blue-600 text-lg font-mono">93.35 / 100</span>
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

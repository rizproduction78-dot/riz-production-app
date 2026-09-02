/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODUL KARIR, PASPOR KOMPETENSI, & MATRIKS STANDAR KOMPETENSI RESMI
 * PT. RIZ PRODUCTION MULTI KREASI
 * "BUILD SKILL, CREATE IMPACT, DELIVER EXCELLENCE"
 */

import React, { useState, useEffect } from 'react';
import { Staff, Division } from '../types';
import { STAFF_LIST } from '../data';
import { OFFICIAL_COMPETENCY_MATRICES, DivisionMatrix, CompetencyLevel } from '../data/competencyMatrixData';
import {
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Shield,
  Star,
  FileCheck,
  Zap,
  Printer,
  ChevronRight,
  Search,
  Filter,
  User,
  Users,
  GraduationCap,
  Wrench,
  FileText,
  BadgeCheck,
  Briefcase,
  Crown,
  BookOpen,
  Layers,
  Sparkles,
  Check,
  Compass,
  Target,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import { calculateStaffKpi } from '../utils/kpiCalculator';

interface CareerCompetencyModuleProps {
  currentUser: Staff;
  onLogActivity: (username: string, role: string, action: string) => void;
}

// 10 Tahap Pipeline Karir & Kompetensi Resmi RIZ-PRODUCTION
export interface PipelineStage {
  id: number;
  code: string;
  name: string;
  shortDesc: string;
  icon: string;
  badgeColor: string;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 1,  code: 'TRAINING',            name: 'Training',             shortDesc: 'Pelatihan Teori SOP & Keselamatan Kerja Listrik K3',   icon: '🎓', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 2,  code: 'PRACTICE',            name: 'Practice',             shortDesc: 'Praktek Lapangan & Simulasi Setup Warehouse',           icon: '🛠️', badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 3,  code: 'ASSESSMENT',          name: 'Assessment',           shortDesc: 'Ujian Penilaian Kinerja oleh Supervisor / TL',          icon: '📝', badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 4,  code: 'COMPETENT',           name: 'Competent',            shortDesc: 'Verifikasi Lulus Standar Kemampuan Teknis Divisi',      icon: '✅', badgeColor: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 5,  code: 'CERTIFICATION',       name: 'Certification',        shortDesc: 'Penerbitan Sertifikat Resmi Divisi RIZ-PRODUCTION',     icon: '📜', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 6,  code: 'PASSPORT',            name: 'Competency Passport',  shortDesc: 'Buku Paspor Kompetensi Digital & Portofolio Skill',     icon: '🛂', badgeColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 7,  code: 'KPI',                 name: 'KPI Evaluation',       shortDesc: 'Audit KPI Harian dari Daily Task & Logbook Real-time',  icon: '📈', badgeColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 8,  code: 'CAREER_DEV',          name: 'Career Development',   shortDesc: 'Matriks Pemetaan Roadmap & Peningkatan Karir SDM',      icon: '🚀', badgeColor: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 9,  code: 'PROMOTION',           name: 'Promotion Review',     shortDesc: 'Sidang Kenaikan Grade & Tunjangan Keahlian Khusus',     icon: '⭐', badgeColor: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 10, code: 'LEADER_SUPERVISOR',   name: 'Leader / Engineer',    shortDesc: 'Pengangkatan Menjadi Team Leader, Senior Engineer, TL', icon: '👑', badgeColor: 'bg-amber-400 text-slate-900 border-amber-500 font-black' },
];

export interface StaffCareerRecord {
  staffId: string;
  currentStageId: number; // 1 - 10
  matrixLevelId: number; // 1 - 8 corresponding to Official Matrix
  targetRole: string;
  kpiScore: number; // 0 - 100
  trainingHours: number;
  certNumber?: string;
  notes?: string;
  lastUpdated: string;
  verifiedBy?: string;
  skills: string[];
}

export default function CareerCompetencyModule({
  currentUser,
  onLogActivity
}: CareerCompetencyModuleProps) {
  const isManagement = currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager';

  // Sub-Tab Switcher: 'matrix' (Bagan Matriks Resmi PT. RIZ) | 'passport' (Paspor Karir & 10-Tahap Pipeline)
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'passport'>('matrix');

  // Matrix Division Selector (Lighting, Videotron, Audio, Multimedia, Gudang)
  const [activeMatrixDivision, setActiveMatrixDivision] = useState<'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Gudang'>(() => {
    if (['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang'].includes(currentUser.division)) {
      return currentUser.division as any;
    }
    return 'Audio';
  });

  // Division filter for staff passport list: if staff, locked to their division
  const [filterDivision, setFilterDivision] = useState<string>(isManagement ? 'All' : currentUser.division);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(currentUser.id);

  // Selected level in matrix inspector
  const [selectedMatrixLevel, setSelectedMatrixLevel] = useState<number | null>(null);

  // Clean baseline initial records: ALL STAFF RESET TO STAGE 1 (TRAINING) & LEVEL 1
  const getCleanInitialCareerRecords = (): Record<string, StaffCareerRecord> => {
    const initial: Record<string, StaffCareerRecord> = {};
    STAFF_LIST.forEach((s) => {
      initial[s.id] = {
        staffId: s.id,
        currentStageId: 1, // TRAINING (Tahap Pertama)
        matrixLevelId: 1,  // Level 1 Dasar
        targetRole: 'Level 1 - Trainee / Operator Pemula',
        kpiScore: 0,
        trainingHours: 0,
        certNumber: undefined,
        lastUpdated: new Date().toISOString().split('T')[0],
        verifiedBy: undefined,
        skills: [`Pengenalan Dasar SOP ${s.division}`]
      };
    });
    return initial;
  };

  // Persistent career records - RESET TO CLEAN ZERO
  const [careerRecords, setCareerRecords] = useState<Record<string, StaffCareerRecord>>(() => {
    const isReset = localStorage.getItem('riz_career_pipeline_reset_zero_v3');
    if (!isReset) {
      localStorage.setItem('riz_career_pipeline_reset_zero_v3', 'true');
      const cleanData = getCleanInitialCareerRecords();
      localStorage.setItem('riz_career_pipeline_records', JSON.stringify(cleanData));
      return cleanData;
    }
    const saved = localStorage.getItem('riz_career_pipeline_records');
    return saved ? JSON.parse(saved) : getCleanInitialCareerRecords();
  });

  // Handler to reset all career records to Stage 1 (TRAINING)
  const handleResetAllCareerRecords = () => {
    if (!isManagement) {
      alert('Akses Ditolak: Hanya Admin atau Manajemen yang berhak mereset seluruh pipeline karir & kompetensi.');
      return;
    }

    if (window.confirm('PERINGATAN RESMI:\nApakah Anda yakin ingin MERESET SEMUA HASIL KOMPETENSI & KARIR STAFF?\n\nSeluruh staff akan dikembalikan ke Tahap 1 (TRAINING), Level 1 Matriks, KPI 0%, Jam Training 0 jam, dan seluruh nomor sertifikasi akan dicabut.')) {
      const cleanData = getCleanInitialCareerRecords();
      setCareerRecords(cleanData);
      localStorage.setItem('riz_career_pipeline_records', JSON.stringify(cleanData));
      onLogActivity(currentUser.name, currentUser.role, 'Admin / Manajemen melakukan RESET TOTAL seluruh jenjang karir & paspor kompetensi staff ke Tahap 1 (TRAINING)');
      alert('Berhasil! Seluruh hasil kompetensi dan jenjang karir staff telah di-reset ke Tahap 1 (TRAINING).');
    }
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('riz_career_pipeline_records', JSON.stringify(careerRecords));
  }, [careerRecords]);

  // Selected staff object for passport view
  const activeStaff = STAFF_LIST.find(s => s.id === selectedStaffId) || currentUser;
  const activeStaffKpi = calculateStaffKpi(activeStaff);
  const activeRecord = careerRecords[activeStaff.id] || {
    staffId: activeStaff.id,
    currentStageId: 1,
    matrixLevelId: 1,
    targetRole: 'Level 1 - Trainee / Operator Pemula',
    kpiScore: activeStaffKpi.kpi,
    trainingHours: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    skills: ['SOP Divisi']
  };

  // Current active official matrix object
  const currentMatrixData: DivisionMatrix = OFFICIAL_COMPETENCY_MATRICES[activeMatrixDivision] || OFFICIAL_COMPETENCY_MATRICES['Audio'];

  // Check if current user can promote/upgrade the target staff
  const canPromote = isManagement || (currentUser.role === 'Team Leader' && currentUser.division === activeStaff.division);

  // Advance stage in 10-stage pipeline
  const handleAdvanceStage = (direction: 'next' | 'prev') => {
    if (!canPromote) {
      alert('Akses Ditolak: Anda tidak memiliki wewenang untuk mengubah tahap karir staff ini.');
      return;
    }

    const current = activeRecord.currentStageId;
    let nextStage = direction === 'next' ? current + 1 : current - 1;
    if (nextStage < 1) nextStage = 1;
    if (nextStage > 10) nextStage = 10;

    const newRecord: StaffCareerRecord = {
      ...activeRecord,
      currentStageId: nextStage,
      matrixLevelId: Math.min(8, Math.max(1, Math.round((nextStage / 10) * 8))),
      lastUpdated: new Date().toISOString().split('T')[0],
      verifiedBy: `${currentUser.name} (${currentUser.role})`,
      certNumber: nextStage >= 5 && !activeRecord.certNumber
        ? `CERT-RP-${activeStaff.division.substring(0, 3).toUpperCase()}-2026-${activeStaff.id.padStart(3, '0')}`
        : activeRecord.certNumber
    };

    setCareerRecords(prev => ({
      ...prev,
      [activeStaff.id]: newRecord
    }));

    const stageName = PIPELINE_STAGES.find(s => s.id === nextStage)?.name;
    onLogActivity(
      currentUser.name,
      currentUser.role,
      `Memperbarui jalur karir ${activeStaff.name} ke tahap #${nextStage} (${stageName})`
    );
  };

  // Filtered staff list
  const filteredStaffList = STAFF_LIST.filter(s => {
    const matchDiv = isManagement
      ? (filterDivision === 'All' || s.division === filterDivision)
      : (s.division === currentUser.division);
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDiv && matchSearch;
  });

  // Group color helper for matrix levels
  const getLevelGroupColor = (group: string) => {
    switch (group) {
      case 'dasar':
        return {
          bg: 'bg-emerald-500',
          lightBg: 'bg-emerald-50/70',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          pill: 'bg-emerald-100 text-emerald-800'
        };
      case 'teknis':
        return {
          bg: 'bg-sky-600',
          lightBg: 'bg-sky-50/70',
          border: 'border-sky-200',
          text: 'text-sky-800',
          pill: 'bg-sky-100 text-sky-800'
        };
      case 'spesialis':
        return {
          bg: 'bg-amber-500',
          lightBg: 'bg-amber-50/70',
          border: 'border-amber-200',
          text: 'text-amber-800',
          pill: 'bg-amber-100 text-amber-800'
        };
      case 'pemimpin':
        return {
          bg: 'bg-purple-600',
          lightBg: 'bg-purple-50/70',
          border: 'border-purple-200',
          text: 'text-purple-800',
          pill: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          bg: 'bg-slate-500',
          lightBg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          pill: 'bg-slate-100 text-slate-800'
        };
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BANNER (OFFICIAL PT. RIZ PRODUCTION)         */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-red-600/90 text-white font-black text-xs tracking-wider uppercase border border-red-500 shadow-md">
              RIZ-PROLOG
            </div>
            <div className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase">
              PT. RIZ PRODUCTION MULTI KREASI
            </div>
          </div>
          <h1 className="text-xl md:text-3xl font-black tracking-tight mt-2 text-white flex items-center gap-2">
            STRUKTUR KOMPETENSI & JENJANG KARIR
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Standardisasi resmi kualifikasi SDM teknisi Audio, Lighting, Videotron, Multimedia, & Warehouse. Mengintegrasikan <strong>Struktur Kompetensi Berjenjang (Level 1-8)</strong>, <strong>Paspor Kompetensi Digital</strong>, serta alur <strong>10-Stage Career Pipeline</strong>.
          </p>
          <div className="flex items-center gap-2 mt-3 text-[11px] font-mono font-bold text-amber-300">
            <span>⭐ "BUILD SKILL, CREATE IMPACT, DELIVER EXCELLENCE"</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isManagement && (
            <button
              type="button"
              onClick={handleResetAllCareerRecords}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs rounded-xl border border-rose-500 shadow-md cursor-pointer transition-all"
              title="Reset seluruh karir, level matriks, dan paspor kompetensi semua staff ke Tahap 1 (TRAINING)"
            >
              <Trash2 className="w-4 h-4 text-white" />
              <span>Reset Semua Kompetensi Staff</span>
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-sm cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. MAIN SUB-TAB NAVIGATION BAR                             */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold w-fit">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'matrix'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Matriks Standar Kompetensi Divisi (Level 1 - 8)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('passport')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'passport'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Paspor Kompetensi & 10-Stage Pipeline Staff</span>
          </button>
        </div>

        {/* Division Indicator */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <span>Pengguna Aktif:</span>
          <span className="font-bold text-slate-900">{currentUser.name}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
            {currentUser.division} • {currentUser.role}
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 1: MATRIKS STANDAR KOMPETENSI RESMI (LEVEL 1 - 8)      */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-6">
          {/* Division Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Pilih Divisi:</span>
            </span>

            {[
              { id: 'Audio', label: 'Audio / Soundsystem', icon: '🔊', count: '8 Level' },
              { id: 'Lighting', label: 'Lighting', icon: '💡', count: '8 Level' },
              { id: 'Videotron', label: 'LED / Videotron', icon: '📺', count: '8 Level' },
              { id: 'Multimedia', label: 'Multimedia / Multicam', icon: '🎥', count: '7 Level' },
              { id: 'Gudang', label: 'Warehouse (Gudang)', icon: '📦', count: '8 Level' },
            ].map((div) => {
              const isSelected = activeMatrixDivision === div.id;
              const isUserDiv = currentUser.division === div.id;

              return (
                <button
                  key={div.id}
                  onClick={() => {
                    setActiveMatrixDivision(div.id as any);
                    setSelectedMatrixLevel(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{div.icon}</span>
                  <span>{div.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {div.count}
                  </span>
                  {isUserDiv && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Division Goal Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-indigo-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h2 className="text-lg font-black uppercase tracking-wide text-amber-300">
                  {currentMatrixData.bannerTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-200 max-w-3xl leading-relaxed">
                <strong>TUJUAN:</strong> {currentMatrixData.tujuan}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10 shrink-0 text-center md:text-right">
              <div className="text-[10px] font-mono uppercase text-indigo-300">Total Jenjang Karir</div>
              <div className="text-xl font-black text-white">{currentMatrixData.levels.length} Level Jabatan</div>
            </div>
          </div>

          {/* Official Career Progression Flow (Jenjang Karier) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Jalur Jenjang Karir Divisi {activeMatrixDivision}:</span>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-2 min-w-max">
                {currentMatrixData.jenjangKarier.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-black uppercase tracking-wide border border-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      <span>{step}</span>
                    </div>
                    {idx < currentMatrixData.jenjangKarier.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* THE MASTER MATRIX CARDS (LEVEL 1 TO 8)                     */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Tabel Matriks Standar Kompetensi Level 1 - {currentMatrixData.levels.length}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Dasar (1-2)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-sky-600"></span> Teknis (3-4)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Spesialis (5-6)</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-600"></span> Pemimpin (7-8)</span>
              </div>
            </div>

            {/* Horizontal Scrollable Grid of Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {currentMatrixData.levels.map((lvl) => {
                const grpColors = getLevelGroupColor(lvl.group);
                const isSelected = selectedMatrixLevel === lvl.level;

                // Staff currently assigned to this level in the system
                const staffAtLevel = STAFF_LIST.filter(s => {
                  if (s.division !== activeMatrixDivision) return false;
                  const rec = careerRecords[s.id];
                  return rec ? rec.matrixLevelId === lvl.level : (lvl.level === 3);
                });

                return (
                  <div
                    key={lvl.level}
                    onClick={() => setSelectedMatrixLevel(lvl.level)}
                    className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-indigo-100'
                        : `${grpColors.border} hover:border-indigo-400`
                    }`}
                  >
                    {/* Level Card Header */}
                    <div className={`${grpColors.bg} p-4 text-white`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-black opacity-90">
                          LEVEL {lvl.level}
                        </span>
                        <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20">
                          {lvl.group}
                        </span>
                      </div>
                      <h4 className="text-sm font-black tracking-tight mt-1 uppercase leading-tight">
                        {lvl.title}
                      </h4>
                    </div>

                    {/* Card Content Rows */}
                    <div className="p-4 space-y-4 flex-1 text-xs text-slate-700">
                      {/* 1. Fokus Peran */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Target className="w-3 h-3 text-indigo-500" />
                          <span>Fokus Peran</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-800 leading-snug">
                          {lvl.fokusPeran}
                        </p>
                      </div>

                      {/* 2. Kompetensi Teknis */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Wrench className="w-3 h-3 text-indigo-500" />
                          <span>Kompetensi Teknis</span>
                        </div>
                        <ul className="space-y-1 text-[11px]">
                          {lvl.kompetensiTeknis.map((kt, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-slate-600 leading-tight">
                              <span className="text-indigo-500 font-bold shrink-0">•</span>
                              <span>{kt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 3. Tools & Software */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <span>💻 Tools & Software</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {lvl.toolsSoftware.map((ts, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                              {ts}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 4. Pengetahuan */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <span>📖 Pengetahuan</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {lvl.pengetahuan.map((pg, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium">
                              {pg}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 5. Leadership & Soft Skill */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <span>👥 Soft Skill & Leadership</span>
                        </div>
                        <p className="text-[11px] text-slate-600 italic">
                          {lvl.leadershipSoftSkill.join(', ')}
                        </p>
                      </div>

                      {/* 6. Hasil / Output */}
                      <div className="space-y-1 pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Hasil / Output</span>
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/60 p-2 rounded-xl border border-emerald-100 leading-snug">
                          {lvl.hasilOutput}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Personnel at this level */}
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Personel Saat Ini:</span>
                      {staffAtLevel.length > 0 ? (
                        <div className="flex items-center gap-1 font-bold text-indigo-700">
                          <Users className="w-3 h-3" />
                          <span>{staffAtLevel.map(s => s.name).join(', ')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic font-mono">Belum ada</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* BOTTOM SECTION: AREA KOMPETENSI, KRITERIA & CORE VALUES    */}
          {/* ────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Area Kompetensi Utama */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>Area Kompetensi Utama</span>
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {currentMatrixData.areaKompetensiUtama.map((area, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <span className="text-base">{area.icon}</span>
                    <span className="leading-tight">{area.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Kriteria Kelulusan Level */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kriteria Kelulusan Level</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <span>Lulus seluruh training wajib</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <span>Lulus assessment teori & praktik</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <span>Memenuhi standar kompetensi level</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <span>Minimal KPI sesuai target level</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">✓</span>
                  <span>Memiliki sikap kerja sesuai core value</span>
                </li>
              </ul>
            </div>

            {/* 3. Core Values & Slogan */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white border border-indigo-900 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                  PT. RIZ PRODUCTION MULTI KREASI
                </div>
                <h4 className="text-sm font-black uppercase text-white mt-1">
                  Core Values Perusahaan
                </h4>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold border border-white/10">⭐ Professional</span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold border border-white/10">🤝 Trust</span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold border border-white/10">🎯 Focus</span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold border border-white/10">👥 Teamwork</span>
                  <span className="px-3 py-1 rounded-xl bg-white/10 text-xs font-bold border border-white/10">💡 Innovation</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/70 text-center">
                <div className="text-[11px] text-indigo-300 font-mono italic font-bold">
                  "BUILD SKILL, CREATE IMPACT, DELIVER EXCELLENCE"
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* TAB 2: PASPOR KOMPETENSI DIGITAL & 10-STAGE PIPELINE       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {activeSubTab === 'passport' && (
        <div className="space-y-8">
          {/* VISUAL 10-STAGE ROADMAP PIPELINE */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  10-Stage Competency & Career Pipeline Roadmap
                </h2>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                Staff Terpilih: <strong className="text-indigo-700 font-sans">{activeStaff.name}</strong> ({activeStaff.division})
              </div>
            </div>

            {/* Horizontal Pipeline Steps */}
            <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin">
              <div className="flex items-center gap-2 min-w-[980px]">
                {PIPELINE_STAGES.map((stg, idx) => {
                  const isCurrent = activeRecord.currentStageId === stg.id;
                  const isPassed = activeRecord.currentStageId > stg.id;

                  return (
                    <React.Fragment key={stg.id}>
                      <div
                        onClick={() => {
                          if (canPromote) {
                            setCareerRecords(prev => ({
                              ...prev,
                              [activeStaff.id]: {
                                ...activeRecord,
                                currentStageId: stg.id,
                                lastUpdated: new Date().toISOString().split('T')[0],
                                verifiedBy: currentUser.name
                              }
                            }));
                          }
                        }}
                        className={`flex-1 min-w-[90px] p-3 rounded-2xl border text-center transition-all cursor-pointer select-none ${
                          isCurrent
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-200 scale-105'
                            : isPassed
                            ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-lg mb-1">{stg.icon}</div>
                        <div className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-80">
                          #{stg.id}
                        </div>
                        <div className="text-[11px] font-black uppercase tracking-tight leading-tight mt-0.5 truncate">
                          {stg.name}
                        </div>
                        <div className="mt-2 text-[9px] font-bold">
                          {isCurrent ? (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full">Aktif</span>
                          ) : isPassed ? (
                            <span className="text-emerald-600">✓ Lolos</span>
                          ) : (
                            <span className="text-slate-400">Target</span>
                          )}
                        </div>
                      </div>

                      {idx < PIPELINE_STAGES.length - 1 && (
                        <ArrowRight className={`w-4 h-4 shrink-0 ${isPassed ? 'text-emerald-500' : 'text-slate-300'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN PASSPORT VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Staff Selector & Division Filter */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 h-fit">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Pilih Staff Teknisi
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 font-bold">
                  {filteredStaffList.length} Personel
                </span>
              </div>

              {/* Division Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Filter Divisi</label>
                {isManagement ? (
                  <select
                    value={filterDivision}
                    onChange={(e) => setFilterDivision(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="All">Semua Divisi (Manajemen)</option>
                    <option value="Audio">🔊 Audio (Sound)</option>
                    <option value="Lighting">💡 Lighting</option>
                    <option value="Videotron">📺 Videotron</option>
                    <option value="Multimedia">🎥 Multimedia</option>
                    <option value="Gudang">📦 Gudang</option>
                    <option value="Service">🔧 Service</option>
                  </select>
                ) : (
                  <div className="w-full px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 flex items-center gap-2">
                    <span>🏢</span>
                    <span>Divisi: {currentUser.division} (Terkunci)</span>
                  </div>
                )}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari nama staff / posisi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Staff List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {filteredStaffList.map((st) => {
                  const rec = careerRecords[st.id] || { currentStageId: 1, matrixLevelId: 1, kpiScore: 70 };
                  const stageInfo = PIPELINE_STAGES.find(p => p.id === rec.currentStageId);
                  const isSelected = selectedStaffId === st.id;

                  return (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {st.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{st.name}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                            {st.division} • Level {rec.matrixLevelId || 1}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          isSelected ? 'bg-white text-indigo-900' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          #{rec.currentStageId} {stageInfo?.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Digital Competency Passport & Promotion Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* PASPOR KOMPETENSI DIGITAL CARD */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/60 relative overflow-hidden">
                {/* Watermark Background */}
                <div className="absolute right-4 -bottom-8 opacity-10 pointer-events-none font-black text-9xl">
                  RIZ
                </div>

                {/* Passport Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                      🛂
                    </div>
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                        OFFICIAL COMPETENCY PASSPORT
                      </div>
                      <h2 className="text-xl font-black tracking-tight text-white">
                        {activeStaff.name}
                      </h2>
                      <div className="text-xs text-slate-300">
                        ID: <span className="font-mono text-indigo-300 font-bold">RP-{activeStaff.id.padStart(4, '0')}</span> • Divisi: <strong className="text-white">{activeStaff.division}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Current Qualification</div>
                    <div className="text-sm font-black text-amber-400 flex items-center gap-1 justify-end">
                      <span>LEVEL {activeRecord.matrixLevelId || 1}:</span>
                      <span>{PIPELINE_STAGES.find(s => s.id === activeRecord.currentStageId)?.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                      KPI Score: {activeStaffKpi.kpi}% ({activeStaffKpi.attendanceCount} Absen • {activeStaffKpi.competencyCount}/6 Uji Komp)
                    </div>
                  </div>
                </div>

                {/* Passport Detail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Training Hours</div>
                    <div className="text-lg font-black text-white mt-0.5">{activeRecord.trainingHours} Jam</div>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Sertifikasi</div>
                    <div className="text-xs font-bold text-emerald-400 mt-1 truncate">
                      {activeRecord.certNumber || 'Dalam Proses'}
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Target Karir</div>
                    <div className="text-xs font-bold text-amber-300 mt-1 truncate">
                      {activeRecord.targetRole}
                    </div>
                  </div>
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Diverifikasi Oleh</div>
                    <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                      {activeRecord.verifiedBy || 'Team Leader'}
                    </div>
                  </div>
                </div>

                {/* Verified Skills Badges */}
                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Keahlian Teknis & Sertifikasi yang Diakui:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeRecord.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-indigo-900/50 border border-indigo-700/60 text-indigo-200 text-xs font-medium"
                      >
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stage Progress Bar */}
                <div className="mt-6 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-300 font-bold">
                    <span>Progress Karir ({activeRecord.currentStageId}/10 Tahap)</span>
                    <span>{activeRecord.currentStageId * 10}% Menuju Puncak</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden p-0.5 border border-slate-600">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${activeRecord.currentStageId * 10}%` }}
                    ></div>
                  </div>
                </div>

                {/* Promotion Control Action Bar */}
                {canPromote && (
                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-300">
                      Wewenang Evaluator: <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.role})
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdvanceStage('prev')}
                        disabled={activeRecord.currentStageId <= 1}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold border border-slate-600 transition-all cursor-pointer"
                      >
                        ← Mundur 1 Tahap
                      </button>
                      <button
                        onClick={() => handleAdvanceStage('next')}
                        disabled={activeRecord.currentStageId >= 10}
                        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Promosikan / Naik Tahap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* PIPELINE BREAKDOWN ACCORDION / STAGE DETAIL */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Detail Standar Kompetensi 10 Tahap ({activeStaff.division})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PIPELINE_STAGES.map((stg) => {
                    const isPassed = activeRecord.currentStageId >= stg.id;
                    const isCurrent = activeRecord.currentStageId === stg.id;

                    return (
                      <div
                        key={stg.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200'
                            : isPassed
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-slate-50/40 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{stg.icon}</span>
                            <span className="font-black text-xs text-slate-900 uppercase">{stg.name}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${stg.badgeColor}`}>
                            Tahap #{stg.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                          {stg.shortDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

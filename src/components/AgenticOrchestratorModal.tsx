/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KOMPONEN MODAL ORKESTRATOR AGENTIC AI & MULTI-AGENT SYNTHESIZER
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Shield,
  Activity,
  Layers,
  Wrench,
  Package,
  TrendingUp,
  Award,
  X,
  Copy,
  Check,
  Download,
  Send,
  Zap,
  RefreshCw
} from 'lucide-react';
import {
  queryAgenticRAG,
  generateOrchestratedReport,
  AgenticResponse,
  OrchestratedReportResult
} from '../lib/ragVectorEngine';
import { DailyReport, LogbookEntry, Finding, WorkOrder, Staff, Asset } from '../types';

interface AgenticOrchestratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReports: DailyReport[];
  logbookEntries: LogbookEntry[];
  findings: Finding[];
  workOrders: WorkOrder[];
  staffList: Staff[];
  assets?: Asset[];
  currentUser: Staff;
}

export default function AgenticOrchestratorModal({
  isOpen,
  onClose,
  dailyReports,
  logbookEntries,
  findings,
  workOrders,
  staffList,
  assets = [],
  currentUser
}: AgenticOrchestratorModalProps) {
  const [activeMode, setActiveMode] = useState<'consultation' | 'reporting'>('reporting');
  
  // Reporting State
  const [reportType, setReportType] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Bulanan');
  const [periodInput, setPeriodInput] = useState('September 2026');
  const [orchestratedResult, setOrchestratedResult] = useState<OrchestratedReportResult | null>(() => {
    return generateOrchestratedReport('Bulanan', 'September 2026', {
      dailyReports,
      logbookEntries,
      findings,
      workOrders,
      staffList,
      assets
    });
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Consultation State
  const [query, setQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<'master' | 'qc' | 'logistics' | 'service' | 'kpi'>('master');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [chatHistory, setChatHistory] = useState<AgenticResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateOrchestratedReport(reportType, periodInput, {
        dailyReports,
        logbookEntries,
        findings,
        workOrders,
        staffList,
        assets
      });
      setOrchestratedResult(result);
      setIsGenerating(false);
    }, 400);
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const resp = queryAgenticRAG(query, selectedAgent, selectedDivision);
      setChatHistory(prev => [resp, ...prev]);
      setQuery('');
      setIsSearching(false);
    }, 300);
  };

  const handleCopyReport = () => {
    if (!orchestratedResult) return;
    const text = orchestratedResult.toMarkdownString
      ? orchestratedResult.toMarkdownString()
      : `=== LAPORAN RESMI ${orchestratedResult.reportType.toUpperCase()} OPERASIONAL ===\nPT. RIZ PRODUCTION MULTI KREASI\nPeriode: ${orchestratedResult.period}\n\n${orchestratedResult.orchestrator.executiveSummary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!orchestratedResult) return;
    const mdContent = orchestratedResult.toMarkdownString
      ? orchestratedResult.toMarkdownString()
      : `=== LAPORAN RESMI ${orchestratedResult.reportType.toUpperCase()} OPERASIONAL ===\nPT. RIZ PRODUCTION MULTI KREASI\nPeriode: ${orchestratedResult.period}\n\n${orchestratedResult.orchestrator.executiveSummary}`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safePeriod = orchestratedResult.period.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `Laporan_Orkestrasi_${orchestratedResult.reportType}_${safePeriod}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-5 text-white flex justify-between items-center shrink-0 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shadow-inner">
              <Bot className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Agentic AI Multi-Agent Orchestrator</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> RAG Vector Engine Active
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Pengelolaan Tim Agen Cerdas (QC, Logistics, Service, KPI) & Penyusunan Laporan Terorkestrasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0">
          <div className="flex bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveMode('reporting')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeMode === 'reporting'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Penyusunan Pelaporan Terorkestrasi</span>
            </button>
            <button
              onClick={() => setActiveMode('consultation')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeMode === 'consultation'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Konsultasi & Knowledge Grounding</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>100% Grounded Tanpa Halusinasi</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grow space-y-6">
          {activeMode === 'reporting' ? (
            <div className="space-y-6">
              {/* Controls bar */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block uppercase font-mono mb-1">
                      Jenis Laporan
                    </label>
                    <div className="flex bg-white rounded-lg border border-slate-300 p-0.5">
                      {(['Harian', 'Mingguan', 'Bulanan'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            setReportType(type);
                            if (type === 'Harian') setPeriodInput('2026-09-05');
                            else if (type === 'Mingguan') setPeriodInput('1 - 7 September 2026');
                            else setPeriodInput('September 2026');
                          }}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            reportType === type ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block uppercase font-mono mb-1">
                      Periode Waktu
                    </label>
                    <input
                      type="text"
                      value={periodInput}
                      onChange={e => setPeriodInput(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Mengorkestrasi...' : 'Generate Laporan Terorkestrasi'}</span>
                  </button>

                  <button
                    onClick={handleCopyReport}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
                  </button>

                  <button
                    onClick={handleDownloadMarkdown}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Markdown (.MD)</span>
                  </button>
                </div>
              </div>

              {/* Orchestrated Output */}
              {orchestratedResult && (
                <div className="space-y-6">
                  {/* Executive Header Banner */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 p-5 rounded-2xl border border-indigo-100 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {orchestratedResult.reportType} REPORT
                        </span>
                        <h3 className="font-black text-slate-900 text-sm">
                          Hasil Orkestrasi: {orchestratedResult.period}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        Diproses: {orchestratedResult.generatedAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {orchestratedResult.orchestrator.executiveSummary}
                    </p>

                    <div className="flex items-center gap-4 pt-2 border-t border-indigo-100/80">
                      <div className="text-xs">
                        <span className="text-slate-400 text-[10px] block font-mono">Indeks Kesehatan Operasi</span>
                        <strong className="text-indigo-700 text-base font-bold">
                          {orchestratedResult.orchestrator.overallHealthIndex}%
                        </strong>
                      </div>
                      <div className="h-8 w-px bg-indigo-200"></div>
                      <div className="text-xs">
                        <span className="text-slate-400 text-[10px] block font-mono">Kelulusan QC</span>
                        <strong className="text-emerald-600 text-base font-bold">
                          {orchestratedResult.agentFindings.qcAgent.passRate}%
                        </strong>
                      </div>
                      <div className="h-8 w-px bg-indigo-200"></div>
                      <div className="text-xs">
                        <span className="text-slate-400 text-[10px] block font-mono">Kesiapan Gudang</span>
                        <strong className="text-blue-600 text-base font-bold">
                          {orchestratedResult.agentFindings.logisticsAgent.warehouseReadiness}%
                        </strong>
                      </div>
                      <div className="h-8 w-px bg-indigo-200"></div>
                      <div className="text-xs">
                        <span className="text-slate-400 text-[10px] block font-mono">Staf Berkontribusi Riil</span>
                        <strong className="text-slate-900 text-base font-bold">
                          {orchestratedResult.agentFindings.kpiAgent.activeStaffCount} Orang
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* 4 Agent Findings Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* QC Agent */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Laporan Agent QC & Quality Control</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {orchestratedResult.agentFindings.qcAgent.summary}
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono text-[10px]">
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-slate-400 block">Inspeksi</span>
                          <strong className="text-slate-800">{orchestratedResult.agentFindings.qcAgent.totalInspected}</strong>
                        </div>
                        <div className="bg-emerald-50 p-1.5 rounded">
                          <span className="text-emerald-600 block">Kondisi OK</span>
                          <strong className="text-emerald-700">{orchestratedResult.agentFindings.qcAgent.okCount}</strong>
                        </div>
                        <div className="bg-rose-50 p-1.5 rounded">
                          <span className="text-rose-600 block">Status NG</span>
                          <strong className="text-rose-700">{orchestratedResult.agentFindings.qcAgent.ngCount}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Service Agent */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                        <Wrench className="w-4 h-4" />
                        <span>Laporan Agent Service & Maintenance</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {orchestratedResult.agentFindings.serviceAgent.summary}
                      </p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono text-[10px]">
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-slate-400 block">Temuan</span>
                          <strong className="text-slate-800">{orchestratedResult.agentFindings.serviceAgent.totalRepairs}</strong>
                        </div>
                        <div className="bg-emerald-50 p-1.5 rounded">
                          <span className="text-emerald-600 block">Selesai (Close)</span>
                          <strong className="text-emerald-700">{orchestratedResult.agentFindings.serviceAgent.closedRepairs}</strong>
                        </div>
                        <div className="bg-amber-50 p-1.5 rounded">
                          <span className="text-amber-600 block">Pending (Open)</span>
                          <strong className="text-amber-700">{orchestratedResult.agentFindings.serviceAgent.pendingRepairs}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Logistics Agent */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                        <Package className="w-4 h-4" />
                        <span>Laporan Agent Logistik & Warehouse</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {orchestratedResult.agentFindings.logisticsAgent.summary}
                      </p>
                      <div className="p-2 bg-blue-50/50 rounded-lg text-[10px] text-blue-800 font-medium">
                        Kesiapan Inventaris Armada & Gudang: <strong>{orchestratedResult.agentFindings.logisticsAgent.warehouseReadiness}%</strong> (100% data tersinkronisasi)
                      </div>
                    </div>

                    {/* KPI Agent */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                      <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
                        <Award className="w-4 h-4" />
                        <span>Laporan Agent Analisis Operasional & KPI</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {orchestratedResult.agentFindings.kpiAgent.summary}
                      </p>
                      <div className="space-y-1 pt-1 border-t border-slate-100 text-[10px] font-mono">
                        {orchestratedResult.agentFindings.kpiAgent.topPerformers.map((st, i) => (
                          <div key={i} className="flex justify-between items-center text-slate-700">
                            <span>#{i + 1} {st.name} ({st.division})</span>
                            <strong className="text-indigo-600">{st.score}% (Lap: {st.reports} | QC: {st.qcs})</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Critical Action Points & Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Poin Tindakan Kritis Manajemen</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-rose-900">
                        {orchestratedResult.orchestrator.criticalActionPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="font-bold">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Rekomendasi Strategis AI</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-700">
                        {orchestratedResult.strategicRecommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="font-bold text-indigo-600">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Consultation Mode */
            <div className="space-y-6">
              {/* Agent selector & search box */}
              <form onSubmit={handleSendQuery} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Pilih Agen Spesialis:</span>
                    <select
                      value={selectedAgent}
                      onChange={e => setSelectedAgent(e.target.value as any)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="master">Master Orchestrator (Semua Bidang)</option>
                      <option value="qc">Agent QC & Quality Control</option>
                      <option value="service">Agent Service & Perbaikan</option>
                      <option value="logistics">Agent Logistik & Warehouse</option>
                      <option value="kpi">Agent KPI & Analisis Operasional</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Filter Divisi:</span>
                    <select
                      value={selectedDivision}
                      onChange={e => setSelectedDivision(e.target.value)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="All">Semua Divisi</option>
                      <option value="Audio">Audio (Sound)</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Videotron">Videotron</option>
                      <option value="Multimedia">Multimedia</option>
                      <option value="Gudang">Gudang Logistik</option>
                      <option value="Service">Service</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative grow">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Tanyakan SOP teknis, katalog alat resmi, standar PUIL, temuan kerusakan, atau jadwal staf..."
                      className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !query.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSearching ? 'Mencari...' : 'Tanya Agen'}</span>
                  </button>
                </div>
              </form>

              {/* Query Results */}
              <div className="space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                    <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                    <h4 className="font-bold text-slate-700 text-sm">Konsultasi Terpandu Agentic AI RAG</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Ketikkan pertanyaan teknis atau pilih salah satu kata kunci seperti: <em>SOP Line Array, Standar Grounding Genset 3-Phase, Beam 380W, Profil Staf Suryana/Wahyudin, atau Modul Videotron P3.9.</em>
                    </p>
                  </div>
                ) : (
                  chatHistory.map((chat, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-slate-900 text-xs">{chat.agentName}</span>
                          <span className="text-[10px] font-mono text-slate-400">• Pertanyaan: "{chat.query}"</span>
                        </div>
                        <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">
                          Confidence: {Math.round(chat.confidenceScore * 100)}%
                        </span>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-lg border border-slate-100">
                        {chat.summary}
                      </p>

                      {chat.detailedAnalysis.length > 0 && (
                        <div className="space-y-1 text-[11px] text-slate-600 bg-white/70 p-3 rounded-lg border border-slate-100">
                          <span className="font-bold text-[10px] uppercase font-mono text-slate-500 block mb-1">
                            Detail Grounding Data:
                          </span>
                          {chat.detailedAnalysis.map((d, dIdx) => (
                            <div key={dIdx} className="leading-relaxed">• {d}</div>
                          ))}
                        </div>
                      )}

                      {chat.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {chat.citations.map((c, cIdx) => (
                            <span key={cIdx} className="bg-slate-200 text-slate-700 text-[9px] font-mono px-2 py-0.5 rounded">
                              📚 {c.title} ({c.category})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs shrink-0">
          <div className="text-[11px] text-slate-500 font-mono">
            Orchestrator: <strong className="text-slate-800">PT. RIZ PRODUCTION MULTI KREASI</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

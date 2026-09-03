/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AGENTIC AI MODEL RAG & DATA VECTOR INTERFACE
 * Antarmuka Interaktif Agen Cerdas Berbasis Retrieval-Augmented Generation & Pencarian Vektor
 */

import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Search, 
  Database, 
  ShieldCheck, 
  Package, 
  Wrench, 
  TrendingUp, 
  ExternalLink, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { 
  ragVectorStore, 
  queryAgenticRAG, 
  AgenticResponse, 
  VectorDocument,
  RAGQueryResult
} from '../lib/ragVectorEngine';
import { Asset, LogbookEntry, DailyReport, Finding, WorkOrder, AttendanceLog, WarehouseLog } from '../types';

interface AgenticRAGModuleProps {
  currentUser: any;
  assets: Asset[];
  logbookEntries: LogbookEntry[];
  dailyReports: DailyReport[];
  findings: Finding[];
  workOrders: WorkOrder[];
  attendanceLogs?: AttendanceLog[];
  warehouseLogs?: WarehouseLog[];
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function AgenticRAGModule({
  currentUser,
  assets,
  logbookEntries,
  dailyReports,
  findings,
  workOrders,
  attendanceLogs,
  warehouseLogs,
  onLogActivity
}: AgenticRAGModuleProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'vector_inspector'>('chat');
  const [selectedAgent, setSelectedAgent] = useState<'master' | 'qc' | 'logistics' | 'service' | 'kpi'>('master');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');
  const [queryInput, setQueryInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<AgenticResponse[]>([]);
  const [vectorStats, setVectorStats] = useState(ragVectorStore.getStats());

  // Vector Inspector States
  const [inspectorCategory, setInspectorCategory] = useState<string>('All');
  const [inspectorSearch, setInspectorSearch] = useState<string>('');
  const [inspectorResults, setInspectorResults] = useState<VectorDocument[]>([]);

  // Ingest real-time live data on mount and updates
  useEffect(() => {
    ragVectorStore.ingestLiveData({
      assets,
      logbookEntries,
      dailyReports,
      findings,
      workOrders,
      attendanceLogs,
      warehouseLogs
    });
    setVectorStats(ragVectorStore.getStats());
  }, [assets, logbookEntries, dailyReports, findings, workOrders, attendanceLogs, warehouseLogs]);

  // Handle Query Submission
  const handleQuerySubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = (customQuery || queryInput).trim();
    if (!q) return;

    setIsProcessing(true);
    onLogActivity(currentUser.name, currentUser.role, `Konsultasi Agentic AI (${selectedAgent}): "${q}"`);

    setTimeout(() => {
      const response = queryAgenticRAG(q, selectedAgent, divisionFilter);
      setChatHistory(prev => [response, ...prev]);
      setIsProcessing(false);
      setQueryInput('');
    }, 400);
  };

  // Sync Live Data Vector Manually
  const handleManualVectorSync = () => {
    ragVectorStore.ingestLiveData({
      assets,
      logbookEntries,
      dailyReports,
      findings,
      workOrders,
      attendanceLogs,
      warehouseLogs
    });
    setVectorStats(ragVectorStore.getStats());
    alert('Sukses: Seluruh data aktif operasi (Aset, QC Log, Daily Report, Temuan Kerusakan & Gudang) berhasil di-vektorisasi ke RAG Knowledge Store!');
  };

  // Quick Preset Queries
  const PRESET_QUERIES = [
    { label: 'Standar Grounding & PUIL 2011', query: 'Berapa batas maksimal nilai tahanan grounding kelistrikan panggung audio visual?', agent: 'service' as const },
    { label: 'SOP Penanganan LED P3.9', query: 'Bagaimana prosedur kalibrasi dan perbaikan modul LED videotron NovaStar P3.9?', agent: 'service' as const },
    { label: 'Katalog Sound System Resmi', query: 'Apa saja lini line array dan mixer console resmi dari Riz Production?', agent: 'master' as const },
    { label: 'Pemeriksaan QC Moving Head', query: 'Bagaimana standar uji fungsi dan kalibrasi sensor pan-tilt moving head beam?', agent: 'qc' as const },
    { label: 'Alur Logistik & Surat Jalan', query: 'Bagaimana alur verifikasi barang loading dan unloading di gudang logistik?', agent: 'logistics' as const },
    { label: 'Metrik Evaluasi KPI Staff', query: 'Bagaimana bobot penilaian KPI staf termasuk absensi dan uji kompetensi?', agent: 'kpi' as const }
  ];

  // Inspector Search Handler
  useEffect(() => {
    let docs = ragVectorStore.getAllDocuments();
    if (inspectorCategory !== 'All') {
      docs = docs.filter(d => d.category === inspectorCategory);
    }
    if (inspectorSearch.trim()) {
      const queryResults: RAGQueryResult[] = ragVectorStore.search(inspectorSearch, {
        category: inspectorCategory !== 'All' ? inspectorCategory : undefined,
        topK: 25
      });
      docs = queryResults.map(r => r.document);
    }
    setInspectorResults(docs);
  }, [inspectorCategory, inspectorSearch, activeTab]);

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-800/40 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-indigo-400 animate-pulse" />
              RAG Vector Knowledge Base Active
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              100% Grounded Data
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-indigo-400" />
            Agentic AI & Vector RAG Engine
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl font-sans">
            Asisten kecerdasan buatan multi-agen terintegrasi dengan pencarian vektor semantik dari katalog resmi Riz Production, SOP 5R, panduan perbaikan, serta data operasional real-time.
          </p>
        </div>

        {/* Vector Engine Stats Bar */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3.5 rounded-xl flex items-center gap-4 text-xs font-mono">
          <div className="border-r border-white/10 pr-4">
            <span className="text-[10px] text-slate-400 block uppercase">Vector Chunks</span>
            <strong className="text-sm font-bold text-white">{vectorStats.totalDocuments} Dokumen</strong>
          </div>
          <div className="border-r border-white/10 pr-4">
            <span className="text-[10px] text-slate-400 block uppercase">Vocabulary</span>
            <strong className="text-sm font-bold text-indigo-300">{vectorStats.vocabularySize} Tokens</strong>
          </div>
          <button
            onClick={handleManualVectorSync}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-md"
            title="Sinkronisasi ulang seluruh data aktif ke indeks vektor"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Vector</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'chat'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Konsultasi Multi-Agent AI</span>
        </button>
        <button
          onClick={() => setActiveTab('vector_inspector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'vector_inspector'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Inspektur Indeks Vektor ({vectorStats.totalDocuments})</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE AGENTIC CHAT */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Agent Selector & Presets */}
          <div className="lg:col-span-1 space-y-4">
            {/* Agent Role Selector */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Pilih Agen Spesialis
              </h2>

              <div className="space-y-1.5">
                {[
                  { role: 'master' as const, name: 'Master Orchestrator', desc: 'Sintesis terpadu seluruh divisi', icon: Bot, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                  { role: 'qc' as const, name: 'Agent QC & Inspeksi', desc: 'Standar checklist & diagnosa NG', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { role: 'logistics' as const, name: 'Agent Logistik & Gudang', desc: 'Aset, loading & surat jalan', icon: Package, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  { role: 'service' as const, name: 'Agent Service & Repair', desc: 'Troubleshooting & suku cadang', icon: Wrench, color: 'text-amber-600 bg-amber-50 border-amber-200' },
                  { role: 'kpi' as const, name: 'Agent Kinerja & KPI', desc: 'Evaluasi performa & coaching', icon: TrendingUp, color: 'text-purple-600 bg-purple-50 border-purple-200' }
                ].map(agent => {
                  const Icon = agent.icon;
                  const isSelected = selectedAgent === agent.role;
                  return (
                    <button
                      key={agent.role}
                      onClick={() => setSelectedAgent(agent.role)}
                      className={`w-full text-left p-2.5 rounded-lg border transition flex items-start gap-2.5 ${
                        isSelected 
                          ? `${agent.color} ring-2 ring-indigo-500/20 shadow-sm font-semibold` 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold">{agent.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight">{agent.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Division Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
              <label className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">Fokus Divisi:</label>
              <select
                value={divisionFilter}
                onChange={e => setDivisionFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="All">Semua Divisi (General)</option>
                <option value="Audio">Divisi Audio / Sound</option>
                <option value="Lighting">Divisi Lighting</option>
                <option value="Videotron">Divisi LED Videotron</option>
                <option value="Multimedia">Divisi Streaming & Multicam</option>
                <option value="Gudang">Divisi Logistik Gudang</option>
                <option value="Service">Divisi Service & Maintenance</option>
              </select>
            </div>

            {/* Preset Query Shortcuts */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                Pertanyaan Cepat RAG
              </h3>
              <div className="space-y-1.5">
                {PRESET_QUERIES.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAgent(p.agent);
                      setQueryInput(p.query);
                      handleQuerySubmit(undefined, p.query);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-[11px] text-slate-700 font-medium transition flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{p.label}</span>
                    <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded text-indigo-600 border border-slate-200 shrink-0 group-hover:border-indigo-300">
                      Tanya
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Chat Form & Grounded Responses */}
          <div className="lg:col-span-3 space-y-4">
            {/* Query Input Box */}
            <form onSubmit={e => handleQuerySubmit(e)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={queryInput}
                    onChange={e => setQueryInput(e.target.value)}
                    placeholder={`Tanyakan pada ${selectedAgent.toUpperCase()} AI (e.g. spesifikasi Line Array, grounding PUIL, dead pixel LED, atau temuan alat)...`}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || !queryInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shrink-0"
                >
                  {isProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Jalankan RAG</span>
                </button>
              </div>
            </form>

            {/* Chat History & Grounding Feed */}
            <div className="space-y-4">
              {chatHistory.map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 transition hover:border-indigo-200">
                  {/* Query Header */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                        {item.agentName}
                      </span>
                      <span className="text-xs font-bold text-slate-900">"{item.query}"</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                        Grounding Confidence: {Math.round(item.confidenceScore * 100)}%
                      </span>
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="p-3.5 bg-indigo-50/40 border border-indigo-100 rounded-lg text-xs text-indigo-950 font-medium leading-relaxed">
                    <strong>💡 Ringkasan Analisis: </strong>
                    {item.summary}
                  </div>

                  {/* Detailed Analysis Grounded */}
                  {item.detailedAnalysis.length > 0 && (
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">Uraian Grounding & Fakta Teknis:</h4>
                      <ul className="space-y-1 pl-4 list-disc marker:text-indigo-600">
                        {item.detailedAnalysis.map((detail, dIdx) => (
                          <li key={dIdx} className="leading-relaxed">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {item.recommendations.length > 0 && (
                    <div className="p-3 bg-emerald-50/40 border border-emerald-100 rounded-lg space-y-1 text-xs text-emerald-950">
                      <span className="font-bold text-[11px] uppercase tracking-wider block text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Rekomendasi Tindakan Operasional:
                      </span>
                      <ul className="space-y-0.5 pl-4 list-disc marker:text-emerald-600">
                        {item.recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Document Citations & Sources */}
                  {item.citations.length > 0 && (
                    <div className="border-t border-slate-100 pt-3 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Sumber Rujukan & Grounding ({item.citations.length} Dokumen):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.citations.map((c, cIdx) => (
                          <div key={cIdx} className="bg-slate-50 border border-slate-200 rounded-md p-1.5 text-[10px] flex items-center gap-1.5 text-slate-700">
                            <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span className="font-semibold">{c.title}</span>
                            <span className="text-slate-400">({c.category})</span>
                            {c.url && (
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 ml-1 font-mono underline"
                              >
                                <span>URL</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {chatHistory.length === 0 && (
                <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center space-y-3">
                  <Bot className="w-12 h-12 text-indigo-300 mx-auto animate-bounce" />
                  <h3 className="font-bold text-slate-800 text-sm">Agentic AI Siap Menerima Pertanyaan</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Ketik pertanyaan seputar spesifikasi teknis peralatan, SOP pemeliharaan 5R, grounding kelistrikan, alur logistik, atau klik tombol pertanyaan cepat di sebelah kiri.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VECTOR DATABASE INSPECTOR */}
      {activeTab === 'vector_inspector' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Daftar Dokumen dalam Vector Knowledge Store
              </h2>
              <p className="text-[11px] text-slate-500">Seluruh dokumen yang diindeks secara semantik dengan pembobotan TF-IDF dan Cosine Similarity</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <input
                type="text"
                value={inspectorSearch}
                onChange={e => setInspectorSearch(e.target.value)}
                placeholder="Cari chunk vektor..."
                className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                value={inspectorCategory}
                onChange={e => setInspectorCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800 outline-none"
              >
                <option value="All">Semua Kategori</option>
                <option value="Official Catalog">Katalog Resmi</option>
                <option value="SOP & 5R">SOP & 5R Divisi</option>
                <option value="Maintenance Guide">Panduan Maintenance</option>
                <option value="Competency Standard">Standar Kompetensi</option>
                <option value="Live Operational Data">Data Operasi Aktif</option>
              </select>
            </div>
          </div>

          {/* Table of Vector Chunks */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                  <th className="p-3 w-16 text-center">ID</th>
                  <th className="p-3">Judul / Sumber</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Divisi</th>
                  <th className="p-3">Konten Terindeks</th>
                  <th className="p-3 text-center">Keywords</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {inspectorResults.slice(0, 50).map((doc, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-3 text-center text-slate-400 font-bold">{doc.id}</td>
                    <td className="p-3 font-sans font-bold text-slate-900">
                      {doc.title}
                      {doc.sourceUrl && (
                        <a
                          href={doc.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[10px] text-indigo-600 hover:underline font-mono truncate max-w-xs mt-0.5"
                        >
                          {doc.sourceUrl}
                        </a>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold font-sans">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-3 font-sans text-slate-600">{doc.division}</td>
                    <td className="p-3 font-sans text-slate-600 text-[11px] max-w-md line-clamp-2">
                      {doc.content}
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold text-[10px]">
                        {doc.keywords.length} terms
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

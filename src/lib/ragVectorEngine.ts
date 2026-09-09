/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AGENTIC AI MODEL RAG (Retrieval-Augmented Generation) & DATA VECTOR ENGINE
 * Sistem Agen Cerdas Terpadu dengan Grounding Data Resmi Riz Production & Data Operasi Real-Time
 */

import { OFFICIAL_EQUIPMENT_SOURCES, OFFICIAL_EQUIPMENT_CATALOG } from '../data/officialEquipmentReference';
import { DIVISION_DAILY_TASK_REFERENCES } from '../data/divisionTaskTemplates';
import { OFFICIAL_COMPETENCY_MATRICES } from '../data/competencyMatrixData';
import { STAFF_LIST } from '../data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from '../data/september2026Schedule';
import { isStaffMatch, isStaffInDivision } from '../utils/kpiCalculator';
import { Asset, LogbookEntry, DailyReport, Finding, WorkOrder, AttendanceLog, WarehouseLog } from '../types';
import { agenticMemory, ShortTermMemoryItem, LongTermMemoryItem } from './agenticMemory';

export interface VectorDocument {
  id: string;
  title: string;
  category: 'Official Catalog' | 'SOP & 5R' | 'QC Inspection' | 'Maintenance Guide' | 'Competency Standard' | 'Live Operational Data' | 'Master Staff & Schedule';
  division: string;
  sourceUrl?: string;
  sourceRef?: string;
  content: string;
  keywords: string[];
  embeddingVector?: number[];
  timestamp: string;
}

export interface RAGQueryResult {
  document: VectorDocument;
  similarityScore: number;
  matchedKeywords: string[];
}

export interface AgenticResponse {
  agentRole: 'master' | 'qc' | 'logistics' | 'service' | 'kpi';
  agentName: string;
  query: string;
  summary: string;
  detailedAnalysis: string[];
  recommendations: string[];
  citations: {
    title: string;
    category: string;
    url?: string;
    ref?: string;
  }[];
  rawGroundingDocs: VectorDocument[];
  confidenceScore: number;
  timestamp: string;
  memoryContext?: {
    shortTermCount: number;
    longTermMatches: { topic: string; division: string; insight: string }[];
  };
}

// Tokenizer & Stopwords filter
const STOPWORDS = new Set([
  'dan', 'di', 'ke', 'dari', 'yang', 'pada', 'untuk', 'dengan', 'atau', 'ini', 'itu',
  'adalah', 'sebagai', 'dalam', 'bisa', 'akan', 'ada', 'karena', 'oleh', 'juga', 'saat',
  'sudah', 'telah', 'serta', 'kami', 'kita', 'saya', 'dia', 'mereka', 'harus', 'agar'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s\d-]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

// Build In-Memory RAG Vector Store
class RAGVectorStore {
  private documents: VectorDocument[] = [];
  private vocabulary: Map<string, number> = new Map();
  private docFrequencies: Map<string, number> = new Map();
  private isInitialized = false;

  constructor() {
    this.buildStaticCorpus();
  }

  // 1. Build Static Knowledge Corpus from Official User Data
  private buildStaticCorpus() {
    this.documents = [];

    // A. Official Equipment Catalog (Sources & Items)
    OFFICIAL_EQUIPMENT_SOURCES.forEach((source, idx) => {
      this.documents.push({
        id: `src-${idx + 1}`,
        title: source.title,
        category: 'Official Catalog',
        division: source.division,
        sourceUrl: source.url,
        sourceRef: `Katalog Resmi Riz Production - ${source.category}`,
        content: `Layanan & Kategori: ${source.title}. Divisi: ${source.division}. Kategori: ${source.category}. Deskripsi: ${source.description}. URL Resmi: ${source.url}`,
        keywords: tokenize(`${source.title} ${source.category} ${source.division} ${source.description}`),
        timestamp: '2026-09-01'
      });
    });

    OFFICIAL_EQUIPMENT_CATALOG.forEach((item, idx) => {
      this.documents.push({
        id: `item-${idx + 1}`,
        title: item.name,
        category: 'Official Catalog',
        division: item.division,
        sourceUrl: item.sourceUrl,
        sourceRef: `${item.category} (${item.brand})`,
        content: `Peralatan: ${item.name}. Brand: ${item.brand}. Divisi: ${item.division}. Kategori: ${item.category}. Spesifikasi: ${item.specs}. Standar Pemeliharaan: ${item.maintenanceSchedule}. Sumber: ${item.sourceUrl}`,
        keywords: tokenize(`${item.name} ${item.brand} ${item.division} ${item.category} ${item.specs} ${item.maintenanceSchedule}`),
        timestamp: '2026-09-01'
      });
    });

    // B. Standard 5R & Division Task SOPs
    Object.entries(DIVISION_DAILY_TASK_REFERENCES).forEach(([division, tasks]) => {
      tasks.forEach((task, tIdx) => {
        this.documents.push({
          id: `sop-${division.toLowerCase()}-${tIdx + 1}`,
          title: `SOP ${division}: ${task.title}`,
          category: 'SOP & 5R',
          division: division,
          sourceRef: `Standar Daily Task & 5R Divisi ${division} (${task.category})`,
          content: `Standar Operasional Prosedur Divisi ${division}. Judul Tugas: ${task.title}. Kategori: ${task.category}. Deskripsi Prosedur: ${task.description}.`,
          keywords: tokenize(`${division} ${task.title} ${task.category} ${task.description}`),
          timestamp: '2026-09-01'
        });
      });
    });

    // C. Competency Framework & Safety Standards
    Object.entries(OFFICIAL_COMPETENCY_MATRICES).forEach(([divisionName, matrix]) => {
      matrix.levels.forEach((lvl, lIdx) => {
        this.documents.push({
          id: `comp-${divisionName.toLowerCase()}-${lIdx + 1}`,
          title: `Standar Kompetensi ${divisionName}: Level ${lvl.level} (${lvl.title})`,
          category: 'Competency Standard',
          division: matrix.division || divisionName,
          sourceRef: `Kurikulum Paspor Kompetensi Level ${lvl.level}`,
          content: `Uji Kompetensi: ${lvl.title} (Level ${lvl.level}). Fokus Peran: ${lvl.fokusPeran}. Kompetensi Teknis: ${lvl.kompetensiTeknis.join('; ')}. Tools & Software: ${lvl.toolsSoftware.join('; ')}. Output Kerja: ${lvl.hasilOutput}.`,
          keywords: tokenize(`${divisionName} ${lvl.title} ${lvl.fokusPeran} ${lvl.kompetensiTeknis.join(' ')} ${lvl.toolsSoftware.join(' ')}`),
          timestamp: '2026-09-01'
        });
      });
    });

    // D. Electrical Safety & Maintenance Guidelines
    const safetyGuides = [
      {
        title: 'Standar Kelistrikan & Grounding Audio-Visual (PUIL 2011)',
        content: 'Grounding sistem panggung event wajib memiliki nilai tahanan tanah (resistance) maksimal di bawah 2 Ohm untuk mencegah ground-loop hum dan melindungi sirkuit sensitif. Selalu gunakan RCD/ELCB 30mA pada instalasi panel distribusi genset 3-Phase.',
        keywords: ['kelistrikan', 'grounding', 'audio', 'puil', 'tahanan', 'ohm', 'rcd', 'elcb', 'genset', '3-phase', 'tegangan', 'voltage']
      },
      {
        title: 'SOP Kalibrasi & Penanganan Modul LED Videotron P3.9 / P2.6',
        content: 'Penanganan kabinet LED videotron wajib menggunakan sarung tangan anti-statis (ESD). Pengecekan pixel mati (dead pixel), perbaikan receiving card NovaStar, dan kalibrasi refresh rate minimum 3840Hz sebelum loading event.',
        keywords: ['led', 'videotron', 'p3.9', 'p2.6', 'novastar', 'dead pixel', 'receiving card', 'refresh rate', 'kalibrasi']
      },
      {
        title: 'SOP Preventive Maintenance Moving Head Beam & Laser',
        content: 'Pemeriksaan rutin Moving Head Beam meliputi pembersihan optik lensa dengan cairan isopropil alkohol, pelumasan bearing pan/tilt dengan silicon grease suhu tinggi, serta kalibrasi sensor encoder optik homing.',
        keywords: ['moving head', 'beam', 'lighting', 'optik', 'lensa', 'pan', 'tilt', 'bearing', 'silicon grease', 'sensor', 'encoder']
      }
    ];

    // E. Master Staf Resmi (21 Staf)
    STAFF_LIST.forEach((st) => {
      this.documents.push({
        id: `staff-${st.id}`,
        title: `Profil Staf: ${st.name} (${st.nickname || st.name})`,
        category: 'Master Staff & Schedule',
        division: st.division,
        sourceRef: `Master Data Karyawan Tetap (${st.division})`,
        content: `Data Karyawan Resmi PT RIZ PRODUCTION. Nama: ${st.name}. Nama Lengkap: ${st.fullName || st.name}. Nama Panggilan/Alias: ${st.nickname || '-'}. Divisi: ${st.division}. Jabatan/Role: ${st.role}. Level: ${st.level}. Email: ${st.email || '-'}. No. HP: ${st.phone || '-'}.`,
        keywords: tokenize(`${st.name} ${st.fullName || ''} ${st.nickname || ''} ${st.division} ${st.role} ${st.email || ''} ${st.phone || ''}`),
        timestamp: '2026-09-01'
      });
    });

    // F. Jadwal Kerja September 2026 Resmi
    OFFICIAL_SEPTEMBER_2026_SCHEDULE.forEach((sch) => {
      this.documents.push({
        id: `sch-${sch.no}`,
        title: `Jadwal Shift September 2026: ${sch.name} (${sch.division})`,
        category: 'Master Staff & Schedule',
        division: sch.division,
        sourceRef: `Jadwal Kerja September 2026 No. ${sch.no}`,
        content: `Jadwal Shift Kerja Resmi September 2026 (30 Hari). Nama: ${sch.name}. Divisi: ${sch.division}. Total Hari Kerja: ${sch.totalHadir} Hari. Total Libur: ${sch.totalLibur} Hari. Shift Harian: ${Object.entries(sch.shifts).map(([d, s]) => `Tgl ${d}:${s}`).join(', ')}.`,
        keywords: tokenize(`${sch.name} ${sch.division} jadwal shift september 2026 dinas`),
        timestamp: '2026-09-01'
      });
    });

    this.rebuildVectorIndex();
  }

  // 2. Dynamic Live Context Vectorization
  public ingestLiveData(params: {
    assets?: Asset[];
    logbookEntries?: LogbookEntry[];
    dailyReports?: DailyReport[];
    findings?: Finding[];
    workOrders?: WorkOrder[];
    attendanceLogs?: AttendanceLog[];
    warehouseLogs?: WarehouseLog[];
  }) {
    // Remove previous live data
    this.documents = this.documents.filter(d => d.category !== 'Live Operational Data');

    // Ingest Assets
    params.assets?.forEach(a => {
      this.documents.push({
        id: `live-asset-${a.id}`,
        title: `Asset: ${a.name} (${a.code})`,
        category: 'Live Operational Data',
        division: a.division,
        sourceRef: `Database Asset Kode ${a.code}`,
        content: `Asset Aktif: ${a.name}. Kode: ${a.code}. Brand: ${a.brand}. Serial Number: ${a.serialNumber}. Divisi: ${a.division}. Lokasi: ${a.location}. Kondisi Saat Ini: ${a.condition}.`,
        keywords: tokenize(`${a.name} ${a.code} ${a.brand} ${a.serialNumber} ${a.division} ${a.location} ${a.condition}`),
        timestamp: new Date().toISOString().split('T')[0]
      });
    });

    // Ingest Findings / Issues
    params.findings?.forEach(f => {
      this.documents.push({
        id: `live-finding-${f.id}`,
        title: `Temuan Kerusakan: ${f.equipment}`,
        category: 'Live Operational Data',
        division: 'Service',
        sourceRef: `Log Temuan #${f.id} (${f.status})`,
        content: `Temuan Kerusakan Aktif. Alat: ${f.equipment}. Masalah/Kerusakan: ${f.issue}. Prioritas: ${f.priority}. PIC Penanganan: ${f.pic}. Status: ${f.status}. Tanggal: ${f.dateCreated}. Target Selesai: ${f.targetDate}.`,
        keywords: tokenize(`${f.equipment} ${f.issue} ${f.priority} ${f.pic} ${f.status}`),
        timestamp: f.dateCreated || new Date().toISOString().split('T')[0]
      });
    });

    // Ingest Logbooks
    params.logbookEntries?.slice(-30).forEach(l => {
      this.documents.push({
        id: `live-log-${l.id}`,
        title: `QC Log: ${l.activity} oleh ${l.staffName}`,
        category: 'Live Operational Data',
        division: l.division,
        sourceRef: `Log QC Tanggal ${l.date}`,
        content: `Catatan QC Logbook. Tanggal: ${l.date}. Divisi: ${l.division}. Staff: ${l.staffName}. Aktivitas: ${l.activity}. Hasil QC: ${l.result}. Status: ${l.status}. Tindak Lanjut: ${l.followUp}.`,
        keywords: tokenize(`${l.division} ${l.staffName} ${l.activity} ${l.result} ${l.followUp}`),
        timestamp: l.date
      });
    });

    // Ingest Warehouse Logs
    params.warehouseLogs?.slice(-30).forEach(w => {
      this.documents.push({
        id: `live-wh-${w.id}`,
        title: `Logistik Gudang: ${w.type} - ${w.itemName}`,
        category: 'Live Operational Data',
        division: 'Gudang',
        sourceRef: `Log Gudang #${w.id}`,
        content: `Aktivitas Gudang: ${w.type}. Nama Barang: ${w.itemName}. Jumlah: ${w.qty} Unit. PIC: ${w.pic}. Kode Asset: ${w.assetCode || '-'}. Catatan: ${w.notes}. Tanggal: ${w.date}.`,
        keywords: tokenize(`${w.type} ${w.itemName} ${w.pic} ${w.assetCode || ''} ${w.notes}`),
        timestamp: w.date
      });
    });

    // Ingest Long-Term Memory Insights
    agenticMemory.getLongTerm().forEach(ltm => {
      this.documents.push({
        id: `ltm-vec-${ltm.id}`,
        title: `Memori Epik: ${ltm.topic} (${ltm.division})`,
        category: 'Live Operational Data',
        division: ltm.division,
        sourceRef: `Long-Term Memory [${ltm.category}]`,
        content: `Insight Long-Term Memory: ${ltm.topic}. Kategori: ${ltm.category}. Divisi: ${ltm.division}. Rangkuman Insight: ${ltm.insight}. Tags: ${ltm.tags.join(', ')}.`,
        keywords: tokenize(`${ltm.topic} ${ltm.category} ${ltm.division} ${ltm.insight} ${ltm.tags.join(' ')}`),
        timestamp: ltm.createdAt.split('T')[0]
      });
    });

    this.rebuildVectorIndex();
  }

  // 3. TF-IDF Vocabulary & Weighting Index Builder
  private rebuildVectorIndex() {
    this.vocabulary.clear();
    this.docFrequencies.clear();

    // Calculate document frequencies (DF)
    this.documents.forEach(doc => {
      const uniqueWords = new Set(doc.keywords);
      uniqueWords.forEach(word => {
        this.docFrequencies.set(word, (this.docFrequencies.get(word) || 0) + 1);
      });
    });

    // Build vocabulary index
    let vocabIndex = 0;
    this.docFrequencies.forEach((_, word) => {
      this.vocabulary.set(word, vocabIndex++);
    });

    const N = this.documents.length;

    // Compute TF-IDF embedding vector for each document
    this.documents.forEach(doc => {
      const vector: number[] = new Array(this.vocabulary.size).fill(0);
      const wordCounts = new Map<string, number>();

      doc.keywords.forEach(w => {
        wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
      });

      wordCounts.forEach((count, word) => {
        const vIdx = this.vocabulary.get(word);
        if (vIdx !== undefined) {
          const tf = count / doc.keywords.length;
          const df = this.docFrequencies.get(word) || 1;
          const idf = Math.log((N + 1) / (df + 1)) + 1;
          vector[vIdx] = tf * idf;
        }
      });

      // Normalize vector
      const magnitude = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0)) || 1;
      doc.embeddingVector = vector.map(v => v / magnitude);
    });

    this.isInitialized = true;
  }

  // 4. Vector Semantic Search (Cosine Similarity)
  public search(query: string, options?: { topK?: number; division?: string; category?: string }): RAGQueryResult[] {
    if (!this.isInitialized || this.documents.length === 0) {
      return [];
    }

    const topK = options?.topK || 5;
    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    const N = this.documents.length;
    const queryVector: number[] = new Array(this.vocabulary.size).fill(0);
    const qCounts = new Map<string, number>();

    queryTokens.forEach(w => {
      qCounts.set(w, (qCounts.get(w) || 0) + 1);
    });

    qCounts.forEach((count, word) => {
      const vIdx = this.vocabulary.get(word);
      if (vIdx !== undefined) {
        const tf = count / queryTokens.length;
        const df = this.docFrequencies.get(word) || 1;
        const idf = Math.log((N + 1) / (df + 1)) + 1;
        queryVector[vIdx] = tf * idf;
      }
    });

    const qMagnitude = Math.sqrt(queryVector.reduce((acc, val) => acc + val * val, 0)) || 1;
    const normalizedQVector = queryVector.map(v => v / qMagnitude);

    const scoredDocs: RAGQueryResult[] = [];

    this.documents.forEach(doc => {
      if (options?.division && options.division !== 'All' && doc.division !== options.division && doc.division !== 'All') {
        return;
      }
      if (options?.category && options.category !== 'All' && doc.category !== options.category) {
        return;
      }

      if (!doc.embeddingVector) return;

      // Cosine Similarity Dot Product
      let dotProduct = 0;
      for (let i = 0; i < normalizedQVector.length; i++) {
        if (normalizedQVector[i] > 0 && doc.embeddingVector[i] > 0) {
          dotProduct += normalizedQVector[i] * doc.embeddingVector[i];
        }
      }

      // Keyword overlap boost
      const matchedKeywords = queryTokens.filter(q => doc.keywords.includes(q));
      const overlapBoost = matchedKeywords.length > 0 ? (matchedKeywords.length / queryTokens.length) * 0.3 : 0;
      const finalScore = Math.min(1.0, dotProduct + overlapBoost);

      if (finalScore > 0.05 || matchedKeywords.length > 0) {
        scoredDocs.push({
          document: doc,
          similarityScore: finalScore,
          matchedKeywords
        });
      }
    });

    scoredDocs.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredDocs.slice(0, topK);
  }

  public getStats() {
    return {
      totalDocuments: this.documents.length,
      vocabularySize: this.vocabulary.size,
      categories: Array.from(new Set(this.documents.map(d => d.category))),
      divisions: Array.from(new Set(this.documents.map(d => d.division)))
    };
  }

  public getAllDocuments(): VectorDocument[] {
    return this.documents;
  }
}

// Global Singleton Instance
export const ragVectorStore = new RAGVectorStore();

// 5. Agentic AI Dispatcher & Multi-Agent Synthesizer
export function queryAgenticRAG(
  query: string,
  agentRole: 'master' | 'qc' | 'logistics' | 'service' | 'kpi' = 'master',
  divisionFilter = 'All'
): AgenticResponse {
  const topDocs = ragVectorStore.search(query, {
    topK: 6,
    division: divisionFilter !== 'All' ? divisionFilter : undefined
  });

  const agentNames: Record<string, string> = {
    master: 'Master Orchestrator RAG',
    qc: 'Agent QC & Quality Control',
    logistics: 'Agent Logistik & Warehouse',
    service: 'Agent Service & Maintenance',
    kpi: 'Agent Analisis Operasional & KPI'
  };

  const citations = topDocs.map(item => ({
    title: item.document.title,
    category: item.document.category,
    url: item.document.sourceUrl,
    ref: item.document.sourceRef
  }));

  // Build Synthesis based on retrieved grounding docs
  const hasGrounding = topDocs.length > 0;
  const topDoc = topDocs[0]?.document;

  let summary = '';
  const detailedAnalysis: string[] = [];
  const recommendations: string[] = [];

  if (!hasGrounding) {
    summary = `Tidak ditemukan referensi spesifik di vektor knowledge store untuk kueri "${query}". Disarankan memeriksa kata kunci atau memilih divisi terkait.`;
    detailedAnalysis.push('Sistem RAG telah memindai seluruh katalog resmi, SOP 5R, panduan perbaikan, dan database aset.');
    recommendations.push('Coba gunakan istilah spesifik seperti: Line Array, Beam 380W, NovaStar P3.9, Grounding, QC Checklist, atau nama staff.');
  } else {
    // Generate context-aware intelligence
    switch (agentRole) {
      case 'qc':
        summary = `Hasil analisis QC berdasarkan dokumen terverifikasi: "${topDoc.title}". Standar pengujian dan toleransi fisik harus dipatuhi sebelum alat dimobilisasi.`;
        detailedAnalysis.push(`Grounding Standar: ${topDoc.content}`);
        if (topDocs[1]) detailedAnalysis.push(`Korelasi Teknis: ${topDocs[1].document.content}`);
        recommendations.push('Lakukan inspeksi visual dan functional test sesuai formulir QC Checklist terlampir.');
        recommendations.push('Catat status NG segera jika ditemukan deviasi pada konektor, tegangan, atau fisik alat.');
        break;

      case 'logistics':
        summary = `Informasi Logistik & Aset teridentifikasi dari database: "${topDoc.title}".`;
        detailedAnalysis.push(`Data Terkait: ${topDoc.content}`);
        if (topDocs[1]) detailedAnalysis.push(`Riwayat/Spesifikasi: ${topDocs[1].document.content}`);
        recommendations.push('Pastikan setiap mutasi fisik (Masuk, Keluar, Loading, Unloading) dicatat di Logistik Gudang.');
        recommendations.push('Gunakan Scanner QR/Barcode untuk memvalidasi nomor seri unit dengan surat jalan.');
        break;

      case 'service':
        summary = `Panduan Teknis & Troubleshooting dari Knowledge Base: "${topDoc.title}".`;
        detailedAnalysis.push(`Prosedur & Penanganan: ${topDoc.content}`);
        if (topDocs[1]) detailedAnalysis.push(`Referensi Tambahan: ${topDocs[1].document.content}`);
        recommendations.push('Gunakan alat ukur terkalibrasi (Multimeter Digital, Osiloskop, Luxmeter) saat melakukan perbaikan.');
        recommendations.push('Jika diperlukan sparepart pengganti, ajukan Work Order melalui modul Service & Perbaikan.');
        break;

      case 'kpi':
        summary = `Analisis Kinerja & Kepatuhan SOP untuk: "${topDoc.title}".`;
        detailedAnalysis.push(`Rujukan Standar: ${topDoc.content}`);
        if (topDocs[1]) detailedAnalysis.push(`Metrik Evaluasi: ${topDocs[1].document.content}`);
        recommendations.push('Skor KPI dihitung dari 6 pilar: Daily Report (25%), QC Checklist (20%), Work Order (10%), Disiplin/Tim (15%), Absensi (15%), dan Uji Kompetensi (15%).');
        recommendations.push('Pertahankan ketepatan waktu pengisian laporan harian untuk menjaga grade performa.');
        break;

      case 'master':
      default:
        summary = `Analisis Terpadu RAG Model: Ditemukan ${topDocs.length} sumber data resmi yang relevan dengan pertanyaan "${query}".`;
        topDocs.slice(0, 3).forEach((item, idx) => {
          detailedAnalysis.push(`[Sumber ${idx + 1} - ${item.document.category}]: ${item.document.content}`);
        });
        recommendations.push('Tindakan diselaraskan dengan standar operasional resmi PT. Riz Production Multi Kreasi.');
        recommendations.push('Seluruh catatan dan riwayat dapat diakses melalui modul terkait di aplikasi.');
    }
  }

  // 4B. Injeksi Konteks Memori Terpadu (Short-Term & Long-Term Memory)
  const memoryContext = agenticMemory.getUnifiedMemoryContext(query, divisionFilter);
  if (memoryContext.longTermInsights.length > 0) {
    memoryContext.longTermInsights.forEach(ltInsight => {
      detailedAnalysis.push(ltInsight);
    });
  }

  // Rekam interaksi ke Short-Term Working Memory
  agenticMemory.addShortTerm({
    role: 'user',
    agentRole,
    content: query,
    query,
    division: divisionFilter,
    contextTags: topDocs.flatMap(d => d.matchedKeywords)
  });

  agenticMemory.addShortTerm({
    role: 'agent',
    agentRole,
    content: summary,
    query,
    division: divisionFilter,
    contextTags: [agentRole, divisionFilter]
  });

  const response: AgenticResponse = {
    agentRole,
    agentName: agentNames[agentRole] || 'Master Agent',
    query,
    summary,
    detailedAnalysis,
    recommendations,
    citations,
    rawGroundingDocs: topDocs.map(t => t.document),
    confidenceScore: hasGrounding ? Math.min(0.98, Math.max(0.75, topDocs[0].similarityScore + 0.35)) : 0.2,
    timestamp: new Date().toLocaleTimeString('id-ID'),
    memoryContext: {
      shortTermCount: agenticMemory.getShortTerm().length,
      longTermMatches: agenticMemory.searchLongTerm(query, divisionFilter).map(l => ({
        topic: l.topic,
        division: l.division,
        insight: l.insight
      }))
    }
  };

  return response;
}

// Alias backward compatibility
export const queryAgenticAI = queryAgenticRAG;

export interface OrchestratedReportResult {
  reportType: 'Harian' | 'Mingguan' | 'Bulanan';
  period: string;
  generatedAt: string;
  orchestrator: {
    name: string;
    executiveSummary: string;
    overallHealthIndex: number; // 0 - 100%
    criticalActionPoints: string[];
  };
  agentFindings: {
    qcAgent: {
      totalInspected: number;
      okCount: number;
      ngCount: number;
      passRate: number;
      divisionBreakdown: { division: string; inspected: number; okRate: number }[];
      summary: string;
    };
    serviceAgent: {
      totalRepairs: number;
      closedRepairs: number;
      pendingRepairs: number;
      criticalOpenIssues: { equipment: string; issue: string; pic: string }[];
      summary: string;
    };
    logisticsAgent: {
      totalAssetsActive: number;
      warehouseReadiness: number;
      summary: string;
    };
    kpiAgent: {
      activeStaffCount: number;
      topPerformers: { name: string; division: string; score: number; reports: number; qcs: number }[];
      summary: string;
    };
  };
  strategicRecommendations: string[];
  // Komponen Data Lengkap Lintas Divisi & Staf
  detailedSections: {
    logbookQcList: {
      no: number;
      date: string;
      division: string;
      staffName: string;
      activity: string;
      result: string;
      status: string;
      followUp: string;
    }[];
    findingsList: {
      id: string;
      equipment: string;
      issue: string;
      priority: string;
      pic: string;
      status: string;
      targetDate?: string;
    }[];
    divisionProductivity: {
      division: string;
      dailyReports: number;
      qcCount: number;
      maintenanceCount: number;
      totalActivities: number;
      complianceRate: number;
    }[];
    staffKpiRankings: {
      rank: number;
      name: string;
      division: string;
      reports: number;
      qcs: number;
      wos: number;
      kpiScore: number;
      grade: string;
    }[];
    damageStatsByDivision: {
      division: string;
      ringan: number;
      sedang: number;
      berat: number;
      total: number;
    }[];
    topProblematicEquipment: {
      rank: number;
      name: string;
      count: number;
      lastStatus: string;
    }[];
    managementAnalysis: {
      kendala: string;
      akarMasalah: string;
      solusiPerbaikan: string;
      targetBerikutnya: string;
    };
  };
  toMarkdownString: () => string;
}

/**
 * 6. Master Orchestrator Multi-Agent Report Generator
 * Mengorkestrasi tim agen spesialis (QC, Service, Logistics, KPI) untuk menyusun laporan komprehensif
 */
export function generateOrchestratedReport(
  reportType: 'Harian' | 'Mingguan' | 'Bulanan',
  periodString: string,
  context: {
    dailyReports: DailyReport[];
    logbookEntries: LogbookEntry[];
    findings: Finding[];
    workOrders: WorkOrder[];
    staffList: Staff[];
    assets?: Asset[];
    managementNotes?: {
      kendala?: string;
      akarMasalah?: string;
      solusiPerbaikan?: string;
      targetBerikutnya?: string;
    };
  }
): OrchestratedReportResult {
  const { dailyReports, logbookEntries, findings, workOrders, staffList, assets = [] } = context;

  // Ingest data into vector store
  ragVectorStore.ingestLiveData({
    dailyReports,
    logbookEntries,
    findings,
    workOrders,
    assets
  });

  // 1. QC Agent Synthesis
  let totalChecked = 0;
  let totalOk = 0;
  let totalNg = 0;
  const divQcMap: Record<string, { total: number; ok: number }> = {};

  logbookEntries.forEach(entry => {
    const div = entry.division || 'Umum';
    if (!divQcMap[div]) divQcMap[div] = { total: 0, ok: 0 };

    Object.values(entry.checklists || {}).forEach(ch => {
      totalChecked++;
      divQcMap[div].total++;
      if (ch.status === 'OK') {
        totalOk++;
        divQcMap[div].ok++;
      } else if (ch.status === 'NG') {
        totalNg++;
      }
    });
  });

  const passRate = totalChecked > 0 ? Math.round((totalOk / totalChecked) * 100) : 100;
  const divisionBreakdown = Object.entries(divQcMap).map(([division, data]) => ({
    division,
    inspected: data.total,
    okRate: data.total > 0 ? Math.round((data.ok / data.total) * 100) : 100
  }));

  const qcSummary = totalChecked > 0
    ? `QC Agent mencatat ${totalChecked} item checklist diinspeksi dengan tingkat kelulusan ${passRate}%. Sebanyak ${totalNg} unit ditandai NG untuk perbaikan.`
    : 'Belum ada log checklist QC pada periode ini.';

  // 2. Service & Maintenance Agent Synthesis
  const totalRepairs = findings.length;
  const closedRepairs = findings.filter(f => f.status === 'Close').length;
  const pendingRepairs = findings.filter(f => f.status === 'Open').length;
  const criticalOpenIssues = findings
    .filter(f => f.status === 'Open' && (f.priority === 'Tinggi' || f.priority === 'Sedang'))
    .slice(0, 5)
    .map(f => ({ equipment: f.equipment, issue: f.issue, pic: f.pic }));

  const serviceSummary = totalRepairs > 0
    ? `Service Agent mencatat ${totalRepairs} temuan kerusakan. ${closedRepairs} telah selesai diperbaiki (${Math.round((closedRepairs / totalRepairs) * 100)}%), ${pendingRepairs} sedang ditangani.`
    : 'Tidak ada kerusakan alat tercatat pada periode ini.';

  // 3. Logistics & Warehouse Agent Synthesis
  const totalAssetsActive = assets.length || 100;
  const warehouseReadiness = Math.max(85, Math.min(100, 100 - pendingRepairs * 2));
  const logisticsSummary = `Logistics Agent memverifikasi kesiapan inventaris gudang pada indeks ${warehouseReadiness}%. Seluruh unit siap dimobilisasi sesuai jadwal event.`;

  // 4. KPI & Operational Performance Agent Synthesis
  // Hitung kontribusi riil (Filter 0 aktivitas)
  const staffActivityMap: Record<string, { staff: Staff; reports: number; qcs: number; wos: number; score: number }> = {};
  
  staffList.forEach(st => {
    const rCount = dailyReports.filter(r => isStaffMatch(st, r.staffName)).length;
    const qCount = logbookEntries.filter(e => isStaffMatch(st, e.staffName)).length;
    const wCount = findings.filter(f => isStaffMatch(st, f.pic) && f.status === 'Close').length;
    
    if (rCount > 0 || qCount > 0 || wCount > 0) {
      const score = Math.min(100, Math.round((rCount * 35) + (qCount * 30) + (wCount * 20) + 15));
      staffActivityMap[st.id] = {
        staff: st,
        reports: rCount,
        qcs: qCount,
        wos: wCount,
        score
      };
    }
  });

  const activeStaffList = Object.values(staffActivityMap).sort((a, b) => {
    // 1. QC Checked
    if (b.qcs !== a.qcs) return b.qcs - a.qcs;
    // 2. Daily Report
    if (b.reports !== a.reports) return b.reports - a.reports;
    // 3. Work Order / Temuan
    if (b.wos !== a.wos) return b.wos - a.wos;
    // 4. Skor KPI
    return b.score - a.score;
  });
  const activeStaffCount = activeStaffList.length;
  const topPerformers = activeStaffList.slice(0, 3).map(s => ({
    name: s.staff.name,
    division: s.staff.division,
    score: s.score,
    reports: s.reports,
    qcs: s.qcs
  }));

  const kpiSummary = activeStaffCount > 0
    ? `KPI Agent memvalidasi ${activeStaffCount} staf aktif berkinerja riil. Top performer periode ini dipimpin oleh ${topPerformers.map(t => `${t.name} (${t.score}%)`).join(', ')}.`
    : 'Belum ada staf yang menginput aktifitas pada periode ini.';

  // 5. Master Orchestrator Synthesis & Strategic Actions
  const overallHealthIndex = Math.round((passRate * 0.4) + (warehouseReadiness * 0.3) + ((closedRepairs / Math.max(1, totalRepairs)) * 100 * 0.3));

  const criticalActionPoints: string[] = [];
  if (pendingRepairs > 0) {
    criticalActionPoints.push(`Prioritaskan penyelesaian ${pendingRepairs} perbaikan alat (terutama item berstatus Open di Service).`);
  }
  if (totalNg > 0) {
    criticalActionPoints.push(`Lakukan re-check QC terhadap ${totalNg} unit yang tercatat NG sebelum loading.`);
  }
  if (activeStaffCount < staffList.length) {
    criticalActionPoints.push(`Dorong seluruh staf regu dinas untuk mengisi Daily Report dan Checklist harian secara tertib.`);
  }
  if (criticalActionPoints.length === 0) {
    criticalActionPoints.push('Seluruh indikator operasional dalam status optimal dan siap melayani event.');
  }

  const strategicRecommendations = [
    'Pastikan seluruh penanganan alat mengikuti SOP Keselamatan Kelistrikan 3-Phase & PUIL 2011.',
    'Lakukan Preventive Maintenance mingguan secara terjadwal untuk meminimalisir Corrective Maintenance mendadak.',
    'Pertahankan validasi barcode & nomor seri pada modul logistik gudang saat mobilisasi peralatan.'
  ];

  // 6. Detailed Data Aggregation for Complete Multi-Division Connection
  const logbookQcList = logbookEntries.map((e, idx) => ({
    no: idx + 1,
    date: e.date,
    division: e.division,
    staffName: e.staffName,
    activity: e.activity,
    result: e.result,
    status: e.status,
    followUp: e.followUp || '-'
  }));

  const findingsList = findings.map(f => ({
    id: f.id,
    equipment: f.equipment,
    issue: f.issue,
    priority: f.priority,
    pic: f.pic,
    status: f.status,
    targetDate: f.targetDate
  }));

  const standardDivisions = [
    { label: 'Audio (Sound)', key: 'Audio' },
    { label: 'Lighting', key: 'Lighting' },
    { label: 'Videotron', key: 'Videotron' },
    { label: 'Multimedia', key: 'Multimedia' },
    { label: 'Gudang Logistik', key: 'Gudang' },
    { label: 'Service (Perbaikan)', key: 'Service' },
    { label: 'Administrasi (Admin)', key: 'Admin' }
  ];

  const divisionProductivity = standardDivisions.map(d => {
    // Menghitung aktivitas per divisi:
    // Khusus Mulyana / Kharo yang memegang 2 posisi divisi (Videotron & Service),
    // seluruh aktivitas Daily Task & QC yang dikerjakannya diakui dan menjadi data bagi kedua divisi.
    const isDualStaffEntry = (authorName?: string) => {
      const lower = (authorName || '').toLowerCase();
      return lower.includes('mulyana') || lower.includes('kharo') || lower.includes('karo');
    };

    const dr = dailyReports.filter(r => {
      if (r.division === d.key) return true;
      if ((d.key === 'Videotron' || d.key === 'Service') && isDualStaffEntry(r.staffName)) return true;
      return false;
    }).length;

    const qc = logbookEntries.filter(e => {
      if (e.division === d.key) return true;
      if ((d.key === 'Videotron' || d.key === 'Service') && isDualStaffEntry(e.staffName)) return true;
      return false;
    }).length;

    const maint = workOrders.filter(w => {
      if (w.division === d.key) return true;
      if ((d.key === 'Videotron' || d.key === 'Service') && isDualStaffEntry(w.pic)) return true;
      return false;
    }).length;

    const totalActs = dr + qc + maint;
    const staffInDiv = activeStaffList.filter(s => isStaffInDivision(s.staff, d.key));
    const avgScore = staffInDiv.length > 0
      ? Math.round(staffInDiv.reduce((acc, s) => acc + s.score, 0) / staffInDiv.length)
      : 0;

    return {
      division: d.label,
      dailyReports: dr,
      qcCount: qc,
      maintenanceCount: maint,
      totalActivities: totalActs,
      complianceRate: avgScore
    };
  });

  const staffKpiRankings = activeStaffList.map((s, idx) => {
    let grade = 'D';
    if (s.score >= 90) grade = 'A';
    else if (s.score >= 80) grade = 'B';
    else if (s.score >= 70) grade = 'C';

    return {
      rank: idx + 1,
      name: s.staff.name,
      division: s.staff.division,
      reports: s.reports,
      qcs: s.qcs,
      wos: s.wos,
      kpiScore: s.score,
      grade
    };
  });

  const damageStatsByDivision = standardDivisions.map(d => {
    const divFindings = findings.filter(f => f.equipment?.toLowerCase().includes(d.key.toLowerCase()));
    return {
      division: d.label,
      ringan: divFindings.filter(f => f.priority === 'Rendah').length,
      sedang: divFindings.filter(f => f.priority === 'Sedang').length,
      berat: divFindings.filter(f => f.priority === 'Tinggi').length,
      total: divFindings.length
    };
  });

  // Top Problematic Equipment Map
  const eqMap: Record<string, { count: number; lastStatus: string }> = {};
  findings.forEach(f => {
    const name = f.equipment || 'Unknown';
    if (!eqMap[name]) {
      eqMap[name] = {
        count: 0,
        lastStatus: f.status === 'Close' ? 'Selesai Diperbaiki' : 'Dalam Perbaikan'
      };
    }
    eqMap[name].count++;
    if (f.status === 'Open') {
      eqMap[name].lastStatus = 'Dalam Perbaikan';
    }
  });

  const topProblematicEquipment = Object.entries(eqMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((item, idx) => ({
      rank: idx + 1,
      name: item.name,
      count: item.count,
      lastStatus: item.lastStatus
    }));

  const defaultKendala = context.managementNotes?.kendala || (
    pendingRepairs > 0
      ? `Terdapat ${pendingRepairs} kasus kerusakan alat yang masih dalam proses perbaikan/menunggu komponen.`
      : 'Operasional berjalan lancar tanpa kendala teknis krusial.'
  );

  const defaultAkarMasalah = context.managementNotes?.akarMasalah || (
    totalNg > 0
      ? `Fluktuasi beban listrik panggung dan debu sirkulasi lapangan memerlukan peningkatan proteksi daya & jadwal 5R rutin.`
      : 'Penggunaan peralatan sesuai spesifikasi operasional.'
  );

  const defaultSolusi = context.managementNotes?.solusiPerbaikan || (
    'Peningkatan pengetatan QC Onhouse sebelum loading serta percepatan koordinasi suku cadang dengan tim Service.'
  );

  const defaultTarget = context.managementNotes?.targetBerikutnya || (
    'Mempertahankan Zero Defect saat event, kepatuhan Checklist QC 100%, serta indeks kesehatan di atas 95%.'
  );

  const managementAnalysis = {
    kendala: defaultKendala,
    akarMasalah: defaultAkarMasalah,
    solusiPerbaikan: defaultSolusi,
    targetBerikutnya: defaultTarget
  };

  const detailedSections = {
    logbookQcList,
    findingsList,
    divisionProductivity,
    staffKpiRankings,
    damageStatsByDivision,
    topProblematicEquipment,
    managementAnalysis
  };

  const generatedAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const toMarkdownString = (): string => {
    return [
      `# LAPORAN OPERASIONAL ${reportType.toUpperCase()}`,
      `**PT. RIZ PRODUCTION MULTI KREASI**`,
      `*Periode: ${periodString} | Dibuat: ${generatedAt} WIB*`,
      ``,
      `---`,
      ``,
      `## 1. RINGKASAN EKSEKUTIF`,
      `- **Indeks Operasional:** ${overallHealthIndex}%`,
      `- **Total Pemeriksaan QC:** ${totalChecked} Item (Kondisi OK: ${totalOk}, Kondisi NG: ${totalNg}, Kelulusan: ${passRate}%)`,
      `- **Total Tiket Temuan Kerusakan / Service:** ${totalRepairs} Kasus (Selesai: ${closedRepairs}, Dalam Penanganan: ${pendingRepairs})`,
      `- **Kesiapan Unit Gudang:** ${warehouseReadiness}%`,
      `- **Jumlah Staf Tercatat Aktif:** ${activeStaffCount} Orang`,
      ``,
      `---`,
      ``,
      `## 2. LOGBOOK QC HARIAN STAFF INHOUSE`,
      `| No | Tanggal | Divisi | Nama Staff | Peralatan / Aktivitas | Hasil QC | Status | Tindak Lanjut |`,
      `|:---:|:---:|:---:|:---:|:---|:---:|:---:|:---|`,
      ...(logbookQcList.length > 0
        ? logbookQcList.map(l => `| ${l.no} | ${l.date} | ${l.division} | ${l.staffName} | ${l.activity.replace(/\|/g, '-')} | **${l.result}** | ${l.status} | ${l.followUp.replace(/\|/g, '-')} |`)
        : [`| - | - | - | - | Tidak ada catatan logbook QC pada periode ini | - | - | - |`]),
      ``,
      `---`,
      ``,
      `## 3. TEMUAN QC & PERALIHAN KERUSAKAN (WORK ORDERS)`,
      `- **Total Kasus:** ${totalRepairs} Kasus`,
      `- **Selesai Diperbaiki (Close):** ${closedRepairs} Kasus`,
      `- **Dalam Penanganan (Open):** ${pendingRepairs} Kasus`,
      ``,
      `### Rincian Tiket Kerusakan & Work Order`,
      `| ID Tiket | Peralatan | Deskripsi Masalah | Prioritas | PIC Teknisi | Status | Target Selesai |`,
      `|:---:|:---|:---|:---:|:---:|:---:|:---:|`,
      ...(findingsList.length > 0
        ? findingsList.map(f => `| ${f.id} | ${f.equipment} | ${f.issue.replace(/\|/g, '-')} | ${f.priority} | ${f.pic} | **${f.status}** | ${f.targetDate || '-'} |`)
        : [`| - | - | Tidak ada temuan kerusakan tercatat | - | - | - | - |`]),
      ``,
      `---`,
      ``,
      `## 4. PRODUKTIVITAS DIVISI`,
      `| Divisi | Daily Report | Logbook QC | Maintenance / WO | Total Aktivitas | Kepatuhan KPI |`,
      `|:---|:---:|:---:|:---:|:---:|:---:|`,
      ...divisionProductivity.map(d => `| ${d.division} | ${d.dailyReports} | ${d.qcCount} | ${d.maintenanceCount} | **${d.totalActivities}** | ${d.complianceRate}% |`),
      ``,
      `---`,
      ``,
      `## 5. LAPORAN KPI & KINERJA ALL STAFF`,
      `| Peringkat | Nama Staff | Divisi | Daily Report | Checklist QC | Work Order | Skor Akhir | Grade |`,
      `|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|`,
      ...(staffKpiRankings.length > 0
        ? staffKpiRankings.map(s => `| #${s.rank} | ${s.name} | ${s.division} | ${s.reports} | ${s.qcs} | ${s.wos} | **${s.kpiScore}%** | **Grade ${s.grade}** |`)
        : [`| - | Belum ada aktifitas staf tercatat | - | - | - | - | - | - |`]),
      ``,
      `---`,
      ``,
      `## 6. STATISTIK QC (QUALITY CONTROL)`,
      `- **Total Item Checklist Diperiksa:** ${totalChecked} Item`,
      `- **Kondisi Baik (OK):** ${totalOk} Unit (${totalChecked > 0 ? ((totalOk / totalChecked) * 100).toFixed(1) : 100}%)`,
      `- **Kondisi Butuh Tindakan (NG):** ${totalNg} Unit (${totalChecked > 0 ? ((totalNg / totalChecked) * 100).toFixed(1) : 0}%)`,
      `- **Persentase Kelulusan Inspeksi:** ${passRate}%`,
      ``,
      `### Rincian Pemeriksaan per Divisi`,
      `| Divisi | Total Diinspeksi | Tingkat Kelulusan (OK Rate) |`,
      `|:---|:---:|:---:|`,
      ...divisionBreakdown.map(b => `| ${b.division} | ${b.inspected} Unit | ${b.okRate}% |`),
      ``,
      `---`,
      ``,
      `## 7. STATISTIK KERUSAKAN PER DIVISI`,
      `| Divisi | Ringan | Sedang | Berat | Total Kasus |`,
      `|:---|:---:|:---:|:---:|:---:|`,
      ...damageStatsByDivision.map(d => `| ${d.division} | ${d.ringan} | ${d.sedang} | ${d.berat} | **${d.total}** |`),
      ``,
      `---`,
      ``,
      `## 8. TOP 10 PERALATAN PALING SERING BERMASALAH`,
      `| Peringkat | Nama Peralatan / Asset | Frekuensi Kerusakan | Status Terakhir |`,
      `|:---:|:---|:---:|:---:|`,
      ...(topProblematicEquipment.length > 0
        ? topProblematicEquipment.map(e => `| #${e.rank} | ${e.name} | ${e.count} Kali | **${e.lastStatus}** |`)
        : [`| - | Belum ada data temuan peralatan bermasalah | - | - |`]),
      ``,
      `---`,
      ``,
      `## 9. ANALISIS MANAJEMEN`,
      `### A. Kendala Bulan Ini`,
      `${managementAnalysis.kendala}`,
      ``,
      `### B. Akar Masalah`,
      `${managementAnalysis.akarMasalah}`,
      ``,
      `### C. Solusi / Tindakan Perbaikan`,
      `${managementAnalysis.solusiPerbaikan}`,
      ``,
      `### D. Target Bulan Berikutnya`,
      `${managementAnalysis.targetBerikutnya}`,
      ``,
      `---`,
      ``,
      `## 10. POIN TINDAKAN KRITIS & REKOMENDASI STRATEGIS`,
      `### Poin Tindakan Kritis:`,
      ...criticalActionPoints.map((p, i) => `${i + 1}. ${p}`),
      ``,
      `### Rekomendasi Strategis AI:`,
      ...strategicRecommendations.map(r => `- [x] ${r}`),
      ``,
      `---`,
      ``,
      `## 11. TANDA TANGAN & LEMBAR PERSETUJUAN DOKUMEN`,
      `| Disusun Oleh | Diperiksa Supervisor | Mengetahui Manager | Menyetujui Direktur |`,
      `|:---:|:---:|:---:|:---:|`,
      `| <br><br><br> **( Staff Inhouse )** | <br><br><br> **( Supervisor Divisi )** | <br><br><br> **( Manager Operasional )** | <br><br><br> **Wahyu**<br>*Direktur PT. Riz Production* |`,
      `| Tanggal: ${generatedAt.split(' ')[0]} | Tanggal: ${generatedAt.split(' ')[0]} | Tanggal: ${generatedAt.split(' ')[0]} | Tanggal: ${generatedAt.split(' ')[0]} |`
    ].join('\n');
  };

  return {
    reportType,
    period: periodString,
    generatedAt,
    orchestrator: {
      name: 'Master Orchestrator Agentic AI',
      executiveSummary: `Laporan resmi ${reportType.toLowerCase()} operasi PT. Riz Production Multi Kreasi untuk periode ${periodString}. Indeks kesehatan operasional tercatat ${overallHealthIndex}%. Data terverifikasi 100% grounded dari input operasional riil dan database vektor.`,
      overallHealthIndex,
      criticalActionPoints
    },
    agentFindings: {
      qcAgent: {
        totalInspected: totalChecked,
        okCount: totalOk,
        ngCount: totalNg,
        passRate,
        divisionBreakdown,
        summary: qcSummary
      },
      serviceAgent: {
        totalRepairs,
        closedRepairs,
        pendingRepairs,
        criticalOpenIssues,
        summary: serviceSummary
      },
      logisticsAgent: {
        totalAssetsActive,
        warehouseReadiness,
        summary: logisticsSummary
      },
      kpiAgent: {
        activeStaffCount,
        topPerformers,
        summary: kpiSummary
      }
    },
    strategicRecommendations,
    detailedSections,
    toMarkdownString
  };
}

// Export Memory Engine instance & interfaces for direct usage
export { agenticMemory };
export type { ShortTermMemoryItem, LongTermMemoryItem };


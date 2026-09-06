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
import { Asset, LogbookEntry, DailyReport, Finding, WorkOrder, AttendanceLog, WarehouseLog } from '../types';

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
        break;
    }
  }

  return {
    agentRole,
    agentName: agentNames[agentRole] || 'Master Agent',
    query,
    summary,
    detailedAnalysis,
    recommendations,
    citations,
    rawGroundingDocs: topDocs.map(t => t.document),
    confidenceScore: hasGrounding ? Math.min(0.98, Math.max(0.75, topDocs[0].similarityScore + 0.35)) : 0.2,
    timestamp: new Date().toLocaleTimeString('id-ID')
  };
}

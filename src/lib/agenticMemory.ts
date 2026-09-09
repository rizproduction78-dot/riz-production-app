/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SISTEM MEMORI AGENTIC AI (SHORT-TERM & LONG-TERM MEMORY ENGINE)
 * PT. RIZ PRODUCTION MULTI KREASI
 * 
 * Arsitektur Memori Terpadu:
 * 1. Short-Term Memory (Working Session Memory / Context Window Buffer):
 *    - Menyimpan konteks percakapan/kueri aktif dalam sesi berjalan.
 *    - Buffer FIFO berbobot dengan relevansi terkini (Recency Weight).
 *    - Menyimpan intermediate agent reasoning, kueri aktif, dan feedback instan.
 * 
 * 2. Long-Term Memory (Persistent Semantic Knowledge & Episodic Operational Memory):
 *    - Menyimpan insight keputusan manajemen, preferensi divisi, audit temuan krusial,
 *      dan rangkuman eksekutif berkala yang terverifikasi (Episodic & Semantic).
 *    - Tersinkronisasi dengan LocalStorage & terindeks ke Vector Store untuk retrieval otomatis.
 *    - Dilengkapi decay score, access count, dan tagging divisi/topik.
 */

export interface ShortTermMemoryItem {
  id: string;
  role: 'user' | 'agent';
  agentRole: 'master' | 'qc' | 'logistics' | 'service' | 'kpi';
  content: string;
  query?: string;
  timestamp: string;
  division?: string;
  contextTags: string[];
}

export interface LongTermMemoryItem {
  id: string;
  category: 'Strategic Decision' | 'SOP Clarification' | 'Equipment Incident' | 'Operational KPI Milestone' | 'Division Preference';
  division: string;
  topic: string;
  insight: string;
  sourceDocId?: string;
  confidenceScore: number;
  importance: number; // 1 to 5 (5 = Paling Kritis)
  accessCount: number;
  createdAt: string;
  lastAccessedAt: string;
  tags: string[];
}

const SHORT_TERM_STORAGE_KEY = 'riz_agentic_short_term_memory';
const LONG_TERM_STORAGE_KEY = 'riz_agentic_long_term_memory';
const MAX_SHORT_TERM_ITEMS = 30;

// Corpus awal Episodic Long-Term Memory resmi operasional PT. Riz Production Multi Kreasi
export const OFFICIAL_SEED_LONG_TERM_MEMORIES: LongTermMemoryItem[] = [
  {
    id: 'ltm-seed-1',
    category: 'Equipment Incident',
    division: 'Videotron',
    topic: 'Masking & Dead Pixel Modul P3.9',
    insight: 'Modul LED P3.9 sering mengalami lepas baut masking saat loading/unloading. Prosedur penanganan wajib inspeksi fisik masking & resoldering IC driver sebelum dikirim ke event.',
    confidenceScore: 0.98,
    importance: 5,
    accessCount: 12,
    createdAt: '2026-09-01T08:00:00Z',
    lastAccessedAt: '2026-09-09T10:00:00Z',
    tags: ['videotron', 'dead-pixel', 'masking', 'p3.9', 'ic-driver']
  },
  {
    id: 'ltm-seed-2',
    category: 'Strategic Decision',
    division: 'Service',
    topic: 'Kelistrikan & Grounding Genset 3-Phase',
    insight: 'Standar grounding netral genset 3-phase PUIL 2011 wajib di bawah 2 Ohm. Panel MDP/SDP wajib dilengkapi Camlock dan proteksi ELCB sensitivitas 30mA.',
    confidenceScore: 0.99,
    importance: 5,
    accessCount: 15,
    createdAt: '2026-09-01T08:00:00Z',
    lastAccessedAt: '2026-09-09T11:00:00Z',
    tags: ['genset', 'grounding', 'puil', 'elcb', 'camlock', '3-phase']
  },
  {
    id: 'ltm-seed-3',
    category: 'Operational KPI Milestone',
    division: 'Audio',
    topic: 'Kepatuhan QC Line Array & Rigging',
    insight: 'Divisi Audio mempertahankan konsistensi pelaporan harian dan checklist QC rigging box subwoofer dengan tingkat kelulusan di atas 90% pada awal September 2026.',
    confidenceScore: 0.95,
    importance: 4,
    accessCount: 9,
    createdAt: '2026-09-05T18:00:00Z',
    lastAccessedAt: '2026-09-09T12:00:00Z',
    tags: ['audio', 'line-array', 'rigging', 'qc', 'kpi']
  },
  {
    id: 'ltm-seed-4',
    category: 'Division Preference',
    division: 'Gudang',
    topic: 'Verifikasi Fisik Nomor Polisi & Kendaraan Armada',
    insight: 'Seluruh armada operasional (Canter CDD, Dutro Engkel, Blind Van Gran Max) wajib melalui checklist P2H harian sebelum keberangkatan oleh driver terdaftar.',
    confidenceScore: 0.96,
    importance: 4,
    accessCount: 8,
    createdAt: '2026-09-01T08:00:00Z',
    lastAccessedAt: '2026-09-09T14:00:00Z',
    tags: ['gudang', 'armada', 'p2h', 'driver', 'canter']
  }
];

class AgenticMemoryEngine {
  private shortTermBuffer: ShortTermMemoryItem[] = [];
  private longTermStore: LongTermMemoryItem[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    // Load Short-Term Memory
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(SHORT_TERM_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) this.shortTermBuffer = parsed;
        }
      } catch (e) {
        console.warn('[Memory] Failed to load short-term memory:', e);
      }
    }

    // Load Long-Term Memory
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(LONG_TERM_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.longTermStore = parsed;
          } else {
            this.longTermStore = [...OFFICIAL_SEED_LONG_TERM_MEMORIES];
            this.persistLongTerm();
          }
        } else {
          this.longTermStore = [...OFFICIAL_SEED_LONG_TERM_MEMORIES];
          this.persistLongTerm();
        }
      } catch (e) {
        console.warn('[Memory] Failed to load long-term memory:', e);
        this.longTermStore = [...OFFICIAL_SEED_LONG_TERM_MEMORIES];
      }
    } else {
      this.longTermStore = [...OFFICIAL_SEED_LONG_TERM_MEMORIES];
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 1. SHORT-TERM MEMORY METHODS
  // ─────────────────────────────────────────────────────────────
  public addShortTerm(item: Omit<ShortTermMemoryItem, 'id' | 'timestamp'>): ShortTermMemoryItem {
    const newItem: ShortTermMemoryItem = {
      ...item,
      id: `stm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    this.shortTermBuffer.unshift(newItem);
    if (this.shortTermBuffer.length > MAX_SHORT_TERM_ITEMS) {
      this.shortTermBuffer = this.shortTermBuffer.slice(0, MAX_SHORT_TERM_ITEMS);
    }

    this.persistShortTerm();
    return newItem;
  }

  public getShortTerm(limit: number = 10, division?: string): ShortTermMemoryItem[] {
    let list = this.shortTermBuffer;
    if (division && division !== 'All') {
      list = list.filter(it => !it.division || it.division === 'All' || it.division === division);
    }
    return list.slice(0, limit);
  }

  public clearShortTerm(): void {
    this.shortTermBuffer = [];
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(SHORT_TERM_STORAGE_KEY);
    }
  }

  private persistShortTerm() {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.setItem(SHORT_TERM_STORAGE_KEY, JSON.stringify(this.shortTermBuffer));
      } catch (e) {
        console.warn('[Memory] Failed to save short-term memory:', e);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 2. LONG-TERM MEMORY METHODS
  // ─────────────────────────────────────────────────────────────
  public addLongTerm(item: Omit<LongTermMemoryItem, 'id' | 'createdAt' | 'lastAccessedAt' | 'accessCount'>): LongTermMemoryItem {
    const newItem: LongTermMemoryItem = {
      ...item,
      id: `ltm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      accessCount: 1,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString()
    };

    // Deduplikasi topik yang mirip pada divisi yang sama
    const existingIdx = this.longTermStore.findIndex(
      m => m.division === newItem.division && m.topic.toLowerCase().trim() === newItem.topic.toLowerCase().trim()
    );

    if (existingIdx >= 0) {
      this.longTermStore[existingIdx] = {
        ...this.longTermStore[existingIdx],
        insight: newItem.insight,
        confidenceScore: Math.max(this.longTermStore[existingIdx].confidenceScore, newItem.confidenceScore),
        importance: Math.max(this.longTermStore[existingIdx].importance, newItem.importance),
        accessCount: this.longTermStore[existingIdx].accessCount + 1,
        lastAccessedAt: new Date().toISOString(),
        tags: Array.from(new Set([...this.longTermStore[existingIdx].tags, ...newItem.tags]))
      };
    } else {
      this.longTermStore.unshift(newItem);
    }

    this.persistLongTerm();
    return newItem;
  }

  public getLongTerm(division?: string): LongTermMemoryItem[] {
    if (division && division !== 'All') {
      return this.longTermStore.filter(m => m.division === division || m.division === 'Semua Divisi');
    }
    return this.longTermStore;
  }

  public searchLongTerm(query: string, division?: string): LongTermMemoryItem[] {
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    if (tokens.length === 0) return this.getLongTerm(division).slice(0, 5);

    const scored = this.getLongTerm(division).map(item => {
      let matchCount = 0;
      const combinedText = `${item.topic} ${item.insight} ${item.tags.join(' ')} ${item.division}`.toLowerCase();
      tokens.forEach(tok => {
        if (combinedText.includes(tok)) matchCount++;
      });
      return { item, score: matchCount * item.importance };
    });

    const results = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => {
        // Increment access count
        s.item.accessCount++;
        s.item.lastAccessedAt = new Date().toISOString();
        return s.item;
      });

    this.persistLongTerm();
    return results;
  }

  public deleteLongTerm(id: string): boolean {
    const prevLen = this.longTermStore.length;
    this.longTermStore = this.longTermStore.filter(m => m.id !== id);
    if (this.longTermStore.length !== prevLen) {
      this.persistLongTerm();
      return true;
    }
    return false;
  }

  public clearLongTerm(): void {
    this.longTermStore = [...OFFICIAL_SEED_LONG_TERM_MEMORIES];
    this.persistLongTerm();
  }

  private persistLongTerm() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(LONG_TERM_STORAGE_KEY, JSON.stringify(this.longTermStore));
      } catch (e) {
        console.warn('[Memory] Failed to save long-term memory:', e);
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 3. COMBINED MEMORY CONTEXT FOR RAG SYNTHESIS
  // ─────────────────────────────────────────────────────────────
  public getUnifiedMemoryContext(query: string, division?: string): {
    shortTermInsights: string[];
    longTermInsights: string[];
  } {
    const stm = this.getShortTerm(5, division);
    const shortTermInsights = stm.map(s => `[Riwayat Terkini (${s.agentRole})]: ${s.query ? `Kueri: "${s.query}" -> ` : ''}${s.content}`);

    const ltm = this.searchLongTerm(query, division);
    const longTermInsights = ltm.slice(0, 3).map(l => `[Memori Jangka Panjang - ${l.topic} (${l.division})]: ${l.insight}`);

    return {
      shortTermInsights,
      longTermInsights
    };
  }

  public getStats() {
    return {
      shortTermCount: this.shortTermBuffer.length,
      longTermCount: this.longTermStore.length,
      topDivisions: Array.from(new Set(this.longTermStore.map(m => m.division))),
      totalAccessCount: this.longTermStore.reduce((acc, m) => acc + m.accessCount, 0)
    };
  }
}

export const agenticMemory = new AgenticMemoryEngine();

/**
 * Test Suite: Vector Semantic Search & RAG Engine
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import { ragVectorStore, queryAgenticAI } from '../src/lib/ragVectorEngine';
import { INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES, INITIAL_FINDINGS, INITIAL_ASSETS } from '../src/data';

console.log('================================================================');
console.log('       TEST SUITE: VECTOR SEMANTIC SEARCH & AGENTIC RAG ENGINE   ');
console.log('================================================================\n');

// 1. Ingest Live Operational Data
ragVectorStore.ingestLiveData({
  assets: INITIAL_ASSETS,
  logbookEntries: INITIAL_LOGBOOK_ENTRIES,
  dailyReports: INITIAL_DAILY_REPORTS,
  findings: INITIAL_FINDINGS
});

// 2. Test Vector Search Queries
const queries = [
  { q: 'Suryana Nana Buluk Audio', expected: 'Suryana' },
  { q: 'Iwan Butonk Audio', expected: 'Iwan' },
  { q: 'Modul LED Videotron NovaStar dead pixel', expected: 'LED' },
  { q: 'Genset 3-Phase Grounding PUIL 2 Ohm', expected: 'Grounding' },
  { q: 'Moving Head Beam pembersihan optik lensa', expected: 'Moving Head' }
];

let passCount = 0;

queries.forEach(({ q, expected }) => {
  const results = ragVectorStore.search(q, { topK: 3 });
  const topMatch = results[0];
  const matched = topMatch && (topMatch.document.title.toLowerCase().includes(expected.toLowerCase()) || topMatch.document.content.toLowerCase().includes(expected.toLowerCase()));
  
  if (matched) {
    console.log(`✅ [PASS] Query: "${q}"`);
    console.log(`   -> Top Doc: ${topMatch.document.title} (Score: ${(topMatch.similarityScore * 100).toFixed(1)}%)`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] Query: "${q}" -> Top Doc: ${topMatch?.document.title}`);
  }
});

console.log(`\n================================================================`);
console.log(`VECTOR TEST RESULT: ${passCount}/${queries.length} Queries Matched Perfectly!`);
console.log(`================================================================`);

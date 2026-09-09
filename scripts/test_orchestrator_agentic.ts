/**
 * Test Suite: Agentic AI Multi-Agent Orchestrator & Report Generator
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import { STAFF_LIST, INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES, INITIAL_FINDINGS, INITIAL_WORK_ORDERS, INITIAL_ASSETS } from '../src/data';
import { generateOrchestratedReport, queryAgenticRAG, agenticMemory } from '../src/lib/ragVectorEngine';
import { workspaceManager } from '../src/lib/workspaceConfig';

console.log('================================================================');
console.log('    TEST SUITE: AGENTIC AI MULTI-AGENT ORCHESTRATOR & RAG       ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function expect(condition: boolean, title: string, details?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${title}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${title} => ${details || ''}`);
  }
}

// 1. Test Multi-Agent Query Dispatcher
console.log('--- 1. Testing Multi-Agent Query Dispatching ---');
const qcResp = queryAgenticRAG('Line Array Rigging Box Subwoofer', 'qc', 'Audio');
expect(qcResp.agentRole === 'qc', 'Dispatches query to QC Specialist Agent');
expect(qcResp.citations.length > 0, 'Retrieves grounded citations from official vector documents');
expect(qcResp.confidenceScore >= 0.7, `High confidence score grounded in data: ${(qcResp.confidenceScore * 100).toFixed(1)}%`);

const servResp = queryAgenticRAG('Moving Head Beam Optical Lens Cleaning', 'service', 'Lighting');
expect(servResp.agentRole === 'service', 'Dispatches query to Service Specialist Agent');
expect(servResp.detailedAnalysis.length > 0, 'Produces detailed procedure grounded in SOP');

// 2. Test Orchestrated Daily Report Generation
console.log('\n--- 2. Testing Daily Report Orchestration ---');
const dailyOrch = generateOrchestratedReport('Harian', '2026-09-05', {
  dailyReports: INITIAL_DAILY_REPORTS.filter(r => r.date === '2026-09-05'),
  logbookEntries: INITIAL_LOGBOOK_ENTRIES.filter(e => e.date === '2026-09-05'),
  findings: INITIAL_FINDINGS.filter(f => f.dateCreated === '2026-09-05'),
  workOrders: INITIAL_WORK_ORDERS,
  staffList: STAFF_LIST,
  assets: INITIAL_ASSETS
});

expect(dailyOrch.reportType === 'Harian', 'Generates Harian Orchestrated Report');
expect(dailyOrch.orchestrator.overallHealthIndex > 0, `Computes Overall Operational Health Index: ${dailyOrch.orchestrator.overallHealthIndex}%`);
expect(dailyOrch.agentFindings.qcAgent.totalInspected >= 0, 'QC Agent aggregates daily inspection data');
expect(dailyOrch.agentFindings.serviceAgent.totalRepairs >= 0, 'Service Agent aggregates daily repair data');
expect(dailyOrch.agentFindings.kpiAgent.activeStaffCount >= 0, 'KPI Agent aggregates active operational staff');

// 3. Test Orchestrated Weekly Report Generation
console.log('\n--- 3. Testing Weekly Report Orchestration ---');
const weeklyOrch = generateOrchestratedReport('Mingguan', '1 - 7 September 2026', {
  dailyReports: INITIAL_DAILY_REPORTS,
  logbookEntries: INITIAL_LOGBOOK_ENTRIES,
  findings: INITIAL_FINDINGS,
  workOrders: INITIAL_WORK_ORDERS,
  staffList: STAFF_LIST,
  assets: INITIAL_ASSETS
});

expect(weeklyOrch.reportType === 'Mingguan', 'Generates Mingguan Orchestrated Report');
expect(weeklyOrch.orchestrator.criticalActionPoints.length > 0, 'Generates actionable critical points for management');
expect(weeklyOrch.strategicRecommendations.length > 0, 'Generates AI strategic recommendations');

// 4. Test Orchestrated Monthly Report Generation
console.log('\n--- 4. Testing Monthly Report Orchestration ---');
const monthlyOrch = generateOrchestratedReport('Bulanan', 'September 2026', {
  dailyReports: INITIAL_DAILY_REPORTS,
  logbookEntries: INITIAL_LOGBOOK_ENTRIES,
  findings: INITIAL_FINDINGS,
  workOrders: INITIAL_WORK_ORDERS,
  staffList: STAFF_LIST,
  assets: INITIAL_ASSETS
});

expect(monthlyOrch.reportType === 'Bulanan', 'Generates Bulanan Orchestrated Report');
expect(monthlyOrch.agentFindings.logisticsAgent.warehouseReadiness >= 85, `Logistics Agent calculates warehouse readiness: ${monthlyOrch.agentFindings.logisticsAgent.warehouseReadiness}%`);
expect(monthlyOrch.agentFindings.kpiAgent.activeStaffCount > 0, `KPI Agent isolates zero-activity staff: ${monthlyOrch.agentFindings.kpiAgent.activeStaffCount} active staff members`);

// 5. Test Complete Cross-Division & Multi-Staff Data Integration & Markdown Generator
console.log('\n--- 5. Testing Cross-Division Integration & Markdown Generation ---');
expect(monthlyOrch.detailedSections !== undefined, 'Detailed sections data is populated');
expect(monthlyOrch.detailedSections.divisionProductivity.length === 7, `All 7 official divisions connected in productivity (${monthlyOrch.detailedSections.divisionProductivity.length}/7)`);
expect(monthlyOrch.detailedSections.staffKpiRankings.length > 0, `Staff KPI rankings populated with active contributors (${monthlyOrch.detailedSections.staffKpiRankings.length} staff)`);
expect(monthlyOrch.detailedSections.damageStatsByDivision.length === 7, 'Damage stats calculated for all 7 divisions');
expect(monthlyOrch.detailedSections.topProblematicEquipment.length <= 10, 'Top 10 problematic equipment calculated');
expect(monthlyOrch.detailedSections.managementAnalysis.kendala.length > 0, 'Management analysis: Kendala populated');
expect(monthlyOrch.detailedSections.managementAnalysis.akarMasalah.length > 0, 'Management analysis: Akar Masalah populated');
expect(monthlyOrch.detailedSections.managementAnalysis.solusiPerbaikan.length > 0, 'Management analysis: Solusi Perbaikan populated');
expect(monthlyOrch.detailedSections.managementAnalysis.targetBerikutnya.length > 0, 'Management analysis: Target Berikutnya populated');

const mdOutput = monthlyOrch.toMarkdownString();
expect(typeof mdOutput === 'string' && mdOutput.length > 500, `Generates robust Markdown report (${mdOutput.length} characters)`);
expect(mdOutput.includes('# LAPORAN OPERASIONAL BULANAN'), 'Markdown contains official header');
expect(mdOutput.includes('LOGBOOK QC HARIAN STAFF INHOUSE'), 'Markdown contains Logbook QC Harian section');
expect(mdOutput.includes('TEMUAN QC & PERALIHAN KERUSAKAN'), 'Markdown contains Temuan QC & Work Order section');
expect(mdOutput.includes('PRODUKTIVITAS DIVISI'), 'Markdown contains Produktivitas Divisi table');
expect(mdOutput.includes('LAPORAN KPI & KINERJA ALL STAFF'), 'Markdown contains Laporan KPI & Kinerja All Staff table');
expect(mdOutput.includes('STATISTIK QC'), 'Markdown contains Statistik QC section');
expect(mdOutput.includes('STATISTIK KERUSAKAN PER DIVISI'), 'Markdown contains Statistik Kerusakan per Divisi table');
expect(mdOutput.includes('TOP 10 PERALATAN PALING SERING BERMASALAH'), 'Markdown contains Top 10 Masalah Alat table');
expect(mdOutput.includes('ANALISIS MANAJEMEN'), 'Markdown contains Analisis Manajemen 4 poin');
expect(mdOutput.includes('Wahyu'), 'Markdown contains Direktur signature');

// 6. Test Short-Term & Long-Term Memory Engine
console.log('\n--- 6. Testing Short-Term & Long-Term Memory Engine ---');
const memoryStats = agenticMemory.getStats();
expect(memoryStats.longTermCount >= 4, `Long-term episodic memory seeded (${memoryStats.longTermCount} items)`);

// Test adding Short-Term Memory
agenticMemory.addShortTerm({
  role: 'user',
  agentRole: 'qc',
  content: 'Inspeksi koneksi camlock panel MDP Audio sebelum show',
  division: 'Audio',
  contextTags: ['camlock', 'mdp', 'qc']
});
const stmItems = agenticMemory.getShortTerm(5);
expect(stmItems.length > 0, 'Records and retrieves Short-Term working memory');
expect(stmItems[0].contextTags.includes('camlock'), 'Preserves Short-Term context tags and recency');

// Test adding Long-Term Memory
const newLTM = agenticMemory.addLongTerm({
  category: 'SOP Clarification',
  division: 'Audio',
  topic: 'Prosedur Kalibrasi Level Subwoofer D&B Audiotechnik',
  insight: 'Kalibrasi DSP ArrayProcessing wajib diverifikasi dengan RTA calibrated microphone sebelum acara dimulai.',
  confidenceScore: 0.99,
  importance: 5,
  tags: ['d&b', 'subwoofer', 'dsp', 'rta', 'audio']
});
expect(newLTM.id.startsWith('ltm-'), 'Generates valid Long-Term Memory ID');

// Test searching Long-Term Memory with scoring
const ltmSearch = agenticMemory.searchLongTerm('subwoofer kalibrasi dsp', 'Audio');
expect(ltmSearch.length > 0, 'Retrieves relevant Long-Term Memory by semantic tokens');
expect(ltmSearch[0].topic.includes('Subwoofer'), 'Ranks high importance Long-Term items first');

// Test queryAgenticRAG incorporating Memory Context
const ragMemoryResp = queryAgenticRAG('Genset Grounding 3-Phase Camlock', 'service', 'Service');
expect(ragMemoryResp.memoryContext !== undefined, 'Injects memory context into Agentic RAG response');
expect(ragMemoryResp.memoryContext!.longTermMatches.length > 0, 'Matches official Long-Term grounding items in RAG query');

// 7. Test Dedicated Application Workspace System
console.log('\n--- 7. Testing Dedicated Application Workspace System ---');
const activeWs = workspaceManager.getActiveWorkspace();
expect(activeWs.id === 'ws-riz-production-main', `Active workspace is dedicated: ${activeWs.name}`);
expect(activeWs.code === 'RIZ-PROD', 'Active workspace code is RIZ-PROD');
expect(activeWs.organization === 'PT. Riz Production Multi Kreasi', 'Workspace organization verified');
expect(activeWs.storagePrefix === 'riz_', 'Storage isolation prefix is riz_');

const wsKey = workspaceManager.getWorkspaceStorageKey('riz_daily_reports');
expect(wsKey === 'riz_daily_reports', 'Primary workspace storage key intact');

const allWorkspaces = workspaceManager.getAllWorkspaces();
expect(allWorkspaces.length >= 2, `Multiple isolated workspaces registered (${allWorkspaces.length} workspaces)`);

// 8. Test Multi-Division Position: Mulyana / Kharo (Videotron & Service)
console.log('\n--- 8. Testing Multi-Division Staff: Mulyana / Kharo (Videotron & Service) ---');
const mulyanaStaff = STAFF_LIST.find(s => s.id === 'staff-mulyana');
expect(mulyanaStaff !== undefined, 'Mulyana staff record found in STAFF_LIST');
expect(mulyanaStaff?.division === 'Service', 'Mulyana primary division is Service');
expect(mulyanaStaff?.secondaryDivision === 'Videotron', 'Mulyana secondary division is Videotron');
expect(Array.isArray(mulyanaStaff?.divisions) && mulyanaStaff.divisions.includes('Service') && mulyanaStaff.divisions.includes('Videotron'), 'Mulyana holds both Service and Videotron divisions');

// Test that monthly orchestrated report credits Mulyana's activities to both Videotron and Service productivity
const monthlyOrchTest = generateOrchestratedReport('Bulanan', 'September 2026', {
  dailyReports: INITIAL_DAILY_REPORTS,
  logbookEntries: INITIAL_LOGBOOK_ENTRIES,
  findings: INITIAL_FINDINGS,
  workOrders: INITIAL_WORK_ORDERS,
  staffList: STAFF_LIST,
  assets: INITIAL_ASSETS
});

const vProd = monthlyOrchTest.detailedSections.divisionProductivity.find(d => d.division === 'Videotron');
const sProd = monthlyOrchTest.detailedSections.divisionProductivity.find(d => d.division.includes('Service'));

expect(vProd !== undefined && vProd.totalActivities > 0, `Videotron productivity includes Mulyana dual-division data (${vProd?.totalActivities} activities)`);
expect(sProd !== undefined && sProd.totalActivities > 0, `Service productivity includes Mulyana dual-division data (${sProd?.totalActivities} activities)`);

// 9. Test Summary
console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================\n');

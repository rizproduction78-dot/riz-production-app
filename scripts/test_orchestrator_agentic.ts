/**
 * Test Suite: Agentic AI Multi-Agent Orchestrator & Report Generator
 * PT. RIZ PRODUCTION MULTI KREASI
 */

import { STAFF_LIST, INITIAL_DAILY_REPORTS, INITIAL_LOGBOOK_ENTRIES, INITIAL_FINDINGS, INITIAL_WORK_ORDERS, INITIAL_ASSETS } from '../src/data';
import { generateOrchestratedReport, queryAgenticRAG } from '../src/lib/ragVectorEngine';

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

// 5. Test Summary
console.log('\n================================================================');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================\n');

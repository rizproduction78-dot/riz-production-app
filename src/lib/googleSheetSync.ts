/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GOOGLE SHEETS REAL-TIME SYNC ENGINE
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc/edit
 * Direct Bi-Directional Integration via Google Apps Script Webhook
 */

import {
  STAFF_LIST,
  INITIAL_LOGBOOK_ENTRIES,
  INITIAL_DAILY_REPORTS,
  INITIAL_FINDINGS,
  INITIAL_WORK_ORDERS,
  INITIAL_FREELANCE_WORKERS,
  INITIAL_VEHICLES,
  INITIAL_FLEET_DRIVERS,
  INITIAL_DAILY_TASKS
} from '../data';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE } from '../data/september2026Schedule';
import { isStaffMatch } from '../utils/kpiCalculator';

export const DEFAULT_SPREADSHEET_ID = '1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc';
export const DEFAULT_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc/edit?gid=198998470#gid=198998470';
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxwCU17QZZ_1Z-9Wd2rznC15gIX25xydANyPNWbdyRrrRZzDVAYn9BETiCKAc7f7QUp0w/exec';

export const GOOGLE_SHEET_WEBHOOK_KEY = 'riz_google_sheet_webhook_url';
export const GOOGLE_SHEET_LAST_SYNC_KEY = 'riz_google_sheet_last_sync';
export const GOOGLE_SHEET_AUTO_SYNC_KEY = 'riz_google_sheet_auto_sync_enabled';

export interface GoogleSheetSyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  details?: Record<string, any>;
}

export function getGoogleSheetWebhookUrl(): string {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(GOOGLE_SHEET_WEBHOOK_KEY) || DEFAULT_WEBHOOK_URL;
    }
  } catch (e) {}
  return DEFAULT_WEBHOOK_URL;
}

export function setGoogleSheetWebhookUrl(url: string): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(GOOGLE_SHEET_WEBHOOK_KEY, url.trim());
    }
  } catch (e) {}
}

export function isGoogleSheetAutoSyncEnabled(): boolean {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(GOOGLE_SHEET_AUTO_SYNC_KEY);
      if (val === 'false') return false;
      return true; // Default auto-sync aktif tanpa menunggu perintah manual
    }
  } catch (e) {}
  return true;
}

export function setGoogleSheetAutoSyncEnabled(enabled: boolean): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(GOOGLE_SHEET_AUTO_SYNC_KEY, enabled ? 'true' : 'false');
    }
  } catch (e) {}
}

export function getGoogleSheetLastSync(): string | null {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(GOOGLE_SHEET_LAST_SYNC_KEY);
    }
  } catch (e) {}
  return null;
}

/**
 * Test connection to Google Apps Script Webhook
 */
export async function testGoogleSheetWebhook(webhookUrl?: string): Promise<GoogleSheetSyncResult> {
  const url = webhookUrl || getGoogleSheetWebhookUrl();
  if (!url) {
    return {
      success: false,
      message: 'URL Google Apps Script Webhook belum dikonfigurasi.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'PING',
        spreadsheetId: DEFAULT_SPREADSHEET_ID,
        timestamp: new Date().toISOString()
      })
    });

    const text = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch (e) {
      // If response is valid HTTP 200
      if (response.ok) {
        return {
          success: true,
          message: 'Koneksi ke Google Sheet Webhook Berhasil!',
          timestamp: new Date().toISOString()
        };
      }
    }

    if (data.status === 'success' || response.ok) {
      return {
        success: true,
        message: data.message || 'Koneksi ke Google Sheet Webhook Berhasil & Terverifikasi!',
        timestamp: new Date().toISOString(),
        details: data
      };
    } else {
      return {
        success: false,
        message: data.message || `Gagal terhubung ke Google Sheet (HTTP ${response.status})`,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Gagal mengirim request ke Webhook: ${error.message || 'Network Error / CORS'}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Collect all operational data for Google Sheet sync
 */
export function getExportPayloadForGoogleSheet() {
  const parseStorage = (key: string, defaultVal: any = []) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const logs = parseStorage('riz_logbook_entries', INITIAL_LOGBOOK_ENTRIES);
  const reports = parseStorage('riz_daily_reports', INITIAL_DAILY_REPORTS);
  const staff = parseStorage('riz_master_staff_list', STAFF_LIST);
  const freelance = parseStorage('riz_freelance_workers', INITIAL_FREELANCE_WORKERS);
  const vehicles = parseStorage('riz_master_vehicles', INITIAL_VEHICLES);
  const drivers = parseStorage('riz_fleet_drivers', INITIAL_FLEET_DRIVERS);
  const fleetAssignments = parseStorage('riz_fleet_assignments', []);
  const findings = parseStorage('riz_findings', INITIAL_FINDINGS);
  const workOrders = parseStorage('riz_work_orders', INITIAL_WORK_ORDERS);
  const schedules = parseStorage('riz_september_2026_schedule', OFFICIAL_SEPTEMBER_2026_SCHEDULE);
  const dailyTasks = parseStorage('riz_daily_tasks', INITIAL_DAILY_TASKS);

  const activeLogs = Array.isArray(logs) && logs.length > 0 ? logs : INITIAL_LOGBOOK_ENTRIES;
  const activeReports = Array.isArray(reports) && reports.length > 0 ? reports : INITIAL_DAILY_REPORTS;
  const activeStaff = Array.isArray(staff) && staff.length > 0 ? staff : STAFF_LIST;
  const activeFreelance = Array.isArray(freelance) && freelance.length > 0 ? freelance : INITIAL_FREELANCE_WORKERS;
  const activeVehicles = Array.isArray(vehicles) && vehicles.length > 0 ? vehicles : INITIAL_VEHICLES;
  const activeDrivers = Array.isArray(drivers) ? drivers : INITIAL_FLEET_DRIVERS;
  const activeFindings = Array.isArray(findings) && findings.length > 0 ? findings : INITIAL_FINDINGS;
  const activeWorkOrders = Array.isArray(workOrders) && workOrders.length > 0 ? workOrders : INITIAL_WORK_ORDERS;
  const activeSchedules = Array.isArray(schedules) && schedules.length > 0 ? schedules : OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  const activeTasks = Array.isArray(dailyTasks) && dailyTasks.length > 0 ? dailyTasks : INITIAL_DAILY_TASKS;

  // Format combined daily logs, reports & daily tasks for Google Sheet
  const formattedDailyLogs = [
    ...activeLogs.map((l: any) => ({
      id: l.id || '',
      date: l.date || '',
      division: l.division || '',
      staffName: l.staffName || '',
      staffRole: 'Staff / Teknisi',
      title: l.activity || '',
      category: 'QC Checklist',
      status: l.result || l.status || '',
      description: l.followUp || '',
      createdAt: l.date || ''
    })),
    ...activeReports.map((r: any) => ({
      id: r.id || '',
      date: r.date || '',
      division: r.division || '',
      staffName: r.staffName || '',
      staffRole: 'Staff Operasional',
      title: r.activity || '',
      category: 'Laporan Harian Lapangan',
      status: r.status || '',
      description: r.notes || '',
      createdAt: r.date || ''
    })),
    ...activeTasks.map((t: any) => ({
      id: t.id || '',
      date: t.dueDate || t.createdAt || '',
      division: t.division || '',
      staffName: t.assignedName || t.createdBy || '',
      staffRole: 'Teknisi / Tim PIC',
      title: t.title || '',
      category: 'Daily Task (Kanban)',
      status: t.status || '',
      description: t.description || '',
      createdAt: t.createdAt || ''
    }))
  ];

  // Format daily tasks specifically for DAILY_TASKS sheet
  const formattedDailyTasks = activeTasks.map((t: any) => ({
    id: t.id || '',
    title: t.title || '',
    description: t.description || '',
    division: t.division || '',
    priority: t.priority || 'Sedang',
    status: t.status || 'Pending',
    assignedTo: t.assignedTo || '',
    assignedName: t.assignedName || '',
    dueDate: t.dueDate || '',
    createdAt: t.createdAt || '',
    createdBy: t.createdBy || ''
  }));

  // Format schedule shifts for Google Sheet
  const formattedSchedules = activeSchedules.map((s: any) => ({
    id: s.id || `row-${s.no || ''}`,
    name: s.name || s.fullName || '',
    division: s.division || '',
    shifts: s.shifts || {}
  }));

  return {
    spreadsheetId: DEFAULT_SPREADSHEET_ID,
    timestamp: new Date().toISOString(),
    data: {
      daily_logs: formattedDailyLogs,
      daily_tasks: formattedDailyTasks,
      staff_members: activeStaff,
      freelance_workers: activeFreelance,
      vehicles: activeVehicles,
      drivers: activeDrivers,
      fleet_assignments: fleetAssignments,
      findings_wo: [...activeFindings, ...activeWorkOrders],
      schedule_shifts: formattedSchedules
    }
  };
}

// Debounce auto-sync timer for Google Sheet
let googleSheetAutoSyncTimer: any = null;

/**
 * Otomatis memicu update ke Google Sheet di latar belakang (Background Auto-Sync)
 * Setiap kali terjadi mutasi data (Simpan QC, Logbook, Finding, WO, dsb.)
 */
export function triggerAutoSyncToGoogleSheet(delayMs: number = 2000): void {
  if (typeof window === 'undefined') return;
  if (!isGoogleSheetAutoSyncEnabled()) return;

  if (googleSheetAutoSyncTimer) {
    clearTimeout(googleSheetAutoSyncTimer);
  }

  googleSheetAutoSyncTimer = setTimeout(async () => {
    try {
      await syncAllToGoogleSheet();
    } catch (e) {
      console.warn('[Auto-Sync] Background Google Sheet auto-update notification:', e);
    }
  }, delayMs);
}

/**
 * Synchronize all app data into Google Sheet
 */
export async function syncAllToGoogleSheet(webhookUrl?: string): Promise<GoogleSheetSyncResult> {
  const url = webhookUrl || getGoogleSheetWebhookUrl();
  if (!url) {
    return {
      success: false,
      message: 'URL Google Apps Script Webhook belum dikonfigurasi.',
      timestamp: new Date().toISOString()
    };
  }

  const payload = {
    action: 'SYNC_ALL_DATA',
    ...getExportPayloadForGoogleSheet()
  };

  const recordLastSync = (time: string) => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(GOOGLE_SHEET_LAST_SYNC_KEY, time);
      }
    } catch (e) {}
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let resData: any = {};
    try {
      resData = JSON.parse(text);
    } catch (e) {
      if (response.ok) {
        const syncTime = new Date().toISOString();
        recordLastSync(syncTime);
        if (typeof window !== 'undefined') {
          try {
            window.dispatchEvent(new CustomEvent('riz_google_sheet_synced', {
              detail: { timestamp: syncTime, success: true }
            }));
          } catch (err) {}
        }
        return {
          success: true,
          message: 'Seluruh data berhasil disinkronkan ke Google Sheet!',
          timestamp: syncTime
        };
      }
    }

    if (resData.status === 'success' || response.ok) {
      const syncTime = new Date().toISOString();
      recordLastSync(syncTime);
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('riz_google_sheet_synced', {
            detail: { timestamp: syncTime, success: true }
          }));
        } catch (e) {}
      }
      return {
        success: true,
        message: resData.message || 'Seluruh data berhasil disinkronkan ke Google Sheet!',
        timestamp: syncTime,
        details: resData
      };
    } else {
      return {
        success: false,
        message: resData.message || `Gagal menyinkronkan data (HTTP ${response.status})`,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Error sinkronisasi: ${error.message || 'Koneksi bermasalah'}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Pull updated schedule/roster data from Google Sheet
 */
export async function pullDataFromGoogleSheet(webhookUrl?: string): Promise<GoogleSheetSyncResult> {
  const url = webhookUrl || getGoogleSheetWebhookUrl();
  if (!url) {
    return {
      success: false,
      message: 'URL Google Apps Script Webhook belum dikonfigurasi.',
      timestamp: new Date().toISOString()
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'PULL_SCHEDULE_DATA' })
    });

    const data = await response.json();
    if (data.status === 'success' || data.schedule_shifts) {
      const syncTime = new Date().toISOString();
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(GOOGLE_SHEET_LAST_SYNC_KEY, syncTime);
        }
      } catch (e) {}
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('riz_google_sheet_synced', {
            detail: { timestamp: syncTime, success: true }
          }));
        } catch (e) {}
      }
      return {
        success: true,
        message: 'Data jadwal shift berhasil ditarik dari Google Sheet!',
        timestamp: syncTime,
        details: data
      };
    } else {
      return {
        success: false,
        message: data.message || 'Gagal menarik data dari Google Sheet',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Error koneksi ke Google Sheet: ${error.message || 'Jaringan bermasalah'}`,
      timestamp: new Date().toISOString()
    };
  }
}

// ─────────────────────────────────────────────────────────────
// OFFICIAL GOOGLE APPS SCRIPT TEMPLATE CODE (Code.gs)
// Salin kode di bawah ini ke Editor Google Apps Script di Google Sheets
// ─────────────────────────────────────────────────────────────
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// =============================================================
// PT. RIZ PRODUCTION - OPERATIONAL LOGBOOK GOOGLE APPS SCRIPT
// Deployment: Web App (Execute as: Me, Who has access: Anyone)
// Spreadsheet ID: 1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc
// =============================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    var raw = e.postData.contents;
    var payload = JSON.parse(raw);
    var action = payload.action || '';
    
    // Otomatis buka Spreadsheet PT. RIZ Production (berfungsi baik dari Ekstensi Sheet maupun Standalone script.new)
    var ss = null;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch(e) {}
    if (!ss) {
      ss = SpreadsheetApp.openById("1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc");
    }

    if (action === 'PING') {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Koneksi Webhook Google Sheet Berhasil Terhubung ke: ' + ss.getName(),
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'SYNC_ALL_DATA') {
      var data = payload.data || {};
      
      // 1. Sync Daily Logs & QC
      if (data.daily_logs && data.daily_logs.length > 0) {
        writeDailyLogsSheet(ss, data.daily_logs);
      }

      // 1b. Sync Daily Tasks (Kanban)
      if (data.daily_tasks && data.daily_tasks.length > 0) {
        writeDailyTasksSheet(ss, data.daily_tasks);
      }

      // 2. Sync Staff Members
      if (data.staff_members && data.staff_members.length > 0) {
        writeStaffSheet(ss, data.staff_members);
      }

      // 3. Sync Freelance Workers
      if (data.freelance_workers && data.freelance_workers.length > 0) {
        writeFreelanceSheet(ss, data.freelance_workers);
      }

      // 4. Sync Drivers & Vehicles
      if (data.drivers || data.vehicles) {
        writeArmadaSheet(ss, data.drivers || [], data.vehicles || []);
      }

      // 5. Sync Fleet Assignments
      if (data.fleet_assignments && data.fleet_assignments.length > 0) {
        writeFleetAssignmentsSheet(ss, data.fleet_assignments);
      }

      // 6. Sync Findings & Work Orders
      if (data.findings_wo && data.findings_wo.length > 0) {
        writeFindingsSheet(ss, data.findings_wo);
      }

      // 7. Sync Schedule Shifts
      if (data.schedule_shifts && data.schedule_shifts.length > 0) {
        writeScheduleShiftsSheet(ss, data.schedule_shifts);
      }

      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Seluruh data berhasil disinkronkan ke Sheet: ' + ss.getName(),
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'PULL_SCHEDULE_DATA') {
      var scheduleData = readScheduleShiftsSheet(ss);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        schedule_shifts: scheduleData,
        timestamp: new Date().toISOString()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Action tidak dikenali: ' + action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    service: 'RIZ Production Google Sheets Sync Webhook',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS TO WRITE DATA INTO SPREADSHEET SHEETS
// ─────────────────────────────────────────────────────────────

function getOrCreateSheet(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function writeDailyLogsSheet(ss, logs) {
  var sheet = getOrCreateSheet(ss, 'DAILY_LOGS_QC');
  sheet.clearContents();
  
  var headers = ['ID Log', 'Tanggal', 'Divisi', 'Nama Staf', 'Jabatan', 'Aktivitas / QC Item', 'Kategori', 'Status', 'Catatan / Deskripsi', 'Timestamp'];
  var rows = [headers];

  for (var i = 0; i < logs.length; i++) {
    var l = logs[i];
    rows.push([
      l.id || '',
      l.date || '',
      l.division || '',
      l.staffName || '',
      l.staffRole || '',
      l.title || l.qcItem || '',
      l.category || '',
      l.status || '',
      l.description || l.notes || '',
      l.createdAt || new Date().toISOString()
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e293b').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeDailyTasksSheet(ss, tasks) {
  var sheet = getOrCreateSheet(ss, 'DAILY_TASKS');
  sheet.clearContents();
  
  var headers = ['ID Task', 'Judul Task', 'Deskripsi / Rincian', 'Divisi', 'Prioritas', 'Status', 'Ditugaskan Ke', 'PIC / Pelaksana', 'Target Selesai (Due Date)', 'Tanggal Dibuat', 'Dibuat Oleh'];
  var rows = [headers];

  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    rows.push([
      t.id || '',
      t.title || '',
      t.description || '',
      t.division || '',
      t.priority || 'Sedang',
      t.status || 'Pending',
      t.assignedTo || '',
      t.assignedName || '',
      t.dueDate || '',
      t.createdAt || '',
      t.createdBy || ''
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#2563eb').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeStaffSheet(ss, staffList) {
  var sheet = getOrCreateSheet(ss, 'MASTER_STAFF');
  sheet.clearContents();

  var headers = ['ID Staf', 'Nama Lengkap (KTP)', 'Nama Panggilan', 'Divisi Utama', 'Divisi Sekunder / Tambahan', 'Role / Jabatan', 'Jenjang Level', 'No. WhatsApp / Telp', 'Email'];
  var rows = [headers];

  for (var i = 0; i < staffList.length; i++) {
    var s = staffList[i];
    var secDiv = s.secondaryDivision || (Array.isArray(s.divisions) && s.divisions.length > 1 ? s.divisions.filter(function(d){ return d !== s.division; }).join(', ') : '-');
    rows.push([
      s.id || '',
      s.fullName || s.name || '',
      s.nickname || s.name || '',
      s.division || '',
      secDiv,
      s.role || '',
      s.level ? 'Level ' + s.level : 'Level 2',
      s.phone || '',
      s.email || ''
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#312e81').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeFreelanceSheet(ss, freelanceList) {
  var sheet = getOrCreateSheet(ss, 'MASTER_FREELANCE');
  sheet.clearContents();

  var headers = ['ID', 'Nama Kru', 'Spesialisasi', 'Divisi', 'No. WhatsApp', 'Rate Harian (Rp)', 'Status Kelayakan', 'Kota / Domisili', 'Skill Utama'];
  var rows = [headers];

  for (var i = 0; i < freelanceList.length; i++) {
    var f = freelanceList[i];
    rows.push([
      f.id || '',
      f.name || '',
      f.specialization || '',
      f.division || '',
      f.phone || '',
      f.dailyRate || 0,
      f.status || 'Aktif',
      f.city || '',
      (f.skills || []).join(', ')
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0f766e').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeArmadaSheet(ss, drivers, vehicles) {
  var sheet = getOrCreateSheet(ss, 'MASTER_ARMADA_DRIVER');
  sheet.clearContents();

  var headers = ['ID Driver', 'Nama Driver', 'Tipe Driver', 'No. WhatsApp', 'SIM', 'Status', 'Armada Default'];
  var rows = [headers];

  for (var i = 0; i < drivers.length; i++) {
    var d = drivers[i];
    rows.push([
      d.id || '',
      d.name || '',
      d.driverType || 'Internal',
      d.phone || '',
      d.simType || 'SIM B1',
      d.status || 'Siap Jalan',
      d.assignedVehicle || ''
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#b45309').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeFleetAssignmentsSheet(ss, assignments) {
  var sheet = getOrCreateSheet(ss, 'PENUGASAN_ARMADA_SPJ');
  sheet.clearContents();

  var headers = ['ID SPJ', 'Nama Event / Proyek', 'Tanggal Mulai', 'Tanggal Selesai', 'Armada', 'No. Polisi', 'Driver', 'Tujuan / Rute', 'Biaya Sewa / Biaya Trip', 'Status'];
  var rows = [headers];

  for (var i = 0; i < assignments.length; i++) {
    var a = assignments[i];
    rows.push([
      a.id || '',
      a.projectName || '',
      a.startDate || '',
      a.endDate || '',
      a.vehicleType || '',
      a.policeNumber || '',
      a.driverName || '',
      a.destination || '',
      a.rentalCost || 0,
      a.status || ''
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#431407').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeFindingsSheet(ss, findingsList) {
  var sheet = getOrCreateSheet(ss, 'TEMUAN_QC_WORK_ORDER');
  sheet.clearContents();

  var headers = ['ID', 'Tipe', 'Nama Alat / Judul', 'Divisi', 'Kendala / Deskripsi', 'Prioritas', 'PIC', 'Target Selesai / Deadline', 'Status', 'Approved Oleh'];
  var rows = [headers];

  for (var i = 0; i < findingsList.length; i++) {
    var item = findingsList[i];
    var isWO = Boolean(item.deadline !== undefined);
    rows.push([
      item.id || '',
      isWO ? 'Work Order' : 'Temuan QC',
      item.equipment || item.title || '',
      item.division || '',
      item.issue || item.description || '',
      item.priority || 'Normal',
      item.pic || '',
      item.targetDate || item.deadline || '',
      item.status || '',
      item.approvedBy || '-'
    ]);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#831843').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function writeScheduleShiftsSheet(ss, scheduleList) {
  var sheet = getOrCreateSheet(ss, 'JADWAL_SHIFT_BULANAN');
  sheet.clearContents();

  var headers = ['ID Staf', 'Nama Staf', 'Divisi'];
  for (var d = 1; d <= 30; d++) {
    headers.push('Tgl ' + d);
  }
  var rows = [headers];

  for (var i = 0; i < scheduleList.length; i++) {
    var s = scheduleList[i];
    var row = [s.id || '', s.name || '', s.division || ''];
    for (var day = 1; day <= 30; day++) {
      row.push(s.shifts && s.shifts[day] ? s.shifts[day] : '-');
    }
    rows.push(row);
  }

  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e1b4b').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

function readScheduleShiftsSheet(ss) {
  var sheet = ss.getSheetByName('JADWAL_SHIFT_BULANAN');
  if (!sheet) return [];
  
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var result = [];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var shifts = {};
    for (var day = 1; day <= 30; day++) {
      if (row[2 + day] !== undefined) {
        shifts[day] = String(row[2 + day]);
      }
    }
    result.push({
      id: String(row[0]),
      name: String(row[1]),
      division: String(row[2]),
      shifts: shifts
    });
  }
  return result;
}
`;


// ─────────────────────────────────────────────────────────────
// GVIZ DIRECT PULL — Baca Daily Log dari Google Sheet Publik
// Tidak memerlukan webhook / Apps Script deployment
// Cukup Google Sheet di-set "Share → Anyone with the link → Viewer"
// ─────────────────────────────────────────────────────────────

export const DAILY_LOG_SHEET_ID = '1N8MkJtDpD9VmrtSkTuygxiyNRmEVCAWDITZisiVd_Dc';

/** GID untuk setiap tab sheet daily log */
export const SHEET_GID_SEPTEMBER_2026 = '198998470';
export const SHEET_GID_HISTORICAL     = '0'; // Mei 2026 (historis)

/** Key localStorage untuk timestamp terakhir pull daily log */
export const DAILY_LOG_LAST_PULL_KEY = 'riz_daily_log_last_pull';

/** Keyword pada kolom REMARK yang menandakan temuan/masalah */
const FINDING_KEYWORDS = [
  'harus service', 'service', 'rusak', 'kendala', 'masalah',
  'error', 'mati', 'tidak berfungsi', 'ganti', 'perbaikan',
  'repair', 'tidak ok', 'ng', 'perlu'
];

/** Mapping nama panggilan staf dari Google Sheet ke nama canonical di STAFF_LIST */
const STAFF_NAME_MAP: Record<string, string> = {
  'mboh': 'Muhamad Rahmat',
  'opik': 'Taufik Diana',
  'buluk': 'Suryana',
  'bulux': 'Suryana',
  'nana': 'Suryana',
  'butong': 'Iwan Kurniawan',
  'butonk': 'Iwan Kurniawan',
  'yudish': 'Yudishtira Purnama A',
  'yudis': 'Yudishtira Purnama A',
  'dani': 'Ramdani',
  'kharo': 'Mulyana',
  'karo': 'Mulyana',
  'jay': 'Mulyadi',
  'heri': 'Heri',
  'wigi': 'Dedi Agus Wigiantoro',
  'ayong': 'Ayong Sumarsih',
  'unyim': 'Wahyudin',
  'unyin': 'Wahyudin',
  'mulyana': 'Mulyana',
  'ramdani': 'Ramdani',
  'taufik': 'Taufik Diana',
  'suryana': 'Suryana',
  'wahyudin': 'Wahyudin',
  'iwan': 'Iwan Kurniawan',
  'damri': 'Damri',
  'gatot': 'Gatot Wiliyanto',
  'abah': 'Abah Sobur',
  'sobur': 'Abah Sobur',
  'udin': 'Udin Saepudin',
  'caca': 'Syalsa Sri Hestariana',
  'syalsa': 'Syalsa Sri Hestariana',
  'seno': 'Seno Subroto',
  'agus': 'Agustino Setiawan',
  'agustino': 'Agustino Setiawan',
  'fahrul': 'M. Fahruyana . A',
  'wahyu': 'Wahyu'
};

/** Determine division from which column has activity */
function detectDivision(sound: string, lighting: string, led: string, multimedia: string): string {
  if (sound && sound.trim()) return 'Audio';
  if (lighting && lighting.trim()) return 'Lighting';
  if (led && led.trim()) return 'Videotron';
  if (multimedia && multimedia.trim()) return 'Multimedia';
  return 'Audio'; // default
}

/** Normalize staff name from sheet (may have prefix "- ") */
function normalizeStaffName(raw: string): string {
  if (!raw) return '';
  const cleaned = raw.replace(/^[-–*•]\s*/, '').trim();
  const lower = cleaned.toLowerCase();
  return STAFF_NAME_MAP[lower] || cleaned;
}

/** Parse and normalize multiple staff names that may appear in a single cell (e.g. "- unyim\n- buluk") */
export function parseStaffNames(raw: string): string[] {
  if (!raw || !raw.trim()) return [];
  // Split by newlines, commas, semicolons, slashes, or inline separators like " - ", " & ", " dan "
  const lines = raw.split(/[\n,;/]+|\s+-\s+|\s+&\s+|\s+dan\s+/i)
    .map(s => s.replace(/^[-–*•\s]+/, '').trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const normalized = lines.map(normalizeStaffName).filter(Boolean);
  return Array.from(new Set(normalized));
}

/** Parse "1 September 2026" → "2026-09-01" */
function parseIndonesianDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const months: Record<string, string> = {
    'januari': '01', 'februari': '02', 'maret': '03', 'april': '04',
    'mei': '05', 'juni': '06', 'juli': '07', 'agustus': '08',
    'september': '09', 'oktober': '10', 'november': '11', 'desember': '12'
  };
  // Also handle Date(yyyy,m,d) from gviz JSON
  const gvizMatch = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (gvizMatch) {
    const y = gvizMatch[1];
    const m = String(parseInt(gvizMatch[2]) + 1).padStart(2, '0');
    const d = String(gvizMatch[3]).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  const parts = dateStr.toLowerCase().trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].replace(/\D/g, '').padStart(2, '0');
    const month = months[parts[1]] || '01';
    const year = parts[2];
    if (day && month && year) return `${year}-${month}-${day}`;
  }
  // try range like "22-23 Mei 2026" → take first date
  const rangeMatch = dateStr.match(/(\d+)[-–]\d+\s+(\w+)\s+(\d{4})/i);
  if (rangeMatch) {
    const day = rangeMatch[1].padStart(2, '0');
    const month = months[rangeMatch[2].toLowerCase()] || '01';
    const year = rangeMatch[3];
    return `${year}-${month}-${day}`;
  }
  return null;
}

/** Check if remark text indicates a finding/issue */
function isFindingRemark(remark: string): boolean {
  if (!remark || !remark.trim()) return false;
  const lower = remark.toLowerCase();
  
  // Exclude safe phrases that might contain finding keywords (e.g., "tidak ada kendala")
  const safeKeywords = [
    'tidak ada kendala', 
    'tida ada kendala', 
    'aman', 
    'normal', 
    'selesai', 
    'ok', 
    'tidak ada masalah',
    'siap pakai'
  ];
  const hasSafe = safeKeywords.some(kw => lower.includes(kw));
  const hasExplicitDamage = ['rusak', 'service', 'perbaikan', 'mati', 'error', 'putus', 'serak', 'bongkar'].some(kw => lower.includes(kw));
  
  if (hasSafe && !hasExplicitDamage) return false;

  return FINDING_KEYWORDS.some(kw => lower.includes(kw));
}

/** Build dedup key for a daily report entry */
function buildDedupKey(date: string, staffName: string, activity: string): string {
  // Normalize date and activity string to prevent dupes due to spacing
  const normDate = String(date).trim();
  const normStaff = String(staffName).trim().replace(/[^a-zA-Z0-9-]/g, '_');
  const normActivity = String(activity).trim().substring(0, 30).replace(/[^a-zA-Z0-9-]/g, '_');
  return `gsheet-v2-${normDate}-${normStaff}-${normActivity}`;
}

export interface GvizPullResult {
  success: boolean;
  message: string;
  timestamp: string;
  newReportsCount: number;
  newFindingsCount: number;
  skippedCount: number;
}

/**
 * Pull daily log data langsung dari Google Sheet publik via gviz/tq API.
 * Hasilnya diparse menjadi DailyReport[] dan Finding[] untuk disimpan ke Firestore.
 * 
 * @param gid - GID tab sheet (default: September 2026)
 * @param onSaveDailyReport - callback untuk simpan ke Firestore
 * @param onSaveFinding - callback untuk simpan temuan ke Firestore
 * @param existingReportIds - Set ID report yang sudah ada (untuk dedup)
 */
export async function pullDailyLogFromGviz(
  gid: string = SHEET_GID_SEPTEMBER_2026,
  onSaveDailyReport: (id: string, doc: any) => Promise<void>,
  onSaveFinding: (id: string, doc: any) => Promise<void>,
  existingReportIds: Set<string> = new Set(),
  onSaveLogbookEntry?: (id: string, doc: any) => Promise<void>
): Promise<GvizPullResult> {
  const url = `https://docs.google.com/spreadsheets/d/${DAILY_LOG_SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;

  let newReports = 0;
  let newFindings = 0;
  let skipped = 0;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return {
        success: false,
        message: `Gagal mengambil data dari Google Sheet (HTTP ${response.status})`,
        timestamp: new Date().toISOString(),
        newReportsCount: 0,
        newFindingsCount: 0,
        skippedCount: 0
      };
    }

    const text = await response.text();
    // gviz response wrapped in: google.visualization.Query.setResponse({...});
    const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
    if (!jsonMatch) {
      return {
        success: false,
        message: 'Format respons Google Sheet tidak dikenali',
        timestamp: new Date().toISOString(),
        newReportsCount: 0,
        newFindingsCount: 0,
        skippedCount: 0
      };
    }

    const parsed = JSON.parse(jsonMatch[1]);
    const rows: any[] = parsed?.table?.rows || [];

    // State carry-over: tanggal & staf terakhir yang diketahui
    let currentDate: string | null = null;
    let currentStaffNames: string[] = [];

    for (const row of rows) {
      const cells = row.c || [];
      const rawDate   = cells[0]?.f || cells[0]?.v || '';
      const rawStaff  = cells[1]?.v || '';
      const sound     = cells[2]?.v || '';
      const lighting  = cells[3]?.v || '';
      const led       = cells[4]?.v || '';
      const multimedia= cells[5]?.v || '';
      const remark    = cells[6]?.v || '';

      // Pertahankan tanggal dari baris sebelumnya jika baris ini tidak punya tanggal
      if (rawDate) {
        const parsed = parseIndonesianDate(String(rawDate));
        if (parsed) {
          if (parsed !== currentDate) {
            currentStaffNames = []; // Reset nama staf jika berganti tanggal
          }
          currentDate = parsed;
        }
      }

      if (!currentDate) continue;

      const parsedStaff = parseStaffNames(String(rawStaff));
      if (parsedStaff.length > 0) {
        currentStaffNames = parsedStaff;
      }

      const activeStaffList = parsedStaff.length > 0
        ? parsedStaff
        : (currentStaffNames.length > 0 ? currentStaffNames : ['Tim Operasional']);

      const activity = [sound, lighting, led, multimedia].filter(Boolean).join('; ').trim();

      // Hanya proses baris yang punya aktivitas atau remark
      if (!activity && !remark) continue;

      const division = detectDivision(String(sound), String(lighting), String(led), String(multimedia));

      // Buat DailyReport & LogbookEntry jika ada activity untuk setiap staf yang bertugas
      if (activity) {
        for (const staffName of activeStaffList) {
          const sObj = STAFF_LIST.find(s => isStaffMatch(s, staffName));
          const sId = sObj ? sObj.id : String(staffName || '').toLowerCase().trim();
          const staffCompositeKey = `${currentDate}|${sId}`;
          const logCompositeKey = `log|${currentDate}|${sId}`;

          const dedupKey = buildDedupKey(currentDate, sObj ? sObj.name : staffName, activity);

          if (!existingReportIds.has(dedupKey)) {
            const reportDoc = {
              id: dedupKey,
              date: currentDate,
              staffName: sObj ? sObj.name : (staffName || 'Tim Operasional'),
              division: (sObj ? sObj.division : division) as any,
              activity,
              notes: remark || '',
              status: 'Submitted',
              _source: 'google_sheet',
              _syncedAt: new Date().toISOString()
            };
            await onSaveDailyReport(dedupKey, reportDoc);
            existingReportIds.add(dedupKey);
            newReports++;
          } else {
            skipped++;
          }

          // Buat LogbookEntry QC Checklist jika callback disediakan
          if (onSaveLogbookEntry) {
            const logDedupKey = `log-${dedupKey}`;
            if (!existingReportIds.has(logDedupKey)) {
              const isNg = isFindingRemark(String(remark));
              const logDoc = {
                id: logDedupKey,
                date: currentDate,
                division: (sObj ? sObj.division : division) as any,
                staffName: sObj ? sObj.name : (staffName || 'Tim Operasional'),
                activity,
                result: isNg ? ('NG' as const) : ('OK' as const),
                followUp: remark || (isNg ? 'Perlu perbaikan teknis' : 'Pengecekan selesai aman'),
                status: isNg ? ('Open' as const) : ('Close' as const),
                verification: 'Supervisor Operasional',
                checklists: {
                  [activity.substring(0, 40)]: {
                    status: isNg ? ('NG' as const) : ('OK' as const),
                    notes: remark || 'Kondisi operasional normal'
                  }
                },
                _source: 'google_sheet',
                _syncedAt: new Date().toISOString()
              };
              await onSaveLogbookEntry(logDedupKey, logDoc);
              existingReportIds.add(logDedupKey);
            }
          }
        }
      }

      // Buat Finding jika remark mengindikasikan masalah
      if (isFindingRemark(String(remark))) {
        const remarkNorm = String(remark).trim().toLowerCase().substring(0, 30);
        // Normalize the exact same way as cloudSync.ts contentKey for rigorous deduplication
        const eqNorm = String(activity || (division ? `Unit Divisi ${division}` : 'Unit Operasional')).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const issNorm = String(remark).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const picNorm = String(activeStaffList[0] || 'Tim Operasional').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const contentKeyNorm = `dedup_${eqNorm}_${issNorm}_${picNorm}`;

        const findingKey = `gsheet-finding-${currentDate}-${String(remark).trim().substring(0, 30).replace(/[^a-zA-Z0-9-]/g, '_')}`;

        if (!existingReportIds.has(findingKey) && !existingReportIds.has(remarkNorm) && !existingReportIds.has(contentKeyNorm)) {
          const findingDoc = {
            id: findingKey,
            equipment: activity || (division ? `Unit Divisi ${division}` : 'Unit Operasional'),
            issue: String(remark).trim(),
            priority: 'Sedang',
            pic: activeStaffList[0] || 'Tim Operasional',
            targetDate: currentDate,
            status: 'Open',
            dateCreated: currentDate,
            division: division as any,
            _source: 'google_sheet',
            _syncedAt: new Date().toISOString()
          };
          await onSaveFinding(findingKey, findingDoc);
          existingReportIds.add(findingKey);
          existingReportIds.add(remarkNorm);
          newFindings++;
        }
      }
    }

    // Simpan timestamp pull terakhir
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DAILY_LOG_LAST_PULL_KEY, new Date().toISOString());
      }
    } catch (e) {}

    return {
      success: true,
      message: `Sinkronisasi berhasil! ${newReports} laporan harian + ${newFindings} temuan baru diimpor dari Google Sheet.${skipped > 0 ? ` (${skipped} data sudah ada, dilewati)` : ''}`,
      timestamp: new Date().toISOString(),
      newReportsCount: newReports,
      newFindingsCount: newFindings,
      skippedCount: skipped
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error saat mengambil data dari Google Sheet: ${error.message || 'Koneksi bermasalah'}`,
      timestamp: new Date().toISOString(),
      newReportsCount: 0,
      newFindingsCount: 0,
      skippedCount: 0
    };
  }
}

/** Get last daily log pull timestamp */
export function getDailyLogLastPull(): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(DAILY_LOG_LAST_PULL_KEY);
    }
  } catch (e) {}
  return null;
}


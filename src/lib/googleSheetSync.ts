/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GOOGLE SHEETS REAL-TIME SYNC ENGINE
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit
 * Direct Bi-Directional Integration via Google Apps Script Webhook
 */

export const DEFAULT_SPREADSHEET_ID = '1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA';
export const DEFAULT_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit?gid=198998470#gid=198998470';
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz9X5jRobwEhxyVoilLuqqeH8eGrGZ8XuLcbQ0vRQqbWj8D-tNfLlwoZcTEEiix3YLBiA/exec';

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

  const logs = parseStorage('riz_logbook_entries', []);
  const reports = parseStorage('riz_daily_reports', []);
  const staff = parseStorage('riz_master_staff_list', []);
  const freelance = parseStorage('riz_freelance_workers', []);
  const vehicles = parseStorage('riz_master_vehicles', []);
  const drivers = parseStorage('riz_fleet_drivers', []);
  const fleetAssignments = parseStorage('riz_fleet_assignments', []);
  const findings = parseStorage('riz_findings', []);
  const workOrders = parseStorage('riz_work_orders', []);
  const schedules = parseStorage('riz_september_2026_schedule', []);

  // Format combined daily logs & reports for Google Sheet
  const formattedDailyLogs = [
    ...logs.map((l: any) => ({
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
    ...reports.map((r: any) => ({
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
    }))
  ];

  // Format schedule shifts for Google Sheet
  const formattedSchedules = schedules.map((s: any) => ({
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
      staff_members: staff,
      freelance_workers: freelance,
      vehicles: vehicles,
      drivers: drivers,
      fleet_assignments: fleetAssignments,
      findings_wo: [...findings, ...workOrders],
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
        localStorage.setItem(GOOGLE_SHEET_LAST_SYNC_KEY, new Date().toISOString());
        return {
          success: true,
          message: 'Seluruh data berhasil disinkronkan ke Google Sheet!',
          timestamp: new Date().toISOString()
        };
      }
    }

    if (resData.status === 'success' || response.ok) {
      localStorage.setItem(GOOGLE_SHEET_LAST_SYNC_KEY, new Date().toISOString());
      return {
        success: true,
        message: resData.message || 'Seluruh data berhasil disinkronkan ke Google Sheet!',
        timestamp: new Date().toISOString(),
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
 * Pull updated schedule and staff from Google Sheet
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
      body: JSON.stringify({
        action: 'PULL_SCHEDULE_DATA',
        spreadsheetId: DEFAULT_SPREADSHEET_ID,
        timestamp: new Date().toISOString()
      })
    });

    const text = await response.text();
    const resData = JSON.parse(text);

    if (resData.status === 'success' && resData.schedule_shifts) {
      localStorage.setItem('riz_september_2026_schedule', JSON.stringify(resData.schedule_shifts));
      localStorage.setItem('riz_september_2026_shifts', JSON.stringify(resData.schedule_shifts));
      localStorage.setItem(GOOGLE_SHEET_LAST_SYNC_KEY, new Date().toISOString());
      return {
        success: true,
        message: `Berhasil menarik ${resData.schedule_shifts.length} jadwal shift dari Google Sheet!`,
        timestamp: new Date().toISOString(),
        details: resData
      };
    } else {
      return {
        success: false,
        message: resData.message || 'Gagal memproses data dari Google Sheet',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Error saat menarik data: ${error.message || 'Koneksi bermasalah'}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Complete Google Apps Script template for deployment in user's Google Spreadsheet
 */
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `/**
 * =========================================================================================
 * GOOGLE APPS SCRIPT: PT. RIZ PRODUCTION MULTI KREASI REAL-TIME SYNC BRIDGE
 * Spreadsheet Target: https://docs.google.com/spreadsheets/d/1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA/edit
 * =========================================================================================
 * PETUNJUK DEPLOYMENT (3 LANGKAH MUDAH):
 * 1. Di Google Sheet, buka menu: Ekstensi (Extensions) > Apps Script
 * 2. Hapus seluruh kode lama di editor, paste seluruh kode ini, lalu klik icon Save (Ctrl+S)
 * 3. Klik tombol "Terapkan" (Deploy) di kanan atas > "Deployment baru" (New deployment)
 *    - Pilih Jenis: "Aplikasi Web" (Web app)
 *    - Jalankan sebagai: "Saya" (Me)
 *    - Siapa yang memiliki akses: "Siapa saja" (Anyone)
 * 4. Klik Terapkan (Deploy), berikan izin akses akun Google, lalu COPY URL Aplikasi Web.
 * 5. Paste URL Web App tersebut ke Panel Admin di aplikasi RIZ-PRODUCTION!
 * =========================================================================================
 */

function doPost(e) {
  try {
    var rawContents = e.postData.contents;
    var payload = JSON.parse(rawContents);
    var action = payload.action;
    
    // Otomatis buka Spreadsheet PT. RIZ Production (berfungsi baik dari Ekstensi Sheet maupun Standalone script.new)
    var ss = null;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch(e) {}
    if (!ss) {
      ss = SpreadsheetApp.openById("1WJ_0WvX_K8te7rZZXR3mTkwZ1kPnm_VA");
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

      // 6. Sync Schedule Shifts
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

function writeStaffSheet(ss, staffList) {
  var sheet = getOrCreateSheet(ss, 'MASTER_STAFF');
  sheet.clearContents();

  var headers = ['ID Staf', 'Nama Lengkap (KTP)', 'Nama Panggilan', 'Divisi', 'Role / Jabatan', 'Jenjang Level', 'No. WhatsApp / Telp', 'Email'];
  var rows = [headers];

  for (var i = 0; i < staffList.length; i++) {
    var s = staffList[i];
    rows.push([
      s.id || '',
      s.fullName || s.name || '',
      s.nickname || s.name || '',
      s.division || '',
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

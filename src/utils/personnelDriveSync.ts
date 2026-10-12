/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Modul Sinkronisasi, Ekspor, dan Impor Data Master Personel (Staf & Freelance)
 * dengan Google Drive Resmi PT. Riz Production Multi Kreasi:
 * Folder: https://drive.google.com/drive/folders/1hBGpse_uG9bbeMNqc0qdbMydLTt0uDuq
 */

import Papa from 'papaparse';
import { 
  Staff, 
  FreelanceWorker, 
  Division, 
  FreelanceSpecialization,
  OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL,
  OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID
} from '../types';

export interface PersonnelImportResult {
  success: boolean;
  detectedType: 'staff' | 'freelance' | 'both';
  staffRecords: Staff[];
  freelanceRecords: FreelanceWorker[];
  errors: string[];
  warnings: string[];
  summary: {
    staffCount: number;
    freelanceCount: number;
  };
}

// Unduh file secara otomatis ke browser pengguna
function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────
// 1. EKSPOR DATA KE FILE (JSON & CSV) UNTUK DISIMPAN DI DRIVE
// ─────────────────────────────────────────────────────────────

export function exportStaffToJson(staffList: Staff[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const payload = {
    company: "PT. Riz Production Multi Kreasi",
    dataType: "master_staff",
    folderId: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID,
    folderUrl: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL,
    exportedAt: new Date().toISOString(),
    totalRecords: staffList.length,
    data: staffList
  };
  triggerDownload(
    JSON.stringify(payload, null, 2),
    `data_staf_karyawan_riz_production_${dateStr}.json`,
    'application/json;charset=utf-8'
  );
}

export function exportStaffToCsv(staffList: Staff[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const rows = staffList.map(s => ({
    ID: s.id,
    Nama: s.name,
    Nama_Lengkap_KTP: s.fullName || '',
    Panggilan: s.nickname || '',
    Divisi: s.division,
    Divisi_Kedua: s.secondaryDivision || '',
    Jabatan: s.role,
    Level_Kompetensi: s.level ?? 2,
    No_Telepon_WA: s.phone || '',
    Email: s.email || ''
  }));

  const csv = Papa.unparse(rows);
  // Tambahkan UTF-8 BOM (\uFEFF) untuk kompatibilitas sempurna di Excel & Google Sheets
  triggerDownload(
    '\uFEFF' + csv,
    `data_staf_karyawan_riz_production_${dateStr}.csv`,
    'text/csv;charset=utf-8'
  );
}

export function exportFreelanceToJson(freelanceList: FreelanceWorker[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const payload = {
    company: "PT. Riz Production Multi Kreasi",
    dataType: "freelance_workers",
    folderId: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID,
    folderUrl: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL,
    exportedAt: new Date().toISOString(),
    totalRecords: freelanceList.length,
    data: freelanceList
  };
  triggerDownload(
    JSON.stringify(payload, null, 2),
    `data_freelance_kru_riz_production_${dateStr}.json`,
    'application/json;charset=utf-8'
  );
}

export function exportFreelanceToCsv(freelanceList: FreelanceWorker[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const rows = freelanceList.map(f => ({
    ID: f.id,
    Nama: f.name,
    Spesialisasi: f.specialization,
    Jabatan_Role: f.roleTitle || '',
    No_Telepon_WA: f.phone || '',
    Email: f.email || '',
    Honor_Harian_Rp: f.dailyRate ?? 0,
    No_KTP: f.idCardNumber || '',
    Bank: f.bankName || '',
    No_Rekening: f.bankAccountNumber || '',
    Atas_Nama: f.bankAccountHolder || '',
    Status: f.status || 'Aktif',
    Rating: f.rating ?? 5,
    Keahlian: f.skills || '',
    Alamat: f.address || '',
    Catatan: f.notes || '',
    Tanggal_Terdaftar: f.createdAt || ''
  }));

  const csv = Papa.unparse(rows);
  triggerDownload(
    '\uFEFF' + csv,
    `data_freelance_kru_riz_production_${dateStr}.csv`,
    'text/csv;charset=utf-8'
  );
}

export function exportAllPersonnelToJson(staffList: Staff[], freelanceList: FreelanceWorker[]): void {
  const dateStr = new Date().toISOString().slice(0, 10);
  const payload = {
    company: "PT. Riz Production Multi Kreasi",
    dataType: "master_all_personnel",
    folderId: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID,
    folderUrl: OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL,
    exportedAt: new Date().toISOString(),
    totalStaff: staffList.length,
    totalFreelance: freelanceList.length,
    staff: staffList,
    freelance: freelanceList
  };
  triggerDownload(
    JSON.stringify(payload, null, 2),
    `backup_master_personel_lengkap_riz_production_${dateStr}.json`,
    'application/json;charset=utf-8'
  );
}

// ─────────────────────────────────────────────────────────────
// 2. PARSING FILE TARIKAN DARI GOOGLE DRIVE (JSON / CSV)
// ─────────────────────────────────────────────────────────────

const VALID_DIVISIONS: Division[] = ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Gudang', 'Admin', 'Service', 'Semua Divisi', 'Umum'];
const VALID_SPECIALIZATIONS: FreelanceSpecialization[] = ['Audio', 'Lighting', 'Videotron', 'Multimedia', 'Rigging', 'Genset / Power', 'Gudang / Helper', 'Driver', 'Service / Teknisi', 'Umum'];

function normalizeKey(k: string): string {
  return k.toLowerCase().replace(/[\s_\-#]+/g, '');
}

export function parsePersonnelImportFile(fileContent: string, fileName: string): PersonnelImportResult {
  const result: PersonnelImportResult = {
    success: false,
    detectedType: 'both',
    staffRecords: [],
    freelanceRecords: [],
    errors: [],
    warnings: [],
    summary: {
      staffCount: 0,
      freelanceCount: 0
    }
  };

  const isJson = fileName.toLowerCase().endsWith('.json') || fileContent.trim().startsWith('{') || fileContent.trim().startsWith('[');

  if (isJson) {
    try {
      const parsed = JSON.parse(fileContent);
      let staffRaw: any[] = [];
      let freelanceRaw: any[] = [];

      if (Array.isArray(parsed)) {
        // Deteksi jenis array berdasarkan isi item pertama
        const first = parsed[0] || {};
        if ('specialization' in first || 'dailyRate' in first || 'idCardNumber' in first) {
          freelanceRaw = parsed;
        } else {
          staffRaw = parsed;
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        if (Array.isArray(parsed.staff) || Array.isArray(parsed.freelance)) {
          if (Array.isArray(parsed.staff)) staffRaw = parsed.staff;
          if (Array.isArray(parsed.freelance)) freelanceRaw = parsed.freelance;
        } else if (Array.isArray(parsed.data)) {
          if (parsed.dataType === 'freelance_workers' || parsed.dataType === 'freelance') {
            freelanceRaw = parsed.data;
          } else {
            staffRaw = parsed.data;
          }
        }
      }

      // Validasi & normalisasi Staf
      for (const item of staffRaw) {
        if (!item || !item.name) continue;
        const validDiv = VALID_DIVISIONS.find(d => d.toLowerCase() === String(item.division || '').toLowerCase()) || 'Umum';
        const staffObj: Staff = {
          id: item.id || `staff-${String(item.name).toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36).slice(-4)}`,
          name: String(item.name).trim(),
          fullName: item.fullName ? String(item.fullName).trim() : undefined,
          nickname: item.nickname ? String(item.nickname).trim() : undefined,
          division: validDiv,
          secondaryDivision: item.secondaryDivision,
          divisions: Array.isArray(item.divisions) ? item.divisions : undefined,
          role: item.role || 'Staff',
          level: typeof item.level === 'number' ? item.level : 2,
          avatar: item.avatar || '',
          phone: item.phone ? String(item.phone).trim() : '',
          email: item.email ? String(item.email).trim() : '',
          password: item.password
        };
        result.staffRecords.push(staffObj);
      }

      // Validasi & normalisasi Freelance
      for (const item of freelanceRaw) {
        if (!item || !item.name) continue;
        const validSpec = VALID_SPECIALIZATIONS.find(s => s.toLowerCase() === String(item.specialization || '').toLowerCase()) || 'Umum';
        const freeObj: FreelanceWorker = {
          id: item.id || `fl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: String(item.name).trim(),
          specialization: validSpec,
          roleTitle: item.roleTitle || `Freelance ${validSpec}`,
          phone: item.phone ? String(item.phone).trim() : '',
          email: item.email ? String(item.email).trim() : '',
          dailyRate: typeof item.dailyRate === 'number' ? item.dailyRate : Number(item.dailyRate || 0),
          idCardNumber: item.idCardNumber ? String(item.idCardNumber).trim() : '',
          bankName: item.bankName ? String(item.bankName).trim() : 'BCA',
          bankAccountNumber: item.bankAccountNumber ? String(item.bankAccountNumber).trim() : '',
          bankAccountHolder: item.bankAccountHolder ? String(item.bankAccountHolder).trim() : String(item.name).trim(),
          status: (item.status === 'Standby' || item.status === 'Nonaktif') ? item.status : 'Aktif',
          rating: typeof item.rating === 'number' ? item.rating : 5,
          skills: item.skills ? String(item.skills).trim() : '',
          address: item.address ? String(item.address).trim() : '',
          notes: item.notes ? String(item.notes).trim() : '',
          createdAt: item.createdAt || new Date().toISOString().slice(0, 10)
        };
        result.freelanceRecords.push(freeObj);
      }

    } catch (err: any) {
      result.errors.push(`Gagal membaca file JSON: ${err?.message || 'Format tidak valid'}`);
      return result;
    }
  } else {
    // Parsing CSV
    try {
      const parsedCsv = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false
      });

      if (parsedCsv.errors && parsedCsv.errors.length > 0) {
        result.warnings.push(`Peringatan format CSV: ${parsedCsv.errors.map(e => e.message).join(', ')}`);
      }

      const rows = parsedCsv.data as Record<string, any>[];
      if (!rows || rows.length === 0) {
        result.errors.push('File CSV kosong atau tidak memiliki data.');
        return result;
      }

      // Deteksi kolom CSV
      const firstRow = rows[0] || {};
      const keysNormalized = Object.keys(firstRow).map(k => normalizeKey(k));
      const hasStaffCols = keysNormalized.some(k => k === 'divisi' || k === 'division' || k.includes('levelkompetensi') || k.includes('namalengkapktp'));
      const hasFreelanceCols = keysNormalized.some(k => k.includes('spesialisasi') || k.includes('specialization') || k.includes('honorharian') || k.includes('dailyrate') || k === 'noktp' || k === 'idcardnumber');
      const isFreelance = hasFreelanceCols && !hasStaffCols;

      if (isFreelance) {
        result.detectedType = 'freelance';
        for (const r of rows) {
          const mapped: Record<string, string> = {};
          for (const [colName, val] of Object.entries(r)) {
            mapped[normalizeKey(colName)] = String(val ?? '').trim();
          }

          const name = mapped['nama'] || mapped['name'] || '';
          if (!name) continue;

          const rawSpec = mapped['spesialisasi'] || mapped['specialization'] || 'Umum';
          const validSpec = VALID_SPECIALIZATIONS.find(s => s.toLowerCase() === rawSpec.toLowerCase()) || 'Umum';

          const rateStr = (mapped['honorharianrp'] || mapped['honor'] || mapped['dailyrate'] || '0').replace(/[^0-9]/g, '');

          const freeObj: FreelanceWorker = {
            id: mapped['id'] || `fl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
            name: name,
            specialization: validSpec,
            roleTitle: mapped['jabatanrole'] || mapped['jabatan'] || mapped['roletitle'] || `Freelance ${validSpec}`,
            phone: mapped['noteleponwa'] || mapped['telepon'] || mapped['phone'] || mapped['wa'] || '',
            email: mapped['email'] || '',
            dailyRate: Number(rateStr) || 0,
            idCardNumber: mapped['noktp'] || mapped['ktp'] || mapped['idcardnumber'] || '',
            bankName: mapped['bank'] || mapped['bankname'] || 'BCA',
            bankAccountNumber: mapped['norekening'] || mapped['rekening'] || mapped['bankaccountnumber'] || '',
            bankAccountHolder: mapped['atasnama'] || mapped['bankaccountholder'] || name,
            status: (mapped['status']?.toLowerCase() === 'standby') ? 'Standby' : (mapped['status']?.toLowerCase() === 'nonaktif') ? 'Nonaktif' : 'Aktif',
            rating: Number(mapped['rating']) || 5,
            skills: mapped['keahlian'] || mapped['skills'] || '',
            address: mapped['alamat'] || mapped['address'] || '',
            notes: mapped['catatan'] || mapped['notes'] || '',
            createdAt: mapped['tanggalterdaftar'] || mapped['createdat'] || new Date().toISOString().slice(0, 10)
          };
          result.freelanceRecords.push(freeObj);
        }
      } else {
        result.detectedType = 'staff';
        for (const r of rows) {
          const mapped: Record<string, string> = {};
          for (const [colName, val] of Object.entries(r)) {
            mapped[normalizeKey(colName)] = String(val ?? '').trim();
          }

          const name = mapped['nama'] || mapped['name'] || '';
          if (!name) continue;

          const rawDiv = mapped['divisi'] || mapped['division'] || 'Umum';
          const validDiv = VALID_DIVISIONS.find(d => d.toLowerCase() === rawDiv.toLowerCase()) || 'Umum';

          const staffObj: Staff = {
            id: mapped['id'] || `staff-${name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString(36).slice(-4)}`,
            name: name,
            fullName: mapped['namalengkapktp'] || mapped['namalengkap'] || mapped['fullname'] || undefined,
            nickname: mapped['panggilan'] || mapped['namapanggilan'] || mapped['nickname'] || undefined,
            division: validDiv,
            secondaryDivision: (mapped['divisikedua'] as Division) || undefined,
            role: (mapped['jabatan'] as any) || (mapped['role'] as any) || 'Staff',
            level: Number(mapped['levelkompetensi'] || mapped['level']) || 2,
            phone: mapped['noteleponwa'] || mapped['telepon'] || mapped['phone'] || '',
            email: mapped['email'] || '',
            avatar: mapped['avatar'] || ''
          };
          result.staffRecords.push(staffObj);
        }
      }
    } catch (err: any) {
      result.errors.push(`Gagal membaca file CSV: ${err?.message || 'Format tidak valid'}`);
      return result;
    }
  }

  result.summary.staffCount = result.staffRecords.length;
  result.summary.freelanceCount = result.freelanceRecords.length;

  if (result.summary.staffCount > 0 && result.summary.freelanceCount > 0) {
    result.detectedType = 'both';
  } else if (result.summary.freelanceCount > 0) {
    result.detectedType = 'freelance';
  } else if (result.summary.staffCount > 0) {
    result.detectedType = 'staff';
  }

  result.success = (result.summary.staffCount > 0 || result.summary.freelanceCount > 0);
  if (!result.success && result.errors.length === 0) {
    result.errors.push('Tidak ditemukan data personel yang valid dalam file ini.');
  }

  return result;
}

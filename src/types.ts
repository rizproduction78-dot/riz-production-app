/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Division = 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Gudang' | 'Admin' | 'Service' | 'Semua Divisi' | 'Umum';

export const OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h?usp=sharing";
export const OFFICIAL_GOOGLE_DRIVE_FOLDER_ID = "1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h";
export const OFFICIAL_GOOGLE_DRIVE_ATTENDANCE_FOLDER_URL = "https://drive.google.com/drive/folders/1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h";

// Folder Resmi Google Drive Data Staff & Freelance PT. Riz Production Multi Kreasi
export const OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_URL = "https://drive.google.com/drive/folders/1hBGpse_uG9bbeMNqc0qdbMydLTt0uDuq";
export const OFFICIAL_GOOGLE_DRIVE_STAFF_FREELANCE_FOLDER_ID = "1hBGpse_uG9bbeMNqc0qdbMydLTt0uDuq";

// Sumber Resmi Google Sheet Data Unit Armada & Riwayat Servis PT. Riz Production Multi Kreasi
export const OFFICIAL_ARMADA_SPREADSHEET_ID = "1YuJ_rVhvYUTKKujiHNFOydVWAeCDz5H4ui7pDLvXxUs";
export const OFFICIAL_ARMADA_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1YuJ_rVhvYUTKKujiHNFOydVWAeCDz5H4ui7pDLvXxUs/edit?usp=sharing";

// Sumber Resmi Google Docs Jadwal Penugasan Kerja / Job Crew (Staff & Freelance)
export const OFFICIAL_JOB_SCHEDULE_DOC_ID = "1Lwti9V2-5P4WwwkMPupR5stuXNc1Y02W";
export const OFFICIAL_JOB_SCHEDULE_DOC_URL = "https://docs.google.com/document/d/1Lwti9V2-5P4WwwkMPupR5stuXNc1Y02W/edit#heading=h.nf6ix777sh6z";

// Alamat Resmi & Koordinat GPS Kantor / Gudang PT. Riz Production Multi Kreasi
export const OFFICIAL_COMPANY_ADDRESS = "Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164";
export const OFFICIAL_COMPANY_PLUS_CODE = "CRR3+82 Kedungbadak, Bogor City, West Java";
export const OFFICIAL_COMPANY_GPS_LAT = -6.55919;
export const OFFICIAL_COMPANY_GPS_LNG = 106.80256;
export const OFFICIAL_COMPANY_GPS_COORDINATES = "Lat: -6.55919, Lng: 106.80256";
export const OFFICIAL_COMPANY_LOCATION_FULL = "Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164 (CRR3+82 Kedungbadak, Bogor City, West Java)";
export const OFFICIAL_COMPANY_GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=-6.55919,106.80256";

export interface Staff {
  id: string;
  name: string;
  fullName?: string; // NAMA ASLI (Nama Lengkap Resmi KTP)
  nickname?: string; // NAMA PANGGILAN (Panggilan Lapangan)
  division: Division;
  secondaryDivision?: Division; // Divisi kedua (misal Mulyana/Kharo: Service & Videotron)
  divisions?: Division[]; // Daftar seluruh divisi yang dipegang
  role: 'Owner' | 'Direktur' | 'Admin' | 'Supervisor' | 'Team Leader' | 'Staff Leader' | 'Staff Admin' | 'Staff' | 'Gudang' | 'Manager';
  level?: number; // Jenjang Tingkat Kompetensi (Level 1 - 8)
  avatar?: string;
  phone?: string;
  email?: string;
  password?: string;
  passwordRequest?: string;
}

export interface AttendanceLog {
  id: string;
  staffId: string;
  staffName: string;
  division: Division;
  date: string;
  checkInTime?: string;
  checkInPhoto?: string;
  checkInGps?: string;
  checkOutTime?: string;
  checkOutPhoto?: string;
  checkOutGps?: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha' | 'Off';
  isLate: boolean;
  lateMinutes: number;
}

export interface WorkSchedule {
  id: string; // e.g., "2026-07"
  monthLabel: string; // e.g., "Juli 2026"
  scheduleData: {
    [staffId: string]: {
      [day: number]: 'Masuk' | 'Off' | 'Libur' | 'Izin' | 'Sakit' | 'Alpha';
    };
  };
}

export interface VehicleMaster {
  id: string;
  name: string;
  unitCode?: string; // Kode unit armada internal (misal: 011, 012, 013, 014)
  ownership: 'Internal' | 'Sewa Mitra';
  policeNumber: string;
  vehicleType: string;
  tonnageCapacity: number; // Ton
  cbmCapacity: number; // m3
  odometerKM: number;
  stnkTaxExpiry: string; // YYYY-MM-DD
  kirExpiry: string; // YYYY-MM-DD (atau '-' untuk kendaraan non-KIR)
  status: 'Siap Operasi' | 'Dalam Perjalanan' | 'Maintenance / Servis';
  sheetGid?: string; // GID tab Google Sheet resmi
  totalMaintenanceCost?: number; // Total akumulasi biaya servis & sparepart (Rp)
  maintenanceHistory?: VehicleMaintenanceRecord[]; // Riwayat servis resmi dari Google Sheet
  _syncedAt?: string; // Timestamp sinkronisasi cloud
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface ManifestCargoItem {
  id: string;
  division: 'Audio' | 'Lighting' | 'Videotron' | 'Rigging' | 'Genset / Power' | 'Umum';
  itemDescription: string;
  qty: number;
  unit: 'Flightcase' | 'Pcs' | 'Pallet' | 'Roll' | 'Box';
  estimatedCBM: number;
}

export interface P2HChecklist {
  banPsi: boolean; // Ban (105 PSI)
  oliMesin: boolean; // Oli/Mesin
  rem: boolean; // Rem
  kelistrikanLampu: boolean; // Sistem Kelistrikan/Lampu
  radiatorCoolant: boolean; // Radiator/Coolant
  ratchetLashingStrap: boolean; // Pengikatan Muatan (Ratchet Lashing Strap)
  legalitasSurat: boolean; // Legalitas Surat (STNK/KIR/SIM)
  notes?: string;
  inspector: string; // Agus (Supervisor Teknis)
  inspectedAt?: string;
}

export interface FleetBudgetRAB {
  sewaVendor: number; // Biaya sewa armada vendor eksternal
  bbmSolar: number; // BBM Solar/Bensin
  eToll: number; // e-Toll
  uangMakanDriver: number; // Uang makan pengemudi
  biayaBongkarMuat: number; // Biaya bongkar muat crew
  totalRAB: number;
  receiptVerified: boolean; // Verifikasi kuitansi oleh Caca
  calculatedBy: string; // Caca (Admin & Logistik)
}

export interface FleetAssignment {
  id: string;
  spjNumber: string; // Nomor SPJ
  eventName: string; // Nama Event / Project
  tripType: 'Dalam Kota (Jabodetabek)' | 'Luar Kota (Tour / Festival)';
  vehicleId?: string;
  vehicleType: string; // Truk Box Mitsubishi Canter CDD, dsb.
  policeNumber: string; // Plat Nomor
  driverName: string;
  destination: string; // Lokasi Venue / Rute
  departureDate: string;
  returnDate: string;
  manifest: ManifestCargoItem[];
  totalCBM: number;
  p2hStatus: 'Laik Jalan' | 'Perlu Perbaikan' | 'Tidak Laik' | 'Pending';
  p2h: P2HChecklist;
  budget: FleetBudgetRAB;
  approvalStatus: 'Draft' | 'Menunggu Approval Fahrul' | 'Approved' | 'Rejected';
  approvedBy?: string; // Fahrul (Manager Operasional)
  approvedAt?: string;
  status: 'Draft' | 'Menunggu Approval Fahrul' | 'Disetujui' | 'Dalam Perjalanan (On Trip)' | 'Selesai' | 'Dibatalkan';
}

export interface WarehouseLog {
  id: string;
  type: 'Masuk' | 'Keluar' | 'Loading' | 'Unloading' | 'Servis Keluar' | 'Servis Masuk';
  date: string;
  itemName: string;
  qty: number;
  pic: string;
  notes: string;
  assetCode?: string;
  photoUrl?: string;
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface QCItem {
  name: string;
  status: 'OK' | 'NG' | null;
  notes: string;
}

export interface QCDivisionReport {
  items: { [key: string]: { status: 'OK' | 'NG' | null; notes: string } };
}

export interface LogbookEntry {
  id: string;
  date: string;
  time?: string;
  division: Division;
  staffName: string;
  activity: string; // e.g., "Cleaning / Check / Test"
  result: 'OK' | 'NG';
  followUp: string;
  status: 'Open' | 'Close';
  verification: string; // Supervisor verification name/status
  checklists: { [key: string]: { status: 'OK' | 'NG'; notes: string } };
  rowDetails?: Array<{ activity: string; remark: string }>;
  photoUrl?: string; // Foto bukti inspeksi / QC (single/thumbnail)
  photos?: string[]; // Mendukung beberapa foto bukti sekaligus
  _source?: string;
  _syncedAt?: string; // Timestamp sinkronisasi cloud
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface DailyReport {
  id: string;
  date: string;
  staffName: string;
  division: Division;
  activity: string;
  notes: string;
  rowDetails?: Array<{ activity: string; remark: string }>;
  photoUrl?: string;
  photos?: string[]; // Mendukung beberapa foto dokumentasi
  status: 'Draft' | 'Submitted';
  _source?: string;
  _syncedAt?: string; // Timestamp sinkronisasi cloud
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface Finding {
  id: string;
  equipment: string;
  issue: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  pic: string;
  targetDate: string;
  status: 'Open' | 'Close';
  dateCreated: string;
  date?: string; // Alias / field alternatif tanggal
  updatedAt?: string; // Timestamp update terakhir
  division?: Division;
  approvedBy?: string;
  approvedAt?: string;
  _source?: string;
  _syncedAt?: string; // Timestamp sinkronisasi cloud
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export const OFFICIAL_INVENTORY_SPREADSHEET_ID = "1lZ9Ja-GWY7BMn7l9uUM4p5Q97DXeKy0O";
export const OFFICIAL_INVENTORY_SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1lZ9Ja-GWY7BMn7l9uUM4p5Q97DXeKy0O/edit?usp=sharing";

export interface Asset {
  id: string;
  code: string;
  name: string;
  brand: string;
  serialNumber: string;
  division: Division;
  location: string;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  repairHistory: { date: string; description: string; cost: number; PIC: string }[];
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface WorkOrder {
  id: string;
  findingId?: string;
  title: string;
  description: string;
  pic: string;
  division: Division;
  deadline: string;
  progress: number; // 0 to 100
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  dateCreated: string;
  approvedBy?: string;
  approvedAt?: string;
  equipment?: string;
  priority?: string;
  notes?: string;
  _source?: string;
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface MaintenanceSchedule {
  id: string;
  assetName: string;
  assetCode: string;
  type: 'Preventive' | 'Corrective';
  frequency: 'Harian' | 'Mingguan' | 'Bulanan' | 'Insidental';
  lastDate: string;
  nextDate: string;
  status: 'Scheduled' | 'Done' | 'Overdue';
  notes: string;
  sparepart?: string;
  vendor?: string;
  biaya?: number;
  photoUrl?: string;
}

export interface UserActivity {
  id: string;
  timestamp: string;
  username: string;
  role: string;
  action: string;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  division: Division;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  status: 'Pending' | 'In Progress' | 'Done';
  assignedTo?: string;
  assignedName?: string;
  dueDate?: string;
  createdAt: string;
  createdBy: string;
  photoUrl?: string;
  photos?: string[];
}

export type FreelanceSpecialization = 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Rigging' | 'Genset / Power' | 'Gudang / Helper' | 'Driver' | 'Service / Teknisi' | 'Umum';

export interface FreelanceWorker {
  id: string;
  name: string;
  specialization: FreelanceSpecialization;
  roleTitle: string; // e.g., "Freelance Sound Engineer", "Operator Lighting", "Crew Loading"
  phone: string;
  email?: string;
  dailyRate?: number; // Honor harian per event (Rp)
  idCardNumber?: string; // No. KTP
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountHolder?: string;
  status: 'Aktif' | 'Standby' | 'Nonaktif';
  rating?: number; // 1-5 bintang
  skills?: string; // Keahlian khusus & portfolio
  address?: string;
  notes?: string;
  createdAt: string;
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface FleetDriver {
  id: string;
  name: string;
  phone: string;
  driverType: 'Internal' | 'Mitra Vendor' | 'Freelance Driver';
  simType: 'SIM A' | 'SIM B1' | 'SIM B1 Umum' | 'SIM B2' | 'SIM B2 Umum';
  simExpiry: string; // YYYY-MM-DD
  idCardNumber?: string; // No. KTP
  assignedVehicle?: string; // Kendaraan default yang biasa dibawa
  status: 'Siap Jalan' | 'On Trip' | 'Off / Libur' | 'Nonaktif';
  emergencyContact?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

export interface VehicleMaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  type: 'Service Rutin' | 'Ganti Oli' | 'Ganti Ban' | 'Perbaikan' | 'Lainnya';
  description: string;
  cost?: number;
  technician?: string;
  nextServiceDate?: string;
  notes?: string;
}

export interface JobCrewMember {
  name: string; // Nama panggilan di jadwal (misal: Mboh, Bulux, Adin, Ayong, Wigi)
  canonicalName: string; // Nama resmi di master Staff / Freelance
  personnelType: 'Staff' | 'Freelance';
  staffId?: string; // ID staf inhouse atau freelance
  division?: string;
  roleNote?: string; // Catatan peran khusus (misal: Pasang, Bongkaran, VJ & Zoom, Campers, Drop)
}

export interface JobDivisionSection {
  division: 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Produksi' | 'Umum';
  packageLabel: string; // e.g., "Sound 20rb", "LED 48Meter (Victor)", "Lighting", "Stream + 4 Cam"
  equipment: string[]; // Daftar unit alat yang dibawa
  crew: JobCrewMember[]; // Daftar staff inhouse & freelance yang ditugaskan
  vehicles: string[]; // Daftar unit armada / mobilisasi (Truck, Riz 2, Engkel Riz, Serena, Yosep, dll.)
  sectionPic?: string; // PIC spesifik sub-divisi bila ada
}

export interface JobAssignment {
  id: string;
  monthKey: string; // '2026-11' | '2026-12'
  date: string; // YYYY-MM-DD (tanggal mulai event)
  endDate?: string; // YYYY-MM-DD (tanggal selesai bila multi-hari)
  dateLabel: string; // Label tanggal asli dari dokumen (misal: "3 Nov 2026", "28-30 Nov 2026")
  venue: string; // Lokasi / Venue (misal: "Qbig BSD", "Parkir Timur Senayan", "Sheraton")
  loadingSchedule: string; // Jadwal loading / berangkat (misal: "Packing Malam Jalan jam 06.00 Pagi", "Loading 3 Malam")
  pic: string; // Person in Charge utama event (misal: "Jay (Mulyadi)", "Fahrul", "Agus", "Mboh (Muhamad Rahmat)")
  sections: JobDivisionSection[];
  notes?: string; // Catatan khusus kostum / aturan venue / vendor
  status: 'Terjadwal' | 'Loading / Setup' | 'Berlangsung (Show)' | 'Bongkaran' | 'Selesai';
  _userEdited?: boolean;
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
    _userEdited?: boolean;
  };
}



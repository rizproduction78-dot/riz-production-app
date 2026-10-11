/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Division = 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Gudang' | 'Admin' | 'Service' | 'Semua Divisi' | 'Umum';

export const OFFICIAL_GOOGLE_DRIVE_EVIDENCE_FOLDER_URL = "https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j";

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
  ownership: 'Internal' | 'Sewa Mitra';
  policeNumber: string;
  vehicleType: string;
  tonnageCapacity: number; // Ton
  cbmCapacity: number; // m3
  odometerKM: number;
  stnkTaxExpiry: string; // YYYY-MM-DD
  kirExpiry: string; // YYYY-MM-DD
  status: 'Siap Operasi' | 'Dalam Perjalanan' | 'Maintenance / Servis';
  _syncedAt?: string; // Timestamp sinkronisasi Firestore
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
  division: Division;
  staffName: string;
  activity: string; // e.g., "Cleaning / Check / Test"
  result: 'OK' | 'NG';
  followUp: string;
  status: 'Open' | 'Close';
  verification: string; // Supervisor verification name/status
  checklists: { [key: string]: { status: 'OK' | 'NG'; notes: string } };
  photoUrl?: string; // Foto bukti inspeksi / QC (single/thumbnail)
  photos?: string[]; // Mendukung beberapa foto bukti sekaligus
  _source?: string;
  _syncedAt?: string; // Timestamp sinkronisasi Firestore
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
  photoUrl?: string;
  photos?: string[]; // Mendukung beberapa foto dokumentasi
  status: 'Draft' | 'Submitted';
  _source?: string;
  _syncedAt?: string; // Timestamp sinkronisasi Firestore
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
  date?: string; // Alias / field alternatif dari Firestore sync
  updatedAt?: string; // Timestamp update terakhir dari Firestore
  division?: Division;
  approvedBy?: string;
  approvedAt?: string;
  _source?: string;
  _syncedAt?: string; // Timestamp sinkronisasi Firestore
  _syncMeta?: {
    updatedAt: string;
    updatedBy: string;
    deviceOS?: string;
    deviceType?: string;
    browser?: string;
  };
}

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


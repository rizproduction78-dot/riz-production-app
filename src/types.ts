/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Division = 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Gudang' | 'Admin' | 'Service';

export interface Staff {
  id: string;
  name: string;
  division: Division;
  role: 'Admin' | 'Supervisor' | 'Team Leader' | 'Staff' | 'Gudang' | 'Manager';
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
  division: 'Audio' | 'Lighting' | 'Videotron' | 'Multimedia' | 'Service';
  staffName: string;
  activity: string; // e.g., "Cleaning / Check / Test"
  result: 'OK' | 'NG';
  followUp: string;
  status: 'Open' | 'Close';
  verification: string; // Supervisor verification name/status
  checklists: { [key: string]: { status: 'OK' | 'NG'; notes: string } };
  photoUrl?: string; // Foto bukti inspeksi / QC
}

export interface DailyReport {
  id: string;
  date: string;
  staffName: string;
  division: Division;
  activity: string;
  notes: string;
  photoUrl?: string;
  status: 'Draft' | 'Submitted';
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
}

export interface WorkOrder {
  id: string;
  title: string;
  description: string;
  pic: string;
  division: Division;
  deadline: string;
  progress: number; // 0 to 100
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  dateCreated: string;
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
}

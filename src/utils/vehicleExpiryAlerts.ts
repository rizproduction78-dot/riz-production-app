/**
 * UTILITY ENGINE: PEMBERITAHUAN MASA BERLAKU STNK & KIR ARMADA KENDARAAN
 * Sesuai aturan operasional PT. Riz Production Multi Kreasi:
 * 1. Masa berlaku STNK: 1 Tahun (12 bulan)
 * 2. Masa berlaku Uji KIR: 6 Bulan (semesteran)
 * 3. Notifikasi pemberitahuan aktif H-30 hari (1 bulan) sebelum tanggal berakhir atau saat kadaluarsa
 */

import { VehicleMaster } from '../types';

export const STNK_VALIDITY_MONTHS = 12;
export const STNK_VALIDITY_LABEL = '1 Tahun';

export const KIR_VALIDITY_MONTHS = 6;
export const KIR_VALIDITY_LABEL = '6 Bulan';

export const EXPIRY_ALERT_THRESHOLD_DAYS = 30; // 1 Bulan sebelum tanggal masa berlaku berakhir

export interface VehicleDocExpiryStatus {
  daysRemaining: number;
  status: 'expired' | 'warning_30d' | 'safe';
  isExpired: boolean;
  isWarning: boolean;
  formattedBadge: string;
  validityLabel: string;
}

export interface VehicleExpiryAlert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  policeNumber: string;
  ownership: 'Internal' | 'Sewa Mitra';
  docType: 'STNK' | 'KIR';
  validityPeriod: '1 Tahun' | '6 Bulan';
  expiryDate: string; // YYYY-MM-DD
  daysRemaining: number;
  status: 'expired' | 'warning_30d';
  urgencyLabel: string;
  message: string;
}

/**
 * Memeriksa status masa berlaku satu dokumen (STNK atau KIR)
 */
export function checkVehicleDocExpiry(
  expiryDateStr?: string,
  docType: 'STNK' | 'KIR' = 'STNK',
  referenceDate?: Date | string
): VehicleDocExpiryStatus {
  const validityLabel = docType === 'STNK' ? STNK_VALIDITY_LABEL : KIR_VALIDITY_LABEL;

  if (!expiryDateStr || expiryDateStr.trim() === '' || expiryDateStr === '-') {
    return {
      daysRemaining: 9999,
      status: 'safe',
      isExpired: false,
      isWarning: false,
      formattedBadge: 'Belum Ada Data',
      validityLabel
    };
  }

  // Normalisasi tanggal (YYYY-MM-DD)
  const cleanExpiry = expiryDateStr.slice(0, 10);
  const expiryDate = new Date(`${cleanExpiry}T00:00:00`);

  let refDate: Date;
  if (referenceDate instanceof Date) {
    refDate = new Date(referenceDate);
  } else if (typeof referenceDate === 'string' && referenceDate.length >= 10) {
    refDate = new Date(`${referenceDate.slice(0, 10)}T00:00:00`);
  } else {
    refDate = new Date();
  }
  refDate.setHours(0, 0, 0, 0);

  if (isNaN(expiryDate.getTime())) {
    return {
      daysRemaining: 9999,
      status: 'safe',
      isExpired: false,
      isWarning: false,
      formattedBadge: 'Format Tanggal Salah',
      validityLabel
    };
  }

  const diffTime = expiryDate.getTime() - refDate.getTime();
  const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) {
    const overdueDays = Math.abs(daysRemaining);
    return {
      daysRemaining,
      status: 'expired',
      isExpired: true,
      isWarning: false,
      formattedBadge: `Kadaluarsa ${overdueDays} hari lalu`,
      validityLabel
    };
  }

  if (daysRemaining === 0) {
    return {
      daysRemaining: 0,
      status: 'warning_30d',
      isExpired: false,
      isWarning: true,
      formattedBadge: 'Jatuh tempo hari ini',
      validityLabel
    };
  }

  if (daysRemaining <= EXPIRY_ALERT_THRESHOLD_DAYS) {
    return {
      daysRemaining,
      status: 'warning_30d',
      isExpired: false,
      isWarning: true,
      formattedBadge: `Sisa ${daysRemaining} hari (H-1 Bln)`,
      validityLabel
    };
  }

  return {
    daysRemaining,
    status: 'safe',
    isExpired: false,
    isWarning: false,
    formattedBadge: `Aman (${daysRemaining} hari)`,
    validityLabel
  };
}

/**
 * Menghasilkan daftar seluruh pemberitahuan masa berlaku STNK dan KIR
 * yang jatuh tempo dalam kurun <= 30 hari (1 bulan) atau telah kadaluarsa.
 */
export function getVehicleExpiryAlerts(
  vehicles: VehicleMaster[],
  referenceDate?: Date | string
): VehicleExpiryAlert[] {
  const alerts: VehicleExpiryAlert[] = [];

  if (!Array.isArray(vehicles)) return alerts;

  vehicles.forEach(v => {
    if (!v || (!v.name && !v.policeNumber)) return;

    const vName = v.name || 'Unit Armada';
    const vPlat = v.policeNumber || '-';

    // 1. Periksa Pajak STNK (Masa Berlaku 1 Tahun)
    const stnkCheck = checkVehicleDocExpiry(v.stnkTaxExpiry, 'STNK', referenceDate);
    if (stnkCheck.status === 'expired' || stnkCheck.status === 'warning_30d') {
      const isExp = stnkCheck.status === 'expired';
      alerts.push({
        id: `alert-stnk-${v.id}-${v.stnkTaxExpiry}`,
        vehicleId: v.id,
        vehicleName: vName,
        policeNumber: vPlat,
        ownership: v.ownership || 'Internal',
        docType: 'STNK',
        validityPeriod: '1 Tahun',
        expiryDate: v.stnkTaxExpiry,
        daysRemaining: stnkCheck.daysRemaining,
        status: stnkCheck.status,
        urgencyLabel: isExp ? 'STNK Kadaluarsa' : 'STNK Segera Berakhir',
        message: isExp
          ? `Pajak STNK unit ${vPlat} (${vName}) telah melewati masa berlaku sejak ${v.stnkTaxExpiry} (${Math.abs(stnkCheck.daysRemaining)} hari lalu). Masa berlaku STNK: 1 Tahun. Wajib segera lakukan perpanjangan pajak!`
          : `Pajak STNK unit ${vPlat} (${vName}) akan berakhir dalam ${stnkCheck.daysRemaining} hari lagi pada ${v.stnkTaxExpiry}. Masa berlaku STNK: 1 Tahun. Segera siapkan perpanjangan sebelum jatuh tempo.`
      });
    }

    // 2. Periksa Uji KIR Dishub (Masa Berlaku 6 Bulan)
    const kirCheck = checkVehicleDocExpiry(v.kirExpiry, 'KIR', referenceDate);
    if (kirCheck.status === 'expired' || kirCheck.status === 'warning_30d') {
      const isExp = kirCheck.status === 'expired';
      alerts.push({
        id: `alert-kir-${v.id}-${v.kirExpiry}`,
        vehicleId: v.id,
        vehicleName: vName,
        policeNumber: vPlat,
        ownership: v.ownership || 'Internal',
        docType: 'KIR',
        validityPeriod: '6 Bulan',
        expiryDate: v.kirExpiry,
        daysRemaining: kirCheck.daysRemaining,
        status: kirCheck.status,
        urgencyLabel: isExp ? 'Uji KIR Kadaluarsa' : 'Uji KIR Segera Berakhir',
        message: isExp
          ? `Uji KIR Dishub unit ${vPlat} (${vName}) telah melewati masa berlaku sejak ${v.kirExpiry} (${Math.abs(kirCheck.daysRemaining)} hari lalu). Masa berlaku KIR: 6 Bulan. Wajib segera lakukan uji berkala Dishub!`
          : `Uji KIR Dishub unit ${vPlat} (${vName}) akan berakhir dalam ${kirCheck.daysRemaining} hari lagi pada ${v.kirExpiry}. Masa berlaku KIR: 6 Bulan. Segera jadwalkan uji berkala Dishub sebelum jatuh tempo.`
      });
    }
  });

  // Urutkan alert: Kadaluarsa paling lama di posisi teratas, lalu yang paling dekat jatuh tempo
  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

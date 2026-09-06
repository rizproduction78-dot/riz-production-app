/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LogbookEntry, DailyReport, Finding, AttendanceLog, Staff } from '../types';
import { FileText, Printer, FileDown, Calendar, Users, CheckSquare, RefreshCw, PenTool } from 'lucide-react';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { calculateAllStaffKpis } from '../utils/kpiCalculator';
import { OFFICIAL_SEPTEMBER_2026_SCHEDULE, StaffScheduleRow } from '../data/september2026Schedule';
import { subscribeCloudCollection } from '../lib/cloudSync';

interface ReportsProps {
  logbookEntries: LogbookEntry[];
  dailyReports: DailyReport[];
  findings: Finding[];
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function Reports({
  logbookEntries,
  dailyReports,
  findings,
  currentUser,
  onLogActivity,
}: ReportsProps) {
  // Master Staff Dynamic State with Cloud Subscription
  const [staffList, setStaffList] = useState<Staff[]>(() => getMasterStaffList());

  useEffect(() => {
    const unsub = subscribeCloudCollection<Staff>(
      'master_staff',
      'riz_master_staff_list',
      setStaffList,
      STAFF_LIST
    );
    return () => unsub();
  }, []);

  const [reportType, setReportType] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Harian');
  const [targetMonth, setTargetMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [targetDate, setTargetDate] = useState(() => {
    return '2026-09-06';
  });
  const [targetStartDate, setTargetStartDate] = useState('2026-09-01');
  const [targetEndDate, setTargetEndDate] = useState('2026-09-07');

  // Dynamic filter for active daily reports based on Harian / Mingguan / Bulanan
  const activeDailyReports = dailyReports.filter(r => {
    if (reportType === 'Harian') return r.date === targetDate;
    if (reportType === 'Mingguan') return r.date >= targetStartDate && r.date <= targetEndDate;
    if (reportType === 'Bulanan') return r.date.startsWith(targetMonth);
    return true;
  });

  // Filter logbook entries based on report type (Harian vs Mingguan vs Bulanan)
  const activeLogbookEntries = logbookEntries.filter(e => {
    if (reportType === 'Harian') return e.date === targetDate;
    if (reportType === 'Mingguan') return e.date >= targetStartDate && e.date <= targetEndDate;
    if (reportType === 'Bulanan') return e.date.startsWith(targetMonth);
    return true;
  });

  // Filter findings based on report type
  const activeFindings = findings.filter(f => {
    if (reportType === 'Harian') return f.dateCreated === targetDate || f.targetDate === targetDate;
    if (reportType === 'Mingguan') return (f.dateCreated >= targetStartDate && f.dateCreated <= targetEndDate) || (f.targetDate >= targetStartDate && f.targetDate <= targetEndDate);
    if (reportType === 'Bulanan') return f.dateCreated?.startsWith(targetMonth) || f.targetDate?.startsWith(targetMonth);
    return true;
  });

  const totalChecked = activeLogbookEntries.length;
  
  // Calculate item-level counts based on active period
  let totalCheckedItems = 0;
  let totalOkItems = 0;
  let totalNgItems = 0;
  activeLogbookEntries.forEach(e => {
    Object.values(e.checklists || {}).forEach(ch => {
      totalCheckedItems++;
      if (ch.status === 'OK') totalOkItems++;
      if (ch.status === 'NG') totalNgItems++;
    });
  });

  const goodCondition = totalOkItems;
  const needRepair = totalNgItems;
  const solvedRepairs = activeFindings.filter(f => f.status === 'Close').length;
  const pendingSpareparts = activeFindings.filter(f => f.status === 'Open' && f.issue.toLowerCase().includes('sparepart')).length;

  // Dynamic staff KPI performance scores prioritized by:
  // 1. Daily Report
  // 2. QC Checklist
  // 3. WO Selesai
  const staffKpis = calculateAllStaffKpis(staffList, activeDailyReports, activeLogbookEntries, activeFindings);
  
  // Filter hanya staf yang memiliki aktifitas riil pada periode yang dipilih
  const activeStaffKpis = staffKpis.filter(staff => staff.reports > 0 || staff.qcs > 0 || staff.wos > 0);

  // Dynamic metrics per division
  const reportDivisions = [
    { name: 'Divisi Sound (Audio)', key: 'Audio' },
    { name: 'Divisi Lighting', key: 'Lighting' },
    { name: 'Divisi Videotron', key: 'Videotron' },
    { name: 'Divisi Multimedia', key: 'Multimedia' },
    { name: 'Gudang (Warehouse)', key: 'Gudang' },
    { name: 'Divisi Service (Perbaikan)', key: 'Service' }
  ];

  const reportDivisionDamageStats = reportDivisions.map(d => {
    const divFindings = findings.filter(f => f.equipment?.toLowerCase().includes(d.key.toLowerCase()));
    const ringan = divFindings.filter(f => f.priority === 'Rendah').length;
    const sedang = divFindings.filter(f => f.priority === 'Sedang').length;
    const berat = divFindings.filter(f => f.priority === 'Tinggi').length;
    const total = divFindings.length;
    
    // Divisi KPI
    const divStaff = staffKpis.filter(s => s.division === d.key);
    const avgKpi = divStaff.length > 0
      ? Math.round(divStaff.reduce((acc, s) => acc + s.kpi, 0) / divStaff.length)
      : 0;

    return { ...d, ringan, sedang, berat, total, avgKpi };
  });

  // Dynamic Top 10 equipment with issues
  const reportEquipmentFrequency: Record<string, { count: number; lastStatus: string }> = {};
  findings.forEach(f => {
    const name = f.equipment || 'Unknown';
    if (!reportEquipmentFrequency[name]) {
      reportEquipmentFrequency[name] = {
        count: 0,
        lastStatus: f.status === 'Close' ? 'Baik / Selesai Diperbaiki' : `Perlu Perbaikan - ${f.issue || 'Masalah Terdeteksi'}`
      };
    }
    reportEquipmentFrequency[name].count++;
    if (f.status === 'Open') {
      reportEquipmentFrequency[name].lastStatus = `Rusak - ${f.issue || 'Dalam Perbaikan'}`;
    }
  });

  const reportTopEquipments = Object.entries(reportEquipmentFrequency)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Dynamic Attendance Statistics per Division for Reports
  const reportAttendanceDivisions = [
    { key: 'Audio', label: 'Divisi Sound (Audio)' },
    { key: 'Lighting', label: 'Divisi Lighting' },
    { key: 'Videotron', label: 'Divisi Videotron' },
    { key: 'Multimedia', label: 'Divisi Multimedia' },
    { key: 'Gudang', label: 'Gudang (Warehouse)' },
    { key: 'Service', label: 'Divisi Service (Perbaikan)' },
    { key: 'Admin', label: 'Administrasi & Management' },
  ];

  let rawAttendanceLogs: AttendanceLog[] = [];
  try {
    const saved = localStorage.getItem('riz_attendance_logs');
    if (saved) rawAttendanceLogs = JSON.parse(saved);
  } catch (e) {}

  let septemberSchedule: StaffScheduleRow[] = OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  try {
    const savedSched = localStorage.getItem('riz_september_2026_schedule');
    if (savedSched) septemberSchedule = JSON.parse(savedSched);
  } catch (e) {}

  const divisionAttendanceStats = reportAttendanceDivisions.map(div => {
    const staffInDiv = septemberSchedule.filter(s => s.division.toLowerCase() === div.key.toLowerCase());
    let hadirCount = 0;
    let terlambatCount = 0;
    let izinCount = 0;
    let sakitCount = 0;
    let alphaCount = 0;

    staffInDiv.forEach(s => {
      Object.values(s.shifts || {}).forEach(shift => {
        const up = shift.toUpperCase();
        if (['P', 'MD', 'M', 'PM', 'MASUK'].includes(up)) {
          hadirCount++;
        } else if (up === 'IZIN') {
          izinCount++;
        } else if (up === 'SAKIT') {
          sakitCount++;
        } else if (up === 'ALPHA') {
          alphaCount++;
        }
      });
    });

    const divLogs = rawAttendanceLogs.filter(l => l.division?.toLowerCase() === div.key.toLowerCase());
    divLogs.forEach(l => {
      if (l.isLate) terlambatCount++;
      else if (l.status === 'Izin') izinCount++;
      else if (l.status === 'Sakit') sakitCount++;
      else if (l.status === 'Alpha') alphaCount++;
    });

    return {
      label: div.label,
      hadir: hadirCount,
      terlambat: terlambatCount,
      izin: izinCount,
      sakit: sakitCount,
      alpha: alphaCount,
      total: hadirCount + terlambatCount + izinCount + sakitCount + alphaCount
    };
  });

  const totalHadirAll = divisionAttendanceStats.reduce((acc, d) => acc + d.hadir, 0);
  const totalTerlambatAll = divisionAttendanceStats.reduce((acc, d) => acc + d.terlambat, 0);
  const totalSlotsAll = divisionAttendanceStats.reduce((acc, d) => acc + d.total, 0);
  const avgAttendancePercent = totalSlotsAll > 0 ? ((totalHadirAll / totalSlotsAll) * 100).toFixed(1) : '0.0';
  const avgLatePercent = totalSlotsAll > 0 ? ((totalTerlambatAll / totalSlotsAll) * 100).toFixed(1) : '0.0';

  // Supervisor comment input state (default bersih dari teks asumsi)
  const [supervisorComment, setSupervisorComment] = useState('');
  
  // Signature input state
  const [disusunOleh, setDisusunOleh] = useState(currentUser?.name || '');
  const [diperiksaSupervisor, setDiperiksaSupervisor] = useState('');
  const [mengetahuiManager, setMengetahuiManager] = useState('');
  const [mengetahuiDirektur, setMengetahuiDirektur] = useState('');

  // Print Report Handler
  const handlePrint = () => {
    onLogActivity(currentUser.name, currentUser.role, `Mencetak dokumen Laporan ${reportType} ke PDF`);
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    onLogActivity(currentUser.name, currentUser.role, `Mengekspor Laporan ${reportType} ke format CSV/Excel`);
    
    // Generate CSV string based on active filtered period
    const headers = ['No', 'Tanggal', 'Divisi', 'Nama Staff', 'Aktivitas', 'Hasil QC', 'Status', 'Tindak Lanjut'];
    const rows = activeLogbookEntries.map((e, idx) => [
      idx + 1,
      e.date,
      e.division,
      e.staffName,
      e.activity,
      e.result,
      e.status,
      e.followUp.replace(/,/g, ';')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RIZ_PRODUCTION_Report_${reportType}_${reportType === 'Harian' ? targetDate : targetMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Configuration Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6 no-print">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Pusat Laporan & Ekspor Dokumen</h1>
          <p className="text-xs text-slate-500">Agregasi rekapitulasi data QC, daily report staff harian, cetak PDF, dan download Excel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-sm">
          {/* Laporan Type selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rentang Laporan</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-medium"
            >
              <option value="Harian">Laporan Harian (Daily)</option>
              <option value="Mingguan">Laporan Mingguan (Weekly)</option>
              <option value="Bulanan">Laporan Bulanan (Monthly Operation Report)</option>
            </select>
          </div>

          {/* Date Selector */}
          {reportType === 'Harian' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pilih Tanggal</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono"
              />
            </div>
          )}

          {reportType === 'Mingguan' && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mulai</label>
                <input
                  type="date"
                  value={targetStartDate}
                  onChange={(e) => setTargetStartDate(e.target.value)}
                  className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Sampai</label>
                <input
                  type="date"
                  value={targetEndDate}
                  onChange={(e) => setTargetEndDate(e.target.value)}
                  className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono"
                />
              </div>
            </div>
          )}

          {reportType === 'Bulanan' && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pilih Bulan</label>
              <input
                type="month"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono"
              />
            </div>
          )}

          {/* Action: Print */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Laporan</span>
          </button>

          {/* Action: Export CSV */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span>Ekspor Excel/CSV</span>
          </button>
        </div>

        {/* Dynamic signature & supervisor editor for the printable block */}
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-4">
          <div className="text-xs font-bold font-mono text-slate-500 uppercase flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kustomisasi Catatan & Tanda Tangan Dokumen</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Catatan / Ringkasan</label>
              <input
                type="text"
                value={supervisorComment}
                onChange={(e) => setSupervisorComment(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Disusun Oleh (Staff)</label>
              <input
                type="text"
                value={disusunOleh}
                onChange={(e) => setDisusunOleh(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Diperiksa (Supervisor)</label>
              <input
                type="text"
                value={diperiksaSupervisor}
                onChange={(e) => setDiperiksaSupervisor(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mengetahui (Manager)</label>
              <input
                type="text"
                value={mengetahuiManager}
                onChange={(e) => setMengetahuiManager(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mengetahui (Direktur)</label>
              <input
                type="text"
                value={mengetahuiDirektur}
                onChange={(e) => setMengetahuiDirektur(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CONTAINER */}
      {reportType === 'Bulanan' ? (
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm space-y-8 max-w-4xl mx-auto printable-document text-slate-900">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-800 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
            </div>
            <div className="text-right sm:text-right text-xs space-y-1">
              <h2 className="text-md font-bold text-slate-800 uppercase font-display">Monthly Operation Report</h2>
              <div className="font-mono text-slate-500">
                <div>Periode: {targetMonth}</div>
                <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</div>
              </div>
            </div>
          </div>

          {/* 1. EXECUTIVE SUMMARY */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">1. EXECUTIVE SUMMARY</div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                Laporan Operasional Bulanan PT RIZ-PRODUCTION merangkum seluruh kinerja teknis, kehadiran staff inhouse, produktivitas divisi, 
                hasil Quality Control (QC) peralatan, pelaksanaan maintenance (preventive dan corrective), serta logistik inventory selama periode <strong className="font-mono">{targetMonth}</strong>. 
                Sistem terintegrasi memastikan transparansi dan akurasi data operasional di lapangan.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Jenis Aktivitas</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {new Set(dailyReports.map(r => r.activity).filter(Boolean)).size} Aktivitas
                  </div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Hari Kerja</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">30 Hari</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Staff Aktif</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{staffList.length} Orang</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Daily Report</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{dailyReports.length} Laporan</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total QC</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{logbookEntries.length} Pemeriksaan</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total PM</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{logbookEntries.filter(e => e.activity.includes('PM') || e.activity.includes('Preventive')).length} Kegiatan</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total CM / Temuan</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{findings.length} Kasus</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Kelulusan QC</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">
                    {totalCheckedItems > 0 ? Math.round((totalOkItems / totalCheckedItems) * 100) : 100}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. KEHADIRAN STAFF */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">2. KEHADIRAN STAFF</div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">NON-AKTIF SEMENTARA</span>
            </div>
            <div className="overflow-x-auto opacity-60">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase">
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Hadir (Hari)</th>
                    <th className="p-2 border-r border-slate-300 text-center">Terlambat</th>
                    <th className="p-2 border-r border-slate-300 text-center">Izin</th>
                    <th className="p-2 border-r border-slate-300 text-center">Sakit</th>
                    <th className="p-2 border-r border-slate-300 text-center">Alpha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {divisionAttendanceStats.map((d, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">{d.label}</td>
                      <td className="p-2 border-r border-slate-300 text-center">-</td>
                      <td className="p-2 border-r border-slate-300 text-center text-amber-600">-</td>
                      <td className="p-2 border-r border-slate-300 text-center">-</td>
                      <td className="p-2 border-r border-slate-300 text-center">-</td>
                      <td className="p-2 border-r border-slate-300 text-center text-rose-600">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border border-amber-200 bg-amber-50/60 rounded text-xs text-amber-900 font-sans">
              <div className="font-semibold">⚠️ Pencatatan Jumlah Kehadiran & Jam Kerja Dinon-aktifkan Sementara</div>
              <div className="text-[11px] text-amber-700 mt-0.5">Penilaian KPI & Evaluasi Kinerja saat ini difokuskan 100% pada kontribusi riil: Daily Report, QC Checklist Onhouse, Work Order Perbaikan, dan Uji Kompetensi Teknis.</div>
            </div>
          </div>

          {/* 3. PRODUKTIVITAS DIVISI */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">3. PRODUKTIVITAS DIVISI</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase">
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Daily Report</th>
                    <th className="p-2 border-r border-slate-300 text-center">QC</th>
                    <th className="p-2 text-center">Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Sound</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Audio').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Audio').length}</td>
                    <td className="p-2 text-center">{findings.filter(f => f.equipment.toLowerCase().includes('audio') || f.issue.toLowerCase().includes('audio')).length}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Lighting</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Lighting').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Lighting').length}</td>
                    <td className="p-2 text-center">{findings.filter(f => f.equipment.toLowerCase().includes('light') || f.issue.toLowerCase().includes('light')).length}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Videotron</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Videotron').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Videotron').length}</td>
                    <td className="p-2 text-center">{findings.filter(f => f.equipment.toLowerCase().includes('video') || f.equipment.toLowerCase().includes('led')).length}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Multimedia</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Multimedia').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Multimedia').length}</td>
                    <td className="p-2 text-center">{findings.filter(f => f.equipment.toLowerCase().includes('multi') || f.issue.toLowerCase().includes('multi')).length}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Gudang (Warehouse)</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Gudang').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 text-center">{findings.filter(f => f.equipment.toLowerCase().includes('gudang')).length}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Administrasi</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Admin').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 text-center">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Service (Perbaikan)</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Service').length}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Service').length}</td>
                    <td className="p-2 text-center">{findings.filter(f => f.status === 'Close').length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50/30 rounded text-xs space-y-1">
              <strong className="block text-slate-700">Produktivitas Mingguan Teranalisis:</strong>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1 font-mono">
                <div className="bg-white p-2 border rounded">
                  <strong>Minggu 1 (1-7)</strong>
                  <div className="text-indigo-600">
                    {dailyReports.length > 0 ? Math.round((dailyReports.filter(r => { const d = parseInt(r.date.split('-')[2] || '1', 10); return d >= 1 && d <= 7; }).length / dailyReports.length) * 100) : 0}% Beban
                  </div>
                </div>
                <div className="bg-white p-2 border rounded">
                  <strong>Minggu 2 (8-14)</strong>
                  <div className="text-indigo-600">
                    {dailyReports.length > 0 ? Math.round((dailyReports.filter(r => { const d = parseInt(r.date.split('-')[2] || '1', 10); return d >= 8 && d <= 14; }).length / dailyReports.length) * 100) : 0}% Beban
                  </div>
                </div>
                <div className="bg-white p-2 border rounded">
                  <strong>Minggu 3 (15-21)</strong>
                  <div className="text-indigo-600">
                    {dailyReports.length > 0 ? Math.round((dailyReports.filter(r => { const d = parseInt(r.date.split('-')[2] || '1', 10); return d >= 15 && d <= 21; }).length / dailyReports.length) * 100) : 0}% Beban
                  </div>
                </div>
                <div className="bg-white p-2 border rounded">
                  <strong>Minggu 4 (22-30)</strong>
                  <div className="text-indigo-600">
                    {dailyReports.length > 0 ? Math.round((dailyReports.filter(r => { const d = parseInt(r.date.split('-')[2] || '1', 10); return d >= 22; }).length / dailyReports.length) * 100) : 0}% Beban
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. PRODUKTIVITAS STAFF */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">4. PRODUKTIVITAS STAFF BERAKTIFITAS</div>
              <span className="text-[10px] font-mono text-slate-400">Total: {activeStaffKpis.length} Staff Aktif</span>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-slate-300 rounded">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase sticky top-0 z-10">
                    <th className="p-2 border-r border-slate-300">Nama</th>
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Daily Report</th>
                    <th className="p-2 border-r border-slate-300 text-center">QC</th>
                    <th className="p-2 border-r border-slate-300 text-center text-slate-400">Absensi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Uji Komp.</th>
                    <th className="p-2 border-r border-slate-300 text-center text-slate-400">Jam Kerja</th>
                    <th className="p-2 text-center">Performance Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {activeStaffKpis.length > 0 ? (
                    activeStaffKpis.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-300 font-sans font-semibold">{staff.name}</td>
                        <td className="p-2 border-r border-slate-300 font-sans">{staff.division}</td>
                        <td className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700">{staff.reports}</td>
                        <td className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700">{staff.qcs}</td>
                        <td className="p-2 border-r border-slate-300 text-center text-slate-400">-</td>
                        <td className="p-2 border-r border-slate-300 text-center">{staff.competencyCount}/6</td>
                        <td className="p-2 border-r border-slate-300 text-center text-slate-400">-</td>
                        <td className={`p-2 text-center font-bold ${
                          staff.kpi >= 95 ? 'text-emerald-600' : staff.kpi >= 90 ? 'text-indigo-600' : 'text-amber-600'
                        }`}>{staff.kpi}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-slate-500 font-sans italic">
                        Tidak ada aktifitas pekerjaan staff pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {activeStaffKpis.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">TOP PERFORMER (BERDASARKAN AKTIFITAS RIIL)</span>
                <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700 font-sans">
                  {activeStaffKpis.slice(0, 5).map((staff) => (
                    <li key={staff.id}>
                       <strong className="text-indigo-600">{staff.name}</strong> (Divisi {staff.division}) — Nilai KPI: <strong className="text-emerald-600">{staff.kpi}%</strong> ({staff.reports} Daily Report, {staff.qcs} QC)
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* 5. STATISTIK QC */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">5. STATISTIK QC</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-slate-400 block font-bold text-[9px] uppercase">Total QC</span>
                <strong className="text-lg text-slate-800">{logbookEntries.length} Pemeriksaan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded">
                <span className="text-emerald-500 block font-bold text-[9px] uppercase">OK (Lulus QC)</span>
                <strong className="text-lg text-emerald-700">{logbookEntries.filter(e => e.result === 'OK').length} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-rose-50/20 rounded">
                <span className="text-rose-500 block font-bold text-[9px] uppercase">NG (Not Good)</span>
                <strong className="text-lg text-rose-700">{logbookEntries.filter(e => e.result === 'NG').length} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-indigo-50/20 rounded">
                <span className="text-indigo-600 block font-bold text-[9px] uppercase">Persentase Kelulusan</span>
                <strong className="text-lg text-indigo-700">
                  {logbookEntries.length > 0 ? Math.round((logbookEntries.filter(e => e.result === 'OK').length / logbookEntries.length) * 100) : 100}%
                </strong>
              </div>
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50/50 rounded space-y-2 text-xs font-sans">
              <div className="font-semibold text-slate-600">Visualisasi Kelulusan QC (OK vs NG)</div>
              <div className="h-6 w-full rounded bg-rose-500 overflow-hidden flex font-mono text-white text-[10px] font-bold">
                <div
                  className="h-full bg-emerald-500 flex items-center justify-center transition-all"
                  style={{ width: `${logbookEntries.length > 0 ? Math.round((logbookEntries.filter(e => e.result === 'OK').length / logbookEntries.length) * 100) : 100}%` }}
                >
                  OK ({logbookEntries.length > 0 ? Math.round((logbookEntries.filter(e => e.result === 'OK').length / logbookEntries.length) * 100) : 100}%)
                </div>
                <div
                  className="h-full flex items-center justify-center"
                  style={{ width: `${logbookEntries.length > 0 ? 100 - Math.round((logbookEntries.filter(e => e.result === 'OK').length / logbookEntries.length) * 100) : 0}%` }}
                >
                  NG ({logbookEntries.length > 0 ? 100 - Math.round((logbookEntries.filter(e => e.result === 'OK').length / logbookEntries.length) * 100) : 0}%)
                </div>
              </div>
            </div>
          </div>

          {/* 6. STATISTIK KERUSAKAN */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">6. STATISTIK KERUSAKAN</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase">
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Ringan</th>
                    <th className="p-2 border-r border-slate-300 text-center">Sedang</th>
                    <th className="p-2 border-r border-slate-300 text-center">Berat</th>
                    <th className="p-2 text-center">Total Kasus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {reportDivisionDamageStats.map((d, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-slate-300 font-sans font-semibold">{d.name}</td>
                      <td className="p-2 border-r border-slate-300 text-center text-yellow-600">{d.ringan}</td>
                      <td className="p-2 border-r border-slate-300 text-center text-amber-600">{d.sedang}</td>
                      <td className="p-2 border-r border-slate-300 text-center text-rose-600">{d.berat}</td>
                      <td className="p-2 text-center font-bold">{d.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50/30 rounded text-xs">
              <strong className="block text-slate-700">Ringkasan Temuan Kerusakan:</strong>
              <p className="text-[11px] text-slate-500 mt-1 font-sans">
                {findings.length > 0 
                  ? `Total ${findings.length} temuan kerusakan tercatat di sistem (${findings.filter(f => f.status === 'Close').length} selesai, ${findings.filter(f => f.status === 'Open').length} dalam penanganan).`
                  : 'Belum ada data kerusakan peralatan yang tercatat pada sistem.'}
              </p>
            </div>
          </div>

          {/* 7. TOP 10 PERALATAN PALING SERING BERMASALAH */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">7. TOP 10 PERALATAN PALING SERING BERMASALAH</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase">
                    <th className="p-2 border-r border-slate-300 text-center w-12">Rank</th>
                    <th className="p-2 border-r border-slate-300">Nama Asset</th>
                    <th className="p-2 border-r border-slate-300 text-center w-24">Frekuensi</th>
                    <th className="p-2 text-center">Status Kondisi Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {reportTopEquipments.map((eq, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">{eq.name}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{eq.count} kali</td>
                      <td className="p-2 text-center font-sans font-semibold text-slate-700">{eq.lastStatus}</td>
                    </tr>
                  ))}
                  {reportTopEquipments.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-400 font-sans">
                        Belum ada data temuan peralatan bermasalah.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 8. PREVENTIVE MAINTENANCE */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">8. PREVENTIVE MAINTENANCE</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-slate-400 block font-bold text-[9px] uppercase">Jadwal PM</span>
                <strong className="text-lg text-slate-800">0 Kegiatan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded">
                <span className="text-emerald-500 block font-bold text-[9px] uppercase">PM Tepat Waktu</span>
                <strong className="text-lg text-emerald-700">0 Kegiatan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-amber-50/20 rounded">
                <span className="text-amber-500 block font-bold text-[9px] uppercase">PM Terlambat</span>
                <strong className="text-lg text-amber-700">0 Kegiatan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-rose-50/20 rounded">
                <span className="text-rose-500 block font-bold text-[9px] uppercase">PM Belum Selesai</span>
                <strong className="text-lg text-rose-700">0 Kegiatan</strong>
              </div>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50/50 rounded flex justify-between items-center text-xs font-sans">
              <span>Persentase Kepatuhan PM Bulan Ini:</span>
              <strong className="text-indigo-700 text-sm font-mono">0.0%</strong>
            </div>
          </div>

          {/* 9. CORRECTIVE MAINTENANCE */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">9. CORRECTIVE MAINTENANCE</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
              <div className="p-3 border border-slate-200 rounded flex flex-col justify-between">
                <span className="text-slate-400 font-bold text-[9px] uppercase">Total Repair</span>
                <strong className="text-lg text-slate-800 mt-1">{findings.length} Kasus</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded flex flex-col justify-between">
                <span className="text-emerald-500 font-bold text-[9px] uppercase">Selesai (Close)</span>
                <strong className="text-lg text-emerald-700 mt-1">{findings.filter(f=>f.status==='Close').length} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-amber-50/20 rounded flex flex-col justify-between">
                <span className="text-amber-500 font-bold text-[9px] uppercase">Pending (Open)</span>
                <strong className="text-lg text-amber-700 mt-1">{findings.filter(f=>f.status==='Open').length} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-rose-50/20 rounded flex flex-col justify-between">
                <span className="text-rose-500 font-bold text-[9px] uppercase">Menunggu Sparepart</span>
                <strong className="text-lg text-rose-700 mt-1">{pendingSpareparts} Unit</strong>
              </div>
            </div>
          </div>

          {/* 11. KPI DIVISI */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">11. KPI DIVISI</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
              {reportDivisionDamageStats.map((d, idx) => (
                <div key={idx} className="p-3 border border-slate-200 rounded space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span>{d.name}</span>
                    <span className="text-indigo-600">{d.avgKpi}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.avgKpi}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12. KPI STAFF */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">12. KPI STAFF</div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-700">Kategori Evaluasi Kinerja Staff:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px] font-mono">
                <div className="bg-white p-2 border rounded font-semibold">1. Disiplin & Tim (15%)</div>
                <div className="bg-white p-2 border rounded font-semibold">2. Daily Report (25%)</div>
                <div className="bg-white p-2 border rounded font-semibold">3. QC Checklist (20%)</div>
                <div className="bg-white p-2 border rounded font-semibold">4. Work Order (10%)</div>
                <div className="bg-indigo-50 border border-indigo-200 p-2 rounded font-semibold text-indigo-800">+ 5. Absensi (15%)</div>
                <div className="bg-amber-50 border border-amber-200 p-2 rounded font-semibold text-amber-800">+ 6. Uji Komp (15%)</div>
              </div>
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-700 mb-2">Nilai Akhir Staff Aktif Periode Ini ({activeStaffKpis.length} Staff):</div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-emerald-700">A</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">{activeStaffKpis.filter(s => s.grade === 'A').length} Staff (Sangat Baik)</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-blue-700">B</div>
                    <div className="text-[10px] text-blue-600 mt-0.5">{activeStaffKpis.filter(s => s.grade === 'B').length} Staff (Baik)</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-amber-700">C</div>
                    <div className="text-[10px] text-amber-600 mt-0.5">{activeStaffKpis.filter(s => s.grade === 'C').length} Staff (Cukup)</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-slate-700">D</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{activeStaffKpis.filter(s => s.grade === 'D').length} Staff (Kurang)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 13. ANALISIS MANAJEMEN */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">13. ANALISIS MANAJEMEN</div>
            <div className="p-4 border border-slate-300 bg-slate-50/50 rounded text-xs space-y-3">
              <div>
                <strong className="text-slate-800 uppercase text-[10px] font-mono block">Kendala Bulan Ini:</strong>
                <p className="text-slate-600 mt-0.5">Keterlambatan sparepart pengganti untuk Moving Head BSW 380W dari supplier lokal.</p>
              </div>
              <div>
                <strong className="text-slate-800 uppercase text-[10px] font-mono block">Akar Masalah:</strong>
                <p className="text-slate-600 mt-0.5">Stok sparepart motor pan-tilt langka di pasar domestik, memerlukan inden 14 hari kerja.</p>
              </div>
              <div>
                <strong className="text-slate-800 uppercase text-[10px] font-mono block">Solusi:</strong>
                <p className="text-slate-600 mt-0.5">Melakukan pembelian stok cadangan (safety stock) langsung dari distributor utama luar kota untuk item kritis.</p>
              </div>
              <div>
                <strong className="text-slate-800 uppercase text-[10px] font-mono block">Target Bulan Berikutnya:</strong>
                <p className="text-slate-600 mt-0.5">Mencapai 100% kepatuhan Preventive Maintenance dan penyelesaian seluruh pending repair dalam maksimal 3 hari.</p>
              </div>
            </div>
          </div>

          {/* 14. APPROVAL */}
          <div className="pt-10">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider mb-6">14. APPROVAL & VALIDASI LAPORAN</div>
            <div className="grid grid-cols-3 gap-4 text-center text-xs font-sans">
              <div>
                <div className="font-semibold text-slate-500 mb-14 uppercase tracking-wide text-[10px]">Dibuat Oleh (Supervisor)</div>
                <div className="font-bold text-slate-800 underline uppercase">{diperiksaSupervisor}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Supervisor Operasional</div>
              </div>
              <div>
                <div className="font-semibold text-slate-500 mb-14 uppercase tracking-wide text-[10px]">Diperiksa Oleh (Manager)</div>
                <div className="font-bold text-slate-800 underline uppercase">{mengetahuiManager}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Manager Operasional</div>
              </div>
              <div>
                <div className="font-semibold text-slate-500 mb-14 uppercase tracking-wide text-[10px]">Mengetahui (Direktur)</div>
                <div className="font-bold text-slate-800 underline uppercase">{mengetahuiDirektur}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Direktur Utama</div>
              </div>
            </div>
          </div>

          {/* Footer legalities */}
          <div className="text-center font-mono text-[9px] text-slate-400 pt-8 border-t border-slate-200">
            DOKUMEN BULANAN RESMI PT RIZ-PRODUCTION • OPERATIONAL SYSTEM INTEGRATED REPORT
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm space-y-8 max-w-4xl mx-auto printable-document text-slate-900">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-800 pb-6 gap-4">
            <div>
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
            </div>
            <div className="text-right sm:text-right text-xs space-y-1">
              <h2 className="text-md font-bold text-slate-800 uppercase font-display">Logbook QC Harian Staff Inhouse</h2>
              <div className="font-mono text-slate-500">
                <div>Tanggal: {targetDate}</div>
                <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}</div>
              </div>
            </div>
          </div>

          {/* LOGBOOK TABLE */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
              I. LOGBOOK QC {reportType === 'Harian' ? 'HARIAN' : reportType === 'Bulanan' ? 'BULANAN' : 'MINGGUAN'} STAFF INHOUSE
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase">
                    <th className="p-2 border-r border-slate-300 w-8">No</th>
                    <th className="p-2 border-r border-slate-300">Tanggal</th>
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300">Nama Staff</th>
                    <th className="p-2 border-r border-slate-300">Aktivitas QC / Hasil</th>
                    <th className="p-2 border-r border-slate-300 text-center w-20">Hasil QC</th>
                    <th className="p-2 border-r border-slate-300">Tindak Lanjut</th>
                    <th className="p-2 text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {activeLogbookEntries.map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50 font-mono">
                      <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300">{e.date}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-semibold text-indigo-700">{e.division}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">{e.staffName}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">
                        <div>{e.activity}</div>
                        {((e.photos && e.photos.length > 0) || e.photoUrl) && (
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            {(e.photos && e.photos.length > 0 ? e.photos : [e.photoUrl!]).map((pSrc, pI) => (
                              <img key={pI} src={pSrc} alt="Bukti QC" className="w-8 h-8 object-cover rounded border border-slate-300 shadow-xs" />
                            ))}
                            <span className="text-[10px] text-indigo-700 font-bold">
                              [{(e.photos && e.photos.length > 0) ? `${e.photos.length} Foto Bukti` : 'Foto Bukti'}]
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-300 text-center font-bold">
                        <span className={`px-1.5 py-0.5 rounded text-[11px] ${e.result === 'OK' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {e.result === 'OK' ? '✓ OK' : '✗ NG'}
                        </span>
                      </td>
                      <td className="p-2 border-r border-slate-300 font-sans text-slate-600 italic text-[11px] leading-tight">{e.followUp}</td>
                      <td className="p-2 text-center">
                        <span className={`text-[10px] uppercase font-bold px-1 rounded ${e.status === 'Close' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-700'}`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activeLogbookEntries.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-slate-400 italic">
                        Tidak ada logbook QC terisi pada periode {reportType === 'Harian' ? targetDate : targetMonth}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REKAP HARIAN SECTION */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
              II. REKAP {reportType === 'Harian' ? 'HARIAN' : reportType === 'Bulanan' ? 'BULANAN' : 'MINGGUAN'} ({reportType === 'Harian' ? targetDate : targetMonth})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs text-slate-700 font-sans">
              <div className="p-3 border border-slate-300 bg-slate-50/50 rounded flex flex-col justify-between">
                <span className="text-slate-400 font-mono uppercase text-[9px] font-bold">Peralatan Dicek</span>
                <strong className="text-lg font-display text-slate-800 mt-1">{totalCheckedItems} Unit</strong>
              </div>
              <div className="p-3 border border-slate-300 bg-emerald-50/20 rounded flex flex-col justify-between">
                <span className="text-emerald-500 font-mono uppercase text-[9px] font-bold">Kondisi Baik</span>
                <strong className="text-lg font-display text-emerald-700 mt-1">{goodCondition} Unit</strong>
              </div>
              <div className="p-3 border border-slate-300 bg-rose-50/20 rounded flex flex-col justify-between">
                <span className="text-rose-500 font-mono uppercase text-[9px] font-bold">Perlu Perbaikan</span>
                <strong className="text-lg font-display text-rose-700 mt-1">{needRepair} Unit</strong>
              </div>
              <div className="p-3 border border-slate-300 bg-slate-50/20 rounded flex flex-col justify-between">
                <span className="text-slate-500 font-mono uppercase text-[9px] font-bold">Selesai Diperbaiki</span>
                <strong className="text-lg font-display text-slate-700 mt-1">{solvedRepairs} Unit</strong>
              </div>
              <div className="p-3 border border-slate-300 bg-amber-50/20 rounded flex flex-col justify-between">
                <span className="text-amber-500 font-mono uppercase text-[9px] font-bold">Pending Sparepart</span>
                <strong className="text-lg font-display text-amber-700 mt-1">{pendingSpareparts} Unit</strong>
              </div>
            </div>
          </div>

          {/* TEMUAN QC / KERUSAKAN IN THE DOCUMENT */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">III. TEMUAN QC & PERALIHAN KERUSAKAN</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase">
                    <th className="p-2 border-r border-slate-300 w-8">No</th>
                    <th className="p-2 border-r border-slate-300">Peralatan / Unit</th>
                    <th className="p-2 border-r border-slate-300">Deskripsi Kendala</th>
                    <th className="p-2 border-r border-slate-300 text-center w-24">Prioritas</th>
                    <th className="p-2 border-r border-slate-300">PIC Pelaksana</th>
                    <th className="p-2 border-r border-slate-300 text-center">Target Selesai</th>
                    <th className="p-2 text-center w-20">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {activeFindings.map((f, idx) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-bold">{f.equipment}</td>
                      <td className="p-2 border-r border-slate-300 font-sans text-slate-600">{f.issue}</td>
                      <td className={`p-2 border-r border-slate-300 text-center font-semibold uppercase tracking-wide ${f.priority.toLowerCase() === 'tinggi' ? 'text-rose-700' : f.priority.toLowerCase() === 'sedang' ? 'text-amber-700' : 'text-emerald-700'}`}>{f.priority}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-medium text-slate-700">{f.pic}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{f.targetDate}</td>
                      <td className={`p-2 text-center font-bold uppercase ${f.status.toLowerCase() === 'close' ? 'text-emerald-700' : 'text-amber-700'}`}>{f.status}</td>
                    </tr>
                  ))}
                  {activeFindings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-400 italic">Tidak ada temuan kerusakan tercatat pada periode ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* IV. LAPORAN KPI & KINERJA ALL STAFF */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">
                IV. LAPORAN KPI & KINERJA ALL STAFF ({reportType === 'Harian' ? `HARIAN: ${targetDate}` : reportType === 'Mingguan' ? `MINGGUAN: ${targetStartDate} s/d ${targetEndDate}` : `BULANAN: ${targetMonth}`})
              </div>
              <span className="text-[10px] font-mono text-indigo-600 font-semibold">
                Prioritas: Daily Report • QC Checklist • WO Selesai • Uji Komp. (Kehadiran & Jam Kerja Non-Aktif)
              </span>
            </div>
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto border border-slate-300 rounded">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase sticky top-0 z-10">
                    <th className="p-2 border-r border-slate-300 w-8 text-center">No</th>
                    <th className="p-2 border-r border-slate-300">Nama Staff</th>
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700 bg-indigo-50/50">Daily Report</th>
                    <th className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700 bg-indigo-50/50">QC Checklist</th>
                    <th className="p-2 border-r border-slate-300 text-center font-bold text-indigo-700 bg-indigo-50/50">WO Selesai</th>
                    <th className="p-2 border-r border-slate-300 text-center text-slate-400">Kehadiran</th>
                    <th className="p-2 border-r border-slate-300 text-center">Uji Komp.</th>
                    <th className="p-2 border-r border-slate-300 text-center text-slate-400">Jam Kerja</th>
                    <th className="p-2 text-center font-bold">Nilai KPI (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {activeStaffKpis.length > 0 ? (
                    activeStaffKpis.map((staff, idx) => (
                      <tr key={staff.id} className="hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-300 font-sans font-semibold">{staff.name}</td>
                        <td className="p-2 border-r border-slate-300 font-sans">{staff.division}</td>
                        <td className={`p-2 border-r border-slate-300 text-center font-bold ${staff.reports > 0 ? 'text-indigo-700 bg-indigo-50/30' : 'text-slate-400'}`}>
                          {staff.reports}
                        </td>
                        <td className={`p-2 border-r border-slate-300 text-center font-bold ${staff.qcs > 0 ? 'text-indigo-700 bg-indigo-50/30' : 'text-slate-400'}`}>
                          {staff.qcs}
                        </td>
                        <td className={`p-2 border-r border-slate-300 text-center font-bold ${staff.wos > 0 ? 'text-emerald-700 bg-emerald-50/30' : 'text-slate-400'}`}>
                          {staff.wos}
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center text-slate-400">
                          -
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center">{staff.competencyCount}/6</td>
                        <td className="p-2 border-r border-slate-300 text-center text-slate-400">
                          -
                        </td>
                        <td className={`p-2 text-center font-bold ${
                          staff.kpi >= 95 ? 'text-emerald-600' : staff.kpi >= 90 ? 'text-indigo-600' : 'text-amber-600'
                        }`}>{staff.kpi}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="p-4 text-center text-slate-400 italic">
                        Tidak ada aktifitas staff tercatat pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-600 uppercase font-bold tracking-wider block">
                  🏆 TOP 3 PERFORMER {reportType.toUpperCase()} ({reportType === 'Harian' ? targetDate : reportType === 'Mingguan' ? `${targetStartDate} s/d ${targetEndDate}` : targetMonth})
                </span>
                <span className="text-[9px] font-mono text-slate-400">Peringkat Berdasarkan: Daily Report, QC Checklist, WO Selesai, Uji Komp (Kehadiran Non-Aktif)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeStaffKpis.length > 0 ? (
                  activeStaffKpis.slice(0, 3).map((staff, idx) => (
                    <div key={staff.id} className="bg-white p-2.5 border border-slate-200 rounded-lg shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-0.5">
                          <span>PERFORMA #{idx + 1}</span>
                          <span className="text-slate-500 font-semibold">{staff.division}</span>
                        </div>
                        <strong className="text-slate-800 block text-xs truncate">{staff.name}</strong>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono">
                          Report: <strong className="text-indigo-600">{staff.reports}</strong> | QC: <strong className="text-indigo-600">{staff.qcs}</strong> | WO: <strong className="text-emerald-600">{staff.wos}</strong>
                        </span>
                        <span className="text-emerald-600 font-bold font-mono">KPI: {staff.kpi}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-slate-400 text-xs italic">
                    Belum ada aktifitas staff pada periode ini.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SUPERVISOR NOTES */}
          <div className="space-y-2">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">Catatan Supervisor</div>
            <div className="p-4 border border-slate-300 bg-slate-50/50 rounded text-xs italic text-slate-600 leading-relaxed font-sans">
              {supervisorComment || "Belum ada catatan supervisor yang dimasukkan."}
            </div>
          </div>

          {/* SIGNATURE BLOCK */}
          <div className="pt-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs font-sans">
              <div>
                <div className="font-semibold text-slate-500 mb-12 uppercase tracking-wide text-[10px]">Diperiksa Supervisor</div>
                <div className="font-bold text-slate-800 underline uppercase">{diperiksaSupervisor}</div>
                <div className="text-[10px] text-slate-400 font-mono">Supervisor Operasional</div>
              </div>
              <div>
                <div className="font-semibold text-slate-500 mb-12 uppercase tracking-wide text-[10px]">Mengetahui Manager</div>
                <div className="font-bold text-slate-800 underline uppercase">{mengetahuiManager}</div>
                <div className="text-[10px] text-slate-400 font-mono">Manager Operasional</div>
              </div>
              <div>
                <div className="font-semibold text-slate-500 mb-12 uppercase tracking-wide text-[10px]">Mengetahui Direktur</div>
                <div className="font-bold text-slate-800 underline uppercase">{mengetahuiDirektur}</div>
                <div className="text-[10px] text-slate-400 font-mono">Direktur Utama</div>
              </div>
            </div>
          </div>

          {/* Footer legalities */}
          <div className="text-center font-mono text-[9px] text-slate-400 pt-8 border-t border-slate-200">
            DOKUMEN INI SAH DAN RESMI BERDASARKAN SISTEM LOGISTIK DIGITAL RIZ-PRODUCTION • VERSI 1.1.0
          </div>
        </div>
      )}
    </div>
  );
}

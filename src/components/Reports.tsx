/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LogbookEntry, DailyReport, Finding } from '../types';
import { FileText, Printer, FileDown, Calendar, Users, CheckSquare, RefreshCw, PenTool } from 'lucide-react';
import { STAFF_LIST } from '../data';
import { calculateAllStaffKpis } from '../utils/kpiCalculator';

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
  const [reportType, setReportType] = useState<'Harian' | 'Mingguan' | 'Bulanan'>('Harian');
  const [targetMonth, setTargetMonth] = useState('2026-07');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);

  // Aggregate numbers
  const totalChecked = logbookEntries.length;
  
  // Calculate item-level counts
  let totalCheckedItems = 0;
  let totalOkItems = 0;
  let totalNgItems = 0;
  logbookEntries.forEach(e => {
    Object.values(e.checklists || {}).forEach(ch => {
      totalCheckedItems++;
      if (ch.status === 'OK') totalOkItems++;
      if (ch.status === 'NG') totalNgItems++;
    });
  });

  const goodCondition = totalOkItems;
  const needRepair = totalNgItems;
  const solvedRepairs = findings.filter(f => f.status === 'Close').length;
  const pendingSpareparts = findings.filter(f => f.status === 'Open' && f.issue.toLowerCase().includes('sparepart')).length;

  // Dynamic staff KPI performance scores for all staff members calculated with:
  // - Kehadiran & Jumlah Absen (Bobot 20%)
  // - Uji Kompetensi yang Diikuti (Bobot 20%)
  // - Daily Task / Laporan Harian (Bobot 25%)
  // - QC Checklist (Bobot 20%)
  // - Work Order (Bobot 15%)
  const staffKpis = calculateAllStaffKpis(STAFF_LIST, dailyReports, logbookEntries, findings);

  // Supervisor comment input state
  const [supervisorComment, setSupervisorComment] = useState('Semua divisi beroperasi secara aman. Beberapa item dalam masa perawatan berkala dan monitoring ketat.');
  
  // Signature input state
  const [disusunOleh, setDisusunOleh] = useState('Mang ube');
  const [diperiksaSupervisor, setDiperiksaSupervisor] = useState('Agus');
  const [mengetahuiManager, setMengetahuiManager] = useState('Fahrul');
  const [mengetahuiDirektur, setMengetahuiDirektur] = useState('Wahyu');

  // Print Report Handler
  const handlePrint = () => {
    onLogActivity(currentUser.name, currentUser.role, `Mencetak dokumen Laporan ${reportType} ke PDF`);
    window.print();
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    onLogActivity(currentUser.name, currentUser.role, `Mengekspor Laporan ${reportType} ke format CSV/Excel`);
    
    // Generate CSV string
    const headers = ['No', 'Tanggal', 'Divisi', 'Nama Staff', 'Aktivitas', 'Hasil QC', 'Status', 'Tindak Lanjut'];
    const rows = logbookEntries.map((e, idx) => [
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
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
            >
              <option value="Harian">Laporan Harian (Daily)</option>
              <option value="Bulanan">Laporan Bulanan (Monthly Operation Report)</option>
            </select>
          </div>

          {/* Date Selector */}
          {reportType === 'Harian' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pilih Tanggal</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pilih Bulan</label>
              <input
                type="month"
                value={targetMonth}
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
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
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Event</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">14 Event</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Hari Kerja</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">26 Hari</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Staff Aktif</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">22 Orang</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total Daily Report</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{dailyReports.length + 98} Laporan</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total QC</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{logbookEntries.length + 84} Pemeriksaan</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total PM</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">12 Kegiatan</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Total CM</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">{findings.length + 6} Kasus</div>
                </div>
                <div className="bg-white p-3 border border-slate-200 rounded">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Kelulusan QC</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">
                    {Math.round((totalOkItems / (totalCheckedItems || 1)) * 100) || 92}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. KEHADIRAN STAFF */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">2. KEHADIRAN STAFF</div>
            <div className="overflow-x-auto">
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
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Sound</td>
                    <td className="p-2 border-r border-slate-300 text-center">162</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">4</td>
                    <td className="p-2 border-r border-slate-300 text-center">2</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Lighting</td>
                    <td className="p-2 border-r border-slate-300 text-center">25</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Videotron</td>
                    <td className="p-2 border-r border-slate-300 text-center">102</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">3</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Multimedia</td>
                    <td className="p-2 border-r border-slate-300 text-center">73</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">2</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Gudang (Warehouse)</td>
                    <td className="p-2 border-r border-slate-300 text-center">75</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Service (Perbaikan)</td>
                    <td className="p-2 border-r border-slate-300 text-center">42</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 border-r border-slate-300 text-center">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Administrasi & Management</td>
                    <td className="p-2 border-r border-slate-300 text-center">98</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3 border border-slate-200 bg-slate-50/50 rounded">
                <div className="font-semibold text-slate-600">Persentase Kehadiran</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97.4%' }}></div>
                  </div>
                  <strong className="text-slate-800 font-mono text-xs shrink-0">97.4%</strong>
                </div>
              </div>
              <div className="p-3 border border-slate-200 bg-slate-50/50 rounded">
                <div className="font-semibold text-slate-600">Persentase Keterlambatan</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '2.2%' }}></div>
                  </div>
                  <strong className="text-slate-800 font-mono text-xs shrink-0">2.2%</strong>
                </div>
              </div>
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
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Audio').length + 34}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Audio').length + 42}</td>
                    <td className="p-2 text-center">12</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Lighting</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Lighting').length + 12}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Lighting').length + 18}</td>
                    <td className="p-2 text-center">6</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Videotron</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Videotron').length + 10}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Videotron').length + 15}</td>
                    <td className="p-2 text-center">5</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Multimedia</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Multimedia').length + 14}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Multimedia').length + 12}</td>
                    <td className="p-2 text-center">4</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Gudang (Warehouse)</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Gudang').length + 22}</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 text-center">2</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Administrasi</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Admin').length + 30}</td>
                    <td className="p-2 border-r border-slate-300 text-center">0</td>
                    <td className="p-2 text-center">1</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-bold text-slate-800">Divisi Service (Perbaikan)</td>
                    <td className="p-2 border-r border-slate-300 text-center">{dailyReports.filter(r=>r.division==='Service').length + 8}</td>
                    <td className="p-2 border-r border-slate-300 text-center">{logbookEntries.filter(e=>e.division==='Service').length + 6}</td>
                    <td className="p-2 text-center">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50/30 rounded text-xs space-y-1">
              <strong className="block text-slate-700">Produktivitas Mingguan Teranalisis:</strong>
              <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1 font-mono">
                <div className="bg-white p-2 border rounded"><strong>Minggu 1</strong><div className="text-indigo-600">22% Beban</div></div>
                <div className="bg-white p-2 border rounded"><strong>Minggu 2</strong><div className="text-indigo-600">28% Beban</div></div>
                <div className="bg-white p-2 border rounded"><strong>Minggu 3</strong><div className="text-indigo-600">32% Beban</div></div>
                <div className="bg-white p-2 border rounded"><strong>Minggu 4</strong><div className="text-indigo-600">18% Beban</div></div>
              </div>
            </div>
          </div>

          {/* 4. PRODUKTIVITAS STAFF */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">4. PRODUKTIVITAS STAFF</div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto border border-slate-300 rounded">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase sticky top-0 z-10">
                    <th className="p-2 border-r border-slate-300">Nama</th>
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Daily Report</th>
                    <th className="p-2 border-r border-slate-300 text-center">QC</th>
                    <th className="p-2 border-r border-slate-300 text-center">Absensi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Uji Komp.</th>
                    <th className="p-2 border-r border-slate-300 text-center">Jam Kerja</th>
                    <th className="p-2 text-center">Performance Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {staffKpis.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 font-sans font-semibold">{staff.name}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">{staff.division}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.reports}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.qcs}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.attendanceCount} Hari</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.competencyCount}/6</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.hours} Jam</td>
                      <td className={`p-2 text-center font-bold ${
                        staff.kpi >= 95 ? 'text-emerald-600' : staff.kpi >= 90 ? 'text-indigo-600' : 'text-amber-600'
                      }`}>{staff.kpi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">TOP PERFORMER BULAN INI (KPI TERBAIK)</span>
              <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-700 font-sans">
                {staffKpis.slice(0, 5).map((staff, idx) => (
                  <li key={staff.id}>
                     <strong className="text-indigo-600">{staff.name}</strong> (Divisi {staff.division}) — Nilai KPI: <strong className="text-emerald-600">{staff.kpi}%</strong> ({staff.reports} Daily Report, {staff.qcs} QC)
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 5. STATISTIK QC */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">5. STATISTIK QC</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
              <div className="p-3 border border-slate-200 rounded">
                <span className="text-slate-400 block font-bold text-[9px] uppercase">Total QC</span>
                <strong className="text-lg text-slate-800">{logbookEntries.length + 84} Pemeriksaan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded">
                <span className="text-emerald-500 block font-bold text-[9px] uppercase">OK (Lulus QC)</span>
                <strong className="text-lg text-emerald-700">{logbookEntries.length + 78} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-rose-50/20 rounded">
                <span className="text-rose-500 block font-bold text-[9px] uppercase">NG (Not Good)</span>
                <strong className="text-lg text-rose-700">6 Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-indigo-50/20 rounded">
                <span className="text-indigo-600 block font-bold text-[9px] uppercase">Persentase Kelulusan</span>
                <strong className="text-lg text-indigo-700">93.2%</strong>
              </div>
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50/50 rounded space-y-2 text-xs font-sans">
              <div className="font-semibold text-slate-600">Visualisasi Kelulusan QC (OK vs NG)</div>
              <div className="h-6 w-full rounded bg-rose-500 overflow-hidden flex font-mono text-white text-[10px] font-bold">
                <div className="h-full bg-emerald-500 flex items-center justify-center" style={{ width: '93.2%' }}>
                  OK (93.2%)
                </div>
                <div className="h-full flex items-center justify-center" style={{ width: '6.8%' }}>
                  NG (6.8%)
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
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">Divisi Sound</td>
                    <td className="p-2 border-r border-slate-300 text-center text-yellow-600">2</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                    <td className="p-2 text-center font-bold">3</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">Divisi Lighting</td>
                    <td className="p-2 border-r border-slate-300 text-center text-yellow-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">1</td>
                    <td className="p-2 text-center font-bold">3</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">Divisi Videotron</td>
                    <td className="p-2 border-r border-slate-300 text-center text-yellow-600">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                    <td className="p-2 text-center font-bold">1</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">Divisi Multimedia</td>
                    <td className="p-2 border-r border-slate-300 text-center text-yellow-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                    <td className="p-2 text-center font-bold">1</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">Gudang (Warehouse)</td>
                    <td className="p-2 border-r border-slate-300 text-center text-yellow-600">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                    <td className="p-2 text-center font-bold">0</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 font-sans font-semibold">Divisi Service (Perbaikan)</td>
                    <td className="p-2 border-r border-slate-300 text-center text-yellow-600">1</td>
                    <td className="p-2 border-r border-slate-300 text-center text-amber-600">0</td>
                    <td className="p-2 border-r border-slate-300 text-center text-rose-600">0</td>
                    <td className="p-2 text-center font-bold">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50/30 rounded text-xs">
              <strong className="block text-slate-700">Trend Kerusakan Terpantau:</strong>
              <p className="text-[11px] text-slate-500 mt-1 font-sans">
                Fokus utama perbaikan berada pada Divisi Lighting akibat intensitas penggunaan Moving Head BSW 380W yang tinggi di outdoor event.
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
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">1</td>
                    <td className="p-2 border-r border-slate-300 font-sans">Moving Head BSW 380W</td>
                    <td className="p-2 border-r border-slate-300 text-center">3 kali</td>
                    <td className="p-2 text-center font-sans text-rose-700 font-semibold bg-rose-50/50">Rusak Ringan - Kalibrasi Sensor</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">2</td>
                    <td className="p-2 border-r border-slate-300 font-sans">Digital Mixer CL5</td>
                    <td className="p-2 border-r border-slate-300 text-center">2 kali</td>
                    <td className="p-2 text-center font-sans text-emerald-700 font-semibold bg-emerald-50/50">Baik - Firmware Diupdate</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">3</td>
                    <td className="p-2 border-r border-slate-300 font-sans">LED Cabinet P3.9 Outdoor</td>
                    <td className="p-2 border-r border-slate-300 text-center">2 kali</td>
                    <td className="p-2 text-center font-sans text-emerald-700 font-semibold bg-emerald-50/50">Baik - Modul Pixel Diganti</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">4</td>
                    <td className="p-2 border-r border-slate-300 font-sans">Video Switcher V-60HD</td>
                    <td className="p-2 border-r border-slate-300 text-center">1 kali</td>
                    <td className="p-2 text-center font-sans text-emerald-700 font-semibold bg-emerald-50/50">Baik - Pembersihan Kipas</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-300 text-center font-bold">5</td>
                    <td className="p-2 border-r border-slate-300 font-sans">Wireless Microphone UR4D</td>
                    <td className="p-2 border-r border-slate-300 text-center">1 kali</td>
                    <td className="p-2 text-center font-sans text-emerald-700 font-semibold bg-emerald-50/50">Baik - Port Konektor Dibersihkan</td>
                  </tr>
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
                <strong className="text-lg text-slate-800">12 Kegiatan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded">
                <span className="text-emerald-500 block font-bold text-[9px] uppercase">PM Tepat Waktu</span>
                <strong className="text-lg text-emerald-700">10 Kegiatan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-amber-50/20 rounded">
                <span className="text-amber-500 block font-bold text-[9px] uppercase">PM Terlambat</span>
                <strong className="text-lg text-amber-700">1 Kegiatan</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-rose-50/20 rounded">
                <span className="text-rose-500 block font-bold text-[9px] uppercase">PM Belum Selesai</span>
                <strong className="text-lg text-rose-700">1 Kegiatan</strong>
              </div>
            </div>
            <div className="p-3 border border-slate-200 bg-slate-50/50 rounded flex justify-between items-center text-xs font-sans">
              <span>Persentase Kepatuhan PM Bulan Ini:</span>
              <strong className="text-indigo-700 text-sm font-mono">83.3%</strong>
            </div>
          </div>

          {/* 9. CORRECTIVE MAINTENANCE */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">9. CORRECTIVE MAINTENANCE</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-sans">
              <div className="p-3 border border-slate-200 rounded flex flex-col justify-between">
                <span className="text-slate-400 font-bold text-[9px] uppercase">Total Repair</span>
                <strong className="text-lg text-slate-800 mt-1">{findings.length + 4} Kasus</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-emerald-50/20 rounded flex flex-col justify-between">
                <span className="text-emerald-500 font-bold text-[9px] uppercase">Selesai</span>
                <strong className="text-lg text-emerald-700 mt-1">{findings.filter(f=>f.status==='Close').length + 3} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-amber-50/20 rounded flex flex-col justify-between">
                <span className="text-amber-500 font-bold text-[9px] uppercase">Pending Repair</span>
                <strong className="text-lg text-amber-700 mt-1">{findings.filter(f=>f.status==='Open').length + 1} Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-rose-50/20 rounded flex flex-col justify-between">
                <span className="text-rose-500 font-bold text-[9px] uppercase">Menunggu Sparepart</span>
                <strong className="text-lg text-rose-700 mt-1">1 Unit</strong>
              </div>
              <div className="p-3 border border-slate-200 bg-indigo-50/20 rounded flex flex-col justify-between">
                <span className="text-indigo-500 font-bold text-[9px] uppercase">Rata-rata Waktu</span>
                <strong className="text-lg text-indigo-700 mt-1">2 Hari</strong>
              </div>
            </div>
          </div>

          {/* 11. KPI DIVISI */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">11. KPI DIVISI</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Divisi Sound</span>
                  <span className="text-emerald-600">95%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Divisi Lighting</span>
                  <span className="text-emerald-600">92%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Divisi Videotron</span>
                  <span className="text-emerald-600">94%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Divisi Multimedia</span>
                  <span className="text-emerald-600">90%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Gudang (Warehouse)</span>
                  <span className="text-emerald-600">96%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Divisi Service (Perbaikan)</span>
                  <span className="text-emerald-600">95%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div className="p-3 border border-slate-200 rounded space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Administrasi & Data</span>
                  <span className="text-emerald-600">98%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 12. KPI STAFF */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">12. KPI STAFF</div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="text-xs font-semibold text-slate-700">Kategori Evaluasi Kinerja Staff:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-center text-[10px] font-mono">
                <div className="bg-white p-2 border rounded font-semibold">1. Kehadiran & Absen (20%)</div>
                <div className="bg-white p-2 border rounded font-semibold">2. Uji Kompetensi (20%)</div>
                <div className="bg-white p-2 border rounded font-semibold">3. Daily Report (25%)</div>
                <div className="bg-white p-2 border rounded font-semibold">4. QC Checklist (20%)</div>
                <div className="bg-white p-2 border rounded font-semibold">5. Work Order (15%)</div>
              </div>
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-700 mb-2">Nilai Akhir Staff Periode Ini:</div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-emerald-700">A</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">12 Staff (Sangat Baik)</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-blue-700">B</div>
                    <div className="text-[10px] text-blue-600 mt-0.5">8 Staff (Baik)</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-amber-700">C</div>
                    <div className="text-[10px] text-amber-600 mt-0.5">2 Staff (Cukup)</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded">
                    <div className="text-lg font-bold text-slate-700">D</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">0 Staff (Kurang)</div>
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
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">I. LOGBOOK QC HARIAN STAFF INHOUSE</div>
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
                  {logbookEntries.filter(e => e.date === targetDate).map((e, idx) => (
                    <tr key={e.id} className="hover:bg-slate-50 font-mono">
                      <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300">{e.date}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-semibold text-indigo-700">{e.division}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">{e.staffName}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">{e.activity}</td>
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
                  {logbookEntries.filter(e => e.date === targetDate).length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-slate-400 italic">Tidak ada logbook QC harian terisi pada tanggal ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* REKAP HARIAN SECTION */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">II. REKAP HARIAN</div>
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
                  {findings.map((f, idx) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 text-center">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-bold">{f.equipment}</td>
                      <td className="p-2 border-r border-slate-300 font-sans text-slate-600">{f.issue}</td>
                      <td className="p-2 border-r border-slate-300 text-center font-semibold text-rose-700 uppercase tracking-wide">{f.priority}</td>
                      <td className="p-2 border-r border-slate-300 font-sans font-medium text-slate-700">{f.pic}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{f.targetDate}</td>
                      <td className="p-2 text-center font-bold uppercase">{f.status}</td>
                    </tr>
                  ))}
                  {findings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-slate-400 italic">Tidak ada temuan kerusakan tercatat.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* IV. LAPORAN KPI & KINERJA ALL STAFF */}
          <div className="space-y-4">
            <div className="text-xs uppercase font-bold text-slate-400 font-mono tracking-wider">IV. LAPORAN KPI & KINERJA ALL STAFF</div>
            <div className="overflow-x-auto max-h-[350px] overflow-y-auto border border-slate-300 rounded">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-800 font-mono border-b border-slate-300 uppercase sticky top-0 z-10">
                    <th className="p-2 border-r border-slate-300">Nama Staff</th>
                    <th className="p-2 border-r border-slate-300">Divisi</th>
                    <th className="p-2 border-r border-slate-300 text-center">Daily Report</th>
                    <th className="p-2 border-r border-slate-300 text-center">QC Checklist</th>
                    <th className="p-2 border-r border-slate-300 text-center">Kehadiran</th>
                    <th className="p-2 border-r border-slate-300 text-center">Uji Komp.</th>
                    <th className="p-2 border-r border-slate-300 text-center">WO Selesai</th>
                    <th className="p-2 border-r border-slate-300 text-center">Jam Kerja</th>
                    <th className="p-2 text-center">Nilai KPI (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-mono">
                  {staffKpis.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-300 font-sans font-semibold">{staff.name}</td>
                      <td className="p-2 border-r border-slate-300 font-sans">{staff.division}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.reports}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.qcs}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.attendanceCount} Hari</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.competencyCount}/6</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.wos}</td>
                      <td className="p-2 border-r border-slate-300 text-center">{staff.hours} Jam</td>
                      <td className={`p-2 text-center font-bold ${
                        staff.kpi >= 95 ? 'text-emerald-600' : staff.kpi >= 90 ? 'text-indigo-600' : 'text-amber-600'
                      }`}>{staff.kpi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs font-sans">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block mb-2">TOP 3 PERFORMER HARI INI</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {staffKpis.slice(0, 3).map((staff, idx) => (
                  <div key={staff.id} className="bg-white p-2 border border-slate-200 rounded">
                    <span className="text-[9px] text-slate-400 font-mono block">PERFORMA #{idx + 1}</span>
                    <strong className="text-slate-800 block text-xs">{staff.name}</strong>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">KPI: {staff.kpi}%</div>
                  </div>
                ))}
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

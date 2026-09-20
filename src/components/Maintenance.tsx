/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaintenanceSchedule, Division, Finding, WorkOrder } from '../types';
import { STAFF_LIST } from '../data';
import { Calendar, Plus, CheckCircle, Clock, AlertCircle, FileText, Search, Settings, ArrowRight, ShieldAlert } from 'lucide-react';

interface MaintenanceProps {
  schedules: MaintenanceSchedule[];
  onAddSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => void;
  onUpdateScheduleStatus: (
    id: string,
    status: 'Scheduled' | 'Done' | 'Overdue',
    notes?: string,
    sparepart?: string,
    vendor?: string,
    biaya?: number,
    photoUrl?: string
  ) => void;
  onUpdateSchedule?: (id: string, updatedFields: Partial<MaintenanceSchedule>) => void;
  onAddFinding?: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  onAddWorkOrder?: (wo: Omit<WorkOrder, 'id' | 'dateCreated'>) => void;
  onAddReport?: (report: any) => void;
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function Maintenance({
  schedules,
  onAddSchedule,
  onUpdateScheduleStatus,
  onUpdateSchedule,
  onAddFinding,
  onAddWorkOrder,
  onAddReport,
  currentUser,
  onLogActivity,
}: MaintenanceProps) {
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [type, setType] = useState<'Preventive' | 'Corrective'>('Preventive');
  const [frequency, setFrequency] = useState<'Harian' | 'Mingguan' | 'Bulanan' | 'Insidental'>('Bulanan');
  const [nextDate, setNextDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Service Log Modal/State
  const [servicingId, setServicingId] = useState<string | null>(null);
  const [serviceNotes, setServiceNotes] = useState('');
  const [sparepart, setSparepart] = useState('');
  const [vendor, setVendor] = useState('');
  const [biaya, setBiaya] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim() || !nextDate) return;

    onAddSchedule({
      assetName,
      assetCode: assetCode || 'AST-GEN-' + String(Math.floor(Date.now() % 1000)).padStart(3, '0'),
      type,
      frequency,
      lastDate: new Date().toISOString().split('T')[0],
      nextDate,
      status: 'Scheduled',
      notes,
    });

    onLogActivity(currentUser.name, currentUser.role, `Menjadwalkan service ${type} untuk ${assetName}`);

    // Reset Form
    setAssetName('');
    setAssetCode('');
    setNotes('');
    setShowForm(false);
  };

  const handleExecuteService = (id: string) => {
    const costNumber = Number(biaya) || 0;
    onUpdateScheduleStatus(id, 'Done', serviceNotes, sparepart, vendor, costNumber, photoUrl);
    const item = schedules.find(s => s.id === id);
    if (item) {
      onLogActivity(currentUser.name, currentUser.role, `Menyelesaikan service ${item.type} untuk ${item.assetName}`);
      
      // Auto-create Daily Report log entry untuk Divisi Service
      if (onAddReport) {
        const servicePic = currentUser.division === 'Service' 
          ? currentUser.name 
          : (STAFF_LIST.find(s => s.division === 'Service')?.name || currentUser.name);
          
        onAddReport({
          date: new Date().toISOString().split('T')[0],
          staffName: servicePic,
          division: 'Service',
          activity: `[Maintenance & Servis Selesai] ${item.assetName} (${item.assetCode || 'Unit'})`,
          notes: `Pekerjaan ${item.type} Maintenance selesai. Catatan teknis: ${serviceNotes || 'Pemeriksaan rutin standar'}. Sparepart: ${sparepart || 'Tidak ada penggantian'}. Vendor: ${vendor || 'Internal'}. Biaya: Rp ${costNumber.toLocaleString('id-ID')}.`,
          status: 'Submitted',
          photoUrl: photoUrl || undefined
        });
      }
    }
    setServicingId(null);
    setServiceNotes('');
    setSparepart('');
    setVendor('');
    setBiaya('');
    setPhotoUrl('');
  };

  // P1.2: Terbitkan WO dari jadwal Overdue
  const handleIssueWO = (schedule: MaintenanceSchedule) => {
    const defaultPic = STAFF_LIST.find(s => s.division === 'Service')?.name || currentUser.name;
    if (onAddWorkOrder) {
      onAddWorkOrder({
        title: `[Maintenance Overdue] ${schedule.type} — ${schedule.assetName}`,
        description: `Jadwal ${schedule.type} Maintenance untuk aset ${schedule.assetName} (${schedule.assetCode}) sudah OVERDUE sejak ${schedule.nextDate}. Instruksi: ${schedule.notes || 'Pengecekan standar berkala.'}`,
        pic: defaultPic,
        division: 'Service',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        status: 'Pending'
      });
    }
    if (onAddFinding) {
      onAddFinding({
        equipment: `${schedule.assetName} (${schedule.assetCode})`,
        issue: `Jadwal ${schedule.type} Maintenance overdue sejak ${schedule.nextDate}. Perlu eskalasi ke Divisi Service.`,
        priority: 'Tinggi',
        pic: defaultPic,
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Open'
      });
    }
    onLogActivity(currentUser.name, currentUser.role, `Menerbitkan WO dari jadwal Maintenance Overdue: ${schedule.assetName}`);
    alert(`Work Order untuk "${schedule.assetName}" berhasil diterbitkan ke Divisi Service!`);
  };

  // Filter schedules list
  const filteredSchedules = schedules.filter(s => {
    const matchesSearch = s.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || s.type === filterType;
    const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Maintenance & Jadwal Service</h1>
          <p className="text-xs text-slate-500">Pencatatan Preventive Maintenance (rutin) dan Corrective Maintenance (perbaikan) unit aset</p>
        </div>
        {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showForm ? 'Tutup Formulir' : 'Buat Jadwal Service'}</span>
          </button>
        )}
      </div>

      {/* Schedule Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Form Jadwal Perawatan & Service Baru</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Asset Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Nama Peralatan / Unit Aset
              </label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="e.g. Speaker Monitor FOH #1"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>

            {/* Asset Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Kode Asset <span className="text-slate-400 font-normal text-[10px]">(Opsional)</span>
              </label>
              <input
                type="text"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                placeholder="e.g. AST-AUD-005"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              />
            </div>

            {/* Maintenance Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tipe Perawatan (Maintenance)
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              >
                <option value="Preventive">Preventive Maintenance (Pencegahan Rutin)</option>
                <option value="Corrective">Corrective Maintenance (Perbaikan Masalah)</option>
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Frekuensi Service
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              >
                <option value="Harian">Setiap Hari (Harian)</option>
                <option value="Mingguan">Setiap Minggu (Mingguan)</option>
                <option value="Bulanan">Setiap Bulan (Bulanan)</option>
                <option value="Insidental">Sekali Saja / Insidental</option>
              </select>
            </div>

            {/* Next Scheduled Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tanggal Rencana Service Berikutnya
              </label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Instruksi Detail Perawatan
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Sebutkan detail instruksi, e.g. Bersihkan filter debu kipas, ganti pasta thermal, dan ukur tegangan input"
                rows={2}
                className="block w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              Simpan Jadwal Maintenance
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari maintenance berdasarkan nama alat, kode, instruksi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          />
        </div>

        <div className="flex gap-2">
          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
          >
            <option value="All">Semua Tipe</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
          >
            <option value="All">Semua Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Done">Done</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Execute Service Log Modal/Action Box */}
      {servicingId && (
        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 space-y-4 max-w-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-700" />
            <h3 className="text-sm font-bold text-indigo-900">
              Laporkan Pelaksanaan Service: {schedules.find(s => s.id === servicingId)?.assetName}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Sparepart */}
            <div>
              <label className="block text-xs font-semibold text-indigo-900 uppercase mb-1 font-sans">
                Suku Cadang / Sparepart yang Diganti
              </label>
              <input
                type="text"
                placeholder="e.g. IC Power Regulator atau N/A"
                value={sparepart}
                onChange={(e) => setSparepart(e.target.value)}
                className="w-full p-2 border border-indigo-200 rounded-lg bg-white text-slate-700 focus:outline-none"
              />
            </div>

            {/* Vendor */}
            <div>
              <label className="block text-xs font-semibold text-indigo-900 uppercase mb-1 font-sans">
                Vendor Servis / Teknisi Luar
              </label>
              <input
                type="text"
                placeholder="e.g. CV Riz Elektronik atau Internal"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full p-2 border border-indigo-200 rounded-lg bg-white text-slate-700 focus:outline-none"
              />
            </div>

            {/* Biaya */}
            <div>
              <label className="block text-xs font-semibold text-indigo-900 uppercase mb-1 font-sans">
                Total Biaya Perbaikan (IDR)
              </label>
              <input
                type="number"
                placeholder="e.g. 500000"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
                className="w-full p-2 border border-indigo-200 rounded-lg bg-white text-slate-700 font-mono focus:outline-none"
              />
            </div>

            {/* Photo Proof Simulator */}
            <div>
              <label className="block text-xs font-semibold text-indigo-900 uppercase mb-1 font-sans">
                Foto Bukti Perbaikan / Service
              </label>
              {photoUrl ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-mono truncate max-w-[150px]">{photoUrl}</span>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="text-[10px] text-red-600 underline font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all">
                  Ambil Foto Bukti
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setPhotoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}
            </div>
            <a
              href="https://drive.google.com/drive/folders/1vfayjDd8bmC0rWgtlZcTMBqc-kMPM16u?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center sm:text-left text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              Atau Unggah ke Folder Drive (Bukti Maintenance)
            </a>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-indigo-700 uppercase font-sans">
              Catatan Detail Pekerjaan Service (Hasil Tes)
            </label>
            <textarea
              value={serviceNotes}
              onChange={(e) => setServiceNotes(e.target.value)}
              placeholder="Sebutkan hasil service secara mendalam untuk disimpan ke dalam logbook perbaikan..."
              rows={2}
              className="w-full p-2.5 border border-indigo-200 rounded-lg text-xs bg-white text-slate-700 focus:outline-none"
              required
            />
            <div className="flex justify-end gap-2 text-xs font-semibold pt-2 border-t">
              <button
                onClick={() => setServicingId(null)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => handleExecuteService(servicingId)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
              >
                Simpan & Tandai Selesai (Done)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchedules.map((schedule) => {
          const isDone = schedule.status === 'Done';
          const isOverdue = schedule.status === 'Overdue';
          const isPreventive = schedule.type === 'Preventive';

          return (
            <div
              key={schedule.id}
              className={`bg-white rounded-xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                isDone ? 'border-slate-100 bg-slate-50/30' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {/* Type Badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isPreventive ? 'bg-indigo-50 text-indigo-700' : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    {schedule.type} Maintenance
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      schedule.status === 'Done' ? 'bg-emerald-100 text-emerald-800' :
                      schedule.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {schedule.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{schedule.assetName}</h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{schedule.assetCode}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-[10px] text-slate-400 font-semibold block uppercase font-mono mb-1">
                    Instruksi / Catatan:
                  </strong>
                  {schedule.notes || 'Pengecekan standar berkala sesuai frekuensi jadwal harian/mingguan.'}
                </p>

                {/* Suku cadang, Vendor, Biaya, Foto if Done */}
                {isDone && (
                  <div className="text-xs space-y-2 p-3 bg-indigo-50/30 rounded-lg border border-indigo-100/50 font-sans">
                    <strong className="text-[10px] text-indigo-700 font-bold block uppercase font-mono tracking-wider">
                      Laporan Hasil Pemeliharaan:
                    </strong>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-semibold">Sparepart:</span>
                        <span className="text-slate-800 font-semibold">{schedule.sparepart || 'Tidak ada penggantian'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold">Vendor Servis:</span>
                        <span className="text-slate-800 font-semibold">{schedule.vendor || 'Internal Team'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block font-semibold">Biaya Perawatan:</span>
                        <span className="text-indigo-700 font-bold font-mono">
                          {schedule.biaya ? `Rp ${schedule.biaya.toLocaleString('id-ID')}` : 'Rp 0 (Internal)'}
                        </span>
                      </div>
                    </div>
                    {schedule.photoUrl && (
                      <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden max-h-24">
                        <img src={schedule.photoUrl} alt="Bukti Service" className="w-full h-24 object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer info & Action buttons */}
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-500">
                  <div>
                    <span className="block text-slate-400">Frekuensi</span>
                    <span className="font-semibold text-slate-700">{schedule.frequency}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Terakhir</span>
                    <span className="font-semibold text-slate-700">{schedule.lastDate || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Berikutnya</span>
                    <span className="font-semibold text-slate-700 text-indigo-600">{schedule.nextDate}</span>
                  </div>
                </div>

                {!isDone && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setServicingId(schedule.id);
                        setServiceNotes('');
                      }}
                      className="flex-1 py-1.5 px-3 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Eksekusi Service & Selesaikan</span>
                    </button>
                    {isOverdue && (onAddWorkOrder || onAddFinding) && (
                      <button
                        onClick={() => handleIssueWO(schedule)}
                        className="flex-1 py-1.5 px-3 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Terbitkan WO</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredSchedules.length === 0 && (
          <div className="col-span-full bg-white py-12 text-center rounded-xl border border-slate-100 text-slate-400 text-sm">
            Tidak ada jadwal perawatan / service yang sesuai dengan filter pencarian ini.
          </div>
        )}
      </div>
    </div>
  );
}

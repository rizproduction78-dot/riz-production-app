/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Finding, Division, Staff } from '../types';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { AlertTriangle, Plus, Search, Trash2, CheckCircle, Clock, Check, X, ShieldAlert, ChevronDown } from 'lucide-react';
import { subscribeCloudCollection } from '../lib/cloudSync';

interface FindingsProps {
  findings: Finding[];
  onAddFinding: (finding: Omit<Finding, 'id' | 'dateCreated'>) => void;
  onUpdateFindingStatus: (id: string, status: 'Open' | 'Close') => void;
  onDeleteFinding: (id: string) => void;
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function Findings({
  findings,
  onAddFinding,
  onUpdateFindingStatus,
  onDeleteFinding,
  currentUser,
  onLogActivity,
}: FindingsProps) {
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

  // Filter/Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [equipment, setEquipment] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState<'Tinggi' | 'Sedang' | 'Rendah'>('Sedang');
  const [pic, setPic] = useState('');
  const [targetDate, setTargetDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment.trim() || !issue.trim() || !pic) return;

    onAddFinding({
      equipment,
      issue,
      priority,
      pic,
      targetDate,
      status: 'Open',
    });

    onLogActivity(currentUser.name, currentUser.role, `Menambahkan temuan QC manual untuk ${equipment}`);

    // Reset Form
    setEquipment('');
    setIssue('');
    setPriority('Sedang');
    setPic('');
    setShowAddForm(false);
  };

  const handleToggleStatus = (id: string, currentStatus: 'Open' | 'Close') => {
    const nextStatus = currentStatus === 'Open' ? 'Close' : 'Open';
    onUpdateFindingStatus(id, nextStatus);
    onLogActivity(currentUser.name, currentUser.role, `Mengubah status temuan QC id:${id} menjadi ${nextStatus}`);
  };

  // Filter Findings list
  const filteredFindings = findings.filter(f => {
    const matchesSearch = f.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.pic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' || f.priority === filterPriority;
    const matchesStatus = filterStatus === 'All' || f.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Temuan QC & Kerusakan</h1>
          <p className="text-xs text-slate-500">Daftar kerusakan unit peralatan yang terdeteksi dan status penanganannya</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Formulir' : 'Laporkan Temuan Baru'}</span>
        </button>
      </div>

      {/* Manual Add Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Form Laporan Kerusakan Unit Baru</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Name */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Nama Alat / Unit Bermasalah
              </label>
              <input
                type="text"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. Mixer Yamaha CL5 #1 atau Moving Head BSW #4"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>

            {/* Description of Issue */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Deskripsi Kerusakan / Kendala
              </label>
              <textarea
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Sebutkan detail kendala, e.g. Layar berkedip-kedip setelah pemakaian 2 jam"
                rows={2}
                className="block w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Prioritas Penanganan
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              >
                <option value="Rendah">Rendah (Low)</option>
                <option value="Sedang">Sedang (Medium)</option>
                <option value="Tinggi">Tinggi (High / Urgent)</option>
              </select>
            </div>

            {/* PIC Assigned */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                PIC Penanggung Jawab
              </label>
              <select
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              >
                <option value="">-- Pilih PIC Staff --</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.name}>{s.name} {s.nickname && s.nickname.toLowerCase() !== s.name.toLowerCase() ? `(${s.nickname})` : ''} - {s.division}</option>
                ))}
              </select>
            </div>

            {/* Target Selesai */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Target Tanggal Selesai
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              Simpan & Daftarkan Temuan
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
            placeholder="Cari kerusakan berdasarkan nama alat, masalah, PIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          />
        </div>

        <div className="flex gap-2">
          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
          >
            <option value="All">Semua Prioritas</option>
            <option value="Tinggi">Tinggi</option>
            <option value="Sedang">Sedang</option>
            <option value="Rendah">Rendah</option>
          </select>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
          >
            <option value="All">Semua Status</option>
            <option value="Open">Open</option>
            <option value="Close">Close</option>
          </select>
        </div>
      </div>

      {/* List of Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFindings.map((finding) => {
          const isHigh = finding.priority === 'Tinggi';
          const isOpen = finding.status === 'Open';

          return (
            <div
              key={finding.id}
              className={`bg-white rounded-xl border p-5 shadow-sm space-y-4 flex flex-col justify-between transition-all ${
                isHigh && isOpen
                  ? 'border-red-200 bg-red-50/10 hover:border-red-300 ring-1 ring-red-100/50'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="space-y-2">
                {/* Badge Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      finding.priority === 'Tinggi' ? 'bg-red-100 text-red-800' :
                      finding.priority === 'Sedang' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    Prioritas {finding.priority}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      finding.status === 'Open' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {finding.status}
                  </span>
                </div>

                {/* Equipment & Problem */}
                <h3 className="font-bold text-slate-800 text-md">{finding.equipment}</h3>
                <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                  {finding.issue}
                </p>
              </div>

              {/* PIC, Target Date and Actions */}
              <div className="pt-3 border-t border-slate-100/80 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono">
                  <div>
                    <span className="block text-[10px] text-slate-400">PIC Staff</span>
                    <span className="font-semibold text-slate-700">{finding.pic}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">Target Selesai</span>
                    <span className="font-semibold text-slate-700">{finding.targetDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {/* Toggle Status Button */}
                  <button
                    onClick={() => handleToggleStatus(finding.id, finding.status)}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer ${
                      finding.status === 'Open'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {finding.status === 'Open' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesaikan (Close)</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Re-open Temuan</span>
                      </>
                    )}
                  </button>

                  {/* Delete Button (Allowed for supervisor, admin, manager) */}
                  {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && (
                    <button
                      onClick={() => {
                        if (confirm('Yakin ingin menghapus temuan ini dari history?')) {
                          onDeleteFinding(finding.id);
                        }
                      }}
                      className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      title="Hapus Temuan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredFindings.length === 0 && (
          <div className="col-span-full bg-white py-12 text-center rounded-xl border border-slate-100 text-slate-400 text-sm">
            Tidak ada temuan kerusakan yang terdeteksi dengan kriteria pencarian ini.
          </div>
        )}
      </div>
    </div>
  );
}

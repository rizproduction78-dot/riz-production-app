/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Asset, Division } from '../types';
import { STAFF_LIST } from '../data';
import { Search, Plus, Trash2, Edit2, Archive, MapPin, Wrench, CheckCircle, AlertTriangle, XCircle, Settings, ClipboardList } from 'lucide-react';

interface AssetProps {
  assets: Asset[];
  onAddAsset: (asset: Omit<Asset, 'id' | 'repairHistory'>) => void;
  onUpdateAssetCondition: (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => void;
  onAddRepairRecord: (id: string, record: { date: string; description: string; cost: number; PIC: string }) => void;
  onDeleteAsset: (id: string) => void;
  currentUser: any;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function AssetManagement({
  assets,
  onAddAsset,
  onUpdateAssetCondition,
  onAddRepairRecord,
  onDeleteAsset,
  currentUser,
  onLogActivity,
}: AssetProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDivision, setFilterDivision] = useState<string>('All');
  const [filterCondition, setFilterCondition] = useState<string>('All');

  // Add Asset form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [division, setDivision] = useState<Division>('Audio');
  const [location, setLocation] = useState('Gudang Utama RIZ');
  const [condition, setCondition] = useState<'Baik' | 'Rusak Ringan' | 'Rusak Berat'>('Baik');

  // Repair Record Form state for selected asset
  const [selectedAssetIdForRepair, setSelectedAssetIdForRepair] = useState<string | null>(null);
  const [repairDescription, setRepairDescription] = useState('');
  const [repairCost, setRepairCost] = useState(0);
  const [repairPIC, setRepairPIC] = useState(currentUser.name);

  const handleAddAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const assetCode = code.trim() || 'AST-' + division.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

    onAddAsset({
      code: assetCode,
      name,
      brand,
      serialNumber,
      division,
      location,
      condition,
    });

    onLogActivity(currentUser.name, currentUser.role, `Menambahkan aset baru: ${name} (${assetCode})`);

    // Reset Form
    setName('');
    setCode('');
    setBrand('');
    setSerialNumber('');
    setShowAddForm(false);
  };

  const handleAddRepairSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetIdForRepair || !repairDescription.trim()) return;

    onAddRepairRecord(selectedAssetIdForRepair, {
      date: new Date().toISOString().split('T')[0],
      description: repairDescription,
      cost: Number(repairCost),
      PIC: repairPIC,
    });

    // Automatically update asset status to 'Baik' upon repair record entry if requested
    onUpdateAssetCondition(selectedAssetIdForRepair, 'Baik');

    const asset = assets.find(a => a.id === selectedAssetIdForRepair);
    if (asset) {
      onLogActivity(currentUser.name, currentUser.role, `Mencatat perbaikan dan memulihkan kondisi asset ${asset.name}`);
    }

    // Reset State
    setSelectedAssetIdForRepair(null);
    setRepairDescription('');
    setRepairCost(0);
  };

  // Filter Assets List
  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = filterDivision === 'All' || a.division === filterDivision;
    const matchesCondition = filterCondition === 'All' || a.condition === filterCondition;
    return matchesSearch && matchesDivision && matchesCondition;
  });

  // Calculate inventories summary
  const totalAssets = assets.length;
  const goodAssets = assets.filter(a => a.condition === 'Baik').length;
  const minorDamagedAssets = assets.filter(a => a.condition === 'Rusak Ringan').length;
  const majorDamagedAssets = assets.filter(a => a.condition === 'Rusak Berat').length;

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Manajemen Aset Gudang</h1>
          <p className="text-xs text-slate-500">Pencatatan inventaris, lokasi, kondisi berkala, serta log perbaikan aset RIZ-PRODUCTION</p>
        </div>
        {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Formulir' : 'Daftarkan Aset Baru'}</span>
          </button>
        )}
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono mb-1">Total Aset Gudang</div>
          <div className="text-2xl font-bold font-display text-slate-800">{totalAssets} Unit</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 font-mono mb-1">Kondisi Baik</div>
          <div className="text-2xl font-bold font-display text-emerald-600">{goodAssets} Unit</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-500 font-mono mb-1">Rusak Ringan</div>
          <div className="text-2xl font-bold font-display text-amber-600">{minorDamagedAssets} Unit</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-rose-500 font-mono mb-1">Rusak Berat</div>
          <div className="text-2xl font-bold font-display text-rose-600">{majorDamagedAssets} Unit</div>
        </div>
      </div>

      {/* Add Asset Form */}
      {showAddForm && (
        <form onSubmit={handleAddAssetSubmit} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Archive className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-800">Pendaftaran Aset Inventaris Baru</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Kode Asset <span className="text-slate-400 font-normal text-[10px]">(Opsional, auto-generate jika kosong)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. AST-AUD-009"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Nama Barang / Unit
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mixer Yamaha CL5 #3"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Merk / Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Yamaha"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Nomor Seri / Serial Number
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. SN-982736412"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Divisi Pemilik
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              >
                <option value="Audio">Audio</option>
                <option value="Lighting">Lighting</option>
                <option value="Videotron">Videotron</option>
                <option value="Multimedia">Multimedia</option>
                <option value="Gudang">Gudang</option>
                <option value="Service">Service</option>
                <option value="Admin">Admin / Management</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Lokasi Penyimpanan di Gudang
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gudang Utama Lantai 1"
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Kondisi Fisik & Fungsi Awal
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
              >
                <option value="Baik">Baik (Fungsi normal 100%)</option>
                <option value="Rusak Ringan">Rusak Ringan (Bisa dipakai terbatas)</option>
                <option value="Rusak Berat">Rusak Berat (Macet total / tidak berfungsi)</option>
              </select>
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
              Simpan & Daftarkan Aset
            </button>
          </div>
        </form>
      )}

      {/* Repair Record Modal Box */}
      {selectedAssetIdForRepair && (
        <form onSubmit={handleAddRepairSubmit} className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-4 max-w-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
            <Settings className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-emerald-900">
              Catat Log Tindakan Perbaikan: {assets.find(a => a.id === selectedAssetIdForRepair)?.name}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-emerald-800 mb-1 uppercase tracking-wider">
                Deskripsi Tindakan Servis / Suku Cadang yang Diganti
              </label>
              <input
                type="text"
                value={repairDescription}
                onChange={(e) => setRepairDescription(e.target.value)}
                placeholder="e.g. Solder ulang resistor jalur output master L, bersihkan fader"
                className="block w-full px-3 py-2 border border-emerald-200 rounded-lg text-xs bg-white text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1 uppercase tracking-wider">
                Estimasi Biaya Servis (Rp)
              </label>
              <input
                type="number"
                value={repairCost}
                onChange={(e) => setRepairCost(Number(e.target.value))}
                placeholder="e.g. 150000"
                className="block w-full px-3 py-2 border border-emerald-200 rounded-lg text-xs bg-white text-slate-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1 uppercase tracking-wider">
                Teknisi / PIC Servis
              </label>
              <select
                value={repairPIC}
                onChange={(e) => setRepairPIC(e.target.value)}
                className="block w-full px-3 py-2 border border-emerald-200 rounded-lg text-xs bg-white text-slate-700"
                required
              >
                {STAFF_LIST.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.division})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs font-semibold pt-2">
            <button
              type="button"
              onClick={() => setSelectedAssetIdForRepair(null)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
            >
              Selesaikan Servis & Kembalikan Kondisi Baik (OK)
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
            placeholder="Cari aset berdasarkan kode, nama barang, merk, nomor seri..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700"
          />
        </div>

        <div className="flex gap-2">
          {/* Division Filter */}
          <select
            value={filterDivision}
            onChange={(e) => setFilterDivision(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
          >
            <option value="All">Semua Divisi</option>
            <option value="Audio">Audio</option>
            <option value="Lighting">Lighting</option>
            <option value="Videotron">Videotron</option>
            <option value="Multimedia">Multimedia</option>
            <option value="Gudang">Gudang</option>
            <option value="Service">Service</option>
          </select>

          {/* Condition Filter */}
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-700 bg-white"
          >
            <option value="All">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>
      </div>

      {/* Assets Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          return (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4 hover:border-slate-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Condition Info */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-100 font-mono font-bold text-indigo-700 px-2 py-0.5 rounded uppercase tracking-wider">
                    {asset.division}
                  </span>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      asset.condition === 'Baik' ? 'bg-emerald-50 text-emerald-700' :
                      asset.condition === 'Rusak Ringan' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {asset.condition === 'Baik' && <CheckCircle className="w-3 h-3 inline" />}
                    {asset.condition === 'Rusak Ringan' && <AlertTriangle className="w-3 h-3 inline" />}
                    {asset.condition === 'Rusak Berat' && <XCircle className="w-3 h-3 inline" />}
                    <span>{asset.condition}</span>
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold text-slate-800 text-md">{asset.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-400">
                    <span>{asset.brand}</span>
                    <span>•</span>
                    <span className="text-slate-500 font-semibold">{asset.code}</span>
                  </div>
                </div>

                {/* Storage & Serial Info */}
                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Lokasi:</strong> {asset.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Archive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>No. Seri:</strong> {asset.serialNumber || 'N/A'}</span>
                  </div>
                </div>

                {/* Repair History list mini */}
                {asset.repairHistory.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
                      <ClipboardList className="w-3 h-3 text-emerald-600" />
                      <span>Riwayat Perbaikan ({asset.repairHistory.length})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 max-h-24 overflow-y-auto space-y-1 border-t border-slate-100 pt-1">
                      {asset.repairHistory.map((rep, rIdx) => (
                        <div key={rIdx} className="bg-slate-50/50 p-1.5 rounded border border-slate-100/30 flex justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block">{rep.date} • {rep.PIC}</span>
                            <span className="leading-tight">{rep.description}</span>
                          </div>
                          <span className="font-bold font-mono text-[10px] text-emerald-600 self-center shrink-0">
                            Rp {rep.cost.toLocaleString('id-ID')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">Belum ada riwayat perbaikan.</div>
                )}
              </div>

              {/* Action and controls */}
              <div className="flex gap-2 pt-3 border-t border-slate-100/80">
                {asset.condition !== 'Baik' ? (
                  <button
                    onClick={() => {
                      setSelectedAssetIdForRepair(asset.id);
                      setRepairDescription('');
                      setRepairCost(0);
                    }}
                    className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Servis Unit Ini</span>
                  </button>
                ) : (
                  <div className="flex-1 flex gap-1">
                    <button
                      onClick={() => onUpdateAssetCondition(asset.id, 'Rusak Ringan')}
                      className="flex-1 py-1 px-2 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      Set Rusak Ringan
                    </button>
                    <button
                      onClick={() => onUpdateAssetCondition(asset.id, 'Rusak Berat')}
                      className="flex-1 py-1 px-2 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-[10px] font-semibold transition-colors"
                    >
                      Set Rusak Berat
                    </button>
                  </div>
                )}

                {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && (
                  <button
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus asset ' + asset.name + ' dari daftar inventaris RIZ-PRODUCTION?')) {
                        onDeleteAsset(asset.id);
                      }
                    }}
                    className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg self-center"
                    title="Hapus Aset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredAssets.length === 0 && (
          <div className="col-span-full bg-white py-12 text-center rounded-xl border border-slate-100 text-slate-400 text-sm">
            Tidak ada unit aset yang sesuai dengan kriteria filter pencarian.
          </div>
        )}
      </div>
    </div>
  );
}

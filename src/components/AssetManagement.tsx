/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Asset, Division, Staff } from '../types';
import { STAFF_LIST, getMasterStaffList } from '../data';
import { Search, Plus, Trash2, Edit2, Archive, MapPin, Wrench, CheckCircle, AlertTriangle, XCircle, Settings, ClipboardList, BookOpen, Sparkles } from 'lucide-react';
import { subscribeCloudCollection } from '../lib/cloudSync';
import {
  OFFICIAL_EQUIPMENT_CATALOG,
  OfficialEquipmentItem
} from '../data/officialEquipmentReference';

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

  // Tab state: 'inventory' | 'official_catalog'
  const [assetViewTab, setAssetViewTab] = useState<'inventory' | 'official_catalog'>('inventory');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogDivision, setCatalogDivision] = useState<string>('All');

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

  // Register item from official catalog
  const handleRegisterFromCatalog = (item: OfficialEquipmentItem) => {
    const assetCode = 'AST-' + item.division.substring(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    onAddAsset({
      code: assetCode,
      name: item.name,
      brand: item.brand,
      serialNumber: 'SN-' + item.id + '-' + Math.floor(1000 + Math.random() * 9000),
      division: item.division as Division,
      location: 'Gudang Utama RIZ',
      condition: 'Baik',
    });
    onLogActivity(currentUser.name, currentUser.role, `Mendaftarkan aset resmi: ${item.name} (${assetCode}) dari katalog rizproduction.id`);
    alert(`Berhasil! "${item.name}" telah didaftarkan ke Daftar Aset Gudang Aktif.`);
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

  // Filter Official Catalog List
  const filteredCatalog = OFFICIAL_EQUIPMENT_CATALOG.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          item.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                          item.specs.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesDiv = catalogDivision === 'All' || item.division === catalogDivision;
    return matchesSearch && matchesDiv;
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
        {(currentUser.role === 'Admin' || currentUser.role === 'Supervisor' || currentUser.role === 'Manager') && assetViewTab === 'inventory' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Tutup Formulir' : 'Daftarkan Aset Baru'}</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs: Daftar Aset Aktif vs Sumber Resmi & Katalog Peralatan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold w-fit">
          <button
            type="button"
            onClick={() => setAssetViewTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              assetViewTab === 'inventory'
                ? 'bg-white text-indigo-700 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>📋 Daftar Aset Gudang ({assets.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setAssetViewTab('official_catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              assetViewTab === 'official_catalog'
                ? 'bg-emerald-600 text-white shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📚 Katalog Standar Peralatan</span>
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* VIEW 1: DAFTAR ASET GUDANG AKTIF                           */}
      {/* ────────────────────────────────────────────────────────── */}
      {assetViewTab === 'inventory' && (
        <div className="space-y-8">
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
                {staffList.map(s => (
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
  )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* VIEW 2: SUMBER RESMI & KATALOG PERALATAN (rizproduction.id) */}
      {/* ────────────────────────────────────────────────────────── */}
      {assetViewTab === 'official_catalog' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-indigo-900/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-red-600 text-white font-black text-[10px] tracking-wider uppercase rounded-lg">
                  RIZ-PROLOG
                </span>
                <span className="text-[11px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                  SUMBER RESMI REFERENCE PERALATAN
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1.5 uppercase">
                KATALOG STANDAR ALAT & INVENTARIS EVENT
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Database master spesifikasi teknis, merek, kategori, serta standar poin inspeksi SOP peralatan PT. RIZ PRODUCTION MULTI KREASI. Tim dapat langsung mendaftarkan unit ke dalam Aset Gudang Aktif dengan satu klik.
              </p>
            </div>
          </div>

          {/* Search, Filter & Quick-Add from Catalog */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Katalog Resmi Peralatan PT. RIZ ({filteredCatalog.length} Item Terdata)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Pilih item resmi untuk didaftarkan langsung ke dalam Aset Gudang Aktif dengan standar kode aset otomatis.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Cari alat / brand / spesifikasi..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <select
                  value={catalogDivision}
                  onChange={(e) => setCatalogDivision(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="All">Semua Divisi</option>
                  <option value="Audio">Audio (Sound & Backline)</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Videotron">Videotron</option>
                  <option value="Multimedia">Multimedia & Broadcast</option>
                  <option value="Gudang">Gudang & Rigging</option>
                </select>
              </div>
            </div>

            {/* Catalog Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider font-mono">
                  <tr>
                    <th className="px-3 py-3 text-left w-16">Kode</th>
                    <th className="px-4 py-3 text-left">Nama Peralatan Resmi</th>
                    <th className="px-3 py-3 text-left">Brand</th>
                    <th className="px-3 py-3 text-left">Divisi</th>
                    <th className="px-4 py-3 text-left">Spesifikasi Utama</th>
                    <th className="px-4 py-3 text-left">Poin Inspeksi / SOP</th>
                    <th className="px-3 py-3 text-center w-36">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredCatalog.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-slate-500">
                        {item.id}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{item.category}</div>
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-700">
                        {item.brand}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          item.division === 'Audio' ? 'bg-blue-100 text-blue-800' :
                          item.division === 'Lighting' ? 'bg-amber-100 text-amber-800' :
                          item.division === 'Videotron' ? 'bg-cyan-100 text-cyan-800' :
                          item.division === 'Multimedia' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {item.division}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-600 max-w-xs leading-relaxed">
                        {item.specs}
                      </td>
                      <td className="px-4 py-2.5 text-[11px] text-slate-500 max-w-xs leading-relaxed italic">
                        {item.maintenanceSchedule}
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRegisterFromCatalog(item)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 hover:text-emerald-900 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-2xs"
                          title="Daftarkan item ini ke dalam Aset Gudang Aktif"
                        >
                          <Plus className="w-3 h-3 text-emerald-600" />
                          <span>+ Daftarkan</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

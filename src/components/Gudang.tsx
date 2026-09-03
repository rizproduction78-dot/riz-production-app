import React, { useState, useEffect } from 'react';
import { Staff, Asset, WarehouseLog } from '../types';
import { INITIAL_ASSETS } from '../data';
import { Package, ArrowDownLeft, ArrowUpRight, Truck, Database, Search, Plus, Camera, CheckCircle, FileText, Smartphone, RefreshCw, Layers, Wrench } from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc } from '../lib/cloudSync';

interface GudangProps {
  currentUser: Staff;
  assets: Asset[];
  onUpdateAssetLocation?: (id: string, newLocation: string) => void;
  onUpdateAssetCondition?: (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => void;
  onLogActivity: (username: string, role: string, action: string) => void;
}

export default function Gudang({
  currentUser,
  assets,
  onUpdateAssetLocation,
  onUpdateAssetCondition,
  onLogActivity
}: GudangProps) {
  // Warehouse Logs State - Bersih dari data dummy
  const [warehouseLogs, setWarehouseLogs] = useState<WarehouseLog[]>(() => {
    const saved = localStorage.getItem('riz_warehouse_logs');
    if (saved) {
      try {
        const parsed: WarehouseLog[] = JSON.parse(saved);
        const cleaned = parsed.filter(l => l.id !== 'wl-1' && l.id !== 'wl-2');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('riz_warehouse_logs', JSON.stringify(cleaned));
        }
        return cleaned;
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Assets database matching
  const [localAssets, setLocalAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('riz_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  useEffect(() => {
    setLocalAssets(assets);
  }, [assets]);

  // Tab views within warehouse: 'logs' or 'scanner'
  const [warehouseSubTab, setWarehouseSubTab] = useState<'logs' | 'scanner'>('logs');

  // New action form state
  const [showLogForm, setShowLogForm] = useState(false);
  const [type, setType] = useState<'Masuk' | 'Keluar' | 'Loading' | 'Unloading' | 'Servis Keluar' | 'Servis Masuk'>('Masuk');
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState(1);
  const [picName, setPicName] = useState(currentUser.name);
  const [notes, setNotes] = useState('');
  const [assetCodeInput, setAssetCodeInput] = useState('');
  const [scannedPhoto, setScannedPhoto] = useState('');

  // Scanner Simulator State
  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);
  const [scanSearchInput, setScanSearchInput] = useState('');
  const [scanMessage, setScanMessage] = useState('');

  // Real-time Cloud Subscription
  useEffect(() => {
    const unsub = subscribeCloudCollection<WarehouseLog>(
      'warehouse_logs',
      'riz_warehouse_logs',
      setWarehouseLogs,
      []
    );
    return () => unsub();
  }, []);

  // Save states
  useEffect(() => {
    localStorage.setItem('riz_warehouse_logs', JSON.stringify(warehouseLogs));
  }, [warehouseLogs]);

  const handleAddWarehouseLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || qty <= 0) return;

    const newLog: WarehouseLog = {
      id: 'wl-' + Date.now(),
      type,
      date: new Date().toISOString().split('T')[0],
      itemName,
      qty,
      pic: picName || currentUser.name,
      notes,
      assetCode: assetCodeInput || undefined,
      photoUrl: scannedPhoto || undefined
    };

    setWarehouseLogs(prev => [newLog, ...prev]);
    saveCloudDoc('warehouse_logs', newLog.id, newLog);
    onLogActivity(currentUser.name, currentUser.role, `Mencatat log gudang: ${type} - ${itemName} sebanyak ${qty} Unit`);
    
    // Auto-update asset status & location if matched
    if (assetCodeInput) {
      const trimmedCode = assetCodeInput.trim().toUpperCase();
      const matched = localAssets.find(a => a.code.toUpperCase() === trimmedCode);
      if (matched) {
        let newLocation = matched.location;
        let newCondition = matched.condition;

        if (type === 'Servis Keluar') {
          newLocation = 'Divisi SERVICE (Sedang Diperbaiki)';
          newCondition = 'Rusak Ringan';
        } else if (type === 'Servis Masuk') {
          newLocation = 'Gudang Utama RIZ';
          newCondition = 'Baik';
        }

        const updated = localAssets.map(a => {
          if (a.id === matched.id) {
            return {
              ...a,
              location: newLocation,
              condition: newCondition
            };
          }
          return a;
        });

        setLocalAssets(updated);
        localStorage.setItem('riz_assets', JSON.stringify(updated));

        if (onUpdateAssetLocation) onUpdateAssetLocation(matched.id, newLocation);
        if (onUpdateAssetCondition) onUpdateAssetCondition(matched.id, newCondition);
      }
    }

    // Reset Form
    setItemName('');
    setQty(1);
    setNotes('');
    setAssetCodeInput('');
    setScannedPhoto('');
    setShowLogForm(false);
  };

  // Asset scanning with camera / input
  const handleSimulateQRScan = (codeToScan?: string) => {
    const targetCode = (codeToScan || scanSearchInput || '').trim();
    if (!targetCode) {
      alert('Silakan ketik kode asset atau pilih dari daftar asset!');
      return;
    }
    setIsScanningSimulated(true);
    setScanMessage('Mengaktifkan kamera scanner...');
    setScannedAsset(null);

    setTimeout(() => {
      setScanMessage('Mencari barcode/QR...');
      setTimeout(() => {
        const found = localAssets.find(a => 
          a.code.toLowerCase() === targetCode.toLowerCase() ||
          a.serialNumber.toLowerCase() === targetCode.toLowerCase() ||
          a.name.toLowerCase().includes(targetCode.toLowerCase())
        );

        if (found) {
          setScannedAsset(found);
          setScanMessage('SUKSES: Asset Berhasil Dikenali!');
          onLogActivity(currentUser.name, currentUser.role, `Melakukan scan barcode asset: ${found.code} (${found.name})`);
        } else {
          setScanMessage('ERROR: Barcode / Kode Asset tidak ditemukan di database.');
        }
        setIsScanningSimulated(false);
      }, 1000);
    }, 800);
  };

  // Update Asset from Gudang page
  const handleGudangUpdateAsset = (newLoc: string, newCond: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => {
    if (!scannedAsset) return;

    const updated = localAssets.map(a => {
      if (a.id === scannedAsset.id) {
        return {
          ...a,
          location: newLoc,
          condition: newCond
        };
      }
      return a;
    });

    setLocalAssets(updated);
    localStorage.setItem('riz_assets', JSON.stringify(updated));

    // Propagate up if prop handler is provided
    if (onUpdateAssetLocation) onUpdateAssetLocation(scannedAsset.id, newLoc);
    if (onUpdateAssetCondition) onUpdateAssetCondition(scannedAsset.id, newCond);

    onLogActivity(currentUser.name, currentUser.role, `Gudang mengupdate lokasi asset ${scannedAsset.code} menjadi [${newLoc}] & kondisi [${newCond}]`);
    
    // Refresh scanned asset in display
    setScannedAsset({
      ...scannedAsset,
      location: newLoc,
      condition: newCond
    });

    alert('Data lokasi & kondisi aset berhasil diperbarui di sistem!');
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Manajemen Logistik Gudang</h1>
          <p className="text-xs text-slate-500">
            Pencatatan alur logistik logistik barang masuk, barang keluar, loading dan unloading, serta scan barcode/QR asset terpadu.
          </p>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start">
          <button
            onClick={() => setWarehouseSubTab('logs')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              warehouseSubTab === 'logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Aktivitas Log Gudang
          </button>
          
          <button
            onClick={() => {
              setWarehouseSubTab('scanner');
              setScanMessage('');
              setScannedAsset(null);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              warehouseSubTab === 'scanner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Scan Asset (Barcode/QR)
          </button>
        </div>
      </div>

      {/* VIEW 1: WAREHOUSE ACTIVITY LOGS */}
      {warehouseSubTab === 'logs' && (
        <div className="space-y-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Barang Masuk</div>
              <div className="font-extrabold text-xl text-slate-800 mt-1">
                {warehouseLogs.filter(l => l.type === 'Masuk').reduce((acc, curr) => acc + curr.qty, 0)} Unit
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Barang Keluar</div>
              <div className="font-extrabold text-xl text-slate-800 mt-1">
                {warehouseLogs.filter(l => l.type === 'Keluar').reduce((acc, curr) => acc + curr.qty, 0)} Unit
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Loading (Out)</div>
              <div className="font-extrabold text-xl text-slate-800 mt-1">
                {warehouseLogs.filter(l => l.type === 'Loading').length} Event
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Unloading (In)</div>
              <div className="font-extrabold text-xl text-slate-800 mt-1">
                {warehouseLogs.filter(l => l.type === 'Unloading').length} Event
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center border-l-4 border-l-rose-500">
              <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                <Wrench className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Sedang Servis</div>
              <div className="font-extrabold text-xl text-slate-800 mt-1">
                {localAssets.filter(a => a.location === 'Divisi SERVICE (Sedang Diperbaiki)').length} Unit
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm text-center border-l-4 border-l-teal-500">
              <div className="mx-auto w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Selesai Servis</div>
              <div className="font-extrabold text-xl text-slate-800 mt-1">
                {warehouseLogs.filter(l => l.type === 'Servis Masuk').reduce((acc, curr) => acc + curr.qty, 0)} Unit
              </div>
            </div>
          </div>

          {/* 2-Column Grid for Warehouse Logs and Service Division Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Warehouse Logs History & Form (col-span 2) */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Action Row */}
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-xs font-bold text-slate-700">Histori & Pencatatan Logistik Gudang</span>
                <button
                  type="button"
                  onClick={() => setShowLogForm(!showLogForm)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showLogForm ? 'Tutup Formulir' : 'Catat Aktivitas Gudang'}</span>
                </button>
              </div>

              {/* Warehouse log Form */}
              {showLogForm && (
                <form onSubmit={handleAddWarehouseLog} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
                  <div className="flex items-center gap-2 pb-3 border-b">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-800">Formulir Logistik Gudang Baru</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Tipe Transaksi Gudang
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                      >
                        <option value="Masuk">Barang Masuk (Incoming)</option>
                        <option value="Keluar">Barang Keluar (Outgoing)</option>
                        <option value="Loading">Loading (Muat Barang Ke Truk)</option>
                        <option value="Unloading">Unloading (Bongkar Barang Gudang)</option>
                        <option value="Servis Keluar">Servis Keluar (Kirim ke Divisi SERVICE)</option>
                        <option value="Servis Masuk">Servis Masuk (Selesai Servis dari Divisi SERVICE)</option>
                      </select>
                    </div>

                    {/* Qty */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Jumlah Barang (QTY)
                      </label>
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        min={1}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                        required
                      />
                    </div>

                    {/* Item Name */}
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Nama Barang / Rincian Logistik
                      </label>
                      <input
                        type="text"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="e.g. Digital Mixer CL5 atau Kabel XLR Pack 20 Unit"
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                        required
                      />
                    </div>

                    {/* Optional linked Asset code */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Kode Asset Terkait <span className="text-slate-400 font-normal">(Opsional)</span>
                      </label>
                      <input
                        type="text"
                        value={assetCodeInput}
                        onChange={(e) => setAssetCodeInput(e.target.value)}
                        placeholder="e.g. AST-AUD-001"
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                      />
                    </div>

                    {/* PIC */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Penanggung Jawab (PIC)
                      </label>
                      <input
                        type="text"
                        value={picName}
                        onChange={(e) => setPicName(e.target.value)}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                        required
                      />
                    </div>

                    {/* Notes */}
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Catatan Detail Logistik
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Sebutkan detail, e.g. kondisi barang saat diturunkan, nomor truk pengiriman, atau detail job event..."
                        rows={2}
                        className="block w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t">
                    <button
                      type="button"
                      onClick={() => setShowLogForm(false)}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                    >
                      Simpan Transaksi Gudang
                    </button>
                  </div>
                </form>
              )}

              {/* Logs History Table */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold text-[10px]">
                      <tr>
                        <th scope="col" className="px-6 py-3">Tanggal</th>
                        <th scope="col" className="px-6 py-3">Tipe</th>
                        <th scope="col" className="px-6 py-3">Nama Barang</th>
                        <th scope="col" className="px-6 py-3 text-center">QTY</th>
                        <th scope="col" className="px-6 py-3">Asset Terkait</th>
                        <th scope="col" className="px-6 py-3">PIC Gudang</th>
                        <th scope="col" className="px-6 py-3">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                      {warehouseLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono">{log.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase ${
                              log.type === 'Masuk' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              log.type === 'Keluar' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                              log.type === 'Loading' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              log.type === 'Unloading' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              log.type === 'Servis Keluar' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              'bg-teal-50 text-teal-700 border border-teal-200'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{log.itemName}</td>
                          <td className="px-6 py-4 text-center font-bold">{log.qty} Unit</td>
                          <td className="px-6 py-4 font-mono text-slate-500">{log.assetCode || '-'}</td>
                          <td className="px-6 py-4 font-medium">{log.pic}</td>
                          <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={log.notes}>{log.notes}</td>
                        </tr>
                      ))}
                      {warehouseLogs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            Belum ada aktivitas gudang yang tercatat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Active Service Division Monitoring Sidebar (col-span 1) */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-rose-600 animate-pulse" />
                    <span className="font-bold text-sm text-slate-800">Monitor Servis Aktif</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-mono text-[10px] font-bold rounded-full border border-rose-150">
                    {localAssets.filter(a => a.location === 'Divisi SERVICE (Sedang Diperbaiki)').length} Unit
                  </span>
                </div>

                {localAssets.filter(a => a.location === 'Divisi SERVICE (Sedang Diperbaiki)').length === 0 ? (
                  <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-500">Semua Aset Kondisi Baik</p>
                    <p className="text-[10px] text-slate-400 mt-1">Tidak ada peralatan yang sedang berada di divisi service saat ini.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    {localAssets.filter(a => a.location === 'Divisi SERVICE (Sedang Diperbaiki)').map(item => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">{item.code}</span>
                            <span className="font-semibold text-xs text-slate-800">{item.name}</span>
                          </div>
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase bg-rose-50 text-rose-700 border border-rose-100">
                            {item.condition}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 pt-2 border-t border-slate-100">
                          <span>Divisi: <strong className="text-slate-600">{item.division}</strong></span>
                          <span>Lokasi: <strong className="text-rose-600">SERVICE</strong></span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            // Update asset location back to Warehouse
                            const newLoc = 'Gudang Utama RIZ';
                            const newCond = 'Baik';
                            
                            const updated = localAssets.map(a => {
                              if (a.id === item.id) {
                                return {
                                  ...a,
                                  location: newLoc,
                                  condition: newCond
                                };
                              }
                              return a;
                            });

                            setLocalAssets(updated);
                            localStorage.setItem('riz_assets', JSON.stringify(updated));

                            // Propagate if handlers exist
                            if (onUpdateAssetLocation) onUpdateAssetLocation(item.id, newLoc);
                            if (onUpdateAssetCondition) onUpdateAssetCondition(item.id, newCond);

                            // Create finished service log
                            const newLog: WarehouseLog = {
                              id: 'wl-' + Date.now(),
                              type: 'Servis Masuk',
                              date: new Date().toISOString().split('T')[0],
                              itemName: item.name,
                              qty: 1,
                              pic: currentUser.name,
                              notes: `Selesai diperbaiki oleh divisi SERVICE, dikembalikan ke Gudang Utama RIZ.`,
                              assetCode: item.code
                            };
                            const nextLogs = [newLog, ...warehouseLogs];
                            setWarehouseLogs(nextLogs);
                            localStorage.setItem('riz_warehouse_logs', JSON.stringify(nextLogs));

                            onLogActivity(currentUser.name, currentUser.role, `Gudang menerima kembali aset ${item.code} dari SERVICE (Kondisi: Baik)`);
                            alert(`Aset ${item.code} (${item.name}) telah selesai di-servis & dikembalikan ke Gudang!`);
                          }}
                          className="w-full mt-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Selesai Servis & Terima</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: BARCODE & QR SCANNER SIMULATOR FOR SCAN ASSET */}
      {warehouseSubTab === 'scanner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Scanning Box Control */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h3 className="font-bold text-slate-800 text-sm">Simulator Scanner Barcode / QR</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ketik kode aset atau pilih salah satu aset demo di bawah untuk mensimulasikan pemindaian kamera HP secara langsung.
                </p>
              </div>

              {/* Simulation scanner UI */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <input
                  type="text"
                  placeholder="e.g. AST-AUD-001 atau AST-LGT-001"
                  value={scanSearchInput}
                  onChange={(e) => setScanSearchInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-xs font-mono uppercase bg-white text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={() => handleSimulateQRScan()}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Pindai Barcode (Scan)
                </button>
              </div>

              {/* Scanner log message */}
              {scanMessage && (
                <div className={`p-3 rounded-lg text-xs font-mono ${
                  scanMessage.includes('SUKSES') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  scanMessage.includes('ERROR') ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                  'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}>
                  {scanMessage}
                </div>
              )}

              {/* Quick Scan Suggestions List */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Daftar Barcode Aset Gudang</span>
                <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {localAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        setScanSearchInput(asset.code);
                        handleSimulateQRScan(asset.code);
                      }}
                      className="p-2 border border-slate-100 rounded bg-slate-50/50 hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left text-xs font-sans flex justify-between items-center cursor-pointer"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{asset.code}</div>
                      </div>
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono uppercase">{asset.condition}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Asset Info display & Edit location/condition */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col justify-between">
              
              {scannedAsset ? (
                <div className="space-y-6">
                  {/* Scanned Header */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-emerald-600 font-mono">ASSET SCAN TERKONFIRMASI</div>
                        <h2 className="text-base font-bold text-slate-800">{scannedAsset.name}</h2>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                      {scannedAsset.code}
                    </span>
                  </div>

                  {/* Info table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Merek / Brand:</span>
                      <span className="text-slate-800 font-bold">{scannedAsset.brand}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Serial Number:</span>
                      <span className="text-slate-800 font-mono font-bold">{scannedAsset.serialNumber}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Divisi Pemilik:</span>
                      <span className="text-slate-800 font-bold">{scannedAsset.division} Division</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold block">Lokasi Penyimpanan Saat Ini:</span>
                      <span className="text-slate-800 font-bold">{scannedAsset.location}</span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-slate-400 font-semibold block">Kondisi Asset Saat Ini:</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold mt-1 text-[10px] uppercase ${
                        scannedAsset.condition === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                        scannedAsset.condition === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {scannedAsset.condition}
                      </span>
                    </div>
                  </div>

                  {/* Live edit area */}
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">UPDATE LOGISTIK BARANG (SCAN UPDATE)</h3>
                    
                    {/* Interactive inline editing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Ubah Lokasi Penyimpanan / Event
                        </label>
                        <select
                          id="scanner-location-select"
                          defaultValue={scannedAsset.location}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                        >
                          <option value="Gudang Utama A">Gudang Utama A</option>
                          <option value="Gudang Utama B">Gudang Utama B</option>
                          <option value="Gudang Utama C">Gudang Utama C</option>
                          <option value="Divisi SERVICE (Sedang Diperbaiki)">Divisi SERVICE (Sedang Diperbaiki)</option>
                          <option value="Event Stage Hall A">Event Stage Hall A</option>
                          <option value="Event Stage Ritz-Carlton">Event Stage Ritz-Carlton</option>
                        </select>
                      </div>

                      {/* Condition selector */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                          Ubah Status Kondisi Aset
                        </label>
                        <select
                          id="scanner-condition-select"
                          defaultValue={scannedAsset.condition}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-700"
                        >
                          <option value="Baik">Baik (Siap Pakai)</option>
                          <option value="Rusak Ringan">Rusak Ringan (Perlu Servis)</option>
                          <option value="Rusak Berat">Rusak Berat (Mati Total)</option>
                        </select>
                      </div>
                    </div>

                    {/* Quick Service shortcuts */}
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-indigo-900 block">⚡ Pintasan Logistik SERVICE</span>
                        <span className="text-slate-500 text-[11px]">Kirim barang ini ke Divisi Service atau terima kembali ke Gudang dengan satu klik.</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleGudangUpdateAsset('Divisi SERVICE (Sedang Diperbaiki)', 'Rusak Ringan');
                            const newLog: WarehouseLog = {
                              id: 'wl-' + Date.now(),
                              type: 'Servis Keluar',
                              date: new Date().toISOString().split('T')[0],
                              itemName: scannedAsset.name,
                              qty: 1,
                              pic: currentUser.name,
                              notes: `Kirim barang ke divisi SERVICE untuk perbaikan via scanner.`,
                              assetCode: scannedAsset.code
                            };
                            setWarehouseLogs(prev => [newLog, ...prev]);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px] uppercase transition-all cursor-pointer shadow-sm"
                        >
                          Kirim ke SERVICE
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleGudangUpdateAsset('Gudang Utama RIZ', 'Baik');
                            const newLog: WarehouseLog = {
                              id: 'wl-' + Date.now(),
                              type: 'Servis Masuk',
                              date: new Date().toISOString().split('T')[0],
                              itemName: scannedAsset.name,
                              qty: 1,
                              pic: currentUser.name,
                              notes: `Barang telah selesai diperbaiki oleh divisi SERVICE, kembali ke gudang via scanner.`,
                              assetCode: scannedAsset.code
                            };
                            setWarehouseLogs(prev => [newLog, ...prev]);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] uppercase transition-all cursor-pointer shadow-sm"
                        >
                          Terima dari SERVICE
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const locVal = (document.getElementById('scanner-location-select') as HTMLSelectElement).value;
                        const condVal = (document.getElementById('scanner-condition-select') as HTMLSelectElement).value as any;
                        handleGudangUpdateAsset(locVal, condVal);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded transition-colors cursor-pointer"
                    >
                      SIMPAN PERUBAHAN DATA ASSET
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <Database className="w-16 h-16 text-slate-200 mx-auto animate-bounce" />
                  <div>
                    <h3 className="font-bold text-slate-700 text-sm">Menunggu Scan Barcode</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Silakan pilih aset demo atau gunakan form scan di sebelah kiri untuk menampilkan detail data alat. Anda dapat merubah lokasi penyimpanan serta kondisi aset setelah scan dikonfirmasi.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

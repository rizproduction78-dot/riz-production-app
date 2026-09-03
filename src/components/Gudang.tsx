import React, { useState, useEffect } from 'react';
import { Staff, Asset, WarehouseLog, FleetAssignment, P2HChecklist, FleetBudgetRAB } from '../types';
import { INITIAL_ASSETS } from '../data';
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Truck,
  Database,
  Search,
  Plus,
  Camera,
  CheckCircle,
  FileText,
  Smartphone,
  RefreshCw,
  Layers,
  Wrench,
  ShieldCheck,
  DollarSign,
  UserCheck,
  CheckSquare,
  AlertOctagon,
  Clock,
  Printer,
  Trash2,
  X
} from 'lucide-react';
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

  // Fleet Assignments State (Tata Kelola Armada Tri-Party)
  const [fleetAssignments, setFleetAssignments] = useState<FleetAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_assignments');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
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

  // Tab views within warehouse: 'logs' | 'scanner' | 'armada_governance'
  const [warehouseSubTab, setWarehouseSubTab] = useState<'logs' | 'scanner' | 'armada_governance'>('logs');

  // New action form state
  const [showLogForm, setShowLogForm] = useState(false);
  const [type, setType] = useState<'Masuk' | 'Keluar' | 'Loading' | 'Unloading' | 'Servis Keluar' | 'Servis Masuk'>('Masuk');
  const [itemName, setItemName] = useState('');
  const [qty, setQty] = useState(1);
  const [picName, setPicName] = useState(currentUser.name);
  const [notes, setNotes] = useState('');
  const [assetCodeInput, setAssetCodeInput] = useState('');
  const [scannedPhoto, setScannedPhoto] = useState('');

  // Fleet Governance Form & Modal State
  const [showNewFleetModal, setShowNewFleetModal] = useState(false);
  const [showP2HModal, setShowP2HModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<FleetAssignment | null>(null);

  // Caca's New SPJ / RAB Form
  const [newFleetData, setNewFleetData] = useState<Partial<FleetAssignment>>({
    vehicleType: 'Truk CDD Long Box',
    policeNumber: '',
    driverName: '',
    destination: '',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    budget: {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      totalRAB: 0,
      receiptVerified: false,
      calculatedBy: currentUser.name === 'Caca' ? 'Caca' : currentUser.name
    }
  });

  // Agus's P2H Form
  const [p2hData, setP2HData] = useState<P2HChecklist>({
    banPsi: true,
    oliMesin: true,
    rem: true,
    kelistrikanLampu: true,
    radiatorCoolant: true,
    ratchetLashingStrap: true,
    legalitasSurat: true,
    notes: '',
    inspector: currentUser.name === 'Agus' ? 'Agus' : currentUser.name
  });

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

  // Fleet Subscription
  useEffect(() => {
    const unsub = subscribeCloudCollection<FleetAssignment>(
      'fleet_assignments',
      'riz_fleet_assignments',
      setFleetAssignments,
      []
    );
    return () => unsub();
  }, []);

  const saveFleetAssignments = (updated: FleetAssignment[]) => {
    setFleetAssignments(updated);
    localStorage.setItem('riz_fleet_assignments', JSON.stringify(updated));
  };

  const handleCreateFleetAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFleetData.policeNumber || !newFleetData.driverName || !newFleetData.destination) {
      alert('Lengkapi Plat Nomor, Nama Pengemudi, dan Lokasi Tujuan!');
      return;
    }

    const b = newFleetData.budget || {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      totalRAB: 0,
      receiptVerified: false,
      calculatedBy: 'Caca'
    };
    const totalRAB = Number(b.sewaVendor || 0) + Number(b.bbmSolar || 0) + Number(b.eToll || 0) + Number(b.uangMakanDriver || 0);

    const newAssignment: FleetAssignment = {
      id: 'fleet-' + Date.now(),
      spjNumber: `SPJ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleType: newFleetData.vehicleType || 'Truk CDD Long Box',
      policeNumber: newFleetData.policeNumber.toUpperCase().trim(),
      driverName: newFleetData.driverName.trim(),
      destination: newFleetData.destination.trim(),
      departureDate: newFleetData.departureDate || new Date().toISOString().split('T')[0],
      returnDate: newFleetData.returnDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      p2hStatus: 'Pending',
      p2h: {
        banPsi: false,
        oliMesin: false,
        rem: false,
        kelistrikanLampu: false,
        radiatorCoolant: false,
        ratchetLashingStrap: false,
        legalitasSurat: false,
        notes: 'Belum dilakukan pemeriksaan fisik pra-keberangkatan oleh Agus (Supervisor).',
        inspector: 'Agus'
      },
      budget: {
        ...b,
        totalRAB,
        calculatedBy: 'Caca (Admin & Logistik)'
      },
      approvalStatus: 'Menunggu Approval Fahrul',
      status: 'Dijadwalkan'
    };

    const updated = [newAssignment, ...fleetAssignments];
    saveFleetAssignments(updated);
    saveCloudDoc('fleet_assignments', newAssignment.id, newAssignment);
    onLogActivity(currentUser.name, currentUser.role, `Caca menerbitkan SPJ baru [${newAssignment.spjNumber}] ke ${newAssignment.destination} (RAB: Rp ${totalRAB.toLocaleString('id-ID')})`);
    
    setShowNewFleetModal(false);
    setNewFleetData({
      vehicleType: 'Truk CDD Long Box',
      policeNumber: '',
      driverName: '',
      destination: '',
      departureDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      budget: {
        sewaVendor: 0,
        bbmSolar: 0,
        eToll: 0,
        uangMakanDriver: 0,
        totalRAB: 0,
        receiptVerified: false,
        calculatedBy: 'Caca'
      }
    });
  };

  const handleSaveP2HInspection = () => {
    if (!selectedFleet) return;
    const isAllPassed = p2hData.banPsi && p2hData.oliMesin && p2hData.rem &&
      p2hData.kelistrikanLampu && p2hData.radiatorCoolant && p2hData.ratchetLashingStrap && p2hData.legalitasSurat;

    const p2hStatus = isAllPassed ? 'Passed' : 'Failed';
    const updated = fleetAssignments.map(f => {
      if (f.id === selectedFleet.id) {
        return {
          ...f,
          p2hStatus: p2hStatus as any,
          p2h: {
            ...p2hData,
            inspector: 'Agus (Supervisor Teknis)',
            inspectedAt: new Date().toLocaleString('id-ID')
          }
        };
      }
      return f;
    });

    saveFleetAssignments(updated);
    saveCloudDoc('fleet_assignments', selectedFleet.id, updated.find(f => f.id === selectedFleet.id));
    onLogActivity(currentUser.name, currentUser.role, `Agus menyelesaikan inspeksi P2H 7-Item untuk SPJ [${selectedFleet.spjNumber}] dengan hasil: ${isAllPassed ? 'LULUS / LAIK JALAN' : 'TIDAK LULUS'}`);
    setShowP2HModal(false);
    setSelectedFleet(null);
  };

  const handleApprovalFahrul = (fleetId: string, isApproved: boolean) => {
    const updated = fleetAssignments.map(f => {
      if (f.id === fleetId) {
        return {
          ...f,
          approvalStatus: (isApproved ? 'Approved' : 'Rejected') as any,
          approvedBy: 'Fahrul (Manager Operasional)',
          approvedAt: new Date().toLocaleString('id-ID'),
          status: (isApproved ? 'Dijadwalkan' : 'Dibatalkan') as any
        };
      }
      return f;
    });

    saveFleetAssignments(updated);
    saveCloudDoc('fleet_assignments', fleetId, updated.find(f => f.id === fleetId));
    onLogActivity(currentUser.name, currentUser.role, `Fahrul menetapkan keputusan ${isApproved ? 'APPROVAL (SETUJU)' : 'REJECT (TOLAK)'} untuk penugasan armada SPJ ID [${fleetId}]`);
    setShowApprovalModal(false);
    setSelectedFleet(null);
  };

  const handleDeleteFleetAssignment = (id: string) => {
    if (confirm('Hapus penugasan armada ini dari sistem?')) {
      const updated = fleetAssignments.filter(f => f.id !== id);
      saveFleetAssignments(updated);
    }
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

    if (onUpdateAssetLocation) onUpdateAssetLocation(scannedAsset.id, newLoc);
    if (onUpdateAssetCondition) onUpdateAssetCondition(scannedAsset.id, newCond);

    onLogActivity(currentUser.name, currentUser.role, `Gudang mengupdate lokasi asset ${scannedAsset.code} menjadi [${newLoc}] & kondisi [${newCond}]`);
    
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
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Manajemen Logistik & Gudang</h1>
          <p className="text-xs text-slate-500">
            Pencatatan alur logistik barang masuk/keluar, scan barcode/QR asset, dan tata kelola armada serta biaya sewa operasional.
          </p>
        </div>

        {/* Action Toggle Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start">
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

          <button
            onClick={() => setWarehouseSubTab('armada_governance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              warehouseSubTab === 'armada_governance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Tata Kelola Armada & Biaya Sewa</span>
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

      {/* VIEW 3: TATA KELOLA PENGGUNAAN KENDARAAN & BIAYA SEWA ANGKUT LOGISTIK (TRI-PARTY GOVERNANCE) */}
      {warehouseSubTab === 'armada_governance' && (
        <div className="space-y-6">
          {/* Tri-Party Governance Structure Banners */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role 1: Fahrul */}
            <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-700/50 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded">
                  Otorisasi Akhir
                </span>
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-base font-black">Fahrul</h2>
              <p className="text-xs text-indigo-200 font-semibold">Manager Operasional</p>
              <ul className="text-[11px] text-slate-300 space-y-1 pt-2 border-t border-indigo-800/60">
                <li>• Otorisasi dan persetujuan akhir (*approval*) penugasan armada.</li>
                <li>• Keputusan anggaran sewa vendor eksternal & batas toleransi BBM / uang jalan.</li>
              </ul>
            </div>

            {/* Role 2: Agus */}
            <div className="p-5 bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl border border-blue-700/50 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded">
                  Inspeksi Kelaikan P2H
                </span>
                <CheckSquare className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-base font-black">Agus</h2>
              <p className="text-xs text-blue-200 font-semibold">Supervisor Teknis</p>
              <ul className="text-[11px] text-slate-300 space-y-1 pt-2 border-t border-blue-800/60">
                <li>• Pemeriksaan 7 Item Vital P2H: Ban 105 PSI, Oli, Rem, Kelistrikan, Radiator, Lashing Strap, Surat STNK/KIR/SIM.</li>
                <li>• Koordinasi pengemudi (*driver*) & kru loading di lapangan.</li>
              </ul>
            </div>

            {/* Role 3: Caca */}
            <div className="p-5 bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-2xl border border-emerald-700/50 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded">
                  Penyusunan SPJ & RAB
                </span>
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-base font-black">Caca</h2>
              <p className="text-xs text-emerald-200 font-semibold">Admin & Logistik</p>
              <ul className="text-[11px] text-slate-300 space-y-1 pt-2 border-t border-emerald-800/60">
                <li>• Penyusunan jadwal keberangkatan & penerbitan SPJ (Surat Perintah Jalan).</li>
                <li>• Kalkulasi RAB sewa vendor, BBM, e-Toll, uang makan & verifikasi kuitansi.</li>
              </ul>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-wrap text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Armada Ditugaskan</span>
                <span className="font-extrabold text-base text-slate-900">{fleetAssignments.length} Penugasan</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Menunggu Approval Fahrul</span>
                <span className="font-extrabold text-base text-amber-600">
                  {fleetAssignments.filter(f => f.approvalStatus === 'Menunggu Approval Fahrul').length} SPJ
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lulus Uji P2H Agus</span>
                <span className="font-extrabold text-base text-emerald-600">
                  {fleetAssignments.filter(f => f.p2hStatus === 'Passed').length} Armada
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Anggaran RAB (Caca)</span>
                <span className="font-extrabold text-base text-indigo-700 font-mono">
                  Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.totalRAB || 0), 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowNewFleetModal(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Terbitkan SPJ & Hitung RAB (Caca)</span>
            </button>
          </div>

          {/* Table Fleet Assignments */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                    <th className="p-3.5">No. SPJ & Tanggal</th>
                    <th className="p-3.5">Jenis Armada & Plat</th>
                    <th className="p-3.5">Pengemudi (Driver)</th>
                    <th className="p-3.5">Tujuan Event</th>
                    <th className="p-3.5">Inspeksi P2H (Agus)</th>
                    <th className="p-3.5">RAB Logistik (Caca)</th>
                    <th className="p-3.5">Otorisasi (Fahrul)</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fleetAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Belum ada jadwal penugasan armada yang diterbitkan. Klik tombol <strong>"Terbitkan SPJ & Hitung RAB (Caca)"</strong> untuk memulai.
                      </td>
                    </tr>
                  ) : (
                    fleetAssignments.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/60">
                        <td className="p-3.5 font-mono">
                          <div className="font-bold text-slate-900">{f.spjNumber}</div>
                          <div className="text-[10px] text-slate-400">{f.departureDate} s/d {f.returnDate}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800">{f.vehicleType}</div>
                          <span className="font-mono text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {f.policeNumber}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-800">{f.driverName}</td>
                        <td className="p-3.5 font-semibold text-slate-700 max-w-xs">{f.destination}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            f.p2hStatus === 'Passed' ? 'bg-emerald-100 text-emerald-800' :
                            f.p2hStatus === 'Failed' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {f.p2hStatus === 'Passed' ? '✓ Lulus 7-P2H' : f.p2hStatus === 'Failed' ? '✕ Tidak Lulus' : '⏳ Belum P2H'}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono">
                          <div className="font-black text-indigo-700 text-xs">
                            Rp {(f.budget?.totalRAB || 0).toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Sewa: Rp {(f.budget?.sewaVendor || 0).toLocaleString('id-ID')} | BBM: Rp {(f.budget?.bbmSolar || 0).toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            f.approvalStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            f.approvalStatus === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {f.approvalStatus}
                          </span>
                          {f.approvedBy && (
                            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Oleh: {f.approvedBy}</div>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-1.5">
                          <button
                            onClick={() => {
                              setSelectedFleet(f);
                              setP2HData(f.p2h || {
                                banPsi: true,
                                oliMesin: true,
                                rem: true,
                                kelistrikanLampu: true,
                                radiatorCoolant: true,
                                ratchetLashingStrap: true,
                                legalitasSurat: true,
                                notes: '',
                                inspector: 'Agus'
                              });
                              setShowP2HModal(true);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            title="Inspeksi P2H Agus"
                          >
                            <CheckSquare className="w-3 h-3" /> P2H Agus
                          </button>

                          <button
                            onClick={() => {
                              setSelectedFleet(f);
                              setShowApprovalModal(true);
                            }}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                            title="Otorisasi Fahrul"
                          >
                            <ShieldCheck className="w-3 h-3" /> Otorisasi Fahrul
                          </button>

                          <button
                            onClick={() => handleDeleteFleetAssignment(f.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                            title="Hapus SPJ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TERBITKAN SPJ & KALKULASI RAB (CACA) */}
      {showNewFleetModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Penerbitan SPJ & Rencana Anggaran (RAB)</h3>
                <p className="text-[11px] text-slate-500 font-medium">Disusun & Dikelola oleh Caca (Admin & Logistik)</p>
              </div>
              <button onClick={() => setShowNewFleetModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFleetAssignment} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Armada *</label>
                  <select
                    value={newFleetData.vehicleType}
                    onChange={(e) => setNewFleetData({ ...newFleetData, vehicleType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Truk CDD Long Box">Truk CDD Long Box</option>
                    <option value="Truk Fuso 8 Meter">Truk Fuso 8 Meter</option>
                    <option value="Truk Tronton Box">Truk Tronton Box</option>
                    <option value="Blind Van Logistik">Blind Van Logistik</option>
                    <option value="GranMax Pickup Box">GranMax Pickup Box</option>
                    <option value="Armada Vendor Eksternal">Armada Vendor Eksternal</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Polisi (Plat) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: B 9123 KBC"
                    value={newFleetData.policeNumber}
                    onChange={(e) => setNewFleetData({ ...newFleetData, policeNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Pengemudi (Driver) *</label>
                  <input
                    type="text"
                    placeholder="Nama Driver"
                    value={newFleetData.driverName}
                    onChange={(e) => setNewFleetData({ ...newFleetData, driverName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lokasi Tujuan / Event *</label>
                  <input
                    type="text"
                    placeholder="Contoh: JCC Senayan Hall A"
                    value={newFleetData.destination}
                    onChange={(e) => setNewFleetData({ ...newFleetData, destination: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Berangkat</label>
                  <input
                    type="date"
                    value={newFleetData.departureDate}
                    onChange={(e) => setNewFleetData({ ...newFleetData, departureDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimasi Kembali</label>
                  <input
                    type="date"
                    value={newFleetData.returnDate}
                    onChange={(e) => setNewFleetData({ ...newFleetData, returnDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Kalkulasi RAB Logistik */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                <span className="font-black text-indigo-900 block text-xs uppercase tracking-wider">
                  💰 Kalkulasi Anggaran Biaya Logistik (RAB)
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Biaya Sewa Vendor (Rp)</label>
                    <input
                      type="number"
                      value={newFleetData.budget?.sewaVendor || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFleetData({
                          ...newFleetData,
                          budget: { ...newFleetData.budget!, sewaVendor: val }
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">BBM Solar / Bensin (Rp)</label>
                    <input
                      type="number"
                      value={newFleetData.budget?.bbmSolar || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFleetData({
                          ...newFleetData,
                          budget: { ...newFleetData.budget!, bbmSolar: val }
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">e-Toll Jalan Tol (Rp)</label>
                    <input
                      type="number"
                      value={newFleetData.budget?.eToll || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFleetData({
                          ...newFleetData,
                          budget: { ...newFleetData.budget!, eToll: val }
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Uang Makan Driver (Rp)</label>
                    <input
                      type="number"
                      value={newFleetData.budget?.uangMakanDriver || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFleetData({
                          ...newFleetData,
                          budget: { ...newFleetData.budget!, uangMakanDriver: val }
                        });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Total Rencana Anggaran (RAB):</span>
                  <span className="font-black text-indigo-900 font-mono text-sm">
                    Rp {(
                      Number(newFleetData.budget?.sewaVendor || 0) +
                      Number(newFleetData.budget?.bbmSolar || 0) +
                      Number(newFleetData.budget?.eToll || 0) +
                      Number(newFleetData.budget?.uangMakanDriver || 0)
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewFleetModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
                >
                  Terbitkan SPJ & Ajukan ke Fahrul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPEKSI KELAIKAN 7-ITEM P2H (AGUS) */}
      {showP2HModal && selectedFleet && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Pemeriksaan Pra-Harian (P2H)</h3>
                <p className="text-[11px] text-slate-500 font-medium">Inspektur: Agus (Supervisor Teknis)</p>
              </div>
              <button onClick={() => setShowP2HModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div><strong>Armada:</strong> {selectedFleet.vehicleType} ({selectedFleet.policeNumber})</div>
              <div><strong>Driver:</strong> {selectedFleet.driverName} | <strong>Tujuan:</strong> {selectedFleet.destination}</div>
            </div>

            <div className="space-y-2.5 text-xs font-sans">
              <span className="font-black text-slate-800 uppercase block tracking-wider text-[11px]">
                7 Item Vital Pemeriksaan Fisik:
              </span>

              {[
                { key: 'banPsi', label: '1. Tekanan & Kondisi Ban (Standar 105 PSI)' },
                { key: 'oliMesin', label: '2. Level & Kualitas Oli Mesin' },
                { key: 'rem', label: '3. Fungsi Sistem Pengereman (Minyak & Kampas)' },
                { key: 'kelistrikanLampu', label: '4. Sistem Kelistrikan & Lampu Utama/Sein' },
                { key: 'radiatorCoolant', label: '5. Level Air Radiator / Coolant Mesin' },
                { key: 'ratchetLashingStrap', label: '6. Pengikatan Muatan (Ratchet Lashing Strap)' },
                { key: 'legalitasSurat', label: '7. Kelengkapan Dokumen (STNK, Buku KIR, SIM Driver)' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={(p2hData as any)[item.key]}
                    onChange={(e) => setP2HData({ ...p2hData, [item.key]: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="font-semibold text-slate-800 text-xs">{item.label}</span>
                </label>
              ))}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Khusus Supervisor (Agus)</label>
                <textarea
                  rows={2}
                  placeholder="Catatan kondisi fisik ban, kelistrikan, muatan..."
                  value={p2hData.notes || ''}
                  onChange={(e) => setP2HData({ ...p2hData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowP2HModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveP2HInspection}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs"
              >
                Simpan Hasil Inspeksi P2H
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: OTORISASI & APPROVAL ANGGARAN (FAHRUL) */}
      {showApprovalModal && selectedFleet && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Otorisasi & Persetujuan Penugasan</h3>
                <p className="text-[11px] text-slate-500 font-medium">Pengambil Keputusan: Fahrul (Manager Operasional)</p>
              </div>
              <button onClick={() => setShowApprovalModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div><strong>No. SPJ:</strong> {selectedFleet.spjNumber}</div>
                <div><strong>Armada & Plat:</strong> {selectedFleet.vehicleType} ({selectedFleet.policeNumber})</div>
                <div><strong>Driver:</strong> {selectedFleet.driverName}</div>
                <div><strong>Destinasi:</strong> {selectedFleet.destination}</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-950 block">Status Kelaikan Fisik (P2H Agus):</span>
                <span className={`font-black ${selectedFleet.p2hStatus === 'Passed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {selectedFleet.p2hStatus === 'Passed' ? '✓ LULUS 7-Item Vital (Laik Jalan)' : '⏳ Belum / Tidak Lulus P2H'}
                </span>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                <span className="font-bold text-indigo-950 block">RAB Biaya Logistik (Caca):</span>
                <div className="flex justify-between">
                  <span>Biaya Sewa Vendor:</span>
                  <span className="font-mono font-bold">Rp {(selectedFleet.budget?.sewaVendor || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>BBM Solar / Bensin:</span>
                  <span className="font-mono font-bold">Rp {(selectedFleet.budget?.bbmSolar || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>e-Toll & Uang Makan Driver:</span>
                  <span className="font-mono font-bold">
                    Rp {((selectedFleet.budget?.eToll || 0) + (selectedFleet.budget?.uangMakanDriver || 0)).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="pt-1 border-t border-indigo-200 flex justify-between font-black text-indigo-900 text-sm">
                  <span>Total Anggaran:</span>
                  <span className="font-mono">Rp {(selectedFleet.budget?.totalRAB || 0).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleApprovalFahrul(selectedFleet.id, false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
              >
                Tolak (Reject)
              </button>
              <button
                onClick={() => handleApprovalFahrul(selectedFleet.id, true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-xs"
              >
                Setujui (Approve SPJ)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

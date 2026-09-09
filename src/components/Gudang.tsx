import React, { useState, useEffect } from 'react';
import {
  Staff,
  Asset,
  WarehouseLog,
  FleetAssignment,
  P2HChecklist,
  FleetBudgetRAB,
  VehicleMaster,
  ManifestCargoItem,
  FleetDriver
} from '../types';
import { INITIAL_ASSETS, INITIAL_VEHICLES, INITIAL_FLEET_DRIVERS } from '../data';
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
  X,
  MapPin,
  Calendar,
  Navigation,
  FileSpreadsheet,
  Edit3,
  Edit2,
  AlertTriangle,
  FileCheck,
  Users,
  Phone
} from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc, pushCollectionToCloud, deleteCloudDoc } from '../lib/cloudSync';

interface GudangProps {
  currentUser: Staff;
  assets: Asset[];
  onUpdateAssetLocation?: (id: string, newLocation: string) => void;
  onUpdateAssetCondition?: (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => void;
  onAddFinding?: (finding: Omit<import('../types').Finding, 'id' | 'dateCreated'>) => void;
  onLogActivity: (username: string, role: string, action: string) => void;
  forceSubTab?: 'logs' | 'scanner' | 'armada_governance';
}

export default function Gudang({
  currentUser,
  assets,
  onUpdateAssetLocation,
  onUpdateAssetCondition,
  onAddFinding,
  onLogActivity,
  forceSubTab
}: GudangProps) {
  // Warehouse Logs State - Bersih dari data dummy
  const [warehouseLogs, setWarehouseLogs] = useState<WarehouseLog[]>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('riz_warehouse_logs');
        if (saved) {
          const parsed: WarehouseLog[] = JSON.parse(saved);
          const cleaned = parsed.filter(l => l.id !== 'wl-1' && l.id !== 'wl-2');
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('riz_warehouse_logs', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch (e) {}
    return [];
  });

  // Fleet Assignments State (Tata Kelola Armada Tri-Party)
  const [fleetAssignments, setFleetAssignments] = useState<FleetAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter(f => Boolean(f && typeof f === 'object' && (f.spjNumber || f.driverName)));
          return valid;
        }
      }
    } catch (e) {}
    return [];
  });

  // Master Vehicles State
  const [vehicles, setVehicles] = useState<VehicleMaster[]>(() => {
    try {
      const saved = localStorage.getItem('riz_master_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter(v => Boolean(v && typeof v === 'object' && (v.name || v.policeNumber)));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {}
    return INITIAL_VEHICLES;
  });

  // Assets database matching
  const [localAssets, setLocalAssets] = useState<Asset[]>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('riz_assets');
        if (saved) return JSON.parse(saved);
      }
    } catch (e) {}
    return INITIAL_ASSETS;
  });

  useEffect(() => {
    setLocalAssets(assets);
  }, [assets]);

  const isAdminDivision = true; // Allow viewing and managing fleet/armada

  // Tab views within warehouse: 'logs' | 'scanner' | 'armada_governance'
  const [warehouseSubTab, setWarehouseSubTab] = useState<'logs' | 'scanner' | 'armada_governance'>(() => {
    return forceSubTab || 'logs';
  });

  useEffect(() => {
    if (forceSubTab) {
      setWarehouseSubTab(forceSubTab);
    }
  }, [forceSubTab]);

  // Subtab inside Armada Governance: 'trips' | 'vehicles' | 'drivers' | 'costs'
  const [fleetSection, setFleetSection] = useState<'trips' | 'vehicles' | 'drivers' | 'costs'>('trips');

  // Master Driver Armada State in Gudang
  const [driverList, setDriverList] = useState<FleetDriver[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_drivers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap(item => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter(d => Boolean(d && typeof d === 'object' && d.name));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {}
    return INITIAL_FLEET_DRIVERS;
  });

  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<FleetDriver | null>(null);
  const [driverFormData, setDriverFormData] = useState<Partial<FleetDriver>>({
    name: '',
    phone: '',
    driverType: 'Internal',
    simType: 'SIM B1',
    simExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    idCardNumber: '',
    assignedVehicle: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    status: 'Siap Jalan',
    emergencyContact: '',
    address: '',
    notes: ''
  });

  const saveDriverList = async (updated: FleetDriver[], actionDoc?: { type: 'save' | 'delete', id: string, name?: string, doc?: FleetDriver }) => {
    setDriverList(updated);
    localStorage.setItem('riz_fleet_drivers', JSON.stringify(updated));
    pushCollectionToCloud('fleet_drivers', updated, currentUser.name);
    if (actionDoc) {
      if (actionDoc.type === 'save' && actionDoc.doc) {
        await saveCloudDoc('fleet_drivers', actionDoc.id, actionDoc.doc, currentUser.name);
      } else if (actionDoc.type === 'delete') {
        await deleteCloudDoc('fleet_drivers', actionDoc.id, actionDoc.name);
      }
    }
    onLogActivity(currentUser.name, currentUser.role, 'Gudang memperbarui master data driver armada');
  };

  const handleAddDriver = async () => {
    if (!driverFormData.name?.trim()) return;
    const newDrv: FleetDriver = {
      id: `drv-${Date.now()}`,
      name: driverFormData.name.trim(),
      phone: driverFormData.phone?.trim() || '',
      driverType: (driverFormData.driverType as any) || 'Internal',
      simType: (driverFormData.simType as any) || 'SIM B1',
      simExpiry: driverFormData.simExpiry || new Date().toISOString().split('T')[0],
      idCardNumber: driverFormData.idCardNumber?.trim() || '',
      assignedVehicle: driverFormData.assignedVehicle || '',
      status: (driverFormData.status as any) || 'Siap Jalan',
      emergencyContact: driverFormData.emergencyContact?.trim() || '',
      address: driverFormData.address?.trim() || '',
      notes: driverFormData.notes?.trim() || '',
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...driverList, newDrv];
    await saveDriverList(updated, { type: 'save', id: newDrv.id, doc: newDrv });
    setShowAddDriverModal(false);
  };

  const handleSaveEditDriver = async () => {
    if (!selectedDriver || !driverFormData.name?.trim()) return;
    let updatedDoc: FleetDriver | null = null;
    const updated = driverList.map(d => {
      if (d.id === selectedDriver.id) {
        updatedDoc = { ...d, ...driverFormData } as FleetDriver;
        return updatedDoc;
      }
      return d;
    });
    if (updatedDoc) {
      await saveDriverList(updated, { type: 'save', id: selectedDriver.id, doc: updatedDoc });
    } else {
      await saveDriverList(updated);
    }
    setShowEditDriverModal(false);
    setSelectedDriver(null);
  };

  const handleDeleteDriver = async (id: string) => {
    const target = driverList.find(d => d.id === id || d.name === id);
    const targetName = target?.name || id;
    const targetId = target?.id || id;
    if (confirm(`Yakin ingin menghapus data pengemudi (driver) "${targetName}" ini?`)) {
      const updated = driverList.filter(d => d.id !== targetId && d.name !== targetName);
      onLogActivity(currentUser.name, currentUser.role, `Gudang menghapus driver: ${targetName}`);
      try {
        await saveDriverList(updated, { type: 'delete', id: targetId, name: targetName });
        if (targetName && targetName !== targetId) {
          await deleteCloudDoc('fleet_drivers', targetName.toLowerCase().trim());
          await deleteCloudDoc('fleet_drivers', targetName.trim());
        }
      } catch (e) {
        console.warn('[Gudang] Background delete error:', e);
      }
    }
  };

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
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showSPJPrintModal, setShowSPJPrintModal] = useState(false);
  const [showCostRecapModal, setShowCostRecapModal] = useState(false);

  const [selectedFleet, setSelectedFleet] = useState<FleetAssignment | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleMaster | null>(null);

  // Manifest items in creation modal
  const [manifestItems, setManifestItems] = useState<ManifestCargoItem[]>([
    { id: 'm-1', division: 'Audio', itemDescription: 'Line Array Speaker & Power Rack', qty: 4, unit: 'Flightcase', estimatedCBM: 4.5 },
    { id: 'm-2', division: 'Lighting', itemDescription: 'Moving Head Beam & Par LED Case', qty: 6, unit: 'Flightcase', estimatedCBM: 3.8 }
  ]);
  const [newManifestDivision, setNewManifestDivision] = useState<'Audio' | 'Lighting' | 'Videotron' | 'Rigging' | 'Genset / Power' | 'Umum'>('Audio');
  const [newManifestDesc, setNewManifestDesc] = useState('');
  const [newManifestQty, setNewManifestQty] = useState(1);
  const [newManifestUnit, setNewManifestUnit] = useState<'Flightcase' | 'Pcs' | 'Pallet' | 'Roll' | 'Box'>('Flightcase');
  const [newManifestCBM, setNewManifestCBM] = useState(0.5);

  // Caca's New SPJ / RAB Form
  const [newFleetData, setNewFleetData] = useState<Partial<FleetAssignment>>({
    eventName: '',
    tripType: 'Dalam Kota (Jabodetabek)',
    vehicleType: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
    policeNumber: 'B 9142 SXZ',
    driverName: '',
    destination: '',
    departureDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    budget: {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      biayaBongkarMuat: 0,
      totalRAB: 0,
      receiptVerified: false,
      calculatedBy: currentUser.name === 'Caca' ? 'Caca' : currentUser.name
    }
  });

  // Vehicle Form Data
  const [vehicleFormData, setVehicleFormData] = useState<Partial<VehicleMaster>>({
    name: '',
    ownership: 'Internal',
    policeNumber: '',
    vehicleType: 'Truk Box CDD (6 Roda)',
    tonnageCapacity: 5.0,
    cbmCapacity: 22.0,
    odometerKM: 50000,
    stnkTaxExpiry: new Date().toISOString().split('T')[0],
    kirExpiry: new Date().toISOString().split('T')[0],
    status: 'Siap Operasi'
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
        // P1.1: Auto-create Finding jika kondisi berubah ke Rusak
        if (onAddFinding && (newCondition === 'Rusak Ringan' || newCondition === 'Rusak Berat')) {
          onAddFinding({
            equipment: matched.name + (matched.code ? ` (${matched.code})` : ''),
            issue: `Kondisi aset dilaporkan ${newCondition} oleh Divisi Gudang. Lokasi: ${newLocation}.`,
            priority: newCondition === 'Rusak Berat' ? 'Tinggi' : 'Sedang',
            pic: currentUser.name,
            targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'Open'
          });
        }
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

  // Fleet, Drivers, and Vehicles Subscriptions
  useEffect(() => {
    const unsubAssignments = subscribeCloudCollection<FleetAssignment>(
      'fleet_assignments',
      'riz_fleet_assignments',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((f): f is FleetAssignment => Boolean(f && typeof f === 'object' && (f.spjNumber || f.driverName)));
        setFleetAssignments(valid);
      },
      []
    );
    const unsubVehicles = subscribeCloudCollection<VehicleMaster>(
      'master_vehicles',
      'riz_master_vehicles',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((v): v is VehicleMaster => Boolean(v && typeof v === 'object' && (v.name || v.policeNumber)));
        setVehicles(valid.length > 0 ? valid : INITIAL_VEHICLES);
      },
      INITIAL_VEHICLES
    );
    const unsubDrivers = subscribeCloudCollection<FleetDriver>(
      'fleet_drivers',
      'riz_fleet_drivers',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((d): d is FleetDriver => Boolean(d && typeof d === 'object' && d.name));
        setDriverList(valid);
      },
      INITIAL_FLEET_DRIVERS
    );

    return () => {
      unsubAssignments();
      unsubVehicles();
      unsubDrivers();
    };
  }, []);

  const saveFleetAssignments = (updated: FleetAssignment[]) => {
    setFleetAssignments(updated);
    localStorage.setItem('riz_fleet_assignments', JSON.stringify(updated));
    pushCollectionToCloud('fleet_assignments', updated, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, 'Gudang memperbarui penugasan armada');
  };

  // Master Vehicles Subscription / Persistence
  const saveVehicles = (updated: VehicleMaster[]) => {
    setVehicles(updated);
    localStorage.setItem('riz_master_vehicles', JSON.stringify(updated));
    pushCollectionToCloud('master_vehicles', updated, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, 'Gudang memperbarui database kendaraan armada');
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleFormData.name || !vehicleFormData.policeNumber) {
      alert('Nama Armada dan Nomor Polisi wajib diisi!');
      return;
    }

    if (selectedVehicle) {
      // Edit
      const updated = vehicles.map(v => v.id === selectedVehicle.id ? { ...v, ...vehicleFormData } as VehicleMaster : v);
      saveVehicles(updated);
      onLogActivity(currentUser.name, currentUser.role, `Memperbarui data master armada: ${vehicleFormData.name} (${vehicleFormData.policeNumber})`);
    } else {
      // New
      const newVeh: VehicleMaster = {
        id: 'veh-' + Date.now(),
        name: vehicleFormData.name!,
        ownership: vehicleFormData.ownership || 'Internal',
        policeNumber: vehicleFormData.policeNumber!.toUpperCase().trim(),
        vehicleType: vehicleFormData.vehicleType || 'Truk Box CDD (6 Roda)',
        tonnageCapacity: Number(vehicleFormData.tonnageCapacity || 3.0),
        cbmCapacity: Number(vehicleFormData.cbmCapacity || 15.0),
        odometerKM: Number(vehicleFormData.odometerKM || 0),
        stnkTaxExpiry: vehicleFormData.stnkTaxExpiry || new Date().toISOString().split('T')[0],
        kirExpiry: vehicleFormData.kirExpiry || new Date().toISOString().split('T')[0],
        status: vehicleFormData.status || 'Siap Operasi'
      };
      const updated = [newVeh, ...vehicles];
      saveVehicles(updated);
      onLogActivity(currentUser.name, currentUser.role, `Menambahkan master armada baru: ${newVeh.name} (${newVeh.policeNumber})`);
    }

    setShowVehicleModal(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Hapus unit armada ini dari master database?')) {
      const updated = vehicles.filter(v => v.id !== id);
      saveVehicles(updated);
    }
  };

  const handleAddManifestItem = () => {
    if (!newManifestDesc.trim() || newManifestQty <= 0) {
      alert('Isi deskripsi muatan dan jumlah unit!');
      return;
    }
    const newItem: ManifestCargoItem = {
      id: 'm-' + Date.now(),
      division: newManifestDivision,
      itemDescription: newManifestDesc.trim(),
      qty: newManifestQty,
      unit: newManifestUnit,
      estimatedCBM: Number(newManifestCBM || 0.1)
    };
    setManifestItems([...manifestItems, newItem]);
    setNewManifestDesc('');
    setNewManifestQty(1);
    setNewManifestCBM(0.5);
  };

  const handleRemoveManifestItem = (id: string) => {
    setManifestItems(manifestItems.filter(m => m.id !== id));
  };

  const handleCreateFleetAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFleetData.policeNumber || !newFleetData.driverName || !newFleetData.destination || !newFleetData.eventName) {
      alert('Lengkapi Nama Event, Plat Nomor, Nama Pengemudi, dan Lokasi Tujuan!');
      return;
    }

    const b = newFleetData.budget || {
      sewaVendor: 0,
      bbmSolar: 0,
      eToll: 0,
      uangMakanDriver: 0,
      biayaBongkarMuat: 0,
      totalRAB: 0,
      receiptVerified: false,
      calculatedBy: 'Caca'
    };
    const totalRAB = Number(b.sewaVendor || 0) + Number(b.bbmSolar || 0) + Number(b.eToll || 0) + Number(b.uangMakanDriver || 0) + Number(b.biayaBongkarMuat || 0);
    const totalCBM = manifestItems.reduce((acc, m) => acc + (m.estimatedCBM * m.qty), 0);

    const newAssignment: FleetAssignment = {
      id: 'fleet-' + Date.now(),
      spjNumber: `SPJ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(1000 + Math.random() * 9000)}`,
      eventName: newFleetData.eventName || 'Event Produksi',
      tripType: newFleetData.tripType || 'Dalam Kota (Jabodetabek)',
      vehicleType: newFleetData.vehicleType || 'Truk Box Mitsubishi Canter CDD (6 Roda)',
      policeNumber: newFleetData.policeNumber.toUpperCase().trim(),
      driverName: newFleetData.driverName.trim(),
      destination: newFleetData.destination.trim(),
      departureDate: newFleetData.departureDate || new Date().toISOString().split('T')[0],
      returnDate: newFleetData.returnDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      manifest: [...manifestItems],
      totalCBM: Number(totalCBM.toFixed(2)),
      p2hStatus: 'Pending',
      p2h: {
        banPsi: false,
        oliMesin: false,
        rem: false,
        kelistrikanLampu: false,
        radiatorCoolant: false,
        ratchetLashingStrap: false,
        legalitasSurat: false,
        notes: 'Menunggu pemeriksaan kelaikan pra-keberangkatan oleh Agus (Supervisor).',
        inspector: 'Agus'
      },
      budget: {
        ...b,
        totalRAB,
        calculatedBy: 'Caca (Admin & Logistik)'
      },
      approvalStatus: 'Menunggu Approval Fahrul',
      status: 'Menunggu Approval Fahrul'
    };

    const updated = [newAssignment, ...fleetAssignments];
    saveFleetAssignments(updated);
    saveCloudDoc('fleet_assignments', newAssignment.id, newAssignment);
    onLogActivity(currentUser.name, currentUser.role, `Caca menerbitkan SPJ baru [${newAssignment.spjNumber}] untuk event "${newAssignment.eventName}" ke ${newAssignment.destination} (RAB: Rp ${totalRAB.toLocaleString('id-ID')}, Volume: ${newAssignment.totalCBM} CBM)`);
    
    setShowNewFleetModal(false);
    setNewFleetData({
      eventName: '',
      tripType: 'Dalam Kota (Jabodetabek)',
      vehicleType: 'Truk Box Mitsubishi Canter CDD (6 Roda)',
      policeNumber: 'B 9142 SXZ',
      driverName: '',
      destination: '',
      departureDate: new Date().toISOString().split('T')[0],
      returnDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      budget: {
        sewaVendor: 0,
        bbmSolar: 0,
        eToll: 0,
        uangMakanDriver: 0,
        biayaBongkarMuat: 0,
        totalRAB: 0,
        receiptVerified: false,
        calculatedBy: 'Caca'
      }
    });
  };

  const handleUpdateFleetStatus = (fleetId: string, newStatus: FleetAssignment['status']) => {
    const updated = fleetAssignments.map(f => {
      if (f.id === fleetId) {
        return {
          ...f,
          status: newStatus
        };
      }
      return f;
    });
    saveFleetAssignments(updated);
    saveCloudDoc('fleet_assignments', fleetId, updated.find(f => f.id === fleetId));
    onLogActivity(currentUser.name, currentUser.role, `Update status operasional SPJ ID [${fleetId}] menjadi: ${newStatus}`);
  };

  const handleSaveP2HInspection = () => {
    if (!selectedFleet) return;
    const isAllPassed = p2hData.banPsi && p2hData.oliMesin && p2hData.rem &&
      p2hData.kelistrikanLampu && p2hData.radiatorCoolant && p2hData.ratchetLashingStrap && p2hData.legalitasSurat;

    const p2hStatus: 'Laik Jalan' | 'Perlu Perbaikan' | 'Tidak Laik' = isAllPassed ? 'Laik Jalan' : (p2hData.rem && p2hData.banPsi ? 'Perlu Perbaikan' : 'Tidak Laik');

    const updated = fleetAssignments.map(f => {
      if (f.id === selectedFleet.id) {
        return {
          ...f,
          p2hStatus: p2hStatus,
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
    onLogActivity(currentUser.name, currentUser.role, `Agus menyelesaikan inspeksi P2H 7-Item untuk SPJ [${selectedFleet.spjNumber}] dengan status: ${p2hStatus}`);
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
    // P1.1: Auto-create Finding jika kondisi berubah ke Rusak (scanner path)
    if (onAddFinding && (newCond === 'Rusak Ringan' || newCond === 'Rusak Berat')) {
      onAddFinding({
        equipment: scannedAsset.name + (scannedAsset.code ? ` (${scannedAsset.code})` : ''),
        issue: `Kondisi aset dilaporkan ${newCond} via scanner Gudang. Lokasi: ${newLoc}.`,
        priority: newCond === 'Rusak Berat' ? 'Tinggi' : 'Sedang',
        pic: currentUser.name,
        targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Open'
      });
    }

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

          {isAdminDivision && (
            <button
              onClick={() => setWarehouseSubTab('armada_governance')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                warehouseSubTab === 'armada_governance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Tata Kelola Armada & Biaya Sewa</span>
            </button>
          )}
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
                            pushCollectionToCloud('assets', updated, currentUser.name);

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
                            pushCollectionToCloud('warehouse_logs', nextLogs, currentUser.name);
                            saveCloudDoc('warehouse_logs', newLog.id, newLog, currentUser.name);

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

          {/* Sub-Section Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setFleetSection('trips')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  fleetSection === 'trips' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Jadwal & Penugasan Armada ({fleetAssignments.length})</span>
              </button>
              <button
                onClick={() => setFleetSection('vehicles')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  fleetSection === 'vehicles' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Master Unit Armada ({vehicles.length})</span>
              </button>
              <button
                onClick={() => setFleetSection('drivers')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  fleetSection === 'drivers' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Master Driver Armada ({driverList.length})</span>
              </button>
              <button
                onClick={() => setFleetSection('costs')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  fleetSection === 'costs' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Kelola Biaya & Sewa Vendor</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCostRecapModal(true)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap Biaya (PDF)</span>
              </button>
              {fleetSection === 'trips' && (
                <button
                  onClick={() => setShowNewFleetModal(true)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Terbitkan SPJ & RAB (Caca)</span>
                </button>
              )}
              {fleetSection === 'drivers' && (
                <button
                  onClick={() => {
                    setSelectedDriver(null);
                    setDriverFormData({
                      name: '',
                      phone: '',
                      driverType: 'Internal',
                      simType: 'SIM B1',
                      simExpiry: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
                      idCardNumber: '',
                      assignedVehicle: vehicles[0]?.name || 'Truk Box Mitsubishi Canter CDD (6 Roda)',
                      status: 'Siap Jalan',
                      emergencyContact: '',
                      address: '',
                      notes: ''
                    });
                    setShowAddDriverModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Driver Baru</span>
                </button>
              )}

              {fleetSection === 'vehicles' && (
                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    setVehicleFormData({
                      name: '',
                      ownership: 'Internal',
                      policeNumber: '',
                      vehicleType: 'Truk Box CDD (6 Roda)',
                      tonnageCapacity: 5.0,
                      cbmCapacity: 22.0,
                      odometerKM: 50000,
                      stnkTaxExpiry: new Date().toISOString().split('T')[0],
                      kirExpiry: new Date().toISOString().split('T')[0],
                      status: 'Siap Operasi'
                    });
                    setShowVehicleModal(true);
                  }}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Master Unit Armada</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 1: JADWAL & PENUGASAN ARMADA (MASTER TRIP SCHEDULE) */}
          {fleetSection === 'trips' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                        <th className="p-3.5">No. SPJ & Event</th>
                        <th className="p-3.5">Kategori Rute</th>
                        <th className="p-3.5">Armada & Plat</th>
                        <th className="p-3.5">Driver & Tujuan</th>
                        <th className="p-3.5">Muatan & CBM</th>
                        <th className="p-3.5">P2H (Agus)</th>
                        <th className="p-3.5">RAB (Caca)</th>
                        <th className="p-3.5">Status Alur Berjenjang</th>
                        <th className="p-3.5 text-right">Aksi & Dokumen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fleetAssignments.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-8 text-center text-slate-400">
                            Belum ada jadwal penugasan armada yang diterbitkan. Klik tombol <strong>"Terbitkan SPJ & RAB (Caca)"</strong> untuk memulai penugasan event.
                          </td>
                        </tr>
                      ) : (
                        fleetAssignments.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50/60">
                            <td className="p-3.5 font-mono">
                              <div className="font-bold text-slate-900">{f.spjNumber}</div>
                              <div className="font-sans font-bold text-indigo-700 text-xs mt-0.5">{f.eventName || 'Event Produksi'}</div>
                              <div className="text-[10px] text-slate-400">{f.departureDate} s/d {f.returnDate}</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                f.tripType === 'Luar Kota (Tour / Festival)' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {f.tripType || 'Dalam Kota (Jabodetabek)'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-800">{f.vehicleType}</div>
                              <span className="font-mono text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {f.policeNumber}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="font-medium text-slate-800">{f.driverName}</div>
                              <div className="text-[11px] text-slate-500 font-semibold">{f.destination}</div>
                            </td>
                            <td className="p-3.5 font-mono">
                              <div className="font-bold text-slate-800">{f.totalCBM || 0} CBM</div>
                              <div className="text-[10px] text-slate-400">{f.manifest?.length || 0} Item Muatan</div>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                                f.p2hStatus === 'Laik Jalan' ? 'bg-emerald-100 text-emerald-800' :
                                f.p2hStatus === 'Perlu Perbaikan' ? 'bg-amber-100 text-amber-800' :
                                f.p2hStatus === 'Tidak Laik' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {f.p2hStatus === 'Laik Jalan' ? '✓ Laik Jalan' :
                                 f.p2hStatus === 'Perlu Perbaikan' ? '⚠ Perlu Perbaikan' :
                                 f.p2hStatus === 'Tidak Laik' ? '✕ Tidak Laik' : '⏳ Pending'}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono">
                              <div className="font-black text-indigo-700 text-xs">
                                Rp {(f.budget?.totalRAB || 0).toLocaleString('id-ID')}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <select
                                value={f.status}
                                onChange={(e) => handleUpdateFleetStatus(f.id, e.target.value as any)}
                                className="bg-slate-100 border border-slate-200 rounded-lg p-1 text-[10px] font-bold text-slate-800 focus:outline-none"
                              >
                                <option value="Draft">Draft</option>
                                <option value="Menunggu Approval Fahrul">Menunggu Approval Fahrul</option>
                                <option value="Disetujui">Disetujui</option>
                                <option value="Dalam Perjalanan (On Trip)">Dalam Perjalanan (On Trip)</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Dibatalkan">Dibatalkan</option>
                              </select>
                              {f.approvedBy && (
                                <div className="text-[9px] text-slate-400 mt-0.5">Otorisasi: {f.approvedBy}</div>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setSelectedFleet(f);
                                  setShowSPJPrintModal(true);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                title="Cetak SPJ & Manifest Logistik Resmi"
                              >
                                <Printer className="w-3 h-3" /> Cetak SPJ
                              </button>
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
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                title="Pemeriksaan Fisik P2H (Agus)"
                              >
                                <CheckSquare className="w-3 h-3" /> P2H
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedFleet(f);
                                  setShowApprovalModal(true);
                                }}
                                className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                title="Otorisasi Fahrul"
                              >
                                <ShieldCheck className="w-3 h-3" /> Otorisasi
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

          {/* SECTION 2: DATA MASTER INVENTARIS ARMADA KENDARAAN */}
          {fleetSection === 'vehicles' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.filter(v => v && (v.name || v.policeNumber)).map((v) => (
                  <div key={v.id || v.policeNumber} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                          (v.ownership || 'Internal') === 'Internal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {v.ownership || 'Internal'}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-sm mt-1">{v.name || 'Unit Armada'}</h3>
                      </div>
                      <span className="font-mono text-xs font-black bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        {v.policeNumber || '-'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Kapasitas Tonase</span>
                        <span className="font-bold text-slate-800">{v.tonnageCapacity ?? 0} Ton</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Kubikasi (CBM)</span>
                        <span className="font-bold text-slate-800">{v.cbmCapacity ?? 0} m³</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Odometer KM</span>
                        <span className="font-mono font-bold text-slate-800">{(Number(v.odometerKM) || 0).toLocaleString('id-ID')} KM</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Status Unit</span>
                        <span className="font-bold text-emerald-700">{v.status || 'Siap Operasi'}</span>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1 pt-2 border-t border-slate-100 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pajak STNK:</span>
                        <span className="font-bold text-slate-800">{v.stnkTaxExpiry || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Uji KIR Dishub:</span>
                        <span className="font-bold text-slate-800">{v.kirExpiry || '-'}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedVehicle(v);
                          setVehicleFormData({ ...v });
                          setShowVehicleModal(true);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(v.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {vehicles.filter(v => v && (v.name || v.policeNumber)).length === 0 && (
                <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  Belum ada data unit armada kendaraan. Klik "Tambah Unit Armada" untuk memasukkan unit baru.
                </div>
              )}
            </div>
          )}

          {/* SECTION: MASTER DRIVER ARMADA TABLE */}
          {fleetSection === 'drivers' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Driver Armada</span>
                  <span className="font-black text-slate-900 text-lg font-mono mt-1 block">{driverList.filter(Boolean).length} Pengemudi</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 shadow-xs">
                  <span className="text-[10px] text-emerald-600 uppercase font-bold block">Status Siap Jalan</span>
                  <span className="font-black text-emerald-700 text-lg font-mono mt-1 block">
                    {driverList.filter(d => d && d.status === 'Siap Jalan').length}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100 bg-blue-50/20 shadow-xs">
                  <span className="text-[10px] text-blue-600 uppercase font-bold block">Sedang On Trip</span>
                  <span className="font-black text-blue-700 text-lg font-mono mt-1 block">
                    {driverList.filter(d => d && d.status === 'On Trip').length}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-amber-100 bg-amber-50/20 shadow-xs">
                  <span className="text-[10px] text-amber-600 uppercase font-bold block">Driver Internal PT RIZ</span>
                  <span className="font-black text-amber-700 text-lg font-mono mt-1 block">
                    {driverList.filter(d => d && d.driverType === 'Internal').length} Driver
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                        <th className="p-3.5">Nama Pengemudi</th>
                        <th className="p-3.5">Tipe Driver</th>
                        <th className="p-3.5">Golongan & Masa SIM</th>
                        <th className="p-3.5">No. HP / WA</th>
                        <th className="p-3.5">Armada Default</th>
                        <th className="p-3.5">Status Kesiapan</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {driverList.filter(d => d && d.name).map(driver => (
                        <tr key={driver.id || driver.name} className="hover:bg-slate-50/60">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{driver.name || 'Pengemudi'}</div>
                            {driver.idCardNumber && (
                              <div className="text-[10px] text-slate-400 font-mono">KTP: {driver.idCardNumber}</div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              (driver.driverType || 'Internal') === 'Internal'
                                ? 'bg-blue-100 text-blue-800'
                                : driver.driverType === 'Mitra Vendor'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {driver.driverType || 'Internal'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <div className="font-bold text-slate-800">{driver.simType || '-'}</div>
                            <div className="text-[10px] text-slate-500">Exp: {driver.simExpiry || '-'}</div>
                          </td>
                          <td className="p-3.5">
                            {driver.phone ? (
                              <a
                                href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-emerald-600 font-semibold font-mono hover:underline"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{driver.phone}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">-</span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-700 font-medium">
                            {driver.assignedVehicle || '-'}
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              (driver.status || 'Siap Jalan') === 'Siap Jalan'
                                ? 'bg-emerald-100 text-emerald-800'
                                : driver.status === 'On Trip'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {driver.status || 'Siap Jalan'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => {
                                setSelectedDriver(driver);
                                setDriverFormData({ ...driver });
                                setShowEditDriverModal(true);
                              }}
                              className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Edit Data Driver"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDriver(driver.id || driver.name)}
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Driver"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {driverList.filter(d => d && d.name).length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            Belum ada data driver armada. Klik <strong>"Input Driver Baru"</strong> untuk menambahkan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: KELOLA BIAYA & SEWA VENDOR (COST & LOGISTICS BUDGETING) */}
          {fleetSection === 'costs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sewa Vendor Mitra</span>
                  <span className="font-black text-slate-900 text-sm font-mono mt-1 block">
                    Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.sewaVendor || 0), 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Konsumsi BBM Solar</span>
                  <span className="font-black text-slate-900 text-sm font-mono mt-1 block">
                    Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.bbmSolar || 0), 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tol (e-Toll)</span>
                  <span className="font-black text-slate-900 text-sm font-mono mt-1 block">
                    Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.eToll || 0), 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Uang Jalan / Makan</span>
                  <span className="font-black text-slate-900 text-sm font-mono mt-1 block">
                    Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.uangMakanDriver || 0), 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Biaya Bongkar Muat</span>
                  <span className="font-black text-slate-900 text-sm font-mono mt-1 block">
                    Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.biayaBongkarMuat || 0), 0).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-sans">
                    <thead>
                      <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-mono font-bold text-[10px]">
                        <th className="p-3.5">No. SPJ & Event</th>
                        <th className="p-3.5">Sewa Vendor</th>
                        <th className="p-3.5">BBM Solar</th>
                        <th className="p-3.5">e-Toll</th>
                        <th className="p-3.5">Uang Jalan</th>
                        <th className="p-3.5">Bongkar Muat</th>
                        <th className="p-3.5">Total Biaya Riil</th>
                        <th className="p-3.5">Verifikasi Caca</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {fleetAssignments.map((f) => (
                        <tr key={f.id} className="hover:bg-slate-50/60">
                          <td className="p-3.5 font-sans font-bold text-slate-900">
                            <div>{f.spjNumber}</div>
                            <div className="text-xs text-indigo-700">{f.eventName}</div>
                          </td>
                          <td className="p-3.5">Rp {(f.budget?.sewaVendor || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3.5">Rp {(f.budget?.bbmSolar || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3.5">Rp {(f.budget?.eToll || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3.5">Rp {(f.budget?.uangMakanDriver || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3.5">Rp {(f.budget?.biayaBongkarMuat || 0).toLocaleString('id-ID')}</td>
                          <td className="p-3.5 font-black text-indigo-800 text-xs">
                            Rp {(f.budget?.totalRAB || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Terverifikasi Kuitansi
                            </span>
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
      )}

      {/* MODAL 1: TERBITKAN SPJ, MANIFEST MUATAN LOGISTIK & RAB (CACA) */}
      {showNewFleetModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Penerbitan SPJ, Manifest Muatan & RAB</h3>
                <p className="text-[11px] text-slate-500 font-medium">Disusun & Dikelola oleh Caca (Admin & Logistik)</p>
              </div>
              <button onClick={() => setShowNewFleetModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFleetAssignment} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Event / Proyek *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Soundrenaline 2026 Stage 1"
                    value={newFleetData.eventName}
                    onChange={(e) => setNewFleetData({ ...newFleetData, eventName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Rute *</label>
                  <select
                    value={newFleetData.tripType}
                    onChange={(e) => setNewFleetData({ ...newFleetData, tripType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    <option value="Dalam Kota (Jabodetabek)">Dalam Kota (Jabodetabek)</option>
                    <option value="Luar Kota (Tour / Festival)">Luar Kota (Tour / Festival)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Unit Armada *</label>
                  <select
                    value={newFleetData.policeNumber}
                    onChange={(e) => {
                      const selected = vehicles.find(v => v.policeNumber === e.target.value);
                      if (selected) {
                        setNewFleetData({
                          ...newFleetData,
                          policeNumber: selected.policeNumber,
                          vehicleType: selected.name
                        });
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                  >
                    {vehicles.filter(v => v && v.policeNumber).map(v => (
                      <option key={v.id || v.policeNumber} value={v.policeNumber}>{v.name || 'Armada'} ({v.policeNumber})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Pengemudi (Driver) *</label>
                  <div className="space-y-1">
                    {driverList.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setNewFleetData({ ...newFleetData, driverName: e.target.value });
                          }
                        }}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg p-1.5 text-[11px] text-slate-700 font-semibold mb-1"
                        defaultValue=""
                      >
                        <option value="">-- Pilih dari Master Driver Armada --</option>
                        {driverList.map(d => (
                          <option key={d.id} value={d.name}>{d.name} ({d.driverType} - {d.status})</option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      placeholder="Nama Driver / Sopir"
                      value={newFleetData.driverName}
                      onChange={(e) => setNewFleetData({ ...newFleetData, driverName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="font-bold text-slate-700 block mb-1">Tujuan / Venue *</label>
                  <input
                    type="text"
                    placeholder="Contoh: Stadion Madya GBK"
                    value={newFleetData.destination}
                    onChange={(e) => setNewFleetData({ ...newFleetData, destination: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                    required
                  />
                </div>

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

              {/* Manifest Muatan Logistik Section (Audio, Lighting, Videotron, Rigging) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-800 block text-xs uppercase tracking-wider">
                    📦 Manifest Muatan Logistik & Estimasi Kubikasi (CBM)
                  </span>
                  <span className="font-bold text-indigo-700 font-mono text-xs">
                    Total: {manifestItems.reduce((acc, m) => acc + (m.estimatedCBM * m.qty), 0).toFixed(2)} CBM
                  </span>
                </div>

                <div className="space-y-2">
                  {manifestItems.map((m, idx) => (
                    <div key={m.id || idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                      <div>
                        <span className="font-mono font-bold text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded mr-2">
                          {m.division}
                        </span>
                        <span className="font-semibold text-slate-800">{m.itemDescription}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-600">{m.qty} {m.unit}</span>
                        <span className="font-mono text-indigo-700 font-bold">{(m.estimatedCBM * m.qty).toFixed(2)} CBM</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveManifestItem(m.id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Tambah Item Manifest */}
                <div className="grid grid-cols-12 gap-2 pt-2 border-t border-slate-200">
                  <select
                    value={newManifestDivision}
                    onChange={(e) => setNewManifestDivision(e.target.value as any)}
                    className="col-span-3 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Audio">Audio</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Videotron">Videotron</option>
                    <option value="Rigging">Rigging</option>
                    <option value="Genset / Power">Genset / Power</option>
                    <option value="Umum">Umum</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Nama / Deskripsi Flightcase / Alat"
                    value={newManifestDesc}
                    onChange={(e) => setNewManifestDesc(e.target.value)}
                    className="col-span-4 bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-slate-800"
                  />

                  <input
                    type="number"
                    placeholder="Qty"
                    value={newManifestQty}
                    onChange={(e) => setNewManifestQty(Number(e.target.value))}
                    className="col-span-1 bg-white border border-slate-300 rounded-lg p-1.5 text-xs text-center font-bold"
                  />

                  <select
                    value={newManifestUnit}
                    onChange={(e) => setNewManifestUnit(e.target.value as any)}
                    className="col-span-2 bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Flightcase">Flightcase</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Roll">Roll</option>
                    <option value="Box">Box</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleAddManifestItem}
                    className="col-span-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    + Item
                  </button>
                </div>
              </div>

              {/* Kalkulasi RAB Logistik */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
                <span className="font-black text-indigo-900 block text-xs uppercase tracking-wider">
                  💰 Kalkulasi Anggaran Biaya Logistik (RAB)
                </span>
                
                <div className="grid grid-cols-3 gap-3">
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
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Uang Jalan / Makan Driver (Rp)</label>
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

                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Biaya Bongkar Muat Kru (Rp)</label>
                    <input
                      type="number"
                      value={newFleetData.budget?.biayaBongkarMuat || 0}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNewFleetData({
                          ...newFleetData,
                          budget: { ...newFleetData.budget!, biayaBongkarMuat: val }
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
                      Number(newFleetData.budget?.uangMakanDriver || 0) +
                      Number(newFleetData.budget?.biayaBongkarMuat || 0)
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
                <div><strong>Event:</strong> {selectedFleet.eventName}</div>
                <div><strong>Armada & Plat:</strong> {selectedFleet.vehicleType} ({selectedFleet.policeNumber})</div>
                <div><strong>Driver:</strong> {selectedFleet.driverName}</div>
                <div><strong>Destinasi:</strong> {selectedFleet.destination}</div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <span className="font-bold text-blue-950 block">Status Kelaikan Fisik (P2H Agus):</span>
                <span className={`font-black ${selectedFleet.p2hStatus === 'Laik Jalan' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {selectedFleet.p2hStatus}
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
                  <span>e-Toll, Uang Jalan & Bongkar Muat:</span>
                  <span className="font-mono font-bold">
                    Rp {((selectedFleet.budget?.eToll || 0) + (selectedFleet.budget?.uangMakanDriver || 0) + (selectedFleet.budget?.biayaBongkarMuat || 0)).toLocaleString('id-ID')}
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

      {/* MODAL 4: TAMBAH / EDIT MASTER UNIT ARMADA */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedVehicle ? 'Edit Data Unit Armada' : 'Tambah Unit Armada Baru'}</h3>
                <p className="text-[11px] text-slate-500 font-medium">Master Inventaris Kendaraan Operasional</p>
              </div>
              <button onClick={() => setShowVehicleModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama & Tipe Kendaraan *</label>
                <input
                  type="text"
                  placeholder="Contoh: Truk Box Mitsubishi Canter CDD 6 Roda"
                  value={vehicleFormData.name}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Polisi (Plat) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: B 9142 SXZ"
                    value={vehicleFormData.policeNumber}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, policeNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kepemilikan *</label>
                  <select
                    value={vehicleFormData.ownership}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, ownership: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  >
                    <option value="Internal">Internal PT RIZ</option>
                    <option value="Sewa Mitra">Sewa Mitra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tonase (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vehicleFormData.tonnageCapacity}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, tonnageCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kubikasi (m³)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vehicleFormData.cbmCapacity}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, cbmCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Odometer KM</label>
                  <input
                    type="number"
                    value={vehicleFormData.odometerKM}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, odometerKM: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jatuh Tempo Pajak STNK</label>
                  <input
                    type="date"
                    value={vehicleFormData.stnkTaxExpiry}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, stnkTaxExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jatuh Tempo Uji KIR</label>
                  <input
                    type="date"
                    value={vehicleFormData.kirExpiry}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, kirExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs"
                >
                  Simpan Data Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DOKUMEN RESMI CETAK SPJ & MANIFEST LOGISTIK (PDF PREVIEW & PRINT) */}
      {showSPJPrintModal && selectedFleet && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 space-y-6 text-slate-900 my-8">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center font-black text-xl tracking-tighter">
                  RIZ
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase">PT. RIZ PRODUCTION MULTI KREASI</h1>
                  <p className="text-[10px] text-slate-600 font-medium">Jl. Raya Logistik No. 88, Jakarta • Telp: (021) 8872-9100 • info@rizproduction.com</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black px-2.5 py-1 bg-slate-100 border border-slate-300 rounded font-mono">
                  DOKUMEN RESMI
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-base font-black underline uppercase tracking-wider">SURAT PERINTAH JALAN & MANIFEST LOGISTIK</h2>
              <p className="text-xs font-mono font-bold text-slate-600">Nomor: {selectedFleet.spjNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <div><span className="text-slate-500">Nama Event:</span> <strong>{selectedFleet.eventName}</strong></div>
                <div><span className="text-slate-500">Kategori Rute:</span> <strong>{selectedFleet.tripType}</strong></div>
                <div><span className="text-slate-500">Lokasi Tujuan / Venue:</span> <strong>{selectedFleet.destination}</strong></div>
              </div>
              <div className="space-y-1">
                <div><span className="text-slate-500">Armada & No. Polisi:</span> <strong>{selectedFleet.vehicleType} ({selectedFleet.policeNumber})</strong></div>
                <div><span className="text-slate-500">Nama Pengemudi (Driver):</span> <strong>{selectedFleet.driverName}</strong></div>
                <div><span className="text-slate-500">Jadwal Keberangkatan:</span> <strong>{selectedFleet.departureDate} s/d {selectedFleet.returnDate}</strong></div>
              </div>
            </div>

            {/* Manifest Cargo Table */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs uppercase tracking-wider border-b pb-1">Rincian Manifest Muatan Peralatan (Total: {selectedFleet.totalCBM} CBM)</h3>
              <table className="w-full text-left text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-mono font-bold">
                    <th className="p-2">No</th>
                    <th className="p-2">Divisi</th>
                    <th className="p-2">Deskripsi Barang / Flightcase</th>
                    <th className="p-2 text-center">Jumlah Unit</th>
                    <th className="p-2 text-right">Est. Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedFleet.manifest && selectedFleet.manifest.length > 0 ? (
                    selectedFleet.manifest.map((m, idx) => (
                      <tr key={m.id || idx}>
                        <td className="p-2 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 font-bold">{m.division}</td>
                        <td className="p-2">{m.itemDescription}</td>
                        <td className="p-2 text-center font-bold">{m.qty} {m.unit}</td>
                        <td className="p-2 text-right font-mono">{(m.estimatedCBM * m.qty).toFixed(2)} m³</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400">Peralatan event terintegrasi sesuai packing list gudang.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* P2H Checklist Status */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="font-bold block">Status Inspeksi Pra-Harian (P2H 7-Item):</span>
                <span className="text-slate-600 text-[11px]">Diperiksa oleh Agus (Supervisor Teknis) pada {selectedFleet.p2h?.inspectedAt || 'Jadwal Keberangkatan'}</span>
              </div>
              <span className="font-black px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs">
                {selectedFleet.p2hStatus || 'Laik Jalan'}
              </span>
            </div>

            {/* Tri-Party Signature Section */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-slate-900 text-center text-xs">
              <div className="space-y-12">
                <p className="font-bold text-slate-700 text-[11px]">Disusun Oleh (Admin Logistik):</p>
                <div>
                  <p className="font-black text-slate-900 underline">Caca</p>
                  <p className="text-[10px] text-slate-500">Staff Admin & Logistik</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-slate-700 text-[11px]">Diperiksa Oleh (Supervisor):</p>
                <div>
                  <p className="font-black text-slate-900 underline">Agus</p>
                  <p className="text-[10px] text-slate-500">Supervisor Teknis & Armada</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-slate-700 text-[11px]">Mengetahui / Disetujui Oleh:</p>
                <div>
                  <p className="font-black text-slate-900 underline">Fahrul</p>
                  <p className="text-[10px] text-slate-500">Manager Operasional</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowSPJPrintModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white transition-all cursor-pointer shadow-sm inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak / Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: REKAPITULASI BIAYA LOGISTIK MINGGUAN / BULANAN (PDF PREVIEW & PRINT) */}
      {showCostRecapModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 space-y-6 text-slate-900 my-8">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center font-black text-xl tracking-tighter">
                  RIZ
                </div>
                <div>
                  <h1 className="text-lg font-black tracking-tight text-slate-950 uppercase">PT. RIZ PRODUCTION MULTI KREASI</h1>
                  <p className="text-[10px] text-slate-600 font-medium">Laporan Rekapitulasi Biaya Sewa & Operasional Logistik Transportasi</p>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <div>Periode: <strong>Tahun 2026</strong></div>
                <div className="text-[10px] text-slate-500">Dicetak: {new Date().toLocaleDateString('id-ID')}</div>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-mono font-bold">
                  <th className="p-2">No. SPJ & Event</th>
                  <th className="p-2 text-right">Sewa Vendor</th>
                  <th className="p-2 text-right">BBM Solar</th>
                  <th className="p-2 text-right">e-Toll</th>
                  <th className="p-2 text-right">Uang Jalan</th>
                  <th className="p-2 text-right">Bongkar Muat</th>
                  <th className="p-2 text-right">Total Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-xs">
                {fleetAssignments.map((f) => (
                  <tr key={f.id}>
                    <td className="p-2 font-sans font-bold">{f.spjNumber} - {f.eventName}</td>
                    <td className="p-2 text-right">Rp {(f.budget?.sewaVendor || 0).toLocaleString('id-ID')}</td>
                    <td className="p-2 text-right">Rp {(f.budget?.bbmSolar || 0).toLocaleString('id-ID')}</td>
                    <td className="p-2 text-right">Rp {(f.budget?.eToll || 0).toLocaleString('id-ID')}</td>
                    <td className="p-2 text-right">Rp {(f.budget?.uangMakanDriver || 0).toLocaleString('id-ID')}</td>
                    <td className="p-2 text-right">Rp {(f.budget?.biayaBongkarMuat || 0).toLocaleString('id-ID')}</td>
                    <td className="p-2 text-right font-black text-slate-950">
                      Rp {(f.budget?.totalRAB || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-900 font-mono text-xs">
                  <td className="p-2 font-sans">TOTAL KESELURUHAN:</td>
                  <td className="p-2 text-right">Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.sewaVendor || 0), 0).toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right">Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.bbmSolar || 0), 0).toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right">Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.eToll || 0), 0).toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right">Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.uangMakanDriver || 0), 0).toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right">Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.biayaBongkarMuat || 0), 0).toLocaleString('id-ID')}</td>
                  <td className="p-2 text-right font-black text-indigo-900">
                    Rp {fleetAssignments.reduce((acc, f) => acc + (f.budget?.totalRAB || 0), 0).toLocaleString('id-ID')}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Tri-Party Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-slate-900 text-center text-xs">
              <div className="space-y-12">
                <p className="font-bold text-slate-700 text-[11px]">Diverifikasi Oleh:</p>
                <div>
                  <p className="font-black text-slate-900 underline">Caca</p>
                  <p className="text-[10px] text-slate-500">Admin & Logistik</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-slate-700 text-[11px]">Diperiksa Oleh:</p>
                <div>
                  <p className="font-black text-slate-900 underline">Agus</p>
                  <p className="text-[10px] text-slate-500">Supervisor Teknis</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-bold text-slate-700 text-[11px]">Disetujui Oleh:</p>
                <div>
                  <p className="font-black text-slate-900 underline">Fahrul</p>
                  <p className="text-[10px] text-slate-500">Manager Operasional</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowCostRecapModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white transition-all cursor-pointer shadow-sm inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak / Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: TAMBAH / EDIT DRIVER MASTER ARMADA (GUDANG / LOGISTIK) */}
      {(showAddDriverModal || (showEditDriverModal && selectedDriver)) && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {showAddDriverModal ? 'Input Data Driver Armada Baru' : 'Edit Data Driver Armada'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Master Driver Pengemudi Logistik PT RIZ-PRODUCTION</p>
              </div>
              <button
                onClick={() => {
                  setShowAddDriverModal(false);
                  setShowEditDriverModal(false);
                  setSelectedDriver(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Driver *</label>
                <input
                  type="text"
                  placeholder="Contoh: Pak Joko / Mang Ujang"
                  value={driverFormData.name}
                  onChange={(e) => setDriverFormData({ ...driverFormData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Driver *</label>
                  <select
                    value={driverFormData.driverType}
                    onChange={(e) => setDriverFormData({ ...driverFormData, driverType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Internal">Driver Internal PT RIZ</option>
                    <option value="Mitra Vendor">Driver Mitra Vendor</option>
                    <option value="Freelance Driver">Freelance Driver</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp / HP *</label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={driverFormData.phone}
                    onChange={(e) => setDriverFormData({ ...driverFormData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Golongan SIM *</label>
                  <select
                    value={driverFormData.simType}
                    onChange={(e) => setDriverFormData({ ...driverFormData, simType: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold font-mono"
                  >
                    <option value="SIM A">SIM A (Blindvan/Mobil Kru)</option>
                    <option value="SIM B1">SIM B1 (Truk Engkel / CDD)</option>
                    <option value="SIM B1 Umum">SIM B1 Umum</option>
                    <option value="SIM B2">SIM B2 (Tronton / Wingbox)</option>
                    <option value="SIM B2 Umum">SIM B2 Umum</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Masa Berlaku SIM *</label>
                  <input
                    type="date"
                    value={driverFormData.simExpiry}
                    onChange={(e) => setDriverFormData({ ...driverFormData, simExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Armada Yang Biasa Dibawa</label>
                  <select
                    value={driverFormData.assignedVehicle}
                    onChange={(e) => setDriverFormData({ ...driverFormData, assignedVehicle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="">-- Bebas / Semua Unit --</option>
                    {vehicles.filter(v => v && (v.name || v.policeNumber)).map(v => (
                      <option key={v.id || v.name || v.policeNumber} value={v.name || v.policeNumber}>{v.name || 'Armada'} ({v.policeNumber || '-'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Kesiapan Operasi</label>
                  <select
                    value={driverFormData.status}
                    onChange={(e) => setDriverFormData({ ...driverFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="Siap Jalan">Siap Jalan</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off / Libur">Off / Libur</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor KTP</label>
                  <input
                    type="text"
                    placeholder="3201xxxxxxxxxxxx"
                    value={driverFormData.idCardNumber}
                    onChange={(e) => setDriverFormData({ ...driverFormData, idCardNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kontak Darurat</label>
                  <input
                    type="text"
                    placeholder="Nama & No HP Keluarga"
                    value={driverFormData.emergencyContact}
                    onChange={(e) => setDriverFormData({ ...driverFormData, emergencyContact: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Pengalaman rute, simpan SIM, dll."
                  value={driverFormData.notes}
                  onChange={(e) => setDriverFormData({ ...driverFormData, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddDriverModal(false);
                  setShowEditDriverModal(false);
                  setSelectedDriver(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={showAddDriverModal ? handleAddDriver : handleSaveEditDriver}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {showAddDriverModal ? 'Simpan Driver Baru' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


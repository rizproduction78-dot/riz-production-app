import React, { useState, useEffect, useRef } from 'react';
import { PrintHeader } from './PrintHeader';
import {
  Staff,
  Asset,
  Finding,
  WorkOrder,
  DailyReport,
  JobAssignment,
  WarehouseLog,
  FleetAssignment,
  P2HChecklist,
  FleetBudgetRAB,
  VehicleMaster,
  ManifestCargoItem,
  FleetDriver,
  OFFICIAL_ARMADA_SPREADSHEET_URL,
  OFFICIAL_INVENTORY_SPREADSHEET_URL
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_VEHICLES,
  INITIAL_FLEET_DRIVERS,
  INITIAL_JOB_ASSIGNMENTS,
  normalizeJobAssignmentsMaster,
  normalizeVehiclesMaster,
  normalizeAssetsMaster,
  formatServiceDateIndonesian,
  sortMaintenanceHistoryDesc,
  filterMaintenanceHistoryByCurrentYear,
  getInventoryAssetTypeInfo,
  groupInventoryAssetsByType,
  stripInventoryNominalText,
  calculateInventoryAssetAvailability,
  calculateInventorySummaryMetrics,
  getDefaultAssetReportAndProgress,
  formatAssetReportDateLabel,
  formatAssetReportMonthLabel,
  InventoryTypeIconKey
} from '../data';
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
  Phone,
  Boxes,
  Volume2,
  Lightbulb,
  Video,
  Tv,
  Mic,
  Sliders,
  Music,
  Monitor,
  Cpu,
  Radio,
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { subscribeCloudCollection, saveCloudDoc, pushCollectionToCloud, deleteCloudDoc } from '../lib/cloudSync';
import { checkVehicleDocExpiry, getVehicleExpiryAlerts } from '../utils/vehicleExpiryAlerts';
import {
  startUniversalCameraStream,
  decodeBarcodeFromSource,
  isValidScannedBarcodeText,
  listVideoInputDevices,
  toggleCameraTorch,
  captureSnapshotFromVideo,
  CameraDeviceInfo
} from '../lib/universalBarcodeScanner';

function resolveInventoryTypeIcon(iconKey: InventoryTypeIconKey) {
  switch (iconKey) {
    case 'speaker':
      return Volume2;
    case 'sliders':
      return Sliders;
    case 'cpu':
      return Cpu;
    case 'music':
      return Music;
    case 'radio':
      return Radio;
    case 'mic':
      return Mic;
    case 'layers':
      return Layers;
    case 'zap':
      return Zap;
    case 'lightbulb':
      return Lightbulb;
    case 'sparkles':
      return Sparkles;
    case 'monitor':
      return Monitor;
    case 'camera':
      return Camera;
    case 'tv':
      return Tv;
    case 'video':
      return Video;
    default:
      return Package;
  }
}

function getInventoryUnitIconInfo(asset: Asset) {
  const info = getInventoryAssetTypeInfo(asset);
  const Icon = resolveInventoryTypeIcon(info.iconKey);
  return {
    ...info,
    Icon,
    categoryLabel: info.shortTypeLabel
  };
}

interface GudangProps {
  currentUser: Staff;
  assets: Asset[];
  findings?: Finding[];
  workOrders?: WorkOrder[];
  dailyReports?: DailyReport[];
  jobAssignments?: JobAssignment[];
  activeMonth?: string;
  onAddAsset?: (asset: Omit<Asset, 'id' | 'repairHistory'>) => void;
  onUpdateAsset?: (id: string, updated: Partial<Asset>) => void;
  onDeleteAsset?: (id: string) => void;
  onUpdateAssetLocation?: (id: string, newLocation: string) => void;
  onUpdateAssetCondition?: (id: string, condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat') => void;
  onAddFinding?: (finding: Omit<import('../types').Finding, 'id' | 'dateCreated'>) => void;
  onLogActivity: (username: string, role: string, action: string) => void;
  forceSubTab?: 'logs' | 'inventory' | 'scanner' | 'armada_governance';
  onNavigateTab?: (tab: string) => void;
  // Shared lifted state from App.tsx
  driverList?: FleetDriver[];
  onAddDriver?: (driver: Omit<FleetDriver, 'id'>) => void;
  onUpdateDriver?: (id: string, updated: Partial<FleetDriver>) => void;
  onDeleteDriver?: (id: string) => void;
  vehicles?: VehicleMaster[];
  onAddVehicle?: (vehicle: Omit<VehicleMaster, 'id'>) => void;
  onUpdateVehicle?: (id: string, updated: Partial<VehicleMaster>) => void;
  onDeleteVehicle?: (id: string) => void;
  fleetAssignments?: FleetAssignment[];
  onAddFleetAssignment?: (assignment: FleetAssignment) => void;
  onUpdateFleetAssignment?: (id: string, updated: Partial<FleetAssignment>) => void;
  onDeleteFleetAssignment?: (id: string) => void;
}

export default function Gudang({
  currentUser,
  assets,
  findings = [],
  workOrders = [],
  dailyReports = [],
  jobAssignments: propJobAssignments,
  activeMonth,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onUpdateAssetLocation,
  onUpdateAssetCondition,
  onAddFinding,
  onLogActivity,
  forceSubTab,
  onNavigateTab,
  driverList: propDriverList,
  onAddDriver: propOnAddDriver,
  onUpdateDriver: propOnUpdateDriver,
  onDeleteDriver: propOnDeleteDriver,
  vehicles: propVehicles,
  onAddVehicle: propOnAddVehicle,
  onUpdateVehicle: propOnUpdateVehicle,
  onDeleteVehicle: propOnDeleteVehicle,
  fleetAssignments: propFleetAssignments,
  onAddFleetAssignment: propOnAddFleetAssignment,
  onUpdateFleetAssignment: propOnUpdateFleetAssignment,
  onDeleteFleetAssignment: propOnDeleteFleetAssignment
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

  // Fleet Assignments State - use props if available
  const [localFleetAssignments, setLocalFleetAssignments] = useState<FleetAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap((item: any) => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter((f: any) => Boolean(f && typeof f === 'object' && (f.spjNumber || f.driverName)));
          return valid;
        }
      }
    } catch (e) {}
    return [];
  });
  const fleetAssignments = propFleetAssignments !== undefined ? propFleetAssignments : localFleetAssignments;

  // Master Vehicles State - use props if available
  const [localVehicles, setLocalVehicles] = useState<VehicleMaster[]>(() => {
    try {
      const saved = localStorage.getItem('riz_master_vehicles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return normalizeVehiclesMaster(parsed);
        }
      }
    } catch (e) {}
    return INITIAL_VEHICLES;
  });
  const vehicles = propVehicles !== undefined ? propVehicles : localVehicles;

  // Assets database matching
  const [localAssets, setLocalAssets] = useState<Asset[]>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('riz_assets');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return normalizeAssetsMaster(parsed);
        }
      }
    } catch (e) {}
    return INITIAL_ASSETS;
  });

  useEffect(() => {
    setLocalAssets(normalizeAssetsMaster(assets));
  }, [assets]);

  // Active Job Assignments for Inventory Unit Deduction
  const [localJobAssignments] = useState<JobAssignment[]>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('riz_job_assignments_gcal_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return normalizeJobAssignmentsMaster(parsed);
        }
      }
    } catch (e) {}
    return INITIAL_JOB_ASSIGNMENTS;
  });
  const activeJobAssignments = propJobAssignments !== undefined ? normalizeJobAssignmentsMaster(propJobAssignments) : localJobAssignments;

  const runningMonth =
    activeMonth && activeMonth !== 'ALL' && activeMonth !== 'all' ? activeMonth : '2026-11';

  const inventoryCalcCtx = {
    findings,
    workOrders,
    dailyReports,
    jobAssignments: activeJobAssignments,
    activeMonth: runningMonth
  };

  const overallInventorySummary = calculateInventorySummaryMetrics(localAssets, inventoryCalcCtx);

  const isAdminDivision = true; // Allow viewing and managing fleet/armada

  // Tab views within warehouse: 'logs' | 'inventory' | 'scanner' | 'armada_governance'
  const [warehouseSubTab, setWarehouseSubTab] = useState<'logs' | 'inventory' | 'scanner' | 'armada_governance'>(() => {
    return forceSubTab || 'logs';
  });

  useEffect(() => {
    if (forceSubTab) {
      setWarehouseSubTab(forceSubTab);
    }
  }, [forceSubTab]);

  // Inventory arrangement filter & modal states
  const [inventoryDivisionFilter, setInventoryDivisionFilter] = useState<'ALL' | 'Audio' | 'Lighting' | 'Multimedia' | 'Videotron'>('ALL');
  const [inventoryTypeFilter, setInventoryTypeFilter] = useState<string>('ALL');
  const [inventoryConditionFilter, setInventoryConditionFilter] = useState<'ALL' | 'Baik' | 'Rusak Ringan' | 'Rusak Berat'>('ALL');
  const [inventorySearch, setInventorySearch] = useState('');
  const [showAssetFormModal, setShowAssetFormModal] = useState(false);
  const [editingAssetItem, setEditingAssetItem] = useState<Asset | null>(null);
  const [assetFormState, setAssetFormState] = useState<{
    code: string;
    name: string;
    brand: string;
    serialNumber: string;
    division: import('../types').Division;
    location: string;
    condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
    reportDate: string;
    reportMonth: string;
    reportedBy: string;
    progressStatus: string;
    progressPercent: number;
    progressNotes: string;
  }>({
    code: '',
    name: '',
    brand: '',
    serialNumber: '',
    division: 'Audio',
    location: 'Gudang Utama RIZ - Zona Audio',
    condition: 'Baik',
    reportDate: '2026-11-01',
    reportMonth: '2026-11',
    reportedBy: currentUser.name,
    progressStatus: 'Selesai Dicek / Siap Operasi',
    progressPercent: 100,
    progressNotes: ''
  });

  const openEditAssetModal = (asset: Asset) => {
    const avail = calculateInventoryAssetAvailability(asset, inventoryCalcCtx);
    setEditingAssetItem(asset);
    setAssetFormState({
      code: asset.code,
      name: asset.name,
      brand: asset.brand,
      serialNumber: asset.serialNumber,
      division: asset.division,
      location: asset.location,
      condition: asset.condition,
      reportDate: avail.reportDate || asset.reportDate || '2026-11-01',
      reportMonth: avail.reportMonth || asset.reportMonth || (avail.reportDate ? avail.reportDate.slice(0, 7) : '2026-11'),
      reportedBy: avail.reportedBy || asset.reportedBy || currentUser.name,
      progressStatus: avail.progressStatus || asset.progressStatus || (asset.condition === 'Baik' ? 'Selesai Dicek / Siap Operasi' : asset.condition === 'Rusak Berat' ? 'Belum Ditangani / Off (Mati Suri)' : 'Dalam Pengecekan / Perbaikan Service'),
      progressPercent: typeof avail.progressPercent === 'number' ? avail.progressPercent : (asset.condition === 'Baik' ? 100 : asset.condition === 'Rusak Berat' ? 0 : 40),
      progressNotes: avail.progressNotes || asset.progressNotes || ''
    });
    setShowAssetFormModal(true);
  };

  const handleSaveAssetInventory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetFormState.name.trim() || !assetFormState.code.trim()) {
      alert('Kode Aset dan Nama Unit wajib diisi!');
      return;
    }

    const normalizedReportDate = assetFormState.reportDate.trim() || new Date().toISOString().split('T')[0];
    const normalizedReportMonth = assetFormState.reportMonth.trim() || normalizedReportDate.slice(0, 7);
    const normalizedProgressPercent = Math.max(0, Math.min(100, Math.round(Number(assetFormState.progressPercent) || 0)));

    if (editingAssetItem) {
      const updatedAsset: Asset = {
        ...editingAssetItem,
        code: assetFormState.code.trim().toUpperCase(),
        name: assetFormState.name.trim(),
        brand: assetFormState.brand.trim() || 'Standard',
        serialNumber: assetFormState.serialNumber.trim() || '-',
        division: assetFormState.division,
        location: assetFormState.location.trim() || 'Gudang Utama RIZ',
        condition: assetFormState.condition,
        reportDate: normalizedReportDate,
        reportMonth: normalizedReportMonth,
        reportedBy: assetFormState.reportedBy.trim() || currentUser.name,
        progressStatus: assetFormState.progressStatus.trim() || 'Selesai Dicek / Siap Operasi',
        progressPercent: normalizedProgressPercent,
        progressNotes: assetFormState.progressNotes.trim(),
        _userEdited: true,
        _syncMeta: {
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.name,
          _userEdited: true
        }
      };
      const next = localAssets.map(a => a.id === editingAssetItem.id ? updatedAsset : a);
      setLocalAssets(next);
      localStorage.setItem('riz_assets', JSON.stringify(next));
      saveCloudDoc('assets', editingAssetItem.id, updatedAsset, currentUser.name);
      if (onUpdateAsset) onUpdateAsset(editingAssetItem.id, updatedAsset);
      onLogActivity(
        currentUser.name,
        currentUser.role,
        `Memperbarui unit inventaris gudang: ${updatedAsset.code} - ${updatedAsset.name} (Pelaporan: ${formatAssetReportDateLabel(normalizedReportDate)} • Progress: ${normalizedProgressPercent}% - ${updatedAsset.progressStatus})`
      );
    } else {
      const newAsset: Asset = {
        id: 'ast-custom-' + Date.now(),
        code: assetFormState.code.trim().toUpperCase(),
        name: assetFormState.name.trim(),
        brand: assetFormState.brand.trim() || 'Standard',
        serialNumber: assetFormState.serialNumber.trim() || '-',
        division: assetFormState.division,
        location: assetFormState.location.trim() || 'Gudang Utama RIZ',
        condition: assetFormState.condition,
        reportDate: normalizedReportDate,
        reportMonth: normalizedReportMonth,
        reportedBy: assetFormState.reportedBy.trim() || currentUser.name,
        progressStatus: assetFormState.progressStatus.trim() || 'Selesai Dicek / Siap Operasi',
        progressPercent: normalizedProgressPercent,
        progressNotes: assetFormState.progressNotes.trim(),
        repairHistory: [],
        _userEdited: true,
        _syncMeta: {
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.name,
          _userEdited: true
        }
      };
      const next = [newAsset, ...localAssets];
      setLocalAssets(next);
      localStorage.setItem('riz_assets', JSON.stringify(next));
      saveCloudDoc('assets', newAsset.id, newAsset, currentUser.name);
      if (onAddAsset) {
        onAddAsset({
          code: newAsset.code,
          name: newAsset.name,
          brand: newAsset.brand,
          serialNumber: newAsset.serialNumber,
          division: newAsset.division,
          location: newAsset.location,
          condition: newAsset.condition,
          reportDate: newAsset.reportDate,
          reportMonth: newAsset.reportMonth,
          reportedBy: newAsset.reportedBy,
          progressStatus: newAsset.progressStatus,
          progressPercent: newAsset.progressPercent,
          progressNotes: newAsset.progressNotes
        });
      }
      onLogActivity(currentUser.name, currentUser.role, `Menambahkan unit inventaris gudang baru: ${newAsset.code} - ${newAsset.name}`);
    }

    setShowAssetFormModal(false);
    setEditingAssetItem(null);
  };

  // Subtab inside Armada Governance: 'trips' | 'vehicles' | 'drivers' | 'costs'
  const [fleetSection, setFleetSection] = useState<'trips' | 'vehicles' | 'drivers' | 'costs'>('trips');

  // Master Driver Armada State - use props if available, otherwise local state as fallback
  const [localDriverList, setLocalDriverList] = useState<FleetDriver[]>(() => {
    try {
      const saved = localStorage.getItem('riz_fleet_drivers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const flat = parsed.flatMap((item: any) => (item && Array.isArray(item.list)) ? item.list : [item]);
          const valid = flat.filter((d: any) => Boolean(d && typeof d === 'object' && d.name));
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {}
    return INITIAL_FLEET_DRIVERS;
  });
  // Resolve: use props from App.tsx if provided (single source of truth), else local fallback
  const driverList = propDriverList !== undefined ? propDriverList : localDriverList;

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
    setLocalDriverList(updated);
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
      createdAt: new Date().toISOString().split('T')[0],
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    };
    if (propOnAddDriver) {
      propOnAddDriver(newDrv);
    } else {
      const updated = [...localDriverList, newDrv];
      await saveDriverList(updated, { type: 'save', id: newDrv.id, doc: newDrv });
    }
    setShowAddDriverModal(false);
  };

  const handleSaveEditDriver = async () => {
    if (!selectedDriver || !driverFormData.name?.trim()) return;
    const updatedDoc: FleetDriver = {
      ...selectedDriver,
      ...driverFormData,
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    } as FleetDriver;
    if (propOnUpdateDriver) {
      propOnUpdateDriver(selectedDriver.id, updatedDoc);
    } else {
      const updated = localDriverList.map(d => d.id === selectedDriver.id ? updatedDoc : d);
      await saveDriverList(updated, { type: 'save', id: selectedDriver.id, doc: updatedDoc });
    }
    setShowEditDriverModal(false);
    setSelectedDriver(null);
  };

  const handleDeleteDriver = async (id: string) => {
    const target = driverList.find(d => d.id === id || d.name === id);
    const targetName = target?.name || id;
    const targetId = target?.id || id;
    if (confirm(`Yakin ingin menghapus data pengemudi (driver) "${targetName}" ini?`)) {
      onLogActivity(currentUser.name, currentUser.role, `Gudang menghapus driver: ${targetName}`);
      try {
        if (propOnDeleteDriver) {
          propOnDeleteDriver(targetId);
        } else {
          const updated = localDriverList.filter(d => d.id !== targetId && d.name !== targetName);
          await saveDriverList(updated, { type: 'delete', id: targetId, name: targetName });
          if (targetName && targetName !== targetId) {
            await deleteCloudDoc('fleet_drivers', targetName.toLowerCase().trim());
            await deleteCloudDoc('fleet_drivers', targetName.trim());
          }
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
  const [scannedPhoto, setScannedPhoto] = useState<string | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Fleet Governance Form & Modal State
  const [showNewFleetModal, setShowNewFleetModal] = useState(false);
  const [showP2HModal, setShowP2HModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showSPJPrintModal, setShowSPJPrintModal] = useState(false);
  const [showCostRecapModal, setShowCostRecapModal] = useState(false);

  const [selectedFleet, setSelectedFleet] = useState<FleetAssignment | null>(null);

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleMaster | null>(null);

  // Manifest items in creation modal (dimulai kosong, hanya diisi dari unit yang berhasil di-scan / diinput)
  const [manifestItems, setManifestItems] = useState<ManifestCargoItem[]>([]);
  const [newManifestDivision, setNewManifestDivision] = useState<'Audio' | 'Lighting' | 'Videotron' | 'Rigging' | 'Genset / Power' | 'Umum'>('Audio');
  const [newManifestDesc, setNewManifestDesc] = useState('');
  const [newManifestQty, setNewManifestQty] = useState(1);
  const [newManifestUnit, setNewManifestUnit] = useState<'Flightcase' | 'Pcs' | 'Pallet' | 'Roll' | 'Box'>('Flightcase');
  const [newManifestCBM, setNewManifestCBM] = useState(0.5);

  // Caca's New SPJ / RAB Form
  const [newFleetData, setNewFleetData] = useState<Partial<FleetAssignment>>({
    eventName: '',
    tripType: 'Dalam Kota (Jabodetabek)',
    vehicleType: 'SUZUKI CARRY',
    policeNumber: 'F 8446 BF',
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
    inspector: currentUser.name === 'Agus' || currentUser.name?.includes('Agustino') ? 'Agustino (Admin)' : currentUser.name || ''
  });

  // Scanner Simulator State — HANYA unit yang berhasil di-scan yang muncul di daftar (Anti-Double Pencatatan + Wajib Catat Siapa yang Scan)
  interface ScannedAssetRecord {
    assetId: string;
    assetCode: string;
    scannedBy: string;
    scannedByRole: string;
    scannedByDivision: string;
    scannedAt: string;
  }

  const deduplicateScanRecords = (records: ScannedAssetRecord[]): ScannedAssetRecord[] => {
    const seen = new Set<string>();
    const result: ScannedAssetRecord[] = [];
    for (const rec of records) {
      if (!rec || !rec.assetId) continue;
      const key = `${rec.assetId.toLowerCase()}|${(rec.assetCode || '').toLowerCase()}`;
      if (seen.has(key) || seen.has(rec.assetId.toLowerCase())) continue;
      seen.add(key);
      seen.add(rec.assetId.toLowerCase());
      result.push(rec);
    }
    return result;
  };

  const deduplicateWarehouseLogs = (logs: WarehouseLog[]): WarehouseLog[] => {
    const seenKeys = new Set<string>();
    const seenIds = new Set<string>();
    const result: WarehouseLog[] = [];
    for (const log of logs) {
      if (!log || typeof log !== 'object') continue;
      if (log.id && seenIds.has(log.id)) continue;
      const normalizedItemKey = (log.assetCode || log.itemName || '').trim().toLowerCase();
      const compositeKey = `${(log.date || '').trim()}|${(log.type || '').trim().toLowerCase()}|${normalizedItemKey}`;
      if (normalizedItemKey && seenKeys.has(compositeKey)) continue;
      if (log.id) seenIds.add(log.id);
      if (normalizedItemKey) seenKeys.add(compositeKey);
      result.push(log);
    }
    return result;
  };

  const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);
  const [scanSearchInput, setScanSearchInput] = useState('');
  const [scanMessage, setScanMessage] = useState('');
  const [pendingUserBarcode, setPendingUserBarcode] = useState<string>('');
  // Mode Scan Alur Logistik Keluar/Masuk & Loading Out/In untuk Seluruh Staff
  const [scannerLogisticsMode, setScannerLogisticsMode] = useState<'inspect' | 'loading_out' | 'loading_in' | 'keluar' | 'masuk'>('inspect');
  const [scanLogisticsQty, setScanLogisticsQty] = useState<number>(1);
  const [scanLogisticsNote, setScanLogisticsNote] = useState<string>('');
  const [autoRecordLogisticsOnScan, setAutoRecordLogisticsOnScan] = useState<boolean>(true);
  const [inlineFormBarcodeInput, setInlineFormBarcodeInput] = useState<string>('');
  const [inlineFormScanFeedback, setInlineFormScanFeedback] = useState<string>('');
  // Active Real Hardware Camera Scanner states (Mobile, Tablet & Desktop)
  const [isCameraScannerActive, setIsCameraScannerActive] = useState<boolean>(true);
  const [isLiveWebcamRunning, setIsLiveWebcamRunning] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [availableCameraDevices, setAvailableCameraDevices] = useState<CameraDeviceInfo[]>([]);
  const [selectedCameraDeviceId, setSelectedCameraDeviceId] = useState<string>('');
  const [cameraHasTorch, setCameraHasTorch] = useState<boolean>(false);
  const [cameraTorchOn, setCameraTorchOn] = useState<boolean>(false);
  const [cameraStatusNote, setCameraStatusNote] = useState<string>('Kamera Scanner Barcode / QR Siap Digunakan');
  const [simulatorTargetDiv, setSimulatorTargetDiv] = useState<'ALL' | 'Audio' | 'Lighting' | 'Multimedia' | 'Videotron'>('ALL');
  const [simulatorTargetCode, setSimulatorTargetCode] = useState<string>('MJXH18277');
  const scannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const scannerStreamRef = useRef<MediaStream | null>(null);
  const lastAutoDetectedCodeRef = useRef<{ code: string; time: number }>({ code: '', time: 0 });

  const stopLiveCameraScanner = () => {
    if (scannerStreamRef.current) {
      scannerStreamRef.current.getTracks().forEach(track => track.stop());
      scannerStreamRef.current = null;
    }
    if (scannerVideoRef.current) {
      scannerVideoRef.current.srcObject = null;
    }
    setIsLiveWebcamRunning(false);
    setCameraTorchOn(false);
  };

  const startLiveCameraScanner = async (overrideFacing?: 'environment' | 'user', overrideDeviceId?: string) => {
    setIsCameraScannerActive(true);
    const targetFacing = overrideFacing || cameraFacingMode;
    const targetDevId = overrideDeviceId !== undefined ? overrideDeviceId : selectedCameraDeviceId;
    try {
      stopLiveCameraScanner();
      const session = await startUniversalCameraStream({
        preferredFacingMode: targetFacing,
        preferredDeviceId: targetDevId || undefined,
        videoElement: scannerVideoRef.current
      });
      scannerStreamRef.current = session.stream;
      setIsLiveWebcamRunning(true);
      setCameraFacingMode(session.facingMode);
      setCameraHasTorch(session.hasTorch);
      setCameraTorchOn(false);
      if (session.deviceId) {
        setSelectedCameraDeviceId(session.deviceId);
      }
      setCameraStatusNote(
        `Kamera Live Aktif (${session.deviceLabel || (targetFacing === 'environment' ? 'Kamera Belakang' : 'Kamera Depan')}) — Arahkan ke Barcode / QR`
      );
      const devices = await listVideoInputDevices();
      if (devices.length > 0) {
        setAvailableCameraDevices(devices);
      }
      setTimeout(() => {
        if (scannerVideoRef.current && scannerStreamRef.current) {
          scannerVideoRef.current.setAttribute('playsinline', 'true');
          scannerVideoRef.current.setAttribute('webkit-playsinline', 'true');
          scannerVideoRef.current.srcObject = scannerStreamRef.current;
          scannerVideoRef.current.play().catch(() => {});
        }
      }, 60);
    } catch {
      setIsLiveWebcamRunning(false);
      setCameraStatusNote('Kamera Siap — Klik "Buka Kamera HP / Tablet" atau izinkan akses kamera browser');
    }
  };

  const handleSwitchCameraFacing = async () => {
    if (availableCameraDevices.length > 1 && selectedCameraDeviceId) {
      const currentIdx = availableCameraDevices.findIndex(d => d.deviceId === selectedCameraDeviceId);
      const nextDev = availableCameraDevices[(currentIdx + 1) % availableCameraDevices.length];
      if (nextDev) {
        setSelectedCameraDeviceId(nextDev.deviceId);
        await startLiveCameraScanner(nextDev.facing === 'user' ? 'user' : 'environment', nextDev.deviceId);
        return;
      }
    }
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(nextFacing);
    await startLiveCameraScanner(nextFacing, '');
  };

  const handleToggleCameraTorch = async () => {
    if (!scannerStreamRef.current) return;
    const nextState = !cameraTorchOn;
    const applied = await toggleCameraTorch(scannerStreamRef.current, nextState);
    setCameraTorchOn(applied);
  };

  useEffect(() => {
    if (warehouseSubTab === 'scanner' && isCameraScannerActive) {
      startLiveCameraScanner();
    } else if (warehouseSubTab !== 'scanner') {
      stopLiveCameraScanner();
    }
    return () => {
      stopLiveCameraScanner();
    };
  }, [warehouseSubTab]);

  // Continuous real-time optical barcode / QR detection loop from live camera stream
  useEffect(() => {
    if (!isLiveWebcamRunning || warehouseSubTab !== 'scanner') return;
    let isCancelled = false;
    let isDetecting = false;

    const intervalId = window.setInterval(async () => {
      if (isCancelled || isDetecting || !scannerVideoRef.current) return;
      const videoEl = scannerVideoRef.current;
      if (videoEl.readyState < 2 || videoEl.videoWidth <= 0) return;

      isDetecting = true;
      try {
        const decoded = await decodeBarcodeFromSource(videoEl);
        if (!isCancelled && decoded && decoded.rawValue && isValidScannedBarcodeText(decoded.rawValue)) {
          const cleanCode = decoded.rawValue.trim();
          const now = Date.now();
          if (
            cleanCode &&
            (lastAutoDetectedCodeRef.current.code !== cleanCode ||
              now - lastAutoDetectedCodeRef.current.time > 3500)
          ) {
            lastAutoDetectedCodeRef.current = { code: cleanCode, time: now };
            const snap = captureSnapshotFromVideo(
              videoEl,
              `SCAN: ${cleanCode} | ${new Date().toLocaleTimeString('id-ID')}`
            );
            if (snap) {
              setScannedPhoto(snap);
            }
            const qLower = cleanCode.toLowerCase();
            const matchedAsset =
              localAssets.find(a => a.code.toLowerCase() === qLower || a.id.toLowerCase() === qLower) ||
              localAssets.find(
                a =>
                  a.serialNumber.toLowerCase().includes(qLower) ||
                  a.code.toLowerCase().includes(qLower) ||
                  a.name.toLowerCase().includes(qLower)
              );
            if (matchedAsset) {
              setPendingUserBarcode('');
              handleSimulateQRScan(cleanCode);
            } else {
              setScanSearchInput(cleanCode.toUpperCase());
              setPendingUserBarcode(cleanCode.toUpperCase());
              setScanMessage(
                `INFO: Kode Barcode User [${cleanCode.toUpperCase()}] berhasil terbaca kamera. Pilih unit alat pada daftar Inventory di atas lalu klik "Simpan Kode Barcode User & Scan" untuk menautkan kode barcode ini.`
              );
            }
          }
        }
      } catch {
        // Ignore single-frame decode errors
      } finally {
        isDetecting = false;
      }
    }, 280);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [isLiveWebcamRunning, warehouseSubTab, localAssets]);

  const [scannedRecords, setScannedRecords] = useState<ScannedAssetRecord[]>(() => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const savedV2 = localStorage.getItem('riz_scanned_asset_records_v1');
        if (savedV2) {
          const parsed = JSON.parse(savedV2);
          if (Array.isArray(parsed)) {
            return deduplicateScanRecords(parsed);
          }
        }
      }
    } catch (e) {}
    return [];
  });

  const registerScannedAsset = (asset: Asset): { isDuplicate: boolean; record: ScannedAssetRecord } => {
    const existing = scannedRecords.find(
      r => r.assetId === asset.id || r.assetCode.toLowerCase() === asset.code.toLowerCase()
    );
    if (existing) {
      return { isDuplicate: true, record: existing };
    }
    const newRec: ScannedAssetRecord = {
      assetId: asset.id,
      assetCode: asset.code,
      scannedBy: currentUser.name,
      scannedByRole: currentUser.role,
      scannedByDivision: currentUser.division,
      scannedAt: new Date().toLocaleString('id-ID')
    };
    setScannedRecords(prev => {
      const next = deduplicateScanRecords([newRec, ...prev]);
      try {
        localStorage.setItem('riz_scanned_asset_records_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    return { isDuplicate: false, record: newRec };
  };

  const handleRemoveScannedAssetFromList = (assetId: string) => {
    setScannedRecords(prev => {
      const next = prev.filter(r => r.assetId !== assetId);
      try {
        localStorage.setItem('riz_scanned_asset_records_v1', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    if (scannedAsset?.id === assetId) {
      setScannedAsset(null);
      setScanMessage('');
    }
  };

  const handleClearAllScannedAssets = () => {
    setScannedRecords([]);
    setScannedAsset(null);
    setScanMessage('');
    try {
      localStorage.removeItem('riz_scanned_asset_records_v1');
      localStorage.removeItem('riz_scanned_asset_ids_v1');
    } catch (e) {}
  };

  // Daftar unit yang HANYA berisi unit yang sudah berhasil di-scan (Tanpa Duplikasi)
  const scannedAssetsWithMeta = deduplicateScanRecords(scannedRecords)
    .map(record => {
      const asset = localAssets.find(a => a.id === record.assetId || a.code.toLowerCase() === record.assetCode.toLowerCase());
      return asset ? { asset, record } : null;
    })
    .filter((item): item is { asset: Asset; record: ScannedAssetRecord } => Boolean(item));

  const scannedAssetsList = scannedAssetsWithMeta.map(item => item.asset);
  const getScanRecordForAsset = (assetIdOrCode?: string): ScannedAssetRecord | undefined => {
    if (!assetIdOrCode) return undefined;
    const key = assetIdOrCode.trim().toLowerCase();
    return scannedRecords.find(r => r.assetId.toLowerCase() === key || r.assetCode.toLowerCase() === key);
  };

  // Filter untuk Tabel Ketersediaan & Alokasi Unit di Manajemen Gudang (Tahap 02)
  const [warehouseUnitDivFilter, setWarehouseUnitDivFilter] = useState<'ALL' | 'Audio' | 'Lighting' | 'Multimedia' | 'Videotron'>('ALL');
  const [warehouseUnitStatusFilter, setWarehouseUnitStatusFilter] = useState<'ALL' | 'SCHEDULED' | 'REPAIR' | 'AVAILABLE'>('ALL');
  const [warehouseUnitSearch, setWarehouseUnitSearch] = useState('');

  // Real-time Cloud Subscription (dengan proteksi Anti-Double Pencatatan)
  useEffect(() => {
    const unsub = subscribeCloudCollection<WarehouseLog>(
      'warehouse_logs',
      'riz_warehouse_logs',
      (rawLogs) => {
        setWarehouseLogs(deduplicateWarehouseLogs(rawLogs || []));
      },
      []
    );
    return () => unsub();
  }, []);

  // Save states
  useEffect(() => {
    localStorage.setItem('riz_warehouse_logs', JSON.stringify(deduplicateWarehouseLogs(warehouseLogs)));
  }, [warehouseLogs]);

  const handleAddWarehouseLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || qty <= 0) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const normalizedCode = (assetCodeInput || '').trim().toUpperCase();
    const normalizedItemKey = (normalizedCode || itemName.trim()).toLowerCase();

    // Proteksi Anti-Double Pencatatan pada History Gudang
    if (!editingLogId) {
      const duplicateLog = warehouseLogs.find(log => {
        const logKey = (log.assetCode || log.itemName || '').trim().toLowerCase();
        return (
          log.date === todayDate &&
          log.type === type &&
          logKey === normalizedItemKey
        );
      });
      if (duplicateLog) {
        alert(
          `Pencatatan Ditolak (Anti-Double Pencatatan):\nUnit "${itemName}" (${normalizedCode || '-'}) sudah tercatat untuk transaksi "${type}" pada tanggal ${todayDate} (Petugas Scan: ${duplicateLog.scannedBy || duplicateLog.pic}).\nHasil scan tidak boleh ada double pencatatan!`
        );
        return;
      }
    }

    const matchedScanRec = getScanRecordForAsset(normalizedCode || itemName);
    const scannerPersonName = matchedScanRec?.scannedBy || currentUser.name;
    const scannerPersonRole = matchedScanRec
      ? `${matchedScanRec.scannedByRole} (${matchedScanRec.scannedByDivision})`
      : `${currentUser.role} (${currentUser.division})`;
    const scannerTimestamp = matchedScanRec?.scannedAt || new Date().toLocaleString('id-ID');

    const newLog: WarehouseLog = {
      id: editingLogId || ('wl-' + Date.now()),
      type,
      date: todayDate,
      itemName: itemName.trim(),
      qty,
      pic: picName || currentUser.name,
      scannedBy: scannerPersonName,
      scannedByRole: scannerPersonRole,
      scannedAt: scannerTimestamp,
      notes,
      assetCode: normalizedCode || undefined,
      photoUrl: scannedPhoto || undefined,
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    };

    if (editingLogId) {
      setWarehouseLogs(prev => deduplicateWarehouseLogs(prev.map(log => log.id === editingLogId ? newLog : log)));
      onLogActivity(currentUser.name, currentUser.role, `Mengedit log gudang: ${type} - ${itemName} (Petugas Scan: ${scannerPersonName})`);
    } else {
      setWarehouseLogs(prev => deduplicateWarehouseLogs([newLog, ...prev]));
      onLogActivity(currentUser.name, currentUser.role, `Mencatat log gudang: ${type} - ${itemName} sebanyak ${qty} Unit (Petugas Scan: ${scannerPersonName})`);
    }
    
    saveCloudDoc('warehouse_logs', newLog.id, newLog, currentUser.name);
    
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

    // Reset form
    setType('Masuk');
    setItemName('');
    setQty(1);
    setNotes('');
    setAssetCodeInput('');
    setScannedPhoto(null);
    setEditingLogId(null);
    setShowLogForm(false);
  };

  const handleEditLogClick = (log: WarehouseLog) => {
    setEditingLogId(log.id);
    setType(log.type);
    setItemName(log.itemName);
    setQty(log.qty);
    setPicName(log.pic);
    setNotes(log.notes || '');
    setAssetCodeInput(log.assetCode || '');
    setScannedPhoto(log.photoUrl || null);
    setShowLogForm(true);
    // Scroll to form (Optional: window.scrollTo(0,0) or rely on user scroll)
  };

  const handleDeleteLogClick = (logId: string) => {
    if (window.confirm('Yakin ingin menghapus catatan logistik gudang ini?')) {
      setWarehouseLogs(prev => prev.filter(log => log.id !== logId));
      deleteCloudDoc('warehouse_logs', logId);
      onLogActivity(currentUser.name, currentUser.role, `Menghapus log gudang (${logId})`);
    }
  };

  // Fleet, Drivers, and Vehicles Subscriptions (only if no props passed from App.tsx)
  useEffect(() => {
    // If props are passed, App.tsx already subscribes - skip to avoid double subscription
    if (propFleetAssignments !== undefined && propVehicles !== undefined && propDriverList !== undefined) return;

    const unsubAssignments = subscribeCloudCollection<FleetAssignment>(
      'fleet_assignments',
      'riz_fleet_assignments',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((f): f is FleetAssignment => Boolean(f && typeof f === 'object' && (f.spjNumber || f.driverName)));
        setLocalFleetAssignments(valid);
      },
      []
    );
    const unsubVehicles = subscribeCloudCollection<VehicleMaster>(
      'master_vehicles',
      'riz_master_vehicles',
      (rawItems) => {
        setLocalVehicles(normalizeVehiclesMaster(rawItems || []));
      },
      INITIAL_VEHICLES
    );
    const unsubDrivers = subscribeCloudCollection<FleetDriver>(
      'fleet_drivers',
      'riz_fleet_drivers',
      (rawItems) => {
        const flat = (rawItems || []).flatMap(item => (item && Array.isArray((item as any).list)) ? (item as any).list : [item]);
        const valid = flat.filter((d): d is FleetDriver => Boolean(d && typeof d === 'object' && d.name));
        setLocalDriverList(valid);
      },
      INITIAL_FLEET_DRIVERS
    );

    return () => {
      unsubAssignments();
      unsubVehicles();
      unsubDrivers();
    };
  }, [propFleetAssignments, propVehicles, propDriverList]);

  const saveFleetAssignments = (updated: FleetAssignment[]) => {
    if (propOnAddFleetAssignment) {
      // handled by props
      localStorage.setItem('riz_fleet_assignments', JSON.stringify(updated));
      pushCollectionToCloud('fleet_assignments', updated, currentUser.name);
    } else {
      setLocalFleetAssignments(updated);
      localStorage.setItem('riz_fleet_assignments', JSON.stringify(updated));
      pushCollectionToCloud('fleet_assignments', updated, currentUser.name);
    }
    onLogActivity(currentUser.name, currentUser.role, 'Gudang memperbarui penugasan armada');
  };

  // Master Vehicles Subscription / Persistence
  const saveVehicles = (updated: VehicleMaster[], savedDoc?: VehicleMaster) => {
    if (propOnUpdateVehicle && savedDoc) {
      propOnUpdateVehicle(savedDoc.id, savedDoc);
    }
    setLocalVehicles(updated);
    localStorage.setItem('riz_master_vehicles', JSON.stringify(updated));
    pushCollectionToCloud('master_vehicles', updated, currentUser.name);
    if (savedDoc) {
      saveCloudDoc('master_vehicles', savedDoc.id, savedDoc, currentUser.name);
    }
    onLogActivity(currentUser.name, currentUser.role, 'Gudang memperbarui database kendaraan armada');
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleFormData.name || !vehicleFormData.policeNumber) {
      alert('Nama Armada dan Nomor Polisi wajib diisi!');
      return;
    }

    const nowIso = new Date().toISOString();

    if (selectedVehicle) {
      // Edit
      const sortedHist = sortMaintenanceHistoryDesc(
        Array.isArray(vehicleFormData.maintenanceHistory)
          ? vehicleFormData.maintenanceHistory
          : selectedVehicle.maintenanceHistory
      );
      const computedCost = Array.isArray(vehicleFormData.maintenanceHistory)
        ? sortedHist.reduce((sum, mh) => sum + Number(mh?.cost || 0), 0)
        : (typeof vehicleFormData.totalMaintenanceCost === 'number'
            ? vehicleFormData.totalMaintenanceCost
            : selectedVehicle.totalMaintenanceCost);

      const updatedVeh: VehicleMaster = {
        ...selectedVehicle,
        ...vehicleFormData,
        name: vehicleFormData.name.trim(),
        policeNumber: vehicleFormData.policeNumber.toUpperCase().trim(),
        tonnageCapacity: Number(vehicleFormData.tonnageCapacity ?? selectedVehicle.tonnageCapacity ?? 1),
        cbmCapacity: Number(vehicleFormData.cbmCapacity ?? selectedVehicle.cbmCapacity ?? 1.5),
        odometerKM: Number(vehicleFormData.odometerKM ?? selectedVehicle.odometerKM ?? 0),
        stnkTaxExpiry: vehicleFormData.stnkTaxExpiry || selectedVehicle.stnkTaxExpiry,
        kirExpiry: vehicleFormData.kirExpiry || selectedVehicle.kirExpiry,
        status: vehicleFormData.status || selectedVehicle.status || 'Siap Operasi',
        maintenanceHistory: sortedHist,
        totalMaintenanceCost: computedCost,
        _userEdited: true,
        _syncMeta: {
          updatedAt: nowIso,
          updatedBy: currentUser.name,
          _userEdited: true
        }
      } as VehicleMaster;

      const updated = vehicles.map(v => v.id === selectedVehicle.id ? updatedVeh : v);
      saveVehicles(updated, updatedVeh);
      onLogActivity(currentUser.name, currentUser.role, `Memperbarui data master armada: ${updatedVeh.name} (${updatedVeh.policeNumber})`);
    } else {
      // New
      const sortedHist = sortMaintenanceHistoryDesc(vehicleFormData.maintenanceHistory || []);
      const computedCost = sortedHist.reduce((sum, mh) => sum + Number(mh?.cost || 0), 0);
      const newVeh: VehicleMaster = {
        id: 'veh-' + Date.now(),
        name: vehicleFormData.name.trim(),
        ownership: vehicleFormData.ownership || 'Internal',
        policeNumber: vehicleFormData.policeNumber.toUpperCase().trim(),
        vehicleType: vehicleFormData.vehicleType || 'Truk Box CDD (6 Roda)',
        tonnageCapacity: Number(vehicleFormData.tonnageCapacity || 3.0),
        cbmCapacity: Number(vehicleFormData.cbmCapacity || 15.0),
        odometerKM: Number(vehicleFormData.odometerKM || 0),
        stnkTaxExpiry: vehicleFormData.stnkTaxExpiry || new Date().toISOString().split('T')[0],
        kirExpiry: vehicleFormData.kirExpiry || new Date().toISOString().split('T')[0],
        status: vehicleFormData.status || 'Siap Operasi',
        maintenanceHistory: sortedHist,
        totalMaintenanceCost: computedCost,
        _userEdited: true,
        _syncMeta: {
          updatedAt: nowIso,
          updatedBy: currentUser.name,
          _userEdited: true
        }
      } as VehicleMaster;
      const updated = [newVeh, ...vehicles];
      saveVehicles(updated, newVeh);
      onLogActivity(currentUser.name, currentUser.role, `Menambahkan master armada baru: ${newVeh.name} (${newVeh.policeNumber})`);
    }

    setShowVehicleModal(false);
    setSelectedVehicle(null);
  };

  const handleDeleteVehicle = (id: string) => {
    const target = vehicles.find(v => v.id === id);
    if (confirm('Hapus unit armada ini dari master database?')) {
      const updated = vehicles.filter(v => v.id !== id);
      deleteCloudDoc('master_vehicles', id, target?.policeNumber);
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
      spjNumber: `SPJ/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(Math.floor(Date.now() % 10000)).padStart(4, '0')}`,
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
      vehicleType: 'SUZUKI CARRY',
      policeNumber: 'F 8433 BF',
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

  // Penautan & Penyimpanan Kode Barcode yang Disertakan User ke Unit Alat Inventory
  const handleAssignUserBarcodeToAsset = (assetId: string, rawBarcode: string) => {
    const cleanBarcode = rawBarcode.trim().toUpperCase();
    if (!cleanBarcode) return;
    const targetAsset =
      localAssets.find(a => a.id === assetId) ||
      localAssets.find(a => a.code === simulatorTargetCode) ||
      localAssets[0];
    if (!targetAsset) return;

    const updatedAsset: Asset & { _userEdited?: boolean } = {
      ...targetAsset,
      code: cleanBarcode,
      _userEdited: true
    };

    const updatedList = localAssets.map(a => (a.id === targetAsset.id ? updatedAsset : a));
    setLocalAssets(updatedList);
    try {
      localStorage.setItem('riz_assets', JSON.stringify(updatedList));
    } catch {}
    saveCloudDoc('assets', updatedAsset.id, updatedAsset);

    setSimulatorTargetCode(cleanBarcode);
    setScanSearchInput(cleanBarcode);
    setPendingUserBarcode('');
    const scanRes = registerScannedAsset(updatedAsset);
    setScannedAsset(updatedAsset);
    setScanMessage(
      `SUKSES: Kode Barcode User [${cleanBarcode}] berhasil disertakan ke unit ${updatedAsset.name} dan di-scan oleh ${scanRes.record.scannedBy} (${scanRes.record.scannedAt})!`
    );
    onLogActivity(
      currentUser.name,
      currentUser.role,
      `Menyertakan kode barcode user [${cleanBarcode}] ke unit ${updatedAsset.name} & melakukan scan — Petugas: ${currentUser.name}`
    );
  };

  // Fungsi Pencatatan Langsung Alur Logistik Keluar/Masuk & Loading Out/In via Scan Barcode oleh Staff
  const recordLogisticsScanMovement = (
    targetAsset: Asset,
    movementType: 'Loading' | 'Unloading' | 'Keluar' | 'Masuk',
    movementQty: number,
    customNote?: string
  ): { isDuplicate: boolean; record: WarehouseLog } => {
    const todayDate = new Date().toISOString().split('T')[0];
    const normalizedCode = targetAsset.code.trim().toUpperCase();
    const normalizedItemKey = normalizedCode.toLowerCase();

    const duplicateLog = warehouseLogs.find(log => {
      const logKey = (log.assetCode || log.itemName || '').trim().toLowerCase();
      return log.date === todayDate && log.type === movementType && logKey === normalizedItemKey;
    });

    if (duplicateLog) {
      return { isDuplicate: true, record: duplicateLog };
    }

    const scanRes = registerScannedAsset(targetAsset);
    const qtySafe = Math.max(1, Number(movementQty) || 1);
    const movementLabel =
      movementType === 'Loading'
        ? 'Loading Out (Muat Barang Keluar Event)'
        : movementType === 'Unloading'
        ? 'Loading In (Bongkar Barang Masuk Gudang)'
        : movementType === 'Keluar'
        ? 'Alur Logistik Barang Keluar'
        : 'Alur Logistik Barang Masuk Gudang';

    const noteText = customNote?.trim()
      ? `${movementLabel} [${normalizedCode}] — ${customNote.trim()} (Scan oleh: ${currentUser.name})`
      : `${movementLabel} [${normalizedCode}] via Scan Barcode oleh ${currentUser.name} (${currentUser.division})`;

    const newLog: WarehouseLog = {
      id: 'wl-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: movementType,
      date: todayDate,
      itemName: targetAsset.name,
      qty: qtySafe,
      pic: currentUser.name,
      scannedBy: currentUser.name,
      scannedByRole: `${currentUser.role} (${currentUser.division})`,
      scannedAt: scanRes.record.scannedAt || new Date().toLocaleString('id-ID'),
      notes: noteText,
      assetCode: normalizedCode,
      photoUrl: scannedPhoto || undefined,
      _syncMeta: {
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.name
      }
    };

    const nextLogs = deduplicateWarehouseLogs([newLog, ...warehouseLogs]);
    setWarehouseLogs(nextLogs);
    try {
      localStorage.setItem('riz_warehouse_logs', JSON.stringify(nextLogs));
    } catch {}
    saveCloudDoc('warehouse_logs', newLog.id, newLog, currentUser.name);

    const nextLocation =
      movementType === 'Loading' || movementType === 'Keluar'
        ? customNote?.trim()
          ? `Event / Loading Out (${customNote.trim()})`
          : 'Lapangan / Loading Out Event'
        : 'Gudang Utama RIZ';

    const updatedAssets = localAssets.map(a =>
      a.id === targetAsset.id ? { ...a, location: nextLocation } : a
    );
    setLocalAssets(updatedAssets);
    try {
      localStorage.setItem('riz_assets', JSON.stringify(updatedAssets));
    } catch {}
    if (onUpdateAssetLocation) onUpdateAssetLocation(targetAsset.id, nextLocation);

    onLogActivity(
      currentUser.name,
      currentUser.role,
      `Scan ${movementLabel}: [${normalizedCode}] ${targetAsset.name} (${qtySafe} Unit) — Petugas: ${currentUser.name}`
    );

    return { isDuplicate: false, record: newLog };
  };

  const handleQuickLogisticsScanAction = (
    targetAsset: Asset,
    movementType: 'Loading' | 'Unloading' | 'Keluar' | 'Masuk'
  ) => {
    const res = recordLogisticsScanMovement(targetAsset, movementType, scanLogisticsQty, scanLogisticsNote);
    const labelUpper =
      movementType === 'Loading'
        ? 'LOADING OUT (KELUAR EVENT)'
        : movementType === 'Unloading'
        ? 'LOADING IN (MASUK GUDANG)'
        : movementType === 'Keluar'
        ? 'BARANG KELUAR'
        : 'BARANG MASUK';
    if (res.isDuplicate) {
      setScanMessage(
        `DUPLIKAT DICEGAH: Unit [${targetAsset.code}] ${targetAsset.name} sudah tercatat untuk proses ${labelUpper} hari ini oleh ${res.record.scannedBy || res.record.pic}.`
      );
    } else {
      setScanMessage(
        `SUKSES CATAT ${labelUpper}: Unit [${targetAsset.code}] ${targetAsset.name} (${res.record.qty} Unit) berhasil dicatat dalam Alur Logistik oleh ${currentUser.name} (${currentUser.division})!`
      );
      setScannedAsset({
        ...targetAsset,
        location:
          movementType === 'Loading' || movementType === 'Keluar'
            ? scanLogisticsNote.trim()
              ? `Event / Loading Out (${scanLogisticsNote.trim()})`
              : 'Lapangan / Loading Out Event'
            : 'Gudang Utama RIZ'
      });
    }
  };

  // Asset scanning with camera / input — Mendukung Manajemen Gudang + Alur Logistik Keluar/Masuk & Loading Out/In Staff
  const handleSimulateQRScan = (codeToScan?: string) => {
    setIsCameraScannerActive(true);
    const targetCode = (codeToScan || scanSearchInput || simulatorTargetCode || 'MJXH18277').trim();
    if (!scanSearchInput.trim() && targetCode) {
      setScanSearchInput(targetCode);
    }
    setIsScanningSimulated(true);
    setScanMessage(`🎥 Kamera Laser Scanner aktif memindai barcode/QR [${targetCode.toUpperCase()}]...`);

    setTimeout(() => {
      const qLower = targetCode.toLowerCase();
      const found =
        localAssets.find(a => a.code.toLowerCase() === qLower || a.id.toLowerCase() === qLower) ||
        localAssets.find(a =>
          a.serialNumber.toLowerCase().includes(qLower) ||
          a.code.toLowerCase().includes(qLower) ||
          a.name.toLowerCase().includes(qLower)
        );

      if (found) {
        setPendingUserBarcode('');
        setSimulatorTargetCode(found.code);
        setScanSearchInput(found.code);
        const scanRes = registerScannedAsset(found);
        setScannedAsset(found);

        if (scannerLogisticsMode !== 'inspect' && autoRecordLogisticsOnScan) {
          const movementType: 'Loading' | 'Unloading' | 'Keluar' | 'Masuk' =
            scannerLogisticsMode === 'loading_out'
              ? 'Loading'
              : scannerLogisticsMode === 'loading_in'
              ? 'Unloading'
              : scannerLogisticsMode === 'keluar'
              ? 'Keluar'
              : 'Masuk';
          const logRes = recordLogisticsScanMovement(found, movementType, scanLogisticsQty, scanLogisticsNote);
          const modeLabel =
            movementType === 'Loading'
              ? 'LOADING OUT (KELUAR EVENT)'
              : movementType === 'Unloading'
              ? 'LOADING IN (MASUK GUDANG)'
              : movementType === 'Keluar'
              ? 'BARANG KELUAR'
              : 'BARANG MASUK';
          if (logRes.isDuplicate) {
            setScanMessage(
              `DUPLIKAT DICEGAH: Barcode [${found.code}] ${found.name} sudah tercatat untuk proses ${modeLabel} hari ini oleh ${logRes.record.scannedBy || logRes.record.pic}.`
            );
          } else {
            setScanMessage(
              `SUKSES SCAN & CATAT ${modeLabel}: Barcode [${found.code}] ${found.name} (${logRes.record.qty} Unit) berhasil dicatat oleh ${currentUser.name} (${currentUser.division})!`
            );
          }
        } else if (scanRes.isDuplicate) {
          setScanMessage(
            `DUPLIKAT DICEGAH: Barcode [${found.code}] ${found.name} sudah tercatat di-scan oleh ${scanRes.record.scannedBy} (${scanRes.record.scannedAt}). Pilih tombol Loading Out / Loading In di sebelah kanan untuk mencatat alur logistik.`
          );
        } else {
          setScanMessage(
            `SUKSES: Barcode [${found.code}] ${found.name} berhasil di-scan oleh ${scanRes.record.scannedBy} (${scanRes.record.scannedAt})! Siap dicatat ke Alur Logistik Keluar/Masuk atau Loading Out/In.`
          );
          onLogActivity(
            currentUser.name,
            currentUser.role,
            `Melakukan scan barcode asset: ${found.code} (${found.name}) — Petugas Scan: ${currentUser.name}`
          );
        }
      } else {
        setScannedAsset(null);
        setPendingUserBarcode(targetCode.toUpperCase());
        setScanMessage(
          `INFO: Kode Barcode User "${targetCode.toUpperCase()}" siap disertakan. Pilih unit alat pada kolom Inventory lalu klik "Simpan Kode Barcode User & Scan" untuk menautkan kode barcode ini.`
        );
      }
      setIsScanningSimulated(false);
    }, 220);
  };

  const handleCaptureAndDecodeLiveFrame = async () => {
    if (isLiveWebcamRunning && scannerVideoRef.current) {
      const videoEl = scannerVideoRef.current;
      const decoded = await decodeBarcodeFromSource(videoEl);
      const validDecoded =
        decoded?.rawValue && isValidScannedBarcodeText(decoded.rawValue) ? decoded.rawValue.trim() : '';
      const targetCode = (validDecoded || scanSearchInput.trim() || simulatorTargetCode || 'MJXH18277').trim();
      const snap = captureSnapshotFromVideo(
        videoEl,
        `SCAN: ${targetCode} | ${new Date().toLocaleTimeString('id-ID')}`
      );
      if (snap) {
        setScannedPhoto(snap);
      }
      handleSimulateQRScan(targetCode);
      return;
    }
    handleSimulateQRScan();
  };

  const handleBarcodeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let detectedBarcodeValue = '';
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(file);
        const decoded = await decodeBarcodeFromSource(bitmap);
        if (decoded && decoded.rawValue) {
          detectedBarcodeValue = String(decoded.rawValue).trim();
        }
      } catch {
        // Fallback to HTMLImageElement decode
      }
    }
    const fileNameClean = file.name.replace(/\.[^.]+$/, '').trim();
    const matchedFromFileName = localAssets.find(
      a =>
        fileNameClean.toLowerCase().includes(a.code.toLowerCase()) ||
        a.name.toLowerCase().includes(fileNameClean.toLowerCase())
    );
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        setScannedPhoto(reader.result);
        if (!detectedBarcodeValue && typeof Image !== 'undefined') {
          try {
            const img = new Image();
            img.src = reader.result;
            await new Promise<void>(resolve => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
            const decodedFromImg = await decodeBarcodeFromSource(img);
            if (decodedFromImg && decodedFromImg.rawValue) {
              detectedBarcodeValue = String(decodedFromImg.rawValue).trim();
            }
          } catch {}
        }
      }
      const codeToUse =
        detectedBarcodeValue ||
        matchedFromFileName?.code ||
        scanSearchInput.trim() ||
        simulatorTargetCode ||
        'MJXH18277';
      handleSimulateQRScan(codeToUse);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Scan Barcode / QR langsung pada Formulir Pencatatan Alur Logistik Masuk/Keluar & Loading Out/In
  const handleInlineLogisticsFormScan = (rawCode?: string) => {
    const queryCode = (rawCode || inlineFormBarcodeInput || assetCodeInput || '').trim();
    if (!queryCode) {
      setInlineFormScanFeedback('INFO: Masukkan atau scan kode barcode unit alat terlebih dahulu.');
      return;
    }
    const qLower = queryCode.toLowerCase();
    const matched =
      localAssets.find(a => a.code.toLowerCase() === qLower || a.id.toLowerCase() === qLower) ||
      localAssets.find(
        a =>
          a.serialNumber.toLowerCase().includes(qLower) ||
          a.code.toLowerCase().includes(qLower) ||
          a.name.toLowerCase().includes(qLower)
      );

    if (matched) {
      registerScannedAsset(matched);
      setScannedAsset(matched);
      setAssetCodeInput(matched.code);
      setItemName(matched.name);
      setInlineFormBarcodeInput(matched.code);
      setInlineFormScanFeedback(
        `SUKSES SCAN: [${matched.code}] ${matched.name} (${matched.division}) siap dicatat sebagai "${type === 'Loading' ? 'Loading Out (Muat Keluar)' : type === 'Unloading' ? 'Loading In (Bongkar Masuk)' : type}" oleh ${currentUser.name}.`
      );
      if (!notes.trim()) {
        setNotes(
          type === 'Loading'
            ? `Loading Out (Muat Barang Keluar Event) via Scan Barcode [${matched.code}] oleh ${currentUser.name}`
            : type === 'Unloading'
            ? `Loading In (Bongkar Barang Masuk Gudang) via Scan Barcode [${matched.code}] oleh ${currentUser.name}`
            : type === 'Keluar'
            ? `Alur Logistik Barang Keluar via Scan Barcode [${matched.code}] oleh ${currentUser.name}`
            : `Alur Logistik Barang Masuk Gudang via Scan Barcode [${matched.code}] oleh ${currentUser.name}`
        );
      }
    } else {
      setAssetCodeInput(queryCode.toUpperCase());
      setInlineFormScanFeedback(
        `INFO: Kode Barcode [${queryCode.toUpperCase()}] disertakan ke formulir. Isi Nama Barang atau pilih unit di bawah lalu klik Simpan Transaksi.`
      );
    }
  };

  const handleInlineLogisticsFormImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let detectedBarcodeValue = '';
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(file);
        const decoded = await decodeBarcodeFromSource(bitmap);
        if (decoded && decoded.rawValue && isValidScannedBarcodeText(decoded.rawValue)) {
          detectedBarcodeValue = String(decoded.rawValue).trim();
        }
      } catch {}
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (typeof reader.result === 'string') {
        setScannedPhoto(reader.result);
        if (!detectedBarcodeValue && typeof Image !== 'undefined') {
          try {
            const img = new Image();
            img.src = reader.result;
            await new Promise<void>(resolve => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            });
            const decodedFromImg = await decodeBarcodeFromSource(img);
            if (decodedFromImg && decodedFromImg.rawValue && isValidScannedBarcodeText(decodedFromImg.rawValue)) {
              detectedBarcodeValue = String(decodedFromImg.rawValue).trim();
            }
          } catch {}
        }
      }
      const codeToApply = detectedBarcodeValue || inlineFormBarcodeInput.trim() || assetCodeInput.trim();
      if (codeToApply) {
        handleInlineLogisticsFormScan(codeToApply);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
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
      {/* Title Header & Tab Navigasi (Khusus Manajemen Logistik & Gudang — Tidak Tampil di Panel Susunan Unit Inventory) */}
      {warehouseSubTab !== 'inventory' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight">Manajemen Logistik & Gudang</h1>

            {/* Action Toggle Tabs (Disusun Sesuai Urutan Alur Kerja) */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start overflow-x-auto no-scrollbar touch-scroll max-w-full">
              <button
                onClick={() => {
                  setWarehouseSubTab('scanner');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  warehouseSubTab === 'scanner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>1. Scan Barcode/QR Asset</span>
              </button>

              <button
                onClick={() => {
                  setWarehouseSubTab('logs');
                  if (onNavigateTab) onNavigateTab('gudang');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  warehouseSubTab === 'logs' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>2. Alur Logistik Masuk/Keluar</span>
              </button>

              {isAdminDivision && (
                <button
                  onClick={() => {
                    setWarehouseSubTab('armada_governance');
                    if (onNavigateTab) onNavigateTab('armada');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                    warehouseSubTab === 'armada_governance' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>3. Tata Kelola Armada & Biaya Sewa</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* VIEW 1: WAREHOUSE ACTIVITY LOGS (LOADING OUT / LOADING IN & MUTASI SERVIS) */}
      {warehouseSubTab === 'logs' && (() => {
        const assetsWithAvail = localAssets.map(asset => ({
          asset,
          avail: calculateInventoryAssetAvailability(asset, inventoryCalcCtx),
          typeInfo: getInventoryAssetTypeInfo(asset)
        }));

        const unitsInRepairList = assetsWithAvail.filter(
          item => item.avail.totalDamagedUnits > 0 || item.asset.location === 'Divisi SERVICE (Sedang Diperbaiki)'
        );

        return (
        <div className="space-y-6">
          {/* 2-Column Grid for Warehouse Logistics Logs and Service Division Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Pencatatan Alur Logistik & History Gudang (col-span 2) */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Action Bar Pencatatan Alur Logistik */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    Pencatatan Alur Logistik Masuk/Keluar (Loading Out &amp; Loading In)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Catat pengeluaran unit (Loading Out) dan pemasukan unit kembali ke gudang (Loading In) melalui scan barcode atau formulir logistik.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setScannerLogisticsMode('loading_out');
                      setAutoRecordLogisticsOnScan(true);
                      setWarehouseSubTab('scanner');
                    }}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="Buka Scanner Kamera untuk Loading Out (Barang Keluar Event) oleh Staff"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan Loading Out</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScannerLogisticsMode('loading_in');
                      setAutoRecordLogisticsOnScan(true);
                      setWarehouseSubTab('scanner');
                    }}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="Buka Scanner Kamera untuk Loading In (Barang Masuk Gudang) oleh Staff"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Scan Loading In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (showLogForm) {
                        setShowLogForm(false);
                        setEditingLogId(null);
                      } else {
                        setType('Loading');
                        setItemName('');
                        setQty(1);
                        setNotes('');
                        setAssetCodeInput('');
                        setInlineFormBarcodeInput('');
                        setInlineFormScanFeedback('');
                        setScannedPhoto(null);
                        setShowLogForm(true);
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showLogForm ? 'Tutup Formulir' : 'Catat Aktivitas Gudang'}</span>
                  </button>
                </div>
              </div>

              {/* Warehouse log Form */}
              {showLogForm && (
                <form onSubmit={handleAddWarehouseLog} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-sm font-bold text-slate-800">
                        {editingLogId ? 'Edit Logistik Gudang' : 'Formulir Alur Logistik Masuk/Keluar & Loading Out/In Staff'}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Petugas: {currentUser.name} ({currentUser.division})
                    </span>
                  </div>

                  {/* Scan Barcode / QR Langsung pada Formulir Logistik Masuk/Keluar & Loading Out/In */}
                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label className="text-[11px] font-extrabold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Scan Barcode / QR Unit (Loading Out / Loading In / Masuk / Keluar)</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <label className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer">
                          <Smartphone className="w-3 h-3" />
                          <span>Kamera HP</span>
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleInlineLogisticsFormImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setScannerLogisticsMode(
                              type === 'Loading'
                                ? 'loading_out'
                                : type === 'Unloading'
                                ? 'loading_in'
                                : type === 'Keluar'
                                ? 'keluar'
                                : 'masuk'
                            );
                            setAutoRecordLogisticsOnScan(true);
                            setWarehouseSubTab('scanner');
                          }}
                          className="px-2 py-1 bg-slate-900 hover:bg-indigo-800 text-white rounded text-[10px] font-mono font-bold uppercase cursor-pointer"
                        >
                          Kamera Live Full-Scan ↗
                        </button>
                      </div>
                    </div>

                    {/* Input Scan Barcode Langsung di Formulir */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={inlineFormBarcodeInput}
                        onChange={(e) => setInlineFormBarcodeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleInlineLogisticsFormScan(inlineFormBarcodeInput);
                          }
                        }}
                        placeholder="Scan / Ketik Kode Barcode Unit (e.g. MJXH18277, C450B-01)"
                        className="flex-1 px-3 py-1.5 border border-indigo-200 rounded-lg text-xs font-mono uppercase bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleInlineLogisticsFormScan(inlineFormBarcodeInput)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-mono font-extrabold uppercase shrink-0 cursor-pointer"
                      >
                        Scan &amp; Isi Unit
                      </button>
                    </div>

                    {/* Dropdown Pilih Cepat dari Seluruh Unit Inventory atau Hasil Scan */}
                    <select
                      value={assetCodeInput}
                      onChange={(e) => {
                        const selectedCode = e.target.value;
                        if (selectedCode) {
                          handleInlineLogisticsFormScan(selectedCode);
                        } else {
                          setAssetCodeInput('');
                        }
                      }}
                      className="block w-full px-3 py-1.5 border border-indigo-200 rounded-lg text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="">
                        -- Pilih Cepat Unit dari Inventory / Hasil Scan ({localAssets.length} Unit) --
                      </option>
                      {scannedAssetsList.length > 0 && (
                        <optgroup label={`Unit yang Baru Di-Scan (${scannedAssetsList.length})`}>
                          {scannedAssetsList.map(scanned => (
                            <option key={`scanned-${scanned.id}`} value={scanned.code}>
                              ✓ [{scanned.code}] {scanned.name} — ({scanned.condition})
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label={`Seluruh Master Unit Inventory (${localAssets.length})`}>
                        {localAssets.map(assetItem => (
                          <option key={`inv-${assetItem.id}`} value={assetItem.code}>
                            [{assetItem.code}] {assetItem.name} ({assetItem.division})
                          </option>
                        ))}
                      </optgroup>
                    </select>

                    {inlineFormScanFeedback && (
                      <div className="text-[11px] font-mono px-2.5 py-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {inlineFormScanFeedback}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Tipe Proses Alur Logistik
                      </label>
                      <select
                        value={type === 'Keluar' ? 'Loading' : type === 'Masuk' ? 'Unloading' : type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/50 font-semibold text-slate-800"
                      >
                        <option value="Loading">Loading Out / Barang Keluar (Muat ke Event)</option>
                        <option value="Unloading">Loading In / Barang Masuk (Kembali ke Gudang)</option>
                        <option value="Servis Keluar">Servis Keluar (Kirim ke Divisi SERVICE)</option>
                        <option value="Servis Masuk">Servis Masuk (Terima dari Divisi SERVICE)</option>
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
                      <a
                        href="https://drive.google.com/drive/folders/1s_mRU4FzBm29SKvsmNWlBlz1rfL3b90h?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                      >
                        Lampirkan Bukti Foto/Dokumen ke Folder Drive (Logistik Gudang)
                      </a>
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

              {/* History Gudang & Riwayat Proses Scan (Wajib Menyertakan Siapa yang Melakukan Proses Scan & Anti-Double Pencatatan) */}
              {(() => {
                const uniqueLogs = deduplicateWarehouseLogs(warehouseLogs);
                const loggedCodes = new Set(
                  uniqueLogs
                    .map(l => (l.assetCode || '').trim().toLowerCase())
                    .filter(Boolean)
                );

                // Gabungkan hasil scan yang belum masuk ke transaksi mutasi agar setiap proses scan langsung tercatat di History Gudang tanpa duplikasi
                const scanOnlyEntries = scannedAssetsWithMeta.filter(
                  ({ asset }) => !loggedCodes.has(asset.code.trim().toLowerCase())
                );

                const totalHistoryCount = uniqueLogs.length + scanOnlyEntries.length;

                return (
                  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide block">
                          History Gudang &amp; Riwayat Proses Scan ({totalHistoryCount} Catatan Unik)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Menampilkan siapa yang melakukan proses scan pada setiap unit. Sistem otomatis memblokir double pencatatan hasil scan.
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold self-start sm:self-auto">
                        Anti-Double Scan Aktif
                      </span>
                    </div>
                    <div className="overflow-x-auto touch-scroll">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-mono font-bold text-[10px]">
                          <tr>
                            <th scope="col" className="p-3">Tanggal / Waktu Scan</th>
                            <th scope="col" className="p-3">Tipe Proses</th>
                            <th scope="col" className="p-3">Nama Barang &amp; Kode Unit</th>
                            <th scope="col" className="p-3 text-center">QTY</th>
                            <th scope="col" className="p-3 bg-indigo-50/60 text-indigo-900">Petugas Scan (Siapa yang Scan)</th>
                            <th scope="col" className="p-3">PIC Gudang</th>
                            <th scope="col" className="p-3">Catatan</th>
                            <th scope="col" className="p-3 text-center sticky right-0 bg-slate-50 shadow-[-4px_0_10px_rgba(0,0,0,0.05)] z-10">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                          {uniqueLogs.map((log) => {
                            const linkedScan = getScanRecordForAsset(log.assetCode || log.itemName);
                            const scannerName = log.scannedBy || linkedScan?.scannedBy || log._syncMeta?.updatedBy || log.pic;
                            const scannerRole = log.scannedByRole || (linkedScan ? `${linkedScan.scannedByRole} (${linkedScan.scannedByDivision})` : 'Staff Gudang');
                            const scannerTime = log.scannedAt || linkedScan?.scannedAt || log.date;

                            return (
                              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 font-mono text-[11px]">
                                  <div className="font-bold text-slate-800">{log.date}</div>
                                  <div className="text-[10px] text-slate-400">{scannerTime}</div>
                                </td>
                                <td className="p-3">
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
                                <td className="p-3">
                                  <div className="font-semibold text-slate-800">{log.itemName}</div>
                                  {log.assetCode && (
                                    <span className="font-mono text-[10px] text-indigo-600 font-bold">{log.assetCode}</span>
                                  )}
                                </td>
                                <td className="p-3 text-center font-bold">{log.qty} Unit</td>
                                <td className="p-3 bg-indigo-50/20">
                                  <div className="flex items-center gap-1.5">
                                    <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    <div>
                                      <div className="font-bold text-slate-900 text-xs">{scannerName}</div>
                                      <div className="text-[10px] text-indigo-700 font-medium">{scannerRole}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 font-medium">{log.pic}</td>
                                <td className="p-3 text-slate-500 max-w-[160px] truncate" title={log.notes}>{log.notes}</td>
                                <td className="p-3 whitespace-nowrap text-center space-x-1 sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.05)] z-10 group-hover:bg-slate-50/50 transition-colors">
                                  <button
                                    type="button"
                                    onClick={() => handleEditLogClick(log)}
                                    className="px-2 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors cursor-pointer"
                                    title="Edit Aktivitas"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLogClick(log.id)}
                                    className="px-2 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 rounded hover:bg-rose-100 transition-colors cursor-pointer"
                                    title="Hapus Data Ini"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {scanOnlyEntries.map(({ asset, record }) => (
                            <tr key={`scan-rec-${asset.id}`} className="hover:bg-slate-50/50 transition-colors bg-emerald-50/15">
                              <td className="p-3 font-mono text-[11px]">
                                <div className="font-bold text-slate-800">{record.scannedAt}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Hasil Scan Barcode
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-slate-800">{asset.name}</div>
                                <span className="font-mono text-[10px] text-indigo-600 font-bold">{asset.code}</span>
                              </td>
                              <td className="p-3 text-center font-bold">1 Kelompok</td>
                              <td className="p-3 bg-indigo-50/20">
                                <div className="flex items-center gap-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <div>
                                    <div className="font-bold text-slate-900 text-xs">{record.scannedBy}</div>
                                    <div className="text-[10px] text-indigo-700 font-medium">
                                      {record.scannedByRole} ({record.scannedByDivision})
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-medium">{record.scannedBy}</td>
                              <td className="p-3 text-slate-500 max-w-[180px] truncate">
                                Unit berhasil di-scan oleh {record.scannedBy} (Kondisi: {asset.condition})
                              </td>
                              <td className="p-3 whitespace-nowrap text-center space-x-1 sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.05)] z-10">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveScannedAssetFromList(asset.id)}
                                  className="px-2 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 rounded hover:bg-rose-100 transition-colors cursor-pointer"
                                  title="Hapus Hasil Scan"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))}

                          {totalHistoryCount === 0 && (
                            <tr>
                              <td colSpan={8} className="text-center py-10 text-slate-400">
                                Belum ada history scan atau transaksi gudang yang tercatat. Setiap proses scan barcode akan otomatis mencatat nama petugas scan tanpa duplikasi.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

            </div>

            {/* Right Column: Active Service & Repair Monitoring Sidebar (col-span 1) */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-rose-600 animate-pulse" />
                    <span className="font-bold text-sm text-slate-800">Unit Dalam Proses Perbaikan</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-mono text-[10px] font-bold rounded-full border border-rose-200">
                    {overallInventorySummary.totalDamagedUnits} Unit ({unitsInRepairList.length} Jenis)
                  </span>
                </div>

                {unitsInRepairList.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <CheckCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-500">Semua Aset Kondisi Baik</p>
                    <p className="text-[10px] text-slate-400 mt-1">Tidak ada peralatan yang sedang dalam proses perbaikan saat ini.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                    {unitsInRepairList.map(({ asset: item, avail }) => (
                      <div key={item.id} className="p-3 bg-rose-50/30 rounded-lg border border-rose-100 hover:border-rose-200 transition-all flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">{item.code} • {item.division}</span>
                            <span className="font-bold text-xs text-slate-900">{item.name}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-rose-100 text-rose-800 border border-rose-200 shrink-0">
                            Perbaikan: {avail.totalDamagedUnits} {avail.unitLabel}
                          </span>
                        </div>

                        {avail.damageReasons.length > 0 && (
                          <div className="text-[10px] text-rose-800 bg-white/80 p-2 rounded border border-rose-100 leading-snug">
                            {avail.damageReasons.join(' • ')}
                          </div>
                        )}

                        <div className="p-2 rounded-lg bg-white border border-rose-100 space-y-1.5 text-[10px]">
                          <div className="flex flex-wrap items-center justify-between gap-1 font-mono">
                            <span className="text-slate-600 font-semibold">
                              📅 Pelaporan: <strong className="text-slate-900">{avail.reportDateLabel}</strong> ({avail.reportMonthLabel})
                            </span>
                            <span className="text-slate-500">
                              PIC: <strong className="text-slate-800">{avail.reportedBy}</strong>
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-rose-800">{avail.progressStatus}</span>
                              <span className="font-mono font-extrabold text-indigo-700">{avail.progressPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  avail.progressPercent >= 100
                                    ? 'bg-emerald-500'
                                    : avail.progressPercent >= 50
                                    ? 'bg-indigo-600'
                                    : avail.progressPercent > 0
                                    ? 'bg-amber-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.max(4, avail.progressPercent)}%` }}
                              />
                            </div>
                            {avail.progressNotes && (
                              <p className="text-[10px] text-slate-600 leading-snug pt-0.5">
                                {avail.progressNotes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-rose-100/80 font-mono">
                          <span>Ready/Ada: <strong className="text-slate-800">{avail.totalUnits}</strong></span>
                          <span>Terjadwal: <strong className="text-amber-700">{avail.assignedUnits}</strong></span>
                          <span>Sisa Unit: <strong className="text-emerald-700">{avail.availableUnits}</strong></span>
                        </div>

                        {item.location === 'Divisi SERVICE (Sedang Diperbaiki)' && (
                          <button
                            type="button"
                            onClick={() => {
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

                              if (onUpdateAssetLocation) onUpdateAssetLocation(item.id, newLoc);
                              if (onUpdateAssetCondition) onUpdateAssetCondition(item.id, newCond);

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
                            className="w-full mt-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Selesai Servis &amp; Terima</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
        );
      })()}

      {/* VIEW 1B: SUSUNAN UNIT INVENTORY GUDANG RESMI (DIKELOMPOKKAN BERDASARKAN DIVISI & TYPE ALAT) */}
      {warehouseSubTab === 'inventory' && (() => {
        const divisionScopedAssets = localAssets.filter(asset => {
          if (inventoryDivisionFilter !== 'ALL' && asset.division !== inventoryDivisionFilter) return false;
          return true;
        });

        const availableTypeBuckets = groupInventoryAssetsByType(divisionScopedAssets);

        const filteredInventory = divisionScopedAssets.filter(asset => {
          if (inventoryTypeFilter !== 'ALL') {
            const info = getInventoryAssetTypeInfo(asset);
            if (info.typeGroup !== inventoryTypeFilter) return false;
          }
          if (inventoryConditionFilter !== 'ALL' && asset.condition !== inventoryConditionFilter) return false;
          if (inventorySearch.trim()) {
            const q = inventorySearch.toLowerCase().trim();
            const info = getInventoryAssetTypeInfo(asset);
            return (
              asset.code.toLowerCase().includes(q) ||
              asset.name.toLowerCase().includes(q) ||
              asset.brand.toLowerCase().includes(q) ||
              asset.serialNumber.toLowerCase().includes(q) ||
              asset.location.toLowerCase().includes(q) ||
              info.typeGroup.toLowerCase().includes(q) ||
              info.shortTypeLabel.toLowerCase().includes(q)
            );
          }
          return true;
        });

        const divisionConfigs = [
          {
            key: 'Audio' as const,
            title: 'Divisi Audio / Sound System',
            sheetName: 'Inventory SOUND 2026',
            Icon: Volume2,
            headerBg: 'from-blue-600 to-indigo-700',
            badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
          },
          {
            key: 'Lighting' as const,
            title: 'Divisi Lighting & Special Effects',
            sheetName: 'Inventory LIGHTING 2026',
            Icon: Lightbulb,
            headerBg: 'from-amber-500 to-orange-600',
            badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
          },
          {
            key: 'Multimedia' as const,
            title: 'Divisi Multimedia & Live Streaming',
            sheetName: 'INVENTORY STREEMING 2026',
            Icon: Video,
            headerBg: 'from-purple-600 to-violet-700',
            badgeBg: 'bg-purple-50 text-purple-700 border-purple-200'
          },
          {
            key: 'Videotron' as const,
            title: 'Divisi Videotron & LED Display',
            sheetName: 'INVENTORY LED 2026',
            Icon: Tv,
            headerBg: 'from-emerald-600 to-teal-700',
            badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }
        ];

        const activeDivisions = inventoryDivisionFilter === 'ALL'
          ? divisionConfigs
          : divisionConfigs.filter(d => d.key === inventoryDivisionFilter);

        const scopedSummary = calculateInventorySummaryMetrics(divisionScopedAssets, inventoryCalcCtx);

        const assetsWithAvail = localAssets.map(asset => ({
          asset,
          avail: calculateInventoryAssetAvailability(asset, inventoryCalcCtx),
          typeInfo: getInventoryAssetTypeInfo(asset)
        }));

        const unitsInRepairList = assetsWithAvail.filter(
          item => item.avail.totalDamagedUnits > 0 || item.asset.location === 'Divisi SERVICE (Sedang Diperbaiki)'
        );

        const filteredWarehouseUnits = assetsWithAvail.filter(({ asset, avail, typeInfo }) => {
          if (warehouseUnitDivFilter !== 'ALL' && asset.division !== warehouseUnitDivFilter) return false;
          if (warehouseUnitStatusFilter === 'SCHEDULED' && avail.assignedUnits <= 0) return false;
          if (warehouseUnitStatusFilter === 'REPAIR' && avail.totalDamagedUnits <= 0 && asset.location !== 'Divisi SERVICE (Sedang Diperbaiki)') return false;
          if (warehouseUnitStatusFilter === 'AVAILABLE' && avail.availableUnits <= 0) return false;
          if (warehouseUnitSearch.trim()) {
            const q = warehouseUnitSearch.toLowerCase().trim();
            const matchJob = avail.assignedReasons.some(t => t.toLowerCase().includes(q));
            const matchDamage = avail.damageReasons.some(s => s.toLowerCase().includes(q));
            return (
              asset.code.toLowerCase().includes(q) ||
              asset.name.toLowerCase().includes(q) ||
              asset.brand.toLowerCase().includes(q) ||
              asset.division.toLowerCase().includes(q) ||
              typeInfo.typeGroup.toLowerCase().includes(q) ||
              matchJob ||
              matchDamage
            );
          }
          return true;
        });

        const scopedTableSummary = calculateInventorySummaryMetrics(
          filteredWarehouseUnits.map(u => u.asset),
          inventoryCalcCtx
        );

        return (
          <div className="space-y-5">
            {/* Daftar Ketersediaan Unit, Penjadwalan, Perbaikan & Sisa Unit Gudang (Hanya di Panel Unit Inventory) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    Daftar Ketersediaan Unit, Penjadwalan, Perbaikan &amp; Sisa Unit Gudang
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Menampilkan <strong>{filteredWarehouseUnits.length} jenis alat</strong> — Ready/Ada: <strong>{scopedTableSummary.totalUnits} Unit</strong> • Dijadwalkan: <strong className="text-amber-700">-{scopedTableSummary.assignedUnits} Unit</strong> • Proses Perbaikan: <strong className="text-rose-600">-{scopedTableSummary.totalDamagedUnits} Unit</strong> • Sisa Bisa Digunakan: <strong className="text-emerald-700">{scopedTableSummary.availableUnits} Unit</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={warehouseUnitStatusFilter}
                    onChange={(e) => setWarehouseUnitStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 bg-slate-50"
                  >
                    <option value="ALL">Semua Status Unit</option>
                    <option value="SCHEDULED">Sedang Dijadwalkan ({assetsWithAvail.filter(x => x.avail.assignedUnits > 0).length})</option>
                    <option value="REPAIR">Dalam Proses Perbaikan ({unitsInRepairList.length})</option>
                    <option value="AVAILABLE">Masih Ada Sisa Unit ({assetsWithAvail.filter(x => x.avail.availableUnits > 0).length})</option>
                  </select>

                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={warehouseUnitSearch}
                      onChange={(e) => setWarehouseUnitSearch(e.target.value)}
                      placeholder="Cari unit / kode / event..."
                      className="w-full pl-8 pr-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-slate-100">
                {([
                  { key: 'ALL' as const, label: 'Semua Divisi' },
                  { key: 'Audio' as const, label: 'Audio' },
                  { key: 'Lighting' as const, label: 'Lighting' },
                  { key: 'Multimedia' as const, label: 'Multimedia' },
                  { key: 'Videotron' as const, label: 'Videotron' }
                ]).map(tab => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setWarehouseUnitDivFilter(tab.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      warehouseUnitDivFilter === tab.key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto touch-scroll max-h-[520px]">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-mono font-bold text-[10px] sticky top-0 z-20 shadow-2xs">
                      <tr>
                        <th scope="col" className="p-3">Kode &amp; Nama Unit</th>
                        <th scope="col" className="p-3 text-center bg-indigo-50/60 text-indigo-900">Unit Ready / Ada</th>
                        <th scope="col" className="p-3 text-center bg-amber-50/70 text-amber-900">Dijadwalkan</th>
                        <th scope="col" className="p-3 text-center bg-rose-50/70 text-rose-900">Dalam Proses Perbaikan</th>
                        <th scope="col" className="p-3 text-center bg-emerald-50/70 text-emerald-900">Sisa Unit (Jadwal Berikutnya)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                      {filteredWarehouseUnits.map(({ asset, avail, typeInfo }) => {
                        const isZeroRemaining = avail.availableUnits <= 0;
                        return (
                          <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 min-w-[210px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {asset.code}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${typeInfo.bgClass} ${typeInfo.textClass} ${typeInfo.borderClass}`}>
                                  {asset.division} • {typeInfo.shortTypeLabel}
                                </span>
                              </div>
                              <div className="font-bold text-slate-900 mt-1 text-xs">{asset.name}</div>
                              <div className="text-[10px] text-slate-400">
                                Brand: <span className="font-semibold text-slate-600">{asset.brand}</span> • Lokasi: <span className="font-semibold text-slate-600">{asset.location}</span>
                              </div>
                            </td>

                            <td className="p-3 text-center bg-indigo-50/20">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono font-extrabold text-xs">
                                {avail.totalUnits} {avail.unitLabel}
                              </span>
                            </td>

                            <td className="p-3 text-center bg-amber-50/20 min-w-[140px]">
                              {avail.assignedUnits > 0 ? (
                                <div className="space-y-1">
                                  <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-mono font-extrabold text-xs">
                                    {avail.assignedUnits} {avail.unitLabel}
                                  </span>
                                  {avail.assignedReasons.length > 0 && (
                                    <div className="text-[10px] text-amber-800 font-medium leading-tight max-w-[180px] mx-auto">
                                      {avail.assignedReasons.slice(0, 2).join(', ')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] font-mono text-slate-400">0 {avail.unitLabel}</span>
                              )}
                            </td>

                            <td className="p-3 text-center bg-rose-50/20 min-w-[140px]">
                              {avail.totalDamagedUnits > 0 ? (
                                <div className="space-y-1">
                                  <span className="inline-block px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300 font-mono font-extrabold text-xs">
                                    {avail.totalDamagedUnits} {avail.unitLabel}
                                  </span>
                                  {avail.damageReasons.length > 0 && (
                                    <div className="text-[10px] text-rose-700 font-medium leading-tight max-w-[180px] mx-auto">
                                      {avail.damageReasons.slice(0, 2).join('; ')}
                                    </div>
                                  )}
                                  <div className="text-[9px] text-slate-600 font-mono max-w-[190px] mx-auto pt-0.5">
                                    Lapor: {avail.reportDateLabel} ({avail.reportMonthLabel}) • Progress: <span className="font-bold text-rose-800">{avail.progressPercent}%</span> ({avail.progressStatus})
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <span className="text-[11px] font-mono text-slate-400">0 {avail.unitLabel}</span>
                                  <div className="text-[9px] font-mono text-slate-400">
                                    Cek: {avail.reportMonthLabel} ({avail.progressPercent}%)
                                  </div>
                                </div>
                              )}
                            </td>

                            <td className="p-3 text-center bg-emerald-50/25 min-w-[130px]">
                              <span className={`inline-block px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs border ${
                                isZeroRemaining
                                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                                  : avail.availableUnits < avail.totalUnits
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}>
                                {avail.availableUnits} {avail.unitLabel}
                              </span>
                              <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                                dari {avail.totalUnits} {avail.unitLabel}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredWarehouseUnits.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-slate-400">
                            Tidak ada unit yang cocok dengan filter pencarian.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top Summary & Action Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs shrink-0">
                    <Boxes className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Susunan Unit Inventory Gudang Resmi (Berdasarkan Type Alat)
                      </h2>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded-full">
                        Siap Pakai: {scopedSummary.availableUnits} / {scopedSummary.totalUnits} Unit
                      </span>
                      {scopedSummary.totalDamagedUnits > 0 && (
                        <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-mono text-xs font-bold rounded-full">
                          Rusak (Report): -{scopedSummary.totalDamagedUnits} Unit
                        </span>
                      )}
                      {scopedSummary.assignedUnits > 0 && (
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-mono text-xs font-bold rounded-full">
                          Penugasan Job: -{scopedSummary.assignedUnits} Unit
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seluruh jumlah unit otomatis dikurangi apabila terdapat <strong>kerusakan berdasarkan report/temuan QC</strong> maupun sedang <strong>dijadwalkan pada penugasan kerja</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={OFFICIAL_INVENTORY_SPREADSHEET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Buka Google Sheet Inventaris ↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAssetItem(null);
                      const todayIso = new Date().toISOString().split('T')[0];
                      setAssetFormState({
                        code: `AST-AUD-${String(localAssets.length + 1).padStart(3, '0')}`,
                        name: '',
                        brand: '',
                        serialNumber: 'QTY: 1 Unit',
                        division: inventoryDivisionFilter === 'ALL' ? 'Audio' : inventoryDivisionFilter,
                        location: 'Gudang Utama RIZ',
                        condition: 'Baik',
                        reportDate: todayIso,
                        reportMonth: todayIso.slice(0, 7),
                        reportedBy: currentUser.name,
                        progressStatus: 'Aman / Siap Pakai (100% Normal)',
                        progressPercent: 100,
                        progressNotes: 'Unit baru didaftarkan pada inventaris gudang dan telah lolos pemeriksaan fisik awal.'
                      });
                      setShowAssetFormModal(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Unit Inventory</span>
                  </button>
                </div>
              </div>

              {/* Division Filter Pills with Distinct Icons */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl overflow-x-auto no-scrollbar touch-scroll max-w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setInventoryDivisionFilter('ALL');
                      setInventoryTypeFilter('ALL');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                      inventoryDivisionFilter === 'ALL'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Boxes className="w-3.5 h-3.5" />
                    <span>Semua Divisi</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${inventoryDivisionFilter === 'ALL' ? 'bg-indigo-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {overallInventorySummary.availableUnits}/{overallInventorySummary.totalUnits}
                    </span>
                  </button>

                  {([
                    { key: 'Audio' as const, label: 'Audio / Sound', Icon: Volume2, activeClass: 'bg-blue-600 text-white shadow-xs', badgeActiveClass: 'bg-blue-800 text-white' },
                    { key: 'Lighting' as const, label: 'Lighting', Icon: Lightbulb, activeClass: 'bg-amber-500 text-white shadow-xs', badgeActiveClass: 'bg-amber-700 text-white' },
                    { key: 'Multimedia' as const, label: 'Multimedia / Streaming', Icon: Video, activeClass: 'bg-purple-600 text-white shadow-xs', badgeActiveClass: 'bg-purple-800 text-white' },
                    { key: 'Videotron' as const, label: 'Videotron / LED', Icon: Tv, activeClass: 'bg-emerald-600 text-white shadow-xs', badgeActiveClass: 'bg-emerald-800 text-white' }
                  ]).map(pill => {
                    const pillSummary = calculateInventorySummaryMetrics(
                      localAssets.filter(a => a.division === pill.key),
                      inventoryCalcCtx
                    );
                    const PillIcon = pill.Icon;
                    const isPillActive = inventoryDivisionFilter === pill.key;
                    return (
                      <button
                        key={pill.key}
                        type="button"
                        onClick={() => {
                          setInventoryDivisionFilter(pill.key);
                          setInventoryTypeFilter('ALL');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                          isPillActive ? pill.activeClass : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                        }`}
                      >
                        <PillIcon className="w-3.5 h-3.5" />
                        <span>{pill.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isPillActive ? pill.badgeActiveClass : 'bg-slate-200 text-slate-700'}`}>
                          {pillSummary.availableUnits}/{pillSummary.totalUnits}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search & Condition Filter */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Cari unit / type / kode / merk..."
                      value={inventorySearch}
                      onChange={(e) => setInventorySearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                  <select
                    value={inventoryConditionFilter}
                    onChange={(e) => setInventoryConditionFilter(e.target.value as any)}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ALL">Semua Kondisi ({localAssets.length})</option>
                    <option value="Baik">Kondisi Baik ({localAssets.filter(a => a.condition === 'Baik').length})</option>
                    <option value="Rusak Ringan">Rusak Ringan / Catatan ({localAssets.filter(a => a.condition === 'Rusak Ringan').length})</option>
                    <option value="Rusak Berat">Rusak Berat / Hilang ({localAssets.filter(a => a.condition === 'Rusak Berat').length})</option>
                  </select>
                </div>
              </div>

              {/* Filter Kelompok Berdasarkan Type Alat */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Kelompok Berdasarkan Type Alat ({availableTypeBuckets.length} Type):</span>
                  </span>
                  {inventoryTypeFilter !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => setInventoryTypeFilter('ALL')}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Tampilkan Semua Type</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setInventoryTypeFilter('ALL')}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      inventoryTypeFilter === 'ALL'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Boxes className="w-3 h-3" />
                    <span>Semua Type</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${inventoryTypeFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {divisionScopedAssets.length}
                    </span>
                  </button>

                  {availableTypeBuckets.map(bucket => {
                    const TypeIcon = resolveInventoryTypeIcon(bucket.typeInfo.iconKey);
                    const isSelected = inventoryTypeFilter === bucket.typeInfo.typeGroup;
                    const bucketMetrics = calculateInventorySummaryMetrics(bucket.assets, inventoryCalcCtx);
                    return (
                      <button
                        key={bucket.typeInfo.typeGroup}
                        type="button"
                        onClick={() => setInventoryTypeFilter(isSelected ? 'ALL' : bucket.typeInfo.typeGroup)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                            : `${bucket.typeInfo.bgClass} ${bucket.typeInfo.textClass} ${bucket.typeInfo.borderClass} hover:brightness-95`
                        }`}
                        title={`${bucket.typeInfo.typeGroup}: Siap ${bucketMetrics.availableUnits}/${bucketMetrics.totalUnits} Unit (Rusak: -${bucketMetrics.totalDamagedUnits}, Penugasan: -${bucketMetrics.assignedUnits})`}
                      >
                        <TypeIcon className="w-3 h-3 shrink-0" />
                        <span>{bucket.typeInfo.shortTypeLabel}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                          isSelected ? 'bg-indigo-800 text-white' : 'bg-white/80 text-slate-800'
                        }`}>
                          {bucketMetrics.availableUnits}/{bucketMetrics.totalUnits}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Structured Division Sections -> Grouped by Equipment Type -> Unit Cards */}
            {activeDivisions.map(divCfg => {
              const divAssets = filteredInventory.filter(a => a.division === divCfg.key);
              if (divAssets.length === 0) return null;
              const DivIcon = divCfg.Icon;
              const divTypeBuckets = groupInventoryAssetsByType(divAssets);
              const divMetrics = calculateInventorySummaryMetrics(divAssets, inventoryCalcCtx);

              return (
                <div key={divCfg.key} className="space-y-5">
                  {/* Division Section Banner */}
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${divCfg.headerBg} text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/15 backdrop-blur-xs rounded-xl border border-white/20 shrink-0">
                        <DivIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-black tracking-tight">{divCfg.title}</h3>
                          <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-mono font-bold">
                            {divTypeBuckets.length} Kelompok Type • Siap: {divMetrics.availableUnits} / {divMetrics.totalUnits} Unit
                          </span>
                        </div>
                        <p className="text-[11px] text-white/85 font-mono mt-0.5">
                          Tab Sheet: {divCfg.sheetName} • Total Fisik: {divMetrics.totalUnits} Unit
                          {divMetrics.totalDamagedUnits > 0 ? ` • Rusak (Report): -${divMetrics.totalDamagedUnits} Unit` : ''}
                          {divMetrics.assignedUnits > 0 ? ` • Penugasan Job: -${divMetrics.assignedUnits} Unit` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-bold">
                      <span className="px-2.5 py-1 bg-white/20 rounded-lg">
                        Siap Pakai: {divMetrics.availableUnits} Unit
                      </span>
                      {divMetrics.totalDamagedUnits > 0 && (
                        <span className="px-2.5 py-1 bg-rose-500/45 border border-white/25 rounded-lg">
                          Rusak (Report): -{divMetrics.totalDamagedUnits} Unit
                        </span>
                      )}
                      {divMetrics.assignedUnits > 0 && (
                        <span className="px-2.5 py-1 bg-amber-500/45 border border-white/25 rounded-lg">
                          Penugasan: -{divMetrics.assignedUnits} Unit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Equipment Type Sub-Groups inside Division */}
                  <div className="space-y-5 pl-0 sm:pl-2">
                    {divTypeBuckets.map((bucket, bucketIdx) => {
                      const TypeGroupIcon = resolveInventoryTypeIcon(bucket.typeInfo.iconKey);
                      const bucketMetrics = calculateInventorySummaryMetrics(bucket.assets, inventoryCalcCtx);

                      return (
                        <div
                          key={bucket.typeInfo.typeGroup}
                          className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 space-y-3.5 shadow-2xs"
                        >
                          {/* Equipment Type Group Header */}
                          <div className={`p-3 rounded-xl border ${bucket.typeInfo.headerBgClass} flex flex-col sm:flex-row sm:items-center justify-between gap-2.5`}>
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-lg border bg-white shadow-2xs ${bucket.typeInfo.textClass} ${bucket.typeInfo.borderClass} shrink-0`}>
                                <TypeGroupIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-mono font-black uppercase tracking-wider opacity-75">
                                    TYPE {bucketIdx + 1}:
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-extrabold tracking-tight">
                                    {bucket.typeInfo.typeGroup}
                                  </h4>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${bucket.typeInfo.badgeClass}`}>
                                    {bucket.assets.length} Kelompok • {bucketMetrics.availableUnits}/{bucketMetrics.totalUnits} Unit Siap
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                              <span className="px-2 py-0.5 bg-white/90 border border-emerald-200 text-emerald-700 rounded-md text-[10px] font-mono font-bold">
                                Siap: {bucketMetrics.availableUnits} / {bucketMetrics.totalUnits} Unit
                              </span>
                              {bucketMetrics.totalDamagedUnits > 0 && (
                                <span className="px-2 py-0.5 bg-rose-100/90 border border-rose-300 text-rose-800 rounded-md text-[10px] font-mono font-bold">
                                  Rusak (Report): -{bucketMetrics.totalDamagedUnits} Unit
                                </span>
                              )}
                              {bucketMetrics.assignedUnits > 0 && (
                                <span className="px-2 py-0.5 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-md text-[10px] font-mono font-bold">
                                  Penugasan: -{bucketMetrics.assignedUnits} Unit
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  setInventoryTypeFilter(
                                    inventoryTypeFilter === bucket.typeInfo.typeGroup ? 'ALL' : bucket.typeInfo.typeGroup
                                  )
                                }
                                className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                {inventoryTypeFilter === bucket.typeInfo.typeGroup ? 'Semua Type' : 'Fokus Type Ini'}
                              </button>
                            </div>
                          </div>

                          {/* Grid of Inventory Units in this Type */}
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                            {bucket.assets.map(asset => {
                              const { Icon: UnitIcon, categoryLabel, bgClass, textClass, borderClass } = getInventoryUnitIconInfo(asset);
                              const isInService = asset.location.includes('SERVICE');
                              const avail = calculateInventoryAssetAvailability(asset, inventoryCalcCtx);
                              const cleanSerialSpec = stripInventoryNominalText(asset.serialNumber);

                              return (
                                <div
                                  key={asset.id}
                                  className="bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col justify-between gap-3"
                                >
                                  <div className="space-y-2.5">
                                    {/* Top Row: Unit Specific Icon + Type Label + Code + Condition */}
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`p-2.5 rounded-xl border ${bgClass} ${textClass} ${borderClass} shrink-0`}>
                                          <UnitIcon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[10px] font-mono font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                              {asset.code}
                                            </span>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${bgClass} ${textClass} ${borderClass} truncate`}>
                                              {categoryLabel}
                                            </span>
                                          </div>
                                          <h5 className="text-xs font-extrabold text-slate-900 mt-1 leading-snug">
                                            {asset.name}
                                          </h5>
                                        </div>
                                      </div>

                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase shrink-0 ${
                                        asset.condition === 'Baik'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : asset.condition === 'Rusak Ringan'
                                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                                      }`}>
                                        {asset.condition}
                                      </span>
                                    </div>

                                    {/* Unit Availability & Deduction Box (Total - Rusak Report - Penugasan Job) */}
                                    <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/90 space-y-1.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase font-mono">
                                          Jumlah Unit Tersedia:
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-extrabold border ${
                                          avail.availableUnits === 0
                                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                                            : avail.totalDamagedUnits > 0 || avail.assignedUnits > 0
                                            ? 'bg-amber-50 text-amber-900 border-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                          {avail.availableUnits} / {avail.totalUnits} {avail.unitLabel} Siap
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-mono text-[10px]">
                                        <div className="p-1 rounded bg-white border border-slate-200">
                                          <div className="text-[9px] text-slate-400">Total Awal</div>
                                          <div className="font-extrabold text-slate-800">{avail.totalUnits} {avail.unitLabel}</div>
                                        </div>
                                        <div className={`p-1 rounded border ${avail.totalDamagedUnits > 0 ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-400'}`}>
                                          <div className="text-[9px]">Rusak/Report</div>
                                          <div className="font-extrabold">{avail.totalDamagedUnits > 0 ? `-${avail.totalDamagedUnits}` : '0'} {avail.unitLabel}</div>
                                        </div>
                                        <div className={`p-1 rounded border ${avail.assignedUnits > 0 ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-white border-slate-200 text-slate-400'}`}>
                                          <div className="text-[9px]">Penugasan</div>
                                          <div className="font-extrabold">{avail.assignedUnits > 0 ? `-${avail.assignedUnits}` : '0'} {avail.unitLabel}</div>
                                        </div>
                                      </div>

                                      {(avail.damageReasons.length > 0 || avail.assignedReasons.length > 0) && (
                                        <div className="pt-1.5 border-t border-slate-200/80 space-y-1 text-[10px]">
                                          {avail.damageReasons.map((reason, rIdx) => (
                                            <div key={`dmg-${rIdx}`} className="flex items-start gap-1 text-rose-700 font-medium leading-tight">
                                              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-rose-600" />
                                              <span>Pengurangan Rusak: {reason}</span>
                                            </div>
                                          ))}
                                          {avail.assignedReasons.map((reason, aIdx) => (
                                            <div key={`asg-${aIdx}`} className="flex items-start gap-1 text-amber-800 font-medium leading-tight">
                                              <Calendar className="w-3 h-3 shrink-0 mt-0.5 text-amber-600" />
                                              <span>Penjadwalan Tugas: {reason}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Details Box: Brand, Specs/QTY (No Nominal), Location */}
                                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-[11px]">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-slate-400 font-medium">Type / Merek:</span>
                                        <span className="font-bold text-slate-800 text-right">{asset.brand}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-400 font-medium block">Rincian Nomor Urut & Spesifikasi Unit:</span>
                                        <span className="font-mono text-[10px] font-semibold text-slate-700 leading-relaxed block mt-0.5">
                                          {cleanSerialSpec}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/70">
                                        <span className="text-slate-400 font-medium flex items-center gap-1">
                                          <MapPin className="w-3 h-3 text-slate-400" />
                                          <span>Lokasi:</span>
                                        </span>
                                        <span className={`font-bold text-right ${isInService ? 'text-rose-600' : 'text-slate-700'}`}>
                                          {asset.location}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Tanggal / Bulan Pelaporan & Progress Penanganan Sejauh Apa */}
                                    <div className={`p-2.5 rounded-lg border space-y-1.5 text-[11px] ${
                                      asset.condition === 'Rusak Berat' || avail.progressPercent === 0
                                        ? 'bg-rose-50/70 border-rose-200'
                                        : asset.condition === 'Rusak Ringan' || avail.totalDamagedUnits > 0 || avail.progressPercent < 100
                                        ? 'bg-amber-50/70 border-amber-200'
                                        : 'bg-indigo-50/40 border-indigo-100'
                                    }`}>
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                          <Calendar className="w-3 h-3 text-indigo-600 shrink-0" />
                                          <span>Tgl / Bulan Pelaporan:</span>
                                        </span>
                                        <span className="font-mono text-[10px] font-extrabold text-slate-800 text-right">
                                          {avail.reportDateLabel} ({avail.reportMonthLabel})
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between gap-2 text-[10px]">
                                        <span className="text-slate-500 font-medium">PIC Pelapor / Pemeriksa:</span>
                                        <span className="font-bold text-slate-700 text-right">{avail.reportedBy}</span>
                                      </div>
                                      <div className="pt-1 border-t border-slate-200/60 space-y-1">
                                        <div className="flex items-center justify-between gap-2 text-[10px]">
                                          <span className="font-bold text-slate-700 truncate">{avail.progressStatus}</span>
                                          <span className={`font-mono font-extrabold px-1.5 py-0.5 rounded ${
                                            avail.progressPercent >= 100
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : avail.progressPercent > 0
                                              ? 'bg-amber-100 text-amber-800'
                                              : 'bg-rose-100 text-rose-800'
                                          }`}>
                                            {avail.progressPercent}%
                                          </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full rounded-full transition-all ${
                                              avail.progressPercent >= 100
                                                ? 'bg-emerald-500'
                                                : avail.progressPercent >= 50
                                                ? 'bg-amber-500'
                                                : 'bg-rose-500'
                                            }`}
                                            style={{ width: `${Math.max(4, avail.progressPercent)}%` }}
                                          />
                                        </div>
                                        <p className="text-[10px] text-slate-600 leading-snug pt-0.5">
                                          <span className="font-bold text-slate-700">Progress: </span>
                                          {avail.progressNotes}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Card Footer Actions */}
                                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const scanRes = registerScannedAsset(asset);
                                        setWarehouseSubTab('scanner');
                                        setScanSearchInput(asset.code);
                                        setScannedAsset(asset);
                                        if (scanRes.isDuplicate) {
                                          setScanMessage(
                                            `DUPLIKAT DICEGAH: Unit ${asset.code} (${asset.name}) sudah di-scan sebelumnya oleh ${scanRes.record.scannedBy} (${scanRes.record.scannedAt}).`
                                          );
                                        } else {
                                          setScanMessage(
                                            `SUKSES: Unit ${asset.code} (${asset.name}) berhasil di-scan oleh ${scanRes.record.scannedBy} (${scanRes.record.scannedAt}).`
                                          );
                                        }
                                      }}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Camera className="w-3 h-3" />
                                      <span>Scan / Cek</span>
                                    </button>

                                    <div className="flex items-center gap-1">
                                      <button
                                        type="button"
                                        onClick={() => openEditAssetModal(asset)}
                                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                        <span>Edit</span>
                                      </button>

                                      {onDeleteAsset && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (confirm(`Hapus unit "${asset.name}" (${asset.code}) dari daftar inventaris?`)) {
                                              const next = localAssets.filter(a => a.id !== asset.id);
                                              setLocalAssets(next);
                                              localStorage.setItem('riz_assets', JSON.stringify(next));
                                              onDeleteAsset(asset.id);
                                              onLogActivity(currentUser.name, currentUser.role, `Menghapus unit inventaris: ${asset.code} - ${asset.name}`);
                                            }
                                          }}
                                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                          title="Hapus Unit"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredInventory.length === 0 && (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
                <Boxes className="w-10 h-10 text-slate-300 mx-auto" />
                <div className="text-sm font-bold text-slate-700">Tidak Ada Unit Inventory yang Cocok</div>
                <p className="text-xs text-slate-400">Silakan ubah kata kunci pencarian atau reset filter divisi / type alat di atas.</p>
              </div>
            )}
          </div>
        );
      })()}

      {/* VIEW 2: UNIVERSAL REAL CAMERA BARCODE & QR SCANNER FOR MOBILE / TABLET / DESKTOP */}
      {warehouseSubTab === 'scanner' && (() => {
        const simulatorFilteredAssets = localAssets.filter(a => {
          if (simulatorTargetDiv !== 'ALL' && a.division !== simulatorTargetDiv) return false;
          return true;
        });
        const activeTargetAsset =
          localAssets.find(a => a.code.toLowerCase() === (scanSearchInput.trim() || simulatorTargetCode).toLowerCase()) ||
          simulatorFilteredAssets.find(a => a.code === simulatorTargetCode) ||
          simulatorFilteredAssets[0] ||
          localAssets[0];

        return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Scanning Box Control */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 text-center">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-slate-800 text-sm text-left">Scanner Barcode / QR Unit Alat</h3>

                <div className="flex items-center gap-1.5">
                  {isLiveWebcamRunning && (
                    <button
                      type="button"
                      onClick={handleSwitchCameraFacing}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-mono font-extrabold uppercase cursor-pointer transition-all flex items-center gap-1 border bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700"
                      title="Ganti Kamera Belakang / Depan pada Ponsel atau Tablet"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{cameraFacingMode === 'environment' ? 'Belakang' : 'Depan'}</span>
                    </button>
                  )}

                  {isLiveWebcamRunning && cameraHasTorch && (
                    <button
                      type="button"
                      onClick={handleToggleCameraTorch}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-extrabold uppercase cursor-pointer transition-all flex items-center gap-1 border ${
                        cameraTorchOn
                          ? 'bg-amber-400 text-slate-950 border-amber-500'
                          : 'bg-slate-800 text-amber-300 border-slate-700'
                      }`}
                      title="Nyalakan / Matikan Senter Kamera (Flashlight)"
                    >
                      <Zap className="w-3 h-3" />
                      <span>{cameraTorchOn ? 'Flash ON' : 'Flash'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (isLiveWebcamRunning) {
                        stopLiveCameraScanner();
                        setCameraStatusNote('Kamera Dihentikan — Klik Kamera Live untuk mengaktifkan kembali');
                      } else {
                        startLiveCameraScanner();
                      }
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-extrabold uppercase cursor-pointer transition-all flex items-center gap-1 border shrink-0 ${
                      isLiveWebcamRunning
                        ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-700'
                        : 'bg-slate-900 hover:bg-indigo-700 text-white border-slate-900'
                    }`}
                    title="Nyalakan / Matikan Kamera Perangkat (Ponsel / Tablet / Webcam)"
                  >
                    <Camera className="w-3 h-3" />
                    <span>{isLiveWebcamRunning ? 'Stop Kamera' : 'Kamera Live'}</span>
                  </button>
                </div>
              </div>

              {/* MODE SCAN OPERASIONAL STAFF (3 MODE FUNGSIONAL TANPA DUPLIKASI) */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-slate-700">
                    Mode Scan:
                  </span>
                  <span className="text-[10px] font-mono font-bold text-indigo-700">
                    {currentUser.name} ({currentUser.division})
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { id: 'inspect', label: 'Cek Gudang', activeCls: 'bg-slate-900 text-white border-slate-900' },
                    { id: 'loading_out', label: 'Loading Out (Keluar)', activeCls: 'bg-blue-600 text-white border-blue-700' },
                    { id: 'loading_in', label: 'Loading In (Masuk)', activeCls: 'bg-emerald-600 text-white border-emerald-700' }
                  ] as const).map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setScannerLogisticsMode(m.id);
                        if (m.id !== 'inspect') {
                          setAutoRecordLogisticsOnScan(true);
                        }
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-extrabold uppercase border transition-all cursor-pointer text-center ${
                        (scannerLogisticsMode === m.id ||
                          (m.id === 'loading_out' && scannerLogisticsMode === 'keluar') ||
                          (m.id === 'loading_in' && scannerLogisticsMode === 'masuk'))
                          ? m.activeCls
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {scannerLogisticsMode !== 'inspect' && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-0.5">
                          QTY Unit
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={scanLogisticsQty}
                          onChange={(e) => setScanLogisticsQty(Math.max(1, Number(e.target.value) || 1))}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-mono font-bold bg-white text-slate-900"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[9px] font-mono font-bold uppercase text-slate-500 mb-0.5">
                          Event / Tujuan / Catatan Logistik
                        </label>
                        <input
                          type="text"
                          value={scanLogisticsNote}
                          onChange={(e) => setScanLogisticsNote(e.target.value)}
                          placeholder="e.g. Event JS Luwansa / Truk F 8446 BF"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white text-slate-900"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-[10px] font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRecordLogisticsOnScan}
                        onChange={(e) => setAutoRecordLogisticsOnScan(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>
                        Otomatis catat ke Alur Logistik ({scannerLogisticsMode === 'loading_out' ? 'Loading Out / Keluar' : scannerLogisticsMode === 'loading_in' ? 'Loading In / Masuk' : scannerLogisticsMode === 'keluar' ? 'Barang Keluar' : 'Barang Masuk'}) setiap barcode ter-scan
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* VIEWFINDER KAMERA LIVE PONSEL / TABLET / DESKTOP */}
              {isCameraScannerActive && (
                <div className="rounded-xl overflow-hidden border-2 border-indigo-600 bg-slate-950 text-white shadow-md text-left">
                  {/* Top Camera HUD Bar */}
                  <div className="px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold truncate">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <span className="truncate">{cameraStatusNote}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-indigo-600/30 border border-indigo-400/40 text-indigo-200 shrink-0">
                      Petugas: {currentUser.name}
                    </span>
                  </div>

                  {/* Camera Lens / Viewfinder Frame — Bebas Halangan */}
                  <div
                    onClick={() => {
                      if (!isLiveWebcamRunning) {
                        startLiveCameraScanner();
                      }
                    }}
                    className="relative h-56 bg-slate-950 flex items-center justify-center overflow-hidden cursor-pointer"
                  >
                    {/* Live Mobile / Tablet / Webcam Stream */}
                    <video
                      ref={scannerVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`absolute inset-0 w-full h-full object-cover ${
                        isLiveWebcamRunning ? 'opacity-100' : 'hidden'
                      }`}
                    />

                    {/* Prompt When Live Camera Stream Needs Permission or Direct Mobile Camera Launch */}
                    {!isLiveWebcamRunning && (
                      <div className="z-10 flex flex-col items-center justify-center gap-2 px-4 text-center">
                        <Camera className="w-8 h-8 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-white">
                          Ketuk di Sini untuk Membuka Kamera Live (Ponsel / Tablet)
                        </span>
                        <span className="text-[10px] font-mono text-slate-300">
                          Mendukung Android, iPhone, iPad, Tablet & Laptop (Auto-Detect Barcode 1D & QR Code)
                        </span>
                      </div>
                    )}

                    {/* Corner Target Brackets */}
                    <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-emerald-400 rounded-tl pointer-events-none z-10" />
                    <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-emerald-400 rounded-tr pointer-events-none z-10" />
                    <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-emerald-400 rounded-bl pointer-events-none z-10" />
                    <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-emerald-400 rounded-br pointer-events-none z-10" />

                    {/* Animated Thin Laser Scan Beam */}
                    <div
                      className={`w-4/5 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_10px_#f43f5e] transition-all duration-300 pointer-events-none z-10 ${
                        isScanningSimulated ? 'scale-x-105 bg-emerald-400 shadow-[0_0_16px_#34d399]' : 'animate-pulse'
                      }`}
                    />
                  </div>

                  {/* Direct Hardware Camera Controls & Quick Inventory Code Selector */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-2.5">
                    {/* Action Row for Mobile / Tablet Camera Capture */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleCaptureAndDecodeLiveFrame}
                        className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-mono font-extrabold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5 shrink-0" />
                        <span>Jepret & Baca Kamera</span>
                      </button>

                      <label className="px-2.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-mono font-extrabold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs text-center">
                        <Smartphone className="w-3.5 h-3.5 shrink-0" />
                        <span>Kamera HP / Galeri</span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleBarcodeImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800">
                      <span className="text-[10px] font-mono font-bold uppercase text-indigo-300">
                        📋 Pilih Cepat Kode Asset Inventory ({activeTargetAsset?.code || simulatorTargetCode}):
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {(['ALL', 'Audio', 'Lighting', 'Multimedia', 'Videotron'] as const).map(divKey => (
                        <button
                          key={divKey}
                          type="button"
                          onClick={() => {
                            setSimulatorTargetDiv(divKey);
                            const firstInDiv = localAssets.find(a => divKey === 'ALL' || a.division === divKey);
                            if (firstInDiv) {
                              setSimulatorTargetCode(firstInDiv.code);
                              if (!pendingUserBarcode) {
                                setScanSearchInput(firstInDiv.code);
                              }
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase cursor-pointer transition-all ${
                            simulatorTargetDiv === divKey
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {divKey === 'ALL' ? `Semua (${localAssets.length})` : divKey}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={activeTargetAsset?.code || simulatorTargetCode}
                        onChange={(e) => {
                          const nextCode = e.target.value;
                          setSimulatorTargetCode(nextCode);
                          if (!pendingUserBarcode) {
                            setScanSearchInput(nextCode);
                          }
                        }}
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[11px] font-mono font-bold text-white focus:outline-none focus:border-indigo-400"
                      >
                        {simulatorFilteredAssets.map(a => (
                          <option key={a.id} value={a.code}>
                            [{a.code}] {a.name} ({a.condition})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleSimulateQRScan(activeTargetAsset?.code || simulatorTargetCode)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-mono font-extrabold uppercase shrink-0 cursor-pointer transition-colors"
                      >
                        Scan Unit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Barcode / Asset Code Manual & Hardware USB/Bluetooth Scanner Input (Mendukung Kode Barcode dari User) */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                <input
                  type="text"
                  placeholder="Ketik / Scan Kode Barcode User (e.g. MJXH18277, AVANDA210A.24.06.254)"
                  value={scanSearchInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setScanSearchInput(val);
                    const cleanVal = val.trim().toUpperCase();
                    if (cleanVal) {
                      const matched = localAssets.find(
                        a => a.code.toUpperCase() === cleanVal || a.id.toUpperCase() === cleanVal
                      );
                      if (matched) {
                        setSimulatorTargetCode(matched.code);
                        setPendingUserBarcode('');
                      } else {
                        setPendingUserBarcode(cleanVal);
                      }
                    } else {
                      setPendingUserBarcode('');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSimulateQRScan();
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-xs font-mono uppercase bg-white text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <button
                  type="button"
                  onClick={handleCaptureAndDecodeLiveFrame}
                  disabled={isScanningSimulated}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Camera className="w-4 h-4" />
                  <span>
                    {isScanningSimulated
                      ? 'Memindai Barcode...'
                      : `Pindai Barcode Unit (${scanSearchInput.trim() || activeTargetAsset?.code || 'MJXH18277'})`}
                  </span>
                </button>

                {activeTargetAsset &&
                  (pendingUserBarcode ||
                    (scanSearchInput.trim() &&
                      scanSearchInput.trim().toUpperCase() !== activeTargetAsset.code.toUpperCase())) && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAssignUserBarcodeToAsset(
                          activeTargetAsset.id,
                          pendingUserBarcode || scanSearchInput.trim()
                        )
                      }
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">
                        Simpan Kode Barcode User [{(pendingUserBarcode || scanSearchInput).trim().toUpperCase()}] ke {activeTargetAsset.name} &amp; Scan
                      </span>
                    </button>
                  )}
              </div>

              {/* Scanner log message */}
              {scanMessage && (
                <div className={`p-3 rounded-lg text-xs font-mono ${
                  scanMessage.includes('SUKSES') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                  scanMessage.includes('DUPLIKAT') ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold' :
                  scanMessage.includes('ERROR') ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                  'bg-indigo-50 text-indigo-800 border border-indigo-200'
                }`}>
                  {scanMessage}
                </div>
              )}

              {/* Daftar Unit yang Berhasil Di-Scan (Hanya yang sudah di-scan yang muncul & Tidak Boleh Double Pencatatan) */}
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                    Daftar Unit Berhasil Di-Scan ({scannedAssetsWithMeta.length})
                  </span>
                  <div className="flex items-center gap-2">
                    {scannedAssetsWithMeta.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllScannedAssets}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-800 hover:underline font-mono cursor-pointer"
                      >
                        RESET SCAN
                      </button>
                    )}
                    <a
                      href={OFFICIAL_INVENTORY_SPREADSHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline font-mono"
                    >
                      BUKA SHEET ↗
                    </a>
                  </div>
                </div>

                {scannedAssetsWithMeta.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {scannedAssetsWithMeta.map(({ asset, record }) => {
                      const isSelected = scannedAsset?.id === asset.id;
                      return (
                        <div
                          key={asset.id}
                          className={`p-2 border rounded transition-all text-left text-xs font-sans flex justify-between items-center gap-2 ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200'
                              : 'bg-emerald-50/40 border-emerald-200 hover:bg-indigo-50/60 hover:border-indigo-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setScanSearchInput(asset.code);
                              setScannedAsset(asset);
                              setScanMessage(`SUKSES: Menampilkan hasil scan unit ${asset.code} (${asset.name}) — Petugas Scan: ${record.scannedBy}.`);
                            }}
                            className="flex-1 text-left cursor-pointer"
                          >
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-800">{asset.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono pl-5">{asset.code} • {asset.division}</div>
                            <div className="text-[10px] text-indigo-700 font-semibold pl-5 mt-0.5 flex items-center gap-1">
                              <UserCheck className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>Scan oleh: {record.scannedBy} ({record.scannedByDivision}) • {record.scannedAt}</span>
                            </div>
                          </button>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                              asset.condition === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                              asset.condition === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {asset.condition}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveScannedAssetFromList(asset.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                              title="Hapus dari daftar hasil scan"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/70 text-center space-y-1">
                    <div className="text-[11px] font-bold text-slate-600">
                      Belum Ada Unit yang Berhasil Di-Scan (0 Unit)
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Unit yang belum di-scan tidak bisa muncul di daftar ini. Masukkan kode barcode / serial number resmi (contoh: <span className="font-mono font-bold text-slate-600">MJXH18277</span> atau <span className="font-mono font-bold text-slate-600">C450B-01</span>) lalu tekan <span className="font-bold text-indigo-600">Pindai Barcode (Scan)</span>.
                    </p>
                  </div>
                )}
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
                  {(() => {
                    const scannedAvail = calculateInventoryAssetAvailability(scannedAsset, inventoryCalcCtx);
                    const activeScanRec = getScanRecordForAsset(scannedAsset.id) || getScanRecordForAsset(scannedAsset.code);
                    return (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                          <div className="md:col-span-2 p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-lg flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                              <div>
                                <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 block">
                                  Siapa yang Melakukan Proses Scan (Petugas Scan)
                                </span>
                                <span className="text-xs font-extrabold text-slate-900">
                                  {activeScanRec ? `${activeScanRec.scannedBy} — ${activeScanRec.scannedByRole} (${activeScanRec.scannedByDivision})` : `${currentUser.name} — ${currentUser.role} (${currentUser.division})`}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                              Waktu Scan: {activeScanRec ? activeScanRec.scannedAt : new Date().toLocaleString('id-ID')}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Merek / Brand:</span>
                            <span className="text-slate-800 font-bold">{scannedAsset.brand}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Rincian Unit & Spesifikasi:</span>
                            <span className="text-slate-800 font-mono font-bold">{stripInventoryNominalText(scannedAsset.serialNumber)}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Divisi Pemilik:</span>
                            <span className="text-slate-800 font-bold">{scannedAsset.division} Division</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Lokasi Penyimpanan Saat Ini:</span>
                            <span className="text-slate-800 font-bold">{scannedAsset.location}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Kondisi Asset Saat Ini:</span>
                            <span className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold mt-1 text-[10px] uppercase ${
                              scannedAsset.condition === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                              scannedAsset.condition === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {scannedAsset.condition}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-semibold block">Ketersediaan Unit Aktual:</span>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1 font-mono text-[11px] font-bold">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                Siap: {scannedAvail.availableUnits}/{scannedAvail.totalUnits} {scannedAvail.unitLabel}
                              </span>
                              {scannedAvail.totalDamagedUnits > 0 && (
                                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                                  Rusak: -{scannedAvail.totalDamagedUnits}
                                </span>
                              )}
                              {scannedAvail.assignedUnits > 0 && (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                  Penugasan: -{scannedAvail.assignedUnits}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Pencatatan Langsung Alur Logistik Keluar/Masuk & Loading Out/In oleh Staff */}
                        <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-200 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-[11px] font-extrabold text-indigo-950 uppercase font-mono flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Pencatatan Langsung Alur Logistik Keluar/Masuk &amp; Loading Out/In (Staff):</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                              PIC / Petugas Scan: {currentUser.name} ({currentUser.division})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                                Jumlah Unit (QTY)
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={scanLogisticsQty}
                                onChange={(e) => setScanLogisticsQty(Math.max(1, Number(e.target.value) || 1))}
                                className="w-full px-2.5 py-1.5 border border-indigo-200 rounded-lg text-xs font-mono font-bold bg-white text-slate-900"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                                Tujuan Event / Lokasi / Keterangan
                              </label>
                              <input
                                type="text"
                                value={scanLogisticsNote}
                                onChange={(e) => setScanLogisticsNote(e.target.value)}
                                placeholder="Ketik nama event / venue / keterangan logistik"
                                className="w-full px-2.5 py-1.5 border border-indigo-200 rounded-lg text-xs bg-white text-slate-900"
                              />
                            </div>
                          </div>

                          {/* Tombol 1-Klik Pencatatan Loading Out (Barang Keluar) & Loading In (Barang Masuk) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleQuickLogisticsScanAction(scannedAsset, 'Loading')}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                            >
                              <ArrowUpRight className="w-4 h-4 shrink-0" />
                              <span>Loading Out (Barang Keluar)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleQuickLogisticsScanAction(scannedAsset, 'Unloading')}
                              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                            >
                              <ArrowDownLeft className="w-4 h-4 shrink-0" />
                              <span>Loading In (Barang Masuk)</span>
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2 border-t border-indigo-200/70">
                            <button
                              type="button"
                              onClick={() => {
                                setType('Loading');
                                setItemName(scannedAsset.name);
                                setAssetCodeInput(scannedAsset.code);
                                setInlineFormBarcodeInput(scannedAsset.code);
                                setQty(scanLogisticsQty);
                                setNotes(scanLogisticsNote || `Loading Out / Alur Logistik via Scan Barcode [${scannedAsset.code}]`);
                                setShowLogForm(true);
                                setWarehouseSubTab('logs');
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Buka Tabel Alur Logistik Lengkap (Tahap 2)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const expectedDesc = `${scannedAsset.name} (${scannedAsset.code})`;
                                const alreadyInManifest = manifestItems.some(
                                  m => m.itemDescription.toLowerCase() === expectedDesc.toLowerCase()
                                );
                                if (!alreadyInManifest) {
                                  setManifestItems(prev => [
                                    ...prev,
                                    {
                                      id: 'm-' + Date.now(),
                                      division: (scannedAsset.division === 'Audio' || scannedAsset.division === 'Lighting' || scannedAsset.division === 'Multimedia' || scannedAsset.division === 'Videotron')
                                        ? scannedAsset.division
                                        : 'Audio',
                                      itemDescription: expectedDesc,
                                      qty: scanLogisticsQty,
                                      unit: 'Unit',
                                      estimatedCBM: 0.5
                                    }
                                  ]);
                                }
                                setWarehouseSubTab('armada_governance');
                                setFleetSection('trips');
                                setShowNewFleetModal(true);
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Masukkan ke SPJ Armada &amp; Biaya Sewa (Tahap 3)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

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
                          <option value="Gudang Utama RIZ">Gudang Utama RIZ</option>
                          <option value="Lapangan / Loading Out Event">Lapangan / Loading Out Event</option>
                          <option value="Divisi SERVICE (Sedang Diperbaiki)">Divisi SERVICE (Sedang Diperbaiki)</option>
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
                            const activeRec = getScanRecordForAsset(scannedAsset.id) || getScanRecordForAsset(scannedAsset.code);
                            handleGudangUpdateAsset('Divisi SERVICE (Sedang Diperbaiki)', 'Rusak Ringan');
                            const newLog: WarehouseLog = {
                              id: 'wl-' + Date.now(),
                              type: 'Servis Keluar',
                              date: new Date().toISOString().split('T')[0],
                              itemName: scannedAsset.name,
                              qty: 1,
                              pic: currentUser.name,
                              scannedBy: activeRec?.scannedBy || currentUser.name,
                              scannedByRole: activeRec ? `${activeRec.scannedByRole} (${activeRec.scannedByDivision})` : `${currentUser.role} (${currentUser.division})`,
                              scannedAt: activeRec?.scannedAt || new Date().toLocaleString('id-ID'),
                              notes: `Kirim barang ke divisi SERVICE untuk perbaikan via scanner.`,
                              assetCode: scannedAsset.code
                            };
                            setWarehouseLogs(prev => deduplicateWarehouseLogs([newLog, ...prev]));
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px] uppercase transition-all cursor-pointer shadow-sm"
                        >
                          Kirim ke SERVICE
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const activeRec = getScanRecordForAsset(scannedAsset.id) || getScanRecordForAsset(scannedAsset.code);
                            handleGudangUpdateAsset('Gudang Utama RIZ', 'Baik');
                            const newLog: WarehouseLog = {
                              id: 'wl-' + Date.now(),
                              type: 'Servis Masuk',
                              date: new Date().toISOString().split('T')[0],
                              itemName: scannedAsset.name,
                              qty: 1,
                              pic: currentUser.name,
                              scannedBy: activeRec?.scannedBy || currentUser.name,
                              scannedByRole: activeRec ? `${activeRec.scannedByRole} (${activeRec.scannedByDivision})` : `${currentUser.role} (${currentUser.division})`,
                              scannedAt: activeRec?.scannedAt || new Date().toLocaleString('id-ID'),
                              notes: `Barang telah selesai diperbaiki oleh divisi SERVICE, kembali ke gudang via scanner.`,
                              assetCode: scannedAsset.code
                            };
                            setWarehouseLogs(prev => deduplicateWarehouseLogs([newLog, ...prev]));
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
                    <h3 className="font-bold text-slate-700 text-sm">Menunggu Scan Barcode / QR Unit Alat</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Kamera Scanner sudah aktif di sebelah kiri. Arahkan kamera ponsel/tablet ke label barcode unit atau klik tombol di bawah untuk memindai unit <strong className="text-indigo-600 font-mono">{activeTargetAsset?.code || 'MJXH18277'}</strong>.
                    </p>
                  </div>
                  {activeTargetAsset && (
                    <button
                      type="button"
                      onClick={handleCaptureAndDecodeLiveFrame}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Pindai Barcode {activeTargetAsset.code} Sekarang</span>
                    </button>
                  )}
                </div>
              )}

              {/* Live Riwayat Pencatatan Alur Logistik Keluar/Masuk & Loading Out/In langsung di layar Scanner */}
              <div className="pt-5 border-t border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-indigo-600" />
                      <span>Riwayat Alur Logistik Keluar/Masuk & Loading Out/In ({warehouseLogs.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Seluruh hasil scan Loading Out, Loading In, Barang Keluar, dan Barang Masuk oleh staff tercatat otomatis di sini & pada Tab 02.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWarehouseSubTab('logs')}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    Buka Tab 02 Logistik Lengkap ↗
                  </button>
                </div>

                {warehouseLogs.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    Belum ada catatan Loading Out / Loading In atau Alur Logistik Masuk/Keluar. Pilih mode scan di atas lalu arahkan kamera ke barcode unit.
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100 bg-slate-50/50">
                    {warehouseLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="p-2.5 flex items-center justify-between gap-3 hover:bg-white transition-colors text-xs">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              log.type === 'Loading'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : log.type === 'Unloading'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : log.type === 'Keluar'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : log.type === 'Masuk'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-purple-100 text-purple-800 border border-purple-300'
                            }`}>
                              {log.type === 'Loading'
                                ? 'LOADING OUT (KELUAR)'
                                : log.type === 'Unloading'
                                ? 'LOADING IN (MASUK)'
                                : log.type === 'Keluar'
                                ? 'LOGISTIK KELUAR'
                                : log.type === 'Masuk'
                                ? 'LOGISTIK MASUK'
                                : log.type}
                            </span>
                            <span className="font-bold text-slate-800 truncate">{log.itemName}</span>
                            <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                              {log.quantity} Unit
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            PIC Staff: <strong className="text-slate-700">{log.pic}</strong> • {log.notes || '-'}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
        );
      })()}

      {/* VIEW 3: TATA KELOLA PENGGUNAAN KENDARAAN & BIAYA SEWA ANGKUT LOGISTIK (TRI-PARTY GOVERNANCE) */}
      {warehouseSubTab === 'armada_governance' && (
        <div className="space-y-6">
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
                <div className="overflow-x-auto touch-scroll">
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
              {/* BANNER NOTIFIKASI PEMBERITAHUAN MASA BERLAKU STNK & KIR (H-30 HARI & KADALUARSA) */}
              {(() => {
                const alerts = getVehicleExpiryAlerts(vehicles);
                if (alerts.length === 0) return null;
                return (
                  <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-300 rounded-2xl p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 text-amber-700 flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            Pemberitahuan Masa Berlaku Surat Armada ({alerts.length} Dokumen Perlu Tindakan)
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            Notifikasi aktif 1 bulan sebelum tanggal masa berlaku berakhir. Masa berlaku STNK: 1 Tahun • KIR: 6 Bulan.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {alerts.map(alert => {
                        const isExp = alert.status === 'expired';
                        return (
                          <div
                            key={alert.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                              isExp
                                ? 'bg-rose-100/70 border-rose-300 text-rose-900'
                                : 'bg-amber-100/70 border-amber-300 text-amber-900'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                                <span>{alert.policeNumber}</span>
                                <span className="text-[10px] px-1 py-0.2 rounded bg-white/70 border border-current font-sans">
                                  {alert.docType} ({alert.validityPeriod})
                                </span>
                              </div>
                              <div className="text-[10px] truncate opacity-90">{alert.vehicleName}</div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase font-mono ${
                                isExp ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                              }`}>
                                {isExp ? `Kadaluarsa ${Math.abs(alert.daysRemaining)}h` : `Sisa ${alert.daysRemaining} hari`}
                              </span>
                              <div className="text-[9px] font-mono opacity-80 mt-0.5">{alert.expiryDate}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.filter(v => v && (v.name || v.policeNumber)).map((v) => {
                  const stnkCheck = checkVehicleDocExpiry(v.stnkTaxExpiry, 'STNK');
                  const kirCheck = checkVehicleDocExpiry(v.kirExpiry, 'KIR');

                  return (
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

                      <div className="text-[11px] space-y-2 pt-2 border-t border-slate-100 font-mono">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-slate-500">Pajak STNK:</span>
                            <span className="text-[9px] text-slate-400 ml-1 font-sans">(1 Thn)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{v.stnkTaxExpiry || '-'}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-sans ${
                              stnkCheck.status === 'expired'
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : stnkCheck.status === 'warning_30d'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {stnkCheck.formattedBadge}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-slate-500">Uji KIR Dishub:</span>
                            <span className="text-[9px] text-slate-400 ml-1 font-sans">(6 Bln)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{v.kirExpiry || '-'}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-sans ${
                              kirCheck.status === 'expired'
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : kirCheck.status === 'warning_30d'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {kirCheck.formattedBadge}
                            </span>
                          </div>
                        </div>
                        {(() => {
                          const yearlySummary = filterMaintenanceHistoryByCurrentYear(v.maintenanceHistory, '2026');
                          return (
                            <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                              <span className="text-slate-500 font-sans text-[10px]">Total Riwayat Servis ({yearlySummary.year}):</span>
                              <span className="font-bold text-indigo-700">
                                Rp {yearlySummary.totalCost.toLocaleString('id-ID')} ({yearlySummary.records.length}x)
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      {v.maintenanceHistory && v.maintenanceHistory.length > 0 && (() => {
                        const yearlySummary = filterMaintenanceHistoryByCurrentYear(v.maintenanceHistory, '2026');
                        const yearlyHistory = yearlySummary.records;
                        if (yearlyHistory.length === 0) return null;
                        return (
                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1.5 max-h-40 overflow-y-auto">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                              <span>Riwayat Servis Resmi {yearlySummary.year} ({yearlyHistory.length})</span>
                              <a
                                href={v.sheetGid ? `https://docs.google.com/spreadsheets/d/1YuJ_rVhvYUTKKujiHNFOydVWAeCDz5H4ui7pDLvXxUs/edit?gid=${v.sheetGid}#gid=${v.sheetGid}` : OFFICIAL_ARMADA_SPREADSHEET_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 hover:underline font-mono text-[9px]"
                              >
                                Buka Sheet ↗
                              </a>
                            </div>
                            {yearlyHistory.map((mh, idx) => (
                              <div key={mh.id || idx} className="text-[10px] border-t border-slate-200/70 pt-1.5">
                                <div className="flex justify-between items-center font-mono font-bold text-slate-800">
                                  <span className="flex items-center gap-1">
                                    <span>{formatServiceDateIndonesian(mh.date)} ({mh.date}) • {mh.type}</span>
                                    {idx === 0 && (
                                      <span className="px-1 py-0.2 rounded bg-emerald-100 text-emerald-700 font-sans text-[8px] font-extrabold uppercase">
                                        Terkini
                                      </span>
                                    )}
                                  </span>
                                  <span className="shrink-0 ml-1">Rp {(mh.cost || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="text-slate-500 line-clamp-2 mt-0.5">{mh.description}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}

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
                );
              })}
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
                <div className="overflow-x-auto touch-scroll">
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
                <div className="overflow-x-auto touch-scroll">
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
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
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

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Polisi (Plat) *</label>
                  <input
                    type="text"
                    placeholder="Contoh: F 8433 BF"
                    value={vehicleFormData.policeNumber}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, policeNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kepemilikan *</label>
                  <select
                    value={vehicleFormData.ownership}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, ownership: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-bold"
                  >
                    <option value="Internal">Internal PT RIZ</option>
                    <option value="Sewa Mitra">Sewa Mitra</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Unit *</label>
                  <select
                    value={vehicleFormData.status || 'Siap Operasi'}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 font-bold"
                  >
                    <option value="Siap Operasi">Siap Operasi</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Sedang Servis">Sedang Servis</option>
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
                  <label className="font-bold text-slate-700 block mb-1">
                    Jatuh Tempo Pajak STNK <span className="text-[10px] text-blue-600 font-semibold">(1 Tahun)</span>
                  </label>
                  <input
                    type="date"
                    value={vehicleFormData.stnkTaxExpiry && vehicleFormData.stnkTaxExpiry !== '-' ? vehicleFormData.stnkTaxExpiry : ''}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, stnkTaxExpiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">Pemberitahuan aktif 1 bulan sebelum jatuh tempo</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      Uji KIR <span className="text-[10px] text-indigo-600 font-semibold">(6 Bln)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setVehicleFormData({
                        ...vehicleFormData,
                        kirExpiry: vehicleFormData.kirExpiry === '-' ? new Date().toISOString().split('T')[0] : '-'
                      })}
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                        vehicleFormData.kirExpiry === '-' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {vehicleFormData.kirExpiry === '-' ? '✓ Non-KIR (-)' : 'Set Non-KIR'}
                    </button>
                  </div>
                  {vehicleFormData.kirExpiry === '-' ? (
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-500 text-center font-bold">
                      - (Non-KIR)
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={vehicleFormData.kirExpiry || ''}
                      onChange={(e) => setVehicleFormData({ ...vehicleFormData, kirExpiry: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  )}
                  <p className="text-[9px] text-slate-400 mt-1 font-mono">Pemberitahuan aktif 1 bulan sebelum jatuh tempo</p>
                </div>
              </div>

              {/* RIWAYAT SERVIS RESMI / PERBAIKAN (EDITABLE) */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-slate-800 block text-xs">
                      Riwayat Servis Resmi / Perbaikan ({(vehicleFormData.maintenanceHistory || []).length})
                    </label>
                    <span className="text-[10px] text-indigo-600 font-mono font-bold">
                      Total: Rp {((vehicleFormData.maintenanceHistory || []).reduce((s, m) => s + Number(m?.cost || 0), 0)).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentHist = Array.isArray(vehicleFormData.maintenanceHistory) ? [...vehicleFormData.maintenanceHistory] : [];
                      currentHist.unshift({
                        id: `vm-${Date.now()}`,
                        vehicleId: selectedVehicle?.id || 'veh-new',
                        date: new Date().toISOString().split('T')[0],
                        type: 'Perbaikan',
                        description: '',
                        cost: 0,
                        technician: currentUser.name
                      });
                      setVehicleFormData({ ...vehicleFormData, maintenanceHistory: currentHist });
                    }}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer border border-indigo-200"
                  >
                    <Plus className="w-3 h-3" /> Tambah Servis / Perbaikan
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {(vehicleFormData.maintenanceHistory || []).map((mh, idx) => (
                    <div key={mh.id || idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="grid grid-cols-12 gap-1.5 items-center">
                        <input
                          type="date"
                          value={mh.date || ''}
                          onChange={(e) => {
                            const list = [...(vehicleFormData.maintenanceHistory || [])];
                            list[idx] = { ...list[idx], date: e.target.value };
                            setVehicleFormData({ ...vehicleFormData, maintenanceHistory: list });
                          }}
                          className="col-span-4 bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-mono font-bold"
                        />
                        <select
                          value={mh.type || 'Perbaikan'}
                          onChange={(e) => {
                            const list = [...(vehicleFormData.maintenanceHistory || [])];
                            list[idx] = { ...list[idx], type: e.target.value as any };
                            setVehicleFormData({ ...vehicleFormData, maintenanceHistory: list });
                          }}
                          className="col-span-4 bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-bold"
                        >
                          <option value="Service Rutin">Service Rutin</option>
                          <option value="Perbaikan">Perbaikan</option>
                          <option value="Ganti Oli">Ganti Oli</option>
                          <option value="Ganti Ban">Ganti Ban</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Biaya Rp"
                          value={mh.cost ?? 0}
                          onChange={(e) => {
                            const list = [...(vehicleFormData.maintenanceHistory || [])];
                            list[idx] = { ...list[idx], cost: Number(e.target.value || 0) };
                            setVehicleFormData({ ...vehicleFormData, maintenanceHistory: list });
                          }}
                          className="col-span-3 bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-mono font-bold text-right"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const list = (vehicleFormData.maintenanceHistory || []).filter((_, i) => i !== idx);
                            setVehicleFormData({ ...vehicleFormData, maintenanceHistory: list });
                          }}
                          className="col-span-1 text-slate-400 hover:text-rose-600 flex justify-center cursor-pointer"
                          title="Hapus catatan servis ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Rincian perbaikan / sparepart / jasa servis..."
                        value={mh.description || ''}
                        onChange={(e) => {
                          const list = [...(vehicleFormData.maintenanceHistory || [])];
                          list[idx] = { ...list[idx], description: e.target.value };
                          setVehicleFormData({ ...vehicleFormData, maintenanceHistory: list });
                        }}
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-[10px] text-slate-700"
                      />
                    </div>
                  ))}
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-8 space-y-6 text-slate-900 my-auto max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-14" />
                <div>
                  <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-sm">Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164 (CRR3+82 Kedungbadak, Bogor City, West Java)</p>
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-8 space-y-6 text-slate-900 my-auto max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b-2 border-slate-900">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-14" />
                <div>
                  <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Laporan Rekapitulasi Biaya Sewa & Operasional Logistik Transportasi</p>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-sm">Jl. Alternatif Jl. Tugu Wates No.78, RT.02/RW.13, Kedungbadak, Tanah Sareal, Kota Bogor, Jawa Barat 16164 (CRR3+82 Kedungbadak, Bogor City, West Java)</p>
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
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto border border-slate-200">
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

      {/* MODAL TAMBAH / EDIT UNIT INVENTORY GUDANG */}
      {showAssetFormModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <form
            onSubmit={handleSaveAssetInventory}
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 max-h-[90dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Boxes className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingAssetItem ? 'Edit Unit Inventory Gudang' : 'Tambah Unit Inventory Baru'}
                  </h3>
                  <p className="text-[10px] text-slate-500">Master Inventaris Peralatan PT. Riz Production Multi Kreasi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAssetFormModal(false);
                  setEditingAssetItem(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Unit Aset *</label>
                  <input
                    type="text"
                    required
                    value={assetFormState.code}
                    onChange={(e) => setAssetFormState({ ...assetFormState, code: e.target.value })}
                    placeholder="AST-AUD-071"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Divisi Unit *</label>
                  <select
                    value={assetFormState.division}
                    onChange={(e) => setAssetFormState({ ...assetFormState, division: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Audio">Audio / Sound</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Multimedia">Multimedia / Streaming</option>
                    <option value="Videotron">Videotron / LED</option>
                    <option value="Gudang">Gudang</option>
                    <option value="Service">Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Unit & Jumlah (QTY) *</label>
                <input
                  type="text"
                  required
                  value={assetFormState.name}
                  onChange={(e) => setAssetFormState({ ...assetFormState, name: e.target.value })}
                  placeholder="Contoh: Line Array Speaker Audiocenter Avanda 210A (12 Unit)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Merek / Brand</label>
                  <input
                    type="text"
                    value={assetFormState.brand}
                    onChange={(e) => setAssetFormState({ ...assetFormState, brand: e.target.value })}
                    placeholder="Contoh: AUDIOCENTER"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kondisi Fisik</label>
                  <select
                    value={assetFormState.condition}
                    onChange={(e) => setAssetFormState({ ...assetFormState, condition: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800"
                  >
                    <option value="Baik">Baik (Siap Pakai)</option>
                    <option value="Rusak Ringan">Rusak Ringan (Perlu Servis)</option>
                    <option value="Rusak Berat">Rusak Berat / Hilang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Rincian Nomor Urut / QTY / Remark</label>
                <input
                  type="text"
                  value={assetFormState.serialNumber}
                  onChange={(e) => setAssetFormState({ ...assetFormState, serialNumber: e.target.value })}
                  placeholder="No. 1-12 • QTY: 12 Unit • Kondisi Aman"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lokasi Penyimpanan Gudang</label>
                <input
                  type="text"
                  value={assetFormState.location}
                  onChange={(e) => setAssetFormState({ ...assetFormState, location: e.target.value })}
                  placeholder="Gudang Utama RIZ - Zona Audio"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              {/* TANGGAL / BULAN PELAPORAN & PROGRESS PENANGANAN SEJAUH APA */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-indigo-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-extrabold text-indigo-950 text-xs">
                      Tanggal / Bulan Pelaporan & Progress Penanganan
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800">
                    {formatAssetReportMonthLabel(assetFormState.reportMonth, assetFormState.reportDate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tanggal Pelaporan</label>
                    <input
                      type="date"
                      value={assetFormState.reportDate}
                      onChange={(e) => {
                        const nextDate = e.target.value;
                        setAssetFormState({
                          ...assetFormState,
                          reportDate: nextDate,
                          reportMonth: nextDate ? nextDate.slice(0, 7) : assetFormState.reportMonth
                        });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                      Tercatat: {formatAssetReportDateLabel(assetFormState.reportDate)}
                    </span>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bulan Pelaporan</label>
                    <input
                      type="month"
                      value={assetFormState.reportMonth}
                      onChange={(e) => setAssetFormState({ ...assetFormState, reportMonth: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold text-slate-800"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                      Periode: {formatAssetReportMonthLabel(assetFormState.reportMonth, assetFormState.reportDate)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">PIC Pelapor / Teknisi</label>
                    <input
                      type="text"
                      value={assetFormState.reportedBy}
                      onChange={(e) => setAssetFormState({ ...assetFormState, reportedBy: e.target.value })}
                      placeholder="Contoh: Heri / Damri / Rahmat"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Status Tahapan Progress</label>
                    <select
                      value={assetFormState.progressStatus}
                      onChange={(e) => {
                        const statusVal = e.target.value;
                        let autoPct = assetFormState.progressPercent;
                        if (statusVal.includes('Belum Ditangani')) autoPct = 0;
                        else if (statusVal.includes('Diagnosa Awal')) autoPct = 25;
                        else if (statusVal.includes('Menunggu Komponen')) autoPct = 40;
                        else if (statusVal.includes('Sedang Dikerjakan')) autoPct = 60;
                        else if (statusVal.includes('Tahap Uji Coba')) autoPct = 80;
                        else if (statusVal.includes('100% Normal') || statusVal.includes('Selesai Perbaikan')) autoPct = 100;
                        setAssetFormState({
                          ...assetFormState,
                          progressStatus: statusVal,
                          progressPercent: autoPct
                        });
                      }}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800"
                    >
                      <option value="Belum Ditangani / Off (Mati Suri)">0% - Belum Ditangani / Off (Mati Suri)</option>
                      <option value="Diagnosa Awal & Pengecekan Kerusakan">25% - Diagnosa Awal & Pengecekan</option>
                      <option value="Menunggu Komponen / Sparepart Pengganti">40% - Menunggu Komponen / Sparepart</option>
                      <option value="Dalam Penanganan Divisi Service (On Progress)">50% - Dalam Penanganan Divisi Service</option>
                      <option value="Sedang Dikerjakan / Perbaikan Aktif">60% - Sedang Dikerjakan / Perbaikan Aktif</option>
                      <option value="Sebagian Selesai & Dalam Antrian Kalibrasi">75% - Sebagian Selesai & Kalibrasi</option>
                      <option value="Tahap Uji Coba / Running Test QC">80% - Tahap Uji Coba / Running Test QC</option>
                      <option value="Operasional Terbatas (Catatan Minor)">85% - Operasional Terbatas (Catatan Minor)</option>
                      <option value="Aman / Siap Pakai (100% Normal)">100% - Aman / Siap Pakai (100% Normal)</option>
                      <option value="Selesai Perbaikan & Kembali ke Gudang">100% - Selesai Perbaikan & Kembali ke Gudang</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Capaian Progress Penanganan (%)</label>
                    <span className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded-md ${
                      assetFormState.progressPercent >= 100
                        ? 'bg-emerald-100 text-emerald-800'
                        : assetFormState.progressPercent > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {assetFormState.progressPercent}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={assetFormState.progressPercent}
                      onChange={(e) => setAssetFormState({ ...assetFormState, progressPercent: Number(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={assetFormState.progressPercent}
                      onChange={(e) => setAssetFormState({ ...assetFormState, progressPercent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                      className="w-16 bg-white border border-slate-200 rounded-lg p-1.5 text-center font-mono font-bold text-xs text-slate-800"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[0, 25, 50, 75, 85, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setAssetFormState({ ...assetFormState, progressPercent: pct })}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                          assetFormState.progressPercent === pct
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Rincian Progress Sejauh Apa (Keterangan Tindak Lanjut)
                  </label>
                  <textarea
                    rows={3}
                    value={assetFormState.progressNotes}
                    onChange={(e) => setAssetFormState({ ...assetFormState, progressNotes: e.target.value })}
                    placeholder="Jelaskan tanggal/bulan pelaporan awal, kendala teknis, dan sejauh mana progress penanganan oleh tim..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAssetFormModal(false);
                  setEditingAssetItem(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all cursor-pointer shadow-xs"
              >
                {editingAssetItem ? 'Simpan Perubahan' : 'Simpan Unit Baru'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}


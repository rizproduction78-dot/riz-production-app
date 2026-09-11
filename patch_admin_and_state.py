import re

# 1. Patch Absensi.tsx State & Props
with open('src/components/Absensi.tsx', 'r') as f:
    content = f.read()

# Imports
content = content.replace(
"""import {
  OFFICIAL_SEPTEMBER_2026_SCHEDULE,
  SEPTEMBER_2026_DAYS,
  SHIFT_LEGEND,
  SCHEDULE_NOTE,
  StaffScheduleRow
} from '../data/september2026Schedule';""",
"""import {
  SHIFT_LEGEND,
  SCHEDULE_NOTE,
  StaffScheduleRow,
  getScheduleByKey,
  generateMonthDays
} from '../data/staffSchedules';""")

# Props
content = content.replace(
"""interface AbsensiProps {
  currentUser: Staff;
  onLogActivity: (username: string, role: string, action: string) => void;
  forceSubTab?: 'self' | 'schedule' | 'progress' | 'maintenance_dashboard';
}

export default function Absensi({ currentUser, onLogActivity, forceSubTab }: AbsensiProps) {""",
"""interface AbsensiProps {
  currentUser: Staff;
  onLogActivity: (username: string, role: string, action: string) => void;
  forceSubTab?: 'self' | 'schedule' | 'progress' | 'maintenance_dashboard';
  activeMonth?: string;
  onActiveMonthChange?: (monthKey: string) => void;
  scheduleData?: StaffScheduleRow[];
}

export default function Absensi({ currentUser, onLogActivity, forceSubTab, activeMonth = '2026-09', onActiveMonthChange, scheduleData = [] }: AbsensiProps) {""")

# State
content = content.replace(
"""  // Official September 2026 Schedule State
  const [scheduleViewMode, setScheduleViewMode] = useState<'september2026' | 'custom'>('september2026');
  const [septemberScheduleData, setSeptemberScheduleData] = useState<StaffScheduleRow[]>(() => {
    const saved = localStorage.getItem('riz_september_2026_schedule');
    return saved ? JSON.parse(saved) : OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  });
  const [septemberDivisionFilter, setSeptemberDivisionFilter] = useState<string>('All');""",
"""  // Official Schedule State
  const [scheduleViewMode, setScheduleViewMode] = useState<'official' | 'custom'>('official');
  const [divisionFilter, setDivisionFilter] = useState<string>('All');""")

# Subs
content = content.replace(
"""    const unsubSchedule = subscribeCloudCollection<StaffScheduleRow>(
      'september_2026_schedule',
      'riz_september_2026_schedule',
      setSeptemberScheduleData,
      OFFICIAL_SEPTEMBER_2026_SCHEDULE
    );

    return () => {
      unsubAttendance();
      unsubSchedule();
    };""",
"""    return () => {
      unsubAttendance();
    };""")

# Handlers
content = content.replace(
"""  useEffect(() => {
    localStorage.setItem('riz_september_2026_schedule', JSON.stringify(septemberScheduleData));
  }, [septemberScheduleData]);

  // Handler to toggle / cycle September shift with Cloud Firestore push
  const handleToggleSeptemberShift = (staffNo: number, day: number) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Supervisor' && currentUser.role !== 'Manager') return;

    const cycle: string[] = ['MD', 'P', 'M', 'PM', 'L', 'Cuti', '-'];
    const updated = septemberScheduleData.map(row => {
      if (row.no === staffNo) {
        const currentShift = row.shifts[day] || '-';
        const nextIdx = (cycle.indexOf(currentShift) + 1) % cycle.length;
        return {
          ...row,
          shifts: {
            ...row.shifts,
            [day]: cycle[nextIdx]
          }
        };
      }
      return row;
    });

    setSeptemberScheduleData(updated);
    localStorage.setItem('riz_september_2026_schedule', JSON.stringify(updated));
    pushCollectionToCloud('september_2026_schedule', updated, currentUser.name);
  };""",
"""  // Handler to toggle / cycle shift with Cloud Firestore push
  const handleToggleShift = (staffNo: number, day: number) => {
    if (currentUser.role !== 'Admin' && currentUser.role !== 'Supervisor' && currentUser.role !== 'Manager') return;

    const cycle: string[] = ['MD', 'P', 'M', 'PM', 'L', 'Cuti', '-'];
    const updated = scheduleData.map(row => {
      if (row.no === staffNo) {
        const currentShift = row.shifts[day] || '-';
        const nextIdx = (cycle.indexOf(currentShift) + 1) % cycle.length;
        return {
          ...row,
          shifts: {
            ...row.shifts,
            [day]: cycle[nextIdx]
          }
        };
      }
      return row;
    });

    localStorage.setItem(`riz_schedule_${activeMonth}`, JSON.stringify(updated));
    pushCollectionToCloud(`schedule_${activeMonth}`, updated, currentUser.name);
  };""")

# View Button
content = content.replace(
"""              <button
                type="button"
                onClick={() => setScheduleViewMode('september2026')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scheduleViewMode === 'september2026'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>📅 Schedule September 2026 (Resmi)</span>
              </button>""",
"""              <button
                type="button"
                onClick={() => setScheduleViewMode('official')}
                className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  scheduleViewMode === 'official'
                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>📅 Schedule Resmi Bulanan</span>
              </button>""")

with open('src/components/Absensi.tsx', 'w') as f:
    f.write(content)


# 2. Patch AdminPanel.tsx
with open('src/components/AdminPanel.tsx', 'r') as f:
    admin = f.read()

admin = admin.replace(
"""import { OFFICIAL_SEPTEMBER_2026_SCHEDULE, StaffScheduleRow } from '../data/september2026Schedule';""",
"""import { getScheduleByKey, StaffScheduleRow } from '../data/staffSchedules';""")

admin = admin.replace(
"""  onUpdateFleetAssignment: (id: string, updated: Partial<FleetAssignment>) => void;
  onDeleteFleetAssignment: (id: string) => void;
}

export default function AdminPanel({
  currentUser,
  onLogActivity,
  findings,
  onAddFinding,
  onUpdateFinding,
  onDeleteFinding,
  workOrders,
  onAddWorkOrder,
  onUpdateWorkOrder,
  onDeleteWorkOrder,
  maintenanceSchedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  dailyReports = [],
  logbookEntries = [],
  freelanceList,
  onAddFreelance,
  onUpdateFreelance,
  onDeleteFreelance,
  driverList,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  fleetAssignments,
  onAddFleetAssignment,
  onUpdateFleetAssignment,
  onDeleteFleetAssignment
}: AdminPanelProps) {""",
"""  onUpdateFleetAssignment: (id: string, updated: Partial<FleetAssignment>) => void;
  onDeleteFleetAssignment: (id: string) => void;
  activeMonth?: string;
  onActiveMonthChange?: (monthKey: string) => void;
  scheduleData?: StaffScheduleRow[];
}

export default function AdminPanel({
  currentUser,
  onLogActivity,
  findings,
  onAddFinding,
  onUpdateFinding,
  onDeleteFinding,
  workOrders,
  onAddWorkOrder,
  onUpdateWorkOrder,
  onDeleteWorkOrder,
  maintenanceSchedules,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  dailyReports = [],
  logbookEntries = [],
  freelanceList,
  onAddFreelance,
  onUpdateFreelance,
  onDeleteFreelance,
  driverList,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  fleetAssignments,
  onAddFleetAssignment,
  onUpdateFleetAssignment,
  onDeleteFleetAssignment,
  activeMonth = '2026-09',
  onActiveMonthChange,
  scheduleData = []
}: AdminPanelProps) {""")

admin = admin.replace(
"""    const unsubSchedule = subscribeCloudCollection<StaffScheduleRow>(
      'september_2026_schedule',
      'riz_september_2026_schedule',
      setSeptemberSchedule,
      OFFICIAL_SEPTEMBER_2026_SCHEDULE
    );

    return () => {
      unsubStaff();
      unsubFreelance();
      unsubDrivers();
      unsubVehicles();
      unsubAssignments();
      unsubSchedule();
    };""",
"""    return () => {
      unsubStaff();
      unsubFreelance();
      unsubDrivers();
      unsubVehicles();
      unsubAssignments();
    };""")

admin = admin.replace(
"""  const [septemberSchedule, setSeptemberSchedule] = useState<StaffScheduleRow[]>(() => {
    try {
      const saved = localStorage.getItem('riz_september_2026_schedule');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return OFFICIAL_SEPTEMBER_2026_SCHEDULE;
  });

  const saveSchedule = (updated: StaffScheduleRow[]) => {
    setSeptemberSchedule(updated);
    localStorage.setItem('riz_september_2026_schedule', JSON.stringify(updated));
    pushCollectionToCloud('september_2026_schedule', updated, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, 'Memperbarui jadwal dinas operasional shift September 2026');
  };

  const handleUpdateDayShift = (staffId: string, day: number, newShift: string) => {
    const updated = septemberSchedule.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          shifts: {
            ...s.shifts,
            [day]: newShift
          }
        };
      }
      return s;
    });
    saveSchedule(updated);
  };""",
"""  const saveSchedule = (updated: StaffScheduleRow[]) => {
    localStorage.setItem(`riz_schedule_${activeMonth}`, JSON.stringify(updated));
    pushCollectionToCloud(`schedule_${activeMonth}`, updated, currentUser.name);
    onLogActivity(currentUser.name, currentUser.role, `Memperbarui jadwal dinas operasional shift ${getScheduleByKey(activeMonth)?.label}`);
  };

  const handleUpdateDayShift = (staffId: string, day: number, newShift: string) => {
    const updated = scheduleData.map(s => {
      if ((s as any).id === staffId || String(s.no) === String(staffId)) {
        return {
          ...s,
          shifts: {
            ...s.shifts,
            [day]: newShift
          }
        };
      }
      return s;
    });
    saveSchedule(updated);
  };""")

admin = admin.replace(
"""    if (res.success && res.details?.schedule_shifts) {
      setSeptemberSchedule(res.details.schedule_shifts);
      setSheetLastSync(new Date().toISOString());
      onLogActivity(currentUser.name, currentUser.role, 'Menarik data jadwal shift dari Google Sheet Spreadsheet');
    }""",
"""    if (res.success && res.details?.schedule_shifts) {
      saveSchedule(res.details.schedule_shifts);
      setSheetLastSync(new Date().toISOString());
      onLogActivity(currentUser.name, currentUser.role, 'Menarik data jadwal shift dari Google Sheet Spreadsheet');
    }""")

admin = admin.replace(
"""          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase">Jadwal Shift Operasional September 2026</h2>
                <p className="text-xs text-slate-500 mt-1">Klik pada sel shift untuk mengubah (MD/P/M/L/Cuti/-)</p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-bold text-[10px]">
                    <th className="p-3 sticky left-0 bg-slate-50 z-10">Nama Staf</th>
                    <th className="p-3">Divisi</th>
                    {Array.from({ length: 30 }, (_, i) => (
                      <th key={i + 1} className="p-2 text-center w-8 border-l border-slate-200/60">
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {septemberSchedule.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-900 sticky left-0 bg-white z-10">{s.name}</td>
                      <td className="p-3 font-sans text-slate-500">{s.division}</td>
                      {Array.from({ length: 30 }, (_, i) => {
                        const day = i + 1;
                        const shift = s.shifts?.[day] || '-';
                        return (
                          <td key={day} className="p-1 text-center border-l border-slate-100">
                            <select
                              value={shift}
                              onChange={(e) => handleUpdateDayShift(s.id, day, e.target.value)}
                              className="bg-transparent text-[10px] font-black focus:outline-none cursor-pointer text-slate-800"
                            >
                              <option value="P">P</option>
                              <option value="MD">MD</option>
                              <option value="M">M</option>
                              <option value="PM">PM</option>
                              <option value="L">L</option>
                              <option value="MASUK">MASUK</option>
                              <option value="IZIN">IZIN</option>
                              <option value="SAKIT">SAKIT</option>
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>""",
"""          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase">Jadwal Shift Operasional {getScheduleByKey(activeMonth)?.label || activeMonth}</h2>
                <p className="text-xs text-slate-500 mt-1">Sistem Jadwal Multibulan. Perubahan akan tersinkronisasi otomatis.</p>
              </div>
              
              <div className="flex items-center gap-3">
                {onActiveMonthChange && (
                  <select 
                    value={activeMonth}
                    onChange={(e) => onActiveMonthChange(e.target.value)}
                    className="text-xs p-2 border border-slate-200 rounded font-semibold text-slate-700 outline-none min-w-[150px]"
                  >
                    <option value="2026-09">September 2026</option>
                    <option value="2026-10">Oktober 2026</option>
                    <option value="2026-11">November 2026</option>
                    <option value="2026-12">Desember 2026</option>
                  </select>
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-bold text-[10px]">
                    <th className="p-3 sticky left-0 bg-slate-50 z-10">Nama Staf</th>
                    <th className="p-3">Divisi</th>
                    {Array.from({ length: getScheduleByKey(activeMonth)?.totalDays || 30 }, (_, i) => (
                      <th key={i + 1} className="p-2 text-center w-8 border-l border-slate-200/60">
                        {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scheduleData.map(s => (
                    <tr key={s.id || s.no} className="hover:bg-slate-50/50">
                      <td className="p-3 font-sans font-bold text-slate-900 sticky left-0 bg-white z-10">{s.name}</td>
                      <td className="p-3 font-sans text-slate-500">{s.division}</td>
                      {Array.from({ length: getScheduleByKey(activeMonth)?.totalDays || 30 }, (_, i) => {
                        const day = i + 1;
                        const shift = s.shifts?.[day] || '-';
                        const staffId = (s as any).id || s.no.toString();
                        return (
                          <td key={day} className="p-1 text-center border-l border-slate-100">
                            <select
                              value={shift}
                              onChange={(e) => handleUpdateDayShift(staffId, day, e.target.value)}
                              className="bg-transparent text-[10px] font-black focus:outline-none cursor-pointer text-slate-800"
                            >
                              <option value="P">P</option>
                              <option value="MD">MD</option>
                              <option value="M">M</option>
                              <option value="PM">PM</option>
                              <option value="L">L</option>
                              <option value="MASUK">MASUK</option>
                              <option value="IZIN">IZIN</option>
                              <option value="SAKIT">SAKIT</option>
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>""")

admin = admin.replace(
"""                  <div className="text-[10px] text-indigo-200/70">Import perubahan shift jadwal September 2026 dari Spreadsheet</div>""",
"""                  <div className="text-[10px] text-indigo-200/70">Import perubahan shift jadwal dari Spreadsheet</div>""")

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(admin)

print("Done patching!")

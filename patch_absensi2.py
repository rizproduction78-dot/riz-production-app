import os

with open('src/components/Absensi.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "MODE 1: OFFICIAL SEPTEMBER 2026 SCHEDULE" in line:
        start_idx = i - 1  # include the top border comment
    if "MODE 2: CUSTOM" in line:
        end_idx = i - 1    # include the top border comment for custom mode
        break

if start_idx != -1 and end_idx != -1:
    new_block = """          {/* ────────────────────────────────────────────────────────── */}
          {/* MODE 1: OFFICIAL MONTHLY SCHEDULE                          */}
          {/* ────────────────────────────────────────────────────────── */}
          {scheduleViewMode === 'official' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <select 
                    value={divisionFilter}
                    onChange={(e) => setDivisionFilter(e.target.value)}
                    className="text-xs p-2 border border-slate-200 rounded font-semibold text-slate-700 outline-none w-full md:w-auto min-w-[200px]"
                  >
                    <option value="All">--- Semua Divisi ---</option>
                    <option value="GUDANG">Gudang</option>
                    <option value="LED">Videotron (LED)</option>
                    <option value="ADMIN">Admin / Manajemen</option>
                    <option value="SOUND">Sound / Audio</option>
                    <option value="LIGHTING">Lighting</option>
                    <option value="MULTIMEDIA">Multimedia</option>
                    <option value="SERVICE">Service</option>
                  </select>
                  
                  {onActiveMonthChange && (
                    <select 
                      value={activeMonth}
                      onChange={(e) => onActiveMonthChange(e.target.value)}
                      className="text-xs p-2 border border-slate-200 rounded font-semibold text-slate-700 outline-none w-full md:w-auto"
                    >
                      <option value="2026-09">September 2026</option>
                      <option value="2026-10">Oktober 2026</option>
                      <option value="2026-11">November 2026</option>
                      <option value="2026-12">Desember 2026</option>
                    </select>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 text-[9px] w-full justify-end font-semibold text-slate-500">
                  {Object.values(SHIFT_LEGEND).map(sh => (
                    <span key={sh.code} className={`px-1.5 py-0.5 rounded border ${sh.bg} ${sh.border} ${sh.text}`}>
                      {sh.code} = {sh.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full text-[10px] text-left border-collapse min-w-max">
                  <thead>
                    <tr className="bg-slate-800 text-slate-100 uppercase font-black text-center">
                      <th className="p-2 border-r border-slate-600 sticky left-0 bg-slate-800 z-10 whitespace-nowrap" rowSpan={2}>No</th>
                      <th className="p-2 border-r border-slate-600 sticky left-8 bg-slate-800 z-10 whitespace-nowrap" rowSpan={2}>Divisi</th>
                      <th className="p-2 border-r border-slate-600 sticky left-24 bg-slate-800 z-10 whitespace-nowrap" rowSpan={2}>Nama Crew</th>
                      <th className="p-1 border-b border-slate-600" colSpan={getScheduleByKey(activeMonth)?.totalDays || 30}>
                        TANGGAL ({getScheduleByKey(activeMonth)?.label || 'Bulan'})
                      </th>
                    </tr>
                    <tr className="bg-slate-700 text-slate-200 text-[9px] text-center font-bold">
                      {(getScheduleByKey(activeMonth)?.days || generateMonthDays(2026, 9)).map(d => (
                        <th key={d.day} className={`p-1 border border-slate-600 min-w-[28px] ${d.isWeekend ? 'bg-rose-900/40 text-rose-200' : ''}`}>
                          {d.day}<br/>
                          <span className="text-[8px] font-normal">{d.dayName}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData
                      .filter(row => divisionFilter === 'All' || row.division === divisionFilter)
                      .map((row, idx) => (
                      <tr key={row.no} className="border-b border-slate-200 hover:bg-slate-50 transition-colors text-center font-bold">
                        <td className="p-1.5 border-r border-slate-200 text-slate-500 sticky left-0 bg-white group-hover:bg-slate-50 z-10">{idx + 1}</td>
                        <td className="p-1.5 border-r border-slate-200 text-indigo-700 sticky left-8 bg-white group-hover:bg-slate-50 z-10">{row.division}</td>
                        <td className="p-1.5 border-r border-slate-200 text-slate-800 sticky left-24 bg-white group-hover:bg-slate-50 z-10 uppercase whitespace-nowrap text-left pl-2">
                          {row.name}
                        </td>
                        {(getScheduleByKey(activeMonth)?.days || generateMonthDays(2026, 9)).map(d => {
                          const shiftCode = row.shifts[d.day] || '-';
                          const shiftInfo = SHIFT_LEGEND[shiftCode];
                          return (
                            <td 
                              key={d.day} 
                              className={`p-1 border border-slate-200 text-center ${shiftInfo?.bg || 'bg-white'} ${shiftInfo?.text || 'text-slate-800'} ${d.isWeekend ? 'border-r-rose-200' : ''}`}
                              title={shiftInfo?.timeRange}
                              onClick={() => handleToggleShift(row.no, d.day)}
                            >
                              {shiftCode}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
"""
    
    lines = lines[:start_idx] + [new_block] + lines[end_idx:]
    with open('src/components/Absensi.tsx', 'w') as f:
        f.writelines(lines)
    print("Success")
else:
    print(f"Failed to find indices. Start: {start_idx}, End: {end_idx}")


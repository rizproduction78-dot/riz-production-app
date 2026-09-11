import os

with open('src/components/Absensi.tsx', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "{/* ────────────────────────────────────────────────────────── */}" in line and "MODE 1: OFFICIAL SEPTEMBER 2026 SCHEDULE" in lines[i+1]:
        start_idx = i
    if start_idx != -1 and "Tabel Referensi Keterangan" in line:
        # found the end part, backtrack to the closing div of scheduleViewMode === 'september2026'
        for j in range(i, start_idx, -1):
            if "</div>" in lines[j] and "</div>" in lines[j-1]:
                end_idx = j - 2 # rough guess
                break
        if end_idx != -1:
            pass # break? No wait...


import re

with open('src/data/canonicalFirestoreData.ts', 'r') as f:
    content = f.read()

missing_entry = """  ,
  // 18 September 2026
  {
    id: "rep-20260918-kharo",
    date: "2026-09-18",
    staffName: "Kharo",
    division: "Videotron",
    activity: "- Ganti Dead Pixel",
    notes: "REMARK:\\n- 3 Box Belum Beres\\n- 2 Box Clear\\n- 1 Box Beres 3 Kabinet\\n- 1 Box Kerusakan Berat",
    _source: "google_sheet",
    _syncMeta: {
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  }"""

target_str = """    _source: "google_sheet",
    _syncMeta: {
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  }
];

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = ["""

replacement = """    _source: "google_sheet",
    _syncMeta: {
      deviceOS: "macOS",
      browser: "Chrome",
      updatedBy: "GoogleSheetSync",
      deviceType: "Desktop"
    }
  }""" + missing_entry + """
];

export const CANONICAL_FIRESTORE_DAILY_REPORTS: DailyReport[] = ["""

if target_str in content:
    content = content.replace(target_str, replacement)
    with open('src/data/canonicalFirestoreData.ts', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find the target string")

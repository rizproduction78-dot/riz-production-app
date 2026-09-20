import re

with open('src/data/canonicalFirestoreData.ts', 'r') as f:
    content = f.read()

# The missing 18 September data
missing_entry = """  ,
  // 18 Sept
  {
    id: "log-20260918-kharo",
    date: "2026-09-18",
    division: "Videotron",
    staffName: "Kharo",
    activity: "- Ganti Dead Pixel",
    result: "NG",
    followUp: "3 Box Belum Beres, 2 Box Clear, 1 Box Beres 3 Kabinet, 1 Box Kerusakan Berat",
    status: "Open",
    verification: "Supervisor Operasional",
    checklists: {
      "LED Box Progress": { status: "NG", notes: "3 Box Belum Beres, 1 Box Kerusakan Berat" },
      "LED Box Clear": { status: "OK", notes: "2 Box Clear, 1 Box Beres 3 Kabinet" }
    },
    _source: "google_sheet"
  }"""

# Insert right before '];' of CANONICAL_FIRESTORE_DAILY_REPORTS
# The end of CANONICAL_FIRESTORE_DAILY_REPORTS is right before:
# ];
#
# export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = [

target_str = """    _source: "google_sheet"
  }
];

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = ["""

replacement = """    _source: "google_sheet"
  }""" + missing_entry + """
];

export const CANONICAL_FIRESTORE_FINDINGS: Finding[] = ["""

if target_str in content:
    content = content.replace(target_str, replacement)
    with open('src/data/canonicalFirestoreData.ts', 'w') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Could not find the target string")

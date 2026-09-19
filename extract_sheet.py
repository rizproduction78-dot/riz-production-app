import csv
import json

def process_csv(filepath):
    results = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        lines = list(reader)
        
    current_date = None
    for row in lines[5:]:  # Data starts at line 6 (index 5)
        if not any(row):
            continue
            
        date_str = row[0].strip()
        if date_str:
            current_date = date_str
            
        if not current_date:
            continue
            
        crew = row[1].strip()
        if crew.startswith('- '):
            crew = crew[2:]
            
        sound = row[2].strip()
        lighting = row[3].strip()
        led = row[4].strip()
        multimedia = row[5].strip()
        remark = row[6].strip()
        
        # Determine division and activity
        division = ""
        activity = ""
        if sound:
            division = "Audio"
            activity = sound
        elif lighting:
            division = "Lighting"
            activity = lighting
        elif led:
            division = "Videotron"
            activity = led
        elif multimedia:
            division = "Multimedia"
            activity = multimedia
            
        if crew or activity or remark:
            results.append({
                "date": current_date,
                "crew": crew,
                "division": division,
                "activity": activity,
                "remark": remark
            })
            
    with open('src/data/extracted_official_data.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)

if __name__ == '__main__':
    process_csv('src/data/official_data_sept2026.csv')

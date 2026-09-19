import os
import glob

components_dir = 'src/components'
files = glob.glob(os.path.join(components_dir, '*.tsx'))

target_str = '<h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>'
replacement_str = '''<div className="flex items-center gap-4">
              <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-12" />
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
            </div>'''

# Special target for Reports.tsx which has a slightly different div wrapping
old_reports = '''<div>
              <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
            </div>'''
new_reports = '''<div className="flex items-center gap-4">
              <img src="/logo.png" alt="RIZ-PRODUCTION Logo" className="h-16 w-auto object-contain print:h-14" />
              <div>
                <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">RIZ-PRODUCTION</h1>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">Live Event Equipment & Production Solution</p>
              </div>
            </div>'''

for filepath in files:
    with open(filepath, 'r') as f:
        content = f.read()
    
    modified = False
    if old_reports in content:
        content = content.replace(old_reports, new_reports)
        modified = True
    elif target_str in content:
        content = content.replace(target_str, replacement_str)
        modified = True
        
    if modified:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched {filepath}")


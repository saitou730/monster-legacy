from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'src/art_manifest.json').read_text())
checks=[]
for mid in ('owl','manticore'):
 m=manifest['monsters'].get(mid,{})
 checks.append((f'{mid} locked',m.get('lock_status')=='LOCKED'))
 checks.append((f'{mid} official reference',(root/m.get('design_sheet','')).exists()))
 for st in ('idle','attack_prep','attack','hit','stance','danger','icon_portrait'):
  p=m.get('battle_assets',{}).get(st)
  checks.append((f'{mid} {st}',bool(p) and (root/p).exists() and (root/p).stat().st_size>1000))
failed=[]
for n,ok in checks:
 print(('PASS' if ok else 'FAIL'),n)
 if not ok: failed.append(n)
print(f'RESULT {len(checks)-len(failed)}/{len(checks)}')
raise SystemExit(1 if failed else 0)

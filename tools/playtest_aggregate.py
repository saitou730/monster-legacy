#!/usr/bin/env python3
import json, sys, csv
from pathlib import Path

def load(p):
    d=json.loads(Path(p).read_text(encoding='utf-8'))
    return d.get('metrics',{}), d.get('session',{})

def median(vals):
    vals=sorted(v for v in vals if isinstance(v,(int,float)))
    if not vals: return None
    n=len(vals); return vals[n//2] if n%2 else (vals[n//2-1]+vals[n//2])/2

def fmt(v, denom):
    return f'{v:g}/{denom}' if isinstance(v,(int,float)) else f'—/{denom}'

def main(paths):
    rows=[]; seen=set(); duplicates=[]; errors=[]
    for p in paths:
        try: m,s=load(p)
        except Exception as e:
            errors.append(f'{Path(p).name}: {e}'); continue
        sid=m.get('sessionId') or s.get('sessionId')
        if not sid:
            errors.append(f'{Path(p).name}: missing sessionId'); continue
        if sid in seen:
            duplicates.append(sid); continue
        seen.add(sid)
        rows.append({
          'file':Path(p).name,'sessionId':sid,'build':m.get('build') or s.get('build'),
          'comprehension':m.get('comprehensionCorrect'),'replayIntent':m.get('replayIntent'),
          'clarity':m.get('clarity'),'bossExecutes':m.get('bossExecutes'),'bossReplays':m.get('bossReplays'),
          'bossClears':m.get('bossClears'),'masteryClears':m.get('masteryClears'),
          'commandChanges':m.get('commandChanges'),'comment':(s.get('survey') or {}).get('comment','')
        })
    if not rows:
        print('No valid reports. Usage: playtest_aggregate.py report1.json report2.json ...')
        for e in errors: print('WARN',e)
        return 2
    comp=[r['comprehension'] for r in rows]; replay=[r['replayIntent'] for r in rows]; clarity=[r['clarity'] for r in rows]
    rule_pass=sum(1 for v in comp if isinstance(v,(int,float)) and v>=3)
    replay4=sum(1 for v in replay if isinstance(v,(int,float)) and v>=4)
    med_comp,med_replay,med_clarity=median(comp),median(replay),median(clarity)
    gate = len(rows)>=5 and med_comp is not None and med_comp>=3 and replay4>=4 and med_replay is not None and med_replay>=4
    lines=[
      '# MONSTER LEGACY — External Playtest Aggregate',
      f'Players: {len(rows)}',
      f'Median comprehension: {fmt(med_comp,4)}',
      f'Comprehension >=3/4: {rule_pass}/{len(rows)}',
      f'Median replay intent: {fmt(med_replay,5)}',
      f'Replay intent >=4/5: {replay4}/{len(rows)}',
      f'Median clarity: {fmt(med_clarity,5)}',
      f'90-point external evidence gate: {"PASS CANDIDATE" if gate else "NOT YET"}'
    ]
    print('\n'.join(lines))
    if duplicates: print('WARN duplicate session IDs excluded:', ', '.join(sorted(set(duplicates))))
    for e in errors: print('WARN',e)
    out=Path('PLAYTEST_AGGREGATE.csv')
    with out.open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=rows[0].keys()); w.writeheader(); w.writerows(rows)
    md=Path('PLAYTEST_DIRECTOR_SUMMARY.md'); md.write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(f'CSV: {out.resolve()}')
    print(f'Summary: {md.resolve()}')
    return 0
if __name__=='__main__':
    raise SystemExit(main(sys.argv[1:]))

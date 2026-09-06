from pathlib import Path
import wave, sys
root=Path(__file__).resolve().parents[1]
stems=['base_calm.wav','heat_percussion.wav','rage_pulse.wav','danger_choir.wav','legacy_ritual.wav']
se=['ui_select.wav','command_lock.wav','stance.wav','execute.wav','hit.wav','crash.wav','equipment.wav','join.wav','band_shift.wav','legacy_art.wav']
errors=[]
durs=[]
for name in stems:
    p=root/'assets/audio/stems'/name
    if not p.exists(): errors.append(f'missing stem {name}'); continue
    with wave.open(str(p),'rb') as w: durs.append(w.getnframes()/w.getframerate())
for name in se:
    p=root/'assets/audio/se'/name
    if not p.exists(): errors.append(f'missing se {name}')
if durs and max(durs)-min(durs)>.001: errors.append('stem loop lengths do not match')
audio=(root/'src/audio.js').read_text()
for token in ['base_calm.wav','heat_percussion.wav','rage_pulse.wav','danger_choir.wav','legacy_ritual.wav','SYNTH FALLBACK']:
    if token not in audio: errors.append(f'audio.js missing {token}')
app=(root/'src/app.js').read_text()
for ev in ['execute','stance','crash','hit','equipment','join']:
    if f'\"{ev}\"' not in app: errors.append(f'app hook missing {ev}')
print(f'stems={len(stems)} se={len(se)} loop_seconds={durs[0] if durs else 0:.3f}')
if errors:
    print('FAIL')
    for e in errors: print('-',e)
    sys.exit(1)
print('PASS')

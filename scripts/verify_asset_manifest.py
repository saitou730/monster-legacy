from pathlib import Path
import hashlib, sys
root = Path(__file__).resolve().parents[1]
manifest = root / 'ASSET_MANIFEST_SHA256.txt'
expected = {}
for line in manifest.read_text(encoding='utf-8').splitlines():
    if not line.strip(): continue
    sha, rel = line.split('  ', 1)
    expected[rel] = sha
bad=[]
for rel, sha in expected.items():
    p=root/rel
    if not p.exists(): bad.append((rel,'MISSING')); continue
    got=hashlib.sha256(p.read_bytes()).hexdigest()
    if got!=sha: bad.append((rel,'HASH '+got))
print(f'assets checked: {len(expected)}')
if bad:
    for rel, why in bad: print(f'FAIL {rel}: {why}')
    sys.exit(1)
print('ASSET MANIFEST PASS')

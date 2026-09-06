from pathlib import Path
from io import BytesIO
from PIL import Image
import base64, mimetypes, json, re
root=Path(__file__).resolve().parents[1]
out=Path('/mnt/data/MONSTER_LEGACY_v1.8.1_MOBILE_HUNT_FIX_DIRECT_PLAY.html')

def data_uri(path:Path):
    ext=path.suffix.lower()
    if ext in {'.png','.jpg','.jpeg','.webp'}:
        im=Image.open(path)
        buf=BytesIO()
        # Preserve transparency and identity; this is delivery compression only.
        if im.mode not in ('RGB','RGBA'): im=im.convert('RGBA' if 'A' in im.getbands() else 'RGB')
        im.save(buf,format='WEBP',quality=78,method=0,lossless=False)
        return 'data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
    mime=mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return f'data:{mime};base64,'+base64.b64encode(path.read_bytes()).decode()

asset_paths=[]
for sub in ['assets/art','assets/battle','assets/audio']:
    for p in (root/sub).rglob('*'):
        if p.is_file(): asset_paths.append(p)
asset_map={p.relative_to(root).as_posix():data_uri(p) for p in asset_paths}

html=(root/'index.html').read_text()
css=(root/'styles/app.css').read_text()
# Replace literal runtime URLs in HTML/CSS with compact delivery assets.
for k,v in sorted(asset_map.items(), key=lambda kv:-len(kv[0])):
    html=html.replace(k,v)
    css=css.replace(k,v)
html=re.sub(r'<link rel="stylesheet" href="styles/app.css">', '<style>'+css+'</style>', html)
# Remove external scripts, then inject resolver + code in original order.
for name in ['data.js','storage.js','audio.js','battle.js','fusion.js','legacy.js','progression.js','test_battle.js','playtest.js','motion.js','app.js']:
    html=html.replace(f'<script src="src/{name}"></script>','')
resolver='<script>window.__ML_ASSETS='+json.dumps(asset_map,separators=(',',':'),ensure_ascii=False)+';window.MLAsset=(p)=>window.__ML_ASSETS[p]||p;</script>'
code=[]
for name in ['data.js','storage.js','audio.js','battle.js','fusion.js','legacy.js','progression.js','test_battle.js','playtest.js','motion.js','app.js']:
    txt=(root/'src'/name).read_text().replace('</script>','<\\/script>')
    code.append('<script>'+txt+'</script>')
html=html.replace('</body>',resolver+''.join(code)+'</body>')
out.write_text(html)
print(out, out.stat().st_size)

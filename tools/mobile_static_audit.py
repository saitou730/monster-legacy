from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
index = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "styles" / "app.css").read_text(encoding="utf-8")

checks = {
    "zoom allowed": "user-scalable=no" not in index and "maximum-scale=1" not in index,
    "viewport fit cover": "viewport-fit=cover" in index,
    "vh fallback": "height:100vh;height:100dvh" in css.replace(" ", ""),
    "sticky NEXT": ".next{margin-top:8px;position:sticky" in css.replace("\n", ""),
    "sticky action rail": ".actionRail{position:sticky" in css.replace("\n", ""),
    "hunt action rail": 'class="actionRail"' in index and 'id="huntExec"' in index,
    "boss action rail": ('class="actionRail combatActionRail"' in index or index.count('class="actionRail"') >= 2) and 'id="bossExec"' in index,
    "safe bottom": "var(--safeB)" in css,
    "touch manipulation": "touch-action:manipulation" in css,
    "toast wraps": "white-space:normal" in css and "max-width:calc(100vw - 24px)" in css,
    "header no absolute controls": ".headerActions" in css and ".motionToggle{\n  position:static" in css,
    "version label": "Director Build v1.8" in index,
    "formal voltage seal": 'id="bossVoltageBig"' in index and ".voltageSeal" in css,
    "field party layer": 'id="bossFieldParty"' in (ROOT / "src" / "app.js").read_text(encoding="utf-8") and ".fieldParty" in css,
    "execute 2-command label": "EXECUTE ${boss.queue.length}/2" in (ROOT / "src" / "app.js").read_text(encoding="utf-8"),
}

failed = [name for name, ok in checks.items() if not ok]
for name, ok in checks.items():
    print(f"{'PASS' if ok else 'FAIL'}  {name}")

if failed:
    raise SystemExit(f"Static mobile audit failed: {', '.join(failed)}")
print(f"PASS  {len(checks)}/{len(checks)} static readiness checks")

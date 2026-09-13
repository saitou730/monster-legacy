# MONSTER LEGACY — Audio Direction v0.1

Status: AUDIO FIRST PASS / REVIEW BEFORE RUNTIME PROMOTION
Owner: Audio lane
Canonical base: main @ 74c404b9dfd6b37df137b4544b1f967f3d777381

## Purpose
Create an original MONSTER LEGACY battle identity that supports the existing tactical loop instead of replacing it with a flat background track.

The current runtime already has a five-stem adaptive mixer in `src/audio.js`. v0.1 therefore preserves the existing implementation contract and targets drop-in stem replacement.

## Hard runtime contract
- Portrait 9:16 and battle UI remain untouched.
- NEXT is locked at turn start.
- Exactly 3 active monsters.
- Exactly 2 COMMAND + remaining 1 STANCE.
- Music must not mask NEXT / COMMAND / impact SFX.
- First user gesture audio unlock and Android Chrome continuity remain QA gates.
- No progression state may depend on music playback.

## Adaptive score language
The canonical VOLTAGE bands are the score structure:

- CALM — warm strings, restrained bell/celesta motif, space for decision-making.
- HEAT — low pulse + counter-melody; pressure grows without becoming noisy.
- RAGE — war-drum layer + urgent low ostinato.
- DANGER — solemn choir-like harmonic pressure; danger should feel ceremonial, not merely louder.
- LEGACY — runtime already creates a brief stillness by dipping the music bus; the LEGACY stem answers with low ritual drone + resonant chimes.

This follows the existing data language:
CALM = quiet strings/reverb; HEAT = bass/counter-line; RAGE = battle drums/pressure; DANGER = solemn crisis; LEGACY = stillness into ritual harmony.

## Shared musical identity
- tonal center: D minor, with F-major / Bb-major light
- tempo: 144 BPM
- loop: 4 bars / 6.666666 sec
- motif: a short rising minor-third/fifth gesture with a falling answer
- mood: adventure + mystery + ancient-memory melancholy
- goal: memorable enough to identify MONSTER LEGACY, restrained enough for tactical reading

## Technical format
All five v0.1 stems are synchronized:
- 11,025 Hz
- mono
- PCM 16-bit WAV
- 73,500 samples
- 6.666666 sec

This matches the current authored stem format and requires no `src/audio.js` code change.

## Intended runtime paths after approval
- `assets/audio/stems/base_calm.wav`
- `assets/audio/stems/heat_percussion.wav`
- `assets/audio/stems/rage_pulse.wav`
- `assets/audio/stems/danger_choir.wav`
- `assets/audio/stems/legacy_ritual.wav`

## Boss differentiation
The common adaptive system remains the foundation, but boss identity should later add arrangement variants rather than new battle rules:
- 荊棘の大猪: weight / RAISE-RECEIVE / low drums and stubborn pulse.
- 雷フクロウ: SUPPRESS / sparse high metallic air / controlled electricity, less percussion density.
- 裂空マンティコア: READ-DODGE-CRASH / sharper syncopation, wing-like rush, stronger CRASH accent.

Do not alter official Art Lock or gameplay semantics to serve music.

## v0.1 generated pack
A first-pass synchronized five-stem pack and a five-stage VOLTAGE preview were generated from this specification. Binary promotion is intentionally separate from this document so Work can perform seam/pop, SFX separation, browser, and physical Android QA before replacing the canonical authored stems.

## Promotion QA
Required before replacing canonical stems:
1. No click/pop at the 6.666 sec seam on Android Chrome.
2. First user gesture unlock is clean.
3. No audio restart spam on DOM rerender.
4. SELECT / COMMAND / HIT / CRASH / LEGACY SFX remain distinct.
5. CALM/HEAT do not distract from command choice.
6. RAGE/DANGER increase pressure without obscuring enemy telegraph.
7. LEGACY stillness + ritual entrance reads clearly.
8. Browser regression passes at 360x800, 390x844, 430x932.
9. Physical Android PASS must be reported separately from browser QA.

## Next audio slices after v0.1 approval
1. Title / main leitmotif.
2. HOME / preparation theme.
3. 雷フクロウ boss arrangement.
4. 裂空マンティコア boundary arrangement.
5. JOIN / FUSION / CONTRACT short musical stingers.

Latest main remains the only development source of truth.

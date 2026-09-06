# MONSTER LEGACY — Production Audio Contract v1.0

Build target: WEB v0.6.6 / Portrait Vertical Slice

## Director intent
Audio must make VOLTAGE readable without looking at the meter. The mix grows from restrained ritual-dark-fantasy ambience into danger and LEGACY without restarting the song.

## Music architecture
All stems share the same loop length and musical grid so they can remain phase-locked.

| Bus | File | Enter | Role |
|---|---|---:|---|
| BASE | `assets/audio/stems/base_calm.wav` | VOL 0 | dark D-minor bed / identity |
| HEAT | `assets/audio/stems/heat_percussion.wav` | VOL 30 | low frame-drum pulse |
| RAGE | `assets/audio/stems/rage_pulse.wav` | VOL 60 | syncopated urgency layer |
| DANGER | `assets/audio/stems/danger_choir.wav` | VOL 90 | non-verbal choral pressure |
| LEGACY | `assets/audio/stems/legacy_ritual.wav` | VOL 100 | ritual bell / climax layer |

Reference demo stems are original procedural masters authored for integration validation. They are **production-structure references**, not the final composer master.

## Mix rules
- No music restart on band change.
- Crossfade layers over roughly 0.35–0.55 s.
- VOL100 temporarily ducks the music bus, then introduces LEGACY.
- BGM and SE remain on separate buses.
- Audio starts only after user interaction to satisfy mobile autoplay policy.
- If sample loading fails, WebAudio synth fallback preserves gameplay feedback.

## Authored SE slots
| Event | File | Use |
|---|---|---|
| UI select | `se/ui_select.wav` | first command selection / reselection |
| 2-command lock | `se/command_lock.wav` | second command locked |
| STANCE | `se/stance.wav` | unselected unit becomes STANCE |
| Execute | `se/execute.wav` | turn commit |
| Hit | `se/hit.wav` | impact |
| CRASH | `se/crash.wav` | dedicated strategy reward |
| Equipment | `se/equipment.wav` | equipment command |
| JOIN | `se/join.wav` | resonance success |
| Band shift | `se/band_shift.wav` | HEAT/RAGE/DANGER transition |
| LEGACY ART | `se/legacy_art.wav` | VOL100 telegraph / impact identity |

## Art / design constraints
- Audio must not compensate for unclear UI. NEXT remains visually locked and readable.
- No new monster identity or voice is established by audio.
- Thunder Owl / Rift Manticore remain without character-identity audio until official Art Lock.

## Final production handoff requirements
Final composer/sound-designer replacement assets should preserve the filenames or update only this contract + manifest. Recommended delivery: 48 kHz / 24-bit WAV, peak-safe, loop points sample-aligned, no baked master limiter across stems.

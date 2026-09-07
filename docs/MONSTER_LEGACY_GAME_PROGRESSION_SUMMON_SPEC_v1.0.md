# MONSTER LEGACY — GAME PROGRESSION + SUMMON SYSTEM SPEC v1.0
Date: 2026-09-07
Status: DESIGN LOCK CANDIDATE
Platform: Portrait 9:16 Web Vertical Slice → later native migration candidate

## 0. Purpose
This document defines the first-session progression from title to Chapter 1 completion and formally positions SUMMON so it does not weaken HUNT/JOIN/FUSION.

Core principle:
- Monsters are obtained by understanding them: HUNT / JOIN / FUSION.
- Contract characters are obtained by SUMMON and modify how the 3-monster party plays.
- SUMMON must never replace the emotional/gameplay value of finding, joining, raising, and fusing monsters.

## 1. Game Pillars
1. Read the monster, not just the UI.
2. Three monsters are always the party core.
3. Every turn = 2 COMMAND + 1 STANCE.
4. NEXT ACTION is locked at turn start.
5. VOLTAGE changes both tactics and atmosphere.
6. JOIN is deterministic resonance, never capture RNG.
7. FUSION preserves lineage and selected HERITAGE.
8. LEGACY is inherited battle philosophy, not a stat stick.
9. Human / contract characters support the monster party; they do not replace it.

## 2. First Session — Canonical Flow
Target duration: 30–45 minutes for a player who reads at normal speed.

### Phase A — Title / Cold Open (2–3 min)
TITLE
→ TAP TO START
→ short audiovisual cold open
→ Mira / Goura encounter
→ first controlled scene

Player learns:
- the world reacts to inherited combat memory
- monsters are not simply enemies to collect
- Goura is treated as a party member, not a pet

No menus yet except minimal dialogue advance.

### Phase B — First Battle Tutorial (4–6 min)
Tutorial battle with 3 monsters visible.
Teaching order:
1. NEXT ACTION
2. choose first COMMAND
3. choose second COMMAND
4. unselected monster becomes STANCE
5. TURN EXECUTE
6. VOLTAGE response

Do not teach equipment, legacy, hunt, fusion here.

Completion reward:
- HOME unlocked
- STORY tile active

### Phase C — HOME Introduction (2 min)
HOME should immediately answer:
- Where am I?
- What is my next objective?
- Who are my 3 current monsters?
- What did I just unlock?

At this point HOME shows only:
- NEXT JOURNEY
- CURRENT PARTY
- STORY
- PARTY
- ARCHIVE locked/teased

HUNT / FUSION / SUMMON are visible as future systems but not active.

### Phase D — Chapter 1 Story / Boss 1 (6–8 min)
Short story beats lead to 荊棘の大猪.
Boss teaches RECEIVE / guard timing.

First clear reward:
- first LEGACY record becomes visible but not yet fully inheritable
- HUNT unlocked
- wind-bat field request appears

### Phase E — HUNT / JOIN (6–8 min)
Target: 風コウモリ.

JOIN condition canon:
- evade its single-target attack
- reduce target to HP <= 35%
- remain below RAGE
- RESONATE consumes 1 COMMAND
- RESONATE succeeds deterministically

Important failure behavior:
- Qualified lethal damage clamps target to 1 HP and opens RESONANCE READY.
- Unqualified KO shows FIELD RESONANCE LOST with explicit retry reason.

JOIN result:
- 風コウモリ added to ROSTER
- role preview
- HERITAGE preview
- LINEAGE record started

### Phase F — PARTY / Loadout (3–5 min)
First meaningful party choice:
Roster temporarily has 4 usable monsters.
Player chooses any 3.

Screen must teach:
- 3 active slots
- roster assignment
- EQUIPMENT as the third technique source
- if LEGACY is available, its unit-specific translated effect

Goal: player should feel “I am building a tactic,” not “I am checking inventory.”

### Phase G — FUSION Unlock (4–6 min)
FUSION LAB opens after JOIN.
First SPECIAL FUSION:
火トカゲ + 風コウモリ → 炎翼リザル

Rules shown before confirmation:
- result is fixed, not random
- both parents are consumed
- choose 1 HERITAGE from each parent
- child starts Lv1
- Growth Echo ~60%
- Equipment / LEGACY CORE returned
- lineage saved
- irreversible

Unique / contract characters can never be consumed.

### Phase H — NEW SPECIES TEST (1 min)
45–60 second test battle.
Purpose:
- teach 炎翼リザル’s identity
- confirm evasive offense
- let player feel the value of fusion immediately

Completion handoff:
→ boss replay / next mastery challenge

### Phase I — LEGACY Mastery / Archive (5–7 min)
Boss rematch with mastery condition.
Reward:
- LEGACY CORE acquired
- Archive entry updated
- unit-specific translated effects shown
- HOME atmosphere changes

### Phase J — SUMMON Unlock (2–3 min)
SUMMON unlocks only after the player has already:
- completed at least one HUNT/JOIN
- completed first FUSION
- completed NEW SPECIES TEST

Reason:
The player must understand that monsters come from the world before seeing any gacha.

Unlock narrative:
A contract resonance device / covenant archive responds to the player’s newly formed lineage.
This is framed as “contracting with people whose will can guide monsters,” not summoning monsters from nowhere.

## 3. SUMMON — Formal Positioning
### 3.1 What SUMMON gives
SUMMON gives CONTRACT CHARACTERS only.
Examples:
- Verna Nox
- Aurell
- future named human / humanoid allies

SUMMON does NOT give:
- normal monsters
- JOIN targets
- fusion results
- boss monsters
- fusion parents
- random monster copies

### 3.2 Role of a Contract Character
A contract character occupies a separate SUPPORT CONTRACT slot outside the 3-monster party.

Battle structure remains:
- Monster Slot 1
- Monster Slot 2
- Monster Slot 3
- Support Contract 1

The support contract cannot become a fourth normal attacker.
It modifies the battle through limited systems.

Each Contract Character has:
1. CONTRACT PASSIVE — always-on rule modifier
2. CONTRACT COMMAND — limited-use special command
3. LEGACY AFFINITY — changes how one inherited LEGACY behaves or charges
4. FIELD TRAIT — non-combat bonus for HUNT / FUSION / Archive / exploration

### 3.3 Example — Verna Nox
Identity: promise-driven, former royal guard, HEAT ↔ RAGE specialist.

CONTRACT PASSIVE: 「誓約の重さ」
- When two COMMANDs are chosen from monsters below 50% HP, reduce end-of-turn VOLTAGE increase by a small amount.

CONTRACT COMMAND: 「黒誓」
- Once per battle, mark one monster.
- Its next COMMAND gains power and cannot push VOLTAGE above DANGER threshold.

LEGACY AFFINITY:
- LEGACY “不退転” gains a Verna-specific rider when equipped to a marked monster.

FIELD TRAIT:
- Contract-related story options and special Archive commentary.

This keeps Verna valuable without replacing monster combat.

## 4. SUMMON Economy
Design target: fair enough that the game can be enjoyed without gacha optimization.

### 4.1 Currencies
- Contract Shards: free/earned summon currency
- Covenant Gems: premium currency
- Contract Seal: ticket item for single/featured summons

Avoid using the same currency as FUSION or HUNT progression.

### 4.2 Banner Types
1. STANDARD CONTRACT
2. FEATURED CONTRACT
3. STORY CONTRACT — unlocked after chapter milestones

No monster banners.

### 4.3 Rarity
Recommended simple structure:
- R: generic contract operators / support archetypes
- SR: named secondary characters
- SSR: flagship named characters

Avoid more than 3 rarity tiers initially.

### 4.4 Duplicate Handling
No direct duplicate stat inflation.
Duplicates convert to CONTRACT MEMORY.

CONTRACT MEMORY unlocks:
- cosmetic dialogue
- alternate contract command modifier choices
- profile / archive lore
- small utility progression

Do not make duplicate pulls mandatory for core combat viability.

### 4.5 Pity
Recommended launch model:
- hard pity at 80
- soft pity from 65
- featured guarantee within two SSR hits

Exact commercial tuning can be changed later; these are design guardrails, not economy lock.

## 5. First SUMMON Experience
First SUMMON should be scripted/fixed, not random.

Flow:
HOME changes after NEW SPECIES TEST
→ SUMMON facility unlocks
→ player receives 1 tutorial Contract Seal
→ guaranteed story-linked contract character
→ contract tutorial
→ return to PARTY
→ Support Contract slot appears

The first pull exists to teach the system, not monetize the player.

Candidate first guaranteed character:
- a lower-rarity named support directly connected to Mira/Goura
- NOT Verna Nox, so Verna remains aspirational and narratively important

Verna should appear as:
- first major featured banner after her proper story reveal
- trial contract usable in story before banner unlock

## 6. Human Character Integration Rules
1. Human characters never enter monster fusion.
2. Human characters never occupy one of the 3 monster slots.
3. A human character may appear visually in cinematics, story, HOME, and Contract cut-ins.
4. In battle, their presence is conveyed through a portrait/cut-in/voice/effect, not a permanent fourth battlefield body by default.
5. Their skills manipulate monster decision space, VOLTAGE, LEGACY, or NEXT interaction rather than simply dealing huge damage.
6. Monster identity stays primary.

## 7. Chapter 1 Unlock Table
Start:
- STORY
- PARTY (limited)

After tutorial battle:
- HOME full shell

After Boss 1 clear:
- HUNT
- basic ARCHIVE

After JOIN:
- full PARTY roster editing
- FUSION LAB

After FUSION:
- LINEAGE tree
- NEW SPECIES TEST

After NEW SPECIES TEST:
- SUMMON teaser / tutorial unlock
- support contract slot

After LEGACY mastery:
- full LEGACY archive
- LEGACY assignment options
- Chapter 2 teaser

## 8. HOME — Final Chapter 1 Information Architecture
Top:
- current location / chapter state
- NEXT JOURNEY

Middle:
- current 3-monster party
- support contract portrait
- current loadout summary

Progress:
- STORY
- HUNT
- FUSION
- TEST
- BOSS

Records:
- FIELD RECORD
- LINEAGE
- LEGACY RECORD

Persistent navigation:
- HOME
- STORY
- HUNT
- PARTY
- ARCHIVE

Secondary systems:
- FUSION from HOME contextual CTA
- SUMMON from HOME facility/icon after unlock

Do not add SUMMON to permanent bottom nav until usage data justifies it.

## 9. Chapter 2 Loop Template
Each region repeats a recognizable but non-identical structure:
Story reveal
→ new field behavior
→ HUNT/JOIN target
→ party/loadout pressure
→ optional fusion path
→ boss mechanic
→ mastery LEGACY
→ character-contract story beat

Chapter 2 should NOT simply repeat “JOIN one monster then fuse once.”
Variation examples:
- two JOIN candidates with one mutually exclusive early route
- boss that punishes high VOLTAGE but rewards intentional HEAT
- fusion choice with two fixed result branches based on selected lineage recipe

## 10. Vertical Slice Completion Definition
The game is no longer considered a battle demo when a fresh player can complete this path without developer shortcuts:

TITLE
→ HOME
→ STORY
→ BATTLE
→ HUNT
→ JOIN
→ PARTY
→ FUSION
→ NEW SPECIES TEST
→ SUMMON tutorial
→ SUPPORT CONTRACT equip
→ BOSS MASTERY
→ LEGACY ARCHIVE
→ HOME

Pass criteria:
- no dead-end states
- no hidden developer buttons required
- every system explains why it exists before monetization appears
- one fixed HTTPS URL
- browser E2E for core route
- Android manual playtest for touch/audio/layout

## 11. Work vs Chat Division
Chat / Director side:
- progression design
- system specs
- balance tables
- story beats
- summon catalog
- character kits
- boss mechanics
- UI wireframe specs
- test cases
- implementation tickets

Work side:
- GitHub full source/assets sync
- browser interaction
- CI execution
- fixed URL deploy
- real runtime debugging
- screenshot regression
- PR implementation / validation

## 12. Next Design Tasks (No Work Required)
Priority order:
1. Contract Character roster v1 — 8 launch candidates with kits
2. Chapter 1 story scene map and exact unlock timing
3. Full economy map — currencies / rewards / daily-free structure
4. Chapter 2 structure and first 3 new monsters
5. UI screen specification for SUMMON + Contract detail + PARTY integration
6. Automated E2E acceptance criteria per screen

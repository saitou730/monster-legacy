# STANCE Runtime Effects QA v1.8.6

Date: 2026-09-10  
Scope: canonical root HUNT / NEW SPECIES TEST / BOSS

## Audit and result

- BOSS already applied ゴウラ guard, 葉ウサギ heal and 炎翼リザル next-CORE priming; no duplicate implementation added.
- HUNT previously selected STANCE visually but did not apply its effect.
- ゴウラ「炉守」 now reduces the HUNT single hit by 45%.
- 葉ウサギ「芽息」 now heals itself by 6.
- 火トカゲ「火溜め」 now primes its next 火牙 for +12% damage and +2 VOL without stacking.
- NEW SPECIES TEST now writes each applied STANCE effect into its combat log.
- Help text and runtime behavior now agree.

## Evidence

- Browser E2E: **51/51 PASS**
- Viewports: 360x800, 390x844, 430x932
- CI: `34374415303`
- Android physical device: **NOT RUN**
- Art Lock, save schema, Chapter 1 progression and NEXT timing: unchanged

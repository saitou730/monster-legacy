import { createInitialSave } from './game-state.mjs';
import { applyChapter1Event, getNextChapter1Event } from './progression.mjs';

// Additive migration: the root save remains authoritative for existing gameplay.
// Never replace the root save with the Chapter 1 controller's different schema.
export function migrateRootChapter(root) {
  if (root.chapter1) return structuredClone(root.chapter1);
  let chapter = createInitialSave();
  const target = root.fused ? (root.testComplete ? 'P13_SUMMON_UNLOCK' : 'P12_NEW_SPECIES_TEST')
    : root.joinedBat ? 'P08_JOIN_RESULT'
    : root.storyComplete ? 'P05_HOME_FIRST_ARRIVAL'
    : root.introSeen ? 'P02_FIRST_BATTLE' : 'P00_TITLE';
  while (chapter.progress.state !== target) {
    const event = getNextChapter1Event(chapter);
    if (!event) throw new Error('Legacy checkpoint cannot be migrated');
    if (event === 'PARTY_REBUILD_COMPLETE') chapter.party.active = ['goura_001', 'wind_bat_001', 'leaf_rabbit_001'];
    chapter = applyChapter1Event(chapter, event);
  }
  // Backfilling old achievements must not award new currency.
  for (const key of ['fieldMark', 'fusionCatalyst', 'signalShard', 'oathGem', 'legacyCore']) chapter.wallet[key] = 0;
  // Existing JOIN owners retain the ability to perform their first fusion.
  if (root.joinedBat && !root.fused) chapter.wallet.fusionCatalyst = 1;
  chapter.migration = { source: 'root-v1.8.4', historicalRewardsGranted: false };
  return chapter;
}

export function applyRootChapterEvent(root, event, payload = {}) {
  const before = migrateRootChapter(root);
  if (event === 'PARTY_REBUILD_COMPLETE') {
    const instanceForRootId = {
      goura: 'goura_001',
      fire: 'fire_lizard_001',
      leaf: 'leaf_rabbit_001',
      wind: 'wind_bat_001',
      flame: 'flame_wing_lizard_001'
    };
    const active = (root.party || [])
      .map(id => instanceForRootId[id])
      .filter(id => before.roster[id]);
    // The player-facing root formation is authoritative once it actually
    // contains Wind Bat. Controller-only callers may already have projected
    // an explicit active party into root.chapter1; do not overwrite that.
    if (active.length === 3 && active.includes('wind_bat_001')) {
      before.party.active = active;
    }
  }
  const chapter = applyChapter1Event(before, event, payload);
  const next = structuredClone(root);
  next.chapter1 = chapter;
  // Receipt replay must not reapply root rewards or consume parents again.
  if (before.progress.receipts?.includes(event)) return next;
  if (event === 'WIND_BAT_JOIN') next.joinedBat = true;
  if (event === 'FUSION_FLAME_WING_COMPLETE') {
    next.fused = true;
    next.party = ['goura', 'flame', 'leaf'];
    const lineage = chapter.lineage.find(record => record.id === 'lineage_flame_wing_001');
    if (lineage) {
      const history = [...(next.fusion?.lineageHistory || [])];
      if (!history.some(record => record.id === lineage.id)) {
        history.push({
          id: lineage.id,
          parents: ['火トカゲ', '風コウモリ'],
          result: '炎翼リザル',
          heritage: [...lineage.inherited],
          growthEcho: lineage.growthEcho
        });
      }
      next.fusion = {
        ...(next.fusion || {}),
        heritageA: lineage.inherited[0],
        heritageB: lineage.inherited[1],
        growthEcho: lineage.growthEcho,
        lastRecipe: 'special_fire_wind_001',
        lineageHistory: history
      };
    }
  }
  if (event === 'NEW_SPECIES_TEST_COMPLETE') next.testComplete = true;
  if (event === 'SUMMON_TUTORIAL_COMPLETE') next.contracts = { ...(next.contracts || {}), lyra_vell: chapter.contracts.lyra_vell };
  if (event === 'CONTRACT_EQUIP_COMPLETE') next.supportContract = 'lyra_vell';
  if (event === 'LEGACY_CLAIM') next.legacyCores = { ...(next.legacyCores || {}), unyielding: true };
  return next;
}

// Latest persisted state is read for every transaction, not a stale UI snapshot.
// Commit only after the entire controller mutation has succeeded.
export function commitRootChapterEvent(storage, event, payload = {}) {
  const next = applyRootChapterEvent(storage.load(), event, payload);
  if (!storage.save(next)) throw new Error('Chapter 1 save failed; progression was not committed');
  return next;
}

const { test, expect } = require('@playwright/test');

test('root controller completes ordered local progression and rejects duplicate rewards', async ({ page }) => {
  await page.goto('/_site/');
  await page.waitForFunction(() => !!window.MLChapter1);
  const result = await page.evaluate(() => {
    const api = MLChapter1;
    let root = { party: ['goura','fire','leaf'], equipment: { goura: 'taunt_shield' }, legacyCores: {}, customSetting: 'keep' };
    const history = [];
    while (true) {
      const chapter = api.migrateRootChapter(root);
      const event = api.getNextChapter1Event(chapter);
      if (!event) break;
      if (event === 'PARTY_REBUILD_COMPLETE') {
        root.chapter1.party.active = ['goura_001','wind_bat_001','leaf_rabbit_001'];
      }
      root = api.applyRootChapterEvent(root, event);
      history.push(root.chapter1.progress.state);
      // Simulate reload between events and replay the acknowledged action.
      const saved = JSON.stringify(root);
      root = api.applyRootChapterEvent(JSON.parse(saved), event);
      if (JSON.stringify(root) !== saved) throw new Error('Duplicate event mutated save: ' + event);
    }
    return { root, history, errors: api.validateProgressionConsistency(root.chapter1) };
  });
  expect(result.history).toContain('P07_HUNT_WIND_BAT');
  expect(result.root.chapter1.progress.state).toBe('P20_CHAPTER1_COMPLETE_HOME');
  expect(result.root.chapter1.lineage).toHaveLength(1);
  expect(result.root.chapter1.party.active).toHaveLength(3);
  expect(result.root.chapter1.contracts.lyra_vell.acquiredCount).toBe(1);
  expect(result.root.chapter1.party.active).not.toContain('lyra_vell');
  expect(result.root.supportContract).toBe('lyra_vell');
  expect(result.root.legacyCores.unyielding).toBe(true);
  expect(result.root.customSetting).toBe('keep');
  expect(result.errors).toEqual([]);
});

test('legacy root migration preserves source saves and prevents fusion replay', async ({ page }) => {
  await page.goto('/_site/');
  await page.waitForFunction(() => !!window.MLChapter1);
  const result = await page.evaluate(() => {
    const old = { joinedBat: true, fused: true, testComplete: true, party: ['goura','flame','leaf'], fusion: { lineageHistory: [{ id: 'existing-lineage' }] }, legacyCores: { unyielding: true }, equipment: { flame: 'silent_bow' } };
    const original = JSON.stringify(old);
    const chapter = MLChapter1.migrateRootChapter(old);
    const replay = MLChapter1.applyRootChapterEvent(old, 'FUSION_FLAME_WING_COMPLETE');
    let rejected = false;
    try { MLChapter1.applyRootChapterEvent({}, 'LEGACY_CLAIM'); } catch (_) { rejected = true; }
    return { unchanged: JSON.stringify(old) === original, chapter, replay, rejected };
  });
  expect(result.unchanged).toBe(true);
  expect(result.chapter.progress.state).toBe('P13_SUMMON_UNLOCK');
  expect(result.chapter.wallet.fieldMark).toBe(0);
  expect(result.replay.fusion.lineageHistory).toEqual([{ id: 'existing-lineage' }]);
  expect(result.replay.equipment.flame).toBe('silent_bow');
  expect(result.replay.legacyCores.unyielding).toBe(true);
  expect(result.rejected).toBe(true);
});

test('boar closeout separates mastery, LEGACY claim, archive acknowledgement, and replay rewards', async ({ page }) => {
  await page.goto('/_site/');
  await page.waitForFunction(() => !!window.MLChapter1);
  const result = await page.evaluate(() => {
    const api = MLChapter1;
    let root = {
      storyComplete: true, joinedBat: true, fused: true, testComplete: true,
      party: ['goura','flame','leaf'], legacyCores: {}, mastery: {}, clears: {},
      contracts: { lyra_vell: { acquired: true, acquiredCount: 1, equipped: true } },
      supportContract: 'lyra_vell'
    };
    for (const event of ['SUMMON_UNLOCK_ACK','SUMMON_TUTORIAL_COMPLETE','CONTRACT_EQUIP_COMPLETE']) {
      root = api.applyRootChapterEvent(root, event);
    }
    const atBrief = root.chapter1.progress.state;
    root = api.applyRootChapterEvent(root, 'BOAR_REMATCH_ACCEPT');
    const atBattle = root.chapter1.progress.state;
    root = api.applyRootChapterEvent(root, 'BOAR_MASTERY_COMPLETE');
    const afterMastery = JSON.parse(JSON.stringify(root));
    root = api.applyRootChapterEvent(root, 'LEGACY_CLAIM');
    const afterClaim = JSON.parse(JSON.stringify(root));
    root = api.applyRootChapterEvent(root, 'ARCHIVE_COMPLETE');
    const completed = JSON.stringify(root);
    const replayed = api.applyRootChapterEvent(JSON.parse(completed), 'ARCHIVE_COMPLETE');
    return { atBrief, atBattle, afterMastery, afterClaim, replayed, unchanged: JSON.stringify(replayed) === completed };
  });
  expect(result.atBrief).toBe('P16_BOAR_REMATCH_BRIEF');
  expect(result.atBattle).toBe('P17_BOAR_MASTERY');
  expect(result.afterMastery.mastery.boar).toBe(true);
  expect(result.afterMastery.clears.boar).toBe(true);
  expect(result.afterMastery.legacyCores.unyielding).not.toBe(true);
  expect(result.afterMastery.chapter1.progress.state).toBe('P18_LEGACY_REWARD');
  expect(result.afterClaim.legacyCores.unyielding).toBe(true);
  expect(result.afterClaim.chapter1.progress.state).toBe('P19_ARCHIVE_UNLOCK');
  expect(result.replayed.chapter1.progress.state).toBe('P20_CHAPTER1_COMPLETE_HOME');
  expect(result.replayed.chapter1.contracts.lyra_vell.acquiredCount).toBe(1);
  expect(result.replayed.chapter1.party.active).not.toContain('lyra_vell');
  expect(result.unchanged).toBe(true);
});

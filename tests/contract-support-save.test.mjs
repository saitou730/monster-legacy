import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRootChapterEvent, commitRootChapterEvent } from '../src/chapter1/root-adapter.mjs';

function summoned() {
  let root = { fused: true, testComplete: true, party: ['goura', 'flame', 'leaf'], contracts: { existing: { owned: true } } };
  root = applyRootChapterEvent(root, 'SUMMON_UNLOCK_ACK');
  return applyRootChapterEvent(root, 'SUMMON_TUTORIAL_COMPLETE');
}

test('Support equip projects ownership without changing monster party and is replay safe', () => {
  const root = summoned();
  root.contracts.lyra_vell.customNote = 'keep';
  const snapshot = JSON.stringify(root);
  const equipped = applyRootChapterEvent(root, 'CONTRACT_EQUIP_COMPLETE');
  assert.equal(JSON.stringify(root), snapshot);
  assert.equal(equipped.contracts.lyra_vell.supportEquipped, true);
  assert.equal(equipped.supportContract, 'lyra_vell');
  assert.equal(equipped.contracts.lyra_vell.customNote, 'keep');
  assert.deepEqual(equipped.contracts.existing, { owned: true });
  assert.deepEqual(equipped.party, root.party);
  assert.equal(equipped.contracts.lyra_vell.acquiredCount, 1);
  const reloaded = JSON.parse(JSON.stringify(equipped));
  assert.deepEqual(applyRootChapterEvent(reloaded, 'CONTRACT_EQUIP_COMPLETE'), reloaded);
});

test('failed Support persistence does not mutate the loaded save', () => {
  const root = summoned();
  const snapshot = JSON.stringify(root);
  assert.throws(() => commitRootChapterEvent({ load: () => root, save: () => false }, 'CONTRACT_EQUIP_COMPLETE'), /save failed/);
  assert.equal(JSON.stringify(root), snapshot);
  assert.equal(root.contracts.lyra_vell.supportEquipped, false);
});

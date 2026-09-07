import { assertValidSave, migrateSave } from './game-state.js';

export const CH1_EVENTS = Object.freeze({
  START: 'START',
  PROLOGUE_COMPLETE: 'PROLOGUE_COMPLETE',
  FIRST_BATTLE_COMPLETE: 'FIRST_BATTLE_COMPLETE',
  BOAR_RETREAT: 'BOAR_RETREAT',
  HOME_FIRST_ARRIVAL: 'HOME_FIRST_ARRIVAL',
  HUNT_BRIEF_ACCEPT: 'HUNT_BRIEF_ACCEPT',
  WIND_BAT_JOIN: 'WIND_BAT_JOIN',
  JOIN_RESULT_ACK: 'JOIN_RESULT_ACK',
  PARTY_REBUILD_COMPLETE: 'PARTY_REBUILD_COMPLETE',
  FUSION_INTRO_ACK: 'FUSION_INTRO_ACK',
  FUSION_FLAME_WING_COMPLETE: 'FUSION_FLAME_WING_COMPLETE',
  NEW_SPECIES_TEST_COMPLETE: 'NEW_SPECIES_TEST_COMPLETE',
  SUMMON_UNLOCK_ACK: 'SUMMON_UNLOCK_ACK',
  SUMMON_TUTORIAL_COMPLETE: 'SUMMON_TUTORIAL_COMPLETE',
  CONTRACT_EQUIP_COMPLETE: 'CONTRACT_EQUIP_COMPLETE',
  BOAR_REMATCH_ACCEPT: 'BOAR_REMATCH_ACCEPT',
  BOAR_MASTERY_COMPLETE: 'BOAR_MASTERY_COMPLETE',
  LEGACY_CLAIM: 'LEGACY_CLAIM',
  ARCHIVE_COMPLETE: 'ARCHIVE_COMPLETE'
});

const FLOW = Object.freeze({
  START: ['P00_TITLE', 'P01_PROLOGUE'],
  PROLOGUE_COMPLETE: ['P01_PROLOGUE', 'P02_FIRST_BATTLE'],
  FIRST_BATTLE_COMPLETE: ['P02_FIRST_BATTLE', 'P03_BOAR_FIRST_ENCOUNTER'],
  BOAR_RETREAT: ['P03_BOAR_FIRST_ENCOUNTER', 'P04_RETREAT_RESULT'],
  HOME_FIRST_ARRIVAL: ['P04_RETREAT_RESULT', 'P05_HOME_FIRST_ARRIVAL'],
  HUNT_BRIEF_ACCEPT: ['P05_HOME_FIRST_ARRIVAL', 'P06_HUNT_BRIEF'],
  WIND_BAT_JOIN: ['P06_HUNT_BRIEF', 'P08_JOIN_RESULT'],
  JOIN_RESULT_ACK: ['P08_JOIN_RESULT', 'P09_PARTY_REBUILD'],
  PARTY_REBUILD_COMPLETE: ['P09_PARTY_REBUILD', 'P10_FUSION_INTRO'],
  FUSION_INTRO_ACK: ['P10_FUSION_INTRO', 'P11_FUSION_FLAME_WING'],
  FUSION_FLAME_WING_COMPLETE: ['P11_FUSION_FLAME_WING', 'P12_NEW_SPECIES_TEST'],
  NEW_SPECIES_TEST_COMPLETE: ['P12_NEW_SPECIES_TEST', 'P13_SUMMON_UNLOCK'],
  SUMMON_UNLOCK_ACK: ['P13_SUMMON_UNLOCK', 'P14_SUMMON_TUTORIAL'],
  SUMMON_TUTORIAL_COMPLETE: ['P14_SUMMON_TUTORIAL', 'P15_CONTRACT_EQUIP'],
  CONTRACT_EQUIP_COMPLETE: ['P15_CONTRACT_EQUIP', 'P16_BOAR_REMATCH_BRIEF'],
  BOAR_REMATCH_ACCEPT: ['P16_BOAR_REMATCH_BRIEF', 'P17_BOAR_MASTERY'],
  BOAR_MASTERY_COMPLETE: ['P17_BOAR_MASTERY', 'P18_LEGACY_REWARD'],
  LEGACY_CLAIM: ['P18_LEGACY_REWARD', 'P19_ARCHIVE_UNLOCK'],
  ARCHIVE_COMPLETE: ['P19_ARCHIVE_UNLOCK', 'P20_CHAPTER1_COMPLETE_HOME']
});

export class ProgressionError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = 'ProgressionError';
    this.code = code;
  }
}

function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function ensureRuntimeFields(save) {
  save.progress ||= { chapter: 1, state: 'P00_TITLE', flags: {} };
  save.progress.flags ||= {};
  save.progress.receipts ||= [];
  save.archive ||= { field: [], lineage: [], legacy: [], contract: [] };
  save.archive.field ||= [];
  save.archive.lineage ||= [];
  save.archive.legacy ||= [];
  save.archive.contract ||= [];
  save.wallet ||= {};
  save.wallet.fieldMark ??= 0;
  save.wallet.fusionCatalyst ??= 0;
  save.wallet.signalShard ??= 0;
  save.wallet.oathGem ??= 0;
  save.wallet.legacyCore ??= 0;
  save.wallet.contractMemory ||= {};
  save.roster ||= {};
  save.party ||= { active: [] };
  save.lineage ||= [];
  save.contracts ||= {};
  save.legacy ||= {};
  return save;
}

function addReceipt(save, event) {
  if (!save.progress.receipts.includes(event)) save.progress.receipts.push(event);
}

function hasReceipt(save, event) {
  return save.progress.receipts?.includes(event) === true;
}

function addArchiveUnique(list, record, key = 'id') {
  if (!list.some(item => item?.[key] === record[key])) list.push(record);
}

function grant(save, reward = {}) {
  for (const [key, amount] of Object.entries(reward)) {
    if (typeof amount !== 'number') continue;
    save.wallet[key] = (save.wallet[key] || 0) + amount;
  }
}

function findMonsterInstance(save, speciesId) {
  return Object.entries(save.roster).find(([, monster]) => monster.speciesId === speciesId)?.[0] || null;
}

function requireMonster(save, speciesId) {
  const id = findMonsterInstance(save, speciesId);
  if (!id) throw new ProgressionError('REQUIRED_MONSTER_MISSING', speciesId);
  return id;
}

function removeFromParty(save, instanceId) {
  save.party.active = save.party.active.filter(id => id !== instanceId);
}

function createMonster(speciesId, heritage = []) {
  return {
    speciesId,
    level: 1,
    exp: 0,
    jobMastery: { rank: 1, xp: 0 },
    heritage,
    equipment: { arms: null, guard: null, relic: null },
    legacyEquipped: [],
    favorite: false,
    lineageRecordId: null
  };
}

function applyWindBatJoin(save) {
  if (findMonsterInstance(save, 'wind_bat')) return;
  save.roster.wind_bat_001 = createMonster('wind_bat');
  save.progress.flags.joinWindBatComplete = true;
  grant(save, { fieldMark: 150, fusionCatalyst: 1 });
  addArchiveUnique(save.archive.field, {
    id: 'field_wind_bat_join',
    speciesId: 'wind_bat',
    result: 'JOIN',
    resonance: 'COMPLETE'
  });
}

function applyFusion(save, payload) {
  const fireId = requireMonster(save, 'fire_lizard');
  const windId = requireMonster(save, 'wind_bat');
  const fire = save.roster[fireId];
  const wind = save.roster[windId];
  if (fire.favorite || wind.favorite) throw new ProgressionError('FUSION_PARENT_PROTECTED');
  if ((save.wallet.fusionCatalyst || 0) < 1) throw new ProgressionError('FUSION_CATALYST_MISSING');

  const heritageA = payload?.heritageA || '火炎適応';
  const heritageB = payload?.heritageB || '風読み';
  const validA = ['火炎適応', '牙撃強化'];
  const validB = ['風読み', '回避反応'];
  if (!validA.includes(heritageA) || !validB.includes(heritageB)) {
    throw new ProgressionError('FUSION_HERITAGE_INVALID');
  }

  const lineageRecordId = 'lineage_flame_wing_001';
  const childId = 'flame_wing_lizard_001';
  const returnedEquipment = [fire.equipment, wind.equipment].filter(Boolean);

  removeFromParty(save, fireId);
  removeFromParty(save, windId);
  delete save.roster[fireId];
  delete save.roster[windId];
  save.wallet.fusionCatalyst -= 1;

  const child = createMonster('flame_wing_lizard', [heritageA, heritageB]);
  child.lineageRecordId = lineageRecordId;
  save.roster[childId] = child;
  if (!save.party.active.includes(childId)) save.party.active.push(childId);

  const lineage = {
    id: lineageRecordId,
    parents: ['fire_lizard', 'wind_bat'],
    result: 'flame_wing_lizard',
    inherited: [heritageA, heritageB],
    returnedEquipment,
    growthEcho: 0.6
  };
  save.lineage.push(lineage);
  addArchiveUnique(save.archive.lineage, lineage);
  save.progress.flags.fusionFlameWingComplete = true;
}

function applyTutorialSummon(save) {
  if (save.contracts.lyra_vell) return;
  save.contracts.lyra_vell = {
    contractId: 'lyra_vell',
    rarity: 'SR',
    acquiredCount: 1,
    supportEquipped: false,
    tutorialGuaranteed: true
  };
  save.progress.flags.summonSystemUnlocked = true;
  save.progress.flags.summonTutorialComplete = true;
  addArchiveUnique(save.archive.contract, {
    id: 'contract_lyra_vell',
    contractId: 'lyra_vell',
    source: 'TUTORIAL_GUARANTEED'
  });
}

function applyBoarMastery(save) {
  save.progress.flags.boarMasteryComplete = true;
  grant(save, { fieldMark: 300, legacyCore: 1 });
  addArchiveUnique(save.archive.field, {
    id: 'field_thorn_boar_mastery',
    speciesId: 'thorn_boar',
    result: 'BOSS_MASTERY'
  });
}

function applyLegacy(save) {
  save.legacy.unyielding ||= {
    legacyId: 'unyielding',
    displayName: '不退転',
    sourceBoss: 'thorn_boar',
    rank: 1
  };
  save.progress.flags.unyieldingOwned = true;
  grant(save, { signalShard: 300 });
  addArchiveUnique(save.archive.legacy, {
    id: 'legacy_unyielding',
    legacyId: 'unyielding',
    sourceBoss: 'thorn_boar'
  });
}

function applyEventMutation(save, event, payload) {
  const f = save.progress.flags;
  switch (event) {
    case CH1_EVENTS.FIRST_BATTLE_COMPLETE:
      grant(save, { fieldMark: 100 });
      break;
    case CH1_EVENTS.BOAR_RETREAT:
      f.retreatComplete = true;
      break;
    case CH1_EVENTS.HOME_FIRST_ARRIVAL:
      f.homeFirstArrivalSeen = true;
      break;
    case CH1_EVENTS.WIND_BAT_JOIN:
      applyWindBatJoin(save);
      break;
    case CH1_EVENTS.PARTY_REBUILD_COMPLETE:
      if (save.party.active.length !== 3) throw new ProgressionError('PARTY_ACTIVE_NOT_THREE');
      f.partyRebuildComplete = true;
      break;
    case CH1_EVENTS.FUSION_FLAME_WING_COMPLETE:
      applyFusion(save, payload);
      break;
    case CH1_EVENTS.NEW_SPECIES_TEST_COMPLETE:
      f.flameWingTestComplete = true;
      break;
    case CH1_EVENTS.SUMMON_UNLOCK_ACK:
      f.summonSystemUnlocked = true;
      break;
    case CH1_EVENTS.SUMMON_TUTORIAL_COMPLETE:
      applyTutorialSummon(save);
      break;
    case CH1_EVENTS.CONTRACT_EQUIP_COMPLETE:
      if (!save.contracts.lyra_vell) throw new ProgressionError('LYRA_NOT_OWNED');
      save.contracts.lyra_vell.supportEquipped = true;
      save.contracts.supportEquippedId = 'lyra_vell';
      break;
    case CH1_EVENTS.BOAR_MASTERY_COMPLETE:
      applyBoarMastery(save);
      break;
    case CH1_EVENTS.LEGACY_CLAIM:
      applyLegacy(save);
      break;
    case CH1_EVENTS.ARCHIVE_COMPLETE:
      f.archiveUnlocked = true;
      f.chapter1Complete = true;
      grant(save, { signalShard: 700 });
      break;
    default:
      break;
  }
}

export function canApplyEvent(rawSave, event) {
  const save = ensureRuntimeFields(clone(migrateSave(rawSave)));
  if (!FLOW[event]) return false;
  if (hasReceipt(save, event)) return true;
  return save.progress.state === FLOW[event][0];
}

export function applyChapter1Event(rawSave, event, payload = {}) {
  const save = ensureRuntimeFields(clone(migrateSave(rawSave)));
  const transition = FLOW[event];
  if (!transition) throw new ProgressionError('EVENT_UNKNOWN', event);

  if (hasReceipt(save, event)) return save;
  const [from, to] = transition;
  if (save.progress.state !== from) {
    throw new ProgressionError('EVENT_OUT_OF_ORDER', `${event}: ${save.progress.state} !== ${from}`);
  }

  applyEventMutation(save, event, payload);
  save.progress.state = to;
  addReceipt(save, event);
  return assertValidSave(save);
}

export function getNextChapter1Event(rawSave) {
  const save = ensureRuntimeFields(clone(migrateSave(rawSave)));
  return Object.entries(FLOW).find(([, [from]]) => from === save.progress.state)?.[0] || null;
}

export function replaySafe(rawSave, events = []) {
  return events.reduce((save, entry) => {
    const event = typeof entry === 'string' ? entry : entry.event;
    const payload = typeof entry === 'string' ? {} : (entry.payload || {});
    return applyChapter1Event(save, event, payload);
  }, rawSave);
}

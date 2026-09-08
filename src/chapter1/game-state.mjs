export const SAVE_VERSION = 1;

export const PROGRESSION_STATES = [
  'P00_TITLE','P01_PROLOGUE','P02_FIRST_BATTLE','P03_BOAR_FIRST_ENCOUNTER',
  'P04_RETREAT_RESULT','P05_HOME_FIRST_ARRIVAL','P06_HUNT_BRIEF','P07_HUNT_WIND_BAT',
  'P08_JOIN_RESULT','P09_PARTY_REBUILD','P10_FUSION_INTRO','P11_FUSION_FLAME_WING',
  'P12_NEW_SPECIES_TEST','P13_SUMMON_UNLOCK','P14_SUMMON_TUTORIAL','P15_CONTRACT_EQUIP',
  'P16_BOAR_REMATCH_BRIEF','P17_BOAR_MASTERY','P18_LEGACY_REWARD','P19_ARCHIVE_UNLOCK',
  'P20_CHAPTER1_COMPLETE_HOME'
];

export function createInitialSave() {
  return {
    saveVersion: SAVE_VERSION,
    progress: {
      chapter: 1,
      state: 'P00_TITLE',
      flags: {}
    },
    wallet: {
      fieldMark: 0,
      fusionCatalyst: 0,
      signalShard: 0,
      oathGem: 0,
      legacyCore: 0,
      contractMemory: {}
    },
    roster: {
      goura_001: createMonster('goura', true),
      fire_lizard_001: createMonster('fire_lizard'),
      leaf_rabbit_001: createMonster('leaf_rabbit')
    },
    party: {
      active: ['goura_001','fire_lizard_001','leaf_rabbit_001']
    },
    lineage: [],
    contracts: {},
    legacy: {},
    archive: {
      field: [],
      lineage: [],
      legacy: [],
      contract: []
    },
    settings: {
      reducedMotion: false,
      language: 'ja'
    }
  };
}

function createMonster(speciesId, favorite = false) {
  return {
    speciesId,
    level: 1,
    exp: 0,
    jobMastery: { rank: 1, xp: 0 },
    heritage: [],
    equipment: { arms: null, guard: null, relic: null },
    legacyEquipped: [],
    favorite,
    lineageRecordId: null
  };
}

export function isValidProgressState(state) {
  return PROGRESSION_STATES.includes(state);
}

export function validateSave(save) {
  const errors = [];
  if (!save || typeof save !== 'object') return ['SAVE_NOT_OBJECT'];
  if (save.saveVersion !== SAVE_VERSION) errors.push('SAVE_VERSION_UNSUPPORTED');
  if (!isValidProgressState(save?.progress?.state)) errors.push('PROGRESS_STATE_INVALID');

  const active = save?.party?.active;
  if (!Array.isArray(active)) {
    errors.push('PARTY_ACTIVE_INVALID');
  } else if (save?.progress?.state !== 'P00_TITLE' && active.length !== 3) {
    errors.push('PARTY_ACTIVE_NOT_THREE');
  }

  if (Array.isArray(active)) {
    for (const id of active) {
      if (!save?.roster?.[id]) errors.push(`PARTY_MEMBER_MISSING:${id}`);
    }
  }

  const flags = save?.progress?.flags || {};
  const rosterSpecies = Object.values(save?.roster || {}).map(m => m.speciesId);

  if (rosterSpecies.includes('wind_bat') && !flags.joinWindBatComplete) {
    errors.push('WIND_BAT_OWNED_BEFORE_JOIN');
  }

  if (rosterSpecies.includes('flame_wing_lizard') && !flags.fusionFlameWingComplete) {
    errors.push('FLAME_WING_OWNED_BEFORE_FUSION');
  }

  if (flags.summonSystemUnlocked && !flags.flameWingTestComplete) {
    errors.push('SUMMON_UNLOCKED_BEFORE_TEST');
  }

  if (flags.unyieldingOwned && !flags.boarMasteryComplete) {
    errors.push('LEGACY_OWNED_BEFORE_BOSS_MASTERY');
  }

  if (save?.contracts?.supportEquippedId && active?.includes(save.contracts.supportEquippedId)) {
    errors.push('CONTRACT_INSIDE_MONSTER_PARTY');
  }

  return errors;
}

export function assertValidSave(save) {
  const errors = validateSave(save);
  if (errors.length) throw new Error(`Invalid save: ${errors.join(', ')}`);
  return save;
}

export function migrateSave(raw) {
  if (!raw) return createInitialSave();
  if (raw.saveVersion === SAVE_VERSION) return assertValidSave(raw);
  throw new Error(`Unsupported saveVersion: ${raw.saveVersion}`);
}

export function deriveHomeObjective(save) {
  const f = save.progress.flags || {};
  if (!f.retreatComplete) return '境界で起きていることを確かめる';
  if (!f.joinWindBatComplete) return '風裂谷で風コウモリを追う';
  if (!f.partyRebuildComplete) return '新しい仲間を含め編成を見直す';
  if (!f.fusionFlameWingComplete) return 'FUSION LABで反応を調べる';
  if (!f.flameWingTestComplete) return '炎翼リザルの戦い方を確かめる';
  if (!f.summonTutorialComplete) return 'CONTRACT SIGNALを調べる';
  if (!save?.contracts?.supportEquippedId) return '契約者をSUPPORT CONTRACTへ設定する';
  if (!f.boarMasteryComplete) return '荊棘の大猪へ再挑戦する';
  if (!f.unyieldingOwned) return 'BossのLEGACYを受け継ぐ';
  if (!f.chapter1Complete) return '旅の記録を確認する';
  return '次の地域を確認する';
}

export function canUnlock(feature, save) {
  const f = save.progress.flags || {};
  switch (feature) {
    case 'party': return !!f.retreatComplete;
    case 'huntWindBat': return !!f.homeFirstArrivalSeen && !!f.retreatComplete;
    case 'fusion': return !!f.joinWindBatComplete && !!f.partyRebuildComplete;
    case 'newSpeciesTest': return !!f.fusionFlameWingComplete;
    case 'summon': return !!f.flameWingTestComplete;
    case 'supportContract': return !!f.summonTutorialComplete;
    case 'boarRematch': return !!save?.contracts?.supportEquippedId;
    case 'legacy': return !!f.boarMasteryComplete;
    case 'archive': return !!f.unyieldingOwned;
    default: return false;
  }
}


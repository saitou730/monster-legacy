window.MLAsset = window.MLAsset || (p => p);
window.ML_DATA = {
  version: "1.8.0",
  saveKey: "monsterLegacyWeb02",
  bands: [
    {name:"CALM", min:0, max:29, desc:"静かな弦と残響"},
    {name:"HEAT", min:30, max:59, desc:"低音と対旋律"},
    {name:"RAGE", min:60, max:89, desc:"戦鼓と圧"},
    {name:"DANGER", min:90, max:99, desc:"聖歌的で厳かな危機感"},
    {name:"LEGACY", min:100, max:100, desc:"静寂から儀式和音"}
  ],
  units: {
    goura:{
      id:"goura", name:"ゴウラ", maxHp:168, battle:"assets/battle/goura",
      core:"炉拳", coreDmg:26, coreVol:5,
      role:"炉守", roleType:"guard", stance:"炉守"
    },
    fire:{
      id:"fire", name:"火トカゲ", maxHp:112, battle:"assets/battle/fire",
      core:"火牙", coreDmg:31, coreVol:8,
      role:"風切羽", roleType:"evade", stance:"火溜め"
    },
    leaf:{
      id:"leaf", name:"葉ウサギ", maxHp:104, battle:"assets/battle/leaf",
      core:"葉打ち", coreDmg:18, coreVol:3,
      role:"鎮めの風", roleType:"calm", stance:"芽息"
    },
    wind:{
      id:"wind", name:"風コウモリ", maxHp:96, battle:"assets/battle/wind_bat",
      core:"風牙", coreDmg:24, coreVol:4,
      role:"風切", roleType:"evade", stance:"滑空姿勢"
    },
    flame:{
      id:"flame", name:"炎翼リザル", maxHp:168, battle:"assets/battle/flame",
      core:"炎翼牙", coreDmg:52, coreVol:7,
      role:"逆風滑空", roleType:"evadePlus", stance:"滑空炎"
    }
  },


  legacyCores: {
    unyielding:{
      id:"unyielding", name:"不退転", sourceBoss:"boar", source:"荊棘の大猪", theme:"瀕死でも退かず、受け切った経験を自分の戦い方へ変える。",
      effects:{
        goura:"HP50%以下でGUARD軽減を強化",
        fire:"HP50%以下でCOREダメージ+18%",
        leaf:"味方にHP50%以下がいる時、STANCE回復+6",
        flame:"HP50%以下でCOREダメージ+10%"
      }
    },
    quiet_thunder:{
      id:"quiet_thunder", name:"静雷", sourceBoss:"owl", source:"雷フクロウ", theme:"熱を上げ過ぎず、静かに主導権を握る。",
      effects:{
        goura:"COREのVOLTAGE上昇-2",
        fire:"COREのVOLTAGE上昇-3",
        leaf:"ROLE/EQUIPMENTのVOLTAGE低下+4",
        flame:"回避成功時のVOLTAGE低下を-9へ強化"
      }
    },
    falling_wind:{
      id:"falling_wind", name:"墜風", sourceBoss:"manticore", source:"裂空マンティコア", theme:"敵の崩れを逃さず、CRASHの瞬間を最大化する。",
      effects:{
        goura:"CRASH中のCOREダメージ倍率+15%",
        fire:"CRASH中のCOREダメージ倍率+15%",
        leaf:"CRASH中のCOREダメージ倍率+20%",
        flame:"CRASH中のCOREダメージ倍率+20%"
      }
    }
  },

  equipment: {
    pursuit_spear:{
      id:"pursuit_spear", name:"追撃の槍", category:"ARMS",
      desc:"重い一撃。RAGE/DANGERではさらに伸びる。",
      action:"追撃", type:"damage", dmg:40, vol:8, cooldown:2
    },
    silent_bow:{
      id:"silent_bow", name:"静音弓", category:"ARMS",
      desc:"VOLTAGEをほとんど上げずに削る。",
      action:"静射", type:"damage", dmg:34, vol:2, cooldown:2
    },
    fang_dagger:{
      id:"fang_dagger", name:"裂牙短剣", category:"ARMS",
      desc:"小刻みに削る。低コストの攻め。",
      action:"裂牙", type:"damage", dmg:30, vol:5, cooldown:1
    },
    ashfire_bracelet:{
      id:"ashfire_bracelet", name:"灰火の腕輪", category:"RELIC",
      desc:"火力と引き換えにVOLTAGEを大きく上げる。",
      action:"灰火", type:"damage", dmg:38, vol:12, cooldown:2
    },
    taunt_shield:{
      id:"taunt_shield", name:"挑発の盾", category:"GUARD",
      desc:"次の敵行動を受ける準備。全体軽減も強化。",
      action:"挑発防御", type:"guard", cooldown:2
    },
    echo_armor:{
      id:"echo_armor", name:"反響甲", category:"GUARD",
      desc:"被害を抑え、受けた力を返す。",
      action:"反響防御", type:"reflect", cooldown:2
    },
    wind_feather:{
      id:"wind_feather", name:"風切羽", category:"RELIC",
      desc:"次の単体NEXTを回避。成功で敵VOL-6。",
      action:"風切", type:"evade", cooldown:2
    },
    calm_bell:{
      id:"calm_bell", name:"鎮静の鈴", category:"RELIC",
      desc:"敵VOLTAGE-14 + 使用者を少量回復。",
      action:"鎮静", type:"calm", volDown:14, heal:8, cooldown:2
    }
  },
  story: {
    chapter1:{
      id:"chapter1", title:"第一章 残響の獣",
      lessons:[
        {id:"next", title:"01 NEXTを読む"},
        {id:"commands", title:"02 2 COMMAND"},
        {id:"stance", title:"03 STANCE"},
        {id:"voltage", title:"04 VOLTAGE"},
        {id:"equipment", title:"05 EQUIPMENT"},
        {id:"boss", title:"06 荊棘の大猪"}
      ]
    }
  },
  bosses: {
    boar: {
      id:"boar",
      name:"荊棘の大猪",
      title:"RAISE / RECEIVE",
      maxHp:590,
      atk:48,
      def:24,
      initialVol:10,
      art:"assets/battle/boar/idle.png", battle:"assets/battle/boar",
      artStatus:"LOCKED",
      mastery:"VOLTAGE 100到達 → LEGACY ARTを耐える → 撃破",
      reward:"LEGACY CORE「不退転」",
      guide:"あえて危険域へ押し上げ、予告された大技を受け切る。"
    },
    owl: {
      id:"owl",
      name:"雷フクロウ",
      title:"SUPPRESS",
      maxHp:510,
      atk:44,
      def:18,
      initialVol:8,
      art:"assets/battle/owl/idle.png", battle:"assets/battle/owl", icon:"assets/battle/owl/icon_portrait.png",
      backdrop:"assets/art/owl_battle_backdrop.jpg",
      artStatus:"LOCKED / OFFICIAL-SHEET-DERIVED BATTLE ASSET",
      reference:"assets/reference/雷フクロウ_CHARACTER_DESIGN_BIBLE_ML-001_v1.1.png",
      mastery:"一度もRAGEへ入れずに撃破",
      reward:"LEGACY CORE「静雷」",
      guide:"HEATを維持し、火力と危険の境界を管理する。"
    },
    manticore: {
      id:"manticore",
      name:"裂空マンティコア",
      title:"READ / DODGE / CRASH",
      maxHp:555,
      atk:50,
      def:20,
      initialVol:20,
      art:"assets/battle/manticore/idle.png", battle:"assets/battle/manticore", icon:"assets/battle/manticore/icon_portrait.png",
      backdrop:"assets/art/manticore_battle_backdrop.jpg",
      artStatus:"LOCKED / OFFICIAL-SHEET-DERIVED BATTLE ASSET",
      reference:"assets/reference/裂空マンティコア_CHARACTER_DESIGN_SHEET_ML-002_v1.2.png",
      mastery:"CRASHを2回発生させて撃破",
      reward:"LEGACY CORE「墜風」",
      guide:"HEAT以降の飛翔突貫を読み、回避でCRASHを作る。"
    }
  }
};
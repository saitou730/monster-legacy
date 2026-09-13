const {test}=require('node:test');
const assert=require('node:assert/strict');
global.window={};require('../src/area-progress.js');const A=window.MLArea;
const fresh=()=>({chapter1:{progress:{state:'P20_CHAPTER1_COMPLETE_HOME'}},party:['goura','flame','leaf'],legacyCores:{unyielding:true}});
const advanceToDiscovery=(s)=>{assert.equal(A.commit(s,'entered',()=>true),true);assert.equal(A.commit(s,'discovered',()=>true),true);};

test('ordered exact-once JOIN and return preserve existing party and legacy',()=>{
 const s=fresh();assert.equal(A.commit(s,'joined',()=>true),false);
 advanceToDiscovery(s);
 s.area1.hunt={lesson:'read',approach:'observe',attempt:{readProven:true,rageEntered:false,suppressProven:false}};
 for(const k of ['resolved','joined','returned'])assert.equal(A.commit(s,k,()=>true),true);
 A.commit(s,'joined',()=>true);assert.deepEqual(s.monsterRoster,['SP-044']);assert.deepEqual(s.party,['goura','flame','leaf']);assert.equal(s.legacyCores.unyielding,true);
});

test('failed persistence is atomic; later ownership reconciles forward',()=>{
 const s=fresh(),before=JSON.stringify(s);assert.equal(A.commit(s,'entered',()=>false),false);assert.equal(JSON.stringify(s),before);
 s.monsterRoster=['SP-044'];assert.equal(A.read(s).resolved,true);assert.equal(A.read(s).returned,false);
 assert.equal(A.commit(s,'returned',()=>true),true);assert.deepEqual(s.monsterRoster,['SP-044']);
});

test('READ route requires protected single-target read and no RAGE before resolution',()=>{
 const s=fresh();advanceToDiscovery(s);
 s.area1.hunt={lesson:'read',approach:'observe',attempt:{readProven:false,rageEntered:false,suppressProven:false}};
 assert.equal(A.qualified(s),false);assert.equal(A.commit(s,'resolved',()=>true),false);
 s.area1.hunt.attempt.readProven=true;assert.equal(A.qualified(s),true);assert.equal(A.commit(s,'resolved',()=>true),true);
});

test('SUPPRESS route requires HEAT to CALM evidence and rejects any RAGE entry',()=>{
 const s=fresh();advanceToDiscovery(s);
 s.area1.hunt={lesson:'suppress',approach:'pressure',attempt:{readProven:false,rageEntered:false,suppressProven:true}};
 assert.equal(A.qualified(s),true);
 s.area1.hunt.attempt.rageEntered=true;assert.equal(A.qualified(s),false);assert.match(A.failureReason(s),/RAGE/);
});

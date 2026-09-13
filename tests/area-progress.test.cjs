const {test}=require('node:test');
const assert=require('node:assert/strict');
global.window={};require('../src/area-progress.js');const A=window.MLArea;
const fresh=()=>({chapter1:{progress:{state:'P20_CHAPTER1_COMPLETE_HOME'}},party:['goura','flame','leaf'],legacyCores:{unyielding:true}});
test('ordered exact-once JOIN and return preserve existing party and legacy',()=>{
 const s=fresh();assert.equal(A.commit(s,'joined',()=>true),false);
 for(const k of ['entered','discovered','resolved','joined','returned'])assert.equal(A.commit(s,k,()=>true),true);
 A.commit(s,'joined',()=>true);assert.deepEqual(s.monsterRoster,['SP-044']);assert.deepEqual(s.party,['goura','flame','leaf']);assert.equal(s.legacyCores.unyielding,true);
});
test('failed persistence is atomic; later ownership reconciles forward',()=>{
 const s=fresh(),before=JSON.stringify(s);assert.equal(A.commit(s,'entered',()=>false),false);assert.equal(JSON.stringify(s),before);
 s.monsterRoster=['SP-044'];assert.equal(A.read(s).resolved,true);assert.equal(A.read(s).returned,false);
 assert.equal(A.commit(s,'returned',()=>true),true);assert.deepEqual(s.monsterRoster,['SP-044']);
});

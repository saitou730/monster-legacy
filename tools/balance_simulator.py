#!/usr/bin/env python3
BOSSES={
 "boar":{"hp":590,"vol":10},
 "owl":{"hp":510,"vol":8},
 "manticore":{"hp":555,"vol":20},
}
def band(v):
 return "LEGACY" if v>=100 else "DANGER" if v>=90 else "RAGE" if v>=60 else "HEAT" if v>=30 else "CALM"

def run(boss,policy,max_turns=18):
 hp=BOSSES[boss]["hp"]; vol=BOSSES[boss]["vol"]; party=440
 entered_rage=False; legacy=False; legacy_survived=False; legacy_done=False; crashes=0

 for turn in range(1,max_turns+1):
  b=band(vol)

  if policy=="aggressive":
   dmg,dv,guard,evade,heal=78,12,False,False,0
  elif policy=="suppress":
   # Flamewing CORE + Leaf ROLE; Goura is STANCE
   dmg,dv,guard,evade,heal=52,-5,True,False,0
  elif policy=="raise_receive":
   if not legacy_done:
    # Goura ROLE + Ashfire Bracelet; Leaf is STANCE
    dmg,dv,guard,evade,heal=38,12,True,False,6
   elif vol>=85:
    dmg,dv,guard,evade,heal=52,-5,True,False,0
   else:
    dmg,dv,guard,evade,heal=78,12,False,False,0
  elif policy=="crash":
   if boss=="manticore" and b=="HEAT" and turn%2==0:
    # Goura CORE + Flamewing evade; Leaf is STANCE
    dmg,dv,guard,evade,heal=26,5,False,True,6
   else:
    dmg,dv,guard,evade,heal=52,(-5 if vol>=42 else 7),True,False,0
  else:
   raise ValueError(policy)

  party=min(440,party+heal)
  hp=max(0,hp-dmg)
  vol=max(0,min(100,vol+dv))
  if vol>=60: entered_rage=True
  if hp<=0: break

  eb=band(vol)
  edmg=0
  action_type="aoe"

  if boss=="boar":
   if vol>=100 and not legacy_done:
    legacy=True
    edmg=50*3
    action_type="aoe"
    legacy_survived=party>(edmg*.70 if guard else edmg)
    legacy_done=True
    vol=65
   elif eb=="DANGER":
    edmg=34*3; action_type="aoe"
   elif eb=="RAGE":
    edmg=42; action_type="single"
   elif eb=="HEAT":
    edmg=20*3; action_type="aoe"
   else:
    edmg=30; action_type="single"
  elif boss=="owl":
   if eb in ("DANGER","LEGACY"):
    edmg=42*3; action_type="aoe"
   elif eb=="RAGE":
    edmg=17*3; action_type="multi"
   elif eb=="HEAT":
    edmg=30; action_type="single"
   else:
    edmg=12*3; action_type="aoe"
  else:
   if eb in ("DANGER","LEGACY"):
    edmg=20*3; action_type="multi"
   elif eb=="RAGE":
    edmg=44; action_type="single"
   elif eb=="HEAT" and turn%2==0:
    if evade:
     crashes+=1
     edmg=0
    else:
     edmg=50
    action_type="single"
   elif eb=="HEAT":
    edmg=32; action_type="single"
   else:
    edmg=18*3; action_type="aoe"

  if guard:
   edmg *= .55 if action_type=="single" else .70

  party-=edmg
  if party<=0: break

 won=hp<=0 and party>0
 mastery=won and (
   (boss=="boar" and legacy and legacy_survived) or
   (boss=="owl" and not entered_rage) or
   (boss=="manticore" and crashes>=2)
 )
 return {
  "boss":boss,"policy":policy,"won":won,"mastery":mastery,
  "turns":turn,"final_vol":vol,"party_hp":round(party),
  "crashes":crashes,"legacy":legacy
 }

if __name__=="__main__":
 print("boss,policy,won,mastery,turns,final_vol,party_hp,crashes,legacy")
 for boss in BOSSES:
  for policy in ["aggressive","suppress","raise_receive","crash"]:
   r=run(boss,policy)
   print(",".join(str(r[k]) for k in ["boss","policy","won","mastery","turns","final_vol","party_hp","crashes","legacy"]))

let styleMap = new Map([[0,"Melee"],[1,"Ranged"],[2,"Magic"]]);
let monsterMap = MONSTERS.map(x=>{
    let res = {};
    res.name = x.name;
    res.attackStyle = styleMap.get(x.attackType);
    res.canStun = false;
    res.canSleep = false;
	res.usesNormalHit = true;


	if (res.attackStyle == "Melee") {
		res.attackLevel = x.strengthLevel;
		res.attackBonus = x.strengthBonus;
	}
	if (res.attackStyle == "Ranged") {
		res.attackLevel = x.rangedLevel;
		res.attackBonus = x.strengthBonusRanged;
	}
	if (res.attackStyle == "Magic") {
		if (!x.selectedSpell){
			res.attackLevel = x.setMaxHit;
		}
		else {
			res.attackLevel = SPELLS[x.selectedSpell].maxHit
		}
		res.attackBonus = x.damageBonusMagic;
	}
	
	res.specialAttack = [];
    if (x.specialAttackID) {
		let totalchance = 0
        for (i of x.specialAttackID) {
			if (enemySpecialAttacks[i].canSleep && !res.canSleep) res.canSleep = true;
			if (enemySpecialAttacks[i].canStun && !res.canStun) res.canStun = true;
			v = {};
			v.name = enemySpecialAttacks[i].name;
			if (enemySpecialAttacks[i].setDamage)
				v.maxHit = enemySpecialAttacks[i].setDamage;
			else{
				v.maxHit = 0;
			}
			totalchance = totalchance + enemySpecialAttacks[i].chance;
			res.specialAttack.push(v);
		}

		if (totalchance>=100){
			res.usesNormalHit = false;
			if (["Terran","Hunting Greater Dragon","Umbora","Rokken","Ku-Tul"].includes(x.name)){
				res.usesNormalHit = true;
			}
		}
	}

    return res;
})
monsterMap;
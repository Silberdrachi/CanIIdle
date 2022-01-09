let styleMap = new Map([["melee", "Melee"], ["ranged", "Ranged"], ["magic", "Magic"]]);
let monsterMap = MONSTERS
	.filter(monster => {
		const ignoredMonsters = ["Mysterious Figure - Phase 1",
			"Mysterious Figure - Phase 2",
			"Ahrenia",
			"Bane",
			"Bane, Instrument of Fear"];
		return !ignoredMonsters.includes(monster.name);
	})
	.sort((a, b) => {
		return getMonsterCombatLevel(a.id) - getMonsterCombatLevel(b.id);
	})
	.map(x => {
		let res = {};
		res.name = x.name;
		res.attackStyle = styleMap.get(x.attackType);
		res.canStun = false;
		res.canSleep = false;
		res.usesNormalHit = false;

		if (res.attackStyle === "Melee") {
			res.attackLevel = x.levels.Strength;
			if (x.equipmentStats && x.equipmentStats.length != 0 && x.equipmentStats.find(o => o.key === 'meleeStrengthBonus')) {
				res.attackBonus = x.equipmentStats.find(o => o.key === 'meleeStrengthBonus').value;
			} else {
				res.attackBonus = 0;
			}
		}
		if (res.attackStyle === "Ranged") {
			res.attackLevel = x.levels.Ranged;
			if (x.equipmentStats && x.equipmentStats.length != 0 && x.equipmentStats.find(o => o.key === "rangedStrengthBonus")) {
				res.attackBonus = x.equipmentStats.find(o => o.key === 'rangedStrengthBonus').value;
			} else {
				res.attackBonus = 0;
			}
		}
		if (res.attackStyle === "Magic") {
			res.attackLevel = x.levels.Magic;
			if (x.equipmentStats && x.equipmentStats.length != 0 && x.equipmentStats.find(o => o.key === "magicDamageBonus")) {
				res.attackBonus = x.equipmentStats.find(o => o.key === 'magicDamageBonus').value;
			} else {
				res.attackBonus = 0;
			}
			if (x.selectedSpell) {
				res.spellMaxHit = SPELLS[x.selectedSpell].maxHit
			}
		}

		res.specialAttack = [];
		if (x.specialAttacks) {
			let totalchance = 0
			for (special of x.specialAttacks) {
				if (special.onhitEffects && special.onhitEffects.length != 0) {
					for (effects of special.onhitEffects) {
						if (effects.type === "Stun") {
							res.canStun = true;
						}
						if (effects.type === "Sleep") {
							res.canSleep = true;
						}
						if (special.damage.length === 0 &&
							(effects.type === "Stun" || effects.type === "Sleep" || effects.type === "Modifier")) {
							res.usesNormalHit = true;
						}
					}
				}
				if (special.prehitEffects && special.prehitEffects.length != 0) {
					for (effects of special.prehitEffects) {
						if (effects.type === "Stun") {
							res.canStun = true;
						}
						if (effects.type === "Sleep") {
							res.canSleep = true;
						}
						if (special.damage.length === 0 &&
							(effects.type === "Stun" || effects.type === "Sleep" || effects.type === "Modifier")) {
							res.usesNormalHit = true;
						}
					}
				}

				v = {};
				v.name = special.name;
				if (special.damage.length != 0)
					v.maxHit = special.damage[0].maxPercent;
				else {
					v.maxHit = 0;
				}
				totalchance = totalchance + special.defaultChance;
				res.specialAttack.push(v);
			}

			if (totalchance < 100) {
				res.usesNormalHit = true;
			}
		}

		return res;
	});
monsterMap;

let easySlayer = MONSTERS.filter((monster, id) => {
	const combatLevel = getMonsterCombatLevel(id);
	return (monster.canSlayer && combatLevel >= SlayerTask.data[0].minLevel && combatLevel <= SlayerTask.data[0].maxLevel);
}).map(x => { return x.name });
easySlayer;

let normalSlayer = MONSTERS.filter((monster, id) => {
	const combatLevel = getMonsterCombatLevel(id);
	return (monster.canSlayer && combatLevel >= SlayerTask.data[1].minLevel && combatLevel <= SlayerTask.data[1].maxLevel);
}).map(x => { return x.name });
normalSlayer;

let hardSlayer = MONSTERS.filter((monster, id) => {
	const combatLevel = getMonsterCombatLevel(id);
	return (monster.canSlayer && combatLevel >= SlayerTask.data[2].minLevel && combatLevel <= SlayerTask.data[2].maxLevel);
}).map(x => { return x.name });
hardSlayer;

let eliteSlayer = MONSTERS.filter((monster, id) => {
	const combatLevel = getMonsterCombatLevel(id);
	return (monster.canSlayer && combatLevel >= SlayerTask.data[3].minLevel && combatLevel <= SlayerTask.data[3].maxLevel);
}).map(x => { return x.name });
eliteSlayer;

let masterSlayer = MONSTERS.filter((monster, id) => {
	const combatLevel = getMonsterCombatLevel(id);
	return (monster.canSlayer && combatLevel >= SlayerTask.data[4].minLevel && combatLevel <= SlayerTask.data[4].maxLevel);
}).map(x => { return x.name });
masterSlayer;
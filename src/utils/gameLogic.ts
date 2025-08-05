import { Player, PlayerStats, Choice, StoryNode, Item, PlayerClass, Equipment } from '../types/game';

export const createPlayer = (
  name: string,
  gender: 'male' | 'female' | 'other',
  race: string,
  playerClass: string,
  raceStats: Partial<PlayerStats>,
  classStats: Partial<PlayerStats>
): Player => {
  const baseStats: PlayerStats = {
    strength: 1,
    magic: 1,
    vitality: 1,
    luck: 1,
    reputation: 1,
    money: 20
  };

  // Apply race and class modifiers
  const finalStats = { ...baseStats };
  Object.keys(raceStats).forEach(key => {
    if (key in finalStats) {
      finalStats[key as keyof PlayerStats] += raceStats[key as keyof PlayerStats] || 0;
    }
  });
  Object.keys(classStats).forEach(key => {
    if (key in finalStats) {
      finalStats[key as keyof PlayerStats] += classStats[key as keyof PlayerStats] || 0;
    }
  });

  const maxHearts = Math.max(1, finalStats.vitality * 2);

  return {
    name,
    gender,
    race,
    classes: [{ name: playerClass, level: 1, unlockedAt: 1 }],
    activeClass: playerClass,
    stats: finalStats,
    level: 1,
    xp: 0,
    hearts: maxHearts,
    maxHearts,
    inventory: [],
    equipment: {},
    currentNode: 'intro'
  };
};

export const canUnlockClass = (player: Player, className: string, classRequirements: any): boolean => {
  const requirement = classRequirements[className];
  if (!requirement) return false;
  
  // Check if player already has this class
  if (player.classes.some(c => c.name === className)) return false;
  
  // Check if player has reached required level
  if (player.level < requirement.requiredLevel) return false;
  
  // Check if player has max classes for their level
  const maxClasses = player.level >= 10 ? 3 : player.level >= 5 ? 2 : 1;
  if (player.classes.length >= maxClasses) return false;
  
  // Check stat requirements
  for (const [stat, required] of Object.entries(requirement.requiredStats)) {
    if (player.stats[stat as keyof PlayerStats] < required) return false;
  }
  
  return true;
};

export const addClassToPlayer = (player: Player, className: string, classStats: Partial<PlayerStats>): Player => {
  const newClass: PlayerClass = {
    name: className,
    level: 1,
    unlockedAt: player.level
  };
  
  const newStats = { ...player.stats };
  Object.keys(classStats).forEach(key => {
    if (key in newStats) {
      newStats[key as keyof PlayerStats] += classStats[key as keyof PlayerStats] || 0;
    }
  });
  
  const newMaxHearts = Math.max(1, newStats.vitality * 2);
  
  return {
    ...player,
    classes: [...player.classes, newClass],
    stats: newStats,
    maxHearts: newMaxHearts,
    hearts: Math.min(player.hearts, newMaxHearts)
  };
};

export const addItemToInventory = (player: Player, item: Item): Player => {
  const newInventory = [...player.inventory];
  
  if (item.stackable) {
    const existingItem = newInventory.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + (item.quantity || 1);
    } else {
      newInventory.push({ ...item });
    }
  } else {
    newInventory.push({ ...item });
  }
  
  return { ...player, inventory: newInventory };
};

export const removeItemFromInventory = (player: Player, itemId: string, quantity: number = 1): Player => {
  const newInventory = [...player.inventory];
  const itemIndex = newInventory.findIndex(i => i.id === itemId);
  
  if (itemIndex === -1) return player;
  
  const item = newInventory[itemIndex];
  if (item.stackable && item.quantity && item.quantity > quantity) {
    item.quantity -= quantity;
  } else {
    newInventory.splice(itemIndex, 1);
  }
  
  return { ...player, inventory: newInventory };
};

export const useItem = (player: Player, item: Item): Player => {
  if (item.type !== 'consumable') return player;
  
  let updatedPlayer = { ...player };
  
  if (item.effects) {
    const newStats = { ...player.stats };
    let heartsChange = 0;
    let maxHeartsChange = 0;
    
    Object.keys(item.effects).forEach(key => {
      if (key === 'hearts') {
        heartsChange = item.effects!.hearts || 0;
      } else if (key === 'maxHearts') {
        maxHeartsChange = item.effects!.maxHearts || 0;
      } else if (key in newStats) {
        newStats[key as keyof PlayerStats] += item.effects![key as keyof PlayerStats] || 0;
      }
    });
    
    updatedPlayer.stats = newStats;
    
    if (maxHeartsChange !== 0) {
      updatedPlayer.maxHearts = Math.max(1, updatedPlayer.maxHearts + maxHeartsChange);
    }
    
    if (heartsChange !== 0) {
      updatedPlayer.hearts = Math.max(0, Math.min(updatedPlayer.maxHearts, updatedPlayer.hearts + heartsChange));
    }
  }
  
  // Remove the used item
  updatedPlayer = removeItemFromInventory(updatedPlayer, item.id, 1);
  
  return updatedPlayer;
};

export const canEquipItem = (player: Player, item: Item): boolean => {
  if (!item.subType) return false;
  
  // Check stat requirements
  if (item.requirements) {
    for (const [stat, requirement] of Object.entries(item.requirements)) {
      if (player.stats[stat as keyof PlayerStats] < requirement) {
        return false;
      }
    }
  }
  
  return true;
};

export const equipItem = (player: Player, item: Item): Player => {
  if (!canEquipItem(player, item) || !item.subType) return player;
  
  const newEquipment = { ...player.equipment };
  const newInventory = [...player.inventory];
  
  // Handle ring slots specially
  if (item.subType === 'ring') {
    if (!newEquipment.ring1) {
      newEquipment.ring1 = item;
    } else if (!newEquipment.ring2) {
      newEquipment.ring2 = item;
    } else {
      // Replace ring1, move old ring1 to inventory
      newInventory.push(newEquipment.ring1);
      newEquipment.ring1 = item;
    }
  } else {
    const slot = item.subType as keyof Equipment;
    
    // If slot is occupied, move old item to inventory
    if (newEquipment[slot]) {
      newInventory.push(newEquipment[slot]!);
    }
    
    newEquipment[slot] = item;
  }
  
  // Remove item from inventory
  const itemIndex = newInventory.findIndex(i => i.id === item.id);
  if (itemIndex !== -1) {
    newInventory.splice(itemIndex, 1);
  }
  
  return {
    ...player,
    equipment: newEquipment,
    inventory: newInventory
  };
};

export const unequipItem = (player: Player, slot: keyof Equipment): Player => {
  const item = player.equipment[slot];
  if (!item) return player;
  
  const newEquipment = { ...player.equipment };
  const newInventory = [...player.inventory, item];
  
  delete newEquipment[slot];
  
  return {
    ...player,
    equipment: newEquipment,
    inventory: newInventory
  };
};

export const getEquippedStats = (equipment: Equipment): Partial<PlayerStats & { hearts: number; maxHearts: number }> => {
  const bonusStats: Partial<PlayerStats & { hearts: number; maxHearts: number }> = {};
  
  Object.values(equipment).forEach(item => {
    if (item?.effects) {
      Object.entries(item.effects).forEach(([stat, value]) => {
        bonusStats[stat as keyof typeof bonusStats] = (bonusStats[stat as keyof typeof bonusStats] || 0) + value;
      });
    }
  });
  
  return bonusStats;
};

export const getTotalPlayerStats = (player: Player): PlayerStats & { hearts: number; maxHearts: number } => {
  const baseStats = { ...player.stats, hearts: player.hearts, maxHearts: player.maxHearts };
  const equipmentStats = getEquippedStats(player.equipment);
  
  const totalStats = { ...baseStats };
  Object.entries(equipmentStats).forEach(([stat, value]) => {
    if (stat in totalStats) {
      totalStats[stat as keyof typeof totalStats] += value || 0;
    }
  });
  
  return totalStats;
};

export const hasItem = (player: Player, itemId: string): boolean => {
  return player.inventory.some(item => item.id === itemId);
};

export const calculateXPThreshold = (level: number): number => {
  return level * 100;
};

export const canLevelUp = (player: Player): boolean => {
  return player.xp >= calculateXPThreshold(player.level);
};

export const shouldShowLevelUp = (player: Player): boolean => {
  return canLevelUp(player);
};
export const levelUpPlayer = (player: Player): Player => {
  const newLevel = player.level + 1;
  const newMaxHearts = Math.max(1, player.stats.vitality * 2);
  
  return {
    ...player,
    level: newLevel,
    maxHearts: newMaxHearts,
    hearts: Math.min(player.hearts + 1, newMaxHearts) // Heal 1 heart on level up
  };
};

export const applyStatIncrease = (player: Player, stat: keyof PlayerStats, amount: number): Player => {
  const newStats = { ...player.stats };
  newStats[stat] += amount;
  
  const newMaxHearts = stat === 'vitality' 
    ? Math.max(1, newStats.vitality * 2)
    : player.maxHearts;

  return {
    ...player,
    stats: newStats,
    maxHearts: newMaxHearts,
    hearts: Math.min(player.hearts, newMaxHearts)
  };
};

export const rollDice = (hasLuckAdvantage: boolean): number => {
  return hasLuckAdvantage 
    ? Math.floor(Math.random() * 3) + 4  // 4-6
    : Math.floor(Math.random() * 6) + 1; // 1-6
};

export const canMakeChoice = (choice: Choice, player: Player, diceRoll?: number): boolean => {
  // Check stat requirements
  if (choice.require) {
    for (const [stat, requirement] of Object.entries(choice.require)) {
      if (player.stats[stat as keyof PlayerStats] < requirement) {
        return false;
      }
    }
  }

  // Check item requirements
  if (choice.itemRequirements) {
    for (const itemId of choice.itemRequirements) {
      if (!hasItem(player, itemId)) {
        return false;
      }
    }
  }

  // Check luck-based visibility
  if (choice.hidden_unless_luck && player.stats.luck < choice.hidden_unless_luck) {
    return false;
  }

  // Check dice roll requirement
  if (choice.dice_requirement && diceRoll !== undefined) {
    return diceRoll >= choice.dice_requirement;
  }

  return true;
};

export const applyChoiceEffects = (player: Player, choice: Choice, gameItems: { [key: string]: Item }): Player => {
  if (!choice.effects) return player;

  let newPlayer = { ...player };
  let newStats = { ...player.stats };

  // Apply stat effects
  Object.keys(choice.effects).forEach(key => {
    if (key === 'xp') {
      newPlayer.xp += choice.effects!.xp || 0;
    } else if (key === 'hearts') {
      const healthChange = choice.effects!.hearts || 0;
      newPlayer.hearts = Math.max(0, Math.min(newPlayer.maxHearts, newPlayer.hearts + healthChange));
    } else if (key in newStats) {
      newStats[key as keyof PlayerStats] += choice.effects![key as keyof PlayerStats] || 0;
    }
  });

  newPlayer.stats = newStats;

  // Recalculate max hearts if vitality changed
  if (choice.effects.vitality) {
    newPlayer.maxHearts = Math.max(1, newStats.vitality * 2);
    newPlayer.hearts = Math.min(newPlayer.hearts, newPlayer.maxHearts);
  }

  // Add item rewards
  if (choice.itemRewards) {
    choice.itemRewards.forEach(itemId => {
      const item = gameItems[itemId];
      if (item) {
        newPlayer = addItemToInventory(newPlayer, item);
      }
    });
  }

  return newPlayer;
};

export const replaceVariables = (text: string, player: Player): string => {
  const pronouns = {
    male: { he_she: 'he', his_her: 'his', him_her: 'him' },
    female: { he_she: 'she', his_her: 'her', him_her: 'her' },
    other: { he_she: 'they', his_her: 'their', him_her: 'them' }
  };

  const playerPronouns = pronouns[player.gender];

  return text
    .replace(/{player_name}/g, player.name)
    .replace(/{player_race}/g, player.race)
    .replace(/{player_class}/g, player.activeClass)
    .replace(/{he_she}/g, playerPronouns.he_she)
    .replace(/{his_her}/g, playerPronouns.his_her)
    .replace(/{him_her}/g, playerPronouns.him_her);
};
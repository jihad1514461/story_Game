export interface PlayerStats {
  strength: number;
  magic: number;
  vitality: number;
  luck: number;
  reputation: number;
  money: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'quest';
  subType?: 'main_weapon' | 'side_weapon' | 'head' | 'body' | 'legs' | 'shoes' | 'ring' | 'necklace' | 'potion';
  description: string;
  effects?: Partial<PlayerStats & { hearts: number; maxHearts: number }>;
  requirements?: Partial<PlayerStats>;
  value: number;
  sellValue?: number;
  stackable?: boolean;
  quantity?: number;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface Equipment {
  mainWeapon?: Item;
  sideWeapon?: Item;
  head?: Item;
  body?: Item;
  legs?: Item;
  shoes?: Item;
  ring1?: Item;
  ring2?: Item;
  necklace?: Item;
  quickPotion?: Item;
}

export interface ShopItem extends Item {
  stock?: number;
  restockTime?: number;
}

export interface Shop {
  id: string;
  name: string;
  items: ShopItem[];
  buyMultiplier: number;
  sellMultiplier: number;
}

export interface PlayerClass {
  name: string;
  level: number;
  unlockedAt: number; // Player level when this class was unlocked
}

export interface Player {
  name: string;
  gender: 'male' | 'female' | 'other';
  race: string;
  classes: PlayerClass[];
  activeClass: string;
  stats: PlayerStats;
  level: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  inventory: Item[];
  equipment: Equipment;
  companions?: { [name: string]: number };
  fame?: number;
  currentNode: string;
}

export interface Choice {
  text: string;
  next_node: string;
  effects?: Partial<PlayerStats & { xp: number; hearts: number }>;
  itemRewards?: string[]; // Item IDs to give to player
  itemRequirements?: string[]; // Item IDs required to choose this option
  require?: Partial<PlayerStats>;
  dice_requirement?: number;
  luck_requirement?: number;
  hidden_unless_luck?: number;
}

export interface StoryNode {
  text: string;
  battle: boolean;
  choices: Choice[];
  dice_requirement?: number;
  is_ending?: boolean;
}

export interface Story {
  [key: string]: StoryNode;
}

export interface ClassRequirement {
  requiredStats: Partial<PlayerStats>;
  requiredLevel: number;
  description: string;
}

export interface GameData {
  classes: { [key: string]: Partial<PlayerStats> };
  races: { [key: string]: Partial<PlayerStats> };
  classRequirements: { [key: string]: ClassRequirement };
  items: { [key: string]: Item };
  shops: { [key: string]: Shop };
  stories: { [storyName: string]: Story };
}

export type GameScreen = 
  | 'start' 
  | 'admin-entry' 
  | 'player-creation' 
  | 'story-selection' 
  | 'admin-classes'
  | 'admin-races'
  | 'admin-items'
  | 'admin-stories'
  | 'gameplay' 
  | 'level-up'
  | 'class-selection'
  | 'inventory'
  | 'equipment'
  | 'shop';
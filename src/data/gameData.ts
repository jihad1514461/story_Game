import { GameData } from '../types/game';

export const initialGameData: GameData = {
  classes: {
    "Warrior": { 
      strength: 3, 
      magic: 0, 
      vitality: 2, 
      luck: 0, 
      reputation: 1, 
      money: 50 
    },
    "Mage": { 
      strength: 0, 
      magic: 3, 
      vitality: 1, 
      luck: 1, 
      reputation: 1, 
      money: 100 
    },
    "Rogue": { 
      strength: 1, 
      magic: 1, 
      vitality: 1, 
      luck: 3, 
      reputation: 0, 
      money: 75 
    },
    "Paladin": { 
      strength: 2, 
      magic: 1, 
      vitality: 2, 
      luck: 0, 
      reputation: 2, 
      money: 60 
    },
    "Ranger": {
      strength: 2,
      magic: 0,
      vitality: 1,
      luck: 2,
      reputation: 1,
      money: 65
    },
    "Knight": {
      strength: 4,
      magic: 0,
      vitality: 3,
      luck: 0,
      reputation: 2,
      money: 40
    },
    "Barbarian": {
      strength: 5,
      magic: 0,
      vitality: 4,
      luck: 1,
      reputation: 0,
      money: 30
    },
    "Archmage": {
      strength: 0,
      magic: 5,
      vitality: 1,
      luck: 2,
      reputation: 3,
      money: 150
    },
    "Assassin": {
      strength: 2,
      magic: 1,
      vitality: 1,
      luck: 5,
      reputation: -1,
      money: 100
    }
  },
  classRequirements: {
    "Knight": {
      requiredStats: { strength: 3, vitality: 2, reputation: 1 },
      requiredLevel: 5,
      description: "A noble warrior dedicated to honor and protection"
    },
    "Barbarian": {
      requiredStats: { strength: 4, vitality: 3 },
      requiredLevel: 5,
      description: "A fierce warrior who relies on raw strength and rage"
    },
    "Archmage": {
      requiredStats: { magic: 4, reputation: 2 },
      requiredLevel: 10,
      description: "A master of the arcane arts with immense magical power"
    },
    "Assassin": {
      requiredStats: { luck: 4, strength: 2 },
      requiredLevel: 10,
      description: "A deadly shadow who strikes from the darkness"
    }
  },
  items: {
    "iron_sword": {
      id: "iron_sword",
      name: "Iron Sword",
      type: "weapon",
      subType: "main_weapon",
      description: "A sturdy iron blade that increases your combat prowess",
      effects: { strength: 2 },
      value: 100,
      sellValue: 50,
      rarity: "common"
    },
    "magic_staff": {
      id: "magic_staff",
      name: "Magic Staff",
      type: "weapon",
      subType: "main_weapon",
      description: "A mystical staff that amplifies magical abilities",
      effects: { magic: 2 },
      value: 120,
      sellValue: 60,
      rarity: "common"
    },
    "leather_armor": {
      id: "leather_armor",
      name: "Leather Armor",
      type: "armor",
      subType: "body",
      description: "Light armor that provides basic protection",
      effects: { vitality: 1, maxHearts: 1 },
      value: 80,
      sellValue: 40,
      rarity: "common"
    },
    "health_potion": {
      id: "health_potion",
      name: "Health Potion",
      type: "consumable",
      subType: "potion",
      description: "Restores 2 hearts when consumed",
      effects: { hearts: 2 },
      value: 50,
      sellValue: 25,
      stackable: true,
      quantity: 1,
      rarity: "common"
    },
    "lucky_charm": {
      id: "lucky_charm",
      name: "Lucky Charm",
      type: "accessory",
      subType: "necklace",
      description: "A mysterious charm that brings good fortune",
      effects: { luck: 1 },
      value: 75,
      sellValue: 37,
      rarity: "uncommon"
    },
    "silver_coin": {
      id: "silver_coin",
      name: "Silver Coin",
      type: "quest",
      description: "An ancient silver coin with mysterious markings",
      value: 25,
      sellValue: 12,
      rarity: "common"
    },
    "steel_helmet": {
      id: "steel_helmet",
      name: "Steel Helmet",
      type: "armor",
      subType: "head",
      description: "A sturdy steel helmet that protects your head",
      effects: { vitality: 1 },
      value: 60,
      sellValue: 30,
      rarity: "common"
    },
    "power_ring": {
      id: "power_ring",
      name: "Ring of Power",
      type: "accessory",
      subType: "ring",
      description: "A magical ring that enhances your strength",
      effects: { strength: 1 },
      value: 90,
      sellValue: 45,
      rarity: "uncommon"
    },
    "mana_potion": {
      id: "mana_potion",
      name: "Mana Potion",
      type: "consumable",
      subType: "potion",
      description: "Restores magical energy",
      effects: { magic: 1 },
      value: 40,
      sellValue: 20,
      stackable: true,
      quantity: 1,
      rarity: "common"
    }
  },
  shops: {
    "town_general": {
      id: "town_general",
      name: "General Store",
      buyMultiplier: 1.0,
      sellMultiplier: 0.5,
      items: [
        {
          id: "health_potion",
          name: "Health Potion",
          type: "consumable",
          subType: "potion",
          description: "Restores 2 hearts when consumed",
          effects: { hearts: 2 },
          value: 50,
          sellValue: 25,
          stackable: true,
          quantity: 1,
          rarity: "common",
          stock: 10
        },
        {
          id: "mana_potion",
          name: "Mana Potion",
          type: "consumable",
          subType: "potion",
          description: "Restores magical energy",
          effects: { magic: 1 },
          value: 40,
          sellValue: 20,
          stackable: true,
          quantity: 1,
          rarity: "common",
          stock: 8
        },
        {
          id: "iron_sword",
          name: "Iron Sword",
          type: "weapon",
          subType: "main_weapon",
          description: "A sturdy iron blade that increases your combat prowess",
          effects: { strength: 2 },
          value: 100,
          sellValue: 50,
          rarity: "common",
          stock: 3
        },
        {
          id: "leather_armor",
          name: "Leather Armor",
          type: "armor",
          subType: "body",
          description: "Light armor that provides basic protection",
          effects: { vitality: 1, maxHearts: 1 },
          value: 80,
          sellValue: 40,
          rarity: "common",
          stock: 2
        },
        {
          id: "steel_helmet",
          name: "Steel Helmet",
          type: "armor",
          subType: "head",
          description: "A sturdy steel helmet that protects your head",
          effects: { vitality: 1 },
          value: 60,
          sellValue: 30,
          rarity: "common",
          stock: 2
        },
        {
          id: "power_ring",
          name: "Ring of Power",
          type: "accessory",
          subType: "ring",
          description: "A magical ring that enhances your strength",
          effects: { strength: 1 },
          value: 90,
          sellValue: 45,
          rarity: "uncommon",
          stock: 1
        }
      ]
    }
  },
  races: {
    "Human": { 
      strength: 1, 
      magic: 1, 
      vitality: 1, 
      luck: 1, 
      reputation: 1, 
      money: 25 
    },
    "Elf": { 
      strength: 0, 
      magic: 2, 
      vitality: 0, 
      luck: 2, 
      reputation: 1, 
      money: 50 
    },
    "Dwarf": { 
      strength: 2, 
      magic: 0, 
      vitality: 2, 
      luck: 0, 
      reputation: 1, 
      money: 75 
    },
    "Halfling": { 
      strength: 0, 
      magic: 1, 
      vitality: 1, 
      luck: 3, 
      reputation: 0, 
      money: 40 
    },
    "Orc": {
      strength: 3,
      magic: 0,
      vitality: 2,
      luck: 0,
      reputation: -1,
      money: 30
    }
  },
  stories: {
    "The Cursed Forest": {
      "intro": {
        "text": "Welcome, {player_name} the {player_race} {player_class}. You stand at the edge of the Cursed Forest, dark shadows dancing between ancient trees. The villagers speak of great treasure within, but also of terrible dangers. Your {he_she} feels the weight of destiny upon {his_her} shoulders. The moon casts an eerie glow through the mist, and you hear distant howls echoing from within.",
        "battle": false,
        "choices": [
          {
            "text": "Enter the forest boldly with weapon drawn",
            "next_node": "forest_entrance_bold",
            "effects": { "xp": 15, "reputation": 1 }
          },
          {
            "text": "Study the forest edge and look for clues",
            "next_node": "forest_study",
            "effects": { "xp": 10 }
          },
          {
            "text": "Return to town for supplies and information",
            "next_node": "town_return",
            "require": { "money": 10 }
          },
          {
            "text": "Use magic to sense the forest's aura",
            "next_node": "magic_sense",
            "require": { "magic": 2 },
            "effects": { "xp": 20 }
          },
          {
            "text": "Wait for dawn before entering",
            "next_node": "dawn_wait",
            "hidden_unless_luck": 2
          }
        ]
      },
      "forest_entrance_bold": {
        "text": "You stride confidently into the forest with your weapon ready. The canopy closes overhead, plunging you into an eerie twilight. Strange whispers echo from the shadows, and glowing eyes watch from the undergrowth. Suddenly, a massive shadow wolf emerges, its fur crackling with dark magic! Its eyes burn with malevolent intelligence.",
        "battle": true,
        "dice_requirement": 3,
        "choices": [
          {
            "text": "Fight the wolf head-on with brute force!",
            "next_node": "wolf_victory_brutal",
            "effects": { "xp": 30, "hearts": -2 },
            "require": { "strength": 3 },
            "dice_requirement": 5
          },
          {
            "text": "Use tactical combat techniques",
            "next_node": "wolf_victory_tactical",
            "effects": { "xp": 25, "hearts": -1 },
            "require": { "strength": 2 },
            "dice_requirement": 4
          },
          {
            "text": "Cast a banishment spell",
            "next_node": "wolf_banished",
            "effects": { "xp": 35 },
            "require": { "magic": 3 },
            "dice_requirement": 3
          },
          {
            "text": "Try to sneak past in the shadows",
            "next_node": "sneak_success",
            "effects": { "xp": 20 },
            "require": { "luck": 2 },
            "dice_requirement": 5
          },
          {
            "text": "Attempt to communicate with the wolf",
            "next_node": "wolf_communication",
            "effects": { "xp": 15 },
            "require": { "reputation": 2 },
            "dice_requirement": 4,
            "hidden_unless_luck": 3
          },
          {
            "text": "Retreat quickly to the forest edge",
            "next_node": "tactical_retreat",
            "effects": { "hearts": 0, "reputation": -1 }
          }
        ]
      },
      "forest_study": {
        "text": "You carefully examine the forest edge, noting unusual markings carved into the bark of ancient trees. Strange footprints in the dirt tell tales of creatures both mundane and magical. Your keen observation reveals multiple hidden paths - one marked with protective runes, another with warning symbols, and a third that seems to shimmer with magical energy.",
        "battle": false,
        "choices": [
          {
            "text": "Follow the path with protective runes",
            "next_node": "protected_path",
            "effects": { "xp": 25, "luck": 1 }
          },
          {
            "text": "Take the path with warning symbols",
            "next_node": "dangerous_path",
            "effects": { "xp": 30, "reputation": 1 }
          },
          {
            "text": "Investigate the shimmering magical path",
            "next_node": "magic_path",
            "effects": { "xp": 20, "magic": 1 },
            "require": { "magic": 1 }
          },
          {
            "text": "Enter through the main path anyway",
            "next_node": "forest_entrance_bold",
            "effects": { "xp": 10 }
          },
          {
            "text": "Set up camp and observe the forest overnight",
            "next_node": "night_observation",
            "effects": { "xp": 15 },
            "hidden_unless_luck": 2
          }
        ]
      },
      "town_return": {
        "text": "You return to the village tavern, where the locals eye you with a mixture of hope and skepticism. The barkeeper, an old dwarf named Thorin, slides you a mug of ale and leans in close. 'Many have tried to cleanse that forest,' he whispers. 'But those who return speak of ancient magic and creatures that shouldn't exist. Here, take this.' He hands you a small silver charm.",
        "battle": false,
        "choices": [
          {
            "text": "Accept the charm and ask about the forest's history",
            "next_node": "forest_lore",
            "effects": { "xp": 20, "money": -10, "luck": 1 }
          },
          {
            "text": "Buy supplies and hire a guide",
            "next_node": "guided_entry",
            "effects": { "xp": 15, "money": -25, "reputation": 1 },
            "require": { "money": 25 }
          },
          {
            "text": "Gather information about previous adventurers",
            "next_node": "adventurer_tales",
            "effects": { "xp": 25, "money": -5 }
          },
          {
            "text": "Visit the town shop for supplies",
            "next_node": "town_shop",
            "effects": { "xp": 5 }
          }
        ]
      },
      "town_shop": {
        "text": "You enter the bustling town shop. The merchant, a cheerful halfling named Pip, greets you warmly. 'Welcome, adventurer! I have the finest goods this side of the mountains. What can I interest you in today?' Shelves line the walls, filled with weapons, armor, potions, and various adventuring supplies.",
        "battle": false,
        "choices": [
          {
            "text": "Browse the shop's wares",
            "next_node": "shop_interface",
            "effects": { "xp": 5 }
          },
          {
            "text": "Ask about rare items",
            "next_node": "rare_items_info",
            "effects": { "xp": 10 }
          },
          {
            "text": "Leave the shop and return to the tavern",
            "next_node": "town_return",
            "effects": {}
          }
        ]
      },
      "magic_sense": {
        "text": "You extend your magical senses toward the forest, and immediately feel overwhelmed by the sheer intensity of dark energy emanating from within. Ancient magic pulses through the very roots of the trees, and you sense multiple sources of power - some malevolent, others neutral, and surprisingly, a few that feel almost... protective. Your magical insight reveals that this curse has layers, like an onion of dark enchantments.",
        "battle": false,
        "choices": [
          {
            "text": "Focus on the protective magic sources",
            "next_node": "protective_magic_path",
            "effects": { "xp": 30, "magic": 1 }
          },
          {
            "text": "Investigate the neutral magic sources",
            "next_node": "neutral_magic_path",
            "effects": { "xp": 25 }
          },
          {
            "text": "Confront the malevolent sources directly",
            "next_node": "dark_magic_confrontation",
            "effects": { "xp": 35, "hearts": -1 },
            "require": { "magic": 3 }
          }
        ]
      },
      "wolf_victory_brutal": {
        "text": "Your weapon strikes true with devastating force! The magical wolf howls in agony as your blade cleaves through its shadowy form. Dark energy dissipates like smoke, leaving behind a crystal pulsing with contained starlight. However, your aggressive approach has attracted attention - you hear more howls in the distance, and the forest seems to stir with awakening malevolence.",
        "battle": false,
        "choices": [
          {
            "text": "Quickly grab the crystal and move deeper",
            "next_node": "crystal_power_rush",
            "effects": { "xp": 20, "magic": 2 },
            "itemRewards": ["silver_coin"]
          },
          {
            "text": "Stand your ground and prepare for more enemies",
            "next_node": "forest_siege",
            "effects": { "xp": 25, "strength": 1 },
            "itemRewards": ["iron_sword"]
          },
          {
            "text": "Use the crystal's power to ward off threats",
            "next_node": "crystal_protection",
            "effects": { "xp": 30, "hearts": 1 },
            "require": { "magic": 1 },
            "itemRewards": ["magic_staff"]
          }
        ]
      },
      "wolf_banished": {
        "text": "Your magical energy surges, creating a brilliant barrier of pure light that cuts through the darkness like a blade. The wolf recoils with a supernatural shriek, its form beginning to dissolve. But as it fades, it speaks in an ancient tongue: 'The curse... runs deeper... than you know...' The forest spirits seem to approve of your merciful approach, and you feel your magical abilities growing stronger from this act of wisdom rather than violence.",
        "battle": false,
        "choices": [
          {
            "text": "Commune with the forest spirits for guidance",
            "next_node": "spirit_communion",
            "effects": { "magic": 2, "xp": 35, "reputation": 2 }
          },
          {
            "text": "Follow the wolf's fading essence deeper into the forest",
            "next_node": "essence_trail",
            "effects": { "xp": 25, "magic": 1 }
          },
          {
            "text": "Investigate the area where the wolf appeared",
            "next_node": "wolf_origin",
            "effects": { "xp": 20 }
          }
        ]
      },
      "protected_path": {
        "text": "The path marked with protective runes leads you safely through the most dangerous parts of the forest. Ancient magic shields you from the worst of the curse's effects, and you discover an abandoned campsite belonging to a previous adventurer. Their journal reveals crucial information about the forest's layout and the location of a sacred grove where the curse might be broken. You also find useful supplies and a map.",
        "battle": false,
        "choices": [
          {
            "text": "Head directly to the sacred grove",
            "next_node": "sacred_grove_approach",
            "effects": { "xp": 40, "reputation": 2, "money": 50 },
            "itemRewards": ["leather_armor", "health_potion"]
          },
          {
            "text": "Explore other locations marked on the map first",
            "next_node": "map_exploration",
            "effects": { "xp": 30, "money": 30 },
            "itemRewards": ["lucky_charm"]
          },
          {
            "text": "Study the journal more thoroughly for hidden secrets",
            "next_node": "journal_secrets",
            "effects": { "xp": 35, "magic": 1 },
            "hidden_unless_luck": 3,
            "itemRewards": ["magic_staff", "silver_coin"]
          }
        ]
      },
      "spirit_communion": {
        "text": "The forest spirits materialize around you as wisps of ethereal light, their voices like wind through leaves. They speak of an ancient evil that corrupted their realm centuries ago, turning their guardian creatures into monsters. 'The source lies in the Heart of Shadows,' they whisper, 'where the first curse was cast. But beware - the path is treacherous, and the evil grows stronger as you approach.' They offer you their blessing and reveal hidden knowledge.",
        "battle": false,
        "choices": [
          {
            "text": "Accept their blessing and seek the Heart of Shadows",
            "next_node": "heart_of_shadows_quest",
            "effects": { "xp": 50, "magic": 2, "luck": 2, "reputation": 3 }
          },
          {
            "text": "Ask them to guide you to other survivors in the forest",
            "next_node": "survivor_rescue",
            "effects": { "xp": 35, "reputation": 2 }
          },
          {
            "text": "Request knowledge of the curse's weaknesses",
            "next_node": "curse_knowledge",
            "effects": { "xp": 40, "magic": 1 }
          }
        ]
      },
      "heart_of_shadows_quest": {
        "text": "Guided by the spirits' blessing, you venture deeper into the forest than any mortal has gone in centuries. The very air grows thick with malevolent energy, and reality seems to bend around you. At the center of a clearing stands an obsidian altar, pulsing with dark power. This is the Heart of Shadows - the source of the curse. Dark tendrils of energy lash out, but your spirit blessing protects you. You realize this is your moment of destiny.",
        "battle": true,
        "dice_requirement": 4,
        "choices": [
          {
            "text": "Channel all your magical power to destroy the altar",
            "next_node": "curse_broken_magic",
            "effects": { "xp": 100, "magic": 3, "reputation": 5 },
            "require": { "magic": 4 },
            "dice_requirement": 5
          },
          {
            "text": "Use your strength to physically shatter the altar",
            "next_node": "curse_broken_strength",
            "effects": { "xp": 100, "strength": 3, "reputation": 5 },
            "require": { "strength": 4 },
            "dice_requirement": 5
          },
          {
            "text": "Attempt to purify the altar instead of destroying it",
            "next_node": "curse_purified",
            "effects": { "xp": 150, "magic": 2, "reputation": 7, "luck": 2 },
            "require": { "magic": 3, "reputation": 3 },
            "dice_requirement": 6,
            "hidden_unless_luck": 4
          },
          {
            "text": "Try to understand and redirect the curse's power",
            "next_node": "curse_mastery",
            "effects": { "xp": 120, "magic": 4, "reputation": 4 },
            "require": { "magic": 5, "luck": 3 },
            "dice_requirement": 6
          }
        ]
      },
      "curse_broken_magic": {
        "text": "Your magical power erupts in a brilliant explosion of pure light that shatters the obsidian altar into a thousand pieces. The curse breaks like chains falling away, and the forest immediately begins to heal. Corrupted creatures transform back into their natural forms, dark trees regain their healthy green, and sunlight pierces through the canopy for the first time in centuries. You return to the village as a legendary hero, your name forever remembered as the Curse-Breaker. The grateful villagers shower you with rewards and honor.",
        "battle": false,
        "is_ending": true,
        "choices": [
          {
            "text": "Begin a new adventure",
            "next_node": "intro",
            "effects": { "xp": 200, "money": 500, "reputation": 10 }
          }
        ]
      },
      "curse_purified": {
        "text": "Instead of destroying the altar, you channel your power to purify it, transforming the source of corruption into a beacon of healing light. This act of wisdom and compassion not only breaks the curse but creates a permanent sanctuary that will protect the forest for generations to come. The spirits crown you as the Forest Guardian, granting you incredible power and the eternal gratitude of all woodland creatures. Your legend spreads across the land as the hero who chose healing over destruction.",
        "battle": false,
        "is_ending": true,
        "choices": [
          {
            "text": "Accept the role of Forest Guardian",
            "next_node": "guardian_ending",
            "effects": { "xp": 300, "money": 1000, "reputation": 15, "magic": 5 }
          },
          {
            "text": "Decline and seek new adventures",
            "next_node": "intro",
            "effects": { "xp": 250, "money": 750, "reputation": 12 }
          }
        ]
      },
      "guardian_ending": {
        "text": "You accept the sacred role of Forest Guardian, becoming one with the ancient magic of the woodland realm. Your power grows beyond mortal limits, and you spend your days protecting travelers, healing wounded creatures, and maintaining the balance between civilization and nature. Bards sing songs of your wisdom and compassion across the realm. This is not an ending, but a transformation into legend itself.",
        "battle": false,
        "is_ending": true,
        "choices": [
          {
            "text": "Begin a new mortal adventure",
            "next_node": "intro",
            "effects": { "xp": 500, "money": 2000, "reputation": 20 }
          }
        ]
      }
    },
    "The Dragon's Lair": {
      "intro": {
        "text": "The ancient dragon Pyraxis has awakened from its century-long slumber, terrorizing the mountain villages. You, {player_name} the {player_race} {player_class}, have been chosen to face this legendary beast. The mountain path ahead is treacherous, and the dragon's lair lies at the peak, shrouded in smoke and flame.",
        "battle": false,
        "choices": [
          {
            "text": "Climb the mountain path directly",
            "next_node": "mountain_climb",
            "effects": { "xp": 15 }
          },
          {
            "text": "Seek the old dragon hunter in the village",
            "next_node": "dragon_hunter",
            "effects": { "xp": 10, "money": -20 },
            "require": { "money": 20 }
          },
          {
            "text": "Study ancient texts about dragon lore",
            "next_node": "dragon_lore",
            "effects": { "xp": 20 },
            "require": { "magic": 2 }
          }
        ]
      },
      "mountain_climb": {
        "text": "The mountain path is steep and dangerous. Loose rocks threaten to send you tumbling into the abyss below. As you climb higher, the air grows thin and the temperature drops. Suddenly, you encounter a group of dragon cultists blocking your path, their eyes glowing with fanatical fervor.",
        "battle": true,
        "dice_requirement": 3,
        "choices": [
          {
            "text": "Fight the cultists with sword and strength",
            "next_node": "cultist_battle_won",
            "effects": { "xp": 30, "hearts": -1 },
            "require": { "strength": 2 },
            "dice_requirement": 4
          },
          {
            "text": "Use magic to overcome them",
            "next_node": "cultist_magic_victory",
            "effects": { "xp": 35 },
            "require": { "magic": 3 },
            "dice_requirement": 3
          },
          {
            "text": "Try to convince them you're also a dragon worshipper",
            "next_node": "cultist_deception",
            "effects": { "xp": 25, "reputation": -1 },
            "dice_requirement": 5
          }
        ]
      },
      "dragon_lore": {
        "text": "Your study of ancient texts reveals that Pyraxis is not just any dragon, but an ancient red dragon with a weakness to cold magic and a particular hatred for those who carry silver weapons. You also learn of a secret entrance to the lair through underwater caves. This knowledge could prove invaluable in your quest.",
        "battle": false,
        "choices": [
          {
            "text": "Seek out silver weapons and cold magic items",
            "next_node": "dragon_preparation",
            "effects": { "xp": 25, "money": -50 },
            "require": { "money": 50 }
          },
          {
            "text": "Find the underwater cave entrance",
            "next_node": "cave_entrance",
            "effects": { "xp": 30 }
          },
          {
            "text": "Approach the dragon's lair with your new knowledge",
            "next_node": "informed_approach",
            "effects": { "xp": 20, "magic": 1 }
          }
        ]
      },
      "dragon_preparation": {
        "text": "Armed with silver weapons and frost enchantments, you feel ready to face the ancient dragon. The magical items hum with power, and you can sense they will be effective against Pyraxis. As you approach the dragon's lair, you hear the thunderous roar echoing from within the mountain. The final confrontation awaits.",
        "battle": true,
        "dice_requirement": 2,
        "choices": [
          {
            "text": "Challenge the dragon to honorable combat",
            "next_node": "dragon_honor_battle",
            "effects": { "xp": 100, "reputation": 3 },
            "dice_requirement": 4
          },
          {
            "text": "Use stealth and your prepared weapons for a surprise attack",
            "next_node": "dragon_ambush",
            "effects": { "xp": 80, "hearts": -2 },
            "dice_requirement": 3
          },
          {
            "text": "Attempt to negotiate with the ancient dragon",
            "next_node": "dragon_negotiation",
            "effects": { "xp": 60 },
            "require": { "reputation": 3 },
            "dice_requirement": 5,
            "hidden_unless_luck": 3
          }
        ]
      },
      "dragon_honor_battle": {
        "text": "Pyraxis accepts your challenge with grudging respect. 'It has been long since a mortal showed such courage,' the dragon rumbles. The battle is fierce and honorable, your silver weapons and frost magic proving effective against the ancient beast. In the end, Pyraxis yields, impressed by your valor. The dragon agrees to leave the villages in peace and grants you a portion of its hoard as tribute to your bravery.",
        "battle": false,
        "is_ending": true,
        "choices": [
          {
            "text": "Accept the dragon's tribute and become a legendary hero",
            "next_node": "dragon_hero_ending",
            "effects": { "xp": 200, "money": 1000, "reputation": 10 }
          }
        ]
      },
      "dragon_hero_ending": {
        "text": "You return to the villages as a legendary dragon slayer, though you chose honor over slaughter. Pyraxis keeps its word, and the mountain region prospers under the protection of both dragon and hero. Your name is sung in taverns across the land, and young adventurers seek you out for training. You have become a living legend.",
        "battle": false,
        "is_ending": true,
        "choices": [
          {
            "text": "Begin a new adventure",
            "next_node": "intro",
            "effects": { "xp": 300, "money": 1500, "reputation": 15 }
          }
        ]
      }
    }
  }
};
import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { AdminEntry } from './components/AdminEntry';
import { PlayerCreation } from './components/PlayerCreation';
import { StorySelection } from './components/StorySelection';
import { AdminInterface } from './components/AdminInterface';
import { GameplayScreen } from './components/GameplayScreen';
import { LevelUpScreen } from './components/LevelUpScreen';
import { ClassSelection } from './components/ClassSelection';
import { InventoryScreen } from './components/InventoryScreen';
import { EquipmentScreen } from './components/EquipmentScreen';
import { ShopScreen } from './components/ShopScreen';
import { GameScreen, Player, GameData, Choice, PlayerStats, Equipment, ShopItem } from './types/game';
import { initialGameData } from './data/gameData';
import { 
  createPlayer, 
  canLevelUp, 
  levelUpPlayer, 
  applyStatIncrease, 
  applyChoiceEffects,
  calculateXPThreshold,
  canUnlockClass,
  addClassToPlayer,
  useItem,
  equipItem,
  unequipItem,
  addItemToInventory,
  removeItemFromInventory
} from './utils/gameLogic';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('start');
  const [gameData, setGameData] = useState<GameData>(initialGameData);
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [currentShop, setCurrentShop] = useState<string>('');

  // Load saved data on component mount
  useEffect(() => {
    const savedGameData = localStorage.getItem('rpg-game-data');
    if (savedGameData) {
      try {
        setGameData(JSON.parse(savedGameData));
      } catch (error) {
        console.error('Failed to load saved game data:', error);
      }
    }

    const savedPlayer = localStorage.getItem('rpg-player');
    if (savedPlayer) {
      try {
        setPlayer(JSON.parse(savedPlayer));
      } catch (error) {
        console.error('Failed to load saved player:', error);
      }
    }
  }, []);

  // Save player data whenever it changes
  useEffect(() => {
    if (player) {
      localStorage.setItem('rpg-player', JSON.stringify(player));
    }
  }, [player]);

  const handleStartScreenOption = (option: 'game' | 'admin') => {
    if (option === 'game') {
      setCurrentScreen('admin-entry');
    } else {
      setCurrentScreen('admin-classes');
    }
  };

  const handleAdminEntryOption = (option: 'continue' | 'new') => {
    if (option === 'continue' && player) {
      setCurrentScreen('gameplay');
    } else {
      // Clear existing player data for new game
      setPlayer(null);
      localStorage.removeItem('rpg-player');
      setCurrentScreen('player-creation');
    }
  };

  const handleCreatePlayer = (name: string, gender: 'male' | 'female' | 'other', race: string, playerClass: string) => {
    const raceStats = gameData.races[race] || {};
    const classStats = gameData.classes[playerClass] || {};
    const newPlayer = createPlayer(name, gender, race, playerClass, raceStats, classStats);
    setPlayer(newPlayer);
    setCurrentScreen('story-selection');
  };

  const handleSelectStory = (storyName: string) => {
    setSelectedStory(storyName);
    if (player) {
      const updatedPlayer = { ...player, currentNode: 'intro' };
      setPlayer(updatedPlayer);
    }
    setCurrentScreen('gameplay');
  };

  const handleUpdateGameData = (newData: GameData) => {
    setGameData(newData);
    localStorage.setItem('rpg-game-data', JSON.stringify(newData));
  };

  const handleMakeChoice = (choice: Choice) => {
    if (!player || !selectedStory) return;

    // Apply choice effects
    let updatedPlayer = applyChoiceEffects(player, choice, gameData.items);
    
    // Check for death
    if (updatedPlayer.hearts <= 0) {
      alert('Your hero has fallen! The adventure ends here.');
      setPlayer(null);
      localStorage.removeItem('rpg-player');
      setCurrentScreen('start');
      return;
    }

    // Update current node
    updatedPlayer.currentNode = choice.next_node;
    
    // Check for level up
    if (canLevelUp(updatedPlayer)) {
      updatedPlayer = levelUpPlayer(updatedPlayer);
      setPlayer(updatedPlayer);
      setCurrentScreen('level-up');
      return;
    }

    setPlayer(updatedPlayer);
  };

  const handleApplyLevelUp = (statIncreases: { [key in keyof PlayerStats]?: number }) => {
    if (!player) return;

    let updatedPlayer = { ...player };
    
    // Apply stat increases
    Object.keys(statIncreases).forEach(stat => {
      const increase = statIncreases[stat as keyof PlayerStats];
      if (increase) {
        updatedPlayer = applyStatIncrease(updatedPlayer, stat as keyof PlayerStats, increase);
      }
    });

    // Check if player can unlock new classes at level 5 or 10
    const canUnlockNewClass = (updatedPlayer.level === 5 || updatedPlayer.level === 10) &&
      Object.keys(gameData.classRequirements).some(className =>
        canUnlockClass(updatedPlayer, className, gameData.classRequirements)
      );

    if (canUnlockNewClass) {
      setPlayer(updatedPlayer);
      setCurrentScreen('class-selection');
      return;
    }

    setPlayer(updatedPlayer);
    setCurrentScreen('gameplay');
  };

  const handleSelectClass = (className: string) => {
    if (!player) return;

    const classStats = gameData.classes[className] || {};
    const updatedPlayer = addClassToPlayer(player, className, classStats);
    setPlayer(updatedPlayer);
    setCurrentScreen('gameplay');
  };

  const handleUseItem = (item: any) => {
    if (!player) return;

    const updatedPlayer = useItem(player, item);
    setPlayer(updatedPlayer);
  };

  const handleEquipItem = (item: any) => {
    if (!player) return;
    const updatedPlayer = equipItem(player, item);
    setPlayer(updatedPlayer);
  };

  const handleUnequipItem = (slot: keyof Equipment) => {
    if (!player) return;
    const updatedPlayer = unequipItem(player, slot);
    setPlayer(updatedPlayer);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (!player) return;
    
    const shop = gameData.shops[currentShop];
    if (!shop) return;
    
    const price = Math.floor(item.value * shop.buyMultiplier);
    if (player.stats.money < price) return;
    
    // Update player
    let updatedPlayer = { ...player };
    updatedPlayer.stats.money -= price;
    updatedPlayer = addItemToInventory(updatedPlayer, item);
    
    // Update shop stock
    const updatedShop = { ...shop };
    const shopItemIndex = updatedShop.items.findIndex(i => i.id === item.id);
    if (shopItemIndex !== -1 && updatedShop.items[shopItemIndex].stock) {
      updatedShop.items[shopItemIndex].stock! -= 1;
    }
    
    const updatedGameData = {
      ...gameData,
      shops: {
        ...gameData.shops,
        [currentShop]: updatedShop
      }
    };
    
    setPlayer(updatedPlayer);
    setGameData(updatedGameData);
    localStorage.setItem('rpg-game-data', JSON.stringify(updatedGameData));
  };

  const handleSellItem = (item: any) => {
    if (!player) return;
    
    const shop = gameData.shops[currentShop];
    if (!shop) return;
    
    const sellPrice = Math.floor((item.sellValue || item.value * 0.5) * shop.sellMultiplier);
    
    let updatedPlayer = { ...player };
    updatedPlayer.stats.money += sellPrice;
    updatedPlayer = removeItemFromInventory(updatedPlayer, item.id, 1);
    
    setPlayer(updatedPlayer);
  };

  const handleOpenShop = (shopId: string) => {
    setCurrentShop(shopId);
    setCurrentScreen('shop');
  };

  const getCurrentStoryNode = () => {
    if (!player || !selectedStory || !gameData.stories[selectedStory]) {
      return null;
    }
    
    return gameData.stories[selectedStory][player.currentNode] || null;
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'start':
        return <StartScreen onSelectOption={handleStartScreenOption} />;
      
      case 'admin-entry':
        return (
          <AdminEntry
            onSelectOption={handleAdminEntryOption}
            onBack={() => setCurrentScreen('start')}
            hasExistingPlayer={!!player}
          />
        );
      
      case 'player-creation':
        return (
          <PlayerCreation
            gameData={gameData}
            onCreatePlayer={handleCreatePlayer}
            onBack={() => setCurrentScreen('admin-entry')}
          />
        );
      
      case 'story-selection':
        return (
          <StorySelection
            gameData={gameData}
            onSelectStory={handleSelectStory}
            onBack={() => setCurrentScreen('player-creation')}
          />
        );
      
      case 'admin-classes':
      case 'admin-races':
      case 'admin-stories':
        return (
          <AdminInterface
            gameData={gameData}
            onUpdateGameData={handleUpdateGameData}
            onBack={() => setCurrentScreen('start')}
          />
        );
      
      case 'class-selection':
        if (!player) return null;
        return (
          <ClassSelection
            player={player}
            gameData={gameData}
            onSelectClass={handleSelectClass}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );
      
      case 'inventory':
        if (!player) return null;
        return (
          <InventoryScreen
            player={player}
            onUseItem={handleUseItem}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );
      
      case 'equipment':
        if (!player) return null;
        return (
          <EquipmentScreen
            player={player}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );
      
      case 'shop':
        if (!player || !currentShop || !gameData.shops[currentShop]) return null;
        return (
          <ShopScreen
            player={player}
            shop={gameData.shops[currentShop]}
            onBuyItem={handleBuyItem}
            onSellItem={handleSellItem}
            onBack={() => setCurrentScreen('gameplay')}
          />
        );
      
      case 'gameplay':
        const currentNode = getCurrentStoryNode();
        if (!player || !currentNode) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
              <p className="text-white text-xl">Loading adventure...</p>
            </div>
          );
        }
        return (
          <GameplayScreen
            player={player}
            currentNode={currentNode}
            onMakeChoice={handleMakeChoice}
            onBack={() => setCurrentScreen('story-selection')}
            onOpenInventory={() => setCurrentScreen('inventory')}
            onOpenEquipment={() => setCurrentScreen('equipment')}
            onOpenShop={handleOpenShop}
          />
        );
      
      case 'level-up':
        if (!player) return null;
        return (
          <LevelUpScreen
            player={player}
            onApplyLevelUp={handleApplyLevelUp}
          />
        );
      
      default:
        return <StartScreen onSelectOption={handleStartScreenOption} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentScreen()}
    </div>
  );
}

export default App;
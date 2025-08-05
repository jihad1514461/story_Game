import React, { useState } from 'react';
import { Player, StoryNode, Choice } from '../types/game';
import { Dice6, Heart, ArrowLeft } from 'lucide-react';
import { canMakeChoice, rollDice, replaceVariables } from '../utils/gameLogic';

interface GameplayScreenProps {
  player: Player;
  currentNode: StoryNode;
  onMakeChoice: (choice: Choice) => void;
  onBack: () => void;
  onOpenInventory: () => void;
  onOpenEquipment: () => void;
  onOpenShop: (shopId: string) => void;
}

export const GameplayScreen: React.FC<GameplayScreenProps> = ({ 
  player, 
  currentNode, 
  onMakeChoice, 
  onBack,
  onOpenInventory,
  onOpenEquipment,
  onOpenShop
}) => {
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showDiceOption, setShowDiceOption] = useState(false);

  const handleDiceRoll = async () => {
    setIsRolling(true);
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceRoll(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const hasLuckAdvantage = currentNode.dice_requirement ? 
          player.stats.luck >= currentNode.dice_requirement : false;
        const finalRoll = rollDice(hasLuckAdvantage);
        setDiceRoll(finalRoll);
        setIsRolling(false);
      }
    }, 100);
  };

  const handleSkipDice = () => {
    setShowDiceOption(false);
    setDiceRoll(0); // Set to 0 to indicate dice was skipped
  };

  const handleChoiceClick = (choice: Choice) => {
    // Check for shop interactions
    if (choice.next_node === 'shop_interface') {
      onOpenShop('town_general');
      return;
    }
    
    onMakeChoice(choice);
    setDiceRoll(null);
    setShowDiceOption(false);
  };

  const getVisibleChoices = () => {
    return currentNode.choices.filter(choice => 
      canMakeChoice(choice, player, diceRoll === null ? undefined : diceRoll)
    );
  };

  // Show dice option when entering a battle node
  React.useEffect(() => {
    if (currentNode.battle && diceRoll === null) {
      setShowDiceOption(true);
    }
  }, [currentNode.battle]);

  const storyText = replaceVariables(currentNode.text, player);
  const visibleChoices = getVisibleChoices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Story Selection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Story Content */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {storyText}
                </p>
              </div>

              {/* Battle Section */}
              {currentNode.battle && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                    <span className="mr-2">⚔</span>
                    Battle Encounter!
                  </h3>
                  
                  {showDiceOption && diceRoll === null ? (
                    <div className="text-center">
                      <p className="text-gray-300 mb-4">
                        Face this challenge! You can roll the dice for better options, or proceed without rolling.
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={handleDiceRoll}
                          disabled={isRolling}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg inline-flex items-center space-x-2"
                        >
                          <Dice6 className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
                          <span>{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
                        </button>
                        <button
                          onClick={handleSkipDice}
                          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Skip Dice Roll
                        </button>
                      </div>
                    </div>
                  ) : diceRoll !== null && diceRoll > 0 ? (
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 mb-4">
                        <Dice6 className="w-8 h-8 text-yellow-400" />
                        <span className="text-2xl font-bold text-white">You rolled: {diceRoll}</span>
                      </div>
                      <p className="text-gray-300">
                        {player.stats.luck >= (currentNode.dice_requirement || 0) && 
                          "Your luck gives you an advantage in this battle!"}
                      </p>
                    </div>
                  ) : diceRoll === 0 ? (
                    <div className="text-center">
                      <p className="text-gray-300">
                        You chose to proceed without rolling the dice. Some options may be limited.
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Choices */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white mb-4">What do you do?</h3>
                
                {visibleChoices.length > 0 ? (
                  visibleChoices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoiceClick(choice)}
                      className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600 hover:border-slate-500 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                      <span className="text-white font-medium">{choice.text}</span>
                      {choice.require && (
                        <div className="mt-2 text-sm text-yellow-400">
                          Requirements: {Object.entries(choice.require).map(([stat, value]) => 
                            `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value}`
                          ).join(', ')}
                        </div>
                      )}
                      {choice.itemRequirements && (
                        <div className="mt-1 text-sm text-orange-400">
                          Items Required: {choice.itemRequirements.join(', ')}
                        </div>
                      )}
                      {choice.dice_requirement && (
                        <div className="mt-1 text-sm text-orange-400">
                          Dice Roll Required: {choice.dice_requirement}+
                        </div>
                      )}
                      {choice.hidden_unless_luck && (
                        <div className="mt-1 text-sm text-purple-400">
                          🍀 Lucky Option (Luck {choice.hidden_unless_luck}+ required)
                        </div>
                      )}
                      {choice.effects && (
                        <div className="mt-2 text-sm text-green-400">
                          Effects: {Object.entries(choice.effects).map(([stat, value]) => 
                            `${stat.charAt(0).toUpperCase() + stat.slice(1)} ${value > 0 ? '+' : ''}${value}`
                          ).join(', ')}
                        </div>
                      )}
                      {choice.itemRewards && (
                        <div className="mt-1 text-sm text-blue-400">
                          Item Rewards: {choice.itemRewards.join(', ')}
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    {showDiceOption && diceRoll === null 
                      ? "Choose whether to roll the dice or proceed without rolling..."
                      : "No actions available. Your journey may have reached an impasse."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Player Stats Panel */}
          <div className="space-y-6">
            {/* Character Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Character</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Race:</span>
                  <span className="text-white">{player.race}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Class:</span>
                  <span className="text-white">{player.classes.map(c => c.name).join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Level:</span>
                  <span className="text-white font-bold">{player.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP:</span>
                  <span className="text-white">{player.xp} / {player.level * 100}</span>
                </div>
              </div>
              {player.xp >= player.level * 100 && (
                <div className="mt-2 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-400 text-sm font-medium">Ready to Level Up!</p>
                </div>
              )}
            </div>

            {/* Health */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Heart className="w-5 h-5 text-red-400 mr-2" />
                Health
              </h3>
              <div className="flex items-center space-x-2">
                {Array.from({ length: player.maxHearts }, (_, i) => (
                  <Heart
                    key={i}
                    className={`w-6 h-6 ${
                      i < player.hearts ? 'text-red-500 fill-red-500' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {player.hearts} / {player.maxHearts} hearts
              </p>
            </div>

            {/* Inventory Button */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <div className="space-y-3">
              <button
                onClick={onOpenInventory}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>📦</span>
                <span>Inventory ({player.inventory.length})</span>
              </button>
              <button
                onClick={onOpenEquipment}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>⚔️</span>
                <span>Equipment</span>
              </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-red-400 flex items-center">
                    <span className="mr-2">⚔</span>
                    Strength
                  </span>
                  <span className="text-white font-bold">{player.stats.strength}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-400 flex items-center">
                    <span className="mr-2">✨</span>
                    Magic
                  </span>
                  <span className="text-white font-bold">{player.stats.magic}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400 flex items-center">
                    <span className="mr-2">❤</span>
                    Vitality
                  </span>
                  <span className="text-white font-bold">{player.stats.vitality}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 flex items-center">
                    <span className="mr-2">🍀</span>
                    Luck
                  </span>
                  <span className="text-white font-bold">{player.stats.luck}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 flex items-center">
                    <span className="mr-2">👑</span>
                    Reputation
                  </span>
                  <span className="text-white font-bold">{player.stats.reputation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600 flex items-center">
                    <span className="mr-2">💰</span>
                    Money
                  </span>
                  <span className="text-white font-bold">{player.stats.money}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
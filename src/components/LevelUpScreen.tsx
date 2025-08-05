import React, { useState } from 'react';
import { Player, PlayerStats } from '../types/game';
import { TrendingUp, Plus, Minus } from 'lucide-react';

interface LevelUpScreenProps {
  player: Player;
  onApplyLevelUp: (statIncreases: { [key in keyof PlayerStats]?: number }) => void;
}

export const LevelUpScreen: React.FC<LevelUpScreenProps> = ({ player, onApplyLevelUp }) => {
  const [statIncreases, setStatIncreases] = useState<{ [key in keyof PlayerStats]?: number }>({});
  
  const availablePoints = 2; // Player gets 2 stat points per level
  const usedPoints = Object.values(statIncreases).reduce((sum, val) => sum + (val || 0), 0);
  const remainingPoints = availablePoints - usedPoints;

  const handleStatChange = (stat: keyof PlayerStats, change: number) => {
    const currentIncrease = statIncreases[stat] || 0;
    const newIncrease = Math.max(0, currentIncrease + change);
    
    if (change > 0 && remainingPoints <= 0) return;
    
    setStatIncreases(prev => ({
      ...prev,
      [stat]: newIncrease === 0 ? undefined : newIncrease
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(statIncreases).length > 0) {
      onApplyLevelUp(statIncreases);
    }
  };

  const getStatColor = (stat: keyof PlayerStats) => {
    const colors = {
      strength: 'text-red-400',
      magic: 'text-purple-400',
      vitality: 'text-green-400',
      luck: 'text-yellow-400',
      reputation: 'text-blue-400',
      money: 'text-yellow-600'
    };
    return colors[stat];
  };

  const getStatIcon = (stat: keyof PlayerStats) => {
    const icons = {
      strength: '⚔',
      magic: '✨',
      vitality: '❤',
      luck: '🍀',
      reputation: '👑',
      money: '💰'
    };
    return icons[stat];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Level Up!</h2>
            <p className="text-gray-400">
              Congratulations! You've reached level {player.level + 1}
            </p>
            <p className="text-yellow-400 font-semibold mt-2">
              You have {remainingPoints} stat points to distribute
            </p>
          </div>

          <div className="space-y-6">
            {(Object.keys(player.stats) as Array<keyof PlayerStats>).map((stat) => {
              const currentValue = player.stats[stat];
              const increase = statIncreases[stat] || 0;
              const newValue = currentValue + increase;

              return (
                <div
                  key={stat}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl border border-slate-600"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl ${getStatColor(stat)}`}>
                      {getStatIcon(stat)}
                    </span>
                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {stat}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {currentValue} → {newValue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleStatChange(stat, -1)}
                      disabled={!statIncreases[stat]}
                      className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-white font-bold min-w-[2rem] text-center">
                      +{increase}
                    </span>

                    <button
                      onClick={() => handleStatChange(stat, 1)}
                      disabled={remainingPoints <= 0}
                      className="w-8 h-8 rounded-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleSubmit}
              disabled={remainingPoints > 0}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {remainingPoints > 0 
                ? `Distribute ${remainingPoints} more point${remainingPoints === 1 ? '' : 's'}`
                : 'Confirm Level Up'
              }
            </button>
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            <p>Choose wisely - these improvements are permanent!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
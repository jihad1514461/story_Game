import React, { useState } from 'react';
import { User, Crown, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { GameData } from '../types/game';

interface PlayerCreationProps {
  gameData: GameData;
  onCreatePlayer: (name: string, gender: 'male' | 'female' | 'other', race: string, playerClass: string) => void;
  onBack: () => void;
}

export const PlayerCreation: React.FC<PlayerCreationProps> = ({ gameData, onCreatePlayer, onBack }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [race, setRace] = useState('');
  const [playerClass, setPlayerClass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && race && playerClass) {
      onCreatePlayer(name, gender, race, playerClass);
    }
  };

  const getStatPreview = () => {
    if (!race || !playerClass) return null;
    
    const raceStats = gameData.races[race] || {};
    const classStats = gameData.classes[playerClass] || {};
    
    const baseStats = { strength: 1, magic: 1, vitality: 1, luck: 1, reputation: 1, money: 20 };
    const finalStats = { ...baseStats };
    
    Object.keys(raceStats).forEach(key => {
      if (key in finalStats) {
        finalStats[key as keyof typeof finalStats] += raceStats[key as keyof typeof raceStats] || 0;
      }
    });
    Object.keys(classStats).forEach(key => {
      if (key in finalStats) {
        finalStats[key as keyof typeof finalStats] += classStats[key as keyof typeof classStats] || 0;
      }
    });

    return finalStats;
  };

  const getAvailableClasses = () => {
    if (!race) return Object.keys(gameData.classes);
    
    const raceStats = gameData.races[race] || {};
    const baseStats = { strength: 1, magic: 1, vitality: 1, luck: 1, reputation: 1, money: 20 };
    const playerStats = { ...baseStats };
    
    Object.keys(raceStats).forEach(key => {
      if (key in playerStats) {
        playerStats[key as keyof typeof playerStats] += raceStats[key as keyof typeof raceStats] || 0;
      }
    });
    
    return Object.keys(gameData.classes).filter(className => {
      const classRequirement = gameData.classRequirements?.[className];
      if (!classRequirement) return true;
      
      // Check if player meets stat requirements
      for (const [stat, required] of Object.entries(classRequirement.requiredStats)) {
        if (playerStats[stat as keyof typeof playerStats] < required) {
          return false;
        }
      }
      
      return true;
    });
  };
  const statPreview = getStatPreview();
  const availableClasses = getAvailableClasses();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <button
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <User className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Create Your Hero</h2>
            <p className="text-gray-400">Forge your legend in the world of adventure</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hero Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your hero's name"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Race */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Crown className="w-4 h-4 inline mr-1" />
                Race
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(gameData.races).map(([raceName, raceStats]) => (
                  <div
                    key={raceName}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      race === raceName
                        ? 'border-blue-500 bg-blue-500/20 shadow-lg'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                    onClick={() => setRace(raceName)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-bold">{raceName}</h3>
                      {race === raceName && <CheckCircle className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(raceStats).map(([stat, value]) => (
                        <div key={stat} className="text-gray-300">
                          <span className="capitalize">{stat}:</span> +{value}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Class
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(gameData.classes).map(([className, classStats]) => {
                  const isAvailable = availableClasses.includes(className);
                  const requirement = gameData.classRequirements?.[className];
                  
                  return (
                    <div
                      key={className}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        !isAvailable
                          ? 'border-red-500/50 bg-red-500/10 opacity-50 cursor-not-allowed'
                          : playerClass === className
                          ? 'border-purple-500 bg-purple-500/20 shadow-lg'
                          : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                      }`}
                      onClick={() => isAvailable && setPlayerClass(className)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold">{className}</h3>
                        {playerClass === className && <CheckCircle className="w-5 h-5 text-purple-400" />}
                        {!isAvailable && <span className="text-red-400 text-xs">Locked</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        {Object.entries(classStats).map(([stat, value]) => (
                          <div key={stat} className="text-gray-300">
                            <span className="capitalize">{stat}:</span> +{value}
                          </div>
                        ))}
                      </div>
                      {requirement && !isAvailable && (
                        <div className="text-red-400 text-xs">
                          Requires: {Object.entries(requirement.requiredStats).map(([stat, req]) => 
                            `${stat} ${req}`
                          ).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stat Preview */}
            {statPreview && (
              <>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Starting Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-300">
                      <span className="text-red-400">⚔</span> Strength: {statPreview.strength}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-purple-400">✨</span> Magic: {statPreview.magic}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-green-400">❤</span> Vitality: {statPreview.vitality}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-yellow-400">🍀</span> Luck: {statPreview.luck}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-blue-400">👑</span> Reputation: {statPreview.reputation}
                    </div>
                    <div className="text-gray-300">
                      <span className="text-yellow-600">💰</span> Money: {statPreview.money}
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 text-sm font-medium">Multi-Class System:</p>
                  <p className="text-gray-300 text-xs mt-1">
                    Unlock additional classes at level 5 and 10 based on your stats!
                  </p>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!name || !race || !playerClass}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              Begin Your Adventure
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
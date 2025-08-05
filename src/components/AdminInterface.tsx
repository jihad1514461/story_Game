import React, { useState } from 'react';
import { Settings, ArrowLeft, Sword, Crown, BookOpen, Package } from 'lucide-react';
import { GameData } from '../types/game';
import { AdminClasses } from './AdminClasses';
import { AdminRaces } from './AdminRaces';
import { AdminItems } from './AdminItems';
import { AdminStories } from './AdminStories';

interface AdminInterfaceProps {
  gameData: GameData;
  onUpdateGameData: (newData: GameData) => void;
  onBack: () => void;
}

type AdminTab = 'classes' | 'races' | 'items' | 'stories';

export const AdminInterface: React.FC<AdminInterfaceProps> = ({ gameData, onUpdateGameData, onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('classes');

  const handleUpdateClasses = (classes: { [key: string]: any }) => {
    onUpdateGameData({ ...gameData, classes });
  };

  const handleUpdateRaces = (races: { [key: string]: any }) => {
    onUpdateGameData({ ...gameData, races });
  };

  const handleUpdateItems = (items: { [key: string]: any }) => {
    onUpdateGameData({ ...gameData, items });
  };

  const handleUpdateStories = (stories: { [storyName: string]: any }) => {
    onUpdateGameData({ ...gameData, stories });
  };

  const tabs = [
    { id: 'classes' as AdminTab, label: 'Classes', icon: Sword, color: 'text-red-400' },
    { id: 'races' as AdminTab, label: 'Races', icon: Crown, color: 'text-purple-400' },
    { id: 'items' as AdminTab, label: 'Items', icon: Package, color: 'text-blue-400' },
    { id: 'stories' as AdminTab, label: 'Stories', icon: BookOpen, color: 'text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Main Menu</span>
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="text-center p-8 border-b border-slate-700">
            <Settings className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Game Master Control Panel</h2>
            <p className="text-gray-400">Manage all aspects of your RPG world</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-slate-700/50 border-b-2 border-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'classes' && (
              <AdminClasses
                classes={gameData.classes}
                onUpdateClasses={handleUpdateClasses}
              />
            )}
            {activeTab === 'races' && (
              <AdminRaces
                races={gameData.races}
                onUpdateRaces={handleUpdateRaces}
              />
            )}
            {activeTab === 'items' && (
              <AdminItems
                items={gameData.items}
                onUpdateItems={handleUpdateItems}
              />
            )}
            {activeTab === 'stories' && (
              <AdminStories
                stories={gameData.stories}
                onUpdateStories={handleUpdateStories}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
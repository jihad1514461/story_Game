import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Play } from 'lucide-react';
import { GameData } from '../types/game';

interface StorySelectionProps {
  gameData: GameData;
  onSelectStory: (storyName: string) => void;
  onBack: () => void;
}

export const StorySelection: React.FC<StorySelectionProps> = ({ gameData, onSelectStory, onBack }) => {
  const [selectedStory, setSelectedStory] = useState('');

  const handleStart = () => {
    if (selectedStory) {
      onSelectStory(selectedStory);
    }
  };

  const storyNames = Object.keys(gameData.stories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <button
          onClick={onBack}
          className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Character Creation</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <BookOpen className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Choose Your Adventure</h2>
            <p className="text-gray-400">Select a story to begin your heroic journey</p>
          </div>

          <div className="space-y-4 mb-8">
            {storyNames.map((storyName) => (
              <div
                key={storyName}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedStory === storyName
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-slate-600 bg-slate-700/50 hover:border-slate-500 hover:bg-slate-700/70'
                }`}
                onClick={() => setSelectedStory(storyName)}
              >
                <h3 className="text-xl font-semibold text-white mb-2">{storyName}</h3>
                <p className="text-gray-400 text-sm">
                  {storyName === "The Cursed Forest" && "A dark forest holds ancient secrets and terrible dangers. Can you uncover the truth and break the curse?"}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedStory}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <Play className="w-5 h-5" />
              <span>Start Adventure</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
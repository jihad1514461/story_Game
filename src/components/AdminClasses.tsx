import React, { useState } from 'react';
import { Sword, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { PlayerStats } from '../types/game';

interface AdminClassesProps {
  classes: { [key: string]: Partial<PlayerStats> };
  onUpdateClasses: (classes: { [key: string]: Partial<PlayerStats> }) => void;
}

export const AdminClasses: React.FC<AdminClassesProps> = ({ classes, onUpdateClasses }) => {
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [classStats, setClassStats] = useState<Partial<PlayerStats>>({});
  const [isCreating, setIsCreating] = useState(false);

  const handleEdit = (className: string) => {
    setEditingClass(className);
    setNewClassName(className);
    setClassStats(classes[className]);
  };

  const handleSave = () => {
    if (!newClassName.trim()) return;
    
    const updatedClasses = { ...classes };
    
    if (editingClass && editingClass !== newClassName) {
      delete updatedClasses[editingClass];
    }
    
    updatedClasses[newClassName] = classStats;
    onUpdateClasses(updatedClasses);
    
    setEditingClass(null);
    setIsCreating(false);
    setNewClassName('');
    setClassStats({});
  };

  const handleDelete = (className: string) => {
    if (confirm(`Are you sure you want to delete the ${className} class?`)) {
      const updatedClasses = { ...classes };
      delete updatedClasses[className];
      onUpdateClasses(updatedClasses);
    }
  };

  const handleCancel = () => {
    setEditingClass(null);
    setIsCreating(false);
    setNewClassName('');
    setClassStats({});
  };

  const handleStatChange = (stat: keyof PlayerStats, value: string) => {
    const numValue = parseInt(value) || 0;
    setClassStats(prev => ({ ...prev, [stat]: numValue }));
  };

  const startCreating = () => {
    setIsCreating(true);
    setNewClassName('');
    setClassStats({
      strength: 0,
      magic: 0,
      vitality: 0,
      luck: 0,
      reputation: 0,
      money: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Sword className="w-8 h-8 text-red-400 mr-3" />
          Character Classes
        </h3>
        <button
          onClick={startCreating}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Class</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingClass) && (
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            {isCreating ? 'Create New Class' : `Edit ${editingClass}`}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Class Name
              </label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter class name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {(['strength', 'magic', 'vitality', 'luck', 'reputation', 'money'] as const).map((stat) => (
              <div key={stat}>
                <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                  {stat}
                </label>
                <input
                  type="number"
                  value={classStats[stat] || 0}
                  onChange={(e) => handleStatChange(stat, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Classes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(classes).map(([className, stats]) => (
          <div key={className} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">{className}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(className)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(className)}
                  className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-red-400">⚔ Strength:</span>
                <span className="text-white font-medium">{stats.strength || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">✨ Magic:</span>
                <span className="text-white font-medium">{stats.magic || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400">❤ Vitality:</span>
                <span className="text-white font-medium">{stats.vitality || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-400">🍀 Luck:</span>
                <span className="text-white font-medium">{stats.luck || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">👑 Reputation:</span>
                <span className="text-white font-medium">{stats.reputation || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">💰 Money:</span>
                <span className="text-white font-medium">{stats.money || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
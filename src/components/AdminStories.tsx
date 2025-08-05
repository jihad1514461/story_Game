import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Save, X, Eye, EyeOff, Home, AlertTriangle } from 'lucide-react';
import { Story, StoryNode, Choice } from '../types/game';

interface AdminStoriesProps {
  stories: { [storyName: string]: Story };
  onUpdateStories: (stories: { [storyName: string]: Story }) => void;
}

export const AdminStories: React.FC<AdminStoriesProps> = ({ stories, onUpdateStories }) => {
  const [selectedStory, setSelectedStory] = useState<string>('');
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [newStoryName, setNewStoryName] = useState('');
  const [showStoryTree, setShowStoryTree] = useState(false);
  const [nodeData, setNodeData] = useState<StoryNode>({
    text: '',
    battle: false,
    choices: [],
    is_ending: false
  });
  const [showNodeDetails, setShowNodeDetails] = useState<{ [key: string]: boolean }>({});

  const handleCreateStory = () => {
    if (!newStoryName.trim()) return;
    
    const updatedStories = {
      ...stories,
      [newStoryName]: {
        intro: {
          text: `Welcome to ${newStoryName}. Your adventure begins here.`,
          battle: false,
          choices: []
        }
      }
    };
    
    onUpdateStories(updatedStories);
    setSelectedStory(newStoryName);
    setIsCreatingStory(false);
    setNewStoryName('');
  };

  const handleDeleteStory = (storyName: string) => {
    if (confirm(`Are you sure you want to delete "${storyName}"?`)) {
      const updatedStories = { ...stories };
      delete updatedStories[storyName];
      onUpdateStories(updatedStories);
      if (selectedStory === storyName) {
        setSelectedStory('');
      }
    }
  };

  const handleSaveNode = () => {
    if (!selectedStory || !editingNode) return;
    
    const updatedStories = { ...stories };
    updatedStories[selectedStory][editingNode] = nodeData;
    onUpdateStories(updatedStories);
    
    setEditingNode(null);
    setIsCreatingNode(false);
    setNodeData({
      text: '',
      battle: false,
      choices: [],
      is_ending: false
    });
  };

  const handleDeleteNode = (nodeKey: string) => {
    if (!selectedStory) return;
    if (confirm(`Are you sure you want to delete node "${nodeKey}"?`)) {
      const updatedStories = { ...stories };
      delete updatedStories[selectedStory][nodeKey];
      onUpdateStories(updatedStories);
    }
  };

  const handleEditNode = (nodeKey: string) => {
    if (!selectedStory) return;
    setEditingNode(nodeKey);
    setNodeData({ ...stories[selectedStory][nodeKey] });
  };

  const handleCreateNode = () => {
    setIsCreatingNode(true);
    setEditingNode('new_node');
    setNodeData({
      text: '',
      battle: false,
      choices: [],
      is_ending: false
    });
  };

  const addChoice = () => {
    setNodeData(prev => ({
      ...prev,
      choices: [
        ...prev.choices,
        {
          text: '',
          next_node: '',
          effects: {},
          require: {}
        }
      ]
    }));
  };

  const updateChoice = (index: number, field: keyof Choice, value: any) => {
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === index ? { ...choice, [field]: value } : choice
      )
    }));
  };

  const removeChoice = (index: number) => {
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index)
    }));
  };

  const updateChoiceEffect = (choiceIndex: number, stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          effects: {
            ...choice.effects,
            [stat]: numValue === 0 ? undefined : numValue
          }
        } : choice
      )
    }));
  };

  const updateChoiceRequirement = (choiceIndex: number, stat: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          require: {
            ...choice.require,
            [stat]: numValue === 0 ? undefined : numValue
          }
        } : choice
      )
    }));
  };

  const updateChoiceRewards = (choiceIndex: number, rewards: string) => {
    const rewardArray = rewards.split(',').map(r => r.trim()).filter(r => r);
    setNodeData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => 
        i === choiceIndex ? {
          ...choice,
          itemRewards: rewardArray.length > 0 ? rewardArray : undefined
        } : choice
      )
    }));
  };

  const getAvailableNodes = () => {
    if (!selectedStory) return [];
    return Object.keys(stories[selectedStory]);
  };

  const getOrphanNodes = () => {
    if (!selectedStory) return [];
    const story = stories[selectedStory];
    const referencedNodes = new Set<string>();
    
    Object.values(story).forEach(node => {
      node.choices.forEach(choice => {
        if (choice.next_node) {
          referencedNodes.add(choice.next_node);
        }
      });
    });
    
    return Object.keys(story).filter(nodeKey => 
      nodeKey !== 'intro' && 
      !referencedNodes.has(nodeKey) && 
      !story[nodeKey].is_ending
    );
  };

  const renderStoryTree = () => {
    if (!selectedStory) return null;
    const story = stories[selectedStory];
    const orphanNodes = getOrphanNodes();
    
    return (
      <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
        <h4 className="text-lg font-semibold text-white mb-4">Story Flow Tree</h4>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(story).map(([nodeKey, node]) => (
            <div key={nodeKey} className={`p-3 rounded-lg border ${
              orphanNodes.includes(nodeKey) 
                ? 'border-red-500 bg-red-500/20' 
                : 'border-slate-600 bg-slate-800/50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{nodeKey}</span>
                <div className="flex space-x-1">
                  {node.battle && <span className="text-red-400 text-xs">⚔</span>}
                  {node.is_ending && <span className="text-yellow-400 text-xs">🏁</span>}
                  {orphanNodes.includes(nodeKey) && <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Leads to: {node.choices.map(c => c.next_node).filter(Boolean).join(', ') || 'None'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const toggleNodeDetails = (nodeKey: string) => {
    setShowNodeDetails(prev => ({
      ...prev,
      [nodeKey]: !prev[nodeKey]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <h3 className="text-2xl font-bold text-white flex items-center">
          <BookOpen className="w-8 h-8 text-green-400 mr-3" />
          Story Management
        </h3>
        <button
          onClick={() => setIsCreatingStory(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Story</span>
        </button>
      </div>

      {/* Create Story Modal */}
      {isCreatingStory && (
        <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
          <h4 className="text-lg font-semibold text-white mb-4">Create New Story</h4>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newStoryName}
              onChange={(e) => setNewStoryName(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter story name"
            />
            <button
              onClick={handleCreateStory}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreatingStory(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Story Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(stories).map((storyName) => (
          <div
            key={storyName}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedStory === storyName
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
            }`}
            onClick={() => setSelectedStory(storyName)}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-white font-semibold">{storyName}</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStory(storyName);
                }}
                className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              {Object.keys(stories[storyName]).length} nodes
            </p>
          </div>
        ))}
      </div>

      {/* Node Management */}
      {selectedStory && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-white">
              Nodes in "{selectedStory}"
            </h4>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStoryTree(!showStoryTree)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showStoryTree ? 'Hide' : 'Show'} Tree</span>
              </button>
              <button
                onClick={handleCreateNode}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Node</span>
              </button>
            </div>
          </div>

          {/* Story Tree */}
          {showStoryTree && renderStoryTree()}

          {/* Node List */}
          <div className="space-y-3">
            {Object.entries(stories[selectedStory]).map(([nodeKey, node]) => {
              const orphanNodes = getOrphanNodes();
              const isOrphan = orphanNodes.includes(nodeKey);
              
              return (
              <div key={nodeKey} className={`rounded-xl p-4 border ${
                isOrphan 
                  ? 'bg-red-500/10 border-red-500/50' 
                  : 'bg-slate-800/50 border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h5 className="text-white font-medium">{nodeKey}</h5>
                    {node.battle && <span className="text-red-400 text-sm">⚔ Battle</span>}
                    {node.is_ending && <span className="text-yellow-400 text-sm">🏁 Ending</span>}
                    {isOrphan && (
                      <div className="flex items-center space-x-1 text-red-400 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Orphaned</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleNodeDetails(nodeKey)}
                      className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {showNodeDetails[nodeKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEditNode(nodeKey)}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNode(nodeKey)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Effects */}
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-2">Effects</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(['xp', 'hearts', 'strength', 'magic', 'vitality', 'luck', 'reputation', 'money'] as const).map((stat) => (
                      <div key={stat}>
                        <label className="block text-xs text-gray-400 mb-1 capitalize">{stat}</label>
                        <input
                          type="number"
                          value={choice.effects?.[stat] || 0}
                          onChange={(e) => updateChoiceEffect(index, stat, e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-2">Requirements</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(['strength', 'magic', 'vitality', 'luck', 'reputation', 'money'] as const).map((stat) => (
                      <div key={stat}>
                        <label className="block text-xs text-gray-400 mb-1 capitalize">{stat}</label>
                        <input
                          type="number"
                          value={choice.require?.[stat] || 0}
                          onChange={(e) => updateChoiceRequirement(index, stat, e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Item Rewards */}
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">Item Rewards (comma-separated)</label>
                  <input
                    type="text"
                    value={choice.itemRewards?.join(', ') || ''}
                    onChange={(e) => updateChoiceRewards(index, e.target.value)}
                    className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="item_id_1, item_id_2"
                  />
                </div>
                
                {showNodeDetails[nodeKey] && (
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-gray-300">{node.text.substring(0, 150)}...</p>
                    <p className="text-gray-400">{node.choices.length} choices available</p>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Node Editor */}
      {editingNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h4 className="text-xl font-semibold text-white mb-4">
              {isCreatingNode ? 'Create New Node' : `Edit Node: ${editingNode}`}
            </h4>

            <div className="space-y-4">
              {/* Node Key */}
              {isCreatingNode && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Node Key
                  </label>
                  <input
                    type="text"
                    value={editingNode === 'new_node' ? '' : editingNode}
                    onChange={(e) => setEditingNode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter unique node key"
                  />
                </div>
              )}

              {/* Node Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Story Text
                </label>
                <select
                  onChange={(e) => setNodeData(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full h-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                >
                  <option value="">Select next node</option>
                  {getAvailableNodes().map(nodeKey => (
                    <option key={nodeKey} value={nodeKey}>{nodeKey}</option>
                  ))}
                </select>
              </div>

              {/* Node Options */}
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={nodeData.battle}
                    onChange={(e) => setNodeData(prev => ({ ...prev, battle: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-gray-300">Battle Node</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={nodeData.is_ending}
                    onChange={(e) => setNodeData(prev => ({ ...prev, is_ending: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-gray-300">Ending Node</span>
                </label>
              </div>

              {/* Dice Requirement */}
              {nodeData.battle && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dice Requirement (optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={nodeData.dice_requirement || ''}
                    onChange={(e) => setNodeData(prev => ({ 
                      ...prev, 
                      dice_requirement: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    className="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Choices */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">Choices</label>
                  <button
                    onClick={addChoice}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200"
                  >
                    Add Choice
                  </button>
                </div>

                <div className="space-y-4">
                  {nodeData.choices.map((choice, index) => (
                    <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">Choice {index + 1}</span>
                        <button
                          onClick={() => removeChoice(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Choice Text</label>
                          <input
                            type="text"
                            value={choice.text}
                            onChange={(e) => updateChoice(index, 'text', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter choice text"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Next Node</label>
                          <input
                            type="text"
                            value={choice.next_node}
                            onChange={(e) => updateChoice(index, 'next_node', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter next node key"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Dice Req.</label>
                          <input
                            type="number"
                            min="1"
                            max="6"
                            value={choice.dice_requirement || ''}
                            onChange={(e) => updateChoice(index, 'dice_requirement', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Luck Req.</label>
                          <input
                            type="number"
                            min="1"
                            value={choice.luck_requirement || ''}
                            onChange={(e) => updateChoice(index, 'luck_requirement', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Hidden Unless Luck</label>
                          <input
                            type="number"
                            min="1"
                            value={choice.hidden_unless_luck || ''}
                            onChange={(e) => updateChoice(index, 'hidden_unless_luck', e.target.value ? parseInt(e.target.value) : undefined)}
                            className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveNode}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Node</span>
                </button>
                <button
                  onClick={() => {
                    setEditingNode(null);
                    setIsCreatingNode(false);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
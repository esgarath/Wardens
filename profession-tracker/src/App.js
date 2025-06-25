import React, { useState } from 'react';
import { Users, Plus, Edit3, Eye, Save, X } from 'lucide-react';

const ProfessionTracker = () => {
  const professions = [
    'Carpentry', 'Forestry', 'Mining', 'Farming', 'Hunting', 
    'Scholar', 'Fishing', 'Leatherworking', 'Smithing', 
    'Foraging', 'Masonry', 'Tailoring'
  ];

  const getTierInfo = (tier) => {
    if (!tier || tier === 0) return { tier: 0, color: 'bg-gray-400', name: 'No Tier' };
    if (tier === 1) return { tier: 1, color: 'bg-gray-500', name: 'T1' };
    if (tier === 2) return { tier: 2, color: 'bg-green-600', name: 'T2' };
    if (tier === 3) return { tier: 3, color: 'bg-blue-600', name: 'T3' };
    if (tier === 4) return { tier: 4, color: 'bg-purple-600', name: 'T4' };
    if (tier === 5) return { tier: 5, color: 'bg-yellow-600', name: 'T5' };
    if (tier === 6) return { tier: 6, color: 'bg-orange-600', name: 'T6' };
    if (tier === 7) return { tier: 7, color: 'bg-red-600', name: 'T7' };
    if (tier === 8) return { tier: 8, color: 'bg-pink-600', name: 'T8' };
    if (tier === 9) return { tier: 9, color: 'bg-black', name: 'T9' };
    return { tier: 0, color: 'bg-gray-400', name: 'No Tier' };
  };

  const [players, setPlayers] = useState([
    { 
      id: 1, 
      name: 'Alice', 
      online: true,
      tiers: {
        'Carpentry': 4, 'Mining': 1, 'Scholar': 0, 'Smithing': 2, 'Farming': 6,
        'Hunting': 1, 'Fishing': 3, 'Leatherworking': 0, 'Foraging': 1, 'Masonry': 0, 'Tailoring': 2, 'Forestry': 0
      }
    },
    { 
      id: 2, 
      name: 'Bob', 
      online: false,
      tiers: {
        'Carpentry': 1, 'Mining': 7, 'Scholar': 4, 'Smithing': 6, 'Farming': 2,
        'Hunting': 3, 'Fishing': 1, 'Leatherworking': 5, 'Foraging': 0, 'Masonry': 7, 'Tailoring': 0, 'Forestry': 4
      }
    },
    { 
      id: 3, 
      name: 'Charlie', 
      online: true,
      tiers: {
        'Carpentry': 0, 'Mining': 3, 'Scholar': 8, 'Smithing': 1, 'Farming': 4,
        'Hunting': 6, 'Fishing': 2, 'Leatherworking': 1, 'Foraging': 5, 'Masonry': 0, 'Tailoring': 7, 'Forestry': 9
      }
    }
  ]);

  const [currentView, setCurrentView] = useState('master');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [tempTiers, setTempTiers] = useState({});
  const [newPlayerName, setNewPlayerName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleOnlineStatus = (id) => {
    setPlayers(players.map(player => 
      player.id === id ? { ...player, online: !player.online } : player
    ));
  };

  const addNewPlayer = () => {
    if (newPlayerName.trim()) {
      const emptyTiers = {};
      professions.forEach(prof => emptyTiers[prof] = 0);
      
      setPlayers([...players, {
        id: Date.now(),
        name: newPlayerName.trim(),
        online: false,
        tiers: emptyTiers
      }]);
      setNewPlayerName('');
    }
  };

  const startEditing = (player) => {
    setEditingPlayer(player.id);
    setTempTiers({...player.tiers});
  };

  const saveEditing = () => {
    setPlayers(players.map(player => 
      player.id === editingPlayer ? { ...player, tiers: tempTiers } : player
    ));
    setEditingPlayer(null);
    setTempTiers({});
  };

  const cancelEditing = () => {
    setEditingPlayer(null);
    setTempTiers({});
  };

  const updateTempTier = (profession, value) => {
    const tier = Math.max(0, Math.min(9, parseInt(value) || 0));
    setTempTiers({...tempTiers, [profession]: tier});
  };

  const getFilteredPlayers = () => {
    let filtered = players;
    
    if (currentView === 'master' && searchTerm) {
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showOnlineOnly) {
      filtered = filtered.filter(player => player.online);
    }
    
    if (currentView === 'profession' && selectedProfession) {
      return filtered.sort((a, b) => {
        if (a.online !== b.online) return b.online - a.online;
        return (b.tiers[selectedProfession] || 0) - (a.tiers[selectedProfession] || 0);
      });
    }
    
    return filtered.sort((a, b) => {
      if (a.online !== b.online) return b.online - a.online;
      return a.name.localeCompare(b.name);
    });
  };

  const PlayerCard = ({ player }) => {
    const isEditing = editingPlayer === player.id;
    
    if (currentView === 'profession' && selectedProfession) {
      const tier = player.tiers[selectedProfession] || 0;
      const tierInfo = getTierInfo(tier);
      
      return (
        <div className={`p-4 rounded-lg border-2 ${player.online ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'} transition-all hover:shadow-md`}>
          <div className="flex items-center justify-between px-8">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${player.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <h3 className="font-semibold text-lg">{player.name}</h3>
            </div>
            
            <div className="flex items-center space-x-3">
              <p className="text-gray-600">{selectedProfession}</p>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${tierInfo.color} w-20 text-center`}>
                {tier === 0 ? 'None' : tierInfo.name}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`p-4 rounded-lg border-2 ${player.online ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50'} transition-all hover:shadow-md`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => toggleOnlineStatus(player.id)}
              className={`w-4 h-4 rounded-full transition-colors hover:scale-110 ${player.online ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'} cursor-pointer`}
            ></button>
            <h3 className="font-semibold text-lg">{player.name}</h3>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => startEditing(player)}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-blue-600" />
              </button>
            ) : (
              <>
                <button
                  onClick={saveEditing}
                  className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                >
                  <Save className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={cancelEditing}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {professions.map((profession) => {
            const tier = isEditing ? (tempTiers[profession] || 0) : (player.tiers[profession] || 0);
            const tierInfo = getTierInfo(tier);
            
            return (
              <div key={profession} className="flex items-center space-x-1">
                <span className="text-sm text-gray-700">{profession}:</span>
                {isEditing ? (
                  <select
                    value={tempTiers[profession] || 0}
                    onChange={(e) => updateTempTier(profession, e.target.value)}
                    className="w-16 px-1 py-1 text-sm border rounded text-center"
                  >
                    <option value={0}>-</option>
                    {[1,2,3,4,5,6,7,8,9].map(t => (
                      <option key={t} value={t}>T{t}</option>
                    ))}
                  </select>
                ) : (
                  <div className={`px-2 py-1 rounded text-white text-sm font-medium ${tierInfo.color} w-10 text-center`}>
                    {tier === 0 ? '-' : `T${tier}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TierLegend = () => (
    <div className="bg-white p-3 rounded-lg border shadow-sm mb-4">
      <div className="flex items-center justify-center gap-4">
        <h3 className="font-medium text-sm">Tier Legend</h3>
        <div className="flex flex-wrap gap-1">
          {[1,2,3,4,5,6,7,8,9].map(tier => {
            const info = getTierInfo(tier);
            return (
              <span key={tier} className={`px-1.5 py-0.5 rounded text-white text-xs ${info.color}`}>
                {info.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <Users className="mr-3" />
          Profession Tier Tracker
        </h1>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setCurrentView('master')}
              className={`px-4 py-2 rounded-md transition-colors ${currentView === 'master' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Master List
            </button>
            {professions.map(prof => (
              <button
                key={prof}
                onClick={() => {
                  setCurrentView('profession');
                  setSelectedProfession(prof);
                }}
                className={`px-4 py-2 rounded-md transition-colors ${currentView === 'profession' && selectedProfession === prof ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                {prof}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowOnlineOnly(!showOnlineOnly)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${showOnlineOnly ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              <Eye className="w-4 h-4" />
              <span>Online Only</span>
            </button>
          </div>
        </div>

        <TierLegend />

        {currentView === 'master' && (
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <input
              type="text"
              placeholder="Search players by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-lg"
            />
          </div>
        )}

        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter new player name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewPlayer()}
              className="flex-1 border rounded-md px-3 py-2"
            />
            <button
              onClick={addNewPlayer}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Player</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {currentView === 'master' ? 'All Players - All Skills' : `${selectedProfession} Rankings`}
              <span className="text-gray-500 font-normal ml-2">
                ({getFilteredPlayers().length} {showOnlineOnly ? 'online' : 'total'})
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {getFilteredPlayers().map(player => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>

          {getFilteredPlayers().length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No players found</p>
              <p>Try adjusting your filters or add some players</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionTracker;
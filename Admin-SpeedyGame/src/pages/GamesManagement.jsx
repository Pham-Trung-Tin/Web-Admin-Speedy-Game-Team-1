import React from 'react';
import Stats from '../components/Stats';
import TopGames from '../components/TopGames';
import GameTable from '../components/GameTable';

const GamesManagement = () => {
  const statsData = {
    totalGames: 248,
    activeGames: 186,
    inactiveGames: 62,
    totalPlayers: 45892,
  };

  const topGamesData = [
    { id: 1, name: 'Battle Royale Arena', players: 12847 },
    { id: 2, name: 'Strategy Masters', players: 9234 },
    { id: 3, name: 'Puzzle Quest', players: 7891 },
  ];

  const gamesListData = [
    { name: 'Battle Royale Arena', status: 'Active', category: 'Action', players: 12847, createdDate: 'Jan 15, 2025' },
    { name: 'Strategy Masters', status: 'Active', category: 'Strategy', players: 9234, createdDate: 'Dec 22, 2024' },
    { name: 'Puzzle Quest', status: 'Active', category: 'Puzzle', players: 7891, createdDate: 'Nov 08, 2024' },
    { name: 'Racing Thunder', status: 'Inactive', category: 'Racing', players: 2156, createdDate: 'Oct 12, 2024' },
    { name: 'RPG Legends', status: 'Active', category: 'RPG', players: 5643, createdDate: 'Sep 30, 2024' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* container căn giữa */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Games Management</h1>
        <p className="text-gray-400 mb-6">Manage your gaming platform's games and statistics</p>

        {/* Stats */}
        <Stats {...statsData} />

        {/* Top Games */}
        <TopGames topGames={topGamesData} />

        {/* Games List */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Games List</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">+ Add Game</button>
          </div>
          <div className="flex mb-4 gap-2">
            <input
              type="text"
              placeholder="Search games..."
              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
            <select className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option>All Status</option>
            </select>
            <select className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option>All Categories</option>
            </select>
          </div>

          <GameTable games={gamesListData} />
        </div>
      </div>
    </div>
  );
};

export default GamesManagement;

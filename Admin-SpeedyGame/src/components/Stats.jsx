import React from 'react';

const Stats = ({ totalGames, activeGames, inactiveGames, totalPlayers }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-400">Total Games</p>
        <p className="text-2xl font-bold">{totalGames}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-400">Active Games</p>
        <p className="text-2xl font-bold">{activeGames}</p>
        <p className="text-sm text-gray-500">{((activeGames / totalGames) * 100).toFixed(0)}% active</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-400">Inactive Games</p>
        <p className="text-2xl font-bold">{inactiveGames}</p>
        <p className="text-sm text-gray-500">{((inactiveGames / totalGames) * 100).toFixed(0)}% inactive</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-400">Total Players</p>
        <p className="text-2xl font-bold">{totalPlayers.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Stats;
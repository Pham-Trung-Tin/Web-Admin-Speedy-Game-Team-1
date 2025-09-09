import React from 'react';

const TopGames = ({ topGames }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Top 3 Most Played Games</h2>
      {topGames.map((game) => (
        <div key={game.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
          <span className="text-gray-400">{game.id}. {game.name}</span>
          <span>{game.players.toLocaleString()} players</span>
        </div>
      ))}
    </div>
  );
};

export default TopGames;
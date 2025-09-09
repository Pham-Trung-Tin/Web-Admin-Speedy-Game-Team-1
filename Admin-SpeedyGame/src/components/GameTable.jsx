import React from 'react';

const GameTable = ({ games }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="p-2">Game Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Category</th>
            <th className="p-2">Players</th>
            <th className="p-2">Created Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index} className="border-t border-gray-700">
              <td className="p-2">{game.name}</td>
              <td className={`p-2 ${game.status === 'Inactive' ? 'text-gray-500' : ''}`}>{game.status}</td>
              <td className="p-2">{game.category}</td>
              <td className="p-2">{game.players.toLocaleString()}</td>
              <td className="p-2">{game.createdDate}</td>
              <td className="p-2">
                <button className="text-blue-400 mr-2">✎</button>
                <button className="text-red-400">✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 text-gray-500 text-sm">
        Showing 1 to 5 of 248 entries
      </div>
      <div className="p-2 flex justify-end">
        <button className="px-2 py-1 bg-gray-700 rounded">Previous</button>
        <button className="px-2 py-1 bg-gray-700 rounded mx-1">1</button>
        <button className="px-2 py-1 bg-gray-700 rounded">2</button>
        <button className="px-2 py-1 bg-gray-700 rounded">3</button>
        <button className="px-2 py-1 bg-gray-700 rounded">Next</button>
      </div>
    </div>
  );
};

export default GameTable;
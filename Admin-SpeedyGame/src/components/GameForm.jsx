import { useState } from "react";

const GameForm = () => {
  const [game, setGame] = useState({ name: "", genre: "", status: "Active" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`New game added: ${game.name} (${game.genre})`);
    setGame({ name: "", genre: "", status: "Active" });
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add New Game</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Game Name"
          value={game.name}
          onChange={(e) => setGame({ ...game, name: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          required
        />
        <input
          type="text"
          placeholder="Genre"
          value={game.genre}
          onChange={(e) => setGame({ ...game, genre: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
          required
        />
        <select
          value={game.status}
          onChange={(e) => setGame({ ...game, status: e.target.value })}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white"
        >
          <option>Active</option>
          <option>Inactive</option>
          <option>Maintenance</option>
        </select>
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
        >
          Add Game
        </button>
      </form>
    </div>
  );
};

export default GameForm;

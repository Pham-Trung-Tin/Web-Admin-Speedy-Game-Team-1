const games = [
  { id: "#001", name: "Cyber Warriors", genre: "Action", status: "Active", players: 45231, release: "Jan 15, 2025" },
  { id: "#002", name: "Mind Bender", genre: "Puzzle", status: "Active", players: 23458, release: "Dec 20, 2024" },
  { id: "#003", name: "Dragon Quest Online", genre: "RPG", status: "Maintenance", players: 67890, release: "Nov 05, 2024" },
  { id: "#004", name: "Soccer Champions", genre: "Sports", status: "Inactive", players: 12345, release: "Oct 12, 2024" },
  { id: "#005", name: "Strategic Empire", genre: "Strategy", status: "Active", players: 34567, release: "Sep 28, 2024" },
];

const GameTable = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Game List</h3>
      <table className="w-full text-left text-gray-300">
        <thead>
          <tr>
            <th className="pb-2">ID</th>
            <th className="pb-2">Game</th>
            <th className="pb-2">Genre</th>
            <th className="pb-2">Status</th>
            <th className="pb-2">Players</th>
            <th className="pb-2">Release</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game, index) => (
            <tr key={index} className="hover:bg-gray-700">
              <td className="py-2">{game.id}</td>
              <td>{game.name}</td>
              <td>{game.genre}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    game.status === "Active"
                      ? "bg-green-600"
                      : game.status === "Inactive"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {game.status}
                </span>
              </td>
              <td>{game.players.toLocaleString()}</td>
              <td>{game.release}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameTable;

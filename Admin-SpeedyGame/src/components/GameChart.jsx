import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const playerData = [
  { name: "Cyber Warriors", players: 45231 },
  { name: "Dragon Quest", players: 67890 },
  { name: "Strategic Empire", players: 34567 },
];

const genreData = [
  { name: "Action", value: 35 },
  { name: "RPG", value: 28 },
  { name: "Sports", value: 18 },
  { name: "Puzzle", value: 12 },
  { name: "Strategy", value: 7 },
];

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F472B6", "#A78BFA"];

const GameChart = () => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Player Count by Game */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Player Count by Game</h3>
        <BarChart width={400} height={250} data={playerData}>
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip />
          <Bar dataKey="players" fill="#60A5FA" />
        </BarChart>
      </div>

      {/* Genre Distribution */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Genre Distribution</h3>
        <PieChart width={400} height={250}>
          <Pie
            data={genreData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {genreData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default GameChart;

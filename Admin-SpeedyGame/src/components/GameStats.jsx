const stats = [
  { label: "Player Count", value: "145,678", change: "+12%", type: "positive" },
  { label: "Active Games", value: "1,429", change: "+5%", type: "positive" },
  { label: "Inactive Games", value: "320", change: "-3%", type: "negative" },
  { label: "Monthly Revenue", value: "$89,247", change: "+15%", type: "positive" },
];

const GameStats = () => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{stat.label}</span>
            <span
              className={`text-xs font-medium ${
                stat.type === "positive" ? "text-green-400" : "text-red-400"
              }`}
            >
              {stat.change}
            </span>
          </div>
          <div className="text-xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default GameStats;
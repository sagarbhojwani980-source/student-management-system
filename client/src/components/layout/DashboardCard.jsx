export default function DashboardCard({
  title,
  value,
  color,
}) {
  return (
    <div className={`rounded-xl shadow-lg p-6 text-white ${color}`}>
      <h2 className="text-lg">{title}</h2>

      <h1 className="text-4xl font-bold mt-4">
        {value}
      </h1>
    </div>
  );
}
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function DashboardCharts({ students = [] }) {
  const maleCount = students.filter(
    (student) => student.gender === "Male"
  ).length;

  const femaleCount = students.filter(
    (student) => student.gender === "Female"
  ).length;

  const pieData = [
    { name: "Male", value: maleCount },
    { name: "Female", value: femaleCount },
  ];

  const COLORS = ["#2563eb", "#ec4899"];

  const courseMap = {};

  students.forEach((student) => {
    if (courseMap[student.course]) {
      courseMap[student.course]++;
    } else {
      courseMap[student.course] = 1;
    }
  });

  const barData = Object.keys(courseMap).map((course) => ({
    course,
    students: courseMap[course],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Gender Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Students Per Course
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={barData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="course" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar dataKey="students" fill="#2563eb" radius={[8, 8, 0, 0]} />

          </BarChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}
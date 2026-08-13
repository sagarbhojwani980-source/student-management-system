import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import DashboardCard from "../components/layout/DashboardCard";

export default function Dashboard() {
  return (
    <>
      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-100">
        <Navbar />

        <div className="p-8">

          <div className="grid grid-cols-4 gap-6">

            <DashboardCard
              title="Students"
              value="250"
              color="bg-blue-500"
            />

            <DashboardCard
              title="Teachers"
              value="25"
              color="bg-green-500"
            />

            <DashboardCard
              title="Courses"
              value="12"
              color="bg-purple-500"
            />

            <DashboardCard
              title="Attendance"
              value="92%"
              color="bg-orange-500"
            />

          </div>

          <div className="bg-white rounded-xl shadow mt-8 p-6">

            <h2 className="text-2xl font-bold mb-4">
              Recent Students
            </h2>

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-200">

                  <th className="p-3">Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Semester</th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-b">

                  <td className="p-3">John Doe</td>
                  <td>john@gmail.com</td>
                  <td>B.Tech CSE</td>
                  <td>5</td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </>
  );
}
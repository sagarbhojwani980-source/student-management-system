import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck,
  FileText,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Students", icon: Users },
  { name: "Teachers", icon: GraduationCap },
  { name: "Courses", icon: BookOpen },
  { name: "Attendance", icon: CalendarCheck },
  { name: "Reports", icon: FileText },
  { name: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0">
      <div className="text-2xl font-bold p-6 border-b border-slate-700">
        🎓 SMS
      </div>

      <ul className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li
              key={item.name}
              className="flex items-center gap-3 px-6 py-4 hover:bg-slate-800 cursor-pointer transition"
            >
              <Icon size={20} />
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default function Navbar() {
  return (
    <div className="bg-white shadow h-16 flex justify-between items-center px-8">
      <h1 className="text-2xl font-bold">
        Student Management System
      </h1>

      <div className="flex items-center gap-4">
        <img
          src="https://ui-avatars.com/api/?name=Admin"
          alt="Admin"
          className="w-10 h-10 rounded-full"
        />

        <span className="font-semibold">
          Admin
        </span>
      </div>
    </div>
  );
}
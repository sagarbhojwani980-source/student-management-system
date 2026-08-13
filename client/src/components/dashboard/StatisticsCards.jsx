import {
  FaUsers,
  FaMale,
  FaFemale,
  FaBook,
  FaLayerGroup,
  FaGraduationCap,
} from "react-icons/fa";

export default function StatisticsCards({ students = [] }) {
  // Always make sure students is an array
  const safeStudents = Array.isArray(students)
    ? students
    : [];

  // =========================================
  // TOTAL STUDENTS
  // =========================================

  const totalStudents = safeStudents.length;

  // =========================================
  // MALE STUDENTS
  // =========================================

  const maleStudents = safeStudents.filter(
    (student) =>
      student.gender?.trim().toLowerCase() === "male"
  ).length;

  // =========================================
  // FEMALE STUDENTS
  // =========================================

  const femaleStudents = safeStudents.filter(
    (student) =>
      student.gender?.trim().toLowerCase() === "female"
  ).length;

  // =========================================
  // TOTAL COURSES
  // =========================================

  const courseNames = safeStudents
    .map((student) =>
      student.course?.trim().toLowerCase()
    )
    .filter(Boolean);

  const totalCourses = new Set(courseNames).size;

  // =========================================
  // AVERAGE SEMESTER
  // =========================================

  const validSemesters = safeStudents
    .map((student) => Number(student.semester))
    .filter(
      (semester) =>
        !Number.isNaN(semester) && semester > 0
    );

  const averageSemester =
    validSemesters.length > 0
      ? (
          validSemesters.reduce(
            (total, semester) =>
              total + semester,
            0
          ) / validSemesters.length
        ).toFixed(1)
      : "0";

  // =========================================
  // HIGHEST SEMESTER
  // =========================================

  const highestSemester =
    validSemesters.length > 0
      ? Math.max(...validSemesters)
      : 0;

  // =========================================
  // CARD DATA
  // =========================================

  const cards = [
    {
      title: "Total Students",
      value: totalStudents,
      description: "Registered students",
      color:
        "bg-gradient-to-r from-blue-600 to-blue-500",
      iconBackground: "bg-white/20",
      Icon: FaUsers,
    },

    {
      title: "Male Students",
      value: maleStudents,
      description: "Male registrations",
      color:
        "bg-gradient-to-r from-green-600 to-emerald-500",
      iconBackground: "bg-white/20",
      Icon: FaMale,
    },

    {
      title: "Female Students",
      value: femaleStudents,
      description: "Female registrations",
      color:
        "bg-gradient-to-r from-pink-600 to-rose-500",
      iconBackground: "bg-white/20",
      Icon: FaFemale,
    },

    {
      title: "Total Courses",
      value: totalCourses,
      description: "Active student courses",
      color:
        "bg-gradient-to-r from-purple-600 to-violet-500",
      iconBackground: "bg-white/20",
      Icon: FaBook,
    },

    {
      title: "Average Semester",
      value: averageSemester,
      description: "Average student semester",
      color:
        "bg-gradient-to-r from-orange-500 to-amber-500",
      iconBackground: "bg-white/20",
      Icon: FaLayerGroup,
    },

    {
      title: "Highest Semester",
      value: highestSemester,
      description: "Highest current semester",
      color:
        "bg-gradient-to-r from-cyan-600 to-sky-500",
      iconBackground: "bg-white/20",
      Icon: FaGraduationCap,
    },
  ];

  // =========================================
  // UI
  // =========================================

  return (
    <section className="mb-8">
      {/* Section Header */}

      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of current student records
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map(
          ({
            title,
            value,
            description,
            color,
            iconBackground,
            Icon,
          }) => (
            <div
              key={title}
              className={`
                ${color}
                rounded-2xl
                p-5
                text-white
                shadow-lg
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
              `}
            >
              <div className="flex items-start justify-between">
                {/* Text */}

                <div>
                  <p className="text-sm font-medium text-white/80">
                    {title}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold">
                    {value}
                  </h3>
                </div>

                {/* Icon */}

                <div
                  className={`
                    ${iconBackground}
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                  `}
                >
                  <Icon size={22} />
                </div>
              </div>

              {/* Description */}

              <p className="mt-4 text-xs text-white/75">
                {description}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
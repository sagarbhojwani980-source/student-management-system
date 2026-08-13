import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getStudents,
  deleteStudent,
} from "../services/studentService";

import AddStudent from "../components/students/AddStudent";
import StatisticsCards from "../components/dashboard/StatisticsCards";
import DashboardCharts from "../components/charts/DashboardCharts";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search and filters
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await getStudents();

      const studentData = Array.isArray(response.data)
        ? response.data
        : [];

      setStudents(studentData);
    } catch (error) {
      console.error("Failed to load students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      await deleteStudent(id);

      if (editingStudent?.id === id) {
        setEditingStudent(null);
      }

      toast.success("Student deleted successfully");

      await loadStudents();
    } catch (error) {
      console.error("Failed to delete student:", error);

      const message =
        error?.response?.data?.message ||
        "Failed to delete student";

      toast.error(message);
    }
  };

  const handleSort = (key) => {
    setSortConfig((previousConfig) => {
      if (
        previousConfig.key === key &&
        previousConfig.direction === "asc"
      ) {
        return {
          key,
          direction: "desc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });

    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return " ↕";
    }

    return sortConfig.direction === "asc"
      ? " ▲"
      : " ▼";
  };

  const courseOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) => student.course?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [students]);

  const semesterOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .map((student) =>
            student.semester?.toString().trim()
          )
          .filter(Boolean)
      ),
    ].sort((a, b) => Number(a) - Number(b));
  }, [students]);

  const filteredStudents = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return students.filter((student) => {
      const firstName =
        student.firstName?.trim().toLowerCase() || "";

      const lastName =
        student.lastName?.trim().toLowerCase() || "";

      const fullName = `${firstName} ${lastName}`;

      const email =
        student.email?.trim().toLowerCase() || "";

      const phone =
        student.phone?.toString().trim().toLowerCase() || "";

      const gender =
        student.gender?.trim().toLowerCase() || "";

      const course =
        student.course?.trim().toLowerCase() || "";

      const semester =
        student.semester?.toString().trim() || "";

      const matchesSearch =
        !searchValue ||
        firstName.includes(searchValue) ||
        lastName.includes(searchValue) ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue) ||
        course.includes(searchValue) ||
        gender.includes(searchValue);

      const matchesGender =
        !genderFilter ||
        gender === genderFilter.toLowerCase();

      const matchesCourse =
        !courseFilter ||
        course === courseFilter.toLowerCase();

      const matchesSemester =
        !semesterFilter ||
        semester === semesterFilter;

      return (
        matchesSearch &&
        matchesGender &&
        matchesCourse &&
        matchesSemester
      );
    });
  }, [
    students,
    search,
    genderFilter,
    courseFilter,
    semesterFilter,
  ]);

  const sortedStudents = useMemo(() => {
    if (!sortConfig.key) {
      return filteredStudents;
    }

    return [...filteredStudents].sort((studentA, studentB) => {
      let valueA = studentA[sortConfig.key];
      let valueB = studentB[sortConfig.key];

      if (sortConfig.key === "semester") {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      } else {
        valueA = valueA?.toString().trim().toLowerCase() || "";
        valueB = valueB?.toString().trim().toLowerCase() || "";
      }

      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [filteredStudents, sortConfig]);

  const totalPages = Math.ceil(
    sortedStudents.length / studentsPerPage
  );

  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(1);
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent - studentsPerPage;

  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const hasActiveFilters = Boolean(
    search ||
      genderFilter ||
      courseFilter ||
      semesterFilter
  );

  const clearFilters = () => {
    setSearch("");
    setGenderFilter("");
    setCourseFilter("");
    setSemesterFilter("");
    setSortConfig({
      key: "",
      direction: "asc",
    });
    setCurrentPage(1);
  };

  const exportExcel = () => {
    if (sortedStudents.length === 0) {
      toast.error("There are no students to export");
      return;
    }

    const exportData = sortedStudents.map((student) => ({
      ID: student.id,
      "First Name": student.firstName,
      "Last Name": student.lastName,
      Email: student.email,
      Phone: student.phone || "",
      Gender: student.gender || "",
      Course: student.course || "",
      Semester: student.semester || "",
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 18 },
      { wch: 18 },
      { wch: 30 },
      { wch: 16 },
      { wch: 12 },
      { wch: 24 },
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "students.xlsx");

    toast.success("Excel file exported successfully");
  };

  const exportPDF = () => {
    if (sortedStudents.length === 0) {
      toast.error("There are no students to export");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
    });

    doc.setFontSize(18);
    doc.text("Student Management System", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Total exported students: ${sortedStudents.length}`,
      14,
      22
    );

    autoTable(doc, {
      startY: 28,

      head: [
        [
          "ID",
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Gender",
          "Course",
          "Semester",
        ],
      ],

      body: sortedStudents.map((student) => [
        student.id,
        student.firstName,
        student.lastName,
        student.email,
        student.phone || "-",
        student.gender || "-",
        student.course || "-",
        student.semester || "-",
      ]),

      styles: {
        fontSize: 8,
        cellPadding: 3,
      },

      headStyles: {
        fillColor: [37, 99, 235],
        textColor: [255, 255, 255],
      },

      alternateRowStyles: {
        fillColor: [243, 244, 246],
      },
    });

    doc.save("students.pdf");

    toast.success("PDF file exported successfully");
  };

  const visiblePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (endPage - startPage < 4) {
      startPage = Math.max(endPage - 4, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <StatisticsCards students={students} />

      <DashboardCharts students={students} />

      <AddStudent
        editingStudent={editingStudent}
        clearEdit={() => setEditingStudent(null)}
        onStudentAdded={async () => {
          await loadStudents();
          setEditingStudent(null);
        }}
      />

      <section className="rounded-2xl bg-white p-4 shadow-lg sm:p-6">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 sm:text-3xl">
              Student Management System
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Showing {sortedStudents.length} of{" "}
              {students.length} students
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={exportExcel}
              className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-700"
            >
              Export Excel
            </button>

            <button
              type="button"
              onClick={exportPDF}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Search, Filters and Sorting
            </h2>

            {(hasActiveFilters || sortConfig.key) && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                Options active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <input
              type="search"
              placeholder="Search name, email, phone..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <select
              value={genderFilter}
              onChange={(event) => {
                setGenderFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={courseFilter}
              onChange={(event) => {
                setCourseFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All courses</option>

              {courseOptions.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            <select
              value={semesterFilter}
              onChange={(event) => {
                setSemesterFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All semesters</option>

              {semesterOptions.map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={clearFilters}
              disabled={
                !hasActiveFilters && !sortConfig.key
              }
              className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full min-w-[1050px] border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>

                <th
                  onClick={() => handleSort("firstName")}
                  className="cursor-pointer p-3 text-left transition hover:bg-blue-700"
                >
                  First Name
                  {getSortIcon("firstName")}
                </th>

                <th
                  onClick={() => handleSort("lastName")}
                  className="cursor-pointer p-3 text-left transition hover:bg-blue-700"
                >
                  Last Name
                  {getSortIcon("lastName")}
                </th>

                <th
                  onClick={() => handleSort("email")}
                  className="cursor-pointer p-3 text-left transition hover:bg-blue-700"
                >
                  Email
                  {getSortIcon("email")}
                </th>

                <th className="p-3 text-left">
                  Phone
                </th>

                <th
                  onClick={() => handleSort("gender")}
                  className="cursor-pointer p-3 text-left transition hover:bg-blue-700"
                >
                  Gender
                  {getSortIcon("gender")}
                </th>

                <th
                  onClick={() => handleSort("course")}
                  className="cursor-pointer p-3 text-left transition hover:bg-blue-700"
                >
                  Course
                  {getSortIcon("course")}
                </th>

                <th
                  onClick={() => handleSort("semester")}
                  className="cursor-pointer p-3 text-left transition hover:bg-blue-700"
                >
                  Semester
                  {getSortIcon("semester")}
                </th>

                <th className="p-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="p-12 text-center text-gray-500"
                  >
                    Loading students...
                  </td>
                </tr>
              ) : currentStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="p-12 text-center text-gray-500"
                  >
                    {hasActiveFilters
                      ? "No students match the selected filters."
                      : "No students found."}
                  </td>
                </tr>
              ) : (
                currentStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`border-b transition hover:bg-blue-50 ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3">{student.id}</td>

                    <td className="p-3 font-medium">
                      {student.firstName}
                    </td>

                    <td className="p-3">
                      {student.lastName}
                    </td>

                    <td className="p-3">
                      {student.email}
                    </td>

                    <td className="p-3">
                      {student.phone || "-"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          student.gender?.toLowerCase() ===
                          "male"
                            ? "bg-blue-100 text-blue-700"
                            : student.gender?.toLowerCase() ===
                              "female"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {student.gender || "Unknown"}
                      </span>
                    </td>

                    <td className="p-3">
                      {student.course || "-"}
                    </td>

                    <td className="p-3">
                      {student.semester || "-"}
                    </td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(student)
                          }
                          className="rounded-lg bg-yellow-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-yellow-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(student.id)
                          }
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">
              {sortedStudents.length === 0
                ? 0
                : indexOfFirstStudent + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold">
              {Math.min(
                indexOfLastStudent,
                sortedStudents.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {sortedStudents.length}
            </span>{" "}
            students
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={
                currentPage === 1 || totalPages === 0
              }
              className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              First
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((previousPage) =>
                  Math.max(previousPage - 1, 1)
                )
              }
              disabled={
                currentPage === 1 || totalPages === 0
              }
              className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {visiblePageNumbers().map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`rounded-lg px-3 py-2 text-sm transition ${
                  currentPage === pageNumber
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-100"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((previousPage) =>
                  Math.min(
                    previousPage + 1,
                    totalPages
                  )
                )
              }
              disabled={
                totalPages === 0 ||
                currentPage === totalPages
              }
              className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={
                totalPages === 0 ||
                currentPage === totalPages
              }
              className="rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Last
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
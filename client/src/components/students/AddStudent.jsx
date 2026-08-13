import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import {
  addStudent,
  updateStudent,
} from "../../services/studentService";

import { studentSchema } from "../../validation/studentSchema";

export default function AddStudent({
  editingStudent,
  onStudentAdded,
  clearEdit,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(studentSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      course: "",
      semester: "",
    },
  });

  // Fill form when Edit is clicked
  useEffect(() => {
    if (editingStudent) {
      setValue(
        "firstName",
        editingStudent.firstName || ""
      );

      setValue(
        "lastName",
        editingStudent.lastName || ""
      );

      setValue(
        "email",
        editingStudent.email || ""
      );

      setValue(
        "phone",
        editingStudent.phone || ""
      );

      setValue(
        "gender",
        editingStudent.gender || ""
      );

      setValue(
        "course",
        editingStudent.course || ""
      );

      setValue(
        "semester",
        editingStudent.semester || ""
      );
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        course: "",
        semester: "",
      });
    }
  }, [
    editingStudent,
    setValue,
    reset,
  ]);

  // Add / Update Student
  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        // ===============================
        // UPDATE STUDENT
        // ===============================

        await updateStudent(
          editingStudent.id,
          data
        );

        toast.success(
          "Student updated successfully"
        );

        // Exit edit mode
        if (clearEdit) {
          clearEdit();
        }
      } else {
        // ===============================
        // ADD STUDENT
        // ===============================

        await addStudent(data);

        toast.success(
          "Student added successfully"
        );
      }

      // ===============================
      // CLEAR FORM
      // ===============================

      reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        course: "",
        semester: "",
      });

      // ===============================
      // REFRESH STUDENT TABLE
      // ===============================

      if (onStudentAdded) {
        await onStudentAdded();
      }
    } catch (error) {
      console.error(
        "Student form error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Something went wrong";

      toast.error(message);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      course: "",
      semester: "",
    });

    if (clearEdit) {
      clearEdit();
    }
  };

  return (
    <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">

      <h2 className="mb-6 text-2xl font-bold text-blue-600">
        {editingStudent
          ? "Edit Student"
          : "Add New Student"}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
      >

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* First Name */}
          <div>
            <input
              type="text"
              placeholder="First Name"
              {...register("firstName")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <input
              type="text"
              placeholder="Last Name"
              {...register("lastName")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              type="text"
              placeholder="Phone Number"
              {...register("phone")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <select
              {...register("gender")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.gender
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            {errors.gender && (
              <p className="mt-1 text-sm text-red-500">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Course */}
          <div>
            <input
              type="text"
              placeholder="Course"
              {...register("course")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.course
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            {errors.course && (
              <p className="mt-1 text-sm text-red-500">
                {errors.course.message}
              </p>
            )}
          </div>

          {/* Semester */}
          <div>
            <input
              type="number"
              min="1"
              max="8"
              placeholder="Semester"
              {...register("semester")}
              className={`w-full rounded-lg border p-3 outline-none transition focus:ring-2 focus:ring-blue-200 ${
                errors.semester
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />

            {errors.semester && (
              <p className="mt-1 text-sm text-red-500">
                {errors.semester.message}
              </p>
            )}
          </div>

        </div>

        {/* Buttons */}

        <div className="mt-7 flex flex-wrap gap-3">

          <button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-lg px-6 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              editingStudent
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting
              ? "Saving..."
              : editingStudent
              ? "Update Student"
              : "Add Student"}
          </button>

          {editingStudent && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white transition hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

        </div>

      </form>

    </div>
  );
}
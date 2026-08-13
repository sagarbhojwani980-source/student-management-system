import { z } from "zod";

export const studentSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),

  lastName: z.string().min(3, "Last name must be at least 3 characters"),

  email: z.string().email("Enter a valid email address"),

  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  gender: z.string().min(1, "Please select a gender"),

  course: z.string().min(2, "Course is required"),

  semester: z.coerce
    .number()
    .min(1, "Semester must be between 1 and 8")
    .max(8, "Semester must be between 1 and 8"),
});
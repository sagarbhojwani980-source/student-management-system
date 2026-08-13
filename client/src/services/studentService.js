import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
});

// Add JWT automatically to every protected request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically handle expired/invalid JWT
API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Avoid redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// GET ALL STUDENTS
export const getStudents = () => {
  return API.get("/students");
};

// ADD STUDENT
export const addStudent = (studentData) => {
  return API.post("/students", studentData);
};

// UPDATE STUDENT
export const updateStudent = (id, studentData) => {
  return API.put(`/students/${id}`, studentData);
};

// DELETE STUDENT
export const deleteStudent = (id) => {
  return API.delete(`/students/${id}`);
};

export default API;
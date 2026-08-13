import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// LOGIN
export const loginUser = (credentials) => {
  return axios.post(
    `${API_URL}/auth/login`,
    credentials
  );
};

// REGISTER
export const registerUser = (userData) => {
  return axios.post(
    `${API_URL}/auth/register`,
    userData
  );
};
import axios from "axios";

const API_URL = "https://backstore-nirr.onrender.com/api/auth";

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  } catch (error) {
    console.error("Error de autenticación", error);
  }
};

export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await axios.get(`${API_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  } catch {
    return null;
  }
};

import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8888/v1/auth";

// Login function to authenticate and store the token in cookies
export const login = async (email, password) => {
  try {
    let response;
    const pending_user_id = sessionStorage.getItem("pending_user_id")
    if (pending_user_id == null) {
      response = await axios.post(`${API_URL}/login`, { email, password });
    }
    else {
      response = await axios.post(`${API_URL}/login`, { email, password, pending_user_id });
    }

    const { access_token, token_type, user_id } = response.data;

    // Store token and user ID in cookies
    Cookies.set("token", access_token, { expires: 7 });
    Cookies.set("user_id", user_id, { expires: 7 });

    return { access_token, token_type, user_id };
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Login failed");
  }
};

// Register function to register and store user details in cookies
export const register = async (email, password) => {
  try {
    let response;
    const pending_user_id = sessionStorage.getItem("pending_user_id")
    if (pending_user_id == null) {
      response = await axios.post(`${API_URL}/register`, { email, password });
    }
    else {
      response = await axios.post(`${API_URL}/register`, { email, password, pending_user_id });
    }

    const { message, user_id } = response.data;

    // Store message and user ID in cookies
    Cookies.set("message", message, { expires: 7 });
    Cookies.set("user_id", user_id, { expires: 7 });

    return { message, user_id };
  } catch (error) {
    throw new Error(error.response?.data?.msg || "Register failed");
  }
};

// Logout function to clear cookies
export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("user_id");
};

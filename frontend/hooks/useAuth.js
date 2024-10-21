import { useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../services/authService";
import Cookies from "js-cookie";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("user_id");
    if (token && userId) {
      setUser({ user_id: userId });
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const { access_token, user_id } = await loginService(email, password);
      setUser({ user_id });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const registerUser = async (email, password) => {
    try {
      const { message, user_id } = await registerService(email, password);
      setUser({ user_id });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const logoutUser = () => {
    logoutService();
    setUser(null);
  };

  return { user, loginUser, registerUser, logoutUser, loading };
};

export default useAuth;

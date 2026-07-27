import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../api/axios";

const AuthContext =
  createContext();

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadUser = async () => {

    const token =
      localStorage.getItem("token");

    if (!token) {

      setLoading(false);

      return;
    }

    try {

      const response =
        await api.get("/auth/me");

      setUser(response.data);

    } catch {

      localStorage.removeItem(
        "token"
      );

      setUser(null);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadUser();

  }, []);

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loadUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);
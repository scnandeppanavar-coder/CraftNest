import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Restore session if the page is refreshed
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login
  const login = (jwtToken, email, username, role, userId) => {

    const userData = {
      email,
      username,
      role,
      userId,
    };

    sessionStorage.setItem("token", jwtToken);
    sessionStorage.setItem("user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
  };

  // Update user
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Logout
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // Logout when token expires
  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener("auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("auth-expired", handleAuthExpired);
    };
  }, []);

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
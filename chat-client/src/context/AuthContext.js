import { createContext, useContext, useState } from "react";

// AuthContext yaratish
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Foydalanuvchi ma’lumotlarini saqlash
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Contextni ishlatish uchun funksiya
export const useAuth = () => {
  return useContext(AuthContext);
};

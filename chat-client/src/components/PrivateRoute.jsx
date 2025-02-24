import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("authToken"); // ❗ User login bo‘lganmi tekshirish

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

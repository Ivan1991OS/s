import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./components/PrivateRoute";
import "./index.css";

function App() {
  return (
 
    <Routes>
      {/* ✅ Sayt ochilganda `Home` sahifasi ko‘rinishi kerak */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      {/* ❌ Noto‘g‘ri sahifaga kirilsa, `Home` sahifasiga yo‘naltirish */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

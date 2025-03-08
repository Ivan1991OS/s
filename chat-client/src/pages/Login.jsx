import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Kirish muvaffaqiyatli! Profil sahifasiga yo‘naltirilmoqdasiz...");
        navigate("/profile");
      } else {
        setError(data.message || "❌ Kirishda xatolik yuz berdi!");
      }
    } catch (error) {
      setError("❌ Server bilan bog‘lanishda xatolik!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Tizimga kirish</h1>
        <p className="login-subtitle">Profilingizga kiring</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email yoki telefon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Kirish</button>
        </form>

        {/* Facebook orqali kirish */}
        <div className="social-login">
          <img src="/facebook-logo.png" alt="Facebook Logo" className="facebook-logo" />
        </div>

        {/* Agar foydalanuvchida hisob bo‘lmasa */}
        <p className="no-account">
          Hisobingiz yo‘qmi?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Ro‘yxatdan o‘tish
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, birthDate, gender }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Ro‘yxatdan o‘tish muvaffaqiyatli! Kirish sahifasiga yo‘naltirilmoqdasiz...");
        navigate("/login");
      } else {
        setError(data.message || "❌ Ro‘yxatdan o‘tishda xatolik!");
      }
    } catch (error) {
      setError("❌ Server bilan bog‘lanishda xatolik!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Yangi Profil Yarating</h1>
        <p className="register-subtitle">Bu tez va oson</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Ism"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
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
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />

          {/* Gender selection */}
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                value="male"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />
              Erkak
            </label>
            <label>
              <input
                type="radio"
                value="female"
                checked={gender === "female"}
                onChange={(e) => setGender(e.target.value)}
              />
              Ayol
            </label>
          </div>

          <button type="submit" className="register-btn">Ro‘yxatdan o‘tish</button>
        </form>

        {/* Login sahifasiga yo‘naltirish */}
        <p className="have-account">
          Allaqachon hisobingiz bormi?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>Kirish</span>
        </p>
      </div>
    </div>
  );
};

export default Register;

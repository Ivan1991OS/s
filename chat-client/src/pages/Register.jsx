import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      birthDate,
      gender,
    };

    // 🚀 Ma'lumotlarni backendga jo‘natish
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Ro‘yxatdan muvaffaqiyatli o‘tdingiz! Profilga o'tmoqdasiz...");
        navigate("/profile");
      } else {
        alert(`❌ Xatolik: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Server bilan bog‘lanishda xatolik!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Yangi Profil Yarating</h1>
        <p className="register-subtitle">Bu tez va oson</p>

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
            placeholder="Email yoki telefon"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Yangi parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Tug‘ilgan sana */}
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />

          {/* Jins tanlash */}
          <div className="gender-selection">
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                onChange={(e) => setGender(e.target.value)}
                required
              />
              Erkak
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={(e) => setGender(e.target.value)}
                required
              />
              Ayol
            </label>
          </div>

          <button type="submit" className="register-btn">Ro‘yxatdan o‘tish</button>
        </form>

        {/* Hisob mavjud bo‘lsa */}
        <p className="already-account">
          Allaqachon hisobingiz bormi?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Kirish
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

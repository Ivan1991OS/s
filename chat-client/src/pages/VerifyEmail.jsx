import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3001/api/verify", {
        email,
        code,
      });

      alert(response.data.message);
      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Tasdiqlashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Emailni tasdiqlash</h2>
      <p>Kod {email} manziliga yuborildi.</p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Tasdiqlash kodi"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "⏳ Tekshirilmoqda..." : "Tasdiqlash"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;

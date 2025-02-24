import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css"; // CSS fayli

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="background-animation"></div> {/* 🔹 Harakatlanadigan fon */}

      <div className="login-box" >
        <h1 className="logo">Welcome</h1>
        <p className="subtitle">Log in to explore the future</p>

        {/* 🔹 Foydalanuvchi hisobiga kirish */}
        <div className="button-group">
          <button type="button" onClick={() => navigate("/profile")} className="btn btn-secondary">
            Go Home
          </button>
          <button type="button" onClick={() => navigate("/register")} className="btn btn-primary">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:3001/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Profilni olishda xatolik:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="profile-container">
      {user ? (
        <div>
          <h1>{user.email}</h1>
          <button onClick={() => navigate("/chat")}>Chatga O‘tish</button>
        </div>
      ) : (
        <p>Yuklanmoqda...</p>
      )}
    </div>
  );
};

export default Profile;

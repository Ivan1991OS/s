import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // 🔗 Server bilan bog‘lanish

function AdminPanel() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    socket.emit("joinAsAdmin"); // 🟢 Admin sifatida ulanish

    socket.on("newVideoStream", (data) => {
      console.log("📷 Yangi video stream qabul qilindi:", data);
      setStreams((prev) => [...prev, data]);
    });

    socket.on("removeVideoStream", (socketId) => {
      console.log("🔴 Video stream olib tashlandi:", socketId);
      setStreams((prev) =>
        prev.filter((stream) => stream.socketId !== socketId),
      );
    });

    return () => {
      socket.off("newVideoStream");
      socket.off("removeVideoStream");
    };
  }, []);
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 📌 **MongoDB bilan bog‘lanish**
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/chat-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// 📌 **Foydalanuvchi modeli (Schema)**
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// 📌 **Middleware: Tokenni tekshirish**
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Avtorizatsiya talab qilinadi" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Yaroqsiz token" });
    req.user = user;
    next();
  });
};

// 📌 **Ro‘yxatdan o‘tish**
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Bu email allaqachon mavjud!" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "Ro‘yxatdan o‘tish muvaffaqiyatli!" });
});

// 📌 **Login qilish**
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Email yoki parol noto‘g‘ri!" });

  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ message: "Login muvaffaqiyatli!", user, token });
});

// 📌 **Foydalanuvchi ma’lumotlarini olish**
app.get("/api/profile", authenticate, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// 📌 **Foydalanuvchini logout qilish**
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout muvaffaqiyatli!" });
});

// 📌 **Socket.io orqali chat**
io.on("connection", (socket) => {
  console.log("🟢 Foydalanuvchi ulandi:", socket.id);
  
  socket.on("chatMessage", async (msg) => {
    io.emit("chatMessage", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Foydalanuvchi chiqdi:", socket.id);
  });
});

// 🚀 **Serverni ishga tushirish**
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}/`);
});

  return (
    <div className="admin-panel p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-xl font-bold mb-4">
        Admin Panel - Foydalanuvchi Kameralari
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {streams.map((stream, index) => (
          <div key={index} className="border p-2 rounded-lg bg-gray-700">
            <h3 className="text-lg mb-2">Foydalanuvchi {stream.socketId}</h3>
            <video
              autoPlay
              playsInline
              className="w-full h-auto rounded-lg border"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;

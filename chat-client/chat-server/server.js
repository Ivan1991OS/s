const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ✅ **CORS Middleware (Frontend bilan bog‘lanish)**
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ **MongoDB ulanishi**
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/chat-app")
  .then(() => console.log("✅ MongoDB muvaffaqiyatli ulandi"))
  .catch((err) => {
    console.error("❌ MongoDB ulanishida xatolik:", err.message);
    process.exit(1);
  });

const server = http.createServer(app);

// 🔹 **Foydalanuvchi modeli**
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: { type: String },
  gender: { type: String },
  verificationCode: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  avatar: { type: String, default: "https://api.dicebear.com/6.x/adventurer/svg?seed=User" },
});

const User = mongoose.model("User", UserSchema);

// 📌 **Email Yuborish Konfiguratsiyasi**
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 **Ro‘yxatdan o‘tish (Email orqali tasdiqlash)**
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, birthDate, gender } = req.body;

    if (!name || !email || !password || !birthDate || !gender) {
      return res.status(400).json({ message: "Barcha maydonlar to‘ldirilishi kerak!" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Bu email allaqachon ro‘yxatdan o‘tgan!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    user = new User({ name, email, password: hashedPassword, birthDate, gender, verificationCode });
    await user.save();

    // ✅ Emailga kod yuborish
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Tasdiqlash Kodi",
      text: `Sizning tasdiqlash kodingiz: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("❌ Email yuborishda xatolik:", error);
        return res.status(500).json({ message: "Email yuborishda xatolik!" });
      }

      return res.status(200).json({ message: "Tasdiqlash kodi yuborildi!" });
    });
  } catch (error) {
    console.error("❌ Ro‘yxatdan o‘tishda xatolik:", error);
    return res.status(500).json({ message: "Server xatosi" });
  }
});

// 📌 **Email orqali tasdiqlash**
app.post("/api/verify", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email va kod talab qilinadi!" });
    }

    const user = await User.findOne({ email });

    if (!user || user.verificationCode !== code) {
      return res.status(400).json({ message: "Noto‘g‘ri tasdiqlash kodi!" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    return res.json({ message: "Tasdiqlash muvaffaqiyatli!" });
  } catch (error) {
    console.error("❌ Email tasdiqlashda xatolik:", error);
    return res.status(500).json({ message: "Server xatosi" });
  }
});

// 📌 **Kirish (Login) API**
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email va parol talab qilinadi!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Bunday foydalanuvchi topilmadi!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Noto‘g‘ri parol!" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ message: "Kirish muvaffaqiyatli!", token });
  } catch (error) {
    console.error("❌ Kirishda xatolik:", error);
    return res.status(500).json({ message: "Server xatosi" });
  }
});

// 📌 **Foydalanuvchi Profilini Tekshirish**
app.get("/api/profile", async (req, res) => {
  try {
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Avtorizatsiya talab qilinadi" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
    }

    return res.json(user);
  } catch (error) {
    console.error("❌ Profilni olishda xatolik:", error);
    return res.status(500).json({ message: "Server xatosi" });
  }
});

// 📌 **Foydalanuvchini Logout qilish**
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Chiqish muvaffaqiyatli bajarildi!" });
});

// 🚀 **Serverni ishga tushirish**
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}/`);
});
 
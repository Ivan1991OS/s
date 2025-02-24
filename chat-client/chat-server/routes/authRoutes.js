const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 📌 Ro‘yxatdan o‘tish
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.json({ success: true, message: "Ro‘yxatdan o‘tildi!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xatolik yuz berdi!" });
  }
});

// 📌 Kirish
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Email yoki parol noto‘g‘ri!" });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xatolik yuz berdi!" });
  }
});

module.exports = router;

const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// ✅ Yangi xabar yuborish
router.post("/send", async (req, res) => {
  const { sender, text } = req.body;

  try {
    const message = new Message({ sender, text });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

// ✅ Barcha xabarlarni olish
router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
});

module.exports = router;

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ To‘g‘ri import
import io from "socket.io-client";
import "../styles/chat.css";

const socket = io("http://localhost:3001");

const Chat = () => {
  const { user } = useAuth(); // ✅ Foydalanuvchi ma’lumotlarini olish
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => socket.off("chatMessage");
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        user: user?.email || "Anonim",
        text: message,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("chatMessage", chatMessage);
      setMessages((prevMessages) => [...prevMessages, chatMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>🟢 Online Foydalanuvchilar</h3>
        <ul>
          <li>👤 {user?.email || "Siz"}</li>
        </ul>
      </div>

      <div className="chat-main">
        <h2>💬 Chat</h2>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.user === user?.email ? "user" : "other"}`}>
              <strong>{msg.user}: </strong> [{msg.time}] {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Xabar yozing..."
          />
          <button onClick={sendMessage}>📩 Yuborish</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
  
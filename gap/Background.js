import React from "react";
import { motion } from "framer-motion";
import "../styles/background.css";

const Background = () => {
  return (
    <motion.div
      className="earth-container"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
    >
      <div className="earth"></div>
    </motion.div>
  );
};

export default Background;

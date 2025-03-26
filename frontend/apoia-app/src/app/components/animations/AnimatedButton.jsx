// components/animations/AnimatedButton.jsx
import { motion } from "framer-motion";

const AnimatedButton = ({ children, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;

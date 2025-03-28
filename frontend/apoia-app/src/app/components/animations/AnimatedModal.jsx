// components/animations/AnimatedModal.jsx
import { motion } from "framer-motion";

const modalVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const AnimatedModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg"
        variants={modalVariants}
      >
        <h2 className="text-xl font-bold">Modal</h2>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fechar
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedModal;

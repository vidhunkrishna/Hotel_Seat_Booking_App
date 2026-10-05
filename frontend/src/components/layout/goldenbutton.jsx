import { motion } from "framer-motion";
function Goldenbutton({ name }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="text-center bg-yellow-600/55 px-4 py-2 mt-3 rounded-xl hover:bg-yellow-700/50"
    >
      {name}
    </motion.button>
  );
}

export default Goldenbutton;

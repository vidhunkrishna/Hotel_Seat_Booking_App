import { motion } from "framer-motion";

function StatCard({ title, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.06)",
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: "easeOut",
      }}
      className="bg-white rounded-2xl border border-[#E5E1D8] p-5"
    >
      <div className="bg-[#C89B5A]/10 rounded-xl w-12 h-12 flex items-center justify-center">
        <Icon size={24} color="#C89B5A" />
      </div>

      <p className="font-ui text-[#6B6B6B] text-sm mt-3">{title}</p>

      <h2 className="font-display text-[#171717] text-3xl font-bold mt-1 break-words">
        {value}
      </h2>
    </motion.div>
  );
}

export default StatCard;

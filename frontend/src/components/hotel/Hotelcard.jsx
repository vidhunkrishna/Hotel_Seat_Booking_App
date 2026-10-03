import { easeIn, motion } from "framer-motion";
function Hotelcard({ hotel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.8, ease: easeIn }}
      className="hover:shadow-xl rounded-2xl"
    >
      <img
        src={hotel.image}
        alt={hotel.name}
        className="h-52 w-full object-cover rounded-2xl"
      />
      <div className="p-5">
        <h3 className="font-bold text-xl">{hotel.name}</h3>
        <p className="mt-1 text-gray-500">{hotel.location}</p>

        <p className="mt-3 text-gray-600">{hotel.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-semibold text-yellow-600">
            ★ {hotel.rating}
          </span>

          <button className="rounded-lg bg-[#C89B5A] px-4 py-2 text-white hover:bg-[#B88746]">
            View Hotel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Hotelcard;

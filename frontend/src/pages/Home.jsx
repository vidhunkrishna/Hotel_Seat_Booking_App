import { easeIn, motion } from "framer-motion";
import Hotelcard from "../components/hotel/Hotelcard.jsx";
import { ArrowRight } from "lucide-react";
export default function Home() {
  const hotels = [
    {
      id: 1,
      name: "Taj Palace",
      location: "Mumbai, India",
      rating: 4.8,
      description: "Luxury dining and comfortable seating.",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    },
    {
      id: 2,
      name: "Grand Hyatt",
      location: "Bangalore, India",
      rating: 4.7,
      description: "A premium experience with beautiful spaces.",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    },
    {
      id: 3,
      name: "ITC Grand",
      location: "Chennai, India",
      rating: 4.9,
      description: "Elegant dining with a relaxing atmosphere.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    },
  ];
  return (
    <>
      <div className="relative h-[720px]">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          alt="Luxury hotel"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              className=" text-5xl font-bold"
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Find Your Perfect
              <br />
              <div className="text-yellow-600">Hotel Seat</div>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg mt-4"
            >
              Reserve your favorite table at premium hotels.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-center bg-yellow-600/55 px-6 py-2 mt-3 rounded-xl hover:bg-yellow-700/50"
            >
              Explore Hotels
            </motion.button>
          </div>
        </div>
      </div>
      <section className="bg-[#F7F5F0] px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">Featured Hotels</h2>

            <p className="mt-3 text-gray-600">
              Discover some of our popular hotels.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {hotels.map((hotel) => (
              <Hotelcard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#F7F5F0] px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold">How it works</h1>
          <p className="mt-2 text-gray-600">
            Book your perfect seat in 3 simple steps
          </p>
        </div>
        <div className="flex flex-row justify-center items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeIn, delay: 0 }}
            className="flex flex-col items-center rounded-xl bg-white p-6 m-4 text-[#C89B5A] shadow-md hover:shadow-xl"
          >
            1 <p>Browse Hotels</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <ArrowRight color="#C89B5A" size={24} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeIn, delay: 0.2 }}
            className="flex flex-col items-center rounded-xl bg-white p-6 m-4 text-[#C89B5A] shadow-md hover:shadow-xl"
          >
            2 <p>Choose your seat</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <ArrowRight color="#C89B5A" size={24} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeIn, delay: 0.4 }}
            className="flex flex-col items-center rounded-xl bg-white p-6 m-4 text-[#C89B5A] shadow-md hover:shadow-xl"
          >
            3 <p>Book Instantly</p>
          </motion.div>
        </div>
      </section>
      <section className="bg-white px-8 py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold">Why HotelSeat?</h2>

            <p className="mt-4 text-gray-600">
              A simple and convenient way to discover hotels, choose your
              preferred seat, and make your reservation.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xl text-[#C89B5A]">✓</span>
                <p>Real-time availability</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl text-[#C89B5A]">✓</span>
                <p>Easy and fast booking</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl text-[#C89B5A]">✓</span>
                <p>Secure payment process</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl text-[#C89B5A]">✓</span>
                <p>Digital QR confirmation</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
              alt="Hotel dining"
              className="h-96 w-full rounded-2xl object-cover"
            />
          </motion.div>
        </div>
      </section>
      <section className="bg-[#171717] px-8 py-20 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold">
            Ready to Find Your Perfect Seat?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-300">
            Discover amazing hotels, choose your preferred seat, and make your
            reservation with ease.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 rounded-xl bg-[#C89B5A] px-7 py-3 font-semibold text-white hover:bg-[#B88746]"
          >
            Explore Hotels
          </motion.button>
        </motion.div>
      </section>
    </>
  );
}

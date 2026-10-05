import { useNavigate } from "react-router-dom";
import { easeInOut, easeOut, motion } from "framer-motion";
import { Calendar, Compass, TicketCheck, Utensils } from "lucide-react";
import Goldenbutton from "../components/layout/goldenbutton.jsx";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-[#171717] w-full h-[54px] flex flex-row items-center ">
        <p className="text-white m-4 font-display">HotelSeatBooking</p>

        <div className="flex ml-auto mr-4 text-white font-ui ">
          <p className="mr-4">Hotels</p>
          <p className="mr-4">My Bookings</p>
          <p className="mr-4">Notifications </p>
          <p className="mr-4">Profile</p>

          <button
            className="cursor-pointer hover:text-yellow-600"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-[#F7F5F0] m-5 flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:flex-1">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: easeOut }}
          >
            <div className="font-bold text-2xl">Welcome back </div>

            <div className="text-[#6B6B6B]">
              Discover hotels, choose your perfect table, and make your next
              dining experience memorable.
            </div>
          </motion.div>

          <Goldenbutton name="Explore Hotels" />
        </div>

        <motion.div
          className="w-full md:flex-1 flex justify-center"
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: easeInOut,
            delay: 0.2,
          }}
        >
          <motion.img
            src="image.png"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[500px] max-h-[350px] md:max-h-[450px] object-cover rounded-2xl shadow-xl"
          />
        </motion.div>
      </div>

      <div className="grid m-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="col-span-1 md:col-span-2 bg-[#FFFFFF] border-[#E5E1D8] border-[1px] rounded-[20px] min-h-[260px] p-6"
        >
          <div className="flex flex-col md:flex-row">
            <div className="flex-1">
              <div className="font-semibold text-sm text-[#C89B5A]">
                DISCOVER
              </div>

              <div className="text-[#171717] font-ui text-2xl font-bold">
                Find your perfect hotel
              </div>

              <div className="text-[#6B6B6B]">
                Explore hotels, check table availability, and reserve your
                preferred spot.
              </div>

              <Goldenbutton name="Explore Hotels" />
            </div>

            <div className="overflow-hidden rounded-2xl">
              <motion.img
                src="table.jpg"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-[400px] h-[220px] md:h-[240px] object-cover rounded-2xl"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="col-span-1 bg-[#FFFFFF] border-[#E5E1D8] border-[1px] rounded-[20px] min-h-[260px] p-6"
        >
          <div className="flex gap-1 items-center">
            <Calendar color="#C89B5A" size={16} />

            <p className="font-semibold text-[#C89B5A] text-sm">
              UPCOMING BOOKINGS
            </p>
          </div>

          <div className="text-xl font-ui font-bold text-[#171717]">
            No upcoming bookings
          </div>

          <div className="text-base text-[#6B6B6B]">
            Your next reservation will appear here.
          </div>

          <Goldenbutton name="View My Bookings" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -4 }}
          className="col-span-1 bg-[#FFFFFF] border-[#E5E1D8] border-[1px] rounded-[20px] p-6 min-h-[160px]"
        >
          <div className="flex gap-1 items-center">
            <TicketCheck color="#C89B5A" size={16} />

            <p className="font-semibold text-[#C89B5A] text-sm">
              BOOKING SUMMARY
            </p>
          </div>

          <div className="text-xl font-ui font-bold text-[#171717]">
            Your Reservations
          </div>

          <div className="text-base text-[#6B6B6B]">No reservations yet</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -4 }}
          className="col-span-1 bg-[#FFFFFF] border-[#E5E1D8] border-[1px] rounded-[20px] p-6 min-h-[160px]"
        >
          <div className="flex gap-1 items-center">
            <Utensils color="#C89B5A" size={16} />

            <p className="font-semibold text-[#C89B5A] text-sm">
              DINING ACTIVITY
            </p>
          </div>

          <div className="text-xl font-ui font-bold text-[#171717]">
            Your Dining Journey
          </div>

          <div className="text-base text-[#6B6B6B]">
            Start exploring hotels to build your reservation history.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ y: -4 }}
          className="col-span-1 bg-[#FFFFFF] border-[#E5E1D8] border-[1px] rounded-[20px] p-6 min-h-[160px]"
        >
          <div className="flex gap-1 items-center">
            <Compass color="#C89B5A" size={16} />

            <p className="font-semibold text-[#C89B5A] text-sm">FOR YOU</p>
          </div>

          <div className="text-xl font-ui font-bold text-[#171717]">
            Discover Something New
          </div>

          <div className="text-base text-[#6B6B6B]">
            Explore available hotels and find a table for your next experience.
          </div>

          <Goldenbutton name="Explore Hotels" />
        </motion.div>
      </div>
    </>
  );
}

export default Dashboard;

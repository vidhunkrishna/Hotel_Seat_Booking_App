import { useNavigate } from "react-router-dom";
import { easeInOut, easeOut, motion } from "framer-motion";
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
          <motion.button
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-center bg-yellow-600/55 px-4 py-2 mt-3 rounded-xl hover:bg-yellow-700/50"
          >
            Explore Hotels
          </motion.button>
        </div>
        <motion.div
          className="w-full md:flex-1 flex justify-center"
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: easeInOut, delay: 0.2 }}
          whileHover={{ scale: 0.99 }}
        >
          <img
            src="image.png"
            className="w-full max-w-[500px] max-h-[350px] md:max-h-[450px] object-cover rounded-2xl shadow-xl"
          />
        </motion.div>
      </div>
      <div className="grid m-3 grid-cols-3 gap-2 ">
        <div className="col-span-2 bg-[#FFFFFF] border-[#E5E1D8] border-[1px] rounded-[20px] min-h-[260px] p-6">
          <div className="flex flex-row">
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
              <motion.button
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-center bg-yellow-600/55 px-4 py-2 mt-3 rounded-xl hover:bg-yellow-700/50"
              >
                Explore Hotels
              </motion.button>
            </div>
            <div>
              <img src="table.jpg" className="w-100 h-60 rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-red-500 min-h-[260px]">
          Upcoming Bookings
        </div>
        <div className="col-span-1 bg-red-500 min-h-[160px]">Bookings</div>
        <div className="col-span-1 bg-red-500 min-h-[160px]">Notifications</div>
        <div className="col-span-1 bg-red-500 min-h-[160px]">Profile</div>
      </div>
    </>
  );
}

export default Dashboard;

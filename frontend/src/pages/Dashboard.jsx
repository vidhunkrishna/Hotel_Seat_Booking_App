import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { easeInOut, easeOut, motion } from "framer-motion";
import { Calendar, Compass, TicketCheck, Utensils } from "lucide-react";
import Goldenbutton from "../components/layout/goldenbutton.jsx";
import NotificationBell from "../components/ui/NotificationBell.jsx";
import { getMyBookings } from "../services/bookingservice.js";
import { logout } from "@/utils/auth.js";

const formatShortDate = (dateValue) => {
  if (!dateValue) return "";

  const parsed =
    typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
      ? new Date(`${dateValue}T00:00:00`)
      : new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) return String(dateValue);

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const role = localStorage.getItem("role");
  const isAdmin = role === "hotel_admin" || role === "super_admin";

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const result = await getMyBookings();
        const list = Array.isArray(result) ? result : result?.bookings || [];
        if (isMounted) {
          setBookings(list);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Unable to log out. Please try again.");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const upcomingBookings = bookings
    .filter(
      (b) =>
        (b.status === "Confirmed" || b.status === "Pending") &&
        (!b.date || b.date >= todayStr),
    )
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const nextBooking = upcomingBookings[0] || null;
  const confirmedCount = bookings.filter(
    (b) => b.status === "Confirmed",
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "Completed",
  ).length;

  const latestBookingWithHotel = bookings.find(
    (b) => typeof b.hotel === "object" && b.hotel?.name,
  );

  return (
    <div className="min-h-screen bg-[#F7F5F0] pb-6">
      <div className="bg-[#171717] w-full h-[54px] flex flex-row items-center">
        <p className="text-white m-4 font-display">HotelSeatBooking</p>

        <div className="flex items-center ml-auto mr-4 text-white font-ui">
          <Link
            className="mr-4 hover:text-[#C89B5A] transition-colors"
            to="/hotels"
          >
            Hotels
          </Link>
          <Link
            className="mr-4 hover:text-[#C89B5A] transition-colors"
            to="/bookings"
          >
            My Bookings
          </Link>

          {isAdmin && (
            <Link
              className="mr-4 hover:text-[#C89B5A] transition-colors"
              to="/scan-qr"
            >
              Scan QR
            </Link>
          )}
          {isAdmin && (
            <Link
              className="mr-4 hover:text-[#C89B5A] transition-colors"
              to="/analytics"
            >
              Analytics
            </Link>
          )}

          <NotificationBell />

          <Link
            className="mr-4 hover:text-[#C89B5A] transition-colors"
            to="/profile"
          >
            Profile
          </Link>

          <button
            className="cursor-pointer hover:text-yellow-600"
            onClick={() => handleLogout}
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

          <Goldenbutton name="Explore Hotels" l="/hotels" />
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

              <Goldenbutton name="Explore Hotels" l="/hotels" />
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

          {nextBooking ? (
            <>
              <div className="text-xl font-ui font-bold text-[#171717] mt-1">
                {typeof nextBooking.hotel === "object"
                  ? nextBooking.hotel?.name
                  : "Upcoming Reservation"}
              </div>

              <div className="text-base text-[#6B6B6B] mt-1">
                {formatShortDate(nextBooking.date)} ·{" "}
                {formatTime(nextBooking.startTime)} –{" "}
                {formatTime(nextBooking.endTime)} ({nextBooking.status})
              </div>
            </>
          ) : (
            <>
              <div className="text-xl font-ui font-bold text-[#171717]">
                No upcoming bookings
              </div>

              <div className="text-base text-[#6B6B6B]">
                Your next reservation will appear here.
              </div>
            </>
          )}

          <Goldenbutton name="View My Bookings" l="/bookings" />
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
            {bookings.length > 0
              ? `${bookings.length} ${bookings.length === 1 ? "Reservation" : "Reservations"}`
              : "Your Reservations"}
          </div>

          <div className="text-base text-[#6B6B6B]">
            {bookings.length > 0
              ? `${confirmedCount} confirmed · ${completedCount} completed`
              : "No reservations yet"}
          </div>
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
            {latestBookingWithHotel
              ? latestBookingWithHotel.hotel.name
              : "Your Dining Journey"}
          </div>

          <div className="text-base text-[#6B6B6B]">
            {latestBookingWithHotel
              ? `Last reserved on ${formatShortDate(latestBookingWithHotel.date)}`
              : "Start exploring hotels to build your reservation history."}
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
            Explore available hotels and find a table for your next experience
          </div>

          <Goldenbutton name="Explore Hotels" l="/hotels" />
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;

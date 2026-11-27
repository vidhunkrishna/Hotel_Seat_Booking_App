import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CircleCheck,
  CircleOff,
  Edit,
  EllipsisVertical,
} from "lucide-react";
import {
  managedHotels,
  addHotel,
  updateHotel,
  deleteHotel,
} from "@/services/hotelservice.js";
import StatCard from "@/components/analytics/Statcard.jsx";
import Goldenbutton from "@/components/layout/goldenbutton.jsx";
function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const fetchHotels = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await managedHotels();
      setHotels(data);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHotels();
  }, []);
  const totalHotels = hotels.length;
  const activeHotels = hotels.filter(
    (hotel) => hotel.status === "Active",
  ).length;
  const inactiveHotels = hotels.filter(
    (hotel) => hotel.status === "inActive",
  ).length;
  return (
    <div className="min-h-screen bg-[#F7F5F0] m-4">
      <motion.button
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-2 text-[#6B6B6B] hover:text-[#C89B5A] font-ui text-sm cursor-pointer mb-5 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </motion.button>
      <div className="flex flex-row">
        <div className="font-display mx-3 text-3xl font-bold">
          Manage Hotels
        </div>
        <div className="ml-auto">
          <Goldenbutton name="+ Add Hotel" />
        </div>
      </div>
      <div className="text-[#6B6B6B] mx-3 mb-3">
        Manage and monitor your hotel properties.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Hotels"
          value={totalHotels}
          icon={Building2}
          delay={0}
        />

        <StatCard
          title="Active Hotels"
          value={activeHotels}
          icon={CircleCheck}
          delay={0.1}
        />

        <StatCard
          title="Inactive Hotels"
          value={inactiveHotels}
          icon={CircleOff}
          delay={0.2}
        />
      </div>
      <div className="font-display font-bold text-2xl mt-2">Your Hotels</div>
      {hotels.map((hotel) => (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          className="bg-white border border-[#E5E1D8] my-3 p-4 rounded-xl flex items-center gap-3"
          key={hotel._id}
        >
          <Building2 color="#C89B5A" size={22} />

          <div className="flex flex-col flex-1">
            <div className="font-ui font-semibold text-[#171717]">
              {hotel.name}
            </div>

            <div
              className={`text-sm mt-1 ${
                hotel.status === "Active" ? "text-[#4F8469]" : "text-[#C77670]"
              }`}
            >
              {hotel.status === "Active" ? "Active" : "Inactive"}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#6B6B6B]">
            <Edit
              size={18}
              className="cursor-pointer hover:text-[#C89B5A] transition-colors"
            />

            <EllipsisVertical
              size={18}
              className="cursor-pointer hover:text-[#C89B5A] transition-colors"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default ManageHotels;

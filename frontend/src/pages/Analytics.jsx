import { getAnalytics } from "@/services/analyticsservice.js";
import { managedHotels } from "@/services/hotelservice.js";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck,
  IndianRupee,
  Armchair,
  Star,
  CircleCheck,
  MessageSquare,
  Building2,
  ArrowLeft,
  ChartNoAxesCombined,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/analytics/StatCard.jsx";
import BookingPieChart from "@/components/analytics/BookingPieChart.jsx";
import BookingBarChart from "@/components/analytics/BookingBarChart.jsx";

function Analytics() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState("");

  const loading = hotelsLoading || analyticsLoading;

  useEffect(() => {
    let active = true;

    const fetchHotels = async () => {
      setHotelsLoading(true);

      try {
        const data = await managedHotels();

        if (!active) return;

        setHotels(data);

        if (data.length > 0) {
          setSelectedHotel(data[0]._id);
          setAnalyticsLoading(true);
        }
      } catch (error) {
        if (active) {
          setError(error.response?.data?.message || error.message);
        }
      } finally {
        if (active) {
          setHotelsLoading(false);
        }
      }
    };

    fetchHotels();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedHotel) return;

    let active = true;

    const fetchAnalytics = async () => {
      setAnalyticsLoading(true);
      setError("");
      setAnalytics(null);

      try {
        const data = await getAnalytics(selectedHotel);

        if (active) {
          setAnalytics(data);
        }
      } catch (error) {
        if (active) {
          setError(error.response?.data?.message || error.message);
        }
      } finally {
        if (active) {
          setAnalyticsLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      active = false;
    };
  }, [selectedHotel]);

  const stats = analytics
    ? [
        {
          title: "Total Bookings",
          value: analytics.bookings.total,
          icon: CalendarCheck,
        },
        {
          title: "Total Revenue",
          value: new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
          }).format(analytics.revenue),
          icon: IndianRupee,
        },
        {
          title: "Total Tables",
          value: analytics.tables,
          icon: Armchair,
        },
        {
          title: "Average Rating",
          value:
            analytics.reviews.total > 0
              ? `${analytics.reviews.averageRating.toFixed(1)} / 5`
              : "No ratings",
          icon: Star,
        },
        {
          title: "Completed Bookings",
          value: analytics.bookings.completed,
          icon: CircleCheck,
        },
        {
          title: "Total Reviews",
          value: analytics.reviews.total,
          icon: MessageSquare,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="max-w-[1500px] mx-auto p-4 md:p-8">
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

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3">
              <ChartNoAxesCombined size={30} color="#C89B5A" />

              <h1 className="font-display text-[#171717] font-bold text-3xl md:text-4xl">
                Hotel Analytics
              </h1>
            </div>

            <p className="font-ui text-[#6B6B6B] text-sm mt-2">
              Monitor your hotel's performance and reservation statistics.
            </p>
          </div>

          <div className="font-ui text-sm text-[#6B6B6B]">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="mt-6 bg-white rounded-2xl p-5 border border-[#E5E1D8]"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#C89B5A]/10 flex items-center justify-center">
                <Building2 size={24} color="#C89B5A" />
              </div>

              <div>
                <label
                  htmlFor="hotel"
                  className="font-display text-[#171717] font-semibold text-lg"
                >
                  Select Hotel
                </label>

                <p className="font-ui text-[#6B6B6B] text-sm">
                  Choose a hotel to view its performance
                </p>
              </div>
            </div>

            <select
              id="hotel"
              value={selectedHotel}
              disabled={hotelsLoading || hotels.length === 0}
              onChange={(e) => {
                setAnalytics(null);
                setError("");
                setAnalyticsLoading(true);
                setSelectedHotel(e.target.value);
              }}
              className="rounded-xl border border-[#E5E1D8] bg-[#F7F5F0] px-4 py-3 w-full md:w-[300px] font-ui text-[#171717] outline-none focus:border-[#C89B5A] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {hotels.length === 0 && (
                <option value="">
                  {hotelsLoading ? "Loading hotels..." : "No hotels available"}
                </option>
              )}

              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-10 h-10 rounded-full border-4 border-[#E5E1D8] border-t-[#C89B5A]"
              />

              <p className="font-ui text-[#6B6B6B] text-sm">
                {hotelsLoading ? "Loading hotels..." : "Loading analytics..."}
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-6 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-center font-ui"
            >
              <AlertCircle size={30} className="mx-auto mb-3" />

              <h2 className="font-semibold">Unable to load analytics</h2>

              <p className="text-sm mt-2">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-100 px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : hotels.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 bg-white rounded-2xl border border-[#E5E1D8] p-12 text-center"
            >
              <Building2 size={50} color="#C89B5A" className="mx-auto mb-4" />

              <h2 className="font-display text-[#171717] text-xl font-semibold">
                No Managed Hotels Found
              </h2>

              <p className="font-ui text-[#6B6B6B] text-sm mt-2">
                You do not have any hotels assigned to your account.
              </p>
            </motion.div>
          ) : analytics ? (
            <motion.div
              key={selectedHotel}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="mb-5">
                <h2 className="font-display text-[#171717] text-2xl font-bold">
                  {analytics.hotel}
                </h2>

                <p className="font-ui text-[#6B6B6B] text-sm mt-1">
                  Overall hotel performance and booking activity
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    delay={index * 0.08}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
                <BookingPieChart bookings={analytics.bookings} />

                <BookingBarChart bookings={analytics.bookings} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl border border-[#E5E1D8] p-5 mt-6"
              >
                <h2 className="font-display text-[#171717] text-xl font-bold">
                  Booking Performance
                </h2>

                <p className="font-ui text-[#6B6B6B] text-sm mt-1">
                  Percentage breakdown of all reservations
                </p>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      name: "Completed",
                      value: analytics.bookings.completed,
                      color: "#C89B5A",
                    },
                    {
                      name: "Confirmed",
                      value: analytics.bookings.confirmed,
                      color: "#4F8469",
                    },
                    {
                      name: "Pending",
                      value: analytics.bookings.pending,
                      color: "#E6BC63",
                    },
                    {
                      name: "Cancelled",
                      value: analytics.bookings.cancelled,
                      color: "#C77670",
                    },
                  ].map((item, index) => {
                    const percentage =
                      analytics.bookings.total > 0
                        ? (item.value / analytics.bookings.total) * 100
                        : 0;

                    return (
                      <div key={item.name}>
                        <div className="flex justify-between items-center font-ui text-sm mb-2">
                          <span className="text-[#171717]">{item.name}</span>

                          <span className="text-[#6B6B6B]">
                            {item.value} bookings · {percentage.toFixed(1)}%
                          </span>
                        </div>

                        <div className="h-3 bg-[#F7F5F0] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${percentage}%`,
                            }}
                            transition={{
                              duration: 1,
                              delay: index * 0.15,
                              ease: "easeOut",
                            }}
                            style={{
                              backgroundColor: item.color,
                            }}
                            className="h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              <p className="text-center font-ui text-[#6B6B6B] text-xs mt-6 pb-4">
                Analytics generated from your hotel's reservation records.
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Analytics;

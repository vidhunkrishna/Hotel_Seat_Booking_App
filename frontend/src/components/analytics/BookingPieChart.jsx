import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function BookingPieChart({ bookings }) {
  const data = [
    {
      name: "Completed",
      value: bookings.completed,
      color: "#C89B5A",
    },
    {
      name: "Confirmed",
      value: bookings.confirmed,
      color: "#4F8469",
    },
    {
      name: "Pending",
      value: bookings.pending,
      color: "#E6BC63",
    },
    {
      name: "Cancelled",
      value: bookings.cancelled,
      color: "#C77670",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl border border-[#E5E1D8] p-5 min-w-0"
    >
      <h2 className="font-display text-[#171717] text-xl font-bold">
        Booking Distribution
      </h2>

      <p className="font-ui text-[#6B6B6B] text-sm mt-1">
        Reservations categorized by booking status
      </p>

      {bookings.total > 0 ? (
        <div className="w-full h-[320px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
                animationDuration={1000}
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>

              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#171717"
                fontSize={28}
                fontWeight="bold"
              >
                {bookings.total}
              </text>

              <text
                x="50%"
                y="45%"
                dy={24}
                textAnchor="middle"
                fill="#6B6B6B"
                fontSize={12}
              >
                Total Bookings
              </text>

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #E5E1D8",
                  backgroundColor: "#FFFFFF",
                }}
              />

              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[320px] flex flex-col items-center justify-center">
          <div className="w-40 h-40 rounded-full border-[25px] border-[#E5E1D8] flex items-center justify-center">
            <span className="font-display text-3xl font-bold text-[#6B6B6B]">
              0
            </span>
          </div>

          <p className="font-ui text-[#6B6B6B] text-sm mt-4">
            No bookings available
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default BookingPieChart;

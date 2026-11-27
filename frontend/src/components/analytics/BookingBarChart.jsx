import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BookingBarChart({ bookings }) {
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
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-2xl border border-[#E5E1D8] p-5 min-w-0"
    >
      <h2 className="font-display text-[#171717] text-xl font-bold">
        Booking Status Overview
      </h2>

      <p className="font-ui text-[#6B6B6B] text-sm mt-1">
        Compare reservations across different statuses
      </p>

      <div className="w-full h-[320px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 15,
              right: 10,
              left: -20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#E5E1D8"
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B6B6B",
                fontSize: 11,
              }}
              interval={0}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6B6B6B",
                fontSize: 12,
              }}
            />

            <Tooltip
              cursor={{ fill: "#F7F5F0" }}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E1D8",
                borderRadius: "12px",
              }}
            />

            <Bar
              dataKey="value"
              name="Bookings"
              radius={[8, 8, 0, 0]}
              maxBarSize={65}
              animationDuration={1000}
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default BookingBarChart;

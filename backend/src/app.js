import express from "express";
import cors from "cors";
import { router } from "./routes/auth.route.js";
import { hotelRouter } from "./routes/hotel.route.js";
import { tableRouter } from "./routes/table.route.js";
import { bookingRouter } from "./routes/bookings.route.js";
import { reviewRouter } from "./routes/reviews.route.js";
import { notificationRouter } from "./routes/notifications.route.js";
import { paymentsRouter } from "./routes/payments.route.js";
import { qrRouter } from "./routes/qr.route.js";
import { analyticsRouter } from "./routes/analytics.route.js";
import morgon from "morgan";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgon("dev"));
app.use("/api", router);
app.use("/api/hotels", hotelRouter);
app.use("/api", tableRouter);
app.use("/api", bookingRouter);
app.use("/api", reviewRouter);
app.use("/api", notificationRouter);
app.use("/api", paymentsRouter);
app.use("/api", qrRouter);
app.use("/api", analyticsRouter);
export default app;

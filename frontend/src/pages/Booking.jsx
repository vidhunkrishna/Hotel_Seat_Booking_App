import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { gethotelsByid } from "../services/hotelservice.js";
import { createBooking } from "../services/bookingservice.js";
import { createPayment, verifyPayment } from "../services/paymentservice.js";

import ClockTimePicker from "@/components/ui/ClockTimePicker.jsx";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedtable = [], id } = location.state || {};

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bookingDate, setBookingDate] = useState(undefined);

  const [data, setData] = useState(null);
  const [loadingHotel, setLoadingHotel] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoadingHotel(false);
      return;
    }

    let isMounted = true;

    const gethotel = async () => {
      try {
        const result = await gethotelsByid(id);

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Unable to load hotel details.",
          );
        }
      } finally {
        if (isMounted) {
          setLoadingHotel(false);
        }
      }
    };

    gethotel();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const maxGuests = selectedtable.reduce(
    (total, table) => total + Number(table.capacity || 0),
    0,
  );

  const totalPrice = selectedtable.reduce(
    (total, table) => total + Number(table.price || 0),
    0,
  );

  const formatTime = (time) => {
    if (!time) return "Not selected";

    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const timeError =
    startTime && endTime && endTime <= startTime
      ? "End time must be later than start time."
      : "";

  const isFormValid =
    bookingDate &&
    startTime &&
    endTime &&
    !timeError &&
    Number.isInteger(Number(guestCount)) &&
    Number(guestCount) >= 1 &&
    Number(guestCount) <= maxGuests;

  const handlePayment = async (booking) => {
    if (!window.Razorpay) {
      setErrorMessage(
        "Razorpay SDK failed to load. Please refresh the page and try again.",
      );
      return;
    }

    try {
      setIsPaying(true);
      setErrorMessage("");

      const { payment, keyId } = await createPayment(booking._id);

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(payment.amount * 100),
        currency: payment.currency || "INR",
        name: data?.name || "Hotel Table Reservation",
        description: `Booking #${booking._id}`,
        order_id: payment.razorpayOrderId,
        handler: async function (response) {
          try {
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setPaymentDetails(verificationResult);
            setCreatedBooking((prev) => ({
              ...prev,
              status: "Confirmed",
            }));
          } catch (verifyError) {
            setErrorMessage(
              verifyError.response?.data?.message ||
                "Payment verification failed. Please contact support.",
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
            setErrorMessage(
              "Payment cancelled. Click 'Complete Payment' to finish your reservation.",
            );
          },
        },
        theme: {
          color: "#C89B5A",
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response) {
        setIsPaying(false);
        setErrorMessage(
          response.error?.description || "Payment failed. Please try again.",
        );
      });

      razorpayInstance.open();
    } catch (error) {
      setIsPaying(false);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to initiate payment.",
      );
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (createdBooking && !paymentDetails) {
      await handlePayment(createdBooking);
      return;
    }

    setErrorMessage("");

    if (!bookingDate || !startTime || !endTime) {
      setErrorMessage("Please select your booking date and time.");
      return;
    }

    if (timeError) {
      setErrorMessage(timeError);
      return;
    }

    if (
      !Number.isInteger(Number(guestCount)) ||
      Number(guestCount) < 1 ||
      Number(guestCount) > maxGuests
    ) {
      setErrorMessage("Please enter a valid number of guests.");
      return;
    }

    try {
      setIsSubmitting(true);

      const bookingData = {
        hotel: id,
        tables: selectedtable.map((table) => table._id),
        date: formatDateForAPI(bookingDate),
        startTime,
        endTime,
        guests: Number(guestCount),
      };

      const result = await createBooking(bookingData);
      setCreatedBooking(result);
      setIsSubmitting(false);

      await handlePayment(result);
    } catch (error) {
      setIsSubmitting(false);
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while creating your booking.",
      );
    }
  };

  if (!id || !selectedtable.length) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-5">
        <div className="bg-white rounded-xl border border-[#E5E1D8] p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">
            Invalid Booking Session
          </h2>

          <p className="text-sm text-[#6B6B6B]">
            Please go back and select your tables again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="font-bold font-display text-2xl sm:text-3xl lg:text-4xl">
            Complete Your Reservation
          </h1>

          <p className="text-sm sm:text-base mt-2 text-[#6B6B6B]">
            {data?.name || (loadingHotel ? "Loading hotel..." : "Hotel")} ·
            Complete your booking details
          </p>
        </div>

        {/* Booking / Payment Status Banner */}
        {createdBooking && (
          <div className="mb-6 bg-white border border-green-200 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="text-green-600 text-2xl">✓</div>

                <div>
                  <h2 className="font-semibold text-lg text-green-700">
                    {paymentDetails
                      ? "Booking & Payment Confirmed!"
                      : "Booking Created — Awaiting Payment"}
                  </h2>

                  <p className="text-sm text-[#6B6B6B] mt-1">
                    {paymentDetails
                      ? "Your table reservation is confirmed."
                      : "Complete your payment to confirm this reservation."}
                  </p>

                  <p className="text-sm mt-2">
                    Booking ID:{" "}
                    <span className="font-semibold break-all">
                      {createdBooking._id}
                    </span>
                  </p>

                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span className="font-semibold">
                      {createdBooking.status || "Pending"}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/hotels/myBookings")}
                      className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      View My Bookings
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/hotels")}
                      className="border border-[#E5E1D8] hover:border-[#C89B5A] text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Browse More Hotels
                    </button>
                  </div>
                </div>
              </div>

              {!paymentDetails && (
                <button
                  type="button"
                  disabled={isPaying}
                  onClick={() => handlePayment(createdBooking)}
                  className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 self-start sm:self-center"
                >
                  {isPaying ? "Opening Payment..." : "Pay Now"}
                </button>
              )}
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleBooking}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="lg:col-span-3 space-y-5">
              <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6">
                <h3 className="font-semibold text-lg font-display mb-4">
                  Booking Date
                </h3>

                <Popover>
                  <PopoverTrigger
                    render={
                      <button
                        type="button"
                        disabled={Boolean(createdBooking)}
                        className="w-full flex items-center justify-between border border-[#E5E1D8] rounded-lg px-4 py-3 text-left hover:border-[#C89B5A] transition-colors disabled:bg-gray-100"
                      />
                    }
                  >
                    <span>
                      {bookingDate
                        ? bookingDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Select booking date"}
                    </span>

                    <span className="text-[#C89B5A]">▦</span>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      disabled={{ before: new Date() }}
                      className="rounded-lg"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6">
                <h3 className="font-semibold text-lg font-display mb-4">
                  Booking Time
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ClockTimePicker
                    label="From"
                    value={startTime}
                    onChange={setStartTime}
                  />

                  <ClockTimePicker
                    label="To"
                    value={endTime}
                    onChange={setEndTime}
                  />
                </div>

                {timeError && (
                  <p className="text-sm text-red-500 mt-3">{timeError}</p>
                )}
              </div>

              <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6">
                <h3 className="font-semibold text-lg font-display mb-4">
                  Number of Guests
                </h3>

                <input
                  type="number"
                  min="1"
                  max={maxGuests}
                  step="1"
                  value={guestCount}
                  disabled={Boolean(createdBooking)}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value === "") {
                      setGuestCount("");
                      return;
                    }

                    const guests = Number(value);

                    if (!Number.isInteger(guests)) return;

                    setGuestCount(Math.min(Math.max(1, guests), maxGuests));
                  }}
                  onBlur={() => {
                    if (guestCount === "" || Number(guestCount) < 1) {
                      setGuestCount(1);
                    }
                  }}
                  className="w-full border border-[#E5E1D8] rounded-lg px-4 py-3 outline-none focus:border-[#C89B5A] focus:ring-2 focus:ring-[#C89B5A]/20 disabled:bg-gray-100"
                />

                <p className="text-xs text-[#6B6B6B] mt-2">
                  Maximum capacity: {maxGuests} guests
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6 lg:sticky lg:top-6">
                <h2 className="font-display text-xl font-semibold">
                  Booking Summary
                </h2>

                <p className="text-sm text-[#6B6B6B] mt-1">
                  Review your reservation details
                </p>

                <div className="border-t border-[#E5E1D8] my-5" />

                {/* Hotel */}
                <div className="mb-5">
                  <p className="text-xs text-[#8A8A8A]">Hotel</p>

                  <p className="font-semibold mt-1">
                    {data?.name || "Loading hotel..."}
                  </p>
                </div>

                <div className="mb-5">
                  <p className="text-xs text-[#8A8A8A] mb-3">
                    Selected Tables ({selectedtable.length})
                  </p>

                  <div className="space-y-3">
                    {selectedtable.map((table) => (
                      <div
                        key={table._id}
                        className="flex justify-between items-center gap-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            Table {table.tableNumber}
                          </p>

                          <p className="text-xs text-[#8A8A8A]">
                            Capacity: {table.capacity} guests
                          </p>
                        </div>

                        <p className="font-medium whitespace-nowrap">
                          ₹{Number(table.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E5E1D8] my-5" />

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#8A8A8A]">Date</span>

                    <span className="font-medium text-right">
                      {bookingDate
                        ? bookingDate.toLocaleDateString("en-IN")
                        : "Not selected"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#8A8A8A]">From</span>

                    <span className="font-medium">{formatTime(startTime)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#8A8A8A]">To</span>

                    <span className="font-medium">{formatTime(endTime)}</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#8A8A8A]">Guests</span>

                    <span className="font-medium">{guestCount || 0}</span>
                  </div>
                </div>

                <div className="border-t border-[#E5E1D8] my-5" />

                <div className="flex justify-between items-center gap-3">
                  <span className="font-semibold">Total Amount</span>

                  <span className="text-xl sm:text-2xl font-bold text-[#C89B5A]">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-xs text-[#8A8A8A] mt-2">
                  Final amount is calculated and validated by the server.
                </p>

                <button
                  type="submit"
                  disabled={
                    !isFormValid ||
                    isSubmitting ||
                    isPaying ||
                    Boolean(paymentDetails)
                  }
                  className="w-full mt-6 bg-[#C89B5A] hover:bg-[#B48748] text-white font-semibold py-3.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Creating Booking..."
                    : isPaying
                      ? "Processing Payment..."
                      : paymentDetails
                        ? "Payment Completed"
                        : createdBooking
                          ? "Complete Payment"
                          : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Booking;

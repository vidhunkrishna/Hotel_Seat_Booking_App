import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../services/bookingservice.js";
import { generateQR } from "../services/qrservice.js";

const FILTER_TABS = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

const formatAddress = (address) => {
  if (!address) return "";
  if (typeof address === "string") return address;

  const { street, city, state, pincode } = address;
  return [street, city, state, pincode].filter(Boolean).join(", ");
};

const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";

  const parsed =
    typeof dateValue === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
      ? new Date(`${dateValue}T00:00:00`)
      : new Date(dateValue);

  if (Number.isNaN(parsed.getTime())) return String(dateValue);

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "N/A";

  const [hours, minutes] = time.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getTablesText = (booking) => {
  if (Array.isArray(booking.tables) && booking.tables.length > 0) {
    return booking.tables
      .map((t) => (typeof t === "object" ? `Table ${t.tableNumber}` : t))
      .join(", ");
  }

  if (booking.table) {
    return typeof booking.table === "object"
      ? `Table ${booking.table.tableNumber}`
      : booking.table;
  }

  return "N/A";
};

const getStatusBadgeStyle = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-50 text-green-700 border-green-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Cancelled":
      return "bg-red-50 text-red-600 border-red-200";
    case "Completed":
      return "bg-stone-100 text-stone-700 border-stone-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // QR Modal State
  const [selectedQrBooking, setSelectedQrBooking] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getMyBookings();
        const list = Array.isArray(result) ? result : result?.bookings || [];

        if (isMounted) {
          setBookings(list);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
              "Unable to load your reservations.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);
      setErrorMessage("");
      setSuccessMessage("");

      await cancelBooking(bookingId);

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );

      setConfirmCancelId(null);
      setSuccessMessage("Reservation cancelled successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleOpenQrModal = async (booking) => {
    setSelectedQrBooking(booking);
    setQrError("");
    setQrImage("");

    const cacheKey = `qr_${booking._id}`;
    const cachedQr = localStorage.getItem(cacheKey);

    if (cachedQr) {
      setQrImage(cachedQr);
      return;
    }

    try {
      setQrLoading(true);
      const data = await generateQR(booking._id);

      if (data?.qrCode) {
        localStorage.setItem(cacheKey, data.qrCode);
        setQrImage(data.qrCode);
      } else {
        setQrError("Unable to load QR pass.");
      }
    } catch (error) {
      setQrError(
        error.response?.data?.message ||
          "Unable to generate QR pass for this booking.",
      );
    } finally {
      setQrLoading(false);
    }
  };

  const handleCloseQrModal = () => {
    setSelectedQrBooking(null);
    setQrImage("");
    setQrError("");
    setQrLoading(false);
  };

  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  const getTabCount = (tab) =>
    tab === "All"
      ? bookings.length
      : bookings.filter((b) => b.status === tab).length;

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-bold font-display text-2xl sm:text-3xl lg:text-4xl">
              My Reservations
            </h1>
            <p className="text-sm sm:text-base mt-2 text-[#6B6B6B]">
              View and manage your upcoming and past table bookings
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/hotels")}
            className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors self-start sm:self-auto"
          >
            Book a Table
          </button>
        </div>

        {/* Feedback Banners */}
        {successMessage && (
          <div className="mb-6 bg-white border border-green-200 text-green-700 rounded-xl p-4 text-sm flex items-center justify-between gap-3">
            <span>✓ {successMessage}</span>
            <button
              type="button"
              onClick={() => setSuccessMessage("")}
              className="text-xs text-[#6B6B6B] hover:text-black"
            >
              Dismiss
            </button>
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

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-[#C89B5A] text-white border-[#C89B5A]"
                    : "bg-white text-[#6B6B6B] border-[#E5E1D8] hover:border-[#C89B5A]"
                }`}
              >
                {tab} ({getTabCount(tab)})
              </button>
            );
          })}
        </div>

        {/* Content States */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white border border-[#E5E1D8] rounded-xl p-6 animate-pulse"
              >
                <div className="h-5 bg-[#E5E1D8] rounded w-1/3 mb-3" />
                <div className="h-4 bg-[#E5E1D8] rounded w-1/4 mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="h-10 bg-[#F7F5F0] rounded" />
                  <div className="h-10 bg-[#F7F5F0] rounded" />
                  <div className="h-10 bg-[#F7F5F0] rounded" />
                  <div className="h-10 bg-[#F7F5F0] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white border border-[#E5E1D8] rounded-xl p-10 text-center">
            <h2 className="font-display font-semibold text-xl mb-2">
              {activeFilter === "All"
                ? "No Reservations Yet"
                : `No ${activeFilter} Reservations`}
            </h2>
            <p className="text-sm text-[#6B6B6B] max-w-md mx-auto mb-6">
              {activeFilter === "All"
                ? "You haven't booked any tables yet. Explore available hotels to reserve your spot."
                : `You don't have any bookings marked as ${activeFilter.toLowerCase()}.`}
            </p>
            {activeFilter === "All" ? (
              <button
                type="button"
                onClick={() => navigate("/hotels")}
                className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Explore Hotels
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className="border border-[#E5E1D8] hover:border-[#C89B5A] text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Show All Bookings
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const hotelName =
                typeof booking.hotel === "object"
                  ? booking.hotel?.name
                  : "Hotel";
              const hotelAddress =
                typeof booking.hotel === "object"
                  ? formatAddress(booking.hotel?.address)
                  : "";

              const isCheckedIn = Boolean(booking.qrVerified);
              const canShowQr = booking.status === "Confirmed" && !isCheckedIn;
              const canCancel =
                !isCheckedIn &&
                (booking.status === "Pending" ||
                  booking.status === "Confirmed");

              const isConfirming = confirmCancelId === booking._id;
              const isCancelling = cancellingId === booking._id;

              return (
                <div
                  key={booking._id}
                  className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6 transition-colors hover:border-[#C89B5A]/60"
                >
                  {/* Top Row: Hotel Info & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-display font-semibold text-lg sm:text-xl">
                          {hotelName}
                        </h2>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadgeStyle(
                            booking.status,
                          )}`}
                        >
                          {booking.status || "Pending"}
                        </span>

                        {isCheckedIn && (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                            ✓ Checked In
                          </span>
                        )}
                      </div>

                      {hotelAddress && (
                        <p className="text-sm text-[#6B6B6B] mt-1">
                          {hotelAddress}
                        </p>
                      )}

                      <p className="text-xs text-[#8A8A8A] mt-1">
                        Booking ID: {booking._id}
                      </p>
                    </div>

                    {typeof booking.amount === "number" && (
                      <div className="sm:text-right">
                        <p className="text-xs text-[#8A8A8A]">Total Paid</p>
                        <p className="text-lg sm:text-xl font-bold text-[#C89B5A]">
                          ₹{Number(booking.amount).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#E5E1D8] my-4" />

                  {/* Middle Row: Booking Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-[#8A8A8A]">Date</p>
                      <p className="font-medium mt-1">
                        {formatDate(booking.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8A8A8A]">Time Slot</p>
                      <p className="font-medium mt-1">
                        {formatTime(booking.startTime)} –{" "}
                        {formatTime(booking.endTime)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8A8A8A]">Tables</p>
                      <p className="font-medium mt-1">
                        {getTablesText(booking)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8A8A8A]">Guests</p>
                      <p className="font-medium mt-1">
                        {booking.guests}{" "}
                        {Number(booking.guests) === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Actions */}
                  {(canShowQr || canCancel) && (
                    <>
                      <div className="border-t border-[#E5E1D8] my-4" />
                      <div className="flex flex-wrap items-center justify-end gap-3">
                        {isConfirming ? (
                          <>
                            <span className="text-xs text-[#6B6B6B]">
                              Cancel this reservation?
                            </span>
                            <button
                              type="button"
                              disabled={isCancelling}
                              onClick={() => handleCancelBooking(booking._id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isCancelling
                                ? "Cancelling..."
                                : "Yes, Cancel Booking"}
                            </button>
                            <button
                              type="button"
                              disabled={isCancelling}
                              onClick={() => setConfirmCancelId(null)}
                              className="border border-[#E5E1D8] hover:border-[#C89B5A] text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                              Keep Reservation
                            </button>
                          </>
                        ) : (
                          <>
                            {canShowQr && (
                              <button
                                type="button"
                                onClick={() => handleOpenQrModal(booking)}
                                className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                              >
                                Show QR Pass
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                onClick={() => setConfirmCancelId(booking._id)}
                                className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                              >
                                Cancel Reservation
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Pass Modal */}
      {selectedQrBooking && (
        <div
          onClick={handleCloseQrModal}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E5E1D8] rounded-xl max-w-sm w-full p-6 text-center shadow-lg"
          >
            <h3 className="font-display font-bold text-xl">
              Reservation QR Pass
            </h3>
            <p className="text-sm text-[#6B6B6B] mt-1">
              {typeof selectedQrBooking.hotel === "object"
                ? selectedQrBooking.hotel?.name
                : "Hotel"}
            </p>

            <div className="border-t border-[#E5E1D8] my-4" />

            {qrLoading ? (
              <div className="py-12">
                <div className="w-10 h-10 border-4 border-[#E5E1D8] border-t-[#C89B5A] rounded-full animate-spin mx-auto" />
                <p className="text-sm text-[#6B6B6B] mt-3">
                  Generating your entry pass...
                </p>
              </div>
            ) : qrError ? (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm my-4">
                {qrError}
              </div>
            ) : (
              qrImage && (
                <div className="my-2">
                  <img
                    src={qrImage}
                    alt="Booking QR Pass"
                    className="w-56 h-56 mx-auto border border-[#E5E1D8] rounded-lg p-2 bg-white"
                  />
                  <p className="text-xs text-[#8A8A8A] mt-3">
                    Present this QR code at the reception desk upon arrival.
                  </p>
                </div>
              )
            )}

            <div className="bg-[#F7F5F0] rounded-lg p-3 mt-4 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Date</span>
                <span className="font-medium">
                  {formatDate(selectedQrBooking.date)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Time</span>
                <span className="font-medium">
                  {formatTime(selectedQrBooking.startTime)} –{" "}
                  {formatTime(selectedQrBooking.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Tables</span>
                <span className="font-medium">
                  {getTablesText(selectedQrBooking)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              {qrImage && (
                <a
                  href={qrImage}
                  download={`reservation-${selectedQrBooking._id}.png`}
                  className="flex-1 bg-[#C89B5A] hover:bg-[#B48748] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Download QR
                </a>
              )}
              <button
                type="button"
                onClick={handleCloseQrModal}
                className="flex-1 border border-[#E5E1D8] hover:border-[#C89B5A] text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;

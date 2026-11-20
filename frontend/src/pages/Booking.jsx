import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gethotelsByid } from "../services/hotelservice.js";
import ClockTimePicker from "@/components/ui/ClockTimePicker.jsx";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function Booking() {
  const location = useLocation();
  const { selectedtable = [], id } = location.state || {};
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [data, setData] = useState(null);
  const [bookingDate, setBookingDate] = useState(undefined);

  useEffect(() => {
    if (!id) return;

    const gethotel = async () => {
      const result = await gethotelsByid(id);
      setData(result);
    };

    gethotel();
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
    date.setHours(Number(hours), Number(minutes));

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
  if (!id || !selectedtable.length) {
    return <div>Invalid booking session. Please select your tables again.</div>;
  }

  return (
    <div className="bg-[#F7F5F0] m-3">
      <div className="font-bold font-display text-3xl">
        Complete Your Reservation
      </div>

      <div className="text-sm ml-1 font-ui text-[#6B6B6B]">
        {data?.name} · Complete your booking details
      </div>

      <div className="mt-4 text-2xl font-display font-semibold">
        Booking Details
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3 space-y-5">
          <div className="border border-[#E5E1D8] rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-lg font-display mb-3">
              Booking Date
            </h3>

            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="w-full border border-[#E5E1D8] rounded-lg px-4 py-3 text-left hover:border-[#C89B5A] transition-colors"
                  />
                }
              >
                {bookingDate
                  ? bookingDate.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Select booking date"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ClockTimePicker
              label="From"
              value={startTime}
              onChange={setStartTime}
            />

            <ClockTimePicker label="To" value={endTime} onChange={setEndTime} />
          </div>
          {timeError && (
            <p className="text-sm text-red-500 mt-2">{timeError}</p>
          )}

          <div className="border border-[#E5E1D8] rounded-xl p-5 bg-white">
            <h3 className="font-semibold text-lg font-display mb-4">
              Number of Guests
            </h3>

            <input
              type="number"
              min="1"
              max={maxGuests}
              step="1"
              value={guestCount}
              onChange={(e) => {
                const value = e.target.value;

                if (value === "") {
                  setGuestCount("");
                  return;
                }

                const guests = Number(value);

                setGuestCount(Math.min(Math.max(1, guests), maxGuests));
              }}
              onBlur={() => {
                if (guestCount === "" || guestCount < 1) {
                  setGuestCount(1);
                }
              }}
              className="w-full border border-[#E5E1D8] rounded-lg px-4 py-3 outline-none focus:border-[#C89B5A] focus:ring-2 focus:ring-[#C89B5A]/20"
            />

            <p className="text-xs text-[#6B6B6B] mt-2">
              Maximum capacity: {maxGuests} guests
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 sticky top-5">
            <h2 className="font-display text-xl font-semibold">
              Booking Summary
            </h2>

            <p className="text-sm text-[#6B6B6B] mt-1">
              Review your reservation details
            </p>

            <div className="border-t border-[#E5E1D8] my-4" />

            <div className="mb-4">
              <p className="text-xs text-[#8A8A8A]">Hotel</p>
              <p className="font-semibold mt-1">
                {data?.name || "Loading hotel..."}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-xs text-[#8A8A8A] mb-2">Selected Tables</p>

              <div className="space-y-2">
                {selectedtable.map((table) => (
                  <div
                    key={table._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="font-medium">Table {table.tableNumber}</p>
                      <p className="text-xs text-[#8A8A8A]">
                        Capacity: {table.capacity} guests
                      </p>
                    </div>

                    <p className="font-medium">
                      ₹{Number(table.price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E5E1D8] my-4" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Date</span>
                <span>
                  {bookingDate
                    ? bookingDate.toLocaleDateString("en-IN")
                    : "Not selected"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">From</span>
                <span>{formatTime(startTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">To</span>
                <span>{formatTime(endTime)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8A8A8A]">Guests</span>
                <span>{guestCount || 0}</span>
              </div>
            </div>

            <div className="border-t border-[#E5E1D8] my-4" />

            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>

              <span className="text-2xl font-bold text-[#C89B5A]">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;

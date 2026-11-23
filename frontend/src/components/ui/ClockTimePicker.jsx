import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function ClockTimePicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("hour");

  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState("AM");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  useEffect(() => {
    if (!open) return;

    if (value) {
      const [h, m] = value.split(":").map(Number);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHour(h % 12 || 12);
      setMinute(m);
      setPeriod(h >= 12 ? "PM" : "AM");
    } else {
      setHour(10);
      setMinute(0);
      setPeriod("AM");
    }

    setStage("hour");
  }, [open, value]);

  const formattedTime = value
    ? (() => {
        const [h, m] = value.split(":").map(Number);
        const p = h >= 12 ? "PM" : "AM";
        const displayHour = h % 12 || 12;

        return `${displayHour}:${String(m).padStart(2, "0")} ${p}`;
      })()
    : "Select time";

  const selectHour = (hour) => {
    setHour(hour);
    setStage("minute");
  };

  const selectMinute = (selectedMinute) => {
    setMinute(selectedMinute);
  };

  const saveTime = () => {
    let finalHour = hour % 12;

    if (period === "PM") {
      finalHour += 12;
    }

    onChange(
      `${String(finalHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );

    setOpen(false);
  };

  const clockPosition = (index, total, radius = 42) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;

    return {
      left: `${50 + radius * Math.cos(angle)}%`,
      top: `${50 + radius * Math.sin(angle)}%`,
    };
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-[#6B6B6B]">{label}</label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="w-full border border-[#E5E1D8] rounded-lg px-4 py-3 text-left hover:border-[#C89B5A] transition-colors"
            />
          }
        >
          <span className={value ? "text-[#292929]" : "text-[#888]"}>
            {formattedTime}
          </span>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 p-4">
          <div className="text-center font-semibold mb-3">{label}</div>

          {/* Selected time */}
          <div className="flex justify-center items-center gap-2 mb-4">
            <button
              type="button"
              onClick={() => setStage("hour")}
              className={`text-3xl font-semibold ${
                stage === "hour" ? "text-[#C89B5A]" : "text-gray-400"
              }`}
            >
              {String(hour).padStart(2, "0")}
            </button>

            <span className="text-3xl">:</span>

            <button
              type="button"
              onClick={() => setStage("minute")}
              className={`text-3xl font-semibold ${
                stage === "minute" ? "text-[#C89B5A]" : "text-gray-400"
              }`}
            >
              {String(minute).padStart(2, "0")}
            </button>

            <div className="flex flex-col gap-1 ml-2">
              {["AM", "PM"].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`text-xs px-2 py-1 rounded ${
                    period === p
                      ? "bg-[#C89B5A] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mb-2">
            {stage === "hour" ? "Select hour" : "Select minutes"}
          </p>

          {/* Analog clock */}
          <div className="relative w-56 h-56 mx-auto rounded-full bg-[#F7F5F0]">
            <div className="absolute inset-0 rounded-full border border-[#E5E1D8]" />

            {stage === "hour"
              ? hours.map((h) => (
                  <button
                    type="button"
                    key={h}
                    onClick={() => selectHour(h)}
                    style={clockPosition(h % 12, 12)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-sm font-medium ${
                      hour === h
                        ? "bg-[#C89B5A] text-white"
                        : "hover:bg-[#E9DCC8] text-gray-800"
                    }`}
                  >
                    {h}
                  </button>
                ))
              : minutes.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => selectMinute(m)}
                    style={clockPosition(m / 5, 12)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full text-sm font-medium ${
                      minute === m
                        ? "bg-[#C89B5A] text-white"
                        : "hover:bg-[#E9DCC8] text-gray-800"
                    }`}
                  >
                    {String(m).padStart(2, "0")}
                  </button>
                ))}

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#C89B5A]" />
          </div>

          <button
            type="button"
            onClick={saveTime}
            className="w-full mt-4 bg-[#C89B5A] text-white rounded-lg py-2 hover:bg-[#B48746] transition-colors"
          >
            Confirm Time
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ClockTimePicker;

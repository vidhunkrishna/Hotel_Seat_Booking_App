import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQR } from "../services/qrservice.js";

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

function ScanQR() {
  const [manualToken, setManualToken] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [verifiedData, setVerifiedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const scannerRef = useRef(null);
  const lockRef = useRef(false);

  const handleVerifyToken = async (rawToken) => {
    const cleanedToken = rawToken?.trim();
    if (!cleanedToken || lockRef.current) return;

    lockRef.current = true;
    setIsVerifying(true);
    setErrorMessage("");
    setVerifiedData(null);

    try {
      const result = await verifyQR(cleanedToken);
      setVerifiedData(result);
      setManualToken("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "QR verification failed. Invalid, expired, or already used pass.",
      );
    } finally {
      setIsVerifying(false);
      setTimeout(() => {
        lockRef.current = false;
      }, 1500);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // Ignore cleanup errors when scanner stops
      } finally {
        scannerRef.current = null;
        setCameraActive(false);
      }
    }
  };

  const startCamera = async () => {
    setCameraError("");
    setErrorMessage("");

    try {
      await stopCamera();

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          handleVerifyToken(decodedText);
        },
        () => {
          // Ignore per-frame scan misses
        },
      );

      setCameraActive(true);
    } catch {
      setCameraActive(false);
      setCameraError(
        "Camera access unavailable or denied. You can still verify using the token input below.",
      );
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    handleVerifyToken(manualToken);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="font-bold font-display text-2xl sm:text-3xl lg:text-4xl">
            Guest Check-In Scanner
          </h1>
          <p className="text-sm sm:text-base mt-2 text-[#6B6B6B]">
            Scan a guest&apos;s reservation QR code to verify and check them in
          </p>
        </div>

        {/* Verification Success Banner */}
        {verifiedData && (
          <div className="mb-6 bg-white border border-green-200 rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="text-green-600 text-2xl">✓</div>
              <div className="w-full">
                <h2 className="font-semibold text-lg text-green-700">
                  {verifiedData.message || "QR Verified — Guest Checked In"}
                </h2>

                {verifiedData.booking && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#E5E1D8] text-sm">
                    <div>
                      <p className="text-xs text-[#8A8A8A]">Booking ID</p>
                      <p className="font-semibold break-all mt-0.5">
                        {verifiedData.booking._id}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8A8A8A]">Guests</p>
                      <p className="font-medium mt-0.5">
                        {verifiedData.booking.guests}{" "}
                        {Number(verifiedData.booking.guests) === 1
                          ? "Guest"
                          : "Guests"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8A8A8A]">Date</p>
                      <p className="font-medium mt-0.5">
                        {formatDate(verifiedData.booking.date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#8A8A8A]">Time Slot</p>
                      <p className="font-medium mt-0.5">
                        {formatTime(verifiedData.booking.startTime)} –{" "}
                        {formatTime(verifiedData.booking.endTime)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm"
          >
            {errorMessage}
          </div>
        )}

        {/* Camera Scanner Card */}
        <div className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-semibold text-lg">
                Camera QR Scanner
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Point your camera at the customer&apos;s QR pass
              </p>
            </div>

            {cameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold px-4 py-2 rounded-lg transition-colors self-start sm:self-auto"
              >
                Stop Camera
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors self-start sm:self-auto"
              >
                Start Camera
              </button>
            )}
          </div>

          <div
            id="qr-reader"
            className="w-full max-w-sm mx-auto overflow-hidden rounded-lg border border-[#E5E1D8] bg-[#F7F5F0]"
          />

          {cameraError && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              {cameraError}
            </p>
          )}
        </div>

        {/* Manual Token Verification Fallback */}
        <form
          onSubmit={handleManualSubmit}
          className="bg-white border border-[#E5E1D8] rounded-xl p-5 sm:p-6"
        >
          <h2 className="font-display font-semibold text-lg">
            Manual Token Verification
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-0.5 mb-4">
            Paste the decoded QR token if scanning without a camera
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Enter QR token..."
              className="flex-1 border border-[#E5E1D8] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#C89B5A] focus:ring-2 focus:ring-[#C89B5A]/20"
            />
            <button
              type="submit"
              disabled={!manualToken.trim() || isVerifying}
              className="bg-[#C89B5A] hover:bg-[#B48748] text-white text-sm font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify Pass"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScanQR;

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationsservice.js";

const formatNotificationTime = (dateValue) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSeconds < 60) return "Just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function NotificationBell() {
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await getNotifications();
      const list = Array.isArray(result) ? result : result?.notifications || [];

      const sorted = [...list].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setNotifications(sorted);
    } catch {
      // Silently ignore if session expired or network hiccups
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      fetchNotifications();
    }
  };

  const handleReadSingle = async (notification) => {
    if (notification.read) return;

    try {
      await markNotificationRead(notification._id);
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, read: true } : item,
        ),
      );
    } catch {
      // Keep UI unchanged on failure
    }
  };

  const handleReadAll = async () => {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    } catch {
      // Keep UI unchanged on failure
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="mr-4 flex items-center gap-1.5 text-white hover:text-[#C89B5A] transition-colors cursor-pointer"
      >
        <span>Notifications</span>

        {unreadCount > 0 && (
          <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#C89B5A] text-white text-[11px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#171717] border border-[#E5E1D8] rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E5E1D8] flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-base">
                Notifications
              </h3>
              <p className="text-xs text-[#8A8A8A]">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={markingAll}
                onClick={handleReadAll}
                className="text-xs font-semibold text-[#C89B5A] hover:text-[#B48748] disabled:opacity-50 cursor-pointer"
              >
                {markingAll ? "Updating..." : "Mark all as read"}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#E5E1D8]">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#6B6B6B]">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-medium text-[#171717]">
                  No notifications yet
                </p>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Booking and payment updates will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => handleReadSingle(item)}
                  className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-[#F7F5F0]/70 flex items-start gap-3 cursor-pointer ${
                    !item.read ? "bg-[#F7F5F0]" : "bg-white"
                  }`}
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      !item.read ? "bg-[#C89B5A]" : "bg-transparent"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      {item.type && (
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-[#C89B5A]">
                          {item.type}
                        </span>
                      )}
                      <span className="text-[11px] text-[#8A8A8A] ml-auto">
                        {formatNotificationTime(item.createdAt)}
                      </span>
                    </div>

                    <p
                      className={`text-sm leading-snug ${
                        !item.read
                          ? "font-medium text-[#171717]"
                          : "text-[#6B6B6B]"
                      }`}
                    >
                      {item.message}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

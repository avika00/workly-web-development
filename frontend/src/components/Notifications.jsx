import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Clock3,
  Monitor,
  ShieldCheck,
  Bookmark,
  ChevronRight,
  MessageCircle,
  CheckCheck,
} from "lucide-react";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

const filters = [
  { label: "All", value: "All" },
  { label: "Unread", value: "Unread" },
  { label: "Applications", value: "Applications" },
  { label: "New Jobs", value: "New Jobs" },
  { label: "Saved Jobs", value: "Saved Jobs" },
  { label: "System", value: "System" },
];

function NotificationIcon({ type }) {
  const iconClass = "h-6 w-6";

  if (type === "approved") {
    return <Monitor className={iconClass} />;
  }

  if (type === "message") {
    return <MessageCircle className={iconClass} />;
  }

  if (type === "closed") {
    return <Clock3 className={iconClass} />;
  }

  if (type === "security") {
    return <ShieldCheck className={iconClass} />;
  }

  if (type === "saved") {
    return <Bookmark className={iconClass} />;
  }

  if (type === "system") {
    return <Bell className={iconClass} />;
  }

  return <BriefcaseBusiness className={iconClass} />;
}

function NotificationItem({ notification, onRead, onAction }) {
  const isApplicant = notification.type === "applicant";
  const isMessage = notification.type === "message";

  return (
    <article
      className={`relative flex cursor-pointer flex-col gap-4 rounded-2xl px-5 py-5 shadow-[0_5px_18px_rgba(30,40,100,0.08)] transition duration-200 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
        notification.unread ? "bg-[#E9ECFA]" : "bg-[#EAECF7]/75"
      }`}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4">
        {isApplicant || isMessage ? (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-sm ${
              isApplicant
                ? "bg-gradient-to-br from-[#315FF0] to-[#8C5CF6]"
                : "bg-gradient-to-br from-[#0C777F] to-[#315FF0]"
            }`}
          >
            {notification.icon}
            <span className="sr-only">{notification.name}</span>
          </div>
        ) : (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
              notification.type === "closed"
                ? "bg-[#FFF0F2] text-[#F05270]"
                : notification.type === "security"
                  ? "bg-[#F0F3F8] text-[#52627A]"
                  : notification.type === "saved"
                    ? "bg-[#E7E9FF] text-[#4E59FF]"
                    : "bg-[#E5EEFF] text-[#0010FF]"
            }`}
          >
            <NotificationIcon type={notification.type} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {notification.name && (
              <span className="font-semibold text-[#171827]">
                {notification.name}
              </span>
            )}

            <span className="font-medium text-[#34394F]">
              {notification.title}
            </span>

            {notification.job && (
              <span className="font-semibold text-[#0010FF]">
                {notification.job}
              </span>
            )}

            {notification.company && (
              <span className="text-xs text-[#9AA6C0]">
                - {notification.company}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm leading-relaxed text-[#66738F]">
            {notification.message}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {notification.status && (
              <span
                className={`rounded-full px-3 py-1 font-medium ${
                  notification.status === "Active" ||
                  notification.status === "Accepted"
                    ? "bg-[#D2F7E8] text-[#07996D]"
                    : notification.status === "Closed" ||
                        notification.status === "Rejected"
                      ? "bg-[#FFE0E5] text-[#E84B66]"
                      : notification.status === "Pending" ||
                          notification.status === "New Job"
                        ? "bg-[#DCE3FF] text-[#3455E8]"
                        : "bg-[#EDF0F6] text-[#60708A]"
                }`}
              >
                {notification.status}
              </span>
            )}

            {notification.extra && (
              <span className="rounded-full bg-[#DCE3FF] px-3 py-1 font-medium text-[#2448E8]">
                {notification.extra}
              </span>
            )}

            <span className="text-[#9AA6C0]">{notification.time}</span>

            {notification.unread && (
              <span className="h-2 w-2 rounded-full bg-[#0010FF]" />
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end sm:pl-4">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRead(notification.id);
            onAction(notification);
          }}
          className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 ${
            notification.action === "View Summary" ||
            notification.action === "Check Details"
              ? "text-[#0010FF] hover:bg-white/70"
              : notification.action === "View Job Post"
                ? "border border-[#CAD2E7] text-[#3F4B66] hover:bg-white"
                : "bg-[#0010FF] text-white hover:bg-[#2448E8]"
          }`}
        >
          {notification.action}

          {notification.action === "View Summary" && (
            <ChevronRight className="ml-1 inline h-4 w-4" />
          )}
        </button>
      </div>
    </article>
  );
}

function Notifications() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");
  const userId = currentUser?.ID_USER || currentUser?.id_user || null;

  const storageKey = userId ? `workly_read_notifs_${userId}` : null;

  const [activeFilter, setActiveFilter] = useState("All");
  const [rawNotifications, setRawNotifications] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    if (!storageKey) return [];
    return JSON.parse(localStorage.getItem(storageKey) || "[]");
  });
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/notifications/read.php?id_user=${userId}`
        );
        const result = await res.json();

        if (result.status && Array.isArray(result.notifications)) {
          setRawNotifications(result.notifications);
        } else {
          setRawNotifications([]);
        }
      } catch (err) {
        console.error("Gagal memuat notifikasi:", err);
        setRawNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, navigate]);

  const notifications = useMemo(() => {
    return rawNotifications.map((item) => {
      const isUnread =
        item.forceUnread !== undefined
          ? item.forceUnread && !readIds.includes(item.id)
          : !readIds.includes(item.id);

      return {
        ...item,
        unread: isUnread,
      };
    });
  }, [rawNotifications, readIds]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const counts = {
    All: notifications.length,
    Unread: unreadCount,
    Applications: notifications.filter(
      (item) => item.category === "Applications"
    ).length,
    "New Jobs": notifications.filter((item) => item.category === "New Jobs")
      .length,
    "Saved Jobs": notifications.filter(
      (item) => item.category === "Saved Jobs"
    ).length,
    System: notifications.filter((item) => item.category === "System").length,
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "Unread") {
      return notifications.filter((item) => item.unread);
    }

    if (activeFilter === "All") {
      return notifications;
    }

    return notifications.filter((item) => item.category === activeFilter);
  }, [activeFilter, notifications]);

  const visibleNotifications = filteredNotifications.slice(0, visibleCount);

  function handleRead(id) {
    setReadIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
  }

  function handleMarkAllRead() {
    const allIds = rawNotifications.map((item) => item.id);
    setReadIds(allIds);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(allIds));
    }
  }

  function handleAction(notification) {
    if (notification.link) {
      navigate(notification.link);
      return;
    }
    navigate("/activity");
  }

  function changeFilter(value) {
    setActiveFilter(value);
    setVisibleCount(6);
  }

  return (
    <main className="min-h-screen bg-[#010133]">
      {/* NAVBAR AREA */}
      <div className="relative h-[120px] overflow-hidden bg-[#010133]">
        {/* Background Glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: "url('/images/workly-glow.png')",
            backgroundPosition: "left -180px top -180px",
            backgroundSize: "700px auto",
          }}
        />

        <Navbar isLoggedIn={true} />
      </div>

      {/* NOTIFICATION CONTENT */}
      <section className="mx-auto min-h-[calc(100vh-120px)] w-full max-w-[1600px] rounded-t-[30px] bg-[#F5F6FF] px-6 pb-14 pt-10 sm:px-10 lg:px-[6.4%] lg:pt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#10111A] md:text-[32px]">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-[#71809D] md:text-base">
              Stay updated on your job applications, candidate submissions, and new job posts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex cursor-pointer items-center gap-2 self-start rounded-full border border-[#D4DCF0] bg-white px-4 py-2 text-xs font-semibold text-[#0010FF] shadow-sm transition hover:bg-[#E9EDFF] sm:self-auto"
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
        </div>

        {/* FILTER TABS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => changeFilter(filter.value)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? "bg-[#0010FF] text-white"
                  : "border border-[#E0E5F1] bg-white text-[#52617D] hover:bg-[#E9EDFF]"
              }`}
            >
              {filter.label}

              {filter.value === "All" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeFilter === "All"
                      ? "bg-white/20 text-white"
                      : "bg-[#E9EDFF] text-[#0010FF]"
                  }`}
                >
                  {counts.All}
                </span>
              )}

              {filter.value === "Unread" && (
                <span
                  className={`text-xs ${
                    activeFilter === "Unread"
                      ? "text-white/80"
                      : "text-[#0010FF]"
                  }`}
                >
                  ({counts.Unread})
                </span>
              )}

              {filter.value !== "All" && filter.value !== "Unread" && (
                <span className="text-xs opacity-70">
                  ({counts[filter.value] ?? 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* NOTIFICATION LIST */}
        <div className="mt-7 space-y-3.5">
          {loading ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center text-sm text-[#71809D] shadow-sm">
              Memuat notifikasi dari database...
            </div>
          ) : visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleRead}
                onAction={handleAction}
              />
            ))
          ) : (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
              <Bell className="mx-auto h-10 w-10 text-[#AAB4CC]" />

              <h2 className="mt-4 text-lg font-semibold text-[#252A3A]">
                No notifications found
              </h2>

              <p className="mt-2 text-sm text-[#8390AA]">
                There are no notifications in this category right now.
              </p>
            </div>
          )}
        </div>

        {/* LOAD EARLIER NOTIFICATIONS */}
        <div className="mt-12 flex flex-col items-center">
          <p className="text-sm text-[#71809D]">
            Showing{" "}
            <span className="font-semibold text-[#39445D]">
              {visibleNotifications.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#39445D]">
              {filteredNotifications.length}
            </span>{" "}
            notifications
          </p>

          {visibleCount < filteredNotifications.length && (
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + 6)}
              className="mt-3 cursor-pointer rounded-full border border-[#E0E5F1] bg-white px-6 py-2.5 text-sm font-medium text-[#52617D] shadow-sm transition hover:bg-[#E9EDFF]"
            >
              Load Earlier Notifications
            </button>
          )}
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

export default Notifications;
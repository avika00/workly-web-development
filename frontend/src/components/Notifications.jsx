import { useMemo, useState } from "react";
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
} from "lucide-react";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const notificationsData = [
  {
    id: 1,
    category: "Applications",
    type: "applicant",
    name: "Aria Seraphina",
    title: "applied for",
    job: "UI/UX Designer",
    company: "CV. Creative Studio",
    message:
      '"Hey! I\'m interested in this position and have attached my updated Figma portfolio and resume."',
    status: "Active",
    extra: "12 Applicants",
    time: "10m ago",
    unread: true,
    action: "Review Application",
    icon: "AS",
  },
  {
    id: 2,
    category: "Applications",
    type: "approved",
    title: "Your Job Post has been Approved",
    message:
      "Your listing for Frontend Developer is now live and accepting applications.",
    job: "Frontend Developer",
    status: "Active",
    time: "45m ago",
    unread: true,
    action: "View Job Post",
  },
  {
    id: 3,
    category: "Applications",
    type: "message",
    name: "Budi Prasetyo",
    title: "sent a message regarding",
    job: "Senior Backend Engineer",
    message:
      '"Thank you for reviewing my profile! I am available for a screening call tomorrow."',
    status: "Interview",
    time: "2h ago",
    unread: true,
    action: "Reply Message",
    icon: "BP",
  },
  {
    id: 4,
    category: "Applications",
    type: "closed",
    title: "Job Post Closed: Social Media Analyst",
    message:
      "The application deadline for Social Media Analyst has passed. You received 19 applications.",
    status: "Closed",
    time: "Yesterday at 16:30",
    unread: false,
    action: "View Summary",
  },
  {
    id: 5,
    category: "System",
    type: "security",
    title: "Security Alert: New sign-in detected",
    message:
      "Signed in from Chrome on macOS (Surabaya, Indonesia). If this wasn't you, review your account security.",
    status: "System",
    time: "3 days ago",
    unread: false,
    action: "Check Details",
  },
  {
    id: 6,
    category: "Saved Jobs",
    type: "saved",
    title: "A saved job is closing soon",
    message:
      "The application deadline for Product Designer at Digital Creative is approaching.",
    status: "Reminder",
    time: "4 days ago",
    unread: true,
    action: "View Job",
  },
  {
    id: 7,
    category: "Applications",
    type: "approved",
    title: "Your application has been viewed",
    message:
      "Techno Solutions has viewed your application for Frontend Developer.",
    status: "Application",
    time: "5 days ago",
    unread: false,
    action: "View Activity",
  },
  {
    id: 8,
    category: "System",
    type: "system",
    title: "Welcome to Workly!",
    message:
      "Your account is ready. Complete your profile to get better opportunities.",
    status: "System",
    time: "1 week ago",
    unread: false,
    action: "Complete Profile",
  },
  {
    id: 9,
    category: "Applications",
    type: "message",
    name: "Nadia Putri",
    title: "sent a message regarding",
    job: "UI/UX Designer",
    message:
      '"Thank you for the opportunity. I look forward to hearing from you."',
    status: "Message",
    time: "1 week ago",
    unread: false,
    action: "Reply Message",
    icon: "NP",
  },
  {
    id: 10,
    category: "Saved Jobs",
    type: "saved",
    title: "New opportunity matching your saved job",
    message:
      "A new UI Designer position is available at Creative Digital Agency.",
    status: "New Job",
    time: "1 week ago",
    unread: false,
    action: "View Job",
  },
  {
    id: 11,
    category: "System",
    type: "system",
    title: "Profile update reminder",
    message:
      "Add your skills and portfolio to make your profile stand out.",
    status: "Reminder",
    time: "2 weeks ago",
    unread: false,
    action: "Update Profile",
  },
  {
    id: 12,
    category: "Applications",
    type: "closed",
    title: "Application status updated",
    message:
      "Your application status for Marketing Specialist has been updated.",
    status: "Updated",
    time: "2 weeks ago",
    unread: false,
    action: "View Activity",
  },
];

const filters = [
  { label: "All", value: "All" },
  { label: "Unread", value: "Unread" },
  { label: "Applications", value: "Applications" },
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
      className={`relative flex flex-col gap-4 rounded-2xl px-5 py-5 shadow-[0_5px_18px_rgba(30,40,100,0.08)] transition duration-200 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${
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
            <span className="sr-only">
              {notification.name}
            </span>
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
                • {notification.company}
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
                  notification.status === "Active"
                    ? "bg-[#D2F7E8] text-[#07996D]"
                    : notification.status === "Closed"
                      ? "bg-[#FFE0E5] text-[#E84B66]"
                      : notification.status === "Interview"
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

            <span className="text-[#9AA6C0]">
              {notification.time}
            </span>

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
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 ${
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

  const [activeFilter, setActiveFilter] = useState("All");
  const [notifications, setNotifications] = useState(notificationsData);
  const [visibleCount, setVisibleCount] = useState(5);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const counts = {
    All: notifications.length,
    Unread: unreadCount,
    Applications: notifications.filter(
      (item) => item.category === "Applications"
    ).length,
    "Saved Jobs": notifications.filter(
      (item) => item.category === "Saved Jobs"
    ).length,
    System: notifications.filter(
      (item) => item.category === "System"
    ).length,
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "Unread") {
      return notifications.filter((item) => item.unread);
    }

    if (activeFilter === "All") {
      return notifications;
    }

    return notifications.filter(
      (item) => item.category === activeFilter
    );
  }, [activeFilter, notifications]);

  const visibleNotifications = filteredNotifications.slice(
    0,
    visibleCount
  );

  function handleRead(id) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  }

  function handleAction(notification) {
    if (
      notification.action === "Complete Profile" ||
      notification.action === "Update Profile"
    ) {
      navigate("/profile");
      return;
    }

    if (notification.action === "View Activity") {
      navigate("/activity");
      return;
    }

    if (
      notification.action === "View Job" ||
      notification.action === "View Job Post"
    ) {
      navigate("/jobs");
      return;
    }

    if (
      notification.action === "Review Application" ||
      notification.action === "Reply Message"
    ) {
      navigate("/activity");
      return;
    }

    if (notification.action === "View Summary") {
      navigate("/post-job");
      return;
    }

    if (notification.action === "Check Details") {
      navigate("/profile");
    }
  }

  function changeFilter(value) {
    setActiveFilter(value);
    setVisibleCount(5);
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#10111A] md:text-[32px]">
            Notifications
          </h1>

          <p className="mt-2 text-sm text-[#71809D] md:text-base">
            Stay updated on your job applications, candidate submissions, and system alerts.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="mt-6 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => changeFilter(filter.value)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
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

              {filter.value !== "All" &&
                filter.value !== "Unread" && (
                  <span className="text-xs opacity-70">
                    ({counts[filter.value]})
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* NOTIFICATION LIST */}
        <div className="mt-7 space-y-3.5">
          {visibleNotifications.length > 0 ? (
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
              onClick={() =>
                setVisibleCount((current) => current + 5)
              }
              className="mt-3 rounded-full border border-[#E0E5F1] bg-white px-6 py-2.5 text-sm font-medium text-[#52617D] shadow-sm transition hover:bg-[#E9EDFF]"
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
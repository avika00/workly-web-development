import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, MessageSquare, Menu, X } from "lucide-react";

const API_URL = "http://localhost:8000";

const LOGO_CANDIDATES = [
  "/images/logos/logo-white.png",
];

function getUserId(u) {
  return u?.ID_USER || u?.id_user || u?.id || null;
}

function getPhotoCandidates(photo) {
  if (!photo || typeof photo !== "string") return [];
  const trimmed = photo.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("http") || trimmed.startsWith("data:")) {
    return [trimmed];
  }
  const clean = trimmed.replace(/^\/+/, "");
  if (clean.startsWith("uploads/")) {
    return [`${API_URL}/${clean}`];
  }
  return [
    `${API_URL}/uploads/profiles/${clean}`,
    `${API_URL}/uploads/${clean}`,
    `${API_URL}/uploads/profile/${clean}`,
  ];
}

function Navbar({ isLoggedIn }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoAttempt, setLogoAttempt] = useState(0);

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("workly_user") || "null")
  );
  const [profilePhoto, setProfilePhoto] = useState(
    () => user?.PHOTO || user?.photo || null
  );
  const [photoAttempt, setPhotoAttempt] = useState(0);
  const [displayName, setDisplayName] = useState(
    () =>
      user?.FULLNAME ||
      user?.fullname ||
      user?.USERNAME ||
      user?.username ||
      ""
  );
  const [unreadMessages, setUnreadMessages] = useState(0);

  const userId = getUserId(user);

  // Halaman "/" (HomeBeforeLogin) selalu tampil mode sebelum login kecuali dipaksa isLoggedIn={true}
  const isBeforeLoginPage = location.pathname === "/" && isLoggedIn !== true;
  const authenticated = isBeforeLoginPage
    ? false
    : Boolean(isLoggedIn || userId);

  const fetchUserProfile = async (uid) => {
    if (!uid) return;
    try {
      const res = await fetch(`${API_URL}/profile/read.php?id_user=${uid}`);
      const result = await res.json();
      const prof = result.profile || result.user || result.data || result;

      if (prof && typeof prof === "object") {
        const dbPhoto = prof.PHOTO !== undefined ? prof.PHOTO : prof.photo;
        const dbName =
          prof.FULLNAME ||
          prof.fullname ||
          prof.USERNAME ||
          prof.username ||
          "";

        if (dbPhoto !== undefined) {
          setProfilePhoto(dbPhoto || null);
          setPhotoAttempt(0);
        }
        if (dbName) {
          setDisplayName(dbName);
        }

        const stored = JSON.parse(localStorage.getItem("workly_user") || "null");
        if (stored) {
          localStorage.setItem(
            "workly_user",
            JSON.stringify({
              ...stored,
              ...(dbName ? { FULLNAME: dbName } : {}),
              ...(dbPhoto !== undefined ? { PHOTO: dbPhoto || null } : {}),
            })
          );
        }
      }
    } catch {
      const stored = JSON.parse(localStorage.getItem("workly_user") || "null");
      const fallbackPhoto = stored?.PHOTO || stored?.photo || null;
      setProfilePhoto(fallbackPhoto);
      setPhotoAttempt(0);
    }
  };

  useEffect(() => {
    const syncFromStorageAndDb = () => {
      const stored = JSON.parse(localStorage.getItem("workly_user") || "null");
      setUser(stored);

      const storedPhoto = stored?.PHOTO || stored?.photo || null;
      setProfilePhoto(storedPhoto);
      setPhotoAttempt(0);

      const storedName =
        stored?.FULLNAME ||
        stored?.fullname ||
        stored?.USERNAME ||
        stored?.username ||
        "";
      setDisplayName(storedName);

      const uid = getUserId(stored);
      if (uid) {
        fetchUserProfile(uid);
      }
    };

    syncFromStorageAndDb();

    window.addEventListener("workly-user-updated", syncFromStorageAndDb);
    window.addEventListener("storage", syncFromStorageAndDb);
    return () => {
      window.removeEventListener("workly-user-updated", syncFromStorageAndDb);
      window.removeEventListener("storage", syncFromStorageAndDb);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!authenticated || !userId) {
      setUnreadMessages(0);
      return;
    }

    const fetchUnread = async () => {
      try {
        const res = await fetch(
          `${API_URL}/messages/conversations.php?id_user=${userId}`
        );
        const result = await res.json();
        if (result.status && Array.isArray(result.conversations)) {
          const totalUnread = result.conversations.reduce(
            (sum, c) => sum + (c.unreadCount || 0),
            0
          );
          setUnreadMessages(totalUnread);
        }
      } catch {
        // Abaikan jika endpoint belum tersedia
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, [authenticated, userId, location.pathname]);

  const navLinks = authenticated
    ? [
        { label: "Home", to: "/home" },
        { label: "Explore Job", to: "/jobs" },
        { label: "Post a Job", to: "/post-job" },
        { label: "Activity", to: "/activity" },
      ]
    : [
        { label: "Home", to: "/" },
        { label: "Explore Job", to: "/jobs" },
        { label: "Post a Job", to: "/login" },
      ];

  const isActiveLink = (path) => {
    if (path === "/" || path === "/home") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const photoCandidates = getPhotoCandidates(profilePhoto);
  const activePhotoUrl = photoCandidates[photoAttempt] || null;
  const activeLogoUrl =
    LOGO_CANDIDATES[Math.min(logoAttempt, LOGO_CANDIDATES.length - 1)];

  const initialLetter = (displayName || "U").trim().charAt(0).toUpperCase();

  return (
    <header className="absolute left-0 top-0 z-30 w-full bg-transparent">
      <div className="mx-auto flex h-[96px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:px-[7%]">
        {/* LOGO WORKLY */}
        <Link
          to={authenticated ? "/home" : "/"}
          className="flex shrink-0 items-center"
        >
          <img
            src={activeLogoUrl}
            alt="Workly"
            onError={() => {
              if (logoAttempt < LOGO_CANDIDATES.length - 1) {
                setLogoAttempt((prev) => prev + 1);
              }
            }}
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-10 md:flex lg:gap-12">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`text-sm transition ${
                isActiveLink(item.to)
                  ? "font-semibold text-white"
                  : "font-normal text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="hidden items-center gap-3.5 md:flex">
          {authenticated ? (
            <>
              {/* MESSAGE ICON */}
              <Link
                to="/messages"
                aria-label="Messages"
                className={`relative flex size-9 items-center justify-center rounded-full transition ${
                  location.pathname.startsWith("/messages")
                    ? "bg-[#2865F5] text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <MessageSquare size={19} />
                {unreadMessages > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E34D59] px-1 text-[10px] font-bold text-white">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              {/* NOTIFICATIONS ICON */}
              <Link
                to="/notifications"
                aria-label="Notifications"
                className={`relative flex size-9 items-center justify-center rounded-full transition ${
                  location.pathname.startsWith("/notifications")
                    ? "bg-[#2865F5] text-white"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Bell size={19} fill="currentColor" />
              </Link>

              {/* PROFILE AVATAR */}
              <Link
                to="/profile"
                aria-label="Profile"
                className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-[#3B5BDB] text-xs font-bold text-white transition hover:ring-2 hover:ring-[#8992FF]"
              >
                {activePhotoUrl ? (
                  <img
                    src={activePhotoUrl}
                    alt={displayName || "Profile"}
                    onError={() => setPhotoAttempt((prev) => prev + 1)}
                    className="size-full object-cover"
                  />
                ) : (
                  initialLetter
                )}
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-lg border border-white/25 px-5 py-2 text-xs font-semibold text-white transition hover:border-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-[#2865F5] px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle Menu"
          className="rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileOpen && (
        <div className="mx-6 rounded-2xl border border-white/15 bg-[#0A0B2E]/95 px-6 py-5 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm ${
                  isActiveLink(item.to)
                    ? "font-semibold text-white"
                    : "text-white/75"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {authenticated ? (
              <>
                <Link
                  to="/messages"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-white/85"
                >
                  <MessageSquare size={16} />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="rounded-full bg-[#E34D59] px-2 py-0.5 text-[10px] font-bold text-white">
                      {unreadMessages}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-white/85"
                >
                  <Bell size={16} />
                  Notifications
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-[#8992FF]"
                >
                  My Profile
                </Link>
              </>
            ) : (
              <div className="mt-2 flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg border border-white/25 py-2 text-center text-xs font-semibold text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-lg bg-[#2865F5] py-2 text-center text-xs font-semibold text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
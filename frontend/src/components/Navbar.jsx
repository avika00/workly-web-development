import { Link, useLocation } from "react-router-dom";

function Navbar({ isLoggedIn = false }) {
  const { pathname } = useLocation();

  // Determine active navigation menu
  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }

    if (path === "/home") {
      return pathname === "/home";
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navClass = (active) =>
    `text-sm transition-colors duration-300 hover:text-[#4E59FF] ${
      active ? "font-semibold" : "font-normal"
    }`;

  return (
    <header className="absolute left-0 top-0 z-20 w-full bg-transparent text-white">
      <nav className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-8 md:px-16 lg:px-[7.5%]">
        {/* WORKLY LOGO */}
        <Link
          to={isLoggedIn ? "/home" : "/"}
          className="flex shrink-0 items-center"
        >
          <img
            src="/images/logos/logo-white.png"
            alt="Workly Logo"
            className="h-auto w-[100px] object-contain"
          />
        </Link>

        {/* NAVIGATION MENU */}
        <div className="hidden items-center gap-12 md:flex">
          <Link
            to={isLoggedIn ? "/home" : "/"}
            className={navClass(
              isLoggedIn ? isActive("/home") : isActive("/")
            )}
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className={navClass(isActive("/jobs"))}
          >
            Explore Job
          </Link>

          <Link
            to={isLoggedIn ? "/post-job" : "/register"}
            className={navClass(
              isLoggedIn && isActive("/post-job")
            )}
          >
            Post a Job
          </Link>

          <Link
            to={isLoggedIn ? "/activity" : "/register"}
            className={navClass(
              isLoggedIn && isActive("/activity")
            )}
          >
            Activity
          </Link>
        </div>

        {/* RIGHT MENU */}
        {isLoggedIn ? (
          <div className="flex shrink-0 items-center gap-5">
            {/* NOTIFICATION */}
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="text-white transition hover:text-[#4E59FF]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Z" />
              </svg>
            </Link>

            {/* PROFILE */}
            <Link
              to="/profile"
              aria-label="My Profile"
              className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-[#4E59FF] text-xs font-bold text-white transition hover:ring-2 hover:ring-white/40"
            >
              A
            </Link>
          </div>
        ) : (
          /* SIGN IN */
          <Link
            to="/login"
            className="flex items-center justify-center rounded-full border border-white/70 px-9 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#010133]"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
function Navbar() {
  return (
    <header className="absolute left-0 top-0 z-20 w-full bg-transparent text-white">
      <nav className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-8 md:px-16 lg:px-[7.5%]">

        {/* Workly Logo */}
        <a
          href="#home"
          className="flex shrink-0 items-center"
        >
          <img
            src="/images/logos/logo-white.png"
            alt="Workly Logo"
            className="h-auto w-[100px] object-contain"
          />
        </a>

        {/* Navigation Menu */}
        <div className="hidden items-center gap-12 md:flex">
          <a
            href="#home"
            className="text-sm font-semibold text-white transition-colors duration-300 hover:text-[#4E59FF]"
          >
            Home
          </a>

          <a
            href="#explore"
            className="text-sm font-normal text-white transition-colors duration-300 hover:text-[#4E59FF]"
          >
            Explore Job
          </a>

          <a
            href="#post-job"
            className="text-sm font-normal text-white transition-colors duration-300 hover:text-[#4E59FF]"
          >
            Post a Job
          </a>

          <a
            href="#activity"
            className="text-sm font-normal text-white transition-colors duration-300 hover:text-[#4E59FF]"
          >
            Activity
          </a>
        </div>

        {/* Sign In Button */}
        <a
          href="/register"
          className="flex items-center justify-center rounded-full border border-white/70 px-9 py-2 text-xs font-medium text-white transition-all duration-300 hover:bg-white hover:text-[#010133]"
        >
          Sign In
        </a>

      </nav>
    </header>
  );
}

export default Navbar;
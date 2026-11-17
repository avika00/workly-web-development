function PageFooter() {
  return (
    <footer className="w-full bg-transparent px-8 pb-8 pt-10 text-white sm:px-12 md:px-16 lg:px-[7.3%]">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-5 sm:flex-row sm:items-center">
        {/* Logo */}
        <div className="flex flex-wrap items-center gap-7">
          <img
            src="/images/logos/logo-white.png"
            alt="Workly"
            className="h-auto w-[80px] object-contain"
          />

          <p className="text-xs font-semibold text-white">
            © 2026 Workly. All rights reserved.
          </p>
        </div>

        {/* Policy Links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-[11px] text-white/90 transition-colors hover:text-[#7C83FF]"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}

export default PageFooter;
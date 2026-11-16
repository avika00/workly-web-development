const footerGroups = [
  {
    title: "Explore",
    links: [
      "Explore Jobs",
      "Popular Categories",
      "Recommended Jobs",
      "Saved Jobs",
    ],
  },
  {
    title: "For Users",
    links: ["Post a Job", "My Activity", "Profile", "Messages"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact Us", "FAQ", "Report an Issue"],
  },
];

const socialLinks = [
  { icon: "◎", label: "@workly.idn.id" },
  { icon: "in", label: "Workly IDN" },
  { icon: "𝕏", label: "@workly_idn" },
];

const policyLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
];

function Footer() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-[#010133] text-white">

      {/* LEFT GLOW */}
      <img
        src="/images/workly-glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-[340px] top-1/2 -z-10 w-[620px] -translate-y-1/2 rotate-90 opacity-60 blur-[2px]"
      />

      {/* RIGHT GLOW */}
      <img
        src="/images/workly-glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-[340px] top-1/2 -z-10 w-[620px] -translate-y-1/2 opacity-60 blur-[2px]"
      />

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-[1440px] px-8 pb-8 pt-12 sm:px-12 md:px-16 md:pb-10 md:pt-14 lg:px-[7.3%]">

        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:gap-16">

          {/* BRAND */}
          <div className="max-w-[400px]">
            <a href="#home" className="inline-block">
              <img
                src="/images/logos/logo-white.png"
                alt="Workly"
                className="h-auto w-[150px] object-contain"
              />
            </a>

            <h3 className="mt-5 text-sm font-semibold tracking-wide sm:text-base">
              Find opportunities. Share opportunities.
            </h3>

            <p className="mt-2 max-w-[370px] text-xs leading-6 text-white/85 sm:text-sm">
              A platform to discover jobs, connect with talent, and create new
              opportunities.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="mt-3 flex flex-col gap-2.5">
              {socialLinks.map((social) => (
                <div
                  key={social.label}
                  className="flex items-center gap-2.5 text-[11px] text-white/90 sm:text-xs"
                >
                  <span className="flex w-3 items-center justify-center text-[11px] font-bold">
                    {social.icon}
                  </span>
                  <span>{social.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NAVIGATION */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 sm:gap-x-12 lg:gap-x-16">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="mb-5 text-xs font-semibold text-white sm:text-sm">
                  {group.title}
                </h4>

                <ul className="flex flex-col gap-4">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="/register"
                        className="text-[11px] text-white/85 transition-colors duration-200 hover:text-[#7C83FF] sm:text-xs"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* COPYRIGHT AND POLICIES */}
        <div className="mt-12 flex flex-col gap-4 pt-6 sm:mt-14 sm:flex-row sm:items-center sm:gap-7 sm:pt-0">
          <p className="text-xs font-semibold text-white">
            © 2026 Workly. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {policyLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-[10px] text-white/80 transition-colors hover:text-white sm:text-[11px]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
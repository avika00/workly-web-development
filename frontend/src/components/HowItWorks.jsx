const steps = [
  {
    number: "1",
    title: "Build Your Profile",
    description:
      "Add your skills, interests, experience, and portfolio to create your Workly profile.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <circle cx="24" cy="16" r="8" fill="currentColor" />
        <path
          d="M9 39C9 30.7 15.7 25 24 25C32.3 25 39 30.7 39 39"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    number: "2",
    title: "Explore Opportunities",
    description:
      "Browse jobs based on your skills, interests, location, and preferred work type.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <circle cx="21" cy="21" r="12" />
        <path d="m30 30 10 10" />
      </svg>
    ),
  },
  {
    number: "3",
    title: "Find Your Match",
    description:
      "Get matched with jobs or talents based on relevant skills and interests.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none">
        <path d="M24 7V13M24 35V41M7 24H13M35 24H41" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M31 11C28.8 9.8 26.4 9 24 9C15.7 9 9 15.7 9 24C9 32.3 15.7 39 24 39C32.3 39 39 32.3 39 24" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 17C20.1 17 17 20.1 17 24C17 27.9 20.1 31 24 31C27.9 31 31 27.9 31 24" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M25 23L39 9M32 9H39V16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: "4",
    title: "Get Started",
    description:
      "Apply for a job or post your own opportunity and start working together.",
    icon: (
      <svg viewBox="0 0 48 48" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 25 5-5a5 5 0 0 1 7 7l-8 8a5 5 0 0 1-7 0l-2-2" />
        <path d="m30 23 3-3a5 5 0 0 1 7 7l-8 8" />
        <path d="m15 22 5-5a5 5 0 0 1 7 0" />
        <path d="m11 28 3-3a5 5 0 0 1 7 0" />
      </svg>
    ),
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[#010133] px-6 py-16 text-white md:min-h-[542px] md:px-[7%] md:py-[65px]"
    >
      {/* LEFT GLOW - ORIGINAL RATIO, ROTATED */}
      <img
        src="/images/workly-glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-[320px] top-1/2 -z-10 w-[520px] max-w-none -translate-y-1/2 rotate-90 opacity-80"
      />

      {/* RIGHT GLOW - ORIGINAL RATIO */}
      <img
        src="/images/workly-glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-[320px] top-1/2 -z-10 w-[520px] max-w-none -translate-y-1/2 opacity-80"
      />

      <div className="relative z-10 mx-auto max-w-[1250px]">
        {/* HEADING */}
        <div className="mb-14 flex items-center justify-center gap-3 md:mb-[68px]">
          <h2 className="text-center text-2xl font-bold md:text-[30px]">
            Your Next Move with
          </h2>

          <img
            src="/images/logos/logo-white.png"
            alt="Workly"
            className="h-auto w-[105px] object-contain md:w-[115px]"
          />
        </div>

        {/* DESKTOP TIMELINE */}
        <div className="relative mx-auto hidden h-[195px] w-full lg:block">
          <svg
            viewBox="0 0 1000 195"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            fill="none"
          >
            <path
              d="M155 43 L345 152 M405 152 L595 43 M655 43 L845 152"
              stroke="#737BFF"
              strokeWidth="1.2"
            />
          </svg>

          <div className="relative z-10 grid h-full grid-cols-4">
            {steps.map((step, index) => {
              const isLower = index === 1 || index === 3;

              return (
                <div key={step.number} className="relative flex h-full flex-col items-center">
                  {isLower && (
                    <div className="absolute top-0 flex w-[250px] flex-col items-center text-center">
                      <h3 className="text-[16px] font-bold">{step.title}</h3>
                      <p className="mt-1 max-w-[225px] text-[9px] leading-[1.8] text-white/85">
                        {step.description}
                      </p>
                    </div>
                  )}

                  <div
                    className={`absolute left-1/2 z-20 flex h-[68px] w-[68px] -translate-x-1/2 items-center justify-center rounded-full bg-[#F5F5FF] text-[#4E59FF] shadow-[0_0_12px_rgba(255,255,255,0.12)] ${
                      isLower ? "top-[127px]" : "top-0"
                    }`}
                  >
                    {step.icon}
                    <span className="absolute -left-1 -top-1 flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#4E59FF] text-[11px] font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {!isLower && (
                    <div className="absolute top-[120px] flex w-[250px] flex-col items-center text-center">
                      <h3 className="text-[16px] font-bold">{step.title}</h3>
                      <p className="mt-1 max-w-[225px] text-[9px] leading-[1.8] text-white/85">
                        {step.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE / TABLET TIMELINE */}
        <div className="mx-auto grid max-w-[650px] grid-cols-1 gap-9 sm:grid-cols-2 lg:hidden">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center gap-5">
              <div className="relative flex h-[65px] w-[65px] shrink-0 items-center justify-center rounded-full bg-[#F5F5FF] text-[#4E59FF]">
                {step.icon}
                <span className="absolute -left-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#4E59FF] text-[10px] font-bold text-white">
                  {step.number}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/75">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center text-center md:mt-[72px]">
          <p className="text-base font-medium md:text-[16px]">
            Ready to find your next opportunity?
          </p>

          <a
            href="/register"
            className="mt-5 flex h-[35px] min-w-[138px] items-center justify-center rounded-xl border border-white px-7 text-sm transition duration-300 hover:border-[#4E59FF] hover:bg-[#4E59FF]"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
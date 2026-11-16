import heroTalent from "../assets/hero-talent.jpg";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[760px] overflow-hidden bg-transparent px-5 pt-32 text-white md:min-h-[780px] md:px-10 md:pt-[125px]"
    >
      {/* HERO HEADING */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <h1 className="text-[38px] leading-[1.15] font-bold tracking-tight sm:text-5xl md:text-[42px]">
          Find Your
          <br />
          Next <span className="text-[#4E59FF]">Opportunity</span>
        </h1>

        <p className="mt-4 text-sm text-white/90 sm:text-base md:text-[16px]">
          Discover jobs that match your skills, interests, and goals.
        </p>

        {/* SEARCH BAR */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = "/register";
          }}
          className="mt-5 flex h-[42px] w-full max-w-[420px] items-center rounded-full border border-white/80 bg-transparent px-4"
        >
          <input
            type="text"
            placeholder="Search jobs, skills, or keywords..."
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/80"
          />

          <button
            type="submit"
            aria-label="Search jobs"
            className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center text-white transition hover:text-[#4E59FF]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
        </form>
      </div>

      {/* HERO SHOWCASE */}
      <div className="relative mx-auto mt-16 h-[390px] max-w-[1050px] md:mt-[75px]">
        {/* LEFT: AVAILABLE JOB */}
        <div className="absolute left-0 top-7 z-20 hidden w-[190px] rounded-xl bg-white p-4 text-[#0010FF] shadow-[0_0_18px_rgba(255,255,255,0.65)] sm:block md:w-[205px]">
          <div className="flex items-center gap-2">
            <span className="text-[38px] leading-none font-extrabold md:text-[42px]">
              19M+
            </span>
            <span className="text-[9px] leading-3">
              Available
              <br />
              Job
            </span>
          </div>

          <p className="mt-1 text-[9px] leading-[1.5]">
            Find the opportunity that matches your skills and interests.
          </p>

          <a
            href="/register"
            className="mt-2 inline-flex rounded-lg bg-[#0010FF] px-5 py-1.5 text-[9px] font-medium text-white transition hover:bg-[#4E59FF]"
          >
            Explore Job
          </a>
        </div>

        {/* SMART MATCH LABEL */}
        <div className="absolute left-1/2 top-0 z-30 hidden -translate-x-1/2 rounded-full border border-white/40 bg-white px-3 py-2 text-[8px] font-semibold text-[#0010FF] shadow-[0_0_12px_rgba(255,255,255,0.5)] sm:block">
          Smart Skill Match Find Jobs That Fit You
        </div>

        {/* RIGHT: POST A JOB */}
        <div className="absolute right-0 top-2 z-20 hidden w-[165px] rounded-xl border border-white/20 bg-white/15 p-3 shadow-[0_0_20px_rgba(255,255,255,0.2)] backdrop-blur-md sm:block md:w-[175px] md:p-4">
          <h3 className="text-sm leading-6 font-semibold text-white">
            Build Your Team
            <br />
            Your Way
          </h3>

          <p className="mt-1 text-[10px] leading-[1.5] text-white/90">
            Discover talented people ready to work, collaborate, and grow with
            you.
          </p>

          <a
            href="/register"
            className="mt-3 flex h-7 items-center justify-center rounded-md bg-white text-[9px] font-medium text-[#0010FF] transition hover:bg-[#4E59FF] hover:text-white"
          >
            Post a Job
          </a>
        </div>

        {/* CENTER MAIN CARD */}
        <div className="absolute left-1/2 top-[70px] z-20 w-[min(255px,85vw)] -translate-x-1/2 rounded-[20px] bg-[#F8F8FF] p-[18px] text-[#010133] shadow-[0_0_25px_rgba(255,255,255,0.18)] sm:top-[52px] md:w-[265px]">
          <p className="text-[9px] font-semibold text-[#0010FF]">
            One Platform, More Opportunities
          </p>

          <h2 className="mt-0.5 text-[17px] leading-tight font-bold text-[#0010FF]">
            Find Jobs. Find Talent.
          </h2>

          <p className="mt-1 text-[9px] text-[#33334D]">
            Connect with the right people for your next opportunity.
          </p>

          {/* CARD TABS */}
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {["Explorer", "Create", "Connect"].map((item) => (
              <span
                key={item}
                className="rounded-full bg-[#E8E9FF] px-2 py-1 text-center text-[8px] text-[#55557A]"
              >
                {item}
              </span>
            ))}
          </div>

          {/* HERO TALENT IMAGE */}
          <div className="mt-3 h-[122px] overflow-hidden rounded-lg bg-[#E5E5F0]">
            <img
              src={heroTalent}
              alt="Talent exploring new opportunities"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <a
            href="/register"
            className="mx-auto mt-3 flex h-7 w-[150px] items-center justify-center rounded-lg bg-[#0010FF] text-[9px] font-semibold text-white transition hover:bg-[#4E59FF]"
          >
            Let's Explore Workly!
          </a>
        </div>

        {/* NEW JOB NOTIFICATION */}
        <div className="absolute bottom-[105px] left-[10%] z-30 hidden items-center gap-2 rounded-xl border border-white/30 bg-white/95 px-2 py-1.5 text-[#0010FF] shadow-[0_0_15px_rgba(255,255,255,0.3)] sm:flex">
          <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#E5E5F0]">
            <span className="text-xs">👩🏻</span>
          </div>

          <div>
            <p className="text-[8px] font-semibold">New Job Posted</p>
            <p className="text-[8px]">Social Media Specialist</p>
          </div>
        </div>

        {/* MATCH PERCENTAGE */}
        <div className="absolute bottom-[60px] right-[12%] z-30 hidden items-center gap-2 rounded-xl border border-white/30 bg-white/95 px-3 py-2 text-[#0010FF] shadow-[0_0_15px_rgba(255,255,255,0.3)] sm:flex">
          <span className="text-[17px] font-extrabold">92%</span>

          <span className="text-[7px] leading-[1.4]">
            Match based on your
            <br />
            skills & interests
          </span>
        </div>

        {/* BOTTOM DECORATIVE LIGHT */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -z-0 h-[210px] w-[440px] -translate-x-1/2 bg-gradient-to-t from-[#4E59FF]/25 to-transparent blur-2xl" />
      </div>
    </section>
  );
}

export default Hero;
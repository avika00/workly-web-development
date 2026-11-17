function WelcomeSection() {
  // Data sementara untuk tampilan frontend
  const userName = "Aria Seraphina";

  const handleSearch = (event) => {
    event.preventDefault();

    // Fitur pencarian akan dihubungkan nanti.
  };

  return (
    <section className="relative px-6 pt-[125px] pb-12 text-center text-white">
      <div className="relative z-10 mx-auto max-w-[800px]">

        {/* GREETING */}
        <h1 className="text-[36px] leading-tight font-bold tracking-tight sm:text-[42px] md:text-[48px]">
          Good to see you,
          <br />
          <span className="text-[#4E59FF]">
            {userName}!
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-4 text-sm text-white/90 sm:text-base md:text-[17px]">
          Here are some opportunities that might be right for you.
        </p>

        {/* SEARCH BAR */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-5 flex h-[42px] w-full max-w-[420px] items-center rounded-full border border-white/80 bg-transparent px-4 transition focus-within:border-[#4E59FF] focus-within:ring-2 focus-within:ring-[#4E59FF]/20"
        >
          <input
            type="text"
            placeholder="Search jobs, skills, or keywords..."
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/70"
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
    </section>
  );
}

export default WelcomeSection;
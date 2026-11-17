import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

function JobPostedSuccess() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010133]">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-[500px] w-full bg-no-repeat"
        style={{
          backgroundImage: "url('/images/workly-glow.png')",
          backgroundPosition: "left -180px top -180px",
          backgroundSize: "700px auto",
        }}
      />

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar isLoggedIn={true} />
      </div>

      {/* Success Content */}
      <section className="relative z-10 mt-[90px] flex flex-1 flex-col rounded-t-[36px] bg-[#F5F6FF] px-6 pb-6 pt-9 text-[#101018] sm:px-10 md:px-14">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
          {/* Page Heading */}
          <div className="px-1">
            <h1 className="text-2xl font-bold md:text-[28px]">
              Post a Job
            </h1>
            <p className="mt-2 text-sm text-[#75819A] md:text-base">
              Find the right talent for your team. Fill in the details below
              to create a new job posting.
            </p>
          </div>

          {/* Success Message */}
          <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
            {/* Success Illustration */}
            <div className="relative flex h-[260px] w-[300px] items-center justify-center">
              <div className="absolute h-[220px] w-[220px] rounded-full bg-[#E8E9FF]" />

              <div className="relative flex h-[190px] w-[155px] -rotate-6 flex-col items-center rounded-[22px] border border-[#D7D9FF] bg-white p-5 shadow-[8px_10px_0_#626BFF]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8580F6] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M3 12h18M10 12v2h4v-2" />
                  </svg>
                </div>

                <div className="mt-4 h-2 w-full rounded-full bg-[#C9C8FF]" />
                <div className="mt-2 h-2 w-3/4 self-start rounded-full bg-[#C9C8FF]" />
                <div className="mt-4 h-2 w-full rounded-full bg-[#D8D8FF]" />
                <div className="mt-2 h-2 w-2/3 self-start rounded-full bg-[#D8D8FF]" />
                <div className="mt-4 flex w-full gap-2">
                  <div className="h-5 w-12 rounded-full bg-[#A6A1FF]" />
                  <div className="h-5 w-12 rounded-full bg-[#A6A1FF]" />
                </div>
              </div>

              {/* Check Icon */}
              <div className="absolute right-[30px] top-[95px] flex h-[88px] w-[88px] items-center justify-center rounded-full border-[5px] border-white bg-[#43B98C] text-white shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              {/* Decorative Elements */}
              <span className="absolute left-5 top-12 text-4xl text-[#7955F5]">
                ✦
              </span>
              <span className="absolute right-2 top-7 text-3xl text-[#5685FF]">
                〰
              </span>
              <span className="absolute bottom-10 left-7 text-4xl text-[#5685FF]">
                〰
              </span>
              <span className="absolute bottom-12 right-3 text-2xl text-[#29B99B]">
                ✦
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold md:text-[30px]">
              Job Posted Successfully!
            </h2>

            <p className="mt-2 max-w-[390px] text-sm leading-6 text-[#75819A] md:text-base">
              Your job posting has been published and is now visible to
              potential candidates.
            </p>

            <button
              type="button"
              onClick={() => navigate("/post-job")}
              className="mt-5 flex h-[60px] min-w-[208px] items-center justify-center rounded-xl bg-[#2865F5] px-8 text-sm font-semibold text-white transition hover:bg-[#174FE0]"
            >
              View Job Post
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto w-full max-w-[1440px]">
          <PageFooter />
        </div>
      </section>
    </main>
  );
}

export default JobPostedSuccess;
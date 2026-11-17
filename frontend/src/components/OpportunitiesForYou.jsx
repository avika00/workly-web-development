import { useState } from "react";
import { Link } from "react-router-dom";

import uiuxImage from "../assets/images/jobs/ui-ux-designer.jpg";
import frontendImage from "../assets/images/jobs/frontend-developer.jpg";
import socialMediaImage from "../assets/images/jobs/social-media-analyst.jpg";

const opportunities = [
  {
    id: 1,
    title: "UI/UX Designer Creative Studio",
    type: "Remote · Freelance",
    salary: "Rp2–4M",
    hashtags: "#Creative #Figma #UserResearch",
    image: uiuxImage,
  },
  {
    id: 2,
    title: "Frontend Developer Tech Company",
    type: "Remote · Full-time",
    salary: "Rp5–8M",
    hashtags: "#Coding #React #WebDevelopment",
    image: frontendImage,
  },
  {
    id: 3,
    title: "Social Media Analyst Fashion Local Brand",
    type: "Hybrid · Part-time",
    salary: "Rp2–3M",
    hashtags: "#SocialMedia #Marketing #Analytics",
    image: socialMediaImage,
  },
];

function OpportunitiesForYou() {
  const [activeJob, setActiveJob] = useState(null);

  return (
    <section className="bg-[#F5F6FF] px-6 py-12 text-[#010133] md:px-[7%] md:py-12">
      <div className="mx-auto max-w-[1500px]">

        {/* SECTION HEADER */}
        <div className="mb-12 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0010FF] md:text-[36px]">
              Opportunities For You
            </h2>

            <p className="mt-1 text-base text-[#0010FF] md:text-[25px]">
              Jobs matched with your skills and interests.
            </p>
          </div>

          <Link
            to="/jobs"
            className="flex h-[46px] w-[165px] shrink-0 items-center justify-center rounded-xl bg-[#0010FF] text-sm text-white transition hover:bg-[#121984]"
          >
            View All
          </Link>
        </div>

        {/* EXPANDING JOB CARDS */}
        <div
          className="flex items-stretch gap-5 md:gap-8"
          onMouseLeave={() => setActiveJob(null)}
        >
          {opportunities.map((job) => {
            const isActive = activeJob === job.id;
            const isOtherActive =
              activeJob !== null && activeJob !== job.id;

            return (
              <article
                key={job.id}
                onMouseEnter={() => setActiveJob(job.id)}
                style={{
                  flexGrow: isActive ? 1.7 : isOtherActive ? 0.98 : 1,
                  flexBasis: 0,
                }}
                className="group relative h-[520px] min-w-0 overflow-hidden rounded-[24px] border border-[#D7D7E5] bg-[#F5F6FF] shadow-[0_3px_8px_rgba(0,0,0,0.22)] transition-[flex-grow] duration-500 ease-in-out"
              >
                {/* NORMAL IMAGE */}
                <div
                  className={`relative h-[62%] overflow-hidden transition-all duration-500 ${
                    isActive ? "h-full" : ""
                  }`}
                >
                  <img
                    src={job.image}
                    alt={job.title}
                    className={`h-full w-full object-cover transition-all duration-500 ${
                      isActive ? "scale-105" : ""
                    }`}
                  />

                  {/* NORMAL SALARY */}
                  <span
                    className={`absolute bottom-4 right-4 rounded-lg bg-[#FF7700] px-4 py-2 text-sm font-semibold text-white transition-opacity duration-300 ${
                      isActive ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    {job.salary}
                  </span>
                </div>

                {/* NORMAL INFORMATION */}
                <div
                  className={`flex h-[38%] flex-col justify-between px-5 py-4 transition-opacity duration-200 ${
                    isActive
                      ? "pointer-events-none absolute opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-bold leading-snug text-black">
                      {job.title}
                    </h3>

                    <p className="mt-2 text-base text-black">
                      {job.type}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="flex h-[42px] w-[140px] items-center justify-center rounded-xl bg-[#0010FF] text-sm text-white transition hover:bg-[#121984]"
                    >
                      Apply
                    </Link>
                  </div>
                </div>

                {/* DARK HOVER OVERLAY */}
                <div
                  className={`pointer-events-none absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/35 to-transparent p-6 transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="mb-auto mt-auto">
                    <p className="mb-3 text-base text-white">
                      {job.hashtags}
                    </p>

                    <h3 className="text-2xl font-bold leading-tight text-white md:text-[34px]">
                      {job.title}
                    </h3>

                    <p className="mt-3 text-xl text-white md:text-[26px]">
                      {job.type}
                    </p>
                  </div>

                  {/* HOVER SALARY */}
                  <span className="absolute bottom-6 left-6 rounded-lg bg-[#FF7700] px-5 py-2 text-sm font-semibold text-white">
                    {job.salary}
                  </span>
                </div>

                {/* HOVER APPLY */}
                <Link
                  to={`/jobs/${job.id}`}
                  aria-label={`Apply for ${job.title}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`absolute bottom-6 right-6 z-20 flex h-[42px] w-[145px] items-center justify-center rounded-xl bg-[#0010FF] text-sm text-white transition-opacity duration-300 hover:bg-[#121984] ${
                    isActive
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                >
                  Apply
                </Link>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default OpportunitiesForYou;
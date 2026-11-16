import { useState } from "react";

import uiUxImage from "../assets/images/jobs/ui-ux-designer.jpg";
import frontendImage from "../assets/images/jobs/frontend-developer.jpg";
import socialMediaImage from "../assets/images/jobs/social-media-analyst.jpg";

function Opportunities() {
  // Tidak ada kartu yang aktif saat halaman pertama kali dibuka
  const [activeJob, setActiveJob] = useState(null);

  const jobs = [
    {
      id: 1,
      title: "UI/UX Designer Creative Studio",
      type: "Remote · Freelance",
      salary: "Rp2–4M",
      tags: "#Creative #Figma #UserResearch",
      image: uiUxImage,
    },
    {
      id: 2,
      title: "Frontend Developer Tech Company",
      type: "Remote · Full-time",
      salary: "Rp5–8M",
      tags: "#Coding #React #WebDevelopment",
      image: frontendImage,
    },
    {
      id: 3,
      title: "Social Media Analyst Fashion Local Brand",
      type: "Hybrid · Part-time",
      salary: "Rp2–3M",
      tags: "#SocialMedia #Marketing #Content",
      image: socialMediaImage,
    },
  ];

  return (
    <section
      id="explore"
      className="bg-[#F5F5FF] px-6 py-16 text-[#010133] md:px-[7%] md:py-20"
    >
      <div className="mx-auto max-w-[1400px]">

        {/* SECTION HEADER */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#0010FF] md:text-[36px]">
              Opportunities You Might Like
            </h2>

            <p className="mt-2 text-sm text-[#0010FF] md:text-[22px]">
              Discover new roles selected based on your skills and interests.
            </p>
          </div>

          <a
            href="/register"
            className="flex h-11 w-fit items-center justify-center rounded-xl bg-[#0010FF] px-8 text-sm font-medium text-white transition duration-300 hover:bg-[#4E59FF]"
          >
            Explore All Job
          </a>
        </div>

        {/* JOB CARDS */}
        <div className="flex flex-col gap-6 sm:flex-row">

          {jobs.map((job, index) => {
            const isActive = activeJob === index;

            return (
              <article
                key={job.id}
                onClick={() => setActiveJob(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveJob(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`Pilih ${job.title}`}
                className={`
                  group relative h-[360px] w-full min-w-0 cursor-pointer
                  overflow-hidden rounded-[24px]
                  border border-[#D8D8E5] bg-[#F5F5FF]
                  shadow-[0_3px_8px_rgba(0,0,0,0.22)]
                  transition-all duration-500 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-[#4E59FF]
                  ${
                    isActive
                      ? "sm:flex-[1.7]"
                      : "sm:flex-1"
                  }
                `}
              >
                {/* JOB IMAGE */}
                <img
                  src={job.image}
                  alt={job.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                {/* ACTIVE CARD */}
                {isActive && (
                  <>
                    {/* IMAGE OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

                    {/* ACTIVE JOB INFORMATION */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 text-white md:p-8">

                      <p className="mb-3 text-sm font-medium text-white md:text-base">
                        {job.tags}
                      </p>

                      <h3 className="text-xl leading-tight font-bold md:text-[30px]">
                        {job.title}
                      </h3>

                      <p className="mt-3 text-base md:text-[22px]">
                        {job.type}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <span className="rounded-lg bg-[#FF7700] px-5 py-2 text-sm font-semibold text-white">
                          {job.salary}
                        </span>

                        <a
                          href="/register"
                          onClick={(event) => event.stopPropagation()}
                          className="flex h-12 w-[38%] min-w-[110px] items-center justify-center rounded-xl bg-[#0010FF] text-sm font-medium text-white transition hover:bg-[#4E59FF]"
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                  </>
                )}

                {/* INACTIVE CARD */}
                {!isActive && (
                  <>
                    {/* SALARY BADGE */}
                    <span className="absolute right-4 top-[48%] z-10 rounded-lg bg-[#FF7700] px-3 py-2 text-xs font-semibold text-white">
                      {job.salary}
                    </span>

                    {/* JOB INFORMATION */}
                    <div className="absolute inset-x-0 bottom-0 z-10 min-h-[150px] bg-[#F5F5FF] p-5">

                      <h3 className="text-lg leading-snug font-bold text-black">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-base text-black">
                        {job.type}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <a
                          href="/register"
                          onClick={(event) => event.stopPropagation()}
                          className="flex h-10 w-[43%] min-w-[90px] items-center justify-center rounded-xl bg-[#0010FF] text-sm font-medium text-white transition hover:bg-[#4E59FF]"
                        >
                          Apply
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </article>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default Opportunities;
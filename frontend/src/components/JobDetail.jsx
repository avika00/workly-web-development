import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  MoreVertical,
} from "lucide-react";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const jobData = {
  "1": {
    title: "UI/UX Designer",
    company: "CV. Creative Studio",
    icon: "🎨",
    status: "Active",
    location: "Remote",
    type: "Freelance",
    salary: "Rp2–4M",
    description:
      "We're looking for a creative UI/UX Designer to help us design modern web and mobile applications that solve real user problems. You will work closely with our product and engineering teams to create intuitive and visually appealing digital experiences.",
    responsibilities: [
      "Design mobile app and web interfaces with high fidelity",
      "Create wireframes, user flows, and interactive prototypes",
      "Conduct basic user research and usability testing",
      "Collaborate with development team for seamless design handoff",
    ],
    skills: ["Figma", "UI/UX", "Prototyping", "User Research"],
    experience: "Mid-Level / 2+ Years",
    deadline: "October 21st 2026",
  },
  "2": {
    title: "Frontend Developer",
    company: "CV. Creative Studio",
    icon: "💻",
    status: "Active",
    location: "Remote",
    type: "Freelance",
    salary: "Rp3–5M",
    description:
      "We are looking for a Frontend Developer who is passionate about building responsive, accessible, and interactive web applications. You will collaborate with designers and backend developers to deliver excellent user experiences.",
    responsibilities: [
      "Develop responsive web interfaces using modern technologies",
      "Translate UI/UX designs into reusable components",
      "Integrate frontend applications with REST APIs",
      "Optimize website performance and accessibility",
    ],
    skills: ["HTML", "CSS", "JavaScript", "React"],
    experience: "Junior / 1+ Years",
    deadline: "October 25th 2026",
  },
};

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const job = jobData[id] || jobData["1"];

  const [isSaved, setIsSaved] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleApply = () => {
    navigate("/register");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010133] text-white">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/workly-glow.png'), url('/images/workly-glow.png')",
          backgroundPosition:
            "left -180px top -180px, right -180px bottom -180px",
          backgroundSize: "700px auto, 700px auto",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />

      <div className="relative z-10">
        {/* Navbar */}
        <Navbar isLoggedIn={true} />

        {/* Main Content */}
        <section className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-[125px] sm:px-10 lg:px-[7%]">
          {/* Back Button */}
          <button
            onClick={() => navigate("/jobs")}
            className="mb-8 text-sm text-white transition hover:text-[#4E59FF]"
          >
            &lt; Back to Explore Job
          </button>

          {/* Job Heading */}
          <div className="mb-10 flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="flex h-[75px] w-[75px] shrink-0 items-center justify-center rounded-2xl bg-white/5 text-5xl">
                {job.icon}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-2xl font-bold sm:text-3xl">
                    {job.title}
                  </h1>

                  <span className="rounded-full bg-[#2FA66D] px-7 py-1.5 text-xs font-semibold text-white">
                    {job.status}
                  </span>
                </div>

                <p className="mt-2 text-base text-white">
                  {job.company}
                </p>

                <p className="mt-2 text-sm text-white/80">
                  {job.location} · {job.type} · {job.salary}
                </p>
              </div>
            </div>

            {/* More Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                aria-label="More options"
                className="rounded-lg p-2 text-white transition hover:bg-white/10"
              >
                <MoreVertical size={26} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 z-30 w-44 rounded-xl border border-white/10 bg-[#171744] p-2 shadow-xl">
                  <button
                    onClick={() => setShowMenu(false)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                  >
                    Report Job
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Job Information */}
          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left Card */}
            <div className="rounded-2xl border border-white/10 bg-[#101039]/75 p-7 sm:p-8">
              {/* About */}
              <div>
                <h2 className="mb-4 text-xl font-semibold">
                  About the Job
                </h2>

                <p className="text-sm leading-[1.85] text-white/65 sm:text-base">
                  {job.description}
                </p>
              </div>

              <div className="my-8 border-t border-white/10" />

              {/* Responsibilities */}
              <div>
                <h2 className="mb-5 text-xl font-semibold">
                  Responsibilities
                </h2>

                <div className="space-y-4">
                  {job.responsibilities.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#17316D] text-[#4E8BFF]">
                        <Check size={13} />
                      </span>

                      <p className="text-sm leading-6 text-white/65 sm:text-base">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Card */}
            <aside className="h-fit rounded-2xl border border-white/10 bg-[#101039]/75 p-7 sm:p-8">
              {/* Apply Button */}
              <button
                onClick={handleApply}
                className="w-full rounded-xl bg-[#0010FF] py-4 text-sm font-semibold text-white transition hover:bg-[#2637FF]"
              >
                Apply Now
              </button>

              {/* Save Button */}
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm transition ${
                  isSaved
                    ? "border-[#4E59FF] bg-[#4E59FF]/15 text-[#AAB0FF]"
                    : "border-[#282B70] text-white hover:bg-white/5"
                }`}
              >
                <Bookmark
                  size={17}
                  fill={isSaved ? "currentColor" : "none"}
                />
                {isSaved ? "Saved Job" : "Save Job"}
              </button>

              <div className="my-6 border-t border-white/10" />

              {/* Skills */}
              <div>
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-[#858DB5]">
                  SKILLS
                </h3>

                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[#29368A] bg-[#17236C] px-4 py-2 text-xs text-[#D5D9F5]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-[#858DB5]">
                  EXPERIENCE LEVEL
                </h3>

                <span className="inline-block rounded-full border border-[#29368A] bg-[#17236C] px-4 py-2 text-xs text-[#D5D9F5]">
                  {job.experience}
                </span>
              </div>

              {/* Deadline */}
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold tracking-wider text-[#858DB5]">
                  APPLICATION DEADLINE
                </h3>

                <span className="inline-block rounded-full border border-[#29368A] bg-[#17236C] px-4 py-2 text-xs text-[#D5D9F5]">
                  {job.deadline}
                </span>
              </div>
            </aside>
          </div>
        </section>

        <PageFooter />
      </div>
    </main>
  );
}

export default JobDetail;
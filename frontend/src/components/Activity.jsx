import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const activityData = [
  {
    id: 1,
    title: "Tax Consultant",
    company: "PT. ABC JAWA JAYA",
    workType: "Remote · Full-Time · Rp7–9M",
    category: "Application",
    status: "Accepted",
    icon: "📩",
    link: "/jobs/1",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CV. Depan Belakang Abadi",
    workType: "WFO · Part-Time · Rp1–2M",
    category: "Saved Jobs",
    status: "Saved",
    icon: "🔖",
    link: "/jobs/2",
  },
  {
    id: 3,
    title: "IT Consultant",
    company: "PT. Pencari Cinta Sejati",
    workType: "WFO · Full-Time · Rp8–10M",
    category: "Job Posted",
    status: "Posted",
    icon: "📢",
    link: "/post-job/1",
  },
];

const filters = ["All", "Application", "Saved Jobs", "Job Posted"];

const statusStyles = {
  Accepted: "bg-[#12A968] text-white",
  Pending: "bg-[#2865F5] text-white",
  Rejected: "bg-[#E34D59] text-white",
  Saved: "bg-[#777777] text-white",
  Posted: "bg-[#4145FF] text-white",
};

function ActivityCard({ activity, onViewDetails }) {
  return (
    <article className="group flex min-h-[114px] items-center justify-between gap-5 rounded-2xl border border-[#55568B]/70 bg-gradient-to-r from-[#171943]/95 to-[#111333]/95 px-6 py-5 shadow-[inset_0_1px_8px_rgba(255,255,255,0.035)] transition duration-300 hover:border-[#626CFF] hover:bg-[#1B2056] sm:px-8">
      <div className="flex min-w-0 items-center gap-6">
        <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center text-[43px]">
          {activity.icon}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              {activity.title}
            </h2>

            <span
              className={`rounded-full px-5 py-1 text-[11px] font-medium ${statusStyles[activity.status]}`}
            >
              {activity.status}
            </span>
          </div>

          <p className="mb-2 text-sm text-white/90">
            {activity.company}
          </p>

          <p className="text-xs text-white/80 sm:text-[13px]">
            {activity.workType}
          </p>
        </div>
      </div>

      <button
        onClick={onViewDetails}
        className="flex shrink-0 items-center gap-1 text-xs text-white underline underline-offset-4 transition hover:text-[#8D9AFF] sm:text-sm"
      >
        View Details
        <ChevronRight size={15} />
      </button>
    </article>
  );
}

function Activity() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredActivities = useMemo(() => {
    if (activeFilter === "All") return activityData;

    return activityData.filter(
      (activity) => activity.category === activeFilter
    );
  }, [activeFilter]);

  return (
    <main className="relative isolate flex min-h-screen flex-col overflow-hidden bg-[#010133] text-white">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[-1] bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/workly-glow.png'), url('/images/workly-glow.png')",
          backgroundPosition:
            "left -180px top -180px, right -180px bottom -180px",
          backgroundSize: "700px auto, 700px auto",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />

      {/* Navbar */}
      <div className="relative h-[105px] shrink-0">
        <Navbar isLoggedIn={true} />
      </div>

      {/* Main Content */}
      <section className="relative mx-auto w-full max-w-[1440px] flex-1 px-6 pb-16 pt-8 sm:px-10 lg:px-[6.5%]">
        {/* Page Heading */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            My Activity
          </h1>

          <p className="mt-3 text-sm text-white/90 sm:text-base">
            Manage your opportunities and connect with the right talent.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10 flex flex-wrap items-center gap-2.5">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-2 text-xs transition-all duration-300 sm:px-6 ${
                  isActive
                    ? "border-[#326AFF] bg-[#2865F5] text-white shadow-[0_0_15px_rgba(40,101,245,0.3)]"
                    : "border-[#303568] bg-[#101438]/90 text-white/75 hover:border-[#626DFF] hover:text-white"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Activity List */}
        <div className="flex flex-col gap-7">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onViewDetails={() => navigate(activity.link)}
              />
            ))
          ) : (
            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-center">
              <span className="mb-4 text-4xl">📂</span>

              <h2 className="text-lg font-semibold text-white">
                No Activity Found
              </h2>

              <p className="mt-2 text-sm text-white/60">
                There are no activities in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-10 mt-auto">
        <PageFooter />
      </div>
    </main>
  );
}

export default Activity;
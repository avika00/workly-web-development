import { useEffect, useMemo, useState } from "react";
import { ChevronRight, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

const filters = ["All", "Application", "Saved Jobs", "Job Posted"];

const statusStyles = {
  Accepted: "bg-[#12A968] text-white",
  Pending: "bg-[#2865F5] text-white",
  Rejected: "bg-[#E34D59] text-white",
  Saved: "bg-[#777777] text-white",
  Posted: "bg-[#4145FF] text-white",
  Active: "bg-[#12A968] text-white",
  Closed: "bg-[#B83C43] text-white",
  Draft: "bg-[#777B8A] text-white",
};

const categoryBadges = {
  Application: {
    label: "📩 Application",
    style: "border border-[#4E59FF]/60 bg-[#4E59FF]/20 text-[#B8C0FF]",
  },
  "Saved Jobs": {
    label: "🔖 Saved Job",
    style: "border border-white/25 bg-white/10 text-white/90",
  },
  "Job Posted": {
    label: "📢 Job Posted",
    style: "border border-[#38BDF8]/50 bg-[#38BDF8]/15 text-[#93E1FF]",
  },
};

const categoryIcons = {
  Application: "📩",
  "Saved Jobs": "🔖",
  "Job Posted": "📢",
};

function ActivityCard({ activity, onViewDetails, onMessage }) {
  const actionBadge = categoryBadges[activity.category];

  return (
    <article className="group flex min-h-[114px] flex-col justify-between gap-4 rounded-2xl border border-[#55568B]/70 bg-gradient-to-r from-[#171943]/95 to-[#111333]/95 px-6 py-5 shadow-[inset_0_1px_8px_rgba(255,255,255,0.035)] transition duration-300 hover:border-[#626CFF] hover:bg-[#1B2056] sm:flex-row sm:items-center sm:px-8">
      <div className="flex min-w-0 items-center gap-6">
        <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-xl text-[43px]">
          {activity.logo ? (
            <img
              src={`${API_URL}/uploads/logos/${activity.logo}`}
              alt={activity.company}
              className="h-full w-full bg-white object-contain p-1.5"
            />
          ) : (
            categoryIcons[activity.category] || "💼"
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              {activity.title}
            </h2>

            {/* Badge Keterangan Aksi (Application / Saved Job / Job Posted) */}
            {actionBadge && (
              <span
                className={`rounded-full px-3.5 py-1 text-[11px] font-semibold ${actionBadge.style}`}
              >
                {actionBadge.label}
              </span>
            )}

            {/* Badge Status (Pending, Accepted, Rejected, Active, Closed, dll.) */}
            {activity.category !== "Saved Jobs" && (
              <span
                className={`rounded-full px-4 py-1 text-[11px] font-medium ${
                  statusStyles[activity.status] || "bg-[#4145FF] text-white"
                }`}
              >
                {activity.status}
              </span>
            )}
          </div>

          <p className="mb-2 text-sm text-white/90">
            {activity.company}
          </p>

          <p className="text-xs text-white/80 sm:text-[13px]">
            {activity.type} · {activity.salary}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 self-end sm:self-center">
        {activity.category === "Application" && (
          <button
            type="button"
            onClick={onMessage}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#4E59FF] bg-[#1B2066] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#28308F]"
          >
            <MessageSquare size={14} />
            Message
          </button>
        )}

        <button
          onClick={onViewDetails}
          className="flex shrink-0 cursor-pointer items-center gap-1 text-xs text-white underline underline-offset-4 transition hover:text-[#8D9AFF] sm:text-sm"
        >
          View Details
          <ChevronRight size={15} />
        </button>
      </div>
    </article>
  );
}

function Activity() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }

    const fetchActivities = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(
          `${API_URL}/activity/read.php?id_user=${currentUser.ID_USER}`
        );
        const result = await res.json();

        if (result.status && Array.isArray(result.activities)) {
          setActivities(result.activities);
        } else {
          setActivities([]);
          setErrorMsg(result.message || "Gagal memuat aktivitas.");
        }
      } catch (err) {
        console.error("Gagal memuat aktivitas:", err);
        setActivities([]);
        setErrorMsg("Endpoint backend/activity/read.php tidak dapat diakses.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser?.ID_USER, navigate]);

  const filterCounts = useMemo(() => {
    return {
      All: activities.length,
      Application: activities.filter((a) => a.category === "Application").length,
      "Saved Jobs": activities.filter((a) => a.category === "Saved Jobs").length,
      "Job Posted": activities.filter((a) => a.category === "Job Posted").length,
    };
  }, [activities]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === "All") return activities;

    return activities.filter(
      (activity) => activity.category === activeFilter
    );
  }, [activities, activeFilter]);

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
                    ? "border-[#326AFF] bg-[#2865F5] font-semibold text-white shadow-[0_0_15px_rgba(40,101,245,0.3)]"
                    : "border-[#303568] bg-[#101438]/90 text-white/75 hover:border-[#626DFF] hover:text-white"
                }`}
              >
                {filter} ({filterCounts[filter] ?? 0})
              </button>
            );
          })}
        </div>

        {/* Activity List */}
        <div className="flex flex-col gap-7">
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/70">
              Memuat riwayat aktivitas...
            </div>
          ) : errorMsg ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-[#E34D59]/40 bg-[#E34D59]/10 px-6 text-center">
              <p className="text-sm font-semibold text-[#FF8A93]">{errorMsg}</p>
            </div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onViewDetails={() => navigate(activity.detailLink)}
                onMessage={() =>
                  navigate(`/messages/${String(activity.id).replace("app-", "")}`)
                }
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
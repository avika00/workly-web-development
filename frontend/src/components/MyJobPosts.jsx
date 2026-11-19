import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

function MyJobPosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");
  const filters = ["All", "Active", "Closed", "Draft"];

  useEffect(() => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }

    const fetchMyJobs = async () => {
      try {
        const res = await fetch(
          `${API_URL}/jobs/my_jobs.php?id_user=${currentUser.ID_USER}`
        );
        const result = await res.json();

        if (result.status) {
          setJobs(result.jobs);
        }
      } catch (err) {
        console.error("Gagal memuat daftar lowongan:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [currentUser?.ID_USER, navigate]);

  const filteredJobs =
    activeFilter === "All"
      ? jobs
      : jobs.filter((job) => job.status === activeFilter);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010133] text-white">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/workly-glow.png'), url('/images/workly-glow.png')",
          backgroundPosition:
            "left -180px top -180px, right -180px bottom -180px",
          backgroundSize: "700px auto, 700px auto",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar isLoggedIn={true} />

        <section className="mx-auto w-full max-w-[1440px] flex-1 px-8 pb-12 pt-[135px] md:px-16 lg:px-[7%]">
          {/* Page Heading */}
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-[36px]">
                My Job Posts
              </h1>

              <p className="mt-3 text-sm text-white/90 md:text-base">
                Manage your opportunities and connect with the right talent.
              </p>
            </div>

            <button
              onClick={() => navigate("/post-job/create/company")}
              className="flex h-[42px] shrink-0 items-center justify-center rounded-xl bg-[#0010FF] px-7 text-xs font-semibold text-white transition hover:bg-[#2638FF]"
            >
              + Post a Job
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`min-w-[94px] rounded-full border px-5 py-2 text-xs transition duration-200 ${
                  activeFilter === filter
                    ? "border-[#2465F5] bg-[#2465F5] font-semibold text-white shadow-[0_0_15px_rgba(36,101,245,0.25)]"
                    : "border-white/10 bg-[#0D123A]/80 text-white/80 hover:border-white/30 hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Job List */}
          <div className="mt-10 flex flex-col gap-7">
            {loading ? (
              <div className="rounded-2xl border border-white/20 bg-white/[0.05] py-14 text-center text-sm text-white/70">
                Memuat daftar lowongan...
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="flex min-h-[132px] flex-col justify-between gap-5 rounded-2xl border border-white/30 bg-white/[0.075] px-6 py-6 shadow-[inset_0_0_25px_rgba(255,255,255,0.025)] backdrop-blur-md transition duration-300 hover:border-white/50 sm:flex-row sm:items-center sm:px-8"
                >
                  {/* Job Information */}
                  <div className="flex items-center gap-6">
                    <div className="flex h-[70px] w-[90px] shrink-0 items-center justify-center text-[48px]">
                      {job.logo ? (
                        <img
                          src={`${API_URL}/uploads/logos/${job.logo}`}
                          alt={job.company}
                          className="h-16 w-16 rounded-xl bg-white object-contain p-1.5"
                        />
                      ) : (
                        "💼"
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl font-bold md:text-[24px]">
                          {job.title}
                        </h2>

                        <span className="rounded-lg bg-[#4247FF] px-4 py-2 text-[10px] font-medium text-white">
                          {job.applicants} Applicants
                        </span>

                        <span
                          className={`rounded-lg px-5 py-2 text-[10px] font-medium text-white ${
                            job.status === "Active"
                              ? "bg-[#32A66B]"
                              : job.status === "Closed"
                                ? "bg-[#B83C43]"
                                : "bg-[#777B8A]"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-white">
                        {job.company}
                      </p>

                      <p className="mt-2 text-xs text-white/90">
                        {job.type} · {job.salary}
                      </p>
                    </div>
                  </div>

                  {/* View Details */}
                  <Link
                    to={`/post-job/${job.id}`}
                    className="shrink-0 self-start text-sm text-white underline underline-offset-4 transition hover:text-[#7C83FF] sm:self-center"
                  >
                    View Details ›
                  </Link>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-white/20 bg-white/[0.05] py-14 text-center">
                <p className="text-base font-semibold text-white">
                  No {activeFilter.toLowerCase()} job posts yet.
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Your job postings will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        <PageFooter />
      </div>
    </main>
  );
}

export default MyJobPosts;
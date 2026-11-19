import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  Check,
  MoreVertical,
} from "lucide-react";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      try {
        const userQuery = currentUser?.ID_USER ? `&id_user=${currentUser.ID_USER}` : "";
        const res = await fetch(`${API_URL}/jobs/detail.php?id_job=${id}${userQuery}`);
        const result = await res.json();

        if (result.status && result.job) {
          setJob(result.job);
          setIsSaved(result.job.isSaved);
          setHasApplied(result.job.hasApplied);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail lowongan:", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id, currentUser?.ID_USER]);

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "No deadline";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApply = async () => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }

    if (hasApplied || job?.isOwner || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/jobs/apply.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: currentUser.ID_USER,
          id_job: job.id,
        }),
      });
      const result = await res.json();

      if (result.status) {
        setHasApplied(true);
        alert(result.message || "Lamaran berhasil dikirim!");
      } else {
        alert(result.message || "Gagal mengirim lamaran.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleSave = async () => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/jobs/toggle_save.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: currentUser.ID_USER,
          id_job: job.id,
        }),
      });
      const result = await res.json();

      if (result.status) {
        setIsSaved(result.isSaved);
      } else {
        alert(result.message || "Gagal menyimpan lowongan.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    }
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
        <Navbar isLoggedIn={Boolean(currentUser)} />

        {/* Main Content */}
        <section className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-[125px] sm:px-10 lg:px-[7%]">
          {/* Back Button */}
          <button
            onClick={() => navigate("/jobs")}
            className="mb-8 text-sm text-white transition hover:text-[#4E59FF]"
          >
            &lt; Back to Explore Job
          </button>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#101039]/75 py-20 text-center text-sm text-white/75">
              Memuat detail lowongan...
            </div>
          ) : !job ? (
            <div className="rounded-2xl border border-white/10 bg-[#101039]/75 py-20 text-center">
              <h2 className="text-xl font-bold">Lowongan tidak ditemukan</h2>
              <p className="mt-2 text-sm text-white/60">
                Lowongan mungkin sudah dihapus atau tautan tidak valid.
              </p>
            </div>
          ) : (
            <>
              {/* Job Heading */}
              <div className="mb-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="flex h-[75px] w-[75px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5 text-5xl">
                    {job.logo ? (
                      <img
                        src={`${API_URL}/uploads/logos/${job.logo}`}
                        alt={job.company}
                        className="h-full w-full bg-white object-contain p-2"
                      />
                    ) : (
                      "💼"
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-4">
                      <h1 className="text-2xl font-bold sm:text-3xl">
                        {job.title}
                      </h1>

                      <span
                        className={`rounded-full px-7 py-1.5 text-xs font-semibold text-white ${
                          job.status === "Active"
                            ? "bg-[#2FA66D]"
                            : "bg-[#B83C43]"
                        }`}
                      >
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
                        onClick={() => {
                          setShowMenu(false);
                          alert("Laporan telah dikirim ke tim Workly.");
                        }}
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

                    <p className="whitespace-pre-line text-sm leading-[1.85] text-white/65 sm:text-base">
                      {job.description}
                    </p>
                  </div>

                  <div className="my-8 border-t border-white/10" />

                  {/* Responsibilities */}
                  <div>
                    <h2 className="mb-5 text-xl font-semibold">
                      Responsibilities
                    </h2>

                    {job.responsibilities.length > 0 ? (
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
                    ) : (
                      <p className="text-sm text-white/50">
                        No specific responsibilities listed.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Card */}
                <aside className="h-fit rounded-2xl border border-white/10 bg-[#101039]/75 p-7 sm:p-8">
                  {/* Apply Button */}
                  <button
                    onClick={handleApply}
                    disabled={hasApplied || job.isOwner || submitting || job.status !== "Active"}
                    className={`w-full rounded-xl py-4 text-sm font-semibold text-white transition ${
                      hasApplied
                        ? "cursor-default bg-[#2FA66D]"
                        : job.isOwner || job.status !== "Active"
                          ? "cursor-not-allowed bg-white/15 text-white/60"
                          : "bg-[#0010FF] hover:bg-[#2637FF]"
                    }`}
                  >
                    {job.isOwner
                      ? "Your Job Post"
                      : hasApplied
                        ? "Applied ✓"
                        : job.status !== "Active"
                          ? "Closed"
                          : submitting
                            ? "Applying..."
                            : "Apply Now"}
                  </button>

                  {/* Save Button */}
                  <button
                    onClick={handleToggleSave}
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

                    {job.skills.length > 0 ? (
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
                    ) : (
                      <p className="text-xs text-white/50">No specific skills required.</p>
                    )}
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
                      {formatDeadline(job.deadline)}
                    </span>
                  </div>
                </aside>
              </div>
            </>
          )}
        </section>

        <PageFooter />
      </div>
    </main>
  );
}

export default JobDetail;
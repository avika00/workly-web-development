import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MoreVertical,
  ChevronLeft,
  Eye,
} from "lucide-react";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-[#0800FF] text-white",
    Accepted: "bg-[#12AE68] text-white",
    Rejected: "bg-[#D83F4B] text-white",
  };

  return (
    <span
      className={`inline-flex min-w-[102px] items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium ${
        styles[status] || styles.Pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      {status}
    </span>
  );
}

function OverviewContent({ job, formatDeadline }) {
  return (
    <div className="grid grid-cols-1 gap-6 pb-10 lg:grid-cols-2">
      {/* ABOUT THE JOB */}
      <section className="rounded-2xl border border-[#5158A0]/60 bg-gradient-to-br from-[#191A4B]/90 to-[#0C0D35]/90 p-6 md:p-8">
        <h2 className="mb-5 text-xl font-semibold text-white">
          About the Job
        </h2>

        <p className="mb-7 whitespace-pre-line text-sm leading-7 text-white/80 md:text-base">
          {job.description}
        </p>

        <h3 className="mb-4 text-lg font-semibold text-white">
          Responsibilities
        </h3>

        {job.responsibilities.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {job.responsibilities.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-[#454B91]/60 bg-[#22245B]/60 p-4 text-sm leading-6 text-white/85"
              >
                <span className="mb-2 block text-xs font-semibold text-[#8992FF]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60">
            No responsibilities listed.
          </p>
        )}
      </section>

      {/* REQUIREMENTS */}
      <section className="rounded-2xl border border-[#5158A0]/60 bg-gradient-to-br from-[#191A4B]/90 to-[#0C0D35]/90 p-6 md:p-8">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Requirements
        </h2>

        <div className="mb-7">
          <h3 className="mb-3 text-sm font-medium text-white/70">
            Skills
          </h3>

          {job.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#343CBB] bg-[#10127C] px-5 py-2 text-xs text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/60">No specific skills required.</p>
          )}
        </div>

        <div className="mb-7">
          <h3 className="mb-3 text-sm font-semibold text-white">
            Experience Level
          </h3>

          <div className="rounded-xl border border-[#454B91]/60 bg-[#22245B]/60 p-4">
            <span className="inline-flex rounded-full bg-[#10127C] px-5 py-2 text-xs text-white">
              {job.experience}
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">
            Application Deadline
          </h3>

          <div className="inline-flex rounded-full border border-[#343CBB] bg-[#10127C] px-5 py-2 text-xs text-white">
            {formatDeadline(job.deadline)}
          </div>
        </div>
      </section>
    </div>
  );
}

function ApplicantsContent({ jobId, applicants }) {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filters = ["All", "Pending", "Accepted", "Rejected"];

  const filteredApplicants =
    filter === "All"
      ? applicants
      : applicants.filter((applicant) => applicant.status === filter);

  return (
    <section className="pb-12">
      {/* FILTER */}
      <div className="mb-8 flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full border px-6 py-2 text-xs transition duration-300 ${
              filter === item
                ? "border-[#2868F5] bg-[#2868F5] text-white shadow-[0_0_15px_rgba(40,104,245,0.3)]"
                : "border-[#343B75] bg-[#10143A] text-white/75 hover:border-[#4E59FF] hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* APPLICANTS TABLE */}
      <div className="overflow-hidden rounded-2xl border-2 border-[#29218D] bg-[#08092F]/95 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="bg-[#111078] text-white">
                <th className="border-r border-[#3932A5] px-7 py-5 text-center text-base font-semibold">
                  Candidate
                </th>
                <th className="border-r border-[#3932A5] px-7 py-5 text-center text-base font-semibold">
                  Applied
                </th>
                <th className="border-r border-[#3932A5] px-7 py-5 text-center text-base font-semibold">
                  Status
                </th>
                <th className="px-7 py-5 text-center text-base font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredApplicants.map((applicant, index) => (
                <tr
                  key={applicant.id}
                  className={`border-t border-[#30258C] transition-colors hover:bg-[#17164D] ${
                    index % 2 === 0
                      ? "bg-[#0C0D3D]"
                      : "bg-[#08092F]"
                  }`}
                >
                  <td className="border-r border-[#30258C] px-7 py-5 text-lg font-semibold text-white">
                    {applicant.name}
                  </td>

                  <td className="border-r border-[#30258C] px-7 py-5 text-center text-lg text-white/90">
                    {applicant.applied}
                  </td>

                  <td className="border-r border-[#30258C] px-7 py-5 text-center">
                    <StatusBadge status={applicant.status} />
                  </td>

                  <td className="px-7 py-5 text-center">
                    <button
                      onClick={() =>
                        navigate(`/post-job/${jobId}/applicant/${applicant.id}`)
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/80 px-5 py-2 text-xs text-white transition hover:border-[#4E59FF] hover:bg-[#20228B]"
                    >
                      <Eye size={14} />
                      View detail
                    </button>
                  </td>
                </tr>
              ))}

              {filteredApplicants.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-sm text-white/60"
                  >
                    No applicants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function JobPostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const [job, setJob] = useState(null);
  const [stats, setStats] = useState({
    applications: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }

    const fetchManageDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/jobs/manage_detail.php?id_job=${id}&id_user=${currentUser.ID_USER}`
        );
        const result = await res.json();

        if (result.status && result.job) {
          setJob(result.job);
          setStats(result.statistics);
          setApplicants(result.applicants || []);
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

    fetchManageDetail();
  }, [id, currentUser?.ID_USER, navigate]);

  const formatDeadline = (dateStr) => {
    if (!dateStr) return "No deadline";
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleStatusAction = async (action) => {
    setShowMenu(false);

    if (
      action === "Delete" &&
      !window.confirm("Yakin ingin menghapus lowongan ini secara permanen?")
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/jobs/update_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_job: job.id,
          id_user: currentUser.ID_USER,
          action,
        }),
      });
      const result = await res.json();

      if (result.status) {
        if (action === "Delete") {
          navigate("/post-job");
        } else {
          setJob((prev) => ({ ...prev, status: result.newStatus }));
        }
      } else {
        alert(result.message || "Gagal memperbarui status lowongan.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    }
  };

  const statistics = [
    { label: "Applications", value: stats.applications },
    { label: "Pending", value: stats.pending },
    { label: "Accepted", value: stats.accepted },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010133] text-white">
      {/* BACKGROUND GLOW */}
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
        {/* NAVBAR */}
        <Navbar isLoggedIn={true} />

        <div className="mx-auto w-full max-w-[1600px] px-6 pb-12 pt-[120px] sm:px-10 lg:px-[6.4%]">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate("/post-job")}
            className="mb-10 inline-flex items-center gap-2 text-sm text-white/90 transition hover:text-[#8992FF]"
          >
            <ChevronLeft size={19} />
            Back to My Job Posts
          </button>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#101039]/75 py-20 text-center text-sm text-white/75">
              Memuat detail lowongan...
            </div>
          ) : !job ? (
            <div className="rounded-2xl border border-white/10 bg-[#101039]/75 py-20 text-center">
              <h2 className="text-xl font-bold">Lowongan tidak ditemukan</h2>
              <p className="mt-2 text-sm text-white/60">
                Pastikan kamu membuka lowongan yang dibuat oleh akun ini.
              </p>
            </div>
          ) : (
            <>
              {/* JOB HEADER */}
              <div className="mb-10 flex items-start justify-between gap-5">
                <div className="flex items-center gap-5">
                  <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#171744] text-4xl">
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
                    <div className="mb-2 flex flex-wrap items-center gap-4">
                      <h1 className="text-2xl font-bold md:text-3xl">
                        {job.title}
                      </h1>

                      <span
                        className={`rounded-full px-7 py-2 text-xs font-semibold text-white ${
                          job.status === "Active"
                            ? "bg-[#2DA66C]"
                            : job.status === "Closed"
                              ? "bg-[#B83C43]"
                              : "bg-[#777B8A]"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <p className="mb-2 text-base text-white/90">
                      {job.company}
                    </p>

                    <p className="text-sm text-white/75">
                      {job.location} · {job.type} · {job.salary}
                    </p>
                  </div>
                </div>

                {/* MORE OPTIONS MENU */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    aria-label="More options"
                    className="rounded-full p-2 text-white transition hover:bg-white/10"
                  >
                    <MoreVertical size={25} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-white/15 bg-[#171744] p-2 shadow-xl">
                      {job.status === "Active" ? (
                        <button
                          onClick={() => handleStatusAction("Closed")}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
                        >
                          Close Job Post
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusAction("Active")}
                          className="w-full rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10"
                        >
                          Reopen Job Post
                        </button>
                      )}

                      <button
                        onClick={() => handleStatusAction("Delete")}
                        className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-[#FF6B78] transition hover:bg-white/10"
                      >
                        Delete Job Post
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* STATISTICS */}
              <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
                {statistics.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-h-[120px] flex-col items-center justify-center rounded-2xl border border-[#555B9B]/60 bg-gradient-to-br from-[#24245D]/90 to-[#15153F]/90 shadow-[inset_0_1px_10px_rgba(255,255,255,0.04)]"
                  >
                    <span className="text-5xl font-bold leading-none text-white md:text-6xl">
                      {item.value}
                    </span>

                    <span className="mt-2 text-base text-white md:text-lg">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* TABS */}
              <div className="mb-8 flex justify-center border-b border-[#7779B5]/70">
                {["Overview", "Applicants"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`min-w-[150px] px-7 py-4 text-base font-semibold transition md:min-w-[215px] md:text-lg ${
                      activeTab === tab
                        ? "bg-gradient-to-b from-[#292C8C] to-[#16164B] text-white"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              {activeTab === "Overview" ? (
                <OverviewContent job={job} formatDeadline={formatDeadline} />
              ) : (
                <ApplicantsContent jobId={job.id} applicants={applicants} />
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <PageFooter />
      </div>
    </main>
  );
}

export default JobPostDetails;
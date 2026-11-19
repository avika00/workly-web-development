import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

function ReviewStep() {
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    try {
      const savedJob = sessionStorage.getItem("worklyJobDetails");
      const savedCompany = sessionStorage.getItem("worklyCompanyData");

      if (savedJob) setJob(JSON.parse(savedJob));
      if (savedCompany) setCompany(JSON.parse(savedCompany));
    } catch {
      setJob(null);
      setCompany(null);
    }
  }, []);

  const formatDeadline = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePublish = async () => {
    if (!job || publishing) return;

    const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");
    if (!currentUser?.ID_USER) {
      alert("Sesi login berakhir. Silakan login kembali.");
      navigate("/login");
      return;
    }

    setPublishing(true);

    try {
      const res = await fetch(`${API_URL}/jobs/create.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: currentUser.ID_USER,
          company: company || {},
          job,
        }),
      });

      const result = await res.json();

      if (result.status) {
        // Bersihkan draft form setelah berhasil masuk ke database
        sessionStorage.removeItem("worklyCompanyData");
        sessionStorage.removeItem("worklyJobDetails");
        sessionStorage.setItem(
          "worklyPublishedJob",
          JSON.stringify({ id_job: result.id_job, ...job, company })
        );

        navigate("/post-job/success");
      } else {
        alert(result.message || "Gagal mempublikasikan lowongan.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setPublishing(false);
    }
  };

  if (!job) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F6FF] px-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-[#101018]">
            Job details not found
          </h1>
          <p className="mt-2 text-sm text-[#75819A]">
            Please complete the job details form first.
          </p>
          <button
            onClick={() => navigate("/post-job/create/details")}
            className="mt-5 rounded-xl bg-[#2865F5] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Job Details
          </button>
        </div>
      </main>
    );
  }

  const companyName =
    company?.companyName || company?.name || "Company Name";

  const companyLogo = company?.companyLogo || company?.logo || null;

  const jobType = job.jobType || "Not specified";
  const location = job.location || "Not specified";
  const salary = job.salary
    ? `${job.currency || "RP"} ${job.salary} ${job.salaryPeriod || "/Month"}`
    : "Negotiable";

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

      <div className="relative z-20">
        <Navbar isLoggedIn={true} />
      </div>

      <section className="relative z-10 mt-[90px] flex flex-1 flex-col rounded-t-[36px] bg-[#F5F6FF] px-6 pb-10 pt-9 text-[#101018] sm:px-10 md:px-14 lg:px-[6%]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold md:text-[28px]">
              Post a Job
            </h1>
            <p className="mt-2 text-sm text-[#75819A] md:text-base">
              Find the right talent for your team. Fill in the details below
              to create a new job posting.
            </p>
          </div>

          {/* Step Progress */}
          <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-[#858585]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1A1AA] text-xl">
                1
              </span>
              <span className="text-base sm:text-lg">Company</span>
            </div>

            <span className="h-px w-8 bg-[#9CA3AF] sm:w-12" />

            <div className="flex items-center gap-2 text-[#858585]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1A1AA] text-xl">
                2
              </span>
              <span className="text-base sm:text-lg">Job Details</span>
            </div>

            <span className="h-px w-8 bg-[#9CA3AF] sm:w-12" />

            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0010FF] text-xl text-white">
                3
              </span>
              <span className="text-base font-semibold sm:text-lg">
                Review
              </span>
            </div>
          </div>

          {/* Job Heading */}
          <div className="mt-12 flex items-center gap-5 px-2 sm:px-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-4xl">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Company logo"
                  className="h-full w-full object-contain"
                />
              ) : (
                "🎨"
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold md:text-2xl">
                {job.jobTitle}
              </h2>
              <p className="mt-2 text-sm md:text-base">{companyName}</p>
              <p className="mt-2 text-xs text-[#333] md:text-sm">
                {location} · {jobType} · {salary}
              </p>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,2fr)_minmax(300px,0.95fr)]">
            {/* About the Job */}
            <div className="min-h-[455px] rounded-2xl bg-white p-7 shadow-[0_12px_24px_rgba(0,0,0,0.12)] md:p-8">
              <h3 className="text-lg font-bold">About the Job</h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#666]">
                {job.description || "No job description provided."}
              </p>

              <h3 className="mt-14 text-lg font-bold">
                Responsibilities
              </h3>

              {job.responsibilities ? (
                <ul className="mt-4 space-y-3">
                  {job.responsibilities
                    .split(/\n/)
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm leading-6 text-[#666]"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E0E6F0] text-xs text-[#2865F5]">
                          ✓
                        </span>
                        <span>{item.replace(/^[-•]\s*/, "")}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-[#888]">
                  No responsibilities provided.
                </p>
              )}
            </div>

            {/* Job Summary */}
            <aside className="rounded-2xl bg-white p-7 shadow-[0_12px_24px_rgba(0,0,0,0.12)] md:p-7">
              <div className="space-y-3">
                <button
                  type="button"
                  className="h-[50px] w-full rounded-xl bg-[#0010FF] text-sm font-semibold text-white shadow-[0_5px_10px_rgba(0,16,255,0.25)]"
                >
                  Apply Now
                </button>

                <button
                  type="button"
                  className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl border border-[#25346F] text-sm text-[#444]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4z" />
                  </svg>
                  Save Job
                </button>
              </div>

              {/* Skills */}
              <div className="mt-11">
                <p className="text-[11px] font-bold tracking-wide text-[#8795C2]">
                  SKILLS
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(job.skills || []).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#0010FF] px-3 py-2 text-[10px] text-white"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-wide text-[#8795C2]">
                  EXPERIENCE LEVEL
                </p>
                <span className="mt-3 inline-flex rounded-full bg-[#0010FF] px-4 py-2 text-[10px] text-white">
                  {job.experience || "Not specified"}
                </span>
              </div>

              {/* Deadline */}
              <div className="mt-6">
                <p className="text-[11px] font-bold tracking-wide text-[#8795C2]">
                  APPLICATION DEADLINE
                </p>
                <span className="mt-3 inline-flex rounded-full bg-[#0010FF] px-4 py-2 text-[10px] text-white">
                  {formatDeadline(job.deadline)}
                </span>
              </div>
            </aside>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-16 flex flex-wrap justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/post-job/create/details")}
              disabled={publishing}
              className="flex h-[56px] min-w-[140px] items-center justify-center rounded-xl bg-[#A3A3A3] px-7 text-sm font-medium text-white transition hover:bg-[#888] disabled:opacity-60"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="flex h-[56px] min-w-[195px] items-center justify-center rounded-xl bg-[#2865F5] px-7 text-sm font-semibold text-white transition hover:bg-[#174FE0] disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-[1440px]">
          <PageFooter />
        </div>
      </section>
    </main>
  );
}

export default ReviewStep;
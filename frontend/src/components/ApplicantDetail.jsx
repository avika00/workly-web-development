import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  XCircle,
  MessageSquare,
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
      className={`inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-xs font-semibold ${
        styles[status] || styles.Pending
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-white" />
      {status}
    </span>
  );
}

function ApplicantDetail() {
  const { id, applicantId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const [application, setApplication] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }

    const fetchApplicantDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/jobs/applicant_detail.php?id_job=${id}&id_application=${applicantId}&id_user=${currentUser.ID_USER}`
        );
        const result = await res.json();

        if (result.status) {
          setApplication(result.application);
          setCandidate(result.candidate);
        } else {
          setApplication(null);
          setCandidate(null);
        }
      } catch (err) {
        console.error("Gagal memuat detail pelamar:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetail();
  }, [id, applicantId, currentUser?.ID_USER, navigate]);

  const handleDecision = async (newStatus) => {
    if (!application || updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`${API_URL}/jobs/update_applicant_status.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_job: id,
          id_application: applicantId,
          id_user: currentUser.ID_USER,
          status: newStatus,
        }),
      });
      const result = await res.json();

      if (result.status) {
        setApplication((prev) => ({ ...prev, status: result.newStatus }));
      } else {
        alert(result.message || "Gagal memperbarui status pelamar.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setUpdating(false);
    }
  };

  const formatBirthDisplay = (dateStr) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  };

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

        <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-[120px] sm:px-10 lg:px-[7%]">
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(`/post-job/${id}`)}
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/90 transition hover:text-[#8992FF]"
          >
            <ChevronLeft size={19} />
            Back to Job Details
          </button>

          {loading ? (
            <div className="rounded-2xl border border-[#5158A0]/60 bg-[#101039]/75 py-20 text-center text-sm text-white/75">
              Memuat profil pelamar...
            </div>
          ) : !candidate || !application ? (
            <div className="rounded-2xl border border-[#5158A0]/60 bg-[#101039]/75 py-20 text-center">
              <h2 className="text-xl font-bold">Data pelamar tidak ditemukan</h2>
              <p className="mt-2 text-sm text-white/60">
                Pastikan Anda membuka pelamar dari lowongan yang Anda buat.
              </p>
            </div>
          ) : (
            <>
              {/* CANDIDATE HEADER CARD */}
              <div className="mb-8 flex flex-col justify-between gap-6 rounded-2xl border border-[#5158A0]/60 bg-gradient-to-br from-[#191A4B]/90 to-[#0C0D35]/90 p-6 sm:p-8 lg:flex-row lg:items-center">
                <div className="flex flex-col items-center gap-5 sm:flex-row">
                  <div className="flex size-[96px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#4E59FF] bg-[#171744] text-[#8992FF]">
                    {candidate.photo ? (
                      <img
                        src={`${API_URL}/uploads/profiles/${candidate.photo}`}
                        alt={candidate.fullName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <UserRound size={48} strokeWidth={1.5} />
                    )}
                  </div>

                  <div className="text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                      <h1 className="text-2xl font-bold md:text-3xl">
                        {candidate.fullName}
                      </h1>
                      <StatusBadge status={application.status} />
                    </div>

                    <p className="mt-1 text-sm text-white/75">
                      @{candidate.username} · Applied for{" "}
                      <span className="font-semibold text-white">
                        {application.jobTitle}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-white/55">
                      Applied on {application.appliedDate}
                    </p>
                  </div>
                </div>

                {/* MESSAGE, ACCEPT & REJECT BUTTONS */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/messages/${applicantId}`)}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#4E59FF] bg-[#1B2066] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#28308F]"
                  >
                    <MessageSquare size={16} />
                    Message
                  </button>

                  <button
                    type="button"
                    disabled={updating || application.status === "Accepted"}
                    onClick={() => handleDecision("Accepted")}
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition ${
                      application.status === "Accepted"
                        ? "cursor-default bg-[#12AE68]/60"
                        : "cursor-pointer bg-[#12AE68] hover:bg-[#16C978] disabled:opacity-50"
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    {application.status === "Accepted" ? "Accepted" : "Accept"}
                  </button>

                  <button
                    type="button"
                    disabled={updating || application.status === "Rejected"}
                    onClick={() => handleDecision("Rejected")}
                    className={`flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-semibold text-white transition ${
                      application.status === "Rejected"
                        ? "cursor-default bg-[#D83F4B]/60"
                        : "cursor-pointer bg-[#D83F4B] hover:bg-[#EB4D5A] disabled:opacity-50"
                    }`}
                  >
                    <XCircle size={16} />
                    {application.status === "Rejected" ? "Rejected" : "Reject"}
                  </button>
                </div>
              </div>

              {/* MAIN GRID */}
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-[0.85fr_1.15fr]">
                {/* LEFT COLUMN: CONTACT, EDUCATION & PORTFOLIO */}
                <div className="flex flex-col gap-7">
                  {/* PERSONAL & CONTACT INFO */}
                  <section className="rounded-2xl border border-[#5158A0]/60 bg-gradient-to-br from-[#191A4B]/90 to-[#0C0D35]/90 p-6 md:p-8">
                    <h2 className="mb-5 text-lg font-semibold text-white">
                      Personal & Contact Information
                    </h2>

                    <div className="space-y-4">
                      <InfoRow
                        icon={<Mail size={16} className="text-[#8992FF]" />}
                        label="Email"
                        value={candidate.email || "-"}
                      />
                      <InfoRow
                        icon={<Phone size={16} className="text-[#8992FF]" />}
                        label="Phone Number"
                        value={candidate.phone || "-"}
                      />
                      <InfoRow
                        icon={<MapPin size={16} className="text-[#8992FF]" />}
                        label="Location"
                        value={candidate.location || "-"}
                      />
                      <InfoRow
                        icon={<Calendar size={16} className="text-[#8992FF]" />}
                        label="Birth Date"
                        value={formatBirthDisplay(candidate.birth)}
                      />
                      <InfoRow
                        icon={
                          <GraduationCap size={16} className="text-[#8992FF]" />
                        }
                        label="Latest Education"
                        value={
                          candidate.education || candidate.university
                            ? `${candidate.education || "-"}${
                                candidate.university
                                  ? ` — ${candidate.university}`
                                  : ""
                              }`
                            : "-"
                        }
                      />
                    </div>
                  </section>

                  {/* PORTFOLIO CARD */}
                  <section className="rounded-2xl border border-[#5158A0]/60 bg-gradient-to-br from-[#191A4B]/90 to-[#0C0D35]/90 p-6 md:p-8">
                    <h2 className="mb-4 text-lg font-semibold text-white">
                      Portfolio
                    </h2>

                    {candidate.portfolios.length > 0 ? (
                      <div className="space-y-3">
                        {candidate.portfolios.map((item) => (
                          <a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between gap-3 rounded-xl border border-[#454B91]/60 bg-[#22245B]/60 px-4 py-3 transition hover:border-[#626CFF] hover:bg-[#292C6E]"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-white">
                                {item.title}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-[#8992FF]">
                                {item.link}
                              </p>
                            </div>
                            <ExternalLink
                              size={16}
                              className="shrink-0 text-[#8992FF]"
                            />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/55">
                        Kandidat belum menambahkan link portofolio.
                      </p>
                    )}
                  </section>
                </div>

                {/* RIGHT COLUMN: ABOUT, EXPERIENCE & SKILLS */}
                <section className="flex flex-col justify-between rounded-2xl border border-[#5158A0]/60 bg-gradient-to-br from-[#191A4B]/90 to-[#0C0D35]/90 p-6 md:p-8">
                  <div>
                    <h2 className="mb-5 text-lg font-semibold text-white">
                      Candidate Qualifications
                    </h2>

                    {/* ABOUT ME */}
                    <div className="mb-7">
                      <h3 className="mb-2 text-sm font-semibold text-[#8992FF]">
                        About Candidate
                      </h3>
                      <p className="whitespace-pre-line text-sm leading-7 text-white/80">
                        {candidate.about ||
                          "Kandidat belum menambahkan deskripsi diri."}
                      </p>
                    </div>

                    <div className="my-6 border-t border-white/10" />

                    {/* EXPERIENCE */}
                    <div className="mb-7">
                      <h3 className="mb-2 text-sm font-semibold text-[#8992FF]">
                        Experience
                      </h3>
                      <p className="whitespace-pre-line text-sm leading-7 text-white/80">
                        {candidate.experience ||
                          "Kandidat belum menambahkan riwayat pengalaman."}
                      </p>
                    </div>

                    <div className="my-6 border-t border-white/10" />

                    {/* SKILLS */}
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-[#8992FF]">
                        Skills
                      </h3>

                      {candidate.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                          {candidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-[#343CBB] bg-[#10127C] px-5 py-2 text-xs font-medium text-white"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-white/55">
                          Kandidat belum menambahkan daftar skill.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <PageFooter />
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-white/55">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

export default ApplicantDetail;
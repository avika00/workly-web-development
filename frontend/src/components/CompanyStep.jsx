import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const industries = [
  "Technology",
  "Design & Creative",
  "Marketing",
  "Finance",
  "Education",
  "Healthcare",
  "Manufacturing",
  "Other",
];

function CompanyStep() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("Technology");
  const [website, setWebsite] = useState("");
  const [nib, setNib] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");

  const [logo, setLogo] = useState("");
  const [logoName, setLogoName] = useState("");

  const [nibVerified, setNibVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);

  const [message, setMessage] = useState("");

  // Restore saved form data
  useEffect(() => {
    const savedData = sessionStorage.getItem("worklyCompanyData");

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        setCompanyName(data.companyName || "");
        setDescription(data.description || "");
        setIndustry(data.industry || "Technology");
        setWebsite(data.website || "");
        setNib(data.nib || "");
        setBusinessEmail(data.businessEmail || "");
        setNibVerified(data.nibVerified || false);
        setEmailVerified(data.emailVerified || false);
        setLogo(data.logo || "");
        setLogoName(data.logoName || "");
      } catch {
        sessionStorage.removeItem("worklyCompanyData");
      }
    }
  }, []);

  // Save form data for the next steps
  useEffect(() => {
    const companyData = {
      companyName,
      description,
      industry,
      website,
      nib,
      businessEmail,
      nibVerified,
      emailVerified,
      logo,
      logoName,
    };

    sessionStorage.setItem(
      "worklyCompanyData",
      JSON.stringify(companyData)
    );
  }, [
    companyName,
    description,
    industry,
    website,
    nib,
    businessEmail,
    nibVerified,
    emailVerified,
    logo,
    logoName,
  ]);

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setMessage("Please upload a PNG or JPG image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Company logo must not exceed 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setLogo(reader.result);
      setLogoName(file.name);
      setMessage("");
    };

    reader.readAsDataURL(file);
  };

  const handleVerifyNib = () => {
    if (!nib.trim()) {
      setMessage("Please enter your company's NIB first.");
      return;
    }

    // Frontend demonstration only
    setNibVerified(true);
    setMessage("NIB verification simulated successfully.");
  };

  const handleSendCode = () => {
    if (!businessEmail.trim()) {
      setMessage("Please enter your business email first.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
      setMessage("Please enter a valid business email.");
      return;
    }

    // Frontend demonstration only
    setCodeSent(true);
    setEmailVerified(false);
    setOtp(["", "", "", "", "", ""]);
    setMessage("Demo verification code: enter any 6 digits.");
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((previous) => {
      const updated = [...previous];
      updated[index] = digit;
      return updated;
    });

    if (digit) {
      const nextInput = document.getElementById(`company-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`company-otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyEmail = () => {
    if (otp.some((digit) => !digit)) {
      setMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    // Frontend demonstration only
    setEmailVerified(true);
    setMessage("Business email verified successfully.");
  };

  const handleContinue = (event) => {
    event.preventDefault();

    if (!companyName.trim()) {
      setMessage("Please enter your company name.");
      return;
    }

    if (!businessEmail.trim() || !emailVerified) {
      setMessage("Please verify your business email before continuing.");
      return;
    }

    setMessage("");
    navigate("/post-job/create/details");
  };

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

      {/* Navbar */}
      <div className="relative z-20">
        <Navbar isLoggedIn={true} />
      </div>

      {/* Main Form */}
      <section className="relative z-10 mt-[90px] flex flex-1 flex-col rounded-t-[36px] bg-[#F5F6FF] px-6 pb-10 pt-9 text-[#101018] sm:px-10 md:px-14 lg:px-[5.5%]">
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
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0010FF] text-xl text-white">
                1
              </span>
              <span className="text-base font-semibold text-[#101018] sm:text-lg">
                Company
              </span>
            </div>

            <span className="h-px w-8 bg-[#9CA3AF] sm:w-12" />

            <div className="flex items-center gap-2 text-[#858585]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1A1AA] text-xl">
                2
              </span>
              <span className="text-base sm:text-lg">Job Details</span>
            </div>

            <span className="h-px w-8 bg-[#9CA3AF] sm:w-12" />

            <div className="flex items-center gap-2 text-[#858585]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1A1AA] text-xl">
                3
              </span>
              <span className="text-base sm:text-lg">Review</span>
            </div>
          </div>

          {/* Form Columns */}
          <form
            onSubmit={handleContinue}
            className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6"
          >
            {/* LEFT COLUMN */}
            <div>
              <h2 className="text-base font-bold md:text-lg">
                1. Company Information
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#75819A]">
                Tell us about your company. This information will be verified
                and used for your job posts.
              </p>

              {/* Company Name */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Company Name
                </label>

                <input
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="e.g. PT. Creative Studio Indonesia"
                  className="h-[52px] w-full rounded-[17px] border border-[#A1A1A1] bg-transparent px-5 text-sm outline-none transition focus:border-[#2865F5] focus:ring-2 focus:ring-[#2865F5]/10"
                />
              </div>

              {/* Company Description */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Company Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="e.g. We are a digital agency focused on creating..."
                  rows={4}
                  className="w-full resize-none rounded-[17px] border border-[#A1A1A1] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#2865F5] focus:ring-2 focus:ring-[#2865F5]/10"
                />
              </div>

              {/* Industry */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Industry
                </label>

                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="h-[52px] w-full rounded-[17px] border border-[#A1A1A1] bg-[#F5F6FF] px-5 text-sm text-[#555] outline-none transition focus:border-[#2865F5]"
                >
                  {industries.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Company Website */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Company Website
                </label>

                <input
                  type="url"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="e.g. www.creativestudioidn.com"
                  className="h-[52px] w-full rounded-[17px] border border-[#A1A1A1] bg-transparent px-5 text-sm outline-none transition focus:border-[#2865F5] focus:ring-2 focus:ring-[#2865F5]/10"
                />
              </div>

              {/* Company Logo */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Company Logo
                </label>

                <label className="flex min-h-[175px] cursor-pointer flex-col items-center justify-center rounded-[17px] border border-[#A1A1A1] bg-transparent px-4 py-6 transition hover:border-[#2865F5] hover:bg-[#EDEFFF]">
                  {logo ? (
                    <>
                      <img
                        src={logo}
                        alt="Company logo preview"
                        className="mb-3 h-20 w-20 rounded-xl object-contain"
                      />
                      <span className="max-w-full truncate text-sm font-medium">
                        {logoName}
                      </span>
                      <span className="mt-1 text-xs text-[#75819A]">
                        Click to change logo
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="66"
                        height="66"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#929292"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 16.5a4.5 4.5 0 0 0-1.5-8.74A6 6 0 0 0 7 6.5a4.5 4.5 0 0 0-1 8.89" />
                        <path d="M12 12v9" />
                        <path d="m7 16 5-5 5 5" />
                      </svg>

                      <span className="mt-2 text-sm text-[#333]">
                        Upload company logo
                      </span>
                      <span className="mt-1 text-[10px] text-[#777]">
                        PNG, JPG (max 2MB)
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Verify NIB */}
              <div>
                <h2 className="text-base font-bold md:text-lg">
                  2. Verify NIB
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#75819A]">
                  Enter your company’s NIB (Nomor Induk Berusaha) to verify
                  your business information.
                </p>

                <label className="mb-2 mt-4 block text-sm font-medium md:text-base">
                  NIB (Nomor Induk Berusaha)
                </label>

                <div className="flex h-[52px] overflow-hidden rounded-[17px] border border-[#A1A1A1]">
                  <input
                    type="text"
                    value={nib}
                    onChange={(event) => {
                      setNib(event.target.value);
                      setNibVerified(false);
                    }}
                    placeholder="e.g. 1234567890"
                    className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyNib}
                    className="shrink-0 rounded-l-xl bg-[#2865F5] px-5 text-xs font-medium text-white transition hover:bg-[#174FE0] sm:px-7"
                  >
                    {nibVerified ? "Verified" : "Verify NIB"}
                  </button>
                </div>

                {/* NIB Notice */}
                <div className="mt-6 flex gap-4 rounded-[18px] border border-[#999EFF] bg-[#D9DBFF] p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2450FF] text-xl font-bold text-white">
                    !
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">
                        {nibVerified ? "NIB verified" : "Don’t have a NIB yet"}
                      </h3>

                      <a
                        href="https://oss.go.id/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] underline"
                      >
                        Learn more ›
                      </a>
                    </div>

                    <p className="mt-1 max-w-[300px] text-xs leading-5">
                      {nibVerified
                        ? "Your NIB verification is simulated for this frontend preview."
                        : "You can still create a job post, but your company will not be verified."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verify Business Email */}
              <div className="mt-6">
                <h2 className="text-base font-bold md:text-lg">
                  2. Verify Business Email
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#75819A]">
                  We’ll send a verification code to your company email to
                  confirm ownership.
                </p>

                <label className="mb-2 mt-4 block text-sm font-medium md:text-base">
                  Business Email
                </label>

                <div className="flex h-[52px] overflow-hidden rounded-[17px] border border-[#A1A1A1]">
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(event) => {
                      setBusinessEmail(event.target.value);
                      setEmailVerified(false);
                      setCodeSent(false);
                    }}
                    placeholder="e.g. hr@creativestudio.co.id"
                    className="min-w-0 flex-1 bg-transparent px-5 text-sm outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="shrink-0 rounded-l-xl bg-[#2865F5] px-4 text-[10px] font-medium text-white transition hover:bg-[#174FE0] sm:px-5 sm:text-xs"
                  >
                    {codeSent ? "Resend Code" : "Send Verification Code"}
                  </button>
                </div>

                {/* OTP Verification */}
                {codeSent && (
                  <div className="mt-6 rounded-[18px] border border-[#999EFF] bg-[#D9DBFF] p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2450FF] text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="19"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="5" width="18" height="14" rx="2" />
                          <path d="m3 7 9 6 9-6" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold">
                          {emailVerified
                            ? "Email verified successfully!"
                            : "Verification code sent!"}
                        </h3>

                        <p className="mt-1 break-all text-xs">
                          {emailVerified
                            ? `Your email ${businessEmail} has been verified.`
                            : `We've sent a 6 digit code to ${businessEmail}`}
                        </p>
                      </div>
                    </div>

                    {!emailVerified && (
                      <>
                        <div className="mt-5 flex justify-center gap-2">
                          {otp.map((digit, index) => (
                            <input
                              key={index}
                              id={`company-otp-${index}`}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(event) =>
                                handleOtpChange(index, event.target.value)
                              }
                              onKeyDown={(event) =>
                                handleOtpKeyDown(index, event)
                              }
                              className="h-[54px] min-w-0 flex-1 rounded-lg border border-[#999EFF] bg-white text-center text-lg font-semibold outline-none focus:border-[#2450FF] sm:h-[68px] sm:max-w-[60px]"
                            />
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                          <span className="text-[10px]">
                            Don’t receive the code?{" "}
                            <button
                              type="button"
                              onClick={handleSendCode}
                              className="font-medium text-[#182C9C] underline"
                            >
                              Resend
                            </button>
                          </span>

                          <button
                            type="button"
                            onClick={handleVerifyEmail}
                            className="rounded-xl bg-[#2865F5] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#174FE0]"
                          >
                            Verify Email
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Message */}
          {message && (
            <p className="mt-5 rounded-lg bg-[#E3E7FF] px-4 py-3 text-xs text-[#263A9A]">
              {message}
            </p>
          )}

          {/* Bottom Buttons */}
          <div className="mt-8 flex flex-wrap justify-end gap-4">
            <Link
              to="/post-job"
              className="flex h-[52px] min-w-[125px] items-center justify-center rounded-xl bg-[#A3A3A3] px-7 text-xs font-medium text-white transition hover:bg-[#888]"
            >
              Cancel
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              className="flex h-[52px] min-w-[185px] items-center justify-center rounded-xl bg-[#2865F5] px-6 text-xs font-semibold text-white transition hover:bg-[#174FE0]"
            >
              Continue to Job Details &gt;
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mx-auto mt-8 w-full max-w-[1440px]">
          <PageFooter />
        </div>
      </section>
    </main>
  );
}

export default CompanyStep;
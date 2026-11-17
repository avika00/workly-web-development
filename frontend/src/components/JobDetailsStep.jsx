import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const jobTypes = [
  "Full Time",
  "Part Time",
  "Contract",
  "Freelance",
  "Internship",
];

const experienceLevels = [
  "Fresh Graduate",
  "Less than 1 Year",
  "1-3 Years",
  "3-5 Years",
  "More than 5 Years",
];

const currencies = ["RP", "USD", "SGD", "EUR"];
const salaryPeriods = ["/Month", "/Year", "/Week", "/Day", "/Hour"];

function JobDetailsStep() {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [location, setLocation] = useState("");
  const [currency, setCurrency] = useState("RP");
  const [salary, setSalary] = useState("");
  const [salaryPeriod, setSalaryPeriod] = useState("/Month");

  const [skills, setSkills] = useState([
    "Figma",
    "UI/UX",
    "Prototyping",
    "User Research",
  ]);
  const [skillInput, setSkillInput] = useState("");

  const [experience, setExperience] = useState("1-3 Years");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const [message, setMessage] = useState("");

  // Restore previously saved job details
  useEffect(() => {
    const savedData = sessionStorage.getItem("worklyJobDetails");

    if (!savedData) return;

    try {
      const data = JSON.parse(savedData);

      setJobTitle(data.jobTitle || "");
      setJobType(data.jobType || "Full Time");
      setLocation(data.location || "");
      setCurrency(data.currency || "RP");
      setSalary(data.salary || "");
      setSalaryPeriod(data.salaryPeriod || "/Month");
      setSkills(
        Array.isArray(data.skills)
          ? data.skills
          : ["Figma", "UI/UX", "Prototyping", "User Research"]
      );
      setExperience(data.experience || "1-3 Years");
      setDeadline(data.deadline || "");
      setDescription(data.description || "");
      setResponsibilities(data.responsibilities || "");
    } catch {
      sessionStorage.removeItem("worklyJobDetails");
    }
  }, []);

  // Save job details whenever the form changes
  useEffect(() => {
    const jobData = {
      jobTitle,
      jobType,
      location,
      currency,
      salary,
      salaryPeriod,
      skills,
      experience,
      deadline,
      description,
      responsibilities,
    };

    sessionStorage.setItem("worklyJobDetails", JSON.stringify(jobData));
  }, [
    jobTitle,
    jobType,
    location,
    currency,
    salary,
    salaryPeriod,
    skills,
    experience,
    deadline,
    description,
    responsibilities,
  ]);

  const addSkill = () => {
    const newSkill = skillInput.trim();

    if (!newSkill) return;

    const alreadyExists = skills.some(
      (skill) => skill.toLowerCase() === newSkill.toLowerCase()
    );

    if (!alreadyExists) {
      setSkills((previous) => [...previous, newSkill]);
    }

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills((previous) =>
      previous.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    }

    if (
      event.key === "Backspace" &&
      !skillInput &&
      skills.length > 0
    ) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  const handleNext = (event) => {
    event.preventDefault();

    if (!jobTitle.trim()) {
      setMessage("Please enter the job title.");
      return;
    }

    if (!location.trim()) {
      setMessage("Please enter the job location.");
      return;
    }

    if (!salary.trim()) {
      setMessage("Please enter the salary information.");
      return;
    }

    if (!deadline) {
      setMessage("Please select the application deadline.");
      return;
    }

    if (!description.trim()) {
      setMessage("Please enter the job description.");
      return;
    }

    if (skills.length === 0) {
      setMessage("Please add at least one required skill.");
      return;
    }

    setMessage("");
    navigate("/post-job/create/review");
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

      {/* Main Content */}
      <section className="relative z-10 mt-[90px] flex flex-1 flex-col rounded-t-[36px] bg-[#F5F6FF] px-6 pb-10 pt-9 text-[#101018] sm:px-10 md:px-14 lg:px-[5.5%]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
          {/* Page Heading */}
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

            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0010FF] text-xl text-white">
                2
              </span>
              <span className="text-base font-semibold sm:text-lg">
                Job Details
              </span>
            </div>

            <span className="h-px w-8 bg-[#9CA3AF] sm:w-12" />

            <div className="flex items-center gap-2 text-[#858585]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#A1A1AA] text-xl">
                3
              </span>
              <span className="text-base sm:text-lg">Review</span>
            </div>
          </div>

          {/* Job Form */}
          <form
            onSubmit={handleNext}
            className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-6"
          >
            {/* LEFT COLUMN */}
            <div>
              <h2 className="text-base font-bold md:text-lg">
                1. Job Information
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#75819A]">
                Now, tell us about the job you want to fill.
              </p>

              {/* Job Title */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Job Title
                </label>

                <input
                  type="text"
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="e.g. UI/UX Designer"
                  className="h-[55px] w-full rounded-[17px] border border-[#A1A1A1] bg-transparent px-5 text-sm outline-none transition focus:border-[#2865F5] focus:ring-2 focus:ring-[#2865F5]/10"
                />
              </div>

              {/* Job Type */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Job Type
                </label>

                <select
                  value={jobType}
                  onChange={(event) => setJobType(event.target.value)}
                  className="h-[55px] w-full rounded-[17px] border border-[#A1A1A1] bg-[#F5F6FF] px-5 text-sm text-[#555] outline-none focus:border-[#2865F5]"
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Location
                </label>

                <div className="flex h-[55px] overflow-hidden rounded-[17px] border border-[#A1A1A1]">
                  <div className="flex w-[68px] shrink-0 items-center justify-center rounded-r-[17px] bg-[#2865F5] text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="23"
                      height="23"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="e.g. Jakarta, Indonesia"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Salary */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Salary
                </label>

                <div className="flex h-[55px] overflow-hidden rounded-[17px] border border-[#A1A1A1]">
                  <select
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                    aria-label="Salary currency"
                    className="w-[90px] shrink-0 rounded-r-[17px] bg-[#2865F5] px-3 text-sm font-medium text-white outline-none"
                  >
                    {currencies.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    placeholder="e.g. 8.000.000 - 10.000.000"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                  />

                  <select
                    value={salaryPeriod}
                    onChange={(event) =>
                      setSalaryPeriod(event.target.value)
                    }
                    aria-label="Salary period"
                    className="w-[115px] shrink-0 rounded-l-[17px] bg-[#2865F5] px-3 text-sm font-medium text-white outline-none"
                  >
                    {salaryPeriods.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* Required Skills */}
              <div>
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Required Skills
                </label>

                <div className="min-h-[102px] rounded-[17px] border border-[#A1A1A1] px-5 py-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onBlur={addSkill}
                    placeholder="Add skills..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#858585]"
                  />

                  <div className="mt-3 flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0010FF] px-3 py-1.5 text-[10px] text-white"
                      >
                        {skill}

                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          aria-label={`Remove ${skill}`}
                          className="text-white/80 transition hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Experience and Application Deadline */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium md:text-base">
                    Experience Level
                  </label>

                  <select
                    value={experience}
                    onChange={(event) => setExperience(event.target.value)}
                    className="h-[55px] w-full rounded-[17px] border border-[#A1A1A1] bg-[#F5F6FF] px-4 text-sm text-[#555] outline-none focus:border-[#2865F5]"
                  >
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium md:text-base">
                    Application
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      value={deadline}
                      onChange={(event) => setDeadline(event.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      aria-label="Application deadline"
                      className="h-[55px] w-full rounded-[17px] border border-[#A1A1A1] bg-transparent px-4 text-sm text-[#555] outline-none focus:border-[#2865F5]"
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Job Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="e.g. We are looking for a creative and detail oriented..."
                  rows={3}
                  className="min-h-[112px] w-full resize-none rounded-[17px] border border-[#A1A1A1] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#2865F5] focus:ring-2 focus:ring-[#2865F5]/10"
                />
              </div>

              {/* Responsibilities */}
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium md:text-base">
                  Responsibilities
                </label>

                <textarea
                  value={responsibilities}
                  onChange={(event) =>
                    setResponsibilities(event.target.value)
                  }
                  placeholder="e.g. Design mobile app and web interfaces with high fidelity..."
                  rows={3}
                  className="min-h-[112px] w-full resize-none rounded-[17px] border border-[#A1A1A1] bg-transparent px-5 py-4 text-sm outline-none transition focus:border-[#2865F5] focus:ring-2 focus:ring-[#2865F5]/10"
                />
              </div>
            </div>
          </form>

          {/* Validation Message */}
          {message && (
            <p className="mt-5 rounded-lg bg-[#E3E7FF] px-4 py-3 text-xs text-[#263A9A]">
              {message}
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex flex-wrap justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/post-job/create/company")}
              className="flex h-[55px] min-w-[125px] items-center justify-center rounded-xl bg-[#A3A3A3] px-7 text-xs font-medium text-white transition hover:bg-[#888]"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex h-[55px] min-w-[190px] items-center justify-center rounded-xl bg-[#2865F5] px-6 text-xs font-semibold text-white transition hover:bg-[#174FE0]"
            >
              Next to review &gt;
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

export default JobDetailsStep;
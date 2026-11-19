import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

import uiuxImage from "../assets/images/jobs/ui-ux-designer.jpg";
import frontendImage from "../assets/images/jobs/frontend-developer.jpg";
import socialImage from "../assets/images/jobs/social-media-analyst.jpg";

const API_URL = "http://localhost:8000";
const FALLBACK_IMAGES = [uiuxImage, frontendImage, socialImage];

const jobTypes = [
  "All",
  "Full-time",
  "Remote",
  "Hybrid",
  "On-Site",
  "Freelance",
  "Part-time",
  "Contract",
  "Internship",
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[-_\s]+/g, "");
}

function matchesExperienceLevel(jobExp, filterExp) {
  if (!filterExp) return true;
  const exp = String(jobExp || "").toLowerCase();

  if (filterExp === "Entry-Level") {
    return (
      exp.includes("entry") ||
      exp.includes("fresh") ||
      exp.includes("less than 1") ||
      exp.includes("junior")
    );
  }
  if (filterExp === "Mid-Level") {
    return exp.includes("mid") || exp.includes("1-3");
  }
  if (filterExp === "Senior") {
    return (
      exp.includes("senior") ||
      exp.includes("3-5") ||
      exp.includes("more than 5")
    );
  }
  return exp === filterExp.toLowerCase();
}

function ExploreJobs() {
  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [salaryLimit, setSalaryLimit] = useState(20000000);
  const [experience, setExperience] = useState("");
  const [sortBy, setSortBy] = useState("Most Relevant");

  const [appliedFilters, setAppliedFilters] = useState({
    categories: [],
    salary: 20000000,
    experience: "",
  });

  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchExploreJobs = async () => {
      setLoading(true);
      try {
        const query = currentUser?.ID_USER
          ? `?id_user=${currentUser.ID_USER}`
          : "";
        const res = await fetch(`${API_URL}/jobs/explore.php${query}`);
        const result = await res.json();

        if (result.status && Array.isArray(result.jobs)) {
          setJobs(result.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error("Gagal memuat lowongan:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreJobs();
  }, [currentUser?.ID_USER]);

  // Daftar kategori dan jumlah lowongan secara dinamis dari database
  const categories = useMemo(() => {
    const counts = {};
    jobs.forEach((job) => {
      const cat = job.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [jobs]);

  // FILTER AND SORT JOBS
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        (job.skills || []).some((skill) =>
          skill.toLowerCase().includes(keyword)
        );

      const normalizedSelected = normalizeText(selectedType);
      const matchesType =
        selectedType === "All" ||
        normalizeText(job.type) === normalizedSelected ||
        normalizeText(job.employment) === normalizedSelected;

      const matchesCategory =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.includes(job.category);

      // Jika slider di posisi maksimal (20M+), tampilkan semua termasuk di atas 20M
      const matchesSalary =
        appliedFilters.salary >= 20000000 ||
        job.salary === 0 ||
        job.salary <= appliedFilters.salary;

      const matchesExperience = matchesExperienceLevel(
        job.experience,
        appliedFilters.experience
      );

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesSalary &&
        matchesExperience
      );
    });

    if (sortBy === "Salary: Highest") {
      result = [...result].sort((a, b) => b.salary - a.salary);
    } else if (sortBy === "Salary: Lowest") {
      result = [...result].sort((a, b) => a.salary - b.salary);
    } else if (sortBy === "Most Applicants") {
      result = [...result].sort((a, b) => b.applicants - a.applicants);
    }

    return result;
  }, [jobs, searchTerm, selectedType, appliedFilters, sortBy]);

  // Rekomendasi lowongan berdasarkan kecocokan skill user
  const recommendedJobs = useMemo(() => {
    return [...jobs]
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 6);
  }, [jobs]);

  // SEARCH
  const handleSearch = (event) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setVisibleCount(6);
  };

  // CATEGORY SELECTION
  const toggleCategory = (category) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  // APPLY FILTERS
  const applyFilters = () => {
    setAppliedFilters({
      categories: selectedCategories,
      salary: salaryLimit,
      experience,
    });

    setVisibleCount(6);
  };

  // RESET FILTERS
  const resetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedType("All");
    setSelectedCategories([]);
    setSalaryLimit(20000000);
    setExperience("");

    setAppliedFilters({
      categories: [],
      salary: 20000000,
      experience: "",
    });

    setVisibleCount(6);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#010133]">
      {/* HEADER AND SEARCH SECTION */}
      <section className="relative isolate overflow-hidden bg-[#010133] text-white">
        {/* Background Glow */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 bg-no-repeat opacity-90"
          style={{
            backgroundImage:
              "url('/images/workly-glow.png'), url('/images/workly-glow.png')",
            backgroundPosition:
              "left -180px top -180px, right -180px bottom -100px",
            backgroundSize: "750px auto, 650px auto",
          }}
        />

        <div className="relative z-10">
          <Navbar isLoggedIn={Boolean(currentUser)} />

          {/* CONTENT */}
          <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-[120px] md:px-12 lg:px-[7%]">
            <h1 className="text-3xl font-bold md:text-[36px]">
              Find Your Next Job
            </h1>

            <p className="mt-2 text-sm text-white/60 md:text-base">
              Browse thousands of opportunities and connect directly with
              hiring teams.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="mt-6 flex h-[54px] items-center rounded-xl border border-white/10 bg-[#0B103C]/90 px-4"
            >
              <Search size={19} className="shrink-0 text-white/50" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search job titles, keywords, skills, or companies..."
                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/40"
              />

              <button
                type="submit"
                className="h-10 rounded-lg bg-[#2864F0] px-6 text-sm font-semibold transition hover:bg-blue-500"
              >
                Search
              </button>
            </form>

            {/* JOB TYPE FILTERS */}
            <div className="mt-5 flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setVisibleCount(6);
                  }}
                  className={`rounded-full border px-5 py-2 text-xs transition ${
                    selectedType === type
                      ? "border-[#2864F0] bg-[#2864F0] font-semibold text-white"
                      : "border-white/10 bg-[#10143D]/80 text-white/75 hover:border-[#2864F0]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* JOB LIST AND FILTER PANEL */}
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
              {/* JOB LIST */}
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-white/80">
                    Showing{" "}
                    <span className="font-bold text-white">
                      {filteredJobs.length}
                    </span>{" "}
                    Jobs Available
                  </p>

                  {/* SORT */}
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span>Sort by:</span>

                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="appearance-none rounded-lg border border-white/10 bg-[#10143D] py-2 pl-3 pr-8 text-xs text-white outline-none"
                      >
                        <option>Most Relevant</option>
                        <option>Salary: Highest</option>
                        <option>Salary: Lowest</option>
                        <option>Most Applicants</option>
                      </select>

                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                      />
                    </div>
                  </div>
                </div>

                {/* JOB CARDS */}
                <div className="space-y-4">
                  {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-14 text-center text-sm text-white/70">
                      Memuat daftar lowongan...
                    </div>
                  ) : (
                    filteredJobs.slice(0, visibleCount).map((job) => (
                      <article
                        key={job.id}
                        className="flex min-h-[112px] flex-col justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.075] p-4 shadow-lg backdrop-blur-sm transition hover:border-white/30 sm:flex-row sm:items-center sm:px-5"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-[#142052] text-2xl">
                            {job.logo ? (
                              <img
                                src={`${API_URL}/uploads/logos/${job.logo}`}
                                alt={job.company}
                                className="h-full w-full bg-white object-contain p-1"
                              />
                            ) : (
                              "💼"
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-base font-bold text-white md:text-lg">
                                {job.title}
                              </h2>

                              <span className="rounded-md bg-[#4145FF] px-2 py-1 text-[10px] font-semibold text-white">
                                {job.applicants} Applicants
                              </span>

                              <span className="rounded-md bg-[#25A76B] px-2 py-1 text-[10px] font-semibold text-white">
                                {job.status}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-white/85">
                              {job.company}
                            </p>

                            <p className="mt-1 text-xs text-white/60">
                              {job.location} · {job.employment} · {job.salaryLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                          <Link
                            to={`/jobs/${job.id}`}
                            className="flex items-center gap-1 text-sm font-medium text-white underline underline-offset-2 transition hover:text-blue-300"
                          >
                            View Details
                            <ChevronRight size={16} />
                          </Link>

                          <span className="text-[10px] text-white/40">
                            {job.posted}
                          </span>
                        </div>
                      </article>
                    ))
                  )}

                  {/* EMPTY STATE */}
                  {!loading && filteredJobs.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-12 text-center">
                      <Search
                        size={30}
                        className="mx-auto text-white/40"
                      />

                      <h3 className="mt-3 font-semibold text-white">
                        No jobs found
                      </h3>

                      <p className="mt-1 text-sm text-white/50">
                        Try another keyword or adjust your filters.
                      </p>
                    </div>
                  )}
                </div>

                {/* LOAD MORE */}
                {visibleCount < filteredJobs.length && (
                  <div className="mt-5 text-center">
                    <button
                      onClick={() =>
                        setVisibleCount((current) => current + 6)
                      }
                      className="rounded-full border border-white/15 bg-[#10143D] px-7 py-3 text-xs font-medium text-white transition hover:border-blue-400 hover:bg-[#18245B]"
                    >
                      Load More Opportunities
                    </button>
                  </div>
                )}
              </div>

              {/* FILTER PANEL */}
              <aside className="h-fit rounded-2xl border border-white/10 bg-[#171A50]/90 p-5 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                    <SlidersHorizontal
                      size={16}
                      className="text-blue-400"
                    />
                    Filters
                  </h2>

                  <button
                    onClick={resetFilters}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300"
                  >
                    Reset all
                  </button>
                </div>

                {/* CATEGORY */}
                <div className="border-b border-white/10 py-4">
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Category
                  </h3>

                  {categories.length > 0 ? (
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <label
                          key={category.name}
                          className="flex cursor-pointer items-center justify-between gap-2 text-xs text-white/70"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(
                                category.name
                              )}
                              onChange={() => toggleCategory(category.name)}
                              className="h-3.5 w-3.5 accent-[#2864F0]"
                            />

                            {category.name}
                          </span>

                          <span className="text-white/35">
                            {category.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">
                      Belum ada kategori tersedia.
                    </p>
                  )}
                </div>

                {/* SALARY */}
                <div className="border-b border-white/10 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Monthly Salary
                    </h3>

                    <span className="text-[10px] font-medium text-blue-400">
                      Rp2M – Rp{(salaryLimit / 1000000).toFixed(0)}M
                      {salaryLimit >= 20000000 ? "+" : ""}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2000000"
                    max="20000000"
                    step="1000000"
                    value={salaryLimit}
                    onChange={(event) =>
                      setSalaryLimit(Number(event.target.value))
                    }
                    className="mt-4 w-full cursor-pointer accent-[#2864F0]"
                  />

                  <div className="mt-2 flex justify-between text-[10px] text-white/35">
                    <span>Rp2.000.000</span>
                    <span>Rp20.000.000+</span>
                  </div>
                </div>

                {/* EXPERIENCE */}
                <div className="py-4">
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Experience Level
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        value: "Entry-Level",
                        label: "Entry-level / Fresh Graduate",
                      },
                      {
                        value: "Mid-Level",
                        label: "Mid-Level (1–3 yrs)",
                      },
                      {
                        value: "Senior",
                        label: "Senior / Specialist (3+ yrs)",
                      },
                    ].map((item) => (
                      <label
                        key={item.value}
                        className="flex cursor-pointer items-center gap-2 text-xs text-white/70"
                      >
                        <input
                          type="radio"
                          name="experience"
                          value={item.value}
                          checked={experience === item.value}
                          onChange={(event) =>
                            setExperience(event.target.value)
                          }
                          className="h-3.5 w-3.5 accent-[#2864F0]"
                        />

                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                {/* APPLY FILTERS */}
                <button
                  onClick={applyFilters}
                  className="w-full rounded-lg bg-[#2864F0] py-3 text-xs font-semibold text-white transition hover:bg-blue-500"
                >
                  Apply Filters
                </button>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES FOR YOU */}
      <section className="bg-[#F5F6FF] px-6 py-12 text-[#010133] md:px-12 md:py-14 lg:px-[7%]">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="text-2xl font-bold text-[#0010FF] md:text-[30px]">
            Opportunities For You
          </h2>

          <p className="mt-1 text-sm text-[#0010FF] md:text-base">
            Jobs matched with your skills and interests.
          </p>

          {recommendedJobs.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedJobs.map((job, index) => (
                <article
                  key={job.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-[#F5F6FF] shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-[190px] overflow-hidden bg-[#142052]">
                    <img
                      src={
                        job.logo
                          ? `${API_URL}/uploads/logos/${job.logo}`
                          : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
                      }
                      alt={job.title}
                      className={`h-full w-full ${
                        job.logo ? "bg-white object-contain p-6" : "object-cover"
                      }`}
                    />

                    <span className="absolute bottom-3 right-4 rounded-md bg-[#FF7700] px-3 py-1 text-xs font-semibold text-white">
                      {job.salaryLabel}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="min-h-[44px] text-base font-bold leading-snug text-[#101020]">
                      {job.title} — {job.company}
                    </h3>

                    <p className="mt-1 text-sm text-[#55556D]">
                      {job.location} · {job.employment}
                    </p>

                    <div className="mt-4 flex justify-end">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="rounded-lg bg-[#0010FF] px-8 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                      >
                        Apply
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[#55556D]">
              Belum ada rekomendasi lowongan dari pengguna lain saat ini.
            </p>
          )}
        </div>
      </section>

      {/* SHARED FOOTER */}
      <PageFooter />
    </main>
  );
}

export default ExploreJobs;
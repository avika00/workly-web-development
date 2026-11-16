const categories = [
  {
    icon: "🎨",
    title: "Design & Creative",
    description:
      "Create visuals, interfaces, and creative experiences.",
  },
  {
    icon: "💻",
    title: "Development & Tech",
    description:
      "Build websites, apps, and digital solutions.",
  },
  {
    icon: "📱",
    title: "Marketing & Social Media",
    description:
      "Grow brands through content & campaigns.",
  },
  {
    icon: "✍️",
    title: "Writing & Translation",
    description:
      "Create engaging content and translation.",
  },
  {
    icon: "📊",
    title: "Business & Data",
    description:
      "Turn data and ideas into smarter business decisions.",
  },
  {
    icon: "🎥",
    title: "Media & Video",
    description:
      "Create videos, photos, and engaging digital content.",
  },
  {
    icon: "👩‍🏫",
    title: "Education & Tutoring",
    description:
      "Teaching, mentoring, and tutoring.",
  },
  {
    icon: "🎪",
    title: "Events & Hospitality",
    description:
      "Plan events & create memorable experiences.",
  },
];

function ExploreCategory() {
  return (
    <section
      id="categories"
      className="w-full bg-[#F5F6FF] px-6 py-16 text-[#010133] md:px-12 md:py-20 lg:px-[7%]"
    >
      <div className="mx-auto max-w-[1440px]">

        {/* SECTION HEADING */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0010FF] md:text-[32px]">
            Explore by Category
          </h2>

          <p className="mt-2 text-sm text-[#0010FF] md:text-base">
            Find opportunities that match your skills and interests.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="mx-auto mt-10 grid max-w-[1120px] grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-7 lg:mt-12">
          {categories.map((category) => (
            <a
              key={category.title}
              href="/register"
              className="flex min-h-[160px] flex-col rounded-xl bg-[#E3E4FF] p-4 transition duration-300 hover:-translate-y-1 hover:bg-[#D9DBFF] hover:shadow-lg sm:min-h-[175px] sm:p-5 md:min-h-[185px] md:p-6"
            >
              <span className="text-2xl md:text-3xl">
                {category.icon}
              </span>

              <h3 className="mt-4 text-sm font-bold leading-snug text-[#252542] md:text-base">
                {category.title}
              </h3>

              <p className="mt-1.5 text-xs leading-relaxed text-[#55556D] md:text-sm">
                {category.description}
              </p>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ExploreCategory;
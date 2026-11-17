const categories = [
  {
    icon: "🎨",
    title: "Design & Creative",
    description: "Create visuals, interfaces, and creative experiences.",
  },
  {
    icon: "💻",
    title: "Development & Tech",
    description: "Build websites, apps, and digital solutions.",
  },
  {
    icon: "📱",
    title: "Marketing & Social Media",
    description: "Grow brands through content & campaigns.",
  },
  {
    icon: "✍️",
    title: "Writing & Translation",
    description: "Create engaging content and translation.",
  },
  {
    icon: "📊",
    title: "Business & Data",
    description: "Turn data and ideas into smarter business decisions.",
  },
  {
    icon: "🎥",
    title: "Media & Video",
    description: "Create videos, photos, and engaging digital content.",
  },
  {
    icon: "👩‍🏫",
    title: "Education & Tutoring",
    description: "Teaching, mentoring, and tutoring.",
  },
  {
    icon: "🎪",
    title: "Events & Hospitality",
    description: "Plan events & create memorable experiences.",
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
          <h2 className="text-2xl font-bold text-[#0010FF] md:text-[30px]">
            Explore by Category
          </h2>

          <p className="mt-3 text-sm text-[#0010FF] md:text-[18px]">
            Find opportunities that match your skills and interests.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="mx-auto mt-12 grid max-w-[1200px] grid-cols-2 gap-x-5 gap-y-6 sm:gap-x-7 md:grid-cols-4 md:gap-x-8 md:gap-y-8">

          {categories.map((category) => (
            <a
              key={category.title}
              href="/register"
              className="flex min-h-[175px] flex-col rounded-[15px] bg-[#E3E4FF] p-5 transition duration-300 hover:-translate-y-1 hover:bg-[#D9DBFF] hover:shadow-[0_8px_20px_rgba(1,1,51,0.14)] md:min-h-[190px] md:p-6"
            >
              {/* CATEGORY ICON */}
              <span className="text-[28px] leading-none md:text-[30px]">
                {category.icon}
              </span>

              {/* CATEGORY TITLE */}
              <h3 className="mt-4 text-sm font-bold leading-[1.3] text-[#333344] md:text-[17px]">
                {category.title}
              </h3>

              {/* CATEGORY DESCRIPTION */}
              <p className="mt-2 text-xs leading-[1.5] text-[#55556D] md:text-[13px]">
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
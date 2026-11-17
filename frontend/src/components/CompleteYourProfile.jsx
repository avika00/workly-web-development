import { Link } from "react-router-dom";
import { Sparkles, Folder, BriefcaseBusiness, ChevronRight } from "lucide-react";

const profileActions = [
  {
    title: "Add Your Skills",
    description: "Show what you can do and get better job matches.",
    icon: Sparkles,
    link: "/profile",
  },
  {
    title: "Add Your Portfolio",
    description: "Showcase your work and let your skills speak.",
    icon: Folder,
    link: "/profile",
  },
  {
    title: "Add Your Experience",
    description: "Tell people what you've worked on and learned.",
    icon: BriefcaseBusiness,
    link: "/profile",
  },
];

function CompleteYourProfile() {
  return (
    <section className="relative overflow-hidden bg-[#010133] px-6 py-16 text-white md:px-[7.2%] md:py-[100px]">

      {/* CONTENT */}
      <div className="relative z-10 mx-auto max-w-[1500px]">

        {/* SECTION HEADER */}
        <div className="mb-16 flex items-start justify-between gap-6">
          <div className="max-w-[850px]">
            <h2 className="text-2xl font-bold md:text-[36px]">
              Complete Your Profile
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white md:text-[25px]">
              Add more details about your skills, experience, and interest to
              get better job matches and more relevant opportunities.
            </p>
          </div>

          <Link
            to="/profile"
            className="flex h-[46px] w-[198px] shrink-0 items-center justify-center rounded-xl border border-white text-sm text-white transition duration-300 hover:bg-white hover:text-[#010133]"
          >
            View Profile
          </Link>
        </div>

        {/* PROFILE ACTION CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {profileActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                to={item.link}
                className="group flex min-h-[100px] items-center gap-5 rounded-[20px] border border-white/40 bg-white/15 px-6 py-5 shadow-[0_0_22px_rgba(145,151,255,0.35)] backdrop-blur-md transition duration-300 hover:border-white hover:bg-white/25 hover:shadow-[0_0_30px_rgba(145,151,255,0.55)]"
              >
                {/* ICON */}
                <Icon
                  size={38}
                  strokeWidth={2.5}
                  className="shrink-0 text-white"
                  fill={item.title === "Add Your Skills" ? "white" : "none"}
                />

                {/* TEXT */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold md:text-[19px]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-white md:text-[13px]">
                    {item.description}
                  </p>
                </div>

                {/* ARROW */}
                <ChevronRight
                  size={24}
                  strokeWidth={2}
                  className="shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default CompleteYourProfile;
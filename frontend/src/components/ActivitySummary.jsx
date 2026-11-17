import { Link } from "react-router-dom";

const activities = [
  {
    number: "4",
    title: "Applications",
    description: "Keep track of your job applications.",
    background: "#EEEEFF",
  },
  {
    number: "2",
    title: "Saved Jobs",
    description: "Jobs you might want to apply for.",
    background: "#FFF9EC",
  },
  {
    number: "1",
    title: "Job Posted",
    description: "Your posted opportunity is active.",
    background: "#EDFFF1",
  },
];

function ActivitySummary() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-16 pt-7 text-white md:px-12 md:pb-20">

      {/* SUBTLE GLOW BEHIND ACTIVITY CARDS */}
      <img
        src="/images/workly-glow.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[80px] -z-10 w-[520px] max-w-none -translate-x-1/2 opacity-30"
      />

      <div className="relative z-10 mx-auto max-w-[1000px]">

        {/* SECTION HEADING */}
        <div className="mb-9 flex items-center justify-center gap-2">
          <h2 className="text-center text-[19px] font-bold sm:text-[22px]">
            Your Activity with
          </h2>

          <img
            src="/images/logos/logo-white.png"
            alt="Workly"
            className="w-[82px] object-contain sm:w-[95px]"
          />
        </div>

        {/* ACTIVITY CARDS */}
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-6">
          {activities.map((activity) => (
            <article
              key={activity.title}
              className="flex min-h-[190px] flex-col items-center justify-center rounded-[16px] px-5 py-5 text-center shadow-[0_0_18px_rgba(255,255,255,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,255,255,0.8)] sm:min-h-[190px] md:min-h-[200px]"
              style={{ backgroundColor: activity.background }}
            >
              <span className="text-[64px] leading-none font-bold text-[#0010FF] sm:text-[70px]">
                {activity.number}
              </span>

              <h3 className="mt-1 text-[16px] font-bold text-[#0010FF] sm:text-[17px]">
                {activity.title}
              </h3>

              <p className="mt-1 max-w-[180px] text-[12px] leading-relaxed text-[#0010FF]">
                {activity.description}
              </p>
            </article>
          ))}
        </div>

        {/* SEE DETAIL BUTTON */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/activity"
            className="flex h-[36px] min-w-[125px] items-center justify-center rounded-lg border border-white px-6 text-[11px] font-medium text-white transition duration-300 hover:bg-white hover:text-[#010133]"
          >
            See detail ›
          </Link>
        </div>

      </div>
    </section>
  );
}

export default ActivitySummary;
import uiUxImage from "../assets/images/jobs/ui-ux-designer.jpg";

const steps = [
  {
    number: "1",
    title: "Post Easily",
    description: "Create and publish your job in a few simple steps.",
  },
  {
    number: "2",
    title: "Find the Right Skills",
    description: "Reach people based on the skills you need.",
  },
  {
    number: "3",
    title: "Connect Directly",
    description: "Review applicants and start a conversation.",
  },
];

function HaveOpportunity() {
  return (
    <section
      id="post-job"
      className="w-full bg-[#F5F6FF] px-6 py-20 text-[#010133] md:px-12 lg:px-[7%] lg:py-24"
    >
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 lg:grid-cols-2 lg:gap-16">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-2xl font-bold text-[#0010FF] md:text-[32px]">
            Have an Opportunity to Share?
          </h2>

          <p className="mt-2 text-sm text-[#0010FF] md:text-base">
            Post a job and connect with people who have the skills you need.
          </p>

          {/* STEPS */}
          <div className="mt-9 space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0010FF] text-lg font-bold text-white">
                  {step.number}
                </div>

                <div className="pt-0.5">
                  <h3 className="text-base font-bold text-[#010133] md:text-lg">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#33334D] md:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* POST JOB BUTTON */}
          <a
            href="/register"
            className="mt-8 inline-flex h-11 min-w-[150px] items-center justify-center rounded-lg bg-[#0010FF] px-7 text-sm font-semibold text-white transition hover:bg-[#4E59FF]"
          >
            Post a Job
          </a>
        </div>

        {/* RIGHT IMAGE CARD */}
        <div className="relative mx-auto h-[300px] w-full max-w-[580px] overflow-hidden rounded-2xl shadow-lg md:h-[380px] lg:h-[400px]">
          <img
            src={uiUxImage}
            alt="Graphic designer working at a computer"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

          {/* JOB INFORMATION */}
          <div className="absolute bottom-7 left-6 right-6 text-white md:bottom-9 md:left-8 md:right-8">
            <p className="text-xs font-medium text-white/80 md:text-sm">
              #Design #Adobe #Creative
            </p>

            <h3 className="mt-2 text-2xl font-bold md:text-3xl">
              Graphic Designer
            </h3>

            <p className="mt-1 text-sm md:text-base">
              Hybrid · Freelance
            </p>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="rounded-lg bg-[#FF7700] px-5 py-2 text-xs font-bold text-white md:text-sm">
                Rp2–4M
              </span>

              <a
                href="/register"
                className="flex h-10 min-w-[130px] items-center justify-center rounded-lg bg-[#0010FF] px-5 text-sm font-semibold text-white transition hover:bg-[#4E59FF] md:min-w-[160px]"
              >
                Post a Job
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HaveOpportunity;
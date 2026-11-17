import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#010133] text-white md:grid-cols-[58%_42%]">

      {/* LEFT: REGISTER FORM PANEL */}
      <section className="flex min-h-screen items-center justify-center rounded-br-[50px] bg-[#F5F6FF] px-6 py-12 text-[#0010FF] md:rounded-br-[50px] md:rounded-tr-[50px] md:px-12">

        <div className="w-full max-w-[386px]">

          {/* HEADING */}
          <div className="mb-8 text-center">
            <h1 className="text-[32px] font-bold sm:text-[34px]">
              Join Workly
            </h1>

            <p className="mt-1 text-[14px] sm:text-[15px]">
              Create your account and start discovering new opportunities.
            </p>
          </div>

          {/* REGISTER FORM */}
          <form
            onSubmit={(event) => event.preventDefault()}
            className="space-y-5"
          >

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-[15px] font-semibold"
              >
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="h-[53px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-6 text-[14px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-[15px] font-semibold"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                autoComplete="username"
                required
                className="h-[53px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-6 text-[14px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[15px] font-semibold"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                required
                className="h-[53px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-6 text-[14px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[15px] font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  className="h-[53px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-6 pr-14 text-[14px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0010FF]"
                >
                  <PasswordIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-[15px] font-semibold"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="h-[53px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-6 pr-14 text-[14px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#0010FF]"
                >
                  <PasswordIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              type="submit"
              className="mt-2 h-[53px] w-full rounded-[20px] bg-[#0010FF] text-[14px] font-semibold text-white transition duration-300 hover:bg-[#4E59FF]"
            >
              Create Account
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-5 text-center text-[16px]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium underline underline-offset-2 transition hover:text-[#4E59FF]"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>

      {/* RIGHT: BRANDING PANEL */}
      <section className="relative flex min-h-[350px] items-center justify-center overflow-hidden px-8 py-12 md:min-h-screen">

        {/* BACKGROUND GLOW */}
        <img
          src="/images/workly-glow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-180px] top-[-120px] w-[600px] max-w-none opacity-50"
        />

        {/* BRAND CONTENT */}
        <div className="relative z-10 mx-auto flex max-w-[440px] flex-col items-center text-center">

          <img
            src="/images/logos/logo-white.png"
            alt="Workly"
            className="mb-7 w-[190px] object-contain"
          />

          <h2 className="text-[22px] font-bold">
            Find Work. Find Talent.
          </h2>

          <p className="mt-3 text-[16px] leading-[2.5] text-white">
            Discover people, projects, and roles that can
            <br className="hidden sm:block" />
            take your next step further.
          </p>
        </div>
      </section>
    </main>
  );
}

// PASSWORD VISIBILITY ICON
function PasswordIcon({ visible }) {
  return visible ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 002.8 2.8" />
      <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 9 7 9 7a15.8 15.8 0 01-4.1 4.7" />
      <path d="M6.2 6.2C3.5 8 2 12 2 12s4 7 10 7a10.7 10.7 0 004.1-.8" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default Register;
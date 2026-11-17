import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#010133] text-white md:grid-cols-[42%_58%]">

      {/* LEFT: BRANDING PANEL */}
      <section className="relative flex min-h-[300px] items-center justify-center overflow-hidden px-8 py-12 md:min-h-screen">

        {/* BACKGROUND GLOW */}
        <img
          src="/images/workly-glow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[-180px] top-[-120px] w-[600px] max-w-none opacity-50"
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

      {/* RIGHT: LOGIN FORM PANEL */}
      <section className="relative flex min-h-[650px] items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-[#F5F6FF] px-6 py-16 text-[#0010FF] md:min-h-screen md:rounded-bl-[50px] md:rounded-tr-none md:px-12 md:py-12">

        <div className="w-full max-w-[448px]">

          {/* HEADING */}
          <div className="mb-12 text-center">
            <h1 className="text-[32px] leading-tight font-bold sm:text-[38px]">
              Welcome Back to Workly
            </h1>

            <p className="mt-3 text-[17px] sm:text-[20px]">
              Sign in to continue exploring opportunities.
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={(event) => event.preventDefault()}
            className="space-y-6"
          >

            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-3 block text-[16px] font-semibold"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                autoComplete="username"
                required
                className="h-[60px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-7 text-[15px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-[16px] font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-[60px] w-full rounded-[20px] border-[1.5px] border-[#0010FF] bg-transparent px-7 pr-16 text-[15px] text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-[#0010FF] transition hover:text-[#4E59FF]"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
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
                      width="25"
                      height="25"
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
                  )}
                </button>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              className="mt-4 h-[60px] w-full rounded-[20px] bg-[#0010FF] text-[16px] font-semibold text-white transition duration-300 hover:bg-[#4E59FF]"
            >
              Sign In
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-10 text-center text-[18px]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium underline underline-offset-2 transition hover:text-[#4E59FF]"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
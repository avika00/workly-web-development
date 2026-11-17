import { useRef, useState } from "react";
import { Link } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) return;

    const newOtp = [...otp];

    pastedValue.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verifikasi OTP akan dihubungkan ke backend nantinya.
  };

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

      {/* RIGHT: OTP FORM PANEL */}
      <section className="relative flex min-h-[600px] items-center justify-center rounded-tl-[50px] rounded-tr-[50px] bg-[#F5F6FF] px-6 py-16 text-[#0010FF] md:min-h-screen md:rounded-bl-[50px] md:rounded-tr-none md:px-12">

        <div className="w-full max-w-[448px]">

          {/* EMAIL ICON */}
          <div className="mb-7 flex justify-center">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#E3E5FF] text-[#0010FF]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>
          </div>

          {/* HEADING */}
          <div className="mb-10 text-center">
            <h1 className="text-[32px] leading-tight font-bold sm:text-[38px]">
              Verify Your Email
            </h1>

            <p className="mt-4 text-[15px] leading-relaxed text-[#454568] sm:text-[17px]">
              We've sent a verification code to your email address.
              Please enter the 6-digit code below to verify your account.
            </p>
          </div>

          {/* OTP FORM */}
          <form onSubmit={handleSubmit}>

            <label className="mb-5 block text-center text-[16px] font-semibold">
              Enter Verification Code
            </label>

            {/* OTP INPUTS */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleChange(index, event.target.value)
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  onPaste={index === 0 ? handlePaste : undefined}
                  aria-label={`OTP digit ${index + 1}`}
                  className="h-[52px] w-[42px] rounded-[12px] border-[1.5px] border-[#0010FF] bg-transparent text-center text-[22px] font-bold text-[#010133] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0010FF]/20 sm:h-[60px] sm:w-[55px] sm:rounded-[15px]"
                />
              ))}
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              className="mt-9 h-[58px] w-full rounded-[20px] bg-[#0010FF] text-[16px] font-semibold text-white transition duration-300 hover:bg-[#4E59FF]"
            >
              Verify Account
            </button>
          </form>

          {/* RESEND CODE */}
          <div className="mt-9 text-center">
            <p className="text-[15px] text-[#454568]">
              Didn't receive the code?
            </p>

            <button
              type="button"
              disabled
              className="mt-2 cursor-not-allowed text-[15px] font-semibold text-[#0010FF] underline underline-offset-4 opacity-70"
            >
              Resend Code
            </button>
          </div>

          {/* BACK TO REGISTER */}
          <p className="mt-8 text-center text-[14px] text-[#454568]">
            Want to use a different email?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#0010FF] underline underline-offset-2 transition hover:text-[#4E59FF]"
            >
              Back to Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default VerifyEmail;
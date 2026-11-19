import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_URL = "http://localhost:8000";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validasi kecocokan password di sisi client
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Password dan Confirm Password tidak cocok.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Password minimal terdiri dari 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (result.status) {
        setSuccessMsg("Akun berhasil dibuat! Mengalihkan ke halaman login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setErrorMsg(result.message || "Registrasi gagal.");
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung ke server PHP. Pastikan terminal PHP berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-workly-bg text-white md:grid-cols-[58%_42%]">
      {/* LEFT: REGISTER FORM PANEL */}
      <section className="flex min-h-screen items-center justify-center rounded-b-[50px] bg-[#F5F6FF] px-6 py-12 text-workly-primary md:rounded-bl-none md:rounded-r-[50px] md:px-12">
        <div className="w-full max-w-[386px]">
          {/* HEADING */}
          <div className="mb-8 text-center">
            <h1 className="text-[32px] font-bold sm:text-[34px]">
              Join Workly
            </h1>

            <p className="mt-1 text-sm sm:text-[15px]">
              Create your account and start discovering new opportunities.
            </p>
          </div>

          {/* PESAN ERROR / SUKSES */}
          {errorMsg && (
            <div className="mb-5 rounded-2xl border border-red-300 bg-red-100 px-4 py-3 text-center text-xs font-medium text-red-700 sm:text-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 rounded-2xl border border-emerald-300 bg-emerald-100 px-4 py-3 text-center text-xs font-medium text-emerald-700 sm:text-sm">
              {successMsg}
            </div>
          )}

          {/* REGISTER FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                className="h-[53px] w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-6 text-sm text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
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
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                autoComplete="username"
                required
                className="h-[53px] w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-6 text-sm text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                autoComplete="email"
                required
                className="h-[53px] w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-6 text-sm text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  className="h-[53px] w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-6 pr-14 text-sm text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-workly-primary transition hover:text-workly-highlight"
                >
                  {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                  className="h-[53px] w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-6 pr-14 text-sm text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-workly-primary transition hover:text-workly-highlight"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={21} />
                  ) : (
                    <Eye size={21} />
                  )}
                </button>
              </div>
            </div>

            {/* CREATE ACCOUNT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-[53px] w-full cursor-pointer rounded-[20px] bg-workly-primary text-sm font-semibold text-white transition duration-300 hover:bg-workly-highlight disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="mt-5 text-center text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium underline underline-offset-2 transition hover:text-workly-highlight"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>

      {/* RIGHT: BRANDING PANEL */}
      <section className="relative flex min-h-87.5 items-center justify-center overflow-hidden px-8 py-12 md:min-h-screen">
        {/* BACKGROUND GLOW */}
        <img
          src="/images/workly-glow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-45 -top-30 w-150 max-w-none select-none opacity-50"
        />

        {/* BRAND CONTENT */}
        <div className="relative z-10 mx-auto flex max-w-110 flex-col items-center text-center">
          <img
            src="/images/logos/logo-white.png"
            alt="Workly"
            className="mb-7 w-47.5 object-contain"
          />

          <h2 className="text-[22px] font-bold">Find Work. Find Talent.</h2>

          <p className="mt-3 text-base leading-relaxed text-white/90">
            Discover people, projects, and roles that can
            <br className="hidden sm:block" /> take your next step further.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const API_URL = "http://localhost:8000";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status) {
        localStorage.setItem("workly_user", JSON.stringify(result.user));
        navigate("/home");
      } else {
        setErrorMsg(result.message || "Username atau password salah.");
      }
    } catch (error) {
      setErrorMsg("Gagal terhubung ke server PHP. Pastikan terminal PHP berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-workly-bg text-white md:grid-cols-[42%_58%]">
      {/* LEFT: BRANDING PANEL */}
      <section className="relative flex min-h-75 items-center justify-center overflow-hidden px-8 py-12 md:min-h-screen">
        {/* BACKGROUND GLOW */}
        <img
          src="/images/workly-glow.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-45 top-30 w-150 max-w-none select-none opacity-50"
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

      {/* RIGHT: LOGIN FORM PANEL */}
      <section className="relative flex min-h-162.5 items-center justify-center rounded-t-[50px] bg-[#F5F6FF] px-6 py-16 text-workly-primary md:min-h-screen md:rounded-tr-none md:rounded-bl-[50px] md:px-12 md:py-12">
        <div className="w-full max-w-md">
          {/* HEADING */}
          <div className="mb-10 text-center">
            <h1 className="text-[32px] font-bold leading-tight sm:text-[38px]">
              Welcome Back to Workly
            </h1>

            <p className="mt-3 text-[17px] sm:text-xl">
              Sign in to continue exploring opportunities.
            </p>
          </div>

          {/* PESAN ERROR JIKA LOGIN GAGAL */}
          {errorMsg && (
            <div className="mb-6 rounded-2xl border border-red-300 bg-red-100 px-4 py-3 text-center text-sm font-medium text-red-700">
              {errorMsg}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* USERNAME */}
            <div>
              <label
                htmlFor="username"
                className="mb-3 block text-base font-semibold"
              >
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                autoComplete="username"
                required
                className="h-15 w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-7 text-[15px] text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-base font-semibold"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-15 w-full rounded-[20px] border-[1.5px] border-workly-primary bg-transparent px-7 pr-16 text-[15px] text-workly-bg outline-none transition focus:bg-white focus:ring-2 focus:ring-workly-primary/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer text-workly-primary transition hover:text-workly-highlight"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-15 w-full cursor-pointer rounded-[20px] bg-workly-primary text-base font-semibold text-white transition duration-300 hover:bg-workly-highlight disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* REGISTER LINK */}
          <p className="mt-10 text-center text-lg">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium underline underline-offset-2 transition hover:text-workly-highlight"
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
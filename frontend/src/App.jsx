import { Routes, Route, useParams } from "react-router-dom";

// Shared Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Home Before Login
import Hero from "./components/Hero";
import Opportunities from "./components/HomeSections";
import HowItWorks from "./components/HowItWorks";
import HaveOpportunity from "./components/HaveOpportunity";
import ExploreCategory from "./components/ExploreCategory";

// Authentication
import Login from "./components/Login";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";

// Home After Login
import WelcomeSection from "./components/WelcomeSection";
import ActivitySummary from "./components/ActivitySummary";
import OpportunitiesForYou from "./components/OpportunitiesForYou";
import CompleteYourProfile from "./components/CompleteYourProfile";

// HOME BEFORE LOGIN
function HomeBeforeLogin() {
  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#010133]"
    >
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-[950px] w-full bg-no-repeat"
        style={{
          backgroundImage: "url('/images/workly-glow.png')",
          backgroundPosition: "left -180px",
          backgroundSize: "900px auto",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Opportunities />
        <HowItWorks />
        <HaveOpportunity />
        <ExploreCategory />
        <Footer />
      </div>
    </main>
  );
}

// HOME AFTER LOGIN
function HomeAfterLogin() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010133]">

      {/* Background Glow */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-[950px] w-full bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/workly-glow.png'), url('/images/workly-glow.png')",
          backgroundPosition:
            "left -180px top -180px, right -180px bottom -180px",
          backgroundSize: "700px auto, 700px auto",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />

      {/* Page Content */}
      <div className="relative z-10">
        <Navbar isLoggedIn={true} />
        <WelcomeSection />
        <ActivitySummary />
        <OpportunitiesForYou />
        <CompleteYourProfile />
        <ExploreCategory />
        <Footer />
      </div>
    </main>
  );
}

// PLACEHOLDER PAGE
function PlaceholderPage({ title }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#010133] px-6 text-center text-white">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-white/70">
          Halaman ini sedang dalam proses pengembangan.
        </p>
      </div>
    </main>
  );
}

// JOB DETAIL
function JobDetailPage() {
  const { id } = useParams();

  return <PlaceholderPage title={`Job Detail - ${id}`} />;
}

// MAIN ROUTES
function App() {
  return (
    <Routes>
      {/* Home Before Login */}
      <Route path="/" element={<HomeBeforeLogin />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Home After Login */}
      <Route path="/home" element={<HomeAfterLogin />} />

      {/* Other Pages */}
      <Route path="/jobs" element={<PlaceholderPage title="Explore Jobs" />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      <Route path="/post-job" element={<PlaceholderPage title="Post a Job" />} />
      <Route path="/activity" element={<PlaceholderPage title="Activity" />} />
      <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
      <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />

      {/* 404 */}
      <Route
        path="*"
        element={<PlaceholderPage title="404 - Page Not Found" />}
      />
    </Routes>
  );
}

export default App;
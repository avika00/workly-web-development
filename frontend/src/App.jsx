import { Routes, Route, useParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Opportunities from "./components/HomeSections";
import HowItWorks from "./components/HowItWorks";
import HaveOpportunity from "./components/HaveOpportunity";
import ExploreCategory from "./components/ExploreCategory";
import Footer from "./components/Footer";

// HOME BEFORE LOGIN
function HomeBeforeLogin() {
  return (
    <main
      id="home"
      className="relative min-h-screen overflow-hidden bg-[#010133]"
    >
      {/* WORKLY GLOW BACKGROUND */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-[950px] w-full bg-no-repeat"
        style={{
          backgroundImage: "url('/images/workly-glow.png')",
          backgroundPosition: "left -180px",
          backgroundSize: "900px auto",
        }}
      />

      {/* PAGE CONTENT */}
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

// TEMPORARY PAGE FOR ROUTES NOT BUILT YET
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

  return (
    <PlaceholderPage title={`Job Detail - ${id}`} />
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeBeforeLogin />} />

      <Route
        path="/login"
        element={<PlaceholderPage title="Login" />}
      />

      <Route
        path="/register"
        element={<PlaceholderPage title="Register" />}
      />

      <Route
        path="/home"
        element={<PlaceholderPage title="Home After Login" />}
      />

      <Route
        path="/jobs"
        element={<PlaceholderPage title="Explore Jobs" />}
      />

      <Route path="/jobs/:id" element={<JobDetailPage />} />

      <Route
        path="/post-job"
        element={<PlaceholderPage title="Post a Job" />}
      />

      <Route
        path="/activity"
        element={<PlaceholderPage title="Activity" />}
      />

      <Route
        path="/profile"
        element={<PlaceholderPage title="Profile" />}
      />

      <Route
        path="*"
        element={<PlaceholderPage title="404 - Page Not Found" />}
      />
    </Routes>
  );
}

export default App;
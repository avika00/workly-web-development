import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  UserRound,
  X,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
} from "lucide-react";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

const EMPTY_PROFILE = {
  fullName: "",
  photo: "",
  username: "",
  birth: "",
  education: "",
  university: "",
  location: "",
  phone: "",
  email: "",
  about: "",
  experience: "",
};

function Profile() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const fileInputRef = useRef(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // State utama yang tampil di halaman Profile
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [skills, setSkills] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  // State sementara khusus untuk input di dalam modal
  const [draftProfile, setDraftProfile] = useState(EMPTY_PROFILE);
  const [draftSkills, setDraftSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const [draftPortfolios, setDraftPortfolios] = useState([]);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("");
  const [newPortfolioLink, setNewPortfolioLink] = useState("");

  // Ambil data profil, skills, dan portofolio dari database saat halaman dibuka
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${API_URL}/profile/read.php?id_user=${currentUser.ID_USER}`
        );
        const result = await res.json();

        if (result.status) {
          setProfile(result.profile);
          setSkills(result.skills || []);
          setPortfolios(result.portfolios || []);
        }
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser?.ID_USER, navigate]);

  // Logout: hapus sesi login & arahkan ke halaman Login
  const handleLogout = () => {
    localStorage.removeItem("workly_user");
    sessionStorage.removeItem("worklyCompanyData");
    sessionStorage.removeItem("worklyJobDetails");
    sessionStorage.removeItem("worklyPublishedJob");
    window.dispatchEvent(new Event("workly-user-updated"));
    navigate("/login");
  };

  // Buka modal Edit Profile dengan menyalin data saat ini ke draft
  const openEditProfile = () => {
    setDraftProfile({ ...profile });
    setIsEditingProfile(true);
  };

  const handleDraftProfileChange = (e) => {
    const { name, value } = e.target;
    setDraftProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload foto profil ke server PHP
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("id_user", currentUser.ID_USER);
    formData.append("photo", file);

    setUploadingPhoto(true);
    try {
      const res = await fetch(`${API_URL}/profile/upload_photo.php`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.status) {
        setProfile((prev) => ({ ...prev, photo: result.photo }));
        localStorage.setItem(
          "workly_user",
          JSON.stringify({ ...currentUser, PHOTO: result.photo })
        );
        window.dispatchEvent(new Event("workly-user-updated"));
      } else {
        alert(result.message || "Gagal mengunggah foto.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  // Simpan perubahan profil ke database
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/profile/update.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: currentUser.ID_USER,
          ...draftProfile,
        }),
      });

      const result = await res.json();

      if (result.status) {
        const updatedProfile = {
          ...draftProfile,
          photo: profile.photo,
          username: result.cleanUsername,
        };

        setProfile(updatedProfile);
        localStorage.setItem(
          "workly_user",
          JSON.stringify({
            ...currentUser,
            FULLNAME: updatedProfile.fullName,
            USERNAME: result.cleanUsername,
            EMAIL: updatedProfile.email,
          })
        );
        window.dispatchEvent(new Event("workly-user-updated"));
        setIsEditingProfile(false);
      } else {
        alert(result.message || "Gagal menyimpan profil.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setSaving(false);
    }
  };

  // Buka modal Edit Skills dengan menyalin daftar skill saat ini ke draft
  const openEditSkills = () => {
    setDraftSkills([...skills]);
    setNewSkill("");
    setIsEditingSkills(true);
  };

  const addSkill = () => {
    const value = newSkill.trim();
    if (
      value &&
      !draftSkills.some((skill) => skill.toLowerCase() === value.toLowerCase())
    ) {
      setDraftSkills((prev) => [...prev, value]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setDraftSkills((prev) => prev.filter((_, i) => i !== index));
  };

  // Simpan perubahan skills ke database
  const handleSaveSkills = async () => {
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/profile/update_skills.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: currentUser.ID_USER,
          skills: draftSkills,
        }),
      });

      const result = await res.json();

      if (result.status) {
        setSkills([...draftSkills]);
        setIsEditingSkills(false);
      } else {
        alert(result.message || "Gagal menyimpan skills.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setSaving(false);
    }
  };

  // Buka modal Edit Portfolio dengan menyalin daftar portofolio saat ini ke draft
  const openEditPortfolio = () => {
    setDraftPortfolios(portfolios.map((item) => ({ ...item })));
    setNewPortfolioTitle("");
    setNewPortfolioLink("");
    setIsEditingPortfolio(true);
  };

  const addPortfolio = () => {
    const title = newPortfolioTitle.trim();
    let link = newPortfolioLink.trim();

    if (!title || !link) return;

    if (!/^https?:\/\//i.test(link)) {
      link = `https://${link}`;
    }

    setDraftPortfolios((prev) => [...prev, { title, link }]);
    setNewPortfolioTitle("");
    setNewPortfolioLink("");
  };

  const removePortfolio = (index) => {
    setDraftPortfolios((prev) => prev.filter((_, i) => i !== index));
  };

  // Simpan perubahan portofolio ke database
  const handleSavePortfolio = async () => {
    setSaving(true);

    try {
      const res = await fetch(`${API_URL}/profile/update_portfolios.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_user: currentUser.ID_USER,
          portfolios: draftPortfolios,
        }),
      });

      const result = await res.json();

      if (result.status) {
        setPortfolios(draftPortfolios.map((item) => ({ ...item })));
        setIsEditingPortfolio(false);
      } else {
        alert(result.message || "Gagal menyimpan portofolio.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setSaving(false);
    }
  };

  const formatBirthDisplay = (dateStr) => {
    if (!dateStr) return "-";
    const parts = dateStr.split("-");
    return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : dateStr;
  };

  return (
    <main className="min-h-screen bg-workly-bg">
      {/* NAVBAR */}
      <div className="relative h-[126px] overflow-hidden bg-workly-bg">
        <div
          className="pointer-events-none absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: "url('/images/workly-glow.png')",
            backgroundPosition: "left -180px top -180px",
            backgroundSize: "700px auto",
          }}
        />

        <Navbar isLoggedIn={true} />
      </div>

      {/* PROFILE CONTENT */}
      <section className="relative -mt-px min-h-[calc(100vh-126px)] rounded-t-[48px] bg-[#F5F6FF] px-5 pb-5 pt-10 sm:px-8 lg:px-12">
        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center text-workly-bg">
            Memuat data profil...
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-[1220px] grid-cols-1 items-stretch gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">
            {/* LEFT CARD - PERSONAL INFORMATION */}
            <div className="flex flex-col justify-between rounded-[28px] border border-[#DADBE5] bg-white/55 px-7 py-9 shadow-[0_3px_10px_rgba(0,0,0,0.10)] sm:px-10">
              <div>
                {/* PROFILE HEADER */}
                <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row">
                  <div className="relative flex size-[110px] shrink-0 items-center justify-center rounded-full bg-[#D9DCFF] text-workly-highlight">
                    {profile.photo ? (
                      <img
                        src={`${API_URL}/uploads/profiles/${profile.photo}`}
                        alt={profile.fullName || "Profile"}
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      <UserRound size={58} strokeWidth={1.5} />
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      disabled={uploadingPhoto}
                      aria-label="Change profile photo"
                      className="absolute bottom-0 right-0 flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-black text-white transition hover:bg-workly-highlight disabled:opacity-60"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera size={16} />
                    </button>
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <h1 className="text-lg font-bold leading-snug text-[#111111]">
                      {profile.fullName || profile.username}
                    </h1>

                    <p className="mt-1 text-sm text-[#111111]">
                      @{profile.username}
                    </p>

                    <button
                      type="button"
                      onClick={openEditProfile}
                      className="mt-3 cursor-pointer rounded-lg border border-workly-primary px-6 py-1.5 text-[11px] font-medium text-workly-primary transition hover:bg-workly-primary hover:text-white"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                {/* PERSONAL DETAILS */}
                <div className="space-y-4">
                  <ProfileField label="Full Name" value={profile.fullName || "-"} />
                  <ProfileField label="Username" value={`@${profile.username}`} />
                  <ProfileField
                    label="Birth"
                    value={formatBirthDisplay(profile.birth)}
                  />
                  <ProfileField
                    label="Latest Education"
                    value={
                      profile.education || profile.university ? (
                        <>
                          {profile.education || "-"}
                          {profile.university && (
                            <span className="mt-1 block text-sm font-normal">
                              {profile.university}
                            </span>
                          )}
                        </>
                      ) : (
                        "-"
                      )
                    }
                  />
                  <ProfileField label="Location" value={profile.location || "-"} />
                  <ProfileField label="Phone Number" value={profile.phone || "-"} />
                  <ProfileField label="Email" value={profile.email || "-"} />
                </div>
              </div>

              {/* LOGOUT BUTTON */}
              <div className="mt-8 border-t border-[#DADBE5] pt-6">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#D83F4B] bg-white/80 py-2.5 text-xs font-semibold text-[#D83F4B] transition hover:bg-[#D83F4B] hover:text-white"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN - ADDITIONAL INFORMATION & PORTFOLIO */}
            <div className="flex flex-col gap-7">
              {/* ADDITIONAL INFORMATION CARD */}
              <div className="flex flex-1 flex-col justify-between rounded-[28px] border border-[#DADBE5] bg-white/55 px-7 py-9 shadow-[0_3px_10px_rgba(0,0,0,0.10)] sm:px-10">
                <div>
                  <h2 className="mb-4 text-lg font-bold text-[#111111]">
                    Additional Information
                  </h2>

                  {/* ABOUT ME */}
                  <div className="mb-5">
                    <h3 className="mb-1 text-base font-semibold text-[#111111]">
                      About Me
                    </h3>

                    <p className="text-justify text-sm leading-[1.55] text-[#222222]">
                      {profile.about || "Belum ada deskripsi diri."}
                    </p>
                  </div>

                  {/* EXPERIENCE */}
                  <div className="mb-5">
                    <h3 className="mb-1 text-base font-semibold text-[#111111]">
                      Experience
                    </h3>

                    <p className="text-justify text-sm leading-[1.55] text-[#222222]">
                      {profile.experience || "Belum ada pengalaman yang ditambahkan."}
                    </p>
                  </div>

                  {/* SKILLS */}
                  <div>
                    <h3 className="mb-2 text-base font-semibold text-[#111111]">
                      Skills
                    </h3>

                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-[#C6C9FF] px-6 py-2 text-xs font-medium text-[#111111]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#666666]">
                        Belum ada skill yang ditambahkan.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={openEditSkills}
                    className="cursor-pointer rounded-full border border-workly-primary px-9 py-2 text-xs font-medium text-workly-primary transition hover:bg-workly-primary hover:text-white"
                  >
                    Edit Skill
                  </button>
                </div>
              </div>

              {/* PORTFOLIO CARD */}
              <div className="flex flex-col justify-between rounded-[28px] border border-[#DADBE5] bg-white/55 px-7 py-9 shadow-[0_3px_10px_rgba(0,0,0,0.10)] sm:px-10">
                <div>
                  <h2 className="mb-4 text-lg font-bold text-[#111111]">
                    Portfolio
                  </h2>

                  {portfolios.length > 0 ? (
                    <div className="space-y-3">
                      {portfolios.map((item, index) => (
                        <a
                          key={`${item.title}-${index}`}
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between gap-4 rounded-2xl border border-[#DADBE5] bg-white/80 px-5 py-3.5 transition hover:border-workly-primary hover:bg-[#EDEFFF]"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#111111]">
                              {item.title}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-workly-primary">
                              {item.link}
                            </p>
                          </div>

                          <ExternalLink
                            size={16}
                            className="shrink-0 text-workly-primary"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#666666]">
                      Belum ada link portofolio yang ditambahkan.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={openEditPortfolio}
                    className="cursor-pointer rounded-full border border-workly-primary px-9 py-2 text-xs font-medium text-workly-primary transition hover:bg-workly-primary hover:text-white"
                  >
                    Edit Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mx-auto mt-6 w-full max-w-[1220px]">
          <PageFooter />
        </div>
      </section>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <form
            onSubmit={handleSaveProfile}
            className="max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-workly-bg">
                Edit Profile
              </h2>

              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="cursor-pointer text-gray-500 transition hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <EditInput
                label="Full Name"
                name="fullName"
                value={draftProfile.fullName}
                onChange={handleDraftProfileChange}
              />
              <EditInput
                label="Username"
                name="username"
                value={draftProfile.username}
                onChange={handleDraftProfileChange}
                required
              />
              <EditInput
                label="Birth"
                name="birth"
                type="date"
                value={draftProfile.birth}
                onChange={handleDraftProfileChange}
              />
              <EditInput
                label="Latest Education"
                name="education"
                value={draftProfile.education}
                onChange={handleDraftProfileChange}
              />
              <EditInput
                label="University"
                name="university"
                value={draftProfile.university}
                onChange={handleDraftProfileChange}
              />
              <EditInput
                label="Location"
                name="location"
                value={draftProfile.location}
                onChange={handleDraftProfileChange}
              />
              <EditInput
                label="Phone Number"
                name="phone"
                value={draftProfile.phone}
                onChange={handleDraftProfileChange}
              />
              <EditInput
                label="Email"
                name="email"
                type="email"
                value={draftProfile.email}
                onChange={handleDraftProfileChange}
                required
              />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  About Me
                </label>
                <textarea
                  name="about"
                  value={draftProfile.about}
                  onChange={handleDraftProfileChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-workly-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={draftProfile.experience}
                  onChange={handleDraftProfileChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-workly-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-workly-primary py-3 text-sm font-semibold text-white transition hover:bg-workly-highlight disabled:opacity-60"
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}

      {/* EDIT SKILLS MODAL */}
      {isEditingSkills && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-workly-bg">
                Edit Skills
              </h2>

              <button
                type="button"
                onClick={() => setIsEditingSkills(false)}
                className="cursor-pointer text-gray-500 transition hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-5 flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a new skill..."
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-workly-primary"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex cursor-pointer items-center gap-1 rounded-lg bg-workly-primary px-4 text-sm font-medium text-white transition hover:bg-workly-highlight"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {draftSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="flex items-center gap-2 rounded-full bg-[#C6C9FF] px-4 py-2 text-xs text-[#111111]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    aria-label={`Remove ${skill}`}
                    className="cursor-pointer text-gray-600 transition hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveSkills}
              className="mt-7 w-full cursor-pointer rounded-lg bg-workly-primary py-3 text-sm font-semibold text-white transition hover:bg-workly-highlight disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* EDIT PORTFOLIO MODAL */}
      {isEditingPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-workly-bg">
                Edit Portfolio
              </h2>

              <button
                type="button"
                onClick={() => setIsEditingPortfolio(false)}
                className="cursor-pointer text-gray-500 transition hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mb-5 space-y-2.5">
              <input
                type="text"
                value={newPortfolioTitle}
                onChange={(e) => setNewPortfolioTitle(e.target.value)}
                placeholder="Portfolio title (e.g. GitHub, Behance, Website)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-workly-primary"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPortfolioLink}
                  onChange={(e) => setNewPortfolioLink(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPortfolio();
                    }
                  }}
                  placeholder="https://..."
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-workly-primary"
                />

                <button
                  type="button"
                  onClick={addPortfolio}
                  className="flex cursor-pointer items-center gap-1 rounded-lg bg-workly-primary px-4 text-sm font-medium text-white transition hover:bg-workly-highlight"
                >
                  <Plus size={17} />
                  Add
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {draftPortfolios.length > 0 ? (
                draftPortfolios.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-[#F5F6FF] px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-workly-primary">
                        {item.link}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePortfolio(index)}
                      aria-label={`Remove ${item.title}`}
                      className="shrink-0 cursor-pointer text-gray-500 transition hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="py-3 text-center text-xs text-gray-500">
                  Belum ada portofolio di daftar ini.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSavePortfolio}
              className="mt-7 w-full cursor-pointer rounded-lg bg-workly-primary py-3 text-sm font-semibold text-white transition hover:bg-workly-highlight disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-sm text-[#666666]">{label}</p>
      <div className="text-[15px] font-medium leading-snug text-[#111111]">
        {value}
      </div>
    </div>
  );
}

function EditInput({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-workly-primary"
      />
    </div>
  );
}

export default Profile;
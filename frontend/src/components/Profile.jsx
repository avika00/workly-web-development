import { useState } from "react";
import {
  Camera,
  UserRound,
  X,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

function Profile() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Natasya Davia Tulip Pertiwi",
    username: "@natasya davia_",
    birth: "09-10-2006",
    education: "Bachelor of Information Systems",
    university: "State University of Surabaya",
    location: "Surabaya, Indonesia",
    phone: "+62 838-6904-3698",
    email: "natasya datuper@gmail.com",
    about:
      "Hi, I’m Natasya Davia Tulip Pertiwi, a Frontend Developer based in Surabaya, Indonesia. I hold a Bachelor’s degree in Information Systems from State University of Surabaya.",
    experience:
      "Worked as a Frontend Developer, building responsive and interactive web interfaces using HTML, CSS, JavaScript, and React. Collaborated with UI/UX designers and backend developers to implement designs, integrate features, fix interface issues, and improve website performance, accessibility, and overall user experience across different devices.",
  });

  const [skills, setSkills] = useState([
    "HTML",
    "CSS",
    "JavaScript",
    "React.js",
    "React",
    "Git",
    "Figma",
    "Debugging",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = () => {
    const value = newSkill.trim();

    if (value && !skills.some((skill) => skill.toLowerCase() === value.toLowerCase())) {
      setSkills((prev) => [...prev, value]);
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-[#010133]">
      {/* NAVBAR */}
      <div className="relative h-[126px] overflow-hidden bg-[#010133]">
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
        <div className="mx-auto grid w-full max-w-[1220px] grid-cols-1 items-stretch gap-7 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12">

          {/* LEFT CARD - PERSONAL INFORMATION */}
          <div className="rounded-[28px] border border-[#DADBE5] bg-white/55 px-7 py-9 shadow-[0_3px_10px_rgba(0,0,0,0.10)] sm:px-10">

            {/* PROFILE HEADER */}
            <div className="mb-8 flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative flex h-[110px] w-[110px] shrink-0 items-center justify-center rounded-full bg-[#D9DCFF] text-[#4E59FF]">
                <UserRound size={58} strokeWidth={1.5} />

                <button
                  type="button"
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-white transition hover:bg-[#4E59FF]"
                  onClick={() => alert("Fitur upload foto akan dihubungkan ke backend.")}
                >
                  <Camera size={16} />
                </button>
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <h1 className="text-lg font-bold leading-snug text-[#111111]">
                  {profile.fullName}
                </h1>

                <p className="mt-1 text-sm text-[#111111]">
                  {profile.username}
                </p>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="mt-3 rounded-lg border border-[#0010FF] px-6 py-1.5 text-[11px] font-medium text-[#0010FF] transition hover:bg-[#0010FF] hover:text-white"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* PERSONAL DETAILS */}
            <div className="space-y-4">
              <ProfileField label="Full Name" value={profile.fullName} />
              <ProfileField label="Username" value={profile.username} />
              <ProfileField label="Birth" value={profile.birth} />
              <ProfileField
                label="Latest Education"
                value={
                  <>
                    {profile.education}
                    <span className="mt-1 block text-sm font-normal">
                      {profile.university}
                    </span>
                  </>
                }
              />
              <ProfileField label="Location" value={profile.location} />
              <ProfileField label="Phone Number" value={profile.phone} />
              <ProfileField label="Email" value={profile.email} />
            </div>
          </div>

          {/* RIGHT CARD - ADDITIONAL INFORMATION */}
          <div className="rounded-[28px] border border-[#DADBE5] bg-white/55 px-7 py-9 shadow-[0_3px_10px_rgba(0,0,0,0.10)] sm:px-10">

            <h2 className="mb-4 text-lg font-bold text-[#111111]">
              Additional Information
            </h2>

            {/* ABOUT ME */}
            <div className="mb-5">
              <h3 className="mb-1 text-base font-semibold text-[#111111]">
                About Me
              </h3>

              <p className="text-justify text-sm leading-[1.55] text-[#222222]">
                {profile.about}
              </p>
            </div>

            {/* EXPERIENCE */}
            <div className="mb-5">
              <h3 className="mb-1 text-base font-semibold text-[#111111]">
                Experience
              </h3>

              <p className="text-justify text-sm leading-[1.55] text-[#222222]">
                {profile.experience}
              </p>
            </div>

            {/* SKILLS */}
            <div>
              <h3 className="mb-2 text-base font-semibold text-[#111111]">
                Skills
              </h3>

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
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditingSkills(true)}
                className="rounded-full border border-[#0010FF] px-9 py-2 text-xs font-medium text-[#0010FF] transition hover:bg-[#0010FF] hover:text-white"
              >
                Edit Skill
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mx-auto mt-6 w-full max-w-[1220px]">
          <PageFooter />
        </div>
      </section>

      {/* EDIT PROFILE MODAL */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-[550px] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#010133]">
                Edit Profile
              </h2>

              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="text-gray-500 transition hover:text-red-500"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <EditInput label="Full Name" name="fullName" value={profile.fullName} onChange={handleProfileChange} />
              <EditInput label="Username" name="username" value={profile.username} onChange={handleProfileChange} />
              <EditInput label="Birth" name="birth" value={profile.birth} onChange={handleProfileChange} />
              <EditInput label="Latest Education" name="education" value={profile.education} onChange={handleProfileChange} />
              <EditInput label="University" name="university" value={profile.university} onChange={handleProfileChange} />
              <EditInput label="Location" name="location" value={profile.location} onChange={handleProfileChange} />
              <EditInput label="Phone Number" name="phone" value={profile.phone} onChange={handleProfileChange} />
              <EditInput label="Email" name="email" value={profile.email} onChange={handleProfileChange} />

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  About Me
                </label>
                <textarea
                  name="about"
                  value={profile.about}
                  onChange={handleProfileChange}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0010FF]"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={profile.experience}
                  onChange={handleProfileChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0010FF]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0010FF] py-3 text-sm font-semibold text-white transition hover:bg-[#121984]"
            >
              <Save size={17} />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* EDIT SKILLS MODAL */}
      {isEditingSkills && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#010133]">
                Edit Skills
              </h2>

              <button
                type="button"
                onClick={() => setIsEditingSkills(false)}
                className="text-gray-500 transition hover:text-red-500"
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
                  if (e.key === "Enter") addSkill();
                }}
                placeholder="Add a new skill..."
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0010FF]"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex items-center gap-1 rounded-lg bg-[#0010FF] px-4 text-sm font-medium text-white transition hover:bg-[#121984]"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="flex items-center gap-2 rounded-full bg-[#C6C9FF] px-4 py-2 text-xs text-[#111111]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    aria-label={`Remove ${skill}`}
                    className="text-gray-600 transition hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsEditingSkills(false)}
              className="mt-7 w-full rounded-lg bg-[#0010FF] py-3 text-sm font-semibold text-white transition hover:bg-[#121984]"
            >
              Save Changes
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

function EditInput({ label, name, value, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#0010FF]"
      />
    </div>
  );
}

export default Profile;
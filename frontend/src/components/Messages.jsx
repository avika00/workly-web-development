import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Send,
  Search,
  MessageSquare,
  UserRound,
  ArrowLeft,
  CheckCheck,
  Briefcase,
} from "lucide-react";
import Navbar from "./Navbar";
import PageFooter from "./PageFooter";

const API_URL = "http://localhost:8000";

function Messages() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("workly_user") || "null");

  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAppId, setActiveAppId] = useState(
    applicationId ? Number(applicationId) : null
  );

  const [threadInfo, setThreadInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (applicationId) {
      setActiveAppId(Number(applicationId));
    }
  }, [applicationId]);

  // 1. Ambil daftar percakapan
  const fetchConversations = async (silent = false) => {
    if (!currentUser?.ID_USER) return;
    if (!silent) setLoadingList(true);

    try {
      const res = await fetch(
        `${API_URL}/messages/conversations.php?id_user=${currentUser.ID_USER}`
      );
      const result = await res.json();

      if (result.status && Array.isArray(result.conversations)) {
        setConversations(result.conversations);

        // Jika belum ada chat yang dipilih di desktop, pilih yang paling atas
        if (!applicationId && !activeAppId && result.conversations.length > 0) {
          setActiveAppId(result.conversations[0].applicationId);
        }
      }
    } catch (err) {
      console.error("Gagal memuat daftar pesan:", err);
    } finally {
      if (!silent) setLoadingList(false);
    }
  };

  // 2. Ambil isi chat untuk percakapan yang aktif
  const fetchMessages = async (appId, silent = false) => {
    if (!appId || !currentUser?.ID_USER) return;
    if (!silent) setLoadingChat(true);

    try {
      const res = await fetch(
        `${API_URL}/messages/read.php?id_application=${appId}&id_user=${currentUser.ID_USER}`
      );
      const result = await res.json();

      if (result.status) {
        setThreadInfo(result.thread);
        setMessages(result.messages || []);
      }
    } catch (err) {
      console.error("Gagal memuat isi chat:", err);
    } finally {
      if (!silent) setLoadingChat(false);
    }
  };

  useEffect(() => {
    if (!currentUser?.ID_USER) {
      navigate("/login");
      return;
    }
    fetchConversations();
  }, [currentUser?.ID_USER]);

  useEffect(() => {
    if (activeAppId) {
      fetchMessages(activeAppId);
    }
  }, [activeAppId]);

  // Auto-refresh setiap 3 detik agar terasa real-time
  useEffect(() => {
    if (!currentUser?.ID_USER) return;

    const interval = setInterval(() => {
      fetchConversations(true);
      if (activeAppId) {
        fetchMessages(activeAppId, true);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeAppId, currentUser?.ID_USER]);

  // Scroll otomatis ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !activeAppId || sending) return;

    setSending(true);
    setNewMessage("");

    try {
      const res = await fetch(`${API_URL}/messages/send.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_application: activeAppId,
          sender_id: currentUser.ID_USER,
          message: text,
        }),
      });
      const result = await res.json();

      if (result.status && result.message) {
        setMessages((prev) => [...prev, result.message]);
        fetchConversations(true);
      } else {
        alert(result.message || "Gagal mengirim pesan.");
      }
    } catch (err) {
      alert("Gagal terhubung ke server PHP.");
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((item) => {
    const kw = searchTerm.toLowerCase();
    return (
      item.partnerName.toLowerCase().includes(kw) ||
      item.jobTitle.toLowerCase().includes(kw) ||
      item.companyName.toLowerCase().includes(kw)
    );
  });

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010133] text-white">
      {/* Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/workly-glow.png'), url('/images/workly-glow.png')",
          backgroundPosition:
            "left -180px top -180px, right -180px bottom -180px",
          backgroundSize: "700px auto, 700px auto",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar isLoggedIn={true} />

        <section className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-6 pb-12 pt-[120px] sm:px-10 lg:px-[7%]">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight md:text-[36px]">
              Messages
            </h1>
            <p className="mt-2 text-sm text-white/75">
              Diskusikan detail pekerjaan langsung antara pembuat lowongan dan pelamar.
            </p>
          </div>

          {/* CHAT CONTAINER */}
          <div className="grid min-h-[560px] flex-1 grid-cols-1 overflow-hidden rounded-2xl border border-white/15 bg-[#101039]/85 shadow-2xl backdrop-blur-md lg:grid-cols-[360px_minmax(0,1fr)]">
            {/* LEFT SIDEBAR: CONVERSATION LIST */}
            <aside
              className={`flex flex-col border-b border-white/10 lg:border-b-0 lg:border-r ${
                activeAppId ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Search Box */}
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#0A0B2E] px-3.5 py-2.5">
                  <Search size={16} className="text-white/45" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama atau posisi job..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* Conversation Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                {loadingList ? (
                  <div className="py-12 text-center text-xs text-white/60">
                    Memuat percakapan...
                  </div>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => {
                    const isSelected = conv.applicationId === activeAppId;

                    return (
                      <button
                        key={conv.applicationId}
                        type="button"
                        onClick={() => {
                          setActiveAppId(conv.applicationId);
                          navigate(`/messages/${conv.applicationId}`, {
                            replace: true,
                          });
                        }}
                        className={`flex w-full items-start gap-3.5 px-4 py-4 text-left transition ${
                          isSelected
                            ? "bg-[#24287A]/80"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Partner Avatar */}
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#4E59FF]/50 bg-[#1B1E5C] text-[#9BA3FF]">
                          {conv.partnerPhoto ? (
                            <img
                              src={`${API_URL}/uploads/profiles/${conv.partnerPhoto}`}
                              alt={conv.partnerName}
                              className="size-full object-cover"
                            />
                          ) : (
                            <UserRound size={22} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-white">
                              {conv.partnerName}
                            </p>
                            {conv.lastTime && (
                              <span className="shrink-0 text-[10px] text-white/45">
                                {conv.lastTime}
                              </span>
                            )}
                          </div>

                          <p className="mt-0.5 truncate text-[11px] font-medium text-[#8992FF]">
                            {conv.jobTitle} · {conv.partnerRole}
                          </p>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="truncate text-xs text-white/60">
                              {conv.lastMessage}
                            </p>

                            {conv.unreadCount > 0 && (
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#0010FF] text-[10px] font-bold text-white">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-6 py-14 text-center">
                    <MessageSquare
                      size={32}
                      className="mx-auto text-white/30"
                    />
                    <p className="mt-3 text-sm font-semibold text-white/80">
                      Belum ada percakapan
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Percakapan otomatis tersedia setelah ada lamaran masuk atau saat kamu melamar lowongan.
                    </p>
                  </div>
                )}
              </div>
            </aside>

            {/* RIGHT PANEL: ACTIVE CHAT */}
            <div
              className={`flex flex-col ${
                !activeAppId ? "hidden lg:flex" : "flex"
              }`}
            >
              {!activeAppId || !threadInfo ? (
                <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-[#1A1E5A] text-[#8992FF]">
                    <MessageSquare size={30} />
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">
                    Pilih Percakapan
                  </h2>
                  <p className="mt-1 max-w-sm text-xs text-white/55">
                    Pilih salah satu kandidat atau pemilik lowongan di sebelah kiri untuk mulai berkirim pesan.
                  </p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#0D0F3A]/90 px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveAppId(null);
                          navigate("/messages", { replace: true });
                        }}
                        className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 lg:hidden"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#4E59FF]/50 bg-[#1B1E5C] text-[#9BA3FF]">
                        {threadInfo.partnerPhoto ? (
                          <img
                            src={`${API_URL}/uploads/profiles/${threadInfo.partnerPhoto}`}
                            alt={threadInfo.partnerName}
                            className="size-full object-cover"
                          />
                        ) : (
                          <UserRound size={20} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-base font-bold text-white">
                            {threadInfo.partnerName}
                          </h2>
                          <span className="rounded-full bg-[#24287A] px-2.5 py-0.5 text-[10px] font-medium text-[#B8C0FF]">
                            {threadInfo.partnerRole}
                          </span>
                        </div>

                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-white/65">
                          <Briefcase size={12} className="shrink-0 text-[#8992FF]" />
                          {threadInfo.jobTitle} · {threadInfo.companyName}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          threadInfo.isOwner
                            ? `/post-job/${threadInfo.jobId}/applicant/${threadInfo.applicationId}`
                            : `/jobs/${threadInfo.jobId}`
                        )
                      }
                      className="shrink-0 rounded-xl border border-white/20 px-3.5 py-2 text-xs font-medium text-white transition hover:border-[#4E59FF] hover:bg-[#1B2066]"
                    >
                      {threadInfo.isOwner ? "Lihat Profil Pelamar" : "Lihat Lowongan"}
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 space-y-3 overflow-y-auto bg-[#080929]/60 p-5 sm:p-6">
                    {loadingChat ? (
                      <div className="py-12 text-center text-xs text-white/60">
                        Memuat riwayat pesan...
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-md sm:max-w-[65%] ${
                              msg.isMine
                                ? "rounded-br-sm bg-[#0010FF] text-white"
                                : "rounded-bl-sm border border-white/10 bg-[#181B54] text-white/95"
                            }`}
                          >
                            <p className="whitespace-pre-line break-words leading-relaxed">
                              {msg.text}
                            </p>

                            <div
                              className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                                msg.isMine ? "text-white/75" : "text-white/45"
                              }`}
                            >
                              <span>{msg.time}</span>
                              {msg.isMine && <CheckCheck size={13} />}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full min-h-[260px] flex-col items-center justify-center text-center">
                        <p className="text-sm font-medium text-white/75">
                          Belum ada pesan di ruang obrolan ini.
                        </p>
                        <p className="mt-1 text-xs text-white/45">
                          Kirim pesan pertama untuk menyapa {threadInfo.partnerName}!
                        </p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input Bar */}
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-3 border-t border-white/10 bg-[#0D0F3A]/90 p-4"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tulis pesan..."
                      className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#070826] px-4 py-3 text-sm text-white outline-none transition focus:border-[#2865F5] placeholder:text-white/40"
                    />

                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="flex items-center gap-2 rounded-xl bg-[#0010FF] px-5 py-3 text-xs font-semibold text-white transition hover:bg-[#2638FF] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Send size={16} />
                      <span className="hidden sm:inline">Kirim</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>

        <PageFooter />
      </div>
    </main>
  );
}

export default Messages;
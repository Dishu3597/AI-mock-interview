import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
 
const jobRoles = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "Machine Learning Engineer",
  "Product Manager", "UI/UX Designer", "DevOps Engineer",
  "System Design Architect", "Business Analyst", "Cloud Engineer",
];
 
export default function MockInterviewDashboard() {

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userName = user.name || "User";

  const navigate = useNavigate();
  const handleLogout = () => {
  // Remove stored data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Redirect to login page
  navigate("/login");
};
  const handleStartInterview = async () => {

    try {

      const token = localStorage.getItem("token");
      console.log("JWT Token:", token);

      const response = await axios.post(
    `${API_URL}/api/interview`,
        {
          role: role,
          experience: exp,
          difficulty: "Medium",      // Change later if you add a selector
          mode: mode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/interview", {
        state: {
          questions: response.data.questions,
          interviewId: response.data.interview_id,
          role: role
        }
      });

    } catch (error) {
    console.error("Full Error:", error);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);
    } else if (error.request) {
        console.log("No response received:", error.request);
    } else {
        console.log("Error:", error.message);
    }

    alert("Unable to start interview.");
}
  };
  const fetchSessions = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://127.0.0.1:5000/api/interviews",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setSessions(response.data);

  } catch (error) {
    console.error("Unable to fetch interview history", error);
  }
};
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [mode, setMode] = useState("technical");

  const [sessions, setSessions] = useState([]);
  const [started, setStarted] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
useEffect(() => {

  const handler = () => setIsMobile(window.innerWidth < 768);

  window.addEventListener("resize", handler);

  fetchSessions();

  return () => window.removeEventListener("resize", handler);

}, []);
 
  const canStart = role && exp;
 
  const navItems = {
  dashboard: [
    { id: "logout", label: "Log out", icon: "↩" },
  ],
};
 
const goto = (id) => {

  setMenuOpen(false);

  if (id === "dashboard") {
    navigate("/");
  }

  else if (id === "profile") {
    navigate("/profile");      // We'll create this later
  }

  else if (id === "logout") {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }
};
 
  /* ── Shared Nav ────────────────────────────────────── */
  const Nav = () => (
    <nav style={{ ...s.nav, padding: isMobile ? "0 1rem" : "0 2rem" }}>
      <div style={s.navLogo}>
        <span style={s.logoMark}>◈</span>
        <span style={s.logoText}>PrepInterview</span>
      </div>
 
      <div
  style={s.avatarWrap}
  onClick={() => setMenuOpen(!menuOpen)}
>
        <div style={{ ...s.avatar, ...(menuOpen ? s.avatarActive : {}) }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        {menuOpen && (
          <div style={s.dropMenu}>
            <div style={s.dropHeader}>
                <span style={s.dropName}>{user.name}</span>

                <span style={s.dropRole}>
                    {user.email}
                </span>
            </div>
            <div style={s.dropDivider} />
            {(navItems[page] || []).map((item) => (
              <button key={item.id} style={s.dropItem} onClick={() => goto(item.id)}>
                <span style={s.dropIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
 
  /* ── Profile page ──────────────────────────────────── */
  if (page === "profile") {
    return (
      <div style={s.page}>
        <style>{css}</style>
        <Nav />
        <div style={s.profileWrap}>
          <div style={s.profileHead}>
            <div style={s.profileAvatar}>{userName.charAt(0).toUpperCase()}</div>
            <div>
              <h1 style={s.profileName}>{userName}</h1>
              <p style={s.profileSub}>Candidate · PrepInterview</p>
            </div>
          </div>
          <h2 style={s.sectionTitle}>Past Sessions</h2>
          {sessions.length === 0 ? (
            <div style={s.emptyBox}>
              <span style={s.emptyIcon}>📋</span>
              <p style={s.emptyText}>No sessions yet. Complete an interview to see your history here.</p>
              <button style={s.emptyBtn} onClick={() => goto("dashboard")}>Go to Dashboard →</button>
            </div>
          ) : (
            <div style={s.sessionList}>
              {sessions.map((sess, i) => (
                <div key={i} style={s.sessionCard}>
                  <div style={s.sessionInfo}>
                    <div style={s.sessionRole}>{sess.role}</div>
                    <div style={s.sessionMeta}>{sess.date} · {sess.duration}</div>
                  </div>
                  <div style={s.sessionScore(sess.score)}>{sess.score}</div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
 
  /* ── Interview starting ────────────────────────────── */
  if (started) {
    return (
      <div style={s.page}>
        <style>{css}</style>
        <Nav />
        <div style={s.startWrap}>
          <div style={s.startIcon}>🎙</div>
          <h1 style={s.startTitle}>Interview starting…</h1>
          <p style={s.startSub}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)} · <strong>{role}</strong> · {exp} yr{exp !== "1" ? "s" : ""} exp
          </p>
          <div style={s.dotRow}>
            <span className="dot" style={{ animationDelay: "0s" }} />
            <span className="dot" style={{ animationDelay: "0.2s" }} />
            <span className="dot" style={{ animationDelay: "0.4s" }} />
          </div>
          <button style={s.backBtn} onClick={() => setStarted(false)}>← Back to dashboard</button>
        </div>
      </div>
    );
  }
 
  /* ── Main dashboard ────────────────────────────────── */
  return (
    <div style={s.page}>
      <style>{css}</style>
      <Nav />
 
      <main style={{ ...s.main, gridTemplateColumns: isMobile ? "1fr" : "1fr 400px", padding: isMobile ? "1.25rem 1rem" : "2rem 1.5rem" }}>
        {/* Left col */}
        <div style={s.left}>
          {/* Welcome banner */}
          <div style={s.welcomeCard}>
            <div style={s.welcomeInner}>
              <p style={s.welcomeEyebrow}>AI MOCK INTERVIEW</p>
              <h1 style={{ ...s.welcomeTitle, fontSize: isMobile ? "22px" : "28px" }}>
                Welcome, <span style={s.welcomeAccent}>{userName}</span>
              </h1>
              <p style={s.welcomeSub}>
                Your AI-powered interviewer is ready. Configure your session {isMobile ? "below" : "on the right"} and hit Start.
              </p>
            </div>
            {!isMobile && <div style={s.welcomeDecor}>🎯</div>}
        </div>
        </div>
 
          {/* Recent sessions on dashboard (compact) */}
         <div style={s.recentBox}>
  <p style={s.recentLabel}>RECENT SESSIONS</p>

  {sessions.length === 0 ? (

    <p style={s.recentEmpty}>
      No interview sessions yet — start your first interview!
    </p>

  ) : (

    <div style={s.sessionList}>

      {sessions.slice(0, 3).map((sess) => (

        <div key={sess.id} style={s.sessionCard}>

          <div style={s.sessionInfo}>

            <div style={s.sessionRole}>
              {sess.role}
            </div>

            <div style={s.sessionMeta}>
              {sess.experience} • {sess.mode}
            </div>

            <div style={s.sessionMeta}>
              {sess.difficulty}
            </div>

            <div style={s.sessionMeta}>
              {sess.created_at}
            </div>

          </div>

          <div
            style={{
              ...s.sessionScore,
              background:
                sess.score >= 80
                  ? "#d1fae5"
                  : sess.score >= 60
                  ? "#fef3c7"
                  : "#fee2e2",
              color:
                sess.score >= 80
                  ? "#065f46"
                  : sess.score >= 60
                  ? "#92400e"
                  : "#991b1b"
            }}
          >
            {sess.score}/100
          </div>

          

        </div>

      ))}

    </div>

  )}
</div>
 
        {/* Right col — config */}
        <div style={s.right}>
          <div style={{ ...s.configCard, position: isMobile ? "static" : "sticky" }}>
            <div style={s.configHead}>
              <span style={s.configEyebrow}>NEW SESSION</span>
              <h2 style={s.configTitle}>Configure your interview</h2>
            </div>
 
            <div style={s.configBody}>
              {/* Role */}
              <div style={s.field}>
                <label style={s.label}>Select job role</label>
                <div style={{ position: "relative" }}>
                  <button
                    style={{ ...s.select, ...(roleOpen ? s.selectOpen : {}) }}
                    onClick={() => setRoleOpen(!roleOpen)}
                  >
                    <span style={role ? s.selectFilled : s.selectPlaceholder}>
                      {role || "Choose a role…"}
                    </span>
                    <span style={{ ...s.chevron, transform: roleOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>
                  {roleOpen && (
                    <div style={s.selectMenu}>
                      {jobRoles.map((r) => (
                        <div
                          key={r}
                          style={{ ...s.selectItem, ...(role === r ? s.selectItemActive : {}) }}
                          onClick={() => { setRole(r); setRoleOpen(false); }}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
 
              {/* Experience */}
              <div style={s.field}>
                <label style={s.label}>Years of experience</label>
                <div style={{ ...s.expGrid, gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(3, 1fr)" }}>
                  {["0", "1", "2", "3", "4", "5+"].map((y) => (
                    <button
                      key={y}
                      style={{ ...s.expBtn, ...(exp === y ? s.expBtnActive : {}) }}
                      onClick={() => setExp(y)}
                    >
                      {y === "0" ? "Fresher" : y === "5+" ? "5+ yrs" : `${y} yr${y !== "1" ? "s" : ""}`}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Mode */}
              <div style={s.field}>
                <label style={s.label}>Interview mode</label>
                <div style={s.modeRow}>
                  {[
                    { id: "technical",  label: "Technical",  icon: "💻" },
                    { id: "behavioral", label: "Behavioral", icon: "🗣" },
                    { id: "mixed",      label: "Mixed",      icon: "⚡" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      style={{ ...s.modeBtn, ...(mode === m.id ? s.modeBtnActive : {}) }}
                      onClick={() => setMode(m.id)}
                    >
                      <span style={s.modeIcon}>{m.icon}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Difficulty */}
              <div style={s.field}>
                <label style={s.label}>
                  Difficulty {exp && <span style={s.autoTag}>auto-set</span>}
                </label>
                <div style={s.diffBar}>
                  {["Easy", "Medium", "Hard"].map((d, i) => {
                    const auto = !exp ? -1 : exp === "0" ? 0 : exp === "1" || exp === "2" ? 1 : 2;
                    return (
                      <div key={d} style={{ ...s.diffSeg, ...(i === auto ? s.diffActive : {}) }}>
                        {d}
                      </div>
                    );
                  })}
                </div>
              </div>
 
              {/* CTA */}
              <button
                  type="button"
                  style={{
                    ...s.cta,
                    ...(!canStart ? s.ctaOff : {})
                  }}
                  disabled={!canStart}
                  onClick={handleStartInterview}
                >
                  {canStart ? (
                    <>
                      <span>Start Interview</span>
                      <span style={{ marginLeft: "8px" }}>→</span>
                    </>
                  ) : (
                    "Select role & experience to begin"
                  )}
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
 
const s = {
  page: {
    minHeight: "100vh",
    background: "#f5f4f0",
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: "#1a1a1a",
  },
 
  /* Nav */
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 2rem", height: "62px",
    background: "#ffffff",
    borderBottom: "1px solid #ebebeb",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "9px" },
  logoMark: { fontSize: "20px", color: "#6c5ce7" },
  logoText: { fontSize: "16px", fontWeight: "750", letterSpacing: "-0.4px", color: "#111" },
  avatarWrap: { position: "relative" },
  avatar: {
    width: "36px", height: "36px", borderRadius: "50%",
    background: "linear-gradient(135deg, #6c5ce7, #4834d4)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: "700", cursor: "pointer",
    border: "2px solid transparent", transition: "border-color 0.2s, box-shadow 0.2s",
  },
  avatarActive: { borderColor: "#6c5ce7", boxShadow: "0 0 0 3px rgba(108,92,231,0.15)" },
  dropMenu: {
    position: "absolute", top: "calc(100% + 10px)", right: 0,
    background: "#fff", border: "1px solid #ebebeb",
    borderRadius: "12px", minWidth: "175px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    overflow: "hidden", zIndex: 200,
  },
  dropHeader: { padding: "12px 14px 10px" },
  dropName: { display: "block", fontSize: "13px", fontWeight: "650", color: "#111" },
  dropRole: { display: "block", fontSize: "11px", color: "#aaa", marginTop: "2px" },
  dropDivider: { height: "1px", background: "#f0f0f0" },
  dropItem: {
    width: "100%", display: "flex", alignItems: "center", gap: "9px",
    padding: "10px 14px", background: "none", border: "none",
    fontSize: "13px", color: "#444", cursor: "pointer", textAlign: "left",
    transition: "background 0.12s",
  },
  dropIcon: { fontSize: "13px", width: "16px", textAlign: "center" },
 
  /* Layout */
  main: {
    maxWidth: "1080px", margin: "0 auto", padding: "2rem 1.5rem",
    display: "grid", gridTemplateColumns: "1fr 400px", gap: "1.5rem", alignItems: "start",
  },
  left: { display: "flex", flexDirection: "column", gap: "1.25rem" },
  right: {},
 
  /* Welcome */
  welcomeCard: {
    background: "linear-gradient(135deg, #1e1248 0%, #2d1b69 50%, #1a2a6c 100%)",
    borderRadius: "16px", padding: "2rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    minHeight: "160px",
  },
  welcomeInner: { flex: 1 },
  welcomeEyebrow: {
    margin: "0 0 8px", fontSize: "10px", fontWeight: "700",
    letterSpacing: "1.5px", color: "#a78bfa",
  },
  welcomeTitle: {
    fontSize: "28px", fontWeight: "750", margin: "0 0 8px",
    color: "#fff", lineHeight: 1.2, letterSpacing: "-0.5px",
  },
  welcomeAccent: { color: "#c4b5fd" },
  welcomeSub: { margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.65" },
  welcomeDecor: { fontSize: "52px", marginLeft: "1.5rem", opacity: 0.9 },
 
  /* Recent box */
  recentBox: {
    background: "#fff", borderRadius: "14px",
    border: "1px solid #ebebeb", padding: "1.25rem 1.5rem",
  },
  recentLabel: {
    fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px",
    color: "#b0b0b8", margin: "0 0 12px",
  },
  recentEmpty: { fontSize: "13px", color: "#c0c0c8", margin: 0 },
  sessionList: { display: "flex", flexDirection: "column", gap: "8px" },
  sessionCard: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "10px 12px", borderRadius: "10px",
    border: "1px solid #f0f0f0", background: "#fafafa",
  },
  sessionInfo: { flex: 1 },
  sessionRole: { fontSize: "13px", fontWeight: "600", color: "#1a1a1a" },
  sessionMeta: { fontSize: "11px", color: "#aaa", marginTop: "2px" },
  sessionScore: (score) => ({
    fontSize: "15px", fontWeight: "700", minWidth: "32px", textAlign: "center",
    color: score >= 85 ? "#22c55e" : score >= 65 ? "#f59e0b" : "#ef4444",
  }),
  reviewBtn: {
    fontSize: "11px", color: "#6c5ce7", background: "#ede9fe",
    border: "none", borderRadius: "7px", padding: "5px 11px", cursor: "pointer", fontWeight: "600",
  },
 
  /* Config card */
  configCard: {
    background: "#fff", borderRadius: "16px",
    border: "1px solid #ebebeb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    position: "sticky", top: "78px", overflow: "hidden",
  },
  configHead: {
    padding: "1.4rem 1.6rem 1.1rem",
    borderBottom: "1px solid #f0f0f0",
  },
  configEyebrow: {
    display: "block", fontSize: "10px", fontWeight: "700",
    letterSpacing: "1.5px", color: "#b0b0b8", marginBottom: "4px",
  },
  configTitle: { fontSize: "18px", fontWeight: "700", margin: 0, color: "#111", letterSpacing: "-0.3px" },
  configBody: { padding: "1.4rem 1.6rem", display: "flex", flexDirection: "column", gap: "1.2rem" },
 
  field: { display: "flex", flexDirection: "column", gap: "7px" },
  label: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "11px", fontWeight: "650", letterSpacing: "0.3px",
    textTransform: "uppercase", color: "#888",
  },
  autoTag: {
    fontSize: "9px", fontWeight: "700", background: "#f0fdf4",
    color: "#16a34a", padding: "2px 8px", borderRadius: "20px", letterSpacing: "0.5px",
  },
 
  select: {
    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 13px", border: "1.5px solid #e8e8e8", borderRadius: "10px",
    background: "#fff", cursor: "pointer", fontSize: "13px", transition: "border-color 0.15s",
  },
  selectOpen: { borderColor: "#6c5ce7" },
  selectFilled: { color: "#111", fontWeight: "500" },
  selectPlaceholder: { color: "#bbb" },
  chevron: { color: "#bbb", fontSize: "11px", transition: "transform 0.2s" },
  selectMenu: {
    position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
    background: "#fff", border: "1.5px solid #e8e8e8", borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 100, maxHeight: "190px", overflowY: "auto",
  },
  selectItem: { padding: "9px 13px", fontSize: "13px", cursor: "pointer", color: "#333", transition: "background 0.1s" },
  selectItemActive: { background: "#ede9fe", color: "#5b21b6", fontWeight: "500" },
 
  expGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "7px" },
  expBtn: {
    padding: "8px 4px", border: "1.5px solid #e8e8e8", borderRadius: "9px",
    background: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: "500",
    color: "#888", transition: "all 0.15s",
  },
  expBtnActive: { background: "#ede9fe", borderColor: "#7c3aed", color: "#5b21b6" },
 
  modeRow: { display: "flex", gap: "7px" },
  modeBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
    padding: "9px 4px", border: "1.5px solid #e8e8e8", borderRadius: "10px",
    background: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: "500",
    color: "#888", transition: "all 0.15s",
  },
  modeBtnActive: { background: "#ede9fe", borderColor: "#7c3aed", color: "#5b21b6" },
  modeIcon: { fontSize: "17px" },
 
  diffBar: { display: "flex", gap: "6px" },
  diffSeg: {
    flex: 1, textAlign: "center", padding: "8px",
    borderRadius: "8px", fontSize: "11px", fontWeight: "500",
    background: "#f5f4f0", color: "#c0c0c0",
    border: "1.5px solid transparent",
  },
  diffActive: { background: "#ede9fe", color: "#5b21b6", border: "1.5px solid #c4b5fd" },
 
  cta: {
    width: "100%", padding: "13px",
    background: "linear-gradient(135deg, #6c5ce7, #4834d4)",
    color: "#fff", border: "none", borderRadius: "11px",
    fontSize: "14px", fontWeight: "650", cursor: "pointer",
    letterSpacing: "-0.1px", transition: "opacity 0.2s",
  },
  ctaOff: { background: "#ebebeb", color: "#bbb", cursor: "not-allowed" },
 
  /* Profile */
  profileWrap: { maxWidth: "700px", margin: "0 auto", padding: "2.5rem 1.5rem" },
  profileHead: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" },
  profileAvatar: {
    width: "54px", height: "54px", borderRadius: "50%",
    background: "linear-gradient(135deg, #6c5ce7, #4834d4)",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px", fontWeight: "700",
  },
  profileName: { fontSize: "22px", fontWeight: "750", margin: "0 0 3px", color: "#111", letterSpacing: "-0.4px" },
  profileSub: { margin: 0, fontSize: "13px", color: "#aaa" },
  sectionTitle: { fontSize: "15px", fontWeight: "700", margin: "0 0 12px", color: "#111" },
  emptyBox: {
    background: "#fff", border: "1px dashed #e0e0e0",
    borderRadius: "12px", padding: "2.5rem", textAlign: "center",
  },
  emptyIcon: { fontSize: "28px", display: "block", marginBottom: "10px" },
  emptyText: { fontSize: "13px", color: "#aaa", margin: "0 0 1rem", lineHeight: "1.6" },
  emptyBtn: {
    background: "none", border: "1px solid #d8d0f7",
    borderRadius: "8px", padding: "8px 16px",
    fontSize: "13px", color: "#6c5ce7", cursor: "pointer",
  },
 
  /* Starting */
  startWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", minHeight: "80vh", gap: "14px",
  },
  startIcon: { fontSize: "52px", marginBottom: "6px" },
  startTitle: { fontSize: "26px", fontWeight: "750", margin: 0, color: "#111", letterSpacing: "-0.5px" },
  startSub: { fontSize: "14px", color: "#888", margin: 0 },
  dotRow: { display: "flex", gap: "8px", margin: "6px 0" },
  backBtn: {
    marginTop: "8px", background: "none",
    border: "1px solid #e0e0e0", borderRadius: "8px",
    padding: "8px 20px", fontSize: "13px", color: "#888", cursor: "pointer",
  },
};
 
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #6c5ce7; display: inline-block; animation: bounce 0.8s ease-in-out infinite; }
@keyframes bounce { 0%,100% { transform: translateY(0); opacity: 0.35; } 50% { transform: translateY(-6px); opacity: 1; } }
button:focus { outline: none; }
@media (max-width: 768px) {
  .nav-logo-text { font-size: 14px !important; }
}
`;
 
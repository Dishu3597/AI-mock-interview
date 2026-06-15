import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
 
const TOTAL_TIME = 90; // 1.5 minutes in seconds
 
export default function Interview() {

  const location = useLocation();
  const navigate = useNavigate();

  const {
    questions = [],
    interviewId,
    role = "Software Engineer"
  } = location.state || {};

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const userName = user.name || "User";
const onFinish = async () => {
    try {
        const token = localStorage.getItem("token");

        await axios.post(
            "http://127.0.0.1:5000/api/interview/evaluate",
            {
                interview_id: interviewId,
                role,
                questions,
                answers: answers.map(a => a.answer)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        navigate("/");

    } catch (err) {
        console.error(err);
    }
};
  const totalQ = questions.length || 1;
 
  const [current, setCurrent]   = useState(0);
  const [answer, setAnswer]     = useState("");
  const [answers, setAnswers]   = useState([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [finished, setFinished] = useState(false);
  const [skipped, setSkipped]   = useState(false);
 
  const timerRef   = useRef(null);
  const textareaRef = useRef(null);
 
  /* responsive */
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
 
  /* timer — resets every question */
  useEffect(() => {
    setTimeLeft(TOTAL_TIME);
    setSkipped(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAutoNext();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    if (textareaRef.current) textareaRef.current.focus();
    return () => clearInterval(timerRef.current);
  }, [current]);
 
  const handleAutoNext = () => {
    setSkipped(true);
    setTimeout(() => submitAnswer(true), 800);
  };
 
 const submitAnswer = async (auto = false) => {

  clearInterval(timerRef.current);

  const saved = [
    ...answers,
    {
      question: questions[current] || `Question ${current + 1}`,
      answer,
      auto
    }
  ];

  setAnswers(saved);
  setAnswer("");

  if (current + 1 >= totalQ) {

    await onFinish(saved);     // Evaluate interview first

    setFinished(true);         // Then show completion screen

  } else {

    setCurrent((c) => c + 1);

  }

};
 
  /* timer ring */
  const radius   = 20;
  const circ     = 2 * Math.PI * radius;
  const progress = timeLeft / TOTAL_TIME;
  const dash     = progress * circ;
  const timerColor = timeLeft > 45 ? "#22c55e" : timeLeft > 20 ? "#f59e0b" : "#ef4444";
 
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
 
  /* ── Nav ─────────────────────────────────────────────── */
const Nav = () => (
  <nav style={{ ...s.nav, padding: isMobile ? "0 1rem" : "0 2rem" }}>

    <div style={s.navLogo}>
      <span style={s.logoMark}>◈</span>
      <span style={s.logoText}>PrepInterview</span>
    </div>

    <div style={s.navMeta}>
      <span style={s.navRole}>{role}</span>
    </div>

    <div style={s.avatarWrap}>

      <div
        style={{
          ...s.avatar,
          ...(menuOpen ? s.avatarActive : {})
        }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {userName.charAt(0).toUpperCase()}
      </div>

      {menuOpen && (

        <div style={s.dropMenu}>

          <div style={s.dropHeader}>
            <span style={s.dropName}>
              {user.name || userName}
            </span>

            <span style={s.dropRole}>
              {user.email || "Interview Candidate"}
            </span>
          </div>

          <div style={s.dropDivider} />

          <button
            style={s.dropItem}
            onClick={() => {

              clearInterval(timerRef.current);

              setMenuOpen(false);

              onFinish(answers);

            }}
          >
            <span style={s.dropIcon}>✕</span>
            End Interview
          </button>

        </div>

      )}

    </div>

  </nav>
);
 
  /* ── Finished screen ─────────────────────────────────── */
  if (finished) {
    return (
      <div style={s.page}>
        <style>{css}</style>
        <Nav />
        <div style={s.finishedWrap}>
          <div style={s.finishedCard}>
            <div style={s.finishedIcon}>🎉</div>
            <h1 style={s.finishedTitle}>Interview Complete</h1>
            <p style={s.finishedSub}>You answered {answers.filter(a => !a.auto).length} of {totalQ} questions.</p>
            <div style={s.finishedStats}>
              <div style={s.stat}>
                <span style={s.statNum}>{totalQ}</span>
                <span style={s.statLabel}>Questions</span>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <span style={s.statNum}>{answers.filter(a => !a.auto).length}</span>
                <span style={s.statLabel}>Answered</span>
              </div>
              <div style={s.statDivider} />
              <div style={s.stat}>
                <span style={s.statNum}>{answers.filter(a => a.auto).length}</span>
                <span style={s.statLabel}>Skipped</span>
              </div>
            </div>
            <p style={s.finishedNote}>Your responses are being evaluated. Results will appear on dashboard.</p>
            <button
              onClick={onFinish}
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      </div>
    );
  }
 
  /* ── Interview page ──────────────────────────────────── */
  return (
    <div style={s.page}>
      <style>{css}</style>
      <Nav />
 
      <main style={{ ...s.main, padding: isMobile ? "1.25rem 1rem" : "2rem 1.5rem" }}>
 
        {/* Progress bar */}
        <div style={s.progressWrap}>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${((current) / totalQ) * 100}%` }} />
          </div>
          <span style={s.progressText}>{current + 1} / {totalQ}</span>
        </div>
 
        <div style={{ ...s.layout, flexDirection: isMobile ? "column" : "row" }}>
 
          {/* Left — question panel */}
          <div style={s.questionPanel}>
            <div style={s.questionCard}>
 
              {/* Header row */}
              <div style={s.qCardTop}>
                <div style={s.qBadge}>Q{current + 1}</div>
                {/* Timer ring */}
                <div style={s.timerWrap}>
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="4" />
                    <circle
                      cx="26" cy="26" r={radius}
                      fill="none" stroke={timerColor} strokeWidth="4"
                      strokeDasharray={`${dash} ${circ}`}
                      strokeLinecap="round"
                      transform="rotate(-90 26 26)"
                      style={{ transition: "stroke-dasharray 0.5s linear, stroke 0.3s" }}
                    />
                  </svg>
                  <span style={{ ...s.timerText, color: timerColor }}>{mins}:{secs}</span>
                </div>
              </div>
 
              {/* Question */}
              <p style={s.questionText}>
                {questions[current] || `This is a placeholder for question ${current + 1}. Your actual questions will appear here based on the selected role and experience.`}
              </p>
 
              {skipped && (
                <div style={s.timesUpBanner}>⏰ Time's up — moving to next question</div>
              )}
            </div>
 
            {/* Question nav dots */}
            <div style={s.dotNav}>
              {Array.from({ length: totalQ }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...s.navDot,
                    ...(i < current ? s.navDotDone : {}),
                    ...(i === current ? s.navDotActive : {}),
                  }}
                />
              ))}
            </div>
          </div>
 
          {/* Right — answer panel */}
          <div style={s.answerPanel}>
            <div style={s.answerCard}>
              <div style={s.answerTop}>
                <span style={s.answerLabel}>Your Answer</span>
                <span style={s.charCount}>{answer.length} chars</span>
              </div>
              <textarea
                ref={textareaRef}
                style={s.textarea}
                placeholder="Type your answer here…"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={isMobile ? 6 : 10}
              />
              <div style={s.answerActions}>
                <button
                  style={s.skipBtn}
                  onClick={() => submitAnswer(true)}
                >
                  Skip →
                </button>
                <button
                  style={{ ...s.submitBtn, ...(!answer.trim() ? s.submitBtnOff : {}) }}
                  disabled={!answer.trim()}
                  onClick={() => submitAnswer(false)}
                >
                  {current + 1 === totalQ ? "Finish Interview ✓" : "Next Question →"}
                </button>
              </div>
            </div>
          </div>
 
        </div>
      </main>
    </div>
  );
}
 
/* ── Styles ──────────────────────────────────────────── */
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
    height: "62px",
    background: "#ffffff",
    borderBottom: "1px solid #ebebeb",
    position: "sticky", top: 0, zIndex: 100,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: "9px" },
  logoMark: { fontSize: "20px", color: "#6c5ce7" },
  logoText: { fontSize: "16px", fontWeight: "750", letterSpacing: "-0.4px", color: "#111" },
  navMeta: { flex: 1, display: "flex", justifyContent: "center" },
  navRole: {
    fontSize: "12px", fontWeight: "600",
    color: "#6c5ce7", background: "#ede9fe",
    padding: "4px 12px", borderRadius: "20px", letterSpacing: "0.1px",
  },
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
    borderRadius: "12px", minWidth: "170px",
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
    fontSize: "13px", color: "#ef4444", cursor: "pointer", textAlign: "left",
  },
  dropIcon: { fontSize: "12px", width: "16px", textAlign: "center" },
 
  /* Main */
  main: { maxWidth: "1080px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" },
 
  /* Progress */
  progressWrap: { display: "flex", alignItems: "center", gap: "12px" },
  progressTrack: {
    flex: 1, height: "5px", background: "#e8e8e8", borderRadius: "10px", overflow: "hidden",
  },
  progressFill: {
    height: "100%", background: "linear-gradient(90deg, #6c5ce7, #4834d4)",
    borderRadius: "10px", transition: "width 0.4s ease",
  },
  progressText: { fontSize: "12px", fontWeight: "600", color: "#888", whiteSpace: "nowrap" },
 
  /* Layout */
  layout: { display: "flex", gap: "1.25rem", alignItems: "flex-start" },
 
  /* Question panel */
  questionPanel: { flex: "0 0 420px", display: "flex", flexDirection: "column", gap: "12px" },
  questionCard: {
    background: "#fff", borderRadius: "16px",
    border: "1px solid #ebebeb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    padding: "1.5rem",
  },
  qCardTop: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" },
  qBadge: {
    fontSize: "11px", fontWeight: "700", letterSpacing: "1px",
    background: "#ede9fe", color: "#5b21b6",
    padding: "4px 12px", borderRadius: "20px",
  },
  timerWrap: { position: "relative", width: "52px", height: "52px" },
  timerText: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "11px", fontWeight: "700", letterSpacing: "-0.3px",
  },
  questionText: {
    fontSize: "16px", lineHeight: "1.7", color: "#1a1a1a",
    fontWeight: "400", margin: 0,
  },
  timesUpBanner: {
    marginTop: "14px", padding: "10px 14px",
    background: "#fff7ed", border: "1px solid #fed7aa",
    borderRadius: "9px", fontSize: "12px", fontWeight: "500", color: "#c2410c",
  },
 
  /* Dot nav */
  dotNav: { display: "flex", gap: "6px", flexWrap: "wrap" },
  navDot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "#e0e0e0", transition: "all 0.2s",
  },
  navDotDone: { background: "#6c5ce7" },
  navDotActive: { background: "#6c5ce7", transform: "scale(1.4)", boxShadow: "0 0 0 3px rgba(108,92,231,0.2)" },
 
  /* Answer panel */
  answerPanel: { flex: 1 },
  answerCard: {
    background: "#fff", borderRadius: "16px",
    border: "1px solid #ebebeb",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    padding: "1.5rem",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  answerTop: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  answerLabel: { fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "#888" },
  charCount: { fontSize: "11px", color: "#c0c0c0", fontWeight: "500" },
  textarea: {
    width: "100%", border: "1.5px solid #e8e8e8", borderRadius: "10px",
    padding: "12px 14px", fontSize: "14px", lineHeight: "1.7",
    color: "#1a1a1a", background: "#fafafa",
    resize: "vertical", fontFamily: "'Inter', -apple-system, sans-serif",
    outline: "none", transition: "border-color 0.15s",
    minHeight: "220px",
  },
  answerActions: { display: "flex", gap: "10px", justifyContent: "flex-end" },
  skipBtn: {
    padding: "11px 20px", border: "1.5px solid #e8e8e8", borderRadius: "10px",
    background: "#fff", fontSize: "13px", fontWeight: "600", color: "#888",
    cursor: "pointer", transition: "all 0.15s",
  },
  submitBtn: {
    padding: "11px 24px",
    background: "linear-gradient(135deg, #6c5ce7, #4834d4)",
    color: "#fff", border: "none", borderRadius: "10px",
    fontSize: "13px", fontWeight: "650", cursor: "pointer",
    transition: "opacity 0.2s", letterSpacing: "-0.1px",
  },
  submitBtnOff: { background: "#ebebeb", color: "#bbb", cursor: "not-allowed" },
 
  /* Finished */
  finishedWrap: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "80vh", padding: "2rem",
  },
  finishedCard: {
    background: "#fff", borderRadius: "20px",
    border: "1px solid #ebebeb",
    boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
    padding: "2.5rem", maxWidth: "440px", width: "100%", textAlign: "center",
  },
  finishedIcon: { fontSize: "48px", marginBottom: "16px" },
  finishedTitle: { fontSize: "24px", fontWeight: "750", color: "#111", margin: "0 0 8px", letterSpacing: "-0.4px" },
  finishedSub: { fontSize: "14px", color: "#888", margin: "0 0 1.5rem" },
  finishedStats: { display: "flex", justifyContent: "center", gap: "0", marginBottom: "1.5rem" },
  stat: { display: "flex", flexDirection: "column", gap: "3px", flex: 1 },
  statNum: { fontSize: "26px", fontWeight: "750", color: "#111" },
  statLabel: { fontSize: "11px", color: "#aaa", fontWeight: "500" },
  statDivider: { width: "1px", background: "#f0f0f0", margin: "0 8px" },
  finishedNote: {
    fontSize: "12px", color: "#aaa", lineHeight: "1.6",
    margin: "0 0 1.5rem", padding: "0 1rem",
  },
  finishedBtn: {
    padding: "13px 32px",
    background: "linear-gradient(135deg, #6c5ce7, #4834d4)",
    color: "#fff", border: "none", borderRadius: "11px",
    fontSize: "14px", fontWeight: "650", cursor: "pointer", letterSpacing: "-0.1px",
  },
};
 
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
textarea:focus { border-color: #6c5ce7 !important; background: #fff !important; }
button:focus { outline: none; }
`;
 
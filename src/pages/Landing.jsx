import { useState, useEffect, useRef } from "react";

// ─── CSS-in-JS styles as a string injected once ───────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    --orange: #e05e1e;
    --orange-bg: #fff0e8;
    --bg: #f5ede6;
    --surface: rgba(255,255,255,0.72);
    --surface-solid: #ffffff;
    --border: rgba(200,150,120,0.22);
    --border-solid: #e8d5c8;
    --text: #1a120c;
    --text-muted: #7a5c4a;
    --text-light: #b08a78;
    --shadow: 0 2px 16px rgba(180,100,50,0.10);
    --shadow-md: 0 4px 28px rgba(180,100,50,0.14);
    --radius: 14px;
    --radius-sm: 10px;
  }
  [data-theme="dark"] {
    --orange-bg: rgba(224,94,30,0.18);
    --bg: #1a1008;
    --surface: rgba(40,22,10,0.85);
    --surface-solid: #2a1a0c;
    --border: rgba(200,130,80,0.18);
    --border-solid: #3a2518;
    --text: #f5ede6;
    --text-muted: #c4a08a;
    --text-light: #8a6050;
    --shadow: 0 2px 16px rgba(0,0,0,0.35);
    --shadow-md: 0 4px 28px rgba(0,0,0,0.45);
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
    min-height: 100vh;
    transition: background 0.3s, color 0.3s;
    overflow-x: hidden;
  }

  #janseva-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 15% 20%, rgba(224,94,30,0.13) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 80%, rgba(245,158,11,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(253,230,200,0.18) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
  #janseva-root > * { position: relative; z-index: 1; }

  /* NAV */
  .js-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4rem;
    height: 62px;
    background: var(--surface);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border-solid);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: background 0.3s;
  }
  .js-nav-brand {
    display: flex;
    align-items: center;
    gap: 11px;
    text-decoration: none;
  }
  .js-brand-icon {
    width: 38px; height: 38px;
    background: var(--orange);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .js-brand-icon svg { width: 20px; height: 20px; fill: white; }
  .js-brand-name { font-size: 0.82rem; font-weight: 700; color: var(--text); line-height: 1.1; }
  .js-brand-sub { font-size: 0.72rem; color: var(--text-muted); }
  .js-nav-right { display: flex; align-items: center; gap: 10px; }
  .js-nav-links { display: flex; gap: 1.5rem; list-style: none; }
  .js-nav-links a {
    font-size: 0.85rem; font-weight: 500;
    color: var(--text-muted); text-decoration: none;
    transition: color 0.2s;
  }
  .js-nav-links a:hover { color: var(--orange); }
  .js-theme-toggle {
    display: flex; align-items: center; gap: 6px;
    background: var(--surface-solid);
    border: 1px solid var(--border-solid);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.82rem; font-weight: 500;
    color: var(--text); cursor: pointer;
    transition: border-color 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .js-theme-toggle:hover { border-color: var(--orange); }
  .js-btn-login {
    background: var(--orange);
    color: white; border: none;
    border-radius: var(--radius-sm);
    padding: 8px 18px;
    font-size: 0.85rem; font-weight: 600;
    cursor: pointer; font-family: 'Inter', sans-serif;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    transition: opacity 0.2s, transform 0.15s;
  }
  .js-btn-login:hover { opacity: 0.88; transform: translateY(-1px); }

  /* HERO */
  .js-hero {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 2.5rem;
    align-items: start;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2.5rem 4rem 3rem;
  }
  @media (max-width: 820px) {
    .js-hero { grid-template-columns: 1fr; padding: 3rem 1.5rem; }
    .js-hero-card { display: none; }
    .js-nav { padding: 0 1.5rem; }
    .js-nav-links { display: none; }
  }
  .js-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--surface-solid);
    border: 1px solid var(--border-solid);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.78rem; font-weight: 600;
    color: var(--text-muted);
    margin-bottom: 1.4rem;
  }
  .js-badge-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--orange); }
  .js-hero h1 {
    font-size: clamp(2.2rem, 4.5vw, 3.2rem);
    font-weight: 800;
    line-height: 1.12;
    color: var(--text);
    margin-bottom: 1.1rem;
    letter-spacing: -0.02em;
  }
  .js-hero-sub {
    font-size: 1rem; color: var(--text-muted);
    max-width: 480px; margin-bottom: 2rem; line-height: 1.65;
  }
  .js-hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .js-btn-primary {
    background: var(--orange); color: white; border: none;
    border-radius: var(--radius-sm); padding: 12px 26px;
    font-size: 0.95rem; font-weight: 700; cursor: pointer;
    font-family: 'Inter', sans-serif; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    box-shadow: 0 4px 18px rgba(224,94,30,0.28);
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.15s;
  }
  .js-btn-primary:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(224,94,30,0.35); }
  .js-btn-ghost {
    background: var(--surface-solid); color: var(--text);
    border: 1px solid var(--border-solid);
    border-radius: var(--radius-sm); padding: 12px 26px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
    font-family: 'Inter', sans-serif; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: border-color 0.2s, transform 0.15s;
  }
  .js-btn-ghost:hover { border-color: var(--orange); transform: translateY(-1px); }
  .js-hero-pills { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .js-hero-pill {
    background: var(--surface);
    border: 1px solid var(--border-solid);
    border-radius: var(--radius-sm);
    padding: 10px 16px;
    display: flex; align-items: center; gap: 9px;
    backdrop-filter: blur(8px);
  }
  .js-pill-icon {
    width: 30px; height: 30px;
    background: var(--orange-bg);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; flex-shrink: 0;
  }
  .js-pill-label { font-size: 0.82rem; font-weight: 700; color: var(--text); line-height: 1.2; }
  .js-pill-sub { font-size: 0.72rem; color: var(--text-muted); }

  /* HERO CARD */
  .js-hero-card {
    background: var(--surface);
    border: 1px solid var(--border-solid);
    border-radius: 20px;
    padding: 1.5rem;
    backdrop-filter: blur(14px);
    box-shadow: var(--shadow-md);
  }
  .js-card-title { font-size: 1.05rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem; }
  .js-card-sub { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5; }
  .js-feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem; }
  .js-feat-item {
    background: var(--surface-solid);
    border: 1px solid var(--border-solid);
    border-radius: var(--radius-sm);
    padding: 1rem;
  }
  .js-feat-header { display: flex; align-items: center; gap: 8px; margin-bottom: 0.4rem; }
  .js-feat-icon {
    width: 28px; height: 28px;
    background: var(--orange-bg);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.88rem; flex-shrink: 0;
  }
  .js-feat-name { font-size: 0.85rem; font-weight: 700; color: var(--text); }
  .js-feat-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.45; }
  .js-tip-box {
    background: var(--orange-bg);
    border: 1px solid rgba(224,94,30,0.2);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 0.78rem; color: var(--text-muted); line-height: 1.5;
  }

  /* SECTIONS */
  .js-section { max-width: 1400px; margin: 0 auto; padding: 3.5rem 4rem; }
  @media (max-width: 820px) { .js-section { padding: 2.5rem 1.5rem; } }
  .js-section-header { text-align: center; margin-bottom: 2.5rem; }
  .js-section-tag {
    display: inline-block;
    background: var(--orange-bg);
    color: var(--orange);
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.07em; text-transform: uppercase;
    border-radius: 6px; padding: 4px 11px; margin-bottom: 0.8rem;
  }
  .js-section-title {
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 800; color: var(--text);
    letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 0.5rem;
  }
  .js-section-sub { font-size: 0.88rem; color: var(--text-muted); }

  /* STATS */
  .js-stats-strip {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border-solid);
    border: 1px solid var(--border-solid);
    border-radius: var(--radius);
    overflow: hidden;
  }
  @media (max-width: 600px) { .js-stats-strip { grid-template-columns: repeat(2, 1fr); } }
  .js-stat-cell {
    background: var(--surface);
    padding: 1.4rem 1rem;
    text-align: center;
    backdrop-filter: blur(10px);
  }
  .js-stat-num {
    font-size: 1.7rem; font-weight: 800; color: var(--orange);
    display: block; line-height: 1; margin-bottom: 0.3rem;
  }
  .js-stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

  /* STEPS */
  .js-steps-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  @media (max-width: 768px) { .js-steps-row { grid-template-columns: repeat(2, 1fr); } }
  .js-step-card {
    background: var(--surface);
    border: 1px solid var(--border-solid);
    border-radius: var(--radius);
    padding: 1.4rem 1.2rem;
    backdrop-filter: blur(10px);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .js-step-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .js-step-num {
    width: 26px; height: 26px; background: var(--orange); color: white;
    border-radius: 7px; display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 800; margin-bottom: 0.9rem;
  }
  .js-step-emoji { font-size: 1.5rem; display: block; margin-bottom: 0.6rem; }
  .js-step-title { font-size: 0.88rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem; }
  .js-step-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.55; }

  .js-divider { max-width: 1400px; margin: 0 auto; border: none; border-top: 1px solid var(--border-solid); }

  /* FEATURES */
  .js-features-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  @media (max-width: 768px) { .js-features-row { grid-template-columns: 1fr 1fr; } }
  .js-feature-card {
    background: var(--surface);
    border: 1px solid var(--border-solid);
    border-radius: var(--radius);
    padding: 1.4rem;
    backdrop-filter: blur(10px);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .js-feature-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
  .js-f-icon {
    width: 40px; height: 40px; background: var(--orange-bg);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; margin-bottom: 0.9rem;
  }
  .js-f-title { font-size: 0.9rem; font-weight: 700; color: var(--text); margin-bottom: 0.3rem; }
  .js-f-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.55; }

  /* CTA */
  .js-cta-strip {
    background: var(--orange);
    border-radius: var(--radius);
    padding: 2rem 2.5rem;
    display: flex; align-items: center;
    justify-content: space-between;
    gap: 1.5rem; flex-wrap: wrap;
    margin-top: 2.5rem;
  }
  .js-cta-strip h2 { font-size: 1.15rem; font-weight: 800; color: white; margin-bottom: 0.2rem; }
  .js-cta-strip p { font-size: 0.85rem; color: rgba(255,255,255,0.8); }
  .js-btn-white {
    background: white; color: var(--orange); border: none;
    border-radius: var(--radius-sm); padding: 12px 24px;
    font-size: 0.9rem; font-weight: 700; cursor: pointer;
    font-family: 'Inter', sans-serif; text-decoration: none;
    display: inline-flex; align-items: center; gap: 7px;
    white-space: nowrap;
    transition: opacity 0.2s, transform 0.15s;
  }
  .js-btn-white:hover { opacity: 0.92; transform: translateY(-1px); }

  /* FOOTER */
  .js-footer {
    border-top: 1px solid var(--border-solid);
    padding: 1.5rem 4rem;
    display: flex; align-items: center;
    justify-content: space-between;
    flex-wrap: wrap; gap: 1rem;
    background: var(--surface);
    backdrop-filter: blur(10px);
  }
  .js-footer-brand {
    display: flex; align-items: center; gap: 9px;
    font-size: 0.82rem; font-weight: 600;
    color: var(--text-muted); text-decoration: none;
  }
  .js-footer-links { display: flex; gap: 1.25rem; }
  .js-footer-links a {
    font-size: 0.78rem; color: var(--text-light);
    text-decoration: none; transition: color 0.2s;
  }
  .js-footer-links a:hover { color: var(--orange); }

  /* Fade-in animation */
  .js-fade { opacity: 0; transform: translateY(18px); transition: opacity 0.45s ease, transform 0.45s ease; }
  .js-fade.js-show { opacity: 1; transform: translateY(0); }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useInView(ref, threshold = 0.08) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

function useCounter(target, decimals = 0, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const duration = 1800;
    const start = performance.now();
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const current = target * easeOutQuart(progress);
      setValue(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(target);
    }
    requestAnimationFrame(tick);
  }, [active, target, decimals]);
  return value;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}

function Navbar({ theme, onToggleTheme }) {
  return (
    <nav className="js-nav">
      <a href="#" className="js-nav-brand">
        <div className="js-brand-icon"><LocationIcon /></div>
        <div>
          <div className="js-brand-name">JanSeva Infra</div>
          <div className="js-brand-sub">Civic Issue Reporting</div>
        </div>
      </a>
      <div className="js-nav-right">
        <ul className="js-nav-links">
          <li><a href="#how">How it Works</a></li>
          <li><a href="#features">Features</a></li>
        </ul>
        <button className="js-theme-toggle" onClick={onToggleTheme}>
          <span>{theme === "dark" ? "☀️" : "🌙"}</span>
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <a href="#" className="js-btn-login">Continue to Login →</a>
      </div>
    </nav>
  );
}

function HeroCard() {
  const features = [
    { icon: "🤖", name: "AI Priority", desc: "Predict urgency from the issue description." },
    { icon: "🛡️", name: "Role Access", desc: "Screens and actions based on your role." },
    { icon: "🔄", name: "Sync Queue", desc: "Works offline and syncs in the background." },
    { icon: "📍", name: "Supervisor Map", desc: "Markers, details, and engineer assignment." },
  ];
  return (
    <div className="js-hero-card">
      <div className="js-card-title">What you get</div>
      <div className="js-card-sub">Built for speed, clarity, and a smooth experience across light/dark themes.</div>
      <div className="js-feat-grid">
        {features.map((f) => (
          <div className="js-feat-item" key={f.name}>
            <div className="js-feat-header">
              <div className="js-feat-icon">{f.icon}</div>
              <span className="js-feat-name">{f.name}</span>
            </div>
            <div className="js-feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>
      <div className="js-tip-box">
        💡 <strong>Tip:</strong> Use the theme toggle to preview light/dark styling before logging in.
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="js-hero">
      <div>
        <div className="js-hero-badge">
          <div className="js-badge-dot" />
          Role-based access for citizens, engineers, supervisors
        </div>
        <h1>Report, track, and<br />resolve civic issues —<br />faster.</h1>
        <p className="js-hero-sub">
          A modern, offline-first platform with AI-assisted priority prediction and a supervisor map
          view to keep communities moving.
        </p>
        <div className="js-hero-actions">
          <a href="#" className="js-btn-primary">Continue to Login →</a>
          <a href="#how" className="js-btn-ghost">Get Started</a>
        </div>
      </div>
      <HeroCard />
    </div>
  );
}

function StatCell({ target, suffix, decimals = 0, label, active }) {
  const value = useCounter(target, decimals, active);
  const display =
    decimals > 0
      ? value.toFixed(decimals) + suffix
      : Math.floor(value).toLocaleString() + suffix;
  return (
    <div className="js-stat-cell">
      <span className="js-stat-num">{display}</span>
      <div className="js-stat-label">{label}</div>
    </div>
  );
}

function Stats() {
  const stats = [
    { target: 2400, suffix: "+", label: "Issues Reported" },
    { target: 86, suffix: "%", label: "Resolution Rate" },
    { target: 3.2, suffix: " days", decimals: 1, label: "Avg. Fix Time" },
    { target: 3, suffix: " Roles", label: "Citizen · Engineer · Admin" },
  ];
  return (
    <div className="js-section" style={{ paddingTop: 0 }}>
      <div className="js-stats-strip">
        {stats.map((s) => (
          <StatCell key={s.label} {...s} active={true} />
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const steps = [
    { num: 1, emoji: "📍", title: "Spot the Issue", desc: "Notice a pothole, water leak, or broken streetlight anywhere in your ward." },
    { num: 2, emoji: "📝", title: "File a Report", desc: "Describe the issue, pick a category, and attach a photo. GPS auto-captures location." },
    { num: 3, emoji: "🤖", title: "AI Prioritises", desc: "Gemini AI assigns Critical / High / Medium / Low urgency instantly." },
    { num: 4, emoji: "✅", title: "Track & Resolve", desc: "Follow live status — Reported → Assigned → In Progress → Resolved." },
  ];
  return (
    <div
      className={`js-section js-fade${visible ? " js-show" : ""}`}
      id="how"
      ref={ref}
    >
      <div className="js-section-header">
        <div className="js-section-tag">Simple Process</div>
        <div className="js-section-title">From report to resolution in 4 steps</div>
        <div className="js-section-sub">Any citizen can file an issue in under 2 minutes — no office visits needed.</div>
      </div>
      <div className="js-steps-row">
        {steps.map((s) => (
          <div className="js-step-card" key={s.num}>
            <div className="js-step-num">{s.num}</div>
            <span className="js-step-emoji">{s.emoji}</span>
            <div className="js-step-title">{s.title}</div>
            <p className="js-step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const feats = [
    { icon: "🤖", title: "AI Priority Prediction", desc: "Gemini AI reads each description and scores urgency — so critical failures get escalated automatically." },
    { icon: "🗺️", title: "Supervisor Map View", desc: "See all open issues on an interactive map. Assign engineers to nearby cases with one tap." },
    { icon: "📶", title: "Offline-First Sync", desc: "Field engineers can submit reports without internet. Issues queue locally and sync when back online." },
    { icon: "🛡️", title: "Role-Based Access", desc: "Citizen, Engineer and Supervisor roles each see a tailored interface with appropriate permissions." },
    { icon: "🔔", title: "Live Status Tracking", desc: "Citizens track every report through each stage and get notified whenever status changes." },
    { icon: "⚡", title: "Fast with Vite + React", desc: "Instant hot reload in dev, optimised bundles in production — a snappy experience for every user." },
  ];
  return (
    <div
      className={`js-section js-fade${visible ? " js-show" : ""}`}
      id="features"
      ref={ref}
    >
      <div className="js-section-header">
        <div className="js-section-tag">Platform Features</div>
        <div className="js-section-title">Built for every stakeholder</div>
        <div className="js-section-sub">Citizens report, engineers act, supervisors oversee — all in one platform.</div>
      </div>
      <div className="js-features-row">
        {feats.map((f) => (
          <div className="js-feature-card" key={f.title}>
            <div className="js-f-icon">{f.icon}</div>
            <div className="js-f-title">{f.title}</div>
            <p className="js-f-desc">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="js-cta-strip">
        <div>
          <h2>Ready to improve your neighbourhood?</h2>
          <p>File your first issue in under 2 minutes.</p>
        </div>
        <a href="#" className="js-btn-white">Continue to Login →</a>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="js-footer">
      <a href="#" className="js-footer-brand">
        <div
          style={{
            width: 26, height: 26,
            background: "var(--orange)",
            borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        </div>
        JanSeva Infra · © 2026
      </a>
      <div className="js-footer-links">
        <a href="https://github.com/Maverickcodes-sketch/JanSeva-Infra" target="_blank" rel="noreferrer">GitHub</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export function Landing() {
  const [theme, setTheme] = useState("light");

  // Inject global CSS once
  useEffect(() => {
    if (document.getElementById("janseva-styles")) return;
    const style = document.createElement("style");
    style.id = "janseva-styles";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);

  // Sync theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div id="janseva-root">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <Stats />
      <HowItWorks />
      <hr className="js-divider" />
      <Features />
      <Footer />
    </div>
  );
}
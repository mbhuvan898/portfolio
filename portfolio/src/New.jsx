import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────── */
const ME = {
  name: "M Bhuvan",
  role: "Full-Stack & DevOps Engineer",
  sub: "MCA Student · Bangalore",
  bio: "I build and ship full-stack web applications and the infrastructure around them — React frontends, Node.js APIs, MongoDB databases, and automated CI/CD pipelines on AWS. Currently seeking an internship where I can contribute to real production systems.",
  email: "mbhuvan898@gmail.com",
  phone: "9880912303",
  linkedin: "https://www.linkedin.com/in/bhuvan-m55a63b25a",
  location: "Bangalore, Karnataka",
  commit: "a4f7c2d",
  branch: "main",
};

const SKILLS = [
  { label: "React.js",   cat: "frontend" },
  { label: "Node.js",    cat: "backend"  },
  { label: "Express.js", cat: "backend"  },
  { label: "MongoDB",    cat: "database" },
  { label: "Docker",     cat: "devops"   },
  { label: "Jenkins",    cat: "devops"   },
  { label: "AWS EC2",    cat: "cloud"    },
  { label: "AWS S3",     cat: "cloud"    },
  { label: "SonarQube",  cat: "devops"   },
  { label: "Trivy",      cat: "devops"   },
  { label: "Git",        cat: "tools"    },
  { label: "HTML5",      cat: "frontend" },
  { label: "CSS3",       cat: "frontend" },
  { label: "Tailwind",   cat: "frontend" },
  { label: "JavaScript", cat: "lang"     },
  { label: "Python",     cat: "lang"     },
  { label: "Java",       cat: "lang"     },
  { label: "Postman",    cat: "tools"    },
];

const CAT_COLOR = {
  frontend: "#60a5fa",
  backend:  "#34d399",
  database: "#fb923c",
  devops:   "#f472b6",
  cloud:    "#a78bfa",
  tools:    "#94a3b8",
  lang:     "#facc15",
};

const PROJECTS = [
  {
    id: "01",
    title: "Online Book Store",
    tags: ["React.js", "Node.js", "MongoDB", "REST API"],
    desc: "Full-stack MERN bookstore with document-to-audio conversion. Users upload files that are converted to audio for in-browser playback. Features dynamic search, category browsing, and full CRUD.",
    pipeline: ["clone", "install", "test", "build", "deploy"],
    commit: "a4f7c2d",
    env: "production",
    accent: "#60a5fa",
  },
  {
    id: "02",
    title: "E-Commerce DevOps Platform",
    tags: ["MERN", "Docker", "Jenkins", "SonarQube", "AWS"],
    desc: "Full-stack e-commerce app with an end-to-end DevOps pipeline — Dockerised services, Jenkins CI/CD, SonarQube quality gates, Trivy CVE scanning, EC2 deployment, and S3 static assets.",
    pipeline: ["clone", "sonarqube", "docker build", "trivy scan", "deploy"],
    commit: "3b91ef0",
    env: "production",
    accent: "#34d399",
  },
];

const EDUCATION = [
  { period: "Dec 2024 – Present", degree: "MCA", full: "Master of Computer Applications", inst: "Bangalore Institute of Technology", current: true },
  { period: "Jul 2021 – May 2024", degree: "BCA", full: "Bachelor of Computer Applications", inst: "Amrita Vishwa Vidyapeetham, Mysuru", current: false },
  { period: "2019 – 2021", degree: "PUC", full: "PUC – Science (PCMB)", inst: "Amrita Vishwa Vidyapeetham, Mysuru", current: false },
  { period: "2018 – 2019", degree: "SSLC", full: "SSLC (CBSE)", inst: "Citizens Public School, Mysuru", current: false },
];

const NAV = ["about", "skills", "projects", "education", "contact"];

/* ─────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: #0c0c0f;
  color: #a0a8b8;
  font-family: 'JetBrains Mono', monospace;
  overflow-x: hidden;
}

::selection { background: #60a5fa33; color: #fff; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: #0c0c0f; }
::-webkit-scrollbar-thumb { background: #60a5fa33; }

@keyframes fadeUp   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0; } }
@keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
@keyframes drift    { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
@keyframes scanMove { 0% { transform:translateX(-100%); } 100% { transform:translateX(400%); } }
@keyframes glow     { 0%,100% { box-shadow: 0 0 0 0 transparent; } 50% { box-shadow: 0 0 20px 2px currentColor; } }

.hero-char {
  display: inline-block;
  opacity: 0;
  animation: fadeUp 0.5s ease forwards;
}

.nav-link {
  position: relative;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.nav-link:hover::after { transform: scaleX(1); }

.skill-tag {
  transition: all 0.2s;
  cursor: default;
}
.skill-tag:hover {
  transform: translateY(-2px);
}

.proj-card {
  transition: border-color 0.3s, box-shadow 0.3s;
}

.contact-link {
  transition: color 0.2s, transform 0.2s;
  display: inline-block;
}
.contact-link:hover { transform: translateX(4px); }
`;

/* ─────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return t.toUTCString().slice(0, 25);
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────── */
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 clamp(1.5rem, 5vw, 5rem)",
      height: 58,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(12,12,15,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      transition: "all 0.4s ease",
    }}>
      {/* brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{
          width: 28, height: 28,
          background: "linear-gradient(135deg, #60a5fa, #34d399)",
          borderRadius: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.65rem", fontWeight: 700, color: "#0c0c0f",
        }}>MB</div>
        <span style={{ fontSize: "0.68rem", color: "#4a5568", letterSpacing: "0.08em" }}>
          {ME.branch}<span style={{ color: "#60a5fa", margin: "0 0.3rem" }}>·</span>{ME.commit}
        </span>
      </div>

      {/* nav */}
      <nav style={{ display: "flex", gap: "clamp(1rem,2.5vw,2.5rem)" }}>
        {NAV.map(id => (
          <button key={id} onClick={() => scrollTo(id)} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem", letterSpacing: "0.1em",
            color: active === id ? "#e2e8f0" : "#4a5568",
            textTransform: "uppercase",
            padding: 0,
            transition: "color 0.2s",
            borderBottom: active === id ? "1px solid #60a5fa" : "1px solid transparent",
            paddingBottom: "2px",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#a0a8b8"}
            onMouseLeave={e => e.currentTarget.style.color = active === id ? "#e2e8f0" : "#4a5568"}
          >{id}</button>
        ))}
      </nav>
    </header>
  );
}

/* ─────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────── */
function Hero() {
  const words = ME.name.split(" ");

  return (
    <section id="about" style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "80px clamp(1.5rem, 8vw, 8rem) 4rem",
      position: "relative", overflow: "hidden",
    }}>

      {/* large decorative background text */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", userSelect: "none",
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(8rem, 22vw, 24rem)",
        color: "rgba(96,165,250,0.025)",
        fontStyle: "italic", lineHeight: 1,
        letterSpacing: "-0.04em",
      }}>Engineer</div>

      {/* floating commit badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        padding: "0.3rem 0.75rem",
        background: "rgba(96,165,250,0.07)",
        border: "1px solid rgba(96,165,250,0.2)",
        borderRadius: 100,
        width: "fit-content",
        marginBottom: "2rem",
        opacity: 0, animation: "fadeUp 0.5s 0.2s ease forwards",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: "0.6rem", color: "#60a5fa", letterSpacing: "0.15em" }}>
          AVAILABLE FOR INTERNSHIP
        </span>
      </div>

      {/* name — editorial serif */}
      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(3.5rem, 10vw, 10rem)",
        fontWeight: 400,
        lineHeight: 0.9,
        letterSpacing: "-0.03em",
        color: "#f1f5f9",
        marginBottom: "1.5rem",
        opacity: 0, animation: "fadeUp 0.7s 0.35s ease forwards",
      }}>
        {words.map((w, wi) => (
          <span key={wi} style={{
            display: "block",
            fontStyle: wi === 1 ? "italic" : "normal",
            color: wi === 1 ? "#60a5fa" : "#f1f5f9",
          }}>{w}</span>
        ))}
      </h1>

      {/* role */}
      <p style={{
        fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
        color: "#4a5568",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        marginBottom: "2rem",
        opacity: 0, animation: "fadeUp 0.6s 0.55s ease forwards",
      }}>{ME.role} · {ME.sub}</p>

      {/* bio */}
      <p style={{
        maxWidth: 580,
        fontSize: "clamp(0.85rem, 1.3vw, 1rem)",
        lineHeight: 1.9,
        color: "#6b7280",
        marginBottom: "3rem",
        opacity: 0, animation: "fadeUp 0.6s 0.7s ease forwards",
      }}>{ME.bio}</p>

      {/* CTAs */}
      <div style={{
        display: "flex", gap: "1rem", flexWrap: "wrap",
        opacity: 0, animation: "fadeUp 0.6s 0.85s ease forwards",
      }}>
        <button onClick={() => scrollTo("projects")} style={ctaFilled}>
          View Projects →
        </button>
        <a href={`mailto:${ME.email}`} style={ctaOutline}>
          Get in Touch
        </a>
      </div>

      {/* bottom-right corner: live clock */}
      <LiveClock />
    </section>
  );
}

function LiveClock() {
  const t = useClock();
  return (
    <div style={{
      position: "absolute", bottom: "2.5rem", right: "clamp(1.5rem,8vw,8rem)",
      fontSize: "0.56rem", color: "#2d3748", letterSpacing: "0.12em",
      animation: "fadeIn 1s 1.5s ease forwards", opacity: 0,
    }}>
      {t} UTC
    </div>
  );
}

const ctaFilled = {
  padding: "0.75rem 1.75rem",
  background: "#60a5fa",
  color: "#0c0c0f",
  border: "none",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  cursor: "pointer",
  fontWeight: 700,
  transition: "opacity 0.2s",
};

const ctaOutline = {
  padding: "0.75rem 1.75rem",
  background: "transparent",
  color: "#60a5fa",
  border: "1px solid rgba(96,165,250,0.4)",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.72rem",
  letterSpacing: "0.1em",
  cursor: "pointer",
  textDecoration: "none",
  transition: "border-color 0.2s",
};

/* ─────────────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────────────── */
function Section({ id, children, style = {} }) {
  return (
    <section id={id} style={{
      padding: "6rem clamp(1.5rem, 8vw, 8rem)",
      position: "relative",
      ...style,
    }}>
      {children}
    </section>
  );
}

function SectionLabel({ number, title, vis }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1.2rem",
      marginBottom: "3.5rem",
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(-8px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: "0.6rem",
        color: "#60a5fa", letterSpacing: "0.2em", opacity: 0.7 }}>
        {number}
      </span>
      <h2 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "clamp(2rem, 5vw, 3.5rem)",
        fontWeight: 400, color: "#f1f5f9",
        letterSpacing: "-0.02em", lineHeight: 1,
      }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────────────── */
function Skills() {
  const [ref, vis] = useInView();
  const [active, setActive] = useState(null);

  const cats = [...new Set(SKILLS.map(s => s.cat))];

  return (
    <Section id="skills" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div ref={ref}>
        <SectionLabel number="02" title="Skills" vis={vis} />

        {/* category filter row */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2.5rem",
          opacity: vis ? 1 : 0, transition: "opacity 0.5s 0.1s ease",
        }}>
          <button onClick={() => setActive(null)} style={filterBtn(active === null, "#60a5fa")}>all</button>
          {cats.map(c => (
            <button key={c} onClick={() => setActive(active === c ? null : c)}
              style={filterBtn(active === c, CAT_COLOR[c])}>{c}</button>
          ))}
        </div>

        {/* skill tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {SKILLS.map((s, i) => {
            const faded = active && s.cat !== active;
            const color = CAT_COLOR[s.cat];
            return (
              <span key={s.label} className="skill-tag" style={{
                padding: "0.45rem 1rem",
                background: faded ? "rgba(255,255,255,0.02)" : `${color}12`,
                border: `1px solid ${faded ? "rgba(255,255,255,0.06)" : color + "35"}`,
                color: faded ? "#2d3748" : color,
                fontSize: "0.7rem", letterSpacing: "0.06em",
                opacity: vis ? 1 : 0,
                transition: `opacity 0.4s ${i * 0.03}s ease, background 0.2s, color 0.2s, border-color 0.2s`,
              }}>{s.label}</span>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function filterBtn(active, color) {
  return {
    padding: "0.3rem 0.75rem",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.58rem", letterSpacing: "0.1em",
    background: active ? `${color}18` : "transparent",
    border: `1px solid ${active ? color + "55" : "rgba(255,255,255,0.08)"}`,
    color: active ? color : "#4a5568",
    cursor: "pointer",
    transition: "all 0.2s",
  };
}

/* ─────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────── */
function Projects() {
  const [ref, vis] = useInView();
  return (
    <Section id="projects" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div ref={ref}>
        <SectionLabel number="03" title="Projects" vis={vis} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))", gap: "1.5rem" }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} delay={i * 0.15} vis={vis} />)}
        </div>
      </div>
    </Section>
  );
}

function ProjectCard({ project, delay, vis }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="proj-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#111116",
        border: `1px solid ${hov ? project.accent + "55" : "rgba(255,255,255,0.06)"}`,
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        boxShadow: hov ? `0 0 40px ${project.accent}15` : "none",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease, border-color 0.3s, box-shadow 0.3s`,
      }}>

      {/* top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${project.accent}, transparent)`,
        opacity: hov ? 1 : 0.4, transition: "opacity 0.3s",
      }} />

      {/* project number + env badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{
          fontFamily: "'Instrument Serif', serif", fontSize: "3rem",
          color: "rgba(255,255,255,0.04)", lineHeight: 1, fontStyle: "italic",
        }}>{project.id}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%",
            background: project.accent, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "0.55rem", color: project.accent, letterSpacing: "0.15em" }}>
            {project.env.toUpperCase()}
          </span>
        </div>
      </div>

      <h3 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: "1.5rem", fontWeight: 400, color: "#f1f5f9",
        marginBottom: "0.8rem", lineHeight: 1.2,
        letterSpacing: "-0.01em",
      }}>{project.title}</h3>

      <p style={{
        fontSize: "0.75rem", lineHeight: 1.85, color: "#4a5568",
        marginBottom: "1.5rem",
      }}>{project.desc}</p>

      {/* pipeline stages — subtle devops nod */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.5rem", color: "#2d3748", letterSpacing: "0.18em", marginBottom: "0.6rem" }}>
          PIPELINE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          {project.pipeline.map((s, i) => (
            <span key={s} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{
                fontSize: "0.55rem", padding: "0.15rem 0.45rem",
                background: `${project.accent}10`,
                border: `1px solid ${project.accent}25`,
                color: `${project.accent}99`,
                letterSpacing: "0.06em",
              }}>{s}</span>
              {i < project.pipeline.length - 1 && (
                <span style={{ color: `${project.accent}30`, fontSize: "0.45rem" }}>▶</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {project.tags.map(t => (
          <span key={t} style={{
            fontSize: "0.6rem", padding: "0.2rem 0.5rem",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#4a5568",
          }}>{t}</span>
        ))}
      </div>

      {/* commit hash */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.56rem", color: "#2d3748", fontFamily: "'JetBrains Mono'" }}>
          commit <span style={{ color: project.accent + "77" }}>{project.commit}</span>
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   EDUCATION
───────────────────────────────────────────────────── */
function Education() {
  const [ref, vis] = useInView();
  return (
    <Section id="education" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div ref={ref}>
        <SectionLabel number="04" title="Education" vis={vis} />
        <div style={{ position: "relative" }}>
          {/* vertical rule */}
          <div style={{
            position: "absolute", left: 0, top: 8, bottom: 0, width: 1,
            background: "linear-gradient(to bottom, rgba(96,165,250,0.4), transparent)",
          }} />

          {EDUCATION.map((e, i) => (
            <div key={i} style={{
              paddingLeft: "2.5rem",
              paddingBottom: "2.5rem",
              position: "relative",
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateX(-12px)",
              transition: `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`,
            }}>
              {/* dot */}
              <div style={{
                position: "absolute", left: -6, top: 8,
                width: 13, height: 13, borderRadius: "50%",
                background: e.current
                  ? "radial-gradient(circle, #60a5fa, #3b82f6)"
                  : "#111116",
                border: `1.5px solid ${e.current ? "#60a5fa" : "rgba(255,255,255,0.1)"}`,
                boxShadow: e.current ? "0 0 12px #60a5fa66" : "none",
              }} />

              <div style={{
                background: "#111116",
                border: `1px solid ${e.current ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.05)"}`,
                padding: "1.2rem 1.5rem",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <span style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: "0.85rem", fontStyle: "italic",
                      color: e.current ? "#60a5fa" : "#4a5568",
                    }}>{e.degree}</span>
                    {e.current && (
                      <span style={{
                        fontSize: "0.5rem", padding: "0.1rem 0.4rem",
                        background: "rgba(96,165,250,0.1)",
                        border: "1px solid rgba(96,165,250,0.3)",
                        color: "#60a5fa", letterSpacing: "0.12em",
                      }}>CURRENT</span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.58rem", color: "#2d3748", letterSpacing: "0.06em" }}>{e.period}</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: e.current ? "#d1d5db" : "#6b7280",
                  fontWeight: e.current ? 600 : 400, marginBottom: "0.2rem" }}>{e.full}</p>
                <p style={{ fontSize: "0.65rem", color: "#374151" }}>{e.inst}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────── */
function Contact() {
  const [ref, vis] = useInView();
  const contacts = [
    { label: "Email", value: ME.email, href: `mailto:${ME.email}` },
    { label: "Phone", value: ME.phone, href: `tel:${ME.phone}` },
    { label: "LinkedIn", value: "bhuvan-m55a63b25a", href: ME.linkedin },
    { label: "Location", value: ME.location, href: null },
  ];

  return (
    <Section id="contact" style={{
      borderTop: "1px solid rgba(255,255,255,0.04)",
      paddingBottom: "8rem",
    }}>
      <div ref={ref}>
        <SectionLabel number="05" title="Let's Talk" vis={vis} />

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}>
          {/* left: big quote */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
            transition: "opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease",
          }}>
            <p style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontStyle: "italic",
              color: "#374151",
              lineHeight: 1.5,
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}>
              "Open to internship opportunities in DevOps, full-stack, or cloud engineering."
            </p>
            <a href={`mailto:${ME.email}`} style={{
              ...ctaFilled,
              display: "inline-block",
              textDecoration: "none",
            }}>Send an Email →</a>
          </div>

          {/* right: contact list */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
            transition: "opacity 0.6s 0.25s ease, transform 0.6s 0.25s ease",
          }}>
            {contacts.map((c, i) => (
              <div key={c.label} style={{
                display: "flex", flexDirection: "column",
                padding: "1.25rem 0",
                borderBottom: i < contacts.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}>
                <span style={{ fontSize: "0.52rem", color: "#2d3748", letterSpacing: "0.2em",
                  textTransform: "uppercase", marginBottom: "0.35rem" }}>{c.label}</span>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer"
                    className="contact-link"
                    style={{
                      fontSize: "0.8rem", color: "#6b7280",
                      textDecoration: "none", wordBreak: "break-all",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "#60a5fa"}
                    onMouseLeave={e => e.currentTarget.style.color = "#6b7280"}
                  >{c.value} →</a>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "#374151" }}>{c.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{
      padding: "1.5rem clamp(1.5rem, 8vw, 8rem)",
      borderTop: "1px solid rgba(255,255,255,0.04)",
      display: "flex", justifyContent: "space-between",
      flexWrap: "wrap", gap: "0.5rem",
    }}>
      <span style={{ fontSize: "0.58rem", color: "#2d3748", letterSpacing: "0.1em" }}>
        © 2025 M Bhuvan
      </span>
      <span style={{ fontSize: "0.58rem", color: "#2d3748", letterSpacing: "0.1em" }}>
        branch: main · commit: {ME.commit} · env: production
      </span>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────── */
export default function App() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    const els = NAV.map(id => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.3 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "#0c0c0f", minHeight: "100vh" }}>
      <Navbar active={active} />
      <Hero />
      <Skills />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

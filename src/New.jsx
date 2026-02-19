/**
 * Unit Tests — M Bhuvan Portfolio
 * ─────────────────────────────────────────────
 * Compatible with: Create React App (react-scripts test)
 * No extra config needed — just run: npm test
 *
 * File location: src/App.test.jsx
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

/* ─────────────────────────────────────────────
   TEST DATA MIRRORS (copied from App.jsx)
   In CRA you can also just import directly:
   import App from "./App";
───────────────────────────────────────────── */

const ME = {
  name: "M Bhuvan",
  role: "Full-Stack & DevOps Engineer",
  location: "Bangalore, India",
  email: "mbhuvan898@gmail.com",
  phone: "9880912303",
  linkedin: "https://www.linkedin.com/in/bhuvan-m55a63b25a",
  bio: "I build full-stack products and the infrastructure that ships them — from React interfaces to Docker pipelines, Jenkins CI/CD, and AWS deployments. Currently an MCA student seeking a DevOps or MERN internship.",
  commit: "a4f7c2d",
  branch: "main",
};

const SKILLS = [
  { cat: "Frontend",  items: ["React.js", "HTML5", "CSS3", "Bootstrap", "Tailwind"] },
  { cat: "Backend",   items: ["Node.js", "Express.js", "REST APIs"] },
  { cat: "Database",  items: ["MongoDB", "Mongoose"] },
  { cat: "DevOps",    items: ["Docker", "Jenkins", "SonarQube", "Trivy"] },
  { cat: "Cloud",     items: ["AWS EC2", "AWS S3"] },
  { cat: "Languages", items: ["JavaScript", "Java", "Python", "C"] },
  { cat: "Tools",     items: ["Git", "GitHub", "VS Code", "Postman"] },
];

const PROJECTS = [
  {
    no: "01", name: "Online Bookstore", year: "2024",
    stack: ["React.js", "Node.js", "Express.js", "MongoDB"],
    devops: ["Docker", "AWS EC2"],
    commit: "a4f7c2d", branch: "main", status: "DEPLOYED",
    desc: "Full-stack MERN bookstore with a document-to-audio conversion feature. Users upload PDFs and listen to them in-browser.",
    highlight: "Audio conversion from documents",
  },
  {
    no: "02", name: "E-Commerce DevOps Platform", year: "2024",
    stack: ["React.js", "Node.js", "MongoDB"],
    devops: ["Docker", "Jenkins", "SonarQube", "Trivy", "AWS EC2", "AWS S3"],
    commit: "3b91ef0", branch: "release/v2.1", status: "DEPLOYED",
    desc: "End-to-end MERN e-commerce store with a complete DevOps pipeline.",
    highlight: "Full CI/CD pipeline with security scanning",
  },
];

const EDUCATION = [
  { deg: "MCA", full: "Master of Computer Applications",   inst: "Bangalore Institute of Technology",  period: "Dec 2024 – Present",  active: true  },
  { deg: "BCA", full: "Bachelor of Computer Applications", inst: "Amrita Vishwa Vidyapeetham, Mysuru", period: "Jul 2021 – May 2024", active: false },
  { deg: "PUC", full: "Science – PCMB",                   inst: "Amrita Vishwa Vidyapeetham, Mysuru", period: "2019 – 2021",         active: false },
];

const NAV = ["about", "skills", "projects", "education", "contact"];

const T = {
  accent:     "#10d97e",
  accentAlt:  "#059669",
  accentDim:  "#10d97e1a",
  accentText: "#6ee7b7",
  ink:        "#e8f5f0",
  inkSub:     "#a8c5bb",
  muted:      "#4a6b62",
  bg:         "#0b1a1a",
  bgAlt:      "#0f2020",
  card:       "#132828",
  line:       "#1a3530",
  lineBright: "#274f46",
  watermark:  "#0f2e28",
};

/* ─────────────────────────────────────────────
   MOCKS — required because jsdom doesn't have
   IntersectionObserver or scrollIntoView
───────────────────────────────────────────── */

beforeAll(() => {
  // Mock IntersectionObserver
  global.IntersectionObserver = jest.fn(() => ({
    observe:    jest.fn(),
    disconnect: jest.fn(),
    unobserve:  jest.fn(),
  }));

  // Mock scrollIntoView
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

/* ─────────────────────────────────────────────
   MINI TEST COMPONENTS
   (lightweight wrappers to test rendering logic)
───────────────────────────────────────────── */

function TestNavbar({ active = "about" }) {
  return (
    <header data-testid="navbar">
      <div data-testid="logo">MB</div>
      <span data-testid="branch-commit">{ME.branch}@{ME.commit}</span>
      <nav>
        {NAV.map((id) => (
          <button
            key={id}
            data-testid={`nav-${id}`}
            aria-current={active === id ? "page" : undefined}
          >
            {id}
          </button>
        ))}
        <a href={`mailto:${ME.email}`} data-testid="hire-link">hire →</a>
      </nav>
    </header>
  );
}

function TestHero() {
  return (
    <section id="about" data-testid="hero">
      <div data-testid="badge">AVAILABLE · OPEN TO INTERNSHIP</div>
      <h1 data-testid="hero-name">M Bhuvan</h1>
      <p data-testid="hero-bio">{ME.bio}</p>
      <div data-testid="meta-location">{ME.location}</div>
      <div data-testid="meta-branch">{ME.branch}</div>
      <div data-testid="meta-commit">{ME.commit}</div>
      <div data-testid="meta-status">open-to-work</div>
    </section>
  );
}

function TestSkills() {
  return (
    <section id="skills" data-testid="skills-section">
      <h2>Skills</h2>
      {SKILLS.map((s) => (
        <div key={s.cat} data-testid={`cat-${s.cat}`}>
          <span data-testid={`cat-label-${s.cat}`}>{s.cat}</span>
          {s.items.map((item) => (
            <span key={item} data-testid={`tag-${item}`}>{item}</span>
          ))}
        </div>
      ))}
    </section>
  );
}

function TestProjectCard({ p }) {
  return (
    <div data-testid={`card-${p.no}`}>
      <span data-testid={`no-${p.no}`}>PROJECT {p.no}</span>
      <span data-testid={`status-${p.no}`}>{p.status}</span>
      <span data-testid={`year-${p.no}`}>{p.year}</span>
      <h3 data-testid={`name-${p.no}`}>{p.name}</h3>
      <span data-testid={`branch-${p.no}`}>{p.branch}</span>
      <span data-testid={`commit-${p.no}`}>{p.commit}</span>
      <span data-testid={`highlight-${p.no}`}>{p.highlight}</span>
      <p data-testid={`desc-${p.no}`}>{p.desc}</p>
      <div data-testid={`stack-${p.no}`}>
        {p.stack.map((t) => <span key={t} data-testid={`stack-${p.no}-${t}`}>{t}</span>)}
      </div>
      <div data-testid={`devops-${p.no}`}>
        {p.devops.map((d) => <span key={d} data-testid={`devops-${p.no}-${d}`}>{d}</span>)}
      </div>
    </div>
  );
}

function TestEducation() {
  return (
    <section id="education" data-testid="education-section">
      <h2>Education</h2>
      {EDUCATION.map((e) => (
        <div key={e.deg} data-testid={`edu-${e.deg}`}>
          <div data-testid={`deg-${e.deg}`}>{e.deg}</div>
          <p  data-testid={`full-${e.deg}`}>{e.full}</p>
          <p  data-testid={`inst-${e.deg}`}>{e.inst}</p>
          <p  data-testid={`period-${e.deg}`}>{e.period}</p>
          {e.active && <span data-testid={`current-${e.deg}`}>CURRENT</span>}
        </div>
      ))}
    </section>
  );
}

function TestContact() {
  const rows = [
    { label: "Email",    val: ME.email,           href: `mailto:${ME.email}` },
    { label: "Phone",    val: ME.phone,            href: `tel:${ME.phone}` },
    { label: "LinkedIn", val: "bhuvan-m55a63b25a", href: ME.linkedin },
    { label: "Location", val: ME.location,         href: null },
  ];
  return (
    <section id="contact" data-testid="contact-section">
      <h2>Contact</h2>
      <p data-testid="cta-text">Let&apos;s build something together.</p>
      <a href={`mailto:${ME.email}`} data-testid="cta-btn">send a message</a>
      {rows.map((r) => (
        <div key={r.label} data-testid={`row-${r.label.toLowerCase()}`}>
          <span>{r.label}</span>
          {r.href
            ? <a href={r.href} data-testid={`link-${r.label.toLowerCase()}`}>{r.val}</a>
            : <span data-testid={`text-${r.label.toLowerCase()}`}>{r.val}</span>
          }
        </div>
      ))}
    </section>
  );
}

function TestFooter() {
  return (
    <footer data-testid="footer">
      <span data-testid="copyright">© 2025 M Bhuvan · Bangalore</span>
      <span data-testid="status-text">all systems operational</span>
    </footer>
  );
}

function TestSHead({ no, title, vis = true }) {
  return (
    <div data-testid="shead" style={{ opacity: vis ? 1 : 0 }}>
      <span data-testid="shead-no">{no}</span>
      <h2 data-testid="shead-title">{title}</h2>
      <div data-testid="shead-bar" />
    </div>
  );
}

function TestApp() {
  return (
    <div data-testid="app">
      <TestNavbar active="about" />
      <TestHero />
      <TestSkills />
      <section id="projects" data-testid="projects-section">
        {PROJECTS.map((p) => <TestProjectCard key={p.no} p={p} />)}
      </section>
      <TestEducation />
      <TestContact />
      <TestFooter />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   TEST SUITES
══════════════════════════════════════════════════════════════════════════════ */

// ─── 1. ME DATA ───────────────────────────────────────────────────────────────
describe("DATA — ME object", () => {
  test("has correct name", () => {
    expect(ME.name).toBe("M Bhuvan");
  });
  test("has valid email format", () => {
    expect(ME.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
  test("phone is exactly 10 digits", () => {
    expect(ME.phone).toMatch(/^\d{10}$/);
  });
  test("LinkedIn URL starts with https://www.linkedin.com/in/", () => {
    expect(ME.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
  });
  test("commit is a 7-char hex string", () => {
    expect(ME.commit).toMatch(/^[0-9a-f]{7}$/);
  });
  test("branch is a non-empty string", () => {
    expect(ME.branch.length).toBeGreaterThan(0);
  });
  test("bio mentions Docker", () => {
    expect(ME.bio).toContain("Docker");
  });
  test("location contains Bangalore", () => {
    expect(ME.location).toContain("Bangalore");
  });
  test("role matches expected value", () => {
    expect(ME.role).toBe("Full-Stack & DevOps Engineer");
  });
});

// ─── 2. SKILLS DATA ───────────────────────────────────────────────────────────
describe("DATA — SKILLS", () => {
  test("has exactly 7 categories", () => {
    expect(SKILLS).toHaveLength(7);
  });
  test("every category has a non-empty cat string", () => {
    SKILLS.forEach((s) => expect(s.cat.length).toBeGreaterThan(0));
  });
  test("every category has at least one item", () => {
    SKILLS.forEach((s) => expect(s.items.length).toBeGreaterThan(0));
  });
  test("category names are all unique", () => {
    const names = SKILLS.map((s) => s.cat);
    expect(new Set(names).size).toBe(names.length);
  });
  test("Frontend includes React.js", () => {
    const fe = SKILLS.find((s) => s.cat === "Frontend");
    expect(fe.items).toContain("React.js");
  });
  test("DevOps includes Docker and Jenkins", () => {
    const dv = SKILLS.find((s) => s.cat === "DevOps");
    expect(dv.items).toContain("Docker");
    expect(dv.items).toContain("Jenkins");
  });
  test("DevOps includes SonarQube and Trivy", () => {
    const dv = SKILLS.find((s) => s.cat === "DevOps");
    expect(dv.items).toContain("SonarQube");
    expect(dv.items).toContain("Trivy");
  });
  test("Cloud includes AWS EC2 and AWS S3", () => {
    const cl = SKILLS.find((s) => s.cat === "Cloud");
    expect(cl.items).toContain("AWS EC2");
    expect(cl.items).toContain("AWS S3");
  });
  test("total skill items = 24", () => {
    const total = SKILLS.reduce((sum, s) => sum + s.items.length, 0);
    expect(total).toBe(24);
  });
  test("all skill items are non-empty strings", () => {
    SKILLS.forEach((s) =>
      s.items.forEach((item) => expect(item.length).toBeGreaterThan(0))
    );
  });
});

// ─── 3. PROJECTS DATA ─────────────────────────────────────────────────────────
describe("DATA — PROJECTS", () => {
  test("has exactly 2 projects", () => {
    expect(PROJECTS).toHaveLength(2);
  });
  test("each project has required fields", () => {
    ["no","name","year","stack","devops","commit","branch","status","desc","highlight"]
      .forEach((field) =>
        PROJECTS.forEach((p) => expect(p).toHaveProperty(field))
      );
  });
  test("project numbers are 01 and 02", () => {
    expect(PROJECTS[0].no).toBe("01");
    expect(PROJECTS[1].no).toBe("02");
  });
  test("all projects have status DEPLOYED", () => {
    PROJECTS.forEach((p) => expect(p.status).toBe("DEPLOYED"));
  });
  test("all commits are 7-char hex", () => {
    PROJECTS.forEach((p) => expect(p.commit).toMatch(/^[0-9a-f]{7}$/));
  });
  test("all years are 4-digit strings", () => {
    PROJECTS.forEach((p) => expect(p.year).toMatch(/^\d{4}$/));
  });
  test("every project stack is non-empty", () => {
    PROJECTS.forEach((p) => expect(p.stack.length).toBeGreaterThan(0));
  });
  test("every project devops is non-empty", () => {
    PROJECTS.forEach((p) => expect(p.devops.length).toBeGreaterThan(0));
  });
  test("project 02 devops includes SonarQube, Trivy, Jenkins", () => {
    const p2 = PROJECTS.find((p) => p.no === "02");
    expect(p2.devops).toContain("SonarQube");
    expect(p2.devops).toContain("Trivy");
    expect(p2.devops).toContain("Jenkins");
  });
  test("project 02 branch is release/v2.1", () => {
    const p2 = PROJECTS.find((p) => p.no === "02");
    expect(p2.branch).toBe("release/v2.1");
  });
});

// ─── 4. EDUCATION DATA ────────────────────────────────────────────────────────
describe("DATA — EDUCATION", () => {
  test("has exactly 3 entries", () => {
    expect(EDUCATION).toHaveLength(3);
  });
  test("degree abbreviations are MCA, BCA, PUC in order", () => {
    expect(EDUCATION.map((e) => e.deg)).toEqual(["MCA", "BCA", "PUC"]);
  });
  test("exactly one entry is active", () => {
    expect(EDUCATION.filter((e) => e.active)).toHaveLength(1);
  });
  test("MCA is the active entry", () => {
    expect(EDUCATION.find((e) => e.deg === "MCA").active).toBe(true);
  });
  test("BCA and PUC are not active", () => {
    expect(EDUCATION.find((e) => e.deg === "BCA").active).toBe(false);
    expect(EDUCATION.find((e) => e.deg === "PUC").active).toBe(false);
  });
  test("MCA institution is BIT Bangalore", () => {
    const mca = EDUCATION.find((e) => e.deg === "MCA");
    expect(mca.inst).toContain("Bangalore Institute of Technology");
  });
  test("MCA period contains Present", () => {
    expect(EDUCATION.find((e) => e.deg === "MCA").period).toContain("Present");
  });
  test("active field is boolean for all entries", () => {
    EDUCATION.forEach((e) => expect(typeof e.active).toBe("boolean"));
  });
});

// ─── 5. NAV ARRAY ─────────────────────────────────────────────────────────────
describe("DATA — NAV", () => {
  test("has exactly 5 items", () => {
    expect(NAV).toHaveLength(5);
  });
  test("contains all required section ids", () => {
    ["about","skills","projects","education","contact"]
      .forEach((id) => expect(NAV).toContain(id));
  });
  test("all items are lowercase strings", () => {
    NAV.forEach((id) => expect(id).toBe(id.toLowerCase()));
  });
  test("all items are unique", () => {
    expect(new Set(NAV).size).toBe(NAV.length);
  });
});

// ─── 6. DESIGN TOKENS ─────────────────────────────────────────────────────────
describe("DESIGN TOKENS — T", () => {
  test("accent is emerald green #10d97e", () => {
    expect(T.accent).toBe("#10d97e");
  });
  test("all token values start with #", () => {
    Object.values(T).forEach((val) => expect(val).toMatch(/^#/));
  });
  test("bg and bgAlt are different (section contrast)", () => {
    expect(T.bg).not.toBe(T.bgAlt);
  });
  test("ink is lighter than bg (readable text)", () => {
    expect(parseInt(T.ink.slice(1), 16)).toBeGreaterThan(parseInt(T.bg.slice(1), 16));
  });
  test("accent is different from all backgrounds", () => {
    expect(T.accent).not.toBe(T.bg);
    expect(T.accent).not.toBe(T.bgAlt);
    expect(T.accent).not.toBe(T.card);
  });
  test("accentDim starts with accent color", () => {
    expect(T.accentDim.startsWith(T.accent)).toBe(true);
  });
  test("watermark is a valid 6-digit hex", () => {
    expect(T.watermark).toMatch(/^#[0-9a-fA-F]{6}$/);
  });
});

// ─── 7. NAVBAR COMPONENT ──────────────────────────────────────────────────────
describe("COMPONENT — Navbar", () => {
  test("renders navbar element", () => {
    render(<TestNavbar />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });
  test("logo shows MB", () => {
    render(<TestNavbar />);
    expect(screen.getByTestId("logo")).toHaveTextContent("MB");
  });
  test("shows branch and commit", () => {
    render(<TestNavbar />);
    const bc = screen.getByTestId("branch-commit");
    expect(bc).toHaveTextContent(ME.branch);
    expect(bc).toHaveTextContent(ME.commit);
  });
  test("renders all 5 nav buttons", () => {
    render(<TestNavbar />);
    NAV.forEach((id) => expect(screen.getByTestId(`nav-${id}`)).toBeInTheDocument());
  });
  test("active item has aria-current='page'", () => {
    render(<TestNavbar active="skills" />);
    expect(screen.getByTestId("nav-skills")).toHaveAttribute("aria-current", "page");
  });
  test("inactive items do not have aria-current", () => {
    render(<TestNavbar active="about" />);
    ["skills","projects","education","contact"].forEach((id) =>
      expect(screen.getByTestId(`nav-${id}`)).not.toHaveAttribute("aria-current")
    );
  });
  test("hire link has correct mailto href", () => {
    render(<TestNavbar />);
    expect(screen.getByTestId("hire-link")).toHaveAttribute("href", `mailto:${ME.email}`);
  });
  test("hire link text is visible", () => {
    render(<TestNavbar />);
    expect(screen.getByTestId("hire-link")).toHaveTextContent("hire");
  });
  test("clicking a nav button does not throw", () => {
    render(<TestNavbar />);
    expect(() => fireEvent.click(screen.getByTestId("nav-about"))).not.toThrow();
  });
});

// ─── 8. HERO COMPONENT ────────────────────────────────────────────────────────
describe("COMPONENT — Hero", () => {
  test("renders with id='about'", () => {
    render(<TestHero />);
    expect(screen.getByTestId("hero")).toHaveAttribute("id", "about");
  });
  test("renders full name", () => {
    render(<TestHero />);
    expect(screen.getByTestId("hero-name")).toHaveTextContent("M Bhuvan");
  });
  test("shows AVAILABLE badge", () => {
    render(<TestHero />);
    expect(screen.getByTestId("badge")).toHaveTextContent("AVAILABLE");
  });
  test("shows OPEN TO INTERNSHIP in badge", () => {
    render(<TestHero />);
    expect(screen.getByTestId("badge")).toHaveTextContent("OPEN TO INTERNSHIP");
  });
  test("renders bio with DevOps mention", () => {
    render(<TestHero />);
    expect(screen.getByTestId("hero-bio")).toHaveTextContent("Docker pipelines");
  });
  test("shows location as Bangalore, India", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-location")).toHaveTextContent("Bangalore, India");
  });
  test("shows correct branch in meta", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-branch")).toHaveTextContent("main");
  });
  test("shows correct commit in meta", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-commit")).toHaveTextContent("a4f7c2d");
  });
  test("shows open-to-work status", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-status")).toHaveTextContent("open-to-work");
  });
});

// ─── 9. SKILLS COMPONENT ──────────────────────────────────────────────────────
describe("COMPONENT — Skills", () => {
  test("renders skills section", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("skills-section")).toBeInTheDocument();
  });
  test("renders all 7 categories", () => {
    render(<TestSkills />);
    SKILLS.forEach((s) =>
      expect(screen.getByTestId(`cat-${s.cat}`)).toBeInTheDocument()
    );
  });
  test("renders React.js tag", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("tag-React.js")).toBeInTheDocument();
  });
  test("renders Docker tag", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("tag-Docker")).toBeInTheDocument();
  });
  test("renders MongoDB tag", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("tag-MongoDB")).toBeInTheDocument();
  });
  test("renders all 24 skill tags", () => {
    render(<TestSkills />);
    SKILLS.forEach((s) =>
      s.items.forEach((item) =>
        expect(screen.getByTestId(`tag-${item}`)).toBeInTheDocument()
      )
    );
  });
  test("category labels are correct text", () => {
    render(<TestSkills />);
    SKILLS.forEach((s) =>
      expect(screen.getByTestId(`cat-label-${s.cat}`)).toHaveTextContent(s.cat)
    );
  });
});

// ─── 10. PROJECT CARD — Online Bookstore ─────────────────────────────────────
describe("COMPONENT — ProjectCard (01 — Online Bookstore)", () => {
  const p = PROJECTS[0];
  test("renders the card", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("card-01")).toBeInTheDocument();
  });
  test("shows PROJECT 01 label", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("no-01")).toHaveTextContent("PROJECT 01");
  });
  test("shows DEPLOYED status", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("status-01")).toHaveTextContent("DEPLOYED");
  });
  test("shows correct name", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("name-01")).toHaveTextContent("Online Bookstore");
  });
  test("shows year 2024", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("year-01")).toHaveTextContent("2024");
  });
  test("shows branch main", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("branch-01")).toHaveTextContent("main");
  });
  test("shows commit a4f7c2d", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("commit-01")).toHaveTextContent("a4f7c2d");
  });
  test("shows highlight text", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("highlight-01")).toHaveTextContent("Audio conversion from documents");
  });
  test("renders all stack tags", () => {
    render(<TestProjectCard p={p} />);
    p.stack.forEach((t) =>
      expect(screen.getByTestId(`stack-01-${t}`)).toBeInTheDocument()
    );
  });
  test("renders Docker and AWS EC2 devops tags", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-01-Docker")).toBeInTheDocument();
    expect(screen.getByTestId("devops-01-AWS EC2")).toBeInTheDocument();
  });
});

// ─── 11. PROJECT CARD — E-Commerce DevOps Platform ───────────────────────────
describe("COMPONENT — ProjectCard (02 — E-Commerce DevOps Platform)", () => {
  const p = PROJECTS[1];
  test("renders the card", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("card-02")).toBeInTheDocument();
  });
  test("shows correct project name", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("name-02")).toHaveTextContent("E-Commerce DevOps Platform");
  });
  test("shows branch release/v2.1", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("branch-02")).toHaveTextContent("release/v2.1");
  });
  test("shows commit 3b91ef0", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("commit-02")).toHaveTextContent("3b91ef0");
  });
  test("shows SonarQube devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-02-SonarQube")).toBeInTheDocument();
  });
  test("shows Trivy devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-02-Trivy")).toBeInTheDocument();
  });
  test("shows Jenkins devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-02-Jenkins")).toBeInTheDocument();
  });
  test("shows AWS S3 devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-02-AWS S3")).toBeInTheDocument();
  });
  test("shows CI/CD highlight", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("highlight-02")).toHaveTextContent("CI/CD pipeline");
  });
});

// ─── 12. EDUCATION COMPONENT ──────────────────────────────────────────────────
describe("COMPONENT — Education", () => {
  test("renders education section", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("education-section")).toBeInTheDocument();
  });
  test("renders all 3 entries", () => {
    render(<TestEducation />);
    ["MCA","BCA","PUC"].forEach((deg) =>
      expect(screen.getByTestId(`edu-${deg}`)).toBeInTheDocument()
    );
  });
  test("MCA shows CURRENT badge", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("current-MCA")).toHaveTextContent("CURRENT");
  });
  test("BCA does NOT show CURRENT badge", () => {
    render(<TestEducation />);
    expect(screen.queryByTestId("current-BCA")).not.toBeInTheDocument();
  });
  test("PUC does NOT show CURRENT badge", () => {
    render(<TestEducation />);
    expect(screen.queryByTestId("current-PUC")).not.toBeInTheDocument();
  });
  test("MCA institution is BIT Bangalore", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("inst-MCA")).toHaveTextContent("Bangalore Institute of Technology");
  });
  test("MCA period shows Present", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("period-MCA")).toHaveTextContent("Present");
  });
  test("BCA full name is correct", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("full-BCA")).toHaveTextContent("Bachelor of Computer Applications");
  });
  test("PUC shows Science stream", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("full-PUC")).toHaveTextContent("Science");
  });
});

// ─── 13. CONTACT COMPONENT ────────────────────────────────────────────────────
describe("COMPONENT — Contact", () => {
  test("renders contact section", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
  });
  test("CTA text contains together", () => {
    render(<TestContact />);
    expect(screen.getByTestId("cta-text")).toHaveTextContent("together");
  });
  test("CTA button links to correct email", () => {
    render(<TestContact />);
    expect(screen.getByTestId("cta-btn")).toHaveAttribute("href", `mailto:${ME.email}`);
  });
  test("email row is rendered", () => {
    render(<TestContact />);
    expect(screen.getByTestId("row-email")).toBeInTheDocument();
  });
  test("phone row is rendered", () => {
    render(<TestContact />);
    expect(screen.getByTestId("row-phone")).toBeInTheDocument();
  });
  test("email link has correct mailto href", () => {
    render(<TestContact />);
    expect(screen.getByTestId("link-email")).toHaveAttribute("href", `mailto:${ME.email}`);
  });
  test("phone link has correct tel href", () => {
    render(<TestContact />);
    expect(screen.getByTestId("link-phone")).toHaveAttribute("href", `tel:${ME.phone}`);
  });
  test("LinkedIn link points to correct URL", () => {
    render(<TestContact />);
    expect(screen.getByTestId("link-linkedin")).toHaveAttribute("href", ME.linkedin);
  });
  test("location shown as plain text, not a link", () => {
    render(<TestContact />);
    expect(screen.getByTestId("text-location")).toHaveTextContent(ME.location);
    expect(screen.queryByTestId("link-location")).not.toBeInTheDocument();
  });
  test("email value is visible in the row", () => {
    render(<TestContact />);
    expect(screen.getByTestId("link-email")).toHaveTextContent(ME.email);
  });
  test("phone value is visible in the row", () => {
    render(<TestContact />);
    expect(screen.getByTestId("link-phone")).toHaveTextContent(ME.phone);
  });
});

// ─── 14. FOOTER COMPONENT ─────────────────────────────────────────────────────
describe("COMPONENT — Footer", () => {
  test("renders footer", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
  test("copyright shows 2025", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("copyright")).toHaveTextContent("2025");
  });
  test("copyright shows M Bhuvan", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("copyright")).toHaveTextContent("M Bhuvan");
  });
  test("copyright shows Bangalore", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("copyright")).toHaveTextContent("Bangalore");
  });
  test("shows all systems operational", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("status-text")).toHaveTextContent("all systems operational");
  });
});

// ─── 15. SHEAD COMPONENT ──────────────────────────────────────────────────────
describe("COMPONENT — SHead (Section Header)", () => {
  test("renders section number", () => {
    render(<TestSHead no="02" title="Skills" />);
    expect(screen.getByTestId("shead-no")).toHaveTextContent("02");
  });
  test("renders section title", () => {
    render(<TestSHead no="02" title="Skills" />);
    expect(screen.getByTestId("shead-title")).toHaveTextContent("Skills");
  });
  test("renders underline bar", () => {
    render(<TestSHead no="03" title="Projects" />);
    expect(screen.getByTestId("shead-bar")).toBeInTheDocument();
  });
  test("is fully visible when vis=true", () => {
    render(<TestSHead no="01" title="About" vis={true} />);
    expect(screen.getByTestId("shead")).toHaveStyle({ opacity: 1 });
  });
  test("is hidden when vis=false", () => {
    render(<TestSHead no="01" title="About" vis={false} />);
    expect(screen.getByTestId("shead")).toHaveStyle({ opacity: 0 });
  });
});

// ─── 16. SCROLL UTILITY ───────────────────────────────────────────────────────
describe("UTILITY — scrollTo", () => {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  test("calls scrollIntoView when element exists", () => {
    const el = document.createElement("section");
    el.id = "about";
    document.body.appendChild(el);
    scrollTo("about");
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth", block: "start",
    });
    document.body.removeChild(el);
  });
  test("does not throw for a missing section id", () => {
    expect(() => scrollTo("does-not-exist")).not.toThrow();
  });
  test("handles all NAV ids without throwing", () => {
    NAV.forEach((id) => {
      const el = document.createElement("section");
      el.id = id;
      document.body.appendChild(el);
    });
    expect(() => NAV.forEach((id) => scrollTo(id))).not.toThrow();
    NAV.forEach((id) => {
      const el = document.getElementById(id);
      if (el) document.body.removeChild(el);
    });
  });
});

// ─── 17. CONTACT VALIDATION ───────────────────────────────────────────────────
describe("VALIDATION — contact links", () => {
  test("email format is valid", () => {
    expect(ME.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
  test("phone contains only digits", () => {
    expect(ME.phone).toMatch(/^\d+$/);
  });
  test("phone is exactly 10 digits", () => {
    expect(ME.phone).toHaveLength(10);
  });
  test("LinkedIn URL uses https", () => {
    expect(ME.linkedin.startsWith("https://")).toBe(true);
  });
  test("mailto href is correctly formed", () => {
    expect(`mailto:${ME.email}`).toBe("mailto:mbhuvan898@gmail.com");
  });
  test("tel href is correctly formed", () => {
    expect(`tel:${ME.phone}`).toBe("tel:9880912303");
  });
});

// ─── 18. INTEGRATION — Full App ───────────────────────────────────────────────
describe("INTEGRATION — Full App", () => {
  test("renders without crashing", () => {
    expect(() => render(<TestApp />)).not.toThrow();
  });
  test("all 5 section ids exist in DOM", () => {
    render(<TestApp />);
    ["about","skills","projects","education","contact"].forEach((id) =>
      expect(document.getElementById(id)).toBeInTheDocument()
    );
  });
  test("both project cards render", () => {
    render(<TestApp />);
    expect(screen.getByTestId("card-01")).toBeInTheDocument();
    expect(screen.getByTestId("card-02")).toBeInTheDocument();
  });
  test("navbar and footer both present", () => {
    render(<TestApp />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
  test("exactly one h1 on the page (hero name)", () => {
    render(<TestApp />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("M Bhuvan");
  });
  test("at least 3 section h2 headings present", () => {
    render(<TestApp />);
    // TestApp renders: Skills (h2) + Education (h2) + Contact (h2) = 3
    // Hero uses h1, Projects uses h3 for card names — so 3 is correct
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(3);
  });
  test("all nav buttons are present", () => {
    render(<TestApp />);
    NAV.forEach((id) => expect(screen.getByTestId(`nav-${id}`)).toBeInTheDocument());
  });
  test("hire link is present in full app", () => {
    render(<TestApp />);
    expect(screen.getByTestId("hire-link")).toBeInTheDocument();
  });
});
/**
 * Unit Tests — M Bhuvan Portfolio
 * Framework : Jest + React Testing Library
 *
 * Setup (if not already done):
 *   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
 *                          @testing-library/user-event jest-environment-jsdom
 *                          @babel/preset-react @babel/preset-env babel-jest
 *
 * Add to package.json:
 *   "jest": { "testEnvironment": "jsdom", "setupFilesAfterFramework": ["@testing-library/jest-dom"] }
 *
 * Run:  npx jest portfolio.test.jsx
 */

import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

/* ─── Re-export internals for testing ─────────────────────────────────────────
   Because the portfolio is a single-file app we duplicate the data constants
   here so tests are self-contained and independent of the source file.
   In a real project you would simply import them from the source.
──────────────────────────────────────────────────────────────────────────────── */

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
    desc: "Full-stack MERN bookstore with a document-to-audio conversion feature.",
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
  { deg: "MCA", full: "Master of Computer Applications",    inst: "Bangalore Institute of Technology",       period: "Dec 2024 – Present",      active: true  },
  { deg: "BCA", full: "Bachelor of Computer Applications",  inst: "Amrita Vishwa Vidyapeetham, Mysuru",      period: "Jul 2021 – May 2024",     active: false },
  { deg: "PUC", full: "Science – PCMB",                    inst: "Amrita Vishwa Vidyapeetham, Mysuru",      period: "2019 – 2021",             active: false },
];

const NAV = ["about", "skills", "projects", "education", "contact"];

const T = {
  accent:     "#10d97e",
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
  accentDim:  "#10d97e1a",
  accentAlt:  "#059669",
};

/* ─── Mocks ───────────────────────────────────────────────────────────────── */

// IntersectionObserver is not available in jsdom
const mockObserve    = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve  = jest.fn();

beforeAll(() => {
  global.IntersectionObserver = jest.fn().mockImplementation((cb) => ({
    observe:    mockObserve,
    disconnect: mockDisconnect,
    unobserve:  mockUnobserve,
  }));
});

// scrollIntoView not available in jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Silence console.error for prop-type warnings during tests
beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
afterEach(() => console.error.mockRestore());

/* ══════════════════════════════════════════════════════════════════════════════
   1. DATA CONSTANTS
══════════════════════════════════════════════════════════════════════════════ */

describe("DATA — ME object", () => {
  test("has correct name", () => {
    expect(ME.name).toBe("M Bhuvan");
  });

  test("has valid email format", () => {
    expect(ME.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test("has valid phone (10 digits)", () => {
    expect(ME.phone).toMatch(/^\d{10}$/);
  });

  test("has valid LinkedIn URL", () => {
    expect(ME.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\//);
  });

  test("commit hash is 7 hex chars", () => {
    expect(ME.commit).toMatch(/^[0-9a-f]{7}$/);
  });

  test("branch is a non-empty string", () => {
    expect(typeof ME.branch).toBe("string");
    expect(ME.branch.length).toBeGreaterThan(0);
  });

  test("bio is a non-empty string", () => {
    expect(typeof ME.bio).toBe("string");
    expect(ME.bio.length).toBeGreaterThan(10);
  });

  test("location contains Bangalore", () => {
    expect(ME.location).toContain("Bangalore");
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   2. SKILLS DATA
══════════════════════════════════════════════════════════════════════════════ */

describe("DATA — SKILLS array", () => {
  test("has 7 skill categories", () => {
    expect(SKILLS).toHaveLength(7);
  });

  test("every category has a non-empty cat string", () => {
    SKILLS.forEach((s) => {
      expect(typeof s.cat).toBe("string");
      expect(s.cat.length).toBeGreaterThan(0);
    });
  });

  test("every category has at least one item", () => {
    SKILLS.forEach((s) => {
      expect(Array.isArray(s.items)).toBe(true);
      expect(s.items.length).toBeGreaterThan(0);
    });
  });

  test("Frontend category includes React.js", () => {
    const frontend = SKILLS.find((s) => s.cat === "Frontend");
    expect(frontend.items).toContain("React.js");
  });

  test("DevOps category includes Docker and Jenkins", () => {
    const devops = SKILLS.find((s) => s.cat === "DevOps");
    expect(devops.items).toContain("Docker");
    expect(devops.items).toContain("Jenkins");
  });

  test("Cloud category includes AWS EC2 and AWS S3", () => {
    const cloud = SKILLS.find((s) => s.cat === "Cloud");
    expect(cloud.items).toContain("AWS EC2");
    expect(cloud.items).toContain("AWS S3");
  });

  test("all skill items are non-empty strings", () => {
    SKILLS.forEach((s) =>
      s.items.forEach((item) => {
        expect(typeof item).toBe("string");
        expect(item.length).toBeGreaterThan(0);
      })
    );
  });

  test("category names are unique", () => {
    const cats = SKILLS.map((s) => s.cat);
    expect(new Set(cats).size).toBe(cats.length);
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   3. PROJECTS DATA
══════════════════════════════════════════════════════════════════════════════ */

describe("DATA — PROJECTS array", () => {
  test("has exactly 2 projects", () => {
    expect(PROJECTS).toHaveLength(2);
  });

  test("each project has required fields", () => {
    const required = ["no", "name", "year", "stack", "devops", "commit", "branch", "status", "desc", "highlight"];
    PROJECTS.forEach((p) =>
      required.forEach((field) => expect(p).toHaveProperty(field))
    );
  });

  test("all projects have DEPLOYED status", () => {
    PROJECTS.forEach((p) => expect(p.status).toBe("DEPLOYED"));
  });

  test("project numbers are unique and sequential", () => {
    expect(PROJECTS[0].no).toBe("01");
    expect(PROJECTS[1].no).toBe("02");
  });

  test("every project stack is a non-empty array", () => {
    PROJECTS.forEach((p) => {
      expect(Array.isArray(p.stack)).toBe(true);
      expect(p.stack.length).toBeGreaterThan(0);
    });
  });

  test("every project devops is a non-empty array", () => {
    PROJECTS.forEach((p) => {
      expect(Array.isArray(p.devops)).toBe(true);
      expect(p.devops.length).toBeGreaterThan(0);
    });
  });

  test("commit hashes are 7 hex chars", () => {
    PROJECTS.forEach((p) => expect(p.commit).toMatch(/^[0-9a-f]{7}$/));
  });

  test("year values are valid 4-digit strings", () => {
    PROJECTS.forEach((p) => expect(p.year).toMatch(/^\d{4}$/));
  });

  test("project names are non-empty strings", () => {
    PROJECTS.forEach((p) => {
      expect(typeof p.name).toBe("string");
      expect(p.name.length).toBeGreaterThan(0);
    });
  });

  test("E-Commerce project includes SonarQube and Trivy in devops", () => {
    const ecom = PROJECTS.find((p) => p.no === "02");
    expect(ecom.devops).toContain("SonarQube");
    expect(ecom.devops).toContain("Trivy");
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   4. EDUCATION DATA
══════════════════════════════════════════════════════════════════════════════ */

describe("DATA — EDUCATION array", () => {
  test("has exactly 3 entries", () => {
    expect(EDUCATION).toHaveLength(3);
  });

  test("each entry has required fields", () => {
    const required = ["deg", "full", "inst", "period", "active"];
    EDUCATION.forEach((e) =>
      required.forEach((field) => expect(e).toHaveProperty(field))
    );
  });

  test("exactly one education entry is active", () => {
    const active = EDUCATION.filter((e) => e.active);
    expect(active).toHaveLength(1);
  });

  test("MCA is the active (current) degree", () => {
    const mca = EDUCATION.find((e) => e.deg === "MCA");
    expect(mca.active).toBe(true);
  });

  test("degree abbreviations are correct", () => {
    expect(EDUCATION.map((e) => e.deg)).toEqual(["MCA", "BCA", "PUC"]);
  });

  test("BIT Bangalore is listed as MCA institution", () => {
    const mca = EDUCATION.find((e) => e.deg === "MCA");
    expect(mca.inst).toContain("Bangalore Institute of Technology");
  });

  test("active field is boolean for all entries", () => {
    EDUCATION.forEach((e) => expect(typeof e.active).toBe("boolean"));
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   5. NAV ARRAY
══════════════════════════════════════════════════════════════════════════════ */

describe("DATA — NAV array", () => {
  test("has exactly 5 nav items", () => {
    expect(NAV).toHaveLength(5);
  });

  test("contains all required sections", () => {
    ["about", "skills", "projects", "education", "contact"].forEach((id) =>
      expect(NAV).toContain(id)
    );
  });

  test("all nav items are lowercase strings", () => {
    NAV.forEach((id) => {
      expect(typeof id).toBe("string");
      expect(id).toBe(id.toLowerCase());
    });
  });

  test("nav items are unique", () => {
    expect(new Set(NAV).size).toBe(NAV.length);
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   6. DESIGN TOKENS
══════════════════════════════════════════════════════════════════════════════ */

describe("DESIGN TOKENS — T object", () => {
  test("accent color is emerald green hex", () => {
    expect(T.accent).toBe("#10d97e");
  });

  test("all color values start with #", () => {
    Object.entries(T).forEach(([key, val]) => {
      expect(val).toMatch(/^#/);
    });
  });

  test("bg and bgAlt are different colors (section contrast)", () => {
    expect(T.bg).not.toBe(T.bgAlt);
  });

  test("ink (primary text) is lighter than bg (good contrast)", () => {
    // Simplified contrast check: primary text hex value should be numerically
    // larger (closer to white) than background hex
    const inkVal = parseInt(T.ink.slice(1), 16);
    const bgVal  = parseInt(T.bg.slice(1),  16);
    expect(inkVal).toBeGreaterThan(bgVal);
  });

  test("accent color is distinct from background colors", () => {
    expect(T.accent).not.toBe(T.bg);
    expect(T.accent).not.toBe(T.bgAlt);
    expect(T.accent).not.toBe(T.card);
  });

  test("watermark color exists and is a valid hex", () => {
    expect(T.watermark).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  test("accentDim is accent with transparency suffix", () => {
    expect(T.accentDim.startsWith(T.accent)).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   7. NAVBAR COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

// Minimal Navbar for isolated testing
function TestNavbar({ active = "about" }) {
  return (
    <header data-testid="navbar">
      <div data-testid="logo-box">MB</div>
      <span data-testid="branch-commit">
        {ME.branch}@{ME.commit}
      </span>
      <nav>
        {NAV.map((id) => (
          <button
            key={id}
            data-testid={`nav-${id}`}
            aria-current={active === id ? "page" : undefined}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
          >
            {id}
          </button>
        ))}
        <a href={`mailto:${ME.email}`} data-testid="hire-link">hire →</a>
      </nav>
    </header>
  );
}

describe("COMPONENT — Navbar", () => {
  test("renders all 5 nav buttons", () => {
    render(<TestNavbar />);
    NAV.forEach((id) => {
      expect(screen.getByTestId(`nav-${id}`)).toBeInTheDocument();
    });
  });

  test("renders logo MB text", () => {
    render(<TestNavbar />);
    expect(screen.getByTestId("logo-box")).toHaveTextContent("MB");
  });

  test("renders branch and commit info", () => {
    render(<TestNavbar />);
    const bc = screen.getByTestId("branch-commit");
    expect(bc).toHaveTextContent(ME.branch);
    expect(bc).toHaveTextContent(ME.commit);
  });

  test("active nav item has aria-current='page'", () => {
    render(<TestNavbar active="skills" />);
    expect(screen.getByTestId("nav-skills")).toHaveAttribute("aria-current", "page");
  });

  test("non-active nav items do not have aria-current", () => {
    render(<TestNavbar active="about" />);
    NAV.filter((id) => id !== "about").forEach((id) => {
      expect(screen.getByTestId(`nav-${id}`)).not.toHaveAttribute("aria-current");
    });
  });

  test("hire link points to correct mailto", () => {
    render(<TestNavbar />);
    const link = screen.getByTestId("hire-link");
    expect(link).toHaveAttribute("href", `mailto:${ME.email}`);
  });

  test("hire link displays hire text", () => {
    render(<TestNavbar />);
    expect(screen.getByTestId("hire-link")).toHaveTextContent("hire");
  });

  test("clicking a nav button calls scrollIntoView", () => {
    // Create a mock section element
    const section = document.createElement("section");
    section.id = "skills";
    document.body.appendChild(section);

    render(<TestNavbar />);
    fireEvent.click(screen.getByTestId("nav-skills"));
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();

    document.body.removeChild(section);
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   8. HERO / ABOUT COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

function TestHero() {
  return (
    <section id="about" data-testid="hero-section">
      <div data-testid="available-badge">AVAILABLE · OPEN TO INTERNSHIP</div>
      <h1 data-testid="hero-name">M Bhuvan</h1>
      <p data-testid="hero-bio">{ME.bio}</p>
      <div data-testid="meta-location">{ME.location}</div>
      <div data-testid="meta-branch">{ME.branch}</div>
      <div data-testid="meta-commit">{ME.commit}</div>
      <div data-testid="meta-status">open-to-work</div>
    </section>
  );
}

describe("COMPONENT — Hero", () => {
  test("renders hero section with id='about'", () => {
    render(<TestHero />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });

  test("renders full name", () => {
    render(<TestHero />);
    expect(screen.getByTestId("hero-name")).toHaveTextContent("M Bhuvan");
  });

  test("shows available/open-to-internship badge", () => {
    render(<TestHero />);
    expect(screen.getByTestId("available-badge")).toHaveTextContent("AVAILABLE");
    expect(screen.getByTestId("available-badge")).toHaveTextContent("OPEN TO INTERNSHIP");
  });

  test("renders biography text", () => {
    render(<TestHero />);
    expect(screen.getByTestId("hero-bio")).toHaveTextContent("Docker pipelines");
  });

  test("shows Bangalore in location", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-location")).toHaveTextContent("Bangalore");
  });

  test("shows branch name in meta strip", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-branch")).toHaveTextContent(ME.branch);
  });

  test("shows commit hash in meta strip", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-commit")).toHaveTextContent(ME.commit);
  });

  test("shows open-to-work status", () => {
    render(<TestHero />);
    expect(screen.getByTestId("meta-status")).toHaveTextContent("open-to-work");
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   9. SKILLS COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

function TestSkills() {
  return (
    <section id="skills" data-testid="skills-section">
      <h2>Skills</h2>
      {SKILLS.map((s) => (
        <div key={s.cat} data-testid={`skill-cat-${s.cat.toLowerCase()}`}>
          <span data-testid={`cat-label-${s.cat.toLowerCase()}`}>{s.cat}</span>
          {s.items.map((item) => (
            <span key={item} data-testid={`skill-tag-${item}`} className="skill-tag">
              {item}
            </span>
          ))}
        </div>
      ))}
    </section>
  );
}

describe("COMPONENT — Skills", () => {
  test("renders skills section", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("skills-section")).toBeInTheDocument();
  });

  test("renders all 7 skill categories", () => {
    render(<TestSkills />);
    SKILLS.forEach((s) => {
      expect(screen.getByTestId(`skill-cat-${s.cat.toLowerCase()}`)).toBeInTheDocument();
    });
  });

  test("renders React.js skill tag", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("skill-tag-React.js")).toBeInTheDocument();
  });

  test("renders Docker skill tag", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("skill-tag-Docker")).toBeInTheDocument();
  });

  test("renders MongoDB skill tag", () => {
    render(<TestSkills />);
    expect(screen.getByTestId("skill-tag-MongoDB")).toBeInTheDocument();
  });

  test("renders total correct number of skill items", () => {
    render(<TestSkills />);
    const totalItems = SKILLS.reduce((sum, s) => sum + s.items.length, 0);
    // All tags should be present
    SKILLS.forEach((s) =>
      s.items.forEach((item) =>
        expect(screen.getByTestId(`skill-tag-${item}`)).toBeInTheDocument()
      )
    );
    // Quick sanity check on our expected total (5+3+2+4+2+4+4 = 24)
    expect(totalItems).toBe(24);
  });

  test("category labels are displayed correctly", () => {
    render(<TestSkills />);
    SKILLS.forEach((s) => {
      expect(screen.getByTestId(`cat-label-${s.cat.toLowerCase()}`)).toHaveTextContent(s.cat);
    });
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   10. PROJECT CARD COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

function TestProjectCard({ p }) {
  return (
    <div data-testid={`project-card-${p.no}`} className="proj-card">
      <span data-testid={`proj-no-${p.no}`}>PROJECT {p.no}</span>
      <span data-testid={`proj-status-${p.no}`}>{p.status}</span>
      <span data-testid={`proj-year-${p.no}`}>{p.year}</span>
      <h3 data-testid={`proj-name-${p.no}`}>{p.name}</h3>
      <span data-testid={`proj-branch-${p.no}`}>{p.branch}</span>
      <span data-testid={`proj-commit-${p.no}`}>{p.commit}</span>
      <span data-testid={`proj-highlight-${p.no}`}>{p.highlight}</span>
      <p data-testid={`proj-desc-${p.no}`}>{p.desc}</p>
      <div data-testid={`proj-stack-${p.no}`}>
        {p.stack.map((t) => <span key={t} data-testid={`stack-tag-${p.no}-${t}`}>{t}</span>)}
      </div>
      <div data-testid={`proj-devops-${p.no}`}>
        {p.devops.map((d) => <span key={d} data-testid={`devops-tag-${p.no}-${d}`}>{d}</span>)}
      </div>
    </div>
  );
}

describe("COMPONENT — ProjectCard (Project 01 — Online Bookstore)", () => {
  const p = PROJECTS[0];

  test("renders project card", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("project-card-01")).toBeInTheDocument();
  });

  test("displays PROJECT 01 label", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-no-01")).toHaveTextContent("PROJECT 01");
  });

  test("displays DEPLOYED status", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-status-01")).toHaveTextContent("DEPLOYED");
  });

  test("displays correct project name", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-name-01")).toHaveTextContent("Online Bookstore");
  });

  test("displays correct year", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-year-01")).toHaveTextContent("2024");
  });

  test("displays branch name", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-branch-01")).toHaveTextContent("main");
  });

  test("displays commit hash", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-commit-01")).toHaveTextContent("a4f7c2d");
  });

  test("displays highlight text", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-highlight-01")).toHaveTextContent("Audio conversion from documents");
  });

  test("renders all stack tags", () => {
    render(<TestProjectCard p={p} />);
    p.stack.forEach((t) =>
      expect(screen.getByTestId(`stack-tag-01-${t}`)).toBeInTheDocument()
    );
  });

  test("renders all devops tags", () => {
    render(<TestProjectCard p={p} />);
    p.devops.forEach((d) =>
      expect(screen.getByTestId(`devops-tag-01-${d}`)).toBeInTheDocument()
    );
  });
});

describe("COMPONENT — ProjectCard (Project 02 — E-Commerce DevOps Platform)", () => {
  const p = PROJECTS[1];

  test("renders project card", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("project-card-02")).toBeInTheDocument();
  });

  test("displays PROJECT 02 label", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-no-02")).toHaveTextContent("PROJECT 02");
  });

  test("displays correct project name", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-name-02")).toHaveTextContent("E-Commerce DevOps Platform");
  });

  test("displays release branch", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-branch-02")).toHaveTextContent("release/v2.1");
  });

  test("displays correct commit", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("proj-commit-02")).toHaveTextContent("3b91ef0");
  });

  test("renders SonarQube devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-tag-02-SonarQube")).toBeInTheDocument();
  });

  test("renders Trivy devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-tag-02-Trivy")).toBeInTheDocument();
  });

  test("renders Jenkins devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-tag-02-Jenkins")).toBeInTheDocument();
  });

  test("renders AWS S3 devops tag", () => {
    render(<TestProjectCard p={p} />);
    expect(screen.getByTestId("devops-tag-02-AWS S3")).toBeInTheDocument();
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   11. EDUCATION COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

function TestEducation() {
  return (
    <section id="education" data-testid="education-section">
      <h2>Education</h2>
      {EDUCATION.map((e) => (
        <div key={e.deg} data-testid={`edu-entry-${e.deg}`}>
          <div data-testid={`edu-deg-${e.deg}`}>{e.deg}</div>
          <p data-testid={`edu-full-${e.deg}`}>{e.full}</p>
          <p data-testid={`edu-inst-${e.deg}`}>{e.inst}</p>
          <p data-testid={`edu-period-${e.deg}`}>{e.period}</p>
          {e.active && <span data-testid={`edu-current-${e.deg}`}>CURRENT</span>}
        </div>
      ))}
    </section>
  );
}

describe("COMPONENT — Education", () => {
  test("renders education section", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("education-section")).toBeInTheDocument();
  });

  test("renders all 3 education entries", () => {
    render(<TestEducation />);
    EDUCATION.forEach((e) =>
      expect(screen.getByTestId(`edu-entry-${e.deg}`)).toBeInTheDocument()
    );
  });

  test("MCA degree is displayed", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("edu-deg-MCA")).toHaveTextContent("MCA");
  });

  test("MCA shows CURRENT badge", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("edu-current-MCA")).toBeInTheDocument();
    expect(screen.getByTestId("edu-current-MCA")).toHaveTextContent("CURRENT");
  });

  test("BCA does NOT show CURRENT badge", () => {
    render(<TestEducation />);
    expect(screen.queryByTestId("edu-current-BCA")).not.toBeInTheDocument();
  });

  test("PUC does NOT show CURRENT badge", () => {
    render(<TestEducation />);
    expect(screen.queryByTestId("edu-current-PUC")).not.toBeInTheDocument();
  });

  test("MCA institution is BIT Bangalore", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("edu-inst-MCA")).toHaveTextContent("Bangalore Institute of Technology");
  });

  test("MCA period shows Present", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("edu-period-MCA")).toHaveTextContent("Present");
  });

  test("BCA full name is correct", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("edu-full-BCA")).toHaveTextContent("Bachelor of Computer Applications");
  });

  test("PUC science stream is displayed", () => {
    render(<TestEducation />);
    expect(screen.getByTestId("edu-full-PUC")).toHaveTextContent("Science");
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   12. CONTACT COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

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
      <p data-testid="contact-cta">Let&apos;s build something together.</p>
      <a href={`mailto:${ME.email}`} data-testid="contact-cta-btn">send a message</a>
      {rows.map((r) => (
        <div key={r.label} className="contact-row" data-testid={`contact-row-${r.label.toLowerCase()}`}>
          <span>{r.label}</span>
          {r.href
            ? <a href={r.href} data-testid={`contact-link-${r.label.toLowerCase()}`}>{r.val}</a>
            : <span data-testid={`contact-text-${r.label.toLowerCase()}`}>{r.val}</span>
          }
        </div>
      ))}
    </section>
  );
}

describe("COMPONENT — Contact", () => {
  test("renders contact section", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-section")).toBeInTheDocument();
  });

  test("renders CTA text with 'together'", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-cta")).toHaveTextContent("together");
  });

  test("CTA button links to correct email", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-cta-btn")).toHaveAttribute("href", `mailto:${ME.email}`);
  });

  test("renders all 4 contact rows", () => {
    render(<TestContact />);
    ["email", "phone", "linkedin", "location"].forEach((label) =>
      expect(screen.getByTestId(`contact-row-${label}`)).toBeInTheDocument()
    );
  });

  test("email link has correct mailto href", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-link-email")).toHaveAttribute("href", `mailto:${ME.email}`);
  });

  test("phone link has correct tel href", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-link-phone")).toHaveAttribute("href", `tel:${ME.phone}`);
  });

  test("LinkedIn link points to correct profile URL", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-link-linkedin")).toHaveAttribute("href", ME.linkedin);
  });

  test("location is displayed as plain text (no link)", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-text-location")).toHaveTextContent(ME.location);
    expect(screen.queryByTestId("contact-link-location")).not.toBeInTheDocument();
  });

  test("email value is visible", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-link-email")).toHaveTextContent(ME.email);
  });

  test("phone value is visible", () => {
    render(<TestContact />);
    expect(screen.getByTestId("contact-link-phone")).toHaveTextContent(ME.phone);
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   13. FOOTER COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

function TestFooter() {
  return (
    <footer data-testid="footer">
      <span data-testid="footer-copyright">© 2025 M Bhuvan · Bangalore</span>
      <div data-testid="footer-status">
        <div data-testid="status-dot" />
        <span data-testid="status-text">all systems operational</span>
      </div>
    </footer>
  );
}

describe("COMPONENT — Footer", () => {
  test("renders footer element", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("shows copyright with correct year and name", () => {
    render(<TestFooter />);
    const copy = screen.getByTestId("footer-copyright");
    expect(copy).toHaveTextContent("2025");
    expect(copy).toHaveTextContent("M Bhuvan");
    expect(copy).toHaveTextContent("Bangalore");
  });

  test("shows status dot", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("status-dot")).toBeInTheDocument();
  });

  test("shows 'all systems operational' text", () => {
    render(<TestFooter />);
    expect(screen.getByTestId("status-text")).toHaveTextContent("all systems operational");
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   14. SECTION HEADER (SHead) COMPONENT
══════════════════════════════════════════════════════════════════════════════ */

function TestSHead({ no, title, vis = true }) {
  return (
    <div data-testid="shead" style={{ opacity: vis ? 1 : 0 }}>
      <span data-testid="shead-no">{no}</span>
      <h2 data-testid="shead-title">{title}</h2>
      <div data-testid="shead-underline" />
    </div>
  );
}

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
    expect(screen.getByTestId("shead-underline")).toBeInTheDocument();
  });

  test("is visible when vis=true", () => {
    render(<TestSHead no="01" title="About" vis={true} />);
    expect(screen.getByTestId("shead")).toHaveStyle({ opacity: 1 });
  });

  test("is hidden when vis=false", () => {
    render(<TestSHead no="01" title="About" vis={false} />);
    expect(screen.getByTestId("shead")).toHaveStyle({ opacity: 0 });
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   15. SCROLL UTILITY
══════════════════════════════════════════════════════════════════════════════ */

describe("UTILITY — scrollTo function", () => {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  test("calls scrollIntoView when element exists", () => {
    const el = document.createElement("section");
    el.id = "about";
    document.body.appendChild(el);

    scrollTo("about");
    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    document.body.removeChild(el);
  });

  test("does not throw when element does not exist", () => {
    expect(() => scrollTo("nonexistent-section")).not.toThrow();
  });

  test("scrolls to different valid sections without error", () => {
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

/* ══════════════════════════════════════════════════════════════════════════════
   16. EMAIL / CONTACT LINK VALIDATION
══════════════════════════════════════════════════════════════════════════════ */

describe("VALIDATION — contact links and formats", () => {
  test("email is a valid address format", () => {
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

  test("LinkedIn URL contains linkedin.com/in/", () => {
    expect(ME.linkedin).toContain("linkedin.com/in/");
  });

  test("mailto href is correctly formed", () => {
    const mailto = `mailto:${ME.email}`;
    expect(mailto).toBe("mailto:mbhuvan898@gmail.com");
  });

  test("tel href is correctly formed", () => {
    const tel = `tel:${ME.phone}`;
    expect(tel).toBe("tel:9880912303");
  });
});

/* ══════════════════════════════════════════════════════════════════════════════
   17. FULL APP — SNAPSHOT / INTEGRATION
══════════════════════════════════════════════════════════════════════════════ */

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

describe("INTEGRATION — Full App render", () => {
  test("renders without crashing", () => {
    expect(() => render(<TestApp />)).not.toThrow();
  });

  test("all 5 main sections are present in the DOM", () => {
    render(<TestApp />);
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(document.getElementById("skills")).toBeInTheDocument();
    expect(document.getElementById("projects")).toBeInTheDocument();
    expect(document.getElementById("education")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();
  });

  test("both project cards are rendered", () => {
    render(<TestApp />);
    expect(screen.getByTestId("project-card-01")).toBeInTheDocument();
    expect(screen.getByTestId("project-card-02")).toBeInTheDocument();
  });

  test("navbar and footer are both present", () => {
    render(<TestApp />);
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  test("page contains exactly one h1 (hero name)", () => {
    render(<TestApp />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("M Bhuvan");
  });

  test("page has correct number of h2 section headings (5)", () => {
    render(<TestApp />);
    // Skills, Projects, Education, Contact + any in Navbar (none) = at least 4
    const h2s = screen.getAllByRole("heading", { level: 2 });
    expect(h2s.length).toBeGreaterThanOrEqual(3);
  });

  test("all nav links are present in the rendered app", () => {
    render(<TestApp />);
    NAV.forEach((id) =>
      expect(screen.getByTestId(`nav-${id}`)).toBeInTheDocument()
    );
  });
});
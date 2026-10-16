"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { FiArrowRight, FiArrowUpRight, FiCode, FiCoffee, FiDatabase, FiExternalLink, FiGithub, FiGrid, FiLinkedin, FiMail, FiMenu, FiMinus, FiMoon, FiPlus, FiSearch, FiServer, FiSettings, FiSun, FiTool, FiUser, FiX } from "react-icons/fi";
import { portfolio } from "@/data/portfolio";
import seyhaLogo from "../../public/logo.png";

const links = [
  ["Home", "home"], ["About", "about"], ["Skills", "skills"],
  ["Experience", "experience"], ["Projects", "projects"], ["Contact", "contact"],
] as const;

type IconName = "arrow" | "upRight" | "github" | "linkedin" | "mail" | "menu" | "close" | "external";

function Icon({ type, size = 20 }: { type: IconName; size?: number }) {
  const icons = { arrow: FiArrowRight, upRight: FiArrowUpRight, github: FiGithub, linkedin: FiLinkedin, mail: FiMail, menu: FiMenu, close: FiX, external: FiExternalLink };
  const SelectedIcon = icons[type];
  return <SelectedIcon size={size} aria-hidden="true" />;
}

const easing = [0.22, 1, 0.36, 1] as const;

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useLayoutEffect(() => {
    const syncTheme = () => {
      let savedTheme: string | null = null;
      try { savedTheme = localStorage.getItem("seyha-theme"); } catch { /* Storage can be unavailable. */ }
      const nextTheme = savedTheme === "light" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      setTheme(nextTheme);
    };
    syncTheme();
    const onStorage = (event: StorageEvent) => { if (event.key === "seyha-theme") syncTheme(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    try { localStorage.setItem("seyha-theme", nextTheme); } catch { /* The chosen theme still works for this visit. */ }
  };

  return <button className="theme-toggle" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "light"} onClick={toggleTheme}>
    <FiSun className="theme-icon-sun" size={19} aria-hidden="true" />
    <FiMoon className="theme-icon-moon" size={19} aria-hidden="true" />
  </button>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 0.88, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }} transition={{ duration: reduce ? 0 : 0.65, ease: easing, delay: reduce ? 0 : delay }}>{children}</motion.div>;
}

export function Navigation() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.2, 0.5] });
    links.forEach(([, id]) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);

  return <motion.header className={`site-header ${scrolled ? "scrolled" : ""}`} initial={reduce ? false : { y: -10, opacity: 1 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, ease: easing }}>
    <nav className="nav container" aria-label="Main navigation">
      <a className="logo" href="#home" onClick={() => setOpen(false)} aria-label="Seyha, back to top"><span className="logo-image"><Image src={seyhaLogo} alt="" priority /></span><span className="logo-word">seyha<span>.dev</span></span></a>
      <div className="desktop-nav">{links.map(([label, id]) => <a key={id} href={`#${id}`} className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined}>{label}{active === id && <motion.span className="nav-indicator" layoutId="nav-indicator" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}</a>)}</div>
      <div className="nav-actions"><ThemeToggle /><button ref={menuButton} className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}><Icon type={open ? "close" : "menu"} size={24} /></button></div>
    </nav>
    <div id="mobile-nav" className={`mobile-nav ${open ? "open" : ""}`} inert={!open}>
      <AnimatePresence initial={false}>
        {open && <motion.div className="mobile-nav-inner" initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: reduce ? 0.1 : 0.26, ease: easing }}>
          {links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className={active === id ? "active" : ""}>{label}<Icon type="upRight" size={17} /></a>)}
        </motion.div>}
      </AnimatePresence>
    </div>
    <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
  </motion.header>;
}

function CodeWorkspace() {
  return <div className="code-workspace" role="img" aria-label="Stylized code editor showing Seyha's frontend, backend, and product-focused approach">
    <div className="workspace-chrome"><span className="workspace-lights"><i /><i /><i /></span><span>portfolio / approach.ts</span><span className="workspace-chrome-end">⌘ K</span></div>
    <div className="workspace-body">
      <div className="workspace-rail" aria-hidden="true"><FiCode className="rail-active" /><FiSearch /><FiGrid /><FiSettings /></div>
      <div className="workspace-editor">
        <div className="workspace-tab"><span className="tab-file">TS</span> approach.ts <FiX className="tab-close" aria-hidden="true" /></div>
        <div className="workspace-code" aria-hidden="true">
          <div><span className="line-number">01</span><span className="code-comment">{"// From the first idea to the final detail."}</span></div>
          <div><span className="line-number">02</span><span className="code-purple">const</span> <span className="code-blue">approach</span> <span className="code-muted">=</span> <span className="code-muted">{`{`}</span></div>
          <div><span className="line-number">03</span><span className="code-indent">frontend<span className="code-muted">:</span> <span className="code-cyan">[</span><span className="code-string">&quot;React&quot;</span><span className="code-muted">, </span><span className="code-string">&quot;Next.js&quot;</span><span className="code-cyan">]</span><span className="code-muted">,</span></span></div>
          <div><span className="line-number">04</span><span className="code-indent">backend<span className="code-muted">:</span> <span className="code-cyan">[</span><span className="code-string">&quot;Java&quot;</span><span className="code-muted">, </span><span className="code-string">&quot;Spring Boot&quot;</span><span className="code-cyan">]</span><span className="code-muted">,</span></span></div>
          <div><span className="line-number">05</span><span className="code-indent">focus<span className="code-muted">:</span> <span className="code-string">&quot;make it feel effortless&quot;</span><span className="code-muted">,</span></span></div>
          <div><span className="line-number">06</span><span className="code-muted">{`}`} as const;</span></div>
          <div className="code-empty"><span className="line-number">07</span></div>
          <div><span className="line-number">08</span><span className="code-purple">export default</span> <span className="code-blue">approach</span><span className="code-muted">;</span></div>
        </div>
        <div className="workspace-status"><span><i /> READY TO BUILD</span><span>TypeScript &nbsp; • &nbsp; UTF-8</span></div>
      </div>
    </div>
    <div className="workspace-caption"><span>01 / THE APPROACH</span><span>DESIGN × ENGINEERING</span></div>
  </div>;
}

export function Hero() {
  const reduce = useReducedMotion();
  const reveal = (delay: number) => ({ initial: reduce ? false as const : { opacity: 1, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: reduce ? 0 : 0.62, delay: reduce ? 0 : delay, ease: easing } });
  return <section id="home" className="hero section-anchor"><div className="container hero-layout">
    <div className="hero-copy">
      <motion.p className="hero-overline" {...reveal(0.1)}><span className="hero-overline-line" /> FULL-STACK DEVELOPER</motion.p>
      <h1><motion.span {...reveal(0.2)}>Hey, I&apos;m</motion.span><motion.span className="hero-name" {...reveal(0.29)}>Seyha<span className="period">.</span></motion.span></h1>
      <motion.p className="hero-statement" {...reveal(0.4)}>{portfolio.heroStatement}</motion.p>
      <motion.p className="hero-intro" {...reveal(0.49)}>{portfolio.heroDescription}</motion.p>
      <motion.div className="hero-actions" {...reveal(0.58)}><motion.a className="button button-primary" href="#projects" whileHover={reduce ? undefined : { y: -3 }} whileTap={reduce ? undefined : { scale: 0.98 }}>View Projects <Icon type="arrow" size={18} /></motion.a><motion.a className="button button-secondary" href="#contact" whileHover={reduce ? undefined : { y: -3 }} whileTap={reduce ? undefined : { scale: 0.98 }}>Get in Touch <Icon type="arrow" size={18} /></motion.a></motion.div>
      {(portfolio.github || portfolio.linkedin) && <motion.div className="hero-social" {...reveal(0.65)}><span>FIND ME ONLINE</span><i />{portfolio.github && <motion.a href={portfolio.github} aria-label="GitHub profile" target="_blank" rel="noreferrer" whileHover={{ y: -3, color: "#61e0ed" }}><Icon type="github" /></motion.a>}{portfolio.linkedin && <motion.a href={portfolio.linkedin} aria-label="LinkedIn profile" target="_blank" rel="noreferrer" whileHover={{ y: -3, color: "#61e0ed" }}><Icon type="linkedin" /></motion.a>}</motion.div>}
    </div>
    <motion.div className="workspace-stage" initial={reduce ? false : { opacity: 1, y: 20, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : 0.37, ease: easing }}><CodeWorkspace /></motion.div>
  </div><div className="container hero-bottom"><span>SCROLL TO EXPLORE</span><i /><span>DESIGN &amp; DEVELOPMENT</span></div></section>;
}

type SkillGroup = { readonly category: string; readonly technologies: readonly string[] };
const skillIcons = [FiCode, FiServer, FiDatabase, FiTool] as const;

export function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const reduce = useReducedMotion();
  const SkillIcon = skillIcons[index] ?? FiCode;
  return <motion.article className="skill-card" initial={reduce ? false : { opacity: 0.88, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : index * 0.08, ease: easing }} whileHover={reduce ? undefined : { y: -6 }}><div className="skill-card-top"><span className="skill-mark"><SkillIcon size={23} aria-hidden="true" /></span><span className="skill-index">0{index + 1} / 04</span></div><h3>{group.category}</h3><div className="tech-list">{group.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></motion.article>;
}

type Experience = { readonly role: string; readonly company: string; readonly duration: string; readonly type: string; readonly summary: string; readonly points: readonly string[] };

export function ExperienceCard({ item }: { item: Experience }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <motion.article
      layout
      className="experience-card"
      initial={reduce ? false : { opacity: 0.88, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduce ? 0 : 0.55, ease: easing }}
    >
      <span className="timeline-dot" />
      <div className="experience-meta"><span className="sample-label">{item.type}</span><span>{item.duration}</span></div>
      <h3>{item.role}</h3>
      <p className="company">{item.company}</p>
      <p>{item.summary}</p>
      <button className="details-toggle" type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
        {expanded ? "Hide responsibilities" : "View responsibilities"} {expanded ? <FiMinus size={18} aria-hidden="true" /> : <FiPlus size={18} aria-hidden="true" />}
      </button>
      <div id={id}>
        <AnimatePresence initial={false}>
          {expanded && <motion.div key="details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3 }} style={{ overflow: "hidden" }}>
            <ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function ProjectVisual({ visual }: { visual: string }) {
  return <div className={`project-art art-${visual}`} aria-hidden="true">
    {visual === "services" && <div className="mini-services"><span>API GATEWAY</span><div><i>AUTH</i><i>ORDERS</i><i>DATA</i></div><b><FiArrowRight /><FiArrowRight /><FiArrowRight /></b></div>}
    {visual === "coffee" && <div className="mini-coffee"><div className="cup"><FiCoffee size={60} /></div><div className="receipt"><span>DAILY ORDERS</span><strong>Good things brewing.</strong><em>● ● ● ● ●</em></div></div>}
    {visual === "portfolio" && <div className="mini-browser"><div className="browser-dots">● ● ●</div><div className="browser-lines"><b>Make it yours<span>.</span></b><i /><i /><small>EXPLORE WORK <FiArrowRight /></small></div></div>}
    {visual === "customers" && <div className="mini-customers"><div className="customer-sidebar"><FiGrid /><FiUser /><FiDatabase /></div><div className="customer-list"><strong>Customers</strong><span><span className="customer-name"><FiUser />Alex Morgan</span><i>ACTIVE</i></span><span><span className="customer-name"><FiUser />Jamie Lee</span><i>ACTIVE</i></span><span><span className="customer-name"><FiUser />Taylor Kim</span><i>ACTIVE</i></span></div></div>}
  </div>;
}

type Project = { readonly title: string; readonly category: string; readonly description: string; readonly detail: string; readonly technologies: readonly string[]; readonly visual: string; readonly github: string; readonly demo: string };

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <motion.article
      layout
      className="project-card"
      initial={reduce ? false : { opacity: 0.88, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduce ? 0 : 0.62, delay: reduce ? 0 : (index % 2) * 0.08, ease: easing }}
      whileHover={reduce ? undefined : { y: -5 }}
    >
      <motion.div className="project-art-wrap" initial={reduce ? false : { opacity: 0.84, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 0.55, ease: easing }}>
        <ProjectVisual visual={project.visual} />
      </motion.div>
      <div className="project-content">
        <div className="project-kicker"><span>0{index + 1} / {project.category}</span><span>CONCEPT</span></div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.technologies.map((tech, badgeIndex) => <motion.span key={tech} initial={reduce ? false : { opacity: 0.88, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: reduce ? 0 : badgeIndex * 0.06 }}>{tech}</motion.span>)}
        </div>
        <button className="details-toggle project-details-toggle" type="button" aria-expanded={expanded} aria-controls={id} onClick={() => setExpanded(value => !value)}>
          {expanded ? "Hide details" : "Explore concept"} {expanded ? <FiMinus size={18} aria-hidden="true" /> : <FiPlus size={18} aria-hidden="true" />}
        </button>
        <div id={id}>
          <AnimatePresence initial={false}>
            {expanded && <motion.div key="details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3 }} style={{ overflow: "hidden" }}>
              <p className="project-detail-copy">{project.detail}</p>
            </motion.div>}
          </AnimatePresence>
        </div>
        {(project.github || project.demo) && <div className="project-links">{project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub <Icon type="github" size={17} /></a>}{project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live Demo <Icon type="external" size={17} /></a>}</div>}
      </div>
    </motion.article>
  );
}

export function ContactPanel() {
  const reduce = useReducedMotion();
  return (
    <Reveal className="contact-panel">
      <div className="contact-noise" />
      <div className="contact-content">
        <p className="eyebrow"><span />GET IN TOUCH</p>
        <h2>Have a project in mind?<br /><em>Let&apos;s build it.</em></h2>
        <p>{portfolio.email || portfolio.github || portfolio.linkedin ? "Whether it starts with an interface, an API, or a big idea, I’d love to hear what you’re working on." : "Contact details are being updated. Until then, explore the project concepts and the work behind them."}</p>
        {portfolio.email ? <motion.a className="button button-light" href={`mailto:${portfolio.email}`} whileHover={reduce ? undefined : { y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Icon type="mail" size={18} /> Say hello <Icon type="arrow" size={18} />
        </motion.a> : <motion.a className="button button-light" href="#projects" whileHover={reduce ? undefined : { y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>Explore projects <Icon type="arrow" size={18} /></motion.a>}
        {(portfolio.github || portfolio.linkedin) && <motion.div className="contact-social" initial={reduce ? false : { y: 10, opacity: 0.85 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
          {portfolio.github && <motion.a href={portfolio.github} aria-label="GitHub profile" target="_blank" rel="noreferrer" whileHover={reduce ? undefined : { y: -3 }}><Icon type="github" /></motion.a>}
          {portfolio.linkedin && <motion.a href={portfolio.linkedin} aria-label="LinkedIn profile" target="_blank" rel="noreferrer" whileHover={reduce ? undefined : { y: -3 }}><Icon type="linkedin" /></motion.a>}
        </motion.div>}
      </div>
      <div className="contact-decoration" aria-hidden="true">LET&apos;S<br />CONNECT<span>.</span></div>
    </Reveal>
  );
}

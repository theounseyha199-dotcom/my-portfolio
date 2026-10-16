import Image from "next/image";
import { FiArrowUp, FiArrowUpRight } from "react-icons/fi";
import { ContactPanel, ExperienceCard, Hero, Navigation, ProjectCard, Reveal, SkillCard } from "@/components/portfolio-motion";
import { portfolio } from "@/data/portfolio";
import seyhaLogo from "../../public/logo.png";
import seyhaPortrait from "../../public/seyha.png";

function Heading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <Reveal className="section-heading"><p className="eyebrow"><span />{eyebrow}</p><h2>{title}</h2>{description && <p className="section-description">{description}</p>}</Reveal>;
}

export default function Home() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation />
    <main id="main">
      <Hero />

      <section id="about" className="section about-section section-anchor"><div className="container">
        <Heading eyebrow="ABOUT ME" title="Thoughtful code. Real-world impact." />
        <div className="about-layout">
          <Reveal className="about-photo-frame">
            <Image src={seyhaPortrait} alt="Seyha smiling and giving two thumbs up" width={960} height={1280} sizes="(max-width: 600px) calc(100vw - 36px), (max-width: 800px) 500px, 480px" placeholder="blur" loading="lazy" className="about-photo" style={{ width: "100%", height: "auto" }} />
            <span className="portrait-index">ABOUT / SEYHA</span>
            <div className="portrait-caption"><strong>Seyha<span>.</span></strong><small>FULL-STACK DEVELOPER</small></div>
          </Reveal>
          <div className="about-content">
            <Reveal className="about-statement" delay={0.08}><span>“</span><p>I care about the details people <em>see</em> and the systems they <em>don&apos;t.</em></p></Reveal>
            <Reveal className="about-details" delay={0.16}><p>{portfolio.about}</p><p>I work with Java, Spring Boot, React, Next.js, and microservices to connect products from end to end.</p><div className="focus-list">{portfolio.focus.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><FiArrowUpRight aria-hidden="true" className="focus-arrow" /></div>)}</div></Reveal>
          </div>
        </div>
      </div></section>

      <section id="skills" className="section skills-section section-anchor"><div className="container">
        <Heading eyebrow="TECH STACK" title="Tools for every layer." description="A practical toolkit for building polished experiences and dependable foundations." />
        <div className="skills-grid">{portfolio.skills.map((group, index) => <SkillCard group={group} index={index} key={group.category} />)}</div>
      </div></section>

      <section id="experience" className="section experience-section section-anchor"><div className="container">
        <Heading eyebrow="EXPERIENCE" title="The work behind the work." description="A place for the roles, teams, and challenges that shaped my practice." />
        <div className="experience-layout"><Reveal className="experience-aside"><FiArrowUpRight aria-hidden="true" /><p>Good products are built by connecting clear thinking, careful execution, and collaboration.</p></Reveal><div className="timeline">{portfolio.experience.map(item => <ExperienceCard item={item} key={item.role} />)}</div></div>
      </div></section>

      <section id="projects" className="section projects-section section-anchor"><div className="container">
        <div className="projects-heading"><Heading eyebrow="SELECTED WORK" title="Ideas made tangible." description="Project concepts that show the range of products and systems I like to build." /><span className="project-count">04 / CONCEPT PROJECTS</span></div>
        <div className="projects-grid">{portfolio.projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}</div>
      </div></section>

      <section id="contact" className="contact-section section-anchor"><div className="container"><ContactPanel /></div></section>
    </main>
    <footer className="footer"><div className="container footer-inner"><a className="logo" href="#home" aria-label="Seyha, back to top"><span className="logo-image"><Image src={seyhaLogo} alt="" loading="lazy" /></span><span className="logo-word">seyha<span>.dev</span></span></a><p>Built with care, from interface to infrastructure.</p><div><a href="#home">Back to top <FiArrowUp size={14} aria-hidden="true" /></a><span>© Seyha</span></div></div></footer>
  </>;
}

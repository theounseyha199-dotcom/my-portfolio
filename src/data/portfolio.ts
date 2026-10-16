/** Edit this file to personalize the portfolio. Leave unknown URLs empty so no dead links appear. */
export const portfolio = {
  name: "Seyha",
  role: "Full-Stack Developer",
  email: "", // Add a real address to show the email action.
  github: "",
  linkedin: "",
  intro:
    "I build modern applications, scalable APIs, and clean user experiences—connecting thoughtful interfaces with dependable systems.",
  heroStatement: "I build digital experiences that work beautifully.",
  heroDescription:
    "From intuitive frontend interfaces to scalable backend systems, I turn ideas into modern digital products.",
  about:
    "I enjoy working across the stack, from the details of an interface to the architecture that keeps it running. My focus is on clear, maintainable solutions that make complex ideas feel simple to use.",
  focus: ["Frontend craft", "Backend systems", "System architecture"],
  skills: [
    { category: "Frontend", technologies: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"] },
    { category: "Backend", technologies: ["Java", "Spring Boot", "Python", "REST APIs", "Microservices"] },
    { category: "Database", technologies: ["PostgreSQL", "MySQL", "SQL Server", "MongoDB"] },
    { category: "Tools & DevOps", technologies: ["Git", "GitHub", "Docker", "Gradle", "IntelliJ IDEA"] },
  ],
  // Replace the sample below with verified work history before publishing.
  experience: [
    {
      role: "Your position",
      company: "Company name",
      duration: "Add dates",
      type: "Example entry",
      summary: "Describe the product, your responsibilities, and the impact of your work here.",
      points: ["A notable frontend or full-stack contribution", "A backend, API, or architecture responsibility"],
    },
  ],
  // These are concept examples. Add real descriptions and URLs when available.
  projects: [
    {
      title: "Microservices Architecture",
      category: "Distributed systems",
      description: "A concept for independently deployable services with clear API boundaries and resilient communication.",
      detail: "Explore service boundaries, request flow, and deployment choices as one connected architecture.",
      technologies: ["Java", "Spring Boot", "Docker"],
      visual: "services",
      github: "",
      demo: "",
    },
    {
      title: "Coffee Shop Management System",
      category: "Operations platform",
      description: "An example workflow for orders, inventory, and daily operations in one focused interface.",
      detail: "The concept centers on a calmer day-to-day workflow for a busy team, from orders through inventory.",
      technologies: ["React", "Spring Boot", "PostgreSQL"],
      visual: "coffee",
      github: "",
      demo: "",
    },
    {
      title: "Portfolio Builder",
      category: "Creative tooling",
      description: "A flexible concept for presenting projects and experience with a polished, personal feel.",
      detail: "Content and layout are designed to make individual stories easy to edit and pleasant to explore.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      visual: "portfolio",
      github: "",
      demo: "",
    },
    {
      title: "Customer Management System",
      category: "Business application",
      description: "An example customer workspace designed around clarity, efficient search, and useful records.",
      detail: "The workspace concept keeps customer context close to the actions people take most often.",
      technologies: ["Java", "React", "MySQL"],
      visual: "customers",
      github: "",
      demo: "",
    },
  ],
} as const;

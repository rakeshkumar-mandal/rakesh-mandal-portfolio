const experiences = [
  {
    company: 'Freelance Work',
    role: 'MERN Stack Developer',
    duration: 'Jan 2026 — Present',
    type: 'Freelance',
    achievements: [
      'Developed "Ganesh Manpower Solution," a production-ready website for a Delhi-NCR based agency.',
      'Managed the entire project lifecycle from gathering client requirements to deploying on modern platforms.',
      'Integrated responsive UI with Tailwind CSS and configured WhatsApp APIs for direct client communication.',
      'Focused on writing clean, maintainable code to ensure future scalability for the client.',
    ],
  },
  {
    company: 'ShadowFox',
    role: 'Web Development Intern',
    duration: 'May 2025',
    type: 'Internship',
    achievements: [
      'Completed a beginner-level virtual internship program focusing on foundational web development skills.',
      'Participated in structured tasks to understand industry-standard workflows and basic project implementation.',
      'Gained hands-on experience by building small functional components and applying core frontend concepts.',
    ],
  },
  {
    company: 'Self-Driven Technical Growth',
    role: 'Independent Learner & Problem Solver',
    duration: '2023 — Present',
    type: 'Continuous Learning',
    achievements: [
      'Consistently solving Data Structures and Algorithms (DSA) problems in C++ to build a strong logical foundation.',
      'Upskilling in modern full-stack technologies by building functional clones and MERN stack applications.',
      'Strengthening core Computer Science fundamentals (OOP, DBMS, OS) to prepare for industry-level challenges.',
      'Experimenting with third-party API integrations, including incorporating AI tools like Gemini into practical projects.',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <div className="reveal">
        <div className="section-label">Career Milestones</div>
        <h2 className="section-title">My Development <span className="grad-text">Journey</span></h2>
        <p className="section-sub">Continuous learning through practical projects, freelance work, and professional certifications.</p>
      </div>
      <div className="exp-timeline">
        {experiences.map((exp, i) => (
          <div className={`exp-item reveal${i > 0 ? ` reveal-delay${i}` : ''}`} key={i}>
            <div className="exp-dot" />
            <div className="exp-card">
              <div className="exp-top">
                <div>
                  <div className="exp-company">{exp.company}</div>
                  <div className="exp-role">{exp.role} · <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>{exp.type}</span></div>
                </div>
                <div className="exp-duration">{exp.duration}</div>
              </div>
              <ul className="exp-achievements">
                {exp.achievements.map((a, j) => (
                  <li key={j}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
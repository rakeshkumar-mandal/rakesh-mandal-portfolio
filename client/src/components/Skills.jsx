import { useEffect } from 'react';

const categories = [
  {
    label: 'Frontend',
    skills: [
      { icon: '⚛️', name: 'React.js', pct: 92 },
      { icon: '▲', name: 'Next.js', pct: 78 },
      { icon: '⚡', name: 'JavaScript (ES6+)', pct: 90 },
      { icon: '🎨', name: 'Tailwind CSS', pct: 88 },
      { icon: '💅', name: 'HTML5 / CSS3', pct: 95 },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { icon: '🟢', name: 'Node.js', pct: 85 },
      { icon: '🚂', name: 'Express.js', pct: 88 },
      { icon: '🔌', name: 'REST APIs', pct: 90 },
      { icon: '🔐', name: 'JWT Auth', pct: 82 },
      { icon: '🤖', name: 'Gemini AI', pct: 75 },
    ],
  },
  {
    label: 'Database & Deployment',
    skills: [
      { icon: '🍃', name: 'MongoDB', pct: 85 },
      { icon: '🐬', name: 'MySQL', pct: 70 },
      { icon: '🐙', name: 'Git & GitHub', pct: 90 },
      { icon: '▲', name: 'Vercel', pct: 85 },
      { icon: '🌐', name: 'Render', pct: 80 },
    ],
  },
  {
    label: 'Core & Tools',
    skills: [
      { icon: '➕', name: 'C++ / DSA', pct: 80 },
      { icon: '🧱', name: 'OOP', pct: 87 },
      { icon: '🐍', name: 'Python (Basics)', pct: 72 },
      { icon: '🔗', name: 'Postman', pct: 88 },
      { icon: '💻', name: 'VS Code', pct: 95 },
    ],
  },
];

export default function Skills() {
  useEffect(() => {
    const fills = document.querySelectorAll('.skill-fill');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const w = e.target.getAttribute('data-w');
          e.target.style.width = w + '%';
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    fills.forEach(f => observer.observe(f));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills">
      <div className="reveal">
        <div className="section-label">Technical Skills</div>
        <h2 className="section-title">The Stack I <span className="grad-text">Build With</span></h2>
        {/* Sub-heading ko safe aur impactful bana diya gaya hai */}
        <p className="section-sub">
          Proficient in the MERN stack, with strong problem-solving skills in C++ and a solid foundation in core computer science.
        </p>
      </div>
      <div className="skills-wrap">
        {categories.map(cat => (
          <div className="skills-cat reveal" key={cat.label}>
            <div className="cat-label">{cat.label}</div>
            <div className="skills-grid">
              {cat.skills.map(s => (
                <div className="skill-card" key={s.name}>
                  <span className="skill-icon">{s.icon}</span>
                  <div className="skill-name">{s.name}</div>
                  <div className="skill-bar">
                    <div className="skill-fill" data-w={s.pct} style={{ width: 0 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
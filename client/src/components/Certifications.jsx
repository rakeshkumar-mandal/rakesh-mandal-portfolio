const certs = [
  { icon: '🎯', name: 'Data Structures & Algorithms', issuer: 'Consistent Practice (C++)', date: 'Present', badge: '🏅' },
  { icon: '💻', name: 'Modern Full-Stack Development', issuer: 'Self-Taught & Projects', date: '2023 - Present', badge: '🎖️' },
  { icon: '🧱', name: 'Object-Oriented Programming', issuer: 'Academic Curriculum', date: 'Completed', badge: '🏆' },
  { icon: '🔌', name: 'RESTful API Development', issuer: 'Hands-on Implementation', date: '2024 - Present', badge: '🥇' },
  { icon: '🗄️', name: 'Database Management Systems', issuer: 'Academic Curriculum', date: 'Completed', badge: '📜' },
  { icon: '🐙', name: 'Git & Version Control', issuer: 'Project Collaboration', date: '2023 - Present', badge: '🛡️' },
];

export default function Certifications() {
  return (
    <section id="certifications">
      <div className="reveal">
        <div className="section-label">Milestones</div>
        <h2 className="section-title">Training &amp; <span className="grad-text">Achievements</span></h2>
        <p className="section-sub">Key milestones, practical training, and problem-solving achievements that build a strong technical foundation.</p>
      </div>
      <div className="cert-grid">
        {certs.map((c, i) => (
          <div className={`cert-card reveal${i % 3 === 1 ? ' reveal-delay1' : i % 3 === 2 ? ' reveal-delay2' : ''}`} key={i}>
            <div className="cert-badge">{c.badge}</div>
            <span className="cert-icon">{c.icon}</span>
            <div className="cert-name">{c.name}</div>
            <div className="cert-issuer">{c.issuer}</div>
            <div className="cert-date">{c.date}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
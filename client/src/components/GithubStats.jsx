import { useEffect, useRef } from 'react';

const languages = [
  { name: 'JavaScript', pct: 65 },
  { name: 'C++', pct: 20 },
  { name: 'HTML/CSS', pct: 15 },
];

const ghStats = [
  { num: '342', label: 'Total Commits' },
  { num: '15', label: 'Repositories' },
  { num: '4', label: 'Pull Requests' },
  { num: '3', label: 'Issues Resolved' },
  { num: '2', label: 'Stars Earned' },
  { num: '410', label: 'Contributions' },
];

function generateContribGrid() {
  const cells = [];
  for (let i = 0; i < 52 * 7; i++) {
    const rand = Math.random();
    let cls = 'contrib-cell';
    if (rand > 0.85) cls += ' c4';
    else if (rand > 0.7) cls += ' c3';
    else if (rand > 0.5) cls += ' c2';
    else if (rand > 0.35) cls += ' c1';
    cells.push(cls);
  }
  return cells;
}

export default function GithubStats() {
  const cellsRef = useRef(generateContribGrid());

  return (
    <section id="github" style={{ paddingTop: 0 }}>
      <div className="reveal">
        <div className="section-label">GitHub Activity</div>
        <h2 className="section-title">Code. Commit. <span className="grad-text">Repeat.</span></h2>
        {/* Sub-heading ko safe kar diya gaya hai */}
        <p className="section-sub">Tracking consistent code commits across personal projects, DSA practice, and freelance work.</p>
      </div>
      <div className="gh-section reveal">
        <div className="gh-stats">
          {ghStats.map(s => (
            <div className="gh-stat" key={s.label}>
              <div className="gh-num">{s.num}</div>
              <div className="gh-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--muted2)', letterSpacing: '0.3px' }}>Contribution activity — last 12 months</span>
        </div>
        <div className="contrib-grid">
          {cellsRef.current.map((cls, i) => (
            <div className={cls} key={i} title={`${Math.floor(Math.random() * 8)} contributions`} />
          ))}
        </div>

        <div style={{ marginTop: 28, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--muted2)', letterSpacing: '0.3px' }}>Most used languages</span>
        </div>
        <div className="langs-grid">
          {languages.map(l => (
            <div className="lang-item" key={l.name}>
              <div className="lang-row">
                <span>{l.name}</span>
                <span className="lang-pct">{l.pct}%</span>
              </div>
              <div className="lang-bar">
                <div className="lang-fill" style={{ width: `${l.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
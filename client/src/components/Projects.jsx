import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data.data || []))
      .catch(err => console.error('Projects fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  // Fallback demo projects when API is unavailable
  const demoProjects = [
    {
      _id: '1',
      title: 'AI Blog Platform',
      description: 'Full-stack blogging platform with Gemini AI content generation, JWT auth, ImageKit CDN, and real-time analytics dashboard.',
      emoji: '🤖',
      gradient: 'linear-gradient(135deg, #0d1128, #1a0540)',
      featured: true,
      featuredLabel: 'AI Powered',
      tags: [{ name: 'React', type: 'cyan' }, { name: 'Node.js', type: 'green' }, { name: 'MongoDB', type: 'green' }, { name: 'Gemini AI', type: 'violet' }],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      _id: '2',
      title: 'E-Commerce Store',
      description: 'Production-ready e-commerce app with Stripe payments, admin dashboard, inventory management, and order tracking.',
      emoji: '🛒',
      gradient: 'linear-gradient(135deg, #0d2040, #051020)',
      featured: false,
      tags: [{ name: 'Next.js', type: 'cyan' }, { name: 'Express', type: 'orange' }, { name: 'MongoDB', type: 'green' }, { name: 'Stripe', type: 'violet' }],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      _id: '3',
      title: 'DevCollab – Real-time IDE',
      description: 'Collaborative code editor with Socket.io, syntax highlighting, live cursors, and GitHub OAuth integration.',
      emoji: '💻',
      gradient: 'linear-gradient(135deg, #0a0f1e, #1a1040)',
      featured: true,
      featuredLabel: 'Open Source',
      tags: [{ name: 'React', type: 'cyan' }, { name: 'Socket.io', type: 'orange' }, { name: 'Node.js', type: 'green' }, { name: 'Redis', type: 'violet' }],
      githubUrl: '#',
    },
    {
      _id: '4',
      title: 'DSA Tracker Pro',
      description: 'Personal DSA progress tracker with problem tagging, difficulty stats, revision scheduling, and LeetCode sync.',
      emoji: '📊',
      gradient: 'linear-gradient(135deg, #051020, #0d1128)',
      featured: false,
      tags: [{ name: 'React', type: 'cyan' }, { name: 'TypeScript', type: 'cyan' }, { name: 'MongoDB', type: 'green' }],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      _id: '5',
      title: 'Weather Intelligence',
      description: 'Weather app with 7-day forecasts, interactive maps, air quality index, and PWA support for offline usage.',
      emoji: '🌦️',
      gradient: 'linear-gradient(135deg, #0a1520, #05080f)',
      featured: false,
      tags: [{ name: 'React', type: 'cyan' }, { name: 'OpenWeather API', type: 'orange' }, { name: 'PWA', type: 'violet' }],
      liveUrl: '#',
      githubUrl: '#',
    },
    {
      _id: '6',
      title: 'Chat-GPT Clone',
      description: 'Feature-rich ChatGPT interface with conversation history, multi-model support, markdown rendering, and code export.',
      emoji: '💬',
      gradient: 'linear-gradient(135deg, #1a0530, #0d0820)',
      featured: false,
      tags: [{ name: 'React', type: 'cyan' }, { name: 'Gemini API', type: 'violet' }, { name: 'Node.js', type: 'green' }],
      liveUrl: '#',
      githubUrl: '#',
    },
  ];

  const displayProjects = projects.length > 0 ? projects : demoProjects;

  return (
    <section id="projects">
      <div className="reveal">
        <div className="section-label">Featured Projects</div>
        <h2 className="section-title">Things I've <span className="grad-text">Shipped</span></h2>
        <p className="section-sub">Real projects with real users, real bugs debugged, and real deployment pipelines — not just tutorials.</p>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>Loading projects...</div>
      ) : (
        <div className="proj-grid">
          {displayProjects.map((p, i) => (
            <div className={`proj-card reveal${i % 3 === 1 ? ' reveal-delay1' : i % 3 === 2 ? ' reveal-delay2' : ''}`} key={p._id}>
              <div className="proj-img" style={{ background: p.gradient }}>
                <div className="proj-img-inner">{p.emoji}</div>
                {p.featured && <span className="proj-featured">{p.featuredLabel || 'Featured'}</span>}
              </div>
              <div className="proj-body">
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.description}</div>
                <div className="proj-tags">
                  {p.tags?.map(t => (
                    <span className={`proj-tag tag-${t.type || 'cyan'}`} key={t.name}>{t.name}</span>
                  ))}
                </div>
                <div className="proj-btns">
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" rel="noreferrer" className="proj-btn proj-btn-primary">🚀 Live Demo</a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noreferrer" className="proj-btn proj-btn-outline">⌥ GitHub</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

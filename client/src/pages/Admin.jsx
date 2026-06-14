import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TABS = [
  { id: 'overview',  label: '📊 Overview'  },
  { id: 'projects',  label: '🚀 Projects'  },
  { id: 'messages',  label: '📩 Messages'  },
  { id: 'analytics', label: '📈 Analytics' },
];

export default function Admin() {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [projects,       setProjects]       = useState([]);
  const [messages,       setMessages]       = useState([]);
  const [analytics,      setAnalytics]      = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [addStatus,      setAddStatus]      = useState(null); // null | 'loading' | 'success' | 'error'
  const [newProject,     setNewProject]     = useState({
    title: '', description: '', emoji: '🚀',
    liveUrl: '', githubUrl: '', featured: false, featuredLabel: '',
  });

  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  useEffect(() => { loadAll(); }, []);

  /* close sidebar whenever tab changes on mobile */
  const switchTab = id => { setActiveTab(id); setSidebarOpen(false); };

  /* ── data ── */
  const loadAll = async () => {
    setLoading(true);
    try {
      const [p, m, a] = await Promise.allSettled([
        api.get('/projects/all'),
        api.get('/contact'),
        api.get('/analytics'),
      ]);
      if (p.status === 'fulfilled') setProjects(p.value.data.data  || []);
      if (m.status === 'fulfilled') setMessages(m.value.data.data  || []);
      if (a.status === 'fulfilled') setAnalytics(a.value.data.data);
    } finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate('/admin/login', { replace: true }); };

  const deleteProject = async id => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    setProjects(p => p.filter(x => x._id !== id));
  };

  const toggleVisible = async (id, cur) => {
    await api.put(`/projects/${id}`, { isVisible: !cur });
    setProjects(p => p.map(x => x._id === id ? { ...x, isVisible: !cur } : x));
  };

  const markRead = async id => {
    await api.put(`/contact/${id}/read`);
    setMessages(m => m.map(x => x._id === id ? { ...x, isRead: true } : x));
  };

  const deleteMessage = async id => {
    if (!window.confirm('Delete message?')) return;
    await api.delete(`/contact/${id}`);
    setMessages(m => m.filter(x => x._id !== id));
  };

  const addProject = async e => {
    e.preventDefault();
    setAddStatus('loading');
    try {
      const res = await api.post('/projects', {
        ...newProject,
        tags: [{ name: 'React', type: 'cyan' }, { name: 'Node.js', type: 'violet' }],
        gradient: 'linear-gradient(135deg,#0a1628,#1a0540)',
      });
      setProjects(p => [res.data.data, ...p]);
      setNewProject({ title:'', description:'', emoji:'🚀', liveUrl:'', githubUrl:'', featured:false, featuredLabel:'' });
      setAddStatus('success');
      setTimeout(() => { setAddStatus(null); setShowAddProject(false); }, 2000);
    } catch { setAddStatus('error'); }
  };

  const unread = messages.filter(m => !m.isRead).length;

  /* ────────────────────────────── RENDER ────────────────────────────── */
  return (
    <div className="admin-root">

      {/* ░░ OVERLAY — mobile only ░░ */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ░░ HAMBURGER — mobile only ░░ */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* ░░ SIDEBAR ░░ */}
      <aside className={`admin-sidebar${sidebarOpen ? ' show' : ''}`}>

        {/* Logo */}
        <div className="admin-logo">⚡ Admin Panel</div>

        {/* Nav */}
        <ul className="admin-nav">
          {TABS.map(t => (
            <li key={t.id}>
              <button
                onClick={() => switchTab(t.id)}
                className={activeTab === t.id ? 'active' : ''}
              >
                {t.label}
                {t.id === 'messages' && unread > 0 && (
                  <span className="nav-badge">{unread}</span>
                )}
              </button>
            </li>
          ))}
          <li className="nav-divider" />
          <li>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </li>
        </ul>

        {/* User info */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-label">Logged in as</div>
          <div className="sidebar-footer-email">{user?.email}</div>
        </div>
      </aside>

      {/* ░░ MAIN ░░ */}
      <main className="admin-main">

        {/* Top bar */}
        <header className="admin-header">
          <h1 className="admin-title">
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
          <a href="/" className="back-link">← Portfolio</a>
        </header>

        {/* ── Content ── */}
        {loading ? (
          <div className="loading-state">Loading dashboard data…</div>
        ) : (
          <>

            {/* ════ OVERVIEW ════ */}
            {activeTab === 'overview' && (
              <>
                {/* Stat cards */}
                <div className="stat-cards">
                  {[
                    { num: projects.length,              label: 'Projects'       },
                    { num: messages.length,              label: 'Messages'       },
                    { num: unread,                       label: 'Unread'         },
                    { num: analytics?.totalVisits  || 0, label: 'Total Visits'   },
                    { num: analytics?.todayVisits  || 0, label: "Today's Visits" },
                    { num: analytics?.uniqueVisitors||0, label: 'Unique IPs'     },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-card-num">{s.num}</div>
                      <div className="stat-card-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent messages */}
                <div className="admin-card">
                  <div className="admin-card-title">Recent Messages</div>
                  {messages.length === 0
                    ? <p className="empty-state">No messages yet.</p>
                    : (
                      <>
                        {/* Mobile: cards */}
                        <div className="mobile-cards">
                          {messages.slice(0, 5).map(m => (
                            <MessageCard
                              key={m._id} m={m}
                              onRead={markRead} onDelete={deleteMessage}
                            />
                          ))}
                        </div>
                        {/* Desktop: table */}
                        <div className="table-wrapper desktop-table">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>From</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {messages.slice(0, 5).map(m => (
                                <tr key={m._id}>
                                  <td>
                                    <div className="fw600">{m.name}</div>
                                    <div className="muted2 fs12">{m.email}</div>
                                  </td>
                                  <td>{m.subject}</td>
                                  <td className="fs13">{new Date(m.createdAt).toLocaleDateString()}</td>
                                  <td>
                                    <span className={m.isRead ? 'badge-read' : 'badge-unread'}>
                                      {m.isRead ? 'Read' : 'New'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )
                  }
                </div>
              </>
            )}

            {/* ════ PROJECTS ════ */}
            {activeTab === 'projects' && (
              <>
                <button
                  className="btn-primary mb20"
                  onClick={() => setShowAddProject(p => !p)}
                >
                  {showAddProject ? '✕ Cancel' : '+ Add New Project'}
                </button>

                {/* Add form */}
                {showAddProject && (
                  <div className="admin-card mb20">
                    <div className="admin-card-title">Add New Project</div>

                    {addStatus === 'success' && (
                      <div className="alert alert-success">✅ Project added successfully!</div>
                    )}
                    {addStatus === 'error' && (
                      <div className="alert alert-error">❌ Failed to add project.</div>
                    )}

                    <form onSubmit={addProject}>
                      {/* Title + Emoji — auto-stack on mobile */}
                      <div className="form-grid-2 mb14">
                        <div className="form-group">
                          <label className="form-label">PROJECT TITLE *</label>
                          <input
                            className="form-input"
                            value={newProject.title}
                            onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))}
                            placeholder="Project name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">EMOJI</label>
                          <input
                            className="form-input"
                            value={newProject.emoji}
                            onChange={e => setNewProject(p => ({ ...p, emoji: e.target.value }))}
                            placeholder="🚀"
                          />
                        </div>
                      </div>

                      <div className="form-group mb14">
                        <label className="form-label">DESCRIPTION *</label>
                        <textarea
                          className="form-input"
                          value={newProject.description}
                          onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))}
                          placeholder="Describe your project…"
                          required
                          style={{ height: 90 }}
                        />
                      </div>

                      {/* URLs — stack on mobile */}
                      <div className="form-grid-half mb14">
                        <div className="form-group">
                          <label className="form-label">LIVE URL</label>
                          <input
                            className="form-input"
                            value={newProject.liveUrl}
                            onChange={e => setNewProject(p => ({ ...p, liveUrl: e.target.value }))}
                            placeholder="https://…"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">GITHUB URL</label>
                          <input
                            className="form-input"
                            value={newProject.githubUrl}
                            onChange={e => setNewProject(p => ({ ...p, githubUrl: e.target.value }))}
                            placeholder="https://github.com/…"
                          />
                        </div>
                      </div>

                      <div className="form-flex mb20">
                        <input
                          type="checkbox"
                          id="feat"
                          checked={newProject.featured}
                          onChange={e => setNewProject(p => ({ ...p, featured: e.target.checked }))}
                        />
                        <label htmlFor="feat" className="checkbox-label">Mark as Featured</label>
                        {newProject.featured && (
                          <input
                            className="form-input"
                            style={{ width: 180 }}
                            value={newProject.featuredLabel}
                            onChange={e => setNewProject(p => ({ ...p, featuredLabel: e.target.value }))}
                            placeholder="Badge label"
                          />
                        )}
                      </div>

                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={addStatus === 'loading'}
                      >
                        {addStatus === 'loading' ? '⏳ Adding…' : '+ Add Project'}
                      </button>
                    </form>
                  </div>
                )}

                {/* All projects */}
                <div className="admin-card">
                  <div className="admin-card-title">All Projects ({projects.length})</div>

                  {/* Mobile: project cards */}
                  <div className="mobile-cards">
                    {projects.map(p => (
                      <div key={p._id} className="project-mobile-card">
                        <div className="project-mobile-top">
                          <span className="fw600 fs15">{p.emoji} {p.title}</span>
                          <div className="project-mobile-actions">
                            <button
                              className={`btn-sm ${p.isVisible ? 'btn-sm-primary' : 'btn-sm-outline'}`}
                              onClick={() => toggleVisible(p._id, p.isVisible)}
                            >
                              {p.isVisible ? '👁' : '🙈'}
                            </button>
                            <button className="btn-danger" onClick={() => deleteProject(p._id)}>🗑</button>
                          </div>
                        </div>
                        <div className="muted2 fs12 mb8">{p.description?.slice(0, 80)}…</div>
                        <div className="tag-row">
                          {p.tags?.slice(0, 3).map(t => (
                            <span key={t.name} className={`proj-tag tag-${t.type}`}>{t.name}</span>
                          ))}
                          {p.featured && (
                            <span className="badge-read">⭐ {p.featuredLabel}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="table-wrapper desktop-table">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Tags</th>
                          <th>Featured</th>
                          <th>Visibility</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map(p => (
                          <tr key={p._id}>
                            <td>
                              <div className="fw600 fs15">{p.emoji} {p.title}</div>
                              <div className="muted2 fs12 mt4" style={{ maxWidth: 300 }}>
                                {p.description?.slice(0, 70)}…
                              </div>
                            </td>
                            <td>
                              <div className="tag-row">
                                {p.tags?.slice(0, 3).map(t => (
                                  <span key={t.name} className={`proj-tag tag-${t.type}`} style={{ fontSize: 10 }}>
                                    {t.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              {p.featured
                                ? <span className="badge-read">⭐ {p.featuredLabel}</span>
                                : <span className="muted2">—</span>
                              }
                            </td>
                            <td>
                              <button
                                className={`btn-sm ${p.isVisible ? 'btn-sm-primary' : 'btn-sm-outline'}`}
                                onClick={() => toggleVisible(p._id, p.isVisible)}
                              >
                                {p.isVisible ? '👁 Visible' : '🙈 Hidden'}
                              </button>
                            </td>
                            <td>
                              <button className="btn-danger" onClick={() => deleteProject(p._id)}>
                                🗑 Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ════ MESSAGES ════ */}
            {activeTab === 'messages' && (
              <div className="admin-card">
                <div className="admin-card-title">
                  All Messages ({messages.length}) ·{' '}
                  <span style={{ color: '#f87171' }}>{unread} unread</span>
                </div>
                {messages.length === 0
                  ? <p className="empty-state">No messages yet. Share your portfolio!</p>
                  : messages.map(m => (
                    <MessageCard
                      key={m._id} m={m}
                      onRead={markRead} onDelete={deleteMessage}
                    />
                  ))
                }
              </div>
            )}

            {/* ════ ANALYTICS ════ */}
            {activeTab === 'analytics' && (
              <>
                <div className="stat-cards">
                  {[
                    { num: analytics?.totalVisits    || 0, label: 'Total Visits'  },
                    { num: analytics?.todayVisits    || 0, label: 'Today'         },
                    { num: analytics?.weekVisits     || 0, label: 'This Week'     },
                    { num: analytics?.uniqueVisitors || 0, label: 'Unique IPs'    },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-card-num">{s.num}</div>
                      <div className="stat-card-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="admin-card">
                  <div className="admin-card-title">Recent Visits (Last 20)</div>

                  {/* Mobile: visit cards */}
                  <div className="mobile-cards">
                    {(analytics?.recentVisits || []).map((v, i) => (
                      <div key={i} className="visit-mobile-card">
                        <div className="visit-mobile-top">
                          <span className="badge-read">{v.page}</span>
                          <span className="muted2 fs11">{new Date(v.createdAt).toLocaleString()}</span>
                        </div>
                        {v.ipAddress && (
                          <div className="muted2 fs11 mono mt4">📍 {v.ipAddress}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="table-wrapper desktop-table">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Page</th>
                          <th>IP Address</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(analytics?.recentVisits || []).map((v, i) => (
                          <tr key={i}>
                            <td><span className="badge-read">{v.page}</span></td>
                            <td className="mono fs12">{v.ipAddress || '—'}</td>
                            <td className="fs13">{new Date(v.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </>
        )}
      </main>
    </div>
  );
}

/* ── Reusable message card ── */
function MessageCard({ m, onRead, onDelete }) {
  return (
    <div className={`message-card${!m.isRead ? ' message-card-new' : ''}`}>
      <div className="message-top">
        <div className="message-user">
          <div className="message-name-row">
            <span className="message-name">{m.name}</span>
            {!m.isRead && <span className="badge-unread">NEW</span>}
          </div>
          <a href={`mailto:${m.email}`} className="message-email">{m.email}</a>
        </div>
        <div className="message-actions">
          {!m.isRead && (
            <button
              className="btn-sm btn-sm-primary message-action-btn"
              onClick={() => onRead(m._id)}
              title="Mark as read"
            >
              ✓
            </button>
          )}
          <button
            className="btn-danger message-action-btn"
            onClick={() => onDelete(m._id)}
            title="Delete"
          >
            🗑
          </button>
        </div>
      </div>
      {m.subject && <div className="message-subject">{m.subject}</div>}
      <div className="message-content">{m.message}</div>
      <div className="message-footer">
        <span>🕐 {new Date(m.createdAt).toLocaleString()}</span>
        {m.ipAddress && <span>📍 {m.ipAddress}</span>}
      </div>
    </div>
  );
}
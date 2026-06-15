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

const EMPTY_PROJECT = {
  title: '', description: '', emoji: '🚀',
  liveUrl: '', githubUrl: '', tags: '',
  featured: false, featuredLabel: '',
};

export default function Admin() {
  const [activeTab,      setActiveTab]      = useState('overview');
  const [projects,       setProjects]       = useState([]);
  const [messages,       setMessages]       = useState([]);
  const [analytics,      setAnalytics]      = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [addStatus,      setAddStatus]      = useState(null);
  const [newProject,     setNewProject]     = useState(EMPTY_PROJECT);

  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  useEffect(() => { loadAll(); }, []);

  const switchTab = id => { setActiveTab(id); setSidebarOpen(false); };

  /* ── helpers ── */
  const resetForm = () => {
    setNewProject(EMPTY_PROJECT);
    setEditingProject(null);
    setAddStatus(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowAddProject(true);
  };

  const closeForm = () => {
    resetForm();
    setShowAddProject(false);
  };

  const openEditForm = (p) => {
    setEditingProject(p);
    setNewProject({
      title:        p.title        || '',
      description:  p.description  || '',
      emoji:        p.emoji        || '🚀',
      liveUrl:      p.liveUrl      || '',
      githubUrl:    p.githubUrl    || '',
      tags:         p.tags?.map(t => t.name).join(', ') || '',
      featured:     p.featured     || false,
      featuredLabel:p.featuredLabel|| '',
    });
    setAddStatus(null);
    setShowAddProject(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  /* tags string → array with auto color */
  const parseTags = (tagsStr) =>
    tagsStr
      .split(',')
      .map(tag => {
        const name = tag.trim();
        if (!name) return null;
        let type = 'cyan';
        const n = name.toLowerCase();
        if (n.includes('node') || n.includes('express')) type = 'violet';
        if (n.includes('mongo'))                          type = 'green';
        if (n.includes('ai') || n.includes('gemini'))    type = 'orange';
        return { name, type };
      })
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddStatus('loading');
    try {
      const payload = {
        ...newProject,
        tags:     parseTags(newProject.tags),
        gradient: 'linear-gradient(135deg,#0a1628,#1a0540)',
      };

      if (editingProject) {
        const res = await api.put(`/projects/${editingProject._id}`, payload);
        setProjects(prev =>
          prev.map(p => p._id === editingProject._id ? res.data.data : p)
        );
      } else {
        const res = await api.post('/projects', payload);
        setProjects(prev => [res.data.data, ...prev]);
      }

      setAddStatus('success');
      setTimeout(() => closeForm(), 2000);
    } catch (err) {
      console.error(err);
      setAddStatus('error');
    }
  };

  const unread = messages.filter(m => !m.isRead).length;

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="admin-root">

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* HAMBURGER */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* SIDEBAR */}
      <aside className={`admin-sidebar${sidebarOpen ? ' show' : ''}`}>
        <div className="admin-logo">⚡ Admin Panel</div>

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

        <div className="sidebar-footer">
          <div className="sidebar-footer-label">Logged in as</div>
          <div className="sidebar-footer-email">{user?.email}</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* Top bar */}
        <header className="admin-header">
          <h1 className="admin-title">
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>
          <a href="/" className="back-link">← Portfolio</a>
        </header>

        {loading ? (
          <div className="loading-state">Loading dashboard data…</div>
        ) : (
          <>

            {/* ════ OVERVIEW ════ */}
            {activeTab === 'overview' && (
              <>
                <div className="stat-cards">
                  {[
                    { num: projects.length,               label: 'Projects'       },
                    { num: messages.length,               label: 'Messages'       },
                    { num: unread,                        label: 'Unread'         },
                    { num: analytics?.totalVisits   || 0, label: 'Total Visits'   },
                    { num: analytics?.todayVisits   || 0, label: "Today's Visits" },
                    { num: analytics?.uniqueVisitors|| 0, label: 'Unique IPs'     },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-card-num">{s.num}</div>
                      <div className="stat-card-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="admin-card">
                  <div className="admin-card-title">Recent Messages</div>
                  {messages.length === 0
                    ? <p className="empty-state">No messages yet.</p>
                    : <>
                        <div className="mobile-cards">
                          {messages.slice(0, 5).map(m => (
                            <MessageCard key={m._id} m={m} onRead={markRead} onDelete={deleteMessage} />
                          ))}
                        </div>
                        <div className="table-wrapper desktop-table">
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>From</th><th>Subject</th><th>Date</th><th>Status</th>
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
                  }
                </div>
              </>
            )}

            {/* ════ PROJECTS ════ */}
            {activeTab === 'projects' && (
              <>
                {/* Add / Cancel toggle */}
                <button
                  className="btn-primary mb20"
                  onClick={showAddProject ? closeForm : openAddForm}
                >
                  {showAddProject ? '✕ Cancel' : '+ Add New Project'}
                </button>

                {/* ── Add / Edit form ── */}
                {showAddProject && (
                  <div className="admin-card mb20">
                    <div className="admin-card-title">
                      {editingProject ? '✏️ Edit Project' : '➕ Add New Project'}
                    </div>

                    {addStatus === 'success' && (
                      <div className="alert alert-success">
                        {editingProject ? '✅ Project updated!' : '✅ Project added!'}
                      </div>
                    )}
                    {addStatus === 'error' && (
                      <div className="alert alert-error">❌ Something went wrong. Try again.</div>
                    )}

                    <form onSubmit={handleSubmit}>

                      {/* Title + Emoji */}
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

                      {/* Description */}
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

                      {/* URLs */}
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

                      {/* Tags */}
                      <div className="form-group mb14">
                        <label className="form-label">TAGS (comma separated)</label>
                        <input
                          className="form-input"
                          value={newProject.tags}
                          onChange={e => setNewProject(p => ({ ...p, tags: e.target.value }))}
                          placeholder="React, Node.js, MongoDB, Express"
                        />
                        <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 6 }}>
                          💡 Node/Express → violet · Mongo → green · AI/Gemini → orange · others → cyan
                        </div>
                      </div>

                      {/* Featured */}
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
                            placeholder="Badge label e.g. Featured"
                          />
                        )}
                      </div>

                      {/* Submit */}
                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={addStatus === 'loading'}
                        >
                          {addStatus === 'loading'
                            ? '⏳ Saving…'
                            : editingProject ? '💾 Update Project' : '+ Add Project'}
                        </button>
                        <button
                          type="button"
                          className="btn-outline"
                          onClick={closeForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── All projects ── */}
                <div className="admin-card">
                  <div className="admin-card-title">All Projects ({projects.length})</div>

                  {projects.length === 0 && (
                    <p className="empty-state">No projects yet. Add your first one above!</p>
                  )}

                  {/* Mobile cards */}
                  <div className="mobile-cards">
                    {projects.map(p => (
                      <div key={p._id} className="project-mobile-card">
                        <div className="project-mobile-top">
                          <span className="fw600 fs15">{p.emoji} {p.title}</span>
                          <div className="project-mobile-actions">
                            <button
                              className={`btn-sm ${p.isVisible ? 'btn-sm-primary' : 'btn-sm-outline'}`}
                              onClick={() => toggleVisible(p._id, p.isVisible)}
                              title={p.isVisible ? 'Hide' : 'Show'}
                            >
                              {p.isVisible ? '👁' : '🙈'}
                            </button>
                            <button
                              className="btn-sm btn-sm-primary"
                              onClick={() => openEditForm(p)}
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => deleteProject(p._id)}
                              title="Delete"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                        <div className="muted2 fs12 mb8">{p.description?.slice(0, 80)}…</div>
                        <div className="tag-row">
                          {p.tags?.slice(0, 3).map(t => (
                            <span key={t.name} className={`proj-tag tag-${t.type}`}>{t.name}</span>
                          ))}
                          {p.featured && <span className="badge-read">⭐ {p.featuredLabel}</span>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
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
                              <div className="muted2 fs12 mt4" style={{ maxWidth: 280 }}>
                                {p.description?.slice(0, 65)}…
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
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  className="btn-sm btn-sm-primary"
                                  onClick={() => openEditForm(p)}
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  className="btn-danger"
                                  onClick={() => deleteProject(p._id)}
                                >
                                  🗑 Delete
                                </button>
                              </div>
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
                      <MessageCard key={m._id} m={m} onRead={markRead} onDelete={deleteMessage} />
                    ))
                }
              </div>
            )}

            {/* ════ ANALYTICS ════ */}
            {activeTab === 'analytics' && (
              <>
                <div className="stat-cards">
                  {[
                    { num: analytics?.totalVisits    || 0, label: 'Total Visits' },
                    { num: analytics?.todayVisits    || 0, label: 'Today'        },
                    { num: analytics?.weekVisits     || 0, label: 'This Week'    },
                    { num: analytics?.uniqueVisitors || 0, label: 'Unique IPs'   },
                  ].map(s => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-card-num">{s.num}</div>
                      <div className="stat-card-label">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="admin-card">
                  <div className="admin-card-title">Recent Visits (Last 20)</div>

                  {/* Mobile */}
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

                  {/* Desktop */}
                  <div className="table-wrapper desktop-table">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Page</th><th>IP Address</th><th>Time</th>
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

/* ── Message Card Component ── */
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
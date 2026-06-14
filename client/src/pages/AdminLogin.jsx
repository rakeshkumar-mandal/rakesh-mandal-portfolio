import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Gradient orbs background */}
      <div style={{
        position: 'fixed', top: '20%', left: '20%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,245,255,0.06), transparent)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'fixed', bottom: '20%', right: '20%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{
        background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: 24,
        padding: 48, width: '100%', maxWidth: 420, backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(124,58,237,0.15))',
            border: '1px solid rgba(0,245,255,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: 26
          }}>⚡</div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700,
            background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Admin Panel</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
            Portfolio Management System
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 20 }}>❌ {error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">EMAIL ADDRESS</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@portfolio.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">PASSWORD</label>
            <input
              className="form-input"
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="form-submit"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? '⏳ Signing in...' : '🔑 Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <a href="/" style={{ color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}

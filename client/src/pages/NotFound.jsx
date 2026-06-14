import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
      textAlign: 'center', padding: 20, fontFamily: "'Space Grotesk', sans-serif"
    }}>
      <div style={{ fontSize: 100, fontWeight: 700, background: 'linear-gradient(135deg, var(--cyan), var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 16 }}>404</div>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
        Page <span style={{ background: 'linear-gradient(135deg,var(--cyan),var(--violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Not Found</span>
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 36, maxWidth: 400, lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" style={{
        background: 'linear-gradient(135deg, var(--cyan), var(--violet))',
        color: '#000', padding: '14px 32px', borderRadius: '100px',
        fontWeight: 700, textDecoration: 'none', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8
      }}>
        ← Back to Portfolio
      </Link>
    </div>
  );
}

import { useState } from 'react';
import api from '../utils/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      const msgs = err.response?.data?.errors;
      setErrorMsg(msgs ? msgs.map(e => e.msg).join(', ') : (err.response?.data?.message || 'Failed to send. Please try again.'));
    }
  };

  return (
    <section id="contact">
      <div className="reveal">
        <div className="section-label">Contact</div>
        <h2 className="section-title">Let's <span className="grad-text">Work Together</span></h2>
        {/* Sub-heading updated for placement focus */}
        <p className="section-sub">Currently exploring SDE opportunities. Let's connect to discuss how my skills align with your team.</p>
      </div>
      <div className="contact-grid">
        <div className="contact-info reveal">
          {[
            { icon: '📧', label: 'EMAIL', value: 'rakeshmandaltech@gmail.com', href: 'mailto:rakeshmandaltech@gmail.com' },
            { icon: '📱', label: 'PHONE', value: '+91 88266 73734', href: 'tel:+918826673734' },
            { icon: '📍', label: 'LOCATION', value: 'Delhi-NCR, India', href: null },
            { icon: '💼', label: 'LINKEDIN', value: 'linkedin.com/in/rakesh-mandal', href: 'https://www.linkedin.com/in/rakesh-kumar-mandal/' },
            { icon: '🐙', label: 'GITHUB', value: 'github.com/rakesh-mandal', href: 'https://github.com/rakeshkumar-mandal' },
            /* Availability updated to be flexible and immediate */
            { icon: '🚀', label: 'AVAILABILITY', value: 'Available for SDE Roles', href: null },
          ].map((c, i) =>
            c.href ? (
              <a href={c.href} className="contact-item" key={i} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <div className="contact-icon">{c.icon}</div>
                <div><div className="contact-label">{c.label}</div><div className="contact-value">{c.value}</div></div>
              </a>
            ) : (
              <div className="contact-item" key={i}>
                <div className="contact-icon">{c.icon}</div>
                <div><div className="contact-label">{c.label}</div><div className="contact-value">{c.value}</div></div>
              </div>
            )
          )}
        </div>
        <div className="contact-form reveal reveal-delay2">
          {status === 'success' && (
            <div className="alert alert-success">✅ Message sent! I'll get back to you within 24-48 hours.</div>
          )}
          {status === 'error' && (
            <div className="alert alert-error">❌ {errorMsg}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">YOUR NAME</label>
                <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label className="form-label">EMAIL ADDRESS</label>
                <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">SUBJECT</label>
              <input className="form-input" name="subject" value={form.subject} onChange={handleChange} placeholder="Project Collaboration" required />
            </div>
            <div className="form-group">
              <label className="form-label">MESSAGE</label>
              <textarea className="form-input" name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your project..." required />
            </div>
            <button type="submit" className="form-submit" disabled={status === 'loading'}>
              {status === 'loading' ? '⏳ Sending...' : '🚀 Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
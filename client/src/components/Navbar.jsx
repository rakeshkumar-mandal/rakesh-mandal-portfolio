import { useState, useEffect } from 'react';

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{ boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none' }}>
      <a href="/" className="nav-logo">Dev.Portfolio</a>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href} onClick={e => { e.preventDefault(); scrollTo(l.href); }}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <button className="nav-cta" onClick={() => scrollTo('#contact')}>Hire Me</button>
    </nav>
  );
}

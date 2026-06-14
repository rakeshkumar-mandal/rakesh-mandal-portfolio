import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarqueeBand from '../components/MarqueeBand';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import GithubStats from '../components/GithubStats';
import Certifications from '../components/Certifications';
import Resume from '../components/Resume';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';
import api from '../utils/api';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useScrollReveal();

  useEffect(() => {
    const sessionId = sessionStorage.getItem('sid') || Math.random().toString(36).slice(2);
    sessionStorage.setItem('sid', sessionId);
    api.post('/analytics', {
      page: 'home',
      sessionId,
      referrer: document.referrer,
    }).catch(() => {});
  }, []);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div
        className="content"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: loaded ? 'auto' : 'none',
        }}
      >
        <canvas id="canvas3d" />
        <Navbar />
        <Hero />
        <MarqueeBand />
        <About />
        <div className="section-divider" />
        <Skills />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <Experience />
        <div className="section-divider" />
        <GithubStats />
        <div className="section-divider" />
        <Certifications />
        <div className="section-divider" />
        <Resume />
        <div className="section-divider" />
        <Contact />
        <div className="section-divider" />
        <Footer />
      </div>
    </>
  );
}

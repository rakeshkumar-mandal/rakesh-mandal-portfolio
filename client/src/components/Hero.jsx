import React from 'react'
import { useState } from 'react'
import { useEffect, useRef } from 'react';
import profileImg from '../assets/profile.jpg'

const roles = [
  'MERN Stack Developer',
  'React Developer',
  'Tech Enthusiast',
  'Problem Solver (100+ DSA)',
  'Final Year CSE Student',
];

export default function Hero() {
  const typingRef = useRef(null);

  const [imgError, setImgError] = useState(false)


  // Typing animation
  useEffect(() => {
    let roleIdx = 0, charIdx = 0, deleting = false;
    const el = typingRef.current;
    if (!el) return;
    const type = () => {
      const current = roles[roleIdx];
      el.textContent = current.slice(0, charIdx);
      if (!deleting && charIdx < current.length) {
        charIdx++; setTimeout(type, 80);
      } else if (!deleting && charIdx === current.length) {
        deleting = true; setTimeout(type, 1800);
      } else if (deleting && charIdx > 0) {
        charIdx--; setTimeout(type, 40);
      } else {
        deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 200);
      }
    };
    type();
  }, []);

  // Three.js background
  useEffect(() => {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || !window.THREE) return;
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const geo = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 30;
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.04, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      stars.rotation.x += 0.0003;
      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); renderer.dispose(); };
  }, []);

  return (
    <section className="hero" style={{ maxWidth: '100%', paddingLeft: '7%', paddingRight: '7%' }}>
      <div className="hero-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div>
          <div className="hero-badge">
            <span className="badge-dot" />
            Open to Work &middot; Delhi-NCR &amp; Remote
          </div>
          <h1 className="hero-headline">
            Building Functional<br />
            <span className="grad-text">Web Applications</span><br />
            with MERN Stack
          </h1>
          <div className="hero-role">
            <span style={{ color: 'var(--muted)' }}>I am a </span>
            <span className="typing" ref={typingRef}></span>
            <span className="typing">|</span>
          </div>
          <p className="hero-desc">Final-year CSE student passionate about solving logical problems and building user-centric web apps. Strong foundation in Core CS fundamentals, currently exploring MERN stack (Next.js, MongoDB) and continuously grinding C++ DSA.</p>
          <div className="hero-btns">
            <a href="#projects" className="btn-primary" onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>View Projects →</a>
            <a
              href="https://rakeshkumarmandalportfolio.onrender.com/api/resume/download"
              className="btn-outline"
              target="_blank"
              rel="noreferrer"
            >
              ⬇ Download Resume
            </a>

            {/* <a href="#contact" className="btn-ghost" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Me</a> */} 
          </div>
        </div>
        <div className="profile-card">
          <div className="avatar-ring">
            {!imgError ? (
              <img 
                src={profileImg}
                alt="Rakesh Kumar Mandal"
                className="avatar-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="avatar-inner">R</div>
            )}
          </div>
          <div className="profile-name">Rakesh Kumar Mandal</div>
          <div className="profile-title">MERN STACK DEVELOPER</div>
          <div className="profile-tags">
            {['React','Node.js','MongoDB','TypeScript','C++'].map(t => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
          <div className="profile-stats">
            <div className="stat-box"><div className="stat-num">10+</div><div className="stat-label">Projects</div></div>
            <div className="stat-box"><div className="stat-num">5+</div><div className="stat-label">Full-Stack Apps</div></div>
            <div className="stat-box"><div className="stat-num">100+</div><div className="stat-label">DSA Solved</div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

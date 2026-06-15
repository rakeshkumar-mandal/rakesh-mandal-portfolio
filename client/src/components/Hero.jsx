import React from 'react'
import { useState } from 'react'
import { useEffect, useRef } from 'react';
import profileImg from '../assets/profile.jpg'
import * as THREE from 'three'

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
    const canvas = document.getElementById("canvas3d");
    if (!canvas) return;


    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 30;

  // Particles
    const count = 3000;

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    // Cyan + Purple particles
      const isCyan = Math.random() > 0.5;

      colors[i * 3] = isCyan ? 0 : 0.49;
      colors[i * 3 + 1] = isCyan ? 0.96 : 0.23;
      colors[i * 3 + 2] = isCyan ? 1 : 0.93;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);

    scene.add(stars);

    // Mouse Follow Effect
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener("mousemove", handleMouseMove);

    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Auto Rotation
      stars.rotation.y += 0.0006;
      stars.rotation.x += 0.0002;

      // Cursor Follow Rotation
      stars.rotation.y += mouseX * 0.0006;
      stars.rotation.x += mouseY * 0.0004;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
    cancelAnimationFrame(frameId);

    document.removeEventListener(
      "mousemove",
      handleMouseMove
    );

    window.removeEventListener(
      "resize",
      handleResize
    );

    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}, []);

  return (
  <>
    <canvas id="canvas3d"></canvas>

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
  </>
  );
}

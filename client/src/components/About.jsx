export default function About() {
  return (
    <section id="about">
      <div className="reveal">
        <div className="section-label">About Me</div>
        <h2 className="section-title">Turning Ideas into<br /><span className="grad-text">Functional Products</span></h2>
      </div>
      <div className="about-grid" style={{ marginTop: 48 }}>
        <div className="about-text reveal">
          <p>I'm a final-year Computer Science student at Manav Rachna International Institute of Research And Studies, specializing in full-stack development. I enjoy building practical web applications that solve real-world problems.</p>
          <p>My focus is on writing clean code with a thoughtful UI/UX. I've built fully functional projects using the MERN stack, integrated Gemini AI, handled JWT authentication, and successfully deployed them on Vercel.</p>
          <p>Beyond web development, my core strength lies in problem-solving. I consistently practice Data Structures and Algorithms in C++ and am currently laser-focused on contributing effectively to a fast-paced development team.</p>
          <div className="edu-timeline" style={{ marginTop: 36 }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Education</div>
            {[
              { year: '2023 — 2027', degree: 'B.Tech — Computer Science & Engineering', school: 'Manav Rachna International Institute Of Research And Studies, Faridabad · CGPA: 8.4/10' },
              { year: '2022 — 2023', degree: 'Class XII — CBSE Science (PCM)', school: 'Govt Co-Ed Senior Secondary School, New Delhi · 91.4%' },
              { year: '2020 — 2021', degree: 'Class X — CBSE', school: 'New Bal Vaishali Public School, Delhi · 93.8%' },
            ].map((e, i) => (
              <div className="edu-item" key={i}>
                <div className="edu-year">{e.year}</div>
                <div className="edu-degree">{e.degree}</div>
                <div className="edu-school">{e.school}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal reveal-delay2">
          <div className="section-label" style={{ marginBottom: 20 }}>Career Goals</div>
          <div className="goal-cards">
            {[
                { 
                  icon: '🚀', 
                  title: 'Software Engineering Role', 
                  desc: 'Join as an SDE to build user-centric web apps and write clean, maintainable code.' 
                },
                { 
                  icon: '🧠', 
                  title: 'AI Integration', 
                  desc: 'Integrate AI APIs like Gemini to build smart applications that solve real-world problems.' 
                },
                { 
                  icon: '💻', 
                  title: 'Continuous Learning', 
                  desc: 'Explore modern frameworks like Next.js and build full-stack projects to strengthen development skills.' 
                },
                { 
                  icon: '📈', 
                  title: 'Problem Solving (DSA)', 
                  desc: 'Practice C++ DSA consistently to enhance logical thinking and write optimized code.' 
                },
            ].map((g, i) => (
              <div className="goal-card" key={i}>
                <div className="goal-icon">{g.icon}</div>
                <div className="goal-text"><strong>{g.title}</strong><span>{g.desc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

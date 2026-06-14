const items = ['JavaScript (ES6+)', 'React.js', 'Node.js', 'MongoDB', 'Express.js', 
  'Tailwind CSS', 'Next.js', 'Python', 'C++', 'Mongoose', 
  'HTML5 / CSS3', 'REST APIs', 'JWT Auth', 'Gemini AI', 'Socket.io', 
  'Postman', 'Git & GitHub', 'Vite', 'Vercel', 'Render'];

export default function MarqueeBand() {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {doubled.map((item, i) => (
          <span className="marquee-item" key={i}>
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

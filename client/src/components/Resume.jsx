export default function Resume() {
  const handleDownload = () => {
  window.open(
    `${import.meta.env.VITE_API_URL}/resume/download`,
    '_blank'
  );
  };

  return (
    <section id="resume">
      <div className="resume-section reveal">
        <div className="section-label" style={{ display: 'flex', justifyContent: 'center' }}>Resume</div>
        <h2 className="section-title">Download My <span className="grad-text">Resume</span></h2>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>
          Grab a copy of my resume to see my full experience, education, and skill set.
        </p>
        <div className="resume-preview">
          <div className="resume-line heading" />
          <div className="resume-line short" />
          <div className="resume-line med" style={{ marginBottom: 20 }} />
          <div className="resume-line heading" />
          <div className="resume-line full" />
          <div className="resume-line full" />
          <div className="resume-line med" style={{ marginBottom: 20 }} />
          <div className="resume-line heading" />
          <div className="resume-line full" />
          <div className="resume-line med" />
        </div>
        <button onClick={handleDownload} className="btn-primary" style={{ margin: '0 auto' }}>
          ⬇ Download PDF Resume
        </button>
      </div>
    </section>
  );
}

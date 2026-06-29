import { useEffect, useRef } from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default function Footer() {
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          footerRef.current.classList.add('footer-visible')
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const socials = [
    { href: 'https://github.com/rakeshkumar-mandal', icon: <FaGithub />, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/rakesh-kumar-mandal/', icon: <FaLinkedin />, label: 'LinkedIn' },
    { href: 'https://twitter.com', icon: <FaTwitter />, label: 'Twitter' },
    { href: 'mailto:rakeshmandaltech@gmail.com', icon: <MdEmail />, label: 'Email' },
  ]

  return (
    <footer ref={footerRef} className="footer-hidden">
      <div className="footer-logo">Dev.Portfolio</div>
      <div className="footer-copy">2026 Rakesh Mandal Built with MERN Stack</div>
      <div className="footer-right">
        <div className="footer-socials">
          {socials.map(s => (
            <a key={s.label} href={s.href} className="social-link" target="_blank" rel="noreferrer noopener" aria-label={s.label}>
              {s.icon}
            </a>
          ))}
        </div>
        <button onClick={scrollToTop} className="back-to-top">
          Top
        </button>
      </div>
    </footer>
  )
}
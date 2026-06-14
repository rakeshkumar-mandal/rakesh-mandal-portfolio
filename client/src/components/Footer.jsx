import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">Dev.Portfolio</div>
      <div className="footer-copy">© 2026 Rakesh Mandal · Built with MERN Stack ❤️</div>
      <div className="footer-socials">
        {[
          { href: 'https://github.com/rakeshkumar-mandal',            icon: <FaGithub />,   label: 'GitHub'   },
          { href: 'https://www.linkedin.com/in/rakesh-kumar-mandal/', icon: <FaLinkedin />, label: 'LinkedIn' },
          { href: 'https://twitter.com',                              icon: <FaTwitter />,  label: 'Twitter'  },
          { href: 'mailto:rakeshmandaltech@gmail.com',                icon: <MdEmail />,    label: 'Email'    },
        ].map(s => (
          <a key={s.label} href={s.href} className="social-link" target="_blank" rel="noreferrer" title={s.label}>
            {s.icon}
          </a>
        ))}
      </div>
    </footer>
  )
}
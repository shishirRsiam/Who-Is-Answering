import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaDocker } from 'react-icons/fa';

function Footer() {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sessions', href: '/sessions' },
    { label: 'Profile', href: '/profile' },
  ];

  const techLinks = [
    { label: 'Django REST', href: 'https://www.django-rest-framework.org/' },
    { label: 'React', href: 'https://react.dev/' },
    { label: 'Docker', href: 'https://www.docker.com/' },
    { label: 'PostgreSQL', href: 'https://www.postgresql.org/' },
  ];

  return (
    <footer className="mt-auto border-t border-white/10 bg-midnight-900/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-tide-400 to-ember-400 text-sm font-bold text-midnight-900">
                S
              </span>
              <span className="font-display text-lg font-semibold text-white">
                Scale<span className="gradient-text">Hub</span>
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              An interactive platform for learning Docker horizontal scaling,
              Nginx load balancing, and JWT authentication — hands-on.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="dot-active" />
              <span className="text-xs text-slate-500">All systems operational</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="section-title mb-4">Navigation</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-slate-400 transition-colors hover:text-tide-400"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack + social */}
          <div>
            <h4 className="section-title mb-4">Built With</h4>
            <ul className="space-y-2">
              {techLinks.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 transition-colors hover:text-tide-400"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              {[
                { icon: <FaGithub />, href: 'https://github.com/shishirRsiam', label: 'GitHub' },
                { icon: <FaLinkedin />, href: '#', label: 'LinkedIn' },
                { icon: <FaTwitter />, href: '#', label: 'Twitter' },
              ].map(({ icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-tide-400/30 hover:bg-tide-400/10 hover:text-tide-400"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
          <span className="text-xs text-slate-500">
            © {year} ScaleHub. Open source under MIT License.
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            Built with <FaHeart className="text-ember-400" /> and <FaDocker className="text-tide-400" /> for developers.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

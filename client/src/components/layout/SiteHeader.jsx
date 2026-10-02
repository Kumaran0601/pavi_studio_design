import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { ThemeToggle } from '../common/ThemeToggle';

export function SiteHeader({ settings }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const navLinks = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/services', 'Services'],
    ['/classes', 'Aari Classes'],
    ['/gallery', 'Gallery'],
    ['/materials', 'Materials'],
    ['/contact', 'Contact'],
  ];

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Pavi Designer Studio home">
            <span className="brand-mark" style={{ color: '#fbbf24', background: '#72002f' }}>P</span>
            <span>
              <strong>Pavi</strong>
              <em>Designer Studio</em>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.slice(0, 6).map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <ThemeToggle />
            <WhatsAppButton settings={settings} label="WhatsApp" compact />
            <button
              type="button"
              className="menu-button"
              onClick={() => setOpen(v => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div className="mobile-menu">
          <div className="container">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Appearance</span>
              <ThemeToggle size="small" />
            </div>
            {navLinks.map(([to, label]) => (
              <Link key={to} to={to}>
                {label}
                <ArrowRight size={16} />
              </Link>
            ))}
            <WhatsAppButton settings={settings} label="Start a WhatsApp conversation" />
          </div>
        </div>
      )}
    </>
  );
}


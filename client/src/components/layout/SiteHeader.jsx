import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { ThemeToggle } from '../common/ThemeToggle';

export function SiteHeader({ settings }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [open]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/classes', label: 'Course' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/materials', label: 'Materials' },
    { to: '/contact', label: 'Contact' },
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
            {navLinks.map(item => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
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
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          <div className="container mobile-menu-inner">
            <nav className="mobile-nav-links">
              {navLinks.map(item => (
                <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
                  <span>{item.label}</span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-whatsapp">
              <WhatsAppButton settings={settings} label="Start a WhatsApp conversation" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


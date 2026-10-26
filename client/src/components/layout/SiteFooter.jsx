import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, MapPin, Phone } from 'lucide-react';

export function SiteFooter({ settings }) {
  const exactMapsUrl =
    settings?.googleMapsUrl && !settings.googleMapsUrl.includes('Pavi+Designer+Studio+Training+Center')
      ? settings.googleMapsUrl
      : 'https://www.google.com/maps/search/?api=1&query=20%2F1%2C+Padavattamman+Koil+Street%2C+Padi%2C+Chennai%2C+Tamil+Nadu+600050';

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark">P</span>
            <span>
              <strong>Pavi</strong>
              <em>Designer Studio</em>
            </span>
          </Link>
          <p className="footer-copy">
            Traditional South Indian craftsmanship presented through a premium modern studio experience.
          </p>
          <a
            className="social-link"
            href={settings?.instagramUrl || 'https://www.instagram.com/pavi_designer_studio/'}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={17} /> {settings?.instagramHandle || '@pavi_designer_studio'}
          </a>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/services">Services</Link>
          <Link to="/classes">Course</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/materials">Aari Materials</Link>
          <Link to="/admin/login">Studio Admin</Link>
        </div>
        <div>
          <h3>Contact</h3>
          {settings?.phones?.map(phone => (
            <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>
              <Phone size={15} /> {phone}
            </a>
          ))}
          <div className="address-line">
            <MapPin size={15} />{' '}
            <span>{settings?.addressLines?.join(', ') || '20/1, 1st Floor, Padavattamman Koil Street, Padi, Chennai - 600 050'}</span>
          </div>
          <a
            className="footer-map-link"
            href={exactMapsUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Get exact map location on Google Maps"
          >
            Get map location <ArrowRight size={13} className="arrow-icon" />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 Pavi Designer Studio & Training Center. All rights reserved.</span>
        <span>Built around the beauty of Aari work.</span>
      </div>
    </footer>
  );
}

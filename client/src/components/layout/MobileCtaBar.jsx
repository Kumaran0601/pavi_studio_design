import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';

export function MobileCtaBar({ settings }) {
  const phone = settings?.phones?.[0] || '+917358461060';
  return (
    <div className="mobile-cta">
      <a href={`tel:${phone.replace(/\s/g, '')}`}>
        <Phone size={17} />
        Call
      </a>
      <WhatsAppButton settings={settings} label="WhatsApp" iconOnly />
      <Link to="/contact">
        <Mail size={17} />
        Enquire
      </Link>
    </div>
  );
}

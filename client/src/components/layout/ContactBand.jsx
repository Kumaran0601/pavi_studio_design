import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';

export function ContactBand({ settings }) {
  const phone = settings?.phones?.[0] || '+91 73584 61060';
  return (
    <section className="contact-band">
      <div className="container contact-band-inner">
        <div>
          <span className="eyebrow light">Start a conversation</span>
          <h2>Have a design in mind?</h2>
          <p>
            Talk to Pavi Designer Studio about your Aari work, bridal blouse, customized design or Aari classes.
          </p>
        </div>
        <div className="contact-band-actions">
          <a className="button button-light" href={`tel:${phone.replace(/\s/g, '')}`}>
            <Phone size={17} /> Call now
          </a>
          <WhatsAppButton settings={settings} label="WhatsApp us" />
          <Link className="button button-gold" to="/contact">
            Send enquiry <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

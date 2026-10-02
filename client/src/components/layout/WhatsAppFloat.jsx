import React from 'react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export function WhatsAppFloat({ settings }) {
  const number = settings?.whatsappNumber || '917358461060';
  const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(
    'Hi Pavi Designer Studio, I would like to enquire about Aari embroidery work.'
  )}`;

  return (
    <aside className="whatsapp-float-container" aria-label="WhatsApp quick contact">
      <a
        className="whatsapp-float-link"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Pavi Designer Studio on WhatsApp"
      >
        {/* Pulsing ripple wave animation */}
        <span className="wa-pulse-wave" aria-hidden="true" />
        <span className="wa-pulse-wave wave-delayed" aria-hidden="true" />

        {/* Floating preview card / tooltip badge */}
        <div className="whatsapp-card-popup">
          <div className="wa-card-top">
            <span className="wa-card-brand">Pavi Designer Studio</span>
            <span className="wa-online-pill">
              <span className="wa-dot" /> Online
            </span>
          </div>
          <div className="wa-card-body">
            <span>Enquire about Aari work, bridal blouses & classes</span>
          </div>
        </div>

        {/* Main WhatsApp Round Button */}
        <div className="whatsapp-button-circle">
          <WhatsAppIcon size={30} color="#ffffff" />
          {/* Active online dot indicator */}
          <span className="wa-online-dot" aria-hidden="true" />
        </div>
      </a>
    </aside>
  );
}

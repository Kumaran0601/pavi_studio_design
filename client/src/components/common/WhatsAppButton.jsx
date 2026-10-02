import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

export function WhatsAppButton({ settings, label, compact, iconOnly, className = '' }) {
  const number = settings?.whatsappNumber || '917358461060';
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    'Hi Pavi Designer Studio, I would like to enquire about Aari embroidery work.'
  )}`;
  return (
    <a
      className={`whatsapp-button ${compact ? 'compact' : ''} ${iconOnly ? 'icon-only' : ''} ${className}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label || 'Chat on WhatsApp'}
    >
      <WhatsAppIcon size={iconOnly ? 20 : 18} />
      {!iconOnly && <span>{label}</span>}
    </a>
  );
}


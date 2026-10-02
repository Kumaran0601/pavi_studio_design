import React from 'react';
import { ArrowRight } from 'lucide-react';
import { defaultDetailImage } from '../../data/constants';

export function MaterialCard({ item, settings }) {
  const number = settings?.whatsappNumber || '917358461060';
  const href = `https://wa.me/${number}?text=${encodeURIComponent(
    `Hi Pavi Designer Studio, I would like to ${item.whatsappLabel?.toLowerCase() || 'enquire about materials'}.`
  )}`;
  return (
    <article className="material-card">
      <img src={item.imageUrl || defaultDetailImage} alt={item.name} loading="lazy" />
      <div>
        <span>{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.shortDescription}</p>
        <a className="text-link" href={href} target="_blank" rel="noreferrer">
          Enquire on WhatsApp <ArrowRight size={15} />
        </a>
      </div>
    </article>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { defaultDetailImage } from '../../data/constants';

export function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <Link to={`/services/${service.slug}`} className="card-image">
        <img src={service.imageUrl || defaultDetailImage} alt={service.title} loading="lazy" />
        <span className="card-arrow">
          <ArrowRight size={17} />
        </span>
      </Link>
      <div className="card-content">
        <span className="card-kicker">{String(service.sortOrder || 1).padStart(2, '0')}</span>
        <h3>{service.title}</h3>
        <p>{service.shortDescription}</p>
        <Link className="text-link" to={`/services/${service.slug}`}>
          {service.ctaLabel || 'Explore'} <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}

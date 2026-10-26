import React from 'react';
import { renderWithCleanDigits } from './FormattedText';

export function PageIntro({ eyebrow, title, description, image, imageAlt = 'Aari embroidery detail' }) {
  return (
    <section className="page-intro">
      <div className="container page-intro-inner">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{renderWithCleanDigits(title)}</h1>
          <p>{description}</p>
        </div>
        {image && (
          <div className="intro-image">
            <img src={image} alt={imageAlt} loading="eager" />
          </div>
        )}
      </div>
    </section>
  );
}

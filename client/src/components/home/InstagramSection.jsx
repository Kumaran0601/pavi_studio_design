import React from 'react';
import { Instagram } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export function InstagramSection({ data }) {
  return (
    <section className="section instagram-section">
      <div className="container">
        <div className="split-heading">
          <SectionHeading
            eyebrow="From the studio"
            title="See more of our work"
            copy={data.settings?.instagramHandle || '@pavi_designer_studio'}
          />
          <a
            className="button button-outline"
            href={data.settings?.instagramUrl || 'https://www.instagram.com/pavi_designer_studio/'}
            target="_blank"
            rel="noreferrer"
          >
            <Instagram size={17} /> Follow on Instagram
          </a>
        </div>
        <div className="instagram-grid">
          {(data.gallery || []).slice(0, 6).map(item => (
            <a
              href={data.settings?.instagramUrl || 'https://www.instagram.com/pavi_designer_studio/'}
              target="_blank"
              rel="noreferrer"
              key={item.id}
            >
              <img src={item.imageUrl} alt={item.altText} loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

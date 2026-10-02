import React from 'react';
import { ExternalLink, ArrowRight, MapPin } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export function LocationSection({ settings }) {
  return (
    <section className="section location-section">
      <div className="container location-card">
        <div>
          <SectionHeading
            eyebrow="Visit the studio"
            title="Find us in Padi, Chennai"
            copy="Pavi Designer Studio & Training Center"
          />
          <div className="location-details">
            <MapPin size={20} />
            <span>
              {settings?.addressLines?.map(line => (
                <span key={line}>{line}</span>
              ))}
            </span>
          </div>
          <a
            className="text-link"
            href={settings?.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ExternalLink size={15} />
          </a>
        </div>
        <div>
          <div className="map-frame" role="region" aria-label="Map showing Pavi Designer Studio in Padi, Chennai">
            <iframe
              title="Pavi Designer Studio Location Map"
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '4px' }}
              loading="lazy"
              allowFullScreen
              src="https://maps.google.com/maps?q=Padi%2C%20Chennai%2C%20Tamil%20Nadu%20600050&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>
          <div className="map-caption">
            <strong>Padi, Chennai - 600 050</strong>
            <a href={settings?.googleMapsUrl} target="_blank" rel="noreferrer">
              Open directions in Google Maps <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

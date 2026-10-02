import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { MaterialCard } from '../cards/MaterialCard';

export function MaterialsPreview({ materials, settings }) {
  return (
    <section className="section materials-section">
      <div className="container">
        <div className="split-heading">
          <SectionHeading
            eyebrow="At the studio"
            title="Aari materials available"
            copy="Basic Aari embroidery materials are available for sale at the studio. Ask us about what you need."
          />
          <WhatsAppButton settings={settings} label="Enquire about materials" />
        </div>
        <div className="materials-grid">
          {materials.slice(0, 4).map(item => (
            <MaterialCard key={item.id} item={item} settings={settings} />
          ))}
        </div>
      </div>
    </section>
  );
}

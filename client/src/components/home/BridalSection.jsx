import React from 'react';
import { Gem, Sparkles, Palette, Check } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { WhatsAppButton } from '../common/WhatsAppButton';

export function BridalSection({ image, settings }) {
  return (
    <section className="section bridal-section">
      <div className="container bridal-layout">
        <div className="bridal-image">
          <img src={image} alt="Bridal Aari blouse embroidery detail" />
          <div className="vertical-label">Bridal Aari Work</div>
        </div>
        <div className="bridal-copy">
          <SectionHeading
            eyebrow="For the special day"
            title="Bridal Aari work that complements your moment"
            copy="Detailed embroidery, traditional motifs, customized designs and thoughtful finishing for bridal blouse work that feels personal to you."
          />
          <div className="detail-points">
            <span>
              <Gem size={17} />
              Detailed handwork
            </span>
            <span>
              <Sparkles size={17} />
              Traditional motifs
            </span>
            <span>
              <Palette size={17} />
              Customized designs
            </span>
            <span>
              <Check size={17} />
              Finishing & detailing
            </span>
          </div>
          <WhatsAppButton settings={settings} label="Enquire about bridal work" />
        </div>
      </div>
    </section>
  );
}

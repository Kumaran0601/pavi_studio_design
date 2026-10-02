import React from 'react';
import { Gem, Sparkles, BookOpen, Palette } from 'lucide-react';
import { approvedTrainingImage, defaultSettingsFallback } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactBand } from '../components/layout/ContactBand';

export function AboutPage({ state }) {
  usePageMeta(
    'About Pavi Designer Studio | Aari Craftsmanship in Padi',
    'Learn about Pavi Designer Studio & Training Center, an Aari embroidery and training studio in Padi, Chennai with 8+ years of experience.',
    '/about'
  );
  const data = state.data;

  return (
    <>
      <PageIntro
        eyebrow="The studio"
        title="Craft, patience and a personal touch."
        description="Pavi Designer Studio & Training Center brings together traditional Aari embroidery craftsmanship and personalized creative design in Padi, Chennai."
        image={approvedTrainingImage}
        imageAlt="Pavi Designer Studio training and community event"
      />
      <section className="section story-section">
        <div className="container two-col">
          <div className="copy-column">
            <SectionHeading
              eyebrow="About Pavi Designer Studio"
              title="A modern studio for a deeply traditional craft"
              copy="With 8+ years of experience in Aari embroidery and related creative work, Pavi Designer Studio creates Aari embroidery, bridal blouse work and customized designs while also helping students learn the art through structured training."
            />
            <p className="body-copy">
              The studio is a place to discuss ideas, explore motifs, understand materials and make considered choices for a special blouse, occasion or creative project.
            </p>
          </div>
          <div className="image-stack">
            <img
              src={approvedTrainingImage}
              alt="Pavi Designer Studio training community"
              loading="lazy"
            />
            <div className="image-caption">
              <span>01</span>
              <span>Studio community</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section values-section">
        <div className="container">
          <SectionHeading eyebrow="What we do" title="A thoughtful range of studio services" align="center" />
          <div className="value-grid">
            {[
              [Gem, 'Aari embroidery', 'Detailed handwork, traditional motifs and customized details.'],
              [Sparkles, 'Bridal blouse work', 'A considered approach to bridal pieces, from design discussion to finishing.'],
              [BookOpen, 'Training', 'A one-month Aari embroidery course with practical guidance and certificate information.'],
              [Palette, 'Creative support', 'A place to discuss colours, motifs, materials and your own design direction.'],
            ].map(([Icon, title, text]) => (
              <div className="value-card" key={String(title)}>
                <Icon size={22} />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactBand settings={data?.settings || defaultSettingsFallback} />
    </>
  );
}

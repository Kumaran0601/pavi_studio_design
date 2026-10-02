import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  Gem,
  Palette,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { defaultHeroImage, defaultSettingsFallback } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageLoading } from '../components/common/PageLoading';
import { PageError } from '../components/common/PageError';
import { SectionHeading } from '../components/common/SectionHeading';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { ServiceCard } from '../components/cards/ServiceCard';
import { GalleryTile } from '../components/cards/GalleryTile';
import { Lightbox } from '../components/common/Lightbox';
import { BridalSection } from '../components/home/BridalSection';
import { ClassesSection } from '../components/home/ClassesSection';
import { MaterialsPreview } from '../components/home/MaterialsPreview';
import { InstagramSection } from '../components/home/InstagramSection';
import { ContactBand } from '../components/layout/ContactBand';
import { LocationSection } from '../components/home/LocationSection';

export function HomePage({ state }) {
  const data = state.data || {
    settings: defaultSettingsFallback,
    services: [],
    gallery: [],
    materials: [],
    course: {},
  };

  usePageMeta(
    'Pavi Designer Studio | Aari Embroidery & Bridal Blouse in Padi, Chennai',
    'Explore Aari embroidery, bridal blouse work, customized designs and Aari embroidery classes at Pavi Designer Studio & Training Center in Padi, Chennai.',
    '/',
    data.settings?.heroImageUrl
  );

  const [activeGalleryItem, setActiveGalleryItem] = useState(null);

  if (state.loading && !state.data) return <PageLoading />;
  if (state.error && !state.data) return <PageError message={state.error} />;

  const allGallery = data.gallery || [];
  const featured = allGallery.filter(item => item.isFeatured).length >= 6
    ? allGallery.filter(item => item.isFeatured).slice(0, 6)
    : allGallery.slice(0, 6);

  return (
    <>
      <section className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          poster={data.settings?.heroImageUrl || defaultHeroImage}
          aria-hidden="true"
        >
          <source src="/images/aari_video.mp4" type="video/mp4" />
        </video>
        {/* <div
          className="hero-image"
          style={{ backgroundImage: `url(${data.settings?.heroImageUrl || defaultHeroImage})` }}
        /> */}
        <div className="hero-overlay" />



        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow light">Pavi Designer Studio & Training Center</span>
            <h1>
              Traditional Aari Craft.
              <br />
              <em>Beautifully Made for You.</em>
            </h1>
            <p>
              8+ years of experience in Aari embroidery, bridal blouse work, customized designs and Aari embroidery training in Padi, Chennai.
            </p>
            <div className="hero-actions">
              <Link className="button button-light" to="/gallery">
                Explore Our Work <ArrowRight size={17} />
              </Link>
              <WhatsAppButton settings={data.settings} label="WhatsApp Us" />
            </div>
            <Link className="text-link light-link" to="/classes">
              Join Aari Classes <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-side-note">
            <span>01</span>
            <div>
              <strong>Crafted in Chennai</strong>
              <small>Traditional detail, considered finish.</small>
            </div>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="container highlight-grid">
          {[
            ['8+', 'Years of experience', Award],
            ['Aari', 'Embroidery', Scissors],
            ['Bridal', 'Blouse work', Gem],
            ['Aari', 'Training', BookOpen],
          ].map(([value, label, Icon]) => (
            <div className="highlight" key={String(label)}>
              <Icon size={21} />
              <strong>{String(value)}</strong>
              <span>{String(label)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-services">
        <div className="container">
          <SectionHeading
            eyebrow="The studio edit"
            title="Signature services"
            copy="Thoughtful embroidery, bridal detailing and practical guidance for every stage of your Aari journey."
          />
          <div className="service-grid">
            {(data.services || []).slice(0, 6).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div style={{ marginTop: '28px' }}>
            <Link className="button button-outline" to="/services">
              View all services <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-gallery">
        <div className="container">
          <div className="split-heading">
            <SectionHeading
              eyebrow="The work"
              title="A closer look at the detail"
              copy="Aari embroidery is a study in patience, texture and the quiet beauty of a well-finished piece."
            />
            <Link className="text-link" to="/gallery">
              View full gallery <ArrowRight size={16} />
            </Link>
          </div>

          <div className="featured-grid">
            {featured.map((item, index) => (
              <GalleryTile
                key={item.id || index}
                item={item}
                index={index}
                onClick={() => setActiveGalleryItem(item)}
              />
            ))}
          </div>
        </div>
      </section>


      <section className="section about-preview">
        <div className="container two-col">
          <div className="image-stack">
            <img
              src={data.gallery?.[3]?.imageUrl || data.settings?.heroImageUrl}
              alt="Embroidery detail on a bridal blouse"
            />
            <div className="image-caption">
              <span>01</span>
              <span>Finished with care</span>
            </div>
          </div>
          <div className="copy-column">
            <SectionHeading
              eyebrow="About the studio"
              title="Crafted with experience. Finished with care."
              copy="Pavi Designer Studio & Training Center brings together traditional Aari embroidery craftsmanship and personalized creative design. With 8+ years of experience, we create Aari embroidery, bridal blouse work and customized designs while also helping students learn the art of Aari embroidery through structured training."
            />
            <Link className="button button-primary" to="/about">
              Know more about us <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <BridalSection
        image={data.gallery?.[0]?.imageUrl || data.settings?.heroImageUrl}
        settings={data.settings}
      />

      <section className="section custom-section">
        <div className="container custom-layout">
          <div>
            <SectionHeading
              eyebrow="Made around your idea"
              title="Your design. Your colours. Your style."
              copy="Bring a reference, a motif, a colour direction or simply a feeling. We can discuss customized embroidery requirements for your blouse or occasion."
            />
            <div className="motif-list">
              {[
                'Floral motifs',
                'Peacock designs',
                'Traditional motifs',
                'Bridal motifs',
                'Personalized patterns',
                'Neckline & sleeve designs',
              ].map(item => (
                <span key={item}>
                  <Check size={15} />
                  {item}
                </span>
              ))}
            </div>
            <Link className="button button-primary" to="/services/customized-works">
              Discuss your custom design <ArrowRight size={17} />
            </Link>
          </div>
          <div className="custom-image">
            <img
              src={data.gallery?.[4]?.imageUrl || data.settings?.heroImageUrl}
              alt="Gold floral embroidery on maroon fabric"
            />
            <div className="ornament-note">Made for your moment</div>
          </div>
        </div>
      </section>

      <ClassesSection
        course={data.course}
        settings={data.settings}
        image={data.gallery?.[7]?.imageUrl || data.settings?.heroImageUrl}
      />

      <MaterialsPreview materials={data.materials || []} settings={data.settings} />

      <section className="section trust-section">
        <div className="container">
          <SectionHeading eyebrow="Why Pavi" title="A considered, personal approach" align="center" />
          <div className="trust-grid">
            {[
              [Sparkles, '8+ years of experience'],
              [Palette, 'Customized designs'],
              [Scissors, 'Traditional Aari craftsmanship'],
              [BookOpen, 'Practical training'],
              [Gem, 'Affordable creative work'],
              [Check, 'Personal attention'],
            ].map(([Icon, title]) => (
              <div className="trust-card" key={String(title)}>
                <Icon size={20} />
                <span>{String(title)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InstagramSection data={data} />
      <ContactBand settings={data.settings} />
      <LocationSection settings={data.settings} />

      {activeGalleryItem && (
        <Lightbox
          item={activeGalleryItem}
          items={featured}
          onClose={() => setActiveGalleryItem(null)}
          onChange={setActiveGalleryItem}
        />
      )}

    </>
  );
}


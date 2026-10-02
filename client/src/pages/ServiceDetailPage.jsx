import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { defaultDetailImage, defaultSettingsFallback } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { PageError } from '../components/common/PageError';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactBand } from '../components/layout/ContactBand';

export function ServiceDetailPage({ state }) {
  const { slug } = useParams();
  const service = (state.data?.services || []).find(item => item.slug === slug);

  usePageMeta(
    `${service?.title || 'Service'} | Pavi Designer Studio`,
    service?.shortDescription || 'Explore Pavi Designer Studio services in Padi, Chennai.',
    `/services/${slug || ''}`,
    service?.imageUrl
  );

  if (!service) return <PageError message="That service could not be found." />;

  const isBridal = slug === 'bridal-blouse';
  const isCustom = slug === 'customized-works';

  return (
    <>
      <PageIntro
        eyebrow={isBridal ? 'Bridal studio' : isCustom ? 'Made around your idea' : 'Aari craftsmanship'}
        title={service.title}
        description={service.longDescription || service.shortDescription}
        image={service.imageUrl}
      />
      <section className="section detail-section">
        <div className="container detail-layout">
          <div className="detail-copy">
            <SectionHeading
              eyebrow="A closer look"
              title={
                isBridal
                  ? 'Details that feel personal to your special day'
                  : isCustom
                  ? 'Your idea, translated into textile detail'
                  : 'Traditional technique, thoughtfully finished'
              }
              copy={service.longDescription || service.shortDescription}
            />
            {isCustom ? (
              <div className="process-list">
                {[
                  'Share your idea',
                  'Discuss the design',
                  'Finalize the embroidery details',
                  'Aari work is completed',
                  'Final finishing',
                ].map((step, index) => (
                  <div key={step}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="detail-points detail-points-dark">
                <span><Check size={17} />Traditional motifs</span>
                <span><Check size={17} />Detailed handwork</span>
                <span><Check size={17} />Customized designs</span>
                <span><Check size={17} />Finishing and detailing</span>
              </div>
            )}
            <Link className="button button-primary" to="/contact">
              {isBridal ? 'Enquire for bridal work' : isCustom ? 'Discuss your custom design' : 'Send your requirement'}{' '}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="detail-image">
            <img src={service.imageUrl || defaultDetailImage} alt={service.title} />
            <span>{service.title}</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Selected work"
            title="Explore the wider gallery"
            copy="View the studio portfolio and use the filters to browse different kinds of work."
          />
          <Link className="button button-outline" to="/gallery">
            View full gallery <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <ContactBand settings={state.data?.settings || defaultSettingsFallback} />
    </>
  );
}

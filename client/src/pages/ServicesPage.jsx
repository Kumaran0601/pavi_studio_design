import React from 'react';
import { defaultHeroImage } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { PageLoading } from '../components/common/PageLoading';
import { ServiceCard } from '../components/cards/ServiceCard';
import { ContactBand } from '../components/layout/ContactBand';

export function ServicesPage({ state }) {
  usePageMeta(
    'Services | Pavi Designer Studio Aari Work in Chennai',
    'Explore Aari embroidery, bridal blouse work, customized designs, brooches, saree drape, fabric painting and Aari materials at Pavi Designer Studio.',
    '/services'
  );
  if (!state.data) return <PageLoading />;

  return (
    <>
      <PageIntro
        eyebrow="Studio services"
        title="Work made around your occasion, idea and style."
        description="Explore the services available from Pavi Designer Studio & Training Center in Padi, Chennai."
        image={state.data.gallery?.[0]?.imageUrl || defaultHeroImage}
      />
      <section className="section">
        <div className="container">
          <div className="service-grid service-grid-large">
            {(state.data.services || []).map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
      <ContactBand settings={state.data.settings} />
    </>
  );
}

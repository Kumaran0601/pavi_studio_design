import React from 'react';
import { CircleAlert } from 'lucide-react';
import { defaultDetailImage } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { PageLoading } from '../components/common/PageLoading';
import { MaterialCard } from '../components/cards/MaterialCard';
import { ContactBand } from '../components/layout/ContactBand';

export function MaterialsPage({ state }) {
  usePageMeta(
    'Aari Materials in Chennai | Pavi Designer Studio',
    'Browse the Aari materials catalogue at Pavi Designer Studio in Padi, Chennai. Enquire on WhatsApp for current availability and details.',
    '/materials'
  );
  if (!state.data) return <PageLoading />;

  return (
    <>
      <PageIntro
        eyebrow="Studio catalogue"
        title="Aari materials available"
        description="Basic Aari embroidery materials are available for sale at the studio. Contact us on WhatsApp for orders."
        image={state.data.materials?.[0]?.imageUrl || defaultDetailImage}
      />
      <section className="section">
        <div className="container">
          <div className="catalogue-notice">
            <CircleAlert size={17} />
            <span>
              Direct studio catalogue. Enquire on WhatsApp for instant pricing, availability, and pickup details.
            </span>
          </div>
          <div className="materials-grid materials-grid-large">
            {(state.data.materials || []).map(item => (
              <MaterialCard key={item.id} item={item} settings={state.data.settings} />
            ))}
          </div>
        </div>
      </section>
      <ContactBand settings={state.data.settings} />
    </>
  );
}

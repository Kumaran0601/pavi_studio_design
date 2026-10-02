import React, { useState } from 'react';
import { defaultHeroImage } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { PageLoading } from '../components/common/PageLoading';
import { GalleryTile } from '../components/cards/GalleryTile';
import { Lightbox } from '../components/common/Lightbox';

export function GalleryPage({ state }) {
  usePageMeta(
    'Gallery | Aari Embroidery & Bridal Blouse Work in Chennai',
    'Browse the Pavi Designer Studio portfolio of Aari embroidery, bridal blouse work, customized details and textile craft.',
    '/gallery'
  );
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(null);

  if (!state.data) return <PageLoading />;

  const categories = ['All', 'Bridal', 'Aari Work', 'Customized', 'Blouse', 'Brooches', 'Training'];
  const items =
    filter === 'All'
      ? state.data.gallery || []
      : (state.data.gallery || []).filter(item => item.category === filter);

  return (
    <>
      <PageIntro
        eyebrow="The portfolio"
        title="Aari work, in detail."
        description="Browse embroidery, bridal blouse work, customized designs and more from the studio gallery."
        image={state.data.gallery?.[0]?.imageUrl || defaultHeroImage}
      />
      <section className="section gallery-page">
        <div className="container">
          <div className="filter-bar" role="tablist" aria-label="Gallery categories">
            {categories.map(category => (
              <button
                type="button"
                role="tab"
                aria-selected={filter === category}
                key={category}
                className={filter === category ? 'selected' : ''}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="gallery-masonry">
            {items.map((item, index) => (
              <GalleryTile item={item} index={index} key={item.id} onClick={() => setActive(item)} />
            ))}
          </div>
        </div>
      </section>
      {active && (
        <Lightbox item={active} items={items} onClose={() => setActive(null)} onChange={setActive} />
      )}
    </>
  );
}

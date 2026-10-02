import React from 'react';
import { ArrowRight } from 'lucide-react';

export function GalleryTile({ item, index, onClick }) {
  return (
    <button
      className="gallery-tile"
      onClick={onClick}
      aria-label={`View ${item.category} gallery image`}
      type="button"
    >
      <img
        src={item.imageUrl}
        alt={item.altText || item.caption || item.category || 'Aari embroidery work'}
        loading="lazy"
      />
      <span className="tile-overlay">
        <small>{item.category}</small>
        <strong>
          View work <ArrowRight size={15} />
        </strong>
      </span>
    </button>
  );
}

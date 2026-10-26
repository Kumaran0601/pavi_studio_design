import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function Lightbox({ item, items, onClose, onChange }) {
  const index = items.findIndex(entry => entry.id === item.id);
  const move = dir => onChange(items[(index + dir + items.length) % items.length]);

  useEffect(() => {
    document.body.classList.add('lightbox-open');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = event => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('lightbox-open');
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [index, items]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image viewer"
      onClick={onClose}
    >
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close image viewer">
        <X />
      </button>
      <button
        type="button"
        className="lightbox-arrow left"
        onClick={event => {
          event.stopPropagation();
          move(-1);
        }}
        aria-label="Previous image"
      >
        <ChevronLeft />
      </button>
      <figure onClick={event => event.stopPropagation()}>
        <img src={item.imageUrl} alt={item.altText} />
        <figcaption>
          <span>{item.category}</span>
          <strong>{item.caption || item.altText}</strong>
        </figcaption>
      </figure>
      <button
        type="button"
        className="lightbox-arrow right"
        onClick={event => {
          event.stopPropagation();
          move(1);
        }}
        aria-label="Next image"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

import { useEffect } from 'react';
import { defaultHeroImage } from '../data/constants';

export function usePageMeta(title, description, path, image) {
  useEffect(() => {
    document.title = title;
    const upsert = (selector, attributes, content) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
        document.head.appendChild(el);
      }
      Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
      if ('content' in el) el.content = content;
    };

    upsert('meta[name="description"]', { name: 'description' }, description);
    upsert('meta[property="og:title"]', { property: 'og:title' }, title);
    upsert('meta[property="og:description"]', { property: 'og:description' }, description);
    upsert('meta[property="og:type"]', { property: 'og:type' }, 'website');

    const canonical = `${window.location.origin}${path}`;
    const imgUrl = image ? new URL(image, window.location.origin).toString() : `${window.location.origin}${defaultHeroImage}`;
    upsert('meta[property="og:image"]', { property: 'og:image' }, imgUrl);
    upsert('meta[property="og:url"]', { property: 'og:url' }, canonical);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [title, description, path, image]);
}

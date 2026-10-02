import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';

export function NotFoundPage() {
  usePageMeta('Page not found | Pavi Designer Studio', 'The page you requested could not be found.', '/404');
  return (
    <div className="page-error">
      <span className="eyebrow">404</span>
      <h1>That page has moved.</h1>
      <p>Return to the studio home to continue exploring.</p>
      <Link className="button button-primary" to="/">
        Back to home <ArrowRight size={17} />
      </Link>
    </div>
  );
}

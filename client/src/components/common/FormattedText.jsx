import React from 'react';

/**
 * Ensures numbers (especially digit 1) render with unambiguous numeral typography
 * instead of Cormorant Garamond's Roman-like serif glyph.
 */
export function renderWithCleanDigits(text) {
  if (typeof text !== 'string') return text;
  const parts = text.split(/(\d+)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    /^\d+$/.test(part) ? (
      <span key={i} className="heading-digit">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function FormattedText({ children, className = '' }) {
  if (typeof children !== 'string') return <span className={className}>{children}</span>;
  return <span className={className}>{renderWithCleanDigits(children)}</span>;
}

import React from 'react';
import { Search } from 'lucide-react';

export function EmptyState({ title, copy }) {
  return (
    <div className="empty-state">
      <Search size={22} />
      <strong>{title}</strong>
      <span>{copy}</span>
    </div>
  );
}

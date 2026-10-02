import React from 'react';
import { Loader2 } from 'lucide-react';

export function PageLoading() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <Loader2 className="spin" />
      <span>Preparing the studio experience...</span>
    </div>
  );
}

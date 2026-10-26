import { useState, useEffect, useCallback, useRef } from 'react';
import { API } from '../data/constants';
import { onContentUpdated } from '../utils/contentSync';

export function useApi(path, initial = null) {
  const [state, setState] = useState({ data: initial, loading: true, error: null });
  const activeRef = useRef(true);

  const fetchContent = useCallback(
    async (silent = false) => {
      if (!silent) {
        setState(curr => ({ ...curr, loading: true }));
      }

      try {
        const url = `${API}${path}${path.includes('?') ? '&' : '?'}_t=${Date.now()}`;
        const res = await fetch(url, {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error?.message || 'Unable to load content.');

        if (activeRef.current) {
          setState({ data: payload.data, loading: false, error: null });
        }
        return payload.data;
      } catch (err) {
        if (activeRef.current) {
          setState(curr => ({
            data: curr.data ?? initial,
            loading: false,
            error: err instanceof Error ? err.message : 'Unable to load content.',
          }));
        }
      }
    },
    [path, initial]
  );

  useEffect(() => {
    activeRef.current = true;
    fetchContent(false);

    // Real-time listener: refetch instantly when admin changes content
    const unsubscribe = onContentUpdated(() => {
      fetchContent(true);
    });

    // Window focus / tab switch revalidation: refetch whenever user switches to this tab
    const handleFocus = () => {
      fetchContent(true);
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    });

    // Background safety poll every 15 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchContent(true);
      }
    }, 15000);

    return () => {
      activeRef.current = false;
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [fetchContent]);

  return { ...state, refetch: fetchContent };
}

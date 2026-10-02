import { useState, useEffect } from 'react';
import { API } from '../data/constants';

export function useApi(path, initial = null) {
  const [state, setState] = useState({ data: initial, loading: true, error: null });

  useEffect(() => {
    let active = true;
    setState({ data: initial, loading: true, error: null });

    fetch(`${API}${path}`, { credentials: 'include' })
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error?.message || 'Unable to load content.');
        return payload.data;
      })
      .then(data => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch(err => {
        if (active) {
          setState({
            data: initial,
            loading: false,
            error: err instanceof Error ? err.message : 'Unable to load content.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [path]);

  return state;
}

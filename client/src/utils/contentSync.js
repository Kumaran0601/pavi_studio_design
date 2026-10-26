/**
 * Cross-tab & intra-window real-time content synchronization.
 * Notifies any open public pages or admin tabs to instantly update
 * without requiring a manual browser page refresh.
 */

const CHANNEL_NAME = 'pavi_studio_content_sync_channel';
const STORAGE_KEY = 'pavi_last_content_update_ts';

let broadcastChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  broadcastChannel = null;
}

/**
 * Call this function whenever an admin creates, edits, or deletes
 * any content (services, course, gallery, materials, settings, etc.)
 */
export function notifyContentUpdated() {
  const timestamp = Date.now();

  try {
    localStorage.setItem(STORAGE_KEY, String(timestamp));
  } catch (e) {
    // Ignore storage quota errors
  }

  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type: 'CONTENT_UPDATED', timestamp });
    } catch (e) {
      // Ignore broadcast errors
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pavi:content-updated', { detail: { timestamp } }));
  }
}

/**
 * Subscribe to content update notifications across all tabs and windows.
 */
export function onContentUpdated(callback) {
  if (typeof window === 'undefined') return () => {};

  const handleCustomEvent = () => callback();
  const handleStorageEvent = e => {
    if (e.key === STORAGE_KEY) callback();
  };
  const handleChannelMessage = e => {
    if (e.data?.type === 'CONTENT_UPDATED') callback();
  };

  window.addEventListener('pavi:content-updated', handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleChannelMessage);
  }

  return () => {
    window.removeEventListener('pavi:content-updated', handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleChannelMessage);
    }
  };
}

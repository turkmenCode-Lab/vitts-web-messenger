export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const date = new Date(timestamp);

  if (diff < 60000) {
    return 'now';
  }

  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m`;
  }

  if (diff < 86400000) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  if (diff < 604800000) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatLastSeen(timestamp: number, isOnline: boolean): string {
  if (isOnline) {
    return 'online';
  }

  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60000) {
    return 'last seen just now';
  }

  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `last seen ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }

  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `last seen ${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  const date = new Date(timestamp);
  return `last seen ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

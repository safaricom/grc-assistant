// Centralized API base URL logic.
// Default to a relative base ('') so client-side code issues same-origin requests
// to /api which the frontend container's Nginx will proxy to the backend service.
export const getApiBase = (): string => {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  if (raw && raw !== '') return raw.replace(/\/$/, '');
  return '';
};

export const API_BASE = getApiBase();

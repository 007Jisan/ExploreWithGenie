export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
};

const decodeJwtPayload = (token) => {
  try {
    const [, payload] = String(token || '').split('.');
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(window.atob(padded));
  } catch (error) {
    return null;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;
  if (!payload.exp) return true;

  return payload.exp * 1000 > Date.now();
};

export const getValidToken = () => {
  const token = localStorage.getItem('token');
  if (isTokenValid(token)) {
    return token;
  }

  clearStoredAuth();
  return null;
};

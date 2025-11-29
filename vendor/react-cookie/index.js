import { useCallback, useEffect, useMemo, useState } from 'react';

const isBrowser = typeof document !== 'undefined';

const parseCookieString = () => {
  if (!isBrowser || !document.cookie) return {};
  return document.cookie.split(';').reduce((acc, entry) => {
    const [rawKey, ...rest] = entry.split('=');
    const key = decodeURIComponent(rawKey.trim());
    const value = decodeURIComponent(rest.join('=').trim());
    if (key) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

const serializeCookie = (name, value, options = {}) => {
  const segments = [];
  segments.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);

  if (options.path) segments.push(`Path=${options.path}`);
  if (options.domain) segments.push(`Domain=${options.domain}`);
  if (typeof options.maxAge === 'number') segments.push(`Max-Age=${options.maxAge}`);
  if (options.expires instanceof Date) segments.push(`Expires=${options.expires.toUTCString()}`);
  if (options.secure) segments.push('Secure');
  if (options.sameSite) segments.push(`SameSite=${options.sameSite}`);

  return segments.join('; ');
};

export const CookiesProvider = ({ children }) => children ?? null;

export const withCookies = (Component) => (props) => (
  <Component {...props} cookies={parseCookieString()} />
);

export const useCookies = () => {
  const [cookies, setCookieState] = useState(() => parseCookieString());

  useEffect(() => {
    if (!isBrowser) return;
    setCookieState(parseCookieString());
  }, []);

  const setCookie = useCallback((name, value, options = {}) => {
    if (!isBrowser) return;
    const cookieOptions = { path: '/', ...options };
    document.cookie = serializeCookie(name, value, cookieOptions);
    setCookieState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const removeCookie = useCallback((name, options = {}) => {
    if (!isBrowser) return;
    const cookieOptions = { path: '/', ...options, expires: new Date(0) };
    document.cookie = serializeCookie(name, '', cookieOptions);
    setCookieState((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  return useMemo(() => [cookies, setCookie, removeCookie], [cookies, setCookie, removeCookie]);
};

export const useCookie = (name) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  return useMemo(() => [cookies[name], setCookie, removeCookie], [cookies, name, setCookie, removeCookie]);
};

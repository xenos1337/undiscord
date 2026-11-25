// Discord's API now rejects (401) some user-token requests that lack the headers
// the official web client sends. Try to reuse the client's own values, and fall
// back to building them from the browser environment.

let cached = null;

function findWebpackSuperProps() {
  try {
    const chunk = window.webpackChunkdiscord_app;
    if (!chunk) return null;
    let req;
    chunk.push([[Symbol('undiscord')], {}, r => { req = r; }]);
    if (!req?.c) return null;
    for (const id in req.c) {
      const exp = req.c[id]?.exports;
      if (!exp || typeof exp !== 'object') continue;
      for (const key of [null, ...Object.keys(exp)]) {
        const obj = key === null ? exp : exp[key];
        if (obj && typeof obj.getSuperPropertiesBase64 === 'function') {
          const v = obj.getSuperPropertiesBase64();
          if (typeof v === 'string' && v.length) return v;
        }
      }
    }
  } catch { /* ignore */ }
  return null;
}

function buildSuperProps() {
  const ua = navigator.userAgent;
  let browser = 'Chrome';
  let browserVersion = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || '';
  if (/Edg\//.test(ua)) { browser = 'Edge'; browserVersion = (ua.match(/Edg\/([\d.]+)/) || [])[1] || ''; }
  else if (/Firefox\//.test(ua)) { browser = 'Firefox'; browserVersion = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || ''; }
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) { browser = 'Safari'; browserVersion = (ua.match(/Version\/([\d.]+)/) || [])[1] || ''; }

  let os = 'Windows';
  if (/Mac OS X/.test(ua)) os = 'Mac OS X';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/iPhone|iPad/.test(ua)) os = 'iOS';
  else if (/Linux/.test(ua)) os = 'Linux';

  const props = {
    os,
    browser,
    device: '',
    system_locale: navigator.language || 'en-US',
    browser_user_agent: ua,
    browser_version: browserVersion,
    os_version: '',
    referrer: '',
    referring_domain: '',
    referrer_current: '',
    referring_domain_current: '',
    release_channel: 'stable',
    client_build_number: 0,
    client_event_source: null,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(props))));
}

export function getClientHeaders() {
  if (!cached) {
    let tz = 'UTC';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || tz; } catch { /* ignore */ }
    cached = {
      'X-Super-Properties': findWebpackSuperProps() || buildSuperProps(),
      'X-Discord-Locale': navigator.language || 'en-US',
      'X-Discord-Timezone': tz,
    };
  }
  return cached;
}

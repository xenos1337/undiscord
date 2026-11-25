// Discord may enforce Trusted Types (CSP "require-trusted-types-for 'script'"),
// which makes plain string assignments to innerHTML / insertAdjacentHTML throw.
// Wrap HTML strings in a TrustedHTML object when the browser supports it.

let policy;

export default function trustedHtml(html) {
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (policy === undefined) {
      policy = null;
      for (const name of ['undiscord', 'undiscord-' + Math.random().toString(36).slice(2), 'default']) {
        try {
          policy = window.trustedTypes.createPolicy(name, { createHTML: s => s });
          break;
        } catch { /* name not allowed or already taken, try next */ }
      }
    }
    if (policy) return policy.createHTML(html);
  }
  return html;
}

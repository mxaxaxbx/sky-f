// Worker that uses marked from CDN to parse markdown off the main thread.
// The worker loads marked via importScripts at runtime.

self.addEventListener('message', (ev) => {
  const { id, content } = ev.data || {};
  if (!content) {
    self.postMessage({ id, html: '' });
    return;
  }

  // Try to load marked if not available. This will only run once.
  if (typeof self.marked === 'undefined') {
    try {
      importScripts('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    } catch (e) {
      // If CDN load fails, fall back to returning raw escaped text
      const escaped = (content || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');
      self.postMessage({ id, html: `<pre>${escaped}</pre>`, error: true });
      return;
    }
  }

  try {
    const html = self.marked.parse(content || '');
    self.postMessage({ id, html });
  } catch (err) {
    const escaped = (content || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
    self.postMessage({ id, html: `<pre>${escaped}</pre>`, error: true });
  }
});

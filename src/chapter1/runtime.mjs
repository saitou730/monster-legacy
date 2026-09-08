import * as controller from './progression.mjs';
import * as adapter from './root-adapter.mjs';

// Root integration API. UI bindings are a separate gate, not an automatic reroute.
window.MLChapter1 = Object.freeze({
  ...controller,
  migrateRootChapter: adapter.migrateRootChapter,
  applyRootChapterEvent: adapter.applyRootChapterEvent
});
window.dispatchEvent(new Event('mlchapter1ready'));

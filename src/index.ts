import {bootstrapPolyfills} from './polyfills/custom-elements.js';

// We explicitly run the polyfills and THEN dynamically import the components.
// This prevents ES Module hoisting from executing component definitions prematurely in Safari.
bootstrapPolyfills().then(() => {
  import('./components.js');
});

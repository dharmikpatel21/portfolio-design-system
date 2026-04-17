// polyfills/custom-elements.ts

// Export a synchronous flag so components can check for Safari instantly
export const IS_SAFARI_OR_WEBKIT =
  typeof navigator !== 'undefined' &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

async function bootstrapPolyfills() {
  // 1. Declarative Shadow DOM polyfill
  if (
    typeof document !== 'undefined' &&
    !HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')
  ) {
    const {hydrateShadowRoots} = await import(
      '@webcomponents/template-shadowroot/template-shadowroot.js'
    );
    hydrateShadowRoots(document.body);
  }

  // 2. Feature detection for customized built-in elements
  const supportsCustomizedBuiltIn = (() => {
    if (IS_SAFARI_OR_WEBKIT) return false; // Always polyfill Safari to be safe
    try {
      const name = 'ds-feature-check';
      if (!customElements.get(name)) {
        customElements.define(name, class extends HTMLButtonElement {}, {
          extends: 'button',
        });
      }
      const el = document.createElement('button', {is: name});
      return el.constructor !== HTMLButtonElement;
    } catch (e) {
      return false;
    }
  })();

  // 3. Load the @ungap polyfill if the browser (Safari) needs it
  if (!supportsCustomizedBuiltIn) {
    await import('@ungap/custom-elements');
  }
}

export {bootstrapPolyfills};

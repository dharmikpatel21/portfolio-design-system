// Load before any component code in your entry point
// Patches Safari's missing customized built-in element support

async function bootstrapPolyfills() {
  // Declarative Shadow DOM polyfill for older browsers
  if (!HTMLTemplateElement.prototype.hasOwnProperty('shadowRootMode')) {
    const {hydrateShadowRoots} = await import(
      '@webcomponents/template-shadowroot/template-shadowroot.js'
    );
    hydrateShadowRoots(document.body);
  }

  // Hybrid detection for customized built-in elements
  // 1. Feature detection: Check if a created element is actually upgraded
  // 2. UA Sniffing fallback: Force for Safari/Webkit to be safe
  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes('AppleWebKit') &&
      !navigator.userAgent.includes('Chrome'));

  const supportsCustomizedBuiltIn = (() => {
    if (isSafari) return false; // Always polyfill Safari to be safe
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

  if (!supportsCustomizedBuiltIn) {
    // Patches Safari to support <button is="ds-button-native">
    await import('@ungap/custom-elements');
  }
}

export {bootstrapPolyfills};

import {DsBadge} from './ds-badge';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-badge', () => {
  test('is defined', () => {
    const el = document.createElement('ds-badge');
    assert.instanceOf(el, DsBadge);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<ds-badge>Badge</ds-badge>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="badge primary" part="badge">
        <slot></slot>
      </div>
    `
    );
  });

  test('renders with a set label', async () => {
    const el = await fixture(html`<ds-badge label="Test"></ds-badge>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="badge primary" part="badge">
        Test
        <slot></slot>
      </div>
    `
    );
  });

  test('renders with different variants', async () => {
    const el = await fixture(html`<ds-badge variant="secondary">Secondary</ds-badge>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="badge secondary" part="badge">
        <slot></slot>
      </div>
    `
    );
  });

  test('renders outline variant', async () => {
    const el = await fixture(html`<ds-badge variant="outline">Outline</ds-badge>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="badge outline" part="badge">
        <slot></slot>
      </div>
    `
    );
  });
});

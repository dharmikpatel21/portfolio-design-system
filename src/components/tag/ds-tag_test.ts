import {DsTag} from './ds-tag';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-tag', () => {
  test('is defined', () => {
    const el = document.createElement('ds-tag');
    assert.instanceOf(el, DsTag);
  });

  test('renders with label', async () => {
    const el = await fixture(html`<ds-tag label="React"></ds-tag>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="tag primary" part="tag">
        React
        <slot></slot>
      </div>
    `
    );
  });

  test('renders with different variants', async () => {
    const el = await fixture(html`<ds-tag variant="neutral">TypeScript</ds-tag>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="tag neutral" part="tag">
        <slot></slot>
      </div>
    `
    );
  });

  test('renders danger variant', async () => {
    const el = await fixture(html`<ds-tag variant="danger">High</ds-tag>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="tag danger" part="tag">
        <slot></slot>
      </div>
    `
    );
  });
});

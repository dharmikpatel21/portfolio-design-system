import {DsHero} from './ds-hero';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../badge/ds-badge';

suite('ds-hero', () => {
  test('is defined', () => {
    const el = document.createElement('ds-hero');
    assert.instanceOf(el, DsHero);
  });

  test('renders with title and description', async () => {
    const el = await fixture(html`<ds-hero title="Welcome" description="The hero component."></ds-hero>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="hero" part="hero">
        <h1>Welcome<slot name="title"></slot></h1>
        <p>The hero component.<slot name="description"></slot></p>
        <div class="actions">
          <slot name="actions"></slot>
          <slot></slot>
        </div>
      </div>
    `
    );
  });

  test('renders with badge text', async () => {
    const el = await fixture(html`<ds-hero badgeText="New"></ds-hero>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="hero" part="hero">
        <div class="badge-container">
          <ds-badge variant="primary" label="New"></ds-badge>
        </div>
        <h1><slot name="title"></slot></h1>
        <p><slot name="description"></slot></p>
        <div class="actions">
          <slot name="actions"></slot>
          <slot></slot>
        </div>
      </div>
    `
    );
  });
});

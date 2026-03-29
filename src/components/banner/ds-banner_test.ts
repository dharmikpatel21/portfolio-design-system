import {DsBanner} from './ds-banner';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-banner', () => {
  test('is defined', () => {
    const el = document.createElement('ds-banner');
    assert.instanceOf(el, DsBanner);
  });

  test('renders with title and description', async () => {
    const el = await fixture(html`<ds-banner title="Info" description="This is a test banner."></ds-banner>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="banner info" part="banner">
        <span class="icon">info</span>
        <div class="content">
          <h5>Info</h5>
          <p>This is a test banner.<slot></slot></p>
        </div>
      </div>
    `
    );
  });

  test('renders different variants', async () => {
    const el = await fixture(html`<ds-banner variant="success" icon="check_circle"></ds-banner>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="banner success" part="banner">
        <span class="icon">check_circle</span>
        <div class="content">
          <p><slot></slot></p>
        </div>
      </div>
    `
    );
  });

  test('renders dismissible banner', async () => {
    const el = await fixture(html`<ds-banner dismissible></ds-banner>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="banner info" part="banner">
        <span class="icon">info</span>
        <div class="content">
          <p><slot></slot></p>
        </div>
        <span class="icon close">
          <slot name="close-icon">close</slot>
        </span>
      </div>
    `
    );
  });
});

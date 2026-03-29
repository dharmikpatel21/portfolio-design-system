import {DsCard} from './ds-card';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-card', () => {
  test('is defined', () => {
    const el = document.createElement('ds-card');
    assert.instanceOf(el, DsCard);
  });

  test('renders with title and description', async () => {
    const el = await fixture(html`<ds-card title="Project" description="Testing a card."></ds-card>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="card" part="card">
        <div class="media-container">
          <slot name="media"></slot>
        </div>
        <h4>Project</h4>
        <p>Testing a card.</p>
        <slot></slot>
      </div>
    `
    );
  });

  test('renders with image', async () => {
    const el = await fixture(html`<ds-card image="test.png" title="Project"></ds-card>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="card" part="card">
        <div class="media-container">
          <slot name="media">
            <div class="image-container">
              <img src="test.png" alt="Project" />
            </div>
          </slot>
        </div>
        <h4>Project</h4>
        <slot></slot>
      </div>
    `
    );
  });

  test('renders with footer', async () => {
    const el = await fixture(html`<ds-card footerText="Explore" footerIcon="arrow_forward"></ds-card>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="card" part="card">
        <div class="media-container">
          <slot name="media"></slot>
        </div>
        <slot></slot>
        <div class="footer">
          <span class="footer-text">Explore</span>
          <span class="icon">arrow_forward</span>
        </div>
      </div>
    `
    );
  });
});

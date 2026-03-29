import {DsAvatar} from './ds-avatar';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-avatar', () => {
  test('is defined', () => {
    const el = document.createElement('ds-avatar');
    assert.instanceOf(el, DsAvatar);
  });

  test('renders with initials', async () => {
    const el = await fixture(html`<ds-avatar initials="JD"></ds-avatar>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="avatar medium" part="avatar">
        <span>JD</span>
      </div>
    `
    );
  });

  test('renders with image', async () => {
    const el = await fixture(html`<ds-avatar src="test.jpg" alt="Test Name"></ds-avatar>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="avatar medium" part="avatar">
        <img src="test.jpg" alt="Test Name" />
      </div>
    `
    );
  });

  test('renders with status', async () => {
    const el = await fixture(html`<ds-avatar initials="JD" status="online"></ds-avatar>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="avatar medium" part="avatar">
        <span>JD</span>
        <div class="status online" part="status"></div>
      </div>
    `
    );
  });

  test('renders in different sizes', async () => {
    const el = await fixture(html`<ds-avatar initials="JD" size="small"></ds-avatar>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="avatar small" part="avatar">
        <span>JD</span>
      </div>
    `
    );
  });
});

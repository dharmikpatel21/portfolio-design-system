import {DsNavbar} from './ds-navbar';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';
import '../avatar/ds-avatar';
import '../sheet/ds-sheet';

suite('ds-navbar', () => {
  test('is defined', () => {
    const el = document.createElement('ds-navbar');
    assert.instanceOf(el, DsNavbar);
  });

  test('renders with logo text and icon', async () => {
    const el = await fixture(html`<ds-navbar logoText="My App" logoIcon="home"></ds-navbar>`);
    const logoText = el.shadowRoot!.querySelector('.logo-text')!;
    assert.include(logoText.textContent, 'My App');
    
    const logoIcon = el.shadowRoot!.querySelector('.logo-icon')!;
    assert.equal(logoIcon.textContent, 'home');
  });

  test('renders with logo image', async () => {
    const el = await fixture(html`<ds-navbar logoText="My App" .logoImage="${{src: 'logo.png', alt: 'Test Logo'}}"></ds-navbar>`);
    const avatar = el.shadowRoot!.querySelector('ds-avatar')!;
    assert.equal(avatar.getAttribute('src'), 'logo.png');
    assert.equal(avatar.getAttribute('alt'), 'Test Logo');
  });

  test('renders version tag', async () => {
    const el = await fixture(html`<ds-navbar version="v1.0.0"></ds-navbar>`);
    const version = el.shadowRoot!.querySelector('.logo-version')!;
    assert.equal(version.textContent, 'v1.0.0');
  });
});

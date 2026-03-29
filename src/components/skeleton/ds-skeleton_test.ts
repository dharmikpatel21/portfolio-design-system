import {DsSkeleton} from './ds-skeleton';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-skeleton', () => {
  test('is defined', () => {
    const el = document.createElement('ds-skeleton');
    assert.instanceOf(el, DsSkeleton);
  });

  test('renders with custom size and style', async () => {
    const el = await fixture(html`<ds-skeleton width="200px" height="40px" borderRadius="12px"></ds-skeleton>`);
    const skeleton = el.shadowRoot!.querySelector('.skeleton') as HTMLElement;
    assert.equal(skeleton.style.width, '200px');
    assert.equal(skeleton.style.height, '40px');
    assert.equal(skeleton.style.borderRadius, '12px');
  });

  test('pulse class applied by default', async () => {
    const el = await fixture(html`<ds-skeleton></ds-skeleton>`);
    const skeleton = el.shadowRoot!.querySelector('.skeleton')!;
    assert.isTrue(skeleton.classList.contains('animate-pulse'));
  });

  test('pulse class can be disabled', async () => {
    const el = await fixture(html`<ds-skeleton .pulse="${false}"></ds-skeleton>`);
    const skeleton = el.shadowRoot!.querySelector('.skeleton')!;
    assert.isFalse(skeleton.classList.contains('animate-pulse'));
  });
});

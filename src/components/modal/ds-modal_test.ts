import {DsModal} from './ds-modal';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-modal', () => {
  test('is defined', () => {
    const el = document.createElement('ds-modal');
    assert.instanceOf(el, DsModal);
  });

  test('renders with title when open', async () => {
    const el = await fixture(html`<ds-modal title="Delete Account" open>Are you sure?</ds-modal>`);
    const backdrop = el.shadowRoot!.querySelector('.backdrop')!;
    assert.isTrue(backdrop.classList.contains('open'));
    
    const h2 = el.shadowRoot!.querySelector('h2')!;
    assert.equal(h2.textContent, 'Delete Account');
  });

  test('size property applies class', async () => {
    const el = await fixture(html`<ds-modal size="lg" open></ds-modal>`);
    const container = el.shadowRoot!.querySelector('.modal-container')!;
    assert.isTrue(container.classList.contains('lg'));
  });

  test('dispatches close event when clicking close button', async () => {
    const el = (await fixture(html`<ds-modal open></ds-modal>`)) as DsModal;
    const button = el.shadowRoot!.querySelector('.close-button') as HTMLButtonElement;
    
    setTimeout(() => button.click());
    await oneEvent(el, 'close');
    
    assert.isFalse(el.open);
  });
});

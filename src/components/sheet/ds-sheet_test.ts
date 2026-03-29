import {DsSheet} from './ds-sheet';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-sheet', () => {
  test('is defined', () => {
    const el = document.createElement('ds-sheet');
    assert.instanceOf(el, DsSheet);
  });

  test('renders with title when open', async () => {
    const el = await fixture(html`<ds-sheet title="Settings" open>Menu</ds-sheet>`);
    const backdrop = el.shadowRoot!.querySelector('.backdrop')!;
    assert.isTrue(backdrop.classList.contains('open'));
    
    const h2 = el.shadowRoot!.querySelector('h2')!;
    assert.equal(h2.textContent, 'Settings');
  });

  test('side property applies class', async () => {
    const el = await fixture(html`<ds-sheet side="right" open></ds-sheet>`);
    const container = el.shadowRoot!.querySelector('.sheet-container')!;
    assert.isTrue(container.classList.contains('right'));
  });

  test('dispatches close event', async () => {
    const el = (await fixture(html`<ds-sheet open></ds-sheet>`)) as DsSheet;
    const button = el.shadowRoot!.querySelector('.close-button') as HTMLButtonElement;
    
    setTimeout(() => button.click());
    await oneEvent(el, 'close');
    
    assert.isFalse(el.open);
  });
});

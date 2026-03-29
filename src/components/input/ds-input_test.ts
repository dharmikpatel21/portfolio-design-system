import {DsInput} from './ds-input';
import {fixture, assert, oneEvent} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-input', () => {
  test('is defined', () => {
    const el = document.createElement('ds-input');
    assert.instanceOf(el, DsInput);
  });

  test('renders with label and placeholder', async () => {
    const el = await fixture(html`<ds-input label="Name" placeholder="Enter your name"></ds-input>`);
    assert.shadowDom.equal(
      el,
      `
      <label>Name</label>
      <div class="input-container">
        <input type="text" placeholder="Enter your name" />
      </div>
    `
    );
  });

  test('renders with icon', async () => {
    const el = await fixture(html`<ds-input icon="search"></ds-input>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="input-container has-icon">
        <span class="icon">search</span>
        <input type="text" placeholder="" />
      </div>
    `
    );
  });

  test('renders error state', async () => {
    const el = await fixture(html`<ds-input error="Invalid input"></ds-input>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="input-container">
        <input type="text" placeholder="" />
      </div>
      <div class="error-text">
        <span class="icon" style="position:static; transform:none; font-size:12px">error</span>
        Invalid input
      </div>
    `
    );
  });

  test('dispatches input event', async () => {
    const el = (await fixture(html`<ds-input></ds-input>`)) as DsInput;
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test';
    
    setTimeout(() => input.dispatchEvent(new Event('input')));
    const {detail} = await oneEvent(el, 'input');
    
    assert.equal(detail.value, 'test');
    assert.equal(el.value, 'test');
  });
});

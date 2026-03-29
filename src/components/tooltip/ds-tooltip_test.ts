import {DsTooltip} from './ds-tooltip';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-tooltip', () => {
  test('is defined', () => {
    const el = document.createElement('ds-tooltip');
    assert.instanceOf(el, DsTooltip);
  });

  test('renders trigger and content', async () => {
    const el = await fixture(html`<ds-tooltip content="Helpful info" title="Tip">Hover over me</ds-tooltip>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="tooltip-trigger" part="trigger">
        <slot></slot>
      </div>
      <div class="tooltip-content top" part="content">
        <div class="tooltip-title">Tip</div>
        <div class="tooltip-body">Helpful info<slot name="content"></slot></div>
      </div>
    `
    );
  });

  test('bottom position applies class', async () => {
    const el = await fixture(html`<ds-tooltip content="Info" position="bottom"></ds-tooltip>`);
    const content = el.shadowRoot!.querySelector('.tooltip-content')!;
    assert.isTrue(content.classList.contains('bottom'));
  });

  test('renders without title', async () => {
    const el = await fixture(html`<ds-tooltip content="Just info"></ds-tooltip>`);
    const title = el.shadowRoot!.querySelector('.tooltip-title');
    assert.isNull(title);
    
    const body = el.shadowRoot!.querySelector('.tooltip-body')!;
    assert.include(body.textContent, 'Just info');
  });
});

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { DsButton } from './ds-button';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
suite('ds-button', () => {
    test('is defined', () => {
        const el = document.createElement('ds-button');
        assert.instanceOf(el, DsButton);
    });
    test('renders with default values', async () => {
        const el = await fixture(html `<ds-button></ds-button>`);
        assert.shadowDom.equal(el, `
      <button part="button">
        Button component (Count: 0)
      </button>
      <slot></slot>
    `);
    });
    test('renders with a set label', async () => {
        const el = await fixture(html `<ds-button label="Test"></ds-button>`);
        assert.shadowDom.equal(el, `
      <button part="button">
        Test (Count: 0)
      </button>
      <slot></slot>
    `);
    });
    test('handles a click', async () => {
        const el = (await fixture(html `<ds-button></ds-button>`));
        const button = el.shadowRoot.querySelector('button');
        button.click();
        await el.updateComplete;
        assert.shadowDom.equal(el, `
      <button part="button">
        Button component (Count: 1)
      </button>
      <slot></slot>
    `);
    });
    test('styling applied', async () => {
        const el = (await fixture(html `<ds-button></ds-button>`));
        await el.updateComplete;
        const button = el.shadowRoot.querySelector('button');
        assert.equal(getComputedStyle(button).paddingTop, '16px');
    });
});
//# sourceMappingURL=ds-button_test.js.map
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {DsButton} from './ds-button';

import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('ds-button', () => {
  test('is defined', () => {
    const el = document.createElement('ds-button');
    assert.instanceOf(el, DsButton);
  });

  test('renders with default values', async () => {
    const el = await fixture(html`<ds-button></ds-button>`);
    assert.shadowDom.equal(
      el,
      `
      <button class="primary" part="button">
        <slot></slot>
      </button>
    `
    );
  });

  test('renders with a set label', async () => {
    const el = await fixture(html`<ds-button label="Test"></ds-button>`);
    assert.shadowDom.equal(
      el,
      `
      <button class="primary" part="button">
        <span part="label">Test</span>
        <slot></slot>
      </button>
    `
    );
  });

  test('renders with variant icon', async () => {
    const el = await fixture(html`<ds-button variant="icon">rocket</ds-button>`) as DsButton;
    assert.shadowDom.equal(
      el,
      `
      <button class="icon" part="button">
        <slot></slot>
      </button>
    `
    );
  });

  test('renders with prefix and suffix icons', async () => {
    const el = await fixture(html`<ds-button label="Test" iconPrefix="add" iconSuffix="arrow_forward"></ds-button>`) as DsButton;
    assert.shadowDom.equal(
      el,
      `
      <button class="primary" part="button">
        <i class="icon-element" part="icon-prefix">add</i>
        <span part="label">Test</span>
        <slot></slot>
        <i class="icon-element" part="icon-suffix">arrow_forward</i>
      </button>
    `
    );
  });

  test('styling applied', async () => {
    const el = (await fixture(html`<ds-button></ds-button>`)) as DsButton;
    await el.updateComplete;
    const button = el.shadowRoot!.querySelector('button')!;
    assert.equal(getComputedStyle(button).borderRadius, '8px');
    assert.equal(getComputedStyle(button).paddingTop, '8px');
  });
});

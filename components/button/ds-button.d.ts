import { LitElement } from 'lit';
/**
 * DsButton component
 * Part of the Portfolio Design System
 */
export declare class DsButton extends LitElement {
    static styles: import("lit").CSSResult;
    label: string;
    count: number;
    render(): import("lit-html").TemplateResult<1>;
    private _onClick;
}
declare global {
    interface HTMLElementTagNameMap {
        'ds-button': DsButton;
    }
}
//# sourceMappingURL=ds-button.d.ts.map
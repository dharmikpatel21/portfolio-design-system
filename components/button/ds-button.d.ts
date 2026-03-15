import { LitElement } from 'lit';
export type ButtonVariant = 'primary' | 'slate' | 'danger' | 'ghost' | 'icon';
/**
 * DsButton component
 * Part of the Portfolio Design System
 */
export declare class DsButton extends LitElement {
    static styles: import("lit").CSSResult;
    label: string;
    variant: ButtonVariant;
    disabled: boolean;
    tiny: boolean;
    iconPrefix: string;
    iconSuffix: string;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'ds-button': DsButton;
    }
}
//# sourceMappingURL=ds-button.d.ts.map
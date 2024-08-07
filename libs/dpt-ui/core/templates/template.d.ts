/**
* DevExtreme (core/templates/template.d.ts)
* Version: 24.1.3
* Build date: Tue Jun 11 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
*/
import {
    UserDefinedElement,
} from '../element';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.dpt-ext-ui.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTemplateOptions {
    /**
     * Specifies the name of the template.
     */
    name?: string;
}
/**
 * A custom template&apos;s markup.
 */
export type dxTemplate = Template;

 // eslint-disable-next-line @typescript-eslint/no-extraneous-class
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.dpt-ext-ui.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export class Template {
    constructor(options?: dxTemplateOptions);
}

/**
 * A template notation used to specify templates for UI component elements.
 */
export type template = string | Function | UserDefinedElement;

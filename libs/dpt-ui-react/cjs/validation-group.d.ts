/*!
 * dpt-ui-react
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/dpt-ui-react
 */

import * as React from "react";
import { Ref, ReactElement } from "react";
import dxValidationGroup, { Properties } from "dpt-ui/ui/validation_group";
import { IHtmlOptions } from "./core/component";
import type { DisposingEvent, InitializedEvent } from "dpt-ui/ui/validation_group";
type ReplaceFieldTypes<TSource, TReplacement> = {
    [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
};
type IValidationGroupOptionsNarrowedEvents = {
    onDisposing?: ((e: DisposingEvent) => void);
    onInitialized?: ((e: InitializedEvent) => void);
};
type IValidationGroupOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IValidationGroupOptionsNarrowedEvents> & IHtmlOptions>;
interface ValidationGroupRef {
    instance: () => dxValidationGroup;
}
declare const ValidationGroup: (props: React.PropsWithChildren<IValidationGroupOptions> & {
    ref?: Ref<ValidationGroupRef>;
}) => ReactElement | null;
export default ValidationGroup;
export { ValidationGroup, IValidationGroupOptions, ValidationGroupRef };
import type * as ValidationGroupTypes from 'dpt-ui/ui/validation_group_types';
export { ValidationGroupTypes };

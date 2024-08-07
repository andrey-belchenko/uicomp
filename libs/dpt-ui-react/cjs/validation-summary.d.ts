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

export { ExplicitTypes } from "dpt-ui/ui/validation_summary";
import * as React from "react";
import { Ref, ReactElement } from "react";
import dxValidationSummary, { Properties } from "dpt-ui/ui/validation_summary";
import { IHtmlOptions, IElementDescriptor } from "./core/component";
import type { CollectionWidgetItem } from "dpt-ui/ui/collection/ui.collection_widget.base";
import type { ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent } from "dpt-ui/ui/validation_summary";
import type { template } from "dpt-ui/core/templates/template";
type ReplaceFieldTypes<TSource, TReplacement> = {
    [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
};
type IValidationSummaryOptionsNarrowedEvents<TItem = any, TKey = any> = {
    onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
    onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
    onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
};
type IValidationSummaryOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IValidationSummaryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
    dataSource?: Properties<TItem, TKey>["dataSource"];
    itemRender?: (...params: any) => React.ReactNode;
    itemComponent?: React.ComponentType<any>;
    defaultItems?: Array<any | CollectionWidgetItem | string>;
    onItemsChange?: (value: Array<any | CollectionWidgetItem | string>) => void;
}>;
interface ValidationSummaryRef<TItem = any, TKey = any> {
    instance: () => dxValidationSummary<TItem, TKey>;
}
declare const ValidationSummary: <TItem = any, TKey = any>(props: ReplaceFieldTypes<Properties<TItem, TKey>, IValidationSummaryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
    dataSource?: import("../../dpt-ui/artifacts/npm/dpt-ui/data/data_source").DataSourceLike<TItem, TKey> | null | undefined;
    itemRender?: ((...params: any) => React.ReactNode) | undefined;
    itemComponent?: React.ComponentType<any> | undefined;
    defaultItems?: any[] | undefined;
    onItemsChange?: ((value: Array<any | CollectionWidgetItem | string>) => void) | undefined;
} & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<ValidationSummaryRef<TItem, TKey>> | undefined;
}) => ReactElement | null;
type IItemProps = React.PropsWithChildren<{
    disabled?: boolean;
    html?: string;
    template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
    text?: string;
    visible?: boolean;
    render?: (...params: any) => React.ReactNode;
    component?: React.ComponentType<any>;
}>;
declare const _componentItem: React.MemoExoticComponent<(props: IItemProps) => React.FunctionComponentElement<IItemProps>>;
declare const Item: typeof _componentItem & IElementDescriptor;
export default ValidationSummary;
export { ValidationSummary, IValidationSummaryOptions, ValidationSummaryRef, Item, IItemProps };
import type * as ValidationSummaryTypes from 'dpt-ui/ui/validation_summary_types';
export { ValidationSummaryTypes };

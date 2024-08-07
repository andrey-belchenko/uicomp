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

export { ExplicitTypes } from "dpt-ui/ui/gallery";
import * as React from "react";
import { Ref, ReactElement } from "react";
import dxGallery, { Properties } from "dpt-ui/ui/gallery";
import { IHtmlOptions, IElementDescriptor } from "./core/component";
import type { dxGalleryItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent } from "dpt-ui/ui/gallery";
import type { CollectionWidgetItem } from "dpt-ui/ui/collection/ui.collection_widget.base";
import type { template } from "dpt-ui/core/templates/template";
type ReplaceFieldTypes<TSource, TReplacement> = {
    [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
};
type IGalleryOptionsNarrowedEvents<TItem = any, TKey = any> = {
    onContentReady?: ((e: ContentReadyEvent<TItem, TKey>) => void);
    onDisposing?: ((e: DisposingEvent<TItem, TKey>) => void);
    onInitialized?: ((e: InitializedEvent<TItem, TKey>) => void);
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
    onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
    onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
    onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
};
type IGalleryOptions<TItem = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TItem, TKey>, IGalleryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
    dataSource?: Properties<TItem, TKey>["dataSource"];
    itemRender?: (...params: any) => React.ReactNode;
    itemComponent?: React.ComponentType<any>;
    defaultItems?: Array<any | dxGalleryItem | string>;
    defaultSelectedIndex?: number;
    defaultSelectedItem?: any;
    onItemsChange?: (value: Array<any | dxGalleryItem | string>) => void;
    onSelectedIndexChange?: (value: number) => void;
    onSelectedItemChange?: (value: any) => void;
}>;
interface GalleryRef<TItem = any, TKey = any> {
    instance: () => dxGallery<TItem, TKey>;
}
declare const Gallery: <TItem = any, TKey = any>(props: ReplaceFieldTypes<Properties<TItem, TKey>, IGalleryOptionsNarrowedEvents<TItem, TKey>> & IHtmlOptions & {
    dataSource?: import("../../dpt-ui/artifacts/npm/dpt-ui/data/data_source").DataSourceLike<TItem, TKey> | null | undefined;
    itemRender?: ((...params: any) => React.ReactNode) | undefined;
    itemComponent?: React.ComponentType<any> | undefined;
    defaultItems?: any[] | undefined;
    defaultSelectedIndex?: number | undefined;
    defaultSelectedItem?: any;
    onItemsChange?: ((value: Array<any | dxGalleryItem | string>) => void) | undefined;
    onSelectedIndexChange?: ((value: number) => void) | undefined;
    onSelectedItemChange?: ((value: any) => void) | undefined;
} & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<GalleryRef<TItem, TKey>> | undefined;
}) => ReactElement | null;
type IItemProps = React.PropsWithChildren<{
    disabled?: boolean;
    html?: string;
    imageAlt?: string;
    imageSrc?: string;
    template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
    text?: string;
    render?: (...params: any) => React.ReactNode;
    component?: React.ComponentType<any>;
}>;
declare const _componentItem: React.MemoExoticComponent<(props: IItemProps) => React.FunctionComponentElement<IItemProps>>;
declare const Item: typeof _componentItem & IElementDescriptor;
export default Gallery;
export { Gallery, IGalleryOptions, GalleryRef, Item, IItemProps };
import type * as GalleryTypes from 'dpt-ui/ui/gallery_types';
export { GalleryTypes };

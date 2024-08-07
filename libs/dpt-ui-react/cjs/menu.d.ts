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

export { ExplicitTypes } from "dpt-ui/ui/menu";
import * as React from "react";
import { Ref, ReactElement } from "react";
import dxMenu, { Properties } from "dpt-ui/ui/menu";
import { IHtmlOptions, IElementDescriptor } from "./core/component";
import type { dxMenuItem, ContentReadyEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemRenderedEvent, SubmenuHiddenEvent, SubmenuHidingEvent, SubmenuShowingEvent, SubmenuShownEvent } from "dpt-ui/ui/menu";
import type { AnimationConfig, AnimationState } from "dpt-ui/animation/fx";
import type { PositionConfig } from "dpt-ui/animation/position";
import type { CollectionWidgetItem } from "dpt-ui/ui/collection/ui.collection_widget.base";
import type { template } from "dpt-ui/core/templates/template";
type ReplaceFieldTypes<TSource, TReplacement> = {
    [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
};
type IMenuOptionsNarrowedEvents<TKey = any> = {
    onContentReady?: ((e: ContentReadyEvent<TKey>) => void);
    onDisposing?: ((e: DisposingEvent<TKey>) => void);
    onInitialized?: ((e: InitializedEvent<TKey>) => void);
    onItemClick?: ((e: ItemClickEvent<TKey>) => void);
    onItemContextMenu?: ((e: ItemContextMenuEvent<TKey>) => void);
    onItemRendered?: ((e: ItemRenderedEvent<TKey>) => void);
    onSubmenuHidden?: ((e: SubmenuHiddenEvent<TKey>) => void);
    onSubmenuHiding?: ((e: SubmenuHidingEvent<TKey>) => void);
    onSubmenuShowing?: ((e: SubmenuShowingEvent<TKey>) => void);
    onSubmenuShown?: ((e: SubmenuShownEvent<TKey>) => void);
};
type IMenuOptions<TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TKey>, IMenuOptionsNarrowedEvents<TKey>> & IHtmlOptions & {
    dataSource?: Properties<TKey>["dataSource"];
    itemRender?: (...params: any) => React.ReactNode;
    itemComponent?: React.ComponentType<any>;
    defaultItems?: Array<dxMenuItem>;
    defaultSelectedItem?: any;
    onItemsChange?: (value: Array<dxMenuItem>) => void;
    onSelectedItemChange?: (value: any) => void;
}>;
interface MenuRef<TKey = any> {
    instance: () => dxMenu<TKey>;
}
declare const Menu: <TKey = any>(props: ReplaceFieldTypes<Properties<TKey>, IMenuOptionsNarrowedEvents<TKey>> & IHtmlOptions & {
    dataSource?: import("../../dpt-ui/artifacts/npm/dpt-ui/data/data_source").DataSourceLike<dxMenuItem, TKey> | null | undefined;
    itemRender?: ((...params: any) => React.ReactNode) | undefined;
    itemComponent?: React.ComponentType<any> | undefined;
    defaultItems?: dxMenuItem[] | undefined;
    defaultSelectedItem?: any;
    onItemsChange?: ((value: Array<dxMenuItem>) => void) | undefined;
    onSelectedItemChange?: ((value: any) => void) | undefined;
} & {
    children?: React.ReactNode;
} & {
    ref?: React.Ref<MenuRef<TKey>> | undefined;
}) => ReactElement | null;
type IAnimationProps = React.PropsWithChildren<{
    hide?: AnimationConfig;
    show?: AnimationConfig;
}>;
declare const _componentAnimation: React.MemoExoticComponent<(props: IAnimationProps) => React.FunctionComponentElement<IAnimationProps>>;
declare const Animation: typeof _componentAnimation & IElementDescriptor;
type IAtProps = React.PropsWithChildren<{
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
}>;
declare const _componentAt: React.MemoExoticComponent<(props: IAtProps) => React.FunctionComponentElement<IAtProps>>;
declare const At: typeof _componentAt & IElementDescriptor;
type IBoundaryOffsetProps = React.PropsWithChildren<{
    x?: number;
    y?: number;
}>;
declare const _componentBoundaryOffset: React.MemoExoticComponent<(props: IBoundaryOffsetProps) => React.FunctionComponentElement<IBoundaryOffsetProps>>;
declare const BoundaryOffset: typeof _componentBoundaryOffset & IElementDescriptor;
type ICollisionProps = React.PropsWithChildren<{
    x?: "fit" | "flip" | "flipfit" | "none";
    y?: "fit" | "flip" | "flipfit" | "none";
}>;
declare const _componentCollision: React.MemoExoticComponent<(props: ICollisionProps) => React.FunctionComponentElement<ICollisionProps>>;
declare const Collision: typeof _componentCollision & IElementDescriptor;
type IDelayProps = React.PropsWithChildren<{
    hide?: number;
    show?: number;
}>;
declare const _componentDelay: React.MemoExoticComponent<(props: IDelayProps) => React.FunctionComponentElement<IDelayProps>>;
declare const Delay: typeof _componentDelay & IElementDescriptor;
type IFromProps = React.PropsWithChildren<{
    left?: number;
    opacity?: number;
    position?: PositionConfig;
    scale?: number;
    top?: number;
}>;
declare const _componentFrom: React.MemoExoticComponent<(props: IFromProps) => React.FunctionComponentElement<IFromProps>>;
declare const From: typeof _componentFrom & IElementDescriptor;
type IHideProps = React.PropsWithChildren<{
    complete?: (($element: any, config: AnimationConfig) => void);
    delay?: number;
    direction?: "bottom" | "left" | "right" | "top";
    duration?: number;
    easing?: string;
    from?: AnimationState;
    staggerDelay?: number;
    start?: (($element: any, config: AnimationConfig) => void);
    to?: AnimationState;
    type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>;
declare const _componentHide: React.MemoExoticComponent<(props: IHideProps) => React.FunctionComponentElement<IHideProps>>;
declare const Hide: typeof _componentHide & IElementDescriptor;
type IItemProps = React.PropsWithChildren<{
    beginGroup?: boolean;
    closeMenuOnClick?: boolean;
    disabled?: boolean;
    icon?: string;
    items?: Array<dxMenuItem>;
    linkAttr?: Record<string, any>;
    selectable?: boolean;
    selected?: boolean;
    template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
    text?: string;
    url?: string;
    visible?: boolean;
    render?: (...params: any) => React.ReactNode;
    component?: React.ComponentType<any>;
}>;
declare const _componentItem: React.MemoExoticComponent<(props: IItemProps) => React.FunctionComponentElement<IItemProps>>;
declare const Item: typeof _componentItem & IElementDescriptor;
type IMyProps = React.PropsWithChildren<{
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
}>;
declare const _componentMy: React.MemoExoticComponent<(props: IMyProps) => React.FunctionComponentElement<IMyProps>>;
declare const My: typeof _componentMy & IElementDescriptor;
type IOffsetProps = React.PropsWithChildren<{
    x?: number;
    y?: number;
}>;
declare const _componentOffset: React.MemoExoticComponent<(props: IOffsetProps) => React.FunctionComponentElement<IOffsetProps>>;
declare const Offset: typeof _componentOffset & IElementDescriptor;
type IPositionProps = React.PropsWithChildren<{
    at?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
        x?: "center" | "left" | "right";
        y?: "bottom" | "center" | "top";
    };
    boundary?: any | string;
    boundaryOffset?: Record<string, any> | string | {
        x?: number;
        y?: number;
    };
    collision?: Record<string, any> | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | {
        x?: "fit" | "flip" | "flipfit" | "none";
        y?: "fit" | "flip" | "flipfit" | "none";
    };
    my?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
        x?: "center" | "left" | "right";
        y?: "bottom" | "center" | "top";
    };
    of?: any | string;
    offset?: Record<string, any> | string | {
        x?: number;
        y?: number;
    };
}>;
declare const _componentPosition: React.MemoExoticComponent<(props: IPositionProps) => React.FunctionComponentElement<IPositionProps>>;
declare const Position: typeof _componentPosition & IElementDescriptor;
type IShowProps = React.PropsWithChildren<{
    complete?: (($element: any, config: AnimationConfig) => void);
    delay?: number;
    direction?: "bottom" | "left" | "right" | "top";
    duration?: number;
    easing?: string;
    from?: AnimationState;
    staggerDelay?: number;
    start?: (($element: any, config: AnimationConfig) => void);
    to?: AnimationState;
    type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>;
declare const _componentShow: React.MemoExoticComponent<(props: IShowProps) => React.FunctionComponentElement<IShowProps>>;
declare const Show: typeof _componentShow & IElementDescriptor;
type IShowFirstSubmenuModeProps = React.PropsWithChildren<{
    delay?: number | Record<string, any> | {
        hide?: number;
        show?: number;
    };
    name?: "onClick" | "onHover";
}>;
declare const _componentShowFirstSubmenuMode: React.MemoExoticComponent<(props: IShowFirstSubmenuModeProps) => React.FunctionComponentElement<IShowFirstSubmenuModeProps>>;
declare const ShowFirstSubmenuMode: typeof _componentShowFirstSubmenuMode & IElementDescriptor;
type IShowSubmenuModeProps = React.PropsWithChildren<{
    delay?: number | Record<string, any> | {
        hide?: number;
        show?: number;
    };
    name?: "onClick" | "onHover";
}>;
declare const _componentShowSubmenuMode: React.MemoExoticComponent<(props: IShowSubmenuModeProps) => React.FunctionComponentElement<IShowSubmenuModeProps>>;
declare const ShowSubmenuMode: typeof _componentShowSubmenuMode & IElementDescriptor;
type IToProps = React.PropsWithChildren<{
    left?: number;
    opacity?: number;
    position?: PositionConfig;
    scale?: number;
    top?: number;
}>;
declare const _componentTo: React.MemoExoticComponent<(props: IToProps) => React.FunctionComponentElement<IToProps>>;
declare const To: typeof _componentTo & IElementDescriptor;
export default Menu;
export { Menu, IMenuOptions, MenuRef, Animation, IAnimationProps, At, IAtProps, BoundaryOffset, IBoundaryOffsetProps, Collision, ICollisionProps, Delay, IDelayProps, From, IFromProps, Hide, IHideProps, Item, IItemProps, My, IMyProps, Offset, IOffsetProps, Position, IPositionProps, Show, IShowProps, ShowFirstSubmenuMode, IShowFirstSubmenuModeProps, ShowSubmenuMode, IShowSubmenuModeProps, To, IToProps };
import type * as MenuTypes from 'dpt-ui/ui/menu_types';
export { MenuTypes };

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

"use client";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import dxResponsiveBox from "dpt-ui/ui/responsive_box";
import { Component as BaseComponent } from "./core/component";
import NestedOption from "./core/nested-option";
const ResponsiveBox = memo(forwardRef((props, ref) => {
    const baseRef = useRef(null);
    useImperativeHandle(ref, () => ({
        instance() {
            return baseRef.current?.getInstance();
        }
    }), [baseRef.current]);
    const subscribableOptions = useMemo(() => (["items"]), []);
    const independentEvents = useMemo(() => (["onContentReady", "onDisposing", "onInitialized", "onItemClick", "onItemContextMenu", "onItemHold", "onItemRendered"]), []);
    const defaults = useMemo(() => ({
        defaultItems: "items",
    }), []);
    const expectedChildren = useMemo(() => ({
        col: { optionName: "cols", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true },
        row: { optionName: "rows", isCollectionItem: true }
    }), []);
    const templateProps = useMemo(() => ([
        {
            tmplOption: "itemTemplate",
            render: "itemRender",
            component: "itemComponent"
        },
    ]), []);
    return (React.createElement((BaseComponent), {
        WidgetClass: dxResponsiveBox,
        ref: baseRef,
        subscribableOptions,
        independentEvents,
        defaults,
        expectedChildren,
        templateProps,
        ...props,
    }));
}));
const _componentCol = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const Col = Object.assign(_componentCol, {
    OptionName: "cols",
    IsCollectionItem: true,
});
const _componentItem = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const Item = Object.assign(_componentItem, {
    OptionName: "items",
    IsCollectionItem: true,
    ExpectedChildren: {
        location: { optionName: "location", isCollectionItem: true }
    },
    TemplateProps: [{
            tmplOption: "template",
            render: "render",
            component: "component"
        }],
});
const _componentLocation = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const Location = Object.assign(_componentLocation, {
    OptionName: "location",
    IsCollectionItem: true,
});
const _componentRow = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const Row = Object.assign(_componentRow, {
    OptionName: "rows",
    IsCollectionItem: true,
});
export default ResponsiveBox;
export { ResponsiveBox, Col, Item, Location, Row };

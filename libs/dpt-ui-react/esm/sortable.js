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
import dxSortable from "dpt-ui/ui/sortable";
import { Component as BaseComponent } from "./core/component";
import NestedOption from "./core/nested-option";
const Sortable = memo(forwardRef((props, ref) => {
    const baseRef = useRef(null);
    useImperativeHandle(ref, () => ({
        instance() {
            return baseRef.current?.getInstance();
        }
    }), [baseRef.current]);
    const independentEvents = useMemo(() => (["onAdd", "onDisposing", "onDragChange", "onDragEnd", "onDragMove", "onDragStart", "onInitialized", "onRemove", "onReorder"]), []);
    const expectedChildren = useMemo(() => ({
        cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
    }), []);
    const templateProps = useMemo(() => ([
        {
            tmplOption: "dragTemplate",
            render: "dragRender",
            component: "dragComponent"
        },
    ]), []);
    return (React.createElement((BaseComponent), {
        WidgetClass: dxSortable,
        ref: baseRef,
        independentEvents,
        expectedChildren,
        templateProps,
        ...props,
    }));
}));
const _componentCursorOffset = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const CursorOffset = Object.assign(_componentCursorOffset, {
    OptionName: "cursorOffset",
});
export default Sortable;
export { Sortable, CursorOffset };

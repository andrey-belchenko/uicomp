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
import dxValidationGroup from "dpt-ui/ui/validation_group";
import { Component as BaseComponent } from "./core/component";
const ValidationGroup = memo(forwardRef((props, ref) => {
    const baseRef = useRef(null);
    useImperativeHandle(ref, () => ({
        instance() {
            return baseRef.current?.getInstance();
        }
    }), [baseRef.current]);
    const independentEvents = useMemo(() => (["onDisposing", "onInitialized"]), []);
    return (React.createElement((BaseComponent), {
        WidgetClass: dxValidationGroup,
        ref: baseRef,
        independentEvents,
        ...props,
    }));
}));
export default ValidationGroup;
export { ValidationGroup };

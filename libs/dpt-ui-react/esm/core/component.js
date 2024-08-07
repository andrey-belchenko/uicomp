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

import * as React from 'react';
import { useImperativeHandle, forwardRef, useRef, useLayoutEffect, useCallback, } from 'react';
import { ComponentBase } from './component-base';
import { elementIsExtension } from './extension-component';
const Component = forwardRef((props, ref) => {
    const componentBaseRef = useRef(null);
    const extensionCreators = useRef([]);
    const registerExtension = useCallback((creator) => {
        extensionCreators.current.push(creator);
    }, [extensionCreators.current]);
    const createExtensions = useCallback(() => {
        extensionCreators.current.forEach((creator) => creator(componentBaseRef.current?.getElement()));
    }, [extensionCreators.current, componentBaseRef.current]);
    const renderChildren = useCallback(() => React.Children.map(
    // @ts-expect-error TS2339
    props.children, (child) => {
        if (child && elementIsExtension(child)) {
            return React.cloneElement(child, { onMounted: registerExtension });
        }
        return child;
    }), [props, registerExtension]);
    const createWidget = useCallback((el) => {
        componentBaseRef.current?.createWidget(el);
    }, [componentBaseRef.current]);
    const clearExtensions = useCallback(() => {
        if (props.clearExtensions) {
            props.clearExtensions();
        }
        extensionCreators.current = [];
    }, [
        extensionCreators.current,
        props.clearExtensions,
    ]);
    useLayoutEffect(() => {
        createWidget();
        createExtensions();
        return () => {
            clearExtensions();
        };
    }, []);
    useImperativeHandle(ref, () => ({
        getInstance() {
            return componentBaseRef.current?.getInstance();
        },
        getElement() {
            return componentBaseRef.current?.getElement();
        },
        createWidget(el) {
            createWidget(el);
        },
        clearExtensions() {
            clearExtensions();
        },
    }), [componentBaseRef.current, createWidget, clearExtensions]);
    return (React.createElement(ComponentBase, { ref: componentBaseRef, renderChildren: renderChildren, ...props }));
});
export { Component, };

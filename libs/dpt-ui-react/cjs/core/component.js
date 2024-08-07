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

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const component_base_1 = require("./component-base");
const extension_component_1 = require("./extension-component");
const Component = (0, react_1.forwardRef)((props, ref) => {
    const componentBaseRef = (0, react_1.useRef)(null);
    const extensionCreators = (0, react_1.useRef)([]);
    const registerExtension = (0, react_1.useCallback)((creator) => {
        extensionCreators.current.push(creator);
    }, [extensionCreators.current]);
    const createExtensions = (0, react_1.useCallback)(() => {
        extensionCreators.current.forEach((creator) => creator(componentBaseRef.current?.getElement()));
    }, [extensionCreators.current, componentBaseRef.current]);
    const renderChildren = (0, react_1.useCallback)(() => React.Children.map(
    // @ts-expect-error TS2339
    props.children, (child) => {
        if (child && (0, extension_component_1.elementIsExtension)(child)) {
            return React.cloneElement(child, { onMounted: registerExtension });
        }
        return child;
    }), [props, registerExtension]);
    const createWidget = (0, react_1.useCallback)((el) => {
        componentBaseRef.current?.createWidget(el);
    }, [componentBaseRef.current]);
    const clearExtensions = (0, react_1.useCallback)(() => {
        if (props.clearExtensions) {
            props.clearExtensions();
        }
        extensionCreators.current = [];
    }, [
        extensionCreators.current,
        props.clearExtensions,
    ]);
    (0, react_1.useLayoutEffect)(() => {
        createWidget();
        createExtensions();
        return () => {
            clearExtensions();
        };
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
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
    return (React.createElement(component_base_1.ComponentBase, { ref: componentBaseRef, renderChildren: renderChildren, ...props }));
});
exports.Component = Component;

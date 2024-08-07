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
exports.TemplateWrapper = void 0;
const React = __importStar(require("react"));
const events = __importStar(require("dpt-ui/events"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const component_base_1 = require("./component-base");
const helpers_1 = require("./helpers");
const createHiddenNode = (containerNodeName, ref, defaultElement) => {
    const style = { display: 'none' };
    switch (containerNodeName) {
        case 'TABLE':
            return React.createElement("tbody", { style: style, ref: ref });
        case 'TBODY':
            return React.createElement("tr", { style: style, ref: ref });
        default:
            return React.createElement(defaultElement, { style, ref });
    }
};
const TemplateWrapperComponent = ({ templateFactory, data, index, container, onRemoved, onRendered, }) => {
    const [removalListenerRequired, setRemovalListenerRequired] = (0, react_1.useState)(false);
    const isRemovalLocked = (0, react_1.useRef)(false);
    const removalLocker = (0, react_1.useMemo)(() => ({
        lock() { isRemovalLocked.current = true; },
        unlock() { isRemovalLocked.current = false; },
    }), []);
    const element = (0, react_1.useRef)();
    const hiddenNodeElement = (0, react_1.useRef)();
    const removalListenerElement = (0, react_1.useRef)();
    const onTemplateRemoved = (0, react_1.useCallback)((_, args) => {
        if (args?.isUnmounting || isRemovalLocked.current) {
            return;
        }
        if (element.current) {
            events.off(element.current, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
        }
        if (removalListenerElement.current) {
            events.off(removalListenerElement.current, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
        }
        onRemoved();
    }, [onRemoved]);
    (0, react_1.useLayoutEffect)(() => {
        const el = element.current;
        if (el && el.nodeType === Node.ELEMENT_NODE) {
            events.off(el, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
            events.on(el, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
        }
        else if (!removalListenerRequired) {
            setRemovalListenerRequired(true);
        }
        else if (removalListenerElement.current) {
            events.off(removalListenerElement.current, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
            events.on(removalListenerElement.current, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
        }
        return () => {
            if (element.current) {
                container.appendChild(element.current);
            }
            if (hiddenNodeElement.current) {
                container.appendChild(hiddenNodeElement.current);
            }
            if (removalListenerElement.current) {
                container.appendChild(removalListenerElement.current);
            }
            if (el) {
                events.off(el, component_base_1.DX_REMOVE_EVENT, onTemplateRemoved);
            }
        };
    }, [onTemplateRemoved, removalListenerRequired, container]);
    (0, react_1.useEffect)(() => {
        onRendered();
    }, [onRendered]);
    const hiddenNode = createHiddenNode(container?.nodeName, (node) => {
        hiddenNodeElement.current = node;
        element.current = node?.previousSibling;
    }, 'div');
    const removalListener = removalListenerRequired
        ? createHiddenNode(container?.nodeName, (node) => { removalListenerElement.current = node; }, 'span')
        : undefined;
    return (0, react_dom_1.createPortal)(React.createElement(React.Fragment, null,
        React.createElement(helpers_1.RemovalLockerContext.Provider, { value: removalLocker },
            templateFactory({ data, index, onRendered }),
            hiddenNode,
            removalListener)), container);
};
exports.TemplateWrapper = (0, react_1.memo)(TemplateWrapperComponent);

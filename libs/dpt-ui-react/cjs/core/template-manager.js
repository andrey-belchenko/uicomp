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
exports.TemplateManager = void 0;
const React = __importStar(require("react"));
const events = __importStar(require("dpt-ui/events"));
const react_1 = require("react");
const template_wrapper_1 = require("./template-wrapper");
const helpers_1 = require("./helpers");
const component_base_1 = require("./component-base");
const config_1 = require("./config");
function normalizeProps(props) {
    if ((0, config_1.getOption)('useLegacyTemplateEngine')) {
        const model = props.data;
        if (model && Object.prototype.hasOwnProperty.call(model, 'key')) {
            model.dxkey = model.key;
        }
        return model;
    }
    return props;
}
const TemplateManager = ({ init }) => {
    const [instantiationModels, setInstantiationModels] = (0, react_1.useState)(new helpers_1.TemplateInstantiationModels());
    const [updateContext, setUpdateContext] = (0, react_1.useState)();
    const widgetId = (0, react_1.useRef)('');
    const templateFactories = (0, react_1.useRef)({});
    const subscribeOnRemoval = (0, react_1.useCallback)((container, onRemoved) => {
        if (container.nodeType === Node.ELEMENT_NODE) {
            events.on(container, component_base_1.DX_REMOVE_EVENT, onRemoved);
        }
    }, []);
    const unsubscribeOnRemoval = (0, react_1.useCallback)((container, onRemoved) => {
        if (container.nodeType === Node.ELEMENT_NODE) {
            events.off(container, component_base_1.DX_REMOVE_EVENT, onRemoved);
        }
    }, []);
    const unwrapElement = (0, react_1.useCallback)((element) => (element.get ? element.get(0) : element), []);
    const createMapKey = (0, react_1.useCallback)((key1, key2) => ({ key1, key2 }), []);
    const getRandomId = (0, react_1.useCallback)(() => `${(0, helpers_1.generateID)()}${(0, helpers_1.generateID)()}${(0, helpers_1.generateID)()}`, []);
    const getRenderFunc = (0, react_1.useCallback)((templateKey) => ({ model: data, index, container, onRendered, }) => {
        const containerElement = unwrapElement(container);
        const key = createMapKey(data, containerElement);
        const onRemoved = () => {
            setInstantiationModels((currentInstantiationModels) => {
                const template = currentInstantiationModels.get(key);
                if (template) {
                    currentInstantiationModels.delete(key);
                    return currentInstantiationModels.shallowCopy();
                }
                return currentInstantiationModels;
            });
        };
        const hostWidgetId = widgetId.current;
        setInstantiationModels((currentInstantiationModels) => {
            currentInstantiationModels.set(key, {
                templateKey,
                index,
                componentKey: getRandomId(),
                onRendered: () => {
                    unsubscribeOnRemoval(containerElement, onRemoved);
                    if (hostWidgetId === widgetId.current) {
                        onRendered?.();
                    }
                },
                onRemoved,
            });
            return currentInstantiationModels.shallowCopy();
        });
        return containerElement;
    }, [unsubscribeOnRemoval, createMapKey]);
    (0, react_1.useMemo)(() => {
        function getTemplateFunction(template) {
            switch (template.type) {
                case 'children': return () => template.content;
                case 'render': return (props) => {
                    normalizeProps(props);
                    return template.content(props.data, props.index);
                };
                case 'component': return (props) => {
                    props = normalizeProps(props);
                    return React.createElement.bind(null, template.content)(props);
                };
                default: return () => React.createElement(React.Fragment);
            }
        }
        function createDXTemplates(templateOptions) {
            const factories = Object.entries(templateOptions)
                .reduce((res, [key, template]) => ({
                ...res,
                [key]: getTemplateFunction(template),
            }), {});
            templateFactories.current = factories;
            const dxTemplates = Object.keys(factories)
                .reduce((templates, templateKey) => {
                templates[templateKey] = { render: getRenderFunc(templateKey) };
                return templates;
            }, {});
            return dxTemplates;
        }
        function clearInstantiationModels() {
            widgetId.current = getRandomId();
            setInstantiationModels(new helpers_1.TemplateInstantiationModels());
        }
        function updateTemplates(onUpdated) {
            setUpdateContext({ onUpdated });
        }
        init({ createDXTemplates, clearInstantiationModels, updateTemplates });
    }, [init, getRenderFunc]);
    (0, react_1.useEffect)(() => {
        if (updateContext) {
            updateContext.onUpdated();
        }
    }, [updateContext]);
    if (instantiationModels.empty) {
        return null;
    }
    return (React.createElement(React.Fragment, null, Array.from(instantiationModels).map(([{ key1: data, key2: container }, { index, templateKey, componentKey, onRendered, onRemoved, }]) => {
        subscribeOnRemoval(container, onRemoved);
        const factory = templateFactories.current[templateKey];
        if (factory) {
            return React.createElement(template_wrapper_1.TemplateWrapper, { key: componentKey, templateFactory: factory, data: data, index: index, container: container, onRemoved: onRemoved, onRendered: onRendered });
        }
        return null;
    })));
};
exports.TemplateManager = TemplateManager;

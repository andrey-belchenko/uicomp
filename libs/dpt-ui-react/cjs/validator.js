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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationRule = exports.StringLengthRule = exports.RequiredRule = exports.RangeRule = exports.PatternRule = exports.NumericRule = exports.EmailRule = exports.CustomRule = exports.CompareRule = exports.AsyncRule = exports.Adapter = exports.Validator = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const validator_1 = __importDefault(require("dpt-ui/ui/validator"));
const extension_component_1 = require("./core/extension-component");
const nested_option_1 = __importDefault(require("./core/nested-option"));
const _componentValidator = (0, react_1.memo)((0, react_1.forwardRef)((props, ref) => {
    const baseRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        instance() {
            return baseRef.current?.getInstance();
        }
    }), [baseRef.current]);
    const independentEvents = (0, react_1.useMemo)(() => (["onDisposing", "onInitialized", "onValidated"]), []);
    const expectedChildren = (0, react_1.useMemo)(() => ({
        adapter: { optionName: "adapter", isCollectionItem: false },
        AsyncRule: { optionName: "validationRules", isCollectionItem: true },
        CompareRule: { optionName: "validationRules", isCollectionItem: true },
        CustomRule: { optionName: "validationRules", isCollectionItem: true },
        EmailRule: { optionName: "validationRules", isCollectionItem: true },
        NumericRule: { optionName: "validationRules", isCollectionItem: true },
        PatternRule: { optionName: "validationRules", isCollectionItem: true },
        RangeRule: { optionName: "validationRules", isCollectionItem: true },
        RequiredRule: { optionName: "validationRules", isCollectionItem: true },
        StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
        validationRule: { optionName: "validationRules", isCollectionItem: true }
    }), []);
    return (React.createElement((extension_component_1.ExtensionComponent), {
        WidgetClass: validator_1.default,
        ref: baseRef,
        independentEvents,
        expectedChildren,
        ...props,
    }));
}));
const Validator = Object.assign(_componentValidator, {
    isExtensionComponent: true,
});
exports.Validator = Validator;
const _componentAdapter = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const Adapter = Object.assign(_componentAdapter, {
    OptionName: "adapter",
});
exports.Adapter = Adapter;
const _componentAsyncRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const AsyncRule = Object.assign(_componentAsyncRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "async"
    },
});
exports.AsyncRule = AsyncRule;
const _componentCompareRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const CompareRule = Object.assign(_componentCompareRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "compare"
    },
});
exports.CompareRule = CompareRule;
const _componentCustomRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const CustomRule = Object.assign(_componentCustomRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "custom"
    },
});
exports.CustomRule = CustomRule;
const _componentEmailRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const EmailRule = Object.assign(_componentEmailRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "email"
    },
});
exports.EmailRule = EmailRule;
const _componentNumericRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const NumericRule = Object.assign(_componentNumericRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "numeric"
    },
});
exports.NumericRule = NumericRule;
const _componentPatternRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const PatternRule = Object.assign(_componentPatternRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "pattern"
    },
});
exports.PatternRule = PatternRule;
const _componentRangeRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const RangeRule = Object.assign(_componentRangeRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "range"
    },
});
exports.RangeRule = RangeRule;
const _componentRequiredRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const RequiredRule = Object.assign(_componentRequiredRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "required"
    },
});
exports.RequiredRule = RequiredRule;
const _componentStringLengthRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const StringLengthRule = Object.assign(_componentStringLengthRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "stringLength"
    },
});
exports.StringLengthRule = StringLengthRule;
const _componentValidationRule = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const ValidationRule = Object.assign(_componentValidationRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "required"
    },
});
exports.ValidationRule = ValidationRule;
exports.default = Validator;

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
import dxValidator from "dpt-ui/ui/validator";
import { ExtensionComponent as BaseComponent } from "./core/extension-component";
import NestedOption from "./core/nested-option";
const _componentValidator = memo(forwardRef((props, ref) => {
    const baseRef = useRef(null);
    useImperativeHandle(ref, () => ({
        instance() {
            return baseRef.current?.getInstance();
        }
    }), [baseRef.current]);
    const independentEvents = useMemo(() => (["onDisposing", "onInitialized", "onValidated"]), []);
    const expectedChildren = useMemo(() => ({
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
    return (React.createElement((BaseComponent), {
        WidgetClass: dxValidator,
        ref: baseRef,
        independentEvents,
        expectedChildren,
        ...props,
    }));
}));
const Validator = Object.assign(_componentValidator, {
    isExtensionComponent: true,
});
const _componentAdapter = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const Adapter = Object.assign(_componentAdapter, {
    OptionName: "adapter",
});
const _componentAsyncRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const AsyncRule = Object.assign(_componentAsyncRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "async"
    },
});
const _componentCompareRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const CompareRule = Object.assign(_componentCompareRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "compare"
    },
});
const _componentCustomRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const CustomRule = Object.assign(_componentCustomRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "custom"
    },
});
const _componentEmailRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const EmailRule = Object.assign(_componentEmailRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "email"
    },
});
const _componentNumericRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const NumericRule = Object.assign(_componentNumericRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "numeric"
    },
});
const _componentPatternRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const PatternRule = Object.assign(_componentPatternRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "pattern"
    },
});
const _componentRangeRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const RangeRule = Object.assign(_componentRangeRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "range"
    },
});
const _componentRequiredRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const RequiredRule = Object.assign(_componentRequiredRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "required"
    },
});
const _componentStringLengthRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const StringLengthRule = Object.assign(_componentStringLengthRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "stringLength"
    },
});
const _componentValidationRule = memo((props) => {
    return React.createElement((NestedOption), { ...props });
});
const ValidationRule = Object.assign(_componentValidationRule, {
    OptionName: "validationRules",
    IsCollectionItem: true,
    PredefinedProps: {
        type: "required"
    },
});
export default Validator;
export { Validator, Adapter, AsyncRule, CompareRule, CustomRule, EmailRule, NumericRule, PatternRule, RangeRule, RequiredRule, StringLengthRule, ValidationRule };

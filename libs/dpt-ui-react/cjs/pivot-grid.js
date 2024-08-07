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
exports.Texts = exports.StateStoring = exports.Search = exports.Scrolling = exports.PivotGridTexts = exports.LoadPanel = exports.HeaderFilterTexts = exports.HeaderFilter = exports.FieldPanelTexts = exports.FieldPanel = exports.FieldChooserTexts = exports.FieldChooser = exports.Export = exports.PivotGrid = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const pivot_grid_1 = __importDefault(require("dpt-ui/ui/pivot_grid"));
const component_1 = require("./core/component");
const nested_option_1 = __importDefault(require("./core/nested-option"));
const PivotGrid = (0, react_1.memo)((0, react_1.forwardRef)((props, ref) => {
    const baseRef = (0, react_1.useRef)(null);
    (0, react_1.useImperativeHandle)(ref, () => ({
        instance() {
            return baseRef.current?.getInstance();
        }
    }), [baseRef.current]);
    const independentEvents = (0, react_1.useMemo)(() => (["onCellClick", "onCellPrepared", "onContentReady", "onContextMenuPreparing", "onDisposing", "onExporting", "onInitialized"]), []);
    const expectedChildren = (0, react_1.useMemo)(() => ({
        export: { optionName: "export", isCollectionItem: false },
        fieldChooser: { optionName: "fieldChooser", isCollectionItem: false },
        fieldPanel: { optionName: "fieldPanel", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        loadPanel: { optionName: "loadPanel", isCollectionItem: false },
        pivotGridTexts: { optionName: "texts", isCollectionItem: false },
        scrolling: { optionName: "scrolling", isCollectionItem: false },
        stateStoring: { optionName: "stateStoring", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
    }), []);
    return (React.createElement((component_1.Component), {
        WidgetClass: pivot_grid_1.default,
        ref: baseRef,
        independentEvents,
        expectedChildren,
        ...props,
    }));
}));
exports.PivotGrid = PivotGrid;
const _componentExport = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const Export = Object.assign(_componentExport, {
    OptionName: "export",
});
exports.Export = Export;
const _componentFieldChooser = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const FieldChooser = Object.assign(_componentFieldChooser, {
    OptionName: "fieldChooser",
    ExpectedChildren: {
        fieldChooserTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
    },
});
exports.FieldChooser = FieldChooser;
const _componentFieldChooserTexts = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const FieldChooserTexts = Object.assign(_componentFieldChooserTexts, {
    OptionName: "texts",
});
exports.FieldChooserTexts = FieldChooserTexts;
const _componentFieldPanel = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const FieldPanel = Object.assign(_componentFieldPanel, {
    OptionName: "fieldPanel",
    ExpectedChildren: {
        fieldPanelTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
    },
});
exports.FieldPanel = FieldPanel;
const _componentFieldPanelTexts = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const FieldPanelTexts = Object.assign(_componentFieldPanelTexts, {
    OptionName: "texts",
});
exports.FieldPanelTexts = FieldPanelTexts;
const _componentHeaderFilter = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const HeaderFilter = Object.assign(_componentHeaderFilter, {
    OptionName: "headerFilter",
    ExpectedChildren: {
        headerFilterTexts: { optionName: "texts", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
    },
});
exports.HeaderFilter = HeaderFilter;
const _componentHeaderFilterTexts = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const HeaderFilterTexts = Object.assign(_componentHeaderFilterTexts, {
    OptionName: "texts",
});
exports.HeaderFilterTexts = HeaderFilterTexts;
const _componentLoadPanel = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const LoadPanel = Object.assign(_componentLoadPanel, {
    OptionName: "loadPanel",
});
exports.LoadPanel = LoadPanel;
const _componentPivotGridTexts = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const PivotGridTexts = Object.assign(_componentPivotGridTexts, {
    OptionName: "texts",
});
exports.PivotGridTexts = PivotGridTexts;
const _componentScrolling = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const Scrolling = Object.assign(_componentScrolling, {
    OptionName: "scrolling",
});
exports.Scrolling = Scrolling;
const _componentSearch = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const Search = Object.assign(_componentSearch, {
    OptionName: "search",
});
exports.Search = Search;
const _componentStateStoring = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const StateStoring = Object.assign(_componentStateStoring, {
    OptionName: "stateStoring",
});
exports.StateStoring = StateStoring;
const _componentTexts = (0, react_1.memo)((props) => {
    return React.createElement((nested_option_1.default), { ...props });
});
const Texts = Object.assign(_componentTexts, {
    OptionName: "texts",
});
exports.Texts = Texts;
exports.default = PivotGrid;

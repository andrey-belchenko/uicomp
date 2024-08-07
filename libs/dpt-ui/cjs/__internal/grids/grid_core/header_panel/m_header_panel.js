/**
 * DevExtreme (cjs/__internal/grids/grid_core/header_panel/m_header_panel.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.headerPanelModule = exports.HeaderPanel = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _data = require("../../../../core/utils/data");
var _extend = require("../../../../core/utils/extend");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _toolbar = _interopRequireDefault(require("../../../../ui/toolbar"));
var _m_columns_view = require("../views/m_columns_view");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}
const HEADER_PANEL_CLASS = "header-panel";
const TOOLBAR_BUTTON_CLASS = "toolbar-button";
const TOOLBAR_ARIA_LABEL = "-ariaToolbar";
const DEFAULT_TOOLBAR_ITEM_NAMES = ["addRowButton", "applyFilterButton", "columnChooserButton", "exportButton", "groupPanel", "revertButton", "saveButton", "searchPanel"];
class HeaderPanel extends _m_columns_view.ColumnsView {
    init() {
        super.init();
        this._editingController = this.getController("editing");
        this._headerFilterController = this.getController("headerFilter");
        this.createAction("onToolbarPreparing", {
            excludeValidators: ["disabled", "readOnly"]
        })
    }
    _getToolbarItems() {
        return []
    }
    _getButtonContainer() {
        return (0, _renderer.default)("<div>").addClass(this.addWidgetPrefix("toolbar-button"))
    }
    _getToolbarButtonClass(specificClass) {
        const secondClass = specificClass ? ` ${specificClass}` : "";
        return this.addWidgetPrefix("toolbar-button") + secondClass
    }
    _getToolbarOptions() {
        const userToolbarOptions = this.option("toolbar");
        const options = {
            toolbarOptions: {
                items: this._getToolbarItems(),
                visible: null === userToolbarOptions || void 0 === userToolbarOptions ? void 0 : userToolbarOptions.visible,
                disabled: null === userToolbarOptions || void 0 === userToolbarOptions ? void 0 : userToolbarOptions.disabled,
                onItemRendered(e) {
                    const itemRenderedCallback = e.itemData.onItemRendered;
                    if (itemRenderedCallback) {
                        itemRenderedCallback(e)
                    }
                }
            }
        };
        const userItems = null === userToolbarOptions || void 0 === userToolbarOptions ? void 0 : userToolbarOptions.items;
        options.toolbarOptions.items = this._normalizeToolbarItems(options.toolbarOptions.items, userItems);
        this.executeAction("onToolbarPreparing", options);
        if (options.toolbarOptions && !(0, _type.isDefined)(options.toolbarOptions.visible)) {
            const toolbarItems = options.toolbarOptions.items;
            options.toolbarOptions.visible = !!(null !== toolbarItems && void 0 !== toolbarItems && toolbarItems.length)
        }
        return options.toolbarOptions
    }
    _normalizeToolbarItems(defaultItems, userItems) {
        defaultItems.forEach((button => {
            if (!DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
                throw new Error(`Default toolbar item '${button.name}' is not added to DEFAULT_TOOLBAR_ITEM_NAMES`)
            }
        }));
        const defaultProps = {
            location: "after"
        };
        const isArray = Array.isArray(userItems);
        if (!(0, _type.isDefined)(userItems)) {
            return defaultItems
        }
        if (!isArray) {
            userItems = [userItems]
        }
        const defaultButtonsByNames = {};
        defaultItems.forEach((button => {
            defaultButtonsByNames[button.name] = button
        }));
        const normalizedItems = userItems.map((button => {
            if ((0, _type.isString)(button)) {
                button = {
                    name: button
                }
            }
            if ((0, _type.isDefined)(button.name)) {
                if ((0, _type.isDefined)(defaultButtonsByNames[button.name])) {
                    button = (0, _extend.extend)(true, {}, defaultButtonsByNames[button.name], button)
                } else if (DEFAULT_TOOLBAR_ITEM_NAMES.includes(button.name)) {
                    button = _extends({}, button, {
                        visible: false
                    })
                }
            }
            return (0, _extend.extend)(true, {}, defaultProps, button)
        }));
        return isArray ? normalizedItems : normalizedItems[0]
    }
    _renderCore() {
        if (!this._toolbar) {
            const $headerPanel = this.element();
            $headerPanel.addClass(this.addWidgetPrefix("header-panel"));
            const label = _message.default.format(this.component.NAME + "-ariaToolbar");
            const $toolbar = (0, _renderer.default)("<div>").attr("aria-label", label).appendTo($headerPanel);
            this._toolbar = this._createComponent($toolbar, _toolbar.default, this._toolbarOptions)
        } else {
            this._toolbar.option(this._toolbarOptions)
        }
    }
    _columnOptionChanged() {}
    _handleDataChanged() {
        if (this._requireReady) {
            this.render()
        }
    }
    _isDisabledDefinedByUser(name) {
        var _this$option;
        const userItems = null === (_this$option = this.option("toolbar")) || void 0 === _this$option ? void 0 : _this$option.items;
        const userItem = null === userItems || void 0 === userItems ? void 0 : userItems.find((item => (null === item || void 0 === item ? void 0 : item.name) === name));
        return (0, _type.isDefined)(null === userItem || void 0 === userItem ? void 0 : userItem.disabled)
    }
    render() {
        this._toolbarOptions = this._getToolbarOptions();
        super.render.apply(this, arguments)
    }
    setToolbarItemDisabled(name, disabled) {
        const toolbar = this._toolbar;
        const isDefinedByUser = this._isDisabledDefinedByUser(name);
        if (!toolbar || isDefinedByUser) {
            return
        }
        const items = toolbar.option("items") ?? [];
        const itemIndex = items.findIndex((item => item.name === name));
        if (itemIndex < 0) {
            return
        }
        const item = toolbar.option(`items[${itemIndex}]`);
        toolbar.option(`items[${itemIndex}].disabled`, disabled);
        if (item.options) {
            toolbar.option(`items[${itemIndex}].options.disabled`, disabled)
        }
    }
    updateToolbarDimensions() {
        var _this$_toolbar;
        null === (_this$_toolbar = this._toolbar) || void 0 === _this$_toolbar || _this$_toolbar.updateDimensions()
    }
    getHeaderPanel() {
        return this.element()
    }
    getHeight() {
        return this.getElementHeight()
    }
    optionChanged(args) {
        if ("onToolbarPreparing" === args.name) {
            this._invalidate();
            args.handled = true
        }
        if ("toolbar" === args.name) {
            const parts = (0, _data.getPathParts)(args.fullName);
            const optionName = args.fullName.replace(/^toolbar\./, "");
            if (1 === parts.length) {
                this._invalidate()
            } else if ("items" === parts[1]) {
                if (2 === parts.length) {
                    var _this$_toolbar2;
                    const toolbarOptions = this._getToolbarOptions();
                    null === (_this$_toolbar2 = this._toolbar) || void 0 === _this$_toolbar2 || _this$_toolbar2.option("items", toolbarOptions.items)
                } else if (3 === parts.length) {
                    var _this$_toolbar3;
                    const normalizedItem = this._normalizeToolbarItems(this._getToolbarItems(), args.value);
                    null === (_this$_toolbar3 = this._toolbar) || void 0 === _this$_toolbar3 || _this$_toolbar3.option(optionName, normalizedItem)
                } else if (parts.length >= 4) {
                    var _this$_toolbar4;
                    null === (_this$_toolbar4 = this._toolbar) || void 0 === _this$_toolbar4 || _this$_toolbar4.option(optionName, args.value)
                }
            } else {
                this._invalidate()
            }
            args.handled = true
        }
        super.optionChanged(args)
    }
    isVisible() {
        return !!(this._toolbarOptions && this._toolbarOptions.visible)
    }
    allowDragging() {}
    hasGroupedColumns() {}
}
exports.HeaderPanel = HeaderPanel;
const resizing = Base => class extends Base {
    _updateDimensionsCore() {
        super._updateDimensionsCore.apply(this, arguments);
        this.getView("headerPanel").updateToolbarDimensions()
    }
};
const headerPanelModule = exports.headerPanelModule = {
    defaultOptions: () => ({}),
    views: {
        headerPanel: HeaderPanel
    },
    extenders: {
        controllers: {
            resizing: resizing
        }
    }
};

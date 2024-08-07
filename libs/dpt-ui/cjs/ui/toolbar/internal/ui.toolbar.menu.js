/**
 * DevExtreme (cjs/ui/toolbar/internal/ui.toolbar.menu.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _size = require("../../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _extend = require("../../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../widget/ui.widget"));
var _button = _interopRequireDefault(require("../../button"));
var _uiToolbarMenu = _interopRequireDefault(require("./ui.toolbar.menu.list"));
var _themes = require("../../themes");
var _child_default_template = require("../../../core/templates/child_default_template");
var _uiToolbar = require("../ui.toolbar.utils");
var _window = require("../../../core/utils/window");
require("../../popup");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const DROP_DOWN_MENU_CLASS = "dx-dropdownmenu";
const DROP_DOWN_MENU_POPUP_CLASS = "dx-dropdownmenu-popup";
const DROP_DOWN_MENU_POPUP_WRAPPER_CLASS = "dx-dropdownmenu-popup-wrapper";
const DROP_DOWN_MENU_LIST_CLASS = "dx-dropdownmenu-list";
const DROP_DOWN_MENU_BUTTON_CLASS = "dx-dropdownmenu-button";
const POPUP_BOUNDARY_VERTICAL_OFFSET = 10;
const POPUP_VERTICAL_OFFSET = 3;
class DropDownMenu extends _ui.default {
    _supportedKeys() {
        let extension = {};
        if (!this.option("opened") || !this._list.option("focusedElement")) {
            extension = this._button._supportedKeys()
        }
        return (0, _extend.extend)(super._supportedKeys(), extension, {
            tab: function() {
                this._popup && this._popup.hide()
            }
        })
    }
    _getDefaultOptions() {
        return (0, _extend.extend)(super._getDefaultOptions(), {
            items: [],
            onItemClick: null,
            dataSource: null,
            itemTemplate: "item",
            onButtonClick: null,
            activeStateEnabled: true,
            hoverStateEnabled: true,
            opened: false,
            onItemRendered: null,
            closeOnClick: true,
            useInkRipple: false,
            container: void 0,
            animation: {
                show: {
                    type: "fade",
                    from: 0,
                    to: 1
                },
                hide: {
                    type: "fade",
                    to: 0
                }
            }
        })
    }
    _defaultOptionsRules() {
        return super._defaultOptionsRules().concat([{
            device: function() {
                return "desktop" === _devices.default.real().deviceType && !_devices.default.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }, {
            device: function() {
                return (0, _themes.isMaterialBased)()
            },
            options: {
                useInkRipple: true,
                animation: {
                    show: {
                        type: "pop",
                        duration: 200,
                        from: {
                            scale: 0
                        },
                        to: {
                            scale: 1
                        }
                    },
                    hide: {
                        type: "pop",
                        duration: 200,
                        from: {
                            scale: 1
                        },
                        to: {
                            scale: 0
                        }
                    }
                }
            }
        }])
    }
    _init() {
        super._init();
        this.$element().addClass("dx-dropdownmenu");
        this._initItemClickAction();
        this._initButtonClickAction()
    }
    _initItemClickAction() {
        this._itemClickAction = this._createActionByOption("onItemClick")
    }
    _initButtonClickAction() {
        this._buttonClickAction = this._createActionByOption("onButtonClick")
    }
    _initTemplates() {
        this._templateManager.addDefaultTemplates({
            content: new _child_default_template.ChildDefaultTemplate("content")
        });
        super._initTemplates()
    }
    _initMarkup() {
        this._renderButton();
        super._initMarkup()
    }
    _render() {
        super._render();
        this.setAria({
            haspopup: true,
            expanded: this.option("opened")
        })
    }
    _renderContentImpl() {
        if (this.option("opened")) {
            this._renderPopup()
        }
    }
    _clean() {
        this._cleanFocusState();
        this._list && this._list.$element().remove();
        this._popup && this._popup.$element().remove();
        delete this._list;
        delete this._popup
    }
    _renderButton() {
        const $button = this.$element().addClass("dx-dropdownmenu-button");
        this._button = this._createComponent($button, _button.default, {
            icon: "overflow",
            template: "content",
            stylingMode: (0, _themes.isFluent)() ? "text" : "contained",
            useInkRipple: this.option("useInkRipple"),
            hoverStateEnabled: false,
            focusStateEnabled: false,
            onClick: e => {
                this.option("opened", !this.option("opened"));
                this._buttonClickAction(e)
            }
        })
    }
    _toggleActiveState($element, value, e) {
        this._button._toggleActiveState($element, value, e)
    }
    _toggleMenuVisibility(opened) {
        const state = opened ?? !this._popup.option("visible");
        if (opened) {
            this._renderPopup()
        }
        this._popup.toggle(state);
        this.setAria("expanded", state)
    }
    _renderPopup() {
        if (this._$popup) {
            return
        }
        this._$popup = (0, _renderer.default)("<div>").appendTo(this.$element());
        const {
            rtlEnabled: rtlEnabled,
            container: container,
            animation: animation
        } = this.option();
        this._popup = this._createComponent(this._$popup, "dxPopup", {
            onInitialized(_ref) {
                let {
                    component: component
                } = _ref;
                component.$wrapper().addClass("dx-dropdownmenu-popup-wrapper").addClass("dx-dropdownmenu-popup")
            },
            deferRendering: false,
            contentTemplate: contentElement => this._renderList(contentElement),
            _ignoreFunctionValueDeprecation: true,
            maxHeight: () => this._getMaxHeight(),
            position: {
                my: "top " + (rtlEnabled ? "left" : "right"),
                at: "bottom " + (rtlEnabled ? "left" : "right"),
                collision: "fit flip",
                offset: {
                    v: 3
                },
                of: this.$element()
            },
            animation: animation,
            onOptionChanged: _ref2 => {
                let {
                    name: name,
                    value: value
                } = _ref2;
                if ("visible" === name) {
                    this.option("opened", value)
                }
            },
            container: container,
            autoResizeEnabled: false,
            height: "auto",
            width: "auto",
            hideOnOutsideClick: e => this._closeOutsideDropDownHandler(e),
            hideOnParentScroll: true,
            shading: false,
            dragEnabled: false,
            showTitle: false,
            fullScreen: false,
            _fixWrapperPosition: true
        })
    }
    _getMaxHeight() {
        const $element = this.$element();
        const offsetTop = $element.offset().top;
        const windowHeight = (0, _size.getOuterHeight)((0, _window.getWindow)());
        const maxHeight = Math.max(offsetTop, windowHeight - offsetTop - (0, _size.getOuterHeight)($element));
        return Math.min(windowHeight, maxHeight - 3 - 10)
    }
    _closeOutsideDropDownHandler(e) {
        const isOutsideClick = !(0, _renderer.default)(e.target).closest(this.$element()).length;
        return isOutsideClick
    }
    _renderList(contentElement) {
        const $content = (0, _renderer.default)(contentElement);
        $content.addClass("dx-dropdownmenu-list");
        this._list = this._createComponent($content, _uiToolbarMenu.default, {
            dataSource: this._getListDataSource(),
            pageLoadMode: "scrollBottom",
            indicateLoading: false,
            noDataText: "",
            itemTemplate: this.option("itemTemplate"),
            onItemClick: e => {
                if (this.option("closeOnClick")) {
                    this.option("opened", false)
                }
                this._itemClickAction(e)
            },
            tabIndex: -1,
            focusStateEnabled: false,
            activeStateEnabled: true,
            onItemRendered: this.option("onItemRendered"),
            _itemAttributes: {
                role: "menuitem"
            }
        })
    }
    _itemOptionChanged(item, property, value) {
        var _this$_list;
        null === (_this$_list = this._list) || void 0 === _this$_list || _this$_list._itemOptionChanged(item, property, value);
        (0, _uiToolbar.toggleItemFocusableElementTabIndex)(this._list, item)
    }
    _getListDataSource() {
        return this.option("dataSource") ?? this.option("items")
    }
    _setListDataSource() {
        var _this$_list2;
        null === (_this$_list2 = this._list) || void 0 === _this$_list2 || _this$_list2.option("dataSource", this._getListDataSource());
        delete this._deferRendering
    }
    _getKeyboardListeners() {
        return super._getKeyboardListeners().concat([this._list])
    }
    _toggleVisibility(visible) {
        super._toggleVisibility(visible);
        this._button.option("visible", visible)
    }
    _optionChanged(args) {
        var _this$_list3, _this$_list4, _this$_list5;
        const {
            name: name,
            value: value
        } = args;
        switch (name) {
            case "items":
            case "dataSource":
                if (!this.option("opened")) {
                    this._deferRendering = true
                } else {
                    this._setListDataSource()
                }
                break;
            case "itemTemplate":
                null === (_this$_list3 = this._list) || void 0 === _this$_list3 || _this$_list3.option(name, this._getTemplate(value));
                break;
            case "onItemClick":
                this._initItemClickAction();
                break;
            case "onButtonClick":
                this._buttonClickAction();
                break;
            case "useInkRipple":
                this._invalidate();
                break;
            case "focusStateEnabled":
                null === (_this$_list4 = this._list) || void 0 === _this$_list4 || _this$_list4.option(name, value);
                super._optionChanged(args);
                break;
            case "onItemRendered":
                null === (_this$_list5 = this._list) || void 0 === _this$_list5 || _this$_list5.option(name, value);
                break;
            case "opened":
                if (this._deferRendering) {
                    this._setListDataSource()
                }
                this._toggleMenuVisibility(value);
                this._updateFocusableItemsTabIndex();
                break;
            case "closeOnClick":
                break;
            case "container":
                this._popup && this._popup.option(name, value);
                break;
            case "disabled":
                if (this._list) {
                    this._updateFocusableItemsTabIndex()
                }
                break;
            default:
                super._optionChanged(args)
        }
    }
    _updateFocusableItemsTabIndex() {
        this.option("items").forEach((item => (0, _uiToolbar.toggleItemFocusableElementTabIndex)(this._list, item)))
    }
}
exports.default = DropDownMenu;
module.exports = exports.default;
module.exports.default = exports.default;

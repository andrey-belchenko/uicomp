/**
 * DevExtreme (cjs/__internal/ui/radio_group/m_radio_group.js)
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
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _deferred = require("../../../core/utils/deferred");
var _extend = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _ui = _interopRequireDefault(require("../../../ui/editor/ui.data_expression"));
var _editor = _interopRequireDefault(require("../editor"));
var _m_radio_collection = _interopRequireDefault(require("./m_radio_collection"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const RADIO_BUTTON_CLASS = "dx-radiobutton";
const RADIO_GROUP_HORIZONTAL_CLASS = "dx-radiogroup-horizontal";
const RADIO_GROUP_VERTICAL_CLASS = "dx-radiogroup-vertical";
const RADIO_GROUP_CLASS = "dx-radiogroup";
const RADIO_FEEDBACK_HIDE_TIMEOUT = 100;
class RadioGroup extends _editor.default {
    _dataSourceOptions() {
        return {
            paginate: false
        }
    }
    _defaultOptionsRules() {
        const defaultOptionsRules = super._defaultOptionsRules();
        return defaultOptionsRules.concat([{
            device: {
                tablet: true
            },
            options: {
                layout: "horizontal"
            }
        }, {
            device: () => "desktop" === _devices.default.real().deviceType && !_devices.default.isSimulator(),
            options: {
                focusStateEnabled: true
            }
        }])
    }
    _fireContentReadyAction(force) {
        force && super._fireContentReadyAction()
    }
    _focusTarget() {
        return this.$element()
    }
    _getAriaTarget() {
        return this.$element()
    }
    _getDefaultOptions() {
        const defaultOptions = super._getDefaultOptions();
        return (0, _extend.extend)(defaultOptions, (0, _extend.extend)(_ui.default._dataExpressionDefaultOptions(), {
            hoverStateEnabled: true,
            activeStateEnabled: true,
            layout: "vertical"
        }))
    }
    _getItemValue(item) {
        return this._valueGetter ? this._valueGetter(item) : item.text
    }
    _getSubmitElement() {
        return this._$submitElement
    }
    _init() {
        super._init();
        this._activeStateUnit = ".dx-radiobutton";
        this._feedbackHideTimeout = 100;
        this._initDataExpressions()
    }
    _initMarkup() {
        (0, _renderer.default)(this.element()).addClass("dx-radiogroup");
        this._renderSubmitElement();
        this.setAria("role", "radiogroup");
        this._renderRadios();
        this._renderLayout();
        super._initMarkup()
    }
    _itemClickHandler(_ref) {
        let {
            itemElement: itemElement,
            event: event,
            itemData: itemData
        } = _ref;
        if (this.itemElements().is(itemElement)) {
            const newValue = this._getItemValue(itemData);
            if (newValue !== this.option("value")) {
                this._saveValueChangeEvent(event);
                this.option("value", newValue)
            }
        }
    }
    _getSelectedItemKeys() {
        let value = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.option("value");
        const isNullSelectable = "this" !== this.option("valueExpr");
        const shouldSelectValue = isNullSelectable && null === value || (0, _type.isDefined)(value);
        return shouldSelectValue ? [value] : []
    }
    _setSelection(currentValue) {
        const value = this._unwrappedValue(currentValue);
        this._setCollectionWidgetOption("selectedItemKeys", this._getSelectedItemKeys(value))
    }
    _renderValidationState() {
        var _this$_validationMess;
        super._renderValidationState();
        null === (_this$_validationMess = this._validationMessage) || void 0 === _this$_validationMess || _this$_validationMess.$content().attr("role", "alert")
    }
    _optionChanged(args) {
        const {
            name: name,
            value: value
        } = args;
        this._dataExpressionOptionChanged(args);
        switch (name) {
            case "dataSource":
                this._invalidate();
                break;
            case "focusStateEnabled":
            case "accessKey":
            case "tabIndex":
                this._setCollectionWidgetOption(name, value);
                break;
            case "disabled":
                super._optionChanged(args);
                this._setCollectionWidgetOption(name, value);
                break;
            case "valueExpr":
                this._setCollectionWidgetOption("keyExpr", this._getCollectionKeyExpr());
                break;
            case "value":
                this._setSelection(value);
                this._setSubmitValue(value);
                super._optionChanged(args);
                break;
            case "items":
                this._setSelection(this.option("value"));
                break;
            case "itemTemplate":
            case "displayExpr":
                break;
            case "layout":
                this._renderLayout();
                this._updateItemsSize();
                break;
            default:
                super._optionChanged(args)
        }
    }
    _render() {
        super._render();
        this._updateItemsSize()
    }
    _renderLayout() {
        const layout = this.option("layout");
        const $element = (0, _renderer.default)(this.element());
        $element.toggleClass("dx-radiogroup-vertical", "vertical" === layout);
        $element.toggleClass("dx-radiogroup-horizontal", "horizontal" === layout)
    }
    _renderRadios() {
        this._areRadiosCreated = (0, _deferred.Deferred)();
        const $radios = (0, _renderer.default)("<div>").appendTo(this.$element());
        const {
            displayExpr: displayExpr,
            accessKey: accessKey,
            focusStateEnabled: focusStateEnabled,
            itemTemplate: itemTemplate,
            tabIndex: tabIndex
        } = this.option();
        this._createComponent($radios, _m_radio_collection.default, {
            onInitialized: _ref2 => {
                let {
                    component: component
                } = _ref2;
                this._radios = component
            },
            onContentReady: e => {
                this._fireContentReadyAction(true)
            },
            onItemClick: this._itemClickHandler.bind(this),
            displayExpr: displayExpr,
            accessKey: accessKey,
            dataSource: this._dataSource,
            focusStateEnabled: focusStateEnabled,
            itemTemplate: itemTemplate,
            keyExpr: this._getCollectionKeyExpr(),
            noDataText: "",
            scrollingEnabled: false,
            selectByClick: false,
            selectionMode: "single",
            selectedItemKeys: this._getSelectedItemKeys(),
            tabIndex: tabIndex
        });
        this._areRadiosCreated.resolve()
    }
    _renderSubmitElement() {
        this._$submitElement = (0, _renderer.default)("<input>").attr("type", "hidden").appendTo(this.$element());
        this._setSubmitValue()
    }
    _setOptionsByReference() {
        super._setOptionsByReference();
        (0, _extend.extend)(this._optionsByReference, {
            value: true
        })
    }
    _setSubmitValue(value) {
        value = value ?? this.option("value");
        const submitValue = "this" === this.option("valueExpr") ? this._displayGetter(value) : value;
        this._$submitElement.val(submitValue)
    }
    _setCollectionWidgetOption(name, value) {
        this._areRadiosCreated.done(this._setWidgetOption.bind(this, "_radios", arguments))
    }
    _updateItemsSize() {
        if ("horizontal" === this.option("layout")) {
            var _this$itemElements;
            null === (_this$itemElements = this.itemElements()) || void 0 === _this$itemElements || _this$itemElements.css("height", "auto")
        } else {
            var _this$itemElements2;
            const itemsCount = this.option("items").length;
            null === (_this$itemElements2 = this.itemElements()) || void 0 === _this$itemElements2 || _this$itemElements2.css("height", 100 / itemsCount + "%")
        }
    }
    focus() {
        var _this$_radios;
        null === (_this$_radios = this._radios) || void 0 === _this$_radios || _this$_radios.focus()
    }
    itemElements() {
        var _this$_radios2;
        return null === (_this$_radios2 = this._radios) || void 0 === _this$_radios2 ? void 0 : _this$_radios2._itemElements()
    }
}
RadioGroup.include(_ui.default);
(0, _component_registrator.default)("dxRadioGroup", RadioGroup);
var _default = exports.default = RadioGroup;

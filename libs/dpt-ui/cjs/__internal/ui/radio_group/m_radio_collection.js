/**
 * DevExtreme (cjs/__internal/ui/radio_group/m_radio_collection.js)
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
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../../ui/editor/ui.data_expression"));
var _edit = _interopRequireDefault(require("../../ui/collection/edit"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const RADIO_BUTTON_CHECKED_CLASS = "dx-radiobutton-checked";
const RADIO_BUTTON_ICON_CHECKED_CLASS = "dx-radiobutton-icon-checked";
const RADIO_BUTTON_ICON_CLASS = "dx-radiobutton-icon";
const RADIO_BUTTON_ICON_DOT_CLASS = "dx-radiobutton-icon-dot";
const RADIO_VALUE_CONTAINER_CLASS = "dx-radio-value-container";
const RADIO_BUTTON_CLASS = "dx-radiobutton";
class RadioCollection extends _edit.default {
    _focusTarget() {
        return (0, _renderer.default)(this.element()).parent()
    }
    _nullValueSelectionSupported() {
        return true
    }
    _getDefaultOptions() {
        const defaultOptions = super._getDefaultOptions();
        return (0, _extend.extend)(defaultOptions, _ui.default._dataExpressionDefaultOptions(), {
            _itemAttributes: {
                role: "radio"
            }
        })
    }
    _initMarkup() {
        super._initMarkup();
        (0, _common.deferRender)((() => {
            this._itemElements().addClass("dx-radiobutton")
        }))
    }
    _keyboardEventBindingTarget() {
        return this._focusTarget()
    }
    _postprocessRenderItem(args) {
        const {
            itemData: {
                html: html
            },
            itemElement: itemElement
        } = args;
        if (!html) {
            const $radio = (0, _renderer.default)("<div>").addClass("dx-radiobutton-icon");
            (0, _renderer.default)("<div>").addClass("dx-radiobutton-icon-dot").appendTo($radio);
            const $radioContainer = (0, _renderer.default)("<div>").append($radio).addClass("dx-radio-value-container");
            (0, _renderer.default)(itemElement).prepend($radioContainer)
        }
        super._postprocessRenderItem(args)
    }
    _processSelectableItem($itemElement, isSelected) {
        super._processSelectableItem($itemElement, isSelected);
        $itemElement.toggleClass("dx-radiobutton-checked", isSelected).find(".dx-radiobutton-icon").first().toggleClass("dx-radiobutton-icon-checked", isSelected);
        this.setAria("checked", isSelected, $itemElement)
    }
    _refreshContent() {
        this._prepareContent();
        this._renderContent()
    }
    _supportedKeys() {
        const parent = super._supportedKeys();
        return (0, _extend.extend)({}, parent, {
            enter(e) {
                e.preventDefault();
                return parent.enter.apply(this, arguments)
            },
            space(e) {
                e.preventDefault();
                return parent.space.apply(this, arguments)
            }
        })
    }
    _itemElements() {
        return this._itemContainer().children(this._itemSelector())
    }
    _setAriaSelectionAttribute() {}
}
var _default = exports.default = RadioCollection;

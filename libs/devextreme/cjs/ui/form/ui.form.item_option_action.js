/**
 * DevExtreme (cjs/ui/form/ui.form.item_option_action.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _class = _interopRequireDefault(require("../../core/class"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class ItemOptionAction {
    constructor(options) {
        this._options = options;
        this._itemsRunTimeInfo = this._options.itemsRunTimeInfo
    }
    findInstance() {
        return this._itemsRunTimeInfo.findWidgetInstanceByItem(this._options.item)
    }
    findItemContainer() {
        return this._itemsRunTimeInfo.findItemContainerByItem(this._options.item)
    }
    findPreparedItem() {
        return this._itemsRunTimeInfo.findPreparedItemByItem(this._options.item)
    }
    tryExecute() {
        _class.default.abstract()
    }
}
exports.default = ItemOptionAction;
module.exports = exports.default;
module.exports.default = exports.default;
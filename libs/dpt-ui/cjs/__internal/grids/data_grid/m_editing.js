/**
 * DevExtreme (cjs/__internal/grids/data_grid/m_editing.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
require("./module_not_extended/editor_factory");
var _m_editing = require("../../grids/grid_core/editing/m_editing");
var _m_core = _interopRequireDefault(require("./m_core"));

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
const data = Base => class extends((0, _m_editing.dataControllerEditingExtenderMixin)(Base)) {
    _changeRowExpandCore(key) {
        const editingController = this._editingController;
        if (Array.isArray(key)) {
            editingController && editingController.refresh()
        }
        return super._changeRowExpandCore.apply(this, arguments)
    }
};
_m_core.default.registerModule("editing", _extends({}, _m_editing.editingModule, {
    extenders: _extends({}, _m_editing.editingModule.extenders, {
        controllers: _extends({}, _m_editing.editingModule.extenders.controllers, {
            data: data
        })
    })
}));

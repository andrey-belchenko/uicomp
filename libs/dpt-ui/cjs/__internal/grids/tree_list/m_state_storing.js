/**
 * DevExtreme (cjs/__internal/grids/tree_list/m_state_storing.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
var _m_state_storing = require("../../grids/grid_core/state_storing/m_state_storing");
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
const stateStoring = Base => class extends(_m_state_storing.stateStoringModule.extenders.controllers.stateStoring(Base)) {
    applyState(state) {
        super.applyState(state);
        this.option("expandedRowKeys", state.expandedRowKeys ? state.expandedRowKeys.slice() : [])
    }
};
const data = Base => class extends(_m_state_storing.stateStoringModule.extenders.controllers.data(Base)) {
    getUserState() {
        const state = super.getUserState();
        if (!this.option("autoExpandAll")) {
            state.expandedRowKeys = this.option("expandedRowKeys")
        }
        return state
    }
};
_m_core.default.registerModule("stateStoring", _extends({}, _m_state_storing.stateStoringModule, {
    extenders: _extends({}, _m_state_storing.stateStoringModule.extenders, {
        controllers: _extends({}, _m_state_storing.stateStoringModule.extenders.controllers, {
            stateStoring: stateStoring,
            data: data
        })
    })
}));

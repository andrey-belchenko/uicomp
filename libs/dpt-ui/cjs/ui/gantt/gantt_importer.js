/**
 * DevExtreme (cjs/ui/gantt/gantt_importer.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.getGanttViewCore = getGanttViewCore;
var _ui = _interopRequireDefault(require("../widget/ui.errors"));
var _dpt-ext-uiGantt = _interopRequireDefault(require("dpt-ext-ui-gantt"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function getGanttViewCore() {
    if (!_dpt-ext-uiGantt.default) {
        throw _ui.default.Error("E1041", "dpt-ext-ui-gantt")
    }
    return _dpt-ext-uiGantt.default
}
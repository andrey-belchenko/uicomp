/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/m_work_space_day.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _m_constants = require("../m_constants");
var _m_work_space_vertical = _interopRequireDefault(require("./m_work_space_vertical"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const DAY_CLASS = "dx-scheduler-work-space-day";
class SchedulerWorkSpaceDay extends _m_work_space_vertical.default {
    get type() {
        return _m_constants.VIEWS.DAY
    }
    _getElementClass() {
        return DAY_CLASS
    }
    _renderDateHeader() {
        return 1 === this.option("intervalCount") ? null : super._renderDateHeader()
    }
    renderRHeaderPanel() {
        if (1 === this.option("intervalCount")) {
            super.renderRHeaderPanel(false)
        } else {
            super.renderRHeaderPanel(true)
        }
    }
}(0, _component_registrator.default)("dxSchedulerWorkSpaceDay", SchedulerWorkSpaceDay);
var _default = exports.default = SchedulerWorkSpaceDay;
/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/m_timeline_day.js)
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
var _m_constants = require("../m_constants");
var _m_timeline = _interopRequireDefault(require("./m_timeline"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const TIMELINE_CLASS = "dx-scheduler-timeline-day";
class SchedulerTimelineDay extends _m_timeline.default {
    get type() {
        return _m_constants.VIEWS.TIMELINE_DAY
    }
    _getElementClass() {
        return TIMELINE_CLASS
    }
    _needRenderWeekHeader() {
        return this._isWorkSpaceWithCount()
    }
}(0, _component_registrator.default)("dxSchedulerTimelineDay", SchedulerTimelineDay);
var _default = exports.default = SchedulerTimelineDay;

/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_view_data_generator_week.js)
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
exports.ViewDataGeneratorWeek = void 0;
var _index = require("../../../scheduler/r1/utils/index");
var _m_view_data_generator = require("./m_view_data_generator");
class ViewDataGeneratorWeek extends _m_view_data_generator.ViewDataGenerator {
    constructor() {
        super(...arguments);
        this.daysInInterval = 7
    }
    _getIntervalDuration(intervalCount) {
        return _index.weekUtils.getIntervalDuration(intervalCount)
    }
    _calculateStartViewDate(options) {
        return _index.weekUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, this._getIntervalDuration(options.intervalCount), this.getFirstDayOfWeek(options.firstDayOfWeek))
    }
}
exports.ViewDataGeneratorWeek = ViewDataGeneratorWeek;

/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_view_data_generator_month.js)
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
exports.ViewDataGeneratorMonth = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = _interopRequireDefault(require("../../../../localization/date"));
var _index = require("../../../scheduler/r1/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
var _m_utils = require("./m_utils");
var _m_view_data_generator = require("./m_view_data_generator");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const toMs = _date.default.dateToMilliseconds;
const DAYS_IN_WEEK = 7;
class ViewDataGeneratorMonth extends _m_view_data_generator.ViewDataGenerator {
    constructor() {
        super(...arguments);
        this.tableAllDay = void 0
    }
    getCellData(rowIndex, columnIndex, options, allDay) {
        const {
            indicatorTime: indicatorTime,
            timeZoneCalculator: timeZoneCalculator,
            intervalCount: intervalCount,
            viewOffset: viewOffset
        } = options;
        const data = super.getCellData(rowIndex, columnIndex, options, false);
        const startDate = _m_utils_time_zone.default.addOffsetsWithoutDST(data.startDate, -viewOffset);
        data.today = this.isCurrentDate(startDate, indicatorTime, timeZoneCalculator);
        data.otherMonth = this.isOtherMonth(startDate, this._minVisibleDate, this._maxVisibleDate);
        data.firstDayOfMonth = (0, _index.isFirstCellInMonthWithIntervalCount)(startDate, intervalCount);
        data.text = _index.monthUtils.getCellText(startDate, intervalCount);
        return data
    }
    isCurrentDate(date, indicatorTime, timeZoneCalculator) {
        return _date.default.sameDate(date, (0, _index.getToday)(indicatorTime, timeZoneCalculator))
    }
    isOtherMonth(cellDate, minDate, maxDate) {
        return !_date.default.dateInRange(cellDate, minDate, maxDate, "date")
    }
    _calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount) {
        return _index.monthUtils.calculateCellIndex(rowIndex, columnIndex, rowCount, columnCount)
    }
    calculateEndDate(startDate, interval, endDayHour) {
        return (0, _index.setOptionHour)(startDate, endDayHour)
    }
    getInterval() {
        return toMs("day")
    }
    _calculateStartViewDate(options) {
        return _index.monthUtils.calculateStartViewDate(options.currentDate, options.startDayHour, options.startDate, options.intervalCount, this.getFirstDayOfWeek(options.firstDayOfWeek))
    }
    _setVisibilityDates(options) {
        const {
            intervalCount: intervalCount,
            startDate: startDate,
            currentDate: currentDate
        } = options;
        const firstMonthDate = _date.default.getFirstMonthDate(startDate);
        const viewStart = _index.monthUtils.getViewStartByOptions(startDate, currentDate, intervalCount, firstMonthDate);
        this._minVisibleDate = new Date(viewStart.setDate(1));
        const nextMonthDate = new Date(viewStart.setMonth(viewStart.getMonth() + intervalCount));
        this._maxVisibleDate = new Date(nextMonthDate.setDate(0))
    }
    getCellCount() {
        return 7
    }
    getRowCount(options) {
        const startDate = new Date(options.currentDate);
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + options.intervalCount);
        endDate.setDate(0);
        return (0, _m_utils.calculateAlignedWeeksBetweenDates)(startDate, endDate, options.firstDayOfWeek ?? _date2.default.firstDayOfWeekIndex())
    }
    getCellCountInDay() {
        return 1
    }
    setHiddenInterval() {
        this.hiddenInterval = 0
    }
    getCellEndDate(cellStartDate, options) {
        const {
            startDayHour: startDayHour,
            endDayHour: endDayHour
        } = options;
        const durationMs = (endDayHour - startDayHour) * toMs("hour");
        return _m_utils_time_zone.default.addOffsetsWithoutDST(cellStartDate, durationMs)
    }
}
exports.ViewDataGeneratorMonth = ViewDataGeneratorMonth;
/**
 * DevExtreme (cjs/__internal/scheduler/appointments/m_text_utils.js)
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
exports.getFormatType = exports.formatDates = exports.createFormattedDateText = void 0;
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _date2 = _interopRequireDefault(require("../../../localization/date"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const createFormattedDateText = options => {
    const {
        startDate: startDate,
        endDate: endDate,
        allDay: allDay,
        format: format
    } = options;
    const formatType = format || getFormatType(startDate, endDate, allDay);
    return formatDates(startDate, endDate, formatType)
};
exports.createFormattedDateText = createFormattedDateText;
const getFormatType = (startDate, endDate, isAllDay, isDateAndTimeView) => {
    if (isAllDay) {
        return "DATE"
    }
    if (isDateAndTimeView && _date.default.sameDate(startDate, endDate)) {
        return "TIME"
    }
    return "DATETIME"
};
exports.getFormatType = getFormatType;
const formatDates = (startDate, endDate, formatType) => {
    const isSameDate = startDate.getDate() === endDate.getDate();
    switch (formatType) {
        case "DATETIME":
            return [_date2.default.format(startDate, "monthandday"), " ", _date2.default.format(startDate, "shorttime"), " - ", isSameDate ? "" : `${_date2.default.format(endDate,"monthandday")} `, _date2.default.format(endDate, "shorttime")].join("");
        case "TIME":
            return `${_date2.default.format(startDate,"shorttime")} - ${_date2.default.format(endDate,"shorttime")}`;
        case "DATE":
            return `${_date2.default.format(startDate,"monthandday")}${isSameDate?"":` - ${_date2.default.format(endDate,"monthandday")}`}`
    }
};
exports.formatDates = formatDates;

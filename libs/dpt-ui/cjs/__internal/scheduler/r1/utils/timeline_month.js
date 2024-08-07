/**
 * DevExtreme (cjs/__internal/scheduler/r1/utils/timeline_month.js)
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
exports.calculateStartViewDate = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _base = require("./base");
var _month = require("./month");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalCount) => {
    const firstViewDate = _date.default.getFirstMonthDate((0, _month.getViewStartByOptions)(startDate, currentDate, intervalCount, _date.default.getFirstMonthDate(startDate)));
    return (0, _base.setOptionHour)(firstViewDate, startDayHour)
};
exports.calculateStartViewDate = calculateStartViewDate;

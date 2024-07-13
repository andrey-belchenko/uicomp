/**
 * DevExtreme (cjs/__internal/scheduler/r1/utils/day.js)
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
exports.calculateStartViewDate = void 0;
var _base = require("./base");
const calculateStartViewDate = (currentDate, startDayHour, startDate, intervalDuration) => {
    const firstViewDate = (0, _base.getViewStartByOptions)(startDate, currentDate, intervalDuration, startDate);
    return (0, _base.setOptionHour)(firstViewDate, startDayHour)
};
exports.calculateStartViewDate = calculateStartViewDate;
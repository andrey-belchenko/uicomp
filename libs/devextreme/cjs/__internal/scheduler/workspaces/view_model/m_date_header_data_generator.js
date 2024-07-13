/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_date_header_data_generator.js)
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
exports.DateHeaderDataGenerator = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _m_constants = require("../../../scheduler/m_constants");
var _index = require("../../../scheduler/r1/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));
const _excluded = ["startDate", "endDate", "isFirstGroupCell", "isLastGroupCell"];

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
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
class DateHeaderDataGenerator {
    constructor(_viewDataGenerator) {
        this._viewDataGenerator = _viewDataGenerator
    }
    getCompleteDateHeaderMap(options, completeViewDataMap) {
        const {
            isGenerateWeekDaysHeaderData: isGenerateWeekDaysHeaderData
        } = options;
        const result = [];
        if (isGenerateWeekDaysHeaderData) {
            const weekDaysRow = this._generateWeekDaysHeaderRowMap(options, completeViewDataMap);
            result.push(weekDaysRow)
        }
        const dateRow = this._generateHeaderDateRow(options, completeViewDataMap);
        result.push(dateRow);
        return result
    }
    _generateWeekDaysHeaderRowMap(options, completeViewDataMap) {
        const {
            isGroupedByDate: isGroupedByDate,
            groups: groups,
            groupOrientation: groupOrientation,
            startDayHour: startDayHour,
            endDayHour: endDayHour,
            hoursInterval: hoursInterval,
            isHorizontalGrouping: isHorizontalGrouping,
            intervalCount: intervalCount,
            viewOffset: viewOffset
        } = options;
        const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
        const horizontalGroupCount = (0, _index.getHorizontalGroupCount)(groups, groupOrientation);
        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = isGroupedByDate ? horizontalGroupCount * cellCountInDay : cellCountInDay;
        const groupCount = (0, _index.getGroupCount)(groups);
        const datesRepeatCount = isHorizontalGrouping && !isGroupedByDate ? groupCount : 1;
        const daysInGroup = this._viewDataGenerator.daysInInterval * intervalCount;
        const daysInView = daysInGroup * datesRepeatCount;
        const weekDaysRow = [];
        for (let dayIndex = 0; dayIndex < daysInView; dayIndex += 1) {
            const cell = completeViewDataMap[index][dayIndex * colSpan];
            const shiftedStartDate = _m_utils_time_zone.default.addOffsetsWithoutDST(cell.startDate, -viewOffset);
            weekDaysRow.push(_extends({}, cell, {
                colSpan: colSpan,
                text: (0, _index.formatWeekdayAndDay)(shiftedStartDate),
                isFirstGroupCell: false,
                isLastGroupCell: false
            }))
        }
        return weekDaysRow
    }
    _generateHeaderDateRow(options, completeViewDataMap) {
        const {
            today: today,
            isGroupedByDate: isGroupedByDate,
            groupOrientation: groupOrientation,
            groups: groups,
            headerCellTextFormat: headerCellTextFormat,
            getDateForHeaderText: getDateForHeaderText,
            interval: interval,
            startViewDate: startViewDate,
            startDayHour: startDayHour,
            endDayHour: endDayHour,
            hoursInterval: hoursInterval,
            intervalCount: intervalCount,
            currentDate: currentDate,
            viewType: viewType,
            viewOffset: viewOffset
        } = options;
        const horizontalGroupCount = (0, _index.getHorizontalGroupCount)(groups, groupOrientation);
        const index = completeViewDataMap[0][0].allDay ? 1 : 0;
        const colSpan = isGroupedByDate ? horizontalGroupCount : 1;
        const isVerticalGrouping = "vertical" === groupOrientation;
        const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
            intervalCount: intervalCount,
            currentDate: currentDate,
            viewType: viewType,
            hoursInterval: hoursInterval,
            startDayHour: startDayHour,
            endDayHour: endDayHour
        });
        const cellCountInDay = this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval);
        const slicedByColumnsData = isGroupedByDate ? completeViewDataMap[index].filter(((_, columnIndex) => columnIndex % horizontalGroupCount === 0)) : completeViewDataMap[index];
        const shouldShiftDatesForHeaderText = !(0, _index.isTimelineView)(viewType) || viewType === _m_constants.VIEWS.TIMELINE_MONTH;
        return slicedByColumnsData.map(((_ref, idx) => {
            let {
                startDate: startDate,
                isFirstGroupCell: isFirstGroupCell,
                isLastGroupCell: isLastGroupCell
            } = _ref, restProps = _objectWithoutPropertiesLoose(_ref, _excluded);
            const shiftedStartDate = _m_utils_time_zone.default.addOffsetsWithoutDST(startDate, -viewOffset);
            const shiftedStartDateForHeaderText = shouldShiftDatesForHeaderText ? shiftedStartDate : startDate;
            const text = (0, _index.getHeaderCellText)(idx % cellCountInGroupRow, shiftedStartDateForHeaderText, headerCellTextFormat, getDateForHeaderText, {
                interval: interval,
                startViewDate: startViewDate,
                startDayHour: startDayHour,
                cellCountInDay: cellCountInDay,
                viewOffset: viewOffset
            });
            return _extends({}, restProps, {
                startDate: startDate,
                text: text,
                today: _date.default.sameDate(shiftedStartDate, today),
                colSpan: colSpan,
                isFirstGroupCell: isGroupedByDate || isFirstGroupCell && !isVerticalGrouping,
                isLastGroupCell: isGroupedByDate || isLastGroupCell && !isVerticalGrouping
            })
        }))
    }
    generateDateHeaderData(completeDateHeaderMap, completeViewDataMap, options) {
        const {
            isGenerateWeekDaysHeaderData: isGenerateWeekDaysHeaderData,
            cellWidth: cellWidth,
            isProvideVirtualCellsWidth: isProvideVirtualCellsWidth,
            startDayHour: startDayHour,
            endDayHour: endDayHour,
            hoursInterval: hoursInterval,
            isMonthDateHeader: isMonthDateHeader
        } = options;
        const dataMap = [];
        let weekDayRowConfig = {};
        const validCellWidth = cellWidth || 0;
        if (isGenerateWeekDaysHeaderData) {
            weekDayRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, this._viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval), 0, validCellWidth);
            dataMap.push(weekDayRowConfig.dateRow)
        }
        const datesRowConfig = this._generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, 1, isGenerateWeekDaysHeaderData ? 1 : 0, validCellWidth);
        dataMap.push(datesRowConfig.dateRow);
        return {
            dataMap: dataMap,
            leftVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.leftVirtualCellWidth : void 0,
            rightVirtualCellWidth: isProvideVirtualCellsWidth ? datesRowConfig.rightVirtualCellWidth : void 0,
            leftVirtualCellCount: datesRowConfig.leftVirtualCellCount,
            rightVirtualCellCount: datesRowConfig.rightVirtualCellCount,
            weekDayLeftVirtualCellWidth: weekDayRowConfig.leftVirtualCellWidth,
            weekDayRightVirtualCellWidth: weekDayRowConfig.rightVirtualCellWidth,
            weekDayLeftVirtualCellCount: weekDayRowConfig.leftVirtualCellCount,
            weekDayRightVirtualCellCount: weekDayRowConfig.rightVirtualCellCount,
            isMonthDateHeader: isMonthDateHeader
        }
    }
    _generateDateHeaderDataRow(options, completeDateHeaderMap, completeViewDataMap, baseColSpan, rowIndex, cellWidth) {
        const {
            startCellIndex: startCellIndex,
            cellCount: cellCount,
            isProvideVirtualCellsWidth: isProvideVirtualCellsWidth,
            groups: groups,
            groupOrientation: groupOrientation,
            isGroupedByDate: isGroupedByDate
        } = options;
        const horizontalGroupCount = (0, _index.getHorizontalGroupCount)(groups, groupOrientation);
        const colSpan = isGroupedByDate ? horizontalGroupCount * baseColSpan : baseColSpan;
        const leftVirtualCellCount = Math.floor(startCellIndex / colSpan);
        const displayedCellCount = (0, _index.getDisplayedCellCount)(cellCount, completeViewDataMap);
        const actualCellCount = Math.ceil((startCellIndex + displayedCellCount) / colSpan);
        const totalCellCount = (0, _index.getTotalCellCountByCompleteData)(completeViewDataMap);
        const dateRow = completeDateHeaderMap[rowIndex].slice(leftVirtualCellCount, actualCellCount);
        const finalLeftVirtualCellCount = leftVirtualCellCount * colSpan;
        const finalLeftVirtualCellWidth = finalLeftVirtualCellCount * cellWidth;
        const finalRightVirtualCellCount = totalCellCount - actualCellCount * colSpan;
        const finalRightVirtualCellWidth = finalRightVirtualCellCount * cellWidth;
        return {
            dateRow: dateRow,
            leftVirtualCellCount: finalLeftVirtualCellCount,
            leftVirtualCellWidth: isProvideVirtualCellsWidth ? finalLeftVirtualCellWidth : void 0,
            rightVirtualCellCount: finalRightVirtualCellCount,
            rightVirtualCellWidth: isProvideVirtualCellsWidth ? finalRightVirtualCellWidth : void 0
        }
    }
}
exports.DateHeaderDataGenerator = DateHeaderDataGenerator;
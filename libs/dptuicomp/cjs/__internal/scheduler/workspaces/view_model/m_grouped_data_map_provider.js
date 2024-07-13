/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/view_model/m_grouped_data_map_provider.js)
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
exports.GroupedDataMapProvider = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));
var _date2 = require("../../../core/utils/date");
var _index = require("../../../scheduler/r1/utils/index");
var _m_utils_time_zone = _interopRequireDefault(require("../../m_utils_time_zone"));

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
const toMs = _date.default.dateToMilliseconds;
class GroupedDataMapProvider {
    constructor(viewDataGenerator, viewDataMap, completeViewDataMap, viewOptions) {
        this.groupedDataMap = viewDataGenerator.generateGroupedDataMap(viewDataMap);
        this.completeViewDataMap = completeViewDataMap;
        this._viewOptions = viewOptions
    }
    getGroupStartDate(groupIndex) {
        var _firstRow$;
        const firstRow = this.getFirstGroupRow(groupIndex);
        return (null === firstRow || void 0 === firstRow || null === (_firstRow$ = firstRow[0]) || void 0 === _firstRow$ || null === (_firstRow$ = _firstRow$.cellData) || void 0 === _firstRow$ ? void 0 : _firstRow$.startDate) ?? null
    }
    getGroupEndDate(groupIndex) {
        const lastRow = this.getLastGroupRow(groupIndex);
        if (lastRow) {
            const lastColumnIndex = lastRow.length - 1;
            const {
                cellData: cellData
            } = lastRow[lastColumnIndex];
            const {
                endDate: endDate
            } = cellData;
            return endDate
        }
    }
    findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate) {
        const groupData = this.getGroupFromDateTableGroupMap(groupIndex);
        const checkCellStartDate = (rowIndex, columnIndex) => {
            const {
                cellData: cellData
            } = groupData[rowIndex][columnIndex];
            let {
                startDate: secondMin,
                endDate: secondMax
            } = cellData;
            if (isFindByDate) {
                secondMin = _date.default.trimTime(secondMin);
                secondMax = _date.default.setToDayEnd(secondMin)
            }
            if (_date.default.intervalsOverlap({
                    firstMin: startDate,
                    firstMax: endDate,
                    secondMin: secondMin,
                    secondMax: secondMax
                })) {
                return secondMin
            }
        };
        const startDateVerticalSearch = (() => {
            const cellCount = groupData[0].length;
            for (let columnIndex = 0; columnIndex < cellCount; ++columnIndex) {
                for (let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
                    const result = checkCellStartDate(rowIndex, columnIndex);
                    if (result) {
                        return result
                    }
                }
            }
        })();
        const startDateHorizontalSearch = (() => {
            for (let rowIndex = 0; rowIndex < groupData.length; ++rowIndex) {
                const row = groupData[rowIndex];
                for (let columnIndex = 0; columnIndex < row.length; ++columnIndex) {
                    const result = checkCellStartDate(rowIndex, columnIndex);
                    if (result) {
                        return result
                    }
                }
            }
        })();
        return startDateVerticalSearch > startDateHorizontalSearch ? startDateHorizontalSearch : startDateVerticalSearch
    }
    findAllDayGroupCellStartDate(groupIndex) {
        var _groupedData$;
        const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);
        const cellData = null === groupedData || void 0 === groupedData || null === (_groupedData$ = groupedData[0]) || void 0 === _groupedData$ || null === (_groupedData$ = _groupedData$[0]) || void 0 === _groupedData$ ? void 0 : _groupedData$.cellData;
        return (null === cellData || void 0 === cellData ? void 0 : cellData.startDate) ?? null
    }
    findCellPositionInMap(cellInfo, isAppointmentRender) {
        const {
            groupIndex: groupIndex,
            startDate: startDate,
            isAllDay: isAllDay,
            index: index
        } = cellInfo;
        const {
            allDayPanelGroupedMap: allDayPanelGroupedMap,
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        const {
            viewOffset: viewOffset
        } = this._viewOptions;
        const rows = isAllDay && !this._viewOptions.isVerticalGrouping ? allDayPanelGroupedMap[groupIndex] ? [allDayPanelGroupedMap[groupIndex]] : [] : dateTableGroupedMap[groupIndex] || [];
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
            const row = rows[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
                const cell = row[columnIndex];
                const originCellData = cell.cellData;
                const cellData = isAppointmentRender ? _extends({}, originCellData, {
                    startDate: _date2.dateUtilsTs.addOffsets(cell.cellData.startDate, [-viewOffset]),
                    endDate: _date2.dateUtilsTs.addOffsets(cell.cellData.endDate, [-viewOffset])
                }) : originCellData;
                if (this._isSameGroupIndexAndIndex(cellData, groupIndex, index)) {
                    if (this.isStartDateInCell(startDate, isAllDay, cellData, originCellData)) {
                        return cell.position
                    }
                }
            }
        }
        return
    }
    isStartDateInCell(startDate, inAllDayRow, _ref, _ref2) {
        let {
            startDate: cellStartDate,
            endDate: cellEndDate,
            allDay: cellAllDay
        } = _ref;
        let {
            startDate: originCellStartDate,
            endDate: originCellEndDate
        } = _ref2;
        const {
            viewType: viewType
        } = this._viewOptions;
        const cellSecondIntervalOffset = this.getCellSecondIntervalOffset(originCellStartDate, originCellEndDate);
        const isCellCoversTwoIntervals = 0 !== cellSecondIntervalOffset;
        switch (true) {
            case !(0, _index.isDateAndTimeView)(viewType):
            case inAllDayRow && cellAllDay:
                return _date.default.sameDate(startDate, cellStartDate);
            case !inAllDayRow && !isCellCoversTwoIntervals:
                return startDate >= cellStartDate && startDate < cellEndDate;
            case !inAllDayRow && isCellCoversTwoIntervals:
                return this.isStartDateInTwoIntervalsCell(startDate, cellSecondIntervalOffset, cellStartDate, cellEndDate);
            default:
                return false
        }
    }
    getCellSecondIntervalOffset(cellStartDate, cellEndDate) {
        const nextHourCellStartDate = _date2.dateUtilsTs.addOffsets(cellStartDate, [toMs("hour")]);
        const cellTimezoneDiff = _m_utils_time_zone.default.getDaylightOffset(cellStartDate, cellEndDate);
        const cellNextHourTimezoneDiff = _m_utils_time_zone.default.getDaylightOffset(cellStartDate, nextHourCellStartDate);
        const isDSTInsideCell = 0 !== cellTimezoneDiff;
        const isWinterTimezoneNextHour = cellNextHourTimezoneDiff < 0;
        return !isDSTInsideCell && isWinterTimezoneNextHour ? Math.abs(cellNextHourTimezoneDiff * toMs("minute")) : 0
    }
    isStartDateInTwoIntervalsCell(startDate, secondIntervalOffset, cellStartDate, cellEndDate) {
        const nextIntervalCellStartDate = _date2.dateUtilsTs.addOffsets(cellStartDate, [secondIntervalOffset]);
        const nextIntervalCellEndDate = _date2.dateUtilsTs.addOffsets(cellEndDate, [secondIntervalOffset]);
        const isInOriginInterval = startDate >= cellStartDate && startDate < cellEndDate;
        const isInSecondInterval = startDate >= nextIntervalCellStartDate && startDate < nextIntervalCellEndDate;
        return isInOriginInterval || isInSecondInterval
    }
    _isSameGroupIndexAndIndex(cellData, groupIndex, index) {
        return cellData.groupIndex === groupIndex && (void 0 === index || cellData.index === index)
    }
    getCellsGroup(groupIndex) {
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        const groupData = dateTableGroupedMap[groupIndex];
        if (groupData) {
            const {
                cellData: cellData
            } = groupData[0][0];
            return cellData.groups
        }
    }
    getCompletedGroupsInfo() {
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        return dateTableGroupedMap.map((groupData => {
            const firstCell = groupData[0][0];
            const {
                allDay: allDay,
                groupIndex: groupIndex
            } = firstCell.cellData;
            return {
                allDay: allDay,
                groupIndex: groupIndex,
                startDate: this.getGroupStartDate(groupIndex),
                endDate: this.getGroupEndDate(groupIndex)
            }
        })).filter((_ref3 => {
            let {
                startDate: startDate
            } = _ref3;
            return !!startDate
        }))
    }
    getGroupIndices() {
        return this.getCompletedGroupsInfo().map((_ref4 => {
            let {
                groupIndex: groupIndex
            } = _ref4;
            return groupIndex
        }))
    }
    getGroupFromDateTableGroupMap(groupIndex) {
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        return dateTableGroupedMap[groupIndex]
    }
    getFirstGroupRow(groupIndex) {
        const groupedData = this.getGroupFromDateTableGroupMap(groupIndex);
        if (groupedData) {
            const {
                cellData: cellData
            } = groupedData[0][0];
            return !cellData.allDay ? groupedData[0] : groupedData[1]
        }
    }
    getLastGroupRow(groupIndex) {
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];
        if (groupedData) {
            const lastRowIndex = groupedData.length - 1;
            return groupedData[lastRowIndex]
        }
    }
    getLastGroupCellPosition(groupIndex) {
        const groupRow = this.getLastGroupRow(groupIndex);
        return null === groupRow || void 0 === groupRow ? void 0 : groupRow[(null === groupRow || void 0 === groupRow ? void 0 : groupRow.length) - 1].position
    }
    getRowCountInGroup(groupIndex) {
        const groupRow = this.getLastGroupRow(groupIndex);
        const cellAmount = groupRow.length;
        const lastCellData = groupRow[cellAmount - 1].cellData;
        const lastCellIndex = lastCellData.index;
        return (lastCellIndex + 1) / groupRow.length
    }
}
exports.GroupedDataMapProvider = GroupedDataMapProvider;
/**
 * DevExtreme (esm/__internal/scheduler/workspaces/view_model/m_time_panel_data_generator.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["allDay", "startDate", "endDate", "groups", "groupIndex", "isFirstGroupCell", "isLastGroupCell", "index"];
import dateUtils from "../../../../core/utils/date";
import {
    dateUtilsTs
} from "../../../core/utils/date";
import {
    shiftIntegerByModule
} from "../../../core/utils/math";
import {
    getDisplayedRowCount,
    getIsGroupedAllDayPanel,
    getKeyByGroup,
    weekUtils
} from "../../../scheduler/r1/utils/index";
const toMs = dateUtils.dateToMilliseconds;
export class TimePanelDataGenerator {
    constructor(_viewDataGenerator) {
        this._viewDataGenerator = _viewDataGenerator
    }
    getCompleteTimePanelMap(options, completeViewDataMap) {
        const {
            startViewDate: startViewDate,
            cellDuration: cellDuration,
            startDayHour: startDayHour,
            isVerticalGrouping: isVerticalGrouping,
            intervalCount: intervalCount,
            currentDate: currentDate,
            viewType: viewType,
            hoursInterval: hoursInterval,
            endDayHour: endDayHour,
            viewOffset: viewOffset,
            today: today,
            showCurrentTimeIndicator: showCurrentTimeIndicator
        } = options;
        const rowsCount = completeViewDataMap.length - 1;
        const realEndViewDate = completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate;
        const rowCountInGroup = this._viewDataGenerator.getRowCount({
            intervalCount: intervalCount,
            currentDate: currentDate,
            viewType: viewType,
            hoursInterval: hoursInterval,
            startDayHour: startDayHour,
            endDayHour: endDayHour
        });
        const cellCountInGroupRow = this._viewDataGenerator.getCellCount({
            intervalCount: intervalCount,
            currentDate: currentDate,
            viewType: viewType,
            hoursInterval: hoursInterval,
            startDayHour: startDayHour,
            endDayHour: endDayHour
        });
        let allDayRowsCount = 0;
        let usualCellIndex = 0;
        return completeViewDataMap.map(((row, index) => {
            const _row$ = row[0],
                {
                    allDay: allDay,
                    startDate: startDate,
                    groups: groups,
                    groupIndex: groupIndex,
                    isFirstGroupCell: isFirstGroupCell,
                    isLastGroupCell: isLastGroupCell,
                    index: cellIndex
                } = _row$,
                restCellProps = _objectWithoutPropertiesLoose(_row$, _excluded);
            const highlighted = allDay ? false : this.isTimeCellShouldBeHighlighted(today, viewOffset, {
                startViewDate: startViewDate,
                realEndViewDate: realEndViewDate,
                showCurrentTimeIndicator: showCurrentTimeIndicator
            }, {
                date: startDate,
                index: usualCellIndex,
                duration: Math.round(cellDuration),
                isFirst: 0 === usualCellIndex,
                isLast: this.isLastCellInGroup(completeViewDataMap, index)
            });
            if (allDay) {
                allDayRowsCount += 1;
                usualCellIndex = 0
            } else {
                usualCellIndex += 1
            }
            const timeIndex = (index - allDayRowsCount) % rowCountInGroup;
            return _extends({}, restCellProps, {
                startDate: startDate,
                allDay: allDay,
                highlighted: highlighted,
                text: weekUtils.getTimePanelCellText(timeIndex, startDate, startViewDate, cellDuration, startDayHour, viewOffset),
                groups: isVerticalGrouping ? groups : void 0,
                groupIndex: isVerticalGrouping ? groupIndex : void 0,
                isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
                isLastGroupCell: isVerticalGrouping && isLastGroupCell,
                index: Math.floor(cellIndex / cellCountInGroupRow)
            })
        }))
    }
    generateTimePanelData(completeTimePanelMap, options) {
        const {
            startRowIndex: startRowIndex,
            rowCount: rowCount,
            topVirtualRowHeight: topVirtualRowHeight,
            bottomVirtualRowHeight: bottomVirtualRowHeight,
            isGroupedAllDayPanel: isGroupedAllDayPanel,
            isVerticalGrouping: isVerticalGrouping,
            isAllDayPanelVisible: isAllDayPanelVisible
        } = options;
        const indexDifference = isVerticalGrouping || !isAllDayPanelVisible ? 0 : 1;
        const correctedStartRowIndex = startRowIndex + indexDifference;
        const displayedRowCount = getDisplayedRowCount(rowCount, completeTimePanelMap);
        const timePanelMap = completeTimePanelMap.slice(correctedStartRowIndex, correctedStartRowIndex + displayedRowCount);
        const timePanelData = {
            topVirtualRowHeight: topVirtualRowHeight,
            bottomVirtualRowHeight: bottomVirtualRowHeight,
            isGroupedAllDayPanel: isGroupedAllDayPanel
        };
        const {
            previousGroupedData: groupedData
        } = this._generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping);
        timePanelData.groupedData = groupedData;
        return timePanelData
    }
    _generateTimePanelDataFromMap(timePanelMap, isVerticalGrouping) {
        return timePanelMap.reduce(((_ref, cellData) => {
            let {
                previousGroupIndex: previousGroupIndex,
                previousGroupedData: previousGroupedData
            } = _ref;
            const currentGroupIndex = cellData.groupIndex;
            if (currentGroupIndex !== previousGroupIndex) {
                previousGroupedData.push({
                    dateTable: [],
                    isGroupedAllDayPanel: getIsGroupedAllDayPanel(!!cellData.allDay, isVerticalGrouping),
                    groupIndex: currentGroupIndex,
                    key: getKeyByGroup(currentGroupIndex, isVerticalGrouping)
                })
            }
            if (cellData.allDay) {
                previousGroupedData[previousGroupedData.length - 1].allDayPanel = cellData
            } else {
                previousGroupedData[previousGroupedData.length - 1].dateTable.push(cellData)
            }
            return {
                previousGroupIndex: currentGroupIndex,
                previousGroupedData: previousGroupedData
            }
        }), {
            previousGroupIndex: -1,
            previousGroupedData: []
        })
    }
    isTimeCellShouldBeHighlighted(today, viewOffset, _ref2, cellData) {
        let {
            startViewDate: startViewDate,
            realEndViewDate: realEndViewDate,
            showCurrentTimeIndicator: showCurrentTimeIndicator
        } = _ref2;
        const realToday = dateUtilsTs.addOffsets(today, [viewOffset]);
        const realStartViewDate = dateUtilsTs.addOffsets(startViewDate, [viewOffset]);
        if (!showCurrentTimeIndicator || realToday < realStartViewDate || realToday >= realEndViewDate) {
            return false
        }
        const realTodayTimeMs = this.getLocalDateTimeInMs(realToday);
        const [startMs, endMs] = this.getHighlightedInterval(cellData);
        return startMs < endMs ? realTodayTimeMs >= startMs && realTodayTimeMs < endMs : realTodayTimeMs >= startMs && realTodayTimeMs < toMs("day") || realTodayTimeMs >= 0 && realTodayTimeMs < endMs
    }
    getHighlightedInterval(_ref3) {
        let {
            date: date,
            index: index,
            duration: duration,
            isFirst: isFirst,
            isLast: isLast
        } = _ref3;
        const cellTimeMs = this.getLocalDateTimeInMs(date);
        const isEvenCell = index % 2 === 0;
        switch (true) {
            case isFirst || isLast && !isEvenCell:
                return [cellTimeMs, shiftIntegerByModule(cellTimeMs + duration, toMs("day"))];
            case isEvenCell:
                return [shiftIntegerByModule(cellTimeMs - duration, toMs("day")), shiftIntegerByModule(cellTimeMs + duration, toMs("day"))];
            default:
                return [cellTimeMs, shiftIntegerByModule(cellTimeMs + 2 * duration, toMs("day"))]
        }
    }
    getLocalDateTimeInMs(date) {
        const dateUtcMs = date.getTime() - date.getTimezoneOffset() * toMs("minute");
        return shiftIntegerByModule(dateUtcMs, toMs("day"))
    }
    isLastCellInGroup(completeViewDataMap, index) {
        if (index === completeViewDataMap.length - 1) {
            return true
        }
        const {
            groupIndex: currentGroupIndex
        } = completeViewDataMap[index][0];
        const {
            groupIndex: nextGroupIndex,
            allDay: nextAllDay
        } = completeViewDataMap[index + 1][0];
        return nextAllDay || nextGroupIndex !== currentGroupIndex
    }
}

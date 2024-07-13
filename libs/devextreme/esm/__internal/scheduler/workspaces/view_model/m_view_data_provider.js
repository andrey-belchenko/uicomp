/**
 * DevExtreme (esm/__internal/scheduler/workspaces/view_model/m_view_data_provider.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["groups", "groupOrientation", "groupByDate", "isAllDayPanelVisible", "viewOffset"];
import dateUtils from "../../../../core/utils/date";
import {
    dateUtilsTs
} from "../../../core/utils/date";
import {
    calculateIsGroupedAllDayPanel,
    getGroupPanelData,
    isGroupingByDate,
    isHorizontalGroupingApplied,
    isHorizontalView,
    isVerticalGroupingApplied
} from "../../../scheduler/r1/utils/index";
import timeZoneUtils from "../../m_utils_time_zone";
import {
    DateHeaderDataGenerator
} from "./m_date_header_data_generator";
import {
    GroupedDataMapProvider
} from "./m_grouped_data_map_provider";
import {
    TimePanelDataGenerator
} from "./m_time_panel_data_generator";
import {
    getViewDataGeneratorByViewType
} from "./m_utils";
export default class ViewDataProvider {
    constructor(viewType) {
        this.viewType = viewType;
        this.viewDataGenerator = getViewDataGeneratorByViewType(viewType);
        this.viewData = {};
        this.completeViewDataMap = [];
        this.completeDateHeaderMap = [];
        this.viewDataMap = {};
        this._groupedDataMapProvider = null
    }
    get groupedDataMap() {
        return this._groupedDataMapProvider.groupedDataMap
    }
    get hiddenInterval() {
        return this.viewDataGenerator.hiddenInterval
    }
    isSkippedDate(date) {
        return this.viewDataGenerator.isSkippedDate(date)
    }
    update(options, isGenerateNewViewData) {
        this.viewDataGenerator = getViewDataGeneratorByViewType(options.viewType);
        const {
            viewDataGenerator: viewDataGenerator
        } = this;
        const dateHeaderDataGenerator = new DateHeaderDataGenerator(viewDataGenerator);
        const timePanelDataGenerator = new TimePanelDataGenerator(viewDataGenerator);
        const renderOptions = this._transformRenderOptions(options);
        renderOptions.interval = this.viewDataGenerator.getInterval(renderOptions.hoursInterval);
        this._options = renderOptions;
        if (isGenerateNewViewData) {
            this.completeViewDataMap = viewDataGenerator.getCompleteViewDataMap(renderOptions);
            this.completeDateHeaderMap = dateHeaderDataGenerator.getCompleteDateHeaderMap(renderOptions, this.completeViewDataMap);
            if (renderOptions.isGenerateTimePanelData) {
                this.completeTimePanelMap = timePanelDataGenerator.getCompleteTimePanelMap(renderOptions, this.completeViewDataMap)
            }
        }
        this.viewDataMap = viewDataGenerator.generateViewDataMap(this.completeViewDataMap, renderOptions);
        this.updateViewData(renderOptions);
        this._groupedDataMapProvider = new GroupedDataMapProvider(this.viewDataGenerator, this.viewDataMap, this.completeViewDataMap, {
            isVerticalGrouping: renderOptions.isVerticalGrouping,
            viewType: renderOptions.viewType,
            viewOffset: options.viewOffset
        });
        this.dateHeaderData = dateHeaderDataGenerator.generateDateHeaderData(this.completeDateHeaderMap, this.completeViewDataMap, renderOptions);
        if (renderOptions.isGenerateTimePanelData) {
            this.timePanelData = timePanelDataGenerator.generateTimePanelData(this.completeTimePanelMap, renderOptions)
        }
    }
    createGroupedDataMapProvider() {
        this._groupedDataMapProvider = new GroupedDataMapProvider(this.viewDataGenerator, this.viewDataMap, this.completeViewDataMap, {
            isVerticalGrouping: this._options.isVerticalGrouping,
            viewType: this._options.viewType
        })
    }
    updateViewData(options) {
        const renderOptions = this._transformRenderOptions(options);
        this.viewDataMapWithSelection = this.viewDataGenerator.markSelectedAndFocusedCells(this.viewDataMap, renderOptions);
        this.viewData = this.viewDataGenerator.getViewDataFromMap(this.completeViewDataMap, this.viewDataMapWithSelection, renderOptions)
    }
    _transformRenderOptions(renderOptions) {
        const {
            groups: groups,
            groupOrientation: groupOrientation,
            groupByDate: groupByDate,
            isAllDayPanelVisible: isAllDayPanelVisible,
            viewOffset: viewOffset
        } = renderOptions, restOptions = _objectWithoutPropertiesLoose(renderOptions, _excluded);
        return _extends({}, restOptions, {
            startViewDate: this.viewDataGenerator._calculateStartViewDate(renderOptions),
            isVerticalGrouping: isVerticalGroupingApplied(groups, groupOrientation),
            isHorizontalGrouping: isHorizontalGroupingApplied(groups, groupOrientation),
            isGroupedByDate: isGroupingByDate(groups, groupOrientation, groupByDate),
            isGroupedAllDayPanel: calculateIsGroupedAllDayPanel(groups, groupOrientation, isAllDayPanelVisible),
            groups: groups,
            groupOrientation: groupOrientation,
            isAllDayPanelVisible: isAllDayPanelVisible,
            viewOffset: viewOffset
        })
    }
    getGroupPanelData(options) {
        const renderOptions = this._transformRenderOptions(options);
        if (renderOptions.groups.length > 0) {
            const cellCount = this.getCellCount(renderOptions);
            return getGroupPanelData(renderOptions.groups, cellCount, renderOptions.isGroupedByDate, renderOptions.isGroupedByDate ? 1 : cellCount)
        }
        return
    }
    getGroupStartDate(groupIndex) {
        return this._groupedDataMapProvider.getGroupStartDate(groupIndex)
    }
    getGroupEndDate(groupIndex) {
        return this._groupedDataMapProvider.getGroupEndDate(groupIndex)
    }
    findGroupCellStartDate(groupIndex, startDate, endDate) {
        let isFindByDate = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : false;
        return this._groupedDataMapProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isFindByDate)
    }
    findAllDayGroupCellStartDate(groupIndex) {
        return this._groupedDataMapProvider.findAllDayGroupCellStartDate(groupIndex)
    }
    findCellPositionInMap(cellInfo) {
        let isAppointmentRender = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
        return this._groupedDataMapProvider.findCellPositionInMap(cellInfo, isAppointmentRender)
    }
    hasAllDayPanel() {
        const {
            viewData: viewData
        } = this.viewDataMap;
        const {
            allDayPanel: allDayPanel
        } = viewData.groupedData[0];
        return !viewData.isGroupedAllDayPanel && (null === allDayPanel || void 0 === allDayPanel ? void 0 : allDayPanel.length) > 0
    }
    getCellsGroup(groupIndex) {
        return this._groupedDataMapProvider.getCellsGroup(groupIndex)
    }
    getCompletedGroupsInfo() {
        return this._groupedDataMapProvider.getCompletedGroupsInfo()
    }
    getGroupIndices() {
        return this._groupedDataMapProvider.getGroupIndices()
    }
    getLastGroupCellPosition(groupIndex) {
        return this._groupedDataMapProvider.getLastGroupCellPosition(groupIndex)
    }
    getRowCountInGroup(groupIndex) {
        return this._groupedDataMapProvider.getRowCountInGroup(groupIndex)
    }
    getCellData(rowIndex, columnIndex, isAllDay, rtlEnabled) {
        const row = isAllDay && !this._options.isVerticalGrouping ? this.viewDataMap.allDayPanelMap : this.viewDataMap.dateTableMap[rowIndex];
        const actualColumnIndex = !rtlEnabled ? columnIndex : row.length - 1 - columnIndex;
        const {
            cellData: cellData
        } = row[actualColumnIndex];
        return cellData
    }
    getCellsByGroupIndexAndAllDay(groupIndex, allDay) {
        const rowsPerGroup = this._getRowCountWithAllDayRows();
        const isShowAllDayPanel = this._options.isAllDayPanelVisible;
        const firstRowInGroup = this._options.isVerticalGrouping ? groupIndex * rowsPerGroup : 0;
        const lastRowInGroup = this._options.isVerticalGrouping ? (groupIndex + 1) * rowsPerGroup - 1 : rowsPerGroup;
        const correctedFirstRow = isShowAllDayPanel && !allDay ? firstRowInGroup + 1 : firstRowInGroup;
        const correctedLastRow = allDay ? correctedFirstRow : lastRowInGroup;
        return this.completeViewDataMap.slice(correctedFirstRow, correctedLastRow + 1).map((row => row.filter((_ref => {
            let {
                groupIndex: currentGroupIndex
            } = _ref;
            return groupIndex === currentGroupIndex
        }))))
    }
    getCellCountWithGroup(groupIndex) {
        let rowIndex = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        return dateTableGroupedMap.filter(((_, index) => index <= groupIndex)).reduce(((previous, row) => previous + row[rowIndex].length), 0)
    }
    hasGroupAllDayPanel(groupIndex) {
        var _this$groupedDataMap$2;
        if (this._options.isVerticalGrouping) {
            var _this$groupedDataMap$;
            return !!(null !== (_this$groupedDataMap$ = this.groupedDataMap.dateTableGroupedMap[groupIndex]) && void 0 !== _this$groupedDataMap$ && _this$groupedDataMap$[0][0].cellData.allDay)
        }
        return (null === (_this$groupedDataMap$2 = this.groupedDataMap.allDayPanelGroupedMap[groupIndex]) || void 0 === _this$groupedDataMap$2 ? void 0 : _this$groupedDataMap$2.length) > 0
    }
    isGroupIntersectDateInterval(groupIndex, startDate, endDate) {
        const groupStartDate = this.getGroupStartDate(groupIndex);
        const groupEndDate = this.getGroupEndDate(groupIndex);
        return startDate < groupEndDate && endDate > groupStartDate
    }
    findGlobalCellPosition(date) {
        let groupIndex = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        let allDay = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
        const {
            completeViewDataMap: completeViewDataMap
        } = this;
        const showAllDayPanel = this._options.isAllDayPanelVisible;
        for (let rowIndex = 0; rowIndex < completeViewDataMap.length; rowIndex += 1) {
            const currentRow = completeViewDataMap[rowIndex];
            for (let columnIndex = 0; columnIndex < currentRow.length; columnIndex += 1) {
                const cellData = currentRow[columnIndex];
                const {
                    startDate: currentStartDate,
                    endDate: currentEndDate,
                    groupIndex: currentGroupIndex,
                    allDay: currentAllDay
                } = cellData;
                if (groupIndex === currentGroupIndex && allDay === !!currentAllDay && this._compareDatesAndAllDay(date, currentStartDate, currentEndDate, allDay)) {
                    return {
                        position: {
                            columnIndex: columnIndex,
                            rowIndex: showAllDayPanel && !this._options.isVerticalGrouping ? rowIndex - 1 : rowIndex
                        },
                        cellData: cellData
                    }
                }
            }
        }
        return
    }
    _compareDatesAndAllDay(date, cellStartDate, cellEndDate, allDay) {
        return allDay ? dateUtils.sameDate(date, cellStartDate) : date >= cellStartDate && date < cellEndDate
    }
    getSkippedDaysCount(groupIndex, startDate, endDate, daysCount) {
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this._groupedDataMapProvider.groupedDataMap;
        const groupedData = dateTableGroupedMap[groupIndex];
        let includedDays = 0;
        for (let rowIndex = 0; rowIndex < groupedData.length; rowIndex += 1) {
            for (let columnIndex = 0; columnIndex < groupedData[rowIndex].length; columnIndex += 1) {
                const cell = groupedData[rowIndex][columnIndex].cellData;
                if (startDate.getTime() < cell.endDate.getTime() && endDate.getTime() > cell.startDate.getTime()) {
                    includedDays += 1
                }
            }
        }
        const lastCell = groupedData[groupedData.length - 1][groupedData[0].length - 1].cellData;
        const lastCellStart = dateUtils.trimTime(lastCell.startDate);
        const daysAfterView = Math.floor((endDate.getTime() - lastCellStart.getTime()) / dateUtils.dateToMilliseconds("day"));
        const deltaDays = daysAfterView > 0 ? daysAfterView : 0;
        return daysCount - includedDays - deltaDays
    }
    getColumnsCount() {
        const {
            dateTableMap: dateTableMap
        } = this.viewDataMap;
        return dateTableMap ? dateTableMap[0].length : 0
    }
    getViewEdgeIndices(isAllDayPanel) {
        if (isAllDayPanel) {
            return {
                firstColumnIndex: 0,
                lastColumnIndex: this.viewDataMap.allDayPanelMap.length - 1,
                firstRowIndex: 0,
                lastRowIndex: 0
            }
        }
        return {
            firstColumnIndex: 0,
            lastColumnIndex: this.viewDataMap.dateTableMap[0].length - 1,
            firstRowIndex: 0,
            lastRowIndex: this.viewDataMap.dateTableMap.length - 1
        }
    }
    getGroupEdgeIndices(groupIndex, isAllDay) {
        const groupedDataMap = this.groupedDataMap.dateTableGroupedMap[groupIndex];
        const cellsCount = groupedDataMap[0].length;
        const rowsCount = groupedDataMap.length;
        const firstColumnIndex = groupedDataMap[0][0].position.columnIndex;
        const lastColumnIndex = groupedDataMap[0][cellsCount - 1].position.columnIndex;
        if (isAllDay) {
            return {
                firstColumnIndex: firstColumnIndex,
                lastColumnIndex: lastColumnIndex,
                firstRowIndex: 0,
                lastRowIndex: 0
            }
        }
        return {
            firstColumnIndex: firstColumnIndex,
            lastColumnIndex: lastColumnIndex,
            firstRowIndex: groupedDataMap[0][0].position.rowIndex,
            lastRowIndex: groupedDataMap[rowsCount - 1][0].position.rowIndex
        }
    }
    isSameCell(firstCellData, secondCellData) {
        const {
            startDate: firstStartDate,
            groupIndex: firstGroupIndex,
            allDay: firstAllDay,
            index: firstIndex
        } = firstCellData;
        const {
            startDate: secondStartDate,
            groupIndex: secondGroupIndex,
            allDay: secondAllDay,
            index: secondIndex
        } = secondCellData;
        return firstStartDate.getTime() === secondStartDate.getTime() && firstGroupIndex === secondGroupIndex && firstAllDay === secondAllDay && firstIndex === secondIndex
    }
    getLastViewDate() {
        const {
            completeViewDataMap: completeViewDataMap
        } = this;
        const rowsCount = completeViewDataMap.length - 1;
        return completeViewDataMap[rowsCount][completeViewDataMap[rowsCount].length - 1].endDate
    }
    getStartViewDate() {
        return this._options.startViewDate
    }
    getIntervalDuration(intervalCount) {
        return this.viewDataGenerator._getIntervalDuration(intervalCount)
    }
    getLastCellEndDate() {
        const lastEndDate = new Date(this.getLastViewDate().getTime() - dateUtils.dateToMilliseconds("minute"));
        return dateUtilsTs.addOffsets(lastEndDate, [-this._options.viewOffset])
    }
    getLastViewDateByEndDayHour(endDayHour) {
        const lastCellEndDate = this.getLastCellEndDate();
        const endTime = dateUtils.dateTimeFromDecimal(endDayHour);
        const endDateOfLastViewCell = new Date(lastCellEndDate.setHours(endTime.hours, endTime.minutes));
        return this._adjustEndDateByDaylightDiff(lastCellEndDate, endDateOfLastViewCell)
    }
    _adjustEndDateByDaylightDiff(startDate, endDate) {
        const daylightDiff = timeZoneUtils.getDaylightOffsetInMs(startDate, endDate);
        const endDateOfLastViewCell = new Date(endDate.getTime() - daylightDiff);
        return new Date(endDateOfLastViewCell.getTime() - dateUtils.dateToMilliseconds("minute"))
    }
    getCellCountInDay(startDayHour, endDayHour, hoursInterval) {
        return this.viewDataGenerator.getCellCountInDay(startDayHour, endDayHour, hoursInterval)
    }
    getCellCount(options) {
        return this.viewDataGenerator.getCellCount(options)
    }
    getRowCount(options) {
        return this.viewDataGenerator.getRowCount(options)
    }
    getVisibleDayDuration(startDayHour, endDayHour, hoursInterval) {
        return this.viewDataGenerator.getVisibleDayDuration(startDayHour, endDayHour, hoursInterval)
    }
    _getRowCountWithAllDayRows() {
        const allDayRowCount = this._options.isAllDayPanelVisible ? 1 : 0;
        return this.getRowCount(this._options) + allDayRowCount
    }
    getFirstDayOfWeek(firstDayOfWeekOption) {
        return this.viewDataGenerator.getFirstDayOfWeek(firstDayOfWeekOption)
    }
    setViewOptions(options) {
        this._options = this._transformRenderOptions(options)
    }
    getViewOptions() {
        return this._options
    }
    getViewPortGroupCount() {
        const {
            dateTableGroupedMap: dateTableGroupedMap
        } = this.groupedDataMap;
        return (null === dateTableGroupedMap || void 0 === dateTableGroupedMap ? void 0 : dateTableGroupedMap.length) || 0
    }
    getCellsBetween(first, last) {
        const [firstCell, lastCell] = this.normalizeCellsOrder(first, last);
        const {
            index: firstIdx
        } = firstCell;
        const {
            index: lastIdx
        } = lastCell;
        const cellMatrix = this.getCellsByGroupIndexAndAllDay(firstCell.groupIndex ?? 0, lastCell.allDay ?? false);
        return isHorizontalView(this.viewType) ? this.getCellsBetweenHorizontalView(cellMatrix, firstIdx, lastIdx) : this.getCellsBetweenVerticalView(cellMatrix, firstIdx, lastIdx)
    }
    getCellsBetweenHorizontalView(cellMatrix, firstIdx, lastIdx) {
        return cellMatrix.reduce(((result, row) => result.concat(row.filter((_ref2 => {
            let {
                index: index
            } = _ref2;
            return firstIdx <= index && index <= lastIdx
        })))), [])
    }
    getCellsBetweenVerticalView(cellMatrix, firstIdx, lastIdx) {
        var _cellMatrix$;
        const result = [];
        const matrixHeight = cellMatrix.length;
        const matrixWidth = (null === (_cellMatrix$ = cellMatrix[0]) || void 0 === _cellMatrix$ ? void 0 : _cellMatrix$.length) ?? 0;
        let inSegment = false;
        for (let columnIdx = 0; columnIdx < matrixWidth; columnIdx += 1) {
            for (let rowIdx = 0; rowIdx < matrixHeight; rowIdx += 1) {
                const cell = cellMatrix[rowIdx][columnIdx];
                const {
                    index: cellIdx
                } = cell;
                if (cellIdx === firstIdx) {
                    inSegment = true
                }
                if (inSegment) {
                    result.push(cell)
                }
                if (cellIdx === lastIdx) {
                    return result
                }
            }
        }
        return result
    }
    normalizeCellsOrder(firstSelectedCell, lastSelectedCell) {
        return firstSelectedCell.startDate > lastSelectedCell.startDate ? [lastSelectedCell, firstSelectedCell] : [firstSelectedCell, lastSelectedCell]
    }
}

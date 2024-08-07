/**
 * DevExtreme (cjs/__internal/scheduler/workspaces/m_work_space_month.js)
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
var _common = require("../../../core/utils/common");
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _position = require("../../../core/utils/position");
var _window = require("../../../core/utils/window");
var _index = require("../../scheduler/r1/components/index");
var _index2 = require("../../scheduler/r1/utils/index");
var _m_constants = require("../m_constants");
var _m_utils = require("../m_utils");
var _m_work_space_indicator = _interopRequireDefault(require("./m_work_space_indicator"));

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
const MONTH_CLASS = "dx-scheduler-work-space-month";
const DATE_TABLE_CURRENT_DATE_CLASS = "dx-scheduler-date-table-current-date";
const DATE_TABLE_CELL_TEXT_CLASS = "dx-scheduler-date-table-cell-text";
const DATE_TABLE_FIRST_OF_MONTH_CLASS = "dx-scheduler-date-table-first-of-month";
const DATE_TABLE_OTHER_MONTH_DATE_CLASS = "dx-scheduler-date-table-other-month";
const toMs = _date.default.dateToMilliseconds;
class SchedulerWorkSpaceMonth extends _m_work_space_indicator.default {
    get type() {
        return _m_constants.VIEWS.MONTH
    }
    _getElementClass() {
        return MONTH_CLASS
    }
    _getFormat() {
        return _index2.formatWeekday
    }
    _getIntervalBetween(currentDate) {
        const firstViewDate = this.getStartViewDate();
        const timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
        return currentDate.getTime() - (firstViewDate.getTime() - 36e5 * this.option("startDayHour")) - timeZoneOffset
    }
    _getDateGenerationOptions() {
        return _extends({}, super._getDateGenerationOptions(), {
            cellCountInDay: 1
        })
    }
    getCellWidth() {
        return this.cache.get("cellWidth", (() => {
            let averageWidth = 0;
            const cells = this._getCells().slice(0, 7);
            cells.each(((index, element) => {
                averageWidth += (0, _window.hasWindow)() ? (0, _position.getBoundingRect)(element).width : 0
            }));
            return 0 === cells.length ? void 0 : averageWidth / 7
        }))
    }
    _insertAllDayRowsIntoDateTable() {
        return false
    }
    _getCellCoordinatesByIndex(index) {
        const rowIndex = Math.floor(index / this._getCellCount());
        const columnIndex = index - this._getCellCount() * rowIndex;
        return {
            rowIndex: rowIndex,
            columnIndex: columnIndex
        }
    }
    _needCreateCrossScrolling() {
        return this.option("crossScrollingEnabled") || this._isVerticalGroupedWorkSpace()
    }
    _getViewStartByOptions() {
        return _index2.monthUtils.getViewStartByOptions(this.option("startDate"), this.option("currentDate"), this.option("intervalCount"), _date.default.getFirstMonthDate(this.option("startDate")))
    }
    _updateIndex(index) {
        return index
    }
    isIndicationAvailable() {
        return false
    }
    getIntervalDuration() {
        return toMs("day")
    }
    getTimePanelWidth() {
        return 0
    }
    supportAllDayRow() {
        return false
    }
    keepOriginalHours() {
        return true
    }
    getWorkSpaceLeftOffset() {
        return 0
    }
    needApplyCollectorOffset() {
        return true
    }
    _getHeaderDate() {
        return this._getViewStartByOptions()
    }
    scrollToTime() {
        return (0, _common.noop)()
    }
    renderRAllDayPanel() {}
    renderRTimeTable() {}
    renderRDateTable() {
        _m_utils.utils.renovation.renderComponent(this, this._$dateTable, _index.DateTableMonthComponent, "renovatedDateTable", this._getRDateTableProps())
    }
    _createWorkSpaceElements() {
        if (this._isVerticalGroupedWorkSpace()) {
            this._createWorkSpaceScrollableElements()
        } else {
            super._createWorkSpaceElements()
        }
    }
    _toggleAllDayVisibility() {
        return (0, _common.noop)()
    }
    _changeAllDayVisibility() {
        return (0, _common.noop)()
    }
    _renderTimePanel() {
        return (0, _common.noop)()
    }
    _renderAllDayPanel() {
        return (0, _common.noop)()
    }
    _setMonthClassesToCell($cell, data) {
        $cell.toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, data.isCurrentDate).toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, data.firstDayOfMonth).toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, data.otherMonth)
    }
    _createAllDayPanelElements() {}
    _renderTableBody(options) {
        options.getCellText = (rowIndex, columnIndex) => {
            const date = this.viewDataProvider.completeViewDataMap[rowIndex][columnIndex].startDate;
            return _index2.monthUtils.getCellText(date, this.option("intervalCount"))
        };
        options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
        options.setAdditionalClasses = this._setMonthClassesToCell.bind(this);
        super._renderTableBody(options)
    }
}(0, _component_registrator.default)("dxSchedulerWorkSpaceMonth", SchedulerWorkSpaceMonth);
var _default = exports.default = SchedulerWorkSpaceMonth;

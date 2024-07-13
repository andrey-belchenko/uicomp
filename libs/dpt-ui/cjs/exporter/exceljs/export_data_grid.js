/**
 * DevExtreme (cjs/exporter/exceljs/export_data_grid.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.exportDataGrid = exportDataGrid;
var _type = require("../../core/utils/type");
var _export = require("./export");
var _export_merged_ranges_manager = require("./export_merged_ranges_manager");
class DataGridHelpers {
    constructor(component, dataProvider, worksheet, options) {
        this.component = component;
        this.dataProvider = dataProvider;
        this.worksheet = worksheet;
        this.mergedRangesManager = new _export_merged_ranges_manager.MergedRangesManager(dataProvider, worksheet);
        this.topLeftCell = options.topLeftCell;
        this.customizeCell = options.customizeCell;
        this.autoFilterEnabled = options.autoFilterEnabled
    }
    _getFirstColumnIndex() {
        return this.topLeftCell.column
    }
    _getFieldHeaderRowsCount() {
        return 0
    }
    _trySetAutoFilter(cellRange) {
        if (this.autoFilterEnabled) {
            if (!(0, _type.isDefined)(this.worksheet.autoFilter) && this.dataProvider.getRowsCount() > 0) {
                const dataRange = {
                    from: {
                        row: cellRange.from.row + this.dataProvider.getHeaderRowCount() - 1,
                        column: cellRange.from.column
                    },
                    to: cellRange.to
                };
                this.worksheet.autoFilter = dataRange
            }
        }
    }
    _trySetFont(excelCell, bold) {
        if ((0, _type.isDefined)(bold)) {
            excelCell.font = excelCell.font || {};
            excelCell.font.bold = bold
        }
    }
    _getWorksheetFrozenState(cellRange) {
        return {
            state: "frozen",
            ySplit: cellRange.from.row + this.dataProvider.getFrozenArea().y - 1
        }
    }
    _trySetOutlineLevel(row, rowIndex) {
        if (rowIndex >= this.dataProvider.getHeaderRowCount()) {
            row.outlineLevel = this.dataProvider.getGroupLevel(rowIndex)
        }
    }
    _isFrozenZone(dataProvider) {
        return dataProvider.getHeaderRowCount() > 0
    }
    _isHeaderCell(rowIndex) {
        return rowIndex < this.dataProvider.getHeaderRowCount()
    }
    _isInfoCell() {
        return false
    }
    _allowToMergeRange() {
        return true
    }
    _getAllFieldHeaders() {
        return []
    }
    _customizeCell(excelCell, gridCell) {
        if ((0, _type.isFunction)(this.customizeCell)) {
            this.customizeCell({
                excelCell: excelCell,
                gridCell: gridCell
            })
        }
    }
    _exportFieldHeaders() {}
    _exportAllFieldHeaders() {}
    _isRowFieldHeadersRow() {}
}

function exportDataGrid(options) {
    return _export.Export.export(_getFullOptions(options), DataGridHelpers, _getLoadPanelTargetElement, _getLoadPanelContainer)
}

function _getFullOptions(options) {
    if (!((0, _type.isDefined)(options) && (0, _type.isObject)(options))) {
        throw Error('The "exportDataGrid" method requires a configuration object.')
    }
    if (!((0, _type.isDefined)(options.component) && (0, _type.isObject)(options.component) && "dxDataGrid" === options.component.NAME)) {
        throw Error('The "component" field must contain a DataGrid instance.')
    }
    if (!(0, _type.isDefined)(options.selectedRowsOnly)) {
        options.selectedRowsOnly = false
    }
    if (!(0, _type.isDefined)(options.autoFilterEnabled)) {
        options.autoFilterEnabled = false
    }
    return _export.Export.getFullOptions(options)
}

function _getLoadPanelTargetElement(component) {
    return component.getView("rowsView").element()
}

function _getLoadPanelContainer(component) {
    return component.getView("rowsView").element().parent()
}
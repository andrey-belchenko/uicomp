/**
 * DevExtreme (esm/__internal/grids/pivot_grid/export/m_export.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import Class from "../../../../core/class";
import {
    Deferred,
    when
} from "../../../../core/utils/deferred";
import {
    extend
} from "../../../../core/utils/extend";
import {
    each
} from "../../../../core/utils/iterator";
import {
    getDefaultAlignment
} from "../../../../core/utils/position";
import {
    isDefined,
    isFunction
} from "../../../../core/utils/type";
import {
    hasWindow
} from "../../../../core/utils/window";
import formatHelper from "../../../../format_helper";
import localizationNumber from "../../../../localization/number";
import {
    prepareItems
} from "../../../grids/grid_core/m_export";
const DEFAULT_DATA_TYPE = "string";
const DEFAUL_COLUMN_WIDTH = 100;
const ExportController = {
    exportTo() {
        const onExporting = this._createActionByOption("onExporting");
        const eventArgs = {
            rtlEnabled: this.option("rtlEnabled"),
            fileName: "PivotGrid",
            cancel: false
        };
        isFunction(onExporting) && onExporting(eventArgs)
    },
    _getLength(items) {
        let i;
        const itemCount = items[0].length;
        let cellCount = 0;
        for (i = 0; i < itemCount; i += 1) {
            cellCount += items[0][i].colspan || 1
        }
        return cellCount
    },
    _correctCellsInfoItemLengths(cellsInfo, expectedLength) {
        for (let i = 0; i < cellsInfo.length; i += 1) {
            while (cellsInfo[i].length < expectedLength) {
                cellsInfo[i].push({})
            }
        }
        return cellsInfo
    },
    _calculateCellInfoItemLength(columnsRow) {
        let result = 0;
        for (let columnIndex = 0; columnIndex < columnsRow.length; columnIndex += 1) {
            result += isDefined(columnsRow[columnIndex].colspan) ? columnsRow[columnIndex].colspan : 1
        }
        return result
    },
    _getEmptyCell: () => ({
        text: "",
        value: void 0,
        colspan: 1,
        rowspan: 1
    }),
    _getAllItems(columnsInfo, rowsInfoItems, cellsInfo) {
        let cellIndex;
        let rowIndex;
        let correctedCellsInfo = cellsInfo;
        const rowsLength = this._getLength(rowsInfoItems);
        const headerRowsCount = columnsInfo.length;
        if (columnsInfo.length > 0 && columnsInfo[0].length > 0 && cellsInfo.length > 0 && 0 === cellsInfo[0].length) {
            const cellInfoItemLength = this._calculateCellInfoItemLength(columnsInfo[0]);
            if (cellInfoItemLength > 0) {
                correctedCellsInfo = this._correctCellsInfoItemLengths(cellsInfo, cellInfoItemLength)
            }
        }
        if (0 === correctedCellsInfo.length) {
            const rowsCount = rowsInfoItems.length;
            const collapsedColumnCount = columnsInfo.map((headerRowWithColumns => headerRowWithColumns.filter((row => !row.expanded)).length)).reduce(((result, collapsedCount) => result + collapsedCount), 0);
            for (let rowIdx = 0; rowIdx < rowsCount; rowIdx += 1) {
                correctedCellsInfo[rowIdx] = [];
                for (let colIdx = 0; colIdx < collapsedColumnCount; colIdx += 1) {
                    correctedCellsInfo[rowIdx][colIdx] = this._getEmptyCell()
                }
            }
        }
        const sourceItems = columnsInfo.concat(correctedCellsInfo);
        for (rowIndex = 0; rowIndex < rowsInfoItems.length; rowIndex += 1) {
            for (cellIndex = rowsInfoItems[rowIndex].length - 1; cellIndex >= 0; cellIndex -= 1) {
                if (!isDefined(sourceItems[rowIndex + headerRowsCount])) {
                    sourceItems[rowIndex + headerRowsCount] = []
                }
                sourceItems[rowIndex + headerRowsCount].splice(0, 0, extend({}, rowsInfoItems[rowIndex][cellIndex]))
            }
        }
        sourceItems[0].splice(0, 0, extend({}, this._getEmptyCell(), {
            alignment: getDefaultAlignment(this._options.rtlEnabled),
            colspan: rowsLength,
            rowspan: headerRowsCount
        }));
        return prepareItems(sourceItems, this._getEmptyCell())
    },
    getDataProvider() {
        return new DataProvider(this)
    }
};
const DataProvider = Class.inherit({
    ctor(exportController) {
        this._exportController = exportController
    },
    ready() {
        this._initOptions();
        const options = this._options;
        return when(options.items).done((items => {
            const headerSize = items[0][0].rowspan;
            const columns = items[headerSize - 1];
            each(columns, ((_, column) => {
                column.width = 100
            }));
            options.columns = columns;
            options.items = items
        }))
    },
    _initOptions() {
        const exportController = this._exportController;
        const dataController = exportController._dataController;
        const items = new Deferred;
        dataController.beginLoading();
        setTimeout((() => {
            const columnsInfo = extend(true, [], dataController.getColumnsInfo(true));
            const rowsInfoItems = extend(true, [], dataController.getRowsInfo(true));
            const cellsInfo = dataController.getCellsInfo(true);
            items.resolve(exportController._getAllItems(columnsInfo, rowsInfoItems, cellsInfo));
            dataController.endLoading()
        }));
        this._options = {
            items: items,
            rtlEnabled: exportController.option("rtlEnabled"),
            dataFields: exportController.getDataSource().getAreaFields("data"),
            rowsArea: exportController._rowsArea,
            columnsArea: exportController._columnsArea
        }
    },
    getColumns() {
        return this._options.columns
    },
    getColumnsWidths() {
        const colsArea = this._options.columnsArea;
        const {
            rowsArea: rowsArea
        } = this._options;
        const {
            columns: columns
        } = this._options;
        const useDefaultWidth = !hasWindow() || "virtual" === colsArea.option("scrolling.mode") || colsArea.element().is(":hidden");
        return useDefaultWidth ? columns.map((() => 100)) : rowsArea.getColumnsWidth().concat(colsArea.getColumnsWidth())
    },
    getRowsCount() {
        return this._options.items.length
    },
    getGroupLevel: () => 0,
    getCellMerging(rowIndex, cellIndex) {
        const {
            items: items
        } = this._options;
        const item = items[rowIndex] && items[rowIndex][cellIndex];
        return item ? {
            colspan: item.colspan - 1,
            rowspan: item.rowspan - 1
        } : {
            colspan: 0,
            rowspan: 0
        }
    },
    getFrozenArea() {
        return {
            x: this.getRowAreaColCount(),
            y: this.getColumnAreaRowCount()
        }
    },
    getCellType(rowIndex, cellIndex) {
        const style = this.getStyles()[this.getStyleId(rowIndex, cellIndex)];
        return style && style.dataType || "string"
    },
    getCellData(rowIndex, cellIndex, isExcelJS) {
        const result = {};
        const {
            items: items
        } = this._options;
        const item = items[rowIndex] && items[rowIndex][cellIndex] || {};
        if (isExcelJS) {
            result.cellSourceData = item;
            const areaName = this._tryGetAreaName(item, rowIndex, cellIndex);
            if (areaName) {
                result.cellSourceData.area = areaName
            }
            result.cellSourceData.rowIndex = rowIndex;
            result.cellSourceData.columnIndex = cellIndex
        }
        if ("string" === this.getCellType(rowIndex, cellIndex)) {
            result.value = item.text
        } else {
            result.value = item.value
        }
        if (result.cellSourceData && result.cellSourceData.isWhiteSpace) {
            result.value = ""
        }
        return result
    },
    _tryGetAreaName(item, rowIndex, cellIndex) {
        if (this.isColumnAreaCell(rowIndex, cellIndex)) {
            return "column"
        }
        if (this.isRowAreaCell(rowIndex, cellIndex)) {
            return "row"
        }
        if (isDefined(item.dataIndex)) {
            return "data"
        }
        return
    },
    isRowAreaCell(rowIndex, cellIndex) {
        return rowIndex >= this.getColumnAreaRowCount() && cellIndex < this.getRowAreaColCount()
    },
    isColumnAreaCell(rowIndex, cellIndex) {
        return cellIndex >= this.getRowAreaColCount() && rowIndex < this.getColumnAreaRowCount()
    },
    getColumnAreaRowCount() {
        return this._options.items[0][0].rowspan
    },
    getRowAreaColCount() {
        return this._options.items[0][0].colspan
    },
    getHeaderStyles() {
        return [{
            alignment: "center",
            dataType: "string"
        }, {
            alignment: getDefaultAlignment(this._options.rtlEnabled),
            dataType: "string"
        }]
    },
    getDataFieldStyles() {
        const {
            dataFields: dataFields
        } = this._options;
        const dataItemStyle = {
            alignment: this._options.rtlEnabled ? "left" : "right"
        };
        const dataFieldStyles = [];
        if (dataFields.length) {
            dataFields.forEach((dataField => {
                dataFieldStyles.push(_extends({}, dataItemStyle, {
                    format: dataField.format,
                    dataType: this.getCellDataType(dataField)
                }))
            }));
            return dataFieldStyles
        }
        return [dataItemStyle]
    },
    getStyles() {
        if (this._styles) {
            return this._styles
        }
        this._styles = [...this.getHeaderStyles(), ...this.getDataFieldStyles()];
        return this._styles
    },
    getCellDataType(field) {
        if (field && field.customizeText) {
            return "string"
        }
        if (field.dataType) {
            return field.dataType
        }
        if (field.format) {
            if (1 === localizationNumber.parse(formatHelper.format(1, field.format))) {
                return "number"
            }
            if (formatHelper.format(new Date, field.format)) {
                return "date"
            }
        }
        return "string"
    },
    getStyleId(rowIndex, cellIndex) {
        const {
            items: items
        } = this._options;
        const item = items[rowIndex] && items[rowIndex][cellIndex] || {};
        if (0 === cellIndex && 0 === rowIndex || this.isColumnAreaCell(rowIndex, cellIndex)) {
            return 0
        }
        if (this.isRowAreaCell(rowIndex, cellIndex)) {
            return 1
        }
        return this.getHeaderStyles().length + (item.dataIndex || 0)
    }
});
const PivotGridExport = {
    DEFAUL_COLUMN_WIDTH: 100
};
export default {
    ExportController: ExportController,
    PivotGridExport: PivotGridExport,
    DataProvider: DataProvider
};
export {
    DataProvider,
    ExportController,
    PivotGridExport
};
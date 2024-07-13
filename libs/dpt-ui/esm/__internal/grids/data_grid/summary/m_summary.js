/**
 * DevExtreme (esm/__internal/grids/data_grid/summary/m_summary.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../../../core/renderer";
import {
    noop
} from "../../../../core/utils/common";
import {
    compileGetter
} from "../../../../core/utils/data";
import {
    extend
} from "../../../../core/utils/extend";
import {
    each,
    map
} from "../../../../core/utils/iterator";
import {
    isDefined,
    isEmptyObject,
    isFunction,
    isPlainObject,
    isString
} from "../../../../core/utils/type";
import dataQuery from "../../../../data/query";
import storeHelper from "../../../../data/store_helper";
import {
    normalizeSortingInfo
} from "../../../../data/utils";
import messageLocalization from "../../../../localization/message";
import errors from "../../../../ui/widget/ui.errors";
import {
    ColumnsView
} from "../../../grids/grid_core/views/m_columns_view";
import AggregateCalculator from "../m_aggregate_calculator";
import gridCore from "../m_core";
import dataSourceAdapterProvider from "../m_data_source_adapter";
const DATAGRID_TOTAL_FOOTER_CLASS = "dx-datagrid-total-footer";
const DATAGRID_SUMMARY_ITEM_CLASS = "dx-datagrid-summary-item";
const DATAGRID_TEXT_CONTENT_CLASS = "dx-datagrid-text-content";
const DATAGRID_GROUP_FOOTER_CLASS = "dx-datagrid-group-footer";
const DATAGRID_GROUP_TEXT_CONTENT_CLASS = "dx-datagrid-group-text-content";
const DATAGRID_NOWRAP_CLASS = "dx-datagrid-nowrap";
const DATAGRID_FOOTER_ROW_CLASS = "dx-footer-row";
const DATAGRID_CELL_DISABLED = "dx-cell-focus-disabled";
const DATAGRID_GROUP_FOOTER_ROW_TYPE = "groupFooter";
const DATAGRID_TOTAL_FOOTER_ROW_TYPE = "totalFooter";
export const renderSummaryCell = function(cell, options) {
    const $cell = $(cell);
    const {
        column: column
    } = options;
    const {
        summaryItems: summaryItems
    } = options;
    const $summaryItems = [];
    if (!column.command && summaryItems) {
        for (let i = 0; i < summaryItems.length; i++) {
            const summaryItem = summaryItems[i];
            const text = gridCore.getSummaryText(summaryItem, options.summaryTexts);
            $summaryItems.push($("<div>").css("textAlign", summaryItem.alignment || column.alignment).addClass("dx-datagrid-summary-item").addClass("dx-datagrid-text-content").addClass(summaryItem.cssClass).toggleClass("dx-datagrid-group-text-content", "group" === options.rowType).text(text).attr("aria-label", `${column.caption} ${text}`))
        }
        $cell.append($summaryItems)
    }
};
const getSummaryCellOptions = function(that, options) {
    const summaryTexts = that.option("summary.texts") || {};
    return {
        totalItem: options.row,
        summaryItems: options.row.summaryCells[options.columnIndex],
        summaryTexts: summaryTexts
    }
};
const getGroupAggregates = function(data) {
    return data.summary || data.aggregates || []
};
const recalculateWhileEditing = function(that) {
    return that.option("summary.recalculateWhileEditing")
};
const forEachGroup = function(groups, groupCount, callback, path) {
    path = path || [];
    for (let i = 0; i < groups.length; i++) {
        path.push(groups[i].key);
        if (1 === groupCount) {
            callback(path, groups[i].items)
        } else {
            forEachGroup(groups[i].items, groupCount - 1, callback, path)
        }
        path.pop()
    }
};
const applyAddedData = function(data, insertedData, groupLevel) {
    if (groupLevel) {
        return applyAddedData(data, insertedData.map((item => ({
            items: [item]
        })), groupLevel - 1))
    }
    return data.concat(insertedData)
};
const applyRemovedData = function(data, removedData, groupLevel) {
    if (groupLevel) {
        return data.map((data => {
            const updatedData = {};
            const updatedItems = applyRemovedData(data.items || [], removedData, groupLevel - 1);
            Object.defineProperty(updatedData, "aggregates", {
                get: () => data.aggregates,
                set: value => {
                    data.aggregates = value
                }
            });
            return extend(updatedData, data, {
                items: updatedItems
            })
        }))
    }
    return data.filter((data => removedData.indexOf(data) < 0))
};
const sortGroupsBySummaryCore = function(items, groups, sortByGroups) {
    if (!items || !groups.length) {
        return items
    }
    const group = groups[0];
    const sorts = sortByGroups[0];
    let query;
    if (group && sorts && sorts.length) {
        query = dataQuery(items);
        each(sorts, (function(index) {
            if (0 === index) {
                query = query.sortBy(this.selector, this.desc)
            } else {
                query = query.thenBy(this.selector, this.desc)
            }
        }));
        query.enumerate().done((sortedItems => {
            items = sortedItems
        }))
    }
    groups = groups.slice(1);
    sortByGroups = sortByGroups.slice(1);
    if (groups.length && sortByGroups.length) {
        each(items, (function() {
            this.items = sortGroupsBySummaryCore(this.items, groups, sortByGroups)
        }))
    }
    return items
};
const sortGroupsBySummary = function(data, group, summary) {
    const sortByGroups = summary && summary.sortByGroups && summary.sortByGroups();
    if (sortByGroups && sortByGroups.length) {
        return sortGroupsBySummaryCore(data, group, sortByGroups)
    }
    return data
};
const calculateAggregates = function(that, summary, data, groupLevel) {
    let calculator;
    if (recalculateWhileEditing(that)) {
        const editingController = that._editingController;
        if (editingController) {
            const insertedData = editingController.getInsertedData();
            if (insertedData.length) {
                data = applyAddedData(data, insertedData, groupLevel)
            }
            const removedData = editingController.getRemovedData();
            if (removedData.length) {
                data = applyRemovedData(data, removedData, groupLevel)
            }
        }
    }
    if (summary) {
        calculator = new AggregateCalculator({
            totalAggregates: summary.totalAggregates,
            groupAggregates: summary.groupAggregates,
            data: data,
            groupLevel: groupLevel
        });
        calculator.calculate()
    }
    return calculator ? calculator.totalAggregates() : []
};
export class FooterView extends ColumnsView {
    _getRows() {
        return this._dataController.footerItems()
    }
    _getCellOptions(options) {
        return extend(super._getCellOptions(options), getSummaryCellOptions(this, options))
    }
    _renderCellContent($cell, options) {
        renderSummaryCell($cell, options);
        super._renderCellContent.apply(this, arguments)
    }
    _renderCore(change) {
        let needUpdateScrollLeft = false;
        const totalItem = this._dataController.footerItems()[0];
        if (!change || !change.columnIndices) {
            this.element().empty().addClass("dx-datagrid-total-footer").toggleClass("dx-datagrid-nowrap", !this.option("wordWrapEnabled"));
            needUpdateScrollLeft = true
        }
        if (totalItem && totalItem.summaryCells && totalItem.summaryCells.length) {
            this._updateContent(this._renderTable({
                change: change
            }), change);
            needUpdateScrollLeft && this._updateScrollLeftPosition()
        }
    }
    _updateContent($newTable, change) {
        if (change && "update" === change.changeType && change.columnIndices) {
            return this.waitAsyncTemplates().done((() => {
                const $row = this.getTableElement().find(".dx-row");
                const $newRow = $newTable.find(".dx-row");
                this._updateCells($row, $newRow, change.columnIndices[0])
            }))
        }
        return super._updateContent.apply(this, arguments)
    }
    _rowClick(e) {
        const item = this._dataController.footerItems()[e.rowIndex] || {};
        this.executeAction("onRowClick", extend({}, e, item))
    }
    _columnOptionChanged(e) {
        const {
            optionNames: optionNames
        } = e;
        if (e.changeTypes.grouping) {
            return
        }
        if (optionNames.width || optionNames.visibleWidth) {
            super._columnOptionChanged(e)
        }
    }
    _handleDataChanged(e) {
        const {
            changeType: changeType
        } = e;
        if ("update" === e.changeType && e.repaintChangesOnly) {
            if (!e.totalColumnIndices) {
                this.render()
            } else if (e.totalColumnIndices.length) {
                this.render(null, {
                    changeType: "update",
                    columnIndices: [e.totalColumnIndices]
                })
            }
        } else if ("refresh" === changeType || "append" === changeType || "prepend" === changeType) {
            this.render()
        }
    }
    _createRow(row) {
        const $row = super._createRow.apply(this, arguments);
        if ("totalFooter" === row.rowType) {
            $row.addClass("dx-footer-row");
            $row.addClass(DATAGRID_CELL_DISABLED);
            $row.attr("tabindex", 0)
        }
        return $row
    }
    getHeight() {
        return this.getElementHeight()
    }
    isVisible() {
        return !!this._dataController.footerItems().length
    }
}
const dataSourceAdapterExtender = Base => class extends Base {
    init() {
        super.init.apply(this, arguments);
        this._editingController = this.getController("editing");
        this._totalAggregates = [];
        this._summaryGetter = noop
    }
    summaryGetter(summaryGetter) {
        if (!arguments.length) {
            return this._summaryGetter
        }
        if (isFunction(summaryGetter)) {
            this._summaryGetter = summaryGetter
        }
    }
    summary(summary) {
        if (!arguments.length) {
            return this._summaryGetter()
        }
        this._summaryGetter = function() {
            return summary
        }
    }
    totalAggregates() {
        return this._totalAggregates
    }
    isLastLevelGroupItemsPagingLocal() {
        const summary = this.summary();
        const sortByGroupsInfo = null === summary || void 0 === summary ? void 0 : summary.sortByGroups();
        return null === sortByGroupsInfo || void 0 === sortByGroupsInfo ? void 0 : sortByGroupsInfo.length
    }
    sortLastLevelGroupItems(items, groups, paths) {
        const groupedItems = storeHelper.multiLevelGroup(dataQuery(items), groups).toArray();
        let result = [];
        paths.forEach((path => {
            forEachGroup(groupedItems, groups.length, ((itemsPath, items) => {
                if (path.toString() === itemsPath.toString()) {
                    result = result.concat(items)
                }
            }))
        }));
        return result
    }
    _customizeRemoteOperations(options) {
        const summary = this.summary();
        if (summary) {
            if (options.remoteOperations.summary) {
                if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
                    if (options.storeLoadOptions.group) {
                        if (options.remoteOperations.grouping) {
                            options.storeLoadOptions.groupSummary = summary.groupAggregates
                        } else if (summary.groupAggregates.length) {
                            options.remoteOperations.paging = false
                        }
                    }
                    options.storeLoadOptions.totalSummary = summary.totalAggregates
                }
            } else if (summary.totalAggregates.length || summary.groupAggregates.length && options.storeLoadOptions.group) {
                options.remoteOperations.paging = false
            }
        }
        super._customizeRemoteOperations.apply(this, arguments);
        const cachedExtra = options.cachedData.extra;
        if (null !== cachedExtra && void 0 !== cachedExtra && cachedExtra.summary && !options.isCustomLoading) {
            options.storeLoadOptions.totalSummary = void 0
        }
    }
    _handleDataLoadedCore(options) {
        const groups = normalizeSortingInfo(options.storeLoadOptions.group || options.loadOptions.group || []);
        const remoteOperations = options.remoteOperations || {};
        const summary = this.summaryGetter()(remoteOperations);
        if (!options.isCustomLoading || options.storeLoadOptions.isLoadingAll) {
            if (remoteOperations.summary) {
                if (!remoteOperations.paging && groups.length && summary) {
                    if (!remoteOperations.grouping) {
                        calculateAggregates(this, {
                            groupAggregates: summary.groupAggregates
                        }, options.data, groups.length)
                    }
                    options.data = sortGroupsBySummary(options.data, groups, summary)
                }
            } else if (!remoteOperations.paging && summary) {
                var _options$cachedData;
                const operationTypes = options.operationTypes || {};
                const hasOperations = Object.keys(operationTypes).some((type => operationTypes[type]));
                if (!hasOperations || !(null !== (_options$cachedData = options.cachedData) && void 0 !== _options$cachedData && null !== (_options$cachedData = _options$cachedData.extra) && void 0 !== _options$cachedData && _options$cachedData.summary) || groups.length && summary.groupAggregates.length) {
                    const totalAggregates = calculateAggregates(this, summary, options.data, groups.length);
                    options.extra = isPlainObject(options.extra) ? options.extra : {};
                    options.extra.summary = totalAggregates;
                    if (options.cachedData) {
                        options.cachedData.extra = options.extra
                    }
                }
                options.data = sortGroupsBySummary(options.data, groups, summary)
            }
        }
        if (!options.isCustomLoading) {
            this._totalAggregates = options.extra && options.extra.summary || this._totalAggregates
        }
        super._handleDataLoadedCore(options)
    }
};
dataSourceAdapterProvider.extend(dataSourceAdapterExtender);
const data = Base => class extends Base {
    _isDataColumn(column) {
        return column && (!isDefined(column.groupIndex) || column.showWhenGrouped)
    }
    _isGroupFooterVisible() {
        const groupItems = this.option("summary.groupItems") || [];
        for (let i = 0; i < groupItems.length; i++) {
            const groupItem = groupItems[i];
            const column = this._columnsController.columnOption(groupItem.showInColumn || groupItem.column);
            if (groupItem.showInGroupFooter && this._isDataColumn(column)) {
                return true
            }
        }
        return false
    }
    _processGroupItems(items, groupCount, options) {
        const data = options && options.data;
        const result = super._processGroupItems.apply(this, arguments);
        if (options) {
            if (void 0 === options.isGroupFooterVisible) {
                options.isGroupFooterVisible = this._isGroupFooterVisible()
            }
            if (data && data.items && options.isGroupFooterVisible && (options.collectContinuationItems || !data.isContinuationOnNextPage)) {
                result.push({
                    rowType: "groupFooter",
                    key: options.path.slice(),
                    data: data,
                    groupIndex: options.path.length - 1,
                    values: []
                })
            }
        }
        return result
    }
    _processGroupItem(groupItem, options) {
        const that = this;
        if (!options.summaryGroupItems) {
            options.summaryGroupItems = that.option("summary.groupItems") || []
        }
        if ("group" === groupItem.rowType) {
            let groupColumnIndex = -1;
            let afterGroupColumnIndex = -1;
            each(options.visibleColumns, (function(visibleIndex) {
                const prevColumn = options.visibleColumns[visibleIndex - 1];
                if (groupItem.groupIndex === this.groupIndex) {
                    groupColumnIndex = this.index
                }
                if (visibleIndex > 0 && "expand" === prevColumn.command && "expand" !== this.command) {
                    afterGroupColumnIndex = this.index
                }
            }));
            groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, ((summaryItem, column) => {
                if (summaryItem.showInGroupFooter) {
                    return -1
                }
                if (summaryItem.alignByColumn && column && !isDefined(column.groupIndex) && column.index !== afterGroupColumnIndex) {
                    return column.index
                }
                return groupColumnIndex
            }), true)
        }
        if ("groupFooter" === groupItem.rowType) {
            groupItem.summaryCells = this._calculateSummaryCells(options.summaryGroupItems, getGroupAggregates(groupItem.data), options.visibleColumns, ((summaryItem, column) => summaryItem.showInGroupFooter && that._isDataColumn(column) ? column.index : -1))
        }
        return groupItem
    }
    _calculateSummaryCells(summaryItems, aggregates, visibleColumns, calculateTargetColumnIndex, isGroupRow) {
        const that = this;
        const summaryCells = [];
        const summaryCellsByColumns = {};
        each(summaryItems, ((summaryIndex, summaryItem) => {
            const column = that._columnsController.columnOption(summaryItem.column);
            const showInColumn = summaryItem.showInColumn && that._columnsController.columnOption(summaryItem.showInColumn) || column;
            const columnIndex = calculateTargetColumnIndex(summaryItem, showInColumn);
            if (columnIndex >= 0) {
                if (!summaryCellsByColumns[columnIndex]) {
                    summaryCellsByColumns[columnIndex] = []
                }
                const aggregate = aggregates[summaryIndex];
                if (aggregate === aggregate) {
                    let valueFormat;
                    if (isDefined(summaryItem.valueFormat)) {
                        valueFormat = summaryItem.valueFormat
                    } else if ("count" !== summaryItem.summaryType) {
                        valueFormat = gridCore.getFormatByDataType(column && column.dataType)
                    }
                    summaryCellsByColumns[columnIndex].push(extend({}, summaryItem, {
                        value: isString(aggregate) && column && column.deserializeValue ? column.deserializeValue(aggregate) : aggregate,
                        valueFormat: valueFormat,
                        columnCaption: column && column.index !== columnIndex ? column.caption : void 0
                    }))
                }
            }
        }));
        if (!isEmptyObject(summaryCellsByColumns)) {
            visibleColumns.forEach(((column, visibleIndex) => {
                const prevColumn = visibleColumns[visibleIndex - 1];
                const columnIndex = isGroupRow && ("expand" === (null === prevColumn || void 0 === prevColumn ? void 0 : prevColumn.command) || "expand" === column.command) ? null === prevColumn || void 0 === prevColumn ? void 0 : prevColumn.index : column.index;
                summaryCells.push(summaryCellsByColumns[columnIndex] || [])
            }))
        }
        return summaryCells
    }
    _getSummaryCells(summaryTotalItems, totalAggregates) {
        const that = this;
        const columnsController = that._columnsController;
        return that._calculateSummaryCells(summaryTotalItems, totalAggregates, columnsController.getVisibleColumns(), ((summaryItem, column) => that._isDataColumn(column) ? column.index : -1))
    }
    _updateItemsCore(change) {
        const that = this;
        let summaryCells;
        const dataSource = that._dataSource;
        const footerItems = that._footerItems;
        const oldSummaryCells = footerItems && footerItems[0] && footerItems[0].summaryCells;
        const summaryTotalItems = that.option("summary.totalItems");
        that._footerItems = [];
        if (dataSource && summaryTotalItems && summaryTotalItems.length) {
            const totalAggregates = dataSource.totalAggregates();
            summaryCells = that._getSummaryCells(summaryTotalItems, totalAggregates);
            if (change && change.repaintChangesOnly && oldSummaryCells) {
                change.totalColumnIndices = summaryCells.map(((summaryCell, index) => {
                    if (JSON.stringify(summaryCell) !== JSON.stringify(oldSummaryCells[index])) {
                        return index
                    }
                    return -1
                })).filter((index => index >= 0))
            }
            if (summaryCells.length) {
                that._footerItems.push({
                    rowType: "totalFooter",
                    summaryCells: summaryCells
                })
            }
        }
        super._updateItemsCore(change)
    }
    _prepareUnsavedDataSelector(selector) {
        if (recalculateWhileEditing(this)) {
            const editingController = this._editingController;
            if (editingController) {
                return function(data) {
                    data = editingController.getUpdatedData(data);
                    return selector(data)
                }
            }
        }
        return selector
    }
    _prepareAggregateSelector(selector, aggregator) {
        selector = this._prepareUnsavedDataSelector(selector);
        if ("avg" === aggregator || "sum" === aggregator) {
            return function(data) {
                const value = selector(data);
                return isDefined(value) ? Number(value) : value
            }
        }
        return selector
    }
    _getAggregates(summaryItems, remoteOperations) {
        const that = this;
        let calculateCustomSummary = that.option("summary.calculateCustomSummary");
        const commonSkipEmptyValues = that.option("summary.skipEmptyValues");
        return map(summaryItems || [], (summaryItem => {
            const column = this._columnsController.columnOption(summaryItem.column);
            const calculateCellValue = column && column.calculateCellValue ? column.calculateCellValue.bind(column) : compileGetter(column ? column.dataField : summaryItem.column);
            let aggregator = summaryItem.summaryType || "count";
            const skipEmptyValues = isDefined(summaryItem.skipEmptyValues) ? summaryItem.skipEmptyValues : commonSkipEmptyValues;
            if (remoteOperations) {
                return {
                    selector: summaryItem.column,
                    summaryType: aggregator
                }
            }
            const selector = that._prepareAggregateSelector(calculateCellValue, aggregator);
            if ("custom" === aggregator) {
                if (!calculateCustomSummary) {
                    errors.log("E1026");
                    calculateCustomSummary = function() {}
                }
                const options = {
                    component: that.component,
                    name: summaryItem.name
                };
                calculateCustomSummary(options);
                options.summaryProcess = "calculate";
                aggregator = {
                    seed(groupIndex) {
                        options.summaryProcess = "start";
                        options.totalValue = void 0;
                        options.groupIndex = groupIndex;
                        delete options.value;
                        calculateCustomSummary(options);
                        return options.totalValue
                    },
                    step(totalValue, value) {
                        options.summaryProcess = "calculate";
                        options.totalValue = totalValue;
                        options.value = value;
                        calculateCustomSummary(options);
                        return options.totalValue
                    },
                    finalize(totalValue) {
                        options.summaryProcess = "finalize";
                        options.totalValue = totalValue;
                        delete options.value;
                        calculateCustomSummary(options);
                        return options.totalValue
                    }
                }
            }
            return {
                selector: selector,
                aggregator: aggregator,
                skipEmptyValues: skipEmptyValues
            }
        }))
    }
    _addSortInfo(sortByGroups, groupColumn, selector, sortOrder) {
        if (groupColumn) {
            const {
                groupIndex: groupIndex
            } = groupColumn;
            sortOrder = sortOrder || groupColumn.sortOrder;
            if (isDefined(groupIndex)) {
                sortByGroups[groupIndex] = sortByGroups[groupIndex] || [];
                sortByGroups[groupIndex].push({
                    selector: selector,
                    desc: "desc" === sortOrder
                })
            }
        }
    }
    _findSummaryItem(summaryItems, name) {
        let summaryItemIndex = -1;
        if (isDefined(name)) {
            each(summaryItems || [], (function(index) {
                if (this.name === name || index === name || this.summaryType === name || this.column === name || function(summaryItem) {
                        const {
                            summaryType: summaryType
                        } = summaryItem;
                        const {
                            column: column
                        } = summaryItem;
                        return summaryType && column && `${summaryType}_${column}`
                    }(this) === name) {
                    summaryItemIndex = index;
                    return false
                }
            }))
        }
        return summaryItemIndex
    }
    _getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems) {
        const that = this;
        const columnsController = that._columnsController;
        const groupColumns = columnsController.getGroupColumns();
        const sortByGroups = [];
        if (!groupSummaryItems || !groupSummaryItems.length) {
            return
        }
        each(sortByGroupSummaryInfo || [], (function() {
            const {
                sortOrder: sortOrder
            } = this;
            let {
                groupColumn: groupColumn
            } = this;
            const summaryItemIndex = that._findSummaryItem(groupSummaryItems, this.summaryItem);
            if (summaryItemIndex < 0) {
                return
            }
            const selector = function(data) {
                return getGroupAggregates(data)[summaryItemIndex]
            };
            if (isDefined(groupColumn)) {
                groupColumn = columnsController.columnOption(groupColumn);
                that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder)
            } else {
                each(groupColumns, ((groupIndex, groupColumn) => {
                    that._addSortInfo(sortByGroups, groupColumn, selector, sortOrder)
                }))
            }
        }));
        return sortByGroups
    }
    _createDataSourceAdapterCore(dataSource, remoteOperations) {
        const that = this;
        const dataSourceAdapter = super._createDataSourceAdapterCore(dataSource, remoteOperations);
        dataSourceAdapter.summaryGetter((currentRemoteOperations => that._getSummaryOptions(currentRemoteOperations || remoteOperations)));
        return dataSourceAdapter
    }
    _getSummaryOptions(remoteOperations) {
        const that = this;
        const groupSummaryItems = that.option("summary.groupItems");
        const totalSummaryItems = that.option("summary.totalItems");
        const sortByGroupSummaryInfo = that.option("sortByGroupSummaryInfo");
        const groupAggregates = that._getAggregates(groupSummaryItems, remoteOperations && remoteOperations.grouping && remoteOperations.summary);
        const totalAggregates = that._getAggregates(totalSummaryItems, remoteOperations && remoteOperations.summary);
        const sortByGroups = function() {
            return that._getSummarySortByGroups(sortByGroupSummaryInfo, groupSummaryItems)
        };
        if (groupAggregates.length || totalAggregates.length) {
            return {
                groupAggregates: groupAggregates,
                totalAggregates: totalAggregates,
                sortByGroups: sortByGroups
            }
        }
        return
    }
    publicMethods() {
        const methods = super.publicMethods();
        methods.push("getTotalSummaryValue");
        return methods
    }
    getTotalSummaryValue(summaryItemName) {
        const summaryItemIndex = this._findSummaryItem(this.option("summary.totalItems"), summaryItemName);
        const aggregates = this._dataSource.totalAggregates();
        if (aggregates.length && summaryItemIndex > -1) {
            return aggregates[summaryItemIndex]
        }
    }
    optionChanged(args) {
        if ("summary" === args.name || "sortByGroupSummaryInfo" === args.name) {
            args.name = "dataSource"
        }
        super.optionChanged(args)
    }
    init() {
        this._footerItems = [];
        super.init()
    }
    footerItems() {
        return this._footerItems
    }
};
const editing = Base => class extends Base {
    _refreshSummary() {
        if (recalculateWhileEditing(this) && !this.isSaving()) {
            this._dataController.refresh({
                load: true,
                changesOnly: true
            })
        }
    }
    _addChange(params) {
        const result = super._addChange.apply(this, arguments);
        if (params.type) {
            this._refreshSummary()
        }
        return result
    }
    _removeChange() {
        const result = super._removeChange.apply(this, arguments);
        this._refreshSummary();
        return result
    }
    cancelEditData() {
        const result = super.cancelEditData.apply(this, arguments);
        this._refreshSummary();
        return result
    }
};
const rowsView = Base => class extends Base {
    _createRow(row) {
        const $row = super._createRow.apply(this, arguments);
        row && $row.addClass("groupFooter" === row.rowType ? "dx-datagrid-group-footer" : "");
        return $row
    }
    _renderCells($row, options) {
        super._renderCells.apply(this, arguments);
        if ("group" === options.row.rowType && options.row.summaryCells && options.row.summaryCells.length) {
            this._renderGroupSummaryCells($row, options)
        }
    }
    _hasAlignByColumnSummaryItems(columnIndex, options) {
        return !isDefined(options.columns[columnIndex].groupIndex) && options.row.summaryCells[columnIndex].length
    }
    _getAlignByColumnCellCount(groupCellColSpan, options) {
        let alignByColumnCellCount = 0;
        for (let i = 1; i < groupCellColSpan; i++) {
            const columnIndex = options.row.summaryCells.length - i;
            alignByColumnCellCount = this._hasAlignByColumnSummaryItems(columnIndex, options) ? i : alignByColumnCellCount
        }
        return alignByColumnCellCount
    }
    _renderGroupSummaryCells($row, options) {
        const $groupCell = $row.children().last();
        const groupCellColSpan = Number($groupCell.attr("colSpan")) || 1;
        const alignByColumnCellCount = this._getAlignByColumnCellCount(groupCellColSpan, options);
        this._renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount)
    }
    _renderGroupSummaryCellsCore($groupCell, options, groupCellColSpan, alignByColumnCellCount) {
        if (alignByColumnCellCount > 0) {
            $groupCell.attr("colSpan", groupCellColSpan - alignByColumnCellCount);
            for (let i = 0; i < alignByColumnCellCount; i++) {
                const columnIndex = options.columns.length - alignByColumnCellCount + i;
                this._renderCell($groupCell.parent(), extend({
                    column: options.columns[columnIndex],
                    columnIndex: this._getSummaryCellIndex(columnIndex, options.columns)
                }, options))
            }
        }
    }
    _getSummaryCellIndex(columnIndex, columns) {
        return columnIndex
    }
    _getCellTemplate(options) {
        if (!options.column.command && !isDefined(options.column.groupIndex) && options.summaryItems && options.summaryItems.length) {
            return renderSummaryCell
        }
        return super._getCellTemplate(options)
    }
    _getCellOptions(options) {
        const that = this;
        const parameters = super._getCellOptions(options);
        if (options.row.summaryCells) {
            return extend(parameters, getSummaryCellOptions(that, options))
        }
        return parameters
    }
};
gridCore.registerModule("summary", {
    defaultOptions: () => ({
        summary: {
            groupItems: void 0,
            totalItems: void 0,
            calculateCustomSummary: void 0,
            skipEmptyValues: true,
            recalculateWhileEditing: false,
            texts: {
                sum: messageLocalization.format("dxDataGrid-summarySum"),
                sumOtherColumn: messageLocalization.format("dxDataGrid-summarySumOtherColumn"),
                min: messageLocalization.format("dxDataGrid-summaryMin"),
                minOtherColumn: messageLocalization.format("dxDataGrid-summaryMinOtherColumn"),
                max: messageLocalization.format("dxDataGrid-summaryMax"),
                maxOtherColumn: messageLocalization.format("dxDataGrid-summaryMaxOtherColumn"),
                avg: messageLocalization.format("dxDataGrid-summaryAvg"),
                avgOtherColumn: messageLocalization.format("dxDataGrid-summaryAvgOtherColumn"),
                count: messageLocalization.format("dxDataGrid-summaryCount")
            }
        },
        sortByGroupSummaryInfo: void 0
    }),
    views: {
        footerView: FooterView
    },
    extenders: {
        controllers: {
            data: data,
            editing: editing
        },
        views: {
            rowsView: rowsView
        }
    }
});
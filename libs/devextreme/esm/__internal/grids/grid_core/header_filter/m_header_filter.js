/**
 * DevExtreme (esm/__internal/grids/grid_core/header_filter/m_header_filter.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    compileGetter
} from "../../../../core/utils/data";
import {
    Deferred
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
    isFunction,
    isObject
} from "../../../../core/utils/type";
import {
    normalizeDataSourceOptions
} from "../../../../data/data_source/utils";
import dataQuery from "../../../../data/query";
import storeHelper from "../../../../data/store_helper";
import {
    name as clickEventName
} from "../../../../events/click";
import eventsEngine from "../../../../events/core/events_engine";
import dateLocalization from "../../../../localization/date";
import messageLocalization from "../../../../localization/message";
import {
    restoreFocus,
    saveFocusedElementInfo
} from "../../../../ui/shared/accessibility";
import filterUtils from "../../../../ui/shared/filtering";
import Modules from "../../../grids/grid_core/m_modules";
import gridCoreUtils from "../m_utils";
import {
    allowHeaderFiltering,
    headerFilterMixin,
    HeaderFilterView,
    updateHeaderFilterItemSelectionState
} from "./m_header_filter_core";
const DATE_INTERVAL_FORMATS = {
    month: value => dateLocalization.getMonthNames()[value - 1],
    quarter: value => dateLocalization.format(new Date(2e3, 3 * value - 1), "quarter")
};

function ungroupUTCDates(items, dateParts, dates) {
    dateParts = dateParts || [];
    dates = dates || [];
    items.forEach((item => {
        if (isDefined(item.key)) {
            const isMonthPart = 1 === dateParts.length;
            dateParts.push(isMonthPart ? item.key - 1 : item.key);
            if (item.items) {
                ungroupUTCDates(item.items, dateParts, dates)
            } else {
                const date = new Date(Date.UTC.apply(Date, dateParts));
                dates.push(date)
            }
            dateParts.pop()
        } else {
            dates.push(null)
        }
    }));
    return dates
}

function convertDataFromUTCToLocal(data, column) {
    const dates = ungroupUTCDates(data);
    const query = dataQuery(dates);
    const group = gridCoreUtils.getHeaderFilterGroupParameters(_extends({}, column, {
        calculateCellValue: date => date
    }));
    return storeHelper.queryByOptions(query, {
        group: group
    }).toArray()
}

function isUTCFormat(format) {
    return "Z" === (null === format || void 0 === format ? void 0 : format.slice(-1)) || "'Z'" === (null === format || void 0 === format ? void 0 : format.slice(-3))
}
const getFormatOptions = function(value, column, currentLevel) {
    const groupInterval = filterUtils.getGroupInterval(column);
    const result = gridCoreUtils.getFormatOptionsByColumn(column, "headerFilter");
    if (groupInterval) {
        result.groupInterval = groupInterval[currentLevel];
        if (gridCoreUtils.isDateType(column.dataType)) {
            result.format = DATE_INTERVAL_FORMATS[groupInterval[currentLevel]]
        } else if ("number" === column.dataType) {
            result.getDisplayFormat = function() {
                const formatOptions = {
                    format: column.format,
                    target: "headerFilter"
                };
                const firstValueText = gridCoreUtils.formatValue(value, formatOptions);
                const secondValue = value + groupInterval[currentLevel];
                const secondValueText = gridCoreUtils.formatValue(secondValue, formatOptions);
                return firstValueText && secondValueText ? `${firstValueText} - ${secondValueText}` : ""
            }
        }
    }
    return result
};
export class HeaderFilterController extends Modules.ViewController {
    init() {
        this._columnsController = this.getController("columns");
        this._dataController = this.getController("data");
        this._headerFilterView = this.getView("headerFilterView")
    }
    _updateSelectedState(items, column) {
        let i = items.length;
        const isExclude = "exclude" === column.filterType;
        while (i--) {
            const item = items[i];
            if ("items" in items[i]) {
                this._updateSelectedState(items[i].items, column)
            }
            updateHeaderFilterItemSelectionState(item, gridCoreUtils.getIndexByKey(items[i].value, column.filterValues, null) > -1, isExclude)
        }
    }
    _normalizeGroupItem(item, currentLevel, options) {
        let value;
        let displayValue;
        const {
            path: path
        } = options;
        const {
            valueSelector: valueSelector
        } = options;
        const {
            displaySelector: displaySelector
        } = options;
        const {
            column: column
        } = options;
        if (valueSelector && displaySelector) {
            value = valueSelector(item);
            displayValue = displaySelector(item)
        } else {
            value = item.key;
            displayValue = value
        }
        if (!isObject(item)) {
            item = {}
        } else {
            item = extend({}, item)
        }
        path.push(value);
        if (1 === path.length) {
            item.value = path[0]
        } else {
            item.value = path.join("/")
        }
        item.text = this.getHeaderItemText(displayValue, column, currentLevel, options.headerFilterOptions);
        return item
    }
    getHeaderItemText(displayValue, column, currentLevel, headerFilterOptions) {
        let text = gridCoreUtils.formatValue(displayValue, getFormatOptions(displayValue, column, currentLevel));
        if (!text) {
            text = headerFilterOptions.texts.emptyValue
        }
        return text
    }
    _processGroupItems(groupItems, currentLevel, path, options) {
        const that = this;
        let displaySelector;
        let valueSelector;
        const {
            column: column
        } = options;
        const {
            lookup: lookup
        } = column;
        const {
            level: level
        } = options;
        path = path || [];
        currentLevel = currentLevel || 0;
        if (lookup) {
            displaySelector = compileGetter(lookup.displayExpr);
            valueSelector = compileGetter(lookup.valueExpr)
        }
        for (let i = 0; i < groupItems.length; i++) {
            groupItems[i] = that._normalizeGroupItem(groupItems[i], currentLevel, {
                column: options.column,
                headerFilterOptions: options.headerFilterOptions,
                displaySelector: displaySelector,
                valueSelector: valueSelector,
                path: path
            });
            if ("items" in groupItems[i]) {
                if (currentLevel === level || !isDefined(groupItems[i].value)) {
                    delete groupItems[i].items
                } else {
                    that._processGroupItems(groupItems[i].items, currentLevel + 1, path, options)
                }
            }
            path.pop()
        }
    }
    getDataSource(column) {
        var _column$headerFilter;
        const dataSource = this._dataController.dataSource();
        const remoteGrouping = null === dataSource || void 0 === dataSource ? void 0 : dataSource.remoteOperations().grouping;
        const group = gridCoreUtils.getHeaderFilterGroupParameters(column, remoteGrouping);
        const headerFilterDataSource = null === (_column$headerFilter = column.headerFilter) || void 0 === _column$headerFilter ? void 0 : _column$headerFilter.dataSource;
        const headerFilterOptions = this.option("headerFilter");
        let isLookup = false;
        const options = {
            component: this.component
        };
        if (!dataSource) {
            return
        }
        if (isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
            options.dataSource = normalizeDataSourceOptions(headerFilterDataSource)
        } else if (column.lookup) {
            isLookup = true;
            if (this.option("syncLookupFilterValues")) {
                this._currentColumn = column;
                const filter = this._dataController.getCombinedFilter();
                this._currentColumn = null;
                options.dataSource = gridCoreUtils.getWrappedLookupDataSource(column, dataSource, filter)
            } else {
                options.dataSource = gridCoreUtils.normalizeLookupDataSource(column.lookup)
            }
        } else {
            const cutoffLevel = Array.isArray(group) ? group.length - 1 : 0;
            this._currentColumn = column;
            const filter = this._dataController.getCombinedFilter();
            this._currentColumn = null;
            options.dataSource = {
                filter: filter,
                group: group,
                useDefaultSearch: true,
                load: options => {
                    const d = new Deferred;
                    options.dataField = column.dataField || column.name;
                    dataSource.load(options).done((data => {
                        const convertUTCDates = remoteGrouping && isUTCFormat(column.serializationFormat) && cutoffLevel > 3;
                        if (convertUTCDates) {
                            data = convertDataFromUTCToLocal(data, column)
                        }
                        that._processGroupItems(data, null, null, {
                            level: cutoffLevel,
                            column: column,
                            headerFilterOptions: headerFilterOptions
                        });
                        d.resolve(data)
                    })).fail(d.reject);
                    return d
                }
            }
        }
        if (isFunction(headerFilterDataSource)) {
            headerFilterDataSource.call(column, options)
        }
        const origPostProcess = options.dataSource.postProcess;
        const that = this;
        options.dataSource.postProcess = function(data) {
            let items = data;
            if (isLookup) {
                items = items.filter((item => null !== item[column.lookup.valueExpr]));
                if (0 === this.pageIndex() && !this.searchValue()) {
                    items = items.slice(0);
                    items.unshift(null)
                }
                that._processGroupItems(items, null, null, {
                    level: 0,
                    column: column,
                    headerFilterOptions: headerFilterOptions
                })
            }
            items = origPostProcess && origPostProcess.call(this, items) || items;
            that._updateSelectedState(items, column);
            return items
        };
        return options.dataSource
    }
    getCurrentColumn() {
        return this._currentColumn
    }
    showHeaderFilterMenu(columnIndex, isGroupPanel) {
        const columnsController = this._columnsController;
        const column = extend(true, {}, this._columnsController.getColumns()[columnIndex]);
        if (column) {
            const visibleIndex = columnsController.getVisibleIndex(columnIndex);
            const view = isGroupPanel ? this.getView("headerPanel") : this.getView("columnHeadersView");
            const $columnElement = view.getColumnElements().eq(isGroupPanel ? column.groupIndex : visibleIndex);
            this.showHeaderFilterMenuBase({
                columnElement: $columnElement,
                column: column,
                applyFilter: true,
                apply() {
                    columnsController.columnOption(columnIndex, {
                        filterValues: this.filterValues,
                        filterType: this.filterType
                    })
                }
            })
        }
    }
    showHeaderFilterMenuBase(options) {
        const that = this;
        const {
            column: column
        } = options;
        if (column) {
            const groupInterval = filterUtils.getGroupInterval(column);
            const dataSource = that._dataController.dataSource();
            const remoteFiltering = dataSource && dataSource.remoteOperations().filtering;
            const previousOnHidden = options.onHidden;
            extend(options, column, {
                type: groupInterval && groupInterval.length > 1 ? "tree" : "list",
                remoteFiltering: remoteFiltering,
                onShowing: e => {
                    const dxResizableInstance = e.component.$overlayContent().dxResizable("instance");
                    dxResizableInstance && dxResizableInstance.option("onResizeEnd", (e => {
                        let headerFilterByColumn = this._columnsController.columnOption(options.dataField, "headerFilter");
                        headerFilterByColumn = headerFilterByColumn || {};
                        headerFilterByColumn.width = e.width;
                        headerFilterByColumn.height = e.height;
                        this._columnsController.columnOption(options.dataField, "headerFilter", headerFilterByColumn, true)
                    }))
                },
                onHidden: () => {
                    null === previousOnHidden || void 0 === previousOnHidden || previousOnHidden();
                    restoreFocus(this)
                }
            });
            options.dataSource = that.getDataSource(options);
            if (options.isFilterBuilder) {
                options.dataSource.filter = null;
                options.alignment = "right"
            }
            that._headerFilterView.showHeaderFilterMenu(options.columnElement, options)
        }
    }
    hideHeaderFilterMenu() {
        this._headerFilterView.hideHeaderFilterMenu()
    }
}
const columnHeadersView = Base => class extends(headerFilterMixin(Base)) {
    _renderCellContent($cell, options) {
        const that = this;
        let $headerFilterIndicator;
        const {
            column: column
        } = options;
        if (!column.command && allowHeaderFiltering(column) && that.option("headerFilter.visible") && "header" === options.rowType) {
            $headerFilterIndicator = that._applyColumnState({
                name: "headerFilter",
                rootElement: $cell,
                column: column,
                showColumnLines: that.option("showColumnLines")
            });
            $headerFilterIndicator && that._subscribeToIndicatorEvent($headerFilterIndicator, column, "headerFilter")
        }
        super._renderCellContent.apply(this, arguments)
    }
    _subscribeToIndicatorEvent($indicator, column, indicatorName) {
        if ("headerFilter" === indicatorName) {
            eventsEngine.on($indicator, clickEventName, this.createAction((e => {
                e.event.stopPropagation();
                saveFocusedElementInfo($indicator, this);
                this._headerFilterController.showHeaderFilterMenu(column.index, false)
            })))
        }
    }
    _updateIndicator($cell, column, indicatorName) {
        const $indicator = super._updateIndicator($cell, column, indicatorName);
        $indicator && this._subscribeToIndicatorEvent($indicator, column, indicatorName)
    }
    _updateHeaderFilterIndicators() {
        if (this.option("headerFilter.visible")) {
            this._updateIndicators("headerFilter")
        }
    }
    _needUpdateFilterIndicators() {
        return true
    }
    _columnOptionChanged(e) {
        const {
            optionNames: optionNames
        } = e;
        const isFilterRowAndHeaderFilterValuesChanged = gridCoreUtils.checkChanges(optionNames, ["filterValues", "filterValue"]);
        const isHeaderFilterValuesAndTypeChanged = gridCoreUtils.checkChanges(optionNames, ["filterValues", "filterType"]);
        const shouldUpdateFilterIndicators = (isFilterRowAndHeaderFilterValuesChanged || isHeaderFilterValuesAndTypeChanged) && this._needUpdateFilterIndicators();
        if (shouldUpdateFilterIndicators) {
            this._updateHeaderFilterIndicators()
        }
        if (!isHeaderFilterValuesAndTypeChanged) {
            super._columnOptionChanged(e)
        }
    }
};
const headerPanel = Base => class extends(headerFilterMixin(Base)) {
    _createGroupPanelItem($rootElement, groupColumn) {
        const that = this;
        const $item = super._createGroupPanelItem.apply(that, arguments);
        let $headerFilterIndicator;
        if (!groupColumn.command && allowHeaderFiltering(groupColumn) && that.option("headerFilter.visible")) {
            $headerFilterIndicator = that._applyColumnState({
                name: "headerFilter",
                rootElement: $item,
                column: {
                    alignment: getDefaultAlignment(that.option("rtlEnabled")),
                    filterValues: groupColumn.filterValues,
                    allowHeaderFiltering: true,
                    caption: groupColumn.caption
                },
                showColumnLines: true
            });
            $headerFilterIndicator && eventsEngine.on($headerFilterIndicator, clickEventName, that.createAction((e => {
                const {
                    event: event
                } = e;
                event.stopPropagation();
                this._headerFilterController.showHeaderFilterMenu(groupColumn.index, true)
            })))
        }
        return $item
    }
};
export function invertFilterExpression(filter) {
    return ["!", filter]
}
const data = Base => class extends Base {
    skipCalculateColumnFilters() {
        return false
    }
    _calculateAdditionalFilter() {
        if (this.skipCalculateColumnFilters()) {
            return super._calculateAdditionalFilter()
        }
        const filters = [super._calculateAdditionalFilter()];
        const columns = this._columnsController.getVisibleColumns(null, true);
        const headerFilterController = this._headerFilterController;
        const currentColumn = headerFilterController.getCurrentColumn();
        each(columns, ((_, column) => {
            let filter;
            if (currentColumn && currentColumn.index === column.index) {
                return
            }
            if (allowHeaderFiltering(column) && column.calculateFilterExpression && Array.isArray(column.filterValues) && column.filterValues.length) {
                let filterValues = [];
                each(column.filterValues, ((_, filterValue) => {
                    if (Array.isArray(filterValue)) {
                        filter = filterValue
                    } else {
                        if (column.deserializeValue && !gridCoreUtils.isDateType(column.dataType) && "number" !== column.dataType) {
                            filterValue = column.deserializeValue(filterValue)
                        }
                        filter = column.createFilterExpression(filterValue, "=", "headerFilter")
                    }
                    if (filter) {
                        filter.columnIndex = column.index
                    }
                    filterValues.push(filter)
                }));
                filterValues = gridCoreUtils.combineFilters(filterValues, "or");
                filters.push("exclude" === column.filterType ? ["!", filterValues] : filterValues)
            }
        }));
        return gridCoreUtils.combineFilters(filters)
    }
};
export const headerFilterModule = {
    defaultOptions: () => ({
        syncLookupFilterValues: true,
        headerFilter: {
            visible: false,
            width: 252,
            height: 325,
            allowSelectAll: true,
            search: {
                enabled: false,
                timeout: 500,
                mode: "contains",
                editorOptions: {}
            },
            texts: {
                emptyValue: messageLocalization.format("dxDataGrid-headerFilterEmptyValue"),
                ok: messageLocalization.format("dxDataGrid-headerFilterOK"),
                cancel: messageLocalization.format("dxDataGrid-headerFilterCancel")
            }
        }
    }),
    controllers: {
        headerFilter: HeaderFilterController
    },
    views: {
        headerFilterView: HeaderFilterView
    },
    extenders: {
        controllers: {
            data: data
        },
        views: {
            columnHeadersView: columnHeadersView,
            headerPanel: headerPanel
        }
    }
};

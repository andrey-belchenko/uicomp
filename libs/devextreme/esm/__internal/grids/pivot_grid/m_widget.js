/**
 * DevExtreme (esm/__internal/grids/pivot_grid/m_widget.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import {
    getPublicElement
} from "../../../core/element";
import $ from "../../../core/renderer";
import {
    deferRender,
    deferUpdate,
    noop
} from "../../../core/utils/common";
import {
    Deferred,
    when
} from "../../../core/utils/deferred";
import {
    extend
} from "../../../core/utils/extend";
import {
    each
} from "../../../core/utils/iterator";
import {
    getHeight,
    getOuterHeight,
    getWidth,
    setHeight
} from "../../../core/utils/size";
import {
    format as formatString
} from "../../../core/utils/string";
import {
    isDefined
} from "../../../core/utils/type";
import {
    getWindow,
    hasWindow
} from "../../../core/utils/window";
import {
    name as clickEventName
} from "../../../events/click";
import eventsEngine from "../../../events/core/events_engine";
import {
    addNamespace
} from "../../../events/utils/index";
import localizationMessage from "../../../localization/message";
import Button from "../../../ui/button";
import ContextMenu from "../../../ui/context_menu";
import Popup from "../../../ui/popup/ui.popup";
import {
    current,
    isFluent
} from "../../../ui/themes";
import Widget from "../../../ui/widget/ui.widget";
import gridCoreUtils from "../../grids/grid_core/m_utils";
import {
    ChartIntegrationMixin
} from "./chart_integration/m_chart_integration";
import DataAreaImport from "./data_area/m_data_area";
import DataControllerImport from "./data_controller/m_data_controller";
import {
    ExportController
} from "./export/m_export";
import {
    FieldChooser
} from "./field_chooser/m_field_chooser";
import {
    FieldChooserBase
} from "./field_chooser/m_field_chooser_base";
import {
    FieldsArea
} from "./fields_area/m_fields_area";
import HeadersArea from "./headers_area/m_headers_area";
import {
    findField,
    mergeArraysByMaxValue,
    setFieldProperty
} from "./m_widget_utils";
const window = getWindow();
const DATA_AREA_CELL_CLASS = "dx-area-data-cell";
const ROW_AREA_CELL_CLASS = "dx-area-row-cell";
const COLUMN_AREA_CELL_CLASS = "dx-area-column-cell";
const DESCRIPTION_AREA_CELL_CLASS = "dx-area-description-cell";
const BORDERS_CLASS = "dx-pivotgrid-border";
const PIVOTGRID_CLASS = "dx-pivotgrid";
const ROW_LINES_CLASS = "dx-row-lines";
const BOTTOM_ROW_CLASS = "dx-bottom-row";
const BOTTOM_BORDER_CLASS = "dx-bottom-border";
const FIELDS_CONTAINER_CLASS = "dx-pivotgrid-fields-container";
const FIELDS_CLASS = "dx-area-fields";
const FIELD_CHOOSER_POPUP_CLASS = "dx-fieldchooser-popup";
const INCOMPRESSIBLE_FIELDS_CLASS = "dx-incompressible-fields";
const OVERFLOW_HIDDEN_CLASS = "dx-overflow-hidden";
const TR = "<tr>";
const TD = "<td>";
const DIV = "<div>";
const TEST_HEIGHT = 66666;
const FIELD_CALCULATED_OPTIONS = ["allowSorting", "allowSortingBySummary", "allowFiltering", "allowExpandAll"];

function getArraySum(array) {
    let sum = 0;
    each(array, ((_, value) => {
        sum += value || 0
    }));
    return sum
}

function adjustSizeArray(sizeArray, space) {
    const delta = space / sizeArray.length;
    for (let i = 0; i < sizeArray.length; i += 1) {
        sizeArray[i] -= delta
    }
}

function unsubscribeScrollEvents(area) {
    area.off("scroll").off("stop")
}

function subscribeToScrollEvent(area, handler) {
    unsubscribeScrollEvents(area);
    area.on("scroll", handler).on("stop", handler)
}

function getCommonBorderWidth(elements, direction) {
    const borderStyleNames = "width" === direction ? ["borderLeftWidth", "borderRightWidth"] : ["borderTopWidth", "borderBottomWidth"];
    let width = 0;
    each(elements, ((_, elem) => {
        const computedStyle = window.getComputedStyle(elem.get(0));
        borderStyleNames.forEach((borderStyleName => {
            width += parseFloat(computedStyle[borderStyleName]) || 0
        }))
    }));
    return width
}

function clickedOnFieldsArea($targetElement) {
    return $targetElement.closest(`.${FIELDS_CLASS}`).length || $targetElement.find(`.${FIELDS_CLASS}`).length
}
const PivotGrid = Widget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            scrolling: {
                timeout: 300,
                renderingThreshold: 150,
                minTimeout: 10,
                mode: "standard",
                useNative: "auto",
                removeInvisiblePages: true,
                virtualRowHeight: 50,
                virtualColumnWidth: 100,
                loadTwoPagesOnStart: true
            },
            encodeHtml: true,
            dataSource: null,
            activeStateEnabled: false,
            fieldChooser: {
                minWidth: 250,
                minHeight: 250,
                enabled: true,
                allowSearch: false,
                searchTimeout: 500,
                layout: 0,
                title: localizationMessage.format("dxPivotGrid-fieldChooserTitle"),
                width: 600,
                height: 600,
                applyChangesMode: "instantly"
            },
            onContextMenuPreparing: null,
            allowSorting: false,
            allowSortingBySummary: false,
            allowFiltering: false,
            allowExpandAll: false,
            wordWrapEnabled: true,
            fieldPanel: {
                showColumnFields: true,
                showFilterFields: true,
                showDataFields: true,
                showRowFields: true,
                allowFieldDragging: true,
                visible: false,
                texts: {
                    columnFieldArea: localizationMessage.format("dxPivotGrid-columnFieldArea"),
                    rowFieldArea: localizationMessage.format("dxPivotGrid-rowFieldArea"),
                    filterFieldArea: localizationMessage.format("dxPivotGrid-filterFieldArea"),
                    dataFieldArea: localizationMessage.format("dxPivotGrid-dataFieldArea")
                }
            },
            dataFieldArea: "column",
            export: {
                enabled: false,
                fileName: "PivotGrid"
            },
            showRowTotals: true,
            showRowGrandTotals: true,
            showColumnTotals: true,
            showColumnGrandTotals: true,
            hideEmptySummaryCells: true,
            showTotalsPrior: "none",
            rowHeaderLayout: "standard",
            loadPanel: {
                enabled: true,
                text: localizationMessage.format("Loading"),
                width: 200,
                height: 70,
                showIndicator: true,
                indicatorSrc: "",
                showPane: true
            },
            texts: {
                grandTotal: localizationMessage.format("dxPivotGrid-grandTotal"),
                total: localizationMessage.getFormatter("dxPivotGrid-total"),
                noData: localizationMessage.format("dxDataGrid-noDataText"),
                showFieldChooser: localizationMessage.format("dxPivotGrid-showFieldChooser"),
                expandAll: localizationMessage.format("dxPivotGrid-expandAll"),
                collapseAll: localizationMessage.format("dxPivotGrid-collapseAll"),
                sortColumnBySummary: localizationMessage.getFormatter("dxPivotGrid-sortColumnBySummary"),
                sortRowBySummary: localizationMessage.getFormatter("dxPivotGrid-sortRowBySummary"),
                removeAllSorting: localizationMessage.format("dxPivotGrid-removeAllSorting"),
                exportToExcel: localizationMessage.format("dxDataGrid-exportToExcel"),
                dataNotAvailable: localizationMessage.format("dxPivotGrid-dataNotAvailable")
            },
            onCellClick: null,
            onCellPrepared: null,
            showBorders: false,
            stateStoring: {
                enabled: false,
                storageKey: null,
                type: "localStorage",
                customLoad: null,
                customSave: null,
                savingTimeout: 2e3
            },
            onExpandValueChanging: null,
            renderCellCountLimit: 2e4,
            onExporting: null,
            headerFilter: {
                width: 252,
                height: 325,
                allowSelectAll: true,
                showRelevantValues: false,
                search: {
                    enabled: false,
                    timeout: 500,
                    editorOptions: {},
                    mode: "contains"
                },
                texts: {
                    emptyValue: localizationMessage.format("dxDataGrid-headerFilterEmptyValue"),
                    ok: localizationMessage.format("dxDataGrid-headerFilterOK"),
                    cancel: localizationMessage.format("dxDataGrid-headerFilterCancel")
                }
            }
        })
    },
    _updateCalculatedOptions(fields) {
        const that = this;
        each(fields, ((_, field) => {
            each(FIELD_CALCULATED_OPTIONS, ((_, optionName) => {
                const isCalculated = field._initProperties && optionName in field._initProperties && void 0 === field._initProperties[optionName];
                const needUpdate = void 0 === field[optionName] || isCalculated;
                if (needUpdate) {
                    setFieldProperty(field, optionName, that.option(optionName))
                }
            }))
        }))
    },
    _getDataControllerOptions() {
        const that = this;
        return {
            component: that,
            dataSource: that.option("dataSource"),
            texts: that.option("texts"),
            showRowTotals: that.option("showRowTotals"),
            showRowGrandTotals: that.option("showRowGrandTotals"),
            showColumnTotals: that.option("showColumnTotals"),
            showTotalsPrior: that.option("showTotalsPrior"),
            showColumnGrandTotals: that.option("showColumnGrandTotals"),
            dataFieldArea: that.option("dataFieldArea"),
            rowHeaderLayout: that.option("rowHeaderLayout"),
            hideEmptySummaryCells: that.option("hideEmptySummaryCells"),
            onFieldsPrepared(fields) {
                that._updateCalculatedOptions(fields)
            }
        }
    },
    _initDataController() {
        const that = this;
        that._dataController && that._dataController.dispose();
        that._dataController = new DataControllerImport.DataController(that._getDataControllerOptions());
        if (hasWindow()) {
            that._dataController.changed.add((() => {
                that._render()
            }))
        }
        that._dataController.scrollChanged.add((options => {
            that._scrollLeft = options.left;
            that._scrollTop = options.top
        }));
        that._dataController.loadingChanged.add((() => {
            that._updateLoading()
        }));
        that._dataController.progressChanged.add(that._updateLoading.bind(that));
        that._dataController.dataSourceChanged.add((() => {
            that._trigger("onChanged")
        }));
        const expandValueChanging = that.option("onExpandValueChanging");
        if (expandValueChanging) {
            that._dataController.expandValueChanging.add((e => {
                expandValueChanging(e)
            }))
        }
    },
    _init() {
        this.callBase();
        this._initDataController();
        gridCoreUtils.logHeaderFilterDeprecatedWarningIfNeed(this);
        this._scrollLeft = this._scrollTop = null;
        this._initActions()
    },
    _initActions() {
        this._actions = {
            onChanged: this._createActionByOption("onChanged"),
            onContextMenuPreparing: this._createActionByOption("onContextMenuPreparing"),
            onCellClick: this._createActionByOption("onCellClick"),
            onExporting: this._createActionByOption("onExporting"),
            onCellPrepared: this._createActionByOption("onCellPrepared")
        }
    },
    _trigger(eventName, eventArg) {
        this._actions[eventName](eventArg)
    },
    _optionChanged(args) {
        const that = this;
        if (FIELD_CALCULATED_OPTIONS.includes(args.name)) {
            const fields = this.getDataSource().fields();
            this._updateCalculatedOptions(fields)
        }
        switch (args.name) {
            case "dataSource":
            case "allowSorting":
            case "allowFiltering":
            case "allowExpandAll":
            case "allowSortingBySummary":
            case "scrolling":
            case "stateStoring":
                that._initDataController();
                that._fieldChooserPopup.hide();
                that._renderFieldChooser();
                that._invalidate();
                break;
            case "texts":
            case "showTotalsPrior":
            case "showRowTotals":
            case "showRowGrandTotals":
            case "showColumnTotals":
            case "showColumnGrandTotals":
            case "hideEmptySummaryCells":
            case "dataFieldArea":
                that._dataController.updateViewOptions(that._getDataControllerOptions());
                break;
            case "useNativeScrolling":
            case "encodeHtml":
            case "renderCellCountLimit":
            case "onExpandValueChanging":
                break;
            case "rtlEnabled":
                that.callBase(args);
                that._renderFieldChooser();
                that._renderContextMenu();
                hasWindow() && that._renderLoadPanel(that._dataArea.groupElement(), that.$element());
                that._invalidate();
                break;
            case "export":
                that._renderDescriptionArea();
                break;
            case "onCellClick":
            case "onContextMenuPreparing":
            case "onExporting":
            case "onExported":
            case "onFileSaving":
            case "onCellPrepared":
                that._actions[args.name] = that._createActionByOption(args.name);
                break;
            case "fieldChooser":
                that._renderFieldChooser();
                that._renderDescriptionArea();
                break;
            case "loadPanel":
                if (hasWindow()) {
                    if ("loadPanel.enabled" === args.fullName) {
                        clearTimeout(this._hideLoadingTimeoutID);
                        that._renderLoadPanel(that._dataArea.groupElement(), that.$element())
                    } else {
                        that._renderLoadPanel(that._dataArea.groupElement(), that.$element());
                        that._invalidate()
                    }
                }
                break;
            case "fieldPanel":
                that._renderDescriptionArea();
                that._invalidate();
                break;
            case "headerFilter":
                that._renderFieldChooser();
                that._invalidate();
                break;
            case "showBorders":
                that._tableElement().toggleClass(BORDERS_CLASS, !!args.value);
                that.updateDimensions();
                break;
            case "wordWrapEnabled":
                that._tableElement().toggleClass("dx-word-wrap", !!args.value);
                that.updateDimensions();
                break;
            case "rowHeaderLayout":
                that._tableElement().find(".dx-area-row-cell").toggleClass("dx-area-tree-view", "tree" === args.value);
                that._dataController.updateViewOptions(that._getDataControllerOptions());
                break;
            case "height":
            case "width":
                that._hasHeight = null;
                that.callBase(args);
                that.resize();
                break;
            default:
                that.callBase(args)
        }
    },
    _updateScrollPosition(columnsArea, rowsArea, dataArea) {
        let force = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : false;
        const that = this;
        let scrollTop;
        let scrollLeft;
        const scrolled = that._scrollTop || that._scrollLeft;
        if (that._scrollUpdating) {
            return
        }
        that._scrollUpdating = true;
        if (rowsArea && !rowsArea.hasScroll() && that._hasHeight) {
            that._scrollTop = null
        }
        if (columnsArea && !columnsArea.hasScroll()) {
            that._scrollLeft = null
        }
        if (null !== that._scrollTop || null !== that._scrollLeft || scrolled || that.option("rtlEnabled")) {
            scrollTop = that._scrollTop || 0;
            scrollLeft = that._scrollLeft || 0;
            dataArea.scrollTo({
                left: scrollLeft,
                top: scrollTop
            }, force);
            columnsArea.scrollTo({
                left: scrollLeft
            }, force);
            rowsArea.scrollTo({
                top: scrollTop
            }, force);
            that._dataController.updateWindowScrollPosition(that._scrollTop)
        }
        that._scrollUpdating = false
    },
    _subscribeToEvents(columnsArea, rowsArea, dataArea) {
        const that = this;
        each([columnsArea, rowsArea, dataArea], ((_, area) => {
            subscribeToScrollEvent(area, (e => function(e, area) {
                const {
                    scrollOffset: scrollOffset
                } = e;
                const scrollable = area._getScrollable();
                const leftOffset = "vertical" !== scrollable.option("direction") ? scrollOffset.left : that._scrollLeft;
                const topOffset = "horizontal" !== scrollable.option("direction") && that._hasHeight ? scrollOffset.top : that._scrollTop;
                if ((that._scrollLeft || 0) !== (leftOffset || 0) || (that._scrollTop || 0) !== (topOffset || 0)) {
                    that._scrollLeft = leftOffset;
                    that._scrollTop = topOffset;
                    that._updateScrollPosition(columnsArea, rowsArea, dataArea);
                    if ("virtual" === that.option("scrolling.mode")) {
                        that._dataController.setViewportPosition(that._scrollLeft, that._scrollTop)
                    }
                }
            }(e, area)))
        }));
        !that._hasHeight && that._dataController.subscribeToWindowScrollEvents(dataArea.groupElement())
    },
    _clean: noop,
    _needDelayResizing(cellsInfo) {
        const cellsCount = cellsInfo.length * (cellsInfo.length ? cellsInfo[0].length : 0);
        return cellsCount > this.option("renderCellCountLimit")
    },
    _renderFieldChooser() {
        const that = this;
        const container = that._pivotGridContainer;
        const fieldChooserOptions = that.option("fieldChooser") || {};
        const toolbarItems = "onDemand" === fieldChooserOptions.applyChangesMode ? [{
            toolbar: "bottom",
            location: "after",
            widget: "dxButton",
            options: {
                text: localizationMessage.format("OK"),
                onClick() {
                    that._fieldChooserPopup.$content().dxPivotGridFieldChooser("applyChanges");
                    that._fieldChooserPopup.hide()
                }
            }
        }, {
            toolbar: "bottom",
            location: "after",
            widget: "dxButton",
            options: {
                text: localizationMessage.format("Cancel"),
                onClick() {
                    that._fieldChooserPopup.hide()
                }
            }
        }] : [];
        const fieldChooserComponentOptions = {
            layout: fieldChooserOptions.layout,
            texts: fieldChooserOptions.texts || {},
            dataSource: that.getDataSource(),
            allowSearch: fieldChooserOptions.allowSearch,
            searchTimeout: fieldChooserOptions.searchTimeout,
            width: void 0,
            height: void 0,
            headerFilter: that.option("headerFilter"),
            encodeHtml: that.option("fieldChooser.encodeHtml") ?? that.option("encodeHtml"),
            applyChangesMode: fieldChooserOptions.applyChangesMode,
            onContextMenuPreparing(e) {
                that._trigger("onContextMenuPreparing", e)
            }
        };
        const popupOptions = {
            shading: false,
            title: fieldChooserOptions.title,
            width: fieldChooserOptions.width,
            height: fieldChooserOptions.height,
            showCloseButton: true,
            resizeEnabled: true,
            minWidth: fieldChooserOptions.minWidth,
            minHeight: fieldChooserOptions.minHeight,
            toolbarItems: toolbarItems,
            onResize(e) {
                e.component.$content().dxPivotGridFieldChooser("updateDimensions")
            },
            onShown(e) {
                that._createComponent(e.component.content(), FieldChooser, fieldChooserComponentOptions)
            },
            onHidden(e) {
                const fieldChooser = e.component.$content().dxPivotGridFieldChooser("instance");
                fieldChooser.resetTreeView();
                fieldChooser.cancelChanges()
            }
        };
        if (that._fieldChooserPopup) {
            that._fieldChooserPopup.option(popupOptions);
            that._fieldChooserPopup.$content().dxPivotGridFieldChooser(fieldChooserComponentOptions)
        } else {
            that._fieldChooserPopup = that._createComponent($(DIV).addClass("dx-fieldchooser-popup").appendTo(container), Popup, popupOptions)
        }
    },
    _renderContextMenu() {
        const that = this;
        const $container = that._pivotGridContainer;
        if (that._contextMenu) {
            that._contextMenu.$element().remove()
        }
        that._contextMenu = that._createComponent($(DIV).appendTo($container), ContextMenu, {
            onPositioning(actionArgs) {
                const {
                    event: event
                } = actionArgs;
                actionArgs.cancel = true;
                if (!event) {
                    return
                }
                const targetElement = event.target.cellIndex >= 0 ? event.target : $(event.target).closest("td").get(0);
                if (!targetElement) {
                    return
                }
                const args = that._createEventArgs(targetElement, event);
                const items = that._getContextMenuItems(args);
                if (items) {
                    actionArgs.component.option("items", items);
                    actionArgs.cancel = false
                }
            },
            onItemClick(params) {
                params.itemData.onItemClick && params.itemData.onItemClick(params)
            },
            cssClass: "dx-pivotgrid",
            target: that.$element()
        })
    },
    _getContextMenuItems(e) {
        const that = this;
        let items = [];
        const texts = that.option("texts");
        if ("row" === e.area || "column" === e.area) {
            const areaFields = e[`${e.area}Fields`];
            const oppositeAreaFields = e["column" === e.area ? "rowFields" : "columnFields"];
            const field = e.cell.path && areaFields[e.cell.path.length - 1];
            const dataSource = that.getDataSource();
            if (field && field.allowExpandAll && e.cell.path.length < e[`${e.area}Fields`].length && !dataSource.paginate()) {
                items.push({
                    beginGroup: true,
                    icon: "none",
                    text: texts.expandAll,
                    onItemClick() {
                        dataSource.expandAll(field.index)
                    }
                });
                items.push({
                    text: texts.collapseAll,
                    icon: "none",
                    onItemClick() {
                        dataSource.collapseAll(field.index)
                    }
                })
            }
            if (e.cell.isLast && !dataSource.paginate()) {
                let sortingBySummaryItemCount = 0;
                each(oppositeAreaFields, ((_, field) => {
                    if (!field.allowSortingBySummary) {
                        return
                    }
                    each(e.dataFields, ((dataIndex, dataField) => {
                        if (isDefined(e.cell.dataIndex) && e.cell.dataIndex !== dataIndex) {
                            return
                        }
                        const showDataFieldCaption = !isDefined(e.cell.dataIndex) && e.dataFields.length > 1;
                        const textFormat = "column" === e.area ? texts.sortColumnBySummary : texts.sortRowBySummary;
                        const checked = findField(e.dataFields, field.sortBySummaryField) === dataIndex && (e.cell.path || []).join("/") === (field.sortBySummaryPath || []).join("/");
                        const text = formatString(textFormat, showDataFieldCaption ? `${field.caption} - ${dataField.caption}` : field.caption);
                        items.push({
                            beginGroup: 0 === sortingBySummaryItemCount,
                            icon: checked ? "desc" === field.sortOrder ? "sortdowntext" : "sortuptext" : "none",
                            text: text,
                            onItemClick() {
                                dataSource.field(field.index, {
                                    sortBySummaryField: dataField.name || dataField.caption || dataField.dataField,
                                    sortBySummaryPath: e.cell.path,
                                    sortOrder: "desc" === field.sortOrder ? "asc" : "desc"
                                });
                                dataSource.load()
                            }
                        });
                        sortingBySummaryItemCount += 1
                    }))
                }));
                each(oppositeAreaFields, ((_, field) => {
                    if (!field.allowSortingBySummary || !isDefined(field.sortBySummaryField)) {
                        return
                    }
                    items.push({
                        beginGroup: 0 === sortingBySummaryItemCount,
                        icon: "none",
                        text: texts.removeAllSorting,
                        onItemClick() {
                            each(oppositeAreaFields, ((_, field) => {
                                dataSource.field(field.index, {
                                    sortBySummaryField: void 0,
                                    sortBySummaryPath: void 0,
                                    sortOrder: void 0
                                })
                            }));
                            dataSource.load()
                        }
                    });
                    return false
                }))
            }
        }
        if (that.option("fieldChooser.enabled")) {
            items.push({
                beginGroup: true,
                icon: "columnchooser",
                text: texts.showFieldChooser,
                onItemClick() {
                    that._fieldChooserPopup.show()
                }
            })
        }
        if (that.option("export.enabled")) {
            items.push({
                beginGroup: true,
                icon: "xlsxfile",
                text: texts.exportToExcel,
                onItemClick() {
                    that.exportTo()
                }
            })
        }
        e.items = items;
        that._trigger("onContextMenuPreparing", e);
        items = e.items;
        if (items && items.length) {
            return items
        }
        return
    },
    _createEventArgs(targetElement, dxEvent) {
        const that = this;
        const dataSource = that.getDataSource();
        const args = {
            rowFields: dataSource.getAreaFields("row"),
            columnFields: dataSource.getAreaFields("column"),
            dataFields: dataSource.getAreaFields("data"),
            event: dxEvent
        };
        if (clickedOnFieldsArea($(targetElement))) {
            return extend(that._createFieldArgs(targetElement), args)
        }
        return extend(that._createCellArgs(targetElement), args)
    },
    _createFieldArgs(targetElement) {
        const field = $(targetElement).children().data("field");
        const args = {
            field: field
        };
        return isDefined(field) ? args : {}
    },
    _createCellArgs(cellElement) {
        const $cellElement = $(cellElement);
        const columnIndex = cellElement.cellIndex;
        const {
            rowIndex: rowIndex
        } = cellElement.parentElement;
        const $table = $cellElement.closest("table");
        const data = $table.data("data");
        const cell = data && data[rowIndex] && data[rowIndex][columnIndex];
        const args = {
            area: $table.data("area"),
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            cellElement: getPublicElement($cellElement),
            cell: cell
        };
        return args
    },
    _handleCellClick(e) {
        const that = this;
        const args = that._createEventArgs(e.currentTarget, e);
        const {
            cell: cell
        } = args;
        if (!cell || !args.area && (args.rowIndex || args.columnIndex)) {
            return
        }
        that._trigger("onCellClick", args);
        cell && !args.cancel && isDefined(cell.expanded) && setTimeout((() => {
            that._dataController[cell.expanded ? "collapseHeaderItem" : "expandHeaderItem"](args.area, cell.path)
        }))
    },
    _getNoDataText() {
        return this.option("texts.noData")
    },
    _renderNoDataText: gridCoreUtils.renderNoDataText,
    _renderLoadPanel: gridCoreUtils.renderLoadPanel,
    _updateLoading(progress) {
        const that = this;
        const isLoading = that._dataController.isLoading();
        if (!that._loadPanel) {
            return
        }
        const loadPanelVisible = that._loadPanel.option("visible");
        if (!loadPanelVisible) {
            that._startLoadingTime = new Date
        }
        if (isLoading) {
            if (progress) {
                if (new Date - that._startLoadingTime >= 1e3) {
                    that._loadPanel.option("message", `${Math.floor(100*progress)}%`)
                }
            } else {
                that._loadPanel.option("message", that.option("loadPanel.text"))
            }
        }
        clearTimeout(that._hideLoadingTimeoutID);
        if (loadPanelVisible && !isLoading) {
            that._hideLoadingTimeoutID = setTimeout((() => {
                that._loadPanel.option("visible", false);
                that.$element().removeClass("dx-overflow-hidden")
            }))
        } else {
            const visibilityOptions = {
                visible: isLoading
            };
            if (isLoading) {
                visibilityOptions.position = gridCoreUtils.calculateLoadPanelPosition(that._dataArea.groupElement())
            }
            that._loadPanel.option(visibilityOptions);
            that.$element().toggleClass("dx-overflow-hidden", !isLoading)
        }
    },
    _renderDescriptionArea() {
        const $element = this.$element();
        const $descriptionCell = $element.find(".dx-area-description-cell");
        const $toolbarContainer = $(DIV).addClass("dx-pivotgrid-toolbar");
        const fieldPanel = this.option("fieldPanel");
        const $filterHeader = $element.find(".dx-filter-header");
        const $columnHeader = $element.find(".dx-column-header");
        let $targetContainer;
        if (fieldPanel.visible && fieldPanel.showFilterFields) {
            $targetContainer = $filterHeader
        } else if (fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)) {
            $targetContainer = $columnHeader
        } else {
            $targetContainer = $descriptionCell
        }
        $columnHeader.toggleClass("dx-bottom-border", !!(fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)));
        $filterHeader.toggleClass("dx-bottom-border", !!(fieldPanel.visible && fieldPanel.showFilterFields));
        $descriptionCell.toggleClass("dx-pivotgrid-background", fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields || fieldPanel.showRowFields));
        this.$element().find(".dx-pivotgrid-toolbar").remove();
        $toolbarContainer.prependTo($targetContainer);
        const stylingMode = isFluent(current()) ? "text" : "contained";
        if (this.option("fieldChooser.enabled")) {
            const $buttonElement = $(DIV).appendTo($toolbarContainer).addClass("dx-pivotgrid-field-chooser-button");
            const buttonOptions = {
                icon: "columnchooser",
                hint: this.option("texts.showFieldChooser"),
                stylingMode: stylingMode,
                onClick: () => {
                    this.getFieldChooserPopup().show()
                }
            };
            this._createComponent($buttonElement, Button, buttonOptions)
        }
        if (this.option("export.enabled")) {
            const $buttonElement = $(DIV).appendTo($toolbarContainer).addClass("dx-pivotgrid-export-button");
            const buttonOptions = {
                icon: "xlsxfile",
                hint: this.option("texts.exportToExcel"),
                stylingMode: stylingMode,
                onClick: () => {
                    this.exportTo()
                }
            };
            this._createComponent($buttonElement, Button, buttonOptions)
        }
    },
    _detectHasContainerHeight() {
        const that = this;
        const element = that.$element();
        if (isDefined(that._hasHeight)) {
            const height = that.option("height") || that.$element().get(0).style.height;
            if (height && that._hasHeight ^ "auto" !== height) {
                that._hasHeight = null
            }
        }
        if (isDefined(that._hasHeight) || element.is(":hidden")) {
            return
        }
        that._pivotGridContainer.addClass("dx-hidden");
        const testElement = $(DIV);
        setHeight(testElement, 66666);
        element.append(testElement);
        that._hasHeight = 66666 !== getHeight(element);
        that._pivotGridContainer.removeClass("dx-hidden");
        testElement.remove()
    },
    _renderHeaders(rowHeaderContainer, columnHeaderContainer, filterHeaderContainer, dataHeaderContainer) {
        const dataSource = this.getDataSource();
        this._rowFields = this._rowFields || new FieldsArea(this, "row");
        this._rowFields.render(rowHeaderContainer, dataSource.getAreaFields("row"));
        this._columnFields = this._columnFields || new FieldsArea(this, "column");
        this._columnFields.render(columnHeaderContainer, dataSource.getAreaFields("column"));
        this._filterFields = this._filterFields || new FieldsArea(this, "filter");
        this._filterFields.render(filterHeaderContainer, dataSource.getAreaFields("filter"));
        this._dataFields = this._dataFields || new FieldsArea(this, "data");
        this._dataFields.render(dataHeaderContainer, dataSource.getAreaFields("data"));
        this.$element().dxPivotGridFieldChooserBase("instance").renderSortable()
    },
    _createTableElement() {
        const $table = $("<table>").css({
            width: "100%"
        }).toggleClass(BORDERS_CLASS, !!this.option("showBorders")).toggleClass("dx-word-wrap", !!this.option("wordWrapEnabled"));
        eventsEngine.on($table, addNamespace(clickEventName, "dxPivotGrid"), "td", this._handleCellClick.bind(this));
        return $table
    },
    _renderDataArea(dataAreaElement) {
        const dataArea = this._dataArea || new DataAreaImport.DataArea(this);
        this._dataArea = dataArea;
        dataArea.render(dataAreaElement, this._dataController.getCellsInfo());
        return dataArea
    },
    _renderRowsArea(rowsAreaElement) {
        const rowsArea = this._rowsArea || new HeadersArea.VerticalHeadersArea(this);
        this._rowsArea = rowsArea;
        rowsArea.render(rowsAreaElement, this._dataController.getRowsInfo());
        return rowsArea
    },
    _renderColumnsArea(columnsAreaElement) {
        const columnsArea = this._columnsArea || new HeadersArea.HorizontalHeadersArea(this);
        this._columnsArea = columnsArea;
        columnsArea.render(columnsAreaElement, this._dataController.getColumnsInfo());
        return columnsArea
    },
    _initMarkup() {
        this.callBase.apply(this, arguments);
        this.$element().addClass("dx-pivotgrid")
    },
    _renderContentImpl() {
        const that = this;
        let columnsAreaElement;
        let rowsAreaElement;
        let dataAreaElement;
        let tableElement;
        const isFirstDrawing = !that._pivotGridContainer;
        let rowHeaderContainer;
        let columnHeaderContainer;
        let filterHeaderContainer;
        let dataHeaderContainer;
        tableElement = !isFirstDrawing && that._tableElement();
        if (!tableElement) {
            that.$element().addClass("dx-row-lines").addClass(FIELDS_CONTAINER_CLASS);
            that._pivotGridContainer = $(DIV).addClass("dx-pivotgrid-container");
            that._renderFieldChooser();
            that._renderContextMenu();
            columnsAreaElement = $(TD).addClass("dx-area-column-cell");
            rowsAreaElement = $(TD).addClass("dx-area-row-cell");
            dataAreaElement = $(TD).addClass("dx-area-data-cell");
            tableElement = that._createTableElement();
            dataHeaderContainer = $(TD).addClass("dx-data-header");
            filterHeaderContainer = $("<td>").attr("colspan", "2").addClass("dx-filter-header");
            columnHeaderContainer = $(TD).addClass("dx-column-header");
            rowHeaderContainer = $(TD).addClass("dx-area-description-cell");
            $(TR).append(filterHeaderContainer).appendTo(tableElement);
            $(TR).append(dataHeaderContainer).append(columnHeaderContainer).appendTo(tableElement);
            $(TR).append(rowHeaderContainer).append(columnsAreaElement).appendTo(tableElement);
            $(TR).addClass("dx-bottom-row").append(rowsAreaElement).append(dataAreaElement).appendTo(tableElement);
            that._pivotGridContainer.append(tableElement);
            that.$element().append(that._pivotGridContainer);
            if ("tree" === that.option("rowHeaderLayout")) {
                rowsAreaElement.addClass("dx-area-tree-view")
            }
        }
        that.$element().addClass("dx-overflow-hidden");
        that._createComponent(that.$element(), FieldChooserBase, {
            dataSource: that.getDataSource(),
            encodeHtml: that.option("encodeHtml"),
            allowFieldDragging: that.option("fieldPanel.allowFieldDragging"),
            headerFilter: that.option("headerFilter"),
            visible: that.option("visible"),
            remoteSort: "virtual" === that.option("scrolling.mode")
        });
        const dataArea = that._renderDataArea(dataAreaElement);
        const rowsArea = that._renderRowsArea(rowsAreaElement);
        const columnsArea = that._renderColumnsArea(columnsAreaElement);
        dataArea.tableElement().prepend(columnsArea.headElement());
        if (isFirstDrawing) {
            that._renderLoadPanel(dataArea.groupElement().parent(), that.$element());
            that._renderDescriptionArea();
            rowsArea.renderScrollable();
            columnsArea.renderScrollable();
            dataArea.renderScrollable()
        } [dataArea, rowsArea, columnsArea].forEach((area => {
            unsubscribeScrollEvents(area)
        }));
        that._renderHeaders(rowHeaderContainer, columnHeaderContainer, filterHeaderContainer, dataHeaderContainer);
        that._update(isFirstDrawing)
    },
    _update(isFirstDrawing) {
        const that = this;
        const updateHandler = function() {
            that.updateDimensions()
        };
        if (that._needDelayResizing(that._dataArea.getData()) && isFirstDrawing) {
            setTimeout(updateHandler)
        } else {
            updateHandler()
        }
    },
    _fireContentReadyAction() {
        if (!this._dataController.isLoading()) {
            this.callBase()
        }
    },
    getScrollPath(area) {
        const that = this;
        if ("column" === area) {
            return that._columnsArea.getScrollPath(that._scrollLeft)
        }
        return that._rowsArea.getScrollPath(that._scrollTop)
    },
    getDataSource() {
        return this._dataController.getDataSource()
    },
    getFieldChooserPopup() {
        return this._fieldChooserPopup
    },
    hasScroll(area) {
        return "column" === area ? this._columnsArea.hasScroll() : this._rowsArea.hasScroll()
    },
    _dimensionChanged() {
        this.updateDimensions()
    },
    _visibilityChanged(visible) {
        if (visible) {
            this.updateDimensions()
        }
    },
    _dispose() {
        const that = this;
        clearTimeout(that._hideLoadingTimeoutID);
        that.callBase.apply(that, arguments);
        if (that._dataController) {
            that._dataController.dispose()
        }
    },
    _tableElement() {
        return this.$element().find("table").first()
    },
    addWidgetPrefix: className => `dx-pivotgrid-${className}`,
    resize() {
        this.updateDimensions()
    },
    isReady() {
        return this.callBase() && !this._dataController.isLoading()
    },
    updateDimensions() {
        const that = this;
        let groupWidth;
        const tableElement = that._tableElement();
        let bordersWidth;
        let totalWidth = 0;
        let totalHeight = 0;
        let rowsAreaWidth = 0;
        let hasRowsScroll;
        let hasColumnsScroll;
        const dataAreaCell = tableElement.find(".dx-area-data-cell");
        const rowAreaCell = tableElement.find(".dx-area-row-cell");
        const columnAreaCell = tableElement.find(".dx-area-column-cell");
        const descriptionCell = tableElement.find(".dx-area-description-cell");
        const filterHeaderCell = tableElement.find(".dx-filter-header");
        const columnHeaderCell = tableElement.find(".dx-column-header");
        const rowFieldsHeader = that._rowFields;
        const d = new Deferred;
        if (!hasWindow()) {
            return
        }
        const needSynchronizeFieldPanel = rowFieldsHeader.isVisible() && "tree" !== that.option("rowHeaderLayout");
        that._detectHasContainerHeight();
        if (!that._dataArea.headElement().length) {
            that._dataArea.tableElement().prepend(that._columnsArea.headElement())
        }
        if (needSynchronizeFieldPanel) {
            that._rowsArea.updateColspans(rowFieldsHeader.getColumnsCount());
            that._rowsArea.tableElement().prepend(rowFieldsHeader.headElement())
        }
        tableElement.addClass("dx-incompressible-fields");
        that._dataArea.reset();
        that._rowsArea.reset();
        that._columnsArea.reset();
        rowFieldsHeader.reset();
        const calculateHasScroll = (areaSize, totalSize) => totalSize - areaSize >= 1;
        const calculateGroupHeight = (dataAreaHeight, totalHeight, hasRowsScroll, hasColumnsScroll, scrollBarWidth) => hasRowsScroll ? dataAreaHeight : totalHeight + (hasColumnsScroll ? scrollBarWidth : 0);
        deferUpdate((() => {
            const rowHeights = that._rowsArea.getRowsHeight();
            const descriptionCellHeight = getOuterHeight(descriptionCell[0], true) + (needSynchronizeFieldPanel ? rowHeights[0] : 0);
            let filterAreaHeight = 0;
            let dataAreaHeight = 0;
            if (that._hasHeight) {
                filterAreaHeight = getHeight(filterHeaderCell);
                const $dataHeader = tableElement.find(".dx-data-header");
                const dataHeaderHeight = getHeight($dataHeader);
                bordersWidth = getCommonBorderWidth([columnAreaCell, dataAreaCell, tableElement, columnHeaderCell, filterHeaderCell], "height");
                dataAreaHeight = getHeight(that.$element()) - filterAreaHeight - dataHeaderHeight - (Math.max(getHeight(that._dataArea.headElement()), getHeight(columnAreaCell), descriptionCellHeight) + bordersWidth)
            }
            const scrollBarWidth = that._dataArea.getScrollbarWidth();
            const correctDataTableHeight = getHeight(that._dataArea.tableElement()) - getHeight(that._dataArea.headElement());
            const hasVerticalScrollbar = calculateHasScroll(dataAreaHeight, correctDataTableHeight);
            that._dataArea.tableElement().css({
                width: that._hasHeight && hasVerticalScrollbar && scrollBarWidth ? `calc(100% - ${scrollBarWidth}px)` : "100%"
            });
            const resultWidths = that._dataArea.getColumnsWidth();
            const rowsAreaHeights = needSynchronizeFieldPanel ? rowHeights.slice(1) : rowHeights;
            const dataAreaHeights = that._dataArea.getRowsHeight();
            const columnsAreaRowCount = that._dataController.getColumnsInfo().length;
            const resultHeights = mergeArraysByMaxValue(rowsAreaHeights, dataAreaHeights.slice(columnsAreaRowCount));
            const columnsAreaRowHeights = dataAreaHeights.slice(0, columnsAreaRowCount);
            const columnsAreaHeight = getArraySum(columnsAreaRowHeights);
            const rowsAreaColumnWidths = that._rowsArea.getColumnsWidth();
            totalWidth = getWidth(that._dataArea.tableElement());
            totalHeight = getArraySum(resultHeights);
            if (!totalWidth || !totalHeight) {
                d.resolve();
                return
            }
            rowsAreaWidth = getArraySum(rowsAreaColumnWidths);
            const elementWidth = getWidth(that.$element());
            bordersWidth = getCommonBorderWidth([rowAreaCell, dataAreaCell, tableElement], "width");
            groupWidth = elementWidth - rowsAreaWidth - bordersWidth;
            groupWidth = groupWidth > 0 ? groupWidth : totalWidth;
            const diff = totalWidth - groupWidth;
            const needAdjustWidthOnZoom = diff >= 0 && diff <= 2;
            if (needAdjustWidthOnZoom) {
                adjustSizeArray(resultWidths, diff);
                totalWidth = groupWidth
            }
            hasRowsScroll = that._hasHeight && calculateHasScroll(dataAreaHeight, totalHeight);
            hasColumnsScroll = calculateHasScroll(groupWidth, totalWidth);
            const groupHeight = calculateGroupHeight(dataAreaHeight, totalHeight, hasRowsScroll, hasColumnsScroll, scrollBarWidth);
            deferRender((() => {
                that._columnsArea.tableElement().append(that._dataArea.headElement());
                rowFieldsHeader.tableElement().append(that._rowsArea.headElement());
                if (descriptionCellHeight > columnsAreaHeight) {
                    adjustSizeArray(columnsAreaRowHeights, columnsAreaHeight - descriptionCellHeight);
                    that._columnsArea.setRowsHeight(columnsAreaRowHeights)
                }
                tableElement.removeClass("dx-incompressible-fields");
                columnHeaderCell.children().css("maxWidth", groupWidth);
                that._columnsArea.setGroupWidth(groupWidth);
                that._columnsArea.processScrollBarSpacing(hasRowsScroll ? scrollBarWidth : 0);
                that._columnsArea.setColumnsWidth(resultWidths);
                that._rowsArea.setGroupHeight(that._hasHeight ? groupHeight : "auto");
                that._rowsArea.processScrollBarSpacing(hasColumnsScroll ? scrollBarWidth : 0);
                that._rowsArea.setColumnsWidth(rowsAreaColumnWidths);
                that._rowsArea.setRowsHeight(resultHeights);
                that._dataArea.setColumnsWidth(resultWidths);
                that._dataArea.setRowsHeight(resultHeights);
                that._dataArea.setGroupWidth(groupWidth);
                that._dataArea.setGroupHeight(that._hasHeight ? groupHeight : "auto");
                needSynchronizeFieldPanel && rowFieldsHeader.setColumnsWidth(rowsAreaColumnWidths);
                dataAreaCell.toggleClass("dx-bottom-border", !hasRowsScroll);
                rowAreaCell.toggleClass("dx-bottom-border", !hasRowsScroll);
                if (!that._hasHeight && elementWidth !== getWidth(that.$element())) {
                    const diff = elementWidth - getWidth(that.$element());
                    if (!hasColumnsScroll) {
                        adjustSizeArray(resultWidths, diff);
                        that._columnsArea.setColumnsWidth(resultWidths);
                        that._dataArea.setColumnsWidth(resultWidths)
                    }
                    that._dataArea.setGroupWidth(groupWidth - diff);
                    that._columnsArea.setGroupWidth(groupWidth - diff)
                }
                if (that._hasHeight && that._filterFields.isVisible() && getHeight(filterHeaderCell) !== filterAreaHeight) {
                    const diff = getHeight(filterHeaderCell) - filterAreaHeight;
                    if (diff > 0) {
                        hasRowsScroll = calculateHasScroll(dataAreaHeight - diff, totalHeight);
                        const groupHeight = calculateGroupHeight(dataAreaHeight - diff, totalHeight, hasRowsScroll, hasColumnsScroll, scrollBarWidth);
                        that._dataArea.setGroupHeight(groupHeight);
                        that._rowsArea.setGroupHeight(groupHeight)
                    }
                }
                const scrollingOptions = that.option("scrolling");
                if ("virtual" === scrollingOptions.mode) {
                    that._setVirtualContentParams(scrollingOptions, resultWidths, resultHeights, groupWidth, groupHeight, that._hasHeight, rowsAreaWidth)
                }
                const updateScrollableResults = [];
                that._dataArea.updateScrollableOptions({
                    direction: that._dataArea.getScrollableDirection(hasColumnsScroll, hasRowsScroll),
                    rtlEnabled: that.option("rtlEnabled")
                });
                that._columnsArea.updateScrollableOptions({
                    rtlEnabled: that.option("rtlEnabled")
                });
                each([that._columnsArea, that._rowsArea, that._dataArea], ((_, area) => {
                    updateScrollableResults.push(area && area.updateScrollable())
                }));
                that._updateLoading();
                that._renderNoDataText(dataAreaCell);
                when.apply($, updateScrollableResults).done((() => {
                    that._updateScrollPosition(that._columnsArea, that._rowsArea, that._dataArea, true);
                    that._subscribeToEvents(that._columnsArea, that._rowsArea, that._dataArea);
                    d.resolve()
                }))
            }))
        }));
        return d
    },
    _setVirtualContentParams(scrollingOptions, resultWidths, resultHeights, groupWidth, groupHeight, hasHeight, rowsAreaWidth) {
        const virtualContentParams = this._dataController.calculateVirtualContentParams({
            virtualRowHeight: scrollingOptions.virtualRowHeight,
            virtualColumnWidth: scrollingOptions.virtualColumnWidth,
            itemWidths: resultWidths,
            itemHeights: resultHeights,
            rowCount: resultHeights.length,
            columnCount: resultWidths.length,
            viewportWidth: groupWidth,
            viewportHeight: hasHeight ? groupHeight : getOuterHeight(window)
        });
        this._dataArea.setVirtualContentParams({
            top: virtualContentParams.contentTop,
            left: virtualContentParams.contentLeft,
            width: virtualContentParams.width,
            height: virtualContentParams.height
        });
        this._rowsArea.setVirtualContentParams({
            top: virtualContentParams.contentTop,
            width: rowsAreaWidth,
            height: virtualContentParams.height
        });
        this._columnsArea.setVirtualContentParams({
            left: virtualContentParams.contentLeft,
            width: virtualContentParams.width,
            height: getHeight(this._columnsArea.groupElement())
        })
    },
    applyPartialDataSource(area, path, dataSource) {
        this._dataController.applyPartialDataSource(area, path, dataSource)
    }
}).inherit(ExportController).include(ChartIntegrationMixin);
registerComponent("dxPivotGrid", PivotGrid);
export default {
    PivotGrid: PivotGrid
};
export {
    PivotGrid
};

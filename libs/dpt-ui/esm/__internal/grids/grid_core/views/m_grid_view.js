/**
 * DevExtreme (esm/__internal/grids/grid_core/views/m_grid_view.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import domAdapter from "../../../../core/dom_adapter";
import $ from "../../../../core/renderer";
import browser from "../../../../core/utils/browser";
import {
    deferRender,
    deferUpdate
} from "../../../../core/utils/common";
import {
    Deferred,
    when
} from "../../../../core/utils/deferred";
import {
    each
} from "../../../../core/utils/iterator";
import {
    getBoundingRect
} from "../../../../core/utils/position";
import {
    getHeight,
    getInnerWidth,
    getOuterWidth,
    getWidth
} from "../../../../core/utils/size";
import {
    isDefined,
    isNumeric,
    isString
} from "../../../../core/utils/type";
import {
    getWindow,
    hasWindow
} from "../../../../core/utils/window";
import messageLocalization from "../../../../localization/message";
import * as accessibility from "../../../../ui/shared/accessibility";
import {
    A11yStatusContainerComponent
} from "../../../grids/grid_core/views/a11y_status_container_component";
import modules from "../m_modules";
import gridCoreUtils from "../m_utils";
const BORDERS_CLASS = "borders";
const TABLE_FIXED_CLASS = "table-fixed";
const IMPORTANT_MARGIN_CLASS = "important-margin";
const GRIDBASE_CONTAINER_CLASS = "dx-gridbase-container";
const GROUP_ROW_SELECTOR = "tr.dx-group-row";
const HIDDEN_COLUMNS_WIDTH = "adaptiveHidden";
const VIEW_NAMES = ["columnsSeparatorView", "blockSeparatorView", "trackerView", "headerPanel", "columnHeadersView", "rowsView", "footerView", "columnChooserView", "filterPanelView", "pagerView", "draggingHeaderView", "contextMenuView", "errorView", "headerFilterView", "filterBuilderView"];
const E2E_ATTRIBUTES = {
    a11yStatusContainer: "e2e-a11y-general-status-container"
};
const isPercentWidth = function(width) {
    return isString(width) && width.endsWith("%")
};
const isPixelWidth = function(width) {
    return isString(width) && width.endsWith("px")
};
const calculateFreeWidth = function(that, widths) {
    const contentWidth = that._rowsView.contentWidth();
    const totalWidth = that._getTotalWidth(widths, contentWidth);
    return contentWidth - totalWidth
};
const calculateFreeWidthWithCurrentMinWidth = function(that, columnIndex, currentMinWidth, widths) {
    return calculateFreeWidth(that, widths.map(((width, index) => index === columnIndex ? currentMinWidth : width)))
};
const restoreFocus = function(focusedElement, selectionRange) {
    accessibility.hiddenFocus(focusedElement, true);
    gridCoreUtils.setSelectionRange(focusedElement, selectionRange)
};
export class ResizingController extends modules.ViewController {
    init() {
        this._prevContentMinHeight = null;
        this._dataController = this.getController("data");
        this._columnsController = this.getController("columns");
        this._columnHeadersView = this.getView("columnHeadersView");
        this._adaptiveColumnsController = this.getController("adaptiveColumns");
        this._editorFactoryController = this.getController("editorFactory");
        this._footerView = this.getView("footerView");
        this._rowsView = this.getView("rowsView");
        this._gridView = this.getView("gridView")
    }
    _initPostRenderHandlers() {
        if (!this._refreshSizesHandler) {
            this._refreshSizesHandler = e => {
                let resizeDeferred = (new Deferred).resolve(null);
                const changeType = null === e || void 0 === e ? void 0 : e.changeType;
                const isDelayed = null === e || void 0 === e ? void 0 : e.isDelayed;
                const needFireContentReady = changeType && "updateSelection" !== changeType && "updateFocusedRow" !== changeType && "pageIndex" !== changeType && !isDelayed;
                this._dataController.changed.remove(this._refreshSizesHandler);
                if (this._checkSize()) {
                    resizeDeferred = this._refreshSizes(e)
                }
                if (needFireContentReady) {
                    when(resizeDeferred).done((() => {
                        this._setAriaLabel();
                        this.fireContentReadyAction()
                    }))
                }
            };
            this._dataController.changed.add((() => {
                this._dataController.changed.add(this._refreshSizesHandler)
            }))
        }
    }
    _refreshSizes(e) {
        let resizeDeferred = (new Deferred).resolve(null);
        const changeType = null === e || void 0 === e ? void 0 : e.changeType;
        const isDelayed = null === e || void 0 === e ? void 0 : e.isDelayed;
        const items = this._dataController.items();
        if (!e || "refresh" === changeType || "prepend" === changeType || "append" === changeType) {
            if (!isDelayed) {
                resizeDeferred = this.resize()
            }
        } else if ("update" === changeType) {
            var _e$changeTypes;
            if (0 === (null === (_e$changeTypes = e.changeTypes) || void 0 === _e$changeTypes ? void 0 : _e$changeTypes.length)) {
                return resizeDeferred
            }
            if ((items.length > 1 || "insert" !== e.changeTypes[0]) && !(0 === items.length && "remove" === e.changeTypes[0]) && !e.needUpdateDimensions) {
                resizeDeferred = new Deferred;
                this._waitAsyncTemplates().done((() => {
                    deferUpdate((() => deferRender((() => deferUpdate((() => {
                        this._setScrollerSpacing();
                        this._rowsView.resize();
                        resizeDeferred.resolve()
                    }))))))
                })).fail(resizeDeferred.reject)
            } else {
                resizeDeferred = this.resize()
            }
        }
        return resizeDeferred
    }
    fireContentReadyAction() {
        this.component._fireContentReadyAction()
    }
    _getWidgetAriaLabel() {
        return "dxDataGrid-ariaDataGrid"
    }
    _setAriaLabel() {
        var _this$_columnsControl;
        const columnCount = (null === (_this$_columnsControl = this._columnsController) || void 0 === _this$_columnsControl || null === (_this$_columnsControl = _this$_columnsControl._columns) || void 0 === _this$_columnsControl ? void 0 : _this$_columnsControl.filter((_ref => {
            let {
                visible: visible
            } = _ref;
            return !!visible
        })).length) ?? 0;
        const totalItemsCount = Math.max(0, this._dataController.totalItemsCount());
        const widgetAriaLabel = this._getWidgetAriaLabel();
        const widgetStatusText = messageLocalization.format(widgetAriaLabel, totalItemsCount, columnCount);
        const $ariaLabelElement = this.component.$element().children(".dx-gridbase-container");
        this.component.setAria("label", widgetStatusText, $ariaLabelElement);
        this._gridView.setWidgetA11yStatusText(widgetStatusText)
    }
    _getBestFitWidths() {
        var _widths;
        const rowsView = this._rowsView;
        const columnHeadersView = this._columnHeadersView;
        let widths = rowsView.getColumnWidths();
        if (!(null !== (_widths = widths) && void 0 !== _widths && _widths.length)) {
            var _rowsView$getTableEle;
            const headersTableElement = columnHeadersView.getTableElement();
            columnHeadersView.setTableElement(null === (_rowsView$getTableEle = rowsView.getTableElement()) || void 0 === _rowsView$getTableEle ? void 0 : _rowsView$getTableEle.children(".dx-header"));
            widths = columnHeadersView.getColumnWidths();
            columnHeadersView.setTableElement(headersTableElement)
        }
        return widths
    }
    _setVisibleWidths(visibleColumns, widths) {
        const columnsController = this._columnsController;
        columnsController.beginUpdate();
        each(visibleColumns, ((index, column) => {
            const columnId = columnsController.getColumnId(column);
            columnsController.columnOption(columnId, "visibleWidth", widths[index])
        }));
        columnsController.endUpdate()
    }
    _toggleBestFitModeForView(view, className, isBestFit) {
        if (!view || !view.isVisible()) {
            return
        }
        const $rowsTables = this._rowsView.getTableElements();
        const $viewTables = view.getTableElements();
        each($rowsTables, ((index, tableElement) => {
            let $tableBody;
            const $rowsTable = $(tableElement);
            const $viewTable = $viewTables.eq(index);
            if ($viewTable && $viewTable.length) {
                if (isBestFit) {
                    $tableBody = $viewTable.children("tbody").appendTo($rowsTable)
                } else {
                    $tableBody = $rowsTable.children(`.${className}`).appendTo($viewTable)
                }
                $tableBody.toggleClass(className, isBestFit);
                $tableBody.toggleClass(this.addWidgetPrefix("best-fit"), isBestFit)
            }
        }))
    }
    _toggleBestFitMode(isBestFit) {
        const $rowsTable = this._rowsView.getTableElement();
        const $rowsFixedTable = this._rowsView.getTableElements().eq(1);
        if (!$rowsTable) {
            return
        }
        $rowsTable.css("tableLayout", isBestFit ? "auto" : "fixed");
        $rowsTable.children("colgroup").css("display", isBestFit ? "none" : "");
        each($rowsFixedTable.find("tr.dx-group-row"), ((idx, item) => {
            $(item).css("display", isBestFit ? "none" : "")
        }));
        $rowsFixedTable.toggleClass(this.addWidgetPrefix("table-fixed"), !isBestFit);
        this._toggleBestFitModeForView(this._columnHeadersView, "dx-header", isBestFit);
        this._toggleBestFitModeForView(this._footerView, "dx-footer", isBestFit);
        if (this._needStretch()) {
            $rowsTable.get(0).style.width = isBestFit ? "auto" : ""
        }
    }
    _toggleContentMinHeight(value) {
        const scrollable = this._rowsView.getScrollable();
        const $contentElement = this._rowsView._findContentElement();
        if (false === (null === scrollable || void 0 === scrollable ? void 0 : scrollable.option("useNative"))) {
            if (true === value) {
                this._prevContentMinHeight = $contentElement.get(0).style.minHeight
            }
            if (isDefined(this._prevContentMinHeight)) {
                $contentElement.css({
                    minHeight: value ? gridCoreUtils.getContentHeightLimit(browser) : this._prevContentMinHeight
                })
            }
        }
    }
    _synchronizeColumns() {
        const columnsController = this._columnsController;
        const visibleColumns = columnsController.getVisibleColumns();
        const columnAutoWidth = this.option("columnAutoWidth");
        const wordWrapEnabled = this.option("wordWrapEnabled");
        const hasUndefinedColumnWidth = visibleColumns.some((column => !isDefined(column.width)));
        let needBestFit = this._needBestFit();
        let hasMinWidth = false;
        let resetBestFitMode;
        let isColumnWidthsCorrected = false;
        let resultWidths = [];
        let focusedElement;
        let selectionRange;
        !needBestFit && each(visibleColumns, ((index, column) => {
            if ("auto" === column.width) {
                needBestFit = true;
                return false
            }
            return
        }));
        each(visibleColumns, ((index, column) => {
            if (column.minWidth) {
                hasMinWidth = true;
                return false
            }
            return
        }));
        this._setVisibleWidths(visibleColumns, []);
        const $element = this.component.$element();
        if (needBestFit) {
            focusedElement = domAdapter.getActiveElement($element.get(0));
            selectionRange = gridCoreUtils.getSelectionRange(focusedElement);
            this._toggleBestFitMode(true);
            resetBestFitMode = true
        }
        this._toggleContentMinHeight(wordWrapEnabled);
        if ($element && $element.get(0) && this._maxWidth) {
            delete this._maxWidth;
            $element[0].style.maxWidth = ""
        }
        deferUpdate((() => {
            if (needBestFit) {
                resultWidths = this._getBestFitWidths();
                each(visibleColumns, ((index, column) => {
                    const columnId = columnsController.getColumnId(column);
                    columnsController.columnOption(columnId, "bestFitWidth", resultWidths[index], true)
                }))
            } else if (hasMinWidth) {
                resultWidths = this._getBestFitWidths()
            }
            each(visibleColumns, (function(index) {
                const {
                    width: width
                } = this;
                if ("auto" !== width) {
                    if (isDefined(width)) {
                        resultWidths[index] = isNumeric(width) || isPixelWidth(width) ? parseFloat(width) : width
                    } else if (!columnAutoWidth) {
                        resultWidths[index] = void 0
                    }
                }
            }));
            if (resetBestFitMode) {
                this._toggleBestFitMode(false);
                resetBestFitMode = false;
                if (focusedElement && focusedElement !== domAdapter.getActiveElement()) {
                    const isFocusOutsideWindow = getBoundingRect(focusedElement).bottom < 0;
                    if (!isFocusOutsideWindow) {
                        restoreFocus(focusedElement, selectionRange)
                    }
                }
            }
            isColumnWidthsCorrected = this._correctColumnWidths(resultWidths, visibleColumns);
            if (columnAutoWidth) {
                ! function() {
                    let expandColumnWidth;
                    each(visibleColumns, ((index, column) => {
                        if ("groupExpand" === column.type) {
                            expandColumnWidth = resultWidths[index]
                        }
                    }));
                    each(visibleColumns, ((index, column) => {
                        if ("groupExpand" === column.type && expandColumnWidth) {
                            resultWidths[index] = expandColumnWidth
                        }
                    }))
                }();
                if (this._needStretch()) {
                    this._processStretch(resultWidths, visibleColumns)
                }
            }
            deferRender((() => {
                if (needBestFit || isColumnWidthsCorrected || hasUndefinedColumnWidth) {
                    this._setVisibleWidths(visibleColumns, resultWidths)
                }
                if (wordWrapEnabled) {
                    this._toggleContentMinHeight(false)
                }
            }))
        }))
    }
    _needBestFit() {
        return this.option("columnAutoWidth")
    }
    _needStretch() {
        return this._columnsController.getVisibleColumns().some((c => "auto" === c.width && !c.command))
    }
    _getAverageColumnsWidth(resultWidths) {
        const freeWidth = calculateFreeWidth(this, resultWidths);
        const columnCountWithoutWidth = resultWidths.filter((width => void 0 === width)).length;
        return freeWidth / columnCountWithoutWidth
    }
    _correctColumnWidths(resultWidths, visibleColumns) {
        const that = this;
        let i;
        let hasPercentWidth = false;
        let hasAutoWidth = false;
        let isColumnWidthsCorrected = false;
        const $element = that.component.$element();
        const hasWidth = that._hasWidth;
        for (i = 0; i < visibleColumns.length; i++) {
            const index = i;
            const column = visibleColumns[index];
            const isHiddenColumn = "adaptiveHidden" === resultWidths[index];
            let width = resultWidths[index];
            const {
                minWidth: minWidth
            } = column;
            if (minWidth) {
                if (void 0 === width) {
                    const averageColumnsWidth = that._getAverageColumnsWidth(resultWidths);
                    width = averageColumnsWidth
                } else if (isPercentWidth(width)) {
                    const freeWidth = calculateFreeWidthWithCurrentMinWidth(that, index, minWidth, resultWidths);
                    if (freeWidth < 0) {
                        width = -1
                    }
                }
            }
            const realColumnWidth = that._getRealColumnWidth(index, resultWidths.map(((columnWidth, columnIndex) => index === columnIndex ? width : columnWidth)));
            if (minWidth && !isHiddenColumn && realColumnWidth < minWidth) {
                resultWidths[index] = minWidth;
                isColumnWidthsCorrected = true;
                i = -1
            }
            if (!isDefined(column.width)) {
                hasAutoWidth = true
            }
            if (isPercentWidth(column.width)) {
                hasPercentWidth = true
            }
        }
        if (!hasAutoWidth && resultWidths.length) {
            const $rowsViewElement = that._rowsView.element();
            const contentWidth = that._rowsView.contentWidth();
            const scrollbarWidth = that._rowsView.getScrollbarWidth();
            const totalWidth = that._getTotalWidth(resultWidths, contentWidth);
            if (totalWidth < contentWidth) {
                const lastColumnIndex = gridCoreUtils.getLastResizableColumnIndex(visibleColumns, resultWidths);
                if (lastColumnIndex >= 0) {
                    resultWidths[lastColumnIndex] = "auto";
                    isColumnWidthsCorrected = true;
                    if (false === hasWidth && !hasPercentWidth) {
                        const borderWidth = that.option("showBorders") ? Math.ceil(getOuterWidth($rowsViewElement) - getInnerWidth($rowsViewElement)) : 0;
                        that._maxWidth = totalWidth + scrollbarWidth + borderWidth;
                        $element.css("maxWidth", that._maxWidth)
                    }
                }
            }
        }
        return isColumnWidthsCorrected
    }
    _processStretch(resultSizes, visibleColumns) {
        const groupSize = this._rowsView.contentWidth();
        const tableSize = this._getTotalWidth(resultSizes, groupSize);
        const unusedIndexes = {
            length: 0
        };
        if (!resultSizes.length) {
            return
        }
        each(visibleColumns, (function(index) {
            if (this.width || "adaptiveHidden" === resultSizes[index]) {
                unusedIndexes[index] = true;
                unusedIndexes.length++
            }
        }));
        const diff = groupSize - tableSize;
        const diffElement = Math.floor(diff / (resultSizes.length - unusedIndexes.length));
        let onePixelElementsCount = diff - diffElement * (resultSizes.length - unusedIndexes.length);
        if (diff >= 0) {
            for (let i = 0; i < resultSizes.length; i++) {
                if (unusedIndexes[i]) {
                    continue
                }
                resultSizes[i] += diffElement;
                if (onePixelElementsCount > 0) {
                    if (onePixelElementsCount < 1) {
                        resultSizes[i] += onePixelElementsCount;
                        onePixelElementsCount = 0
                    } else {
                        resultSizes[i]++;
                        onePixelElementsCount--
                    }
                }
            }
        }
    }
    _getRealColumnWidth(columnIndex, columnWidths, groupWidth) {
        let ratio = 1;
        const width = columnWidths[columnIndex];
        if (!isPercentWidth(width)) {
            return parseFloat(width)
        }
        const percentTotalWidth = columnWidths.reduce(((sum, width, index) => {
            if (!isPercentWidth(width)) {
                return sum
            }
            return sum + parseFloat(width)
        }), 0);
        const pixelTotalWidth = columnWidths.reduce(((sum, width) => {
            if (!width || "adaptiveHidden" === width || isPercentWidth(width)) {
                return sum
            }
            return sum + parseFloat(width)
        }), 0);
        groupWidth = groupWidth || this._rowsView.contentWidth();
        const freeSpace = groupWidth - pixelTotalWidth;
        const percentTotalWidthInPixel = percentTotalWidth * groupWidth / 100;
        if (pixelTotalWidth > 0 && percentTotalWidthInPixel + pixelTotalWidth >= groupWidth) {
            ratio = percentTotalWidthInPixel > freeSpace ? freeSpace / percentTotalWidthInPixel : 1
        }
        return parseFloat(width) * groupWidth * ratio / 100
    }
    _getTotalWidth(widths, groupWidth) {
        let result = 0;
        for (let i = 0; i < widths.length; i++) {
            const width = widths[i];
            if (width && "adaptiveHidden" !== width) {
                result += this._getRealColumnWidth(i, widths, groupWidth)
            }
        }
        return Math.ceil(result)
    }
    _getGroupElement() {
        return this.component.$element().children().get(0)
    }
    updateSize(rootElement) {
        const that = this;
        const $rootElement = $(rootElement);
        const importantMarginClass = that.addWidgetPrefix("important-margin");
        if (void 0 === that._hasHeight && $rootElement && $rootElement.is(":visible") && getWidth($rootElement)) {
            const $groupElement = $rootElement.children(`.${that.getWidgetContainerClass()}`);
            if ($groupElement.length) {
                $groupElement.detach()
            }
            that._hasHeight = !!getHeight($rootElement);
            const width = getWidth($rootElement);
            $rootElement.addClass(importantMarginClass);
            that._hasWidth = getWidth($rootElement) === width;
            $rootElement.removeClass(importantMarginClass);
            if ($groupElement.length) {
                $groupElement.appendTo($rootElement)
            }
        }
    }
    publicMethods() {
        return ["resize", "updateDimensions"]
    }
    _waitAsyncTemplates() {
        var _this$_columnHeadersV, _this$_rowsView, _this$_footerView;
        return when(null === (_this$_columnHeadersV = this._columnHeadersView) || void 0 === _this$_columnHeadersV ? void 0 : _this$_columnHeadersV.waitAsyncTemplates(true), null === (_this$_rowsView = this._rowsView) || void 0 === _this$_rowsView ? void 0 : _this$_rowsView.waitAsyncTemplates(true), null === (_this$_footerView = this._footerView) || void 0 === _this$_footerView ? void 0 : _this$_footerView.waitAsyncTemplates(true))
    }
    resize() {
        if (this.component._requireResize) {
            return
        }
        const d = new Deferred;
        this._waitAsyncTemplates().done((() => {
            when(this.updateDimensions()).done(d.resolve).fail(d.reject)
        })).fail(d.reject);
        return d.promise()
    }
    updateDimensions(checkSize) {
        const that = this;
        that._initPostRenderHandlers();
        if (!that._checkSize(checkSize)) {
            return
        }
        const prevResult = that._resizeDeferred;
        const result = that._resizeDeferred = new Deferred;
        when(prevResult).always((() => {
            deferRender((() => {
                if (that._dataController.isLoaded()) {
                    that._synchronizeColumns()
                }
                that._resetGroupElementHeight();
                deferUpdate((() => {
                    deferRender((() => {
                        deferUpdate((() => {
                            that._updateDimensionsCore()
                        }))
                    }))
                }))
            })).done(result.resolve).fail(result.reject)
        }));
        return result.promise()
    }
    _resetGroupElementHeight() {
        const groupElement = this._getGroupElement();
        const scrollable = this._rowsView.getScrollable();
        if (groupElement && groupElement.style.height && (!scrollable || !scrollable.scrollTop())) {
            groupElement.style.height = ""
        }
    }
    _checkSize(checkSize) {
        const $rootElement = this.component.$element();
        const isWidgetVisible = $rootElement.is(":visible");
        const isGridSizeChanged = this._lastWidth !== getWidth($rootElement) || this._lastHeight !== getHeight($rootElement) || this._devicePixelRatio !== getWindow().devicePixelRatio;
        return isWidgetVisible && (!checkSize || isGridSizeChanged)
    }
    _setScrollerSpacingCore() {
        const that = this;
        const vScrollbarWidth = that._rowsView.getScrollbarWidth();
        const hScrollbarWidth = that._rowsView.getScrollbarWidth(true);
        deferRender((() => {
            that._columnHeadersView && that._columnHeadersView.setScrollerSpacing(vScrollbarWidth);
            that._footerView && that._footerView.setScrollerSpacing(vScrollbarWidth);
            that._rowsView.setScrollerSpacing(vScrollbarWidth, hScrollbarWidth)
        }))
    }
    _setScrollerSpacing() {
        const scrollable = this._rowsView.getScrollable();
        const isNativeScrolling = true === this.option("scrolling.useNative");
        if (!scrollable || isNativeScrolling) {
            deferRender((() => {
                deferUpdate((() => {
                    this._setScrollerSpacingCore()
                }))
            }))
        } else {
            this._setScrollerSpacingCore()
        }
    }
    _setAriaOwns() {
        var _this$_columnHeadersV2, _this$_footerView2, _this$_rowsView2;
        const headerTable = null === (_this$_columnHeadersV2 = this._columnHeadersView) || void 0 === _this$_columnHeadersV2 ? void 0 : _this$_columnHeadersV2.getTableElement();
        const footerTable = null === (_this$_footerView2 = this._footerView) || void 0 === _this$_footerView2 ? void 0 : _this$_footerView2.getTableElement();
        null === (_this$_rowsView2 = this._rowsView) || void 0 === _this$_rowsView2 || _this$_rowsView2.setAriaOwns(null === headerTable || void 0 === headerTable ? void 0 : headerTable.attr("id"), null === footerTable || void 0 === footerTable ? void 0 : footerTable.attr("id"))
    }
    _updateDimensionsCore() {
        const that = this;
        const dataController = that._dataController;
        const rowsView = that._rowsView;
        const $rootElement = that.component.$element();
        const groupElement = this._getGroupElement();
        const rootElementHeight = getHeight($rootElement);
        const height = that.option("height") ?? $rootElement.get(0).style.height;
        const isHeightSpecified = !!height && "auto" !== height;
        const maxHeight = parseInt($rootElement.css("maxHeight"));
        const maxHeightHappened = maxHeight && rootElementHeight >= maxHeight;
        const isMaxHeightApplied = groupElement && groupElement.scrollHeight === groupElement.offsetHeight;
        that.updateSize($rootElement);
        deferRender((() => {
            const hasHeight = that._hasHeight || !!maxHeight || isHeightSpecified;
            rowsView.hasHeight(hasHeight);
            this._setAriaOwns();
            if (maxHeightHappened && !isMaxHeightApplied) {
                $(groupElement).css("height", maxHeight)
            }
            if (!dataController.isLoaded()) {
                rowsView.setLoading(dataController.isLoading());
                return
            }
            deferUpdate((() => {
                that._updateLastSizes($rootElement);
                that._setScrollerSpacing();
                each(VIEW_NAMES, ((index, viewName) => {
                    const view = that.getView(viewName);
                    if (view) {
                        view.resize()
                    }
                }));
                this._editorFactoryController && this._editorFactoryController.resize()
            }))
        }))
    }
    _updateLastSizes($rootElement) {
        this._lastWidth = getWidth($rootElement);
        this._lastHeight = getHeight($rootElement);
        this._devicePixelRatio = getWindow().devicePixelRatio
    }
    optionChanged(args) {
        switch (args.name) {
            case "width":
            case "height":
                this.component._renderDimensions();
                this.resize();
            case "renderAsync":
                args.handled = true;
                return;
            default:
                super.optionChanged(args)
        }
    }
}
export class SynchronizeScrollingController extends modules.ViewController {
    _scrollChangedHandler(views, pos, viewName) {
        for (let j = 0; j < views.length; j++) {
            if (views[j] && views[j].name !== viewName) {
                views[j].scrollTo({
                    left: pos.left,
                    top: pos.top
                })
            }
        }
    }
    init() {
        const views = [this.getView("columnHeadersView"), this.getView("footerView"), this.getView("rowsView")];
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            if (view) {
                view.scrollChanged.add(this._scrollChangedHandler.bind(this, views))
            }
        }
    }
}
export class GridView extends modules.View {
    init() {
        this._resizingController = this.getController("resizing");
        this._dataController = this.getController("data")
    }
    _endUpdateCore() {
        if (this.component._requireResize) {
            this.component._requireResize = false;
            this._resizingController.resize()
        }
    }
    getView(name) {
        return this.component._views[name]
    }
    element() {
        return this._groupElement
    }
    optionChanged(args) {
        const that = this;
        if (isDefined(that._groupElement) && "showBorders" === args.name) {
            that._groupElement.toggleClass(that.addWidgetPrefix("borders"), !!args.value);
            args.handled = true
        } else {
            super.optionChanged(args)
        }
    }
    _renderViews($groupElement) {
        const that = this;
        each(VIEW_NAMES, ((index, viewName) => {
            const view = that.getView(viewName);
            if (view) {
                view.render($groupElement)
            }
        }))
    }
    _getTableRoleName() {
        return "group"
    }
    render($rootElement) {
        const isFirstRender = !this._groupElement;
        const $groupElement = this._groupElement || $("<div>").addClass(this.getWidgetContainerClass());
        $groupElement.addClass("dx-gridbase-container");
        $groupElement.toggleClass(this.addWidgetPrefix("borders"), !!this.option("showBorders"));
        this.setAria("role", "presentation", $rootElement);
        this.component.setAria("role", this._getTableRoleName(), $groupElement);
        this._rootElement = $rootElement || this._rootElement;
        if (isFirstRender) {
            this._groupElement = $groupElement;
            hasWindow() && this._resizingController.updateSize($rootElement);
            $groupElement.appendTo($rootElement)
        }
        if (!this._a11yGeneralStatusElement) {
            this._a11yGeneralStatusElement = A11yStatusContainerComponent({});
            this._a11yGeneralStatusElement.attr(E2E_ATTRIBUTES.a11yStatusContainer, "true");
            this._rootElement.append(this._a11yGeneralStatusElement)
        }
        this._renderViews($groupElement)
    }
    update() {
        const that = this;
        const $rootElement = that._rootElement;
        const $groupElement = that._groupElement;
        if ($rootElement && $groupElement) {
            this._resizingController.resize();
            if (that._dataController.isLoaded()) {
                that._resizingController.fireContentReadyAction()
            }
        }
    }
    setWidgetA11yStatusText(statusText) {
        var _this$_a11yGeneralSta;
        null === (_this$_a11yGeneralSta = this._a11yGeneralStatusElement) || void 0 === _this$_a11yGeneralSta || _this$_a11yGeneralSta.text(statusText)
    }
}
export const gridViewModule = {
    defaultOptions: () => ({
        showBorders: false,
        renderAsync: false
    }),
    controllers: {
        resizing: ResizingController,
        synchronizeScrolling: SynchronizeScrollingController
    },
    views: {
        gridView: GridView
    },
    VIEW_NAMES: VIEW_NAMES
};

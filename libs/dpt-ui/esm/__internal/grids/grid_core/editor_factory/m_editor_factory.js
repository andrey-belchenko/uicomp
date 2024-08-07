/**
 * DevExtreme (esm/__internal/grids/grid_core/editor_factory/m_editor_factory.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import positionUtils from "../../../../animation/position";
import domAdapter from "../../../../core/dom_adapter";
import $ from "../../../../core/renderer";
import browser from "../../../../core/utils/browser";
import {
    extend
} from "../../../../core/utils/extend";
import {
    getBoundingRect
} from "../../../../core/utils/position";
import {
    getOuterHeight,
    getOuterWidth,
    setOuterHeight,
    setOuterWidth
} from "../../../../core/utils/size";
import {
    name as clickEventName
} from "../../../../events/click";
import eventsEngine from "../../../../events/core/events_engine";
import pointerEvents from "../../../../events/pointer";
import {
    addNamespace,
    normalizeKeyName
} from "../../../../events/utils/index";
import EditorFactoryMixin from "../../../../ui/shared/ui.editor_factory_mixin";
import modules from "../m_modules";
import gridCoreUtils from "../m_utils";
const EDITOR_INLINE_BLOCK = "dx-editor-inline-block";
const CELL_FOCUS_DISABLED_CLASS = "dx-cell-focus-disabled";
const CELL_MODIFIED_CLASS = "dx-cell-modified";
const CELL_INVALID_CLASS = "invalid";
const FOCUSED_CELL_MODIFIED_CLASS = "dx-focused-cell-modified";
const FOCUSED_CELL_INVALID_CLASS = "dx-focused-cell-invalid";
const FOCUS_OVERLAY_CLASS = "focus-overlay";
const CONTENT_CLASS = "content";
const FOCUSED_ELEMENT_CLASS = "dx-focused";
const ROW_CLASS = "dx-row";
const MODULE_NAMESPACE = "dxDataGridEditorFactory";
const UPDATE_FOCUS_EVENTS = addNamespace([pointerEvents.down, "focusin", clickEventName].join(" "), MODULE_NAMESPACE);
const DX_HIDDEN = "dx-hidden";
const ViewControllerWithMixin = EditorFactoryMixin(modules.ViewController);
export class EditorFactory extends ViewControllerWithMixin {
    init() {
        this.createAction("onEditorPreparing", {
            excludeValidators: ["disabled", "readOnly"],
            category: "rendering"
        });
        this.createAction("onEditorPrepared", {
            excludeValidators: ["disabled", "readOnly"],
            category: "rendering"
        });
        this._columnsResizerController = this.getController("columnsResizer");
        this._editingController = this.getController("editing");
        this._keyboardNavigationController = this.getController("keyboardNavigation");
        this._columnsController = this.getController("columns");
        this._validatingController = this.getController("validating");
        this._rowsView = this.getView("rowsView");
        this._updateFocusHandler = this._updateFocusHandler || this.createAction(this._updateFocus.bind(this));
        this._subscribedContainerRoot = this._getContainerRoot();
        eventsEngine.on(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler);
        this._attachContainerEventHandlers()
    }
    dispose() {
        clearTimeout(this._focusTimeoutID);
        clearTimeout(this._updateFocusTimeoutID);
        eventsEngine.off(this._subscribedContainerRoot, UPDATE_FOCUS_EVENTS, this._updateFocusHandler)
    }
    _getFocusedElement($dataGridElement) {
        const rowSelector = this.option("focusedRowEnabled") ? "tr[tabindex]:focus" : "tr[tabindex]:not(.dx-data-row):focus";
        const focusedElementSelector = ["td[tabindex]:focus", `${rowSelector}`, "input:focus", "button:focus", "textarea:focus", "div[tabindex]:focus", ".dx-lookup-field:focus", ".dx-checkbox:focus", ".dx-switch:focus", ".dx-dropdownbutton .dx-buttongroup:focus", ".dx-adaptive-item-text:focus"].join(",");
        const $focusedElement = $dataGridElement.find(focusedElementSelector);
        return this.elementIsInsideGrid($focusedElement) && $focusedElement
    }
    _getFocusCellSelector() {
        return ".dx-row > td"
    }
    _updateFocusCore() {
        const $dataGridElement = this.component && this.component.$element();
        if ($dataGridElement) {
            let $focus = this._getFocusedElement($dataGridElement);
            if ($focus && $focus.length) {
                let isHideBorder;
                if (!$focus.hasClass("dx-cell-focus-disabled") && !$focus.hasClass("dx-row")) {
                    const $focusCell = $focus.closest(`${this._getFocusCellSelector()}, .dx-cell-focus-disabled`);
                    if ($focusCell.get(0) !== $focus.get(0)) {
                        isHideBorder = this._needHideBorder($focusCell);
                        $focus = $focusCell
                    }
                }
                if ($focus.length && !$focus.hasClass("dx-cell-focus-disabled")) {
                    this.focus($focus, isHideBorder);
                    return
                }
            }
        }
        this.loseFocus()
    }
    _needHideBorder($element) {
        const rowsViewElement = this._rowsView.element();
        const isRowsView = $element.closest(rowsViewElement).length > 0;
        const isEditing = this._editingController.isEditing();
        return $element.hasClass(EDITOR_INLINE_BLOCK) || isRowsView && !isEditing
    }
    _updateFocus(e) {
        const that = this;
        const isFocusOverlay = e && e.event && $(e.event.target).hasClass(that.addWidgetPrefix("focus-overlay"));
        that._isFocusOverlay = that._isFocusOverlay || isFocusOverlay;
        clearTimeout(that._updateFocusTimeoutID);
        that._updateFocusTimeoutID = setTimeout((() => {
            delete that._updateFocusTimeoutID;
            if (!that._isFocusOverlay) {
                that._updateFocusCore()
            }
            that._isFocusOverlay = false
        }))
    }
    _updateFocusOverlaySize($element, position) {
        $element.hide();
        const location = positionUtils.calculate($element, extend({
            collision: "fit"
        }, position));
        if (location.h.oversize > 0) {
            setOuterWidth($element, getOuterWidth($element) - location.h.oversize)
        }
        if (location.v.oversize > 0) {
            setOuterHeight($element, getOuterHeight($element) - location.v.oversize)
        }
        $element.show()
    }
    callbackNames() {
        return ["focused"]
    }
    focus($element, isHideBorder) {
        const that = this;
        if (void 0 === $element) {
            return that._$focusedElement
        }
        if ($element) {
            if (!$element.is(that._$focusedElement)) {
                that._$focusedElement && that._$focusedElement.removeClass("dx-focused")
            }
            that._$focusedElement = $element;
            clearTimeout(that._focusTimeoutID);
            that._focusTimeoutID = setTimeout((() => {
                delete that._focusTimeoutID;
                that.renderFocusOverlay($element, isHideBorder);
                $element.addClass("dx-focused");
                that.focused.fire($element)
            }))
        }
    }
    refocus() {
        const $focus = this.focus();
        this.focus($focus)
    }
    renderFocusOverlay($element, isHideBorder) {
        const that = this;
        if (!gridCoreUtils.isElementInCurrentGrid(this, $element)) {
            return
        }
        if (!that._$focusOverlay) {
            that._$focusOverlay = $("<div>").addClass(that.addWidgetPrefix("focus-overlay"))
        }
        if (isHideBorder) {
            that._$focusOverlay.addClass(DX_HIDDEN)
        } else if ($element.length) {
            const align = browser.mozilla ? "right bottom" : "left top";
            const $content = $element.closest(`.${that.addWidgetPrefix("content")}`);
            const elemCoord = getBoundingRect($element.get(0));
            const isFocusedCellInvalid = $element.hasClass(this.addWidgetPrefix("invalid"));
            const isFocusedCellModified = $element.hasClass("dx-cell-modified") && !isFocusedCellInvalid;
            that._$focusOverlay.removeClass(DX_HIDDEN).toggleClass("dx-focused-cell-invalid", isFocusedCellInvalid).toggleClass("dx-focused-cell-modified", isFocusedCellModified).appendTo($content);
            setOuterHeight(that._$focusOverlay, elemCoord.bottom - elemCoord.top + 1);
            setOuterWidth(that._$focusOverlay, elemCoord.right - elemCoord.left + 1);
            const focusOverlayPosition = {
                precise: true,
                my: align,
                at: align,
                of: $element,
                boundary: $content.length && $content
            };
            that._updateFocusOverlaySize(that._$focusOverlay, focusOverlayPosition);
            positionUtils.setup(that._$focusOverlay, focusOverlayPosition);
            that._$focusOverlay.css("visibility", "visible")
        }
    }
    resize() {
        const $focusedElement = this._$focusedElement;
        if ($focusedElement) {
            this.focus($focusedElement)
        }
    }
    loseFocus(skipValidator) {
        this._$focusedElement && this._$focusedElement.removeClass("dx-focused");
        this._$focusedElement = null;
        this._$focusOverlay && this._$focusOverlay.addClass(DX_HIDDEN)
    }
    _getContainerRoot() {
        var _this$component;
        const $container = null === (_this$component = this.component) || void 0 === _this$component ? void 0 : _this$component.$element();
        const root = domAdapter.getRootNode(null === $container || void 0 === $container ? void 0 : $container.get(0));
        if (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && !root.host) {
            return domAdapter.getDocument()
        }
        return root
    }
    _attachContainerEventHandlers() {
        const that = this;
        const $container = that.component && that.component.$element();
        if ($container) {
            eventsEngine.on($container, addNamespace("keydown", MODULE_NAMESPACE), (e => {
                if ("tab" === normalizeKeyName(e)) {
                    that._updateFocusHandler(e)
                }
            }))
        }
    }
}
export const editorFactoryModule = {
    defaultOptions: () => ({}),
    controllers: {
        editorFactory: EditorFactory
    }
};

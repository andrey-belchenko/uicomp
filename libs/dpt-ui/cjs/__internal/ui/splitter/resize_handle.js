/**
 * DevExtreme (cjs/__internal/ui/splitter/resize_handle.js)
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
exports.default = exports.RESIZE_HANDLE_CLASS = void 0;
var _guid = _interopRequireDefault(require("../../../core/guid"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _click = require("../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _double_click = require("../../../events/double_click");
var _drag = require("../../../events/drag");
var _index = require("../../../events/utils/index");
var _message = _interopRequireDefault(require("../../../localization/message"));
var _widget = _interopRequireDefault(require("../widget"));
var _event = require("./utils/event");

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
const RESIZE_HANDLE_CLASS = exports.RESIZE_HANDLE_CLASS = "dx-resize-handle";
const RESIZE_HANDLE_RESIZABLE_CLASS = "dx-resize-handle-resizable";
const HORIZONTAL_DIRECTION_CLASS = "dx-resize-handle-horizontal";
const VERTICAL_DIRECTION_CLASS = "dx-resize-handle-vertical";
const RESIZE_HANDLE_ICON_CLASS = "dx-resize-handle-icon";
const RESIZE_HANDLE_COLLAPSE_PREV_PANE_CLASS = "dx-resize-handle-collapse-prev-pane";
const RESIZE_HANDLE_COLLAPSE_NEXT_PANE_CLASS = "dx-resize-handle-collapse-next-pane";
const ICON_CLASS = "dx-icon";
const STATE_INVISIBLE_CLASS = "dx-state-invisible";
const RESIZE_HANDLER_MODULE_NAMESPACE = "dxResizeHandle";
const KEYBOARD_DELTA = 5;
const DEFAULT_RESIZE_HANDLE_SIZE = 8;
const INACTIVE_RESIZE_HANDLE_SIZE = 2;
const RESIZE_DIRECTION = {
    horizontal: "horizontal",
    vertical: "vertical"
};
class ResizeHandle extends _widget.default {
    _supportedKeys() {
        return _extends({}, super._supportedKeys(), {
            rightArrow(e) {
                e.preventDefault();
                e.stopPropagation();
                const {
                    direction: direction,
                    showCollapseNext: showCollapseNext,
                    showCollapsePrev: showCollapsePrev,
                    rtlEnabled: rtlEnabled
                } = this.option();
                const forbidCollapseNext = rtlEnabled ? false === showCollapsePrev : false === showCollapseNext;
                if ((0, _index.isCommandKeyPressed)(e)) {
                    if (direction === RESIZE_DIRECTION.vertical || forbidCollapseNext) {
                        return
                    }
                    if (rtlEnabled) {
                        this._collapsePrevHandler(e)
                    } else {
                        this._collapseNextHandler(e)
                    }
                } else {
                    this._resizeBy(e, {
                        x: 5
                    })
                }
            },
            leftArrow(e) {
                e.preventDefault();
                e.stopPropagation();
                const {
                    direction: direction,
                    showCollapsePrev: showCollapsePrev,
                    showCollapseNext: showCollapseNext,
                    rtlEnabled: rtlEnabled
                } = this.option();
                const forbidCollapsePrev = rtlEnabled ? false === showCollapseNext : false === showCollapsePrev;
                if ((0, _index.isCommandKeyPressed)(e)) {
                    if (direction === RESIZE_DIRECTION.vertical || forbidCollapsePrev) {
                        return
                    }
                    if (rtlEnabled) {
                        this._collapseNextHandler(e)
                    } else {
                        this._collapsePrevHandler(e)
                    }
                } else {
                    this._resizeBy(e, {
                        x: -5
                    })
                }
            },
            upArrow(e) {
                e.preventDefault();
                e.stopPropagation();
                const {
                    direction: direction,
                    showCollapsePrev: showCollapsePrev
                } = this.option();
                if ((0, _index.isCommandKeyPressed)(e)) {
                    if (direction === RESIZE_DIRECTION.horizontal || false === showCollapsePrev) {
                        return
                    }
                    this._collapsePrevHandler(e)
                } else {
                    this._resizeBy(e, {
                        y: -5
                    })
                }
            },
            downArrow(e) {
                e.preventDefault();
                e.stopPropagation();
                const {
                    direction: direction,
                    showCollapseNext: showCollapseNext
                } = this.option();
                if ((0, _index.isCommandKeyPressed)(e)) {
                    if (direction === RESIZE_DIRECTION.horizontal || false === showCollapseNext) {
                        return
                    }
                    this._collapseNextHandler(e)
                } else {
                    this._resizeBy(e, {
                        y: 5
                    })
                }
            }
        })
    }
    _getDefaultOptions() {
        return _extends({}, super._getDefaultOptions(), {
            direction: RESIZE_DIRECTION.horizontal,
            hoverStateEnabled: true,
            focusStateEnabled: true,
            activeStateEnabled: true,
            onResize: void 0,
            onResizeEnd: void 0,
            onResizeStart: void 0,
            resizable: true,
            showCollapsePrev: true,
            showCollapseNext: true,
            onCollapsePrev: void 0,
            onCollapseNext: void 0,
            separatorSize: 8
        })
    }
    _init() {
        super._init();
        const namespace = `dxResizeHandle${new _guid.default}`;
        this.RESIZE_START_EVENT_NAME = (0, _index.addNamespace)(_drag.start, namespace);
        this.RESIZE_EVENT_NAME = (0, _index.addNamespace)(_drag.move, namespace);
        this.RESIZE_END_EVENT_NAME = (0, _index.addNamespace)(_drag.end, namespace);
        this.CLICK_EVENT_NAME = (0, _index.addNamespace)(_click.name, namespace);
        this.DOUBLE_CLICK_EVENT_NAME = (0, _index.addNamespace)(_double_click.name, namespace)
    }
    _initMarkup() {
        super._initMarkup();
        this._renderResizeHandleContent();
        this._setAriaAttributes()
    }
    _renderResizeHandleContent() {
        const {
            resizable: resizable
        } = this.option();
        (0, _renderer.default)(this.element()).addClass(RESIZE_HANDLE_CLASS);
        (0, _renderer.default)(this.element()).toggleClass("dx-resize-handle-resizable", resizable);
        this._toggleDirectionClass();
        this._updateDimensions();
        this._$collapsePrevButton = (0, _renderer.default)("<div>").addClass(this._getIconClass("prev")).appendTo(this.$element());
        this._$resizeHandle = (0, _renderer.default)("<div>").addClass(this._getIconClass("icon")).appendTo(this.$element());
        this._$collapseNextButton = (0, _renderer.default)("<div>").addClass(this._getIconClass("next")).appendTo(this.$element());
        this._setCollapseButtonsVisibility();
        this._setResizeIconVisibility()
    }
    _updateIconsClasses() {
        var _this$_$collapsePrevB, _this$_$resizeHandle, _this$_$collapseNextB;
        const isHorizontal = this._isHorizontalDirection();
        const rtlEnabled = this.option("rtlEnabled");
        null === (_this$_$collapsePrevB = this._$collapsePrevButton) || void 0 === _this$_$collapsePrevB || _this$_$collapsePrevB.removeClass(this._getCollapseIconClass(false, !isHorizontal, !!rtlEnabled)).addClass(this._getCollapseIconClass(false, isHorizontal, !!rtlEnabled));
        null === (_this$_$resizeHandle = this._$resizeHandle) || void 0 === _this$_$resizeHandle || _this$_$resizeHandle.removeClass(this._getResizeIconClass(!isHorizontal)).addClass(this._getResizeIconClass(isHorizontal));
        null === (_this$_$collapseNextB = this._$collapseNextButton) || void 0 === _this$_$collapseNextB || _this$_$collapseNextB.removeClass(this._getCollapseIconClass(true, !isHorizontal, !!rtlEnabled)).addClass(this._getCollapseIconClass(true, isHorizontal, !!rtlEnabled))
    }
    _updateDimensions() {
        const isHorizontal = this._isHorizontalDirection();
        const dimension = isHorizontal ? "width" : "height";
        const inverseDimension = isHorizontal ? "height" : "width";
        this.option(inverseDimension, null);
        this.option(dimension, this.getSize())
    }
    _isInactive() {
        const {
            resizable: resizable,
            showCollapseNext: showCollapseNext,
            showCollapsePrev: showCollapsePrev
        } = this.option();
        return false === resizable && false === showCollapseNext && false === showCollapsePrev
    }
    _getIconClass(iconType) {
        const isHorizontal = this._isHorizontalDirection();
        const rtlEnabled = this.option("rtlEnabled");
        switch (iconType) {
            case "prev":
                return `dx-resize-handle-collapse-prev-pane dx-icon ${this._getCollapseIconClass(false,isHorizontal,!!rtlEnabled)}`;
            case "next":
                return `dx-resize-handle-collapse-next-pane dx-icon ${this._getCollapseIconClass(true,isHorizontal,!!rtlEnabled)}`;
            case "icon":
                return `dx-resize-handle-icon dx-icon ${this._getResizeIconClass(isHorizontal)}`;
            default:
                return ""
        }
    }
    _getResizeIconClass(isHorizontal) {
        return "dx-icon-handle" + (isHorizontal ? "vertical" : "horizontal")
    }
    _getCollapseIconClass(isNextButton, isHorizontal, rtlEnabled) {
        const horizontalDirection = isNextButton === rtlEnabled ? "left" : "right";
        const verticalDirection = isNextButton ? "down" : "up";
        return `dx-icon-triangle${isHorizontal?horizontalDirection:verticalDirection}`
    }
    _setCollapseButtonsVisibility() {
        var _this$_$collapsePrevB2, _this$_$collapseNextB2;
        const {
            showCollapsePrev: showCollapsePrev,
            showCollapseNext: showCollapseNext
        } = this.option();
        null === (_this$_$collapsePrevB2 = this._$collapsePrevButton) || void 0 === _this$_$collapsePrevB2 || _this$_$collapsePrevB2.toggleClass("dx-state-invisible", !showCollapsePrev);
        null === (_this$_$collapseNextB2 = this._$collapseNextButton) || void 0 === _this$_$collapseNextB2 || _this$_$collapseNextB2.toggleClass("dx-state-invisible", !showCollapseNext)
    }
    _setResizeIconVisibility() {
        var _this$_$resizeHandle2;
        const {
            resizable: resizable
        } = this.option();
        null === (_this$_$resizeHandle2 = this._$resizeHandle) || void 0 === _this$_$resizeHandle2 || _this$_$resizeHandle2.toggleClass("dx-state-invisible", !resizable)
    }
    _setAriaAttributes() {
        this.setAria({
            role: "application",
            roledescription: "separator",
            label: _message.default.format("dxSplitter-resizeHandleAriaLabel")
        })
    }
    _toggleDirectionClass() {
        (0, _renderer.default)(this.element()).toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
        (0, _renderer.default)(this.element()).toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection())
    }
    _render() {
        super._render();
        this._attachEventHandlers()
    }
    _resizeStartHandler(e) {
        this._getAction(_event.RESIZE_EVENT.onResizeStart)({
            event: e
        })
    }
    _resizeHandler(e) {
        this._getAction(_event.RESIZE_EVENT.onResize)({
            event: e
        })
    }
    _resizeEndHandler(e) {
        this._getAction(_event.RESIZE_EVENT.onResizeEnd)({
            event: e
        })
    }
    _collapsePrevHandler(e) {
        this._getAction(_event.COLLAPSE_EVENT.onCollapsePrev)({
            event: e
        })
    }
    _collapseNextHandler(e) {
        this._getAction(_event.COLLAPSE_EVENT.onCollapseNext)({
            event: e
        })
    }
    _resizeBy(e) {
        let offset = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
            x: 0,
            y: 0
        };
        const {
            resizable: resizable
        } = this.option();
        if (false === resizable) {
            return
        }
        e.offset = offset;
        this._resizeStartHandler(e);
        this._resizeHandler(e);
        this._resizeEndHandler(e)
    }
    _createEventAction(eventName) {
        const actionName = (0, _event.getActionNameByEventName)(eventName);
        this[actionName] = this._createActionByOption(eventName, {
            excludeValidators: ["disabled", "readOnly"]
        })
    }
    _getAction(eventName) {
        const actionName = (0, _event.getActionNameByEventName)(eventName);
        if (!this[actionName]) {
            this._createEventAction(eventName)
        }
        return this[actionName]
    }
    _attachEventHandlers() {
        this._attachResizeEventHandlers();
        this._attachPointerEventHandlers()
    }
    _attachResizeEventHandlers() {
        const {
            resizable: resizable,
            direction: direction
        } = this.option();
        if (resizable) {
            const eventData = {
                direction: direction,
                immediate: true
            };
            _events_engine.default.on(this.$element(), this.RESIZE_START_EVENT_NAME, eventData, this._resizeStartHandler.bind(this));
            _events_engine.default.on(this.$element(), this.RESIZE_EVENT_NAME, eventData, this._resizeHandler.bind(this));
            _events_engine.default.on(this.$element(), this.RESIZE_END_EVENT_NAME, eventData, this._resizeEndHandler.bind(this))
        }
    }
    _attachPointerEventHandlers() {
        const {
            showCollapsePrev: showCollapsePrev,
            showCollapseNext: showCollapseNext
        } = this.option();
        if (true === showCollapsePrev || true === showCollapseNext) {
            _events_engine.default.on(this.$element(), this.DOUBLE_CLICK_EVENT_NAME, this._doubleClickHandler.bind(this))
        }
        if (true === showCollapsePrev) {
            _events_engine.default.on(this._$collapsePrevButton, this.CLICK_EVENT_NAME, this._collapsePrevHandler.bind(this))
        }
        if (true === showCollapseNext) {
            _events_engine.default.on(this._$collapseNextButton, this.CLICK_EVENT_NAME, this._collapseNextHandler.bind(this))
        }
    }
    _detachEventHandlers() {
        this._detachResizeEventHandlers();
        this._detachPointerEventHandlers()
    }
    _detachResizeEventHandlers() {
        _events_engine.default.off(this.$element(), this.RESIZE_START_EVENT_NAME);
        _events_engine.default.off(this.$element(), this.RESIZE_EVENT_NAME);
        _events_engine.default.off(this.$element(), this.RESIZE_END_EVENT_NAME)
    }
    _detachPointerEventHandlers() {
        _events_engine.default.off(this.$element(), this.DOUBLE_CLICK_EVENT_NAME);
        _events_engine.default.off(this._$collapsePrevButton, this.CLICK_EVENT_NAME);
        _events_engine.default.off(this._$collapseNextButton, this.CLICK_EVENT_NAME)
    }
    _doubleClickHandler(e) {
        const {
            showCollapsePrev: showCollapsePrev,
            showCollapseNext: showCollapseNext
        } = this.option();
        if (true === showCollapsePrev) {
            this._collapsePrevHandler(e)
        } else if (true === showCollapseNext) {
            this._collapseNextHandler(e)
        }
    }
    _isHorizontalDirection() {
        return this.option("direction") === RESIZE_DIRECTION.horizontal
    }
    _clean() {
        this._detachResizeEventHandlers();
        this._detachPointerEventHandlers();
        super._clean()
    }
    _optionChanged(args) {
        const {
            name: name,
            value: value
        } = args;
        switch (name) {
            case "direction":
                this._toggleDirectionClass();
                this._detachResizeEventHandlers();
                this._attachResizeEventHandlers();
                this._updateDimensions();
                this._updateIconsClasses();
                break;
            case "resizable":
                this._setResizeIconVisibility();
                (0, _renderer.default)(this.element()).toggleClass("dx-resize-handle-resizable", !!value);
                this._detachResizeEventHandlers();
                this._attachResizeEventHandlers();
                this._updateDimensions();
                break;
            case "separatorSize":
                this._updateDimensions();
                break;
            case "showCollapsePrev":
            case "showCollapseNext":
                this._setCollapseButtonsVisibility();
                this._setResizeIconVisibility();
                this._updateDimensions();
                this._detachPointerEventHandlers();
                this._attachPointerEventHandlers();
                break;
            case "onCollapsePrev":
            case "onCollapseNext":
            case "onResize":
            case "onResizeStart":
            case "onResizeEnd":
                this._createEventAction(name);
                break;
            default:
                super._optionChanged(args)
        }
    }
    getSize() {
        const {
            separatorSize: separatorSize
        } = this.option();
        if (this._isInactive()) {
            return 2
        }
        return void 0 !== separatorSize && Number.isFinite(separatorSize) && separatorSize >= 0 ? separatorSize : 8
    }
    isInactive() {
        return this._isInactive()
    }
}
var _default = exports.default = ResizeHandle;
/**
 * DevExtreme (cjs/mobile/init_mobile_viewport/init_mobile_viewport.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.initMobileViewport = void 0;
var _size = require("../../core/utils/size");
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _extend = require("../../core/utils/extend");
var _resize_callbacks = _interopRequireDefault(require("../../core/utils/resize_callbacks"));
var _support = require("../../core/utils/support");
var _style = require("../../core/utils/style");
var _devices = _interopRequireDefault(require("../../core/devices"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
const window = (0, _window.getWindow)();
const initMobileViewport = function(options) {
    options = (0, _extend.extend)({}, options);
    let realDevice = _devices.default.real();
    const allowZoom = options.allowZoom;
    const allowPan = options.allowPan;
    const allowSelection = "allowSelection" in options ? options.allowSelection : "generic" === realDevice.platform;
    if (!(0, _renderer.default)("meta[name=viewport]").length) {
        (0, _renderer.default)("<meta>").attr("name", "viewport").appendTo("head")
    }
    const metaVerbs = ["width=device-width"];
    const msTouchVerbs = [];
    if (allowZoom) {
        msTouchVerbs.push("pinch-zoom")
    } else {
        metaVerbs.push("initial-scale=1.0", "maximum-scale=1.0, user-scalable=no")
    }
    if (allowPan) {
        msTouchVerbs.push("pan-x", "pan-y")
    }
    if (!allowPan && !allowZoom) {
        (0, _renderer.default)("html, body").css({
            msContentZooming: "none",
            msUserSelect: "none",
            overflow: "hidden"
        })
    } else {
        (0, _renderer.default)("html").css("msOverflowStyle", "-ms-autohiding-scrollbar")
    }
    if (!allowSelection && (0, _support.supportProp)("userSelect")) {
        (0, _renderer.default)(".dx-viewport").css((0, _style.styleProp)("userSelect"), "none")
    }(0, _renderer.default)("meta[name=viewport]").attr("content", metaVerbs.join());
    (0, _renderer.default)("html").css("msTouchAction", msTouchVerbs.join(" ") || "none");
    realDevice = _devices.default.real();
    if (_support.touch) {
        _events_engine.default.off(_dom_adapter.default.getDocument(), ".dxInitMobileViewport");
        _events_engine.default.on(_dom_adapter.default.getDocument(), "dxpointermove.dxInitMobileViewport", (function(e) {
            const count = e.pointers.length;
            const isTouchEvent = "touch" === e.pointerType;
            const zoomDisabled = !allowZoom && count > 1;
            const panDisabled = !allowPan && 1 === count && !e.isScrollingEvent;
            if (isTouchEvent && (zoomDisabled || panDisabled)) {
                e.preventDefault()
            }
        }))
    }
    if (realDevice.ios) {
        const isPhoneGap = "file:" === _dom_adapter.default.getLocation().protocol;
        if (!isPhoneGap) {
            _resize_callbacks.default.add((function() {
                const windowWidth = (0, _size.getWidth)(window);
                (0, _size.setWidth)((0, _renderer.default)("body"), windowWidth)
            }))
        }
    }
    if (realDevice.android) {
        _resize_callbacks.default.add((function() {
            setTimeout((function() {
                const activeElement = _dom_adapter.default.getActiveElement();
                activeElement.scrollIntoViewIfNeeded ? activeElement.scrollIntoViewIfNeeded() : activeElement.scrollIntoView(false)
            }))
        }))
    }
};
exports.initMobileViewport = initMobileViewport;

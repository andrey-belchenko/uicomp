/**
 * DevExtreme (esm/mobile/init_mobile_viewport/init_mobile_viewport.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    getWidth,
    setWidth
} from "../../core/utils/size";
import $ from "../../core/renderer";
import domAdapter from "../../core/dom_adapter";
import {
    getWindow
} from "../../core/utils/window";
const window = getWindow();
import eventsEngine from "../../events/core/events_engine";
import {
    extend
} from "../../core/utils/extend";
import resizeCallbacks from "../../core/utils/resize_callbacks";
import {
    supportProp,
    touch
} from "../../core/utils/support";
import {
    styleProp
} from "../../core/utils/style";
import devices from "../../core/devices";
export const initMobileViewport = function(options) {
    options = extend({}, options);
    let realDevice = devices.real();
    const allowZoom = options.allowZoom;
    const allowPan = options.allowPan;
    const allowSelection = "allowSelection" in options ? options.allowSelection : "generic" === realDevice.platform;
    if (!$("meta[name=viewport]").length) {
        $("<meta>").attr("name", "viewport").appendTo("head")
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
        $("html, body").css({
            msContentZooming: "none",
            msUserSelect: "none",
            overflow: "hidden"
        })
    } else {
        $("html").css("msOverflowStyle", "-ms-autohiding-scrollbar")
    }
    if (!allowSelection && supportProp("userSelect")) {
        $(".dx-viewport").css(styleProp("userSelect"), "none")
    }
    $("meta[name=viewport]").attr("content", metaVerbs.join());
    $("html").css("msTouchAction", msTouchVerbs.join(" ") || "none");
    realDevice = devices.real();
    if (touch) {
        eventsEngine.off(domAdapter.getDocument(), ".dxInitMobileViewport");
        eventsEngine.on(domAdapter.getDocument(), "dxpointermove.dxInitMobileViewport", (function(e) {
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
        const isPhoneGap = "file:" === domAdapter.getLocation().protocol;
        if (!isPhoneGap) {
            resizeCallbacks.add((function() {
                const windowWidth = getWidth(window);
                setWidth($("body"), windowWidth)
            }))
        }
    }
    if (realDevice.android) {
        resizeCallbacks.add((function() {
            setTimeout((function() {
                const activeElement = domAdapter.getActiveElement();
                activeElement.scrollIntoViewIfNeeded ? activeElement.scrollIntoViewIfNeeded() : activeElement.scrollIntoView(false)
            }))
        }))
    }
};

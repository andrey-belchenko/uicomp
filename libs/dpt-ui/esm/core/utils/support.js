/**
 * DevExtreme (esm/core/utils/support.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import domAdapter from "../dom_adapter";
import callOnce from "./call_once";
import {
    getNavigator,
    hasProperty
} from "./window";
import devices from "../devices";
import {
    stylePropPrefix,
    styleProp
} from "./style";
const {
    maxTouchPoints: maxTouchPoints
} = getNavigator();
const transitionEndEventNames = {
    webkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    OTransition: "oTransitionEnd",
    transition: "transitionend"
};
const supportProp = function(prop) {
    return !!styleProp(prop)
};
const isNativeScrollingSupported = function() {
    const {
        platform: platform,
        mac: isMac
    } = devices.real();
    const isNativeScrollDevice = "ios" === platform || "android" === platform || isMac;
    return isNativeScrollDevice
};
const inputType = function(type) {
    if ("text" === type) {
        return true
    }
    const input = domAdapter.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value
    } catch (e) {
        return false
    }
};
const detectTouchEvents = function(hasWindowProperty, maxTouchPoints) {
    return (hasWindowProperty("ontouchstart") || !!maxTouchPoints) && !hasWindowProperty("callPhantom")
};
const detectPointerEvent = function(hasWindowProperty) {
    return hasWindowProperty("PointerEvent")
};
const touchEvents = detectTouchEvents(hasProperty, maxTouchPoints);
const pointerEvents = detectPointerEvent(hasProperty);
const touchPointersPresent = !!maxTouchPoints;
export {
    touchEvents,
    pointerEvents,
    styleProp,
    stylePropPrefix,
    supportProp,
    inputType
};
export const touch = touchEvents || pointerEvents && touchPointersPresent;
export const transition = callOnce((function() {
    return supportProp("transition")
}));
export const transitionEndEventName = callOnce((function() {
    return transitionEndEventNames[styleProp("transition")]
}));
export const animation = callOnce((function() {
    return supportProp("animation")
}));
export const nativeScrolling = isNativeScrollingSupported();

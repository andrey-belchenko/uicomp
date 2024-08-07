/**
 * DevExtreme (esm/events/utils/index.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../core/renderer";
import mappedAddNamespace from "./add_namespace";
import eventsEngine from "../core/events_engine";
import {
    each
} from "../../core/utils/iterator";
import {
    extend
} from "../../core/utils/extend";
import {
    focused
} from "../../ui/widget/selectors";
const KEY_MAP = {
    backspace: "backspace",
    tab: "tab",
    enter: "enter",
    escape: "escape",
    pageup: "pageUp",
    pagedown: "pageDown",
    end: "end",
    home: "home",
    arrowleft: "leftArrow",
    arrowup: "upArrow",
    arrowright: "rightArrow",
    arrowdown: "downArrow",
    delete: "del",
    " ": "space",
    f: "F",
    a: "A",
    "*": "asterisk",
    "-": "minus",
    alt: "alt",
    control: "control",
    shift: "shift"
};
const LEGACY_KEY_CODES = {
    8: "backspace",
    9: "tab",
    13: "enter",
    27: "escape",
    33: "pageUp",
    34: "pageDown",
    35: "end",
    36: "home",
    37: "leftArrow",
    38: "upArrow",
    39: "rightArrow",
    40: "downArrow",
    46: "del",
    32: "space",
    70: "F",
    65: "A",
    106: "asterisk",
    109: "minus",
    189: "minus",
    173: "minus",
    16: "shift",
    17: "control",
    18: "alt"
};
const EVENT_SOURCES_REGEX = {
    dx: /^dx/i,
    mouse: /(mouse|wheel)/i,
    touch: /^touch/i,
    keyboard: /^key/i,
    pointer: /^(ms)?pointer/i
};
let fixMethod = e => e;
const copyEvent = originalEvent => fixMethod(eventsEngine.Event(originalEvent, originalEvent), originalEvent);
const isDxEvent = e => "dx" === eventSource(e);
const isNativeMouseEvent = e => "mouse" === eventSource(e);
const isNativeTouchEvent = e => "touch" === eventSource(e);
export const eventSource = _ref => {
    let {
        type: type
    } = _ref;
    let result = "other";
    each(EVENT_SOURCES_REGEX, (function(key) {
        if (this.test(type)) {
            result = key;
            return false
        }
    }));
    return result
};
export const isPointerEvent = e => "pointer" === eventSource(e);
export const isMouseEvent = e => isNativeMouseEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && "mouse" === e.pointerType;
export const isDxMouseWheelEvent = e => e && "dxmousewheel" === e.type;
export const isTouchEvent = e => isNativeTouchEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && "touch" === e.pointerType;
export const isKeyboardEvent = e => "keyboard" === eventSource(e);
export const isFakeClickEvent = _ref2 => {
    let {
        screenX: screenX,
        offsetX: offsetX,
        pageX: pageX
    } = _ref2;
    return 0 === screenX && !offsetX && 0 === pageX
};
export const eventData = _ref3 => {
    let {
        pageX: pageX,
        pageY: pageY,
        timeStamp: timeStamp
    } = _ref3;
    return {
        x: pageX,
        y: pageY,
        time: timeStamp
    }
};
export const eventDelta = (from, to) => ({
    x: to.x - from.x,
    y: to.y - from.y,
    time: to.time - from.time || 1
});
export const hasTouches = e => {
    const {
        originalEvent: originalEvent,
        pointers: pointers
    } = e;
    if (isNativeTouchEvent(e)) {
        return (originalEvent.touches || []).length
    }
    if (isDxEvent(e)) {
        return (pointers || []).length
    }
    return 0
};
let skipEvents = false;
export const forceSkipEvents = () => skipEvents = true;
export const stopEventsSkipping = () => skipEvents = false;
export const needSkipEvent = e => {
    if (skipEvents) {
        return true
    }
    const {
        target: target
    } = e;
    const $target = $(target);
    const isContentEditable = (null === target || void 0 === target ? void 0 : target.isContentEditable) || (null === target || void 0 === target ? void 0 : target.hasAttribute("contenteditable"));
    const touchInEditable = $target.is("input, textarea, select") || isContentEditable;
    if (isDxMouseWheelEvent(e)) {
        const isTextArea = $target.is("textarea") && $target.hasClass("dx-texteditor-input");
        if (isTextArea || isContentEditable) {
            return false
        }
        const isInputFocused = $target.is("input[type='number'], textarea, select") && $target.is(":focus");
        return isInputFocused
    }
    if (isMouseEvent(e)) {
        return touchInEditable || e.which > 1
    }
    if (isTouchEvent(e)) {
        return touchInEditable && focused($target)
    }
};
export const setEventFixMethod = func => fixMethod = func;
export const createEvent = (originalEvent, args) => {
    const event = copyEvent(originalEvent);
    args && extend(event, args);
    return event
};
export const fireEvent = props => {
    const {
        originalEvent: originalEvent,
        delegateTarget: delegateTarget
    } = props;
    const event = createEvent(originalEvent, props);
    eventsEngine.trigger(delegateTarget || event.target, event);
    return event
};
export const normalizeKeyName = _ref4 => {
    let {
        key: key,
        which: which
    } = _ref4;
    const normalizedKey = KEY_MAP[null === key || void 0 === key ? void 0 : key.toLowerCase()] || key;
    const normalizedKeyFromWhich = LEGACY_KEY_CODES[which];
    if (normalizedKeyFromWhich && normalizedKey === key) {
        return normalizedKeyFromWhich
    } else if (!normalizedKey && which) {
        return String.fromCharCode(which)
    }
    return normalizedKey
};
export const getChar = _ref5 => {
    let {
        key: key,
        which: which
    } = _ref5;
    return key || String.fromCharCode(which)
};
export const addNamespace = mappedAddNamespace;
export const isCommandKeyPressed = _ref6 => {
    let {
        ctrlKey: ctrlKey,
        metaKey: metaKey
    } = _ref6;
    return ctrlKey || metaKey
};

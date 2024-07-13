/**
 * DevExtreme (cjs/viz/range_selector/common.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.utils = exports.formatValue = exports.consts = exports.HEIGHT_COMPACT_MODE = void 0;
var _smart_formatter = require("../axes/smart_formatter");
var _type = require("../../core/utils/type");
const HEIGHT_COMPACT_MODE = exports.HEIGHT_COMPACT_MODE = 24;
const POINTER_SIZE = 4;
const EMPTY_SLIDER_MARKER_TEXT = ". . .";
const utils = exports.utils = {
    trackerSettings: {
        fill: "grey",
        stroke: "grey",
        opacity: 1e-4
    },
    animationSettings: {
        duration: 250
    }
};
const consts = exports.consts = {
    emptySliderMarkerText: ". . .",
    pointerSize: 4
};
const formatValue = function(value, formatOptions, tickIntervalsInfo, valueType, type, logarithmBase) {
    const formatObject = {
        value: value,
        valueText: (0, _smart_formatter.smartFormatter)(value, {
            labelOptions: formatOptions,
            ticks: tickIntervalsInfo ? tickIntervalsInfo.ticks : [],
            tickInterval: tickIntervalsInfo ? tickIntervalsInfo.tickInterval : void 0,
            dataType: valueType,
            type: type,
            logarithmBase: logarithmBase
        })
    };
    return String((0, _type.isFunction)(formatOptions.customizeText) ? formatOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText)
};
exports.formatValue = formatValue;

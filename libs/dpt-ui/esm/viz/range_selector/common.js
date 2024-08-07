/**
 * DevExtreme (esm/viz/range_selector/common.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    smartFormatter as _format
} from "../axes/smart_formatter";
import {
    isFunction
} from "../../core/utils/type";
export const HEIGHT_COMPACT_MODE = 24;
const POINTER_SIZE = 4;
const EMPTY_SLIDER_MARKER_TEXT = ". . .";
export const utils = {
    trackerSettings: {
        fill: "grey",
        stroke: "grey",
        opacity: 1e-4
    },
    animationSettings: {
        duration: 250
    }
};
export const consts = {
    emptySliderMarkerText: ". . .",
    pointerSize: 4
};
export const formatValue = function(value, formatOptions, tickIntervalsInfo, valueType, type, logarithmBase) {
    const formatObject = {
        value: value,
        valueText: _format(value, {
            labelOptions: formatOptions,
            ticks: tickIntervalsInfo ? tickIntervalsInfo.ticks : [],
            tickInterval: tickIntervalsInfo ? tickIntervalsInfo.tickInterval : void 0,
            dataType: valueType,
            type: type,
            logarithmBase: logarithmBase
        })
    };
    return String(isFunction(formatOptions.customizeText) ? formatOptions.customizeText.call(formatObject, formatObject) : formatObject.valueText)
};

/**
 * DevExtreme (esm/viz/core/utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    noop
} from "../../core/utils/common";
import {
    isDefined,
    isNumeric,
    isExponential,
    isFunction,
    isString
} from "../../core/utils/type";
import {
    extend
} from "../../core/utils/extend";
import {
    each
} from "../../core/utils/iterator";
import {
    adjust,
    sign
} from "../../core/utils/math";
import dateUtils from "../../core/utils/date";
import Color from "../../color";
const {
    PI: PI,
    LN10: LN10,
    abs: abs,
    log: log,
    floor: floor,
    ceil: ceil,
    pow: pow,
    sqrt: sqrt,
    atan2: atan2
} = Math;
const _min = Math.min;
const _max = Math.max;
const _cos = Math.cos;
const _sin = Math.sin;
const _round = Math.round;
const dateToMilliseconds = dateUtils.dateToMilliseconds;
const MAX_PIXEL_COUNT = 1e10;
const PI_DIV_180 = PI / 180;
const _isNaN = isNaN;
const _Number = Number;
const _NaN = NaN;
let numDefsSvgElements = 1;
export const PANE_PADDING = 10;
export const getLog = function(value, base) {
    if (!value) {
        return NaN
    }
    return log(value) / log(base)
};
export const getAdjustedLog10 = function(value) {
    return adjust(getLog(value, 10))
};
export const raiseTo = function(power, base) {
    return pow(base, power)
};
export const normalizeAngle = function(angle) {
    return (angle % 360 + 360) % 360
};
export const convertAngleToRendererSpace = function(angle) {
    return 90 - angle
};
export const degreesToRadians = function(value) {
    return PI * value / 180
};
export const getCosAndSin = function(angle) {
    const angleInRadians = degreesToRadians(angle);
    return {
        cos: _cos(angleInRadians),
        sin: _sin(angleInRadians)
    }
};
const DECIMAL_ORDER_THRESHOLD = 1e-14;
export const getDistance = function(x1, y1, x2, y2) {
    const diffX = x2 - x1;
    const diffY = y2 - y1;
    return sqrt(diffY * diffY + diffX * diffX)
};
export const getDecimalOrder = function(number) {
    let n = abs(number);
    let cn;
    if (!_isNaN(n)) {
        if (n > 0) {
            n = log(n) / LN10;
            cn = ceil(n);
            return cn - n < 1e-14 ? cn : floor(n)
        }
        return 0
    }
    return NaN
};
export const getAppropriateFormat = function(start, end, count) {
    const order = _max(getDecimalOrder(start), getDecimalOrder(end));
    let precision = -getDecimalOrder(abs(end - start) / count);
    let format;
    if (!_isNaN(order) && !_isNaN(precision)) {
        if (abs(order) <= 4) {
            format = "fixedPoint";
            precision < 0 && (precision = 0);
            precision > 4 && (precision = 4)
        } else {
            format = "exponential";
            precision += order - 1;
            precision > 3 && (precision = 3)
        }
        return {
            type: format,
            precision: precision
        }
    }
    return null
};
export const roundValue = function(value, precision) {
    if (precision > 20) {
        precision = 20
    }
    if (isNumeric(value)) {
        if (isExponential(value)) {
            return _Number(value.toExponential(precision))
        } else {
            return _Number(value.toFixed(precision))
        }
    }
};
export const getPower = function(value) {
    return value.toExponential().split("e")[1]
};
export function map(array, callback) {
    let i = 0;
    const len = array.length;
    const result = [];
    let value;
    while (i < len) {
        value = callback(array[i], i);
        if (null !== value) {
            result.push(value)
        }
        i++
    }
    return result
}

function selectByKeys(object, keys) {
    return map(keys, (key => object[key] ? object[key] : null))
}

function decreaseFields(object, keys, eachDecrease, decrease) {
    let dec = decrease;
    each(keys, ((_, key) => {
        if (object[key]) {
            object[key] -= eachDecrease;
            dec -= eachDecrease
        }
    }));
    return dec
}
export function normalizeEnum(value) {
    return String(value).toLowerCase()
}
export function setCanvasValues(canvas) {
    if (canvas) {
        canvas.originalTop = canvas.top;
        canvas.originalBottom = canvas.bottom;
        canvas.originalLeft = canvas.left;
        canvas.originalRight = canvas.right
    }
    return canvas
}

function normalizeBBoxField(value) {
    return -MAX_PIXEL_COUNT < value && value < +MAX_PIXEL_COUNT ? value : 0
}
export function normalizeBBox(bBox) {
    const xl = normalizeBBoxField(floor(bBox.x));
    const yt = normalizeBBoxField(floor(bBox.y));
    const xr = normalizeBBoxField(ceil(bBox.width + bBox.x));
    const yb = normalizeBBoxField(ceil(bBox.height + bBox.y));
    const result = {
        x: xl,
        y: yt,
        width: xr - xl,
        height: yb - yt
    };
    result.isEmpty = !result.x && !result.y && !result.width && !result.height;
    return result
}
export function rotateBBox(bBox, center, angle) {
    const cos = _Number(_cos(angle * PI_DIV_180).toFixed(3));
    const sin = _Number(_sin(angle * PI_DIV_180).toFixed(3));
    const w2 = bBox.width / 2;
    const h2 = bBox.height / 2;
    const centerX = bBox.x + w2;
    const centerY = bBox.y + h2;
    const w2_ = abs(w2 * cos) + abs(h2 * sin);
    const h2_ = abs(w2 * sin) + abs(h2 * cos);
    const centerX_ = center[0] + (centerX - center[0]) * cos + (centerY - center[1]) * sin;
    const centerY_ = center[1] - (centerX - center[0]) * sin + (centerY - center[1]) * cos;
    return normalizeBBox({
        x: centerX_ - w2_,
        y: centerY_ - h2_,
        width: 2 * w2_,
        height: 2 * h2_
    })
}
export const decreaseGaps = function(object, keys, decrease) {
    let arrayGaps;
    do {
        arrayGaps = selectByKeys(object, keys);
        arrayGaps.push(ceil(decrease / arrayGaps.length));
        decrease = decreaseFields(object, keys, _min.apply(null, arrayGaps), decrease)
    } while (decrease > 0 && arrayGaps.length > 1);
    return decrease
};
export const parseScalar = function(value, defaultValue) {
    return void 0 !== value ? value : defaultValue
};
export const enumParser = function(values) {
    const stored = {};
    let i;
    let ii;
    for (i = 0, ii = values.length; i < ii; ++i) {
        stored[normalizeEnum(values[i])] = 1
    }
    return function(value, defaultValue) {
        const _value = normalizeEnum(value);
        return stored[_value] ? _value : defaultValue
    }
};
export const patchFontOptions = function(options) {
    const fontOptions = {};
    each(options || {}, (function(key, value) {
        if (/^(cursor)$/i.test(key)) {} else if ("opacity" === key) {
            value = null
        } else if ("color" === key) {
            key = "fill";
            if ("opacity" in options) {
                const color = new Color(value);
                value = `rgba(${color.r},${color.g},${color.b},${options.opacity})`
            }
        } else {
            key = "font-" + key
        }
        fontOptions[key] = value
    }));
    return fontOptions
};
export function convertPolarToXY(centerCoords, startAngle, angle, radius) {
    const normalizedRadius = radius > 0 ? radius : 0;
    angle = isDefined(angle) ? angle + startAngle - 90 : 0;
    const cosSin = getCosAndSin(angle);
    return {
        x: _round(centerCoords.x + normalizedRadius * cosSin.cos),
        y: _round(centerCoords.y + normalizedRadius * cosSin.sin)
    }
}
export const convertXYToPolar = function(centerCoords, x, y) {
    const radius = getDistance(centerCoords.x, centerCoords.y, x, y);
    const angle = atan2(y - centerCoords.y, x - centerCoords.x);
    return {
        phi: _round(normalizeAngle(180 * angle / PI)),
        r: _round(radius)
    }
};
export const processSeriesTemplate = function(seriesTemplate, items) {
    const customizeSeries = isFunction(seriesTemplate.customizeSeries) ? seriesTemplate.customizeSeries : noop;
    const nameField = seriesTemplate.nameField;
    const generatedSeries = {};
    const seriesOrder = [];
    let series;
    let i = 0;
    let length;
    let data;
    items = items || [];
    for (length = items.length; i < length; i++) {
        data = items[i];
        if (nameField in data) {
            series = generatedSeries[data[nameField]];
            if (!series) {
                series = generatedSeries[data[nameField]] = {
                    name: data[nameField],
                    nameFieldValue: data[nameField]
                };
                seriesOrder.push(series.name)
            }
        }
    }
    return map(seriesOrder, (function(orderedName) {
        const group = generatedSeries[orderedName];
        return extend(group, customizeSeries.call(null, group.name))
    }))
};
export const getCategoriesInfo = function(categories, startValue, endValue) {
    if (0 === categories.length) {
        return {
            categories: []
        }
    }
    startValue = isDefined(startValue) ? startValue : categories[0];
    endValue = isDefined(endValue) ? endValue : categories[categories.length - 1];
    const categoriesValue = map(categories, (category => null === category || void 0 === category ? void 0 : category.valueOf()));
    let indexStartValue = categoriesValue.indexOf(startValue.valueOf());
    let indexEndValue = categoriesValue.indexOf(endValue.valueOf());
    let swapBuf;
    let inverted = false;
    indexStartValue < 0 && (indexStartValue = 0);
    indexEndValue < 0 && (indexEndValue = categories.length - 1);
    if (indexEndValue < indexStartValue) {
        swapBuf = indexEndValue;
        indexEndValue = indexStartValue;
        indexStartValue = swapBuf;
        inverted = true
    }
    const visibleCategories = categories.slice(indexStartValue, indexEndValue + 1);
    const lastIdx = visibleCategories.length - 1;
    return {
        categories: visibleCategories,
        start: visibleCategories[inverted ? lastIdx : 0],
        end: visibleCategories[inverted ? 0 : lastIdx],
        inverted: inverted
    }
};
export function isRelativeHeightPane(pane) {
    return !(pane.unit % 2)
}
export function normalizePanesHeight(panes) {
    panes.forEach((pane => {
        const height = pane.height;
        let unit = 0;
        let parsedHeight = parseFloat(height) || void 0;
        if (isString(height) && height.indexOf("px") > -1 || isNumeric(height) && height > 1) {
            parsedHeight = _round(parsedHeight);
            unit = 1
        }
        if (!unit && parsedHeight) {
            if (isString(height) && height.indexOf("%") > -1) {
                parsedHeight /= 100;
                unit = 2
            } else if (parsedHeight < 0) {
                parsedHeight = parsedHeight < -1 ? 1 : abs(parsedHeight)
            }
        }
        pane.height = parsedHeight;
        pane.unit = unit
    }));
    const relativeHeightPanes = panes.filter(isRelativeHeightPane);
    const weightSum = relativeHeightPanes.reduce(((prev, next) => prev + (next.height || 0)), 0);
    const weightHeightCount = relativeHeightPanes.length;
    const emptyHeightPanes = relativeHeightPanes.filter((pane => !pane.height));
    const emptyHeightCount = emptyHeightPanes.length;
    if (weightSum < 1 && emptyHeightCount) {
        emptyHeightPanes.forEach((pane => pane.height = (1 - weightSum) / emptyHeightCount))
    } else if (weightSum > 1 || weightSum < 1 && !emptyHeightCount || 1 === weightSum && emptyHeightCount) {
        if (emptyHeightCount) {
            const weightForEmpty = weightSum / weightHeightCount;
            const emptyWeightSum = emptyHeightCount * weightForEmpty;
            relativeHeightPanes.filter((pane => pane.height)).forEach((pane => pane.height *= (weightSum - emptyWeightSum) / weightSum));
            emptyHeightPanes.forEach((pane => pane.height = weightForEmpty))
        }
        relativeHeightPanes.forEach((pane => pane.height *= 1 / weightSum))
    }
}
export function updatePanesCanvases(panes, canvas, rotated) {
    let distributedSpace = 0;
    const paneSpace = rotated ? canvas.width - canvas.left - canvas.right : canvas.height - canvas.top - canvas.bottom;
    const totalCustomSpace = panes.reduce(((prev, cur) => prev + (!isRelativeHeightPane(cur) ? cur.height : 0)), 0);
    const usefulSpace = paneSpace - 10 * (panes.length - 1) - totalCustomSpace;
    const startName = rotated ? "left" : "top";
    const endName = rotated ? "right" : "bottom";
    panes.forEach((pane => {
        const calcLength = !isRelativeHeightPane(pane) ? pane.height : _round(pane.height * usefulSpace);
        pane.canvas = pane.canvas || {};
        extend(pane.canvas, canvas);
        pane.canvas[startName] = canvas[startName] + distributedSpace;
        pane.canvas[endName] = canvas[endName] + (paneSpace - calcLength - distributedSpace);
        distributedSpace = distributedSpace + calcLength + 10;
        setCanvasValues(pane.canvas)
    }))
}
export const unique = function(array) {
    const values = {};
    return map(array, (function(item) {
        const result = !values[item] ? item : null;
        values[item] = true;
        return result
    }))
};
export const getVerticallyShiftedAngularCoords = function(bBox, dy, center) {
    const isPositive = bBox.x + bBox.width / 2 >= center.x;
    const horizontalOffset1 = (isPositive ? bBox.x : bBox.x + bBox.width) - center.x;
    const verticalOffset1 = bBox.y - center.y;
    const verticalOffset2 = verticalOffset1 + dy;
    const horizontalOffset2 = _round(sqrt(horizontalOffset1 * horizontalOffset1 + verticalOffset1 * verticalOffset1 - verticalOffset2 * verticalOffset2));
    const dx = (isPositive ? +horizontalOffset2 : -horizontalOffset2) || horizontalOffset1;
    return {
        x: center.x + (isPositive ? dx : dx - bBox.width),
        y: bBox.y + dy
    }
};
export function mergeMarginOptions(opt1, opt2) {
    return {
        checkInterval: opt1.checkInterval || opt2.checkInterval,
        size: _max(opt1.size || 0, opt2.size || 0),
        percentStick: opt1.percentStick || opt2.percentStick,
        sizePointNormalState: _max(opt1.sizePointNormalState || 0, opt2.sizePointNormalState || 0)
    }
}
export function getVizRangeObject(value) {
    if (Array.isArray(value)) {
        return {
            startValue: value[0],
            endValue: value[1]
        }
    } else {
        return value || {}
    }
}
export function normalizeArcParams(x, y, innerRadius, outerRadius, startAngle, endAngle) {
    let isCircle;
    let noArc = true;
    const angleDiff = roundValue(endAngle, 3) - roundValue(startAngle, 3);
    if (angleDiff) {
        if (abs(angleDiff) % 360 === 0) {
            startAngle = 0;
            endAngle = 360;
            isCircle = true;
            endAngle -= .01
        }
        if (startAngle > 360) {
            startAngle %= 360
        }
        if (endAngle > 360) {
            endAngle %= 360
        }
        if (startAngle > endAngle) {
            startAngle -= 360
        }
        noArc = false
    }
    startAngle *= PI_DIV_180;
    endAngle *= PI_DIV_180;
    return [x, y, Math.min(outerRadius, innerRadius), Math.max(outerRadius, innerRadius), Math.cos(startAngle), Math.sin(startAngle), Math.cos(endAngle), Math.sin(endAngle), isCircle, floor(abs(endAngle - startAngle) / PI) % 2 ? "1" : "0", noArc]
}
export function convertVisualRangeObject(visualRange, convertToVisualRange) {
    if (convertToVisualRange) {
        return visualRange
    }
    return [visualRange.startValue, visualRange.endValue]
}
export function getAddFunction(range, correctZeroLevel) {
    if ("datetime" === range.dataType) {
        return function(rangeValue, marginValue) {
            let sign = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
            return new Date(rangeValue.getTime() + sign * marginValue)
        }
    }
    if ("logarithmic" === range.axisType) {
        return function(rangeValue, marginValue) {
            let sign = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
            const log = getLogExt(rangeValue, range.base) + sign * marginValue;
            return raiseToExt(log, range.base)
        }
    }
    return function(rangeValue, marginValue) {
        let sign = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
        const newValue = rangeValue + sign * marginValue;
        return correctZeroLevel && newValue * rangeValue <= 0 ? 0 : newValue
    }
}
export function adjustVisualRange(options, visualRange, wholeRange, dataRange) {
    const minDefined = isDefined(visualRange.startValue);
    const maxDefined = isDefined(visualRange.endValue);
    const nonDiscrete = "discrete" !== options.axisType;
    dataRange = dataRange || wholeRange;
    const add = getAddFunction(options, false);
    let min = minDefined ? visualRange.startValue : dataRange.min;
    let max = maxDefined ? visualRange.endValue : dataRange.max;
    let rangeLength = visualRange.length;
    const categories = dataRange.categories;
    if (nonDiscrete && !isDefined(min) && !isDefined(max)) {
        return {
            startValue: min,
            endValue: max
        }
    }
    if (isDefined(rangeLength)) {
        if (nonDiscrete) {
            if ("datetime" === options.dataType && !isNumeric(rangeLength)) {
                rangeLength = dateToMilliseconds(rangeLength)
            }
            if (maxDefined && !minDefined || !maxDefined && !minDefined) {
                isDefined(wholeRange.max) && (max = max > wholeRange.max ? wholeRange.max : max);
                min = add(max, rangeLength, -1)
            } else if (minDefined && !maxDefined) {
                isDefined(wholeRange.min) && (min = min < wholeRange.min ? wholeRange.min : min);
                max = add(min, rangeLength)
            }
        } else {
            rangeLength = parseInt(rangeLength);
            if (!isNaN(rangeLength) && isFinite(rangeLength)) {
                rangeLength--;
                if (!maxDefined && !minDefined) {
                    max = categories[categories.length - 1];
                    min = categories[categories.length - 1 - rangeLength]
                } else if (minDefined && !maxDefined) {
                    const categoriesInfo = getCategoriesInfo(categories, min, void 0);
                    max = categoriesInfo.categories[rangeLength]
                } else if (!minDefined && maxDefined) {
                    const categoriesInfo = getCategoriesInfo(categories, void 0, max);
                    min = categoriesInfo.categories[categoriesInfo.categories.length - 1 - rangeLength]
                }
            }
        }
    }
    if (nonDiscrete) {
        if (isDefined(wholeRange.max) && max > wholeRange.max) {
            max = wholeRange.max
        }
        if (isDefined(wholeRange.min) && min < wholeRange.min) {
            min = wholeRange.min
        }
    }
    return {
        startValue: min,
        endValue: max
    }
}
export function getLogExt(value, base) {
    let allowNegatives = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
    let linearThreshold = arguments.length > 3 ? arguments[3] : void 0;
    if (!allowNegatives) {
        return getLog(value, base)
    }
    if (0 === value) {
        return 0
    }
    const transformValue = getLog(abs(value), base) - (linearThreshold - 1);
    if (transformValue < 0) {
        return 0
    }
    return adjust(sign(value) * transformValue, Number(pow(base, linearThreshold - 1).toFixed(abs(linearThreshold))))
}
export function raiseToExt(value, base) {
    let allowNegatives = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : false;
    let linearThreshold = arguments.length > 3 ? arguments[3] : void 0;
    if (!allowNegatives) {
        return raiseTo(value, base)
    }
    if (0 === value) {
        return 0
    }
    const transformValue = raiseTo(abs(value) + (linearThreshold - 1), base);
    if (transformValue < 0) {
        return 0
    }
    return adjust(sign(value) * transformValue, Number(pow(base, linearThreshold).toFixed(abs(linearThreshold))))
}
export function rangesAreEqual(range, rangeFromOptions) {
    if (Array.isArray(rangeFromOptions)) {
        return range.length === rangeFromOptions.length && range.every(((item, i) => valueOf(item) === valueOf(rangeFromOptions[i])))
    } else {
        return valueOf(range.startValue) === valueOf(rangeFromOptions.startValue) && valueOf(range.endValue) === valueOf(rangeFromOptions.endValue)
    }
}
export function valueOf(value) {
    return value && value.valueOf()
}
export function pointInCanvas(canvas, x, y) {
    return x >= canvas.left && x <= canvas.right && y >= canvas.top && y <= canvas.bottom
}
export const getNextDefsSvgId = () => "DevExpress_" + numDefsSvgElements++;
export function extractColor(color, isBase) {
    if (isString(color) || !color) {
        return color
    } else if (isBase) {
        return color.base
    } else {
        return color.fillId || color.base
    }
}

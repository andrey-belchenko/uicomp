/**
 * DevExtreme (esm/viz/core/series_family.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isNumeric,
    isDefined
} from "../../core/utils/type";
import {
    extend
} from "../../core/utils/extend";
import {
    each as _each
} from "../../core/utils/iterator";
import {
    sign
} from "../../core/utils/math";
import {
    noop as _noop
} from "../../core/utils/common";
import {
    map as _map,
    normalizeEnum as _normalizeEnum
} from "./utils";
import dateUtils from "../../core/utils/date";
const {
    round: round,
    abs: abs,
    pow: pow,
    sqrt: sqrt
} = Math;
const _min = Math.min;
const DEFAULT_BAR_GROUP_PADDING = .3;

function validateBarPadding(barPadding) {
    return barPadding < 0 || barPadding > 1 ? void 0 : barPadding
}

function validateBarGroupPadding(barGroupPadding) {
    return barGroupPadding < 0 || barGroupPadding > 1 ? DEFAULT_BAR_GROUP_PADDING : barGroupPadding
}

function isStackExist(series, arg) {
    return series.some((function(s) {
        return !s.getOptions().ignoreEmptyPoints || s.getPointsByArg(arg, true).some((function(point) {
            return point.hasValue()
        }))
    }))
}

function correctStackCoordinates(series, currentStacks, arg, stack, parameters, barsArea, seriesStackIndexCallback) {
    series.forEach((function(series) {
        const stackIndex = seriesStackIndexCallback(currentStacks.indexOf(stack), currentStacks.length);
        const points = series.getPointsByArg(arg, true);
        const barPadding = validateBarPadding(series.getOptions().barPadding);
        const barWidth = series.getOptions().barWidth;
        let offset = getOffset(stackIndex, parameters);
        let width = parameters.width;
        let extraParameters;
        if (-1 === stackIndex) {
            return
        }
        if (isDefined(barPadding) || isDefined(barWidth)) {
            extraParameters = calculateParams(barsArea, currentStacks.length, 1 - barPadding, barWidth);
            width = extraParameters.width;
            if (!series.getBarOverlapGroup()) {
                offset = getOffset(stackIndex, extraParameters)
            }
        }
        correctPointCoordinates(points, width, offset)
    }))
}

function getStackName(series) {
    return series.getStackName() || series.getBarOverlapGroup()
}

function adjustBarSeriesDimensionsCore(series, options, seriesStackIndexCallback) {
    var _series$, _series$2;
    const commonStacks = [];
    const allArguments = [];
    const seriesInStacks = {};
    const barGroupWidth = options.barGroupWidth;
    const argumentAxis = null === (_series$ = series[0]) || void 0 === _series$ ? void 0 : _series$.getArgumentAxis();
    let interval;
    if (null !== (_series$2 = series[0]) && void 0 !== _series$2 && _series$2.useAggregation()) {
        var _series$3;
        const isDateArgAxis = "datetime" === (null === (_series$3 = series[0]) || void 0 === _series$3 ? void 0 : _series$3.argumentType);
        let tickInterval = argumentAxis.getTickInterval();
        let aggregationInterval = argumentAxis.getAggregationInterval();
        tickInterval = isDateArgAxis ? dateUtils.dateToMilliseconds(tickInterval) : tickInterval;
        aggregationInterval = isDateArgAxis ? dateUtils.dateToMilliseconds(aggregationInterval) : aggregationInterval;
        interval = aggregationInterval < tickInterval ? aggregationInterval : tickInterval
    }
    interval = null === argumentAxis || void 0 === argumentAxis ? void 0 : argumentAxis.getTranslator().getInterval(interval);
    const barsArea = barGroupWidth ? interval > barGroupWidth ? barGroupWidth : interval : interval * (1 - validateBarGroupPadding(options.barGroupPadding));
    series.forEach((function(s, i) {
        const stackName = getStackName(s) || i.toString();
        let argument;
        for (argument in s.pointsByArgument) {
            if (-1 === allArguments.indexOf(argument.valueOf())) {
                allArguments.push(argument.valueOf())
            }
        }
        if (-1 === commonStacks.indexOf(stackName)) {
            commonStacks.push(stackName);
            seriesInStacks[stackName] = []
        }
        seriesInStacks[stackName].push(s)
    }));
    allArguments.forEach((function(arg) {
        const currentStacks = commonStacks.reduce(((stacks, stack) => {
            if (isStackExist(seriesInStacks[stack], arg)) {
                stacks.push(stack)
            }
            return stacks
        }), []);
        const parameters = calculateParams(barsArea, currentStacks.length);
        commonStacks.forEach((stack => {
            correctStackCoordinates(seriesInStacks[stack], currentStacks, arg, stack, parameters, barsArea, seriesStackIndexCallback)
        }))
    }))
}

function calculateParams(barsArea, count, percentWidth, fixedBarWidth) {
    let spacing;
    let width;
    if (fixedBarWidth) {
        width = _min(fixedBarWidth, barsArea / count);
        spacing = count > 1 ? round((barsArea - round(width) * count) / (count - 1)) : 0
    } else if (isDefined(percentWidth)) {
        width = barsArea * percentWidth / count;
        spacing = count > 1 ? round((barsArea - barsArea * percentWidth) / (count - 1)) : 0
    } else {
        spacing = round(barsArea / count * .2);
        width = (barsArea - spacing * (count - 1)) / count
    }
    return {
        width: width > 1 ? round(width) : 1,
        spacing: spacing,
        middleIndex: count / 2,
        rawWidth: width
    }
}

function getOffset(stackIndex, parameters) {
    const width = parameters.rawWidth < 1 ? parameters.rawWidth : parameters.width;
    return (stackIndex - parameters.middleIndex + .5) * width - (parameters.middleIndex - stackIndex - .5) * parameters.spacing
}

function correctPointCoordinates(points, width, offset) {
    _each(points, (function(_, point) {
        point.correctCoordinates({
            width: width,
            offset: offset
        })
    }))
}

function getValueType(value) {
    return value >= 0 ? "positive" : "negative"
}

function getVisibleSeries(that) {
    return that.series.filter((function(s) {
        return s.isVisible()
    }))
}

function getAbsStackSumByArg(stackKeepers, stackName, argument) {
    const positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0;
    const negativeStackValue = -(stackKeepers.negative[stackName] || {})[argument] || 0;
    return positiveStackValue + negativeStackValue
}

function getStackSumByArg(stackKeepers, stackName, argument) {
    const positiveStackValue = (stackKeepers.positive[stackName] || {})[argument] || 0;
    const negativeStackValue = (stackKeepers.negative[stackName] || {})[argument] || 0;
    return positiveStackValue + negativeStackValue
}

function getSeriesStackIndexCallback(inverted) {
    if (!inverted) {
        return function(index) {
            return index
        }
    } else {
        return function(index, stackCount) {
            return stackCount - index - 1
        }
    }
}

function isInverted(series) {
    return series[0] && series[0].getArgumentAxis().getTranslator().isInverted()
}

function adjustBarSeriesDimensions() {
    const series = getVisibleSeries(this);
    adjustBarSeriesDimensionsCore(series, this._options, getSeriesStackIndexCallback(isInverted(series)))
}

function getFirstValueSign(series) {
    const points = series.getPoints();
    let value;
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        value = point.initialValue && point.initialValue.valueOf();
        if (abs(value) > 0) {
            break
        }
    }
    return sign(value)
}

function adjustStackedSeriesValues() {
    const negativesAsZeroes = this._options.negativesAsZeroes;
    const series = getVisibleSeries(this);
    const stackKeepers = {
        positive: {},
        negative: {}
    };
    const holesStack = {
        left: {},
        right: {}
    };
    const lastSeriesInPositiveStack = {};
    const lastSeriesInNegativeStack = {};
    series.forEach((function(singleSeries) {
        const stackName = getStackName(singleSeries);
        let hole = false;
        const stack = getFirstValueSign(singleSeries) < 0 ? lastSeriesInNegativeStack : lastSeriesInPositiveStack;
        singleSeries._prevSeries = stack[stackName];
        stack[stackName] = singleSeries;
        singleSeries.holes = extend(true, {}, holesStack);
        singleSeries.getPoints().forEach((function(point, index, points) {
            let value = point.initialValue && point.initialValue.valueOf();
            let argument = point.argument.valueOf();
            let stacks = value >= 0 ? stackKeepers.positive : stackKeepers.negative;
            const isNotBarSeries = "bar" !== singleSeries.type;
            if (negativesAsZeroes && value < 0) {
                stacks = stackKeepers.positive;
                value = 0;
                point.resetValue()
            }
            stacks[stackName] = stacks[stackName] || {};
            const currentStack = stacks[stackName];
            if (currentStack[argument]) {
                if (isNotBarSeries) {
                    point.correctValue(currentStack[argument])
                }
                currentStack[argument] += value
            } else {
                currentStack[argument] = value;
                if (isNotBarSeries) {
                    point.resetCorrection()
                }
            }
            if (!point.hasValue()) {
                const prevPoint = points[index - 1];
                if (!hole && prevPoint && prevPoint.hasValue()) {
                    argument = prevPoint.argument.valueOf();
                    prevPoint._skipSetRightHole = true;
                    holesStack.right[argument] = (holesStack.right[argument] || 0) + (prevPoint.value.valueOf() - (isFinite(prevPoint.minValue) ? prevPoint.minValue.valueOf() : 0))
                }
                hole = true
            } else if (hole) {
                hole = false;
                holesStack.left[argument] = (holesStack.left[argument] || 0) + (point.value.valueOf() - (isFinite(point.minValue) ? point.minValue.valueOf() : 0));
                point._skipSetLeftHole = true
            }
        }))
    }));
    series.forEach((function(singleSeries) {
        const holes = singleSeries.holes;
        singleSeries.getPoints().forEach((function(point) {
            const argument = point.argument.valueOf();
            point.resetHoles();
            !point._skipSetLeftHole && point.setHole(holes.left[argument] || holesStack.left[argument] && 0, "left");
            !point._skipSetRightHole && point.setHole(holes.right[argument] || holesStack.right[argument] && 0, "right");
            point._skipSetLeftHole = null;
            point._skipSetRightHole = null
        }))
    }));
    this._stackKeepers = stackKeepers;
    series.forEach((function(singleSeries) {
        singleSeries.getPoints().forEach((function(point) {
            const argument = point.argument.valueOf();
            const stackName = getStackName(singleSeries);
            const absTotal = getAbsStackSumByArg(stackKeepers, stackName, argument);
            const total = getStackSumByArg(stackKeepers, stackName, argument);
            point.setPercentValue(absTotal, total, holesStack.left[argument], holesStack.right[argument])
        }))
    }))
}

function updateStackedSeriesValues() {
    const that = this;
    const series = getVisibleSeries(that);
    const stack = that._stackKeepers;
    const stackKeepers = {
        positive: {},
        negative: {}
    };
    _each(series, (function(_, singleSeries) {
        const minBarSize = singleSeries.getOptions().minBarSize;
        const valueAxisTranslator = singleSeries.getValueAxis().getTranslator();
        const minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);
        const stackName = singleSeries.getStackName();
        _each(singleSeries.getPoints(), (function(index, point) {
            if (!point.hasValue()) {
                return
            }
            let value = point.initialValue && point.initialValue.valueOf();
            const argument = point.argument.valueOf();
            if (that.fullStacked) {
                value = value / getAbsStackSumByArg(stack, stackName, argument) || 0
            }
            const updateValue = valueAxisTranslator.checkMinBarSize(value, minShownBusinessValue, point.value);
            const valueType = getValueType(updateValue);
            const currentStack = stackKeepers[valueType][stackName] = stackKeepers[valueType][stackName] || {};
            if (currentStack[argument]) {
                point.minValue = currentStack[argument];
                currentStack[argument] += updateValue
            } else {
                currentStack[argument] = updateValue
            }
            point.value = currentStack[argument]
        }))
    }));
    if (that.fullStacked) {
        updateFullStackedSeriesValues(series, stackKeepers)
    }
}

function updateFullStackedSeriesValues(series, stackKeepers) {
    _each(series, (function(_, singleSeries) {
        const stackName = singleSeries.getStackName ? singleSeries.getStackName() : "default";
        _each(singleSeries.getPoints(), (function(index, point) {
            const stackSum = getAbsStackSumByArg(stackKeepers, stackName, point.argument.valueOf());
            if (0 !== stackSum) {
                point.value = point.value / stackSum;
                if (isNumeric(point.minValue)) {
                    point.minValue = point.minValue / stackSum
                }
            }
        }))
    }))
}

function updateRangeSeriesValues() {
    const series = getVisibleSeries(this);
    _each(series, (function(_, singleSeries) {
        const minBarSize = singleSeries.getOptions().minBarSize;
        const valueAxisTranslator = singleSeries.getValueAxis().getTranslator();
        const minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);
        if (minShownBusinessValue) {
            _each(singleSeries.getPoints(), (function(_, point) {
                if (!point.hasValue()) {
                    return
                }
                if (point.value.valueOf() - point.minValue.valueOf() < minShownBusinessValue) {
                    point.value = point.value.valueOf() + minShownBusinessValue / 2;
                    point.minValue = point.minValue.valueOf() - minShownBusinessValue / 2
                }
            }))
        }
    }))
}

function updateBarSeriesValues() {
    _each(this.series, (function(_, singleSeries) {
        const minBarSize = singleSeries.getOptions().minBarSize;
        const valueAxisTranslator = singleSeries.getValueAxis().getTranslator();
        const minShownBusinessValue = minBarSize && valueAxisTranslator.getMinBarSize(minBarSize);
        if (minShownBusinessValue) {
            _each(singleSeries.getPoints(), (function(index, point) {
                if (point.hasValue()) {
                    point.value = valueAxisTranslator.checkMinBarSize(point.initialValue, minShownBusinessValue)
                }
            }))
        }
    }))
}

function adjustCandlestickSeriesDimensions() {
    const series = getVisibleSeries(this);
    adjustBarSeriesDimensionsCore(series, {
        barGroupPadding: .3
    }, getSeriesStackIndexCallback(isInverted(series)))
}

function adjustBubbleSeriesDimensions() {
    const series = getVisibleSeries(this);
    if (!series.length) {
        return
    }
    const options = this._options;
    const visibleAreaX = series[0].getArgumentAxis().getVisibleArea();
    const visibleAreaY = series[0].getValueAxis().getVisibleArea();
    const min = _min(visibleAreaX[1] - visibleAreaX[0], visibleAreaY[1] - visibleAreaY[0]);
    const minBubbleArea = pow(options.minBubbleSize, 2);
    const maxBubbleArea = pow(min * options.maxBubbleSize, 2);
    const equalBubbleSize = (min * options.maxBubbleSize + options.minBubbleSize) / 2;
    let minPointSize = 1 / 0;
    let maxPointSize = -1 / 0;
    let pointSize;
    let bubbleArea;
    let sizeProportion;
    _each(series, (function(_, seriesItem) {
        _each(seriesItem.getPoints(), (function(_, point) {
            maxPointSize = maxPointSize > point.size ? maxPointSize : point.size;
            minPointSize = minPointSize < point.size ? minPointSize : point.size
        }))
    }));
    const sizeDispersion = maxPointSize - minPointSize;
    const areaDispersion = abs(maxBubbleArea - minBubbleArea);
    _each(series, (function(_, seriesItem) {
        _each(seriesItem.getPoints(), (function(_, point) {
            if (maxPointSize === minPointSize) {
                pointSize = round(equalBubbleSize)
            } else {
                sizeProportion = abs(point.size - minPointSize) / sizeDispersion;
                bubbleArea = areaDispersion * sizeProportion + minBubbleArea;
                pointSize = round(sqrt(bubbleArea))
            }
            point.correctCoordinates(pointSize)
        }))
    }))
}
export function SeriesFamily(options) {
    const that = this;
    that.type = _normalizeEnum(options.type);
    that.pane = options.pane;
    that.series = [];
    that.updateOptions(options);
    switch (that.type) {
        case "bar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.updateSeriesValues = updateBarSeriesValues;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            break;
        case "rangebar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.updateSeriesValues = updateRangeSeriesValues;
            break;
        case "fullstackedbar":
            that.fullStacked = true;
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            that.updateSeriesValues = updateStackedSeriesValues;
            break;
        case "stackedbar":
            that.adjustSeriesDimensions = adjustBarSeriesDimensions;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            that.updateSeriesValues = updateStackedSeriesValues;
            break;
        case "fullstackedarea":
        case "fullstackedline":
        case "fullstackedspline":
        case "fullstackedsplinearea":
            that.fullStacked = true;
            that.adjustSeriesValues = adjustStackedSeriesValues;
            break;
        case "stackedarea":
        case "stackedsplinearea":
        case "stackedline":
        case "stackedspline":
            that.adjustSeriesValues = adjustStackedSeriesValues;
            break;
        case "candlestick":
        case "stock":
            that.adjustSeriesDimensions = adjustCandlestickSeriesDimensions;
            break;
        case "bubble":
            that.adjustSeriesDimensions = adjustBubbleSeriesDimensions
    }
}
SeriesFamily.prototype = {
    constructor: SeriesFamily,
    adjustSeriesDimensions: _noop,
    adjustSeriesValues: _noop,
    updateSeriesValues: _noop,
    updateOptions: function(options) {
        this._options = options
    },
    dispose: function() {
        this.series = null
    },
    add: function(series) {
        const type = this.type;
        this.series = _map(series, (singleSeries => singleSeries.type === type ? singleSeries : null))
    }
};

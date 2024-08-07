/**
 * DevExtreme (esm/__internal/scheduler/options_validator/common/validation_functions.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
export const isInteger = value => Number.isInteger(value);
export const greaterThan = function(value, minimalValue) {
    let strict = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
    return strict ? value > minimalValue : value >= minimalValue
};
export const lessThan = function(value, maximalValue) {
    let strict = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
    return strict ? value < maximalValue : value <= maximalValue
};
export const inRange = (value, _ref) => {
    let [from, to] = _ref;
    return value >= from && value <= to
};
export const divisibleBy = (value, divider) => value % divider === 0;

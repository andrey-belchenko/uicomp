/**
 * DevExtreme (renovation/ui/pager/utils/calculate_values_fitted_width.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.calculateValuesFittedWidth = calculateValuesFittedWidth;
exports.oneDigitWidth = void 0;
const oneDigitWidth = exports.oneDigitWidth = 10;

function calculateValuesFittedWidth(minWidth, values) {
    return minWidth + oneDigitWidth * Math.max(...values).toString().length
}

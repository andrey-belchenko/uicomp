/**
 * DevExtreme (cjs/viz/vector_map/vector_map.utils.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
exports.generateDataKey = generateDataKey;
let nextDataKey = 1;

function generateDataKey() {
    return "vectormap-data-" + nextDataKey++
}
/**
 * DevExtreme (cjs/viz/axes/axes_constants.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _utils = require("../core/utils");
var _default = exports.default = {
    logarithmic: "logarithmic",
    discrete: "discrete",
    numeric: "numeric",
    left: "left",
    right: "right",
    top: "top",
    bottom: "bottom",
    center: "center",
    horizontal: "horizontal",
    vertical: "vertical",
    convertTicksToValues: function(ticks) {
        return (0, _utils.map)(ticks || [], (function(item) {
            return item.value
        }))
    },
    validateOverlappingMode: function(mode) {
        return "ignore" === mode || "none" === mode ? mode : "hide"
    },
    getTicksCountInRange: function(ticks, valueKey, range) {
        let i = 1;
        if (ticks.length > 1) {
            for (; i < ticks.length; i++) {
                if (Math.abs(ticks[i].coords[valueKey] - ticks[0].coords[valueKey]) >= range) {
                    break
                }
            }
        }
        return i
    },
    areLabelsOverlap: function(bBox1, bBox2, spacing, alignment) {
        const horizontalInverted = bBox1.x > bBox2.x;
        const verticalInverted = bBox1.y > bBox2.y;
        let x1 = bBox1.x;
        let x2 = bBox2.x;
        const width1 = bBox1.width;
        const width2 = bBox2.width;
        if ("left" === alignment) {
            x1 += width1 / 2;
            x2 += width2 / 2
        } else if ("right" === alignment) {
            x1 -= width1 / 2;
            x2 -= width2 / 2
        }
        const hasHorizontalOverlapping = horizontalInverted ? x2 + width2 + spacing > x1 : x1 + width1 + spacing > x2;
        const hasVerticalOverlapping = verticalInverted ? bBox2.y + bBox2.height > bBox1.y : bBox1.y + bBox1.height > bBox2.y;
        return hasHorizontalOverlapping && hasVerticalOverlapping
    }
};
module.exports = exports.default;
module.exports.default = exports.default;
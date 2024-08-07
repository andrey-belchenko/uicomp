/**
 * DevExtreme (esm/viz/gauges/circular_range_container.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import BaseRangeContainer from "./base_range_container";
const _Number = Number;
const _max = Math.max;
import {
    normalizeEnum as _normalizeEnum
} from "../core/utils";
const CircularRangeContainer = BaseRangeContainer.inherit({
    _processOptions: function() {
        const that = this;
        that._inner = that._outer = 0;
        switch (_normalizeEnum(that._options.orientation)) {
            case "inside":
                that._inner = 1;
                break;
            case "center":
                that._inner = that._outer = .5;
                break;
            default:
                that._outer = 1
        }
    },
    _isVisible: function(layout) {
        let width = this._options.width;
        width = _Number(width) || _max(_Number(width.start), _Number(width.end));
        return layout.radius - this._inner * width > 0
    },
    _createRange: function(range, layout) {
        const width = (range.startWidth + range.endWidth) / 2;
        return this._renderer.arc(layout.x, layout.y, layout.radius - this._inner * width, layout.radius + this._outer * width, this._translator.translate(range.end), this._translator.translate(range.start)).attr({
            "stroke-linejoin": "round"
        })
    },
    measure: function(layout) {
        let width = this._options.width;
        width = _Number(width) || _max(_Number(width.start), _Number(width.end));
        return {
            min: layout.radius - this._inner * width,
            max: layout.radius + this._outer * width
        }
    }
});
export default CircularRangeContainer;

/**
 * DevExtreme (esm/__internal/ui/m_track_bar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import fx from "../../animation/fx";
import registerComponent from "../../core/component_registrator";
import $ from "../../core/renderer";
import {
    extend
} from "../../core/utils/extend";
import {
    hasWindow
} from "../../core/utils/window";
import Editor from "../../ui/editor/editor";
const TRACKBAR_CLASS = "dx-trackbar";
const TRACKBAR_CONTAINER_CLASS = "dx-trackbar-container";
const TRACKBAR_RANGE_CLASS = "dx-trackbar-range";
const TRACKBAR_WRAPPER_CLASS = "dx-trackbar-wrapper";
const TrackBar = Editor.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            min: 0,
            max: 100,
            value: 0
        })
    },
    _initMarkup() {
        this.$element().addClass("dx-trackbar");
        this._renderWrapper();
        this._renderContainer();
        this._renderRange();
        this._renderValue();
        this._setRangeStyles();
        this.callBase()
    },
    _render() {
        this.callBase();
        this._setRangeStyles(this._rangeStylesConfig())
    },
    _renderWrapper() {
        this._$wrapper = $("<div>").addClass("dx-trackbar-wrapper").appendTo(this.$element())
    },
    _renderContainer() {
        this._$bar = $("<div>").addClass("dx-trackbar-container").appendTo(this._$wrapper)
    },
    _renderRange() {
        this._$range = $("<div>").addClass("dx-trackbar-range").appendTo(this._$bar)
    },
    _renderValue() {
        const val = this.option("value");
        const min = this.option("min");
        const max = this.option("max");
        if (min > max) {
            return
        }
        if (val < min) {
            this.option("value", min);
            this._currentRatio = 0;
            return
        }
        if (val > max) {
            this.option("value", max);
            this._currentRatio = 1;
            return
        }
        const ratio = min === max ? 0 : (val - min) / (max - min);
        !this._needPreventAnimation && this._setRangeStyles({
            width: 100 * ratio + "%"
        });
        this.setAria({
            valuemin: this.option("min"),
            valuemax: max,
            valuenow: val
        });
        this._currentRatio = ratio
    },
    _rangeStylesConfig() {
        return {
            width: 100 * this._currentRatio + "%"
        }
    },
    _setRangeStyles(options) {
        fx.stop(this._$range);
        if (!options) {
            this._$range.css({
                width: 0
            });
            return
        }
        if (this._needPreventAnimation || !hasWindow()) {
            return
        }
        fx.animate(this._$range, {
            type: "custom",
            duration: 100,
            to: options
        })
    },
    _optionChanged(args) {
        switch (args.name) {
            case "value":
                this._renderValue();
                this.callBase(args);
                break;
            case "max":
            case "min":
                this._renderValue();
                break;
            default:
                this.callBase(args)
        }
    },
    _dispose() {
        fx.stop(this._$range);
        this.callBase()
    }
});
registerComponent("dxTrackBar", TrackBar);
export default TrackBar;

/**
 * DevExtreme (esm/ui/progress_bar.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../core/renderer";
import TrackBar from "./track_bar";
import {
    extend
} from "../core/utils/extend";
import {
    isFunction
} from "../core/utils/type";
import registerComponent from "../core/component_registrator";
const PROGRESSBAR_CLASS = "dx-progressbar";
const PROGRESSBAR_CONTAINER_CLASS = "dx-progressbar-container";
const PROGRESSBAR_RANGE_CONTAINER_CLASS = "dx-progressbar-range-container";
const PROGRESSBAR_RANGE_CLASS = "dx-progressbar-range";
const PROGRESSBAR_WRAPPER_CLASS = "dx-progressbar-wrapper";
const PROGRESSBAR_STATUS_CLASS = "dx-progressbar-status";
const PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = "dx-progressbar-animating-container";
const PROGRESSBAR_INDETERMINATE_SEGMENT = "dx-progressbar-animating-segment";
const ProgressBar = TrackBar.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            value: 0,
            statusFormat: function(ratio) {
                return "Progress: " + Math.round(100 * ratio) + "%"
            },
            showStatus: true,
            onComplete: null,
            activeStateEnabled: false,
            statusPosition: "bottom left",
            _animatingSegmentCount: 0
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function(device) {
                return "android" === device.platform
            },
            options: {
                _animatingSegmentCount: 2
            }
        }])
    },
    _initMarkup: function() {
        this._renderStatus();
        this._createCompleteAction();
        this.callBase();
        this.$element().addClass("dx-progressbar");
        this._$wrapper.addClass("dx-progressbar-wrapper");
        this._$bar.addClass("dx-progressbar-container");
        this.setAria("role", "progressbar");
        $("<div>").addClass("dx-progressbar-range-container").appendTo(this._$wrapper).append(this._$bar);
        this._$range.addClass("dx-progressbar-range");
        this._toggleStatus(this.option("showStatus"))
    },
    _useTemplates: function() {
        return false
    },
    _createCompleteAction: function() {
        this._completeAction = this._createActionByOption("onComplete")
    },
    _renderStatus: function() {
        this._$status = $("<div>").addClass("dx-progressbar-status")
    },
    _renderIndeterminateState: function() {
        this._$segmentContainer = $("<div>").addClass("dx-progressbar-animating-container");
        const segments = this.option("_animatingSegmentCount");
        for (let i = 0; i < segments; i++) {
            $("<div>").addClass(PROGRESSBAR_INDETERMINATE_SEGMENT).addClass("dx-progressbar-animating-segment-" + (i + 1)).appendTo(this._$segmentContainer)
        }
        this._$segmentContainer.appendTo(this._$wrapper)
    },
    _toggleStatus: function(value) {
        const splitPosition = this.option("statusPosition").split(" ");
        if (value) {
            if ("top" === splitPosition[0] || "left" === splitPosition[0]) {
                this._$status.prependTo(this._$wrapper)
            } else {
                this._$status.appendTo(this._$wrapper)
            }
        } else {
            this._$status.detach()
        }
        this._togglePositionClass()
    },
    _togglePositionClass: function() {
        const position = this.option("statusPosition");
        const splitPosition = position.split(" ");
        this._$wrapper.removeClass("dx-position-top-left dx-position-top-right dx-position-bottom-left dx-position-bottom-right dx-position-left dx-position-right");
        let positionClass = "dx-position-" + splitPosition[0];
        if (splitPosition[1]) {
            positionClass += "-" + splitPosition[1]
        }
        this._$wrapper.addClass(positionClass)
    },
    _toggleIndeterminateState: function(value) {
        if (value) {
            this._renderIndeterminateState();
            this._$bar.toggle(false)
        } else {
            this._$bar.toggle(true);
            this._$segmentContainer.remove();
            delete this._$segmentContainer
        }
    },
    _renderValue: function() {
        const val = this.option("value");
        const max = this.option("max");
        if (!val && 0 !== val) {
            this._toggleIndeterminateState(true);
            return
        }
        if (this._$segmentContainer) {
            this._toggleIndeterminateState(false)
        }
        if (val === max) {
            this._completeAction()
        }
        this.callBase();
        this._setStatus()
    },
    _setStatus: function() {
        let format = this.option("statusFormat");
        if (isFunction(format)) {
            format = format.bind(this)
        } else {
            format = function(value) {
                return value
            }
        }
        const statusText = format(this._currentRatio, this.option("value"));
        this._$status.text(statusText)
    },
    _dispose: function() {
        this._$status.remove();
        this.callBase()
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "statusFormat":
                this._setStatus();
                break;
            case "showStatus":
                this._toggleStatus(args.value);
                break;
            case "statusPosition":
                this._toggleStatus(this.option("showStatus"));
                break;
            case "onComplete":
                this._createCompleteAction();
                break;
            case "_animatingSegmentCount":
                break;
            default:
                this.callBase(args)
        }
    }
});
registerComponent("dxProgressBar", ProgressBar);
export default ProgressBar;

/**
 * DevExtreme (cjs/__internal/scheduler/r1/components/base/all_day_panel_title.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AllDayPanelTitle = void 0;
var _inferno = require("inferno");
var _inferno2 = require("@dpt-ui/runtime/inferno");
var _message = _interopRequireDefault(require("../../../../../localization/message"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
class AllDayPanelTitle extends _inferno2.InfernoWrapperComponent {
    createEffects() {
        return [(0, _inferno2.createReRenderEffect)()]
    }
    render() {
        const text = _message.default.format("dxScheduler-allDay");
        return (0, _inferno.createVNode)(1, "div", "dx-scheduler-all-day-title", text, 0)
    }
}
exports.AllDayPanelTitle = AllDayPanelTitle;
AllDayPanelTitle.defaultProps = {};

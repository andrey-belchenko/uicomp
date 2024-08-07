/**
 * DevExtreme (esm/__internal/scheduler/r1/components/base/all_day_panel_title.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    createVNode
} from "inferno";
import {
    createReRenderEffect,
    InfernoWrapperComponent
} from "@dpt-ui/runtime/inferno";
import messageLocalization from "../../../../../localization/message";
export class AllDayPanelTitle extends InfernoWrapperComponent {
    createEffects() {
        return [createReRenderEffect()]
    }
    render() {
        const text = messageLocalization.format("dxScheduler-allDay");
        return createVNode(1, "div", "dx-scheduler-all-day-title", text, 0)
    }
}
AllDayPanelTitle.defaultProps = {};

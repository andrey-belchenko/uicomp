/**
 * DevExtreme (esm/__internal/scheduler/tooltip_strategies/m_desktop_tooltip_strategy.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import {
    touch
} from "../../../core/utils/support";
import Tooltip from "../../ui/m_tooltip";
import {
    TooltipStrategyBase
} from "./m_tooltip_strategy_base";
const APPOINTMENT_TOOLTIP_WRAPPER_CLASS = "dx-scheduler-appointment-tooltip-wrapper";
const MAX_TOOLTIP_HEIGHT = 200;
export class DesktopTooltipStrategy extends TooltipStrategyBase {
    _prepareBeforeVisibleChanged(dataList) {
        this._tooltip.option("position", {
            my: "bottom",
            at: "top",
            boundary: this._getBoundary(dataList),
            offset: this._extraOptions.offset,
            collision: "fit flipfit"
        })
    }
    _getBoundary(dataList) {
        return this._options.isAppointmentInAllDayPanel(dataList[0].appointment) ? this._options.container : this._options.getScrollableContainer()
    }
    _onShown() {
        super._onShown();
        if (this._extraOptions.isButtonClick) {
            this._list.focus();
            this._list.option("focusedElement", null)
        }
    }
    _createListOption(target, dataList) {
        const result = super._createListOption(target, dataList);
        result.showScrollbar = touch ? "always" : "onHover";
        return result
    }
    _createTooltip(target, dataList) {
        const tooltip = this._createTooltipElement(APPOINTMENT_TOOLTIP_WRAPPER_CLASS);
        return this._options.createComponent(tooltip, Tooltip, {
            target: target,
            maxHeight: 200,
            rtlEnabled: this._extraOptions.rtlEnabled,
            onShown: this._onShown.bind(this),
            contentTemplate: this._getContentTemplate(dataList),
            wrapperAttr: {
                class: APPOINTMENT_TOOLTIP_WRAPPER_CLASS
            }
        })
    }
    _onListRender(e) {
        return this._extraOptions.dragBehavior && this._extraOptions.dragBehavior(e)
    }
    _onListItemContextMenu(e) {
        const contextMenuEventArgs = this._options.createEventArgs(e);
        this._options.onItemContextMenu(contextMenuEventArgs)
    }
}
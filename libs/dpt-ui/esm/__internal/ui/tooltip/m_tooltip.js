/**
 * DevExtreme (esm/__internal/ui/tooltip/m_tooltip.js)
 * Version: 24.1.3
 * Build date: Tue Jun 11 2024
 *
 * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.dpt-ext-ui.com/Licensing/
 */
import $ from "../../../core/renderer";
import {
    Deferred
} from "../../../core/utils/deferred";
import {
    extend
} from "../../../core/utils/extend";
import {
    value as viewPort
} from "../../../core/utils/view_port";
import Tooltip from "../../../ui/tooltip";
let tooltip = null;
let removeTooltipElement = null;
const createTooltip = function(options) {
    options = extend({
        position: "top"
    }, options);
    const {
        content: content
    } = options;
    delete options.content;
    const $tooltip = $("<div>").html(content).appendTo(viewPort());
    removeTooltipElement = function() {
        $tooltip.remove()
    };
    tooltip = new Tooltip($tooltip, options)
};
const removeTooltip = function() {
    if (!tooltip) {
        return
    }
    removeTooltipElement();
    tooltip = null
};
export function show(options) {
    removeTooltip();
    createTooltip(options);
    return tooltip.show()
}
export function hide() {
    if (!tooltip) {
        return Deferred().resolve()
    }
    return tooltip.hide().done(removeTooltip).promise()
}
